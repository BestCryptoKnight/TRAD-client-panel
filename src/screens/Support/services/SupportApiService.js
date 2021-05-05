import ApiService from "../../../services/api-service/ApiService";
import {SUPPORT_URLS} from "../../../constants/UrlConstants";

const SupportApiService = {
    getSupportDetails: () => ApiService.getData(SUPPORT_URLS.SUPPORT_URL)
}

 export default SupportApiService;
