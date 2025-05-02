import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, Field, propTypes, SubmissionError } from 'redux-form';
import { withRouter } from 'react-router';
import moment from 'moment';
import MDSpinner from 'react-md-spinner';
import ReactTable from 'react-table';
import 'react-table/react-table.css'
import { adminLogout } from '@/actionCreators/authActionCreators';
import { getAnalytics, getNotification, getErrorLogs, updateNotification } from '@/actionCreators/adminActionCreator';
import Notification from '@/components/notification/Notification';
import AdminInput from './AdminInput';
import AdminSelect from './AdminSelect';
import { DATA_ANALYTICS, DATA_NOTIFICATION, REQUEST_NOTIFICATIONS_POST, REQUEST_ANALYTICS_GET, REQUEST_NOTIFICATIONS_GET, REQUEST_ERROR_LOGS_GET, DATA_ERROR_LOGS, DATA_ADMIN_JWT } from '@/constants/reducerTypes';
import { ADMIN_LOGIN, ERROR_SPLASH_PAGE } from '@/constants/routes';
import { WARNING_NOTIFICATION_TYPE, INFO_NOTIFICATION_TYPE } from '@/constants/notificationTypes';
import { ERROR_UNAUTHORIZED } from '@/constants/serverErrors';
import { LOADING_WHEEL_COLOR } from '@/constants/hexcodes';
import { required, capitalize, requiredArray } from '@/utils/generic';
import GMBLogo from 'assets/images/logo.png';
import warningIcon from 'assets/images/warningIcon.png';
import infoIcon from 'assets/images/infoIcon.png';

export class AdminPortal extends Component {

  static propTypes = {
    ...propTypes,
    errorLogs: PropTypes.array.isRequired,
    adminLogin: PropTypes.func.isRequired,
    adminLogout: PropTypes.func.isRequired,
    getNotification: PropTypes.func.isRequired,
    updateNotification: PropTypes.func.isRequired,
    getErrorLogs: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }

  /**
   * Lifecycle method that loads the analytics.
   */
  async componentDidMount() {
    const { 
      admin, getAnalytics, getNotification, 
      getErrorLogs, adminLogout, history 
    } = this.props;

    try {
      if(admin.analytics_only) {
        await getAnalytics();
      } else {
        await Promise.all([getAnalytics(), getNotification(), getErrorLogs()]);
      }
    } catch (error) {

      // If token is invalid or expires, send user back to login page
      if (error.response && error.response.status === ERROR_UNAUTHORIZED) {
        adminLogout();
        history.push(ADMIN_LOGIN);
      } else {
        history.push(ERROR_SPLASH_PAGE);
      }
    }
  }

  /**
   * Method that updates the currently shown notification.
   * 
   * @param {Object} values
   */
  updateNotification = async (values) => {
    try {
      await this.props.updateNotification(values);
    } catch (error) {
      const message = (error && error.response && error.response.data && error.response.data.error && error.response.data.error.message) 
        || error.message;
      throw new SubmissionError({ expiry: message });
    }
  }

  /**
   * Method that logs out of the admin portal
   * and redirects to the admin login page.
   */
  logout = () => {
    const { adminLogout, history } = this.props;
    adminLogout();
    history.push(ADMIN_LOGIN);
  }

  /**
   * Method that gets the columns for
   * the error log table.
   * 
   * @returns {Object[]} Returns a table header.
   */
  getColumns = () => [
    {
      Header: 'Log ID',
      accessor: 'logId',
      width: '100'
    },
    {
      Header: 'UID',
      accessor: 'uid',
      width: '100'
    },
    {
      Header: 'Error Code',
      accessor: 'httpCode',
      width: '110',
    },
    {
      Header: 'Request Type',
      accessor: 'apiActionRequest',
      width: '250',
    },
    {
      Header: 'Error',
      accessor: 'error',
      width: '400',
      style: {'white-space': 'unset'},
      Cell: props => <pre className="scrollable">{props.value}</pre>
    },
    {
      Header: 'Created At',
      accessor: 'createdAt',
      width: '210'
    }
  ]

