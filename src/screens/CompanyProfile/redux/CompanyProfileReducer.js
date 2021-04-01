import { LOGIN_REDUX_CONSTANTS } from "../../auth/login/redux/LoginReduxConstants";
import { CLIENT_REDUX_CONSTANTS } from "./CompanyProfileReduxConstants";

const initialClientData = {
    clientDetail: {}
}

export const companyProfile = (state = initialClientData, action) => {
    switch (action.type) {
        case CLIENT_REDUX_CONSTANTS.CLIENT_DATA:
            return {
                ...state,
                clientDetail: action.data
            };
        case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
            return null;
        default:
            return state
    }
}
