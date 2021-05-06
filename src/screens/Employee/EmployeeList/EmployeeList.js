import React, {useCallback, useEffect, useMemo, useState} from 'react';
import './EmployeeList.scss';
import IconButton from "../../../common/IconButton/IconButton";
import Table from "../../../common/Table/Table";
import Pagination from "../../../common/Pagination/Pagination";
import Loader from "../../../common/Loader/Loader";
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {
    changeEmployeeColumnList,
    getEmployeeColumnList,
    getEmployeeList,
    saveEmployeeColumnList
} from "../redux/EmployeeAction";
import {useHistory} from "react-router-dom";
import {useQueryParams} from "../../../hooks/GetQueryParamHook";
import CustomFieldModal from "../../../common/Modal/CustomFieldModal/CustomFieldModal";
import {EMPLOYEE_COLUMN_LIST_REDUX_CONSTANTS} from "../redux/EmployeeReduxConstants";
import {errorNotification} from "../../../common/Toast";

const EmployeeList = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {
        page: paramPage,
            limit: paramLimit
    } = useQueryParams();
    const [customFieldModal, setCustomFieldModal] = useState(false);
    const employeeListWithPageData = useSelector(({ employee }) => employee?.employeeList ?? {});
    const employeeColumnList = useSelector(({ employee }) => employee?.employeeColumnList ?? {});
    const employeeDefaultColumnList = useSelector(({ employee }) => employee?.employeeDefaultColumnList ?? {});
    const {defaultFields, customFields} = useMemo(() => employeeColumnList || {defaultFields: [], customFields: []}, [employeeColumnList])

    const { total, pages, page, limit, docs, headers, isLoading } = useMemo(() => employeeListWithPageData, [
        employeeListWithPageData,
    ]);

    const getEmployeeListByFilter = useCallback(async (params= {},cb)=> {
        const data = {
            page: page ?? 1,
            limit: limit ?? 15,
            ...params
        }
        try {
            await dispatch(getEmployeeList(data));
            if(cb && typeof cb === 'function') {
                cb()
            }
        } catch(e) {
            /**/
        }
    },[page, limit])

    const toggleCustomField = useCallback(
            value => setCustomFieldModal(value!==undefined ? value:e => !e),
            [setCustomFieldModal]
    );

    const onClickResetDefaultColumnSelection = useCallback(async () => {
        await dispatch(saveEmployeeColumnList({isReset: true}));
        dispatch(getEmployeeColumnList());
        toggleCustomField();
        await getEmployeeListByFilter();
    },[toggleCustomField, getEmployeeListByFilter])

    const onClickCloseCustomFieldModal = useCallback(() => {
        dispatch({
            type: EMPLOYEE_COLUMN_LIST_REDUX_CONSTANTS.EMPLOYEE_COLUMN_LIST_ACTION,
            data: employeeDefaultColumnList
        });
        toggleCustomField();
    },[employeeDefaultColumnList, toggleCustomField]);

    const onClickSaveColumnSelection = useCallback(async () => {
        try {
            const isBothEqual = _.isEqual(employeeColumnList, employeeDefaultColumnList);
            if(!isBothEqual) {
                await dispatch(saveEmployeeColumnList({employeeColumnList}));
                getEmployeeListByFilter();
                toggleCustomField();
            } else {
                errorNotification('Please select different columns to apply changes.')
            }
        } catch (e) {
            /**/
        }
    },[toggleCustomField, getEmployeeListByFilter, employeeColumnList, employeeDefaultColumnList])

    const customFieldsModalButtons = useMemo(
            () => [
                {
                    title: 'Reset Defaults',
                    buttonType: 'outlined-primary',
                    onClick:  onClickResetDefaultColumnSelection
                },
                {title: 'Close', buttonType: 'primary-1', onClick:  onClickCloseCustomFieldModal},
                {title: 'Save', buttonType: 'primary', onClick:onClickSaveColumnSelection },
            ],
            [onClickResetDefaultColumnSelection, onClickCloseCustomFieldModal, onClickSaveColumnSelection]
    );

    const onChangeSelectedColumn = useCallback((type,name, value) => {
        const data = {type, name, value}
        dispatch(changeEmployeeColumnList(data))}, [dispatch])

    useEffect(() => {
        dispatch(getEmployeeList());
    },[]);

    useEffect(async () => {
        const params = {
            page: paramPage ?? page ?? 1,
            limit: paramLimit ?? limit ?? 15
        };
        await getEmployeeListByFilter({...params})
        await dispatch(getEmployeeColumnList())
    },[])

    // for params in url
    useEffect(() => {
        const params = {
            page: page ?? 1,
            limit: limit ?? 15,
        };
        const url = Object.entries(params)
                ?.filter(arr => arr[1] !== undefined)
                ?.map(([k, v]) => `${k}=${v}`)
                ?.join('&');
        history.push(`${history?.location?.pathname}?${url}`);
    }, [
        history,
        total,
        pages,
        page,
        limit]);

    // on record limit changed
    const onSelectLimit = useCallback(
            newLimit => {
                getEmployeeListByFilter({ page: 1, limit: newLimit });
            },
            [getEmployeeListByFilter]
    );

    // on pagination changed
    const pageActionClick = useCallback(
            newPage => {
                getEmployeeListByFilter({page: newPage, limit})
            },[getEmployeeListByFilter, limit]);

    return <>
        <div className="page-header">
            <div className="page-header-name">Employee List</div>
            {!isLoading && docs && (
                    <div className="page-header-button-container">
                        <IconButton
                                buttonType="secondary"
                                title="filter_list"
                                className="mr-10"
                                buttonTitle="Click to apply filters on employee list"
                        />
                        <IconButton
                                buttonType="primary"
                                title="format_line_spacing"
                                className="mr-10"
                                buttonTitle="Click to select custom fields"
                                onClick={() => toggleCustomField()}
                        />
                    </div>

            )}
        </div>
        {docs && !isLoading ? (docs.length > 0 ?
                <>
                    <div className="common-list-container">
                        <Table
                                align="left"
                                valign="center"
                                tableClass="main-list-table"
                                data={docs}
                                headers={headers}
                                recordSelected={() => console.log('Record selected')}
                                recordActionClick={() => console.log('Record action clicked')}
                                rowClass="cursor-pointer"
                                haveActions
                        />
                    </div>
                    <Pagination
                            className="common-list-pagination"
                            total={total}
                            pages={pages}
                            page={page}
                            limit={limit}
                            pageActionClick={pageActionClick}
                            onSelectLimit={onSelectLimit}
                    />
                </> : <div className="no-record-found">No record found</div>
        ) : (
                <Loader />
        )}

        {customFieldModal && (
                <CustomFieldModal
                        defaultFields={defaultFields}
                        customFields={customFields}
                        buttons={customFieldsModalButtons}
                        onChangeSelectedColumn={onChangeSelectedColumn}
                        toggleCustomField={toggleCustomField}
                />
        )}

    </>
}

export default EmployeeList;
