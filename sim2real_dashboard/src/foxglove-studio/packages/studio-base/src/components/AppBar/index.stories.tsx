// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { action } from "@storybook/addon-actions";
import { Meta, StoryFn, StoryObj } from "@storybook/react";

import { AppBar } from "@foxglove/studio-base/components/AppBar";
import { StorybookDecorator } from "@foxglove/studio-base/components/AppBar/StorybookDecorator.stories";
import MockMessagePipelineProvider, {
  MockMessagePipelineProps,
} from "@foxglove/studio-base/components/MessagePipeline/MockMessagePipelineProvider";
import Stack from "@foxglove/studio-base/components/Stack";
import CurrentUserContext, { User } from "@foxglove/studio-base/context/CurrentUserContext";
import { PlayerPresence } from "@foxglove/studio-base/players/types";

export default {
  title: "components/AppBar",
  component: AppBar,
  decorators: [StorybookDecorator],
  args: {
    signIn: action("signIn"),
    onSelectDataSourceAction: action("onSelectDataSourceAction"),
    onMinimizeWindow: action("onMinimizeWindow"),
    onMaximizeWindow: action("onMaximizeWindow"),
    onUnmaximizeWindow: action("onUnmaximizeWindow"),
    onCloseWindow: action("onCloseWindow"),
    prefsDialogOpen: false,
    setPrefsDialogOpen: action("setPrefsDialogOpen"),
  },
  parameters: { colorScheme: "both-column" },
} as Meta<typeof AppBar>;

type Story = StoryObj<typeof AppBar>;

export const Default: Story = {};
export const DefaultChinese: Story = { parameters: { forceLanguage: "zh" } };
export const DefaultJapanese: Story = { parameters: { forceLanguage: "ja" } };

export const CustomWindowControls: Story = {
  args: { showCustomWindowControls: true },
};

export const CustomWindowControlsMaximized: Story = {
  args: { isMaximized: true, showCustomWindowControls: true },
};

export const CustomWindowControlsDragRegion: Story = {
  args: { showCustomWindowControls: true, debugDragRegion: true },
};

const Grid = (Story: StoryFn): JSX.Element => (
  <Stack overflowY="auto">
    <div style={{ display: "grid", gridTemplateColumns: "max-content auto", alignItems: "center" }}>
      <Story />
    </div>
  </Stack>
);

const currentUser: User = {
  id: "user-1",
  email: "user@example.com",
  orgId: "org_id",
  orgDisplayName: "Orgalorg",
  orgSlug: "org",
  orgPaid: false,
  org: {
    id: "org_id",
    slug: "org",
    displayName: "Orgalorg",
    isEnterprise: false,
    allowsUploads: true,
    supportsEdgeSites: false,
  },
};

export const SignInStates: Story = {
  decorators: [
    (Story: StoryFn): JSX.Element => {
      return (
        <>
          <div style={{ padding: 8 }}>sign in undefined</div>
          <div>
            <Story />
          </div>
          {[
            { label: "no user present", currentUser: undefined },
            { label: "user present", currentUser },
            {
              label: "user present with avatar",
              currentUser: {
                ...currentUser,
                avatarImageUrl:
                  "data:image/jpeg;base64,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",
              },
            },
            {
              label: "user present with invalid avatar url",
              currentUser: {
                ...currentUser,
                avatarImageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJR/9k=",
              },
            },
          ].map((state) => (
            <CurrentUserContext.Provider
              key={state.label}
              value={{
                currentUser: state.currentUser,
                signIn: () => undefined,
                signOut: async () => undefined,
              }}
            >
              <div style={{ padding: 8 }}>{state.label}</div>
              <div>
                <Story />
              </div>
            </CurrentUserContext.Provider>
          ))}
        </>
      );
    },
    Grid,
  ],
};

export const SignInStatesChinese: Story = {
  ...SignInStates,
  parameters: { forceLanguage: "zh" },
};

export const SignInStatesJapanese: Story = {
  ...SignInStates,
  parameters: { forceLanguage: "ja" },
};

