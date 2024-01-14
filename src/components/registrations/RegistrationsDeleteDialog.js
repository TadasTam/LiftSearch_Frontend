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

export default function RegistrationsDeleteDialog(token) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const submit = async () => {

    // var failed = false;
    // await fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/drivers/' + token.token[1] + '/trips/' + token.token[2] + '/passengers/' + token.token[3], {
    //   method: 'DELETE',
    //   headers: {
    //     'Content-Type':'application/json',
    //     'Authorization':'Bearer '+ token.token[0].accessToken
    //   }
    // })
    // .then(data => data.json())
    // .then(data => {
    //   if (data.error !== undefined || data == undefined) { token.toast[1](data.error); failed = true;}
    // })
    // .catch((e) => {handleClose(); token.toast[1](e); return;})
    // // .catch((e) => {handleClose(); token.toast[1](e); failed = true; })

    // console.log(failed)
    // if (!failed)
    // {
    //   token.toast[0]("Travel cancelled succesfully!");
    //   token.func();
    // }
    // handleClose();
    

    let status;
    var response = await fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/drivers/' + token.token[1] + '/trips/' + token.token[2] + '/passengers/' + token.token[3], {
      method: 'DELETE',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer '+ token.token[0].accessToken
      }
    })
    .then(response => {status=response.status; return response;} )

    if (status < 300)
    {
      token.toast[0]("Travel cancelled succesfully!");
      token.func();
      handleClose();
    }
    else {
      console.log(response);
      var rjson = response.json();
      console.log(rjson);
      token.toast[1](rjson);
      handleClose();
    }
  }

  const notSubmit = () => {
    handleClose();
  }

  return (
    <div>
      <Button variant="outlined" color='secondary' onClick={handleClickOpen}>
        Cancel
      </Button>
      <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
        <DialogTitle sx={{bgcolor : '#e6e3e3'}}>You sure want to cancel registration?</DialogTitle>
        <DialogContent sx={{bgcolor : '#e6e3e3'}}>
          <DialogContentText>Trip's id</DialogContentText>
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