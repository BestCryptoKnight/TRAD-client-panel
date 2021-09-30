import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Tooltip from 'rc-tooltip';
import AccordionItem from '../../../../common/Accordion/AccordionItem';
import Checkbox from '../../../../common/Checkbox/Checkbox';
import { getApplicationTaskList } from '../../redux/ApplicationAction';
import TableApiService from '../../../../common/Table/TableApiService';
import { successNotification } from '../../../../common/Toast';
import { displayErrors } from '../../../../helpers/ErrorNotifyHelper';

const ApplicationTaskAccordion = props => {
  const dispatch = useDispatch();
  const { applicationId, index } = props;

  const applicationTaskList = useSelector(
    ({ application }) => application?.viewApplication?.task?.taskList || []
  );

  const handleTaskCheckbox = useCallback(
    async (taskId, value) => {
      try {
        const response = await TableApiService.tableActions({
          url: 'task',
          method: 'put',
          id: taskId,
          data: {
            isCompleted: value,
          },
        });
        if (response?.data?.status === 'SUCCESS') {
          successNotification(response?.data?.message ?? 'Task updated successfully');
          dispatch(getApplicationTaskList(applicationId));
        }
      } catch (e) {
        displayErrors(e);
        /**/
      }
    },
    [applicationId]
  );

  return (
    <>
      {applicationTaskList !== undefined && (
        <AccordionItem
          index={index}
          accordionBodyClass="application-active-accordion-scroll"
          header="Tasks"
          count={
            applicationTaskList?.docs?.length < 10
              ? `0${applicationTaskList?.docs?.length}`
              : applicationTaskList?.docs?.length
          }
          suffix="expand_more"
        >
          {applicationTaskList?.docs?.length > 0 ? (
            applicationTaskList.docs.map(task => (
              <div className="common-accordion-item-content-box" key={task._id}>
                <div className="document-title-row">
                  <Tooltip
                    mouseEnterDelay={0.5}
                    overlayClassName="tooltip-left-class"
                    overlay={task.description || 'No task title set'}
                    placement="left"
                  >
                    <div className="document-title">{task.description || '-'}</div>
                  </Tooltip>

                  <div className="d-flex">
                    <Checkbox
                      checked={task.isCompleted}
                      onClick={() => handleTaskCheckbox(task._id, !task.isCompleted)}
                    />
                  </div>
                </div>
                <div className={`task-priority-${task.priority}`}>{task.priority}</div>
                <div className="date-owner-row">
                  <span className="title mr-5">Date:</span>
                  <span className="details">{moment(task.createdAt).format('DD-MMM-YYYY')}</span>

                  <span className="title">Owner:</span>
                  <Tooltip
                    mouseEnterDelay={0.5}
                    overlayClassName="tooltip-left-class"
                    overlay={task.createdById || 'No owner name added'}
                    placement="left"
                  >
                    <span className="details">{task.createdById}</span>
                  </Tooltip>
                </div>
                <div className="font-field">Comments:</div>
                <div className="view-application-accordion-description">{task.comments || '-'}</div>
              </div>
            ))
          ) : (
            <div className="no-record-found">Nothing To Show</div>
          )}
        </AccordionItem>
      )}
    </>
  );
};

export default React.memo(ApplicationTaskAccordion);

ApplicationTaskAccordion.propTypes = {
  applicationId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};
