import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { PropTypes } from 'prop-types';
import Tickets from '../../pages/ticket/Tickets';

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ openTicket, setOpenTicket }) {
  const handleClose = () => {
    setOpenTicket(false);
  };

  return (
    <div>
      <Dialog fullScreen open={openTicket} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Tickets />
      </Dialog>
    </div>
  );
}

FullScreenDialog.propTypes = {
  setOpenTicket: PropTypes.func,
  openTicket: PropTypes.bool,
};
