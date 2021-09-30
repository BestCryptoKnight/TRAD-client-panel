import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import BigInput from '../../../common/BigInput/BigInput';
import Table from '../../../common/Table/Table';
import Pagination from '../../../common/Pagination/Pagination';
import Loader from '../../../common/Loader/Loader';
import { errorNotification } from '../../../common/Toast';
import {
  addCreditLimitsNote,
  deleteCreditLimitsNote,
  getCreditLimitsNoteList,
  updateCreditLimitsNote,
} from '../redux/CreditLimitsAction';
import Modal from '../../../common/Modal/Modal';

const NOTE_ACTIONS = {
  ADD: 'ADD_ROW',
  EDIT: 'EDIT_ROW',
  DELETE: 'DELETE_ROW',
};

const initialCreditLimitsNoteState = {
  noteId: null,
  description: '',
  isPublic: false,
  type: NOTE_ACTIONS.ADD,
};

const CREDIT_LIMITS_NOTE_REDUCER_ACTIONS = {
  UPDATE_DATA: 'UPDATE_DATA',
  UPDATE_SINGLE_DATA: 'UPDATE_SINGLE_DATA',
  RESET_STATE: 'RESET_STATE',
};

function creditLimitsNoteReducer(state, action) {
  switch (action.type) {
    case CREDIT_LIMITS_NOTE_REDUCER_ACTIONS.UPDATE_SINGLE_DATA:
      return {
        ...state,
        [`${action.name}`]: action.value,
      };
    case CREDIT_LIMITS_NOTE_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        ...action.data,
      };
    case CREDIT_LIMITS_NOTE_REDUCER_ACTIONS.RESET_STATE:
      return { ...initialCreditLimitsNoteState };
    default:
      return state;
  }
}

