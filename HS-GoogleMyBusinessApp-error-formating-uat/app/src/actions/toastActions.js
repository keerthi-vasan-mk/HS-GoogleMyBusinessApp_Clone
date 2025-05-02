import { OPEN_TOAST, CLOSE_TOAST } from '@/constants/actionTypes';


/**
 * Action for sending an 'OPEN_TOAST' object to the 'toastReducer'.
 *
 * @param {Object} payload
 * @returns {Object} Returns 'toastReducer' action object
 */
export const openToast = (payload) => ({
  type: OPEN_TOAST,
  payload,
});

/**
 * Action for sending a 'CLOSE_TOAST' object to the 'toastReducer'.
 *
 * @returns {Object} Returns 'toastReducer' action object
 */
export const closeToast = () => ({
  type: CLOSE_TOAST,
});
