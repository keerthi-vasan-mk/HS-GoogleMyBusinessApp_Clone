import { DEPOSIT, WITHDRAW } from '@/constants/actionTypes';


/**
 * Action for sending a `DEPOSIT` object to the generic `storageReducer`.
 *
 * @param {String} reducerType
 * @param {Object} data
 * @returns {Object} Returns `storageReducer` action object
 */
export const deposit = (reducerType, data) => ({
  name: reducerType,
  type: DEPOSIT,
  data,
});

/**
 * Action for sending a `WITHDRAW` object to the generic `storageReducer`.
 * 
 * @param {String} reducerType
 * @returns {Object} Returns `storageReducer` action object
 */
export const withdraw = (reducerType) => ({
  name: reducerType,
  type: WITHDRAW,
});