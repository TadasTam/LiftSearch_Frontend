import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContentText } from '@mui/material';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TravelerToDriverDialog(token) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submit = async () => {

    var failed = false;
    await fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/drivers/', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer '+ token.token[0].accessToken
      },
      body: JSON.stringify({
        'travelerId': token.token[1]
      })
    })
    .then(data => data.json())
    .then(data => {
      if (data.error !== undefined || data == undefined) { token.toast[1](data.error); failed = true;}
    })
    .catch((e) => {handleClose(); token.toast[1](e); return;})

    if (!failed)
    {
      token.toast[0]("Driver created succesfully!");
    }

    handleClose();
  }

  const notSubmit = () => {
    handleClose();
  }

  return (
    <div>
      <Button variant="outlined" color='secondary' onClick={handleClickOpen}>
        Make a driver
      </Button>
      <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
        <DialogTitle>Make this traveler a driver</DialogTitle>
        <DialogContent>
          <DialogContentText>Traveler id</DialogContentText>
          <DialogContentText>{token.token[1]}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={notSubmit}>No</Button>
          <Button onClick={submit}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}