const CreditLimitsNotesTab = props => {
  const { id } = props;
  const dispatch = useDispatch();
  const searchInputRef = useRef();
  const [modifyNoteModal, setModifyNoteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedCreditLimitsNote, dispatchSelectedCreditLimitsNote] = useReducer(
    creditLimitsNoteReducer,
    initialCreditLimitsNoteState
  );

  const creditLimitsNoteList = useSelector(
    ({ creditLimits }) => creditLimits?.notes?.noteList ?? {}
  );
  const { total, headers, pages, docs, page, limit, isLoading } = useMemo(
    () => creditLimitsNoteList,
    [creditLimitsNoteList]
  );

  const toggleModifyNotes = useCallback(
    value => setModifyNoteModal(value !== undefined ? value : e => !e),
    [setModifyNoteModal]
  );

  const toggleConfirmationModal = useCallback(
    value => setShowConfirmModal(value !== undefined ? value : e => !e),
    [setShowConfirmModal]
  );

  const onChangeSelectedNoteInput = useCallback(e => {
    dispatchSelectedCreditLimitsNote({
      type: CREDIT_LIMITS_NOTE_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
      name: e.target.name,
      value: e.target.value,
    });
  }, []);

  const onCloseNotePopup = useCallback(() => {
    dispatchSelectedCreditLimitsNote({
      type: CREDIT_LIMITS_NOTE_REDUCER_ACTIONS.RESET_STATE,
    });
    toggleModifyNotes();
  }, [toggleModifyNotes, dispatchSelectedCreditLimitsNote]);

  const addOrUpdateNote = useCallback(async () => {
    const noteData = {
      description: selectedCreditLimitsNote?.description,
      isPublic: selectedCreditLimitsNote?.isPublic,
    };
    if (selectedCreditLimitsNote?.type === NOTE_ACTIONS.ADD) {
      await dispatch(addCreditLimitsNote(id, noteData));
    } else {
      noteData.noteId = selectedCreditLimitsNote?.noteId;
      await dispatch(updateCreditLimitsNote(id, noteData));
    }
    dispatchSelectedCreditLimitsNote({
      type: CREDIT_LIMITS_NOTE_REDUCER_ACTIONS.RESET_STATE,
    });
    toggleModifyNotes();
  }, [selectedCreditLimitsNote, toggleModifyNotes]);

  const getNoteList = useCallback(
    async (params = {}, cb) => {
      const data = {
        page: page ?? 1,
        limit: limit ?? 15,
        ...params,
      };
      dispatch(getCreditLimitsNoteList(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit]
  );

  const checkIfEnterKeyPressed = async e => {
    const searchKeyword = searchInputRef.current.value;
    if (searchKeyword.trim().toString().length === 0 && e.key !== 'Enter') {
      await getNoteList();
    } else if (e.key === 'Enter') {
      if (searchKeyword.trim().toString().length !== 0) {
        await getNoteList({ search: searchKeyword.trim().toString() });
      } else {
        errorNotification('Please enter search text to search');
      }
    }
  };

  const callBack = async () => {
    setDeleteId(null);
    toggleConfirmationModal();
    await getNoteList();
  };

  const deleteNoteButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() },
      {
        title: 'Delete',
        buttonType: 'danger',
        onClick: () => {
          try {
            dispatch(deleteCreditLimitsNote(deleteId, () => callBack()));
          } catch (e) {
            /**/
          }
        },
      },
    ],
    [toggleConfirmationModal, getNoteList, deleteId, callBack]
  );

  const addOrEditNoteButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => onCloseNotePopup() },
      {
        title: `${selectedCreditLimitsNote?.type === 'EDIT' ? 'Edit' : 'Add'} `,
        buttonType: 'primary',
        onClick: addOrUpdateNote,
      },
    ],
    [onCloseNotePopup, addOrUpdateNote]
  );

  const onSelectUserRecordActionClick = useCallback(
    (type, noteId, noteData) => {
      if (type === NOTE_ACTIONS.EDIT) {
        const { description, isPublic } = noteData;
        const data = {
          noteId,
          description,
          isPublic: isPublic === 'Yes',
          type: NOTE_ACTIONS.EDIT,
        };
        dispatchSelectedCreditLimitsNote({
          type: CREDIT_LIMITS_NOTE_REDUCER_ACTIONS.UPDATE_DATA,
          data,
        });
        toggleModifyNotes();
      } else if (type === NOTE_ACTIONS.DELETE) {
        setDeleteId(noteId);
        toggleConfirmationModal();
      }
    },
    [toggleModifyNotes, setDeleteId]
  );

  // on record limit changed
  const onSelectLimit = useCallback(
    newLimit => {
      getNoteList({ page: 1, limit: newLimit });
    },
    [getNoteList]
  );

  // on pagination changed
  const pageActionClick = useCallback(
    newPage => {
      getNoteList({ page: newPage, limit });
    },
    [getNoteList, limit]
  );

  useEffect(async () => {
    await getNoteList();
  }, []);

  return (
    <>
      <div className="tab-content-header-row">
        <div className="tab-content-header">Notes</div>
        <div className="buttons-row">
          <BigInput
            ref={searchInputRef}
            type="text"
            className="search"
            borderClass="tab-search"
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search here"
            onKeyUp={checkIfEnterKeyPressed}
          />
        </div>
      </div>
      {/* eslint-disable-next-line no-nested-ternary */}
      {!isLoading && docs ? (
        docs.length > 0 ? (
          <>
            <div className="tab-table-container">
              <Table
                align="left"
                valign="center"
                tableClass="white-header-table"
                data={docs}
                headers={headers}
                recordActionClick={onSelectUserRecordActionClick}
                haveActions
                refreshData={getNoteList}
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
        )
      ) : (
        <Loader />
      )}

      {modifyNoteModal && (
        <Modal
          header={`${selectedCreditLimitsNote?.type === 'EDIT' ? 'Edit Note' : 'Add Note'} `}
          className="add-note-class"
          buttons={addOrEditNoteButtons}
          hideModal={toggleModifyNotes}
        >
          <div className="add-notes-popup-container align-center">
            <span>Description</span>
            <textarea
              placeholder="Note description"
              name="description"
              rows={5}
              value={selectedCreditLimitsNote?.description}
              onChange={onChangeSelectedNoteInput}
            />
          </div>
        </Modal>
      )}
      {showConfirmModal && (
        <Modal header="Delete Note" buttons={deleteNoteButtons} hideModal={toggleConfirmationModal}>
          <span className="confirmation-message">Are you sure you want to delete this note?</span>
        </Modal>
      )}
    </>
  );
};

CreditLimitsNotesTab.propTypes = {
  id: PropTypes.string.isRequired,
};

export default CreditLimitsNotesTab;
