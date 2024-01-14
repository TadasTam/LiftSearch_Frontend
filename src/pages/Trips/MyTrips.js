//import React from 'react'
import React, { useEffect, useState } from 'react'
import DataTable from '../../components/common/DataTable/DataTable'
import useToken from '../../useToken';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import TripsCreateDialog from '../../components/trips/TripsCreateDialog';
import TripsEditDialog from '../../components/trips/TripsEditDialog';
import TripsDeleteDialog from '../../components/trips/TripsDeleteDialog';
import TripToPassengersButton from '../../components/trips/TripToPassengersButton';
import {convertTime, convertDate} from '../../utils'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, setToken } = useToken();
  const navigate = useNavigate();
  
  function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }

  const toastError = (error) => {
    toast.error(error, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: true
    });
  };
  const toastSuccess = (text) => {
    toast.success(text, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: true
    });
  };

  let sub;
  if (token){
    sub = parseJwt(token.accessToken).sub
  } else {
    sub = token.token
  }

  let parsedToken = parseJwt(token.accessToken);
  let driverId = parsedToken.driverid;

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
    { field: 'Edit',
        renderCell: (cellValues) => {
          return (
            <TripsEditDialog token={[token, cellValues.row.driverId, cellValues.row.id, cellValues.row.seatsCount, cellValues.row.startTime, cellValues.row.endTime, cellValues.row.price, cellValues.row.description, cellValues.row.startCity, cellValues.row.endCity]} func={req} toast={[toastSuccess, toastError]} ></TripsEditDialog>
          )
      }, width: 100},
    { field: 'Delete',
       renderCell: (cellValues) => {
         return (
           <TripsDeleteDialog token={[token, cellValues.row.driverId, cellValues.row.id]} func={req} toast={[toastSuccess, toastError]} ></TripsDeleteDialog>
         )
   }, width: 100},
   { field: 'Passengers',
   renderCell: (cellValues) => {
     return (
       <TripToPassengersButton token={[token, cellValues.row.driverId, cellValues.row.id]} ></TripToPassengersButton>
     )
  }, width: 150}
  ];

  const req = async () => {
    setLoading(true);
    let status;
    await fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/drivers/' + parsedToken.driverid + '/trips', {
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
      <TripsCreateDialog token={token} driverId={driverId} func={req} toast={[toastSuccess, toastError]} ></TripsCreateDialog>
      <DataTable
      rows={trips}
      columns={columns}
      loading={loading}/>
      <ToastContainer />
    </div>

  )
}

export default MyTrips