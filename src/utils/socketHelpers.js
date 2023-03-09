import { socketHttp } from '../contexts/WebsocketContext';

export const socketRefreshNotifications = (swInfo) => {
  if (swInfo) {
    socketHttp.emit('ticketNotifications', { flaskUserId: swInfo.id });
    console.log('\x1b[33m%s\x1b[0m', 'emitted ticket notification update!');
  }
};

export const socketNewTicketMessage = (ticketId, msg, swInfo) => {
  // socket emits
  if (swInfo) {
    socketHttp.emit('newTicketMessage', { ticketId, message: msg, from: swInfo.id });
    console.log('\x1b[33m%s\x1b[0m', 'emitted ticket msg update!');
  }
};

