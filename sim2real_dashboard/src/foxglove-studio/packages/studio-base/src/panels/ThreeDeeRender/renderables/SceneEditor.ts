// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { SettingsTreeAction, SettingsTreeChildren, SettingsTreeFields } from "@foxglove/studio";

import type { IRenderer } from "../IRenderer";
import { SceneExtension } from "../SceneExtension";
import { SettingsTreeEntry } from "../SettingsManager";
import { BaseUserData, Renderable } from "../Renderable";
import { BaseSettings, CustomLayerSettings } from "../settings";
import Logger from "@foxglove/log";
import { UrdfGeometry, UrdfVisual } from "@foxglove/den/urdf/types";
import { v4 as uuidv4 } from "uuid";
import { Pose, makePose, xyzrpyToPose } from "../transforms";

import {
  ColorRGBA,
  Marker,
  MarkerAction,
  MarkerType,
  Vector3,
} from "../ros";

import { Euler, eulerToQuaternion, quaternionToEuler } from "@foxglove/studio-base/util/geometry";
import { RenderableCube } from "./markers/RenderableCube";
import { RenderableCylinder } from "./markers/RenderableCylinder";
import { RenderableSphere } from "./markers/RenderableSphere";
import { updatePose } from "../updatePose";
import { LayerSettingsCustomUrdf, Urdfs } from "./Urdfs";
import {
  PRECISION_DISTANCE,
  PRECISION_DEGREES,
} from "../settings";
import { Path } from "../LayerErrors";
import { vec3 } from "gl-matrix";
import { DEG2RAD } from "three/src/math/MathUtils";
import { rgbaToCssString, stringToRgba } from "../color";

const log = Logger.getLogger(__filename);

const URDF_SAVE_API_ENDPOINT = "/api/sim2real/urdf/save";

const LAYER_ID = "foxglove.SceneEditor";
const XYZ_LABEL: [string, string, string] = ["X", "Y", "Z"];
const RPY_LABEL: [string, string, string] = ["R", "P", "Y"];
const POSITION_STEP = 0.01;

export type LayerSettingsScene = BaseSettings & {
  instanceId: string;
  shape: "box" | "sphere" | "cylinder";
  shapeLabel: string;
  selectedUrdfFileName: string;
};

export type LayerSettingsCustomScene = CustomLayerSettings & {
  layerId: "foxglove.SceneEditor";
  shape: "box" | "sphere" | "cylinder";
  shapeLabel: string;
  selectedUrdfFileName: "";
};

const DEFAULT_CUSTOM_SETTINGS: LayerSettingsCustomScene = {
  visible: true,
  frameLocked: true,
  instanceId: "invalid",
  layerId: LAYER_ID,
  label: "Scene Editor",
  shape: "box",
  shapeLabel: "",
  selectedUrdfFileName: "",
};

export type SceneEditorUserData = BaseUserData & {
  settings: LayerSettingsScene | LayerSettingsCustomScene;
  renderables: Map<string, Renderable>;
};

export class SceneRenderable extends Renderable<SceneEditorUserData> {
  public override dispose(): void {
    this.removeChildren();
    super.dispose();
  }

  public removeChildren(): void {
    for (const childRenderable of this.userData.renderables.values()) {
      childRenderable.dispose();
    }
    this.children.length = 0;
    this.userData.renderables.clear();
  }
}


export class SceneEditor extends SceneExtension<SceneRenderable> {

  public constructor(renderer: IRenderer) {
    super("foxglove.SceneEditor", renderer);
    this.userData.overwriteDialogOpen = false;
    this.userData.savedDialogOpen = false;
  }

  public override dispose(): void {

    super.dispose();
  }
  public override startFrame(
    currentTime: bigint,
    renderFrameId: string,
    fixedFrameId: string,
  ): void {
    for (const renderable of this.renderables.values()) {
      const path = renderable.userData.settingsPath;

      renderable.visible = renderable.userData.settings.visible;
      if (!renderable.visible) {
        this.renderer.settings.errors.clearPath(path);
        continue;
      }

      // UrdfRenderables always stay at the origin. Their children renderables
      // are individually updated since each child exists in a different frame
      for (const childRenderable of renderable.userData.renderables.values()) {
        const srcTime = currentTime;
        const frameId = renderable.userData.frameId;
        updatePose(
          childRenderable,
          this.renderer.transformTree,
          renderFrameId,
          fixedFrameId,
          frameId,
          currentTime,
          srcTime,
        );
      }
    }
  }

