import { NUMBER_REGEX } from '../../../constants/RegexConstants';
import { addClaim, handleClaimChange } from '../redux/ClaimsAction';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';

export const addClaimsValidations = async (dispatch, data, history) => {
  let validated = true;
  const errors = {};
  let preparedData = {};

  if (!data.name || data?.name?.toString()?.trim().length <= 0) {
    validated = false;
    errors.name = 'Please enter claim name';
  }

  if (!data?.stage || data?.stage?.length <= 0) {
    validated = false;
    errors.stage = 'Please select stage';
  }

  if (!data?.underwriter || data?.underwriter?.length <= 0) {
    validated = false;
    errors.underwriter = 'Please select underwriter';
  }

  if (data?.grossdebtamount && !NUMBER_REGEX.test(data?.grossdebtamount)) {
    validated = false;
    errors.grossdebtamount = 'Amount should be number';
  }

  if (!data.claimsmanager || data?.claimsmanager?.length <= 0) {
    validated = false;
    errors.name = 'Please select claims manager';
  }

  const { name, underwriter, grossdebtamount, amountpaid, claimpaidbyuw, stage, claimsmanager } =
    data;

  preparedData = {
    name,
    grossdebtamount: grossdebtamount ? parseInt(grossdebtamount, 10) : undefined,
    amountpaid: amountpaid ? parseInt(amountpaid, 10) : undefined,
    claimpaidbyuw,
    underwriter: underwriter?.value,
    stage: stage?.value,
    claimsmanager: claimsmanager?.value?.toString(),
  };

  if (validated) {
    const finalData = { ...preparedData };
    try {
      const response = await dispatch(addClaim(finalData));
      if (response) {
        history.replace(`/claims/view/${response}`);
      }
    } catch (e) {
      displayErrors(e);
    }
  } else {
    dispatch(handleClaimChange('errors', errors));
  }
};
