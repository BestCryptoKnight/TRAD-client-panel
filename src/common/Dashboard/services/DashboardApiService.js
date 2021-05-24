import ApiService from '../../../services/api-service/ApiService';
import { DASHBOARD_URLS } from '../../../constants/UrlConstants';

export const DashboardApiService = {
  getDashboardTaskList: params =>
    ApiService.getData(DASHBOARD_URLS.DASHBOARD_TASK_LIST, { params }),
  getDashboardNotificationList: params =>
    ApiService.getData(DASHBOARD_URLS.DASHBOARD_NOTIFICATION_LIST, { params }),
};
