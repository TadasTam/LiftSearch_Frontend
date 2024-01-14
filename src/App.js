import './index.css';
import Navbar from './components/Navbar/Navbar';
import Grid from '@mui/material/Grid'
import { Outlet } from 'react-router-dom';
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import DriversAdmin from './pages/AdminPages/DriversAdmin';
import TravelersAdmin from './pages/AdminPages/TravelersAdmin';
import TripsAdmin from './pages/AdminPages/TripsAdmin';
import DriverTripsAdmin from './pages/AdminPages/DriverTripsAdmin';
import TravelerPassengersAdmin from './pages/AdminPages/TravelerPassengersAdmin';
import PassengersAdmin from './pages/AdminPages/PassengersAdmin';

import Trips from './pages/Trips/Trips';
import Registrations from './pages/Registrations/Registrations';
import MyTrips from './pages/Trips/MyTrips';
import MyPassengers from './pages/Passengers/MyPassengers';
import Passengers from './pages/Passengers/Passengers';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Logout from './pages/Logout/Logout';
import Welcome from './pages/Welcome/Welcome';
import useToken from './useToken';
import Footer from './components/footer/Footer';

function App() {

  const { token, setToken } = useToken();

  function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }

  if (!token) {
    return (
      <BrowserRouter>
      <Grid container>
        <Navbar token={token}/>
        <Outlet />
      </Grid>
      <Routes>
          <Route path="/trips" element={<Login setToken={setToken}/>}/>
          <Route path="/registrations" element={<Login setToken={setToken}/>}/>
          <Route path="/mytrips" element={<Login setToken={setToken}/>}/>
          <Route path="/mypassengers" element={<Login setToken={setToken}/>}/>
          <Route path="/drivers/:driverId/trips/:tripId/passengers" element={ <Login setToken={setToken}/>}/>

          <Route path="/admin/drivers" element={<Login setToken={setToken}/>}/>
          <Route path="/admin/travelers" element={<Login setToken={setToken}/>}/>
          <Route path="/admin/trips" element={<Login setToken={setToken}/>}/>
          <Route path="/admin/drivers/:driverId/trips" element={<Login setToken={setToken}/>}/>
          <Route path="/admin/drivers/:driverId/trips/:tripId/passengers" element={<Login setToken={setToken}/>}/>
          <Route path="/admin/travelers/:travelerId/passengers/" element={<Login setToken={setToken}/>}/>

          <Route path="/login" element={<Login setToken={setToken}/>}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/logout" element={<Welcome />}/>
          <Route path="/welcome" element={<Welcome />}/>
          <Route index element={<Login setToken={setToken}/>}/>
      </Routes>
      <Footer></Footer>
      </BrowserRouter>
    );
  }

  let parsedToken = parseJwt(token.accessToken);
  let roles = parsedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
  if(roles.includes("Admin"))
  {
    return (
      <BrowserRouter>
      <Grid container>
        <Navbar token={token}/>
        <Outlet />
      </Grid>
      <Routes>
          <Route path="/trips" element={<DriversAdmin />}/>
          <Route path="/registrations" element={<DriversAdmin />}/>

          <Route path="/mytrips" element={<DriversAdmin />}/>
          <Route path="/mypassengers" element={<DriversAdmin />}/>
          <Route path="/drivers/:driverId/trips/:tripId/passengers" element={<DriversAdmin />}/>
    
          <Route path="/admin/drivers" element={<DriversAdmin />}/>
          <Route path="/admin/travelers" element={<TravelersAdmin />}/>
          <Route path="/admin/trips" element={<TripsAdmin />}/>
          <Route path="/admin/drivers/:driverId/trips" element={ <DriverTripsAdmin />}/>
          <Route path="/admin/drivers/:driverId/trips/:tripId/passengers" element={ <PassengersAdmin />}/>
          <Route path="/admin/travelers/:travelerId/passengers/" element={<TravelerPassengersAdmin />}/>
    
          <Route path="/login" element={<Trips />}/>
          <Route path="/register" element={<Trips />}/>
          <Route path="/logout" element={<Logout setToken={setToken} token={token} />}/>
          <Route index element={<Trips token={token}/>}/>
      </Routes>
      <Footer></Footer>
      </BrowserRouter>
      );
  }
  else if (roles.includes("Driver"))
  {
    return (
      <BrowserRouter>
      <Grid container>
        <Navbar token={token}/>
        <Outlet />
      </Grid>
      <Routes>
          <Route path="/trips" element={<Trips/>}/>
          <Route path="/registrations" element={<Registrations/>}/>

          <Route path="/mytrips" element={<MyTrips/>}/>
          <Route path="/mypassengers" element={<MyPassengers/>}/>
          <Route path="/drivers/:driverId/trips/:tripId/passengers" element={ <Passengers />}/>
    
          <Route path="/admin/drivers" element={<Trips/>}/>
          <Route path="/admin/travelers" element={<Trips/>}/>
          <Route path="/admin/trips" element={<Trips/>}/>
          <Route path="/admin/drivers/:driverId/trips" element={<Trips/>}/>
          <Route path="/admin/drivers/:driverId/trips/:tripId/passengers" element={<Trips/>}/>
          <Route path="/admin/travelers/:travelerId/passengers/" element={<Trips/>}/>
    
          <Route path="/login" element={<Trips />}/>
          <Route path="/register" element={<Trips />}/>
          <Route path="/logout" element={<Logout setToken={setToken} token={token} />}/>
          <Route index element={<Trips token={token}/>}/>
      </Routes>
      <Footer></Footer>
      </BrowserRouter>
      );
  }
  else if (roles.includes("Traveler"))
  {
    return (
      <BrowserRouter>
      <Grid container>
        <Navbar token={token}/>
        <Outlet />
      </Grid>
      <Routes>
          <Route path="/trips" element={<Trips/>}/>
          <Route path="/registrations" element={<Registrations/>}/>

          <Route path="/mytrips" element={<Trips/>}/>
          <Route path="/mypassengers" element={<Trips/>}/>
          <Route path="/drivers/:driverId/trips/:tripId/passengers" element={<Trips/>}/>
    
          <Route path="/admin/drivers" element={<Trips/>}/>
          <Route path="/admin/travelers" element={<Trips/>}/>
          <Route path="/admin/trips" element={<Trips/>}/>
          <Route path="/admin/drivers/:driverId/trips" element={<Trips/>}/>
          <Route path="/admin/drivers/:driverId/trips/:tripId/passengers" element={<Trips/>}/>
          <Route path="/admin/travelers/:travelerId/passengers/" element={<Trips/>}/>
    
          <Route path="/login" element={<Trips />}/>
          <Route path="/register" element={<Trips />}/>
          <Route path="/logout" element={<Logout setToken={setToken} token={token} />}/>

          <Route index element={<Trips token={token}/>}/>
      </Routes>
      <Footer></Footer>
      </BrowserRouter>
      );
  }


}
//<Route path="login" element={<Login />}/>
export default App;
