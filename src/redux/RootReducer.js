import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  creditLimits,
  creditLimitsColumnList,
} from '../screens/CreditLimits/redux/CreditLimitsReducer';
import { application } from '../screens/Application/redux/ApplicationReducer';
import { loggedUserProfile } from '../common/Header/redux/HeaderReducer';
import {employee} from "../screens/Employee/redux/EmployeeReducer";
import {companyProfile} from "../screens/CompanyProfile/redux/CompanyProfileReducer";
import {LOGIN_REDUX_CONSTANTS} from "../screens/auth/login/redux/LoginReduxConstants";

const appReducer = combineReducers({
  creditLimits,
  creditLimitsColumnList,
  loggedUserProfile,
  application,
  employee,
  companyProfile
});
const rootReducer = (state, action) => {
  if (action.type === LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION) {
    const emptyState = {};
    Object.keys(state).forEach(key => {
      emptyState[key] = null;
    });
    return emptyState;
  }

  return appReducer(state, action);
};
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['loggedUserProfile'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;

