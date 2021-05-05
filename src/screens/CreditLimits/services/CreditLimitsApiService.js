import ApiService from '../../../services/api-service/ApiService';
import { CREDIT_LIMITS_URLS } from '../../../constants/UrlConstants';

const CreditLimitsApiService = {
  getAllCreditLimitsList: params => ApiService.getData(CREDIT_LIMITS_URLS.CREDIT_LIMITS_LIST_URL, { params }),
  getCreditLimitColumnList: params => ApiService.getData(CREDIT_LIMITS_URLS.CREDIT_LIMITS_COLUMN_LIST, { params }),
  updateCreditLimitsColumnList: data => ApiService.putData(CREDIT_LIMITS_URLS.CREDIT_LIMITS_COLUMN_LIST, data),
  getCreditLimitsFilterData: params => ApiService.getData(CREDIT_LIMITS_URLS.CREDIT_LIMITS_FILTER, { params })
};

export default CreditLimitsApiService;
