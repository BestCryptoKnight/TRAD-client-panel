import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';
import {
  CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS,
  CREDIT_LIMITS_REDUX_CONSTANTS,
} from './CreditLimitsReduxConstants';

const initialCreditLimitsListState = {
  creditLimitList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
};

export const creditLimits = (state = initialCreditLimitsListState, action) => {
  switch (action.type) {
    case CREDIT_LIMITS_REDUX_CONSTANTS.CREDIT_LIMITS_LIST_USER_ACTION:
      return {
        ...state,
        creditLimitList: action.data,
      };

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};

export const creditLimitsColumnList = (state = [], action) => {
  switch (action.type) {
    case CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_COLUMN_LIST_ACTION:
      return action.data;

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};


