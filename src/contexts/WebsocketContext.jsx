import { createContext } from 'react';
import { io } from 'socket.io-client';

export const socketHttp = io('https://nest.saydao.org');
export const WebsocketContext = createContext(socketHttp)

export const WebsocketProvider = WebsocketContext.Provider