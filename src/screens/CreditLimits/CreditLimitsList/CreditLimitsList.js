import React, {useCallback, useEffect, useMemo, useReducer, useState} from 'react';
import './CreditLimitsList.scss';
import {useDispatch, useSelector} from "react-redux";
import IconButton from "../../../common/IconButton/IconButton";
import Table from "../../../common/Table/Table";
import Pagination from "../../../common/Pagination/Pagination";
import Loader from "../../../common/Loader/Loader";
import {
    changeCreditColumnList,
    getCreditLimitColumnList, getCreditLimitsFilter,
    getCreditLimitsList,
    saveCreditLimitColumnList
} from "../redux/CreditLimitsAction";
import CustomFieldModal from "../../../common/Modal/CustomFieldModal/CustomFieldModal";
import _ from "lodash";
import {errorNotification} from "../../../common/Toast";
import {useQueryParams} from "../../../hooks/GetQueryParamHook";
import Modal from "../../../common/Modal/Modal";
import ReactSelect from "react-select";
import {useHistory} from "react-router-dom";
import {CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS} from "../redux/CreditLimitsReduxConstants";

const CreditLimitsList = () => {
    const dispatch = useDispatch();
    const history = useHistory();
   const creditLimitListWithPageData = useSelector(({creditLimits}) => creditLimits?.creditLimitList ?? {});
    const {total, pages, page, limit, docs, headers, isLoading} = useMemo(() => creditLimitListWithPageData, [
        creditLimitListWithPageData,
    ]);
   const creditLimitsColumnList = useSelector(({creditLimits}) => creditLimits?.creditLimitsColumnList ?? {});
   const creditLimitsDefaultColumnList = useSelector(({creditLimits}) => creditLimits?.creditLimitsDefaultColumnList ?? {});
   const dropdownData  = useSelector(({creditLimits}) => creditLimits?.creditLimitsFilterList?.dropdownData ?? {});
    const CREDIT_LIMITS_FILTER_REDUCER_ACTIONS = {
        UPDATE_DATA: 'UPDATE_DATA',
        RESET_STATE: 'RESET_STATE',
    };

    const initialFilterState = {
        entityType: ''
    };

    const [filter, dispatchFilter] = useReducer(filterReducer, initialFilterState);

    const {entity} = useMemo(() => filter ?? {},[filter]);

    useEffect(()=> dispatch(getCreditLimitsFilter()),[])

    const entityTypeSelectedValue = useMemo(() => {
        const foundValue = dropdownData?.entityType?.find(e => {
            return (e?.value ?? '') === entity;
        });
        return foundValue ?? [];
    }, [entity, dropdownData]);

    function filterReducer(state = initialFilterState, action) {
        switch (action.type) {
            case CREDIT_LIMITS_FILTER_REDUCER_ACTIONS.UPDATE_DATA:
                return {
                    ...state,
                    [`${action?.name}`]: action?.value,
                };
            case CREDIT_LIMITS_FILTER_REDUCER_ACTIONS.RESET_STATE:
                return { ...initialFilterState };
            default:
                return state;
        }
    }

    const {
        page: paramPage,
        limit: paramLimit,
        entityType: paramEntity
    } = useQueryParams()

    const {defaultFields, customFields} = useMemo(() => creditLimitsColumnList || {defaultFields: [], customFields: []}, [creditLimitsColumnList])
    const [customFieldModal, setCustomFieldModal] = useState(false);
    const toggleCustomField = useCallback(
            value => setCustomFieldModal(value!==undefined ? value:e => !e),
            [setCustomFieldModal]
    );

    const getCreditLimitListByFilter = useCallback(
            async (params = {}, cb) => {
                const data = {
                    page: page ?? 1,
                    limit: limit ?? 15,
                    entityType: (entity?.trim()?.length ?? -1) > 0 ? entity : undefined,
                    ...params
                }
                try {
                    await dispatch(getCreditLimitsList(data));
                    if(cb && typeof cb === 'function') {
                        cb();
                    }
                } catch (e) {/**/}
            }, [page, limit, entity]
    )

    const onClickResetDefaultColumnSelection = useCallback(async () => {
        await dispatch(saveCreditLimitColumnList({isReset: true}));
        dispatchFilter(getCreditLimitColumnList());
        toggleCustomField();
        await getCreditLimitListByFilter();
    },[toggleCustomField, getCreditLimitListByFilter]);

    const onClickSaveColumnSelection = useCallback(async () => {
        try {
            const isBothEqual = _.isEqual(creditLimitsColumnList, creditLimitsDefaultColumnList);
            if (!isBothEqual) {
                await dispatch(saveCreditLimitColumnList({creditLimitsColumnList}));
                await getCreditLimitListByFilter();
                toggleCustomField();
            } else {
                errorNotification('Please select different columns to apply changes.');
            }
        } catch (e) {
            console.log(e);
            /**/
        }
    },[toggleCustomField, getCreditLimitListByFilter, creditLimitsColumnList, creditLimitsDefaultColumnList])

    const onClickCloseCustomFieldModal = useCallback(() => {
        dispatch({
            type: CREDIT_LIMITS_COLUMN_LIST_REDUX_CONSTANTS.CREDIT_LIMITS_COLUMN_LIST_ACTION,
            data: creditLimitsDefaultColumnList
        });
        toggleCustomField();
    },[creditLimitsDefaultColumnList, toggleCustomField])

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

    useEffect(async () => {
        const params = {
            page: paramPage ?? page ?? 1,
            limit: paramLimit ?? limit ?? 15
        };
        const filters = {
            entityType: (paramEntity?.trim()?.length ?? -1) > 0 ? paramEntity : undefined
        };
        Object.entries(filters)?.forEach(([name, value]) => {
            dispatchFilter({
                type: CREDIT_LIMITS_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
                name,
                value
            })
        });
       await getCreditLimitListByFilter({...params, ...filters});
        dispatch(getCreditLimitColumnList())
    },[])

    const onChangeSelectedColumn = useCallback((type,name, value) => {
        const data = {type, name, value}
    dispatch(changeCreditColumnList(data))}, [dispatch])

    // for params in url
    useEffect(() => {
        const params = {
            page: page ?? 1,
            limit: limit ?? 15,
            entityType: (entity?.trim()?.length ?? -1) > 0 ? entity : undefined,
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
        limit,
        entity]);

    const [filterModal, setFilterModal] = React.useState(false);
    const toggleFilterModal = useCallback(
            value => setFilterModal(value !== undefined ? value : e => !e),
            [setFilterModal]
    );
    const onClickApplyFilter = useCallback(() => {
        getCreditLimitListByFilter({page, limit}, toggleFilterModal);
    },[getCreditLimitListByFilter, page, limit, toggleFilterModal]);

    const onClickResetFilter = useCallback(() => {
        dispatchFilter({
            type: CREDIT_LIMITS_FILTER_REDUCER_ACTIONS.RESET_STATE
        })
        onClickApplyFilter();
    },[dispatchFilter]);

    const filterModalButtons = useMemo(
            () => [
                {
                    title: 'Reset Defaults',
                    buttonType: 'outlined-primary',
                    onClick: onClickResetFilter,
                },
                { title: 'Close', buttonType: 'primary-1', onClick: () => toggleFilterModal() },
                { title: 'Apply', buttonType: 'primary', onClick: onClickApplyFilter },
            ],
            [toggleFilterModal, onClickApplyFilter, onClickResetFilter]
    );

            // on record limit changed
    const onSelectLimit = useCallback(
            newLimit => {
                getCreditLimitListByFilter({ page: 1, limit: newLimit });
            },
            [getCreditLimitListByFilter]
    );

    // on pagination changed
    const pageActionClick = useCallback(
            newPage => {
                getCreditLimitListByFilter({ page: newPage, limit });
            },
            [getCreditLimitListByFilter, limit]
    );

    const handleEntityTypeFilterChange = useCallback(
            event => {
                dispatchFilter({
                    type: CREDIT_LIMITS_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
                    name: 'entity',
                    value: event?.value
                })},[dispatchFilter]);

    const onSelectCreditLimitRecord = useCallback(
            id => {
               history.push(`credit-limits/details/${id}`)
            },
            [history]
    );

    return <>
        <div className="page-header">
            <div className="page-header-name">Credit Limit List</div>
            {!isLoading && docs && (<div className="page-header-button-container">
                        <IconButton
                                buttonType="secondary"
                                title="filter_list"
                                className="mr-10"
                                buttonTitle="Click to apply filters on credit limit list"
                                onClick={() => toggleFilterModal()}
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
        {!isLoading && docs ? (
                    docs.length > 0 ? (<>
                              <div className="common-list-container">
                                <Table
                                        align="left"
                                        valign="center"
                                        tableClass="main-list-table"
                                        data={docs}
                                        headers={headers}
                                        recordSelected={onSelectCreditLimitRecord}
                                        recordActionClick={() => {}}
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
                            </>
                    ):(<div className="no-record-found">No record found</div>)
        ):(
                <Loader/>
        )}

        {filterModal && (
                <Modal
                        headerIcon="filter_list"
                        header="filter"
                        buttons={filterModalButtons}
                        className="filter-modal application-filter-modal"
                >
                    <div className="filter-modal-row">
                        <div className="form-title">Entity Type</div>
                        <ReactSelect
                                className="filter-select react-select-container"
                                classNamePrefix="react-select"
                                placeholder="Select Entity Type"
                                name="role"
                                options={dropdownData?.entityType}
                                value={entityTypeSelectedValue}
                                onChange={handleEntityTypeFilterChange}
                                isSearchble
                        />
                    </div>
                </Modal>)}

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

export default CreditLimitsList;
