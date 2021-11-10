import React, {useCallback, useMemo} from 'react';
import { useSelector } from 'react-redux';
import Button from "../../../../common/Button/Button";
import {downloadDecisionLetterForApplication} from "../../redux/ApplicationAction";
import {downloadAll} from "../../../../helpers/DownloadHelper";
import {errorNotification} from "../../../../common/Toast";

const ViewApplicationStatusComponent = () => {
  const { applicationDetail } = useSelector(
    ({ application }) => application?.viewApplication ?? {}
  );
    const { applicationDecisionLetterDownloadButtonLoaderAction } = useSelector(
        ({ generalLoaderReducer }) => generalLoaderReducer ?? false
    );
  const { status, limitType } = useMemo(() => applicationDetail ?? {}, [applicationDetail]);
    const downloadDecisionLetter = useCallback(async () => {
        if (applicationDetail?._id) {
            try {
                const param = {
                    requestFrom: 'application',
                };
                const res = await downloadDecisionLetterForApplication(applicationDetail?._id, param);
                if (res) downloadAll(res);
            } catch (e) {
                // errorNotification(e?.response?.request?.statusText ?? 'Internal server error');
            }
        } else {
            errorNotification('You have no records to download');
        }
    }, [applicationDetail]);
  return (
    <>
      <div className="font-field">Status</div>
      <div className="application-status-grid">


            {status?.label === 'Approved' || status?.label === 'Declined' ? (
                <div className="view-application-status">
                  <div>
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
                  </div>
                  {limitType === 'CREDIT_CHECK' && <Button
                      buttonType="primary"
                      title="Download Decision Letter"
                      buttonTitle="Click to download decision letter"
                      className="download-decision-letter-icon small-button"
                      onClick={() => {
                          if (!applicationDecisionLetterDownloadButtonLoaderAction) downloadDecisionLetter();
                      }}
                  />}
              </div>
            ) : (
              <div className="view-application-status font-primary">{status?.label ?? '-'}</div>
            )}
      </div>
    </>
  );
};

export default ViewApplicationStatusComponent;
