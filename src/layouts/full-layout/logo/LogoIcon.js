import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import LogoDark  from '../../../assets/images/logos/logo-dark.png';
import  LogoLight  from '../../../assets/images/logos/logo-white.png';

const LogoIcon = () => {
  const customizer = useSelector((state) => state.CustomizerReducer);
  return (
    <Box sx={{ width: '250px' }}>
      <Link underline="none" to="/">
        {customizer.activeMode === 'dark' ? <img alt='dark logo' src={LogoDark} width={80}/> : <img alt='light logo' src={LogoLight} width={80}/>}
      </Link>
    </Box>
  );
};

export default LogoIcon;
