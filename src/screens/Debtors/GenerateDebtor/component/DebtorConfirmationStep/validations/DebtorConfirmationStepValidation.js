import { getDebtorFilter, saveDebtorStepDataToBackend } from '../../../../redux/DebtorsAction';

export const debtorConfirmationStepValidations = async (dispatch, data, editDebtorData, history) => {
  let validated = true;
  if (validated) {
    const finalData = {
      stepper: 'confirmation',
      debtorId: editDebtorData?._id,
    };
    try {
      await dispatch(saveDebtorStepDataToBackend(finalData));
      history.replace('/debtors');
      console.log('hehehhehehehehehe=================');
      await dispatch(getDebtorFilter());
      console.log('hihihihihihihihihihi=================');
    } catch (e) {
      throw Error();
    }
    validated = true;
  }

  console.log('validated_____________hereherehere', validated);
  return validated;
};
