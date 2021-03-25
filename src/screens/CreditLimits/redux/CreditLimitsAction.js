import { errorNotification } from '../../../common/Toast';
import CreditLimitsApiService from '../services/CreditLimitsApiService';
import {
  CREDIT_LIMITS_REDUX_CONSTANTS,
} from './CreditLimitsReduxConstants';

export const getCreditLimitsList = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const response = await CreditLimitsApiService.getAllCreditLimitsList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_REDUX_CONSTANTS.CREDIT_LIMITS_LIST_USER_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
    }
  };
};
