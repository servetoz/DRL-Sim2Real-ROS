// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { Circle12Filled, Ruler24Filled } from "@fluentui/react-icons";
import {
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  useTheme,
  Tooltip,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLongPress } from "react-use";
import { makeStyles } from "tss-react/mui";
import { keyframes } from "tss-react";

import Logger from "@foxglove/log";
import { LayoutActions } from "@foxglove/studio";
import {
  PanelContextMenu,
  PanelContextMenuItem,
} from "@foxglove/studio-base/components/PanelContextMenu";
import PublishGoalIcon from "@foxglove/studio-base/components/PublishGoalIcon";
import PublishPointIcon from "@foxglove/studio-base/components/PublishPointIcon";
import PublishPoseEstimateIcon from "@foxglove/studio-base/components/PublishPoseEstimateIcon";
import { useAnalytics } from "@foxglove/studio-base/context/AnalyticsContext";
import { usePanelMousePresence } from "@foxglove/studio-base/hooks/usePanelMousePresence";
import { AppEvent } from "@foxglove/studio-base/services/IAnalytics";
import { downloadFiles } from "@foxglove/studio-base/util/download";
import { fonts } from "@foxglove/studio-base/util/sharedStyleConstants";

import { InteractionContextMenu, Interactions, SelectionObject, TabType } from "./Interactions";
import type { PickedRenderable } from "./Picker";
import { Renderable } from "./Renderable";
import { useRenderer, useRendererEvent } from "./RendererContext";
import { Stats } from "./Stats";
import { MouseEventObject } from "./camera";
import { decodeCompressedImageToBitmap, decodeRawImage } from "./renderables/Images/decodeImage";
import { PublishClickType } from "./renderables/PublishClickTool";
import { InterfaceMode } from "./types";

import recorder from './CanvasRecorder'


declare global {
  interface Window {
    _canvasRecordingStarted: number;
  }
}

const log = Logger.getLogger(__filename);

const PublishClickIcons: Record<PublishClickType, React.ReactNode> = {
  pose: <PublishGoalIcon fontSize="inherit" />,
  point: <PublishPointIcon fontSize="inherit" />,
  pose_estimate: <PublishPoseEstimateIcon fontSize="inherit" />,
};

const fadeBlinkAnimation = keyframes`
60%, 100% {
  opacity: 0;
}
0% {
  opacity: 0;
}
40% {
  opacity: 1;
}
`;

