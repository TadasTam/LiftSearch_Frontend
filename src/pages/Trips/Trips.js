//import React from 'react'
import React, { useEffect, useState } from 'react'
import DataTable from '../../components/common/DataTable/DataTable'
import RegisterToTripDialog from '../../components/trips/RegisterToTripDialog';
import DriverButton from '../../components/drivers/DriverButton';
import useToken from '../../useToken';
import { useNavigate } from 'react-router-dom';
import {convertTime, convertDate} from '../../utils'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Trips = () => {
  const [trips, setTrips] = useState([]);

  const [loading, setLoading] = useState(true);
  const { token, setToken } = useToken();
  const navigate = useNavigate();
  
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

  let parsedToken;
  parsedToken = parseJwt(token.accessToken);

  const notifyError = (error) => {
    toast.error(error, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: true
    });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 20 },
    { field: 'tripDate', headerName: 'Date', width: 150 },
    { field: 'seatsCount', headerName: 'Seats', width: 70 },
    { field: 'startTime', headerName: 'Start', width: 70 },
    { field: 'endTime', headerName: 'End', width: 70 },
    { field: 'price', headerName: 'Price', width: 70 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'startCity', headerName: 'Starts', width: 100 },
    { field: 'endCity', headerName: 'Ends', width: 100 },
    { field: 'tripStatus', headerName: 'Status', width: 80 },
    { field: 'Driver INFO',
        renderCell: (cellValues) => {
          return (
            <DriverButton token={[token, cellValues.row.driverId]} >cellValues.row.driverId</DriverButton>
          )
       }, width: 150},
    { field: 'Register',
    renderCell: (cellValues) => {
      return (
        <RegisterToTripDialog token={[token, cellValues.row.id, cellValues.row.driverId, sub]} toast={[toastSuccess, toastError]}></RegisterToTripDialog>
      )
   }, width: 300},

  ];

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

    setLoading(true);
    let status;
    await fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/trips', {
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
      } else {notifyError(error)}
    });
    setLoading(false);
  }, [token]);

  return (
    <div>
      <DataTable
      rows={trips}
      columns={columns}
      loading={loading}/>
      <ToastContainer />
    </div>

  )
}

export default Trips