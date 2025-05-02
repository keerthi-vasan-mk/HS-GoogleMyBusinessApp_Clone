import axios from 'axios';
import moment from 'moment';
import { request, success, error } from '@/actions/networkActions';
import { deposit } from '@/actions/storageActions';
import { createAuthRequestHeader } from '@/utils/requestHeaders';
import * as api from '@/constants/api';
import * as reducerTypes from '@/constants/reducerTypes';
import { NO_NOTIFICATION_CODE } from '@/constants/notificationTypes';

/**
 * Method that checks for new notifications from the API for
 * the given stream type.
 *
 * @param {Object} payload
 */
export const checkForNotification = (payload) => async (dispatch, getState) => {
  const state = getState();
  const { REQUEST_NOTIFICATIONS_GET, DATA_NOTIFICATION } = reducerTypes;

  dispatch(request(REQUEST_NOTIFICATIONS_GET));

  try {
    //throw new Error('Error Related to Notification');
    const response = await axios.get(`${api.BASE_API_URL}${api.NOTIFICATIONS}`, createAuthRequestHeader(state));
    const notification = { ...response.data, dismissed: false };
    dispatch(success(REQUEST_NOTIFICATIONS_GET));

    // Clear notification storage if the API has no active notifications saved
    if (notification.code && notification.code === NO_NOTIFICATION_CODE) {
      hsp.saveData(null, () => {
        dispatch(deposit(DATA_NOTIFICATION, null));
      });
      return;
    }

    // Get Hootsuite stored data for individual stream
    hsp.getData((data) => {
      // If there is data saved, the updated times do not match, and current stream type matches the notification streams,
      // save the new notification into the Redux store.
      // Otherwise, immediately dismiss the notification and save it to the Redux store.
      if (data && data.updated_at !== notification.updated_at) {
        if (!notification.streams.includes(payload.streamType)) {
          notification.dismissed = true;
        }

        hsp.saveData(notification, () => {
          dispatch(deposit(DATA_NOTIFICATION, notification));
        });

        // If there is no data saved, and the current stream type matches the
        // notification streams, save the new notification into the Redux store
      } else if (
        !data &&
        notification.streams.includes(payload.streamType) &&
        moment().isBefore(moment(notification.expiry))
      ) {
        hsp.saveData(notification, () => {
          dispatch(deposit(DATA_NOTIFICATION, notification));
        });

        // If the notification is expired, dismiss the notification
        // and save the data.
      } else if (data && moment().isAfter(moment(data.expiry))) {
        data.dismissed = true;
        hsp.saveData(data, () => {
          dispatch(deposit(DATA_NOTIFICATION, data));
        });
      } else if (data) {
        // Hootsuite converts booleans to strings when saving data, so convert
        // back to boolean before use
        data.dismissed = data.dismissed === 'true';

        // Deposit the old notification
        dispatch(deposit(DATA_NOTIFICATION, data));
      }
    });
  } catch (errors) {
    dispatch(error(REQUEST_NOTIFICATIONS_GET, errors));
    return Promise.reject(errors);
  }
};

/**
 * Method that sets the current notification as dismissed so it is
 * no longer shown to the user.
 */
export const dismissNotification = () => (dispatch) => {
  const { DATA_NOTIFICATION } = reducerTypes;

  // Get the Hootsuite stored data for individual stream and
  // set the notification state to dismissed
  hsp.getData((notification) => {
    notification.dismissed = true;

    hsp.saveData(notification, () => {
      dispatch(deposit(DATA_NOTIFICATION, notification));
    });
  });
};
