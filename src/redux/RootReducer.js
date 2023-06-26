import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import storageSession from 'redux-persist/lib/storage/session';
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
import { debtorsManagement } from '../screens/Debtors/redux/DebtorsReducer';
import { reportAllFilters } from '../screens/Reports/redux/reportFilterReducer';
import { userPrivileges } from '../screens/Users/redux/UserManagementReducer';
import { alerts, alertAllFilters } from '../screens/Alerts/redux/AlertsReducer';

const filterPersistConfig = {
  key: 'allFilters',
  storage: storageSession,
};

const reportFilterPersistConfig = {
  key: 'reportFilters',
  storage: storageSession,
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['loggedUserProfile'],
};

const appReducer = combineReducers({
  dashboard,
  creditLimits,
  userPrivileges,
  claims,
  loggedUserProfile,
  application,
  alerts,
  alertAllFilters,
  employee,
  companyProfile,
  support,
  generalLoaderReducer,
  globalSearchReducer,
  headerNotificationReducer,
  debtorsManagement,
  overdue,
  listFilterReducer: persistReducer(filterPersistConfig, listFilterReducer),
  reportAllFilters: persistReducer(reportFilterPersistConfig, reportAllFilters),
});
const rootReducer = (state, action) => {
  if (action.type === LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION) {
    const emptyState = {};
    Object.keys(state).forEach(key => {
      if (key !== 'listFilterReducer' || key !== 'reportAllFilters') {
        emptyState[key] = null;
      }
    });
    return emptyState;
  }

  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
