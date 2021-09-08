import React, {useCallback, useEffect, useMemo, useReducer, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';
import BigInput from '../../../common/BigInput/BigInput';
import IconButton from '../../../common/IconButton/IconButton';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import {
    changeCreditLimitsDocumentsColumnList,
    creditLimitsUploadDocument,
    deleteCreditLimitsDocumentAction,
    downloadCreditLimitsDocuments,
    getCreditLimitsDocumentsColumnNamesList,
    getCreditLimitsDocumentsList,
    getCreditLimitsDocumentTypeList,
    saveCreditLimitsDocumentsColumnList,
} from '../redux/CreditLimitsAction';
import Loader from '../../../common/Loader/Loader';
import CustomFieldModal from '../../../common/Modal/CustomFieldModal/CustomFieldModal';
import {CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS} from '../redux/CreditLimitsReduxConstants';
import {errorNotification} from '../../../common/Toast';
import Modal from '../../../common/Modal/Modal';
import FileUpload from '../../../common/Header/component/FileUpload';
import Input from '../../../common/Input/Input';
import {downloadAll} from '../../../helpers/DownloadHelper';

const CreditLimitsDocumentsTab = props => {
    const {id} = props;
    const initialCreditLimitsDocumentState = {
        description: '',
        fileData: '',
        isPublic: false,
        documentType: [],
    };

    const CREDIT_LIMITS_DOCUMENT_REDUCER_ACTIONS = {
        UPDATE_DATA: 'UPDATE_DATA',
        UPDATE_SINGLE_DATA: 'UPDATE_SINGLE_DATA',
        RESET_STATE: 'RESET_STATE',
    };

    function creditLimitsDocumentReducer(state, action) {
        switch (action.type) {
            case CREDIT_LIMITS_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA:
                return {
                    ...state,
                    [`${action.name}`]: action.value,
                };
            case CREDIT_LIMITS_DOCUMENT_REDUCER_ACTIONS.UPDATE_DATA:
                return {
                    ...state,
                    ...action.data,
                };
            case CREDIT_LIMITS_DOCUMENT_REDUCER_ACTIONS.RESET_STATE:
                return {...initialCreditLimitsDocumentState};
            default:
                return state;
        }
    }

    const dispatch = useDispatch();
    const searchInputRef = useRef();
    const [uploadModal, setUploadModal] = useState(false);
    const [selectedCheckBoxData, setSelectedCheckBoxData] = useState([]);
    const [fileData, setFileData] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const toggleConfirmationModal = useCallback(
        value => setShowConfirmModal(value !== undefined ? value : e => !e),
        [setShowConfirmModal]
    );
    const [deleteDocumentData, setDeleteDocumentData] = useState('');
    const [customFieldModal, setCustomFieldModal] = React.useState(false);
    const [fileExtensionErrorMessage, setFileExtensionErrorMessage] = useState(false);

    const [selectedCreditLimitsDocument, dispatchSelectedCreditLimitsDocument] = useReducer(
        creditLimitsDocumentReducer,
        initialCreditLimitsDocumentState
    );
    const {documentType, description} = useMemo(
        () => selectedCreditLimitsDocument,
        [selectedCreditLimitsDocument]
    );
    const documentList = useSelector(
        ({creditLimits}) => creditLimits?.documents?.documentList ?? {}
    );
    const creditLimitsDocumentColumnList = useSelector(
        ({creditLimits}) => creditLimits?.documents?.documentColumnList ?? {}
    );
    const creditLimitsDefaultDocumentColumnList = useSelector(
        ({creditLimits}) => creditLimits?.documents?.documentDefaultColumnList ?? {}
    );
    const documentTypeList = useSelector(
        ({creditLimits}) => creditLimits?.documents?.documentTypeList ?? []
    );

    const {total, headers, pages, docs, page, limit, isLoading} = useMemo(
        () => documentList,
        [documentList]
    );

    const {
        CreditLimitDocumentsColumnSaveButtonLoaderAction,
        CreditLimitDocumentsColumnResetButtonLoaderAction,
        CreditLimitDocumentUploadButtonLoaderAction,
        CreditLimitDocumentDeleteButtonLoaderAction,
        CreditLimitDocumentDownloadButtonLoaderAction,
    } = useSelector(({generalLoaderReducer}) => generalLoaderReducer ?? false);

    const {defaultFields, customFields} = useMemo(
        () => creditLimitsDocumentColumnList ?? {defaultFields: [], customFields: []},
        [creditLimitsDocumentColumnList]
    );
    const getDocumentList = useCallback(
        (params = {}, cb) => {
            const data = {
                page: page ?? 1,
                limit: limit ?? 15,
                ...params,
            };
            dispatch(getCreditLimitsDocumentsList(id, data));
            if (cb && typeof cb === 'function') {
                cb();
            }
        },
        [page, limit]
    );

    const checkIfEnterKeyPressed = e => {
        const searchKeyword = searchInputRef.current.value;
        if (searchKeyword.trim().toString().length === 0 && e.key !== 'Enter') {
            getDocumentList();
        } else if (e.key === 'Enter') {
            if (searchKeyword.trim().toString().length !== 0) {
                getDocumentList({search: searchKeyword.trim().toString()});
            } else {
                errorNotification('Please enter search text to search');
            }
        }
    };

    const documentTypeOptions = useMemo(() => {
        const finalData = documentTypeList || [];
        return finalData?.map(e => ({
            name: 'documentType',
            label: e?.documentTitle,
            value: e?._id,
        }));
    }, [documentTypeList]);

    const toggleUploadModal = useCallback(
        value => setUploadModal(value !== undefined ? value : e => !e),
        [setUploadModal]
    );

    const toggleCustomFieldModal = useCallback(
        value => setCustomFieldModal(value !== undefined ? value : e => !e),
        [setCustomFieldModal]
    );

    const onChangeSelectedColumn = useCallback(
        (type, name, value) => {
            const data = {type, name, value};
            dispatch(changeCreditLimitsDocumentsColumnList(data));
        },
        [dispatch]
    );

    const onClickResetDefaultColumnSelection = useCallback(async () => {
        await dispatch(saveCreditLimitsDocumentsColumnList({isReset: true}));
        dispatch(getCreditLimitsDocumentsList(id));
        toggleCustomFieldModal();
    }, [dispatch, toggleCustomFieldModal]);

    const onClickCloseCustomFieldModal = useCallback(() => {
        dispatch({
            type: CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.CREDIT_LIMITS_DOCUMENTS_COLUMN_LIST,
            data: creditLimitsDefaultDocumentColumnList,
        });
        toggleCustomFieldModal();
    }, [creditLimitsDefaultDocumentColumnList, toggleCustomFieldModal]);

    const onClickSaveColumnSelection = useCallback(async () => {
        try {
            const isBothEqual = _.isEqual(
                creditLimitsDocumentColumnList,
                creditLimitsDefaultDocumentColumnList
            );
            if (!isBothEqual) {
                await dispatch(saveCreditLimitsDocumentsColumnList({creditLimitsDocumentColumnList}));
                await getDocumentList();
                toggleCustomFieldModal();
            } else {
                errorNotification('Please select different columns to apply changes.');
            }
        } catch (e) {
            /**/
        }
    }, [
        toggleCustomFieldModal,
        getCreditLimitsDocumentsColumnNamesList,
        creditLimitsDocumentColumnList,
        creditLimitsDefaultDocumentColumnList,
    ]);

    const buttons = useMemo(
        () => [
            {
                title: 'Reset Defaults',
                buttonType: 'outlined-primary',
                onClick: onClickResetDefaultColumnSelection,
                isLoading: CreditLimitDocumentsColumnResetButtonLoaderAction,
            },
            {title: 'Close', buttonType: 'primary-1', onClick: onClickCloseCustomFieldModal},
            {
                title: 'Save',
                buttonType: 'primary',
                onClick: onClickSaveColumnSelection,
                isLoading: CreditLimitDocumentsColumnSaveButtonLoaderAction,
            },
        ],
        [
            onClickResetDefaultColumnSelection,
            toggleCustomFieldModal,
            onClickCloseCustomFieldModal,
            onClickSaveColumnSelection,
            CreditLimitDocumentsColumnResetButtonLoaderAction,
            CreditLimitDocumentsColumnSaveButtonLoaderAction,
        ]
    );

    const onchangeDocumentDescription = useCallback(e => {
        dispatchSelectedCreditLimitsDocument({
            type: CREDIT_LIMITS_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
            name: e.target.name,
            value: e.target.value,
        });
    }, []);

    const onClickUploadDocument = useCallback(async () => {
        setFileExtensionErrorMessage(false);
        if (selectedCreditLimitsDocument?.documentType?.length <= 0) {
            errorNotification('Please select document type');
        } else if (!selectedCreditLimitsDocument?.description) {
            errorNotification('Description is required');
        } else if (!fileData) {
            errorNotification('Select document to upload');
        } else {
            const formData = new FormData();
            formData.append('description', selectedCreditLimitsDocument?.description);
            formData.append('isPublic', selectedCreditLimitsDocument?.isPublic);
            formData.append('documentType', selectedCreditLimitsDocument?.documentType.value);
            formData.append('document', fileData);
            formData.append('entityId', id);
            formData.append('documentFor', 'debtor');
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            };
            await dispatch(creditLimitsUploadDocument(formData, config));
            dispatchSelectedCreditLimitsDocument({
                type: CREDIT_LIMITS_DOCUMENT_REDUCER_ACTIONS.RESET_STATE,
            });
            getDocumentList();
            setFileData('');
            toggleUploadModal();
        }
    }, [
        selectedCreditLimitsDocument,
        fileData,
        dispatchSelectedCreditLimitsDocument,
        toggleUploadModal,
        id,
        setFileData,
    ]);

    const onUploadClick = useCallback(
        e => {
            // e.persist();
            if (e.target.files && e.target.files.length > 0) {
                const fileExtension = [
                    'jpeg',
                    'jpg',
                    'png',
                    'bmp',
                    'gif',
                    'tex',
                    'xls',
                    'xlsx',
                    'csv',
                    'doc',
                    'docx',
                    'odt',
                    'txt',
                    'pdf',
                    'png',
                    'pptx',
                    'ppt',
                    'rtf',
                ];
                const mimeType = [
                    'image/jpeg',
                    'image/png',
                    'application/pdf',
                    'image/bmp',
                    'image/gif',
                    'application/x-tex',
                    'application/vnd.ms-excel',
                    'text/csv',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.oasis.opendocument.text',
                    'text/plain',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'application/vnd.ms-powerpoint',
                    'application/rtf',
                ];
                const checkExtension =
                    fileExtension.indexOf(e.target.files[0].name.split('.').splice(-1)[0]) !== -1;
                const checkMimeTypes = mimeType.indexOf(e.target.files[0].type) !== -1;
                // const checkFileSize = e.target.files[0].size > 4194304;

                const checkFileSize = e.target.files[0].size > 10485760;
                if (!(checkExtension || checkMimeTypes)) {
                    setFileExtensionErrorMessage(true);
                } else if (checkFileSize) {
                    setFileExtensionErrorMessage(false);
                    errorNotification('File size should be less than 10MB.');
                } else {
                    setFileExtensionErrorMessage(false);
                    setFileData(e.target.files[0]);
                }
            }
        },
        [setFileData]
    );

    const onCloseUploadDocumentButton = useCallback(() => {
        setFileExtensionErrorMessage(false);
        dispatchSelectedCreditLimitsDocument({
            type: CREDIT_LIMITS_DOCUMENT_REDUCER_ACTIONS.RESET_STATE,
        });
        setFileData('');
        toggleUploadModal();
    }, [toggleUploadModal, dispatchSelectedCreditLimitsDocument, setFileData]);

    const uploadDocumentButton = useMemo(
        () => [
            {title: 'Close', buttonType: 'primary-1', onClick: onCloseUploadDocumentButton},
            {
                title: 'Upload',
                buttonType: 'primary',
                onClick: onClickUploadDocument,
                isLoading: CreditLimitDocumentUploadButtonLoaderAction,
            },
        ],
        [
            onCloseUploadDocumentButton,
            onClickUploadDocument,
            CreditLimitDocumentUploadButtonLoaderAction,
        ]
    );

    const handleDocumentChange = useCallback(
        newValue => {
            dispatchSelectedCreditLimitsDocument({
                type: CREDIT_LIMITS_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
                name: newValue.name,
                value: newValue,
            });
        },
        [getCreditLimitsDocumentsList]
    );

    const onClickDownloadButton = useCallback(async () => {
        if (documentList?.docs?.length !== 0) {
            if (selectedCheckBoxData?.length !== 0) {
                const docsToDownload = selectedCheckBoxData?.map(e => e.id);
                const res = await downloadCreditLimitsDocuments(docsToDownload);
                downloadAll(res);
            } else {
                errorNotification('Please select at least one document to download');
            }
        } else {
            errorNotification('You have no documents to download');
        }
    }, [documentList, selectedCheckBoxData]);

    // on record limit changed
    const onSelectLimit = useCallback(
        newLimit => {
            getDocumentList({page: 1, limit: newLimit});
        },
        [getDocumentList]
    );

    // on pagination changed
    const pageActionClick = useCallback(
        newPage => {
            getDocumentList({page: newPage, limit});
        },
        [getDocumentList, limit]
    );

    const deleteDocument = useCallback(
        data => {
            setDeleteDocumentData(data);
            setShowConfirmModal(true);
        },
        [showConfirmModal]
    );

    const deleteDocumentAction = useMemo(
        () => [
            data => (
                <span
                    className="material-icons-round font-danger cursor-pointer"
                    onClick={() => deleteDocument(data)}
                >
          delete_outline
        </span>
            ),
        ],
        [deleteDocument]
    );
    const callBack = () => {
        toggleConfirmationModal();
        getDocumentList();
    };

    const deleteDocumentButtons = useMemo(
        () => [
            {title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal()},
            {
                title: 'Delete',
                buttonType: 'danger',
                onClick: async () => {
                    try {
                        await dispatch(
                            deleteCreditLimitsDocumentAction(deleteDocumentData?.id, () => callBack())
                        );
                    } catch (e) {
                        /**/
                    }
                },
                isLoading: CreditLimitDocumentDeleteButtonLoaderAction,
            },
        ],
        [toggleConfirmationModal, deleteDocumentData, CreditLimitDocumentDeleteButtonLoaderAction]
    );

    useEffect(() => {
        getDocumentList();
        dispatch(getCreditLimitsDocumentsColumnNamesList());
        dispatch(getCreditLimitsDocumentTypeList());
    }, [getDocumentList]);

    return (
        <>
            <div className="tab-content-header-row">
                <div className="tab-content-header">Documents</div>
                {!isLoading && (
                    <div className="buttons-row">
                        <BigInput
                            ref={searchInputRef}
                            prefix="search"
                            prefixClass="font-placeholder"
                            placeholder="Search here"
                            borderClass="tab-search mr-15"
                            onKeyUp={checkIfEnterKeyPressed}
                        />
                        <IconButton
                            buttonType="primary"
                            title="format_line_spacing"
                            onClick={toggleCustomFieldModal}
                        />
                        <IconButton buttonType="primary" title="cloud_upload" onClick={toggleUploadModal}/>
                        <IconButton
                            buttonType="primary-1"
                            title="cloud_download"
                            onClick={onClickDownloadButton}
                            isLoading={CreditLimitDocumentDownloadButtonLoaderAction}
                        />
                    </div>
                )}
            </div>

            {!isLoading && docs ? (
                (() =>
                    docs.length > 0 ? (
                        <>
                            <div className="tab-table-container">
                                <Table
                                    align="left"
                                    valign="center"
                                    data={docs}
                                    headers={headers}
                                    tableClass="white-header-table"
                                    extraColumns={deleteDocumentAction}
                                    showCheckbox
                                    onChangeRowSelection={data => setSelectedCheckBoxData(data)}
                                    refreshData={getDocumentList}
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
                    ) : (
                        <div className="no-record-found">No record found</div>
                    ))()
            ) : (
                <Loader/>
            )}

            {customFieldModal && (
                <CustomFieldModal
                    defaultFields={defaultFields}
                    customFields={customFields}
                    onChangeSelectedColumn={onChangeSelectedColumn}
                    buttons={buttons}
                    toggleCustomField={toggleCustomFieldModal}
                />
            )}

            {uploadModal && (
                <Modal
                    header="Upload Documents"
                    className="upload-document-modal"
                    buttons={uploadDocumentButton}
                    hideModal={toggleUploadModal}
                >
                    <div className="document-upload-popup-container">
                        <span>Document Type</span>
                        <ReactSelect
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="Select"
                            options={documentTypeOptions}
                            value={documentType}
                            onChange={handleDocumentChange}
                            isSearchable
                        />
                        <span>Please upload your documents here</span>
                        <div>
                            <FileUpload
                                isProfile={false}
                                fileName={fileData.name ?? 'Browse...'}
                                handleChange={onUploadClick}
                            />
                            {fileExtensionErrorMessage && (
                                <div className="ui-state-error">
                                    Only jpeg, jpg, png, bmp, gif, tex, xls, xlsx, csv, doc, docx, odt, txt, pdf, png,
                                    pptx, ppt or rtf file types are accepted
                                </div>
                            )}
                        </div>
                        <span>Description</span>
                        <Input
                            prefixClass="font-placeholder"
                            placeholder="Document description"
                            name="description"
                            type="text"
                            value={description}
                            onChange={onchangeDocumentDescription}
                        />
                    </div>
                </Modal>
            )}

            {showConfirmModal && (
                <Modal
                    header="Delete User"
                    buttons={deleteDocumentButtons}
                    hideModal={toggleConfirmationModal}
                >
          <span className="confirmation-message">
            Are you sure you want to delete this document?
          </span>
                </Modal>
            )}
        </>
    );
};

CreditLimitsDocumentsTab.propTypes = {
    id: PropTypes.string.isRequired,
};

export default CreditLimitsDocumentsTab;
