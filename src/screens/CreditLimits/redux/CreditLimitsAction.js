import {errorNotification, successNotification} from '../../../common/Toast';
import CreditLimitsApiService from '../services/CreditLimitsApiService';
import {
  CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS, CREDIT_LIMITS_FILTER_LIST_REDUX_CONSTANTS,
  CREDIT_LIMITS_REDUX_CONSTANTS,
} from './CreditLimitsReduxConstants';
import {displayErrors} from "../../../helpers/ErrorNotifyHelper";

export const getCreditLimitsList = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const response = await CreditLimitsApiService.getAllCreditLimitsList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_REDUX_CONSTANTS.CREDIT_LIMITS_LIST_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
     displayErrors(e)
    }
  };
};

export const getCreditLimitColumnList = () => {
  return async dispatch => {
    try {
      const response = await CreditLimitsApiService.getCreditLimitColumnList();
      if(response.data.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_COLUMN_LIST_ACTION,
          data: response.data.data
        });
        dispatch({
          type: CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_DEFAULT_COLUMN_LIST_ACTION,
          data: response.data.data
        })
      }
    } catch (e) {
      if(e.response && e.response.data) {
        if(e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if(e.response.data.messageCode) {
          errorNotification(e.response.data.message)
        }
      }
    }
  }
}

export const changeCreditColumnList = data => {
  return dispatch => {
   dispatch({
     type: CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_CREDIT_LIMITS_COLUMN_LIST_ACTION,
     data
   })
  }
}

export const saveCreditLimitColumnList = ({creditLimitsColumnList = {}, isReset = false}) => {
  return async dispatch => {
    try {
      let data = {
        columns: [],
        isReset: true
      };
      if(!isReset) {
        const defaultFields = creditLimitsColumnList.defaultFields.filter(e => e.isChecked).map(e => e.name);
        const customFields = creditLimitsColumnList.customFields.filter(e => e.isChecked).map(e => e.name);
        data = {
          columns: [...defaultFields, ...customFields],
          isReset: false
        }
        if(data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
         throw Error()
        }
      }
      const response = await CreditLimitsApiService.updateCreditLimitsColumnList(data);
        if (response && response.data && response.data.status === 'SUCCESS') {
         dispatch({
           type: CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_DEFAULT_COLUMN_LIST_ACTION,
           data: creditLimitsColumnList
         })
          successNotification('Columns updated successfully.');
      }
    } catch (e) {
      if(e.response && e.response.data) {
        if(e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if(e.response.data.messageCode) {
          errorNotification(e.response.data.message)
        }
      }
    }
  }
}

export const getCreditLimitsFilter = () => {
  return async dispatch => {
    try {
      const response = await CreditLimitsApiService.getCreditLimitsFilterData();
      if(response && response.data && response.data.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_FILTER_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_FILTER_LIST_ACTION,
          data: response.data.data
        })
      }
    } catch (e) {
      if(e.response && e.response.data) {
        if(e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if(e.response.data.messageCode) {
          errorNotification(e.response.data.message)
        }
      }
    }
  }
}

export const getCreditLimitsDetails = id => {
  return async dispatch => {
    try {
      const response = await CreditLimitsApiService.getCreditLimitsDetails(id);
      if (response?.data?.status==='SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_REDUX_CONSTANTS.SELECTED_CREDIT_LIMIT_DATA,
          data: response.data.data
        })
      }
    } catch (e) {
      if(e.response && e.response.data) {
        if(e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if(e.response.data.messageCode) {
          errorNotification(e.response.data.message)
        }
      }
    }
  }
}
