import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from '@/actionCreators/authActionCreators';
import { saveStreamType, saveStreamPid } from '@/actionCreators/streamActionCreators';
import { MSG_HOOTSUITE_AUTH_ERROR } from '@/constants/errorMessages.js';
import MDSpinner from 'react-md-spinner';
import { LOADING_WHEEL_COLOR } from '@/constants/hexcodes';

export class Home extends Component {

  static propTypes = {
    login: PropTypes.func.isRequired,
    saveStreamType: PropTypes.func.isRequired,
    saveStreamPid: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  };

  state = {
    authError: false,
  }

  async componentWillMount() {
    const { login, history, saveStreamType, saveStreamPid } = this.props;
    const { stream, uid, pid, ts, token } = window;
    const payload = {
      uid,
      pid,
      ts,
      token,
    };
    
    // Streams will be in format 'stream-{{type}}'.
    // Remove the 'stream' prefix and only leave the type.
    const streamType = stream.substr(7);

    // Save the stream type to display.
    saveStreamType(streamType);

    // Save the stream ID.
    saveStreamPid(pid);

    // If a user successfully logs in then an initial page route should be returned
    // in the response. If it is not then consider it an error and render the error message.
    try {
      const response = await login(payload);
      const { success, page } = response.data;
      if (success && page) {
        if (page === 'stream') {
          history.push(streamType);
        }
        else {
          history.push(page);
        }
      } 
      else {
        this.setState({ authError: true });
      }
    } 
    catch (error) {
      this.setState({ authError: true });
    }
  }

  render() {
    const { authError } = this.state;
    return (
      <div className='home'>
        {authError
          ? MSG_HOOTSUITE_AUTH_ERROR
          : <MDSpinner singleColor={LOADING_WHEEL_COLOR} size="40" />} 
      </div>
    );
  }
}

const mapDispatchToProps = {
  login,
  saveStreamType,
  saveStreamPid,
};

export default connect(null, mapDispatchToProps)(Home);
