import axios from 'axios';
import moment from 'moment';
import { request, success, error } from '@/actions/networkActions';
import { deposit } from '@/actions/storageActions';
import { createAuthRequestHeader } from '@/utils/requestHeaders';
import * as api from '@/constants/api';
import * as reducerTypes from '@/constants/reducerTypes';
// import { openToast, closeToast } from '@/actions/toastActions';
// import { ToastType } from '@/constants/enums';
// import { store } from '@/App';
import { toast } from 'react-toastify';

/**
 * @returns {Promise<Object[]>} Array of reviews
 */
export const getStartingReviews = () => async (dispatch, getState) => {
  const state = getState();
  const { REQUEST_REVIEWS_GET, DATA_REVIEWS } = reducerTypes;
  dispatch(request(REQUEST_REVIEWS_GET));
  toast.dismiss();

  try {
    const response = await axios.get(`${api.BASE_API_URL}${api.REVIEWS}`, createAuthRequestHeader(state));
    dispatch(success(REQUEST_REVIEWS_GET));
    dispatch(deposit(DATA_REVIEWS, response?.data?.locationReviews));
    if (response.data.hasOwnProperty('errors')) {
      console.log(
        ...response.data.errors.map(obj => {
          return `The location ${obj.locationName} has the error ${obj.error}`;
        }),
      );
      // store.dispatch(openToast({ type: ToastType.INFO, message: response.data.errors.map((obj)=>{ return `The location ${obj.locationName} has the error ${obj.error}`}) }));
      response.data.errors.forEach(obj => {
        toast.error(`The location ${obj.locationName} has the error ${obj.error}`);
      });
      // Close the error after 8 seconds.
      // setTimeout(() => {
      //   store.dispatch(closeToast());
      // }, 8000);
    }
    return response.data.locationReviews;
  } catch (errors) {
    dispatch(error(REQUEST_REVIEWS_GET, errors));
    return Promise.reject(errors?.response?.data?.error);
  }
};

/**
 * @returns {Promise<Object[]>} Array of reviews
 */
export const getReviewsPolling = () => async (dispatch, getState) => {
  const state = getState();
  const { REQUEST_REVIEWS_POLL } = reducerTypes;

  dispatch(request(REQUEST_REVIEWS_POLL));

  try {
    const response = await axios.get(
      `${api.BASE_API_URL}${api.REVIEWS}?timestamp=${moment().valueOf()}`,
      createAuthRequestHeader(state),
    );
    dispatch(success(REQUEST_REVIEWS_POLL));
    return response.data.locationReviews;
  } catch (errors) {
    dispatch(error(REQUEST_REVIEWS_POLL, errors));
    return Promise.reject(errors?.response?.data?.error);
  }
};

/**
 * @param {string} locationId ID of location to get more reviews
 * @param {string} nextPageToken Token used for Google paging
 * @returns {Promise<Object[]>} Array of reviews
 */
export const getMoreReviews = (locationNameId, nextPageToken) => async (dispatch, getState) => {
  const state = getState();
  const { REQUEST_LOCATIONS_REVIEWS_GET, DATA_REVIEWS } = reducerTypes;
  const payload = {
    params: {
      nextPageToken,
    },
    ...createAuthRequestHeader(state),
  };

  dispatch(request(REQUEST_LOCATIONS_REVIEWS_GET));

  try {
    const response = await axios.get(`${api.BASE_API_URL}${api.LOCATIONS}/${locationNameId}${api.REVIEWS}`, payload);
    dispatch(success(REQUEST_LOCATIONS_REVIEWS_GET));

    const reviews = [...state[DATA_REVIEWS].data];
    reviews.forEach(location => {
      if (location.locationNameId === locationNameId) {
        location.reviews.reviews.push(...response?.data?.reviews);
        location.reviews.nextPageToken = response?.data?.nextPageToken;
      }
    });

    dispatch(deposit(DATA_REVIEWS, reviews));
    return reviews;
  } catch (errors) {
    dispatch(error(REQUEST_LOCATIONS_REVIEWS_GET, errors));
    return Promise.reject(errors?.response?.data?.error);
  }
};

/**
 * @param {string} reviewId ID of reivew
 * @param {string} comment Comment
 * @returns {Promise<boolean>} Indication of success
 */
export const addReviewReply = (reviewNameId, comment) => async (dispatch, getState) => {
  const state = getState();
  const { REQUEST_REVIEWS_REPLY, DATA_REVIEWS } = reducerTypes;
  const payload = {
    comment,
  };

  dispatch(request(REQUEST_REVIEWS_REPLY));

  // Add the reply now. This is done eagerly in order to appear instant to the user.
  const reviews = [...state[DATA_REVIEWS].data];
  reviews.forEach(location => {
    if (location.reviews.reviews) {
      location.reviews.reviews.forEach(review => {
        if (review.name === reviewNameId) {
          review.reviewReply = {
            comment,
            updateTime: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
          };
        }
      });
    }
  });
  dispatch(deposit(DATA_REVIEWS, reviews));

  try {
    await axios.put(
      `${api.BASE_API_URL}${api.LOCATION_REVIEW_REPLY}/${reviewNameId}`,
      payload,
      createAuthRequestHeader(state),
    );
    dispatch(success(REQUEST_REVIEWS_REPLY));
    return reviews;
  } catch (errors) {
    dispatch(error(REQUEST_REVIEWS_REPLY, errors));
    // Remove the reply as an error occured during submission.
    const reviews = [...state[DATA_REVIEWS].data];
    reviews.forEach(location => {
      if (location.reviews.reviews) {
        location.reviews.reviews.forEach(review => {
          if (review.name === reviewNameId) {
            delete review.reviewReply;
          }
        });
      }
    });
    dispatch(deposit(DATA_REVIEWS, reviews));

    return Promise.reject(errors?.response?.data?.error);
  }
};

/**
 * @param {string} reviewId ID of reivew
 * @returns {Promise<boolean>} Indication of success
 */
export const deleteReviewReply = reviewNameId => async (dispatch, getState) => {
  let tempReply;
  const state = getState();
  const { REQUEST_REVIEWS_REPLY, DATA_REVIEWS } = reducerTypes;

  dispatch(request(REQUEST_REVIEWS_REPLY));

  // Remove the reply now. This is done eagerly in order to appear instant to the user.
  const reviews = [...state[DATA_REVIEWS].data];
  reviews.forEach(location => {
    if (location.reviews.reviews) {
      location.reviews.reviews.forEach(review => {
        if (review.name === reviewNameId) {
          tempReply = review.reviewReply;
          delete review.reviewReply;
        }
      });
    }
  });

  dispatch(deposit(DATA_REVIEWS, reviews));

  try {
    await axios.delete(
      `${api.BASE_API_URL}${api.LOCATION_REVIEW_REPLY}/${reviewNameId}`,
      createAuthRequestHeader(state),
    );
    dispatch(success(REQUEST_REVIEWS_REPLY));
    return true;
  } catch (errors) {
    dispatch(error(REQUEST_REVIEWS_REPLY, errors));
    // Add the reply back as the request to delete it failed.
    const reviews = [...state[DATA_REVIEWS].data];
    reviews.forEach(location => {
      if (location.reviews.reviews) {
        location.reviews.reviews.forEach(review => {
          if (review.name === reviewNameId) {
            review.reviewReply = tempReply;
          }
        });
      }
    });
    dispatch(deposit(DATA_REVIEWS, reviews));
    return Promise.reject(errors?.response?.data?.error);
  }
};
