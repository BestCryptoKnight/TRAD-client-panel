import ApiService from '../../../services/api-service/ApiService';
import { DASHBOARD_URLS } from '../../../constants/UrlConstants';

export const DashboardApiService = {
  getDashboardPendingApplications: params =>
    ApiService.getData(DASHBOARD_URLS.DASHBOARD_PENDING_APPLICATION, { params }),
  getDashboardEndorsedLimit: params =>
    ApiService.getData(DASHBOARD_URLS.DASHBOARD_ENDORSED_LIMIT, { params }),
  getDashboardDiscretionaryLimit: () =>
    ApiService.getData(DASHBOARD_URLS.DASHBOARD_DISCRETIONARY_AMOUNT),
  getDashboardApprovedAmountRatio: params =>
    ApiService.getData(DASHBOARD_URLS.DASHBOARD_APPROVED_AMOUNT, { params }),
  getDashboardApprovedApplication: params =>
    ApiService.getData(DASHBOARD_URLS.DASHBOARD_APPROVED_APPLICATION, { params }),
  getDashboardTaskList: params =>
    ApiService.getData(DASHBOARD_URLS.DASHBOARD_TASK_LIST, { params }),
  getDashboardNotificationList: params =>
    ApiService.getData(DASHBOARD_URLS.DASHBOARD_NOTIFICATION_LIST, { params }),
  deleteDashboardNotification: id =>
    ApiService.deleteData(`${DASHBOARD_URLS.DASHBOARD_NOTIFICATION_LIST}${id}`),
};
