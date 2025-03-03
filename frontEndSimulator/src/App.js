import { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Table, TableCell, TableRow, TableBody, Paper } from "@mui/material";
import "./styling/index.css";

function App() {
  // State variables
  const [fileName, setFileName] = useState("");
  const [response, setResponse] = useState("");
  const [uid, setUID] = useState("");
  const [pid, setPID] = useState("");
  const [fileContents, setFileContents] = useState("");
  const [diff, setDiff] = useState("The `git diff` of a file with itself will appear here.");
  const boxWidth = 400;

  //Get request handler
  function sendGet(endpoint) {
    const url = `http://localhost:4567/${endpoint}`;
    axios.get(url).then((response) => {
      console.log(response.data);
      setResponse(JSON.stringify(response.data));
    });
  }

  //Post request handler
  function sendPost(endpoint, body) {
    const url = `http://localhost:4567/${endpoint}`;
    axios.post(url, body).then((response) => {
      console.log(response.data);
      setResponse(JSON.stringify(response.data));
    });
  }

  //Delete request handler
  function deletePost(endpoint, body) {
    const url = `http://localhost:4567/${endpoint}`;
    axios.delete(url, body).then((response) => {
      console.log(response.data);
      setResponse(JSON.stringify(response.data));
    });
  }

  function getDiff(endpoint) {
    const url = `http://localhost:4567/${endpoint}`;
    axios.get(url).then((response) => {
      setResponse(JSON.stringify(response.data));
      setDiff(response.data["Message"].match(/(^-\w+.*)|(^\+\w+.*)|(^ \w+.*)/gm).join("\n"));
    });
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box
        width={boxWidth * 2 + 10}
      >
        <Paper>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2} style={{ textAlign: 'center' }} >
                  <h1>Frontend Simulator</h1>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell width='25%'><h3>User ID</h3></TableCell>
                <TableCell >{uid}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell width='25%'> <h3>Project Name </h3></TableCell>
                <TableCell >{pid}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell width='25%'> <h3>File Name</h3></TableCell>
                <TableCell>{fileName}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Box>

      <Box display="flex" width={boxWidth * 2 + 10} paddingTop={2}>
        <TextField
          label="User ID"
          inputProps={{ maxLength: 64 }}
          style={{ margin: '0px 8px 0px 0px' }}
          className="fullwidth"
          onChange={(event) => {
            setUID(event.target.value);
          }}
        />

        <TextField
          label="Project Name"
          inputProps={{ maxLength: 64 }}
          style={{ margin: '0px 8px 0px 0px' }}
          className="fullwidth"
          onChange={(event) => {
            setPID(event.target.value);
          }}
        />

        <TextField
          label="File Name"
          inputProps={{ maxLength: 64 }}
          className="fullwidth"
          onChange={(event) => {
            setFileName(event.target.value);
          }}
        />
      </Box>

      <Box display="flex" paddingTop={2}>
        <Box width={boxWidth} paddingRight={1}>
          <TextField
            label="File Contents"
            multiline
            variant="outlined"
            fullWidth
            minRows={10}
            onChange={(event) => {
              setFileContents(event.target.value);
            }}
          />
        </Box>

        <Box width={boxWidth}>
          <TextField
            multiline
            variant="outlined"
            fullWidth
            minRows={10}
            disabled
            value={diff}
            sx={{
              backgroundColor: "#EEF",
            }}
          />
        </Box>
      </Box>

      <Box display="flex" alignItems="center">
        <Box
          paddingTop={2}
          paddingLeft={1}
          paddingRight={1}
          display="flex"
          flexDirection="column"
          alignItems="stretch"
          width={boxWidth}
        >
          <Box paddingBottom={2}>
            <Button
              variant="contained"
              className="fullwidth"
              onClick={() => {
                sendGet(`init/${uid}`);
              }}
            >
              Create User
            </Button>
          </Box>

          <Box paddingBottom={2}>
            <Button
              variant="contained"
              className="fullwidth"
              onClick={() => {
                const payload = `{
                  "fileName" : "${fileName}",
                  "fileContents" : ${JSON.stringify(fileContents)}
                }`;
                sendPost(`${uid}/${pid}`, payload);
              }}
            >
              Write to File
            </Button>
          </Box>

          <Box>
            <Button
              variant="contained"
              className="fullwidth"
              onClick={() => {
                sendGet(`file_exist/${uid}/${pid}/${fileName}`);
              }}
            >
              File Exists in Project?
            </Button>
          </Box>
        </Box>

        <Box
          paddingTop={2}
          paddingRight={1}
          display="flex"
          flexDirection="column"
          alignItems="stretch"
          width={boxWidth}
        >
          <Box paddingBottom={2}>
            <Button
              variant="contained"
              className="fullwidth"
              onClick={() => {
                sendGet(`init/${uid}/${pid}`);
              }}
            >
              Create Project
            </Button>
          </Box>

          <Box paddingBottom={2}>
            <Button
              variant="contained"
              className="fullwidth"
              onClick={() => {
                getDiff(`diff/${uid}/${pid}/${fileName}`);
              }}
            >
              Diff File
            </Button>
          </Box>

          <Box>
            <Button
              variant="contained"
              className="fullwidth"
              onClick={() => {
                sendGet(`required_files/${uid}/${pid}`);
              }}
            >
              Required Files in Project?
            </Button>
          </Box>
        </Box>
      </Box>

      <Box paddingTop={2} display="flex" alignItems="center" width={boxWidth * 2 + 10}>

        <Button
          variant="contained"
          color="error"
          style={{ margin: '0px 8px 0px 0px' }}
          className="fullwidth"
          onClick={() => {
            deletePost(`${uid}`);
          }}
        >
          DELETE USER
        </Button>

        <Button
          variant="contained"
          color="error"
          style={{ margin: '0px 8px 0px 0px' }}
          className="fullwidth"
          onClick={() => {
            deletePost(`${uid}/${pid}`);
          }}
        >
          DELETE Project
        </Button>

        <Button
          variant="contained"
          color="error"
          className="fullwidth"
          onClick={() => {
            deletePost(`${uid}/${pid}/${fileName}`);
          }}
        >
          DELETE Project file
        </Button>
      </Box>

      <Box
        paddingTop={6}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Paper>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell style={{ textAlign: 'center' }} width={100}>
                  <h3>Raw JSON</h3>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>{response === "" ? 'NULL' : response}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
}

export default App;
