import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { getClientDetails, resetClientData } from './redux/CompanyProfileAction';
import Loader from '../../common/Loader/Loader';
import CompanyProfilePolicies from './CompanyProfilePolicies/CompanyProfilePolicies';

const CompanyProfile = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClientDetails());
    return () => dispatch(resetClientData());
  }, []);

  const clientData = useSelector(({ companyProfile }) => companyProfile?.clientDetail ?? {});

  const { viewCompanyProfilePageLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const INPUTS = useMemo(
    () => [
      {
        label: 'Name',
        name: 'name',
        data: clientData?.name,
      },
      {
        label: 'Address',
        name: 'address',
        data: `${clientData?.address?.addressLine}, ${clientData?.address?.city}`,
      },
      {
        label: 'ABN',
        name: 'abn',
        data: clientData?.abn,
      },
      {
        label: 'Phone',
        name: 'phone',
        data: clientData?.contactNumber,
      },
      {
        label: 'Sales Person',
        name: 'salesPerson',
        data: clientData?.salesPerson,
      },
      {
        label: 'ACN',
        name: 'acn',
        data: clientData?.acn,
      },
      {
        label: 'Risk Person',
        name: 'riskAnalyst',
        data: clientData?.riskAnalystId?.name,
      },
      {
        label: 'Insurer',
        name: 'insurer',
        data: clientData?.insurerId?.name,
      },
      {
        label: 'Service Person',
        name: 'serviceManager',
        data: clientData?.serviceManagerId?.name,
      },
      {
        label: 'Sector',
        name: 'sector',
        data: clientData?.sector,
      },
      {
        label: 'Website',
        name: 'website',
        data: clientData?.website,
      },
    ],
    [clientData]
  );

  return (
    <>
      {!viewCompanyProfilePageLoaderAction ? (
        (() =>
          !_.isEmpty(clientData) ? (
            <>
              <div className="page-header">
                <div className="page-header-name">Company Profile</div>
              </div>

              {Object.entries(clientData)?.length > 0 ? (
                <div className="common-white-container company-profile-container">
                  {INPUTS.map(input => (
                    <>
                      <span>{input?.label}</span>
                      <div>{input?.data?.toString()?.trim().length > 0 ? input?.data : '-'}</div>
                    </>
                  ))}
                </div>
              ) : (
                <div className="common-white-container">
                  <Loader />
                </div>
              )}
              <CompanyProfilePolicies />
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

export default CompanyProfile;
