import React from 'react';
import { Drawer, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import TicketListing from './TicketListing';

const drawerWidth = 240;

const TicketSidebar = ({ isMobileSidebarOpen, onSidebarClose }) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  if (lgUp) {
    return (
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { position: 'relative' },
        }}
        variant="permanent"
      >
        <TicketListing />
      </Drawer>
    );
  }
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        zIndex: 10000,
        [`& .MuiDrawer-paper`]: {
          width: 290,
          paddingTop: '70px',
        },
      }}
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
    >
      <TicketListing />
    </Drawer>
  );
};
TicketSidebar.propTypes = {
  isMobileSidebarOpen: PropTypes.bool,
  onSidebarClose: PropTypes.func,
};

export default TicketSidebar;
