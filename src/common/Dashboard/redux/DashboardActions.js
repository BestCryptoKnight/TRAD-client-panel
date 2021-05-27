import { DashboardApiService } from '../services/DashboardApiService';
import { DASHBOARD_REDUX_CONSTANTS } from './DashboardReduxConstants';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import { successNotification } from '../../Toast';

export const getDashboardPendingApplications = params => {
  return async dispatch => {
    try {
      const response = await DashboardApiService.getDashboardPendingApplications(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DASHBOARD_REDUX_CONSTANTS.DASHBOARD_PENDING_APPLICATIONS,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getDashboardEndorsedLimit = params => {
  return async dispatch => {
    try {
      const response = await DashboardApiService.getDashboardEndorsedLimit(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DASHBOARD_REDUX_CONSTANTS.DASHBOARD_ENDORSED_LIMIT,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getDashboardDiscretionaryLimit = () => {
  return async dispatch => {
    try {
      const response = await DashboardApiService.getDashboardDiscretionaryLimit();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DASHBOARD_REDUX_CONSTANTS.DASHBOARD_DISCRETIONARY_LIMIT,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getDashboardApprovedAmountRatio = params => {
  return async dispatch => {
    try {
      const response = await DashboardApiService.getDashboardApprovedAmountRatio(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DASHBOARD_REDUX_CONSTANTS.DASHBOARD_APPROVED_AMOUNT_RATIO,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getDashboardApprovedApplications = params => {
  return async dispatch => {
    try {
      const response = await DashboardApiService.getDashboardApprovedApplication(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DASHBOARD_REDUX_CONSTANTS.DASHBOARD_APPROVED_APPLICATIONS,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getDashboardTaskList = (data = {}) => {
  return async dispatch => {
    const params = {
      ...data,
      columnFor: 'task',
    };
    try {
      dispatch({
        type: DASHBOARD_REDUX_CONSTANTS.TASK.DASHBOARD_TASK_LIST_REQUEST,
      });
      const response = await DashboardApiService.getDashboardTaskList(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DASHBOARD_REDUX_CONSTANTS.TASK.DASHBOARD_TASK_LIST_SUCCESS,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getDashboardNotificationList = data => {
  return async dispatch => {
    try {
      dispatch({
        type: DASHBOARD_REDUX_CONSTANTS.NOTIFICATION.DASHBOARD_NOTIFICATION_LIST_REQUEST,
      });
      const response = await DashboardApiService.getDashboardNotificationList(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DASHBOARD_REDUX_CONSTANTS.NOTIFICATION.DASHBOARD_NOTIFICATION_LIST_SUCCESS,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const deleteDashboardNotification = notificationId => {
  return async dispatch => {
    try {
      const response = await DashboardApiService.deleteDashboardNotification(notificationId);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'Notification deleted successfully');
        dispatch({
          type: DASHBOARD_REDUX_CONSTANTS.NOTIFICATION.DELETE_DASHBOARD_NOTIFICATION_ACTION,
          data: notificationId,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
