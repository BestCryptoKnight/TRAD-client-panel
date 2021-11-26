import PropTypes from 'prop-types';
import React, { useCallback, useReducer, useState } from 'react';
import moment from 'moment';
import TableApiService from '../../../common/Table/TableApiService';
import Drawer from '../../../common/Drawer/Drawer';
import { NumberCommaSeparator } from '../../../helpers/NumberCommaSeparator';

export const DRAWER_ACTIONS = {
  SHOW_DRAWER: 'SHOW_DRAWER',
  HIDE_DRAWER: 'HIDE_DRAWER',
};

const drawerInitialState = {
  visible: false,
  data: [],
  id: '',
  drawerHeader: '',
};

const drawerReducer = (state, action) => {
  switch (action.type) {
    case DRAWER_ACTIONS.SHOW_DRAWER:
      return {
        visible: true,
        data: action.data,
        id: action.id,
        drawerHeader: action.drawerHeader,
      };
    case DRAWER_ACTIONS.HIDE_DRAWER:
      return drawerInitialState;

    default:
      return state;
  }
};

const ExpandedTableHelper = props => {
  const { docs, isRowExpanded, refreshData } = props;
  const [isStatusChanged, setIsStatusChanged] = useState(false);
  const [drawerState, dispatchDrawerState] = useReducer(drawerReducer, drawerInitialState);
  const handleDrawerState = useCallback(async data => {
    try {
      const response = await TableApiService.tableActions({
        url: 'overdue/details',
        method: 'get',
        id: data?._id,
      });

      dispatchDrawerState({
        type: DRAWER_ACTIONS.SHOW_DRAWER,
        data: response.data.data.response,
        drawerHeader: response.data.data.header,
        id: data?._id,
      });
    } catch (e) {
      /**/
    }
  }, []);

  const closeDrawer = useCallback(() => {
    dispatchDrawerState({
      type: DRAWER_ACTIONS.HIDE_DRAWER,
    });
    if (isStatusChanged) {
      setTimeout(() => refreshData(), 500);
    }
    setIsStatusChanged(false);
  }, [isStatusChanged, refreshData]);

  return (
    <>
      <TableLinkDrawer
        drawerState={drawerState}
        closeDrawer={closeDrawer}
        setIsStatusChanged={setIsStatusChanged}
      />
      <tr className={`expandable-table ${isRowExpanded && 'show-table'}`}>
        <td colSpan={20}>
          <div>
            <table width={100} cellSpacing={0}>
              <tr>
                <th>Name</th>
                <th>ACN</th>
                <th>Overdue Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
                <th>Submitted By</th>
              </tr>
              <tbody>
                {docs?.map(data => (
                  <tr
                    onClick={async e => {
                      e.stopPropagation();
                      await handleDrawerState(data);
                    }}
                  >
                    <td>{data?.name?.toString().trim().length > 0 ? data?.name : '-'}</td>
                    <td>{data?.acn?.toString().trim().length > 0 ? data?.acn : '-'}</td>
                    <td>{data?.overdueType}</td>
                    <td>{data?.amount?.toString().trim().length > 0 ? NumberCommaSeparator(data?.amount) : '-'}</td>
                    <td>{data?.overdueAction ?? '-'}</td>
                    <td>{data?.status ?? '-'}</td>
                    <td>{data?.createdById ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    </>
  );
};
ExpandedTableHelper.propTypes = {
  docs: PropTypes.array.isRequired,
  isRowExpanded: PropTypes.bool.isRequired,
  refreshData: PropTypes.func.isRequired,
};
export default ExpandedTableHelper;

const TableLinkDrawer = props => {
  const { drawerState, closeDrawer } = props;

  const checkValue = row => {
    switch (row.type) {
      case 'dollar':
        return row?.value ? `$ ${NumberCommaSeparator(row?.value)}` : '-';
      case 'percent':
        return row?.value ? `${row?.value} %` : '-';
      case 'date':
        return row?.value ? moment(row?.value)?.format('DD-MMM-YYYY') : '-';
      default:
        return row?.value ?? '-';
    }
  };

  return (
    <Drawer
      header={drawerState.drawerHeader}
      drawerState={drawerState?.visible}
      closeDrawer={closeDrawer}
    >
      <div className="contacts-grid">
        {drawerState?.data?.map(row => (
          <>
            <div className="title">{row?.label}</div>
            <div>{checkValue(row)}</div>
          </>
        ))}
      </div>
    </Drawer>
  );
};

TableLinkDrawer.propTypes = {
  drawerState: PropTypes.shape({
    visible: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
    drawerHeader: PropTypes.string.isRequired,
  }).isRequired,
  closeDrawer: PropTypes.func.isRequired,
};

TableLinkDrawer.defaultProps = {};
