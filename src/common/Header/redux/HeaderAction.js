import HeaderApiService from '../services/HeaderApiService';
import { errorNotification, successNotification } from '../../Toast';
import { clearAuthToken } from '../../../helpers/LocalStorageHelper';
import { EDIT_PROFILE_CONSTANT,HEADER_GLOBAL_SEARCH_REDUX_CONSTANTS, HEADER_NOTIFICATION_REDUX_CONSTANTS } from './HeaderConstants';
import { LOGIN_REDUX_CONSTANTS } from '../../../screens/auth/login/redux/LoginReduxConstants';
import { DASHBOARD_REDUX_CONSTANTS } from '../../Dashboard/redux/DashboardReduxConstants';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const data = { oldPassword, newPassword };
    const response = await HeaderApiService.changePassword(data);

    if (response.data.status === 'SUCCESS') {
      successNotification('Password changed successfully.');
    }
  } catch (e) {
    if (e.response && e.response.data) {
      if (e.response.data.status === undefined) {
        errorNotification('It seems like server is down, Please try again later.');
      } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
        errorNotification('Internal server error');
      } else if (e.response.data.status === 'ERROR') {
        if (e.response.data.messageCode) {
          switch (e.response.data.messageCode) {
            case 'WRONG_CURRENT_PASSWORD':
              errorNotification('Please enter correct current password');
              break;
            case 'SAME_OLD_PASSWORD':
              errorNotification("You can't set set last used password");
              break;
            default:
              break;
          }
        } else {
          errorNotification('It seems like server is down, Please try again later.');
        }
      } else if (e.response.data.status === 'BAD_REQUEST') {
        if (e.response.data.messageCode) {
          switch (e.response.data.messageCode) {
            case 'SAME_OLD_PASSWORD':
              errorNotification("User can't set last used password");
              break;
            default:
              errorNotification(e.response.data.message);
              break;
          }
        }
      } else {
        errorNotification('It seems like server is down, Please try again later.');
      }
      throw Error();
    }
  }
};

export const getLoggedUserDetails = () => {
  return async dispatch => {
    try {
      const response = await HeaderApiService.loggedUserDetails();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: EDIT_PROFILE_CONSTANT.GET_LOGGED_USER_DETAILS,
          data: response.data.data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};

export const changeEditProfileData = data => {
  return async dispatch => {
    dispatch({
      type: EDIT_PROFILE_CONSTANT.USER_EDIT_PROFILE_DATA_CHANGE,
      data,
    });
  };
};

export const updateUserProfile = (name, contactNumber) => {
  return async dispatch => {
    try {
      const data = {
        name,
        contactNumber,
      };
      const response = await HeaderApiService.updateUserProfile(data);
      if (response.data.status === 'SUCCESS') {
        successNotification(response.data.message);
        dispatch(getLoggedUserDetails());
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};
export const uploadProfilePicture = (data, config) => {
  return async dispatch => {
    try {
      const response = await HeaderApiService.uploadUserProfilePicture(data, config);
      if (response.data.status === 'success') {
        dispatch({
          type: EDIT_PROFILE_CONSTANT.UPDATE_USER_PROFILE_PICTURE,
          data: response.data.data,
        });
        successNotification('Profile picture updated successfully');
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};
export const logoutUser = () => {
  return async dispatch => {
    try {
      const response = await HeaderApiService.logoutUser();

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION,
        });
        clearAuthToken();
        successNotification('Logged out successfully.');
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else {
          errorNotification('Please try again later.');
        }
        throw Error();
      }
    }
  };
};

// socket actions

export const getHeaderNotificationListURL = () => {
  return async dispatch => {
    try {
      const response = await HeaderApiService.notificationApiServices.getHeaderNotificationList();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: HEADER_NOTIFICATION_REDUX_CONSTANTS.GET_HEADER_NOTIFICATION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      /**/
    }
  };
};

export const updateHeaderNotificationOnTaskAssignedAction = data => {
  return dispatch => {
    dispatch({
      type: HEADER_NOTIFICATION_REDUX_CONSTANTS.TASK_ASSIGNED,
      data,
    });
    dispatch({
      type: DASHBOARD_REDUX_CONSTANTS.NOTIFICATION.GET_NOTIFICATION_FROM_SOCKET,
      data,
    });
  };
};
export const updateHeaderNotificationOnTaskUpdatedAction = data => {
  return dispatch => {
    dispatch({
      type: HEADER_NOTIFICATION_REDUX_CONSTANTS.TASK_UPDATED,
      data,
    });
    dispatch({
      type: DASHBOARD_REDUX_CONSTANTS.NOTIFICATION.GET_NOTIFICATION_FROM_SOCKET,
      data,
    });
  };
};

export const markNotificationAsReadAndDeleteAction = notificationId => {
  return async dispatch => {
    try {
      const response =
        await HeaderApiService.notificationApiServices.markNotificationAsReadAndDelete(
          notificationId
        );
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'Notification deleted successfully');
        dispatch({
          type: HEADER_NOTIFICATION_REDUX_CONSTANTS.TASK_DELETED_READ,
          id: notificationId,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const searchGlobalData = value => {
  return async dispatch => {
    try {
      const params = {
        searchString: value,
      };
      const response = await HeaderApiService.globalSearchApiServices.getGlobalSearchData(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: HEADER_GLOBAL_SEARCH_REDUX_CONSTANTS.GET_SEARCH_RESULT_LIST,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      errorNotification(e);
    }
  };
};
