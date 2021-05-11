import React, {useCallback, useEffect, useMemo, useReducer, useState} from "react";
import BigInput from "../../../common/BigInput/BigInput";
import IconButton from "../../../common/IconButton/IconButton";
import Table from "../../../common/Table/Table";
import Pagination from "../../../common/Pagination/Pagination";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import _ from 'lodash';
import {
    changeCreditLimitsDocumentsColumnList, creditLimitsUploadDocument, downloadCreditLimitsDocuments,
    getCreditLimitsDocumentsColumnNamesList,
    getCreditLimitsDocumentsList, getCreditLimitsDocumentTypeList, saveCreditLimitsDocumentsColumnList,
} from "../redux/CreditLimitsAction";
import Loader from "../../../common/Loader/Loader";
import CustomFieldModal from "../../../common/Modal/CustomFieldModal/CustomFieldModal";
import {CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS} from "../redux/CreditLimitsReduxConstants";
import {errorNotification} from "../../../common/Toast";
import Modal from "../../../common/Modal/Modal";
import ReactSelect from "react-select";
import FileUpload from "../../../common/Header/component/FileUpload";
import Input from "../../../common/Input/Input";
import Switch from "../../../common/Switch/Switch";
import {downloadAll} from "../../../helpers/DownloadHelper";

