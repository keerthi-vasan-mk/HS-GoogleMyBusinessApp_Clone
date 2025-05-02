import axios from 'axios';
import moment from 'moment';
import { request, success, error } from '@/actions/networkActions';
import { deposit } from '@/actions/storageActions';
import { createAuthRequestHeader } from '@/utils/requestHeaders';
import * as api from '@/constants/api';
import * as reducerTypes from '@/constants/reducerTypes';
// import { handleServerError } from '@/utils/errorHandler';
// import { openToast, closeToast } from '@/actions/toastActions';
// import { ToastType } from '@/constants/enums';
// import { store } from '@/App';
import { toast } from 'react-toastify';

/**
 * @returns {Promise<Object[]>} Array of questions
 */
export const getStartingQuestions = () => async (dispatch, getState) => {
  const state = getState();
  const { REQUEST_QUESTIONS_GET, DATA_QUESTIONS } = reducerTypes;
  dispatch(request(REQUEST_QUESTIONS_GET));
  toast.dismiss();

  try {
    const response = await axios.get(`${api.BASE_API_URL}${api.QUESTIONS}`, createAuthRequestHeader(state));
    dispatch(success(REQUEST_QUESTIONS_GET));
    dispatch(deposit(DATA_QUESTIONS, response?.data?.locationQuestions));

    if (response.data.hasOwnProperty('errors')) {
      response.data.errors.forEach(obj => {
        toast.error(`The location ${obj.locationName} has the error ${obj.error}`);
      });
      // store.dispatch(openToast({ type: ToastType.INFO, message: response.data.errors.map((obj)=>{ return `The location ${obj.locationName} has the error ${obj.error}`}) }));
      // // Close the error after 8 seconds.
      // setTimeout(() => {
      //   store.dispatch(closeToast());
      // }, 8000);
    }
    return response.data.locationQuestions;
  } catch (errors) {
    dispatch(error(REQUEST_QUESTIONS_GET, errors));
    return Promise.reject(errors?.response?.data?.error);
  }
};

/**
 * @returns {Promise<Object[]>} Array of questions
 */
export const getQuestionPolling = () => async (dispatch, getState) => {
  const state = getState();
  const { REQUEST_QUESTIONS_POLL } = reducerTypes;

  dispatch(request(REQUEST_QUESTIONS_POLL));

  try {
    const response = await axios.get(
      `${api.BASE_API_URL}${api.QUESTIONS}?timestamp=${moment().valueOf()}`,
      createAuthRequestHeader(state),
    );
    dispatch(success(REQUEST_QUESTIONS_POLL));
    return response.data.locationQuestions;
  } catch (errors) {
    dispatch(error(REQUEST_QUESTIONS_POLL, errors));
    return Promise.reject(errors?.response?.data?.error);
  }
};

/**
 * @param {string} locationId ID of location to get more questions
 * @param {string} nextPageToken Token used for Google paging
 * @returns {Promise<Object[]>} Array of questions
 */
export const getMoreQuestions = (locationNameId, nextPageToken) => async (dispatch, getState) => {
  const state = getState();
  const { REQUEST_LOCATIONS_QUESTIONS_GET, DATA_QUESTIONS } = reducerTypes;
  const payload = {
    params: {
      nextPageToken,
    },
    ...createAuthRequestHeader(state),
  };

  dispatch(request(REQUEST_LOCATIONS_QUESTIONS_GET));

  try {
    const response = await axios.get(`${api.BASE_API_URL}${api.LOCATIONS}/${locationNameId}${api.QUESTIONS}`, payload);
    dispatch(success(REQUEST_LOCATIONS_QUESTIONS_GET));

    const questions = [...state[DATA_QUESTIONS].data];
    questions.forEach(location => {
      if (location.locationNameId === locationNameId) {
        location.questions.questions.push(...response?.data?.questions);
        location.questions.nextPageToken = response?.data?.nextPageToken;
      }
    });

    dispatch(deposit(DATA_QUESTIONS, questions));
    return questions;
  } catch (errors) {
    dispatch(error(REQUEST_LOCATIONS_QUESTIONS_GET, errors));
    return errors?.response?.data?.error;
  }
};

/**
 * @param {string} questionNameId ID of question
 * @param {string} text Answer
 * @returns {Promise<boolean>} Indication of success
 */
