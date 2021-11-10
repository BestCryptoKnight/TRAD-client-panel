import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';
import {
  EMPLOYEE_COLUMN_LIST_REDUX_CONSTANTS,
  EMPLOYEE_REDUX_CONSTANTS,
} from './EmployeeReduxConstants';

const initialEmployeeListState = {
  employeeList: { docs: [], total: 0, limit: 15, page: 1, pages: 1 },
  employeeColumnList: {},
  employeeDefaultColumnList: {},
};

export const employee = (state = initialEmployeeListState, action) => {
  switch (action.type) {
    case EMPLOYEE_REDUX_CONSTANTS.EMPLOYEE_LIST_USER_ACTION:
      return {
        ...state,
        employeeList: { ...action.data, isLoading: false },
      };
    case EMPLOYEE_COLUMN_LIST_REDUX_CONSTANTS.EMPLOYEE_COLUMN_LIST_ACTION:
      return {
        ...state,
        employeeColumnList: action.data,
      };

    case EMPLOYEE_COLUMN_LIST_REDUX_CONSTANTS.EMPLOYEE_DEFAULT_COLUMN_LIST_ACTION:
      return {
        ...state,
        employeeDefaultColumnList: action.data,
      };

    case EMPLOYEE_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_EMPLOYEE_COLUMN_LIST_ACTION: {
      const columnList = {
        ...state?.employeeColumnList,
      };
      const { type, name, value } = action?.data;
      columnList[`${type}`] = columnList[`${type}`].map(field =>
        field.name === name ? { ...field, isChecked: value } : field
      );
      return {
        ...state,
        employeeColumnList: columnList,
      };
    }

    case EMPLOYEE_REDUX_CONSTANTS.RESET_EMPLOYEE_DETAILS: {
      return {
        ...state,
        employeeList: initialEmployeeListState.employeeList,
      };
    }

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;
    default:
      return state;
  }
};
