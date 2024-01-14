import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContentText } from '@mui/material';
import Slide from '@mui/material/Slide';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TravelerDeleteDialog(token) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  function makeErrorMessage(errors) {
    let mess = "";
    Object.keys(errors).forEach(function(k){
      mess += k + ": " + errors[k];
  });return mess;};

  const submit = async () => {

    let status;
    var response = await fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/travelers/' + token.token[1], {
      method: 'DELETE',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer '+ token.token[0].accessToken
      }
    })
    .then(response => {status=response.status; return response;} )

    if (status < 300)
    {
      token.toast[0]("Traveler removed succesfully!");
      token.func();
    }
    else if (status == 422) {
      let rjson = await response.json();
      if (rjson.errors !== undefined) { token.toast[1](makeErrorMessage(rjson.errors))}
      if (rjson.error !== undefined) { token.toast[1](rjson.error)};
    }
    else if (status == 401) {}
    else {
      console.log(response);
      let rjson = await response.json();
      console.log(rjson);
      token.toast[1](rjson);
    }
    handleClose();
  }

  const notSubmit = () => {
    handleClose();
  }

  return (
    <div>
      <Button variant="outlined" color='secondary' onClick={handleClickOpen}>
        Remove
      </Button>
      <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
        <DialogTitle sx={{bgcolor : '#e6e3e3'}}>Remove this traveler?</DialogTitle>
        <DialogContent sx={{bgcolor : '#e6e3e3'}}>
          <DialogContentText>Traveler id</DialogContentText>
          <DialogContentText>{token.token[2]}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{bgcolor : '#e6e3e3'}}>
          <Button onClick={notSubmit}>No</Button>
          <Button onClick={submit}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}