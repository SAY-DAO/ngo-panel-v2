import React from 'react';
import { useRoutes } from 'react-router-dom';
import { Avatar, CssBaseline, ThemeProvider } from '@mui/material';
import { useSelector } from 'react-redux';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { WagmiConfig } from 'wagmi';
import swDev from './swDev';
import Router from './routes/Router';
import ThemeSettings from './layouts/full-layout/customizer/ThemeSettings';
import RTL from './layouts/full-layout/customizer/RTL';
import { wagmiClient } from './wallet';

const App = () => {
  const routing = useRoutes(Router);
  const theme = ThemeSettings();
  const customizer = useSelector((state) => state.CustomizerReducer);
  const { swInfo } = useSelector((state) => state.swDetails);

  // eslint-disable-next-line no-unused-vars, react/prop-types
  const CustomAvatar = ({ address, ensImage, size }) => {
    return ensImage ? (
      <img src={ensImage} width={size} height={size} style={{ borderRadius: 999 }} alt="icon" />
    ) : (
      <Avatar
        alt={swInfo.firstName}
        src={swInfo.avatarUrl}
        sx={{ width: 56, height: 56, backgroundColor: 'gray' }}
      />
    );
  };

  return (
    <WagmiConfig client={wagmiClient}>
      <ThemeProvider theme={theme}>
        <RTL direction={customizer.activeDir}>
          <CssBaseline />
          {routing}
        </RTL>
      </ThemeProvider>
    </WagmiConfig>
  );
};
swDev();
export default App;
