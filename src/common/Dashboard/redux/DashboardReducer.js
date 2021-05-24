import { DASHBOARD_REDUX_CONSTANTS } from './DashboardReduxConstants';
import { LOGIN_REDUX_CONSTANTS } from '../../../screens/auth/login/redux/LoginReduxConstants';

const initialDashboardData = {
  dashboardTask: {
    docs: [],
    headers: [],
    total: 0,
    limit: 15,
    page: 1,
    pages: 1,
    isLoading: true,
  },
  dashboardNotification: {
    isLoading: true,
  },
};

export const dashboard = (state = initialDashboardData, action) => {
  switch (action.type) {
    case DASHBOARD_REDUX_CONSTANTS.TASK.DASHBOARD_TASK_LIST_REQUEST:
      return {
        ...state,
        dashboardTask: {
          isLoading: true,
          ...state?.dashboardTask,
        },
      };

    case DASHBOARD_REDUX_CONSTANTS.TASK.DASHBOARD_TASK_LIST_SUCCESS:
      return {
        ...state,
        dashboardTask: {
          isLoading: false,
          ...action.data,
        },
      };

    case DASHBOARD_REDUX_CONSTANTS.NOTIFICATION.DASHBOARD_NOTIFICATION_LIST_REQUEST:
      return {
        ...state,
        dashboardNotification: {
          isLoading: true,
          ...state?.dashboardNotification,
        },
      };

    case DASHBOARD_REDUX_CONSTANTS.NOTIFICATION.DASHBOARD_NOTIFICATION_LIST_SUCCESS: {
      const notificationList = Object.entries(action?.data?.docs).map(([key, value]) => ({
        title: key,
        data: value,
      }));
      return {
        ...state,
        dashboardNotification: {
          ...state.dashboardNotification,
          notificationList,
          isLoading: false,
        },
      };
    }

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};
