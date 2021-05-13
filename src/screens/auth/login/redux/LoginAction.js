import { LOGIN_REDUX_CONSTANTS } from './LoginReduxConstants';
import AuthApiService from '../../services/AuthApiService';
import { successNotification } from '../../../../common/Toast';
import {
  saveAuthTokenLocalStorage,
  saveTokenToSession,
} from '../../../../helpers/LocalStorageHelper';
import { getLoggedUserDetails } from '../../../../common/Header/redux/HeaderAction';
import { displayErrors } from '../../../../helpers/ErrorNotifyHelper';

export const loginUser = ({ email, password }, rememberMe) => {
  return async dispatch => {
    try {
      const data = { userId: email.toLowerCase().trim(), password: password.trim() };
      const response = await AuthApiService.loginUser(data);

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: LOGIN_REDUX_CONSTANTS.LOGIN_USER_ACTION,
          data: response.data.data,
        });

        const { token } = response.data.data;

        if (rememberMe) {
          saveAuthTokenLocalStorage(token);
        } else {
          saveTokenToSession(token);
        }
        successNotification('Login successfully.');

        await dispatch(getLoggedUserDetails());
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
