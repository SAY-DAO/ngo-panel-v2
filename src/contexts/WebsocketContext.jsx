import { createContext } from 'react';
import { io } from 'socket.io-client';

export const socketHttp = io('http://localhost:8002');
export const WebsocketContext = createContext(socketHttp)

export const WebsocketProvider = WebsocketContext.Provider