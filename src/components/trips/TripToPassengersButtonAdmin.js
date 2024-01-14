import * as React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';


export default function TripToPassengersButtonAdmin(token) {
    const navigate = useNavigate();

    const handleClick= () => {
        navigate('/admin/drivers/'+token.token[1]+'/trips/' + token.token[2] + '/passengers')
    };

    return (
        <Button variant="outlined" onClick={handleClick}>
        Passengers
        </Button>
    );
}