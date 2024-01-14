import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import de from 'date-fns/locale/de';
registerLocale('de', de)

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function TripsCreateDialog(token) {
  const [open, setOpen] = React.useState(false);

  const [tripDate, setTripDate] = React.useState(new Date());
  const [seatsCount, setSeatsCount] = React.useState(undefined);
  const [startTime, setStartTime] = React.useState(undefined);
  const [endTime, setEndTime] = React.useState(undefined);
  const [price, setPrice] = React.useState(undefined);
  const [description, setDescription] = React.useState(undefined);
  const [startCity, setStartCity] = React.useState(undefined);
  const [endCity, setEndCity] = React.useState(undefined);

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
    var response = await fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/drivers/'+token.driverId+'/trips/', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer '+ token.token.accessToken
      },
      body: JSON.stringify({
        'tripDate': tripDate,
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
      token.toast[0]("Trip created successfully!");
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
      if (rjson.error !== undefined) { token.toast[1](rjson.error)};
      if (rjson.errors !== undefined) { token.toast[1](makeErrorMessage(rjson.errors))};
      handleClose();
    }
  }

  return (
    <div>
      <Button variant="outlined" disabled={!token.token} onClick={handleClickOpen} sx={{ marginLeft:5, marginTop:3 }}>
        Create Trip
      </Button>
      <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
        <DialogTitle sx={{bgcolor : '#e6e3e3'}}>Create a trip</DialogTitle>
        <DialogContent sx={{bgcolor : '#e6e3e3'}}>
          <form id='my-form' onSubmit={submit}>
          <DatePicker
            required
            locale="de"
            margin="normal"
            fullWidth
            variant="standard"
            id="tripDate"
            label="Trip date"
            selected={tripDate}
            onChange={(e) => setTripDate(e)}
          />
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
            onChange={e => setEndCity(e.target.value)}
          />
          </form>
        </DialogContent>
        <DialogActions sx={{bgcolor : '#e6e3e3'}}>
          <Button onClick={cancel}>Cancel</Button>
          <Button form='my-form' type="submit" variant="outlined">Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}