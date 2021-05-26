import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { creditLimits } from '../screens/CreditLimits/redux/CreditLimitsReducer';
import { dashboard } from '../common/Dashboard/redux/DashboardReducer';
import { application } from '../screens/Application/redux/ApplicationReducer';
import { loggedUserProfile } from '../common/Header/redux/HeaderReducer';
import { employee } from '../screens/Employee/redux/EmployeeReducer';
import { companyProfile } from '../screens/CompanyProfile/redux/CompanyProfileReducer';
import { LOGIN_REDUX_CONSTANTS } from '../screens/auth/login/redux/LoginReduxConstants';
import { support } from '../screens/Support/redux/SupportReducer';
import { loaderButtonReducer } from '../common/LoaderButton/redux/LoaderButtonReducer';

const appReducer = combineReducers({
  dashboard,
  creditLimits,
  loggedUserProfile,
  application,
  employee,
  companyProfile,
  support,
  loaderButtonReducer,
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

