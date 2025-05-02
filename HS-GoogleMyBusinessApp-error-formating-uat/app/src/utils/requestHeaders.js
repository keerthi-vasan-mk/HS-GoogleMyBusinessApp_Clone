import { getJwtToken, getAdminJwtToken } from '@/selectors/authSelectors';

/**
* Utility function to create a general request header.
*
* @returns {Object} Returns the header object
*/
export const createRequestHeader = () => ({
  headers: {
    'content-type': 'application/json',
  }
});

/**
* Utility function to create a general authenticated request header.
*
* @param {Object} state
* @returns {Object} Returns the header object
*/
export const createAuthRequestHeader = (state) => ({
  headers: {
    'Authorization': `Bearer ${getJwtToken(state).jwt}`,
    'content-type': 'application/json',
  },
});

/**
* Utility function to create an admin authenticated request header.
*
* @param {Object} state
* @returns {Object} Returns the header object
*/
export const createAdminAuthRequestHeader = (state) => ({
  headers: {
    'Authorization': `Bearer ${getAdminJwtToken(state)}`,
    'content-type': 'application/json',
  },
});
