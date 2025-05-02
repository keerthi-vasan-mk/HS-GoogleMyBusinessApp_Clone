import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, Field, propTypes, SubmissionError } from 'redux-form';
import { withRouter } from 'react-router';
import MDSpinner from 'react-md-spinner';
import { required } from '@/utils/generic';
import { adminLogin } from '@/actionCreators/authActionCreators';
import { REQUEST_ADMIN_LOGIN } from '@/constants/reducerTypes';
import { LOADING_WHEEL_COLOR } from '@/constants/hexcodes';
import { ADMIN_PORTAL } from '@/constants/routes';
import AdminInput from './AdminInput';
import GMBLogo from 'assets/images/logo.png';

/**
 * Class that renders the Admin login page.
 */
export class AdminLogin extends Component {

  static propTypes = {
    ...propTypes,
    adminLogin: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    adminLoginRequest: PropTypes.object.isRequired
  }

  /**
   * Method that logins the user into the 
   * admin portal.
   */
  login = async (values) => {
    const { adminLogin, history } = this.props;

    try {
      await adminLogin(values);
      history.push(ADMIN_PORTAL);
    } catch (error) {
      const message = (error && error.response && error.response.data.message) || error.message;
      throw new SubmissionError({ password: message });
    }
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className="admin-login">
        <form className="admin-login__card" onSubmit={handleSubmit(this.login)}>
          <img
            className="admin-login__card__logo"
            src={GMBLogo}
            alt="GMB Logo"
          />
          <h1 className="admin-login__card__title">GMB Admin Portal</h1>
          <p className="admin-login__card__text">Sign in using your Hootsuite administrator credentials</p>
          <p className="admin-login__card__label">Username</p>
          <Field
            name="username"
            className="admin-login__card__input"
            component={AdminInput}
            type="text"
            validate={[required]}
          />
          <p className="admin-login__card__label">Password</p>
          <Field
            name="password"
            className="admin-login__card__input"
            component={AdminInput}
            type="password"
            validate={[required]}
          />
          {this.props.adminLoginRequest.isLoading
            ? <MDSpinner className="admin-login__card__spinner" singleColor={LOADING_WHEEL_COLOR} size="40" />
            : <button
                className="button button--admin-login"
                type="submit"
                disabled={this.props.invalid || this.props.pristine}
              >
                Login
              </button>
          }
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  adminLoginRequest: state[REQUEST_ADMIN_LOGIN]
});

const mapDispatchToProps = {
  adminLogin
};

export default compose(
  reduxForm({
    form: 'adminLogin'
  }),
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(AdminLogin);
