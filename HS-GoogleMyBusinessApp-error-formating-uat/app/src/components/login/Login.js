import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from '@/assets/images/logo.png';
import { handleServerError } from '@/utils/errorHandler';
import { authorizeTokens, getUserTokenStatus } from '@/actionCreators/authActionCreators';
import { openToast } from '@/actions/toastActions';
import { GOOGLE_CLIENT_ID, GOOGLE_GMB_SCOPE } from '@/constants/google';
// import { ToastType } from '@/constants/enums';
import { ERROR_GOOGLE_POPUP_CLOSED } from '@/constants/serverErrors';
// import { MSG_GENERAL_ERROR } from '@/constants/errorMessages';
import { LOCATIONS } from '@/constants/routes';
import { toast } from 'react-toastify';

let client;

export class Login extends Component {
  static propTypes = {
    authorizeTokens: PropTypes.func.isRequired,
    getUserTokenStatus: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    openToast: PropTypes.func.isRequired,
  };

  state = {
    googleLoginUrl: null,
  };
  componentDidMount() {
    toast.dismiss();
    this.handleLogin();
  }

  handleLogin = (event) => {
    client = window.google.accounts.oauth2.initCodeClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: `openid profile email ${GOOGLE_GMB_SCOPE}`,
      ux_mode: 'popup',
      callback: this.onGoogleLoginSuccess,
    });
  };

  onGoogleLoginSuccess = async (response) => {
    const { authorizeTokens, history, getUserTokenStatus, openToast } = this.props;
    // Handle all errors except if a user manually closes the authentication popup.
    if (response.error && response.error !== ERROR_GOOGLE_POPUP_CLOSED) {
      // This error comes from Google directly and can be any number of things.
      // Just use a generic error message.
      // openToast({ type: ToastType.ERROR, message: MSG_GENERAL_ERROR });
      toast.error('It looks like something went wrong. Please refresh the page and try again.')
      return;
    } else if (response.error === ERROR_GOOGLE_POPUP_CLOSED) {
      return;
    }

    try {
      // Check if user already has granted Googled permission on another stream
      // const validRefreshToken = await getUserTokenStatus(response.code);

      // if (!validRefreshToken) {
      await authorizeTokens(response.code);
      // }

      return history.push(LOCATIONS);
    } catch (error) {
      handleServerError(error);
    }
  };
  getAuthCode() {
    // Request authorization code and obtain user consent
    client.requestCode();
  }

  render() {
    return (
      <div className="login-gmb">
        <img className="login-gmb__logo" src={logo} alt="Google My Business logo" />
        <button className="button login-gmb__button" onClick={this.getAuthCode}>
          Login to Google My Business
        </button>
      </div>
    );
  }
}

const mapDispatchToProps = {
  authorizeTokens,
  getUserTokenStatus,
  openToast,
};

export default connect(
  null,
  mapDispatchToProps,
)(Login);
