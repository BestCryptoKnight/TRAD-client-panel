import { LOGIN_REDUX_CONSTANTS } from './LoginReduxConstants';
import AuthApiService from '../../services/AuthApiService';
import { successNotification } from '../../../../common/Toast';
import {
  saveAuthTokenLocalStorage,
  saveTokenToSession,
} from '../../../../helpers/LocalStorageHelper';
import { getLoggedUserDetails } from '../../../../common/Header/redux/HeaderAction';
import { displayErrors } from '../../../../helpers/ErrorNotifyHelper';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../../common/GeneralLoader/redux/GeneralLoaderAction';

export const loginUser = ({ email, password }, rememberMe) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('logInButtonLoaderAction');
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
        stopGeneralLoaderOnSuccessOrFail('logInButtonLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('logInButtonLoaderAction');
      displayErrors(e);
      throw Error();
    }
  };
};
