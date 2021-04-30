import { saveApplicationStepDataToBackend } from '../../../../redux/ApplicationAction';

export const applicationDocumentsStepValidations = (dispatch, data, editApplicationData) => {
  let validated = true;
  if (validated) {
    const finalData = {
      stepper: 'documents',
      applicationId: editApplicationData?._id,
    };
    try {
      dispatch(saveApplicationStepDataToBackend(finalData));
    } catch (e) {
      /**/
    }
    validated = true;
  }
  /* dispatch(updateEditApplicationData('documents', {  })); */
  return validated;
};
