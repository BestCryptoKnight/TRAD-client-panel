import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  DATE_FORMAT,
  DATE_FORMAT_CONSTANT_FOR_CALENDER,
} from '../../../constants/DateFormatConstants';
import Loader from '../../Loader/Loader';
import Drawer from '../../Drawer/Drawer';
import IconButton from '../../IconButton/IconButton';
import {
  getHeaderNotificationListURL,
  markAllNotificationAsRead,
  markNotificationAsReadAndDeleteAction,
} from '../redux/HeaderAction';
import { errorNotification } from '../../Toast';
import { handleGlobalSearchSelect } from '../../../helpers/GlobalSearchHelper';

const HeaderNotification = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [notificationDrawer, setNotificationDrawer] = useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const { notificationData } = useSelector(
    ({ headerNotificationReducer }) => headerNotificationReducer ?? {}
  );

  const { notificationList, page, pages, total, hasMoreData } = notificationData ?? {};
  const { markAllAsReadLoader } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const sortedNotificationList = useMemo(() => {
    let list = [];
    if (notificationList?.length > 0) {
      list = Object.values(
        notificationList?.reduce((acc, cur) => {
          if (!acc[moment(cur.createdAt).format('DD/MM/YYYY')])
            acc[moment(cur.createdAt).format('DD/MM/YYYY')] = {
              createdAt: moment(cur.createdAt).format('DD/MM/YYYY'),
              notifications: [],
            };
          acc[moment(cur.createdAt).format('DD/MM/YYYY')].notifications.push(cur);
          return acc;
        }, {})
      );
      list?.sort((a, b) => {
        return (
          moment(b.createdAt, 'DD/MM/YYYY').toDate() - moment(a.createdAt, 'DD/MM/YYYY').toDate()
        );
      });
    }
    return list ?? [];
  }, [notificationList]);

  const openNotificationDrawer = useCallback(
    value => setNotificationDrawer(value !== undefined ? value : e => !e),
    []
  );

  const NotificationDrawerHeader = () => {
    return (
      <div className="notification-drawer-title">
        <span className="material-icons-round">notifications_active</span> Notifications
      </div>
    );
  };

  const onNotificationClick = useCallback(notification => {
    const { entityType, entityId, hasSubModule, subModule, description } = notification;
    handleGlobalSearchSelect(history, entityType, entityId, hasSubModule, subModule, description);
    setNotificationDrawer(false);
  }, []);

  const markAllAsRead = useCallback(() => {
    if (sortedNotificationList?.length > 0 && !markAllAsReadLoader) {
      dispatch(markAllNotificationAsRead());
    } else {
      errorNotification('Nothing To Mark.');
    }
  }, [sortedNotificationList, markAllAsReadLoader]);

  const fetchMoreListItems = () => {
    try {
      setTimeout(async () => {
        const changedPage = page + 1;
        await dispatch(getHeaderNotificationListURL({ page: changedPage }));
        setIsFetching(false);
      }, [500]);
    } catch (e) {
      /**/
    }
  };

  const handleScroll = e => {
    if (
      Math.abs(e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight) < 100 &&
      sortedNotificationList?.length > 0
    )
      setIsFetching(true);
  };

  useEffect(() => {
    if (!isFetching) return;
    if (hasMoreData) fetchMoreListItems();
  }, [isFetching, hasMoreData]);

  return (
    <>
      <IconButton
        isBadge={total > 0}
        title="notifications_active"
        buttonType="outlined-bg"
        className="notification"
        onClick={openNotificationDrawer}
        badgeCount={total}
      />
      <Drawer
        header={<NotificationDrawerHeader />}
        drawerState={notificationDrawer}
        closeDrawer={() => setNotificationDrawer(false)}
        onDrawerScroll={handleScroll}
      >
        <>
          {sortedNotificationList?.length > 0 && (
            <div className="notification-clear-all-wrapper">
              <span className="notification-clear-all-btn f-14" onClick={markAllAsRead}>
                Mark All As Read
              </span>
            </div>
          )}
          {sortedNotificationList?.length > 0
            ? sortedNotificationList?.map(notification => (
                <div className="notification-set" key={notification?._id}>
                  <div className="notification-set-title">
                    {moment(notification?.createdAt, DATE_FORMAT).calendar(
                      null,
                      DATE_FORMAT_CONSTANT_FOR_CALENDER
                    )}
                  </div>
                  {notification?.notifications?.map(singleNotification => (
                    <div
                      className="notification-item-wrapper secondary-tag"
                      key={singleNotification?._id}
                      onClick={() => onNotificationClick(singleNotification)}
                    >
                      <div className="notification-date-row">
                        <div className="notification-date-row-left">
                          <span className="font-field mr-5">Date:</span>
                          <span className="font-primary">
                            {moment(singleNotification?.createdAt).format('DD-MMM-YYYY')}
                          </span>
                          {singleNotification?.entityType === 'alert' && (
                            <span className="ml-10 d-flex align-center">
                              <span className="material-icons-round">warning</span>
                              {singleNotification?.entityId?.priority}
                            </span>
                          )}
                        </div>
                        <span
                          className="material-icons-round font-placeholder cursor-pointer"
                          onClick={() =>
                            dispatch(markNotificationAsReadAndDeleteAction(singleNotification?._id))
                          }
                        >
                          cancel
                        </span>
                      </div>
                      <div className="font-field">Description:</div>
                      <div className="font-primary">{singleNotification?.description}</div>
                    </div>
                  ))}
                </div>
              ))
            : !notificationList?.length && (
                <div className="no-record-found">No new notification</div>
              )}
          {pages > page && <Loader />}
        </>
      </Drawer>
    </>
  );
};
export default HeaderNotification;
