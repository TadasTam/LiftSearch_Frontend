import React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import DialogContent from '@mui/material/DialogContent';
import { DialogContentText } from '@mui/material';

function datafield(text) {
  if (text != undefined && text != null && text != "" ) {return text;}
  else {return (<br></br>)}
}

const DriverDataList = ({
  row
}) => {
  return (
    <div style={{ }}>
          <DialogContent>
          <h3>Name</h3>
          <p>{datafield(row.name)}</p>

          <h3>Bio</h3>
          <p>{datafield(row.driverBio)}</p>

          <h3>Email</h3>
          <p>{datafield(row.email)}</p>

          <h3>Registration date</h3>
          <p>{datafield(row.registeredDriverDate)}</p>

          <h3>Last trip date</h3>
          <p>{datafield(row.lastTripDate)}</p>

          <h3>Number of trips</h3>
          <p>{datafield(row.tripsCountDriver)}</p>

          <h3>Trips cancelled</h3>
          <p>{datafield(row.cancelledCountDriver)}</p>

        </DialogContent>
    </div>
  );
}

export default DriverDataList