  public override settingsNodes(): SettingsTreeEntry[] {
    const children: SettingsTreeChildren = {};
    const handler = this.handleSettingsAction;
    const frames: Array<{ label: string; value: undefined | string }> = [...this.renderer.transformTree.frames()].map(([frameId, _]) => { return { label: frameId, value: frameId } });
    for (const renderable of this.renderables.values()) {
      const settings = renderable.userData.settings;
      const { instanceId } = settings;
      const label = settings.shapeLabel;
      const childRenderable = renderable.userData.renderables.values().next().value;

      const position: [number, number, number] = [childRenderable.userData.pose.position.x, childRenderable.userData.pose.position.y, childRenderable.userData.pose.position.z];
      const orientation: Euler = quaternionToEuler(childRenderable.userData.pose.orientation);
      const color = rgbaToCssString(childRenderable.userData.marker.color);
      
      let customFields: SettingsTreeFields;
      switch (settings.shape) {
        case "box":
          customFields = {
            frameId: {
              label: "Parent Frame",
              input: "select",
              value: renderable.userData.frameId,
              options: frames,
            },
            "pose.position": {
              label: "Position",
              input: "vec3",
              labels: XYZ_LABEL,
              precision: PRECISION_DISTANCE,
              step: POSITION_STEP,
              value: position,
            },
            "pose.orientation": {
              label: "Orientation",
              input: "vec3",
              labels: RPY_LABEL,
              precision: PRECISION_DEGREES,
              value: [orientation.roll, orientation.pitch, orientation.yaw],
            },
            scale: {
              label: "Scale",
              input: "vec3",
              labels: XYZ_LABEL,
              precision: PRECISION_DISTANCE,
              step: 0.001,
              min: 0,
              value: [childRenderable.scale.x, childRenderable.scale.y, childRenderable.scale.z]
            },
            color: {
              label: "Color",
              input: "rgba",
              value: color,
            },
          };
          break;
        case "sphere":
          customFields = {
            frameId: {
              label: "Parent Frame",
              input: "select",
              value: renderable.userData.frameId,
              options: frames,
            },
            "pose.position": {
              label: "Position",
              input: "vec3",
              labels: XYZ_LABEL,
              precision: PRECISION_DISTANCE,
              step: POSITION_STEP,
              value: position,
            },
            "pose.orientation": {
              label: "Orientation",
              input: "vec3",
              labels: RPY_LABEL,
              precision: PRECISION_DEGREES,
              value: [orientation.roll, orientation.pitch, orientation.yaw],
            },
            radius: {
              label: "Radius",
              input: "number",
              step: 0.001,
              min: 0,
              precision: PRECISION_DISTANCE,
              value: childRenderable.scale.x,
            },
            color: {
              label: "Color",
              input: "rgba",
              value: color,
            },
          };
          break;
        case "cylinder":
          customFields = {
            frameId: {
              label: "Parent Frame",
              input: "select",
              value: renderable.userData.frameId,
              options: frames,
            },
            "pose.position": {
              label: "Position",
              input: "vec3",
              labels: XYZ_LABEL,
              precision: PRECISION_DISTANCE,
              step: POSITION_STEP,
              value: position,
            },
            "pose.orientation": {
              label: "Orientation",
              input: "vec3",
              labels: RPY_LABEL,
              precision: PRECISION_DEGREES,
              value: [orientation.roll, orientation.pitch, orientation.yaw],
            },
            radius: {
              label: "Radius",
              input: "number",
              step: 0.001,
              min: 0,
              precision: PRECISION_DISTANCE,
              value: childRenderable.scale.x,
            },
            length: {
              label: "Length",
              input: "number",
              step: 0.001,
              min: 0,
              precision: PRECISION_DISTANCE,
              value: childRenderable.scale.z,
            },
            color: {
              label: "Color",
              input: "rgba",
              value: color,
            },
          };
          break;
        default:
          customFields = {};
          break;
      };

      children[instanceId] = {
        label,
        actions: [
          { id: "remove", type: "action", label: "Remove" },
        ],
        fields: customFields,
        defaultExpansionState: "collapsed",
      };
    }

    const urdfList = this.#getUrdfList();

    const fields: SettingsTreeFields = {
      urdfFileName: {
        input: "autocomplete",
        label: "URDF File Name",
        value: "",
        items: urdfList,
      },
      saveButton: {
        input: "button",
        label: "",
        value: "Save",
        handler: this.saveUrdfFile,
      },
      savedDialog: {
        input: "dialog",
        label: "",
        title: "Success",
        message: "Saved URDF file successfully. Please refresh the page to load objects from the new URDF file.",
        isOpen: this.userData.savedDialogOpen,
        dialogActions: [
          {
            label: "Cancel",
            color: "primary",
            variant: "outlined",
            handler: () => {
              this.userData.savedDialogOpen = false;
              this.updateSettingsTree();
            },
          },
          {
            label: "Reload",
            color: "success",
            variant: "contained",
            handler: () => {
              window.location.reload();
            },
          },
        ],
      },
      overwriteDialog: {
        input: "dialog",
        label: "",
        title: "Warning",
        message: "There are no objects in the scene. Do you want to overwrite the URDF file and delete all objects in it?",
        isOpen: this.userData.overwriteDialogOpen,
        dialogActions: [
          {
            label: "Cancel",
            color: "primary",
            variant: "outlined",
            handler: () => {
              this.userData.overwriteDialogOpen = false;
              this.updateSettingsTree();
            },
          },
          {
            label: "Overwrite",
            color: "error",
            variant: "contained",
            handler: () => {
              this.saveUrdfFile();
              this.userData.overwriteDialogOpen = false;
              this.updateSettingsTree();
            },
          },
        ],
      },
    };

    return [
      {
        path: ["scene_editor"],
        node: {
          label: "Scene Editor",
          actions:
            [
              { id: "add-box", type: "action", label: "Add Cube", icon: "Cube" },
              { id: "add-sphere", type: "action", label: "Add Sphere", icon: "Circle" },
              { id: "add-cylinder", type: "action", label: "Add Cylinder", icon: "Cylinder" },
            ],
          fields,
          children,
          defaultExpansionState: "collapsed",
          handler,
        },
      },
    ];
  }

