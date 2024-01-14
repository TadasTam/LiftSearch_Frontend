import { useEffect } from 'react'
import propTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const Logout = ({token, setToken}) => {
  const navigate = useNavigate();
  console.log(token)
  useEffect(() => {

    fetch('https://dolphin-app-d4vhp.ondigitalocean.app/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer '+ token.accessToken
      },
      body: JSON.stringify({
        'RefreshToken': token.refreshToken
      })
    })
    setToken(undefined);
    navigate('/login');
  });
  return null;
}

Logout.propTypes = {
  setToken: propTypes.func.isRequired
}

export default Logout