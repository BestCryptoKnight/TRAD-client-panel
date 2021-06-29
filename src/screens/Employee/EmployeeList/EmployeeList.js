import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import ReactSelect from 'react-select';
import IconButton from '../../../common/IconButton/IconButton';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import {
  changeEmployeeColumnList,
  getEmployeeColumnList,
  getEmployeeList,
  resetEmployeeDetails,
  saveEmployeeColumnList,
} from '../redux/EmployeeAction';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import { EMPLOYEE_COLUMN_LIST_REDUX_CONSTANTS } from '../redux/EmployeeReduxConstants';
import { errorNotification } from '../../../common/Toast';
import Modal from '../../../common/Modal/Modal';

const EMPLOYEE_FILTER_REDUCER_ACTIONS = {
  UPDATE_DATA: 'UPDATE_DATA',
  RESET_STATE: 'RESET_STATE',
};

const initialFilterState = {
  isDecisionMaker: '',
};

const filterDropdownData = [
  { value: 'true', label: 'Yes', name: 'decisionMaker' },
  { value: 'false', label: 'No', name: 'decisionMaker' },
];

function filterReducer(state = initialFilterState, action) {
  switch (action.type) {
    case EMPLOYEE_FILTER_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        [`${action?.name}`]: action?.value,
      };
    case EMPLOYEE_FILTER_REDUCER_ACTIONS.RESET_STATE:
      return { ...initialFilterState };
    default:
      return state;
  }
}

