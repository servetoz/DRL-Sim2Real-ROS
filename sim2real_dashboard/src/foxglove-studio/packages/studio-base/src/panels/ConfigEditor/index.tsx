// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2020-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.

import { makeStyles } from "tss-react/mui";
import { useCallback, useEffect, useState } from "react";
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SaveIcon from '@mui/icons-material/Save';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StopIcon from '@mui/icons-material/Stop';
import TreeItem from '@mui/lab/TreeItem';
import { Alert, Backdrop, Button, CircularProgress, MenuItem, Select, SelectChangeEvent, Snackbar, TextField, Typography } from "@mui/material";

import EmptyState from "@foxglove/studio-base/components/EmptyState";
import PanelToolbar from "@foxglove/studio-base/components/PanelToolbar";
import Stack from "@foxglove/studio-base/components/Stack";
import { fonts } from "@foxglove/studio-base/util/sharedStyleConstants";


import ConfigFileList from "./ConfigFileList";
import { NumberInput } from "./inputs/NumberInput";
import Panel from "@foxglove/studio-base/components/Panel";

const API_FETCH_FILE = "/api/sim2real/config/:type/:name";
const API_TRAINING_START = "/api/sim2real/training/start/:name";
const API_TRAINIG_STATUS = "/api/sim2real/training/status";
const API_TRAINIG_STOP = "/api/sim2real/training/stop";

export type AlertColor = 'success' | 'info' | 'warning' | 'error';

const useStyles = makeStyles()((theme) => ({
  inputWrapper: {
    width: "100%",
    lineHeight: "20px",
  },
  monospace: {
    fontFamily: fonts.MONOSPACE,
  },
  fieldGrid: {
    display: "flex",
    alignItems: "right",
    flexDirection: "column",
    listStyle: "none",
    margin: theme.spacing(0.3, 0),
    "& > .MuiTreeItem-content": {
      padding: 0,
      "& > .MuiTreeItem-label": {
        padding: 0,
      },
    },
  },
  textField: {
    border: 0,
    width: "165px",
    "& .MuiInputBase-root": {
      fontFamily: fonts.MONOSPACE,
      fontSize: "0.86rem",
      lineHeight: 1.5,

      "& .MuiInputBase-input": {
        textAlign: "center",
        borderColor: "transparent",
        width: "100%",
      },
    },
  },
  startAdornment: {
    display: "flex",
  },
  fieldLabel: {
    paddingLeft: theme.spacing(0.2),
    position: "relative",
    fontFeatureSettings: "'cv08','cv10','tnum'",
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "0.86rem",
    lineHeight: 1.5,
    cursor: "pointer",
  },
  fieldWrapper: {
    minWidth: theme.spacing(14),
    marginRight: theme.spacing(0.5),
    justifySelf: "flex-end",
  },
}));

function InputField({
  onChange,
  value,
  type,
  inputId,
}: {
  onChange: (value?: string, type?: string) => void;
  value: string | number | boolean | undefined;
  type: string;
  inputId: string;
}) {
  const { classes } = useStyles();
  const [inputValue, setInputValue] = useState(value);

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    }
    , [setInputValue]);

  const onNumberInputChange = useCallback(
    (val?: number) => {
      if (!val) {
        setInputValue("");
        return;
      }
      if (isFinite(val)) {
        setInputValue(val);
        onChange(val as unknown as string, type);
      }
    }
    , [setInputValue]);

  const onSelectChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      setInputValue(event.target.value === "true" ? true : false);
    }
    , [setInputValue]);

  const onInputBlur = useCallback(
    () => {
      onChange(inputValue as string, type);
    }
    , [inputValue, onChange, type]);

  switch (type) {
    case "number":
      return (<NumberInput
        size="small"
        variant="filled"
        value={inputValue as number}
        readOnly={false}
        className={classes.textField}
        id={inputId}
        fullWidth
        onChange={onNumberInputChange}
      />);
    case "string":
      return (<TextField
        className={classes.textField}
        fullWidth
        size="small"
        variant="filled"
        id={inputId}
        value={inputValue}
        onChange={onInputChange}
        onBlur={onInputBlur}
      />);

    case "boolean":
      return (<Select
        className={classes.textField}
        fullWidth
        id={inputId}
        size="small"
        variant="filled"
        value={inputValue as string}
        onChange={onSelectChange}
        onBlur={onInputBlur}
      >
        <MenuItem sx={{ textAlign: "center" }} key={0} value={"false"}>false</MenuItem >
        <MenuItem sx={{ textAlign: "center" }} key={1} value={"true"}>true</MenuItem >
      </Select>
      );
    default:
      return (<TextField
        className={classes.textField}
        fullWidth
        size="small"
        variant="filled"
        id={inputId}
        value={inputValue}
        onChange={onInputChange}
        onBlur={onInputBlur}
      />);
  }
}


