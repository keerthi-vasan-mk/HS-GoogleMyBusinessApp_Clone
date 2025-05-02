import axios from 'axios';
import { request, success, error } from '@/actions/networkActions';
import { deposit, withdraw } from '@/actions/storageActions';
import { createAuthRequestHeader, createRequestHeader } from '@/utils/requestHeaders';
import * as api from '@/constants/api';
import * as reducerTypes from '@/constants/reducerTypes';

/**
 * @param {Object} payload Inital login payload from Hootsuite
 * @returns {Promise<Object>} Indication of success login success { success: true }
 */
export const login = payload => async (dispatch, getState) => {
  const state = getState();
  const { REQUEST_LOGIN, DATA_JWT } = reducerTypes;

  dispatch(request(REQUEST_LOGIN));

  try {
    const response = await axios.post(`${api.BASE_API_URL}${api.AUTH}${api.LOGIN}`, payload, createRequestHeader());
    const { token } = response.data;

    dispatch(success(REQUEST_LOGIN));

    // Each stream will have its own token associated to the stream ID.
    const tokens = state[DATA_JWT].data;
    let updatedToken = false;

    // If it does exist just update the token. If not then add a new value for the stream.
    tokens.forEach(currentToken => {
      if (currentToken.pid === payload.pid) {
        currentToken.jwt = token;
        updatedToken = true;
      }
    });

    if (!updatedToken) {
      tokens.push({
        pid: payload.pid,
        jwt: token,
      });
    }

    dispatch(deposit(DATA_JWT, tokens));
    return response;
  } catch (errors) {
    dispatch(error(REQUEST_LOGIN, errors));
    return Promise.reject(errors?.response?.data?.error);
  }
};

/**
 * @param {String} code Token that identifies the Google user
 * @returns {Promise<Object>}
 */
export const getUserTokenStatus = code => async (dispatch, getState) => {
  const state = getState();
  const { REQUEST_GOOGLE_ID_TOKEN } = reducerTypes;
  const payload = { code };

  dispatch(request(REQUEST_GOOGLE_ID_TOKEN));

  try {
    const response = await axios.post(
      `${api.BASE_API_URL}${api.AUTH}${api.GOOGLE_TOKEN_CHECK}`,
      payload,
      createAuthRequestHeader(state),
    );
    dispatch(success(REQUEST_GOOGLE_ID_TOKEN));
    return response.data.tokenFound;
  } catch (errors) {
    dispatch(error(REQUEST_GOOGLE_ID_TOKEN, errors));
    return Promise.reject(errors?.response?.data?.error);
  }
};

/**
 * Gets and stores a name from Google for the current user.
 * @returns {Promise<string>} User's Google name.
 */
export const getGoogleUsername = () => async (dispatch, getState) => {
  const state = getState();
  const { REQUEST_GOOGLE_USERNAME, DATA_USERNAME } = reducerTypes;
  const { uid } = window;

  dispatch(request(REQUEST_GOOGLE_USERNAME));

  try {
    const response = await axios.get(
      `${api.BASE_API_URL}${api.AUTH}${api.GOOGLE_USERNAME}`,
      createAuthRequestHeader(state),
    );
    dispatch(success(REQUEST_GOOGLE_USERNAME));
    dispatch(deposit(DATA_USERNAME, response.data.username));

    posthog.identify(response.data.username, {
      username: `${response.data.username} - ${uid}`
    });

    return response.data;
  } catch (errors) {
    dispatch(error(REQUEST_GOOGLE_USERNAME, errors));
    return Promise.reject(errors?.response?.data?.error);
  }
};

/**
 * @param {Object} code Access code to exchange for tokens
 * @returns {Promise<Object>} Changes the access code into tokens and saves them
 */
export const authorizeTokens = code => async (dispatch, getState) => {
  const state = getState();
  const { REQUEST_GOOGLE_CODE } = reducerTypes;
  const payload = {
    code,
  };

  dispatch(request(REQUEST_GOOGLE_CODE));

  try {
    const response = await axios.post(
      `${api.BASE_API_URL}${api.AUTH}${api.GOOGLE_CODE}`,
      payload,
      createAuthRequestHeader(state),
    );
    dispatch(success(REQUEST_GOOGLE_CODE));
    return response.data;
  } catch (errors) {
    dispatch(error(REQUEST_GOOGLE_CODE, errors));
    return Promise.reject(errors?.response?.data?.error);
  }
};

/**
 * @returns {Promise<Object>} Revoke Google authorization tokens
 */
export const revokeAuthorization = () => async (dispatch, getState) => {
  const state = getState();
  const { REQUEST_GOOGLE_REVOKE } = reducerTypes;

  dispatch(request(REQUEST_GOOGLE_REVOKE));

  try {
    const response = await axios.post(
      `${api.BASE_API_URL}${api.AUTH}${api.GOOGLE_REVOKE}`,
      {},
      createAuthRequestHeader(state),
    );
    dispatch(success(REQUEST_GOOGLE_REVOKE));
    return response.data;
  } catch (errors) {
    dispatch(error(REQUEST_GOOGLE_REVOKE, errors));
    return Promise.reject(errors?.response?.data?.error);
  }
};

/**
 * Stores the Google user's name.
 *
 * @param {string} name
 */

export const storeGoogleName = name => dispatch => {
  const { DATA_USERNAME } = reducerTypes;
  dispatch(deposit(DATA_USERNAME, name));
};

/**
 * Method that logs in an admin user.
 *
 * @param {Object} payload Initial login payload from Hootsuite
 * @returns {Promise<Boolean>} Returns indication of success login success.
 */
export const adminLogin = payload => async dispatch => {
  const { REQUEST_ADMIN_LOGIN, DATA_ADMIN_JWT } = reducerTypes;

  dispatch(request(REQUEST_ADMIN_LOGIN));

  try {
    const response = await axios.post(
      `${api.BASE_API_URL}${api.AUTH}${api.ADMIN}${api.LOGIN}`,
      payload,
      createRequestHeader(),
    );
    const { token, analytics_only } = response.data;

    dispatch(success(REQUEST_ADMIN_LOGIN));
    dispatch(deposit(DATA_ADMIN_JWT, { token, analytics_only }));

    return response.success;
  } catch (errors) {
    dispatch(error(REQUEST_ADMIN_LOGIN, errors));
    return Promise.reject(errors?.response?.data?.error);
  }
};

/**
 * Method that logs an admin out of the admin portal.
 */
export const adminLogout = () => dispatch => {
  const { DATA_ADMIN_JWT } = reducerTypes;
  posthog.reset();
  dispatch(withdraw(DATA_ADMIN_JWT));
};
