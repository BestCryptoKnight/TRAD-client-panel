import { DashboardApiService } from '../services/DashboardApiService';
import { DASHBOARD_REDUX_CONSTANTS } from './DashboardReduxConstants';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import { successNotification } from '../../Toast';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../GeneralLoader/redux/GeneralLoaderAction';

export const getDashboardDetails = () => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('dashboardDetailsLoader');
      const response = await DashboardApiService.getDashboardDetails();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DASHBOARD_REDUX_CONSTANTS.DASHBOARD_DETAILS,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('dashboardDetailsLoader');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('dashboardDetailsLoader');
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
          data: response?.data?.data,
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
          data: response?.data?.data,
        });
      }
    } catch (e) {
      dispatch({
        type: DASHBOARD_REDUX_CONSTANTS.NOTIFICATION.DASHBOARD_NOTIFICATION_LIST_FAIL,
      });
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

export const getTaskById = id => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('dashboardViewTaskLoaderAction');
      const response = await DashboardApiService.getTaskDetailById(id);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: DASHBOARD_REDUX_CONSTANTS.TASK.DASHBOARD_TASK_DETAILS,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('dashboardViewTaskLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('dashboardViewTaskLoaderAction');
      displayErrors(e);
    }
  };
};

export const markTaskAsComplete = (id, data) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('dashboardCompleteTaskLoaderButtonAction');
      const response = await DashboardApiService.updateTask(id, data);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'Task updated successfully.');
        stopGeneralLoaderOnSuccessOrFail('dashboardCompleteTaskLoaderButtonAction');
        dispatch({
          type: DASHBOARD_REDUX_CONSTANTS.TASK.UPDATE_EDIT_TASK_FIELD_ACTION,
          name: 'isCompleted',
          value: data?.isCompleted,
        });
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('dashboardCompleteTaskLoaderButtonAction');
      displayErrors(e);
    }
  };
};

export const clearNotificationData = () => {
  return dispatch => {
    dispatch({
      type: DASHBOARD_REDUX_CONSTANTS.NOTIFICATION.CLEAR_NOTIFICATION_DATA,
    });
  };
};

export const resetDashboardDetails = () => {
  return dispatch => {
    dispatch({
      type: DASHBOARD_REDUX_CONSTANTS.RESET_DASHBOARD_DATA,
    });
  };
};
