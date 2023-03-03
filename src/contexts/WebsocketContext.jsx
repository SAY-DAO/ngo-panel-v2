import { createContext } from 'react';
import { io } from 'socket.io-client';
import { socketUrl } from '../env';

export const socketHttp = io(socketUrl);
export const WebsocketContext = createContext(socketHttp);

export const WebsocketProvider = WebsocketContext.Provider;
