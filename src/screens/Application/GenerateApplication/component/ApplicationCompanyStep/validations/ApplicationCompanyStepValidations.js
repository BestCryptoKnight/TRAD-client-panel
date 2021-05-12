import {
  saveApplicationStepDataToBackend,
  updateEditApplicationData,
} from '../../../../redux/ApplicationAction';

export const applicationCompanyStepValidations = async (dispatch, data, editApplicationData) => {
  const errors = {};
  let validated = true;
  if (!data?.abn || data?.abn.trim().length <= 0) {
    validated = false;
    errors.abn = 'Please enter ABN number before continue';
  }
  if (data?.abn && data?.abn.trim().length < 11 && Number.isNaN(data?.abn)) {
    validated = false;
    errors.abn = 'Please enter valid ABN number before continue';
  }

  if (data?.acn && data.acn?.trim().length < 9 && Number.isNaN(data?.acn)) {
    validated = false;
    errors.acn = 'Please enter valid ACN number before continue';
  }
  if (!data?.entityName || data?.entityName?.value?.length <= 0) {
    validated = false;
    errors.entityName = 'Please enter entity name';
  }
  if (!data?.entityType || data?.entityType.length <= 0) {
    validated = false;
    errors.entityType = 'Please select entity type before continue';
  }
  if (!data?.country || data?.country.length === 0) {
    validated = false;
    errors.country = 'Please select country before continue';
  }
  if (!data?.streetNumber || data?.streetNumber.length === 0) {
    validated = false;
    errors.streetNumber = 'Please enter street number before continue';
  }
  if (data?.streetNumber && Number.isNaN(data?.streetNumber)) {
    validated = false;
    errors.streetNumber = 'Street number should be number';
  }
  if (!data?.state || data?.state.length === 0) {
    validated = false;
    errors.state = 'Please select state before continue';
  }
  if (!data?.postCode || data?.postCode?.length === 0) {
    validated = false;
    errors.postCode = 'Please enter post code before continue';
  }
  if (data?.postCode && Number.isNaN(data?.postCode)) {
    validated = false;
    errors.postCode = 'Post code should be number';
  }
  if (data?.phoneNumber && Number.isNaN(data?.phoneNumber)) {
    validated = false;
    errors.phoneNumber = 'Phone number should be number';
  }
  if (validated) {
    const {
      postCode,
      state,
      suburb,
      streetType,
      streetName,
      streetNumber,
      unitNumber,
      property,
      entityType,
      phoneNumber,
      entityName,
      acn,
      abn,
      tradingName,
      outstandingAmount,
      debtorId,
      country,
      isActive,
      wipeOutDetails,
    } = data;

    delete country?.name;

    const finalData = {
      stepper: 'company',
      debtorId: debtorId?.value,
      isActive: typeof isActive === 'string' ? isActive === 'Active' : isActive,
      abn,
      acn,
      entityName: entityName?.label,
      tradingName,
      contactNumber: phoneNumber,
      outstandingAmount,
      entityType: entityType?.value,
      wipeOutDetails,
      address: {
        property,
        unitNumber,
        streetNumber,
        streetName,
        streetType: streetType?.value,
        suburb,
        state: state?.value ?? state,
        country: { name: country?.label, code: country?.value },
        postCode,
      },
      applicationId: editApplicationData?._id ?? '',
    };

    try {
      await dispatch(saveApplicationStepDataToBackend(finalData));
      validated = true;
    } catch (e) {
      console.log('in catch', e);
      /**/
      validated = false;
    }
  }
  dispatch(updateEditApplicationData('company', { errors }));
  return validated;
};
