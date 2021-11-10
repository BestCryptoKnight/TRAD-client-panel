import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const LimitTypeOptions = [
  {
    label: 'Endorsed',
    value: 'ENDORSED',
    name: 'limitType',
  },
  {
    label: 'Credit Check',
    value: 'CREDIT_CHECK',
    name: 'limitType',
  },
  {
    label: 'Health Check',
    value: 'HEALTH_CHECK',
    name: 'limitType',
  },
  {
    label: '24/7 Alerts',
    value: '247_ALERT',
    name: 'limitType',
  },
];
const ViewApplicationEditableRowComponent = () => {
  const { applicationDetail } = useSelector(
    ({ application }) => application?.viewApplication ?? {}
  );

  const { limitType, expiryDate } = useMemo(() => applicationDetail ?? {}, [applicationDetail]);
  
  return (
    <div className="application-editable-row-grid font-primary">
      <div>
        <div className="font-field mt-10">Limit Type</div>
        <div className="view-application-editable-row-detail">
         {LimitTypeOptions.find(e => e.value === limitType)?.label ?? '-'}
        </div>
      </div>
      <div>
        <div className="font-field mt-10">Expiry Date</div>
        <div className="view-application-editable-row-detail">
         {expiryDate ? new Date(expiryDate) : '-'}
        </div>
      </div>
    </div>
  );
};

export default ViewApplicationEditableRowComponent;
