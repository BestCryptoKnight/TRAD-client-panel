import React, { useCallback, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ReactSelect from 'react-select';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Button from '../../../common/Button/Button';
import Input from '../../../common/Input/Input';
import { STAGE, UNDERWRITER } from './AddClaimsDropdownHelper';
import { getClaimDetails, handleClaimChange, resetClaimDetails } from '../redux/ClaimsAction';
import { addClaimsValidations } from './AddClaimsValidations';
import Loader from '../../../common/Loader/Loader';
import ClaimsTabContainer from '../components/ClaimsTabContainer';
import { NumberCommaSeparator } from '../../../helpers/NumberCommaSeparator';
import { DECIMAL_REGEX } from '../../../constants/RegexConstants';

const AddViewClaims = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { type, id } = useParams();
  const claimDetails = useSelector(({ claims }) => claims?.claimDetails ?? {});
  const backToClaimsList = useCallback(() => {
    history.replace('/claims');
  }, [history]);

  const changeClaimDetails = useCallback(
    (name, value) => dispatch(handleClaimChange(name, value)),
    []
  );

  const { viewClaimLoader, saveClaimsButtonLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const changeClaimFields = useCallback((name, value) => {
    dispatch(handleClaimChange(name, value));
  }, []);
  const onHandleInputTextChange = useCallback(e => {
    const { name, value } = e.target;
    changeClaimDetails(name, value);
  }, []);

  const onHandleSelectChange = useCallback(e => {
    changeClaimDetails(e.name, e);
  }, []);

  const handleDateInputChange = useCallback((name, e) => {
    changeClaimDetails(name, e);
  }, []);

  const onHandleAmountInputTextChange = useCallback(
    e => {
      const { name, value } = e.target;
      const updatedVal = value?.toString()?.replaceAll(',', '');
      if (DECIMAL_REGEX.test(updatedVal)) changeClaimFields(name, updatedVal);
    },
    [DECIMAL_REGEX]
  );

  const inputClaims = useMemo(
    () => [
      {
        name: 'name',
        title: 'Claim Name',
        isRequired: true,
        placeholder: 'Enter claim name',
        type: 'input',
        value: claimDetails?.name,
      },
      {
        name: 'grossdebtamount',
        title: 'Gross Debt Amount',
        placeholder: '$00.00',
        type: 'amount',
        value: claimDetails?.grossdebtamount,
      },
      {
        name: 'amountpaid',
        title: 'Amount Paid',
        placeholder: '$00.00',
        type: 'amount',
        value: claimDetails?.amountpaid,
      },
      {
        name: 'claimpaidbyuw',
        title: 'Claim Paid by U/ W',
        placeholder: 'Select',
        type: 'date',
        value: claimDetails?.claimpaidbyuw,
      },
      {
        name: 'underwriter',
        title: 'Underwriter',
        placeholder: 'Select',
        type: 'select',
        isRequired: true,
        options: UNDERWRITER,
        value: claimDetails?.underwriter,
      },
      {
        name: 'stage',
        title: 'Stage',
        placeholder: 'Select',
        type: 'select',
        isRequired: true,
        options: STAGE,
        value: claimDetails?.stage,
      },
    ],
    [claimDetails]
  );

  const getComponentByType = useCallback(
    input => {
      let component = null;
      switch (input.type) {
        case 'select':
          component = (
            <>
              {type === 'view' ? (
                <div className="view-claim-detail">
                  {input.value && input.value.toString().trim().length > 0 ? input?.value : '-'}
                </div>
              ) : (
                <ReactSelect
                  placeholder={input.placeholder}
                  options={input?.options}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  onChange={onHandleSelectChange}
                  menuPlacement={input?.dropdownPlacement}
                  value={input?.value ?? []}
                />
              )}
            </>
          );
          break;

        case 'date':
          component = (
            <>
              {type === 'view' ? (
                <span className="view-claim-detail">
                  {input?.value ? moment(input?.value).format('DD/MM/YYYY') : '-'}
                </span>
              ) : (
                <div className={`date-picker-container ${type === 'view' && 'disabled-control'}`}>
                  <DatePicker
                    placeholderText={input.placeholder}
                    selected={input.value || null}
                    onChange={date => handleDateInputChange(input.name, date)}
                    showMonthDropdown
                    showYearDropdown
                    scrollableYearDropdown
                    popperProps={{ positionFixed: true }}
                    dateFormat="dd/MM/yyyy"
                  />
                  <span className="material-icons-round">event</span>
                </div>
              )}
            </>
          );
          break;

        case 'amount':
          component = (
            <>
              {type === 'view' ? (
                <div className="view-claim-detail">
                  {input?.value ? NumberCommaSeparator(input?.value) : '-'}
                </div>
              ) : (
                <Input
                  type="text"
                  name={input?.name}
                  placeholder={input.placeholder}
                  onChange={onHandleAmountInputTextChange}
                  value={NumberCommaSeparator(input.value) ?? ''}
                />
              )}
            </>
          );
          break;

        default:
          component = (
            <>
              {type === 'view' ? (
                <div className="view-claim-detail">
                  {input?.value?.toString().trim().length > 0 ? input?.value : '-'}
                </div>
              ) : (
                <Input
                  type="text"
                  name={input?.name}
                  placeholder={input.placeholder}
                  onChange={onHandleInputTextChange}
                  value={input.value ?? ''}
                />
              )}
            </>
          );
          break;
      }
      return (
        <div className="d-flex align-center w-100">
          <span className="claims-title">
            {input.title}
            {input?.isRequired && <b className="f-16"> *</b>}
          </span>

          <div>
            {component}
            {claimDetails?.errors && (
              <div className="ui-state-error">{claimDetails?.errors?.[input.name]}</div>
            )}
          </div>
        </div>
      );
    },
    [inputClaims, claimDetails]
  );

  const onAddClaim = useCallback(async () => {
    await addClaimsValidations(dispatch, claimDetails, history);
  }, [claimDetails]);

  useEffect(() => {
    if (type === 'view') {
      dispatch(getClaimDetails(id));
    }
    return () => {
      dispatch(resetClaimDetails());
    };
  }, []);

  return (
    <>
      {!viewClaimLoader ? (
        <>
          {' '}
          <div className="breadcrumb-button-row">
            <div className="breadcrumb">
              <span onClick={backToClaimsList}>Claims List</span>
              <span className="material-icons-round">navigate_next</span>
              <span>{type === 'view' ? 'View' : 'New'} Claim</span>
            </div>
          </div>
          <div
            className={`common-white-container add-claims-content ${
              type === 'view' && 'view-claim-content'
            }`}
          >
            {inputClaims.map(getComponentByType)}
          </div>
          {type === 'view' && <ClaimsTabContainer />}
          {type === 'add' && (
            <div className="add-overdues-save-button">
              <Button
                buttonType="primary"
                title="Save"
                onClick={onAddClaim}
                isLoading={saveClaimsButtonLoaderAction}
              />
            </div>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default AddViewClaims;
