import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';
import { SUPPORT_REDUX_CONSTANTS } from './SupportReduxConstants';

const initialSupportDetails = {};

export const support = (state = initialSupportDetails, action) => {
  switch (action.type) {
    case SUPPORT_REDUX_CONSTANTS.SUPPORT_GET_DETAILS_ACTION:
      return { ...action.data };

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};
