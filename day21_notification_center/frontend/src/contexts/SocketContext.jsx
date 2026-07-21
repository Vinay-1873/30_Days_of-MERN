import { createContext, useEffect } from 'react';
import { socket } from '../services/socket';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    // Connect when the app mounts
    socket.connect();

    // Clean up the connection when the app unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};