import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { useDispatch, useSelector } from 'react-redux';
import React, { forwardRef, useEffect } from 'react';
import Tickets from '../../pages/ticket/Tickets';
import { fetchTicketList, openTicketing } from '../../redux/actions/ticketAction';
import { socketRefreshNotifications } from '../../utils/socketHelpers';

const Transition = forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
  const dispatch = useDispatch();

  const myTickets = useSelector((state) => state.myTickets);
  const { isTicketingOpen } = myTickets;

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  // useEffect(() => {
  //   if (swInfo && isTicketingOpen) {
  //     dispatch(fetchTicketList());
  //   }
  // }, [isTicketingOpen]);

  const handleClose = () => {
    dispatch(openTicketing(false));
    socketRefreshNotifications(swInfo); // update ticket notifications
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
