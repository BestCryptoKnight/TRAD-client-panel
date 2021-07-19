import SupportApiService from '../services/SupportApiService';
import { SUPPORT_REDUX_CONSTANTS } from './SupportReduxConstants';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';

export const getSupportDetails = () => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('supportPagePageLoaderAction');
      const response = await SupportApiService.getSupportDetails();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: SUPPORT_REDUX_CONSTANTS.SUPPORT_GET_DETAILS_ACTION,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('supportPagePageLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('supportPagePageLoaderAction');
      displayErrors(e);
    }
  };
};