const CreditLimitsDocumentsTab = () => {
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
                return { ...initialCreditLimitsDocumentState };
            default:
                return state;
        }
    }

    const dispatch = useDispatch();
    const { id } = useParams();
    const [uploadModal, setUploadModal] = useState(false);
    const [selectedCheckBoxData, setSelectedCheckBoxData] = useState([]);
    const [pageLimit, setPageLimit] = useState('');
    const [fileData, setFileData] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deleteDocumentData, setDeleteDocumentData] = useState('');
    const [customFieldModal, setCustomFieldModal] = React.useState(false);

    const [selectedCreditLimitsDocument, dispatchSelectedCreditLimitsDocument] = useReducer(
            creditLimitsDocumentReducer,
            initialCreditLimitsDocumentState
    );
    const { documentType, isPublic, description } = useMemo(() => selectedCreditLimitsDocument, [
        selectedCreditLimitsDocument,
    ]);
    const documentList = useSelector(({creditLimits}) => creditLimits?.documents?.documentList ?? {});
    const creditLimitsDocumentColumnList = useSelector(({creditLimits}) => creditLimits?.documents?.documentColumnList ?? {});
    const creditLimitsDefaultDocumentColumnList = useSelector(({creditLimits}) => creditLimits?.documents?.documentDefaultColumnList ?? {});
    const documentTypeList = useSelector(
            ({ creditLimits }) => creditLimits?.documents?.documentTypeList ?? []
    );

    const { total, headers, pages, docs, page, limit, isLoading} = useMemo(() => documentList,[documentList]);
    const { defaultFields, customFields } = useMemo(
            () => creditLimitsDocumentColumnList ?? { defaultFields: [], customFields: [] },
            [creditLimitsDocumentColumnList]
    );
    const getDocumentList = useCallback((params={}, cb) => {
        const data= {
            page: page ?? 1,
            limit: limit ?? 15,
            ...params
        };
        dispatch(getCreditLimitsDocumentsList(id, data));
        if(cb && typeof cb === 'function') {
            cb();
        }
    },[page, limit]);

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
                const data = { type, name, value };
                dispatch(changeCreditLimitsDocumentsColumnList(data));
            },
            [dispatch]
    );

    const onClickResetDefaultColumnSelection = useCallback(async () => {
        await dispatch(saveCreditLimitsDocumentsColumnList({ isReset: true }));
        dispatch(getCreditLimitsDocumentsList(id));
        toggleCustomFieldModal();
    }, [dispatch, toggleCustomFieldModal]);

    const onClickCloseCustomFieldModal = useCallback(() => {
        dispatch({
            type: CREDIT_LIMITS_DOCUMENTS_REDUX_CONSTANTS.CREDIT_LIMITS_DOCUMENTS_COLUMN_LIST,
            data: creditLimitsDefaultDocumentColumnList
        });
        toggleCustomFieldModal();
        },[creditLimitsDefaultDocumentColumnList, toggleCustomFieldModal])

    const onClickSaveColumnSelection = useCallback(async () => {
        try {
            const isBothEqual = _.isEqual(creditLimitsDocumentColumnList, creditLimitsDefaultDocumentColumnList);
            if(!isBothEqual) {
                await dispatch(saveCreditLimitsDocumentsColumnList({ creditLimitsDocumentColumnList }));
                await getDocumentList();
                toggleCustomFieldModal();
            } else {
                errorNotification('Please select different columns to apply changes.');
            }
        } catch (e) {
            /**/
        }
    }, [toggleCustomFieldModal, getCreditLimitsDocumentsColumnNamesList, creditLimitsDocumentColumnList, creditLimitsDefaultDocumentColumnList]);

    const buttons = useMemo(
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

    const onchangeDocumentDescription = useCallback(e => {
        dispatchSelectedCreditLimitsDocument({
            type: CREDIT_LIMITS_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
            name: e.target.name,
            value: e.target.value,
        });
    }, []);

    const onChangeDocumentSwitch = useCallback(e => {
        dispatchSelectedCreditLimitsDocument({
            type: CREDIT_LIMITS_DOCUMENT_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
            name: e.target.name,
            value: e.target.checked,
        });
    }, []);


    const onClickUploadDocument = useCallback(async () => {
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

                    if (!(checkExtension || checkMimeTypes)) {
                        errorNotification('Only image and document type files are allowed');
                    }
                            // else if (checkFileSize) {
                            //   errorNotification('File size should be less than 4 mb');
                    // }
                    else {
                        setFileData(e.target.files[0]);
                    }
                }
            },
            [setFileData]
    );

    const onCloseUploadDocumentButton = useCallback(() => {
        dispatchSelectedCreditLimitsDocument({
            type: CREDIT_LIMITS_DOCUMENT_REDUCER_ACTIONS.RESET_STATE,
        });
        setFileData('');
        toggleUploadModal();
    }, [toggleUploadModal, dispatchSelectedCreditLimitsDocument, setFileData]);

    const uploadDocumentButton = useMemo(
            () => [
                { title: 'Close', buttonType: 'primary-1', onClick: onCloseUploadDocumentButton },
                { title: 'Upload', buttonType: 'primary', onClick: onClickUploadDocument },
            ],
            [onCloseUploadDocumentButton, onClickUploadDocument]
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

    useEffect(() =>{
        getDocumentList();
        dispatch(getCreditLimitsDocumentsColumnNamesList());
        dispatch(getCreditLimitsDocumentTypeList());
    },[getDocumentList])
console.log({docs, headers});
    return(<>
        <div className="tab-content-header-row">
            <div className="tab-content-header">Documents</div>
            {!isLoading && (<div className="buttons-row">
                        <BigInput
                                prefix="search" prefixClass="font-placeholder" placeholder="Search here"
                                borderClass="tab-search"
                        />
                        <IconButton
                                buttonType="primary"
                                title="format_line_spacing"
                                onClick={toggleCustomFieldModal}
                        />
                        <IconButton
                                buttonType="primary"
                                title="cloud_upload"
                                onClick={toggleUploadModal}
                        />
                        <IconButton
                                buttonType="primary-1"
                                title="cloud_download"
                                onClick={onClickDownloadButton}
                        />
                    </div>)}
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
                />
        </>: <div className="no-record-found">No record found</div> ) : <Loader/>}

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
                                isSearchable={false}
                        />
                        <span>Please upload your documents here</span>
                        <FileUpload
                                isProfile={false}
                                fileName={fileData?.name || 'Browse...'}
                                handleChange={onUploadClick}
                        />
                        <span>Description</span>
                        <Input
                                prefixClass="font-placeholder"
                                placeholder="Document description"
                                name="description"
                                type="text"
                                value={description}
                                onChange={onchangeDocumentDescription}
                        />
                        <span>Private/Public</span>
                        <Switch
                                id="document-type"
                                name="isPublic"
                                checked={isPublic}
                                onChange={onChangeDocumentSwitch}
                        />
                    </div>
                </Modal>
        )}
    </>)
}

export default CreditLimitsDocumentsTab;
