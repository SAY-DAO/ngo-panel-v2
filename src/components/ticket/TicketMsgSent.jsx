import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton, Box, CircularProgress } from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import { useTranslation } from 'react-i18next';
import CustomTextField from '../forms/custom-elements/CustomTextField';
import { socketNewTicketMessage } from '../../utils/socketHelpers';
import { ADD_TICKET_MSG_REQUEST } from '../../redux/constants/ticketConstants';
import { Colors } from '../../utils/types';

const TicketMsgSent = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [msg, setMsg] = useState('');

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const ticketById = useSelector((state) => state.ticketById);
  const { ticket: fetchedTicket } = ticketById;

  const ticketUpdate = useSelector((state) => state.ticketUpdate);
  const { updatedTicket } = ticketUpdate;

  const ticketMsgAdd = useSelector((state) => state.ticketMsgAdd);
  const { loading: loadingMsgAdd } = ticketMsgAdd;

  const ticketId = useSelector((state) => state.myTickets.currentTicket);
  const handleTicketMsgChange = (e) => {
    setMsg(e.target.value);
  };

  const onTicketMsgSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      (msg && !updatedTicket && fetchedTicket.color === Colors.YELLOW) ||
      (msg && updatedTicket && updatedTicket.color === Colors.YELLOW)
    ) {
      console.log(!updatedTicket && fetchedTicket.color === Colors.YELLOW);
      // 1- new message is sent to server via sockets and update DB
      socketNewTicketMessage(ticketId, msg, swInfo);
      dispatch({ type: ADD_TICKET_MSG_REQUEST });
      setMsg('');
    }
  };

  return (
    <Box p={2}>
      <form onSubmit={onTicketMsgSubmit.bind()} style={{ display: 'flex', alignItems: 'center' }}>
        <CustomTextField
          id="msg-sent"
          fullWidth
          value={msg}
          placeholder={t('ticket.ticketing.type')}
          size="small"
          type="text"
          variant="outlined"
          inputProps={{ 'aria-label': 'Type a Message' }}
          onChange={handleTicketMsgChange.bind(null)}
        />
        {!loadingMsgAdd ? (
          <IconButton
            aria-label="send"
            color="primary"
            disabled={
              !msg ||
              loadingMsgAdd ||
              (!updatedTicket && fetchedTicket.color === Colors.BLUE) ||
              (updatedTicket && updatedTicket.color === Colors.BLUE)
            }
          >
            <FeatherIcon icon="send" width="18" />
          </IconButton>
        ) : (
          <CircularProgress size={15} sx={{ m: 1 }} />
        )}
      </form>
    </Box>
  );
};

export default TicketMsgSent;
