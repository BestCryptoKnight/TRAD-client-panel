import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';
import {
    EMPLOYEE_REDUX_CONSTANTS
} from "./EmployeeReduxConstants";

const initialEmployeeListState = {
    employeeList: { docs: [], total: 0, limit: 15, page: 1, pages: 1, isLoading: true}
}

export const employee = (state = initialEmployeeListState, action) => {
    switch (action.type) {
        case EMPLOYEE_REDUX_CONSTANTS.EMPLOYEE_LIST_USER_ACTION:
            return {
                ...state,
                employeeList: {...action.data, isLoading: false}
            }
        case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION: return null;
        default: return state;
    }
}
