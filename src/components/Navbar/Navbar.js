import * as React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { navbarStyles } from './styles';
import { useNavigate } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';

import useToken from '../../useToken';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';


const Navbar = (token) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  
  const navigate = useNavigate();

  function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }

  

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

 const handleCloseNavMenu = (item) => {
   setAnchorElNav(null);
   navigate(item);
 };



  const notAuthedItems = [
    {
      id: 1,
      icon: <LoginIcon/>,
      label: 'Login',
      route: 'login',
    },
    {
      id: 2,
      icon: <HowToRegIcon/>,
      label: 'Register',
      route: 'register',
    }
  ]

  const travelerItems = [
    {
      id: 0,
      label: 'Trips',
      route: 'trips',
    },
    {
      id: 4,
      label: 'Registrations',
      route: 'registrations',
    },
    {
      id: 3,
      icon: <LogoutIcon/>,
      label: 'Logout',
      route: 'logout',
    }
  ]
  
  const driverItems = [
    {
      id: 0,
      label: 'Trips',
      route: 'trips',
    },
    {
      id: 4,
      label: 'Registrations',
      route: 'registrations',
    },
    {
      id: 5,
      label: 'My Trips',
      route: 'mytrips',
    },
    {
      id: 6,
      label: 'My Passengers',
      route: 'mypassengers',
    },
    {
      id: 3,
      icon: <LogoutIcon/>,
      label: 'Logout',
      route: 'logout',
    }
  ]
  
  const adminItems = [
    {
      id: 7,
      label: 'Drivers',
      route: 'admin/drivers',
    },
    {
      id: 8,
      label: 'Travelers',
      route: 'admin/travelers',
    },
    {
      id: 9,
      label: 'Trips',
      route: 'admin/trips',
    },
    {
      id: 3,
      icon: <LogoutIcon/>,
      label: 'Logout',
      route: 'logout',
    }
  ]

  let navbarItems = notAuthedItems;
  if (!token.token)
  {
    navbarItems = notAuthedItems;
  }
  else
  {
    let parsedToken = parseJwt(token.token.accessToken);
    let roles = parsedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    if(roles.includes("Admin"))
    {
      navbarItems = adminItems;
    }
    else if (roles.includes("Driver"))
    {
      navbarItems = driverItems;
    }
    else
    {
      navbarItems = travelerItems;
    }
  }

 return (
  <AppBar position="static" sx={{bgcolor : '#99c24d'}}>
    <Container maxWidth="xl">
      <Toolbar disableGutters>
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/trips"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
        LiftSearch
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="rgba(255,255,255,0.7)"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {navbarItems.map((item, index) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton onClick={() => handleCloseNavMenu(item.route)}>
                <ListItemIcon sx={navbarStyles.icons}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                sx={navbarStyles.text}
                primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
          </Menu>
        </Box>

        <Typography
          variant="h5"
          noWrap
          component="a"
          href=""
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            flexGrow: 1,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
        LiftSearch
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        {navbarItems.map((item, index) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton onClick={() => navigate(item.route)}>
                <ListItemIcon sx={navbarStyles.icons}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                sx={navbarStyles.text}
                primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </Box>

        
      </Toolbar>
    </Container>
  </AppBar>
);
}

export default Navbar