const EmployeeList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    page: paramPage,
    limit: paramLimit,
    isDecisionMaker: paramDecisionMaker,
  } = useQueryParams();
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const employeeListWithPageData = useSelector(({ employee }) => employee?.employeeList ?? {});
  const employeeColumnList = useSelector(({ employee }) => employee?.employeeColumnList ?? {});
  const employeeDefaultColumnList = useSelector(
    ({ employee }) => employee?.employeeDefaultColumnList ?? {}
  );
  const {
    EmployeeListColumnSaveButtonLoaderAction,
    EmployeeListColumnResetButtonLoaderAction,
    viewEmployeePageLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const { defaultFields, customFields } = useMemo(
    () =>
      employeeColumnList || {
        defaultFields: [],
        customFields: [],
      },
    [employeeColumnList]
  );

  const { total, pages, page, limit, docs, headers } = useMemo(
    () => employeeListWithPageData,
    [employeeListWithPageData]
  );

  const [filterModal, setFilterModal] = React.useState(false);

  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal]
  );
  const [filter, dispatchFilter] = useReducer(filterReducer, initialFilterState);

  const { isDecisionMaker } = useMemo(() => filter ?? {}, [filter]);

  const getEmployeeListByFilter = useCallback(
    async (params = {}, cb) => {
      const data = {
        page: page ?? 1,
        limit: limit ?? 15,
        isDecisionMaker: (isDecisionMaker?.trim()?.length ?? -1) > 0 ? isDecisionMaker : undefined,
        ...params,
      };

      try {
        await dispatch(getEmployeeList(data));
        if (cb && typeof cb === 'function') {
          cb();
        }
      } catch (e) {
        /**/
      }
    },
    [isDecisionMaker, limit, page]
  );

  const onClickApplyFilter = useCallback(async () => {
    await getEmployeeListByFilter({ page, limit });
    toggleFilterModal();
  }, [getEmployeeListByFilter, page, limit, toggleFilterModal]);

  const onClickResetFilter = useCallback(async () => {
    dispatchFilter({
      type: EMPLOYEE_FILTER_REDUCER_ACTIONS.RESET_STATE,
    });
    await onClickApplyFilter();
  }, [dispatchFilter]);

  const filterModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetFilter,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleFilterModal() },
      { title: 'Apply', buttonType: 'primary', onClick: onClickApplyFilter },
    ],
    [toggleFilterModal, onClickApplyFilter, onClickResetFilter]
  );

  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveEmployeeColumnList({ isReset: true }));
    dispatch(getEmployeeColumnList());
    toggleCustomField();
    await getEmployeeListByFilter();
  }, [toggleCustomField, getEmployeeListByFilter]);

  const onClickCloseCustomFieldModal = useCallback(() => {
    dispatch({
      type: EMPLOYEE_COLUMN_LIST_REDUX_CONSTANTS.EMPLOYEE_COLUMN_LIST_ACTION,
      data: employeeDefaultColumnList,
    });
    toggleCustomField();
  }, [employeeDefaultColumnList, toggleCustomField]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(employeeColumnList, employeeDefaultColumnList);
      if (!isBothEqual) {
        await dispatch(saveEmployeeColumnList({ employeeColumnList }));
        getEmployeeListByFilter();
        toggleCustomField();
      } else {
        errorNotification('Please select different columns to apply changes.');
      }
    } catch (e) {
      /**/
    }
  }, [toggleCustomField, getEmployeeListByFilter, employeeColumnList, employeeDefaultColumnList]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: EmployeeListColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseCustomFieldModal },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: EmployeeListColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseCustomFieldModal,
      onClickSaveColumnSelection,
      EmployeeListColumnResetButtonLoaderAction,
      EmployeeListColumnSaveButtonLoaderAction,
    ]
  );

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeEmployeeColumnList(data));
    },
    [dispatch]
  );

  const decisionMakingTypeSelected = useMemo(() => {
    const foundValue = filterDropdownData?.find(e => {
      return (e?.value ?? '') === isDecisionMaker;
    });
    return foundValue ?? [];
  }, [isDecisionMaker, filterDropdownData]);

  const handleDecisionMakingTypeFilterChange = useCallback(
    event => {
      dispatchFilter({
        type: EMPLOYEE_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'isDecisionMaker',
        value: event?.value,
      });
    },
    [dispatchFilter]
  );

  useEffect(() => {
    dispatch(getEmployeeList());
    return () => dispatch(resetEmployeeDetails());
  }, []);

  useEffect(async () => {
    const params = {
      page: paramPage ?? page ?? 1,
      limit: paramLimit ?? limit ?? 15,
    };
    const filters = {
      isDecisionMaker:
        (paramDecisionMaker?.trim()?.length ?? -1) > 0 ? paramDecisionMaker : undefined,
    };
    Object.entries(filters)?.forEach(([name, value]) => {
      dispatchFilter({
        type: EMPLOYEE_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });
    await getEmployeeListByFilter({ ...params });
    await dispatch(getEmployeeColumnList());
  }, []);

  // for params in url
  useEffect(() => {
    const params = {
      page: page ?? 1,
      limit: limit ?? 15,
      isDecisionMaker: (isDecisionMaker?.trim()?.length ?? -1) > 0 ? isDecisionMaker : undefined,
    };
    const url = Object.entries(params)
      ?.filter(arr => arr[1] !== undefined)
      ?.map(([k, v]) => `${k}=${v}`)
      ?.join('&');
    history.push(`${history?.location?.pathname}?${url}`);
  }, [history, total, pages, page, limit, isDecisionMaker]);

  // on record limit changed
  const onSelectLimit = useCallback(
    newLimit => {
      getEmployeeListByFilter({ page: 1, limit: newLimit });
    },
    [getEmployeeListByFilter]
  );

  // on pagination changed
  const pageActionClick = useCallback(
    newPage => {
      getEmployeeListByFilter({ page: newPage, limit });
    },
    [getEmployeeListByFilter, limit]
  );

  return (
    <>
      {!viewEmployeePageLoaderAction ? (
        <>
          <div className="page-header">
            <div className="page-header-name">Employee List</div>
            <div className="page-header-button-container">
              <IconButton
                buttonType="secondary"
                title="filter_list"
                className="mr-10"
                buttonTitle="Click to apply filters on employee list"
                onClick={toggleFilterModal}
              />
              <IconButton
                buttonType="primary"
                title="format_line_spacing"
                className="mr-10"
                buttonTitle="Click to select custom fields"
                onClick={() => toggleCustomField()}
              />
            </div>
          </div>
          {docs?.length > 0 ? (
            <>
              <div className="common-list-container">
                <Table
                  align="left"
                  valign="center"
                  tableClass="main-list-table"
                  data={docs}
                  headers={headers}
                />
              </div>
              <Pagination
                className="common-list-pagination"
                total={total}
                pages={pages}
                page={page}
                limit={limit}
                pageActionClick={pageActionClick}
                onSelectLimit={onSelectLimit}
              />
            </>
          ) : (
            <div className="no-record-found">No record found</div>
          )}

          {filterModal && (
            <Modal
              headerIcon="filter_list"
              header="filter"
              buttons={filterModalButtons}
              className="filter-modal application-filter-modal"
            >
              <div className="filter-modal-row">
                <div className="form-title">Decision Maker</div>
                <ReactSelect
                  className="filter-select react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select.."
                  name="role"
                  options={filterDropdownData}
                  value={decisionMakingTypeSelected}
                  onChange={handleDecisionMakingTypeFilterChange}
                  isSearchble
                />
              </div>
            </Modal>
          )}

          {customFieldModal && (
            <CustomFieldModal
              defaultFields={defaultFields}
              customFields={customFields}
              buttons={customFieldsModalButtons}
              onChangeSelectedColumn={onChangeSelectedColumn}
              toggleCustomField={toggleCustomField}
            />
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default EmployeeList;
