import React, { useState, useEffect } from 'react';
import { Card, Divider, Box, Stack, Snackbar, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import TicketContent from '../../components/ticket/TicketContent';
import TicketMsgSent from '../../components/ticket/TicketMsgSent';
import TicketSidebar from '../../components/ticket/TicketSidebar';

const Tickets = () => {
  const { t } = useTranslation();

  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);

  const myTickets = useSelector((state) => state.myTickets);
  const { currentTicket } = myTickets;

  const ticketMsgAdd = useSelector((state) => state.ticketMsgAdd);
  const { error: errorTicketMsg } = ticketMsgAdd;

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
