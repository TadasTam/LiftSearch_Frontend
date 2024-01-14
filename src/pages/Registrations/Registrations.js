import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import DataTable from '../../components/common/DataTable/DataTable'
import useToken from '../../useToken';
import { useNavigate } from 'react-router-dom';
import RegistrationsEditDialog from '../../components/registrations/RegistrationsEditDialog';
import RegistrationsDeleteDialog from '../../components/registrations/RegistrationsDeleteDialog';
import DriverButton from '../../components/drivers/DriverButton';
import TripButton from '../../components/trips/TripButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Registrations = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, setToken } = useToken();
  // const [ ltoken, setLocalToken ] = useState(token);

  function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }

  let parsedToken;
  // console.log(token);
  // console.log(ltoken);
  parsedToken = parseJwt(token.accessToken);

  let roles = parsedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
  
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
    { field: 'id', headerName: 'ID', width: 25 },
    { field: 'registrationStatus', headerName: 'Status', width: 60 },
    { field: 'startCity', headerName: 'Start city', width: 80 },
    { field: 'endCity', headerName: 'End city', width: 80 },
    { field: 'startAdress', headerName: 'Start adress', width: 100 },
    { field: 'endAdress', headerName: 'End adress', width: 100 },
    { field: 'comment', headerName: 'Comment', width: 200 },
    { field: 'Trip INFO',
        renderCell: (cellValues) => {
          return (
            <TripButton token={[token, cellValues.row.driverId, cellValues.row.tripId]} >cellValues.row.tripId</TripButton>
          )
       }, width: 150},
    { field: 'Driver INFO',
        renderCell: (cellValues) => {
          return (
            <DriverButton token={[token, cellValues.row.driverId]} >cellValues.row.driverId</DriverButton>
          )
       }, width: 150},
    { field: 'Edit',
        renderCell: (cellValues) => {
          return (
            <RegistrationsEditDialog token={[token, cellValues.row.driverId, cellValues.row.tripId, cellValues.row.id,
              cellValues.row.startCity, cellValues.row.endCity, cellValues.row.startAdress, cellValues.row.endAdress, cellValues.row.comment]} func={req} toast={[toastSuccess, toastError]} ></RegistrationsEditDialog>
          )
       }, width: 150},
    { field: 'Delete',
        renderCell: (cellValues) => {
          return (
            <RegistrationsDeleteDialog token={[token, cellValues.row.driverId, cellValues.row.tripId, cellValues.row.id]} func={req} toast={[toastSuccess, toastError]} ></RegistrationsDeleteDialog>
          )
    }, width: 150},
  ];

  const req = async () => {
    setLoading(true);
    let status;
    await fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/travelers/' + parsedToken.travelerid + '/passengers', {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer '+ token.accessToken
      }
    })
    .then(response => {status=response.status; return response.json()} )
    .then(json => setRegistrations(json))
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


  useEffect(() => {
    if (token == undefined)
    {
      navigate('/login');
    }
    req()
  }, [token]);

  return (
    <div>
      <DataTable
      rows={registrations}
      columns={columns}
      loading={loading}/>
      <ToastContainer />
    </div>

  )
}

export default Registrations