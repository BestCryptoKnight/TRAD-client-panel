import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from '../../../common/Select/Select';
import IconButton from '../../../common/IconButton/IconButton';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import {
  changeCreditColumnList,
  downloadCreditLimitCSV,
  downloadCreditLimitDecisionLetter,
  getCreditLimitColumnList,
  getCreditLimitsFilter,
  getCreditLimitsList,
  modifyClientCreditLimit,
  resetCreditLimitListData,
  saveCreditLimitColumnList,
  surrenderClientCreditLimit,
} from '../redux/CreditLimitsAction';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import { errorNotification } from '../../../common/Toast';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import Modal from '../../../common/Modal/Modal';
import { CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS } from '../redux/CreditLimitsReduxConstants';
import Input from '../../../common/Input/Input';
import { NUMBER_REGEX } from '../../../constants/RegexConstants';
import Button from '../../../common/Button/Button';
import { downloadAll } from '../../../helpers/DownloadHelper';
import { NumberCommaSeparator } from '../../../helpers/NumberCommaSeparator';
import { filterReducer, LIST_FILTER_REDUCER_ACTIONS } from '../../../common/ListFilters/filter';
import { useUrlParamsUpdate } from '../../../hooks/useUrlParamsUpdate';
import { saveAppliedFilters } from '../../../common/ListFilters/redux/ListFiltersAction';