  render() {
    const {
      admin, analytics, notification, errorLogs,
      handleSubmit, getAnalyticsRequest,
      getNotificationRequest, updateNotificationRequest,
      getErrorLogsRequest
    } = this.props;
    const { locationMetrics, userMetrics, totalAppMetrics } = analytics;

    if (getAnalyticsRequest.isLoading || getNotificationRequest.isLoading || getErrorLogsRequest.isLoading) {
      return <MDSpinner singleColor={LOADING_WHEEL_COLOR} size="40" />;
    }

    return (
      <div className="admin-portal">
        <div className="admin-portal__header">
          <img className="admin-portal__header__logo" src={GMBLogo} />
          <h1 className="admin-portal__header__title">Hootsuite GMB Admin Portal</h1>
          <button className="button button--admin" onClick={this.logout}>
            Logout
          </button>
        </div>
        <div className="admin-portal__body">
          <h2 className="admin-portal__body__heading">Analytics</h2>
          <div className="admin-portal__body__section">
            <div className="admin-portal__body__section__card">
              <h2 className="admin-portal__body__section__card__heading">App</h2>
              <div className="admin-portal__body__section__card__row">
                <h3>Total API Calls</h3>
                <p>{totalAppMetrics && totalAppMetrics.totalNumOfAPICalls || 0}</p>
              </div>
              <div className="admin-portal__body__section__card__row">
                <h3>Total Posts</h3>
                <p>{totalAppMetrics && totalAppMetrics.totalNumOfPosts || 0}</p>
              </div>
              <div className="admin-portal__body__section__card__row">
                <h3>Total Answers</h3>
                <p>{totalAppMetrics && totalAppMetrics.totalNumOfAnswers || 0}</p>
              </div>
              <div className="admin-portal__body__section__card__row">
                <h3>Total Replies</h3>
                <p>{totalAppMetrics && totalAppMetrics.totalNumOfReplies || 0}</p>
              </div>
              <div className="admin-portal__body__section__card__row">
                <h3>Number of users who have replied</h3>
                <p>{totalAppMetrics && totalAppMetrics.totalNumOfUsersWhoReplied || 0}</p>
              </div>
              <div className="admin-portal__body__section__card__row">
                <h3>Average Posts per user vs. Total Posts</h3>
                <p>{totalAppMetrics && totalAppMetrics.averagePostsPerUserVsTotalPosts || 0}</p>
              </div>
            </div>
            <div className="admin-portal__body__section__card">
              <h2 className="admin-portal__body__section__card__heading">User</h2>
              <div className="admin-portal__body__section__card__row">
                <h3>Average API Calls per user</h3>
                <p>{userMetrics && userMetrics.averageNumOfAPICallsPerUser || 0}</p>
              </div>
              <div className="admin-portal__body__section__card__row">
                <h3>Average Posts made per user</h3>
                <p>{userMetrics && userMetrics.averageNumOfPostsPerUser || 0}</p>
              </div>
              <div className="admin-portal__body__section__card__row">
                <h3>Average Answers given per user</h3>
                <p>{userMetrics && userMetrics.averageNumOfAnswersPerUser || 0}</p>
              </div>
              <div className="admin-portal__body__section__card__row">
                <h3>Average Replies given per user</h3>
                <p>{userMetrics && userMetrics.averageNumOfRepliesPerUser || 0}</p>
              </div>
            </div>
            <div className="admin-portal__body__section__card">
              <h2 className="admin-portal__body__section__card__heading">Location</h2>
              <div className="admin-portal__body__section__card__row">
                <h3>Users with 10 or more locations</h3>
                <p>{locationMetrics && locationMetrics.numOfTenOrMoreLocations || 0}</p>
              </div>
              <div className="admin-portal__body__section__card__row">
                <h3>Users with less than 10 locations</h3>
                <p>{locationMetrics && locationMetrics.numOfLessThanTenLocations || 0}</p>
              </div>
              <div className="admin-portal__body__section__card__row">
                <h3>Average locations per user</h3>
                <p>{locationMetrics && locationMetrics.averageLocationsPerUser || 0}</p>
              </div>
            </div>
          </div>
          {!admin.analytics_only &&
            <Fragment>
              <h2 className="admin-portal__body__heading">Notifications</h2>
              <div className="admin-portal__body__section admin-portal__body__section--unstretch">
                <div className="admin-portal__body__section__card">
                  <h2 className="admin-portal__body__section__card__heading">Current Notification</h2>
                  <div className="admin-portal__body__section__card__notification">
                    <Notification type={notification.type} text={notification.text} />
                  </div>
                  <div className="admin-portal__body__section__card__row admin-portal__body__section__card__row--notification">
                    <h3>Expiry: </h3>
                    <p>{moment(notification.expiry).local().format('YYYY-MM-DD h:mm A')}</p>
                  </div>
                  <div className="admin-portal__body__section__card__row admin-portal__body__section__card__row--notification">
                    <h3>Streams: </h3>
                    <p>{notification.streams && notification.streams.map(stream => capitalize(stream)).join(', ')}</p>
                  </div>
                </div>
                <form className="admin-portal__body__section__card" onSubmit={handleSubmit(this.updateNotification)}>
                  <h2 className="admin-portal__body__section__card__heading">Update Notification</h2>
                  <p className="admin-portal__body__section__card__label">Content</p>
                  <Field
                    name="text"
                    className="admin-portal__body__section__card__input"
                    component={AdminInput}
                    type="text"
                    validate={[required]}
                  />
                  <p className="admin-portal__body__section__card__label">Streams</p>
                  <Field
                    name="streams"
                    component={AdminSelect}
                    validate={[requiredArray]}
                  />
                  <p className="admin-portal__body__section__card__label">Expiry</p>
                  <Field
                    name="expiry"
                    className="admin-portal__body__section__card__input"
                    component={AdminInput}
                    type="datetime-local"
                    validate={[required]}
                    max="9999-12-31T23:59"
                  />
                  <p className="admin-portal__body__section__card__label">Type</p>
                  <label className="admin-portal__body__section__card__radio admin-portal__body__section__card__radio--warning">
                    <Field
                      name="type"
                      className="admin-portal__body__section__card__input"
                      component="input"
                      type="radio"
                      value={WARNING_NOTIFICATION_TYPE}
                    />
                    <img src={warningIcon} />
                    Warning
                  </label>
                  <label className="admin-portal__body__section__card__radio admin-portal__body__section__card__radio--info">
                    <Field
                      name="type"
                      className="admin-portal__body__section__card__input"
                      component="input"
                      type="radio"
                      value={INFO_NOTIFICATION_TYPE}
                    />
                    <img src={infoIcon} />
                    Information
                  </label>
                  {updateNotificationRequest.isLoading
                    ? <MDSpinner className="admin-portal__body__spinner" singleColor={LOADING_WHEEL_COLOR} size="30" />
                    : <button className="button button--admin" type="submit">Update</button>
                  }
                </form>
              </div>
              <h2 className="admin-portal__body__heading">Errors</h2>
              <div className="admin-portal__body__section">
                <div className="admin-portal__body__section__card">
                  <ReactTable
                    columns={this.getColumns()}
                    data={errorLogs}
                    defaultPageSize={5}
                  />
                </div>
              </div>
            </Fragment>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  admin: state[DATA_ADMIN_JWT].data,
  analytics: state[DATA_ANALYTICS].data,
  notification: state[DATA_NOTIFICATION].data,
  errorLogs: state[DATA_ERROR_LOGS].data,
  getAnalyticsRequest: state[REQUEST_ANALYTICS_GET],
  getNotificationRequest: state[REQUEST_NOTIFICATIONS_GET],
  updateNotificationRequest: state[REQUEST_NOTIFICATIONS_POST],
  getErrorLogsRequest: state[REQUEST_ERROR_LOGS_GET]
});

const mapDispatchToProps = {
  adminLogout,
  getAnalytics,
  getNotification,
  getErrorLogs,
  updateNotification
};

export default compose(
  reduxForm({
    form: 'updateNotification',
    initialValues: { type: WARNING_NOTIFICATION_TYPE }
  }),
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(AdminPortal);