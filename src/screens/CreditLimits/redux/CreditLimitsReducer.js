import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';
import {
  CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS,
  CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS,
  CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS,
  CREDIT_LIMITS_FILTER_LIST_REDUX_CONSTANTS,
  CREDIT_LIMITS_NOTES_REDUX_CONSTANTS,
  CREDIT_LIMITS_REDUX_CONSTANTS,
  CREDIT_LIMITS_TASKS_REDUX_CONSTANTS,
} from './CreditLimitsReduxConstants';

const initialCreditLimitsListState = {
  creditLimitList: {
    docs: [],
    headers: [],
    total: 0,
    limit: 15,
    page: 1,
    pages: 1,
    isLoading: true,
  },
  viewCreditLimitActiveTabIndex: 0,
  selectedCreditLimitData: {},
  creditLimitsColumnList: {},
  creditLimitsDefaultColumnList: {},
  creditLimitsFilterList: {
    dropdownData: {
      entityType: [],
    },
  },
  application: {
    applicationList: {
      docs: [],
      headers: [],
      total: 0,
      limit: 15,
      page: 1,
      pages: 1,
      isLoading: false,
    },
    applicationColumnList: {},
    applicationDefaultColumnList: {},
  },
  tasks: {
    tasksList: { docs: [], headers: [], total: 0, limit: 15, page: 1, pages: 1, isLoading: false },
    tasksColumnList: {},
    tasksDefaultColumnList: {},
    addTask: {
      title: '',
      description: '',
      priority: [],
      entityType: [],
      entityId: [],
      assigneeId: [],
      dueDate: '',
      taskFrom: 'debtor-task',
    },
    dropDownData: {
      assigneeList: [],
      entityList: [],
      defaultEntityList: [],
    },
  },
  documents: {
    documentList: {
      docs: [],
      headers: [],
      total: 0,
      limit: 15,
      page: 1,
      pages: 1,
      isLoading: false,
    },
    documentTypeList: [],
    documentColumnList: {},
    documentDefaultColumnList: {},
  },
  notes: {
    noteList: { docs: [], headers: [], total: 0, limit: 15, page: 1, pages: 1, isLoading: false },
  },
};

