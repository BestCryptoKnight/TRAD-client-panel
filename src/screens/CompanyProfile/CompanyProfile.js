import React, {useCallback, useEffect, useMemo} from 'react';
import './CompanyProfile.scss';
import Button from "../../common/Button/Button";
import ReactSelect from "react-dropdown-select";
import Input from "../../common/Input/Input";
import BigInput from "../../common/BigInput/BigInput";
import IconButton from "../../common/IconButton/IconButton";
import Table from "../../common/Table/Table";
import Pagination from "../../common/Pagination/Pagination";
import {useDispatch, useSelector} from "react-redux";
import {getClientDetails} from "./redux/CompanyProfileAction";

const CompanyProfile = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getClientDetails())
    },[])

    const clientData = useSelector(({companyProfile}) => companyProfile.clientDetail);

    const INPUTS = useMemo(() => [
        {
            label: 'Name',
            placeholder: 'Please enter name',
            type: 'text',
            name: 'name',
            data: clientData?.name,
        },
        {
            label: 'Address',
            placeholder: 'Please enter address',
            type: 'text',
            name: 'address',
            data: `${clientData?.address?.addressLine}, ${clientData?.address?.city}`,
        },
        {
            label: 'ABN',
            placeholder: 'Please enter ABN',
            type: 'text',
            name: 'abn',
            data: clientData?.abn,
        },
        {
            label: 'Phone',
            placeholder: 'Please phone number',
            type: 'text',
            name: 'phone',
            data: clientData?.contactNumber,
        },
        {
            label: 'Sales Person',
            placeholder: 'Please enter sales person name..',
            type: 'text',
            name: 'salesPerson',
            data: clientData?.salesPerson,
        },
        {
            label: 'ACN',
            placeholder: 'Please enter ACN',
            type: 'text',
            name: 'acn',
            data: clientData?.acn,
        },
        {
            label: 'Risk Person',
            placeholder: 'Please select risk person name',
            type: 'select',
            name: 'riskPerson',
            data: 'riskPerson',
        },
        {
            label: 'Trading As',
            placeholder: 'Please enter value',
            type: 'text',
            name: 'tradingAs',
            data: 'tradingAs',
        },
        {
            label: 'Website',
            placeholder: 'Please enter website',
            type: 'text',
            name: 'website',
            data: clientData?.website,
        },
        {
            label: 'Service Person',
            placeholder: 'Please select service person',
            type: 'select',
            name: 'servicePerson',
            data: 'servicePerson',
        }
    ],[clientData])

    const getComponentFromType = useCallback(
            input => {
                let component = null;
                switch (input.type) {
                    case 'text':
                        component = (
                                <Input
                                        type="text"
                                        name={input.name}
                                        placeholder={input.placeholder}
                                        value={input.data}
                                />
                        );
                        break;
                    case 'select': {
                        component = (
                                <ReactSelect
                                        placeholder={input.placeholder}
                                        name={input.name}
                                        options={input.data}
                                        searchable={false}

                                />
                        );
                        break;
                    }
                    default:
                        return null;
                }
                return (
                        <>
                            <span>{input.label}</span>
                            <div>
                                {component}
                            </div>
                        </>
                );
            },
            []
    );

    return (<>
    <div className="page-header">
        <div className="page-header-name">
            Company Profile
        </div>
        <Button buttonType='primary' title="Edit"/>
    </div>
        <div className="common-white-container company-profile-container">
            {INPUTS.map(getComponentFromType)}
        </div>
        <div className="common-white-container">
            <div className="page-header">
                <div className="page-header-name">Policies</div>
                <div className="buttons-row">
                    <BigInput prefix="search" prefixClass="font-placeholder" placeholder="Search here" className="search"/>
                    <IconButton buttonType="primary" title="format_line_spacing"/>
                    <Button buttonType="secondary" title="Sync With CRM"/>
                </div>
            </div>
            <div className="common-list-container">
                <Table />
                <Pagination/>
            </div>
        </div>
    </>)
}

export default CompanyProfile;