const useStyles = makeStyles()((theme) => ({
  iconButton: {
    position: "relative",
    fontSize: "1rem !important",
    pointerEvents: "auto",
    aspectRatio: "1",

    "& svg:not(.MuiSvgIcon-root)": {
      fontSize: "1rem !important",
    },
  },
  rulerIcon: {
    transform: "rotate(45deg)",
  },
  recordButton: {
    position: "relative",
    fontSize: "1rem !important",
    pointerEvents: "auto",
    aspectRatio: "1",
    "& svg:not(.MuiSvgIcon-root)": {
      fontSize: "1rem !important",
      "&.recording": {
        animation: `${fadeBlinkAnimation} 1s ease-in-out infinite`,
      },
    },
  },
  threeDeeButton: {
    fontFamily: fonts.MONOSPACE,
    fontFeatureSettings: theme.typography.caption.fontFeatureSettings,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    lineHeight: "1em",
  },
  resetViewButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));


function durationToTime(duration: number): string {
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  // return with 0 padding
  return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}

/**
 * Provides DOM overlay elements on top of the 3D scene (e.g. stats, debug GUI).
 */
export function RendererOverlay(props: {
  interfaceMode: InterfaceMode;
  canvas: HTMLCanvasElement | ReactNull;
  addPanel: LayoutActions["addPanel"];
  enableStats: boolean;
  perspective: boolean;
  onTogglePerspective: () => void;
  measureActive: boolean;
  onClickMeasure: () => void;
  canPublish: boolean;
  publishActive: boolean;
  publishClickType: PublishClickType;
  onChangePublishClickType: (_: PublishClickType) => void;
  onClickPublish: () => void;
  timezone: string | undefined;
  /** Override default downloading behavior, used for Storybook */
  onDownloadImage?: (blob: Blob, fileName: string) => void;
}): JSX.Element {

  const analytics = useAnalytics();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation("threeDee");
  const { classes } = useStyles();
  const [clickedPosition, setClickedPosition] = useState<{ clientX: number; clientY: number }>({
    clientX: 0,
    clientY: 0,
  });
  const [selectedRenderables, setSelectedRenderables] = useState<PickedRenderable[]>([]);
  const [selectedRenderable, setSelectedRenderable] = useState<PickedRenderable | undefined>(
    undefined,
  );
  const [interactionsTabType, setInteractionsTabType] = useState<TabType | undefined>(undefined);
  const renderer = useRenderer();

  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);

  // Toggle object selection mode on/off in the renderer
  useEffect(() => {
    if (renderer) {
      renderer.setPickingEnabled(interactionsTabType != undefined);
    }
  }, [interactionsTabType, renderer]);

  useRendererEvent("renderablesClicked", (selections, cursorCoords) => {
    const rect = props.canvas!.getBoundingClientRect();
    setClickedPosition({ clientX: rect.left + cursorCoords.x, clientY: rect.top + cursorCoords.y });
    setSelectedRenderables(selections);
    setSelectedRenderable(selections.length === 1 ? selections[0] : undefined);
  });

  const [showResetViewButton, setShowResetViewButton] = useState(renderer?.canResetView() ?? false);
  useRendererEvent(
    "resetViewChanged",
    useCallback(() => {
      setShowResetViewButton(renderer?.canResetView() ?? false);
    }, [renderer]),
  );
  const onResetView = useCallback(() => {
    renderer?.resetView();
  }, [renderer]);

  const startRecording = useCallback(() => {
    if (!props.canvas) {
      return;
    }
    recorder.start(props.canvas);
    setRecording(true);
    window._canvasRecordingStarted = Date.now();
  }, [props.canvas]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRecordingTime(Date.now() - window._canvasRecordingStarted);
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  const stopRecording = useCallback(() => {
    recorder.stop();
    setRecording(false);
  }, []);

  const stats = props.enableStats ? (
    <div id="stats" style={{ position: "absolute", top: "10px", left: "10px" }}>
      <Stats />
    </div>
  ) : undefined;

  // Convert the list of selected renderables (if any) into MouseEventObjects
  // that can be passed to <InteractionContextMenu>, which shows a context menu
  // of candidate objects to select
  const clickedObjects = useMemo<MouseEventObject[]>(
    () =>
      selectedRenderables.map((selection) => ({
        object: {
          pose: selection.renderable.pose,
          scale: selection.renderable.scale,
          color: undefined,
          interactionData: {
            topic: selection.renderable.name,
            highlighted: undefined,
            renderable: selection.renderable,
          },
        },
        instanceIndex: selection.instanceIndex,
      })),
    [selectedRenderables],
  );

  // Once a single renderable is selected, convert it to the SelectionObject
  // format to populate the object inspection dialog (<Interactions>)
  const selectedObject = useMemo<SelectionObject | undefined>(
    () =>
      selectedRenderable
        ? {
          object: {
            pose: selectedRenderable.renderable.pose,
            interactionData: {
              topic: selectedRenderable.renderable.topic,
              highlighted: true,
              originalMessage: selectedRenderable.renderable.details(),
              instanceDetails:
                selectedRenderable.instanceIndex != undefined
                  ? selectedRenderable.renderable.instanceDetails(
                    selectedRenderable.instanceIndex,
                  )
                  : undefined,
            },
          },
          instanceIndex: selectedRenderable.instanceIndex,
        }
        : undefined,
    [selectedRenderable],
  );

  // Inform the Renderer when a renderable is selected
  useEffect(() => {
    renderer?.setSelectedRenderable(selectedRenderable);
  }, [renderer, selectedRenderable]);

  const publickClickButtonRef = useRef<HTMLButtonElement>(ReactNull);
  const [publishMenuExpanded, setPublishMenuExpanded] = useState(false);
  const selectedPublishClickIcon = PublishClickIcons[props.publishClickType];

  const onLongPressPublish = useCallback(() => {
    setPublishMenuExpanded(true);
  }, []);
  const longPressPublishEvent = useLongPress(onLongPressPublish);

  const theme = useTheme();

  // Publish control is only available if the canPublish prop is true and we have a fixed frame in the renderer
  const showPublishControl =
    props.interfaceMode === "3d" && props.canPublish && renderer?.fixedFrameId != undefined;
  const publishControls = showPublishControl && (
    <>
      <IconButton
        {...longPressPublishEvent}
        color={props.publishActive ? "info" : "inherit"}
        title={props.publishActive ? "Click to cancel" : "Click to publish"}
        ref={publickClickButtonRef}
        onClick={props.onClickPublish}
        data-testid="publish-button"
        style={{ fontSize: "1rem", pointerEvents: "auto" }}
      >
        {selectedPublishClickIcon}
        <div
          style={{
            borderBottom: "6px solid currentColor",
            borderRight: "6px solid transparent",
            bottom: 0,
            left: 0,
            height: 0,
            width: 0,
            margin: theme.spacing(0.25),
            position: "absolute",
          }}
        />
      </IconButton>
      <Menu
        id="publish-menu"
        anchorEl={publickClickButtonRef.current}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={publishMenuExpanded}
        onClose={() => setPublishMenuExpanded(false)}
        MenuListProps={{ dense: true }}
      >
        <MenuItem
          selected={props.publishClickType === "pose_estimate"}
          onClick={() => {
            props.onChangePublishClickType("pose_estimate");
            setPublishMenuExpanded(false);
          }}
        >
          <ListItemIcon>{PublishClickIcons.pose_estimate}</ListItemIcon>
          <ListItemText disableTypography>Publish pose estimate</ListItemText>
        </MenuItem>
        <MenuItem
          selected={props.publishClickType === "pose"}
          onClick={() => {
            props.onChangePublishClickType("pose");
            setPublishMenuExpanded(false);
          }}
        >
          <ListItemIcon>{PublishClickIcons.pose}</ListItemIcon>
          <ListItemText disableTypography>Publish pose</ListItemText>
        </MenuItem>
        <MenuItem
          selected={props.publishClickType === "point"}
          onClick={() => {
            props.onChangePublishClickType("point");
            setPublishMenuExpanded(false);
          }}
        >
          <ListItemIcon>{PublishClickIcons.point}</ListItemIcon>
          <ListItemText disableTypography>Publish point</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );

  const resetViewButton = showResetViewButton && (
    <Button
      className={classes.resetViewButton}
      variant="contained"
      color="secondary"
      onClick={onResetView}
      data-testid="reset-view"
    >
      {t("resetView")}
    </Button>
  );

  const { onDownloadImage } = props;
  const doDownloadImage = useCallback(async () => {
    const currentImage = renderer?.getCurrentImage();
    if (!currentImage) {
      return;
    }

    const { topic, image, rotation, flipHorizontal, flipVertical, minValue, maxValue } =
      currentImage;
    const stamp = "header" in image ? image.header.stamp : image.timestamp;
    let bitmap: ImageBitmap;
    try {
      if ("format" in image) {
        bitmap = await decodeCompressedImageToBitmap(image);
      } else {
        const imageData = new ImageData(image.width, image.height);
        decodeRawImage(image, { minValue, maxValue }, imageData.data);
        bitmap = await createImageBitmap(imageData);
      }

      const width = rotation === 90 || rotation === 270 ? bitmap.height : bitmap.width;
      const height = rotation === 90 || rotation === 270 ? bitmap.width : bitmap.height;

      // re-render the image onto a new canvas to download the original image
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Unable to create rendering context for image download");
      }

      // Draw the image in the selected orientation so it aligns with the canvas viewport
      ctx.translate(width / 2, height / 2);
      ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
      ctx.rotate((rotation / 180) * Math.PI);
      ctx.translate(-bitmap.width / 2, -bitmap.height / 2);
      ctx.drawImage(bitmap, 0, 0);

      // read the canvas data as an image (png)
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(`Failed to create an image from ${width}x${height} canvas`);
          }
        }, "image/png");
      });
      // name the image the same name as the topic
      // note: the / characters in the file name will be replaced with _ by the browser
      // remove any leading / so the image name doesn't start with _
      const topicName = topic.replace(/^\/+/, "");
      const fileName = `${topicName}-${stamp.sec}-${stamp.nsec}`;
      void analytics.logEvent(AppEvent.IMAGE_DOWNLOAD);
      if (onDownloadImage) {
        onDownloadImage(blob, fileName);
      } else {
        downloadFiles([{ blob, fileName }]);
      }
    } catch (error) {
      log.error(error);
      enqueueSnackbar((error as Error).toString(), { variant: "error" });
    }
  }, [renderer, onDownloadImage, enqueueSnackbar, analytics]);

  const getContextMenuItems = useCallback(
    (): PanelContextMenuItem[] => [
      {
        type: "item",
        label: "Download image",
        onclick: doDownloadImage,
        disabled: renderer?.getCurrentImage() == undefined,
      },
    ],
    [doDownloadImage, renderer],
  );

  const mousePresenceRef = useRef<HTMLDivElement>(ReactNull);
  const mousePresent = usePanelMousePresence(mousePresenceRef);

  return (
    <>
      {props.interfaceMode === "image" && <PanelContextMenu getItems={getContextMenuItems} />}
      <div
        ref={mousePresenceRef}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 10,
          pointerEvents: "none",
        }}
      >
        {
          // Only show on hover for image panel
          (props.interfaceMode === "3d" || mousePresent) && (
            <Interactions
              addPanel={props.addPanel}
              selectedObject={selectedObject}
              interactionsTabType={interactionsTabType}
              setInteractionsTabType={setInteractionsTabType}
              timezone={props.timezone}
            />
          )
        }
        {props.interfaceMode === "3d" && (
          <Paper square={false} elevation={4} style={{ display: "flex", flexDirection: "column" }}>
            <IconButton
              className={classes.iconButton}
              color={props.perspective ? "info" : "inherit"}
              title={props.perspective ? "Switch to 2D camera" : "Switch to 3D camera"}
              onClick={props.onTogglePerspective}
            >
              <span className={classes.threeDeeButton}>3D</span>
            </IconButton>
            <IconButton
              data-testid="measure-button"
              className={classes.iconButton}
              color={props.measureActive ? "info" : "inherit"}
              title={props.measureActive ? "Cancel measuring" : "Measure distance"}
              onClick={props.onClickMeasure}
            >
              <Ruler24Filled className={classes.rulerIcon} />
            </IconButton>
            <Tooltip arrow title={recording ? "Stop recording" + (" (" + durationToTime(recordingTime) + ")") : "Start recording"}>
              <IconButton
                style={{ color: "#F00" }}
                className={classes.recordButton}
                onClick={recording ? stopRecording : startRecording}
              >
                <Circle12Filled
                  style={{
                    color: recording ? "#F00" : "#747474",
                  }}
                  className={recording ? "recording" : ""}
                />
              </IconButton>
            </Tooltip>

            {publishControls}
          </Paper>
        )}
      </div>
      {clickedObjects.length > 1 && !selectedObject && (
        <InteractionContextMenu
          onClose={() => setSelectedRenderables([])}
          clickedPosition={clickedPosition}
          clickedObjects={clickedObjects}
          selectObject={(selection) => {
            if (selection) {
              const renderable = (
                selection.object as unknown as { interactionData: { renderable: Renderable } }
              ).interactionData.renderable;
              const instanceIndex = selection.instanceIndex;
              setSelectedRenderables([]);
              setSelectedRenderable({ renderable, instanceIndex });
            }
          }}
        />
      )}
      {stats}
      {resetViewButton}
    </>
  );
}
