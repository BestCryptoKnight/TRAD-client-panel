import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import {
  getCreditLimitsDetails,
  resetViewCreditLimitData,
  setViewCreditLimitActiveTabIndex,
} from '../redux/CreditLimitsAction';
import Loader from '../../../common/Loader/Loader';
import Tab from '../../../common/Tab/Tab';
import CreditLimitTab from '../CreditLimitsTabs/CreditLimitTab';
import CreditLimitsApplicationTab from '../CreditLimitsTabs/CreditLimitsApplicationTab';
import CreditLimitsTasksTab from '../CreditLimitsTabs/CreditLimitsTasksTab';
import CreditLimitsDocumentsTab from '../CreditLimitsTabs/CreditLimitsDocumentsTab';
import CreditLimitsNotesTab from '../CreditLimitsTabs/CreditLimitsNotesTab';
import CreditLimitStakeHolderTab from '../CreditLimitsTabs/CreditLimitsStakeHolderTab';

const ViewCreditLimits = () => {
  const history = useHistory();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const tabActive = index => {
    setViewCreditLimitActiveTabIndex(index);
    setActiveTabIndex(index);
  };
  const viewCreditLimitActiveTabIndex = useSelector(
    ({ creditLimits }) => creditLimits?.viewCreditLimitActiveTabIndex ?? 0
  );

  const creditLimitsDetails = useSelector(
    ({ creditLimits }) => creditLimits?.selectedCreditLimitData
  );

  const { _id } = useMemo(() => creditLimitsDetails ?? '', [creditLimitsDetails]);

  const { viewCreditLimitPageLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const backToCreditLimit = useCallback(() => {
    history.replace('/credit-limits');
  }, [history]);

  const INPUTS = useMemo(
    () => [
      {
        label: 'Debtor Code',
        value: creditLimitsDetails?.debtorCode,
      },
      {
        label: 'Name',
        value: creditLimitsDetails?.entityName?.label,
      },
      {
        label: 'ABN/NZBN',
        value: creditLimitsDetails?.abn,
      },
      {
        label: 'ACN/NCN',
        value: creditLimitsDetails?.acn,
      },
      {
        label: 'Entity Type',
        value: creditLimitsDetails?.entityType?.label,
      },
      {
        label: 'Trading Name',
        value: creditLimitsDetails?.tradingName,
      },
      {
        label: 'Phone Number',
        value: creditLimitsDetails?.contactNumber,
      },
      {
        label: 'Property',
        value: creditLimitsDetails?.property,
      },
      {
        label: 'Unit Number',
        value: creditLimitsDetails?.unitNumber,
      },
      {
        label: 'Street Number',
        value: creditLimitsDetails?.streetNumber,
      },
      {
        label: 'Street Name',
        value: creditLimitsDetails?.streetName,
      },
      {
        label: 'Street Type',
        value: creditLimitsDetails?.streetType?.label,
      },
      {
        label: 'Suburb',
        value: creditLimitsDetails?.suburb,
      },
      {
        label: 'State',
        value: creditLimitsDetails?.state?.label ?? creditLimitsDetails?.state,
      },
      {
        label: 'Country',
        value: creditLimitsDetails?.country?.label,
      },
      {
        label: 'Post Code',
        value: creditLimitsDetails?.postCode,
      },
      {
        label: 'Review Date',
        value:
          creditLimitsDetails?.reviewDate?.toString()?.trim()?.length > 0
            ? moment(creditLimitsDetails?.reviewDate).format('DD/MM/yyyy')
            : '-',
      },
      {
        label: 'Risk Rating',
        value: creditLimitsDetails?.riskRating,
      },
    ],
    [creditLimitsDetails]
  );

  const finalInputs = useMemo(() => {
    if (['AUS', 'NZL'].includes(creditLimitsDetails?.country?.value)) {
      return [...INPUTS];
    }
    const filteredData = [...INPUTS];
    filteredData.splice(2, 2, {
      isEditable: false,
      label: 'Registration No.*',
      value: creditLimitsDetails?.registrationNumber,
    });
    return filteredData;
  }, [INPUTS, creditLimitsDetails?.country]);

  const tabs = ['Credit Limit', 'Application', 'Stakeholder', 'Tasks', 'Documents', 'Notes'];

  const VIEW_CREDIT_LIMITS_TABS = [
    <CreditLimitTab id={_id} />,
    <CreditLimitsApplicationTab id={_id} />,
    <CreditLimitStakeHolderTab id={_id} />,
    <CreditLimitsTasksTab id={_id} />,
    <CreditLimitsDocumentsTab id={_id} />,
    <CreditLimitsNotesTab id={_id} />,
  ];

  useEffect(() => {
    tabActive(viewCreditLimitActiveTabIndex);
  }, [viewCreditLimitActiveTabIndex]);

  useEffect(() => {
    dispatch(getCreditLimitsDetails(id));
    return () => {
      dispatch(resetViewCreditLimitData());
    };
  }, [id]);

  return (
    <>
      {!viewCreditLimitPageLoaderAction ? (
        (() =>
          !_.isEmpty(creditLimitsDetails) ? (
            <>
              <div className="breadcrumb-button-row">
                <div className="breadcrumb">
                  <span onClick={backToCreditLimit}>Credit Limit List</span>
                  <span className="material-icons-round">navigate_next</span>
                  <span>View Credit Limits</span>
                </div>
              </div>
              {creditLimitsDetails && (
                <div className="common-white-container">
                  {Object.entries(creditLimitsDetails)?.length > 0 ? (
                    <div className="credit-limits-details">
                      {finalInputs.map(detail => (
                        <>
                          <div className="title">{detail.label}</div>
                          <div className="value">
                            {detail?.value?.toString()?.trim()?.length > 0 ? detail.value : '-'}
                          </div>
                        </>
                      ))}
                    </div>
                  ) : (
                    <div className="common-white-container just-center w-100">
                      <Loader />
                    </div>
                  )}
                </div>
              )}
              <Tab
                tabs={tabs}
                tabActive={tabActive}
                activeTabIndex={activeTabIndex}
                className="mt-15"
              />
              <div className="common-white-container">
                {VIEW_CREDIT_LIMITS_TABS[activeTabIndex]}
              </div>
            </>
          ) : (
            <div className="no-record-found">No record found</div>
          ))()
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ViewCreditLimits;
