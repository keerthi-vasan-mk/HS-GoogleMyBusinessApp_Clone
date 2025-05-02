import { deposit } from '@/actions/storageActions';
import * as reducerTypes from '@/constants/reducerTypes';

/**
 * @param {string} stream inital stream to load when authorization is successful
 */
export const saveStreamType = (stream) => (dispatch) => {
  const { DATA_STREAM } = reducerTypes;
  dispatch(deposit(DATA_STREAM, stream));
};

/**
 * @param {string} pid stream ID
 */
export const saveStreamPid = (pid) => (dispatch) => {
  const { DATA_PID } = reducerTypes;
  dispatch(deposit(DATA_PID, pid));
};
