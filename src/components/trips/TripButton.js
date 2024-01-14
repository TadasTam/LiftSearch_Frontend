
import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContentText } from '@mui/material';
import Slide from '@mui/material/Slide';
import DataList from '../common/DataTable/TripDataList'
import {convertTime, convertDate} from '../../utils'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TripButton(token) {
  const [open, setOpen] = React.useState(false);
  const [trip, setTrip] = React.useState();

  const handleClickOpen = async () => {
    await req();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const req = async () => {
    await fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/drivers/' + token.token[1] + '/trips/' + token.token[2], {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer '+ token.token[0].accessToken
      }
    })
    .then(response => response.json())
    .then(json => setTrip(convertJson(json)))
  };

  const convertJson = (row) => {
    if(row.tripDate != undefined){row.tripDate = convertDate(row.tripDate)}
    if(row.lastEditTime != undefined){row.lastEditTime = convertDate(row.lastEditTime)}
    if(row.startTime != undefined){row.startTime = convertTime(row.startTime)}
    if(row.endTime != undefined){row.endTime = convertTime(row.endTime)}
    return row;
  };

  useEffect(async () => {
  },[])

  return (
    <div>
      <Button variant="outlined" color='secondary' onClick={handleClickOpen}>
        Trip: {token.token[2]}
      </Button>
      <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
        <DialogTitle>Trip ID: {token.token[2]}</DialogTitle>
        <DataList
        row={trip}/>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}