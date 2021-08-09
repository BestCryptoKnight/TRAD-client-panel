import ReactSelect from 'react-select';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';

const LimitTypeOptions = [
  {
    label: 'Endorsed',
    value: 'ENDORSED',
    name: 'limitType',
  },
  {
    label: 'Discretionary Limit',
    value: 'DISCRETIONARY_LIMIT',
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
    label: 'Monitoring',
    value: 'MONITORING',
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
        <div className="view-application-status">
          <ReactSelect
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="-"
            name="applicationStatus"
            value={limitType ?? '-'}
            options={LimitTypeOptions}
            isDisabled
          />
        </div>
      </div>
      <div>
        <div className="font-field mt-10">Expiry Date</div>
        <div className="date-picker-container disabled-control view-application-status">
          <DatePicker
            selected={expiryDate ? new Date(expiryDate) : null}
            placeholderText="-"
            minDate={new Date()}
            showMonthDropdown
            showYearDropdown
            scrollableYearDropdown
            disabled
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </div>
    </div>
  );
};

export default ViewApplicationEditableRowComponent;