  public saveUrdfFile = (): void => {
    let fileName = this.userData.selectedUrdfFileName;
    if (!fileName) {
      return;
    }
    if (this.renderables.size === 0 && !this.userData.overwriteDialogOpen) {
      this.userData.overwriteDialogOpen = true;
      this.updateSettingsTree();
      return;
    }
    let objects = [];
    for (const renderable of this.renderables.values()) {
      const settings = renderable.userData.settings;
      const childRenderable = renderable.userData.renderables.values().next().value;

      const pose = childRenderable.userData.pose;
      const orientation = quaternionToEuler(pose.orientation);
      const position = pose.position;
      const frameId = renderable.userData.frameId;
      const color = childRenderable.userData.marker.color;

      let scale;
      if (settings.shape === "box") {
        scale = childRenderable.scale;
      } else if (settings.shape === "sphere") {
        scale = { radius: childRenderable.scale.x / 2 };
      } else if (settings.shape === "cylinder") {
        scale = { radius: childRenderable.scale.x / 2, length: childRenderable.scale.z };
      }

      objects.push({
        frameId,
        shape: settings.shape,
        position: { x: position.x, y: position.y, z: position.z },
        orientation: { roll: orientation.roll * DEG2RAD, pitch: orientation.pitch * DEG2RAD, yaw: orientation.yaw * DEG2RAD },
        scale: scale,
        colorRGBA: color,
      });

    }

    const data = JSON.stringify(objects, null, 2);

    const illegalRe = /[\/\?<>\\:\*\|"]/g;
    const controlRe = /[\x00-\x1f\x80-\x9f]/g;
    const reservedRe = /^\.+$/;
    const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
    const windowsTrailingRe = /[\. ]+$/;

    fileName = fileName.replace(illegalRe, "").replace(controlRe, "").replace(reservedRe, "").replace(windowsReservedRe, "").replace(windowsTrailingRe, "");
    // post to server with fetch
    fetch(URDF_SAVE_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "filename": fileName,
      },
      body: data,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to save URDF file: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((json) => {
        if (json.error) {
          throw new Error(`Failed to save URDF file: ${json.error}`);
        }
        log.info(`Saved URDF file: ${fileName}`);
        this.userData.savedDialogOpen = true;
        this.updateSettingsTree();
      })
      .catch((error) => {
        log.error(error);
      });
  }

  public override saveSetting(path: Path, value: unknown): void {
    // Update the configuration
    const instanceId = path[1]!;
    const renderable = this.renderables.get(instanceId);
    const settingKey = path[2]!;
    // get first child renderable
    const childRenderable = renderable?.userData.renderables.values().next().value;
    if (!renderable || !childRenderable) {
      return;
    }
    const shape = renderable.userData.settings.shape;

    if (settingKey === "color") {
      debugger;
      childRenderable.userData.marker.color = stringToRgba(childRenderable.userData.marker.color, value as string);
      childRenderable.update(childRenderable.userData.marker, childRenderable.userData.receiveTime);
    }

    if (["scale", "radius", "length"].includes(settingKey)) {
      if (shape === "box" && Array.isArray(value)) {
        const scale = {
          x: value[0],
          y: value[1],
          z: value[2],
        } as Vector3;
        debugger;
        childRenderable.userData.marker.scale = scale;
        childRenderable.update(childRenderable.userData.marker, childRenderable.userData.receiveTime);
      }
      else if (shape === "sphere") {
        const radius = value as number;
        childRenderable.userData.marker.scale = { x: radius, y: radius, z: radius };
        childRenderable.update(childRenderable.userData.marker, childRenderable.userData.receiveTime);
      }
      else if (shape === "cylinder") {
        if (settingKey === "radius") {
          const radius = value as number;
          childRenderable.userData.marker.scale = { x: radius, y: radius, z: childRenderable.userData.marker.scale.z };
          childRenderable.update(childRenderable.userData.marker, childRenderable.userData.receiveTime);
        } else {
          const length = value as number;
          childRenderable.userData.marker.scale = { x: childRenderable.userData.marker.scale.x, y: childRenderable.userData.marker.scale.y, z: length };
          childRenderable.update(childRenderable.userData.marker, childRenderable.userData.receiveTime);
        }
      }
    }

    if (settingKey.includes("pose.")) {
      if (!childRenderable.userData.pose) {
        childRenderable.userData.pose = makePose();
      }
      if (settingKey === "pose.position" && Array.isArray(value)) {
        childRenderable.userData.pose.position = xyzrpyToPose(value as vec3, [0, 0, 0]).position;
      } else if (settingKey === "pose.orientation" && Array.isArray(value)) {
        childRenderable.userData.pose.orientation = xyzrpyToPose([0, 0, 0], value as vec3).orientation;
      }
    } else {
      renderable.userData = {
        ...renderable.userData,
        [settingKey]: value
      };
    }

    // Update the settings sidebar
    this.updateSettingsTree();
  }

  #getUrdfList(): string[] {
    const urdfs = this.renderer.sceneExtensions.get(
      "foxglove.Urdfs",
    ) as Urdfs | undefined;
    if (!urdfs) {
      return [];
    }
    const urdfList = [];
    for (const urdf of urdfs.renderables.values()) {
      const fileName = (urdf.userData?.settings as LayerSettingsCustomUrdf)?.url?.split("/").pop();
      if (!fileName) {
        continue;
      }
      urdfList.push(fileName);
    }
    return urdfList;
  }

