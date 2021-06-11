import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSupportDetails } from './redux/SupportAction';
import Loader from '../../common/Loader/Loader';

const Support = () => {
  const dispatch = useDispatch();
  const supportDetails = useSelector(({ support }) => support ?? {});
  const { supportPagePageLoaderAction } = useSelector(
    ({ loaderButtonReducer }) => loaderButtonReducer ?? false
  );

  useEffect(() => {
    dispatch(getSupportDetails());
  }, []);

  const INPUT = useMemo(
    () => [
      {
        title: 'Company Name',
        value: supportDetails?.name,
      },
      {
        title: 'Website',
        value: supportDetails?.website,
      },
      {
        title: 'Contact',
        value: supportDetails?.contactNumber,
      },
      {
        title: 'Location',
        value: supportDetails?.address,
      },
      {
        title: 'Risk Analyst',
        value: supportDetails?.riskAnalyst,
      },
      {
        title: 'Service Manager',
        value: supportDetails?.serviceManager,
      },
      {
        title: 'TCR Support Email',
        value: supportDetails?.email,
      },
    ],
    [supportDetails]
  );
  return (
    <>
      {!supportPagePageLoaderAction ? (
        <>
          <div className="page-header-name mt-20">Support Details</div>
          <div
            className={`common-white-container just-center ${
              Object.entries(supportDetails).length > 0 && 'support-grid'
            }`}
          >
            {Object.entries(supportDetails)?.length > 0 ? (
              INPUT.map(input => (
                <>
                  <div className="font-field">{input.title}</div>
                  <div>{input.value ?? '-'}</div>
                </>
              ))
            ) : (
              <Loader />
            )}
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Support;
