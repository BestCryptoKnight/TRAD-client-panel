import { saveApplicationStepDataToBackend } from '../../../../redux/ApplicationAction';

export const applicationDocumentsStepValidations = async (dispatch, data, editApplicationData) => {
  let validated = true;
  if (validated) {
    const finalData = {
      stepper: 'documents',
      applicationId: editApplicationData?._id,
    };
    try {
      await dispatch(saveApplicationStepDataToBackend(finalData));
    } catch (e) {
      /**/
    }
    validated = true;
  }
  /* dispatch(updateEditApplicationData('documents', {  })); */
  return validated;
};
