// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import {
  ChevronDown12Regular,
  PanelLeft24Filled,
  PanelLeft24Regular,
  PanelRight24Filled,
  PanelRight24Regular,
  SlideAdd24Regular,
} from "@fluentui/react-icons";
import { Avatar, Button, IconButton, Tooltip, AppBar as MuiAppBar } from "@mui/material";
import { useCallback, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import tc from "tinycolor2";
import { makeStyles } from "tss-react/mui";
import { shallow } from "zustand/shallow";

import { AppSetting } from "@foxglove/studio-base/AppSetting";
import { AppBarIconButton } from "@foxglove/studio-base/components/AppBar/AppBarIconButton";
import { AppMenu } from "@foxglove/studio-base/components/AppBar/AppMenu";
import {
  CustomWindowControls,
  CustomWindowControlsProps,
} from "@foxglove/studio-base/components/AppBar/CustomWindowControls";
import { FoxgloveLogo } from "@foxglove/studio-base/components/FoxgloveLogo";
import { MemoryUseIndicator } from "@foxglove/studio-base/components/MemoryUseIndicator";
import Stack from "@foxglove/studio-base/components/Stack";
import { useAnalytics } from "@foxglove/studio-base/context/AnalyticsContext";
import { useAppContext } from "@foxglove/studio-base/context/AppContext";
import {
  LayoutState,
  useCurrentLayoutSelector,
} from "@foxglove/studio-base/context/CurrentLayoutContext";
import { useCurrentUser } from "@foxglove/studio-base/context/CurrentUserContext";
import {
  useWorkspaceStore,
  WorkspaceContextStore,
} from "@foxglove/studio-base/context/Workspace/WorkspaceContext";
import { useWorkspaceActions } from "@foxglove/studio-base/context/Workspace/useWorkspaceActions";
import { useAppConfigurationValue } from "@foxglove/studio-base/hooks";
import { AppEvent } from "@foxglove/studio-base/services/IAnalytics";
import { fonts } from "@foxglove/studio-base/util/sharedStyleConstants";

import { AddPanelMenu } from "./AddPanelMenu";
import { DataSource } from "./DataSource";
import { UserMenu } from "./UserMenu";
import { APP_BAR_HEIGHT } from "./constants";

const useStyles = makeStyles<{ leftInset?: number; debugDragRegion?: boolean }, "avatar">()(
  (theme, { leftInset, debugDragRegion = false }, classes) => {
    const DRAGGABLE_STYLE: Record<string, string> = { WebkitAppRegion: "drag" };
    const NOT_DRAGGABLE_STYLE: Record<string, string> = { WebkitAppRegion: "no-drag" };
    if (debugDragRegion) {
      DRAGGABLE_STYLE.backgroundColor = "green";
      NOT_DRAGGABLE_STYLE.backgroundColor = "red";
    }
    return {
      appBar: {
        gridArea: "appbar",
        boxShadow: "none",
        backgroundColor: theme.palette.common.white,
        borderBottom: `2px solid ${theme.palette.divider}`,
        color: theme.palette.appBar.main,
        height: APP_BAR_HEIGHT,

        // Leave space for system window controls on the right on Windows.
        // Use hard-coded padding for Mac because it looks better than env(titlebar-area-x).
        paddingLeft: leftInset,
        paddingRight: "calc(100% - env(titlebar-area-x) - env(titlebar-area-width))",
        ...DRAGGABLE_STYLE, // make custom window title bar draggable for desktop app
      },
      toolbar: {
        display: "grid",
        width: "100%",
        gridTemplateAreas: `"start middle end"`,
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
      },
      logo: {
        padding: theme.spacing(0.75, 0.5),
        fontSize: "2rem",
        color: theme.palette.appBar.primary,
        borderRadius: 0,
        marginLeft: theme.spacing(1),

        "svg:not(.MuiSvgIcon-root)": {
          fontSize: "1em",
          color: theme.palette.appBar.primary,
          fill: "currentColor",
        },
        "&:hover": {
          backgroundColor: tc(theme.palette.common.white).setAlpha(0.08).toRgbString(),
        },
        "&.Mui-selected": {
          backgroundColor: theme.palette.appBar.primary,
          color: theme.palette.common.white,
        },
        "&.Mui-disabled": {
          color: "currentColor",
          opacity: theme.palette.action.disabledOpacity,
        },
      },
      dropDownIcon: {
        fontSize: "12px !important",
      },
      start: {
        gridArea: "start",
        display: "flex",
        flex: 1,
        alignItems: "center",
      },
      startInner: {
        display: "flex",
        alignItems: "center",
        ...NOT_DRAGGABLE_STYLE, // make buttons clickable for desktop app
      },
      middle: {
        gridArea: "middle",
        justifySelf: "center",
        overflow: "hidden",
        maxWidth: "100%",
        ...NOT_DRAGGABLE_STYLE, // make buttons clickable for desktop app
      },
      end: {
        gridArea: "end",
        flex: 1,
        display: "flex",
        justifyContent: "flex-end",
      },
      endInner: {
        display: "flex",
        alignItems: "center",
        ...NOT_DRAGGABLE_STYLE, // make buttons clickable for desktop app
      },
      keyEquivalent: {
        fontFamily: fonts.MONOSPACE,
        background: tc(theme.palette.common.white).darken(45).toString(),
        padding: theme.spacing(0, 0.5),
        aspectRatio: 1,
        borderRadius: theme.shape.borderRadius,
        marginLeft: theme.spacing(1),
      },
      tooltip: {
        marginTop: `${theme.spacing(0.5)} !important`,
      },
      avatar: {
        color: theme.palette.common.white,
        backgroundColor: tc(theme.palette.appBar.main).lighten().toString(),
        height: theme.spacing(3.5),
        width: theme.spacing(3.5),
      },
      iconButton: {
        padding: theme.spacing(1),
        borderRadius: 0,

        "&:hover": {
          backgroundColor: tc(theme.palette.common.white).setAlpha(0.08).toString(),

          [`.${classes.avatar}`]: {
            backgroundColor: tc(theme.palette.appBar.main).lighten(20).toString(),
          },
        },
        "&.Mui-selected": {
          backgroundColor: theme.palette.appBar.primary,

          [`.${classes.avatar}`]: {
            backgroundColor: tc(theme.palette.appBar.main).setAlpha(0.3).toString(),
          },
        },
      },
      button: {
        marginInline: theme.spacing(1),
        backgroundColor: theme.palette.appBar.primary,

        "&:hover": {
          backgroundColor: theme.palette.augmentColor({
            color: { main: theme.palette.appBar.primary as string },
          }).dark,
        },
      },
    };
  },
);

type AppBarProps = CustomWindowControlsProps & {
  leftInset?: number;
  onDoubleClick?: () => void;
  debugDragRegion?: boolean;
  disableSignIn?: boolean;
};

const selectCurrentLayoutId = ({ selectedLayout }: LayoutState) => selectedLayout?.id;
const selectWorkspace = (store: WorkspaceContextStore) => store;

export function AppBar(props: AppBarProps): JSX.Element {
  const {
    debugDragRegion,
    disableSignIn = false,
    isMaximized,
    leftInset,
    onCloseWindow,
    onDoubleClick,
    onMaximizeWindow,
    onMinimizeWindow,
    onUnmaximizeWindow,
    showCustomWindowControls = false,
  } = props;
  const { classes, cx, theme } = useStyles({ leftInset, debugDragRegion });
  const { currentUser, signIn } = useCurrentUser();
  const { t } = useTranslation("appBar");

  const { appBarLayoutButton } = useAppContext();

  const analytics = useAnalytics();
  const [enableMemoryUseIndicator = false] = useAppConfigurationValue<boolean>(
    AppSetting.ENABLE_MEMORY_USE_INDICATOR,
  );

  const currentLayoutId = useCurrentLayoutSelector(selectCurrentLayoutId);

  const {
    sidebars: {
      left: { open: leftSidebarOpen },
      right: { open: rightSidebarOpen },
    },
  } = useWorkspaceStore(selectWorkspace, shallow);
  const { sidebarActions } = useWorkspaceActions();

  const [appMenuEl, setAppMenuEl] = useState<undefined | HTMLElement>(undefined);
  const [userAnchorEl, setUserAnchorEl] = useState<undefined | HTMLElement>(undefined);
  const [panelAnchorEl, setPanelAnchorEl] = useState<undefined | HTMLElement>(undefined);

  const appMenuOpen = Boolean(appMenuEl);
  const userMenuOpen = Boolean(userAnchorEl);
  const panelMenuOpen = Boolean(panelAnchorEl);

  // onComponentDidMount
  useLayoutEffect(() => {
    let container = document.getElementById("app-top-bar");
    if (container) {
      let navButton = document.getElementById("menu-button");
      let navButton2 = document.getElementById("menu-button-2");
      if (navButton2) {
        // move menu button into app-top-bar
        navButton?.style.setProperty("display", "none");
        navButton2.classList.remove("d-none");
        container.prepend(navButton2);
      }
    }
    let navCurrent = document.getElementById("3d-panel-nav-link");
    if (navCurrent) {
      navCurrent.classList.add("active");
    }
  }, []);

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      onDoubleClick?.();
    },
    [onDoubleClick],
  );

  return (
    <>
      <MuiAppBar
        className={classes.appBar}
        position="relative"
        color="inherit"
        elevation={0}
        onDoubleClick={handleDoubleClick}
        data-tourid="app-bar"
      >
        <div className={classes.toolbar}>
          <div className={classes.start}>
            <div className={classes.startInner} id="app-top-bar">
              <IconButton
                className={cx(classes.logo, { "Mui-selected": appMenuOpen })}
                color="inherit"
                id="app-menu-button"
                title="Menu"
                aria-controls={appMenuOpen ? "app-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={appMenuOpen ? "true" : undefined}
                data-tourid="app-menu-button"
                onClick={(event) => {
                  setAppMenuEl(event.currentTarget);
                }}
              >
                <FoxgloveLogo fontSize="inherit" color="inherit" />
                <ChevronDown12Regular
                  className={classes.dropDownIcon}
                  primaryFill={theme.palette.appBar.primary}
                />
              </IconButton>
              <AppMenu
                open={appMenuOpen}
                anchorEl={appMenuEl}
                handleClose={() => setAppMenuEl(undefined)}
              />
              <AppBarIconButton
                className={cx({ "Mui-selected": panelMenuOpen })}
                color="inherit"
                disabled={currentLayoutId == undefined}
                id="add-panel-button"
                data-tourid="add-panel-button"
                title="Add panel"
                aria-label="Add panel button"
                aria-controls={panelMenuOpen ? "add-panel-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={panelMenuOpen ? "true" : undefined}
                onClick={(event) => {
                  setPanelAnchorEl(event.currentTarget);
                }}
              >
                <SlideAdd24Regular />
              </AppBarIconButton>
            </div>
          </div>

          <div className={classes.middle}>
            <DataSource />
          </div>

          <div className={classes.end}>
            <div className={classes.endInner}>
              {enableMemoryUseIndicator && <MemoryUseIndicator />}
              {appBarLayoutButton}
              <Stack direction="row" alignItems="center" data-tourid="sidebar-button-group">
                <AppBarIconButton
                  title={
                    <>
                      {leftSidebarOpen ? "Hide" : "Show"} left sidebar---{" "}
                      <kbd className={classes.keyEquivalent}>[</kbd>
                    </>
                  }
                  aria-label={`${leftSidebarOpen ? "Hide" : "Show"} left sidebar`}
                  onClick={() => sidebarActions.left.setOpen(!leftSidebarOpen)}
                  data-tourid="left-sidebar-button"
                >
                  {leftSidebarOpen ? <PanelLeft24Filled /> : <PanelLeft24Regular />}
                </AppBarIconButton>
                <AppBarIconButton
                  title={
                    <>
                      {rightSidebarOpen ? "Hide" : "Show"} right sidebar---{" "}
                      <kbd className={classes.keyEquivalent}>]</kbd>
                    </>
                  }
                  aria-label={`${rightSidebarOpen ? "Hide" : "Show"} right sidebar`}
                  onClick={() => sidebarActions.right.setOpen(!rightSidebarOpen)}
                  data-tourid="right-sidebar-button"
                >
                  {rightSidebarOpen ? <PanelRight24Filled /> : <PanelRight24Regular />}
                </AppBarIconButton>
              </Stack>
              {!disableSignIn && !currentUser && signIn != undefined && (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  size="small"
                  onClick={() => {
                    signIn();
                    void analytics.logEvent(AppEvent.APP_BAR_CLICK_CTA, {
                      user: "unauthenticated",
                      cta: "sign-in",
                    });
                  }}
                >
                  {t("signIn")}
                </Button>
              )}
              <Tooltip
                classes={{ tooltip: classes.tooltip }}
                title={currentUser?.email ?? "Profile"}
                arrow={false}
              >
                <IconButton
                  className={cx(classes.iconButton, { "Mui-selected": userMenuOpen })}
                  aria-label="User profile menu button"
                  color="inherit"
                  id="user-button"
                  data-tourid="user-button"
                  aria-controls={userMenuOpen ? "user-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen ? "true" : undefined}
                  onClick={(event) => setUserAnchorEl(event.currentTarget)}
                  data-testid="user-button"
                >
                  <Avatar
                    src={currentUser?.avatarImageUrl ?? undefined}
                    className={classes.avatar}
                    variant="rounded"
                  />
                </IconButton>
              </Tooltip>
              {showCustomWindowControls && (
                <CustomWindowControls
                  onMinimizeWindow={onMinimizeWindow}
                  isMaximized={isMaximized}
                  onUnmaximizeWindow={onUnmaximizeWindow}
                  onMaximizeWindow={onMaximizeWindow}
                  onCloseWindow={onCloseWindow}
                />
              )}
            </div>
          </div>
        </div>
      </MuiAppBar>
      <AddPanelMenu
        anchorEl={panelAnchorEl}
        open={panelMenuOpen}
        handleClose={() => setPanelAnchorEl(undefined)}
      />
      <UserMenu
        anchorEl={userAnchorEl}
        open={userMenuOpen}
        handleClose={() => setUserAnchorEl(undefined)}
      />
    </>
  );
}
