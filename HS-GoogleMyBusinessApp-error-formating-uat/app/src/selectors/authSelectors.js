import { DATA_JWT, DATA_PID, DATA_ADMIN_JWT } from '@/constants/reducerTypes';

export const getJwtToken = (state) => {
  const pid = state[DATA_PID].data;
  const data = state[DATA_JWT].data;
  return data.find(token => token.pid === pid);
};

export const getAdminJwtToken = (state) => {
  return state[DATA_ADMIN_JWT].data && state[DATA_ADMIN_JWT].data.token;
};
