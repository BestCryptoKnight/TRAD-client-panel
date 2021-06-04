import React, { useCallback, useEffect, useMemo } from 'react';
import ReactSelect from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../common/Input/Input';
import { getClientDetails } from './redux/CompanyProfileAction';
import Loader from '../../common/Loader/Loader';
import CompanyProfilePolicies from './CompanyProfilePolicies/CompanyProfilePolicies';

const CompanyProfile = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClientDetails());
  }, []);

  const clientData = useSelector(({ companyProfile }) => companyProfile?.clientDetail ?? {});

  const { viewCompanyProfilePageLoaderAction } = useSelector(
    ({ loaderButtonReducer }) => loaderButtonReducer ?? false
  );

  const INPUTS = useMemo(
    () => [
      {
        label: 'Name',
        placeholder: '-',
        type: 'text',
        name: 'name',
        data: clientData?.name,
      },
      {
        label: 'Address',
        placeholder: '-',
        type: 'text',
        name: 'address',
        data: `${clientData?.address?.addressLine}, ${clientData?.address?.city}`,
      },
      {
        label: 'ABN',
        placeholder: '-',
        type: 'text',
        name: 'abn',
        data: clientData?.abn,
      },
      {
        label: 'Phone',
        placeholder: '-',
        type: 'text',
        name: 'phone',
        data: clientData?.contactNumber,
      },
      {
        label: 'Sales Person',
        placeholder: '-',
        type: 'text',
        name: 'salesPerson',
        data: clientData?.salesPerson,
      },
      {
        label: 'ACN',
        placeholder: '-',
        type: 'text',
        name: 'acn',
        data: clientData?.acn,
      },
      {
        label: 'Risk Person',
        placeholder: '-',
        type: 'text',
        name: 'riskAnalyst',
        data: clientData?.riskAnalystId?.name,
      },
      {
        label: 'Trading As',
        placeholder: '-',
        type: 'text',
        name: 'tradingAs',
        data: 'tradingAs',
      },
      {
        label: 'Website',
        placeholder: '-',
        type: 'text',
        name: 'website',
        data: clientData?.website,
      },
      {
        label: 'Service Person',
        placeholder: '-',
        type: 'text',
        name: 'serviceManager',
        data: clientData?.serviceManagerId?.name,
      },
    ],
    [clientData]
  );

  const getComponentFromType = useCallback(input => {
    let component = null;
    switch (input.type) {
      case 'text':
        component = (
          <Input
            type="text"
            name={input.name}
            placeholder={input.placeholder}
            value={input.data}
            readOnly
          />
        );
        break;
      case 'select': {
        component = (
          <ReactSelect
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder={input.placeholder}
            name={input.name}
            value={input.value}
            options={input.data}
            isSearchable={false}
          />
        );
        break;
      }
      default:
        return null;
    }
    return (
      <>
        <span>{input.label}</span>
        <div>{component}</div>
      </>
    );
  }, []);

  return (
    <>
      {!viewCompanyProfilePageLoaderAction ? (
        <>
          <div className="page-header">
            <div className="page-header-name">Company Profile</div>
          </div>

          {Object.entries(clientData)?.length > 0 ? (
            <div className="common-white-container company-profile-container">
              {INPUTS.map(getComponentFromType)}
            </div>
          ) : (
            <div className="common-white-container">
              <Loader />
            </div>
          )}
          <CompanyProfilePolicies />
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default CompanyProfile;
