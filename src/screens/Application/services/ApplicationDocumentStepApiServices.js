import ApiService from '../../../services/api-service/ApiService';
import { APPLICATION_URLS } from '../../../constants/UrlConstants';

const ApplicationDocumentStepApiServices = {
  getApplicationDocumentDataList: (id, params) =>
    ApiService.getData(`${APPLICATION_URLS.DOCUMENTS.DOCUMENTS_LIST}${id}`, { params }),
  getDocumentTypeListData: params =>
    ApiService.getData(APPLICATION_URLS.DOCUMENTS.GET_DOCUMENT_TYPE_LIST_URL, { params }),
  uploadDocument: (data, config) =>
    ApiService.request({
      url: `${APPLICATION_URLS.DOCUMENTS.UPLOAD_DOCUMENT_URL}`,
      data,
      config,
      method: 'POST',
      timeout: 60000,
    }),
  deleteApplicationDocument: id =>
    ApiService.deleteData(`${APPLICATION_URLS.DOCUMENTS.APPLICATION_DELETE_DOCUMENT}${id}`),
};
export default ApplicationDocumentStepApiServices;
