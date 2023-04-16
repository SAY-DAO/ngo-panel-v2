import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { useDispatch, useSelector } from 'react-redux';
import React, { forwardRef, useEffect } from 'react';
import { LinearProgress, Stack } from '@mui/material';
import Tickets from '../../pages/ticket/Tickets';
import { fetchUserTicketList, openTicketing } from '../../redux/actions/ticketAction';
import { socketRefreshNotifications } from '../../utils/socketHelpers';
import { ADD_TICKET_RESET, UPDATE_TICKET_COLOR_RESET } from '../../redux/constants/ticketConstants';

const Transition = forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
  const dispatch = useDispatch();

  const myTickets = useSelector((state) => state.myTickets);
  const { isTicketingOpen, tickets } = myTickets;

  const ticketById = useSelector((state) => state.ticketById);
  const { ticket: fetchedTicket } = ticketById;

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  useEffect(() => {
    if (isTicketingOpen) {
      dispatch(fetchUserTicketList());
    }
    return () => {
      dispatch({ type: ADD_TICKET_RESET });
      dispatch({ type: UPDATE_TICKET_COLOR_RESET });
    };
  }, []);

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
        {!tickets ? (
          <Stack sx={{ m: 'auto', width: '20%', color: 'grey.500' }} spacing={2}>
            <LinearProgress sx={{ color: (theme) => theme.palette.primary }} />
          </Stack>
        ) : (
          <Tickets />
        )}
      </Dialog>
    </div>
  );
}
