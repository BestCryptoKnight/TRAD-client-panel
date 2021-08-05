import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import BigInput from '../../../common/BigInput/BigInput';
import IconButton from '../../../common/IconButton/IconButton';
import {
  changeCreditLimitsStakeHolderColumnList,
  getCreditLimitsStakeHolderColumnList,
  getCreditLimitsStakeHolderList,
  onSaveCreditLimitsStakeHolderColumnList,
} from '../redux/CreditLimitsAction';
import Loader from '../../../common/Loader/Loader';
import { errorNotification } from '../../../common/Toast';
import { CREDIT_LIMITS_STAKE_HOLDER_REDUX_CONSTANTS } from '../redux/CreditLimitsReduxConstants';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';

const CreditLimitStakeHolderTab = props => {
  const { id } = props;
  const dispatch = useDispatch();
  const searchInputRef = useRef();
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const { stakeHolderList, stakeHolderColumnList, stakeHolderDefaultColumnList } = useSelector(
    ({ creditLimits }) => creditLimits?.stakeHolder ?? {}
  );
  const { total, headers, pages, docs, page, limit } = useMemo(
    () => stakeHolderList ?? {},
    [stakeHolderList]
  );
  const { defaultFields, customFields } = useMemo(
    () => stakeHolderColumnList || { defaultFields: [], customFields: [] },
    [stakeHolderColumnList]
  );
  const {
    CreditLimitStakeHolderColumnSaveButtonLoaderAction,
    CreditLimitStakeHolderColumnResetButtonLoaderAction,
    creditLimitStakeHolderListLoader,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const getStakeHolderList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page ?? 1,
        limit: limit ?? 15,
        ...params,
      };
      dispatch(getCreditLimitsStakeHolderList(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit]
  );

  const checkIfEnterKeyPressed = useCallback(
    async e => {
      const searchKeyword = searchInputRef.current.value;
      if (searchKeyword?.trim()?.toString()?.length === 0 && e.key !== 'Enter') {
        await getStakeHolderList();
      } else if (e.key === 'Enter') {
        if (searchKeyword?.trim()?.toString()?.length !== 0) {
          await getStakeHolderList({ search: searchKeyword?.trim()?.toString() });
        } else {
          errorNotification('Please enter search text to search');
        }
      }
    },
    [getStakeHolderList]
  );

  const toggleCustomField = useCallback(
    value => setCustomFieldModal(value !== undefined ? value : e => !e),
    [setCustomFieldModal]
  );

  const onChangeSelectColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeCreditLimitsStakeHolderColumnList(data));
    },
    [dispatch]
  );

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(onSaveCreditLimitsStakeHolderColumnList({ isReset: true }));
    await dispatch(getCreditLimitsStakeHolderColumnList());
    toggleCustomField();
    await getStakeHolderList();
  }, [toggleCustomField, getStakeHolderList]);

  const onClickCloseCustomFieldModal = useCallback(() => {
    dispatch({
      type: CREDIT_LIMITS_STAKE_HOLDER_REDUX_CONSTANTS.UPDATE_CREDIT_LIMITS_STAKE_HOLDER_COLUMN_LIST,
      data: stakeHolderDefaultColumnList,
    });
    toggleCustomField();
  }, [toggleCustomField, stakeHolderDefaultColumnList]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(stakeHolderColumnList, stakeHolderDefaultColumnList);
      if (!isBothEqual) {
        await dispatch(onSaveCreditLimitsStakeHolderColumnList({ stakeHolderColumnList }));
        await getStakeHolderList();
        toggleCustomField();
      } else {
        errorNotification('Please select different columns to apply changes.');
      }
    } catch (e) {
      /**/
    }
  }, [getStakeHolderList, toggleCustomField, stakeHolderColumnList, stakeHolderDefaultColumnList]);

  const buttons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
        isLoading: CreditLimitStakeHolderColumnResetButtonLoaderAction,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseCustomFieldModal },
      {
        title: 'Save',
        buttonType: 'primary',
        onClick: onClickSaveColumnSelection,
        isLoading: CreditLimitStakeHolderColumnSaveButtonLoaderAction,
      },
    ],
    [
      onClickResetDefaultColumnSelection,
      toggleCustomField,
      onClickSaveColumnSelection,
      CreditLimitStakeHolderColumnResetButtonLoaderAction,
      CreditLimitStakeHolderColumnSaveButtonLoaderAction,
    ]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getStakeHolderList({ page, limit: newLimit });
    },
    [getStakeHolderList]
  );

  const pageActionClick = useCallback(
    newPage => {
      getStakeHolderList({ page: newPage, limit });
    },
    [limit, getStakeHolderList]
  );

  useEffect(async () => {
    await getStakeHolderList();
    dispatch(getCreditLimitsStakeHolderColumnList());
  }, []);
  return (
    <>
      <div className="tab-content-header-row">
        <div className="tab-content-header">Stake Holder</div>
        <div className="buttons-row">
          <BigInput
            ref={searchInputRef}
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search here"
            borderClass="company-profile-policies-search"
            onKeyUp={checkIfEnterKeyPressed}
          />
          <IconButton
            buttonType="primary"
            title="format_line_spacing"
            onClick={toggleCustomField}
          />
        </div>
      </div>

      {!creditLimitStakeHolderListLoader ? (
        (() =>
          docs?.length > 0 ? (
            <>
              <div className="tab-table-container">
                <Table
                  align="left"
                  valign="center"
                  tableClass="white-header-table"
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
          ))()
      ) : (
        <Loader />
      )}

      {customFieldModal && (
        <CustomFieldModal
          defaultFields={defaultFields}
          customFields={customFields}
          buttons={buttons}
          onChangeSelectedColumn={onChangeSelectColumn}
          toggleCustomField={toggleCustomField}
        />
      )}
    </>
  );
};

CreditLimitStakeHolderTab.propTypes = {
  id: PropTypes.string.isRequired,
};

export default CreditLimitStakeHolderTab;