const problems: MockMessagePipelineProps["problems"] = [
  { severity: "error", message: "example error" },
  { severity: "warn", message: "example warn" },
];

export const PlayerStates: Story = {
  decorators: [
    (Story: StoryFn): JSX.Element => {
      const playerStates: (MockMessagePipelineProps & { label?: string })[] = [
        ...[
          PlayerPresence.NOT_PRESENT,
          PlayerPresence.INITIALIZING,
          PlayerPresence.RECONNECTING,
          PlayerPresence.BUFFERING,
          PlayerPresence.PRESENT,
        ].map((presence) => ({
          name: "https://exampleurl:2002",
          presence,
        })),
        {
          name: "https://exampleurl:2002",
          presence: PlayerPresence.ERROR,
          problems,
        },
        {
          label: "INITIALIZING + problems",
          name: "https://exampleurl:2002",
          presence: PlayerPresence.INITIALIZING,
          problems,
        },
        {
          label: "INITIALIZING + no name",
          name: undefined,
          presence: PlayerPresence.INITIALIZING,
          problems,
        },
      ];

      return (
        <>
          {playerStates.map((props) => (
            <MockMessagePipelineProvider
              key={props.presence}
              name={props.name}
              presence={props.presence}
              problems={props.problems}
            >
              <div style={{ padding: 8 }}>{props.label ?? props.presence}</div>
              <div>
                <Story />
              </div>
            </MockMessagePipelineProvider>
          ))}
        </>
      );
    },
    Grid,
  ],
  parameters: { colorScheme: "light" },
};

export const PlayerStatesChinese: Story = {
  ...PlayerStates,
  parameters: { colorScheme: "light", forceLanguage: "zh" },
};

export const PlayerStatesJapanese: Story = {
  ...PlayerStates,
  parameters: { colorScheme: "light", forceLanguage: "ja" },
};

const fileSources: MockMessagePipelineProps[] = [
  "mcap-local-file",
  "ros1-local-bagfile",
  "ros2-local-bagfile",
  "ulog-local-file",
  "remote-file",
].map((sourceId) => ({
  name: "longexampleurlwith_specialcharaters-and-portnumber.ext",
  urlState: { sourceId },
}));

const remoteSources: MockMessagePipelineProps[] = [
  "ros1-socket",
  "ros2-socket",
  "rosbridge-websocket",
  "foxglove-websocket",
  "velodyne-device",
  "some other source type",
].map((sourceId) => ({
  name: "https://longexampleurlwith_specialcharaters-and-portnumber:3030",
  urlState: { sourceId },
}));

export const DataSources: Story = {
  decorators: [
    (Story: StoryFn): JSX.Element => {
      const playerStates: (MockMessagePipelineProps & { label?: string })[] = [
        {
          name: "Adapted from nuScenes dataset. Copyright © 2020 nuScenes. https://www.nuscenes.org/terms-of-use",
          urlState: { sourceId: "sample-nuscenes" },
        },
        ...fileSources,
        ...remoteSources,
        {
          label: "with problems",
          name: "https://longexampleurlwith_error-and-portnumber:3030",
          problems,
        },
      ];

      return (
        <>
          {playerStates.map((props) => (
            <MockMessagePipelineProvider
              key={props.urlState?.sourceId}
              name={props.name}
              presence={PlayerPresence.PRESENT}
              urlState={props.urlState}
              problems={props.problems}
              seekPlayback={() => {}}
            >
              <div style={{ padding: 8 }}>{props.label ?? props.urlState?.sourceId}</div>
              <div>
                <Story />
              </div>
            </MockMessagePipelineProvider>
          ))}
        </>
      );
    },
    Grid,
  ],
  parameters: { colorScheme: "light" },
};

export const DataSourcesChinese: Story = {
  ...DataSources,
  parameters: { colorScheme: "light", forceLanguage: "zh" },
};
export const DataSourcesJapanese: Story = {
  ...DataSources,
  parameters: { colorScheme: "light", forceLanguage: "ja" },
};
