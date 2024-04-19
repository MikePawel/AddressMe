import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useCustomSnackbar } from "./../../hooks/usePopup";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Intro() {
  const [open, setOpen] = React.useState(false);

  const { showPopup } = useCustomSnackbar();

  const sendData = () => {
    fetch("http://localhost:8000/createKeys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle response from server
        console.log(data);
        if (data.success == true) {
          <SnackbarProvider />;
          enqueueSnackbar("Successfully created new key paircess", {
            variant: "success",
          });
        }
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  };
  const handleCloseAndGenerate = () => {
    sendData();
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <button onClick={handleClickOpen}>Create new Keypair</button>
      <SnackbarProvider />
      <React.Fragment>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Create new Keypair?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              In order to encrypt addresses you must first create an RSA key
              pair. Should you have done this step already, click 'Dismiss'. To
              create a new key pair, click 'Generate new Keys'.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Dismiss</Button>
            <Button onClick={handleCloseAndGenerate}>Generate new Keys</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </ThemeProvider>
  );
}
