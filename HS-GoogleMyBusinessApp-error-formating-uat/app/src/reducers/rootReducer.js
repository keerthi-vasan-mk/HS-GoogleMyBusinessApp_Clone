import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import networkReducer from '@/reducers/networkReducer';
import storageReducer from '@/reducers/storageReducer';
import toastReducer from '@/reducers/toastReducer';
import * as reducerTypes from '@/constants/reducerTypes';

const createReducer = (reducer, name) => (state, action) => {
  if (name !== action.name && state !== undefined) {
    return state;
  }
  return reducer(state, action);
}

const rootReducer = combineReducers({
  // Network reducers
  [reducerTypes.REQUEST_LOGIN]: createReducer(networkReducer, reducerTypes.REQUEST_LOGIN),
  [reducerTypes.REQUEST_GOOGLE_CODE]: createReducer(networkReducer, reducerTypes.REQUEST_GOOGLE_CODE),
  [reducerTypes.REQUEST_GOOGLE_TOKEN_CHECK]: createReducer(networkReducer, reducerTypes.REQUEST_GOOGLE_TOKEN_CHECK),
  [reducerTypes.REQUEST_GOOGLE_ID_TOKEN]: createReducer(networkReducer, reducerTypes.REQUEST_GOOGLE_ID_TOKEN),
  [reducerTypes.REQUEST_GOOGLE_REVOKE]: createReducer(networkReducer, reducerTypes.REQUEST_GOOGLE_REVOKE),
  [reducerTypes.REQUEST_GOOGLE_USERNAME]: createReducer(networkReducer, reducerTypes.REQUEST_GOOGLE_USERNAME),
  [reducerTypes.REQUEST_LOCATIONS_GET]: createReducer(networkReducer, reducerTypes.REQUEST_LOCATIONS_GET),
  [reducerTypes.REQUEST_REVIEWS_GET]: createReducer(networkReducer, reducerTypes.REQUEST_REVIEWS_GET),
  [reducerTypes.REQUEST_REVIEWS_POLL]: createReducer(networkReducer, reducerTypes.REQUEST_REVIEWS_POLL),
  [reducerTypes.REQUEST_LOCATION_REVIEWS_GET]: createReducer(networkReducer, reducerTypes.REQUEST_LOCATION_REVIEWS_GET),
  [reducerTypes.REQUEST_REVIEWS_REPLY]: createReducer(networkReducer, reducerTypes.REQUEST_REVIEWS_REPLY),
  [reducerTypes.REQUEST_QUESTIONS_GET]: createReducer(networkReducer, reducerTypes.REQUEST_QUESTIONS_GET),
  [reducerTypes.REQUEST_QUESTIONS_POLL]: createReducer(networkReducer, reducerTypes.REQUEST_QUESTIONS_POLL),
  [reducerTypes.REQUEST_LOCATIONS_QUESTIONS_GET]: createReducer(networkReducer, reducerTypes.REQUEST_LOCATIONS_QUESTIONS_GET),
  [reducerTypes.REQUEST_QUESTIONS_REPLY]: createReducer(networkReducer, reducerTypes.REQUEST_QUESTIONS_REPLY),
  [reducerTypes.REQUEST_POSTS_GET]: createReducer(networkReducer, reducerTypes.REQUEST_POSTS_GET),
  [reducerTypes.REQUEST_POSTS_POLL]: createReducer(networkReducer, reducerTypes.REQUEST_POSTS_POLL),
  [reducerTypes.REQUEST_POSTS_GET_MORE]: createReducer(networkReducer, reducerTypes.REQUEST_POSTS_GET_MORE),
  [reducerTypes.REQUEST_NOTIFICATIONS_GET]: createReducer(networkReducer, reducerTypes.REQUEST_NOTIFICATIONS_GET),
  [reducerTypes.REQUEST_ADMIN_LOGIN]: createReducer(networkReducer, reducerTypes.REQUEST_ADMIN_LOGIN),
  [reducerTypes.REQUEST_ANALYTICS_GET]: createReducer(networkReducer, reducerTypes.REQUEST_ANALYTICS_GET),
  [reducerTypes.REQUEST_NOTIFICATIONS_POST]: createReducer(networkReducer, reducerTypes.REQUEST_NOTIFICATIONS_POST),
  [reducerTypes.REQUEST_ERROR_LOGS_GET]: createReducer(networkReducer, reducerTypes.REQUEST_ERROR_LOGS_GET),

  // Storage reducers
  [reducerTypes.DATA_JWT]: createReducer(storageReducer, reducerTypes.DATA_JWT),
  [reducerTypes.DATA_LOCATIONS]: createReducer(storageReducer, reducerTypes.DATA_LOCATIONS),
  [reducerTypes.DATA_STREAM]: createReducer(storageReducer, reducerTypes.DATA_STREAM),
  [reducerTypes.DATA_PID]: createReducer(storageReducer, reducerTypes.DATA_PID),
  [reducerTypes.DATA_REVIEWS]: createReducer(storageReducer, reducerTypes.DATA_REVIEWS),
  [reducerTypes.DATA_QUESTIONS]: createReducer(storageReducer, reducerTypes.DATA_QUESTIONS),
  [reducerTypes.DATA_POSTS]: createReducer(storageReducer, reducerTypes.DATA_POSTS),
  [reducerTypes.DATA_USERNAME]: createReducer(storageReducer, reducerTypes.DATA_USERNAME),
  [reducerTypes.DATA_NOTIFICATION]: createReducer(storageReducer, reducerTypes.DATA_NOTIFICATION),
  [reducerTypes.DATA_ADMIN_JWT]: createReducer(storageReducer, reducerTypes.DATA_ADMIN_JWT),
  [reducerTypes.DATA_ANALYTICS]: createReducer(storageReducer, reducerTypes.DATA_ANALYTICS),
  [reducerTypes.DATA_ERROR_LOGS]: createReducer(storageReducer, reducerTypes.DATA_ERROR_LOGS),

  // Toast reducer.
  [reducerTypes.TOAST]: toastReducer,

  // Redux Form reducer
  form: formReducer
});

export default rootReducer;
