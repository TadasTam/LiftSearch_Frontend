//import React from 'react'
import React, { useEffect, useState } from 'react'
import DataTable from '../../components/common/DataTable/DataTable'
import useToken from '../../useToken';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import TravelerButton from '../../components/travelers/TravelerButton';
import TripButton from '../../components/trips/TripButton';


const MyPassengers = () => {
  const [passengers, setPassengers] = useState([]);
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
  if (token){
    sub = parseJwt(token.accessToken).sub
  } else {
    sub = token.token
  }

  let parsedToken = parseJwt(token.accessToken);
  let driverId = parsedToken.driverid;

  const columns = [
    { field: 'Id', headerName: 'ID', width: 30 },
    { field: 'registrationStatus', headerName: 'Status', width: 100 },
    { field: 'startCity', headerName: 'Start city', width: 100 },
    { field: 'endCity', headerName: 'End city', width: 100 },
    { field: 'startAdress', headerName: 'Start adress', width: 120 },
    { field: 'endAdress', headerName: 'End adress', width: 120 },
    { field: 'Traveler INFO',
        renderCell: (cellValues) => {
          return (
            <TravelerButton token={[token, cellValues.row.travelerId]} ></TravelerButton>
          )
       }, width: 150},
       { field: 'Trip INFO',
           renderCell: (cellValues) => {
             return (
               <TripButton token={[token, cellValues.row.driverId, cellValues.row.tripId]} >cellValues.row.tripId</TripButton>
             )
          }, width: 150}

  ];

  const req = async () => {
    setLoading(true);
    let status;
    await fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/drivers/' + parsedToken.driverid + '/passengers', {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer '+ token.accessToken
      }
    })
    .then(response => {status=response.status; return response.json()} )
    .then(json => setPassengers(json))
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
  },[token, driverId])

  return (
    <div>
      {/* <TripsCreateDialog token={token} driverId={driverId} func={req}></TripsCreateDialog> */}
      <DataTable
      rows={passengers}
      columns={columns}
      loading={loading}/>
    </div>

  )
}

export default MyPassengers