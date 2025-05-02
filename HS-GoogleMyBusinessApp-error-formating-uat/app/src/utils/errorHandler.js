import React from 'react';
import { ERROR_MSG_UNKNOWN, ERROR_INVALID_GRANT, ERROR_INVALID_TOKEN } from '@/constants/serverErrors';
import { MSG_GENERAL_ERROR, SYSTEM_ERROR } from '@/constants/errorMessages';
// import { openToast, closeToast } from '@/actions/toastActions';
// import { ToastType } from '@/constants/enums';
import { appHistory, store } from '@/App';
import { LOGIN } from '@/constants/routes';
import { toast } from 'react-toastify';

/**
 * Transforms server errors into a more user friendly message.
 *
 * @param {Object} error Server error object
 */
const transformServerError = error => {
  const CustomToastMessage = () => <div dangerouslySetInnerHTML={{ __html: (error?.formattedError || SYSTEM_ERROR) }} />;

  let errorMessage;

  switch (error.message) {
    case ERROR_MSG_UNKNOWN:
      errorMessage = MSG_GENERAL_ERROR;
      break;
    default:
      errorMessage = CustomToastMessage;
  }

  return errorMessage;
};

/**
 *
 * @param {Object} error Server error object
 */
export const handleServerError = error => {
  try {
    // If there are authorization errors then redirect the user to login page.
    if (error?.code === ERROR_INVALID_GRANT || error?.code === ERROR_INVALID_TOKEN) {
      appHistory.push(LOGIN);
    }
    //Commented the previous toast function and added react roastify
    // store.dispatch(openToast({ type: ToastType.ERROR, message: transformServerError(error) }));

    toast.dismiss();
    // If a user logs out in one stream, they are automatically logged out from other streams as well, and a toast is displayed.
    // We need to prevent that toast from showing. This condition will prevent the toast.
    if (error && error?.message && error?.message.trim().length > 0) {
      if (error?.code !== ERROR_INVALID_TOKEN) {
        toast.error(transformServerError(error), {
          toastId: `error-toast-id-${error?.message}`,
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: false,
        });
      }
    }
  } catch (err) {
    console.error('An error occurred while handling the server error:', err);
  }
};

/**
 *
 * @param {Object} error Error message
 */
export const handleStreamError = error => {
  //Commented the previous toast function and added react roastify
  // store.dispatch(openToast({ type: ToastType.ERROR, message: error }));
  toast.error(error, {
    autoClose: 5000,
  });

  // Close the error after 8 seconds.
  // setTimeout(() => {
  //   store.dispatch(closeToast());
  // }, 8000);
};
