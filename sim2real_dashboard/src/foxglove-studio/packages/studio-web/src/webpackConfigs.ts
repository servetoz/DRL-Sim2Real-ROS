// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import path from "path";
import { Configuration, WebpackPluginInstance } from "webpack";
import type { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

import type { WebpackArgv } from "@foxglove/studio-base/WebpackArgv";
import { makeConfig } from "@foxglove/studio-base/webpack";

export interface WebpackConfiguration extends Configuration {
  devServer?: WebpackDevServerConfiguration;
}

export type ConfigParams = {
  /** Directory to find `entrypoint` and `tsconfig.json`. */
  contextPath: string;
  entrypoint: string;
  outputPath: string;
  /** Source map (`devtool`) setting to use for production builds */
  prodSourceMap: string | false;
  /** Set the app version information */
  version: string;
};

export const devServerConfig = (params: ConfigParams): WebpackConfiguration => ({
  // Use empty entry to avoid webpack default fallback to /src
  entry: {},

  // Output path must be specified here for HtmlWebpackPlugin within render config to work
  output: {
    publicPath: "",
    path: params.outputPath,
  },

  devServer: {
    static: {
      directory: params.outputPath,
    },
    hot: false,
    // The problem and solution are described at <https://github.com/webpack/webpack-dev-server/issues/1604>.
    // When running in dev mode two errors are logged to the dev console:
    //  "Invalid Host/Origin header"
    //  "[WDS] Disconnected!"
    // Since we are only connecting to localhost, DNS rebinding attacks are not a concern during dev
    allowedHosts: "all",
  },

  plugins: [new CleanWebpackPlugin()],
});

export const mainConfig =
  (params: ConfigParams) =>
    (env: unknown, argv: WebpackArgv): Configuration => {
      const isDev = argv.mode === "development";
      const isServe = argv.env?.WEBPACK_SERVE ?? false;

      const allowUnusedVariables = isDev;

      const plugins: WebpackPluginInstance[] = [];

      if (isServe) {
        plugins.push(new ReactRefreshPlugin());
      }

      const appWebpackConfig = makeConfig(env, argv, {
        allowUnusedVariables,
        version: params.version,
      });

      const config: Configuration = {
        name: "main",

        ...appWebpackConfig,

        target: "web",
        context: params.contextPath,
        entry: params.entrypoint,
        devtool: isDev ? "eval-cheap-module-source-map" : params.prodSourceMap,

        output: {
          publicPath: "auto",

          // Output filenames should include content hashes in order to cache bust when new versions are available
          filename: isDev ? "studio-[name].js" : "studio-[name].js",

          path: params.outputPath,
        },

        plugins: [
          ...plugins,
          ...(appWebpackConfig.plugins ?? []),
          new CopyPlugin({
            patterns: [{ from: path.resolve(__dirname, "..", "public") }],
          }),
        ],
      };

      return config;
    };
