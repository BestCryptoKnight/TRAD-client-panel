import { errorNotification } from '../../../common/Toast';
import EmployeeApiService from '../services/EmployeeApiService'
import {EMPLOYEE_REDUX_CONSTANTS} from "./EmployeeReduxConstants";

export const getEmployeeList = (params ={page: 1, limit: 15}) => {
    return async dispatch => {
        try {
            const response = await EmployeeApiService.getAllEmployeeList(params);
            if (response.data.status==='SUCCESS') {
                dispatch({
                    type: EMPLOYEE_REDUX_CONSTANTS.EMPLOYEE_LIST_USER_ACTION,
                    data: response.data.data
                })
            }
        }
        catch (e) {
            if(e.response && e.response.data) {
                if(e.response.data.status === undefined) {
                    errorNotification('It seems like server is down, Please try again later')
                }
                else {
                    errorNotification('Internal server error')
                }
            }
        }
    }
}
