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

export default function TripsEditDialog(token) {
  const [open, setOpen] = React.useState(false);

  const [seatsCount, setSeatsCount] = React.useState(undefined);
  const [startTime, setStartTime] = React.useState(undefined);
  const [endTime, setEndTime] = React.useState(undefined);
  const [price, setPrice] = React.useState(undefined);
  const [description, setDescription] = React.useState(undefined);
  const [startCity, setStartCity] = React.useState(undefined);
  const [endCity, setEndCity] = React.useState(undefined);

  const handleClickOpen = () => {
    setSeatsCount(token.token[3]);
    setStartTime(token.token[4]);
    setEndTime(token.token[5]);
    setPrice(token.token[6]);
    setDescription(token.token[7]);
    setStartCity(token.token[8]);
    setEndCity(token.token[9]);
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
    var response = await fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/drivers/' + token.token[1] + '/trips/' + token.token[2] , {
      method: 'PUT',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer '+ token.token[0].accessToken
      },
      body: JSON.stringify({
        'seatsCount': seatsCount,
        'startTime': startTime,
        'endTime': endTime,
        "price": price,
        'description':description,
        'startCity': startCity,
        'endCity': endCity
      })
    })
    .then(response => {status=response.status; return response;} )

    if (status < 300)
    {
      token.toast[0]("Trip edited successfully!");
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
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Edit
      </Button>
      <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
        <DialogTitle sx={{bgcolor : '#e6e3e3'}}>Edit trip</DialogTitle>
        <DialogContent sx={{bgcolor : '#e6e3e3'}}>
          <form id='my-form' onSubmit={submit}>
          <TextField
            required
            autoFocus
            margin="normal"
            id="seatsCount"
            label="Seats count"
            type="number"
            inputProps={{
              min: 1
            }}
            fullWidth
            variant="standard"
            defaultValue={seatsCount}
            onChange={e=> setSeatsCount(e.target.value)}
          />
          <TextField
            autoFocus
            margin="normal"
            id="startTime"
            label="Start time"
            type="number"
            inputProps={{
              min: 0,
              max: 1440
            }}
            fullWidth
            variant="standard"
            defaultValue={startTime}
            onChange={e => setStartTime(e.target.value)}
          />
          <TextField
            autoFocus
            margin="normal"
            id="endTime"
            label="End time"
            type="number"
            inputProps={{
              min: 0,
              max: 1440
            }}
            fullWidth
            variant="standard"
            defaultValue={endTime}
            onChange={e => setEndTime(e.target.value)}
          />
          <TextField
            required
            autoFocus
            margin="normal"
            id="price"
            label="Price"
            type="number"
            step="0.01"
            inputProps={{
              min: 0
            }}
            fullWidth
            variant="standard"
            defaultValue={price}
            onChange={e => setPrice(e.target.value)}
          />
          <TextField
            autoFocus
            required
            margin="normal"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={description}
            onChange={e => setDescription(e.target.value)}
          />
          <TextField
            required
            inputProps={{
              minLength: 4,
              maxLength: 20
            }}
            autoFocus
            margin="normal"
            id="startCity"
            label="Start city"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={startCity}
            onChange={e => setStartCity(e.target.value)}
          />
          <TextField
            required
            inputProps={{
              minLength: 4,
              maxLength: 20
            }}
            autoFocus
            margin="normal"
            id="endCity"
            label="End city"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={endCity}
            onChange={e => setEndCity(e.target.value)}
          />
          </form>
        </DialogContent>
        <DialogActions sx={{bgcolor : '#e6e3e3'}}>
          <Button onClick={cancel}>Cancel</Button>
          <Button form='my-form' type="submit" variant="outlined">Edit trip</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}