export const addOrEditResponse = (questionNameId, text, answerNameId) => async (dispatch, getState) => {
  let tempResponse;
  let tempResponseIndex;
  const state = getState();
  const { REQUEST_QUESTIONS_REPLY, DATA_QUESTIONS } = reducerTypes;
  const payload = {
    text,
  };

  // Create a temporary reply ID
  const eagerNameId = `eager_name_${moment.utc()}`;

  dispatch(request(REQUEST_QUESTIONS_REPLY));

  // Add the reply now. This is done eagerly in order to appear instant to the user.
  const questions = [...state[DATA_QUESTIONS].data];
  questions.forEach(location => {
    if (location.questions && location.questions.questions) {
      location.questions.questions.forEach(question => {
        if (question.name === questionNameId) {
          if (answerNameId) {
            question.topAnswers.forEach((answer, index) => {
              if (answer.name === answerNameId) {
                // Store the answer in case of failure.
                tempResponseIndex = index;
                tempResponse = answer.text;

                answer.text = text;
                answer.updateTime = moment.utc().format('YYYY-MM-DDTHH:mm:ss');
              }
            });
          } else {
            if (!question.topAnswers) {
              question['topAnswers'] = [];
            }
            question.topAnswers.unshift({
              name: eagerNameId,
              author: {
                displayName: '(owner)',
              },
              text,
              updateTime: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
              currentUserReply: true,
            });
          }
        }
      });
    }
  });
  dispatch(deposit(DATA_QUESTIONS, questions));

  try {
    const response = await axios.post(
      `${api.BASE_API_URL}${api.LOCATION_QUESTION_RESPONSE}/${questionNameId}`,
      payload,
      createAuthRequestHeader(state),
    );
    dispatch(success(REQUEST_QUESTIONS_REPLY));

    // Update the eager reply with the one that was returned.
    const questions = [...state[DATA_QUESTIONS].data];
    questions.forEach(location => {
      if (location.questions && location.questions.questions) {
        location.questions.questions.forEach(question => {
          if (question.name === questionNameId) {
            if (!answerNameId) {
              question.topAnswers.forEach(answer => {
                if (answer.name === eagerNameId) {
                  answer.name = response?.data?.question?.name;
                }
              });
            }
          }
        });
      }
    });

    dispatch(deposit(DATA_QUESTIONS, questions));
    return true;
  } catch (errors) {
    dispatch(error(REQUEST_QUESTIONS_REPLY, errors));
    // Remove the eagerly loaded reply as an error occured during submission.
    const questions = [...state[DATA_QUESTIONS].data];
    questions.forEach(location => {
      if (location.questions && location.questions.questions) {
        location.questions.questions.forEach(question => {
          if (question.name === questionNameId) {
            if (answerNameId) {
              question.topAnswers[tempResponseIndex] = tempResponse;
            } else {
              // If there is more than one answer then remove the eagerly loaded answer
              if (question.topAnswers.length > 1) {
                const tempAnswers = question.topAnswers.filter(answer => answer.name !== eagerNameId);
                question.topAnswers = tempAnswers;
              } else {
                // If the eager reply was the only one them remove the 'topAnswers' property
                delete question.topAnswers;
              }
            }
          }
        });
      }
    });
    dispatch(deposit(DATA_QUESTIONS, questions));

    return Promise.reject(errors?.response?.data?.error);
  }
};

/**
 * @param {String} questionNameId ID of question
 * @param {String} answerNameId Name ID of the answer the response belongs to
 * @returns {Promise<boolean>} Indication of success
 */
export const deleteResponse = (questionNameId, answerNameId) => async (dispatch, getState) => {
  let tempResponse;
  let tempResponseIndex;
  const state = getState();
  const { REQUEST_QUESTIONS_REPLY, DATA_QUESTIONS } = reducerTypes;

  dispatch(request(REQUEST_QUESTIONS_REPLY));

  // Delete the reply now. This is done eagerly in order to appear instant to the user.
  const questions = [...state[DATA_QUESTIONS].data];
  questions.forEach(location => {
    if (location.questions && location.questions.questions) {
      location.questions.questions.forEach(question => {
        if (question.name === questionNameId) {
          if (question.topAnswers.length) {
            // Store the answer in case of failure.
            tempResponseIndex = question.topAnswers.findIndex(answer => answer.name === answerNameId);
            tempResponse = question.topAnswers.find(answer => answer.name === answerNameId);

            // Remove the answer
            const tempAnswers = question.topAnswers.filter(answer => answer.name !== answerNameId);
            question.topAnswers = tempAnswers;

            if (question.topAnswers.length === 0) {
              delete question.topAnswers;
            }
          }
        }
      });
    }
  });
  dispatch(deposit(DATA_QUESTIONS, questions));

  try {
    await axios.delete(
      `${api.BASE_API_URL}${api.LOCATION_QUESTION_RESPONSE}/${questionNameId}`,
      createAuthRequestHeader(state),
    );
    dispatch(success(REQUEST_QUESTIONS_REPLY));
    return true;
  } catch (errors) {
    dispatch(error(REQUEST_QUESTIONS_REPLY, errors));
    // Add the response back as there was an error deleting it.
    const questions = [...state[DATA_QUESTIONS].data];
    questions.forEach(location => {
      if (location.questions && location.questions.questions) {
        location.questions.questions.forEach(question => {
          if (question.name === answerNameId) {
            question.topAnswers.splice(tempResponseIndex, 0, tempResponse);
          }
        });
      }
    });
    dispatch(deposit(DATA_QUESTIONS, questions));

    return Promise.reject(errors?.response?.data?.error);
  }
};
