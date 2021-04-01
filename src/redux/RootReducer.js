import { combineReducers } from 'redux';
import { loggedUser } from '../screens/auth/login/redux/LoginReducer';
import {
  creditLimits,
  creditLimitsColumnList,
} from '../screens/CreditLimits/redux/CreditLimitsReducer';
import { application } from '../screens/Application/redux/ApplicationReducer';
import { loggedUserProfile } from '../common/Header/redux/HeaderReducer';
import {employee} from "../screens/Employee/redux/EmployeeReducer";
import {companyProfile} from "../screens/CompanyProfile/redux/CompanyProfileReducer";

const rootReducer = combineReducers({
  loggedUser,
  creditLimits,
  creditLimitsColumnList,
  loggedUserProfile,
  application,
  employee,
  companyProfile
});
export default rootReducer;
