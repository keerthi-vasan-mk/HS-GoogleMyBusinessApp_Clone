import axios from 'axios';
import { request, success, error } from '@/actions/networkActions';
import { deposit } from '@/actions/storageActions';
import { createAuthRequestHeader } from '@/utils/requestHeaders';
import * as api from '@/constants/api';
import * as reducerTypes from '@/constants/reducerTypes';
import { toast } from 'react-toastify';

/**
 * @returns {Promise<Object>[]} Array of user's locations
 */
export const getLocations = () => async (dispatch, getState) => {
  const state = getState();
  const { REQUEST_LOCATIONS_GET, DATA_LOCATIONS } = reducerTypes; 
  dispatch(request(REQUEST_LOCATIONS_GET));
  toast.dismiss();

  try {
    const response = await axios.get(`${api.BASE_API_URL}${api.LOCATIONS}`, createAuthRequestHeader(state));
    dispatch(success(REQUEST_LOCATIONS_GET));
    dispatch(deposit(DATA_LOCATIONS, response?.data?.accounts));
    return response.data.accounts;
  }
  catch (errors) {
    dispatch(error(REQUEST_LOCATIONS_GET, errors));
    return Promise.reject(errors?.response?.data?.error);
  }
};

/**
 * @param {string[]} payload Array of location name IDs
 * @returns {Promise<Object>} Indication of success
 */
export const setLocations = (payload) => async (dispatch, getState) => {
  const state = getState();
  const { REQUEST_LOCATIONS_SET, DATA_LOCATIONS } = reducerTypes;
  const requestPayload = {
    locationIds: payload
  };

  dispatch(request(REQUEST_LOCATIONS_SET));

  try {
    const response = await axios.put(`${api.BASE_API_URL}${api.LOCATIONS}`, requestPayload, createAuthRequestHeader(state));
    dispatch(success(REQUEST_LOCATIONS_SET));
    // Save updated locations that are returned
    dispatch(deposit(DATA_LOCATIONS, response?.data?.accounts));
    return response.data.success;
  }
  catch (errors) {
    dispatch(error(REQUEST_LOCATIONS_SET, errors));
    return Promise.reject(errors?.response?.data?.error);
  }
};
