import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';
import {
  CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS,
  CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS,
  CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS,
  CREDIT_LIMITS_FILTER_LIST_REDUX_CONSTANTS, CREDIT_LIMITS_NOTES_REDUX_CONSTANTS,
  CREDIT_LIMITS_REDUX_CONSTANTS,
  CREDIT_LIMITS_TASKS_REDUX_CONSTANTS,
} from './CreditLimitsReduxConstants';

const initialCreditLimitsListState = {
  creditLimitList: { docs: [], headers:[], total: 0, limit: 15, page: 1, pages: 1, isLoading: true },
  selectedCreditLimitData: {},
  creditLimitsColumnList: {},
  creditLimitsDefaultColumnList: {},
  creditLimitsFilterList: {
    dropdownData: {
      entityType: []
    }
  },
  application: {
    applicationList: {docs: [], headers:[], total: 0, limit: 15, page: 1, pages: 1, isLoading: false},
    applicationColumnList: {},
    applicationDefaultColumnList: {}
  },
  tasks: {
    tasksList: {docs: [], headers:[], total: 0, limit: 15, page: 1, pages: 1, isLoading: false},
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
    documentList: {docs: [], headers:[], total: 0, limit: 15, page: 1, pages: 1, isLoading: false},
    documentTypeList: [],
    documentColumnList: {},
    documentDefaultColumnList: {}
  }
};

