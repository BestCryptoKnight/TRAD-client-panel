import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../../assets/images/logo.svg';
import Loader from '../../Loader/Loader';
import {
  clearNotificationData,
  deleteDashboardNotification,
  getDashboardNotificationList,
} from '../redux/DashboardActions';

const DashBoardNotification = () => {
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(false);
  const { isLoading, notificationList, page, pages, total, hasMoreData } = useSelector(
    ({ dashboard }) => dashboard?.dashboardNotification ?? {}
  );

  const sortedNotification = useMemo(() => {
    notificationList?.sort(function (a, b) {
      return new Date(b.title) - new Date(a.title);
    });
    return notificationList;
  }, [notificationList]);

  const getDashboardNotificationListByFilter = useCallback(
    async (params = {}, cb) => {
      const data = {
        page: page || 1,
        ...params,
      };
      try {
        await dispatch(getDashboardNotificationList(data));
        if (cb && typeof cb === 'function') {
          cb();
        }
      } catch (e) {
        /**/
      }
    },
    [total, pages, page]
  );

  const handleScroll = e => {
    if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight)
      if (sortedNotification?.length > 0) {
        setIsFetching(true);
      }
  };

  const fetchMoreListItems = () => {
    try {
      setTimeout(async () => {
        const changedPage = page + 1;
        await getDashboardNotificationListByFilter({ page: changedPage });
        setIsFetching(false);
      }, [500]);
    } catch (e) {
      /**/
    }
  };

  useEffect(async () => {
    await getDashboardNotificationListByFilter();
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    if (hasMoreData) fetchMoreListItems();
  }, [isFetching, hasMoreData]);

  useEffect(() => {
    return () => {
      dispatch(clearNotificationData());
    };
  }, []);

  return (
    <div className="dashboard-white-container mt-20 mb-20" onScroll={handleScroll}>
      <div className="dashboard-title-date-row">
        <div className="dashboard-card-title">Notifications</div>
      </div>
      {!isLoading && sortedNotification ? (
        (() =>
          sortedNotification?.length > 0 ? (
            sortedNotification?.map(e => (
              <>
                <div className="notification-date">{moment(e?.title).format('DD-MMM-YYYY')}</div>
                <div className="notification-container">
                  {e?.data?.map(data => (
                    <div className="notification-row">
                      <div className="notification-circle-container">
                        <div className="notification-vertical-line" />
                        <div className="notification-circle">
                          <img src={logo} alt="logo" />
                        </div>
                      </div>

                      <div className="notification-detail-row">
                        <span className="font-field f-14">{data?.description}</span>
                        <span className="notification-time">
                          {moment(data?.createdAt).format('hh:mm A')}
                        </span>
                        <span
                          className="material-icons-round"
                          onClick={() => {
                            dispatch(deleteDashboardNotification(data?._id));
                          }}
                        >
                          delete_outline
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ))
          ) : (
            <div className="no-record-found">No record found</div>
          ))()
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default DashBoardNotification;
