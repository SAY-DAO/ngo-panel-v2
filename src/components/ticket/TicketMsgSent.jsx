import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Box, CircularProgress } from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import { useTranslation } from 'react-i18next';
import CustomTextField from '../forms/custom-elements/CustomTextField';
import { Colors } from '../../utils/types';
import { newTicketContent } from '../../redux/actions/ticketAction';

const TicketMsgSent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [msg, setMsg] = useState('');

  const ticketById = useSelector((state) => state.ticketById);
  const { ticket: fetchedTicket } = ticketById;

  const ticketUpdate = useSelector((state) => state.ticketUpdate);
  const { updatedTicket } = ticketUpdate;

  const ticketContentAdd = useSelector((state) => state.ticketContentAdd);
  const { loading: loadingMsgAdd } = ticketContentAdd;

  const ticketId = useSelector((state) => state.myTickets.currentTicketId);
  const handleTicketMsgChange = (e) => {
    setMsg(e.target.value);
  };

  const onTicketMsgSubmit = (e) => {
    console.log(e);

    e.preventDefault();
    e.stopPropagation();
    if (
      (msg && !updatedTicket && fetchedTicket.color === Colors.YELLOW) ||
      (msg && updatedTicket && updatedTicket.color === Colors.YELLOW)
    ) {
      console.log(!updatedTicket && fetchedTicket.color === Colors.YELLOW);
      // 1- new message is sent to server via sockets and update DB
      // socketNewTicketMessage(ticketId, msg, swInfo);
      dispatch(newTicketContent(ticketId, msg));
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
            type="submit"
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
