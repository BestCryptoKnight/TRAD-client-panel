import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import BigInput from "../../../common/BigInput/BigInput";
import IconButton from "../../../common/IconButton/IconButton";
import Button from "../../../common/Button/Button";
import Table from "../../../common/Table/Table";
import Pagination from "../../../common/Pagination/Pagination";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {
    changeCreditLimitsDocumentsColumnList,
    changeCreditLimitsTaskColumnList,
    getCreditLimitsDocumentsList,
    getCreditLimitsTasksColumnList,
    getCreditLimitsTasksEntityDropDownData,
    getCreditLimitsTasksLists,
    onSaveCreditLimitsTaskColumnList,
    saveCreditLimitsDocumentsColumnList,
    creditLimitsTasksUpdateAddTaskStateFields, updateCreditLimitsTaskData, saveCreditLimitsTaskData
} from "../redux/CreditLimitsAction";
import Checkbox from "../../../common/Checkbox/Checkbox";
import Loader from "../../../common/Loader/Loader";
import {errorNotification} from "../../../common/Toast";
import CustomFieldModal from "../../../common/Modal/CustomFieldModal/CustomFieldModal";
import _ from "lodash";
import {
    CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS,
    CREDIT_LIMITS_TASKS_REDUX_CONSTANTS
} from "../redux/CreditLimitsReduxConstants";
import Modal from "../../../common/Modal/Modal";
import Input from "../../../common/Input/Input";
import ReactSelect from "react-select";
import DatePicker from "react-datepicker";

const priorityData = [
    {value: 'low', label: 'Low', name: 'priority'},
    {value: 'high', label: 'High', name: 'priority'},
    {value: 'urgent', label: 'Urgent', name: 'priority'},
];

const entityTypeData = [
    {value: 'application', label: 'Application', name: 'entityType'},
    {value: 'client', label: 'Client', name: 'entityType'},
    {value: 'debtor', label: 'Debtor', name: 'entityType'},
    // { value: 'claim', label: 'Claim', name: 'entityType' },
    // { value: 'overdue', label: 'Overdue', name: 'entityType' },
];

