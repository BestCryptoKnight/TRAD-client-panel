import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';
import { CLIENT_REDUX_CONSTANTS } from './CompanyProfileReduxConstants';

const initialClientData = {
  clientDetail: {},
  clientPolicyData: {
    clientPolicyList: { docs: [], total: 0, limit: 15, page: 1, pages: 1, isLoading: true },
    clientPolicyColumnList: {},
    clientPolicyDefaultColumnList: {},
  },
};

export const companyProfile = (state = initialClientData, action) => {
  switch (action.type) {
    case CLIENT_REDUX_CONSTANTS.CLIENT_DATA:
      return {
        ...state,
        clientDetail: action.data,
      };

    case CLIENT_REDUX_CONSTANTS.CLIENT_POLICY_DATA:
      return {
        ...state,
        clientPolicyData: {
          ...state?.clientPolicyData,
          clientPolicyList: {
            ...state?.clientPolicyData?.clientPolicyList,
            ...action.data,
            isLoading: false,
          },
        },
      };

    case CLIENT_REDUX_CONSTANTS.CLIENT_POLICY_COLUMN_LIST:
      return {
        ...state,
        clientPolicyData: {
          ...state?.clientPolicyData,
          clientPolicyColumnList: {
            ...state?.clientPolicyData?.clientPolicyColumnList,
            ...action.data,
          },
        },
      };

    case CLIENT_REDUX_CONSTANTS.CLIENT_POLICY_DEFAULT_COLUMN_LIST:
      return {
        ...state,
        clientPolicyData: {
          ...state?.clientPolicyData,
          clientPolicyDefaultColumnList: {
            ...state?.clientPolicyData?.clientPolicyDefaultColumnList,
            ...action.data,
          },
        },
      };

    case CLIENT_REDUX_CONSTANTS.CLIENT_POLICY_UPDATE_COLUMN_LIST: {
      const columnList = {
        ...state?.clientPolicyData?.clientPolicyColumnList,
      };
      const { type, name, value } = action.data;
      columnList[`${type}`] = columnList[`${type}`].map(field =>
        field.name === name
          ? {
              ...field,
              isChecked: value,
            }
          : field
      );

      return {
        ...state,
        clientPolicyData: {
          ...state?.clientPolicyData,
          clientPolicyColumnList: columnList,
        },
      };
    }

    case CLIENT_REDUX_CONSTANTS.RESET_CLIENT_DATA: {
      return {
        ...state,
        clientDetail: initialClientData.clientDetail,
      };
    }

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;
    default:
      return state;
  }
};
