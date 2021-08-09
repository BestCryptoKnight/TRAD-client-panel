import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

const ViewApplicationStatusComponent = () => {
  const { applicationDetail } = useSelector(
    ({ application }) => application?.viewApplication ?? {}
  );

  const { status } = useMemo(() => applicationDetail ?? {}, [applicationDetail]);

  return (
    <>
      <div className="font-field">Status</div>
      <div className="application-status-grid">
        <div className="view-application-status">
          <div>
            {status?.label === 'Approved' || status?.label === 'Declined' ? (
              <>
                {['APPROVED'].includes(status?.value) && (
                  <div className="application-status approved-application-status">
                    {status?.label}
                  </div>
                )}
                {['DECLINED'].includes(status?.value) && (
                  <div className="application-status declined-application-status">
                    {status?.label}
                  </div>
                )}
              </>
            ) : (
              <div className="view-application-status font-primary">{status?.label ?? '-'}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewApplicationStatusComponent;
