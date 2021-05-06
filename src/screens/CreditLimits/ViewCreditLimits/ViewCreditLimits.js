import React, {useCallback, useEffect, useMemo, useState} from "react";
import './ViewCreditLimits.scss';
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getCreditLimitsDetails} from "../redux/CreditLimitsAction";
import Loader from "../../../common/Loader/Loader";
import Tab from "../../../common/Tab/Tab";
import CreditLimitsApplicationTab from "../CreditLimitsTabs/CreditLimitsApplicationTab";
import CreditLimitsOverduesTab from "../CreditLimitsTabs/CreditLimitsOverduesTab";
import CreditLimitsTasksTab from "../CreditLimitsTabs/CreditLimitsTasksTab";
import CreditLimitsClaimsTab from "../CreditLimitsTabs/CreditLimitsClaimsTab";
import CreditLimitsDocumentsTab from "../CreditLimitsTabs/CreditLimitsDocumentsTab";
import CreditLimitsNotesTab from "../CreditLimitsTabs/CreditLimitsNotesTab";

const ViewCreditLimits = (factory, deps) => {
    const history = useHistory();
    const {id} = useParams();
    const dispatch = useDispatch();
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const tabActive = index => {
        setActiveTabIndex(index);
    };
    const creditLimitsDetails = useSelector(({creditLimits}) => creditLimits?.selectedCreditLimitData);

    const backToCreditLimit = useCallback(() => {
        history.replace('/credit-limits');
    }, [history]);

    const INPUTS = useMemo(() => [
        {
            label: 'Name',
            value: creditLimitsDetails?.entityName?.label
        },
        {
            label: 'Address',
            value: `${creditLimitsDetails?.streetNumber}, ${creditLimitsDetails?.state?.label}, ${creditLimitsDetails?.postCode} `
        },
        {
            label: 'Brokers Commission',
            value: ''
        },
        {
            label: 'Phone',
            value: ''
        },
        {
            label: 'ABN',
            value: creditLimitsDetails?.abn
        },
        {
            label: 'ACN',
            value: creditLimitsDetails?.acn
        },
        {
            label: 'Country',
            value: creditLimitsDetails?.country?.label
        },
        {
            label: 'Joint Insured',
            value: creditLimitsDetails?.jointInsured
        },
        {
            label: 'Associated Client',
            value: creditLimitsDetails?.associatedClient
        },
        {
            label: 'Current Business',
            value: creditLimitsDetails?.tradingName
        },
        {
            label: 'Website',
            value: creditLimitsDetails?.website
        },
        {
            label: 'Net Income',
            value: creditLimitsDetails?.netIncome
        },
        {
            label: 'Current Credit Limits',
            value: creditLimitsDetails?.creditLimit
        },
        {
            label: 'Policy Type',
            value: creditLimitsDetails?.policyType
        },
        {
            label: 'Inception Date',
            value: creditLimitsDetails?.inceptionDate
        },
        {
            label: 'Expiry Date',
            value: creditLimitsDetails?.expiredAt
        },
        {
            label: 'Last Review Date',
            value: creditLimitsDetails?.reviewDate
        },
        {
            label: 'Status',
            value: creditLimitsDetails?.status
        }
    ], [creditLimitsDetails]);

    const tabs = [
        'Application',
        'Overdues',
        'Claims',
        'Tasks',
        'Documents',
        'Notes',
    ];

    const VIEW_CREDIT_LIMITS_TABS = [
            <CreditLimitsApplicationTab/>,
            <CreditLimitsOverduesTab/>,
            <CreditLimitsClaimsTab/>,
            <CreditLimitsTasksTab/>,
            <CreditLimitsDocumentsTab/>,
            <CreditLimitsNotesTab/>
    ]

    useEffect(() => {
        dispatch(getCreditLimitsDetails(id));
    }, [])

    return (<>
        <div className="breadcrumb-button-row">
            <div className="breadcrumb">
                <span onClick={backToCreditLimit}>Credit Limit List</span>
                <span className="material-icons-round">navigate_next</span>
                <span>View Credit Limits</span>
            </div>
        </div>
        {creditLimitsDetails && (
                <div className="common-white-container">
                    {Object.entries(creditLimitsDetails).length > 0 ? (
                            <div className="credit-limits-details">{INPUTS.map(detail => (
                                    <>
                                        <div className="title">{detail.label}</div>
                                        <div className="value">{detail.value ?? '-'}</div>
                                    </>
                            ))}</div>):<div className="common-white-container just-center w-100"><Loader/></div>}
                </div>
        )}
        <Tab tabs={tabs} tabActive={tabActive} activeTabIndex={activeTabIndex} className="mt-15" />
        <div className="common-white-container">{VIEW_CREDIT_LIMITS_TABS[activeTabIndex]}</div>
    </>)
}

export default ViewCreditLimits;
