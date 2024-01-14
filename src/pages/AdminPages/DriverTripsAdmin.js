//import React from 'react'
import React, { useEffect, useState } from 'react'
import DataTable from '../../components/common/DataTable/DataTable'
import useToken from '../../useToken';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import TripsEditDialog from '../../components/trips/TripsEditDialog';
import TripsDeleteDialog from '../../components/trips/TripsDeleteDialog';
import TripToPassengersButtonAdmin from '../../components/trips/TripToPassengersButtonAdmin';
import {convertTime, convertDate} from '../../utils'


const DriverTripsAdmin = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, setToken } = useToken();
  const navigate = useNavigate();
  const {driverId} = useParams();
  
  function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }

  let sub;
  if (token){
    sub = parseJwt(token.accessToken).sub
  } else {
    sub = token.token
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 20 },
    { field: 'tripDate', headerName: 'Date', width: 120 },
    { field: 'seatsCount', headerName: 'Seats', width: 70 },
    { field: 'startTime', headerName: 'Start', width: 70 },
    { field: 'endTime', headerName: 'End', width: 70 },
    { field: 'price', headerName: 'Price', width: 70 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'startCity', headerName: 'Starts', width: 100 },
    { field: 'endCity', headerName: 'Ends', width: 100 },
    { field: 'tripStatus', headerName: 'Status', width: 70 },
   { field: 'Passengers',
   renderCell: (cellValues) => {
     return (
       <TripToPassengersButtonAdmin token={[token, cellValues.row.driverId, cellValues.row.id]} ></TripToPassengersButtonAdmin>
     )
  }, width: 150}
  ];

  const req = async () => {
    setLoading(true);
    let status;
    await fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/drivers/' + driverId + '/trips', {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer '+ token.accessToken
      }
    })
    .then(response => {status=response.status; return response.json()} )
    .then(json => setTrips(convertJson(json)))
    .catch(async (error) =>
    {
      if (status == 401)
      {
        let status2;
        let tokens = await fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/accessToken', {
          method: 'POST',
          headers: {
          'Content-Type':'application/json'
          },
          body: JSON.stringify({
            'RefreshToken': token.refreshToken,
            })
          })
          .then(response => {status2=response.status; return response.json()} )
          .catch(async () =>
          {
            await setToken(undefined);
            navigate('/login');
          })
          if(status2 == 200)
          {
            await setToken(tokens);
          }
          else
          {
            await setToken(undefined);
            navigate('/login');
          }
      }
    });
    setLoading(false);
  };

  const convertJson = (json) => {
    json.forEach((row) => {
      if(row.startTime != undefined){row.startTime = convertTime(row.startTime)}
      if(row.endTime != undefined){row.endTime = convertTime(row.endTime)}
      if(row.tripDate != undefined){row.tripDate = convertDate(row.tripDate)}
    });
    return json;
  };

  useEffect(async () => {
    if (token == undefined)
    {
      navigate('/login');
    }
    await req();  
  },[token, driverId])

  return (
    <div>
      <DataTable
      rows={trips}
      columns={columns}
      loading={loading}/>
    </div>

  )
}

export default DriverTripsAdmin