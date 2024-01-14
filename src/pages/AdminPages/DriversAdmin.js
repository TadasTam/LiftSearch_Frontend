//import React from 'react'
import React, { useEffect, useState } from 'react'
import DataTable from '../../components/common/DataTable/DataTable'
import useToken from '../../useToken';
import { useNavigate } from 'react-router-dom';
import {convertTime, convertDate} from '../../utils'
import DriverToTripsButton from '../../components/drivers/DriverToTripsButton';
import DriverDeleteDialog from '../../components/admin/DriverDeleteDialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const DriversAdmin = () => {
  const [drivers, setDrivers] = useState([]);
  
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
  let sub;
  if (token.token){
    sub = parseJwt(token.token.accessToken)
  } else {
    sub = token.token
  }

  let parsedToken;
  parsedToken = parseJwt(token.accessToken);

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

  const columns = [
    { field: 'id', headerName: 'Driver ID', width: 20 },
    { field: 'name', headerName: 'Name', width: 120 },
    { field: 'email', headerName: 'Email', width: 120 },
    { field: 'driverBio', headerName: 'Bio', width: 200 },
    { field: 'registeredDriverDate', headerName: 'Registered', width: 100 },
    { field: 'lastTripDate', headerName: 'Last trip', width: 100 },
    { field: 'tripsCountDriver', headerName: 'Trips count', width: 60 },
    { field: 'cancelledCountDriver', headerName: 'Cancelled trips', width: 60 },
    { field: 'Trips',
    renderCell: (cellValues) => {
      return (
        <DriverToTripsButton token={[token, cellValues.row.id]} ></DriverToTripsButton>
      )
   }, width: 150},
   { field: 'Delete',
       renderCell: (cellValues) => {
         return (
           <DriverDeleteDialog token={[token, cellValues.row.id]} func={req} toast={[toastSuccess, toastError]}></DriverDeleteDialog>
         )
   }, width: 150},
  ];

  useEffect(() => {
    if (token == undefined)
    {
      navigate('/login');
    }
    req()
  }, [token]);

  const req = async () => {
    setLoading(true);
    let status;
    fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/drivers', {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer '+ token.accessToken
      }
    })
    .then(response => {status=response.status; return response.json()} )
    .then(json => setDrivers(convertJson(json)))
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

  const convertJson = (row) => {
    if(row.registeredDriverDate != undefined){row.registeredDriverDate = convertDate(row.registeredDriverDate)}
    if(row.lastTripDate != undefined){row.lastTripDate = convertDate(row.lastTripDate)}
    return row;
  };

  return (
    <div>
      <DataTable
      rows={drivers}
      columns={columns}
      loading={loading}/>
      <ToastContainer />
    </div>

  )
}

export default DriversAdmin