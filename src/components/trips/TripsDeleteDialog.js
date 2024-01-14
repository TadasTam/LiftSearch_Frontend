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

export default function TripsDeleteDialog(token) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const cancel = () => {
    handleClose();
  };

  const submit = async () => {

    let status;
    var response = await fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/drivers/' + token.token[1] + '/trips/' + token.token[2] , {
      method: 'DELETE',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer '+ token.token[0].accessToken
      }
    })
    .then(response => {status=response.status; return response;} )

    if (status < 300)
    {
      token.toast[0]("Trip cancelled succesfully!");
      token.func();
      handleClose();
    }
    else if (status == 401) {handleClose();}
    else {
      console.log(response);
      var rjson = response.json();
      console.log(rjson);
      token.toast[1](rjson);
      handleClose();
    }
  }

  return (
    <div>
      <Button variant="outlined" color='secondary' onClick={handleClickOpen}>
        Delete
      </Button>
      <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
        <DialogTitle sx={{bgcolor : '#e6e3e3'}}>Are you sure you want to delete this trip?</DialogTitle>
        <DialogContent sx={{bgcolor : '#e6e3e3'}}>
          <DialogContentText>Trip's ID</DialogContentText>
          <DialogContentText>{token.token[2]}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{bgcolor : '#e6e3e3'}}>
          <Button onClick={cancel}>No</Button>
          <Button onClick={submit}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}