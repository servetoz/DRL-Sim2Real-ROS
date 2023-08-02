// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import path from "path";

import { ConfigParams, devServerConfig, mainConfig } from "@foxglove/studio-web/src/webpackConfigs";

import packageJson from "../package.json";

// get DASHBOARD_ASSETS_DIR from env
const  DASHBOARD_ASSETS_DIR = process.env.DASHBOARD_ASSETS_DIR!;

const params: ConfigParams = {
  outputPath: path.resolve(DASHBOARD_ASSETS_DIR, "studio"),
  contextPath: path.resolve(__dirname, "src"),
  entrypoint: "./entrypoint.tsx",
  prodSourceMap: "source-map",
  version: packageJson.version,
};

// foxglove-depcheck-used: webpack-dev-server
export default [devServerConfig(params), mainConfig(params)];
