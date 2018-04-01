import io from 'socket.io-client';

export const socketClient = io('http://localhost:8000/', { transports: ['websocket'] });

export function onNotification(conversations) {
  socketClient.on('notification', (data) => {
    console.log('notification', data);
  });
};