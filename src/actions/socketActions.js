import socketActionTypes from './actionTypes/socket';

export const socketConnect = () => (
  {
    type: socketActionTypes.CONNECT,
  }
);

export const socketDisconnect = () => (
  {
    type: socketActionTypes.DISCONNECT,
  }
);
