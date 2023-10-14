import { CSSProperties, useCallback, useEffect, useState } from "react";
import { Backdrop, CircularProgress, Stack } from "@mui/material";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { makeStyles } from "tss-react/mui";
import { styled, lighten, darken } from '@mui/system';

const API_URL = "/api/sim2real/config/list";

type ConfigFileListProps = {
    index?: number; // Optional index field which gets passed to `onChange` (so you don't have to create anonymous functions)
    onChange: (value?: string, type?: string) => void;
    autoSize?: boolean;
    placeholder?: string;
    inputStyle?: CSSProperties;
    disabled?: boolean;
    disableAutocomplete?: boolean; // Treat this as a normal input, with no autocomplete.
    readOnly?: boolean;
};

const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    backgroundColor:
        theme.palette.mode === 'light'
            ? lighten(theme.palette.primary.light, 0.85)
            : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
    padding: 0,
});


const useStyles = makeStyles()((theme) => ({
    input: {
        ".MuiInputBase-root.MuiInputBase-sizeSmall .MuiAutocomplete-input.MuiInputBase-inputSizeSmall":
        {
            paddingBottom: theme.spacing(0.425),
            paddingTop: theme.spacing(0.425),
        },
        ".MuiInputBase-root.MuiInputBase-sizeSmall": {
            padding: theme.spacing(0.125),
            gap: theme.spacing(0.25),
        },
    },
    chip: {
        "&.MuiAutocomplete-tag": {
            margin: 0,
        },
    },
}));

export default React.memo<ConfigFileListProps>(function ConfigFileList(
    props: ConfigFileListProps,
) {
    const { classes } = useStyles();

    const fetchConfigFiles = useCallback(async () => {
        const response = await fetch(API_URL);
        const data = await response.json();
        let configFiles: string[] = [];
        configFiles.push(
            ...data["trainingFiles"].map((file: string) => {
                return {
                    name: file,
                    type: "training",
                }
            }),
            ...data["sim2realFiles"].map((file: string) => {
                return {
                    name: file,
                    type: "sim2real",
                }
            }),
        )

        return configFiles;
    }, []);

    const [configFiles, setConfigFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        fetchConfigFiles().then((data) => {
            setConfigFiles(data);
            setLoading(false);
        }).catch((error) => {
            console.log(error);
            setLoading(false);
        });
    }, [fetchConfigFiles]);





    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexGrow={1}
            flexShrink={0}
            spacing={0.25}
        >
            <Backdrop
                sx={{ color: (theme) => theme.palette.text.primary, zIndex: (theme) => theme.zIndex.drawer + 1, position: "absolute" }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Autocomplete
                disabled={props.disabled}
                onChange={(_event, value) => props.onChange(value?.name, value?.type)}
                options={configFiles}
                freeSolo
                fullWidth
                groupBy={(option) => option.type}
                getOptionLabel={(option) => option.name}
                ChipProps={{
                    className: classes.chip,
                    variant: "filled",
                    size: "small",
                }}
                renderGroup={(params) => (
                    <li key={params.key}>
                        <GroupHeader>{params.group.toUpperCase()}</GroupHeader>
                        <GroupItems>{params.children}</GroupItems>
                    </li>
                )}
                renderInput={(params) => (
                    <TextField {...params} size="small" className={classes.input} placeholder="Search a file" />
                )}
            />
        </Stack>
    );;
});