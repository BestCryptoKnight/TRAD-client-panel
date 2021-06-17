import { lazy } from 'react';
// import Dashboard from "../common/Dashboard/Dashboard";

const LoginScreen = lazy(() => import('../screens/auth/login/LoginScreen'));
const ForgotPassword = lazy(() => import('../screens/auth/forgotPassword/ForgotPassword'));
const SetPassword = lazy(() => import('../screens/auth/setPassword/SetPassword'));
const ResetPassword = lazy(() => import('../screens/auth/resetPassword/ResetPassword'));
const VerifyOtp = lazy(() => import('../screens/auth/otpScreen/VerifyOtp'));
const ForbiddenAccessPage = lazy(() => import('../common/ForbiddenAccessPage/ForbiddenAccessPage'));
const Dashboard = lazy(() => import('../common/Dashboard/Dashboard'));
const ViewClientTask = lazy(() => import('../common/Dashboard/components/ViewClientTask'));
const ApplicationList = lazy(() =>
  import('../screens/Application/ApplicationList/ApplicationList')
);
const GenerateApplication = lazy(() =>
  import('../screens/Application/GenerateApplication/GenerateApplication')
);
const ViewApplication = lazy(() =>
  import('../screens/Application/ViewApplication/ViewApplication')
);
const CreditLimitsList = lazy(() =>
  import('../screens/CreditLimits/CreditLimitsList/CreditLimitsList')
);
const ViewCreditLimits = lazy(() =>
  import('../screens/CreditLimits/ViewCreditLimits/ViewCreditLimits')
);
const OverduesList = lazy(() => import('../screens/Overdues/OverduesList/OverduesList'));
const AddOverdues = lazy(() => import('../screens/Overdues/OverduesList/AddOverdues/AddOverdues'));
const ClaimsList = lazy(() => import('../screens/Claims/ClaimsList/ClaimsList'));
const EmployeeList = lazy(() => import('../screens/Employee/EmployeeList/EmployeeList'));
const CompanyProfile = lazy(() => import('../screens/CompanyProfile/CompanyProfile'));
const Support = lazy(() => import('../screens/Support/Support'));
const PageNotFound = lazy(() => import('../common/PageNotFound/PageNotFound'));

export const ROUTES_CONSTANTS = [
  {
    path: '/login',
    component: LoginScreen,
  },
  {
    path: '/forgot-password',
    component: ForgotPassword,
  },
  {
    path: '/set-password',
    component: SetPassword,
  },
  {
    path: '/reset-password',
    component: ResetPassword,
  },
  {
    path: '/verify-otp',
    component: VerifyOtp,
  },
  {
    path: '/forbidden-access',
    component: ForbiddenAccessPage,
    escapeRedirect: true,
  },
  {
    path: '/',
    authenticated: true,
  },
  {
    path: '/dashboard',
    component: Dashboard,
    authenticated: true,
  },
  {
    path: '/dashboard/task/:id',
    component: ViewClientTask,
    authenticated: true,
  },
  {
    path: '/applications',
    component: ApplicationList,
    authenticated: true,
  },
  {
    path: '/applications/application/:action/',
    component: GenerateApplication,
    authenticated: true,
  },
  {
    path: '/applications/detail/:action/:id',
    component: ViewApplication,
    authenticated: true,
  },
  {
    path: '/credit-limits',
    component: CreditLimitsList,
    authenticated: true,
  },
  {
    path: '/credit-limits/:id',
    component: ViewCreditLimits,
    authenticated: true,
  },
  {
    path: '/employee',
    component: EmployeeList,
    authenticated: true,
  },
  {
    path: '/company-profile',
    component: CompanyProfile,
    authenticated: true,
  },
  {
    path: '/support',
    component: Support,
    authenticated: true,
  },
  {
    path: '/claims',
    component: ClaimsList,
    authenticated: true,
  },
  {
    path: '/over-dues',
    component: OverduesList,
    authenticated: true,
  },
  {
    path: '/over-dues/:period',
    component: AddOverdues,
    authenticated: true,
  },
  {
    path: '*',
    component: PageNotFound,
    escapeRedirect: true,
  },
];
