import { errorNotification, successNotification } from '../../../common/Toast';
import CreditLimitsApiService from '../services/CreditLimitsApiService';
import {
  CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS,
  CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS,
  CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS,
  CREDIT_LIMITS_FILTER_LIST_REDUX_CONSTANTS,
  CREDIT_LIMITS_NOTES_REDUX_CONSTANTS,
  CREDIT_LIMITS_REDUX_CONSTANTS,
  CREDIT_LIMITS_TASKS_REDUX_CONSTANTS,
} from './CreditLimitsReduxConstants';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import {
  startLoaderButtonOnRequest,
  stopLoaderButtonOnSuccessOrFail,
} from '../../../common/LoaderButton/redux/LoaderButtonAction';

export const getCreditLimitsList = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const response = await CreditLimitsApiService.getAllCreditLimitsList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_REDUX_CONSTANTS.CREDIT_LIMITS_LIST_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getCreditLimitColumnList = () => {
  return async dispatch => {
    try {
      const response = await CreditLimitsApiService.getCreditLimitColumnList();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_COLUMN_LIST,
          data: response.data.data,
        });
        dispatch({
          type: CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_DEFAULT_COLUMN_LIST,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeCreditColumnList = data => {
  return dispatch => {
    dispatch({
      type: CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_CREDIT_LIMITS_COLUMN_LIST,
      data,
    });
  };
};

export const saveCreditLimitColumnList = ({ creditLimitsColumnList = {}, isReset = false }) => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest(
        `CreditLimitListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      let data = {
        columns: [],
        isReset: true,
      };
      if (!isReset) {
        const defaultFields = creditLimitsColumnList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = creditLimitsColumnList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          columns: [...defaultFields, ...customFields],
          isReset: false,
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopLoaderButtonOnSuccessOrFail(
            `CreditLimitListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
          throw Error();
        }
      }
      const response = await CreditLimitsApiService.updateCreditLimitsColumnList(data);
      if (response && response.data && response.data.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_DEFAULT_COLUMN_LIST,
          data: creditLimitsColumnList,
        });
        successNotification('Columns updated successfully.');
        stopLoaderButtonOnSuccessOrFail(
          `CreditLimitListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail(
        `CreditLimitListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      displayErrors(e);
    }
  };
};

