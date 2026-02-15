import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';

// Create context
const SocketContext = createContext(null);

// Custom hook to use socket
export const useSocket = () => useContext(SocketContext);

// Socket provider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    console.log('🔌 Connecting to socket server:', API_URL);
    
    // Create socket connection with better error handling
    const newSocket = io(API_URL, {
      transports: ['polling', 'websocket'], // Try polling first, then websocket
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      autoConnect: true,
      withCredentials: true,
      timeout: 10000,
      forceNew: true
    });

    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.log('⚠️ Socket connection error:', error.message);
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('✅ Socket reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Socket reconnection attempt:', attemptNumber);
    });

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up socket connection');
      if (newSocket) {
        newSocket.off('connect');
        newSocket.off('disconnect');
        newSocket.off('connect_error');
        newSocket.off('reconnect');
        newSocket.off('reconnect_attempt');
        newSocket.disconnect();
      }
    };
  }, []);

  // Join rider room with better logging
  const joinRiderRoom = (riderId) => {
    if (socket && isConnected && riderId) {
      console.log('📡 Joining rider room for:', riderId);
      socket.emit('join-rider', riderId);
      console.log('✅ Emitted join-rider event for:', riderId);
    } else {
      console.log('⚠️ Cannot join rider room - socket:', !!socket, 'connected:', isConnected, 'riderId:', riderId);
    }
  };

  // Join user room with better logging
  const joinUserRoom = (userId) => {
    if (socket && isConnected && userId) {
      console.log('📡 Joining user room for:', userId);
      socket.emit('join-user', userId);
      console.log('✅ Emitted join-user event for:', userId);
    } else {
      console.log('⚠️ Cannot join user room - socket:', !!socket, 'connected:', isConnected, 'userId:', userId);
    }
  };

  // Join booking room
  const joinBookingRoom = (bookingId) => {
    if (socket && isConnected) {
      socket.emit('join-booking', bookingId);
      console.log('📌 Joined booking room:', bookingId);
    }
  };

  // Leave booking room
  const leaveBookingRoom = (bookingId) => {
    if (socket && isConnected) {
      socket.emit('leave-booking', bookingId);
      console.log('📌 Left booking room:', bookingId);
    }
  };

  const value = {
    socket,
    isConnected,
    joinBookingRoom,
    leaveBookingRoom,
    joinRiderRoom,
    joinUserRoom
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Export context for direct use
export default SocketContext;