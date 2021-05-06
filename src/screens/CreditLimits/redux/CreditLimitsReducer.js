import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';
import {
  CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS, CREDIT_LIMITS_FILTER_LIST_REDUX_CONSTANTS,
  CREDIT_LIMITS_REDUX_CONSTANTS,
} from './CreditLimitsReduxConstants';

const initialCreditLimitsListState = {
  creditLimitList: { docs: [], headers:[], total: 0, limit: 15, page: 1, pages: 1, isLoading: true },
  selectedCreditLimitData: {},
  creditLimitsColumnList: {},
  creditLimitsDefaultColumnList: {},
  creditLimitsFilterList: {
    dropdownData: {
      entityType: []
    }
  }
};

export const creditLimits = (state = initialCreditLimitsListState, action) => {
  switch (action.type) {
    case CREDIT_LIMITS_REDUX_CONSTANTS.CREDIT_LIMITS_LIST_ACTION:
      return {
        ...state,
        creditLimitList: {
          isLoading: false,
          ...action.data
        },
      };

    case CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_COLUMN_LIST_ACTION:
      return {
        ...state,
        creditLimitsColumnList: action.data
      }

    case CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_DEFAULT_COLUMN_LIST_ACTION:
      return {
        ...state,
        creditLimitsDefaultColumnList: action.data
      }

    case CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_CREDIT_LIMITS_COLUMN_LIST_ACTION:
     const columnList = {
       ...state?.creditLimitsColumnList
     };
     const {type, name, value} = action?.data;
     columnList[`${type}`] = columnList[`${type}`].map(e =>
     e.name === name ? {...e, isChecked: value} : e);
     return {
       ...state,
       creditLimitsColumnList: columnList
     }

    case CREDIT_LIMITS_FILTER_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_FILTER_LIST_ACTION:
      const dropdownData = {...state?.creditLimitsFilterList?.dropdownData};
      Object.entries(action?.data)?.forEach(([key, value]) => {
        dropdownData[key] = value?.map(entity => ({
          label: entity?.name ?? entity.label,
          name: dropdownData[key] === 'entityType' && 'entityType',
          value: entity?._id ?? entity.value,
        }));
      });

      return {
        ...state,
        creditLimitsFilterList: {
          ...state.creditLimitsFilterList,
          dropdownData
        }
      }

    case CREDIT_LIMITS_REDUX_CONSTANTS.SELECTED_CREDIT_LIMIT_DATA:
      return {
        ...state,
        selectedCreditLimitData: action.data
      }

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};