export const creditLimits = (state = initialCreditLimitsListState, action) => {
  switch (action.type) {
    case CREDIT_LIMITS_REDUX_CONSTANTS.CREDIT_LIMITS_LIST_ACTION:
      return {
        ...state,
        creditLimitList: {
          isLoading: false,
          ...action.data
        },
      };

    case CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_COLUMN_LIST:
      return {
        ...state,
        creditLimitsColumnList: action.data
      }

    case CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_DEFAULT_COLUMN_LIST:
      return {
        ...state,
        creditLimitsDefaultColumnList: action.data
      }

    case CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_CREDIT_LIMITS_COLUMN_LIST: {
      const columnList = {
        ...state?.creditLimitsColumnList
      };
      const {type, name, value} = action?.data;
      columnList[`${type}`] = columnList[`${type}`].map(e =>
              e.name===name ? {...e, isChecked: value}:e);
      return {
        ...state,
        creditLimitsColumnList: columnList
      }
    }

    case CREDIT_LIMITS_FILTER_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_FILTER_LIST:
      const dropdownData = {...state?.creditLimitsFilterList?.dropdownData};
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
          ...state.creditLimitsFilterList,
          dropdownData
        }
      }

    case CREDIT_LIMITS_REDUX_CONSTANTS.SELECTED_CREDIT_LIMIT_DATA:
      return {
        ...state,
        selectedCreditLimitData: action.data
      }

    case CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS.CREDIT_LIMIT_APPLICATION_LIST_REQUEST:
      return {
        ...state,
        application: {
          ...state?.application,
          applicationList: {
            isLoading: true,
            ...state?.application?.applicationList
          }
        }
      }

    case CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS.CREDIT_LIMIT_APPLICATION_LIST_SUCCESS:
      return {
        ...state,
        application: {
          ...state?.application,
          applicationList: {
            isLoading: false,
            ...action.data
          }
        }
      }

    case CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS.CREDIT_LIMITS_APPLICATION_COLUMN_LIST:
      return {
        ...state,
        application: {
          ...state?.application,
          applicationColumnList: action.data
        }
    }

    case CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS.CREDIT_LIMITS_APPLICATION_DEFAULT_COLUMN_LIST: {
      return {
        ...state,
        application: {
          ...state?.application,
          applicationDefaultColumnList: action.data
        }
      }
    }

    case CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS.UPDATE_CREDIT_LIMITS_APPLICATION_COLUMN_LIST: {
      const applicationColumnList = {
        ...state.application.applicationColumnList
      }
      const {type, name, value} = action?.data;
      applicationColumnList[`${type}`] = applicationColumnList?.[`${type}`]?.map(field => field.name === name ? {
        ...field,
        isChecked: value
      } : field);
      return {
        ...state,
        application: {
          ...state?.application,
          applicationColumnList: applicationColumnList
        }
      }
    }

    // task starts here
    case CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.CREDIT_LIMITS_TASK_LIST: {
      return {
        ...state,
        tasks: {
          ...state?.tasks,
          tasksList: {
            isLoading: false,
            ...action.data
          }
        }
      }
    }

    case CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.CREDIT_LIMITS_TASK_COLUMN_LIST:
      return {
        ...state,
        tasks: {
          ...state?.tasks,
          tasksColumnList: action?.data
        }
      }

    case CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.CREDIT_LIMITS_TASK_DEFAULT_COLUMN_LIST:
      return {
        ...state,
        tasks: {
          ...state?.tasks,
          tasksDefaultColumnList: action?.data
        }
      }

    case CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.UPDATE_CREDIT_LIMITS_TASK_COLUMN_LIST: {
      const columnList = {
       ...state?.tasks?.tasksColumnList
      };
      const {type, name, value} = action?.data;
      columnList[`${type}`] = columnList[`${type}`].map(field =>
              field.name === name ? {...field, isChecked: value} : field);
      console.log(columnList[`${type}`]);
      return {
        ...state,
        tasks: {
          ...state?.tasks,
          tasksColumnList: columnList
        }
      }
    }

    case CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.ADD_TASK.CREDIT_LIMITS_UPDATE_ADD_TASK_FIELD:
      return {
        ...state,
        task: {
          ...state?.task,
          addTask: {
            ...state?.task?.addTask,
            [action?.name]: action?.value,
          },
        },
      };

    case CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.ADD_TASK.CREDIT_LIMITS_ASSIGNEE_DROP_DOWN_DATA: {
      const assigneeList = action?.data?.map(data => ({
        label: data?.name,
        value: data?._id,
        name: 'assigneeId',
      }));
      return {
        ...state,
        task: {
          ...state?.task,
          dropDownData: {
            ...state?.task?.dropDownData,
            assigneeList,
          },
        },
      };
    }

    case CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.ADD_TASK.CREDIT_LIMITS_ENTITY_DROP_DOWN_DATA: {
      const entityList = action?.data?.map(data => ({
        label: data?.name ?? data?.applicationId,
        value: data?._id,
        name: 'entityId',
      }));
      return {
        ...state,
        task: {
          ...state?.task,
          dropDownData: {
            ...state?.task?.dropDownData,
            entityList,
          },
        },
      };
    }

    case CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.ADD_TASK.DEFAULT_CREDIT_LIMITS_ENTITY_DROP_DOWN_DATA: {
      const defaultEntityList = action?.data?.map(data => ({
        label: data?.name ?? data?.applicationId,
        value: data?._id,
        name: 'entityId',
      }));
      return {
        ...state,
        task: {
          ...state?.task,
          dropDownData: {
            ...state?.task?.dropDownData,
            defaultEntityList,
          },
        },
      };
    }

    case CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.ADD_TASK.CREDIT_LIMITS_RESET_ADD_TASK_STATE:
      return {
        ...state,
        task: {
          ...state?.task,
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
        },
      };


          //task ends here

    // documents starts here
    case CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.REQUEST_CREDIT_LIMITS_DOCUMENTS_LIST:
      return {
        ...state,
        documents: {
          ...state?.documents,
          documentList: {
            isLoading: true,
            ...state?.documents?.documentList
          }
        }
      }

    case CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.CREDIT_LIMITS_DOCUMENTS_LIST_SUCCESS:
      return {
        ...state,
        documents: {
          ...state?.documents,
          documentList: {
            isLoading: false,
            ...action.data
          }
        }
      }

    case CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.CREDIT_LIMITS_DOCUMENTS_COLUMN_LIST: {
      return {
        ...state,
        documents: {
          ...state?.documents,
          documentColumnList: action.data
        }
      }
    }

    case CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.CREDIT_LIMITS_DOCUMENTS_DEFAULT_COLUMN_LIST: {
      return {
        ...state,
        documents: {
          ...state?.documents,
          documentDefaultColumnList: action.data
        }
      }
    }

    case CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.UPDATE_CREDIT_LIMITS_DOCUMENTS_COLUMN_LIST: {
      const columnList = {
        ...state?.documents?.documentColumnList
      };
      const {type, name, value} = action?.data;
      columnList[`${type}`] = columnList[`${type}`].map(field => field.name === name ? {...field, isChecked: value} : field);
      return {
        ...state,
        documents: {
          ...state?.documents,
          documentColumnList: columnList
        }
      }
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


          //notes starts here

    case CREDIT_LIMITS_NOTES_REDUX_CONSTANTS.REQUEST_CREDIT_LIMITS_NOTES_LIST: {
      return {

      }
    }
    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};


