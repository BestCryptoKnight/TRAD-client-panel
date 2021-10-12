import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
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
import { filterReducer, LIST_FILTER_REDUCER_ACTIONS } from '../../../common/ListFilters/filter';
import { useUrlParamsUpdate } from '../../../hooks/useUrlParamsUpdate';
import { saveAppliedFilters } from '../../../common/ListFilters/redux/ListFiltersAction';

const filterDropdownData = [
  { value: 'true', label: 'Yes', name: 'hasPortalAccess' },
  { value: 'false', label: 'No', name: 'hasPortalAccess' },
];

const EmployeeList = () => {
  const dispatch = useDispatch();
  const {
    page: paramPage,
    limit: paramLimit,
    hasPortalAccess: paramHasPortalAccess,
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
  const [filter, dispatchFilter] = useReducer(filterReducer, {
    tempFilter: {},
    finalFilter: {},
  });

  const { tempFilter, finalFilter } = useMemo(() => filter ?? {}, [filter]);

  const { employeeListFilters } = useSelector(({ listFilterReducer }) => listFilterReducer ?? {});

  const getEmployeeListByFilter = useCallback(
    async (params = {}, cb) => {
      const data = {
        page: page ?? 1,
        limit: limit ?? 15,
        hasPortalAccess:
          (tempFilter?.hasPortalAccess?.trim()?.length ?? -1) > 0
            ? tempFilter?.hasPortalAccess
            : undefined,
        ...params,
      };

      try {
        await dispatch(getEmployeeList(data));
        dispatchFilter({
          type: LIST_FILTER_REDUCER_ACTIONS.APPLY_DATA,
        });
        if (cb && typeof cb === 'function') {
          cb();
        }
      } catch (e) {
        /**/
      }
    },
    [tempFilter?.hasPortalAccess, limit, page]
  );

  const onClickApplyFilter = useCallback(async () => {
    await getEmployeeListByFilter({ page: 1, limit });
    toggleFilterModal();
  }, [getEmployeeListByFilter, page, limit, toggleFilterModal]);

  const onClickResetFilter = useCallback(async () => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.RESET_STATE,
    });
    await onClickApplyFilter();
  }, []);

  const filterModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetFilter,
      },
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: () => {
          dispatchFilter({
            type: LIST_FILTER_REDUCER_ACTIONS.CLOSE_FILTER,
          });
          toggleFilterModal();
        },
      },
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
        await getEmployeeListByFilter();
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

  const HasPortalAccessSelected = useMemo(() => {
    const foundValue = filterDropdownData?.find(e => {
      return (e?.value ?? '') === tempFilter?.hasPortalAccess;
    });
    return foundValue ?? [];
  }, [tempFilter?.hasPortalAccess, filterDropdownData]);

  const handleHasPortalAccessFilterChange = useCallback(
    event => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name: 'hasPortalAccess',
        value: event?.value,
      });
    },
    [dispatchFilter]
  );

  useEffect(() => {
    // dispatch(getEmployeeList());
    return () => dispatch(resetEmployeeDetails());
  }, []);

  useEffect(async () => {
    const params = {
      page: paramPage ?? page ?? 1,
      limit: paramLimit ?? limit ?? 15,
    };
    const filters = {
      hasPortalAccess:
        (paramHasPortalAccess?.trim()?.length ?? -1) > 0
          ? paramHasPortalAccess
          : employeeListFilters?.hasPortalAccess,
    };
    Object.entries(filters)?.forEach(([name, value]) => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });
    await getEmployeeListByFilter({ ...params, ...filters });
    await dispatch(getEmployeeColumnList());
  }, []);

  useEffect(() => {
    dispatch(saveAppliedFilters('employeeListFilters', finalFilter));
  }, [finalFilter]);

  // for params in url
  useUrlParamsUpdate(
    {
      page: page ?? 1,
      limit: limit ?? 15,
      hasPortalAccess:
        (finalFilter?.hasPortalAccess?.trim()?.length ?? -1) > 0
          ? finalFilter?.hasPortalAccess
          : undefined,
    },
    [page, limit, { ...finalFilter }]
  );

  // on record limit changed
  const onSelectLimit = useCallback(
    async newLimit => {
      await getEmployeeListByFilter({ page: 1, limit: newLimit });
    },
    [getEmployeeListByFilter]
  );

  // on pagination changed
  const pageActionClick = useCallback(
    async newPage => {
      await getEmployeeListByFilter({ page: newPage, limit });
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
                <div className="form-title">Portal Access</div>
                <ReactSelect
                  className="filter-select react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select.."
                  name="role"
                  options={filterDropdownData}
                  value={HasPortalAccessSelected}
                  onChange={handleHasPortalAccessFilterChange}
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
