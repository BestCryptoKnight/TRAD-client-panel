import ApiService from '../../../services/api-service/ApiService';
import { CREDIT_LIMITS_URLS } from '../../../constants/UrlConstants';

const CreditLimitsApiService = {
  getAllCreditLimitsList: params => ApiService.getData(CREDIT_LIMITS_URLS.CREDIT_LIMITS_LIST_URL, { params })
};

export default CreditLimitsApiService;
