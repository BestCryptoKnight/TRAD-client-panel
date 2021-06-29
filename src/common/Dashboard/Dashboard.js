import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Doughnut, Pie } from 'react-chartjs-2';
import 'chartjs-plugin-labels';
import _ from 'lodash';
import Table from '../Table/Table';
import {
  getDashboardDetails,
  getDashboardTaskList,
  resetDashboardDetails,
} from './redux/DashboardActions';
import Loader from '../Loader/Loader';
import { usdConverter } from '../../helpers/usdConverter';
import { getLabelFromValues } from '../../helpers/chartHelper';
import { dashboardPendingApplicationsMapper } from '../../helpers/Mappers';
import DashBoardNotification from './components/DashBoardNotification';

const Dashboard = () => {
  const dispatch = useDispatch();

  const dashboardDetails = useSelector(({ dashboard }) => dashboard?.dashboardDetails ?? {});

  const dashboardTaskList = useSelector(({ dashboard }) => dashboard?.dashboardTask ?? {});

  const {
    endorsedLimit,
    discretionaryLimit,
    approvedAmount,
    approvedApplication,
    applicationStatus,
    resChecksCount,
  } = useMemo(() => dashboardDetails, [dashboardDetails]);

  const { docs, headers, isLoading } = useMemo(() => dashboardTaskList, [dashboardTaskList]);

  const { dashboardDetailsLoader } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const endorsedLimitsData = {
    labels: [''],
    datasets: [
      {
        label: '',
        data: [
          endorsedLimit?.totalCount === 0 ? 0 : endorsedLimit?.endorsedLimitCount,
          endorsedLimit?.totalCount === 0
            ? 1
            : endorsedLimit?.totalCount - endorsedLimit?.endorsedLimitCount,
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
    labels: [''],
    datasets: [
      {
        label: '',
        data: [
          resChecksCount?.totalCount === 0 ? 0 : resChecksCount?.applicationCount,
          resChecksCount?.totalCount === 0
            ? 1
            : resChecksCount?.totalCount - resChecksCount?.applicationCount,
        ],
        backgroundColor: ['#62d493', '#CBD7E4'],
      },
    ],
  };

  const pendingApplicationsData = {
    labels:
      applicationStatus &&
      applicationStatus?.map(e => getLabelFromValues(e._id, dashboardPendingApplicationsMapper)),
    datasets: [
      {
        label: '',
        data: applicationStatus && applicationStatus?.map(e => e?.count),
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
    dispatch(getDashboardDetails());
    dispatch(getDashboardTaskList());
    return dispatch(resetDashboardDetails());
  }, []);
  return (
    <>
      {!dashboardDetailsLoader ? (
        (() =>
          !_.isEmpty(dashboardDetails) ? (
            <>
              <div className="dashboard-container">
                <div className="dashboard-graph-grid">
                  {endorsedLimit && (
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
                              {endorsedLimit?.totalCount > 0
                                ? (
                                    (endorsedLimit?.endorsedLimitCount * 100) /
                                    endorsedLimit?.totalCount
                                  ).toFixed(0)
                                : 0}
                              %
                            </div>
                            <span>
                              {endorsedLimit?.endorsedLimitCount ?? 0}/
                              {endorsedLimit?.totalCount ?? 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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
                          <div>
                            {resChecksCount && resChecksCount?.totalCount > 0
                              ? (
                                  (resChecksCount?.applicationCount / resChecksCount?.totalCount) *
                                  100
                                ).toFixed(0)
                              : 0}
                            %
                          </div>
                          <span>
                            {resChecksCount?.applicationCount ?? 0}/
                            {resChecksCount?.totalCount ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dashboard-white-container">
                    <div className="dashboard-title-date-row">
                      <span className="dashboard-card-title">Pending Applications by Status</span>
                    </div>
                    <div className="d-flex align-center h-100 mt-10">
                      {pendingApplicationsData &&
                      pendingApplicationsData?.datasets?.[0]?.data?.length > 0 ? (
                        <Pie data={pendingApplicationsData} options={pendingApplicationsOptions} />
                      ) : (
                        <div className="no-record-found">No record found</div>
                      )}
                    </div>
                  </div>
                  <div
                    className={`dashboard-nested-grid-container ${
                      !endorsedLimit && 'no-endorsed-limit-nested-grid-container'
                    }`}
                  >
                    <div className="dashboard-white-container">
                      <div className="dashboard-title-date-row">
                        <div className="dashboard-card-title">Discretionary Limit</div>
                      </div>
                      <span className="dashboard-readings discretionary-limit">
                        {usdConverter(discretionaryLimit)}
                      </span>
                    </div>
                    <div className="dashboard-white-container">
                      <div className="dashboard-title-date-row">
                        <div className="dashboard-card-title">Approved Amount Ratio</div>
                      </div>
                      <span className="approved-amount-ratio  font-primary">
                        <div>
                          {approvedAmount?.total
                            ? (
                                (approvedAmount?.total / approvedAmount?.approvedAmount) *
                                100
                              ).toFixed(0)
                            : 0}
                          %
                        </div>
                        <span className="approved-amount-ratio-total">
                          ({approvedAmount?.approvedAmount ?? '0'}/{approvedAmount?.total ?? 0})
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
                      <div className="mt-5 reading">{approvedApplication?.approved ?? 0}</div>
                      <div className="approved-application-stripe fully-approved-stripe" />
                    </div>
                    <div className="approved-application-block partially-approved-block">
                      <div className="approved-application-sign partially-approved-sign">
                        <span className="material-icons-round">watch_later</span>
                      </div>
                      <div className="mt-15 title">Partially Approved</div>
                      <div className="mt-5 reading">
                        {approvedApplication?.partiallyApproved ?? 0}
                      </div>
                      <div className="approved-application-stripe partially-approved-stripe" />
                    </div>
                    <div className="approved-application-block rejected-block">
                      <div className="approved-application-sign rejected-sign">
                        <span className="material-icons-round">thumb_down</span>
                      </div>
                      <div className="mt-15 title">Rejected</div>
                      <div className="mt-5 reading">{approvedApplication?.rejected ?? 0}</div>
                      <div className="approved-application-stripe rejected-stripe" />
                    </div>
                  </div>
                </div>
                <div className="dashboard-table-white-container">
                  <div className="dashboard-title-date-row">
                    <div className="dashboard-card-title">Tasks</div>
                  </div>
                  <div className="dashboard-table-container">
                    {/* eslint-disable-next-line no-nested-ternary */}
                    {!isLoading && docs ? (
                      docs.length > 0 ? (
                        <Table
                          data={docs}
                          headers={headers}
                          headerClass="bg-white"
                          refreshData={getTaskList}
                          rowClass="task-row"
                        />
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
            </>
          ) : (
            <div className="no-record-found">No record found</div>
          ))()
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Dashboard;
