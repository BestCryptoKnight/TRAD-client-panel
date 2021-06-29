import CompanyProfileApiService from '../services/CompanyProfileApiService';
import { errorNotification, successNotification } from '../../../common/Toast';
import { CLIENT_REDUX_CONSTANTS } from './CompanyProfileReduxConstants';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../common/GeneralLoader/redux/GeneralLoaderAction';

export const getClientDetails = () => {
  return async dispatch => {
    startGeneralLoaderOnRequest('viewCompanyProfilePageLoaderAction');
    try {
      const response = await CompanyProfileApiService.getClientData();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.CLIENT_DATA,
          data: response.data.data,
        });
        stopGeneralLoaderOnSuccessOrFail('viewCompanyProfilePageLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('viewCompanyProfilePageLoaderAction');
      displayErrors(e);
    }
  };
};

export const getCompanyProfilePolicyList = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const response = await CompanyProfileApiService.getClientPolicyList(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.CLIENT_POLICY_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error.');
        }
      }
    }
  };
};

export const getCompanyProfilePolicyColumnList = () => {
  return async dispatch => {
    try {
      const response = await CompanyProfileApiService.getClientPolicyColumnList();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.CLIENT_POLICY_COLUMN_LIST,
          data: response.data.data,
        });
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.CLIENT_POLICY_DEFAULT_COLUMN_LIST,
          data: response.data.data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error.');
        }
      }
    }
  };
};

export const changeCompanyProfilePolicyColumnList = data => {
  return dispatch => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.CLIENT_POLICY_UPDATE_COLUMN_LIST,
      data,
    });
  };
};

export const saveCompanyProfilePolicyColumnList = ({
  companyProfilePolicyColumnList = {},
  isReset = false,
}) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(
        `CompanyProfilePolicyColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      let data = {
        columns: [],
        isReset: true,
      };
      if (!isReset) {
        const defaultFields = companyProfilePolicyColumnList.defaultFields
          .filter(field => field.isChecked)
          .map(field => field.name);
        const customFields = companyProfilePolicyColumnList.customFields
          .filter(field => field.isChecked)
          .map(field => field.name);
        data = {
          columns: [...defaultFields, ...customFields],
          isReset: false,
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopGeneralLoaderOnSuccessOrFail(
            `CompanyProfilePolicyColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
          throw Error();
        }
      }
      const response = await CompanyProfileApiService.updateClientPolicyColumnList(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.CLIENT_POLICY_DEFAULT_COLUMN_LIST,
          data: companyProfilePolicyColumnList,
        });
        successNotification('Columns updated successfully.');
        stopGeneralLoaderOnSuccessOrFail(
          `CompanyProfilePolicyColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(
        `CompanyProfilePolicyColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      displayErrors(e);
    }
  };
};

export const resetClientData = () => {
  return async dispatch => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.RESET_CLIENT_DATA,
    });
  };
};
