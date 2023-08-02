// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { ErrorCircle20Filled } from "@fluentui/react-icons";
import { Button, Chip, CircularProgress, IconButton, Menu, MenuItem, MenuProps, alpha, keyframes, styled } from "@mui/material";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { useTranslation } from "react-i18next";
import { makeStyles } from "tss-react/mui";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import {
  MessagePipelineContext,
  useMessagePipeline,
} from "@foxglove/studio-base/components/MessagePipeline";
import Stack from "@foxglove/studio-base/components/Stack";
import WssErrorModal from "@foxglove/studio-base/components/WssErrorModal";
import { useWorkspaceActions } from "@foxglove/studio-base/context/Workspace/useWorkspaceActions";
import { PlayerPresence } from "@foxglove/studio-base/players/types";
import { usePlayerSelection } from "@foxglove/studio-base/context/PlayerSelectionContext";

import { useEffect, useLayoutEffect } from "react";

const ICON_SIZE = 18;

const useStyles = makeStyles<void, "adornmentError">()((theme, _params, _classes) => ({
  sourceName: {
    font: "inherit",
    fontSize: theme.typography.body2.fontSize,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    padding: theme.spacing(1.5),
    paddingInlineEnd: theme.spacing(0.75),
    whiteSpace: "nowrap",
    minWidth: 0,
  },
  adornment: {
    display: "flex",
    flex: "none",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    color: theme.palette.appBar.primary,
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginLeft: theme.spacing(1.2),
    marginRight: theme.spacing(1.2),
  },
  adornmentError: {
    color: theme.palette.error.main,
  },
  spinner: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    margin: "auto",
  },
  textTruncate: {
    maxWidth: "30vw",
    overflow: "hidden",
  },
  iconButton: {
    padding: 0,
    position: "relative",
    zIndex: 1,
    fontSize: ICON_SIZE - 2,

    "svg:not(.MuiSvgIcon-root)": {
      fontSize: "1rem",
    },
  },
}));

// const selectPlayerName = (ctx: MessagePipelineContext) => ctx.playerState.name;
const selectPlayerPresence = (ctx: MessagePipelineContext) => ctx.playerState.presence;
const selectPlayerProblems = (ctx: MessagePipelineContext) => ctx.playerState.problems;
// const selectSeek = (ctx: MessagePipelineContext) => ctx.seekPlayback;


