import { REQUEST, SUCCESS, ERROR } from '@/constants/actionTypes';
import { authorizationRedirectCheck } from '@/utils/requestHandlers';


/**
 * Action for sending a `REQUEST` object to the generic `networkReducer`.
 * 
 * @param {String} reducerType
 * @returns {Object} Returns `networkReducer` action object
 */
export const request = (reducerType) => ({
  name: reducerType,
  type: REQUEST,
});

/**
 * Action for sending a `SUCCESS` object to the generic `networkReducer`.
 * 
 * @param {String} reducerType
 * @returns {Object} Returns `networkReducer` action object
 */
export const success = (reducerType) => ({
  name: reducerType,
  type: SUCCESS,
});

/**
 * Action for sending a `ERROR` object to the generic `networkReducer`.
 * Also checks for invalid token error and redirects to the login page.
 *
 * @param {String} reducerType
 * @param {Object|Array} error
 * @returns {Object} Returns `networkReducer` action object
 */
export const error = (reducerType, error) => {
  authorizationRedirectCheck(error);

  return {
    name: reducerType,
    type: ERROR,
    payload: error,
    error: true,
  };
};