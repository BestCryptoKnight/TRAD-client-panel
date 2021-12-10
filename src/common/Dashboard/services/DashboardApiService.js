import ApiService from '../../../services/api-service/ApiService';
import { DASHBOARD_URLS } from '../../../constants/UrlConstants';

export const DashboardApiService = {
  getDashboardDetails: () => ApiService.getData(DASHBOARD_URLS.DASHBOARD_DETAILS),
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
  getTaskDetailById: id => ApiService.getData(`${DASHBOARD_URLS.DASHBOARD_TASK_DETAILS_URL}${id}`),
  updateTask: (id, data) => ApiService.putData(`${DASHBOARD_URLS.UPDATE_TASK}${id}`, data),
  getEntitiesBySearch: params => ApiService.getData(DASHBOARD_URLS.SEARCH_ENTITIES, { params }),
  downloadDashboardTask: params => ApiService.request({
    url: DASHBOARD_URLS.DASHBOARD_DOWNLOAD_TASK,
    params,
    method: 'GET',
    responseType: 'blob',
    timeout: 60000
  }
  )
};
