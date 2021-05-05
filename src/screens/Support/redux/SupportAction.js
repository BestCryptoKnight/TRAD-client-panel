import SupportApiService from '../services/SupportApiService';
import {SUPPORT_REDUX_CONSTANTS} from "./SupportReduxConstants";
import {errorNotification} from "../../../common/Toast";

export const getSupportDetails = () => {
    return async dispatch => {
        try {
            const response = await SupportApiService.getSupportDetails()
            if(response.data.status === 'SUCCESS') {
                dispatch({
                    type: SUPPORT_REDUX_CONSTANTS.SUPPORT_GET_DETAILS_ACTION,
                    data: response.data.data
                })
            }
        } catch (e) {
            if(e.response && e.response.data) {
                if(e.response.data.status === undefined) {
                    errorNotification('It seems like server is down, Please try again later.');
                } else if(e.response.data.messageCode) {
                    errorNotification(e.response.data.message)
                }
            }
        }
    }
}
