import _ from 'lodash';
import { errorNotification, successNotification } from '../../../common/Toast';
import CreditLimitsApiService from '../services/CreditLimitsApiService';
import {
  CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS,
  CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS,
  CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS,
  CREDIT_LIMITS_FILTER_LIST_REDUX_CONSTANTS,
  CREDIT_LIMITS_NOTES_REDUX_CONSTANTS,
  CREDIT_LIMITS_REDUX_CONSTANTS,
  CREDIT_LIMITS_STAKE_HOLDER_REDUX_CONSTANTS,
  CREDIT_LIMITS_TASKS_REDUX_CONSTANTS,
} from './CreditLimitsReduxConstants';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { store } from '../../../redux/store';
import { DashboardApiService } from '../../../common/Dashboard/services/DashboardApiService';

export const getCreditLimitsList = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    const finalParams = {}
    // eslint-disable-next-line no-unused-vars
    Object.entries(params).forEach(([key, value]) => {
    if (_.isArray(value)) {
     finalParams[key] = value
         ?.map(record =>
           record?.value
         )
         .join(',');
     } else if (_.isObject(value)) {
       finalParams[key] = value?.value;
     } else {
       finalParams[key] = value || undefined;
     }
   });
   
    try {
      startGeneralLoaderOnRequest('creditLimitListPageLoaderAction');
      const response = await CreditLimitsApiService.getAllCreditLimitsList(finalParams);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_REDUX_CONSTANTS.CREDIT_LIMITS_LIST_ACTION,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('creditLimitListPageLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('creditLimitListPageLoaderAction');
      displayErrors(e);
    }
  };
};

