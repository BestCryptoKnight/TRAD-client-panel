import ApiService from '../../../services/api-service/ApiService';
import { COMPANY_PROFILE_URL } from '../../../constants/UrlConstants';

const CompanyProfileApiService = {
  getClientData: () => ApiService.getData(COMPANY_PROFILE_URL.COMPANY_PROFILE_URL),
  getClientPolicyList: params =>
    ApiService.getData(COMPANY_PROFILE_URL.COMPANY_PROFILE_POLICY_LIST, { params }),
  getClientPolicyColumnList: () =>
    ApiService.getData(COMPANY_PROFILE_URL.COMPANY_PROFILE_POLICY_COLUMN_LIST),
  updateClientPolicyColumnList: data =>
    ApiService.putData(COMPANY_PROFILE_URL.COMPANY_PROFILE_POLICY_COLUMN_LIST, data),
};

export default CompanyProfileApiService;
