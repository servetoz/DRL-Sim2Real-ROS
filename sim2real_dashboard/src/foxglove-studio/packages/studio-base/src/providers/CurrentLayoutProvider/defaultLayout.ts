// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { LayoutData } from "@foxglove/studio-base/context/CurrentLayoutContext/actions";
import { defaultPlaybackConfig } from "@foxglove/studio-base/providers/CurrentLayoutProvider/reducers";

/**
 * This is loaded when the user has no layout selected on application launch
 * to avoid presenting the user with a blank layout.
 */
export const defaultLayout: LayoutData = {
  configById: {
    "3D!18i6zy7": {
      layers: {
        "845139cb-26bc-40b3-8161-8ab60af4baf5": {
          visible: true,
          frameLocked: true,
          label: "Grid",
          instanceId: "845139cb-26bc-40b3-8161-8ab60af4baf5",
          layerId: "foxglove.Grid",
          size: 10,
          divisions: 10,
          lineWidth: 1,
          color: "#248eff",
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          order: 1,
        },
      },
    },
    "RawMessages!os6rgs": {},
    "Image!3mnp456": {},
  },
  globalVariables: {},
  userNodes: {},
  playbackConfig: { ...defaultPlaybackConfig },
  layout: {
    first: "3D!18i6zy7",
    second: {
      first: "Image!3mnp456",
      second: "RawMessages!os6rgs",
      direction: "column",
      splitPercentage: 30,
    },
    direction: "row",
    splitPercentage: 70,
  },
} as const;


export const sim2realLayout: LayoutData = {
  "configById": {
    "3D!18i6zy7": {
      "layers": {
        "845139cb-26bc-40b3-8161-8ab60af4baf5": {
          "visible": true,
          "frameLocked": true,
          "label": "Grid",
          "instanceId": "845139cb-26bc-40b3-8161-8ab60af4baf5",
          "layerId": "foxglove.Grid",
          "size": 10,
          "divisions": 10,
          "lineWidth": 1,
          "color": "#248eff",
          "position": [
            0,
            0,
            0
          ],
          "rotation": [
            0,
            0,
            0
          ],
          "order": 1
        },
        "8f45cd38-5391-44c8-ac88-b7aed35cccc8": {
          "visible": true,
          "frameLocked": true,
          "label": "URDF",
          "instanceId": "8f45cd38-5391-44c8-ac88-b7aed35cccc8",
          "layerId": "foxglove.Urdf",
          "url": "http://localhost:8050/assets/urdf/ur5.urdf",
          "order": 2
        }
      },
      "cameraState": {
        "perspective": true,
        "distance": 2.847914826858753,
        "phi": 71.66371109252937,
        "thetaOffset": 135.4790422047014,
        "targetOffset": [
          -0.20462355047924227,
          0.08890785926927076,
          2.2280064753084437e-17
        ],
        "target": [
          0,
          0,
          0
        ],
        "targetOrientation": [
          0,
          0,
          0,
          1
        ],
        "fovy": 44,
        "near": 0.7,
        "far": 5000
      },
      "followMode": "follow-pose",
      "followTf": "base",
      "scene": {
        "labelScaleFactor": 1,
        "ignoreColladaUpAxis": false,
        "meshUpAxis": "y_up",
        "syncCamera": false,
        "transforms": {
          "showLabel": false,
          "enablePreloading": true,
          "labelSize": 0.19
        }
      },
      "transforms": {
        "frame:base_link": {
          "visible": false
        },
        "frame:base": {
          "visible": false
        },
        "frame:base_link_inertia": {
          "visible": false
        },
        "frame:shoulder_link": {
          "visible": false
        },
        "frame:upper_arm_link": {
          "visible": false
        },
        "frame:forearm_link": {
          "visible": false
        },
        "frame:wrist_1_link": {
          "visible": false
        },
        "frame:wrist_2_link": {
          "visible": false
        },
        "frame:wrist_3_link": {
          "visible": false
        },
        "frame:flange": {
          "visible": false
        },
        "frame:tool0": {
          "visible": false
        },
        "frame:tool0_controller": {
          "visible": false
        },
        "frame:": {
          "visible": false
        }
      },
      "topics": {
        "/move_group/display_grasp_markers": {
          "visible": false
        },
        "/move_group/display_cost_sources": {
          "visible": false
        },
        "/move_group/display_contacts": {
          "visible": false
        },
        "/ur5_sim2real_bridge/camera1": {
          "visible": false
        },
        "/initialpose": {
          "visible": false
        },
        "/move_base_simple/goal": {
          "visible": false
        }
      },
      "publish": {
        "type": "point",
        "poseTopic": "/move_base_simple/goal",
        "pointTopic": "/clicked_point",
        "poseEstimateTopic": "/initialpose",
        "poseEstimateXDeviation": 0.5,
        "poseEstimateYDeviation": 0.5,
        "poseEstimateThetaDeviation": 0.26179939
      },
      "imageMode": {}
    },
    "RawMessages!os6rgs": {
      "diffEnabled": false,
      "diffMethod": "custom",
      "diffTopicPath": "",
      "showFullMessageForDiff": false,
      "topicPath": ""
    }
  },
  "globalVariables": {},
  "userNodes": {},
  playbackConfig: { ...defaultPlaybackConfig },
  "layout": {
    "first": "3D!18i6zy7",
    "second": "RawMessages!os6rgs",
    "direction": "row",
    "splitPercentage": 70
  },
} as const;