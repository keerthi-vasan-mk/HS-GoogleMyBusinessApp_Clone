import { appHistory } from '@/App';
import { LOGIN } from '@/constants/routes';
import { ERROR_INVALID_GRANT, ERROR_INVALID_TOKEN } from '@/constants/serverErrors';

/**
 * Method that checks where the error returned by the API
 * was an invalid token error, in which case the user should be
 * redirected to the login screen.
 *
 * @param {Object} error The error returned from the API.
 */
export const authorizationRedirectCheck = error => {
  if (
    error.response?.data?.error?.code === ERROR_INVALID_GRANT ||
    error.response?.data?.error?.code === ERROR_INVALID_TOKEN
  ) {
    appHistory.push(LOGIN);
  }
};
