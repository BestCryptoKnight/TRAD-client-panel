import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { Doughnut, Pie } from 'react-chartjs-2';
import 'chartjs-plugin-labels';
import Table from '../Table/Table';
import logo from '../../assets/images/logo.svg';
import { getDashboardNotificationList, getDashboardTaskList } from './redux/DashboardActions';
import Loader from '../Loader/Loader';

const Dashboard = () => {
  const dispatch = useDispatch();
  const dashboardTaskList = useSelector(({ dashboard }) => dashboard?.dashboardTask ?? {});
  const dashboardNotificationList = useSelector(
    ({ dashboard }) => dashboard?.dashboardNotification ?? {}
  );
  const { docs, headers, isLoading } = useMemo(() => dashboardTaskList, [dashboardTaskList]);
  const { notificationList, isLoading: notiIsLoading } = useMemo(
    () => dashboardNotificationList,
    [dashboardNotificationList]
  );
  const endorsedLimitsData = {
    labels: ['Purple'],
    datasets: [
      {
        label: '# of Votes',
        data: [0.83, 0.27],
        backgroundColor: ['#003A78', '#CBD7E4'],
      },
    ],
  };

  const doughnutOptions = {
    rotation: Math.PI,
    circumference: Math.PI,
    responsive: true,
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
    tooltips: {
      enabled: false,
    },
    legend: {
      display: false,
    },
    plugins: {
      labels: {
        fontColor: 'transparent',
      },
    },
    cutoutPercentage: 70,
  };

  const applicationProcessedData = {
    labels: ['Purple'],
    datasets: [
      {
        label: '# of Votes',
        data: [0.65, 0.35],
        backgroundColor: ['#62d493', '#CBD7E4'],
      },
    ],
  };

  const pendingApplicationsData = {
    labels: [
      'Sent to insurer',
      'Review application',
      'Pending insurer review',
      'Submitted to TRAD',
      'Under review',
      'Awaiting information',
    ],
    datasets: [
      {
        label: 'aaa',
        data: [6, 15, 30, 45, 7, 4],
        backgroundColor: ['#4382FF', '#1E205D', '#38C2BB', '#FF9700', '#950094', '#FF6969'],
      },
    ],
  };

  const pendingApplicationsOptions = {
    legend: {
      labels: {
        fontSize: 14,
        fontStyle: 'bold',
        usePointStyle: true,
        fontColor: '#1E205D',
        font: 'normal normal medium 14px/26px Google Sans',
        padding: 17,
      },
      position: 'left',
    },
    datalabels: {
      display: true,
      color: 'white',
    },
    tooltip: {
      enabled: true,
    },
    plugins: {
      labels: {
        render: 'value',
        fontSize: '16',
        fontColor: '#fff',
        fontStyle: 'bold',
      },
    },
  };
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const getTaskList = useCallback(() => {
    dispatch(getDashboardTaskList());
  }, []);

  useEffect(() => {
    dispatch(getDashboardTaskList());
    dispatch(getDashboardNotificationList());
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-graph-grid mb-15">
        <div className="dashboard-white-container doughnut-white-card">
          <div className="dashboard-title-date-row">
            <span className="dashboard-card-title">
              Endorsed limits out of Aggregated Credit Limits
            </span>
            <div className="date-picker-container">
              <DatePicker
                placeholderText="Select date"
                startDate={startDate}
                endDate={endDate}
                onChange={update => {
                  setDateRange(update);
                }}
                selectsRange
                isClearable
              />
              <span className="material-icons-round">insert_invitation</span>
            </div>
          </div>
          <div className="doughnut-chart-container">
            <div className="doughnut-chart">
              <Doughnut data={endorsedLimitsData} options={doughnutOptions} />
              <div className="doughnut-center-text">
                <div>83%</div>
                <span>550/660</span>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-white-container doughnut-white-card">
          <div className="dashboard-title-date-row">
            <span className="dashboard-card-title">
              Applications processed out of RES Checks Assigned
            </span>
            <div className="date-picker-container">
              <DatePicker
                popperModifiers={{
                  preventOverflow: {
                    enabled: true,
                  },
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
                selectsRange
              />
              <span className="material-icons-round">insert_invitation</span>
            </div>
          </div>
          <div className="doughnut-chart-container">
            <div className="doughnut-chart">
              <Doughnut data={applicationProcessedData} options={doughnutOptions} />
              <div className="doughnut-center-text">
                <div>65%</div>
                <span>453/700</span>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-white-container">
          <div className="dashboard-title-date-row">
            <span className="dashboard-card-title">Pending Applications by Status</span>
            <div className="date-picker-container">
              <DatePicker
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
                popperProps={{ positionFixed: true }}
                selectsRange
              />
              <span className="material-icons-round">insert_invitation</span>
            </div>
          </div>
          <div className="mt-10">
            <Pie data={pendingApplicationsData} options={pendingApplicationsOptions} />
          </div>
        </div>
        <div className="dashboard-nested-grid-container">
          <div className="dashboard-white-container">
            <div className="dashboard-title-date-row">
              <div className="dashboard-card-title">Discretionary Limit</div>
              <div className="date-picker-container">
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  popperModifiers={{
                    preventOverflow: {
                      enabled: true,
                    },
                  }}
                  placeholderText="Select date"
                  popperProps={{ positionFixed: true }}
                  selectsRange
                />
                <span className="material-icons-round">insert_invitation</span>
              </div>
            </div>
            <span className="dashboard-readings discretionary-limit">$10,000</span>
          </div>
          <div className="dashboard-white-container">
            <div className="dashboard-title-date-row">
              <div className="dashboard-card-title">Approved Amount Ratio</div>
              <div className="date-picker-container">
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  popperModifiers={{
                    preventOverflow: {
                      enabled: true,
                    },
                  }}
                  placeholderText="Select date"
                  popperProps={{ positionFixed: true }}
                  selectsRange
                />
                <span className="material-icons-round">insert_invitation</span>
              </div>
            </div>
            <span className="dashboard-readings font-primary">
              140,000<span className="approved-amount-ratio-total">/195,000</span>{' '}
            </span>
          </div>
        </div>
      </div>
      <div className="dashboard-white-container mt-20 mb-20">
        <div className="dashboard-title-date-row">
          <div className="dashboard-card-title">Approved Applications</div>
          <div className="date-picker-container">
            <DatePicker
              dateFormat="dd/MM/yyyy"
              popperModifiers={{
                preventOverflow: {
                  enabled: true,
                },
              }}
              placeholderText="Select date"
              popperProps={{ positionFixed: true }}
              selectsRange
            />
            <span className="material-icons-round">insert_invitation</span>
          </div>
        </div>
        <div className="approved-application-blocks-container">
          <div className="approved-application-block fully-approved-block">
            <div className="approved-application-sign fully-approved-sign">
              <span className="material-icons-round">verified_user</span>
            </div>
            <div className="mt-15 title">Fully Approved</div>
            <div className="mt-5 reading">300</div>
            <div className="approved-application-stripe fully-approved-stripe" />
          </div>
          <div className="approved-application-block partially-approved-block">
            <div className="approved-application-sign partially-approved-sign">
              <span className="material-icons-round">watch_later</span>
            </div>
            <div className="mt-15 title">Partially Approved</div>
            <div className="mt-5 reading">152</div>
            <div className="approved-application-stripe partially-approved-stripe" />
          </div>
          <div className="approved-application-block rejected-block">
            <div className="approved-application-sign rejected-sign">
              <span className="material-icons-round">thumb_down</span>
            </div>
            <div className="mt-15 title">Rejected</div>
            <div className="mt-5 reading">25</div>
            <div className="approved-application-stripe rejected-stripe" />
          </div>
        </div>
      </div>
      <div className="dashboard-white-container mt-20 mb-20">
        <div className="dashboard-title-date-row">
          <div className="dashboard-card-title">Tasks</div>
        </div>
        <div className="dashboard-table-container">
          {/* eslint-disable-next-line no-nested-ternary */}
          {!isLoading && docs ? (
            docs.length > 0 ? (
              <Table data={docs} headers={headers} refreshData={getTaskList} />
            ) : (
              <div className="no-record-found">No records found</div>
            )
          ) : (
            <Loader />
          )}
        </div>
      </div>
      <div className="dashboard-white-container mt-20 mb-20">
        <div className="dashboard-title-date-row">
          <div className="dashboard-card-title">Notifications</div>
        </div>
        {!notiIsLoading && notificationList ? (
          (() =>
            notificationList.length > 0 ? (
              notificationList?.map(e => (
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
                          <span className="material-icons-round">delete_outline</span>
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
    </div>
  );
};

export default Dashboard;