export function DataSource(): JSX.Element {
  const { t } = useTranslation("appBar");
  const { classes, cx } = useStyles();

  // const playerName = useMessagePipeline(selectPlayerName);
  const playerPresence = useMessagePipeline(selectPlayerPresence);
  const playerProblems = useMessagePipeline(selectPlayerProblems) ?? [];
  // const seek = useMessagePipeline(selectSeek);

  const { sidebarActions, dialogActions } = useWorkspaceActions();

  // A crude but correct proxy (for our current architecture) for whether a connection is live
  // const isLiveConnection = seek == undefined;

  const reconnecting = playerPresence === PlayerPresence.RECONNECTING;
  const initializing = playerPresence === PlayerPresence.INITIALIZING;
  const error =
    playerPresence === PlayerPresence.ERROR ||
    playerProblems.some((problem) => problem.severity === "error");
  const loading = reconnecting || initializing;

  // const playerConnected = playerPresence === PlayerPresence.PRESENT;

  // const playerDisplayName =
  //   initializing && playerName == undefined ? "Initializing..." : playerName;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [source, setSource] = React.useState<string | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const { selectedSource, availableSources, selectSource } = usePlayerSelection();

  const handleClose = (event: any, reason?: string) => {
    setAnchorEl(null);
    if (event == null || reason != undefined || reason == "backdropClick" || reason == "escapeKeyDown") {
      return;
    }
    let selection = event.currentTarget.getAttribute("data-source");
    let source = availableSources.find((source) => source.id === selection)?.id;
    if (!source) {
      return;
    }
    if (source == "ros1-local-bagfile") {
      dialogActions.openFile.open().catch(console.error);
      return;
    }
    selectSource(source, { type: "connection", params: { url: "ws://localhost:9090" } });
  };

  useEffect(() => {
    if (selectedSource != undefined && selectedSource.id != source) {
      setSource(selectedSource.id ?? null);
    }
  }, [selectedSource?.id]);

  useLayoutEffect(() => {
    if (source == undefined && selectedSource?.id == undefined) {
      selectSource("rosbridge-websocket", { type: "connection", params: { url: "ws://localhost:9090" } });
    }
  }, [source]);


  const liveAnim = keyframes`
  0% {
    opacity: 1;
  }
    30% {
    opacity: 0.5;
  }
  60% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
`

  const sourceItems = [
    {
      key: "rosbridge-websocket",
      el: <MenuItem onClick={handleClose} selected={source === "rosbridge-websocket"}
        key="rosbridge-websocket"
        disableRipple data-source="rosbridge-websocket">
        <Chip label="LIVE" color="error" sx={{
          height: 20,
          width: 'auto',
          marginRight: 1,
          paddingLeft: 0,
          paddingRight: 0,
          '& .MuiChip-label': {
            fontSize: 9,
            paddingLeft: 1,
            paddingRight: 1,
          },
        }} /> ROS Bridge
      </MenuItem>,
      displayEl: <>
        <Chip label="LIVE" color="error" sx={{
          animation: `${liveAnim} 5s ease infinite`,
          height: 20,
          width: 'auto',
          marginRight: 1,
          paddingLeft: 0,
          paddingRight: 0,
          '& .MuiChip-label': {
            fontSize: 9,
            paddingLeft: 1,
            paddingRight: 1,
          },
        }} /> ROS Bridge
      </>
    },
    {
      key: "ros1-local-bagfile",
      el: <MenuItem onClick={handleClose} disableRipple data-source="ros1-local-bagfile" selected={source === "ros1-local-bagfile"} key="ros1-local-bagfile">
        <BusinessCenterIcon /> ROS Bag
      </MenuItem>,
      displayEl: <>
        <BusinessCenterIcon sx={{
          fontSize: 22,
          marginRight: 1.9,
          marginLeft: 0.8
        }} /> ROS Bag
      </>
    }
  ];


  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      padding: 0,
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 22,
          marginRight: theme.spacing(1.9),
          marginLeft: theme.spacing(0.8),
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  }));


  return (
    <>
      <WssErrorModal playerProblems={playerProblems} />
      <Stack direction="row" alignItems="center">
        {/* <div className={classes.sourceName}>
          <div className={classes.textTruncate}>
            <TextMiddleTruncate text={playerDisplayName ?? `<${t("unknown")}>`} />
          </div>
          {isLiveConnection && (
            <>
              <span>/</span>
              <EndTimestamp />
            </>
          )}
        </div> */}
        <div>
          <Button
            id="select-source-button"
            aria-controls={open ? 'select-source-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="contained"
            disableElevation
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
          >
            {
              sourceItems.find((item) => item.key === source)?.displayEl ?? t('selectSource')
            }
          </Button>
          <StyledMenu
            id="select-source-menu"
            MenuListProps={{
              'aria-labelledby': 'select-source-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {sourceItems.map((item) => item.el)}
          </StyledMenu>
        </div>
        <div className={cx(classes.adornment, { [classes.adornmentError]: error })}>
          {loading && (
            <CircularProgress
              size={ICON_SIZE}
              color="inherit"
              className={classes.spinner}
              variant="indeterminate"
            />
          )}
          {error && (
            <IconButton
              color="inherit"
              className={classes.iconButton}
              onClick={() => {
                sidebarActions.left.setOpen(true);
                sidebarActions.left.selectItem("problems");
              }}
            >
              <ErrorCircle20Filled />
            </IconButton>
          )}
        </div>
      </Stack>
    </>
  );
}
