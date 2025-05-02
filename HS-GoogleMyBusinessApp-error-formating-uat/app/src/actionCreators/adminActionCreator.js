import axios from 'axios';
import moment from 'moment';
import { reset } from 'redux-form';
import { request, success, error } from '@/actions/networkActions';
import { deposit } from '@/actions/storageActions';
import { createAdminAuthRequestHeader } from '@/utils/requestHeaders';
import * as api from '@/constants/api';
import * as reducerTypes from '@/constants/reducerTypes';

/**
 * Method that gets a list of desired metrics from the API.
 * 
 * @returns {Promise<Object>} Returns the desired metrics.
 */
export const getAnalytics = () => async (dispatch, getState) => {
  const state = getState();
  const { REQUEST_ANALYTICS_GET, DATA_ANALYTICS } = reducerTypes;

  dispatch(request(REQUEST_ANALYTICS_GET));

  try {
    const response = await axios.get(`${api.BASE_API_URL}${api.ANALYTICS}`, createAdminAuthRequestHeader(state));
    const analytics = response.data;

    dispatch(success(REQUEST_ANALYTICS_GET));
    dispatch(deposit(DATA_ANALYTICS, analytics));

    return analytics;
  } catch (errors) {
    dispatch(error(REQUEST_ANALYTICS_GET, errors));
    return Promise.reject(errors);
  }
};

/**
 * Method that gets a list of error logs from the API.
 * 
 * @returns {Promise<Object>} Returns the error logs.
 */
export const getErrorLogs = () => async (dispatch, getState) => {
  const state = getState();
  const { REQUEST_ERROR_LOGS_GET, DATA_ERROR_LOGS } = reducerTypes;

  dispatch(request(REQUEST_ERROR_LOGS_GET));

  try {
    const response = await axios.get(`${api.BASE_API_URL}${api.LOGS}${api.ERRORS}`, createAdminAuthRequestHeader(state));
    const errorLogs = response.data.map(log => ({
      ...log,
      error: JSON.stringify(JSON.parse(log.error), null, 2)
    }));

    dispatch(success(REQUEST_ERROR_LOGS_GET));
    dispatch(deposit(DATA_ERROR_LOGS, errorLogs));

    return errorLogs;
  } catch (errors) {
    dispatch(error(REQUEST_ERROR_LOGS_GET, errors));
    return Promise.reject(errors);
  }
};

/**
 * Method that updates the currently shown notification.
 * 
 * @param {Object} payload
 * @returns {Promise<Object>} Returns the updated notification.
 */
export const updateNotification = (payload) => async (dispatch, getState) => {
  const state = getState();
  const { REQUEST_NOTIFICATIONS_POST, DATA_NOTIFICATION } = reducerTypes;

  const data = {
    ...payload,
    expiry: moment(payload.expiry).toISOString(),
    streams: payload.streams.map(stream => stream.value)
  };

  dispatch(request(REQUEST_NOTIFICATIONS_POST));

  try {
    const response = await axios.post(`${api.BASE_API_URL}${api.NOTIFICATIONS}`, data, createAdminAuthRequestHeader(state));
    const notification = response.data;

    dispatch(success(REQUEST_NOTIFICATIONS_POST));
    dispatch(deposit(DATA_NOTIFICATION, notification));
    dispatch(reset('updateNotification'));

    return notification;
  } catch (errors) {
    dispatch(error(REQUEST_NOTIFICATIONS_POST, errors));
    return Promise.reject(errors);
  }
};

/**
 * Method that gets the currently active notification.
 * 
 * @returns {Promise<Object>} Returns the currently active notification.
 */
export const getNotification = () => async (dispatch, getState) => {
  const state = getState();
  const { REQUEST_NOTIFICATIONS_GET, DATA_NOTIFICATION } = reducerTypes;

  dispatch(request(REQUEST_NOTIFICATIONS_GET));

  try {
    const response = await axios.get(`${api.BASE_API_URL}${api.NOTIFICATIONS}${api.ADMIN}`, createAdminAuthRequestHeader(state));
    const notification = response.data;

    dispatch(success(REQUEST_NOTIFICATIONS_GET));
    dispatch(deposit(DATA_NOTIFICATION, notification))

    return notification;
  } catch (errors) {
    dispatch(error(REQUEST_NOTIFICATIONS_GET, errors));
    return Promise.reject(errors);
  }
};