const CreditLimitsTasksTab = () => {
    const dispatch = useDispatch();
    const {id} = useParams();
    const searchInputRef = useRef();
    const [isCompletedChecked, setIsCompletedChecked] = useState(false);
    const [addTaskModal, setAddTaskModal] = useState(false);
    const [editTaskModal, setEditTaskModal] = useState(false);

    const taskList = useSelector(({creditLimits}) => creditLimits?.tasks?.tasksList ?? {});
    const creditLimitsTaskColumnList = useSelector(({creditLimits}) => creditLimits?.tasks?.tasksColumnList ?? {});
    const creditLimitsTaskDefaultColumnList = useSelector(({creditLimits}) => creditLimits?.tasks?.tasksDefaultColumnList ?? {});
    const { entityType, ...addTaskState }= useSelector(
            ({ creditLimits }) => creditLimits?.task?.addTask ?? {}
    );
    const taskDropDownData = useSelector(
            ({ creditLimits }) => creditLimits?.task?.dropDownData ?? {}
    );
    const loggedUserDetail = useSelector(({ loggedUserProfile }) => loggedUserProfile ?? {});
    const { _id } = useMemo(() => loggedUserDetail, [loggedUserDetail]);
    const {
        total,
        headers,
        pages,
        docs,
        page,
        limit,
        isLoading
    } = useMemo(() => taskList, [taskList]);

    const {defaultFields, customFields} = useMemo(() => creditLimitsTaskColumnList ?? {defaultFields:[],customFields:[]},[creditLimitsTaskColumnList])
    const { assigneeList, entityList, defaultEntityList } = useMemo(() => taskDropDownData, [
        taskDropDownData,
    ]);

    const [deleteTaskData, setDeleteTaskData] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const toggleConfirmationModal = useCallback(
            value => setShowConfirmModal(value !== undefined ? value : e => !e),
            [setShowConfirmModal]
    );

    const deleteTask = useCallback(
            data => {
                setDeleteTaskData(data);
                setShowConfirmModal(true);
            },
            [showConfirmModal, setDeleteTaskData]
    );

    const deleteTaskColumn = useMemo(
            () => [
                data => (
                        <span
                                className="material-icons-round font-danger cursor-pointer"
                                onClick={e => {
                                    e.stopPropagation();
                                    deleteTask(data);
                                }}
                        >
          delete_outline
        </span>
                ),
            ],
            [deleteTask]
    );

    const updateAddTaskState = useCallback((name, value) => {
        dispatch(creditLimitsTasksUpdateAddTaskStateFields(name, value));
    }, []);

    const getSelectedValues = useCallback(
            fieldFor => {
                switch (fieldFor) {
                    case 'assigneeId': {
                        return addTaskState?.assigneeId || {};
                    }
                    case 'priority': {
                        return addTaskState?.priority || {};
                    }
                    case 'entityType': {
                        return entityType || {};
                    }
                    case 'entityId': {
                        return addTaskState?.entityId || {};
                    }
                    default:
                        return {};
                }
            },
            [addTaskState, assigneeList, priorityData, entityList, entityTypeData]
    );

    const handleTextInputChange = useCallback(
            e => {
                const { name, value } = e.target;
                updateAddTaskState(name, value);
            },
            [updateAddTaskState]
    );

    const handleSelectInputChange = useCallback(
            data => {
                updateAddTaskState(data?.name, data);
                if (data?.name === 'entityType') {
                    dispatch(getCreditLimitsTasksEntityDropDownData({ entityName: data?.value }));
                    updateAddTaskState('entityId', []);
                }
            },
            [updateAddTaskState]
    );

    const handleDateChange = useCallback(
            (name, value) => {
                updateAddTaskState(name, value);
            },
            [updateAddTaskState]
    );

    const INPUTS = useMemo(
            () => [
                {
                    label: 'Title',
                    placeholder: 'Enter title',
                    type: 'text',
                    name: 'title',
                    data: [],
                },
                {
                    label: 'Assignee',
                    placeholder: 'Select Assignee',
                    type: 'select',
                    name: 'assigneeId',
                    data: assigneeList,
                },
                {
                    label: 'Priority',
                    placeholder: 'Select Priority',
                    type: 'select',
                    name: 'priority',
                    data: priorityData,
                },
                {
                    label: 'Due Date',
                    placeholder: 'Select Date',
                    type: 'date',
                    name: 'dueDate',
                    data: [],
                },
                {
                    label: 'Task For',
                    placeholder: 'Select Task For',
                    type: 'select',
                    name: 'entityType',
                    data: entityTypeData,
                },
                {
                    type: 'blank',
                },
                {
                    label: 'Entity Labels',
                    placeholder: 'Select Entity',
                    type: 'select',
                    name: 'entityId',
                    data: entityList,
                },
                {
                    type: 'blank',
                },
                {
                    label: 'Description',
                    placeholder: 'Enter Description',
                    type: 'text',
                    name: 'description',
                },
            ],
            [assigneeList, entityList, addTaskState, priorityData, entityTypeData]
    );

    const getComponentFromType = useCallback(
            input => {
                let component = null;
                const selectedValues = getSelectedValues(input.name);
                switch (input.type) {
                    case 'text':
                        component = (
                                <>
                                    <span>{input.label}</span>
                                    <Input
                                            type="text"
                                            name={input.name}
                                            placeholder={input.placeholder}
                                            value={addTaskState[input.name]}
                                            onChange={handleTextInputChange}
                                    />
                                </>
                        );
                        break;

                    case 'select': {
                        const handleOnChange = handleSelectInputChange;
                        component = (
                                <>
                                    <span>{input.label}</span>
                                    <ReactSelect
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            placeholder={input.placeholder}
                                            name={input.name}
                                            options={input.data}
                                            isSearchable={false}
                                            value={selectedValues}
                                            onChange={handleOnChange}
                                    />
                                </>
                        );
                        break;
                    }
                    case 'date':
                        component = (
                                <>
                                    <span>{input.label}</span>
                                    <div className="date-picker-container">
                                        <DatePicker
                                                dateFormat="dd/MM/yyyy"
                                                showMonthDropdown
                                                showYearDropdown
                                                scrollableYearDropdown
                                                placeholderText={input.placeholder}
                                                value={
                                                    addTaskState[input.name]
                                                            ? new Date(addTaskState[input.name]).toLocaleDateString()
                                                            : new Date().toLocaleDateString()
                                                }
                                                onChange={date => handleDateChange(input.name, new Date(date).toISOString())}
                                                minDate={new Date()}
                                        />
                                        <span className="material-icons-round">event_available</span>
                                    </div>
                                </>
                        );
                        break;
                    case 'blank': {
                        component = (
                                <>
                                    <div />
                                    <div />
                                </>
                        );
                        break;
                    }
                    default:
                        return null;
                }
                return <>{component}</>;
            },
            [INPUTS, addTaskState, updateAddTaskState, entityList]
    );


    const toggleAddTaskModal = useCallback(
            value => setAddTaskModal(value !== undefined ? value : e => !e),
            [setAddTaskModal]
    );

    const toggleEditTaskModal = useCallback(
            value => setEditTaskModal(value !== undefined ? value : e => !e),
            [setEditTaskModal]
    );

    const onCloseAddTask = useCallback(() => {
        dispatch({
            type: CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.ADD_TASK.CREDIT_LIMITS_RESET_ADD_TASK_STATE,
        });
        toggleAddTaskModal();
    }, [toggleAddTaskModal]);

    const getTasksList = useCallback(async (params = {}, cb) => {
        const data = {
            page: page ?? 1,
            limit: limit ?? 15,
            ...params
        };
        dispatch(getCreditLimitsTasksLists(id, data));
        if (cb && typeof cb==='function') {
            cb();
        }
    }, [page, limit]);

    const callBackOnTaskAdd = useCallback(async () => {
        toggleAddTaskModal();
        await getTasksList();
    }, [toggleAddTaskModal, getTasksList]);

    const callBackOnTaskEdit = useCallback(async () => {
        toggleEditTaskModal();
        await getTasksList();
    }, [toggleEditTaskModal, getTasksList]);

    const onSaveTask = useCallback(() => {
        const data = {
            title: addTaskState?.title?.trim(),
            // priority: addTaskState?.priority[0]?.value,
            dueDate: addTaskState?.dueDate || new Date().toISOString(),
            assigneeId: addTaskState?.assigneeId?.value,
            taskFrom: 'debtor-task',
            priority: addTaskState?.priority?.value ?? undefined,
            entityType: entityType?.value ?? undefined,
            entityId: addTaskState?.entityId?.value ?? undefined,
            description: addTaskState?.description?.trim() ?? undefined,
        };

        if (!data?.title && data?.title?.length === 0) {
            errorNotification('Please add title');
        } else {
            try {
                if (editTaskModal) {
                    dispatch(updateCreditLimitsTaskData(addTaskState?._id, data, callBackOnTaskEdit));
                } else {
                    dispatch(saveCreditLimitsTaskData(data, callBackOnTaskAdd));
                }
            } catch (e) {
                errorNotification('Something went wrong please add again');
            }
        }
    }, [addTaskState, toggleAddTaskModal, callBackOnTaskAdd, callBackOnTaskEdit]);

    const onCloseEditTask = useCallback(() => {
        dispatch({
            type: CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.ADD_TASK.CREDIT_LIMITS_RESET_ADD_TASK_STATE,
        });
        toggleEditTaskModal();
    }, [toggleEditTaskModal]);

    const addTaskModalButton = useMemo(
            () => [
                { title: 'Close', buttonType: 'primary-1', onClick: onCloseAddTask },
                { title: 'Add', buttonType: 'primary', onClick: onSaveTask },
            ],
            [onCloseAddTask, onSaveTask]
    );

    const editTaskModalButton = useMemo(
            () => [
                { title: 'Close', buttonType: 'primary-1', onClick: onCloseEditTask },
                { title: 'Save', buttonType: 'primary', onClick: onSaveTask },
            ],
            [onCloseAddTask, onSaveTask]
    );

    const setDefaultValuesForAddTask = useCallback(() => {
        dispatch(
                creditLimitsTasksUpdateAddTaskStateFields(
                        'assigneeId',
                        assigneeList?.find(e => e.value === _id)
                )
        );
        dispatch(
                creditLimitsTasksUpdateAddTaskStateFields(
                        'entityId',
                        entityList?.find(e => e.value === id)
                )
        );
        dispatch(
                creditLimitsTasksUpdateAddTaskStateFields(
                        'entityType',
                        entityTypeData?.find(e => e.value === 'debtor')
                )
        );
    }, [assigneeList, defaultEntityList, entityTypeData, entityList]);

    const onClickAddTask = useCallback(() => {
        setDefaultValuesForAddTask();
        toggleAddTaskModal();
    }, [setDefaultValuesForAddTask, toggleAddTaskModal]);

    const checkIfEnterKeyPressed = e => {
        const searchKeyword = searchInputRef.current.value;
        if (searchKeyword.trim().toString().length===0 && e.key!=='Enter') {
            getTasksList();
        } else if (e.key==='Enter') {
            if (searchKeyword.trim().toString().length!==0) {
                getTasksList({search: searchKeyword.trim().toString()});
            } else {
                errorNotification('Please enter any value than press enter');
            }
        }
    };

    const [customFieldModal, setCustomFieldModal] = React.useState(false);

    const toggleCustomFieldModal = useCallback(
            value => setCustomFieldModal(value !== undefined ? value : e => !e),
            [setCustomFieldModal]
    );

    const onChangeSelectedColumn = useCallback((type, name, value) => {
                const data = { type, name, value };
                dispatch(changeCreditLimitsTaskColumnList(data));
            },
            []
    );

    const onClickResetDefaultColumnSelection = useCallback(async () => {
        await dispatch(onSaveCreditLimitsTaskColumnList({ isReset: true }));
        dispatch(getCreditLimitsTasksColumnList());
        toggleCustomFieldModal();
        await getTasksList();
    }, [dispatch, toggleCustomFieldModal]);

    const onClickCloseCustomFieldModal = useCallback(() => {
        dispatch({
            type: CREDIT_LIMITS_TASKS_REDUX_CONSTANTS.CREDIT_LIMITS_TASK_COLUMN_LIST,
            data: creditLimitsTaskDefaultColumnList
        });
        toggleCustomFieldModal();
    },[creditLimitsTaskDefaultColumnList, toggleCustomFieldModal]);

    const onClickSaveColumnSelection = useCallback(async() => {
        try {
            const isBothEqual = _.isEqual(creditLimitsTaskColumnList, creditLimitsTaskDefaultColumnList);
            if(!isBothEqual) {
                await dispatch(onSaveCreditLimitsTaskColumnList({ creditLimitsTaskColumnList }));
                await getTasksList();
                toggleCustomFieldModal();
            } else {
                errorNotification('Please select different columns to apply changes.');
            }
        } catch (e) {
            /**/
        }
    },[getTasksList, toggleCustomFieldModal, creditLimitsTaskColumnList, creditLimitsTaskDefaultColumnList]);

    const customFieldModalButtons = useMemo(
            () => [
                {
                    title: 'Reset Defaults',
                    buttonType: 'outlined-primary',
                    onClick: onClickResetDefaultColumnSelection,
                },
                { title: 'Close', buttonType: 'primary-1', onClick: onClickCloseCustomFieldModal},
                { title: 'Save', buttonType: 'primary', onClick: onClickSaveColumnSelection },
            ],
            [onClickResetDefaultColumnSelection, toggleCustomFieldModal, onClickCloseCustomFieldModal, onClickSaveColumnSelection]
    );

    useEffect(async () => {
        await getTasksList();
        dispatch(getCreditLimitsTasksColumnList());
        dispatch(getCreditLimitsTasksEntityDropDownData({ entityName: 'debtor' }));
    }, []);

    return (<>
        <div className="tab-content-header-row">
            <div className="tab-content-header">Tasks</div>

            <div className="buttons-row">
                <BigInput ref={searchInputRef}
                          prefix="search" prefixClass="font-placeholder" placeholder="Search here"
                          borderClass="tab-search mr-15" onKeyUp={checkIfEnterKeyPressed}
                />
                <Checkbox
                        title="Show Completed"
                        checked={isCompletedChecked}
                        onChange={() => setIsCompletedChecked(!isCompletedChecked)}
                />
                <IconButton
                        buttonType="primary"
                        title="format_line_spacing"
                        onClick={toggleCustomFieldModal}
                />
                <Button buttonType="success" title="Add" onClick={onClickAddTask}/>
            </div>
        </div>
        {!isLoading && docs ? (docs.length > 0 ? <>
            <div className="tab-table-container">
                <Table
                        align="left"
                        valign="center"
                        tableClass="white-header-table"
                        docs={docs}
                        headers={headers}
                />
            </div>
            <Pagination
                    className="common-list-pagination"
            /></>:<div className="no-record-found">No record found</div>):<Loader/>
        }

        {customFieldModal && (
                <CustomFieldModal
                        defaultFields={defaultFields}
                        customFields={customFields}
                        onChangeSelectedColumn={onChangeSelectedColumn}
                        buttons={customFieldModalButtons}
                        toggleCustomField={toggleCustomFieldModal}
                />
        )}

        {addTaskModal && (
                <Modal
                        header="Add Task"
                        className="add-task-modal"
                        buttons={addTaskModalButton}
                        hideModal={toggleAddTaskModal}
                >
                    <div className="common-white-container my-work-add-task-container">
                        {INPUTS.map(getComponentFromType)}
                    </div>
                </Modal>
        )}

        {editTaskModal && (
                <Modal
                        header="Edit Task"
                        className="add-task-modal"
                        buttons={editTaskModalButton}
                        hideModal={toggleEditTaskModal}
                >
                    <div className="common-white-container my-work-add-task-container">
                        {INPUTS.map(getComponentFromType)}
                    </div>
                </Modal>
        )}

    </>)
}

export default CreditLimitsTasksTab
