import React, { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton, Box } from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import { useTranslation } from 'react-i18next';
import CustomTextField from '../forms/custom-elements/CustomTextField';
import { addTicketMsg } from '../../redux/actions/ticketAction';
import { WebsocketContext } from '../../contexts/WebsocketContext';
import { socketRefreshNotifications, socketNewTicketMessage } from '../../utils/socketHelpers';

const TicketMsgSent = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [socketData, setSocketData] = useState();
  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const [msg, setMsg] = useState('');

  const ticketId = useSelector((state) => state.myTickets.currentTicket);
  const handleTicketMsgChange = (e) => {
    setMsg(e.target.value);
  };

  const socket = useContext(WebsocketContext);

  // socket receiver
  useEffect(() => {
    socket.on('onTicketMessage', (data) => {
      console.log('message received!');
      // 2- receive the msg which was just saved in db
      setSocketData(data);
    });
    socket.on(`onViewMessage${swInfo.id}`, (data) => {
      console.log(`user ${data.flaskUserId} Viewed ticket ${data.ticketId}!`);
      socketRefreshNotifications(swInfo);
    });
    return () => {
      socket.off('onTicketMessage');
    };
  }, []);

  // dispatch add when socket receives data
  useEffect(() => {
    if (socketData) {
      // 3- update reducers to display
      dispatch(addTicketMsg(socketData));
    }
  }, [socketData]);

  const onTicketMsgSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // 1- new message is sent to server via sockets and update DB
    socketNewTicketMessage(ticketId, msg, swInfo);
    setMsg('');
  };

  // 1 user 1 emit to nest
  // 2 nest save and emit back to all
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
        <IconButton
          aria-label="send"
          color="primary"
          onClick={() => () => dispatch(addTicketMsg(ticketId, msg))}
          disabled={!msg}
        >
          <FeatherIcon icon="send" width="18" />
        </IconButton>
      </form>
    </Box>
  );
};

export default TicketMsgSent;
