import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RegisterToTripDialog(token) {
  const [open, setOpen] = React.useState(false);
  const [startcity, setstartcity] = React.useState(undefined);
  const [endcity, setendcity] = React.useState(undefined);
  const [startadress, setstartadress] = React.useState(undefined);
  const [endadress, setendadress] = React.useState(undefined);
  const [comment, setcomment] = React.useState(undefined);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const cancel = () => {
    handleClose();
  };

  function makeErrorMessage(errors) {
    let mess = "";
    Object.keys(errors).forEach(function(k){
      mess += k + ": " + errors[k];
  });return mess;};

  const submit = async (event) => {
    event.preventDefault();
    let status;
    var response = await fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/drivers/' + token.token[2] + '/trips/' + token.token[1] + '/passengers', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer '+ token.token[0].accessToken
      },
      body: JSON.stringify({
        'startCity': startcity,
        'endCity': endcity,
        'startAdress': startadress,
        'endAdress': endadress,
        'comment': comment,
      })
    })
    .then(response => {status=response.status; return response;} )

    if (status < 300)
    {
      token.toast[0]("Registered to trip successfully!");
      handleClose();
    }
    else if (status == 422) {
      let rjson = await response.json();
      if (rjson.errors !== undefined) { token.toast[1](makeErrorMessage(rjson.errors))}
      if (rjson.error !== undefined) { token.toast[1](rjson.error)};
    }
    else if (status == 401) {handleClose();}
    else {
      console.log(response);
      let rjson = await response.json();
      console.log(rjson);
      if (rjson.error !== undefined) { token.toast[1](rjson.error)};
      handleClose();
    }
}


  

  return (
    <div>
      <Button variant="outlined" disabled={!token.token[0]} onClick={handleClickOpen} sx={{ marginLeft:5, marginTop:3 }} style={{ maxWidth:500 }}>
        Register to trip
      </Button>
      <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
        <DialogTitle sx={{bgcolor : '#e6e3e3'}}>Register to trip</DialogTitle>
        <DialogContent sx={{bgcolor : '#e6e3e3'}}>
          <form id='my-form' onSubmit={submit}>
          <TextField
            autoFocus
            required
            inputProps={{
              minLength: 4,
              maxLength: 20
            }}
            margin="normal"
            id="startCity"
            label="Start city"
            type="text"
            fullWidth
            variant="standard"
            onChange={e => setstartcity(e.target.value)}
          />
          <TextField
            required
            inputProps={{
              minLength: 4,
              maxLength: 20
            }}
            margin="normal"
            id="endCity"
            label="End city"
            type="text"
            fullWidth
            variant="standard"
            onChange={e => setendcity(e.target.value)}
          />
          <TextField
            margin="normal"
            id="startAdress"
            label="Start adress"
            type="text"
            fullWidth
            variant="standard"
            onChange={e => setstartadress(e.target.value)}
          />
          <TextField
            required
            inputProps={{
              minLength: 4,
              maxLength: 30
            }}
            margin="normal"
            id="endAdress"
            label="End adress"
            type="text"
            fullWidth
            variant="standard"
            onChange={e => setendadress(e.target.value)}
          />
          <TextField
            margin="normal"
            id="comment"
            label="Comment"
            type="text"
            fullWidth
            variant="standard"
            onChange={e => setcomment(e.target.value)}
          />
          </form>
        </DialogContent>
        <DialogActions sx={{bgcolor : '#e6e3e3'}}>
          <Button onClick={cancel}>Cancel</Button>
          <Button form='my-form' type="submit">Register</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}