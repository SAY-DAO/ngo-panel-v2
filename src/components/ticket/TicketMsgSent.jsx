import React, {  useState } from 'react';
import { useSelector } from 'react-redux';
import { IconButton, Box } from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import { useTranslation } from 'react-i18next';
import CustomTextField from '../forms/custom-elements/CustomTextField';
import { socketNewTicketMessage } from '../../utils/socketHelpers';

const TicketMsgSent = () => {
  const { t } = useTranslation();

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const [msg, setMsg] = useState('');

  const ticketId = useSelector((state) => state.myTickets.currentTicket);
  const handleTicketMsgChange = (e) => {
    setMsg(e.target.value);
  };

  const onTicketMsgSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // 1- new message is sent to server via sockets and update DB
    socketNewTicketMessage(ticketId, msg, swInfo);
    setMsg('');
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
        <IconButton aria-label="send" color="primary" disabled={!msg}>
          <FeatherIcon icon="send" width="18" />
        </IconButton>
      </form>
    </Box>
  );
};

export default TicketMsgSent;
