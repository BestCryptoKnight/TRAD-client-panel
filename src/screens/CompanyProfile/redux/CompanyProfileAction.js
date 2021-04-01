import {errorNotification} from "../../../common/Toast";
import CompanyProfileApiService from "../services/CompanyProfileApiService";
import {CLIENT_REDUX_CONSTANTS} from "./CompanyProfileReduxConstants";

export const getClientDetails =  () => {
    return async dispatch => {
        try {
            const response = await CompanyProfileApiService.getClientData();
            if (response.data.status === 'SUCCESS') {
                dispatch({
                    type: CLIENT_REDUX_CONSTANTS.CLIENT_DATA,
                    data: response.data.data
            })
            }
        } catch (e) {
            if(e.response && e.response.data) {
                if(e.response.data.status === undefined) {
                    errorNotification('It seems like server is down, Please try again later.');
                } else {
                    errorNotification('Internal server error.')
                }
            }
        }
    }
}
