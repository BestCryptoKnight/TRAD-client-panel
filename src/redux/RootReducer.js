import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { creditLimits } from '../screens/CreditLimits/redux/CreditLimitsReducer';
import { claims } from '../screens/Claims/redux/ClaimsReducer';
import { dashboard } from '../common/Dashboard/redux/DashboardReducer';
import { application } from '../screens/Application/redux/ApplicationReducer';
import {
  globalSearchReducer,
  headerNotificationReducer,
  loggedUserProfile,
} from '../common/Header/redux/HeaderReducer';
import { employee } from '../screens/Employee/redux/EmployeeReducer';
import { companyProfile } from '../screens/CompanyProfile/redux/CompanyProfileReducer';
import { LOGIN_REDUX_CONSTANTS } from '../screens/auth/login/redux/LoginReduxConstants';
import { support } from '../screens/Support/redux/SupportReducer';
import { generalLoaderReducer } from '../common/GeneralLoader/redux/GeneralLoaderReducer';
import { overdue } from '../screens/Overdues/redux/OverduesReducer';
import { listFilterReducer } from '../common/ListFilters/redux/ListFiltersReducer';

const appReducer = combineReducers({
  dashboard,
  creditLimits,
  claims,
  loggedUserProfile,
  application,
  employee,
  companyProfile,
  support,
  generalLoaderReducer,
  globalSearchReducer,
  headerNotificationReducer,
  overdue,
  listFilterReducer,
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
