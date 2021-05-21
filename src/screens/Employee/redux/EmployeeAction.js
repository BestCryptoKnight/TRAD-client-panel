import EmployeeApiService from '../services/EmployeeApiService';
import { errorNotification, successNotification } from '../../../common/Toast';
import {
  EMPLOYEE_COLUMN_LIST_REDUX_CONSTANTS,
  EMPLOYEE_REDUX_CONSTANTS,
} from './EmployeeReduxConstants';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import {
  startLoaderButtonOnRequest,
  stopLoaderButtonOnSuccessOrFail,
} from '../../../common/LoaderButton/redux/LoaderButtonAction';

export const getEmployeeList = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const response = await EmployeeApiService.getAllEmployeeList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: EMPLOYEE_REDUX_CONSTANTS.EMPLOYEE_LIST_USER_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getEmployeeColumnList = () => {
  return async dispatch => {
    try {
      const response = await EmployeeApiService.getEmployeeColumnList();
      if (response && response.data && response.data.status === 'SUCCESS') {
        dispatch({
          type: EMPLOYEE_COLUMN_LIST_REDUX_CONSTANTS.EMPLOYEE_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
        dispatch({
          type: EMPLOYEE_COLUMN_LIST_REDUX_CONSTANTS.EMPLOYEE_DEFAULT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification(e.response?.data?.message || 'Internal server error');
        }
      }
    }
  };
};

export const changeEmployeeColumnList = data => {
  return async dispatch => {
    dispatch({
      type: EMPLOYEE_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_EMPLOYEE_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveEmployeeColumnList = ({ employeeColumnList = {}, isReset = false }) => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest(
        `EmployeeListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      let data = {
        columns: [],
        isReset: true,
      };
      if (!isReset) {
        const defaultFields = employeeColumnList.defaultFields
          .filter(field => field.isChecked)
          .map(field => field.name);
        const customFields = employeeColumnList.customFields
          .filter(field => field.isChecked)
          .map(field => field.name);
        data = {
          columns: [...defaultFields, ...customFields],
          isReset: false,
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopLoaderButtonOnSuccessOrFail(
            `EmployeeListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
          throw Error();
        }
      }
      const response = await EmployeeApiService.updateEmployeeUpdateColumnList(data);
      if (response?.data?.status === 'SUCCESS') {
        console.log('in success');
        dispatch({
          type: EMPLOYEE_COLUMN_LIST_REDUX_CONSTANTS.EMPLOYEE_DEFAULT_COLUMN_LIST_ACTION,
          data: employeeColumnList,
        });
        successNotification('Columns updated successfully.');
        stopLoaderButtonOnSuccessOrFail(
          `EmployeeListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail(
        `EmployeeListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      displayErrors(e);
    }
  };
};
