/* eslint-disable no-restricted-globals */
import { errorNotification } from '../../../../../../common/Toast';
import {
  saveApplicationStepDataToBackend,
  updatePersonData,
} from '../../../../redux/ApplicationAction';
import {
  EMAIL_ADDRESS_REGEX,
  SPECIAL_CHARACTER_REGEX,
} from '../../../../../../constants/RegexConstants';

export const applicationPersonStepValidation = (dispatch, data, editApplicationData) => {
  let validated = true;
  const partners = data?.map((item, index) => {
    const errors = {};
    const { type, isDisabled } = item;
    let preparedData = {};
    if (!isDisabled) {
      if (type === 'company') {
        if (!item?.abn || item?.abn.trim().length <= 0) {
          validated = false;
          errors.abn = 'Please enter ABN number before continue';
        }
        if (item?.abn && item?.abn?.trim()?.length !== 11 && Number.isNaN(Number(item?.abn))) {
          validated = false;
          errors.abn = 'Please enter valid ABN number before continue';
        }
        if (item?.acn && item?.acn?.trim()?.length !== 9 && Number.isNaN(Number(item?.acn))) {
          validated = false;
          errors.acn = 'Please enter valid ACN number before continue';
        }
        if (
          !item?.entityName ||
          item?.entityName?.length <= 0 ||
          item?.entityName?.value?.length <= 0
        ) {
          validated = false;
          errors.entityName = 'Please enter entity name before continue';
        }
        if (!item?.entityType || item?.entityType?.length <= 0) {
          validated = false;
          errors.entityType = 'Please select entity type before continue';
        }
      }
      if (type === 'individual') {
        if (!item?.title || item?.title?.length <= 0) {
          validated = false;
          errors.title = 'Please select title before continue';
        }
        if (!item?.firstName || item?.firstName?.trim().length <= 0) {
          validated = false;
          errors.firstName = 'Please enter firstname before continue';
        }
        if (
          item?.firstName &&
          item.firstName &&
          SPECIAL_CHARACTER_REGEX.test(item?.firstName?.toString())
        ) {
          validated = false;
          errors.firstName = 'Please enter valid firstname';
        }
        if (!item?.lastName || item?.lastName?.trim().length <= 0) {
          validated = false;
          errors.lastName = 'Please enter lastname before continue';
        }
        if (
          item?.lastName &&
          item?.lastName &&
          SPECIAL_CHARACTER_REGEX.test(item?.lastName?.toString())
        ) {
          validated = false;
          errors.firstName = 'Please enter valid lastname';
        }
        if (!item?.country || item?.country?.length <= 0) {
          validated = false;
          errors.country = 'Please select country before continue';
        }
        if (!item?.dateOfBirth || item?.dateOfBirth?.length <= 0) {
          validated = false;
          errors.dateOfBirth = 'Please select date of birth before continue';
        }
        if (!item?.driverLicenceNumber || item?.driverLicenceNumber?.length <= 0) {
          validated = false;
          errors.driverLicenceNumber = 'Please enter driver licence number before continue';
        }
        if (!item?.streetNumber || item?.streetNumber?.length <= 0) {
          validated = false;
          errors.streetNumber = 'Please select street number before continue';
        }
        if (item?.streetNumber && Number.isNaN(Number(item?.streetNumber))) {
          validated = false;
          errors.streetNumber = 'Street number should be number';
        }
        if (!item?.streetName || item?.streetName?.length <= 0) {
          validated = false;
          errors.streetName = 'Please enter street name before continue';
        }
        if (!item?.streetType || item?.streetType?.length <= 0) {
          validated = false;
          errors.streetType = 'Please select street type before continue';
        }
        if (!item?.state || item?.state?.length <= 0) {
          validated = false;
          if (item?.country?.value === 'AUS' || item?.country?.value === 'NZL') {
            errors.state = 'Please select state before continue';
          } else {
            errors.state = 'Please enter state before continue';
          }
        }
        if (data?.state && SPECIAL_CHARACTER_REGEX.test(data?.state?.toString())) {
          errors.state = 'Please enter valid state';
        }
        if (!item?.suburb || item?.suburb.length <= 0) {
          validated = false;
          errors.suburb = 'Please enter suburb before continue';
        }
        if (!item?.postCode || item?.postCode?.trim()?.length <= 0) {
          validated = false;
          errors.postCode = 'Please enter postcode before continue';
        }

        if (item?.postCode && Number.isNaN(Number(item?.postCode))) {
          validated = false;
          errors.postCode = 'Postcode should be number';
        }
        if (Number.isNaN(Number(item?.phoneNumber))) {
          validated = false;
          errors.phoneNumber = 'Phone number should be number';
        }
        if (Number.isNaN(Number(item?.mobileNumber))) {
          validated = false;
          errors.mobileNumber = 'Mobile number should be number';
        }
        if (Number.isNaN(Number(item?.driverLicenceNumber))) {
          validated = false;
          errors.driverLicenceNumber = 'Driving licence number should be number';
        }
        if (item?.email && !EMAIL_ADDRESS_REGEX.test(item?.email?.toString())) {
          validated = false;
          errors.email = 'Please enter valid email address';
        }
      }
    }
    if (type === 'company' && validated) {
      const { abn, acn, entityType, entityName, tradingName } = item;
      preparedData = {
        type,
        abn,
        acn,
        entityType: entityType?.value,
        entityName: entityName?.value,
        tradingName,
      };
    } else if (type === 'individual' && validated) {
      const {
        title,
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        driverLicenceNumber,
        phoneNumber,
        mobileNumber,
        email,
        unitNumber,
        streetNumber,
        streetName,
        streetType,
        suburb,
        state,
        country,
        postCode,
        allowToCheckCreditHistory,
      } = item;
      delete country?.name;

      preparedData = {
        type,
        title: title?.value,
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        driverLicenceNumber,
        phoneNumber,
        mobileNumber,
        email,
        address: {
          unitNumber,
          streetNumber,
          streetName,
          streetType: streetType?.value,
          suburb,
          state: state?.value ?? state,
          country: { name: country?.label, code: country?.value },
          postCode,
        },
        allowToCheckCreditHistory,
      };
    }
    dispatch(updatePersonData(index, 'errors', errors));

    return preparedData;
  });
  if (validated) {
    const finalData = {
      stepper: 'person',
      applicationId: editApplicationData?._id,
      entityType: editApplicationData?.company?.entityType?.value,
      partners,
    };
    try {
      if (
        editApplicationData?.company?.entityType?.value === 'PARTNERSHIP' &&
        partners.length < 2
      ) {
        validated = false;
        errorNotification('You have to add two partners at least');
      } else if (
        // TODO CHECK IF SOLE TRADER WOULD COME HERE OR NOT
        editApplicationData?.company?.entityType?.value === 'SOLE_TRADER' &&
        partners.length > 1
      ) {
        validated = false;
        errorNotification('You can only add one sole trader');
      } else {
        validated = true;
        dispatch(saveApplicationStepDataToBackend(finalData));
      }
    } catch (e) {
      /**/
    }
  } else {
    errorNotification('Please fill the details.');
  }

  return validated;
};
