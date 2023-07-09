import React from 'react';
import { useRoutes } from 'react-router-dom';
import {  CssBaseline, ThemeProvider } from '@mui/material';
import { useSelector } from 'react-redux';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { WagmiConfig } from 'wagmi';
import Router from './routes/Router';
import ThemeSettings from './layouts/full-layout/customizer/ThemeSettings';
import RTL from './layouts/full-layout/customizer/RTL';
import { config } from './wallet';

const App = () => {
  const routing = useRoutes(Router);
  const theme = ThemeSettings();
  const customizer = useSelector((state) => state.CustomizerReducer);
  // const { swInfo } = useSelector((state) => state.swDetails);

  // const CustomAvatar = ({ address, ensImage, size }) => {
  //   return ensImage ? (
  //     <img src={ensImage} width={size} height={size} style={{ borderRadius: 999 }} alt="icon" />
  //   ) : (
  //     <Avatar
  //       alt={swInfo.firstName}
  //       src={swInfo.avatarUrl}
  //       sx={{ width: 56, height: 56, backgroundColor: 'gray' }}
  //     />
  //   );
  // };

  return (
    <WagmiConfig config={config}>
      <ThemeProvider theme={theme}>
        <RTL direction={customizer.activeDir}>
          <CssBaseline />
          {routing}
        </RTL>
      </ThemeProvider>
    </WagmiConfig>
  );
};
export default App;
