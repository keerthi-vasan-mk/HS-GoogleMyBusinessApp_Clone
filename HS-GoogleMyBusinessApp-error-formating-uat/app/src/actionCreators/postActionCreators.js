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
 * Gets the starting posts from the backend to
 * display in the Posts stream in the Hootsuite
 * dashboard.
 *
 * @returns {Promise<Object[]>} Array of posts
 */
export const getStartingPosts = () => (dispatch, getState) => {
  const state = getState();
  const { REQUEST_POSTS_GET, DATA_POSTS } = reducerTypes;
  dispatch(request(REQUEST_POSTS_GET));
  toast.dismiss();

  return axios
    .get(`${api.BASE_API_URL}${api.POSTS}`, createAuthRequestHeader(state))
    .then(response => {
      dispatch(success(REQUEST_POSTS_GET));
      dispatch(deposit(DATA_POSTS, response.data.posts));

      if (response.data.errors.length > 0) {
        response.data.errors.forEach(obj => {
          toast.error(`The location ${obj.locationName} has the error ${obj.error}`);
        });
        // store.dispatch(openToast({ type: ToastType.INFO, message: response.data.errors.map((obj)=>{ return `The location ${obj.locationName} has the error ${obj.error}`}) }));

        // // Close the error after 8 seconds.
        // setTimeout(() => {
        //   store.dispatch(closeToast());
        // }, 8000);
      }
      return response.data;
    })
    .catch(errors => {
      dispatch(error(REQUEST_POSTS_GET, errors));
      return Promise.reject(errors?.response?.data?.error);
    });
};

/**
 * Checks to see if any new posts have been posted
 * since the stream content has loaded. If new posts
 * are available, return them.
 *
 * @returns {Promise<Object[]>} Array of posts
 */
export const getPostsPolling = () => (dispatch, getState) => {
  const state = getState();
  const { REQUEST_POSTS_POLL } = reducerTypes;
  dispatch(request(REQUEST_POSTS_POLL));

  // The timestamp prevents this request from  ever being cached.
  return axios
    .get(`${api.BASE_API_URL}${api.POSTS}?timestamp=${moment().valueOf()}`, createAuthRequestHeader(state))
    .then(response => {
      dispatch(success(REQUEST_POSTS_POLL));
      return response.data;
    })
    .catch(errors => {
      dispatch(error(REQUEST_POSTS_POLL, errors));
      return Promise.reject(errors?.response?.data?.error);
    });
};

/**
 * Gets more posts from the backend using a pagination
 * token to determine which set of posts should be sent
 * back.
 *
 * @param {Object[]} pagination Array containing objects with a
 * location ID and token used for pagination
 * @returns {Promise<Object>} Object containing posts and paging key
 */
export const getMorePosts = (pagination = []) => (dispatch, getState) => {
  const state = getState();
  const { REQUEST_POSTS_GET_MORE, DATA_POSTS } = reducerTypes;
  const payload = {
    params: {
      pagination,
    },
    ...createAuthRequestHeader(state),
  };

  dispatch(request(REQUEST_POSTS_GET_MORE));

  return axios
    .get(`${api.BASE_API_URL}${api.POSTS}`, payload)
    .then(response => {
      dispatch(success(REQUEST_POSTS_GET_MORE));

      const posts = state[DATA_POSTS].data;

      // Did we provide pagination in the request?
      const paginationSent = pagination.length > 0;
      // Was pagination returned in the response?
      const paginationReturned = Array.isArray(response.data.pagination) && response.data.pagination.length > 0;

      // Is the total number of posts contained to a single page?
      const onlyOnePage = !paginationSent && !paginationReturned;
      // Is this the first request? The first page is fetched twice.
      const duplicateFirstPage = !paginationSent && paginationReturned;

      const updatedPosts =
        onlyOnePage || duplicateFirstPage
          ? // 1) The returned list of posts is sufficient for a location with only one
            //    page of posts.
            // 2) The first time fetching a new batch of posts, the same list as has
            //    been pre-loaded is returned, so this should not be joined with the list
            //    of posts in state - this causes duplicate posts.
            response.data.posts
          : // Otherwise, join new pages of posts to those already in state
            posts?.concat(response.data.posts);

      dispatch(deposit(DATA_POSTS, updatedPosts));
      return response.data;
    })
    .catch(errors => {
      dispatch(error(REQUEST_POSTS_GET_MORE, errors));
      return Promise.reject(errors?.response?.data?.error);
    });
};
