import React, { useEffect, useState, useCallback, useReducer, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import IconButton from '../../IconButton/IconButton';
import Loader from '../../Loader/Loader';
import Modal from '../../Modal/Modal';
import Table from '../../Table/Table';
import { downloadDashboardTask, getDashboardTaskList } from '../redux/DashboardActions';
import { filterReducer, LIST_FILTER_REDUCER_ACTIONS } from '../../ListFilters/filter';
import Checkbox from '../../Checkbox/Checkbox';
import { saveAppliedFilters } from '../../ListFilters/redux/ListFiltersAction';
import { downloadAll } from '../../../helpers/DownloadHelper';
import { errorNotification } from '../../Toast';

const DashboardTask = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const dashboardTask = useSelector(({ dashboard }) => dashboard?.dashboardTask ?? {});
  const { docs, headers, isLoading } = useMemo(() => dashboardTask ?? {}, [dashboardTask]);

  const [filter, dispatchFilter] = useReducer(filterReducer, {
    tempFilter: {},
    finalFilter: {},
  });

  const { tempFilter, finalFilter } = useMemo(() => filter ?? {}, [filter]);

  const { dashboardTaskListFilters } = useSelector(({ listFilterReducer }) => listFilterReducer ?? {});

  const getDashboardTaskListByFilter = useCallback(
    async (params = {}, cb) => {
      const data = {
        isCompleted: tempFilter?.isCompleted || undefined,
        columnFor: 'task',
        ...params,
      };
      try {
        await dispatch(getDashboardTaskList(data));
        dispatchFilter({
          type: LIST_FILTER_REDUCER_ACTIONS.APPLY_DATA,
        });
        if (cb && typeof cb === 'function') {
          cb();
        }
      } catch (e) {
        /**/
      }
    },
    [tempFilter],
  );

  const getTaskListOnRefresh = () => {
    const filters = {
      isCompleted: dashboardTaskListFilters?.isCompleted || undefined,
    };
    Object.entries(filters).forEach(([name, value]) => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });
    getDashboardTaskListByFilter(filters);
  };

  const [filterModal, setFilterModal] = useState(false);

  const toggleFilterModal = useCallback(
    value => setFilterModal(value !== undefined ? value : e => !e),
    [setFilterModal],
  );
  const onClickApplyFilter = useCallback(async () => {
    await getDashboardTaskListByFilter({}, toggleFilterModal);
  }, [getDashboardTaskListByFilter, toggleFilterModal]);

  const onClickResetFilter = useCallback(async () => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.RESET_STATE,
    });
    await onClickApplyFilter();
  }, [dispatchFilter]);

  const filterModalButtons = useMemo(
    () => [
      {
        title: 'Reset Defaults',
        buttonType: 'outlined-primary',
        onClick: onClickResetFilter,
      },
      {
        title: 'Close',
        buttonType: 'primary-1',
        onClick: () => {
          dispatchFilter({
            type: LIST_FILTER_REDUCER_ACTIONS.CLOSE_FILTER,
          });
          toggleFilterModal();
        },
      },
      { title: 'Apply', buttonType: 'primary', onClick: onClickApplyFilter },
    ],
    [toggleFilterModal, onClickApplyFilter, onClickResetFilter],
  );

  const handleIsCompletedFilterChange = event => {
    dispatchFilter({
      type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
      name: 'isCompleted',
      value: event.target.checked,
    });
  };

  const downloadTask = async () => {
    if (docs?.length !== 0) {
      try {
        const res = await dispatch(downloadDashboardTask(finalFilter));
        if (res) {
          downloadAll(res);
        }
      } catch (e) {
        errorNotification(e?.response?.request?.statusText ?? 'Internal server error');
      }
    } else {
      errorNotification('You have no records to download');
    }
  };

  const onSelectTaskRecord = id => {
    history.push(`/dashboard/task/${id}`);
  };

  useEffect(async () => {
    const filters = { isCompleted: dashboardTaskListFilters?.isCompleted || undefined };
    Object.entries(filters)?.forEach(([name, value]) => {
      dispatchFilter({
        type: LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA,
        name,
        value,
      });
    });
    await getDashboardTaskListByFilter(filters);
  }, []);

  useEffect(() => {
    dispatch(saveAppliedFilters('dashboardTaskListFilters', finalFilter));
  }, [finalFilter]);

  return (
    <div className="dashboard-table-white-container">
      <div className="dashboard-title-date-row">
        <div className="dashboard-card-title">Tasks</div>
        {docs && (
          <div className="page-header-button-container">
            <IconButton
              className="mr-10"
              buttonType="primary"
              title="cloud_download"
              buttonTitle="Click to download task list"
              onClick={downloadTask}
            />
            <IconButton
              buttonType="secondary"
              title="filter_list"
              buttonTitle="Click to apply filters on task list"
              onClick={toggleFilterModal}
            />
          </div>
        )}
      </div>
      <div className="dashboard-table-container">
        {/* eslint-disable-next-line no-nested-ternary */}
        {!isLoading && docs ? (
          docs.length > 0 ? (
            <Table
              data={docs}
              headers={headers}
              headerClass="bg-white"
              refreshData={getTaskListOnRefresh}
              rowClass="task-row"
              recordSelected={onSelectTaskRecord}
            />
          ) : (
            <div className="no-record-found">No records found</div>
          )
        ) : (
          <Loader />
        )}
      </div>
      {filterModal && (
        <Modal
          headerIcon="filter_list"
          header="filter"
          buttons={filterModalButtons}
          className="filter-modal application-filter-modal"
        >
          <div className="d-flex align-center">
            <div className="form-title">Completed Task</div>
            <Checkbox checked={tempFilter?.isCompleted} onChange={e => handleIsCompletedFilterChange(e)} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DashboardTask;
