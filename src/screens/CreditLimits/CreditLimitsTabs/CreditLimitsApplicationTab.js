import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Table from "../../../common/Table/Table";
import Pagination from "../../../common/Pagination/Pagination";
import BigInput from "../../../common/BigInput/BigInput";
import IconButton from "../../../common/IconButton/IconButton";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {
    changeCreditLimitsApplicationColumnList,
    getCreditLimitsApplicationColumnList,
    getCreditLimitsApplicationList, onSaveCreditLimitsApplicationColumnList
} from "../redux/CreditLimitsAction";
import Loader from "../../../common/Loader/Loader";
import _ from "lodash";
import {errorNotification} from "../../../common/Toast";
import {CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS} from "../redux/CreditLimitsReduxConstants";
import CustomFieldModal from "../../../common/Modal/CustomFieldModal/CustomFieldModal";

const CreditLimitsApplicationTab = () => {
    const dispatch = useDispatch();
    const {id} = useParams();
    const searchInputRef = useRef();
    const [customFieldModal, setCustomFieldModal] = useState(false);
    const creditLimitsApplicationList = useSelector(({creditLimits}) => creditLimits?.application?.applicationList ?? {});
    const creditLimitsApplicationColumnList = useSelector(({creditLimits}) => creditLimits?.application?.applicationColumnList ?? {});
    const creditLimitsApplicationDefaultColumnList = useSelector(({creditLimits}) => creditLimits?.application?.applicationDefaultColumnList ?? {});
    const {
        total,
        headers,
        pages,
        docs,
        page,
        limit,
        isLoading
    } = useMemo(() => creditLimitsApplicationList, [creditLimitsApplicationList]);
    const {defaultFields, customFields} = useMemo(() => creditLimitsApplicationColumnList || {defaultFields: [], customFields: []}, [creditLimitsApplicationColumnList])

    const getApplicationList = useCallback( (params = {}, cb) => {
        const data = {
            page: page ?? 1,
            limit: limit ?? 15,
            ...params
        };
       dispatch(getCreditLimitsApplicationList(id, data));
        if (cb && typeof cb==='function') {
            cb();
        }
    }, [page, limit]);

    const checkIfEnterKeyPressed = useCallback(async e => {
        const searchKeyword = searchInputRef.current.value;
        if (searchKeyword?.trim()?.toString()?.length === 0 && e.key !== 'Enter') {
            await getApplicationList();
        } else if (e.key === 'Enter') {
            if (searchKeyword?.trim()?.toString()?.length !== 0) {
                await getApplicationList({ search: searchKeyword?.trim()?.toString() });
            } else {
                errorNotification('Please enter any value than press enter');
            }
        }
    },[getApplicationList]);

    const toggleCustomField = useCallback(value => setCustomFieldModal(value!==undefined ? value:e => !e),[setCustomFieldModal]);

    const onChangeSelectColumn = useCallback((type, name, value) => {
        const data = {type, name, value};
        dispatch(changeCreditLimitsApplicationColumnList(data))
    },[dispatch])

    const onClickResetDefaultColumnSelection = useCallback(async () => {
        await dispatch(onSaveCreditLimitsApplicationColumnList({isReset: true}));
        await dispatch(getCreditLimitsApplicationColumnList());
        toggleCustomField();
        await getApplicationList();
    }, [toggleCustomField, getApplicationList]);

    const onClickCloseCustomFieldModal = useCallback(() => {
        dispatch({
            type: CREDIT_LIMITS_APPLICATION_REDUX_CONSTANTS.CREDIT_LIMITS_APPLICATION_COLUMN_LIST,
            data: creditLimitsApplicationDefaultColumnList
        });
        toggleCustomField();
    }, [toggleCustomField, creditLimitsApplicationDefaultColumnList])

    const onClickSaveColumnSelection = useCallback(async () => {
        try {
            const isBothEqual = _.isEqual(creditLimitsApplicationColumnList, creditLimitsApplicationDefaultColumnList);
            if (!isBothEqual) {
                await dispatch(onSaveCreditLimitsApplicationColumnList({creditLimitsApplicationColumnList}));
                await getApplicationList();
                toggleCustomField()
            } else {
                errorNotification('Please select different columns to apply changes.')
            }
        } catch (e) {
            /**/
        }
    }, [getApplicationList, toggleCustomField, creditLimitsApplicationColumnList, creditLimitsApplicationDefaultColumnList])


    const buttons = useMemo(
            () => [
                {
                    title: 'Reset Defaults',
                    buttonType: 'outlined-primary',
                    onClick: onClickResetDefaultColumnSelection,
                },
                { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseCustomFieldModal },
                { title: 'Save', buttonType: 'primary', onClick: onClickSaveColumnSelection },
            ],
            [onClickResetDefaultColumnSelection, toggleCustomField, onClickSaveColumnSelection]
    );

    const onSelectLimit = useCallback(
            newLimit => {
                getApplicationList({ page, limit: newLimit });
            },
            [getApplicationList]
    );

    const pageActionClick = useCallback(
            newPage => {
                getApplicationList({ page: newPage, limit });
            },
            [limit, getApplicationList]
    );

    useEffect(async () => {
        await getApplicationList();
        dispatch(getCreditLimitsApplicationColumnList())
    },[])
    return (<>
        <div className="tab-content-header-row">
            <div className="tab-content-header">Application</div>
            {!isLoading && docs &&
            <div className="buttons-row">
                <BigInput
                        ref={searchInputRef} prefix="search" prefixClass="font-placeholder" placeholder="Search here"
                        borderClass="company-profile-policies-search" onKeyUp={checkIfEnterKeyPressed}
                />
                <IconButton
                        buttonType="primary"
                        title="format_line_spacing"
                        onClick={toggleCustomField}
                />
            </div> }
        </div>

            {!isLoading && docs ? (docs.length > 0 ? <>
                    <div className="tab-table-container">
                        <Table
                                align="left"
                                valign="center"
                                tableClass="white-header-table"
                                data={docs}
                                headers={headers}
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
            </> : <div className="no-record-found">No record found</div> ) : <Loader/>}

        {customFieldModal && (
                <CustomFieldModal
                        defaultFields={defaultFields}
                        customFields={customFields}
                        buttons={buttons}
                        onChangeSelectedColumn={onChangeSelectColumn}
                        toggleCustomField={toggleCustomField}
                />
        )}
    </>)
}

export default CreditLimitsApplicationTab;
