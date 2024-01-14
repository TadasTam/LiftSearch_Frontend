import React, { useState } from 'react';
import propTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { Grid } from '@mui/material';
import './Login.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

async function loginUser(credentials, setToken) {
  var result;
  await fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/login', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify(credentials)
  })
  .then(data => data.json())
  .then(data => {
    if (data.error !== undefined || data == undefined) { notifyError(data.error); result = false; }
    else {setToken(data);  result = true;}
  })

  return result;
}

// toast.configure({autoClose: 2000});
const notifyError = (error) => {
  toast.error(error, {
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: true
  });
};
const showSuccess = () => {
  toast.success("Logged in successfully!", {
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: true
  });
};

const Login = ({setToken}) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    var result = await loginUser({
      username,
      password
    }, setToken)

    if (result) {
      showSuccess();
      navigate('/trips');
    }
  }

  const paperStyle={padding: 20, height:'30vh', width:280, margin:"20px auto"}
  return (
    <Grid style={paperStyle}>
        <TextField id="outlined-basic" autoFocus fullWidth label="Username" variant="outlined" style={{padding:7}} onChange={e => setUsername(e.target.value)}/>
        <TextField id="outlined-basic3" fullWidth label="Password" type="password" style={{padding:7}} variant="outlined" onChange={e => setPassword(e.target.value)}/>
        <Button type='submit' color='primary' variant="contained" fullWidth   onClick={handleSubmit}>Login</Button>
        <ToastContainer />
    </Grid>
  )
}



Login.propTypes = {
  setToken: propTypes.func.isRequired
}

export default Login