import {
  APPLICATION_COLUMN_LIST_REDUX_CONSTANTS,
  APPLICATION_FILTER_LIST_REDUX_CONSTANTS,
  APPLICATION_REDUX_CONSTANTS,
} from './ApplicationReduxConstants';

const initialApplicationList = {
  applicationList: {
    docs: [],
    total: 1,
    limit: 15,
    page: 1,
    pages: 1,
    headers: [],
    isLoading: false,
  },
  applicationColumnNameList: {},
  applicationDefaultColumnNameList: {},

  applicationFilterList: {
    dropdownData: {
      debtors: [],
      streetType: [],
      australianStates: [],
      newZealandStates: [],
      entityType: [],
      applicationStatus: [],
      companyEntityType: [],
      countryList: [],
    },
  },

  editApplication: {
    applicationStage: 0,
    _id: '',
    entityType: '',
    company: {
      postCode: '',
      state: null,
      country: {
        label: 'Australia',
        name: 'country',
        value: 'AUS',
      },
      suburb: '',
      streetType: null,
      streetName: '',
      streetNumber: '',
      unitNumber: '',
      property: '',
      address: '',
      outstandingAmount: '',
      entityType: null,
      phoneNumber: '',
      entityName: null,
      acn: '',
      abn: '',
      registrationNumber: '',
      tradingName: '',
      debtorId: null,
      clientList: null,
      wipeOutDetails: false,
      errors: {},
    },
    creditLimit: {
      isExtendedPaymentTerms: false,
      extendedPaymentTermsDetails: '',
      isPassedOverdueAmount: false,
      passedOverdueDetails: '',
      creditLimit: '',
      note: '',
      errors: {},
    },
    documents: {
      documentTypeList: [],
      uploadDocumentApplicationData: [],
    },
    partners: [],
  },

  companyData: {
    dropdownData: {
      debtors: [],
      streetType: [],
      australianStates: [],
      newZealandStates: [],
      entityType: [],
      countryList: [],
    },
    entityNameSearch: {
      isLoading: false,
      error: false,
      errorMessage: '',
      data: [],
    },
  },

  viewApplication: {
    isLoading: true,
    applicationDetail: {},
    task: {
      taskList: [],
    },
    applicationModulesList: {
      documents: [],
      logs: [],
      viewApplicationDocumentType: [],
    },
    notes: {
      noteList: [],
    },
    dropDownData: {
      assigneeList: [],
      entityList: [],
      defaultEntityList: [],
    },
  },
};

