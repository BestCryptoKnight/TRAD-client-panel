import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import Input from '../../../../../common/Input/Input';
import {
  getApplicationCompanyDataFromABNOrACN,
  getApplicationCompanyDataFromDebtor,
  getApplicationCompanyDropDownData,
  searchApplicationCompanyEntityName,
  updateEditApplicationData,
  updateEditApplicationField,
} from '../../../redux/ApplicationAction';
import Loader from '../../../../../common/Loader/Loader';
import ApplicationEntityNameTable from '../components/ApplicationEntityNameTable/ApplicationEntityNameTable';
import Modal from '../../../../../common/Modal/Modal';
import IconButton from '../../../../../common/IconButton/IconButton';
import { errorNotification } from '../../../../../common/Toast';
import { applicationErrorHelper } from '../../../../../helpers/applicationErrorHelper';
import { APPLICATION_REDUX_CONSTANTS } from '../../../redux/ApplicationReduxConstants';

export const DRAWER_ACTIONS = {
  SHOW_DRAWER: 'SHOW_DRAWER',
  UPDATE_DATA: 'UPDATE_DATA',
  HIDE_DRAWER: 'HIDE_DRAWER',
};

const drawerInitialState = {
  visible: false,
  data: null,
};

const drawerReducer = (state, action) => {
  switch (action.type) {
    case DRAWER_ACTIONS.SHOW_DRAWER:
      return {
        visible: true,
        data: action.data,
      };
    case DRAWER_ACTIONS.HIDE_DRAWER:
      return { ...drawerInitialState };
    case DRAWER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        ...action.data,
      };

    default:
      return state;
  }
};