function ConfigEditorPanel() {
  const { classes } = useStyles();

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ name?: string; type?: string } | null>(null);
  const [file, setFile] = useState<any>(null);
  let fileContentKeys = [] as string[];
  const [snackbarOptions, setSnackbarOptions] = useState({ message: "", severity: "success", open: false, autoHideDuration: 3000 } as { message: string, severity: string, open: boolean, autoHideDuration: number | null });
  const [trainingStatusInterval, setTrainingStatusInterval] = useState<any>(null);


  const onFileChange = useCallback(
    (value?: string, type?: string) => {
      if (!value) {
        setSelectedFile(null);
        return;
      }
      setSelectedFile({ name: value, type });
    },
    [setSelectedFile],
  );

  useEffect(() => {
    if (selectedFile) {
      const { name, type } = selectedFile;
      if (!name || !type) {
        return;
      }
      setLoading(true);
      const fetchFile = async (name: string, type: string) => {
        const url = API_FETCH_FILE.replace(":name", name).replace(":type", type);
        const response = await fetch(url);
        const data = await response.json();
        return data;
      };

      fetchFile(name, type).then((data) => {
        setFile(data);
        fileContentKeys = [];
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [selectedFile]);

  const onFileSave = useCallback(
    () => {
      if (!selectedFile) {
        return;
      }
      const { name, type } = selectedFile;
      if (!name || !type) {
        return;
      }
      setLoading(true);
      const postFile = async (name: string, type: string) => {
        const url = API_FETCH_FILE.replace(":name", name).replace(":type", type);
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(file),
        });
        const data = await response.json();
        return data;
      };

      postFile(name, type).then((data) => {
        setFile(data);
        fileContentKeys = [];
        setSnackbarOptions({ message: "File saved succesfully!", severity: "success", open: true, autoHideDuration: 3000 });
      }).finally(() => {
        setLoading(false);
      });
    },
    [selectedFile, file, setLoading, setFile, fileContentKeys, setSnackbarOptions],
  );

  const onFileExecute = useCallback(
    () => {
      if (!selectedFile) {
        return;
      }
      const { name, type } = selectedFile;
      if (!name || !type) {
        return;
      }

      if (type !== "training") {
        return;
      }

      const startTraining = async (name: string) => {
        const url = API_TRAINING_START.replace(":name", name);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());
        return response;
      };

      startTraining(name).then((data) => {
        console.log(data);
      });

      const trainingStatus = async () => {
        const url = API_TRAINIG_STATUS;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());
        return response;
      };


      setTrainingStatusInterval(setInterval(() => {
        trainingStatus().then((data) => {
          if (data.status === "finished") {
            clearInterval(trainingStatusInterval);
            setTrainingStatusInterval(null);
            setSnackbarOptions({ message: "Training finished succesfully!", severity: "success", open: true, autoHideDuration: null });
          } else if (data.status === "finished_with_error") {
            clearInterval(trainingStatusInterval);
            setTrainingStatusInterval(null);
            setSnackbarOptions({ message: "Training finished with error! Please check ros logs for more information.", severity: "error", open: true, autoHideDuration: null });
          }
        });
      }, 1000));


    }, [selectedFile]);


  useEffect(() => {
    return () => {
      if (trainingStatusInterval) {
        clearInterval(trainingStatusInterval);
      }
    };
  }, [trainingStatusInterval]);


  const onTrainingStop = useCallback(
    () => {
      const stopTraining = async () => {
        const url = API_TRAINIG_STOP;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());
        return response;
      };

      stopTraining().then((data) => {
        if (data.status === "stopped") {
          clearInterval(trainingStatusInterval);
          setTrainingStatusInterval(null);
          setSnackbarOptions({ message: "Training stopped!", severity: "success", open: true, autoHideDuration: null });
        }
      }).catch((err) => {
        setSnackbarOptions({ message: "Error stopping training!", severity: "error", open: true, autoHideDuration: null });
        console.log(err);
      });

    }, [trainingStatusInterval, setTrainingStatusInterval, setSnackbarOptions]);



  const renderTree = (nodes: any) => {
    if (typeof nodes !== "object" || nodes === null) {
      return null;
    }

    return Object.keys(nodes).map((key) => {
      let generatedId = "";
      if (fileContentKeys.indexOf(key) === -1) {
        fileContentKeys.push(key);
        generatedId = key;
      } else {
        const regex = new RegExp(key + "-[0-9]+");
        const keys = fileContentKeys.filter((k) => regex.test(k));
        if (keys.length > 0) {
          const lastKey = keys[keys.length - 1];
          const lastKeyNumber = Number(lastKey?.split("-")[1]);
          const newKey = key + "-" + (lastKeyNumber + 1);
          fileContentKeys.push(newKey);
          generatedId = newKey;
        } else {
          fileContentKeys.push(key + "-1");
          generatedId = key + "-1";
        }
      }
      if (typeof nodes[key] === "object") {
        return (
          <TreeItem key={generatedId} nodeId={generatedId} label={key} className={classes.fieldGrid}>
            {renderTree(nodes[key])}
          </TreeItem>
        );
      } else {
        return (
          <li className={classes.fieldGrid} key={generatedId}>
            <Stack
              paddingLeft={0.2}
              fullHeight
              direction="row"
              alignItems="center"
              flex={1}
              justifyContent="space-between"
            >
              <Typography
                className={classes.fieldLabel}
                title={key}
                variant="subtitle2"
                onClick={() => {
                  const input = document.getElementById(key + generatedId);
                  if (input) {
                    input.focus();
                  }
                }}
              >
                {key}
              </Typography>
              <div className={classes.fieldWrapper}>
                <InputField
                  onChange={(value, type) => {
                    if (type === "number") {
                      nodes[key] = Number(value);
                    } else if (type === "boolean") {
                      nodes[key] = Boolean(value);
                    } else {
                      nodes[key] = value;
                    }
                    setFile({ ...file });
                  }}
                  inputId={key + generatedId}
                  value={nodes[key]}
                  type={typeof nodes[key]}
                />
              </div>
            </Stack>
          </li>
        );
      }
    });
  };

  return (
    <>
      <Stack flex="auto" overflow="hidden" position="relative">
        <PanelToolbar>
          <div className={classes.inputWrapper}>
            <ConfigFileList onChange={onFileChange} />
          </div>
        </PanelToolbar>
        {!selectedFile && <EmptyState>No file selected</EmptyState>}
        <Backdrop
          sx={{ color: (theme) => theme.palette.text.primary, zIndex: (theme) => theme.zIndex.drawer + 1, position: "absolute" }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {file && selectedFile && (
          <TreeView
            key={selectedFile.name}
            aria-label="rich object"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={['root']}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ flexGrow: 1, overflow: "auto" }}
          >
            {renderTree(file)}
          </TreeView>
        )}
      </Stack>
      {selectedFile && (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" flexShrink={0} gap={0.5} padding={1} style={{ borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={onFileSave}>
            Save
          </Button>
          {selectedFile.type === "training" && trainingStatusInterval === null &&
            (
              <Button
                variant="outlined"
                startIcon={<PlayCircleFilledWhiteIcon />}
                onClick={onFileExecute}>
                Execute
              </Button>
            )}
          {selectedFile.type === "training" && trainingStatusInterval !== null &&
            (
              <Button
                variant="outlined"
                startIcon={<StopIcon />}
                color="error"
                onClick={onTrainingStop}>
                Stop (Running...)
              </Button>
            )}
        </Stack >)
      }
      <Snackbar open={snackbarOptions.open} onClose={() => setSnackbarOptions({ ...snackbarOptions, open: false })}
        autoHideDuration={snackbarOptions.autoHideDuration}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} sx={{ position: "absolute", width: "80%" }}>
        <Alert onClose={() => setSnackbarOptions({ ...snackbarOptions, open: false })}
          severity={snackbarOptions.severity as AlertColor}
          sx={{ width: '100%' }}>
          {snackbarOptions.message}
        </Alert>
      </Snackbar>
    </>
  );
}

ConfigEditorPanel.panelType = "ConfigEditor";
ConfigEditorPanel.defaultConfig = {
  topicPath: "",
};

export default Panel(ConfigEditorPanel);