  public override handleSettingsAction = (action: SettingsTreeAction): void => {
    const path = action.payload.path;
    if (action.action === "perform-node-action") {
      if (action.payload.id.startsWith("add-")) {
        this.#handleAddShape(action.payload.id);
      }

      if (path.length === 2 && action.payload.id === "remove") {
        const instanceId = path[1]!;

        const renderable = this.renderables.get(instanceId);
        if (!renderable) {
          return;
        }

        renderable.userData.renderables.forEach((childRenderable) => {
          childRenderable.dispose();
        });
        this.remove(renderable);
        this.renderables.delete(instanceId);

        // Update the settings tree
        this.updateSettingsTree();
        this.renderer.updateCustomLayersCount();
      }

      return;
    }

    if (action.action !== "update" || action.payload.path.length === 0) {
      return;
    }
    if (action.payload.input) {
      this.handleUserInput(action, action.payload.input);
    }

    this.saveSetting(path, action.payload.value);
    // Update the settings sidebar
    this.updateSettingsTree();
  };

  handleUserInput = (action: SettingsTreeAction, input: string): void => {
    if (action.action !== "update" || action.payload.path.length === 0) {
      return;
    }
    if (input === "autocomplete" && action.payload.path[1] === "urdfFileName") {
      this.userData.selectedUrdfFileName = action.payload.value as string;
    }
  }

