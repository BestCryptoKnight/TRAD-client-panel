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
    notificationList: [],
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
      //   const notificationList = Object.entries(action?.data?.docs).map(([key, value]) => ({
      //     title: key,
      //     data: value,
      //   }));
      //   return {
      //     ...state,
      //     dashboardNotification: {
      //       ...state.dashboardNotification,
      //       notificationList,
      //       isLoading: false,
      //     },
      //   };
      // }
      let notificationList = state?.dashboardNotification?.notificationList ?? [];
      let hasMoreData = false;
      const { page, pages, docs } = action?.data;
      notificationList = notificationList?.map(elem => {
        if (docs[elem?.title]) {
          const final = docs[elem?.title];
          delete docs[elem?.title];
          return { ...elem, data: [...elem?.data, ...final] };
        }
        return elem;
      });
      if (page < pages) {
        hasMoreData = true;
      }
      const newNotificationList = Object.entries(docs).map(([key, value]) => ({
        title: key,
        data: value,
      }));
      return {
        ...state,
        dashboardNotification: {
          ...state?.dashboardNotification,
          notificationList: [...new Set([...newNotificationList, ...notificationList])],
          page: action?.data?.page,
          limit: action?.data?.limit,
          pages: action?.data?.pages,
          total: action?.data?.total,
          isLoading: false,
          hasMoreData,
        },
      };
    }

    case DASHBOARD_REDUX_CONSTANTS.NOTIFICATION.DELETE_DASHBOARD_NOTIFICATION_ACTION: {
      const notifications = state?.dashboardNotification?.notificationList ?? [];
      const finalData = [];

      notifications?.forEach(notification => {
        const data = notification?.data?.filter(e => e?._id !== action.data);

        if (data.length > 0) {
          finalData.push({ ...notification, data });
        }
      });

      return {
        ...state,
        dashboardNotification: {
          ...state.dashboardNotification,
          notificationList: finalData,
        },
      };
    }

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};
