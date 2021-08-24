import socketIOClient from 'socket.io-client';
import { displayErrors } from './ErrorNotifyHelper';
import { HEADER_NOTIFICATION_REDUX_CONSTANTS } from '../common/Header/redux/HeaderConstants';
import { updateHeaderNotificationOnTaskAssignedAction } from '../common/Header/redux/HeaderAction';
import { store } from '../redux/store';

const urls = {
  dev: 'https://client.trad.dev.gradlesol.com',
  test: 'https://client.trad.test.humanpixel.com.au',
};

const SOCKET_URI = urls.test;
const TYPE = 'client-user';
let socket = null;

export const dispatchActionsOnSocketEvents = data => {
  switch (data.type) {
    case HEADER_NOTIFICATION_REDUX_CONSTANTS.TASK_ASSIGNED:
    case HEADER_NOTIFICATION_REDUX_CONSTANTS.TASK_UPDATED:
    case HEADER_NOTIFICATION_REDUX_CONSTANTS.DUE_TASK:
    case HEADER_NOTIFICATION_REDUX_CONSTANTS.APPLICATION_APPROVED:
    case HEADER_NOTIFICATION_REDUX_CONSTANTS.APPLICATION_DECLINED:
    case HEADER_NOTIFICATION_REDUX_CONSTANTS.APPLICATION_GENERATED:
    case HEADER_NOTIFICATION_REDUX_CONSTANTS.CLAIM_ADDED:
      store.dispatch(updateHeaderNotificationOnTaskAssignedAction(data?.data));
      break;
    default:
      break;
  }
};
export const connectWebSocket = AUTH_TOKEN => {
  try {
    socket = socketIOClient(`${SOCKET_URI}?token=${AUTH_TOKEN}&type=${TYPE}`);
    if (socket !== null) {
      socket.on('connect', () => {
        socket.on('FromAPI', data => {
          dispatchActionsOnSocketEvents(data);
        });
      });
    }
  } catch (e) {
    displayErrors(e);
  }
};

export const disconnectWebSocket = () => {
  if (socket !== null) {
    socket.disconnect();
  }
};
