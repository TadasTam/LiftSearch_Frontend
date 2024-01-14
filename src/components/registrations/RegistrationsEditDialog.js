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

export default function RegistrationsEditDialog(token) {
  const [open, setOpen] = React.useState(false);

  const [startCity, setStartCity] = React.useState(token.token[4]);
  const [endCity, setEndCity] = React.useState(token.token[5]);
  const [startAdress, setStartAdress] = React.useState(token.token[6]);
  const [endAdress, setEndAdress] = React.useState(token.token[7]);
  const [comment, setComment] = React.useState(token.token[8]);

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
    var response = await fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/drivers/' + token.token[1] + '/trips/' + token.token[2] + '/passengers/' + token.token[3], {
      method: 'PUT',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer '+ token.token[0].accessToken
      },
      body: JSON.stringify({
        'startCity': startCity,
        'endCity': endCity,
        'startAdress': startAdress,
        'endAdress': endAdress,
        'comment': comment,
      })
    })
    .then(response => {status=response.status; return response;} )

    if (status < 300)
    {
      token.toast[0]("Edited trip successfully!");
      token.func();
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
      if (rjson.errors !== undefined) { token.toast[1](makeErrorMessage(rjson.errors))}
      if (rjson.error !== undefined) { token.toast[1](rjson.error)};
      handleClose();
    }
    // .then(data => data.json())
    // .then(data => {
    //   if (data.errors !== undefined || data == undefined) { token.toast[1](makeErrorMessage(data.errors)); failed = true;}
    //   if (data.error !== undefined || data == undefined) { token.toast[1](data.error); failed = true;}
    // })
    // .catch((e) => {handleClose(); token.toast[1](e); failed = true; })

  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Edit
      </Button>
      <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
        <DialogTitle sx={{bgcolor : '#e6e3e3'}}>Edit registration</DialogTitle>
        <DialogContent sx={{bgcolor : '#e6e3e3'}}>
          <form id='my-form' onSubmit={submit}>
          <TextField
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
            defaultValue={token.token[4]}
            onChange={e => setStartCity(e.target.value)}
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
            defaultValue={token.token[5]}
            onChange={e => setEndCity(e.target.value)}
          />
          <TextField
            required
            inputProps={{
              minLength: 4,
              maxLength: 30
            }}
            margin="normal"
            id="startAdress"
            label="Start adress"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={token.token[6]}
            onChange={e => setStartAdress(e.target.value)}
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
            defaultValue={token.token[7]}
            onChange={e => setEndAdress(e.target.value)}
          />
          <TextField
            margin="normal"
            id="comment"
            label="Comment"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={token.token[8]}
            onChange={e => setComment(e.target.value)}
          />
          </form>
        </DialogContent>
        <DialogActions sx={{bgcolor : '#e6e3e3'}}>
          <Button onClick={cancel}>Cancel</Button>
          <Button form='my-form' type="submit" variant="outlined">Edit</Button>
          {/* <Button onClick={submit}>Edit</Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
}