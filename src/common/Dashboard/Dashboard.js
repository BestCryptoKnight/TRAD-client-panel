import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Doughnut, Pie } from 'react-chartjs-2';
import 'chartjs-plugin-labels';
import Table from '../Table/Table';
import logo from '../../assets/images/logo.svg';
import {
  getDashboardApprovedAmountRatio,
  getDashboardApprovedApplications,
  getDashboardDiscretionaryLimit,
  getDashboardEndorsedLimit,
  getDashboardNotificationList,
  getDashboardPendingApplications,
  getDashboardTaskList,
} from './redux/DashboardActions';
import Loader from '../Loader/Loader';
import { usdConverter } from '../../helpers/usdConverter';
import { getLabelFromValues } from '../../helpers/chartHelper';
import { dashboardPendingApplicationsMapper } from '../../helpers/Mappers';

const Dashboard = () => {
  const dispatch = useDispatch();

  const dashboardPendingApplications = useSelector(
    ({ dashboard }) => dashboard?.pendingApplications ?? []
  );
  const dashboardEndorsedLimit = useSelector(({ dashboard }) => dashboard?.endorsedLimits ?? {});
  const dashboardDiscretionaryLimit = useSelector(
    ({ dashboard }) => dashboard?.discretionaryLimit ?? {}
  );
  const dashboardApprovedAmountRatio = useSelector(
    ({ dashboard }) => dashboard?.approvedAmountRation ?? []
  );
  const dashboardApprovedApplications = useSelector(
    ({ dashboard }) => dashboard?.approvedApplications ?? {}
  );

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
    labels: [''],
    datasets: [
      {
        label: '',
        data: [
          dashboardEndorsedLimit?.endorsedLimitCount,
          dashboardEndorsedLimit?.totalCount || dashboardEndorsedLimit?.totalCount >= 0
            ? dashboardEndorsedLimit?.totalCount - dashboardEndorsedLimit?.endorsedLimitCount
            : 1,
        ],
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
    labels:
      dashboardPendingApplications &&
      dashboardPendingApplications?.map(e =>
        getLabelFromValues(e._id, dashboardPendingApplicationsMapper)
      ),
    datasets: [
      {
        label: '',
        data: dashboardPendingApplications && dashboardPendingApplications?.map(e => e?.count),
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

  const getTaskList = useCallback(() => {
    dispatch(getDashboardTaskList());
  }, []);

  useEffect(() => {
    dispatch(getDashboardTaskList());
    dispatch(getDashboardNotificationList());
    dispatch(getDashboardPendingApplications());
    dispatch(getDashboardEndorsedLimit());
    dispatch(getDashboardDiscretionaryLimit());
    dispatch(getDashboardApprovedAmountRatio());
    dispatch(getDashboardApprovedApplications());
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-graph-grid mb-15">
        <div className="dashboard-white-container doughnut-white-card">
          <div className="dashboard-title-date-row">
            <span className="dashboard-card-title">
              Endorsed limits out of Aggregated Credit Limits
            </span>
          </div>
          <div className="doughnut-chart-container">
            <div className="doughnut-chart">
              <Doughnut data={endorsedLimitsData} options={doughnutOptions} />
              <div className="doughnut-center-text">
                <div>
                  {dashboardEndorsedLimit?.totalCount || dashboardEndorsedLimit?.totalCount > 0
                    ? (
                      (dashboardEndorsedLimit?.totalCount * 100) /
                      dashboardEndorsedLimit?.endorsedLimitCount
                    ).toFixed(0)
                    : 0}
                  %
                </div>
                {dashboardEndorsedLimit?.totalCount || dashboardEndorsedLimit?.totalCount > 0 ? (
                  <span>
                    {dashboardEndorsedLimit?.endorsedLimitCount}/
                    {dashboardEndorsedLimit?.totalCount}
                  </span>
                ) : (
                  <span>0/0</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-white-container doughnut-white-card">
          <div className="dashboard-title-date-row">
            <span className="dashboard-card-title">
              Applications processed out of RES Checks Assigned
            </span>
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
          </div>
          <div className="mt-10">
            {pendingApplicationsData && pendingApplicationsData?.datasets?.[0]?.data.length > 0 ? (
              <Pie data={pendingApplicationsData} options={pendingApplicationsOptions} />
            ) : (
              <div className="no-record-found">No record found</div>
            )}
          </div>
        </div>
        <div className="dashboard-nested-grid-container">
          <div className="dashboard-white-container">
            <div className="dashboard-title-date-row">
              <div className="dashboard-card-title">Discretionary Limit</div>
            </div>
            <span className="dashboard-readings discretionary-limit">
              {usdConverter(dashboardDiscretionaryLimit)}
            </span>
          </div>
          <div className="dashboard-white-container">
            <div className="dashboard-title-date-row">
              <div className="dashboard-card-title">Approved Amount Ratio</div>
            </div>
            <span className="dashboard-readings font-primary">
              {dashboardApprovedAmountRatio?.approvedAmount ?? '0'}
              <span className="approved-amount-ratio-total">
                /{dashboardApprovedAmountRatio?.total ?? 0}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="dashboard-white-container mt-20 mb-20">
        <div className="dashboard-title-date-row">
          <div className="dashboard-card-title">Approved Applications</div>
        </div>
        <div className="approved-application-blocks-container">
          <div className="approved-application-block fully-approved-block">
            <div className="approved-application-sign fully-approved-sign">
              <span className="material-icons-round">verified_user</span>
            </div>
            <div className="mt-15 title">Fully Approved</div>
            <div className="mt-5 reading">{dashboardApprovedApplications?.approved ?? 0}</div>
            <div className="approved-application-stripe fully-approved-stripe" />
          </div>
          <div className="approved-application-block partially-approved-block">
            <div className="approved-application-sign partially-approved-sign">
              <span className="material-icons-round">watch_later</span>
            </div>
            <div className="mt-15 title">Partially Approved</div>
            <div className="mt-5 reading">
              {dashboardApprovedApplications?.partiallyApproved ?? 0}
            </div>
            <div className="approved-application-stripe partially-approved-stripe" />
          </div>
          <div className="approved-application-block rejected-block">
            <div className="approved-application-sign rejected-sign">
              <span className="material-icons-round">thumb_down</span>
            </div>
            <div className="mt-15 title">Rejected</div>
            <div className="mt-5 reading">{dashboardApprovedApplications?.rejected ?? 0}</div>
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
              <Table data={docs} headers={headers} refreshData={getTaskList} rowClass="task-row" />
            ) : (
              <div className="no-record-found">No records found</div>
            )
          ) : (
            <Loader />
          )}
        </div>
      </div>
      <DashBoardNotification />
    </div>
  );
};

export default Dashboard;
