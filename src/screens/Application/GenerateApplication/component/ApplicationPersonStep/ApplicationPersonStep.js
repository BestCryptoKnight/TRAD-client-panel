import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Accordion from '../../../../../common/Accordion/Accordion';
import PersonIndividualDetail from './personIndividualDetail/PersonIndividualDetail';
import {addPersonDetail, getApplicationFilter} from '../../../redux/ApplicationAction';

const ApplicationPersonStep = () => {
    const dispatch = useDispatch();

    const personState = useSelector(
            ({ application }) => application?.editApplication?.partners ?? []
    );
    const entityType = useSelector(
            ({ application }) => application?.editApplication?.company?.entityType ?? []
    );

    const entityTypeFromCompany = useMemo(() => entityType?.value ?? '', [entityType]);

  useEffect(() => {
    if (personState?.length < 1 && ['PARTNERSHIP', 'TRUST'].includes(entityTypeFromCompany)) {
      dispatch(addPersonDetail('individual'));
    }
  }, []);
    useEffect(() => {
        if (personState?.length < 1 && ['PARTNERSHIP', 'TRUST'].includes(entityTypeFromCompany)) {
            dispatch(addPersonDetail('individual'));
        }
        dispatch(getApplicationFilter());
    }, []);

    const {companyEntityType ,streetType, australianStates, countryList, newZealandStates }  = useSelector(
            ({ application }) => application?.applicationFilterList?.dropdownData ?? []);


    const getAccordionAccordingEntityType = useCallback(
            (person, index) => {
                let itemHeader = 'Director Details';

                switch (entityTypeFromCompany) {
                    case 'PARTNERSHIP':
                        itemHeader = 'Partner Details';
                        break;
                    case 'TRUST':
                        itemHeader = 'Trustee Details';
                        break;
                    default:
                        break;
                }
                return (
                        <PersonIndividualDetail
                                newZealandStates = {newZealandStates}
                                countryList = {countryList}
                                australianStates = {australianStates}
                                streetType = {streetType}
                                companyEntityType = {companyEntityType}
                                itemHeader={itemHeader}
                                index={index}
                                entityTypeFromCompany={entityTypeFromCompany}
                        />
                );
            },
            [entityTypeFromCompany ,newZealandStates , countryList  ,australianStates ,streetType ,companyEntityType]
    );

  return (
          <>
            <Accordion>{personState ? personState?.map(getAccordionAccordingEntityType) : ''}</Accordion>
          </>
  );
};

export default ApplicationPersonStep;
