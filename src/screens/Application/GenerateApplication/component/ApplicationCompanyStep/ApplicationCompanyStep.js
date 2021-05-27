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
      name: 'registrationNo',
      data: [],
    });
    filteredData.splice(6, 1);
    return filteredData;
  }, [INPUTS, isAusOrNew]);

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
        const response = await getApplicationCompanyDataFromDebtor(data?.value);
        if (response) {
          handleSelectInputChange(data);
          updateCompanyState(response);
          prevRef.current.acn = response?.acn;
          prevRef.current.abn = response?.abn;
        }
      } catch (e) {
        /**/
      }
    },
    [companyState, handleSelectInputChange, updateCompanyState, prevRef?.current]
  );

  const handleSearchTextInputKeyDown = useCallback(
    async e => {
      try {
        if (e.key === 'Enter') {
          const response = await getApplicationCompanyDataFromABNOrACN(e.target.value);
          if (response) {
            if (e?.target?.name === 'abn') {
              prevRef.current.abn = response?.abn;
            } else {
              prevRef.current.acn = response?.acn;
            }
            updateCompanyState(response);
          }
        }
      } catch {
        /**/
        let value = prevRef?.current?.abn;
        if (e?.target?.name === 'acn') value = prevRef?.current?.acn;
        updateSingleCompanyState(e?.target?.name, value);
      }
    },
    [companyState, updateCompanyState, updateSingleCompanyState, prevRef.current]
  );

  const handleEntityNameSearch = useCallback(
    async e => {
      if (e.key === 'Enter' && e.target.value.trim().length > 0) {
        dispatchDrawerState({
          type: DRAWER_ACTIONS.SHOW_DRAWER,
          data: null,
        });
        setSearchedEntityNameValue(e.target.value.toString());
        dispatch(searchApplicationCompanyEntityName(e.target.value));
      }
    },
    [updateCompanyState, dispatchDrawerState, setSearchedEntityNameValue]
  );

  const retryEntityNameRequest = useCallback(() => {
    if ((searchedEntityNameValue?.trim()?.length ?? -1) > 0) {
      dispatch(searchApplicationCompanyEntityName(searchedEntityNameValue));
    }
  }, [searchedEntityNameValue]);

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
        const response = await getApplicationCompanyDataFromABNOrACN(data.abn);
        if (response) {
          updateCompanyState(response);
        }
      } catch (err) {
        /**/
      }
      handleToggleDropdown(false);
      setSearchedEntityNameValue('');
    },
    [updateCompanyState, setSearchedEntityNameValue, handleToggleDropdown]
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
                input.name === 'state'
                  ? (!isAusOrNew && companyState?.[input.name]?.label) || companyState[input?.name]
                  : companyState[input?.name]
              }
              onChange={handleTextInputChange}
            />
          );
          break;
        case 'search':
          component = (
            <Input
              type="text"
              name={input?.name}
              borderClass={input?.isOr && 'is-or-container'}
              suffix={<span className="material-icons">search</span>}
              placeholder={input.placeholder}
              value={companyState[input?.name]}
              onChange={handleTextInputChange}
              onKeyDown={handleSearchTextInputKeyDown}
            />
          );
          break;
        case 'entityName':
          component = (
            <Input
              type="text"
              name={input?.name}
              suffix={isAusOrNew ? <span className="material-icons">search</span> : ''}
              placeholder={input.placeholder}
              borderClass={input?.isOr && 'is-or-container'}
              onKeyDown={isAusOrNew ? handleEntityNameSearch : null}
              value={companyState?.entityName?.label}
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
              name={input?.name}
              options={input?.data}
              isSearchable
              value={companyState?.[input?.name]}
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

  useEffect(() => {
    dispatch(getApplicationCompanyDropDownData()).catch(() => {
      errorNotification('Error during fetching data');
    });
    return () => dispatch(updateEditApplicationData('company', { errors: {} }));
  }, []);

  return (
    <>
      {showConfirmModal && (
        <Modal
          header="Change entity type"
          buttons={changeEntityType}
          hideModal={toggleConfirmationModal}
        >
          <span className="confirmation-message">
            For changing the entity type, kindly contact your risk analyst
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
