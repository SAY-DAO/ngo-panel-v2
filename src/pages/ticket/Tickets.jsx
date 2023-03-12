import React, { useContext, useState, useEffect } from 'react';
import { Card, Divider, Box, Stack, Snackbar, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import TicketContent from '../../components/ticket/TicketContent';
import TicketMsgSent from '../../components/ticket/TicketMsgSent';
import TicketSidebar from '../../components/ticket/TicketSidebar';
import { WebsocketContext } from '../../contexts/WebsocketContext';
import {
  socketRefreshNotifications,
  socketJoinRoom,
  socketLeaveRoom,
} from '../../utils/socketHelpers';
import {
  ADD_TICKET_MSG_RESET,
  UPDATE_TICKET_COLOR_RESET,
} from '../../redux/constants/ticketConstants';
import { addTicketMsg, fetchTicketById, updateTicketColor } from '../../redux/actions/ticketAction';

const Tickets = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [socketData, setSocketData] = useState();
  const [socketColor, setSocketColor] = useState();

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const myTickets = useSelector((state) => state.myTickets);
  const { currentTicket } = myTickets;

  const ticketMsgAdd = useSelector((state) => state.ticketMsgAdd);
  const { error: errorTicketMsg } = ticketMsgAdd;

  const ticketUpdate = useSelector((state) => state.ticketUpdate);
  const { success: successTicketUpdate } = ticketUpdate;

  const socket = useContext(WebsocketContext);

  // dispatch add when socket receives data
  useEffect(() => {
    if (socketData) {
      // 3- update reducers to display
      dispatch(addTicketMsg(socketData));
    }
  }, [socketData]);

  // dispatch add when socket receives data
  useEffect(() => {
    if (socketColor) {
      dispatch(updateTicketColor(socketColor));
    }
    return () => {
      dispatch({ type: UPDATE_TICKET_COLOR_RESET });
    };
  }, [socketColor]);

  // fetch ticket when selected
  useEffect(() => {
    dispatch(fetchTicketById(currentTicket));
  }, [currentTicket, successTicketUpdate]);

  // socket receiver
  useEffect(() => {
    if (currentTicket && swInfo) {
      socketJoinRoom(currentTicket, swInfo.id);

      // clear previously buffered data when reconnecting
      socket.on(`onColorChange${swInfo.id}`, () => {
        socket.sendBuffer = [];
        console.log('cleared the color buffer!');
      });
      socket.on(`onColorChange${swInfo.id}`, (data) => {
        console.log('changed Color!');
        setSocketColor(data);
      });

      socket.on(`onTicketMessage${currentTicket}`, (data) => {
        console.log('listening for new messages');
        console.log('message received!');
        // 2- receive the msg which was just saved in db
        setSocketData(data);
      });
      socket.on(`onViewMessage${swInfo.id}`, (data) => {
        console.log(`user ${data.flaskUserId} Viewed ticket ${data.ticketId}!`);
        socketRefreshNotifications(swInfo);
      });
    }
    return () => {
      if (currentTicket) {
        socketLeaveRoom(currentTicket, swInfo.id);
        console.log('\x1b[31m%s\x1b[0m', 'NOT listening for new messages');
        socket.off(`onTicketMessage${currentTicket}`);
      }
      dispatch({ type: ADD_TICKET_MSG_RESET });
    };
  }, [currentTicket, swInfo]);

  // toast
  useEffect(() => {
    if (errorTicketMsg) {
      setToastOpen(true);
    }
  }, [errorTicketMsg]);

  // close toast
  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

  return (
    <PageContainer title="Ticket ui" description="this is the Ticketing page">
      <Breadcrumb title={t('ticket.ticketing.header')} subtitle={t('ticket.ticketing.subHeader')} />
      <Card sx={{ display: 'flex', p: 0 }}>
        <TicketSidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        />
        <Box flexGrow={1}>
          {currentTicket && (
            <TicketContent toggleTicketSidebar={() => setMobileSidebarOpen(true)} />
          )}
          <Divider />
          <TicketMsgSent />
        </Box>
      </Card>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={toastOpen} autoHideDuration={6000} onClose={handleCloseToast}>
          <Alert
            onClose={handleCloseToast}
            variant="filled"
            severity="error"
            sx={{ width: '100%' }}
          >
            {errorTicketMsg && errorTicketMsg.data.message}
          </Alert>
        </Snackbar>
      </Stack>
    </PageContainer>
  );
};

export default Tickets;
