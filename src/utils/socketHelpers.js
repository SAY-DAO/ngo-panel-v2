import { socketHttp } from '../contexts/WebsocketContext';

export const checkNotifications = (swInfo) => {
  // socket emits
  if (swInfo) {
    socketHttp.emit('ticketNotifications', { flaskUserId: swInfo.id });
    console.log('emitted ticket notification update!');
  }
};

export const newTicketMessage = (ticketId, msg, swInfo) => {
  // socket emits
  if (swInfo) {
    socketHttp.emit('newTicketMessage', { ticketId, message: msg, from: swInfo.id });
    console.log('emitted ticket notification update!');
  }
};