export const getCreditLimitsFilter = () => {
  return async dispatch => {
    try {
      const response = await CreditLimitsApiService.getCreditLimitsFilterData();
      if (response && response.data && response.data.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_FILTER_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_FILTER_LIST,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const downloadCreditLimitCSV = () => {
  return async () => {
    try {
      startLoaderButtonOnRequest('creditLimitDownloadCreditLimitCSVButtonLoaderAction');
      const response = await CreditLimitsApiService.downloadCreditLimitCSVFile();
      if (response?.data?.status === 'SUCCESS') {
        stopLoaderButtonOnSuccessOrFail(`creditLimitDownloadCreditLimitCSVButtonLoaderAction`);
        return response;
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('creditLimitDownloadCreditLimitCSVButtonLoaderAction');
      displayErrors(e);
      throw Error();
    }
    return false;
  };
};

export const getCreditLimitsDetails = id => {
  return async dispatch => {
    try {
      const response = await CreditLimitsApiService.getCreditLimitsDetails(id);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_REDUX_CONSTANTS.SELECTED_CREDIT_LIMIT_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const modifyClientCreditLimit = (id, data) => {
  return async () => {
    try {
      startLoaderButtonOnRequest('modifyCreditLimitButtonLoaderAction');
      const response = await CreditLimitsApiService.modifyClientCreditLimitData(id, data);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'Credit limit updated successfully');
        stopLoaderButtonOnSuccessOrFail('modifyCreditLimitButtonLoaderAction');
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('modifyCreditLimitButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const surrenderClientCreditLimit = (id, data) => {
  return async () => {
    try {
      startLoaderButtonOnRequest('surrenderCreditLimitButtonLoaderAction');
      const response = await CreditLimitsApiService.surrenderClientCreditLimitData(id, data);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'Credit limit surrendered successfully');
        stopLoaderButtonOnSuccessOrFail('surrenderCreditLimitButtonLoaderAction');
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('surrenderCreditLimitButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const getCreditLimitsApplicationList = (id, param) => {
  return async dispatch => {
    const params = {
      listFor: 'debtor-application',
      ...param,
    };
    try {
      dispatch({
        type: CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS.CREDIT_LIMIT_APPLICATION_LIST_REQUEST,
      });
      const response = await CreditLimitsApiService.getCreditLimitsApplicationList(id, params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS.CREDIT_LIMIT_APPLICATION_LIST_SUCCESS,
          data: response.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getCreditLimitsApplicationColumnList = () => {
  return async dispatch => {
    try {
      const params = {
        columnFor: 'debtor-application',
      };
      const response = await CreditLimitsApiService.getCreditLimitsApplicationColumnList(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS.CREDIT_LIMITS_APPLICATION_COLUMN_LIST,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeCreditLimitsApplicationColumnList = data => {
  return dispatch => {
    dispatch({
      type: CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS.UPDATE_CREDIT_LIMITS_APPLICATION_COLUMN_LIST,
      data,
    });
  };
};

export const onSaveCreditLimitsApplicationColumnList = ({
  creditLimitsApplicationColumnList = {},
  isReset = false,
}) => {
  return async dispatch => {
    startLoaderButtonOnRequest(
      `CreditLimitApplicationColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
    );
    try {
      let data = {
        columns: [],
        isReset: true,
        columnFor: 'debtor-application',
      };
      if (!isReset) {
        const defaultFields = creditLimitsApplicationColumnList.defaultFields
          .filter(field => field.isChecked)
          .map(field => field.name);
        const customFields = creditLimitsApplicationColumnList.customFields
          .filter(field => field.isChecked)
          .map(field => field.name);
        data = {
          ...data,
          columns: [...defaultFields, ...customFields],
          isReset: false,
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopLoaderButtonOnSuccessOrFail(
            `CreditLimitApplicationColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
          throw Error();
        }
      }
      const response = await CreditLimitsApiService.updateCreditLimitsApplicationColumnList(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS.CREDIT_LIMITS_APPLICATION_DEFAULT_COLUMN_LIST,
          data: creditLimitsApplicationColumnList,
        });
        successNotification('Columns updated successfully.');
        stopLoaderButtonOnSuccessOrFail(
          `CreditLimitApplicationColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail(
        `CreditLimitApplicationColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      displayErrors(e);
    }
  };
};

export const getCreditLimitsTasksLists = (id, param) => {
  return async dispatch => {
    const params = {
      requestedEntityId: id,
      columnFor: 'debtor-task',
      ...param,
    };
    try {
      const response = await CreditLimitsApiService.getCreditLimitsTasksList(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.CREDIT_LIMITS_TASK_LIST,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getCreditLimitsTasksColumnList = () => {
  return async dispatch => {
    const params = {
      columnFor: 'debtor-task',
    };
    try {
      const response = await CreditLimitsApiService.getCreditLimitsTaskColumnList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.CREDIT_LIMITS_TASK_COLUMN_LIST,
          data: response.data.data,
        });
        dispatch({
          type: CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.CREDIT_LIMITS_TASK_DEFAULT_COLUMN_LIST,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeCreditLimitsTaskColumnList = data => {
  return dispatch => {
    dispatch({
      type: CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.UPDATE_CREDIT_LIMITS_TASK_COLUMN_LIST,
      data,
    });
  };
};

export const onSaveCreditLimitsTaskColumnList = ({
  creditLimitsTaskColumnList = {},
  isReset = false,
}) => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest(
        `CreditLimitTaskColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      let data = {
        columns: [],
        isReset: true,
        columnFor: 'debtor-task',
      };
      if (!isReset) {
        const defaultFields = creditLimitsTaskColumnList.defaultFields
          .filter(field => field.isChecked)
          .map(field => field.name);
        const customFields = creditLimitsTaskColumnList.customFields
          .filter(field => field.isChecked)
          .map(field => field.name);
        data = {
          ...data,
          columns: [...defaultFields, ...customFields],
          isReset: false,
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopLoaderButtonOnSuccessOrFail(
            `CreditLimitTaskColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
          throw Error();
        }
      }
      const response = await CreditLimitsApiService.updateCreditLimitsTaskColumnList(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.CREDIT_LIMITS_TASK_DEFAULT_COLUMN_LIST,
          data: creditLimitsTaskColumnList,
        });
        successNotification('Columns updated successfully.');
        stopLoaderButtonOnSuccessOrFail(
          `CreditLimitTaskColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail(
        `CreditLimitTaskColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      displayErrors(e);
    }
  };
};

export const getCreditLimitsTasksAssigneeDropDownData = () => {
  return async dispatch => {
    try {
      const response = await CreditLimitsApiService.getCreditLimitsTasksAssigneeDropDownData();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.ADD_TASK.CREDIT_LIMITS_ASSIGNEE_DROP_DOWN_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getCreditLimitsTasksEntityDropDownData = params => {
  return async dispatch => {
    try {
      const response = await CreditLimitsApiService.getCreditLimitsTasksEntityDropDownData(params);
      if (response.data.status === 'SUCCESS' && response.data.data) {
        dispatch({
          type: CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.ADD_TASK.CREDIT_LIMITS_ENTITY_DROP_DOWN_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getCreditLimitsTasksDefaultEntityDropDownData = params => {
  return async dispatch => {
    try {
      const response = await CreditLimitsApiService.getCreditLimitsTasksEntityDropDownData(params);
      if (response.data.status === 'SUCCESS' && response.data.data) {
        dispatch({
          type: CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.ADD_TASK
            .DEFAULT_CREDIT_LIMITS_ENTITY_DROP_DOWN_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const creditLimitsTasksUpdateAddTaskStateFields = (name, value) => {
  return dispatch => {
    dispatch({
      type: CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.ADD_TASK.CREDIT_LIMITS_UPDATE_ADD_TASK_FIELD,
      name,
      value,
    });
  };
};

export const saveCreditLimitsTaskData = (data, cb) => {
  return async dispatch => {
    try {
      const response = await CreditLimitsApiService.addNewCreditLimitsTask(data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.ADD_TASK.CREDIT_LIMITS_RESET_ADD_TASK_STATE,
        });
        successNotification(response?.data?.message || 'Task created successfully');
        cb();
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getCreditLimitsTaskDetail = id => {
  return async dispatch => {
    try {
      const response = await CreditLimitsApiService?.getCreditLimitsTaskDetailsById(id);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.EDIT_TASK.GET_CREDIT_LIMITS_TASK_DETAILS,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const updateCreditLimitsTaskData = (id, data, cb) => {
  return async dispatch => {
    try {
      const response = await CreditLimitsApiService.updateCreditLimitsTask(id, data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.ADD_TASK.CREDIT_LIMITS_RESET_ADD_TASK_STATE,
        });
        successNotification(response?.data?.message || 'Task updated successfully');
        cb();
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const deleteCreditLimitsTask = (taskId, cb) => {
  return async () => {
    try {
      const response = await CreditLimitsApiService.deleteCreditLimitsTasksList(taskId);
      if (response.data.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Task deleted successfully.');
        if (cb) {
          cb();
        }
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

// Documents starts here

export const getCreditLimitsDocumentsList = (id, params) => {
  return async dispatch => {
    const updatedParams = {
      ...params,
      documentFor: 'debtor',
    };
    try {
      dispatch({
        type: CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.REQUEST_CREDIT_LIMITS_DOCUMENTS_LIST,
      });
      const response = await CreditLimitsApiService.getCreditLimitsDocumentsList(id, updatedParams);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.CREDIT_LIMITS_DOCUMENTS_LIST_SUCCESS,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getCreditLimitsDocumentsColumnNamesList = () => {
  return async dispatch => {
    try {
      const params = {
        columnFor: 'client-document',
      };

      const response = await CreditLimitsApiService.getCreditLimitsDocumentsColumnNamesList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.CREDIT_LIMITS_DOCUMENTS_COLUMN_LIST,
          data: response.data.data,
        });
        dispatch({
          type: CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.CREDIT_LIMITS_DOCUMENTS_DEFAULT_COLUMN_LIST,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeCreditLimitsDocumentsColumnList = data => {
  return dispatch => {
    dispatch({
      type: CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.UPDATE_CREDIT_LIMITS_DOCUMENTS_COLUMN_LIST,
      data,
    });
  };
};

export const saveCreditLimitsDocumentsColumnList = ({
  creditLimitsDocumentColumnList = {},
  isReset = false,
}) => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest(
        `CreditLimitDocumentsColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      let data = {
        isReset: true,
        columns: [],
      };

      if (!isReset) {
        const defaultColumns = creditLimitsDocumentColumnList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = creditLimitsDocumentColumnList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          ...data,
          isReset: false,
          columns: [...defaultColumns, ...customFields],
        };
      }

      if (!isReset && data.columns.length < 1) {
        errorNotification('Please select at least one column to continue.');
        stopLoaderButtonOnSuccessOrFail(
          `CreditLimitDocumentsColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      } else {
        const response = await CreditLimitsApiService.updateCreditLimitsDocumentColumnListName(
          data
        );

        dispatch(getCreditLimitsDocumentsColumnNamesList());

        if (response && response.data && response.data.status === 'SUCCESS') {
          successNotification('Columns updated successfully.');
          stopLoaderButtonOnSuccessOrFail(
            `CreditLimitDocumentsColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
        }
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail(
        `CreditLimitDocumentsColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      displayErrors(e);
    }
  };
};

export const getCreditLimitsDocumentTypeList = () => {
  return async dispatch => {
    try {
      const params = {
        listFor: 'debtor',
      };
      const response = await CreditLimitsApiService.getCreditLimitsDocumentTypeList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.CREDIT_LIMITS_DOCUMENT_TYPE_LIST,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const creditLimitsUploadDocument = (data, config) => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest(`CreditLimitDocumentUploadButtonLoaderAction`);
      const response = await CreditLimitsApiService.uploadDocument(data, config);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.UPLOAD_DOCUMENT_CREDIT_LIMITS,
          data: response.data.data,
        });
        successNotification(response.data.message || 'Document uploaded successfully');
        stopLoaderButtonOnSuccessOrFail(`CreditLimitDocumentUploadButtonLoaderAction`);
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail(`CreditLimitDocumentUploadButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

export const downloadCreditLimitsDocuments = async data => {
  const str = data.toString();

  try {
    startLoaderButtonOnRequest(`CreditLimitDocumentDownloadButtonLoaderAction`);
    const config = {
      documentIds: str,
      action: 'download',
    };

    const response = await CreditLimitsApiService?.downloadDocuments(config);
    if (response?.statusText === 'OK') {
      stopLoaderButtonOnSuccessOrFail(`CreditLimitDocumentDownloadButtonLoaderAction`);
      return response;
    }
  } catch (e) {
    stopLoaderButtonOnSuccessOrFail(`CreditLimitDocumentDownloadButtonLoaderAction`);
    displayErrors(e);
  }
  return false;
};

export const deleteCreditLimitsDocumentAction = async (docId, cb) => {
  try {
    startLoaderButtonOnRequest(`CreditLimitDocumentDeleteButtonLoaderAction`);
    const response = await CreditLimitsApiService?.deleteCreditLimitsDocument(docId);
    if (response.data.status === 'SUCCESS') {
      successNotification(response?.data?.message || 'Document deleted successfully.');
      stopLoaderButtonOnSuccessOrFail(`CreditLimitDocumentDeleteButtonLoaderAction`);
      if (cb) {
        cb();
      }
    }
  } catch (e) {
    stopLoaderButtonOnSuccessOrFail(`CreditLimitDocumentDeleteButtonLoaderAction`);
    displayErrors(e);
  }
};

// notes start here

export const getCreditLimitsNoteList = (id, params) => {
  return async dispatch => {
    const updatedParams = {
      ...params,
      noteFor: 'debtor',
    };
    try {
      dispatch({
        type: CREDIT_LIMITS_NOTES_REDUX_CONSTANTS.REQUEST_CREDIT_LIMITS_NOTES_LIST,
      });
      const response = await CreditLimitsApiService.getCreditLimitsNoteList(id, updatedParams);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_NOTES_REDUX_CONSTANTS.CREDIT_LIMITS_NOTES_LIST_SUCCESS,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const addCreditLimitsNote = (entityId, noteData) => {
  return async dispatch => {
    try {
      const { description, isPublic } = noteData;
      const data = {
        noteFor: 'debtor',
        entityId,
        isPublic,
        description,
      };

      const response = await CreditLimitsApiService.addCreditLimitsNote(data);

      if (response.data.status === 'SUCCESS') {
        await dispatch(getCreditLimitsNoteList(entityId));
        successNotification(response?.data?.message || 'Note added successfully.');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const updateCreditLimitsNote = (entityId, noteData) => {
  return async dispatch => {
    try {
      const { noteId, description, isPublic } = noteData;
      const data = {
        noteFor: 'debtor',
        entityId,
        isPublic,
        description,
      };

      const response = await CreditLimitsApiService.updateCreditLimitsNote(noteId, data);

      if (response.data.status === 'SUCCESS') {
        await dispatch(getCreditLimitsNoteList(entityId));
        successNotification(response?.data?.message || 'Note updated successfully.');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const deleteCreditLimitsNote = async (noteId, cb) => {
  try {
    const response = await CreditLimitsApiService.deleteCreditLimitsNote(noteId);

    if (response.data.status === 'SUCCESS') {
      successNotification(response?.data?.message || 'Note deleted successfully.');
      if (cb) {
        cb();
      }
    }
  } catch (e) {
    displayErrors(e);
  }
};
