import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './CompanyProfilePolicies.scss';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import BigInput from '../../../common/BigInput/BigInput';
import IconButton from '../../../common/IconButton/IconButton';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import {
  changeCompanyProfilePolicyColumnList,
  getCompanyProfilePolicyColumnList,
  getCompanyProfilePolicyList,
  saveCompanyProfilePolicyColumnList,
} from '../redux/CompanyProfileAction';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import { CLIENT_REDUX_CONSTANTS } from '../redux/CompanyProfileReduxConstants';
import { errorNotification } from '../../../common/Toast';

const CompanyProfilePolicies = () => {
  const dispatch = useDispatch();
  const searchInputRef = useRef();
  const policyList = useSelector(
    ({ companyProfile }) => companyProfile?.clientPolicyData?.clientPolicyList ?? {}
  );
  const companyProfilePolicyColumnList = useSelector(
    ({ companyProfile }) => companyProfile?.clientPolicyData?.clientPolicyColumnList ?? {}
  );
  const companyProfilePolicyDefaultColumnList = useSelector(
    ({ companyProfile }) => companyProfile?.clientPolicyData?.clientPolicyDefaultColumnList ?? {}
  );
  const { docs, page, limit, pages, total, headers, isLoading } = useMemo(() => policyList, [
    policyList,
  ]);
  const [customFieldModal, setCustomFieldModal] = useState(false);
  const { defaultFields, customFields } = useMemo(
    () =>
      companyProfilePolicyColumnList ?? {
        defaultFields: [],
        customFields: [],
      },
    [companyProfilePolicyColumnList]
  );

  const getPolicyList = useCallback(
    async (params = {}, cb) => {
      const data = {
        page: page ?? 1,
        limit: limit ?? 15,
        ...params,
      };
      await dispatch(getCompanyProfilePolicyList(data));
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
        await getPolicyList();
      } else if (e.key === 'Enter') {
        if (searchKeyword?.trim()?.toString()?.length !== 0) {
          await getPolicyList({ search: searchKeyword?.trim()?.toString() });
        } else {
          errorNotification('Please enter any value than press enter');
        }
      }
    },
    [getPolicyList]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getPolicyList({ page, limit: newLimit });
    },
    [getPolicyList]
  );

  const pageActionClick = useCallback(
    newPage => {
      getPolicyList({ page: newPage, limit });
    },
    [limit, getPolicyList]
  );
  const onChangeSelectedColumn = useCallback(
    (type, name, value) => {
      const data = { type, name, value };
      dispatch(changeCompanyProfilePolicyColumnList(data));
    },
    [dispatch]
  );

  const toggleCustomField = () => setCustomFieldModal(e => !e);

  const onClickResetDefaultColumnSelection = useCallback(async () => {
    await dispatch(saveCompanyProfilePolicyColumnList({ isReset: true }));
    await dispatch(getCompanyProfilePolicyColumnList());
    toggleCustomField();
    await getPolicyList();
  }, [toggleCustomField, getPolicyList]);

  const onClickCloseCustomFieldModal = useCallback(() => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.CLIENT_POLICY_COLUMN_LIST,
      data: companyProfilePolicyDefaultColumnList,
    });
    toggleCustomField();
  }, [toggleCustomField, companyProfilePolicyDefaultColumnList]);

  const onClickSaveColumnSelection = useCallback(async () => {
    try {
      const isBothEqual = _.isEqual(
        companyProfilePolicyColumnList,
        companyProfilePolicyDefaultColumnList
      );
      if (!isBothEqual) {
        await dispatch(saveCompanyProfilePolicyColumnList({ companyProfilePolicyColumnList }));
        await getPolicyList();
        toggleCustomField();
      } else {
        errorNotification('Please select different columns to apply changes.');
      }
    } catch (e) {
      /**/
    }
  }, [
    getPolicyList,
    toggleCustomField,
    companyProfilePolicyColumnList,
    companyProfilePolicyDefaultColumnList,
  ]);

  const buttons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetDefaultColumnSelection,
      },
      { title: 'Close', buttonType: 'primary-1', onClick: () => onClickCloseCustomFieldModal() },
      { title: 'Save', buttonType: 'primary', onClick: onClickSaveColumnSelection },
    ],
    [onClickResetDefaultColumnSelection, toggleCustomField, onClickSaveColumnSelection]
  );

  useEffect(() => {
    getPolicyList();
    dispatch(getCompanyProfilePolicyColumnList());
  }, []);

  return (
    <>
      <div className="common-white-container">
        <div className="page-header mt-15 mb-15">
          <div className="page-header-name">Policies</div>
          {!isLoading && docs && (
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
                onClick={() => toggleCustomField()}
              />
            </div>
          )}
        </div>
        {!isLoading && docs ? (
          (() =>
            docs?.length > 0 ? (
              <>
                <div className="tab-table-container">
                  <Table
                    tableClass="white-header-table"
                    data={docs}
                    headers={headers}
                    recordSelected={() => {}}
                    recordActionClick={() => {}}
                    haveActions
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
              <div className="common-white-container">
                <div className="no-record-found">No record found</div>
              </div>
            ))()
        ) : (
          <Loader />
        )}
      </div>

      {customFieldModal && (
        <CustomFieldModal
          defaultFields={defaultFields}
          customFields={customFields}
          onChangeSelectedColumn={onChangeSelectedColumn}
          buttons={buttons}
          toggleCustomField={toggleCustomField}
        />
      )}
    </>
  );
};

export default CompanyProfilePolicies;