  #getCurrentSettings(instanceId: string) {
    const baseSettings = DEFAULT_CUSTOM_SETTINGS;
    const userSettings = this.renderer.config.layers[instanceId];
    const settings = { ...baseSettings, ...userSettings, instanceId };
    return settings;
  }

  #handleAddShape(selectedShape: string): void {
    // create instance id
    const instanceId = uuidv4();
    const renderer = this.renderer;
    // create renderable
    log.info(`Creating ${LAYER_ID} layer ${instanceId}`);
    let renderable = this.renderables.get(instanceId);
    const settingsPath = ["layers", instanceId];

    const frames = this.renderer.transformTree.frames();
    let frame = this.renderer.fixedFrameId || "";
    for (const [fr, _] of frames) {
      if (fr === "base" || fr === "map") {
        frame = fr;
        break;
      }
    }

    const frameId = frame || this.renderer.fixedFrameId || "";

    selectedShape = selectedShape.replace("add-", "");
    let numberOfSelectedShape = 1;
    for (let renderable of this.renderables.values()) {
      if (renderable.userData.settings.shape === selectedShape) {
        numberOfSelectedShape++;
      }
    }

    if (!renderable) {
      renderable = new SceneRenderable(instanceId, this.renderer, {
        renderables: new Map(),
        receiveTime: 0n,
        messageTime: 0n,
        frameId,
        pose: makePose(),
        settingsPath,
        settings: this.#getCurrentSettings(instanceId),
      });
      this.add(renderable);
      this.renderables.set(instanceId, renderable);
    }

    let shape: UrdfGeometry;
    let coor = { x: 0, y: 0, z: 0 };
    if (selectedShape === "box") {
      coor = { x: 0, y: 0, z: 0 };
      shape = { geometryType: "box", size: { x: 0.3, y: 0.3, z: 0.3 } };
    } else if (selectedShape === "sphere") {
      coor = { x: 0, y: 1, z: 0 };
      shape = { geometryType: "sphere", radius: 0.3 };
    } else if (selectedShape === "cylinder") {
      coor = { x: 1, y: 1, z: 0 };
      shape = { geometryType: "cylinder", radius: 0.3, length: 0.3 };
    } else {
      shape = { geometryType: "box", size: { x: 0.3, y: 0.3, z: 0.3 } };
    }

    const createChild = (frameId: string, i: number, visual: UrdfVisual, shapeLabel: string): void => {
      const childRenderable = createRenderable(visual, i, frameId, renderer);
      // Set the childRenderable settingsPath so errors route to the correct place
      if (renderable) {
        childRenderable.userData.settingsPath = renderable.userData.settingsPath;
        renderable.userData.renderables.set(childRenderable.name, childRenderable);
        renderable.userData.settings = {
          ...renderable.userData.settings,
          shape: selectedShape as "box" | "sphere" | "cylinder",
          shapeLabel: shapeLabel,
        }
        renderable.add(childRenderable);
      } else {
        log.error("renderable is null");
      }
    };

    createChild(frame, 0, {
      origin: { xyz: coor, rpy: { x: 0, y: 0, z: 0 } },
      geometry: shape,
    }, selectedShape.charAt(0).toUpperCase() + selectedShape.slice(1) + "-" + numberOfSelectedShape);

    this.updateSettingsTree();
  }
}


function createRenderable(
  visual: UrdfVisual,
  id: number,
  frameId: string,
  renderer: IRenderer,
): Renderable {
  const name = `${frameId}-${id}-${visual.geometry.geometryType}`;
  const orientation = eulerToQuaternion(visual.origin.rpy);
  const pose = { position: visual.origin.xyz, orientation };
  const color = visual.material?.color ?? { r: 0.14, g: 0.56, b: 1.0, a: 1.0 };
  const type = visual.geometry.geometryType;
  switch (type) {
    case "box": {
      const scale = visual.geometry.size;
      log.info(`Creating box ${name} at ${JSON.stringify(pose)}`);
      const marker = createMarker(frameId, MarkerType.CUBE, pose, scale, color);
      return new RenderableCube(name, marker, undefined, renderer);
    }
    case "cylinder": {
      const cylinder = visual.geometry;
      const scale = { x: cylinder.radius * 2, y: cylinder.radius * 2, z: cylinder.length };
      const marker = createMarker(frameId, MarkerType.CUBE, pose, scale, color);
      return new RenderableCylinder(name, marker, undefined, renderer);
    }
    case "sphere": {
      const sphere = visual.geometry;
      const scale = { x: sphere.radius * 2, y: sphere.radius * 2, z: sphere.radius * 2 };
      const marker = createMarker(frameId, MarkerType.CUBE, pose, scale, color);
      return new RenderableSphere(name, marker, undefined, renderer);
    }
    default:
      throw new Error(`Unrecognized visual geometryType: ${type}`);
  }
}

function createMarker(
  frameId: string,
  type: MarkerType,
  pose: Pose,
  scale: Vector3,
  color: ColorRGBA,
): Marker {
  return {
    header: { frame_id: frameId, stamp: { sec: 0, nsec: 0 } },
    ns: "",
    id: 0,
    type,
    action: MarkerAction.ADD,
    pose,
    scale,
    color,
    lifetime: { sec: 0, nsec: 0 },
    frame_locked: true,
    points: [],
    colors: [],
    text: "",
    mesh_resource: "",
    mesh_use_embedded_materials: false,
  };
}