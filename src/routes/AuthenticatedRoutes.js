import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getAuthTokenLocalStorage } from '../helpers/LocalStorageHelper';
import Dashboard from '../common/Dashboard/Dashboard';
import CreditLimitsList from '../screens/CreditLimits/CreditLimitsList/CreditLimitsList';
import ApplicationList from '../screens/Application/ApplicationList/ApplicationList';
import GenerateApplication from '../screens/Application/GenerateApplication/GenerateApplication';
import EmployeeList from "../screens/Employee/EmployeeList/EmployeeList";
import CompanyProfile from "../screens/CompanyProfile/CompanyProfile";

export const AuthenticatedRoute = ({ component, ...options }) => {
  const isLoggedIn = getAuthTokenLocalStorage();

  if (!isLoggedIn) {
    return (
      <Route {...options}>
        <Redirect to="/login" />
      </Route>
    );
  }
  if (!component) {
    return (
      <Route {...options}>
        <Redirect to="/dashboard" />
      </Route>
    );
  }

  return <Route {...options} component={component} />;
};
AuthenticatedRoute.propTypes = {
  component: PropTypes.func,
};
AuthenticatedRoute.defaultProps = {
  component: null,
};

export const AllAuthenticatedRoutes = () => {
  return (
    <Dashboard>
      <AuthenticatedRoute exact path="/dashboard" component={null} />
      <AuthenticatedRoute exact path="/applications" component={ApplicationList} />
      <AuthenticatedRoute
        exact
        path="/applications/application/:action/"
        component={GenerateApplication}
      />
      <AuthenticatedRoute exact path="/debtor" component={null} />
      <AuthenticatedRoute exact path="/claims" component={null} />
      <AuthenticatedRoute exact path="/over-dues" component={null} />
      <AuthenticatedRoute exact path="/credit-limits" component={CreditLimitsList} />
      <AuthenticatedRoute exact path="/employee" component={EmployeeList} />
      <AuthenticatedRoute exact path="/company-profile" component={CompanyProfile} />
    </Dashboard>
  );
};