export const getCreditLimitColumnList = () => {
  return async dispatch => {
    try {
      const params = {
        columnFor: 'credit-limit',
      };
      const response = await CreditLimitsApiService.getCreditLimitColumnList(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_COLUMN_LIST,
          data: response?.data?.data,
        });
        dispatch({
          type: CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_DEFAULT_COLUMN_LIST,
          data: response?.data?.data,
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
      startGeneralLoaderOnRequest(
        `CreditLimitListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      let data = {
        columns: [],
        isReset: true,
        columnFor: 'credit-limit',
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
          columnFor: 'credit-limit',
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopGeneralLoaderOnSuccessOrFail(
            `CreditLimitListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
          throw Error();
        }
      }
      const response = await CreditLimitsApiService.updateCreditLimitsColumnList(data);
      if (response && response.data && response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_DEFAULT_COLUMN_LIST,
          data: creditLimitsColumnList,
        });
        successNotification('Columns updated successfully.');
        stopGeneralLoaderOnSuccessOrFail(
          `CreditLimitListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(
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
      if (response && response.data && response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_FILTER_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_FILTER_LIST,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
export const getCreditLimitsFilterDropDownDataBySearch = options => {
  return async dispatch => {
    try {
      const response = await DashboardApiService.getEntitiesBySearch(options);

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_FILTER_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_LIST_BY_SEARCH,
          data: response?.data?.data,
          name: options.entityType,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const downloadCreditLimitCSV = (params) => {
  return async () => {
    try {
      startGeneralLoaderOnRequest('creditLimitDownloadCreditLimitCSVButtonLoaderAction');
      const response = await CreditLimitsApiService.downloadCreditLimitCSVFile(params);
      if (response?.statusText === 'OK') {
        stopGeneralLoaderOnSuccessOrFail(`creditLimitDownloadCreditLimitCSVButtonLoaderAction`);
        return response;
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('creditLimitDownloadCreditLimitCSVButtonLoaderAction');
      if (e.response.status === 400) {
        errorNotification(
          'User cannot download more than 500 records at a time. Please apply filter to narrow down the list'
        );
      }
      displayErrors(e);
      throw Error();
    }
    return false;
  };
};

export const getCreditLimitsDetails = id => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('viewCreditLimitPageLoaderAction');
      const response = await CreditLimitsApiService.getCreditLimitsDetails(id);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_REDUX_CONSTANTS.SELECTED_CREDIT_LIMIT_DATA,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('viewCreditLimitPageLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('viewCreditLimitPageLoaderAction');
      displayErrors(e);
    }
  };
};

export const modifyClientCreditLimit = (id, data) => {
  return async () => {
    try {
      startGeneralLoaderOnRequest('modifyCreditLimitButtonLoaderAction');
      const response = await CreditLimitsApiService.modifyClientCreditLimitData(id, data);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'Credit limit updated successfully');
        stopGeneralLoaderOnSuccessOrFail('modifyCreditLimitButtonLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('modifyCreditLimitButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const surrenderClientCreditLimit = (id, data) => {
  return async () => {
    try {
      startGeneralLoaderOnRequest('surrenderCreditLimitButtonLoaderAction');
      const response = await CreditLimitsApiService.surrenderClientCreditLimitData(id, data);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'Credit limit surrendered successfully');
        stopGeneralLoaderOnSuccessOrFail('surrenderCreditLimitButtonLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('surrenderCreditLimitButtonLoaderAction');
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
          data: response?.data?.data,
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
    startGeneralLoaderOnRequest(
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
          stopGeneralLoaderOnSuccessOrFail(
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
        stopGeneralLoaderOnSuccessOrFail(
          `CreditLimitApplicationColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(
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
          data: response?.data?.data,
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
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.CREDIT_LIMITS_TASK_COLUMN_LIST,
          data: response?.data?.data,
        });
        dispatch({
          type: CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.CREDIT_LIMITS_TASK_DEFAULT_COLUMN_LIST,
          data: response?.data?.data,
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
      startGeneralLoaderOnRequest(
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
          stopGeneralLoaderOnSuccessOrFail(
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
        stopGeneralLoaderOnSuccessOrFail(
          `CreditLimitTaskColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(
        `CreditLimitTaskColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      displayErrors(e);
    }
  };
};
// Tasks ends here

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
          data: response?.data?.data,
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
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.CREDIT_LIMITS_DOCUMENTS_COLUMN_LIST,
          data: response?.data?.data,
        });
        dispatch({
          type: CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.CREDIT_LIMITS_DOCUMENTS_DEFAULT_COLUMN_LIST,
          data: response?.data?.data,
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
      startGeneralLoaderOnRequest(
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
        stopGeneralLoaderOnSuccessOrFail(
          `CreditLimitDocumentsColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      } else {
        const response = await CreditLimitsApiService.updateCreditLimitsDocumentColumnListName(
          data
        );

        dispatch(getCreditLimitsDocumentsColumnNamesList());

        if (response && response.data && response?.data?.status === 'SUCCESS') {
          successNotification('Columns updated successfully.');
          stopGeneralLoaderOnSuccessOrFail(
            `CreditLimitDocumentsColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
        }
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(
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
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.CREDIT_LIMITS_DOCUMENT_TYPE_LIST,
          data: response?.data?.data,
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
      startGeneralLoaderOnRequest(`CreditLimitDocumentUploadButtonLoaderAction`);
      const response = await CreditLimitsApiService.uploadDocument(data, config);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.UPLOAD_DOCUMENT_CREDIT_LIMITS,
          data: response?.data?.data,
        });
        successNotification(response.data.message || 'Document uploaded successfully');
        stopGeneralLoaderOnSuccessOrFail(`CreditLimitDocumentUploadButtonLoaderAction`);
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`CreditLimitDocumentUploadButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

export const downloadCreditLimitsDocuments = async data => {
  const str = data.toString();

  try {
    startGeneralLoaderOnRequest(`CreditLimitDocumentDownloadButtonLoaderAction`);
    const config = {
      documentIds: str,
      action: 'download',
    };

    const response = await CreditLimitsApiService?.downloadDocuments(config);
    if (response?.statusText === 'OK') {
      stopGeneralLoaderOnSuccessOrFail(`CreditLimitDocumentDownloadButtonLoaderAction`);
      return response;
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail(`CreditLimitDocumentDownloadButtonLoaderAction`);
    displayErrors(e);
  }
  return false;
};

export const deleteCreditLimitsDocumentAction = async (docId, cb) => {
  try {
    startGeneralLoaderOnRequest(`CreditLimitDocumentDeleteButtonLoaderAction`);
    const response = await CreditLimitsApiService?.deleteCreditLimitsDocument(docId);
    if (response?.data?.status === 'SUCCESS') {
      successNotification(response?.data?.message || 'Document deleted successfully.');
      stopGeneralLoaderOnSuccessOrFail(`CreditLimitDocumentDeleteButtonLoaderAction`);
      if (cb) {
        cb();
      }
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail(`CreditLimitDocumentDeleteButtonLoaderAction`);
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
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_NOTES_REDUX_CONSTANTS.CREDIT_LIMITS_NOTES_LIST_SUCCESS,
          data: response?.data?.data,
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

      if (response?.data?.status === 'SUCCESS') {
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

      if (response?.data?.status === 'SUCCESS') {
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

    if (response?.data?.status === 'SUCCESS') {
      successNotification(response?.data?.message || 'Note deleted successfully.');
      if (cb) {
        cb();
      }
    }
  } catch (e) {
    displayErrors(e);
  }
};

export const setViewCreditLimitActiveTabIndex = index => {
  store.dispatch({
    type: CREDIT_LIMITS_REDUX_CONSTANTS.VIEW_CREDIT_LIMIT_ACTIVE_TAB_INDEX,
    index,
  });
};

export const resetCreditLimitListData = () => {
  return dispatch => {
    dispatch({
      type: CREDIT_LIMITS_REDUX_CONSTANTS.RESET_CREDIT_LIMIT_LIST_DATA,
    });
  };
};

export const resetViewCreditLimitData = () => {
  return dispatch => {
    dispatch({
      type: CREDIT_LIMITS_REDUX_CONSTANTS.RESET_VIEW_CREDIT_LIMIT_DATA,
    });
  };
};

// stakeHolder

export const getCreditLimitsStakeHolderList = (id, param) => {
  return async dispatch => {
    const params = {
      ...param,
    };
    try {
      startGeneralLoaderOnRequest('creditLimitStakeHolderListLoader');
      const response = await CreditLimitsApiService.getCreditLimitsStakeHolderList(id, params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_STAKE_HOLDER_REDUX_CONSTANTS.CREDIT_LIMIT_STAKE_HOLDER_LIST_SUCCESS,
          data: response.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('creditLimitStakeHolderListLoader');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('creditLimitStakeHolderListLoader');
      displayErrors(e);
    }
  };
};

export const getCreditLimitsStakeHolderColumnList = () => {
  return async dispatch => {
    try {
      const params = {
        columnFor: 'stakeholder',
      };
      const response = await CreditLimitsApiService.getCreditLimitsStakeHolderColumnList(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_STAKE_HOLDER_REDUX_CONSTANTS.CREDIT_LIMITS_STAKE_HOLDER_COLUMN_LIST,
          data: response?.data?.data,
        });
        dispatch({
          type: CREDIT_LIMITS_STAKE_HOLDER_REDUX_CONSTANTS.CREDIT_LIMITS_STAKE_HOLDER_DEFAULT_COLUMN_LIST,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeCreditLimitsStakeHolderColumnList = data => {
  return dispatch => {
    dispatch({
      type: CREDIT_LIMITS_STAKE_HOLDER_REDUX_CONSTANTS.UPDATE_CREDIT_LIMITS_STAKE_HOLDER_COLUMN_LIST,
      data,
    });
  };
};

export const onSaveCreditLimitsStakeHolderColumnList = ({
  stakeHolderColumnList = {},
  isReset = false,
}) => {
  return async dispatch => {
    startGeneralLoaderOnRequest(
      `CreditLimitStakeHolderColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
    );
    try {
      let data = {
        columns: [],
        isReset: true,
        columnFor: 'stakeholder',
      };
      if (!isReset) {
        const defaultFields = stakeHolderColumnList.defaultFields
          .filter(field => field.isChecked)
          .map(field => field.name);
        const customFields = stakeHolderColumnList.customFields
          .filter(field => field.isChecked)
          .map(field => field.name);
        data = {
          ...data,
          columns: [...defaultFields, ...customFields],
          isReset: false,
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopGeneralLoaderOnSuccessOrFail(
            `CreditLimitStakeHolderColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
          throw Error();
        }
      }
      const response = await CreditLimitsApiService.updateCreditLimitsStakeHolderColumnList(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CREDIT_LIMITS_STAKE_HOLDER_REDUX_CONSTANTS.CREDIT_LIMITS_STAKE_HOLDER_DEFAULT_COLUMN_LIST,
          data: stakeHolderColumnList,
        });
        successNotification('Columns updated successfully.');
        stopGeneralLoaderOnSuccessOrFail(
          `CreditLimitStakeHolderColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(
        `CreditLimitStakeHolderColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      displayErrors(e);
    }
  };
};

export const downloadCreditLimitDecisionLetter = id => {
  return async () => {
    try {
      startGeneralLoaderOnRequest('decisionLetterDownloadButtonLoaderAction');
      const response = await CreditLimitsApiService.downloadCreditLimitDecisionLetter(id);
      if (response?.statusText === 'OK') {
        stopGeneralLoaderOnSuccessOrFail(`decisionLetterDownloadButtonLoaderAction`);
        return response;
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('decisionLetterDownloadButtonLoaderAction');
      if (e?.response?.statusText === 'Bad Request') {
        errorNotification('No decision letter found');
      }
      throw Error();
    }
    return false;
  };
};

export const CreditLimitApplicationDownloadTab = async id => {
  startGeneralLoaderOnRequest('CreditLimitapplicationDownloadButtonLoaderAction');
  try {
    const response = await CreditLimitsApiService.downloadApplicationCSVFile(id);
    if (response?.statusText === 'OK') {
      stopGeneralLoaderOnSuccessOrFail(`CreditLimitapplicationDownloadButtonLoaderAction`);
      return response;
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail(`CreditLimitapplicationDownloadButtonLoaderAction`);
    displayErrors(e);
  }
  return false;
};