const CreditLimitsList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const creditLimitListWithPageData = useSelector(({ creditLimits }) => creditLimits?.creditLimitList ?? {});
  const { total, pages, page, limit, docs, headers } = useMemo(
    () => creditLimitListWithPageData,
    [creditLimitListWithPageData],
  );
  const creditLimitsColumnList = useSelector(({ creditLimits }) => creditLimits?.creditLimitsColumnList ?? {});
  const creditLimitsDefaultColumnList = useSelector(
    ({ creditLimits }) => creditLimits?.creditLimitsDefaultColumnList ?? {},
  );
  const dropdownData = useSelector(({ creditLimits }) => creditLimits?.creditLimitsFilterList?.dropdownData ?? {});
  const {
    CreditLimitListColumnSaveButtonLoaderAction,
    CreditLimitListColumnResetButtonLoaderAction,
    creditLimitDownloadCreditLimitCSVButtonLoaderAction,
    modifyCreditLimitButtonLoaderAction,
    surrenderCreditLimitButtonLoaderAction,
    creditLimitListPageLoaderAction,
    decisionLetterDownloadButtonLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const [filter, dispatchFilter] = useReducer(filterReducer, {
    tempFilter: {},
    finalFilter: {},
  });

  const { tempFilter, finalFilter } = useMemo(() => filter ?? {}, [filter]);

  const { creditLimitListFilters } = useSelector(({ listFilterReducer }) => listFilterReducer ?? {});

  useEffect(() => {
    dispatch(getCreditLimitsFilter());
  }, []);

  const { page: paramPage, limit: paramLimit, startDate: paramStartDate, endDate: paramEndDate } = useQueryParams();

  const { defaultFields, customFields } = useMemo(
    () => creditLimitsColumnList || { defaultFields: [], customFields: [] },
    [creditLimitsColumnList],
  );
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal],
  );
  const handleStartDateChange = useCallback(date => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'startDate',
      value: date ? new Date(date).toISOString() : null,
    });
  }, []);

  const handleEndDateChange = useCallback(date => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'endDate',
      value: date ? new Date(date).toISOString() : null,
    });
  }, []);

  const resetFilterDates = useCallback(() => {
    handleStartDateChange(null);
    handleEndDateChange(null);
  }, [handleStartDateChange, handleEndDateChange]);
  const getCreditLimitListByFilter = useCallback(
    async (params = {}, cb) => {
      if (tempFilter?.startDate && tempFilter?.endDate && moment(tempFilter?.endDate).isBefore(tempFilter?.startDate)) {
        errorNotification('Please enter a valid date range');
        resetFilterDates();
      } else {
        const data = {
          page: page ?? 1,
          limit: limit ?? 15,
          entityType: (tempFilter?.entityType?.value?.trim()?.length ?? -1) > 0 ? tempFilter?.entityType : undefined,
          startDate: tempFilter?.startDate,
          endDate: tempFilter?.endDate,
          ...params,
        };
        try {
          await dispatch(getCreditLimitsList(data));
          dispatchFilter({
            type: LIST_FILTER_REDUCER_ACTIONS.APPLY_DATA,
          });
          if (cb && typeof cb === 'function') {
            cb();
          }
        } catch (e) {
          /**/
        }
      }
    },
    [page, limit, tempFilter],
  );

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveCreditLimitColumnList({ isReset: true }));
    dispatch(getCreditLimitColumnList());
    toggleCustomField();
    await getCreditLimitListByFilter();
  }, [toggleCustomField, getCreditLimitListByFilter]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(creditLimitsColumnList, creditLimitsDefaultColumnList);
      if (!isBothEqual) {
        await dispatch(saveCreditLimitColumnList({ creditLimitsColumnList }));
        await getCreditLimitListByFilter();
        toggleCustomField();
      } else {
        errorNotification('Please select different columns to apply changes.');
      }
    } catch (e) {
      /**/
    }
  }, [toggleCustomField, getCreditLimitListByFilter, creditLimitsColumnList, creditLimitsDefaultColumnList]);

  const onClickCloseCustomFieldModal = useCallback(() => {
    dispatch({
      type: CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_COLUMN_LIST,
      data: creditLimitsDefaultColumnList,
    });
    toggleCustomField();
  }, [creditLimitsDefaultColumnList, toggleCustomField]);

  const customFieldsModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: CreditLimitListColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseCustomFieldModal },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: CreditLimitListColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      onClickCloseCustomFieldModal,
      onClickSaveColumnSelection,
      CreditLimitListColumnSaveButtonLoaderAction,
      CreditLimitListColumnResetButtonLoaderAction,
    ],
  );

  useEffect(async () => {
    const params = {
      page: paramPage ?? page ?? 1,
      limit: paramLimit ?? limit ?? 15,
    };
    const filters = {
      entityType: creditLimitListFilters?.entityType,
      startDate: paramStartDate || creditLimitListFilters?.startDate,
      endDate: paramEndDate || creditLimitListFilters?.endDate,
    };
    Object.entries(filters)?.forEach(([name, value]) => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });
    await getCreditLimitListByFilter({ ...params, ...filters });
    dispatch(getCreditLimitColumnList());
    return () => dispatch(resetCreditLimitListData());
  }, []);

  useEffect(() => {
    dispatch(saveAppliedFilters('creditLimitListFilters', finalFilter));
  }, [finalFilter]);

  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeCreditColumnList(data));
    },
    [dispatch],
  );

  // for params in url
  useUrlParamsUpdate(
    {
      page: page ?? 1,
      limit: limit ?? 15,
      entityType:
        (finalFilter?.entityType?.value?.trim()?.length ?? -1) > 0 ? finalFilter?.entityType?.value : undefined,
      startDate: finalFilter?.startDate || undefined,
      endDate: finalFilter?.endDate || undefined,
    },
    [page, limit, finalFilter],
  );

  const [filterModal, setFilterModal] = React.useState(false);
  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal],
  );
  const onClickApplyFilter = useCallback(async () => {
    await getCreditLimitListByFilter({ page: 1, limit }, toggleFilterModal);
  }, [getCreditLimitListByFilter, page, limit, toggleFilterModal]);

  const onClickResetFilter = useCallback(async () => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.RESET_STATE,
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
    [toggleFilterModal, onClickApplyFilter, onClickResetFilter],
  );

  // on record limit changed
  const onSelectLimit = useCallback(
    async newLimit => {
      await getCreditLimitListByFilter({ page: 1, limit: newLimit });
    },
    [getCreditLimitListByFilter],
  );

  // on pagination changed
  const pageActionClick = useCallback(
    async newPage => {
      await getCreditLimitListByFilter({ page: newPage, limit });
    },
    [getCreditLimitListByFilter, limit],
  );

  const handleEntityTypeFilterChange = useCallback(event => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'entityType',
      value: event,
    });
  }, []);

  const onSelectCreditLimitRecord = useCallback(
    id => {
      history.push(`credit-limits/${id}`);
    },
    [history],
  );

  // actions

  const [modifyLimitModal, setModifyLimitModal] = useState(false);
  const [surrenderModal, setSurrenderModal] = useState(false);
  const [newCreditLimit, setNewCreditLimit] = useState('');
  const [currentCreditLimitData, setCurrentCreditLimitData] = useState({});

  const toggleModifyLimitModal = useCallback(() => {
    setNewCreditLimit('');
    setModifyLimitModal(!modifyLimitModal);
  }, [modifyLimitModal, setNewCreditLimit]);

  const toggleSurrenderModal = useCallback(() => {
    setSurrenderModal(!surrenderModal);
  }, [surrenderModal]);

  const downloadDecisionLetter = useCallback(async creditLimitId => {
    if (creditLimitId) {
      try {
        const res = await dispatch(downloadCreditLimitDecisionLetter(creditLimitId));
        if (res) downloadAll(res);
      } catch (e) {
        errorNotification(e?.response?.request?.statusText ?? 'Internal server error');
      }
    } else {
      errorNotification('You have no records to download');
    }
  }, []);

  const creditLimitAction = useMemo(
    () => [
      data => (
        <span className="table-action-buttons">
          <IconButton
            buttonType="primary-1"
            title="cloud_download"
            disabled={docs?.length > 0 && docs.find(record => record._id === data?.id)?.limitType !== 'Credit Check'}
            buttonTitle={
              docs?.length > 0 &&
              docs.find(record => record._id === data?.id)?.limitType === 'Credit Check' &&
              'Click to download decision letter'
            }
            className={`download-decision-letter-icon ${
              docs?.length > 0 &&
              docs.find(record => record._id === data?.id)?.limitType !== 'Credit Check' &&
              'disable-download-button'
            }`}
            onClick={e => {
              e.stopPropagation();
              if (!decisionLetterDownloadButtonLoaderAction) downloadDecisionLetter(data?.id);
            }}
          />
          <Button
            buttonType="outlined-primary-small"
            title="Modify"
            onClick={e => {
              e.stopPropagation();
              setCurrentCreditLimitData(docs?.length > 0 && docs.find(record => record?._id === data.id));
              toggleModifyLimitModal();
            }}
          />
          <Button
            buttonType="outlined-red-small"
            title="Surrender"
            onClick={e => {
              e.stopPropagation();
              setCurrentCreditLimitData(data);
              toggleSurrenderModal();
            }}
          />
        </span>
      ),
    ],
    [
      docs,
      toggleModifyLimitModal,
      toggleSurrenderModal,
      setCurrentCreditLimitData,
      decisionLetterDownloadButtonLoaderAction,
    ],
  );

  const modifyLimit = useCallback(async () => {
    try {
      if (newCreditLimit?.toString()?.trim().length <= 0) {
        errorNotification('Please provide new credit limit');
      } else if (newCreditLimit && !newCreditLimit?.toString()?.match(NUMBER_REGEX)) {
        errorNotification('Please provide valid credit limit');
      } else {
        const data = {
          action: 'modify',
          creditLimit: newCreditLimit,
        };
        await dispatch(modifyClientCreditLimit(currentCreditLimitData?._id, data));
        await getCreditLimitListByFilter();
        toggleModifyLimitModal();
      }
    } catch (e) {
      /**/
    }
  }, [newCreditLimit, currentCreditLimitData, toggleModifyLimitModal, getCreditLimitListByFilter]);

  const surrenderLimit = useCallback(async () => {
    try {
      const data = {
        action: 'surrender',
        creditLimit: currentCreditLimitData?.creditLimit,
      };
      await dispatch(surrenderClientCreditLimit(currentCreditLimitData?.id, data));
      await getCreditLimitListByFilter();
      toggleSurrenderModal();
    } catch (e) {
      /**/
    }
  }, [currentCreditLimitData, toggleSurrenderModal, getCreditLimitListByFilter]);

  const modifyLimitButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleModifyLimitModal() },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: modifyLimit,
        isLoading: modifyCreditLimitButtonLoaderAction,
      },
    ],
    [toggleModifyLimitModal, modifyLimit, modifyCreditLimitButtonLoaderAction],
  );
  const surrenderLimitButtons = useMemo(
    () => [
      { title: 'No', buttonType: 'primary-1', onClick: () => toggleSurrenderModal() },
      {
        title: 'Yes',
        buttonType: 'danger',
        onClick: surrenderLimit,
        isLoading: surrenderCreditLimitButtonLoaderAction,
      },
    ],
    [toggleSurrenderModal, surrenderLimit, modifyCreditLimitButtonLoaderAction],
  );

  const onClickDownloadButton = useCallback(async () => {
    if (docs?.length !== 0) {
      try {
        const data = {
          entityType:
            (tempFilter?.entityType?.value?.trim()?.length ?? -1) > 0 ? tempFilter?.entityType?.value : undefined,
          startDate: tempFilter?.startDate,
          endDate: tempFilter?.endDate,
        };
        const res = await dispatch(downloadCreditLimitCSV(data));
        if (res) downloadAll(res);
      } catch (e) {
        errorNotification(e?.response?.request?.statusText ?? 'Internal server error');
      }
    } else {
      errorNotification('You have no records to download');
    }
  }, [docs]);

  return (
    <>
      {!creditLimitListPageLoaderAction ? (
        <>
          <div className="page-header">
            <div className="page-header-name">Credit Limit List</div>
            <div className="page-header-button-container">
              <IconButton
                buttonType="secondary"
                title="filter_list"
                className="mr-10"
                buttonTitle="Click to apply filters on credit limit list"
                onClick={() => toggleFilterModal()}
              />
              <IconButton
                buttonType="primary"
                title="format_line_spacing"
                className="mr-10"
                buttonTitle="Click to select custom fields"
                onClick={() => toggleCustomField()}
              />
              <IconButton
                buttonType="primary-1"
                title="cloud_download"
                onClick={onClickDownloadButton}
                isLoading={creditLimitDownloadCreditLimitCSVButtonLoaderAction}
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
                  recordSelected={onSelectCreditLimitRecord}
                  recordActionClick={() => {}}
                  rowClass="cursor-pointer"
                  tableButtonActions={creditLimitAction}
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
                <div className="form-title">Entity Type</div>
                <Select
                  className="filter-select react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select Entity Type"
                  name="entityType"
                  options={dropdownData?.entityType}
                  value={tempFilter?.entityType}
                  onChange={handleEntityTypeFilterChange}
                  isSearchble
                />
              </div>
              <div className="filter-modal-row">
                <div className="form-title">Expiry Date</div>
                <div className="date-picker-container filter-date-picker-container mr-15">
                  <DatePicker
                    className="filter-date-picker"
                    selected={tempFilter?.startDate ? new Date(tempFilter?.startDate) : null}
                    onChange={handleStartDateChange}
                    placeholderText="From Date"
                    showMonthDropdown
                    showYearDropdown
                    scrollableYearDropdown
                    dateFormat="dd/MM/yyyy"
                  />
                  <span className="material-icons-round">event</span>
                </div>
                <div className="date-picker-container filter-date-picker-container">
                  <DatePicker
                    className="filter-date-picker"
                    selected={tempFilter?.endDate ? new Date(tempFilter?.endDate) : null}
                    onChange={handleEndDateChange}
                    placeholderText="To Date"
                    showMonthDropdown
                    showYearDropdown
                    scrollableYearDropdown
                    dateFormat="dd/MM/yyyy"
                  />
                  <span className="material-icons-round">event</span>
                </div>
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
          {modifyLimitModal && (
            <Modal header="Modify Credit Limit" buttons={modifyLimitButtons} hideModal={toggleModifyLimitModal}>
              <div className="modify-credit-limit-container align-center">
                <span>Credit Limit</span>
                <Input
                  type="text"
                  value={
                    currentCreditLimitData?.creditLimit ? NumberCommaSeparator(currentCreditLimitData?.creditLimit) : ''
                  }
                  disabled
                  borderClass="disabled-control"
                />
                <span>Change Credit Limit</span>
                <Input
                  prefixClass="font-placeholder"
                  placeholder="New Credit Limit"
                  name="creditLimit"
                  type="text"
                  value={newCreditLimit ? NumberCommaSeparator(newCreditLimit) : ''}
                  onChange={e =>
                    setNewCreditLimit(
                      e.target.value * 1 === 0
                        ? e.target.value.replace(/^0+(\d)/, '$1')
                        : e.target.value.toString().replaceAll(',', ''),
                    )
                  }
                />
              </div>
            </Modal>
          )}
          {surrenderModal && (
            <Modal header="Modify Credit Limit" buttons={surrenderLimitButtons} hideModal={toggleSurrenderModal}>
              <span className="confirmation-message">Are you sure you want to surrender this credit limit?</span>
            </Modal>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default CreditLimitsList;