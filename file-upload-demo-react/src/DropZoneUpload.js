import React, { useState } from "react";
import axios from "axios";
import { DropzoneArea } from "mui-file-dropzone";
import { Container, Button, Stack, createTheme, ThemeProvider } from "@mui/material";

import "./DragZoneUpload.css"

const theme = createTheme({
    palette: {
        primary: {
            main: "#9e1b34",
        },
        secondary: {
            main: "#946f0a",
        }
    },
});


export default function DropZoneUpload() {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState({ started: false, percent: 0 });
    const [msg, setMsg] = useState(null);

    function updateFileName(file) {
        console.log(file)
        setFile(file)
    }

    async function handleSubmit() {
        if (file.length === 0) {
            setMsg("No file selected");
            return;
        } else {
            const fd = new FormData();
            fd.append('files', file);

            try {
                setProgress({ started: true, percent: 0 });
                setMsg("Uploading...");

                await axios.post('http://httpbin.org/post', fd, {
                    onUploadProgress: (progressEvent) => {
                        setProgress((prevState) => {
                            return { ...prevState, percent: (progressEvent.loaded / progressEvent.total) * 100 };
                        });
                    },
                });

                setMsg("Success!");
                setProgress({ started: false, percent: 100 });
            } catch (err) {
                setMsg("Failed.");
            }
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm">
                <DropzoneArea onChange={(files) => updateFileName(files)}
                    filesLimit={1}
                    dropzoneClass="dropZoneArea"
                    dropzoneParagraphClass="dropZoneAreaParagraph"
                    dropzoneText="Drag and drop a file here or click to upload"
                    showPreviews={true}
                    showPreviewsInDropzone={false}
                    useChipsForPreview={true}
                    previewChipProps={{ color: "secondary" }}
                    previewGridProps={{ container: { spacing: 1, direction: 'column' } }}
                    previewText="Selected file:"
                    alertSnackbarProps={{ anchorOrigin: { vertical: "top", horizontal: "right" } }} />
            </Container>
            <br />
            <Stack spacing={2}>
                <Container>
                    <Button variant="contained" color="primary" onClick={() => handleSubmit()}>
                        Submit
                    </Button>
                </Container>
                <Container>
                    <div>{progress.started && <progress max="100" value={progress.percent}></progress>}</div>
                    <div>{msg}</div>
                </Container>
            </Stack>
        </ThemeProvider>
    );
};