export const application = (state = initialApplicationList, action) => {
  switch (action.type) {
    case APPLICATION_REDUX_CONSTANTS.APPLICATION_LIST_REQUEST:
      return {
        ...state,
        applicationList: {
          ...state?.applicationList,
          isLoading: true,
        },
      };

    case APPLICATION_REDUX_CONSTANTS.APPLICATION_LIST_SUCCESS:
      return {
        ...state,
        applicationList: {
          ...state?.applicationList,
          ...action?.data,
          isLoading: false,
        },
      };

    case APPLICATION_REDUX_CONSTANTS.APPLICATION_LIST_FAILURE:
      return {
        ...state,
        applicationList: {
          ...state?.applicationList,
          isLoading: false,
        },
      };
    case APPLICATION_REDUX_CONSTANTS.RESET_APPLICATION_LIST_PAGINATION_DATA:
      return {
        ...state,
        applicationList: {
          ...state?.applicationList,
          page: action?.page,
          pages: action?.pages,
          total: action?.total,
          limit: action?.limit,
        },
      };
    case APPLICATION_REDUX_CONSTANTS.APPLICATION_DETAILS:
      return {
        ...state,
        editApplication: { ...state?.editApplication, ...action?.data },
      };
    case APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.APPLICATION_COLUMN_LIST_ACTION:
      return {
        ...state,
        applicationColumnNameList: action?.data,
      };
    case APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.APPLICATION_DEFAULT_COLUMN_LIST_ACTION:
      return {
        ...state,
        applicationDefaultColumnNameList: action?.data,
      };
    case APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_APPLICATION_COLUMN_LIST_ACTION: {
      const columnList = {
        ...state?.applicationColumnNameList,
      };
      const { type, name, value } = action?.data;
      columnList[`${type}`] = columnList[`${type}`].map(e =>
        e.name === name ? { ...e, isChecked: value } : e
      );
      return {
        ...state,
        applicationColumnNameList: columnList,
      };
    }
    case APPLICATION_FILTER_LIST_REDUX_CONSTANTS.APPLICATION_FILTER_LIST_ACTION: {
      const dropdownData = { ...state?.applicationFilterList?.dropdownData };
      Object.entries(action?.data)?.forEach(([key, value]) => {
        dropdownData[key] = value?.data?.map(entity => ({
          label: entity?.name || entity?.label,
          name: value?.field,
          value: entity?._id || entity?.value,
        }));
      });
      const applicationFilterList = {
        ...state?.applicationFilterList,
        dropdownData,
      };

      return {
        ...state,
        applicationFilterList,
      };
    }

    // Company step
    case APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_DROP_DOWN_DATA: {
      const dropdownData = { ...state?.companyData?.dropdownData };
      Object.entries(action?.data)?.forEach(([key, value]) => {
        dropdownData[key] = value?.data?.map(entity => ({
          label: entity?.name,
          name: value?.field,
          value: entity?._id,
        }));
      });
      const companyData = {
        ...state?.companyData,
        dropdownData,
      };

      return {
        ...state,
        companyData,
      };
    }

    case APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_WIPE_OUT_OLD_DATA_ON_SUCCESS: {
      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          company: {
            ...state?.editApplication?.company,
            debtorId: action?.isDebtor ? { ...state?.editApplication?.company?.debtorId } : [],
            postCode: '',
            state: [],
            entityType: [],
            entityName: [],
            acn: '',
            abn: '',
            tradingName: '',
          },
        },
      };
    }
    case APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_ENTITY_TYPE_DATA: {
      const entityNameSearch = { ...action?.data };
      const companyData = {
        ...state?.companyData,
        entityNameSearch,
      };

      return {
        ...state,
        companyData,
      };
    }

    // edit application
    case APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
      .APPLICATION_COMPANY_EDIT_APPLICATION_CHANGE_FIELD_VALUE: {
        return {
          ...state,
          editApplication: {
            ...state?.editApplication,
            [action?.name]: action?.value,
          },
        };
      }
    case APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
      .APPLICATION_COMPANY_EDIT_APPLICATION_RESET_DATA: {
        return {
          ...state,
          editApplication: {
            ...initialApplicationList?.editApplication,
          },
        };
      }
    case APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
      .APPLICATION_COMPANY_EDIT_APPLICATION_UPDATE_ALL_DATA: {
        return {
          ...state,
          editApplication: {
            ...state?.editApplication,
            [action?.stepName]: { ...state?.editApplication?.[action?.stepName], ...action?.data },
          },
        };
      }
    case APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
      .APPLICATION_COMPANY_EDIT_APPLICATION_UPDATE_FIELD: {
        return {
          ...state,
          editApplication: {
            ...state?.editApplication,
            [action?.stepName]: {
              ...state?.editApplication?.[action?.stepName],
              [action?.name]: action?.value,
            },
          },
        };
      }

    case APPLICATION_REDUX_CONSTANTS.PERSON.ADD_APPLICATION_PERSON: {
      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          partners: [...(state?.editApplication?.partners ?? []), action?.data],
        },
      };
    }

    case APPLICATION_REDUX_CONSTANTS.PERSON.REMOVE_APPLICATION_PERSON: {
      const perStep = state?.editApplication?.partners;
      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          partners: perStep.filter((e, i) => i !== action?.data),
        },
      };
    }

    case APPLICATION_REDUX_CONSTANTS.PERSON.WIPE_OUT_PERSON_STEP_DATA: {
      // const perStep = state?.editApplication.partners;
      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          partners: action?.data,
        },
      };
    }

    case APPLICATION_REDUX_CONSTANTS.PERSON.EDIT_APPLICATION_PERSON: {
      const partners = [...state?.editApplication?.partners];
      partners[action?.index] = {
        ...partners?.[action?.index],
        [action?.name]: action?.value,
      };

      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          partners,
        },
      };
    }

    case APPLICATION_REDUX_CONSTANTS.PERSON.PERSON_STEP_COMPANY_EDIT_APPLICATION_UPDATE_ALL_DATA: {
      const partners = [...state?.editApplication?.partners];
      partners[action?.index] = {
        ...partners[action?.index],
        tradingName: action?.data?.tradingName ?? '',
        entityType: action?.data?.entityType ?? '',
        entityName: action?.data?.entityName ?? '',
        abn: action?.data?.abn ?? '',
        acn: action?.data?.acn ?? '',
      };

      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          partners,
        },
      };
    }

    case APPLICATION_REDUX_CONSTANTS.PERSON.CHANGE_APPLICATION_PERSON_TYPE: {
      const partners = [...state?.editApplication?.partners];
      partners[action?.index] = {
        ...partners[action?.index],
        type: action?.personType,
      };

      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          partners,
        },
      };
    }

    // Documents
    case APPLICATION_REDUX_CONSTANTS.DOCUMENTS.DOCUMENT_TYPE_LIST_DATA:
      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          documents: {
            ...state?.editApplication?.documents,
            documentTypeList: action?.data,
          },
        },
      };

    case APPLICATION_REDUX_CONSTANTS.DOCUMENTS.APPLICATION_DOCUMENT_GET_UPLOAD_DOCUMENT_DATA: {
      const editApplication = { ...state?.editApplication };
      const documents = { ...editApplication?.documents };
      const uploadDocumentApplicationData = [...action?.data];

      return {
        ...state,
        editApplication: {
          ...editApplication,
          documents: {
            ...documents,
            uploadDocumentApplicationData,
          },
        },
      };
    }
    case APPLICATION_REDUX_CONSTANTS.DOCUMENTS.UPLOAD_DOCUMENT_DATA: {
      const editApplication = { ...state?.editApplication };
      const documents = { ...editApplication?.documents };
      const uploadDocumentApplicationData = [...documents?.uploadDocumentApplicationData];

      return {
        ...state,
        editApplication: {
          ...editApplication,
          documents: {
            ...documents,
            uploadDocumentApplicationData: [...uploadDocumentApplicationData, action?.data],
          },
        },
      };
    }

    // View Application

    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_DETAIL_REQUEST_ACTION:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          isLoading: true,
        },
      };
    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_DETAIL_FAIL_ACTION:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          isLoading: false,
        },
      };
    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.VIEW_APPLICATION_DATA_RESET:
      return {
        ...state,
        viewApplication: {
          ...initialApplicationList?.viewApplication,
        },
      };

    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_DETAIL_ACTION:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          isLoading: false,
          applicationDetail: action?.data,
        },
      };

    // application task
    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK.APPLICATION_TASK_LIST_ACTION:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          isLoading: false,
          task: {
            ...state?.viewApplication?.task,
            taskList: action?.data,
          },
        },
      };

    // Application Module
    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_MODULES
      .APPLICATION_MODULE_LIST_DATA:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          applicationModulesList: {
            ...state?.viewApplication?.applicationModulesList,
            ...action?.data,
          },
        },
      };

    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_MODULES
      .VIEW_APPLICATION_DOCUMENT_TYPE_LIST_DATA:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          applicationModulesList: {
            ...state?.viewApplication?.applicationModulesList,
            viewApplicationDocumentType: action?.data,
          },
        },
      };

    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_MODULES
      .VIEW_APPLICATION_UPLOAD_DOCUMENT_DATA:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          applicationModulesList: {
            ...state?.viewApplication?.applicationModulesList,
            documents: [...state?.viewApplication?.applicationModulesList?.documents, action?.data],
          },
        },
      };

    // notes
    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_NOTES.APPLICATION_NOTES_LIST_DATA:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          notes: {
            ...state?.viewApplication?.notes,
            noteList: action?.data,
          },
        },
      };

    default:
      return state;
  }
};
