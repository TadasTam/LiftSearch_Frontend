
import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContentText } from '@mui/material';
import Slide from '@mui/material/Slide';
import DataList from '../common/DataTable/DriverDataList'
import {convertTime, convertDate} from '../../utils'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DriverButton(token) {
  const [open, setOpen] = React.useState(false);
  const [driver, setDriver] = React.useState();

  const handleClickOpen = async () => {
    await req();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const req = async () => {
    await fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/drivers/' + token.token[1], {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer '+ token.token[0].accessToken
      }
    })
    .then(response => response.json())
    .then(json => setDriver(convertJson(json)))
  };

  const convertJson = (row) => {
    if(row.registeredDriverDate != undefined){row.registeredDriverDate = convertDate(row.registeredDriverDate)}
    if(row.lastTripDate != undefined){row.lastTripDate = convertDate(row.lastTripDate)}
    return row;
  };

  useEffect(async () => {
  },[])

  return (
    <div>
      <Button variant="outlined" color='secondary' onClick={handleClickOpen}>
        Driver: {token.token[1]}
      </Button>
      <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
        <DialogTitle sx={{bgcolor : '#e6e3e3'}}>Driver ID: {token.token[1]}</DialogTitle>
        
        <DataList
        row={driver}/>
        <DialogActions sx={{bgcolor : '#e6e3e3'}}>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}