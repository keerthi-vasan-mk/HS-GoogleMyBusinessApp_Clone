import axios from 'axios';
import { BASE_API_URL, POSTS_URL, LOCATIONS_URL, MEDIA_URL, GDRIVE_MEDIA_URL } from '@/modal/constants/api';
import { ERROR_INVALID_TOKEN } from '@/constants/serverErrors';
import { BASE_FRONT_URL, SDK_API_KEY } from '@/modal/constants/api';

const UnknownError = message => {
  return {
    code: 'none',
    message: message ?? 'Unknown error',
  };
};

/**
 * Class that handles API requests to the
 * server from inside the Hootsuite modal.
 */
class APIRequest {
  constructor(postId, token) {
    this.postId = postId;
    this.token = token;

    /**
     * Checks for Google token error. If there is a token error,
     * close modal and refresh stream to log user out after 10 seconds.
     */
    axios.interceptors.response.use(null, errors => {
      if (errors.response.data.error.code === ERROR_INVALID_TOKEN) {
        setTimeout(() => {
          hsp.closeCustomPopup(SDK_API_KEY, window.pid);
          window.parent.postMessage('refresh', BASE_FRONT_URL);
        }, 10000);
      } else {
        throw errors;
      }
    });
  }

  manageError(error) {
    return Promise.reject(error.response?.data?.error ?? error.data?.error ?? UnknownError(`${error}`));
  }

  handlerNullResponse() {
    const message = 'Received null response from server possibly with status 400';
    throw {
      message,
      response: {
        status: 400,
        data: {
          code: 'node',
          message,
        },
      },
    };
  }

  /**
   * Method that gets a list of active
   * locations associated with the
   * account.
   *
   * @returns {Promise<Object[]>} Returns an array of location objects.
   */
  getLocations = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}${LOCATIONS_URL}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'content-type': 'application/json',
        },
      });

      let locations = [];
      response.data.accounts.forEach(account =>
        account.locations.forEach(location => {
          if (location.isActive || !location.canPost) {
            locations.push({
              address: location.address,
              label: location.name,
              value: location.locationNameId,
              disabled: !location.canPost, // If the user can't post, disable option
            });
          }
        }),
      );

      if (!response) {
        return this.handlerNullResponse();
      }
      return locations;
    } catch (error) {
      return this.manageError(error);
    }
  };

  /**
   * Method that gets a singular post by ID.
   *
   * @returns {Promise<Object>} Returns a post object.
   */
  getPost = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}${POSTS_URL}/${this.postId}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'content-type': 'application/json',
        },
      });

      if (!response) {
        return this.handlerNullResponse();
      }
      return response.data.post;
    } catch (error) {
      return this.manageError(error);
    }
  };

  /**
   * Method that uploads a file object to the
   * server.
   *
   * @param {Object} file
   * @param {String} locationId
   * @returns {Promise<Object>} Returns a media object containing public URL and key.
   */
  uploadMedia = async file => {
    const formData = new FormData();

    formData.append('mediaFormat', 'PHOTO');
    formData.append('file', file);

    try {
      const response = await axios.post(`${BASE_API_URL}${POSTS_URL}${MEDIA_URL}`, formData, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response) {
        return this.handlerNullResponse();
      }
      return response.data;
    } catch (error) {
      return this.manageError(error);
    }
  };

  /**
   * Method that uploads a file object to the
   * server and creates a media reference ID.
   *
   * @param {Object} data
   * @param {String} locationId
   * @returns {Promise<String>} Returns a media reference ID.
   */
  uploadGoogleDriveMedia = async data => {
    try {
      const response = await axios.post(`${BASE_API_URL}${POSTS_URL}${GDRIVE_MEDIA_URL}`, data, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': '	application/json',
        },
      });

      if (!response) {
        return this.handlerNullResponse();
      }
      return response.data;
    } catch (error) {
      return this.manageError(error);
    }
  };

  /**
   * Method that submits a new post's
   * data to the server as a POST request.
   *
   * @param {Object} data
   * @returns {Promise<Number>} Returns the status code if successful.
   */
  addPost = async data => {
    try {
      const response = await axios.post(`${BASE_API_URL}${POSTS_URL}`, data, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'content-type': 'application/json',
        },
      });

      if (!response) {
        return this.handlerNullResponse();
      }
      return response.status;
    } catch (error) {
      return this.manageError(error);
    }
  };

  /**
   * Method that submits the edited data to the
   * server as a PATCH request.
   *
   * @param {Object} data
   * @returns {Promise<Number>} Returns the status code if successful.
   */
  editPost = async data => {
    try {
      const response = await axios.patch(`${BASE_API_URL}${POSTS_URL}/${this.postId}`, data, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'content-type': 'application/json',
        },
      });

      if (!response) {
        return this.handlerNullResponse();
      }
      return response.status;
    } catch (error) {
      return this.manageError(error);
    }
  };
}

export default APIRequest;
