import * as React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';


export default function TravelerToPassengersButton(token) {
    const navigate = useNavigate();

    const handleClick= () => {
        navigate('/admin/travelers/'+token.token[1]+'/passengers/')
    };

    return (
        <Button variant="outlined" onClick={handleClick}>
        Registrations
        </Button>
    );
}