const ApplicationCompanyStep = () => {
  const dispatch = useDispatch();

  const companyState = useSelector(
    ({ application }) => application?.editApplication?.company ?? {}
  );
  const { partners, errors } = useSelector(({ application }) => application?.editApplication ?? {});
  const { debtors, streetType, australianStates, newZealandStates, entityType, countryList } =
    useSelector(({ application }) => application?.companyData?.dropdownData ?? {});
  const entityNameSearchDropDownData = useSelector(
    ({ application }) => application?.companyData?.entityNameSearch ?? {}
  );

  const [drawerState, dispatchDrawerState] = useReducer(drawerReducer, drawerInitialState);
  const [stateValue, setStateValue] = useState([]);
  const [isAusOrNew, setIsAusOrNew] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [searchedEntityNameValue, setSearchedEntityNameValue] = useState('');

  const toggleConfirmationModal = useCallback(
    value => setShowConfirmModal(value !== undefined ? value : e => !e),
    [setShowConfirmModal]
  );

  const [errorMessage, setErrorMessage] = useState('');
  const [errorModal, setErrorModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);

  const prevRef = useRef({});

  useEffect(() => {
    const country = companyState?.country?.value ?? '';
    let showDropDownInput = true;

    switch (country) {
      case 'AUS':
      case 'NZL':
        setStateValue(country === 'AUS' ? australianStates : newZealandStates);
        break;
      default:
        showDropDownInput = false;
        break;
    }
    setIsAusOrNew(showDropDownInput);
    if (!prevRef.current?.abn) {
      prevRef.current = { ...prevRef.current, abn: companyState.abn };
    }
    if (!prevRef.current?.acn) {
      prevRef.current = { ...prevRef.current, acn: companyState?.acn };
    }
  }, [
    companyState.abn,
    companyState.acn,
    prevRef,
    companyState?.country?.value,
    newZealandStates,
    australianStates,
  ]);

  const updateSingleCompanyState = useCallback((name, value) => {
    dispatch(updateEditApplicationField('company', name, value));
  }, []);
  const changeEntityType = useMemo(
    () => [{ title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() }],
    [toggleConfirmationModal]
  );

  const INPUTS = useMemo(
    () => [
      {
        label: 'Debtor',
        placeholder: 'Select',
        type: 'select',
        isOr: isAusOrNew,
        name: 'debtorId',
        data: debtors,
      },
      {
        label: 'Country*',
        placeholder: 'Select',
        type: 'select',
        name: 'country',
        data: countryList,
      },
      {
        label: 'ABN*',
        placeholder: '01234',
        type: 'search',
        isOr: isAusOrNew,
        name: 'abn',
        data: [],
      },
      {
        label: 'Phone Number',
        placeholder: '1234567890',
        type: 'text',
        name: 'phoneNumber',
        data: [],
      },
      {
        label: 'Entity Name*',
        placeholder: 'Enter Entity',
        type: 'entityName',
        isOr: isAusOrNew,
        name: 'entityName',
        data: {},
      },
      {
        label: 'Property',
        placeholder: 'Property',
        type: 'text',
        name: 'property',
        data: [],
      },
      {
        label: 'ACN',
        placeholder: '01234',
        type: 'search',
        name: 'acn',
        data: [],
      },
      {
        label: 'Trading Name',
        placeholder: 'Trading Name',
        type: 'text',
        name: 'tradingName',
        data: [],
      },
      {
        label: 'Entity Type*',
        placeholder: 'Select',
        type: 'select',
        name: 'entityType',
        data: entityType,
      },
      {
        label: 'Outstanding Amount',
        placeholder: '$0000',
        type: 'text',
        name: 'outstandingAmount',
        data: [],
      },
      {
        label: 'Unit Number',
        placeholder: 'Unit Number',
        type: 'text',
        name: 'unitNumber',
        data: [],
      },
      {
        label: 'Street Number*',
        placeholder: 'Street Number',
        type: 'text',
        name: 'streetNumber',
        data: [],
      },
      {
        label: 'Street Name',
        placeholder: 'Street Name',
        type: 'text',
        name: 'streetName',
        data: [],
      },
      {
        label: 'Street Type',
        placeholder: 'Select',
        type: 'select',
        name: 'streetType',
        data: streetType,
      },
      {
        label: 'Suburb',
        placeholder: 'Suburb',
        type: 'text',
        name: 'suburb',
        data: [],
      },
      {
        label: 'State*',
        placeholder: isAusOrNew ? 'Select' : 'Enter State',
        type: isAusOrNew ? 'select' : 'text',
        name: 'state',
        data: stateValue,
      },
      {
        label: 'Postcode*',
        placeholder: 'Postcode',
        type: 'text',
        name: 'postCode',
        data: [],
      },
    ],
    [debtors, streetType, entityType, stateValue, isAusOrNew]
  );

  const finalInputs = useMemo(() => {
    if (isAusOrNew) {
      return [...INPUTS];
    }
    const filteredData = [...INPUTS];
    filteredData.splice(2, 1, {
      label: 'Company Registration No.*',
      placeholder: 'Registration no',
      type: 'text',
      name: 'registrationNumber',
      data: [],
    });
    filteredData.splice(6, 1);
    return filteredData;
  }, [INPUTS, isAusOrNew]);

  /**/
  const handleApplicationErrors = useCallback(response => {
    const { isModal, modalType, message, resData } = applicationErrorHelper(response);
    if (isModal && modalType === 'ERROR') {
      setErrorMessage(message);
      setErrorModal(true);
      return false;
    }
    if (isModal && modalType === 'WARNING') {
      setErrorMessage(message);
      setWarningModal(true);
      return { resData, isModal };
    }
    return { resData };
  }, []);
  /**/

  const updateCompanyState = useCallback(data => {
    dispatch(updateEditApplicationData('company', data));
  }, []);

  const handleTextInputChange = useCallback(
    e => {
      const { name, value } = e.target;
      updateSingleCompanyState(name, value);
    },
    [updateSingleCompanyState]
  );

  const handleSelectInputChange = useCallback(
    data => {
      if (data?.name === 'country') {
        dispatch(updateEditApplicationField('company', 'state', null));

        const finalErrors = { ...errors };
        delete finalErrors.state;

        dispatch(updateEditApplicationData('company', { errors: finalErrors }));
      }
      if (data?.name === 'entityType' && partners?.length !== 0) {
        setShowConfirmModal(true);
      } else {
        updateSingleCompanyState(data?.name, data);
      }
    },
    [updateSingleCompanyState, partners?.length]
  );
  const handleDebtorSelectChange = useCallback(
    async data => {
      try {
        const response = await dispatch(getApplicationCompanyDataFromDebtor(data?.value));

        const { resData } = handleApplicationErrors(response);
        if (resData) {
          await handleSelectInputChange(data);
          updateCompanyState(resData);
          prevRef.current = {
            ...prevRef.current,
            acn: resData?.acn,
            abn: resData?.abn,
          };
        }
      } catch (e) {
        handleApplicationErrors(e?.response);
      }
    },
    [handleSelectInputChange, updateCompanyState, prevRef?.current, handleApplicationErrors]
  );

  const handleSearchTextInputKeyDown = useCallback(
    async e => {
      try {
        if (e.key === 'Enter') {
          const searchString = e?.target?.value;
          const params = { searchString };
          const response = await dispatch(getApplicationCompanyDataFromABNOrACN(params));

          const { resData } = handleApplicationErrors(response);
          if (resData) {
            updateCompanyState(resData);
            prevRef.current = {
              ...prevRef.current,
              acn: resData?.acn,
              abn: resData?.abn,
            };
          }
        }
      } catch (err) {
        let value = prevRef?.current?.abn;
        if (e?.target?.name === 'acn') value = prevRef?.current?.acn;
        updateSingleCompanyState(e?.target?.name, value);
        handleApplicationErrors(err?.response);
      }
    },
    [updateCompanyState, updateSingleCompanyState, prevRef.current, handleApplicationErrors]
  );

  const handleEntityNameSearch = useCallback(
    async e => {
      if (e.key === 'Enter' && e.target.value.trim().length > 0) {
        if (!companyState?.country || companyState?.country?.length === 0) {
          errorNotification('Please select country before continue');
          return;
        }
        dispatchDrawerState({
          type: DRAWER_ACTIONS.SHOW_DRAWER,
          data: null,
        });
        setSearchedEntityNameValue(e.target.value.toString());
        const params = {
          searchString: e?.target?.value,
          country: companyState?.country?.value,
        };
        dispatch(searchApplicationCompanyEntityName(params));
      }
    },
    [companyState?.country, updateCompanyState, dispatchDrawerState, setSearchedEntityNameValue]
  );

  const retryEntityNameRequest = useCallback(() => {
    if (searchedEntityNameValue.trim().length > 0) {
      if (!companyState?.country || companyState?.country?.length === 0) {
        errorNotification('Please select country before continue');
        return;
      }
      const params = {
        searchString: searchedEntityNameValue,
        country: companyState?.country?.value,
      };
      dispatch(searchApplicationCompanyEntityName(params));
    }
  }, [searchedEntityNameValue, companyState?.country]);

  const handleEntityChange = useCallback(event => {
    const { name, value } = event.target;
    const data = {
      label: value,
      value,
    };
    dispatch(updateEditApplicationField('company', name, data));
  }, []);

  const handleToggleDropdown = useCallback(
    value =>
      dispatchDrawerState({
        type: DRAWER_ACTIONS.UPDATE_DATA,
        data: {
          visible: value !== undefined ? value : e => !e,
        },
      }),
    [dispatchDrawerState]
  );

  const handleEntityNameSelect = useCallback(
    async data => {
      try {
        const params = { searchString: data?.abn };
        const response = await dispatch(getApplicationCompanyDataFromABNOrACN(params));

        const { resData } = handleApplicationErrors(response);
        if (resData) {
          updateCompanyState(resData);
          prevRef.current = {
            ...prevRef.current,
            acn: resData?.acn,
            abn: resData?.abn,
          };
        }
      } catch (err) {
        handleApplicationErrors(err?.response);
      }
      handleToggleDropdown(false);
      setSearchedEntityNameValue('');
    },
    [updateCompanyState, setSearchedEntityNameValue, handleToggleDropdown, prevRef.current]
  );

  const getComponentFromType = useCallback(
    input => {
      let component = null;

      switch (input.type) {
        case 'text':
          component = (
            <Input
              type="text"
              name={input.name}
              placeholder={input.placeholder}
              value={
                input?.name === 'state'
                  ? (!isAusOrNew && companyState?.[input.name]?.label) ?? companyState[input?.name]
                  : companyState[input?.name] ?? ''
              }
              onChange={handleTextInputChange}
            />
          );
          break;
        case 'search':
          component = (
            <Input
              type="text"
              name={input.name}
              suffix={<span className="material-icons">search</span>}
              borderClass={input?.isOr && 'is-or-container'}
              placeholder={input.placeholder}
              value={companyState?.[input.name] ?? ''}
              onChange={handleTextInputChange}
              onKeyDown={handleSearchTextInputKeyDown}
            />
          );
          break;
        case 'entityName':
          component = (
            <Input
              type="text"
              name={input.name}
              suffix={isAusOrNew && <span className="material-icons">search</span>}
              placeholder={input.placeholder}
              borderClass={input?.isOr && 'is-or-container'}
              onKeyDown={isAusOrNew ? handleEntityNameSearch : null}
              value={companyState?.entityName?.label ?? ''}
              onChange={handleEntityChange}
            />
          );
          break;
        case 'select': {
          let handleOnChange = handleSelectInputChange;
          if (input.name === 'debtorId') {
            handleOnChange = handleDebtorSelectChange;
          }
          component = (
            <ReactSelect
              className={`${input?.isOr && 'is-or-container'} 'react-select-container'`}
              classNamePrefix="react-select"
              placeholder={input.placeholder}
              name={input.name}
              options={input.data}
              isSearchable
              value={companyState?.[input?.name] ?? []}
              onChange={handleOnChange}
            />
          );
          break;
        }
        default:
          return null;
      }
      return (
        <React.Fragment key={input?.label}>
          <span>{input?.label}</span>
          <div>
            {component}
            {companyState?.errors?.[input?.name] && (
              <div className="ui-state-error">{companyState?.errors?.[input?.name]}</div>
            )}
          </div>
        </React.Fragment>
      );
    },
    [
      companyState,
      handleSelectInputChange,
      handleTextInputChange,
      isAusOrNew,
      handleDebtorSelectChange,
    ]
  );

  const errorModalButtons = useMemo(
    () => [
      {
        title: 'Ok',
        buttonType: 'primary',
        onClick: () => {
          setErrorModal(false);
        },
      },
    ],
    []
  );

  const warningModalButtons = useMemo(
    () => [
      {
        title: 'No',
        buttonType: 'primary-1',
        onClick: () => {
          dispatch({
            type: APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_WIPE_OUT_DATA_IF_EXIST,
          });
          setWarningModal(false);
        },
      },
      {
        title: 'Yes',
        buttonType: 'primary',
        onClick: () => {
          setWarningModal(false);
        },
      },
    ],
    []
  );

  useEffect(() => {
    dispatch(getApplicationCompanyDropDownData()).catch(() => {
      errorNotification('Error during fetching data');
    });
    return () => dispatch(updateEditApplicationData('company', { errors: {} }));
  }, []);

  return (
    <>
      {warningModal && (
        <Modal header="Application Already Exists" buttons={warningModalButtons}>
          <span className="confirmation-message">{errorMessage}</span>
        </Modal>
      )}
      {errorModal && (
        <Modal header="Application Already Exists" buttons={errorModalButtons}>
          <span className="confirmation-message">{errorMessage}</span>
        </Modal>
      )}
      {showConfirmModal && (
        <Modal
          header="Change entity type"
          buttons={changeEntityType}
          hideModal={toggleConfirmationModal}
        >
          <span className="confirmation-message">
            To change the entity type, kindly contact your Risk Analyst or Service manager
          </span>
        </Modal>
      )}
      {drawerState?.visible && (
        <Modal
          hideModal={handleToggleDropdown}
          className="application-entity-name-modal"
          header="Search Results"
          closeIcon="cancel"
          closeClassName="font-secondary"
        >
          {entityNameSearchDropDownData?.isLoading ? (
            <Loader />
          ) : (
            !entityNameSearchDropDownData?.error && (
              <ApplicationEntityNameTable
                data={entityNameSearchDropDownData?.data}
                handleEntityNameSelect={handleEntityNameSelect}
              />
            )
          )}
          {entityNameSearchDropDownData?.error && (
            <>
              <div className="application-entity-name-modal-retry-button">
                {entityNameSearchDropDownData?.errorMessage}
              </div>
              <div className="application-entity-name-modal-retry-button">
                <IconButton
                  buttonType="primary"
                  title="refresh"
                  onClick={() => retryEntityNameRequest()}
                />
              </div>
            </>
          )}
        </Modal>
      )}
      <div className="common-white-container client-details-container">
        {finalInputs?.map(getComponentFromType)}
      </div>
    </>
  );
};

export default ApplicationCompanyStep;
