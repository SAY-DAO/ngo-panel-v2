import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

const LogoIcon = () => {
  const customizer = useSelector((state) => state.CustomizerReducer);
  return (
    <Box
      sx={{
        width: '250px',
        fontFamily: 'Exodar-outline !important',
        textAlign: 'center',
      }}
    >
      <Link
        to="https://saydao.org"
        style={{
          textDecoration: 'none',
        }}
      >
        {customizer.activeMode === 'dark' ? (
          // <img alt="dark logo" src={LogoDark} width={80} />
          <span style={{ color: '#a1a1a1', fontSize: '2em', fontWeight: 200 }}>SAY DAO</span>
        ) : (
          // LogoLight && <img alt="light logo" src={LogoLight} width={80} />
          <span style={{ color: '#a1a1a1', fontSize: ' 2em', fontWeight: 200 }}>SAY DAO</span>
        )}
      </Link>
    </Box>
  );
};

export default LogoIcon;
