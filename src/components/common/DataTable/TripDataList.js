import React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import DialogContent from '@mui/material/DialogContent';
import { h3 } from '@mui/material';

function datafield(text) {
  if (text != undefined && text != null && text != "" ) {return text;}
  else {return (<br></br>)}
}

const TripDataList = ({
  row
}) => {
  return (
    <div style={{ }}>
          <DialogContent>
          <h3>Trip date</h3>
          <p>{datafield(row.tripDate)}</p>

          <h3>Seats count</h3>
          <p>{datafield(row.seatsCount)}</p>

          <h3>Start time</h3>
          <p>{datafield(row.startTime)}</p>

          <h3>End time date</h3>
          <p>{datafield(row.endTime)}</p>

          <h3>Price</h3>
          <p>{datafield(row.price)}</p>

          <h3>Description</h3>
          <p>{datafield(row.description)}</p>

          <h3>Start city</h3>
          <p>{datafield(row.startCity)}</p>

          <h3>End city</h3>
          <p>{datafield(row.endCity)}</p>

          <h3>Trip status</h3>
          <p>{datafield(row.tripStatus)}</p>

          <h3>Last edit time</h3>
          <p>{datafield(row.lastEditTime)}</p>

        </DialogContent>
    </div>
  );
}

export default TripDataList