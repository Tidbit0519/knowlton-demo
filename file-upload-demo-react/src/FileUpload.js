import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Stack, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function FileUpload() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [progress, setProgress] = useState({ started: false, percent: 0});
    const [msg, setMsg] = useState(null);

    function updateFileName(file) {
        setFile(file)
        setFileName(file.name);
    }

    async function handleSubmit() {
        if (!file) {
            setFileName("No file selected");
            return;
        }
    
        const fd = new FormData();
        fd.append('file', file);
    
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

    return (
        <>
            <div>{fileName}</div>
            <br/>
                <Stack spacing={2} direction="row">
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                        Upload file
                        <VisuallyHiddenInput type="file" onChange={(e) => updateFileName(e.target.files[0])}/>
                    </Button>
                    <Button variant="contained" onClick={() => handleSubmit()}>
                        Submit
                    </Button>
                </Stack>
            <br/>
            <div>{progress.started && <progress max="100" value={progress.percent}></progress> }</div>
            <div>{msg}</div>
        </>
    );
}
