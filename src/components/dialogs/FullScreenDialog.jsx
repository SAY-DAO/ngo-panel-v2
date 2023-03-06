import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { useDispatch, useSelector } from 'react-redux';
import Tickets from '../../pages/ticket/Tickets';
import { openTicketing } from '../../redux/actions/ticketAction';

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
  const dispatch = useDispatch();

  const myTickets = useSelector((state) => state.myTickets);
  const { isTicketingOpen } = myTickets;

  const handleClose = () => {
    dispatch(openTicketing(false));
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={isTicketingOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
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
