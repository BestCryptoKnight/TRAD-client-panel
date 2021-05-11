import ApiService from '../../../services/api-service/ApiService';
import {CREDIT_LIMITS_URLS} from '../../../constants/UrlConstants';

const CreditLimitsApiService = {
    getAllCreditLimitsList: params => ApiService.getData(CREDIT_LIMITS_URLS.CREDIT_LIMITS_LIST_URL, {params}),
    getCreditLimitColumnList: params => ApiService.getData(CREDIT_LIMITS_URLS.CREDIT_LIMITS_COLUMN_LIST, {params}),
    updateCreditLimitsColumnList: data => ApiService.putData(CREDIT_LIMITS_URLS.CREDIT_LIMITS_COLUMN_LIST, data),
    getCreditLimitsFilterData: params => ApiService.getData(CREDIT_LIMITS_URLS.CREDIT_LIMITS_FILTER, {params}),
    getCreditLimitsDetails: id => ApiService.getData(`${CREDIT_LIMITS_URLS.VIEW_CREDIT_LIMITS_DETAILS}${id}`),

    getCreditLimitsApplicationList: (id, params) => ApiService.getData(`${CREDIT_LIMITS_URLS.APPLICATION.APPLICATION_LIST}${id}`, {params}),
    getCreditLimitsApplicationColumnList: params => ApiService.getData(CREDIT_LIMITS_URLS.APPLICATION.COLUMN_NAME_LIST_URL, {params}),
    updateCreditLimitsApplicationColumnList: data => ApiService.putData(CREDIT_LIMITS_URLS.APPLICATION.COLUMN_NAME_LIST_URL, data),

    getCreditLimitsTasksList: (params) => ApiService.getData(`${CREDIT_LIMITS_URLS.TASKS.TASKS_LIST}`, {params}),
    getCreditLimitsTaskColumnList: params => ApiService.getData(CREDIT_LIMITS_URLS.TASKS.TASK_COLUMN_NAME_LIST_URL, {params}),
    updateCreditLimitsTaskColumnList: data => ApiService.putData(CREDIT_LIMITS_URLS.TASKS.TASK_COLUMN_NAME_LIST_URL, data),
    //add task
    getCreditLimitsTasksAssigneeDropDownData: () => ApiService.getData(CREDIT_LIMITS_URLS.TASKS.ADD_TASK.ASSIGNEE_DROP_DOWN_DATA),
    getCreditLimitsTasksEntityDropDownData: params => ApiService.getData(CREDIT_LIMITS_URLS.TASKS.ADD_TASK.ENTITY_DROP_DOWN_DATA, {params}),
    addNewCreditLimitsTask: data => ApiService.postData(CREDIT_LIMITS_URLS.TASKS.ADD_TASK.SAVE_NEW_TASK, data),
    //edit task
    getCreditLimitsTaskDetailsById: id => ApiService.getData(`${CREDIT_LIMITS_URLS.TASKS.EDIT_TASK.GET_CLIENT_TASK_DETAIL}${id}`),
    updateCreditLimitsTask: (id, data) => ApiService.putData(`${CREDIT_LIMITS_URLS.TASKS.ADD_TASK.SAVE_NEW_TASK}${id}`, data),

    getCreditLimitsDocumentsList: (id, params) => ApiService.getData(`${CREDIT_LIMITS_URLS.DOCUMENTS.DOCUMENTS_LIST}${id}`, {params}),
    getCreditLimitsDocumentsColumnNamesList: params =>
            ApiService.getData(`${CREDIT_LIMITS_URLS.DOCUMENTS.COLUMN_NAME_LIST_URL}`, {params}),
    updateCreditLimitsDocumentColumnListName: data =>
            ApiService.putData(`${CREDIT_LIMITS_URLS.DOCUMENTS.COLUMN_NAME_LIST_URL}`, data),
    getCreditLimitsDocumentTypeList: params =>
            ApiService.getData(`${CREDIT_LIMITS_URLS.DOCUMENTS.GET_DOCUMENT_TYPE_URL}`, {params}),
    uploadDocument: (data, config) =>
            ApiService.postData(CREDIT_LIMITS_URLS.DOCUMENTS.UPLOAD_DOCUMENT_URL, data, config),
    downloadDocuments: params =>
            ApiService.request({
                url: `${CREDIT_LIMITS_URLS.DOCUMENTS.DOWNLOAD_DOCUMENTS_URL}`,
                params,
                method: 'GET',
                responseType: 'blob',
            }),
    deleteCreditLimitsDocument: id => ApiService.deleteData(`${CREDIT_LIMITS_URLS.DOCUMENTS.DOCUMENTS_LIST}${id}`),

    getCreditLimitsNoteLIst: params => ApiService.getData(CREDIT_LIMITS_URLS.NOTES.NOTES_LIST, {params}),
};

export default CreditLimitsApiService;
