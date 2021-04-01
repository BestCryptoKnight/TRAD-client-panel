import ApiService from '../../../services/api-service/ApiService';
import { COMPANY_PROFILE_URL } from "../../../constants/UrlConstants";

const CompanyProfileApiService = {
    getClientData: () => ApiService.getData(COMPANY_PROFILE_URL.COMPANY_PROFILE_URL)
}

export default CompanyProfileApiService;
