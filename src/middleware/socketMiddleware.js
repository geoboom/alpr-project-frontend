import io from 'socket.io-client';

import connection from '../constants/connection';
import actionTypes from '../actions/actionTypes';
import socketActionTypes from '../actions/actionTypes/socket';
import { timeout } from '../utils';

const socketEvents = actionTypes;
let seq = 0;

const setupSocket = async (store, next) => {
  // const opts = { reconnection: false };
  const socket = io(connection.SERVER_URL);
  if (socket) {
    Object.values(socketEvents).forEach((event) => {
      socket.on(event, (payload) => {
        next({
          type: event,
          payload: {
            ...payload,
            r: true,
          },
        });
      });
    });

    socket.on('connect', () => {
      socket.emit(actionTypes.PLATELOG_GETALL);
    });

    socket.on('disconnect', () => {
      // disconnected
    });

    return socket;
  }
};

const socketMiddleware = (() => {
  let readyToConnect = false;
  let socket = null;
  let isConnecting = false;
  let isSocketEvent;

  return store => next => async (action) => {
    switch (action.type) {
      case socketActionTypes.CONNECT:
        readyToConnect = true;
        if (socket) {
          socket.disconnect(true);
        }
        if (!isConnecting) {
          isConnecting = true;
          await timeout(500);
          if (readyToConnect) {
            socket = await setupSocket(store, next);
          }
          isConnecting = false;
        }
        break;
      case socketActionTypes.DISCONNECT:
        readyToConnect = false;
        if (socket) {
          socket.disconnect(true);
        }
        socket = null;
        break;
      default:
        isSocketEvent = Object.values(socketEvents).includes(action.type);
        if (!isSocketEvent) {
          next(action);
          break;
        }

        if (socket && socket.connected) {
          const payload = {
            d: action.payload,
            i: seq,
          };
          socket.emit(action.type, payload);
          next({ type: action.type, payload });
          seq += 1;
        }
    }
  };
})();

export default socketMiddleware;