export const creditLimits = (state = initialCreditLimitsListState, action) => {
  switch (action.type) {
    case CREDIT_LIMITS_REDUX_CONSTANTS.CREDIT_LIMITS_LIST_ACTION:
      return {
        ...state,
        creditLimitList: {
          isLoading: false,
          ...action.data,
        },
      };

    case CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_COLUMN_LIST:
      return {
        ...state,
        creditLimitsColumnList: action.data,
      };

    case CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_DEFAULT_COLUMN_LIST:
      return {
        ...state,
        creditLimitsDefaultColumnList: action.data,
      };

    case CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_CREDIT_LIMITS_COLUMN_LIST: {
      const columnList = {
        ...state?.creditLimitsColumnList,
      };
      const { type, name, value } = action?.data;
      columnList[`${type}`] = columnList[`${type}`].map(e =>
        e.name === name ? { ...e, isChecked: value } : e
      );
      return {
        ...state,
        creditLimitsColumnList: columnList,
      };
    }

    case CREDIT_LIMITS_FILTER_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_FILTER_LIST: {
      const dropdownData = { ...state?.creditLimitsFilterList?.dropdownData };
      Object.entries(action?.data)?.forEach(([key, value]) => {
        dropdownData[key] = value?.map(entity => ({
          label: entity?.name ?? entity.label,
          name: dropdownData[key] === 'entityType' && 'entityType',
          value: entity?._id ?? entity.value,
        }));
      });

      return {
        ...state,
        creditLimitsFilterList: {
          ...state?.creditLimitsFilterList,
          dropdownData,
        },
      };
    }

    case CREDIT_LIMITS_REDUX_CONSTANTS.SELECTED_CREDIT_LIMIT_DATA:
      return {
        ...state,
        selectedCreditLimitData: action?.data,
      };

    case CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS.CREDIT_LIMIT_APPLICATION_LIST_REQUEST:
      return {
        ...state,
        application: {
          ...state?.application,
          applicationList: {
            isLoading: true,
            ...state?.application?.applicationList,
          },
        },
      };

    case CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS.CREDIT_LIMIT_APPLICATION_LIST_SUCCESS:
      return {
        ...state,
        application: {
          ...state?.application,
          applicationList: {
            isLoading: false,
            ...action.data,
          },
        },
      };

    case CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS.CREDIT_LIMITS_APPLICATION_COLUMN_LIST:
      return {
        ...state,
        application: {
          ...state?.application,
          applicationColumnList: action.data,
        },
      };

    case CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS.CREDIT_LIMITS_APPLICATION_DEFAULT_COLUMN_LIST: {
      return {
        ...state,
        application: {
          ...state?.application,
          applicationDefaultColumnList: action.data,
        },
      };
    }

    case CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS.UPDATE_CREDIT_LIMITS_APPLICATION_COLUMN_LIST: {
      const applicationColumnList = {
        ...state.application.applicationColumnList,
      };
      const { type, name, value } = action?.data;
      applicationColumnList[`${type}`] = applicationColumnList?.[`${type}`]?.map(field =>
        field.name === name
          ? {
              ...field,
              isChecked: value,
            }
          : field
      );
      return {
        ...state,
        application: {
          ...state?.application,
          applicationColumnList,
        },
      };
    }

    // task starts here
    case CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.CREDIT_LIMITS_TASK_LIST: {
      return {
        ...state,
        tasks: {
          ...state?.tasks,
          tasksList: {
            isLoading: false,
            ...action.data,
          },
        },
      };
    }

    case CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.CREDIT_LIMITS_TASK_COLUMN_LIST:
      return {
        ...state,
        tasks: {
          ...state?.tasks,
          tasksColumnList: action?.data,
        },
      };

    case CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.CREDIT_LIMITS_TASK_DEFAULT_COLUMN_LIST:
      return {
        ...state,
        tasks: {
          ...state?.tasks,
          tasksDefaultColumnList: action?.data,
        },
      };

    case CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.UPDATE_CREDIT_LIMITS_TASK_COLUMN_LIST: {
      const columnList = {
        ...state?.tasks?.tasksColumnList,
      };
      const { type, name, value } = action?.data;
      columnList[`${type}`] = columnList[`${type}`].map(field =>
        field.name === name ? { ...field, isChecked: value } : field
      );
      return {
        ...state,
        tasks: {
          ...state?.tasks,
          tasksColumnList: columnList,
        },
      };
    }

    // task ends here

    // documents starts here
    case CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.REQUEST_CREDIT_LIMITS_DOCUMENTS_LIST:
      return {
        ...state,
        documents: {
          ...state?.documents,
          documentList: {
            isLoading: true,
            ...state?.documents?.documentList,
          },
        },
      };

    case CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.CREDIT_LIMITS_DOCUMENTS_LIST_SUCCESS:
      return {
        ...state,
        documents: {
          ...state?.documents,
          documentList: {
            isLoading: false,
            ...action.data,
          },
        },
      };

    case CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.CREDIT_LIMITS_DOCUMENTS_COLUMN_LIST: {
      return {
        ...state,
        documents: {
          ...state?.documents,
          documentColumnList: action.data,
        },
      };
    }

    case CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.CREDIT_LIMITS_DOCUMENTS_DEFAULT_COLUMN_LIST: {
      return {
        ...state,
        documents: {
          ...state?.documents,
          documentDefaultColumnList: action.data,
        },
      };
    }

    case CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.UPDATE_CREDIT_LIMITS_DOCUMENTS_COLUMN_LIST: {
      const columnList = {
        ...state?.documents?.documentColumnList,
      };
      const { type, name, value } = action?.data;
      columnList[`${type}`] = columnList[`${type}`].map(field =>
        field.name === name
          ? {
              ...field,
              isChecked: value,
            }
          : field
      );
      return {
        ...state,
        documents: {
          ...state?.documents,
          documentColumnList: columnList,
        },
      };
    }

    case CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.CREDIT_LIMITS_DOCUMENT_TYPE_LIST:
      return {
        ...state,
        documents: {
          ...state?.documents,
          documentTypeList: action?.data,
        },
      };
    // documents ends here

    // notes starts here
    case CREDIT_LIMITS_NOTES_REDUX_CONSTANTS.REQUEST_CREDIT_LIMITS_NOTES_LIST: {
      return {
        ...state,
        notes: {
          ...state?.notes,
          noteList: {
            isLoading: true,
            ...state?.notes?.noteList,
          },
        },
      };
    }

    case CREDIT_LIMITS_NOTES_REDUX_CONSTANTS.CREDIT_LIMITS_NOTES_LIST_SUCCESS: {
      return {
        ...state,
        notes: {
          ...state?.notes,
          noteList: { isLoading: false, ...action?.data },
        },
      };
    }

    case CREDIT_LIMITS_REDUX_CONSTANTS.VIEW_CREDIT_LIMIT_ACTIVE_TAB_INDEX:
      return {
        ...state,
        viewCreditLimitActiveTabIndex: action?.index,
      };

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};
