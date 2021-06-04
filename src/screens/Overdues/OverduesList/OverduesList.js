import React, { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import IconButton from '../../../common/IconButton/IconButton';
import Button from '../../../common/Button/Button';
import Table from '../../../common/Table/Table';
import { getCreditLimitsList } from '../../CreditLimits/redux/CreditLimitsAction';
import Pagination from '../../../common/Pagination/Pagination';
import Modal from '../../../common/Modal/Modal';

const OverduesList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [date, setDate] = useState('');
  const [newSubmissionModal, setNewSubmissionModal] = useState(false);
  const creditList = useSelector(({ creditLimits }) => creditLimits?.creditLimitList ?? {});
  const { docs, headers } = useMemo(() => creditList, [creditList]);
  const newSubmissionButtons = [
    { title: 'Close', buttonType: 'primary-1', onClick: () => setNewSubmissionModal(e => !e) },
    {
      title: 'Add',
      buttonType: 'primary',
      onClick: () => history.push(`over-dues/${moment(date)?.format('MMMM-yyyy')}`),
    },
  ];

  console.log(moment(date)?.format('MMMM-yyyy'));

  useEffect(() => {
    const getMonthYearSeparated = moment(date)?.format('MM/yyyy')?.toString()?.split('/');
    const selectedMonth = getMonthYearSeparated[0];
    const selectedYear = getMonthYearSeparated[1];
    console.log(selectedMonth, selectedYear);
  }, [date]);

  useEffect(() => {
    dispatch(getCreditLimitsList());
  }, []);
  return (
    <>
      <div className="page-header">
        <div className="page-header-name">List of Overdues</div>
        <div className="page-header-button-container">
          <IconButton
            buttonType="secondary"
            title="filter_list"
            className="mr-10"
            buttonTitle="Click to apply filters on credit limit list"
          />
          <Button
            buttonType="success"
            title="New Submission"
            onClick={() => setNewSubmissionModal(e => !e)}
          />
        </div>
      </div>
      <div className="common-list-container">
        <Table
          isExpandable
          tableClass="main-list-table"
          data={docs}
          headers={headers}
          rowClass="cursor-pointer"
        />
        <Pagination className="common-list-pagination" />
      </div>

      {newSubmissionModal && (
        <Modal
          header="New Submission"
          className="new-submission-modal"
          headerClassName="left-aligned-modal-header"
          buttons={newSubmissionButtons}
        >
          <div className="date-picker-container month-year-picker">
            <DatePicker
              placeholderText="Select month and year"
              onChange={selectedDate => setDate(selectedDate)}
              dateFormat="MM/yyyy"
              selected={date}
              showMonthYearPicker
              showYearDropdown
              showFullMonthYearPicker
            />
            <span className="material-icons-round">expand_more</span>
          </div>
        </Modal>
      )}
    </>
  );
};

export default OverduesList;
