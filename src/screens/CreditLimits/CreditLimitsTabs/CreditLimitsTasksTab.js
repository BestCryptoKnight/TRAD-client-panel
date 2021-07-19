import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import BigInput from '../../../common/BigInput/BigInput';
import IconButton from '../../../common/IconButton/IconButton';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import {
  changeCreditLimitsTaskColumnList,
  getCreditLimitsTasksColumnList,
  getCreditLimitsTasksLists,
  onSaveCreditLimitsTaskColumnList,
} from '../redux/CreditLimitsAction';
import Checkbox from '../../../common/Checkbox/Checkbox';
import Loader from '../../../common/Loader/Loader';
import { errorNotification } from '../../../common/Toast';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import { CREDIT_LIMITS_TASKS_REDUX_CONSTANTS } from '../redux/CreditLimitsReduxConstants';

const CreditLimitsTasksTab = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const searchInputRef = useRef();
  const [isCompletedChecked, setIsCompletedChecked] = useState(false);

  const taskList = useSelector(({ creditLimits }) => creditLimits?.tasks?.tasksList ?? {});
  const creditLimitsTaskColumnList = useSelector(
    ({ creditLimits }) => creditLimits?.tasks?.tasksColumnList ?? {}
  );
  const creditLimitsTaskDefaultColumnList = useSelector(
    ({ creditLimits }) => creditLimits?.tasks?.tasksDefaultColumnList ?? {}
  );
  const { total, headers, pages, docs, page, limit, isLoading } = useMemo(
    () => taskList,
    [taskList]
  );

  const { defaultFields, customFields } = useMemo(
    () => creditLimitsTaskColumnList ?? { defaultFields: [], customFields: [] },
    [creditLimitsTaskColumnList]
  );

  const {
    CreditLimitTaskColumnSaveButtonLoaderAction,
    CreditLimitTaskColumnResetButtonLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const getTasksList = useCallback(
    async (params = {}, cb) => {
      const data = {
        page: page ?? 1,
        limit: limit ?? 15,
        isCompleted: isCompletedChecked && isCompletedChecked ? isCompletedChecked : undefined,
        ...params,
      };
      dispatch(getCreditLimitsTasksLists(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit, isCompletedChecked]
  );

  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef.current.value;
    if (searchKeyword.trim().toString().length === 0 && e.key !== 'Enter') {
      getTasksList();
    } else if (e.key === 'Enter') {
      if (searchKeyword.trim().toString().length !== 0) {
        getTasksList({ search: searchKeyword.trim().toString() });
      } else {
        errorNotification('Please enter search text to search');
      }
    }
  };

  const [customFieldModal, setCustomFieldModal] = React.useState(false);

  const toggleCustomFieldModal = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onChangeSelectedColumn = useCallback((type, name, value) => {
    const data = { type, name, value };
    dispatch(changeCreditLimitsTaskColumnList(data));
  }, []);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(onSaveCreditLimitsTaskColumnList({ isReset: true }));
    dispatch(getCreditLimitsTasksColumnList());
    toggleCustomFieldModal();
    await getTasksList();
  }, [dispatch, toggleCustomFieldModal]);

  const onClickCloseCustomFieldModal = useCallback(() => {
    dispatch({
      type: CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.CREDIT_LIMITS_TASK_COLUMN_LIST,
      data: creditLimitsTaskDefaultColumnList,
    });
    toggleCustomFieldModal();
  }, [creditLimitsTaskDefaultColumnList, toggleCustomFieldModal]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(creditLimitsTaskColumnList, creditLimitsTaskDefaultColumnList);
      if (!isBothEqual) {
        await dispatch(onSaveCreditLimitsTaskColumnList({ creditLimitsTaskColumnList }));
        await getTasksList();
        toggleCustomFieldModal();
      } else {
        errorNotification('Please select different columns to apply changes.');
      }
    } catch (e) {
      /**/
    }
  }, [
    getTasksList,
    toggleCustomFieldModal,
    creditLimitsTaskColumnList,
    creditLimitsTaskDefaultColumnList,
  ]);

  const customFieldModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: CreditLimitTaskColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseCustomFieldModal },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: CreditLimitTaskColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      toggleCustomFieldModal,
      onClickCloseCustomFieldModal,
      onClickSaveColumnSelection,
      CreditLimitTaskColumnResetButtonLoaderAction,
      CreditLimitTaskColumnSaveButtonLoaderAction,
    ]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getTasksList({ page: 1, limit: newLimit });
    },
    [getTasksList]
  );

  // on pagination changed
  const pageActionClick = useCallback(
    newPage => {
      getTasksList({ page: newPage, limit });
    },
    [getTasksList, limit]
  );

  useEffect(async () => {
    await getTasksList();
  }, [isCompletedChecked]);

  useEffect(() => {
    dispatch(getCreditLimitsTasksColumnList());
  }, []);

  return (
    <>
      <div className="tab-content-header-row">
        <div className="tab-content-header">Tasks</div>

        <div className="buttons-row">
          <BigInput
            ref={searchInputRef}
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search here"
            borderClass="tab-search mr-15"
            onKeyUp={checkIfEnterKeyPressed}
          />
          <Checkbox
            title="Show Completed"
            checked={isCompletedChecked}
            onChange={() => setIsCompletedChecked(!isCompletedChecked)}
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            onClick={toggleCustomFieldModal}
          />
        </div>
      </div>
      {!isLoading && docs ? (
        (() =>
          docs.length > 0 ? (
            <>
              <div className="tab-table-container">
                <Table
                  align="left"
                  valign="center"
                  tableClass="white-header-table"
                  data={docs}
                  headers={headers}
                  rowClass="cursor-pointer task-row"
                  refreshData={getTasksList}
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
          ))()
      ) : (
        <Loader />
      )}

      {customFieldModal && (
        <CustomFieldModal
          defaultFields={defaultFields}
          customFields={customFields}
          onChangeSelectedColumn={onChangeSelectedColumn}
          buttons={customFieldModalButtons}
          toggleCustomField={toggleCustomFieldModal}
        />
      )}
    </>
  );
};

export default CreditLimitsTasksTab;
