import SupportApiService from '../services/SupportApiService';
import { SUPPORT_REDUX_CONSTANTS } from './SupportReduxConstants';
import {
  startLoaderButtonOnRequest,
  stopLoaderButtonOnSuccessOrFail,
} from '../../../common/LoaderButton/redux/LoaderButtonAction';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';

export const getSupportDetails = () => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest('supportPagePageLoaderAction');
      const response = await SupportApiService.getSupportDetails();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: SUPPORT_REDUX_CONSTANTS.SUPPORT_GET_DETAILS_ACTION,
          data: response.data.data,
        });
        stopLoaderButtonOnSuccessOrFail('supportPagePageLoaderAction');
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('supportPagePageLoaderAction');
      displayErrors(e);
    }
  };
};
