import { combineReducers } from 'redux';
import { loggedUser } from '../screens/auth/login/redux/LoginReducer';
import {
  clientManagement,
  clientManagementColumnList,
  clientManagementFilterList,
  syncClientWithCrm,
} from '../screens/Clients/redux/ClientReducer';
import { application } from '../screens/Application/redux/ApplicationReducer';
import { loggedUserProfile } from '../common/Header/redux/HeaderReducer';

const rootReducer = combineReducers({
  loggedUser,
  clientManagement,
  clientManagementColumnList,
  clientManagementFilterList,
  loggedUserProfile,
  syncClientWithCrm,
  application,
});
export default rootReducer;
