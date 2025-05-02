import React, { Component } from 'react';
import { SDK_API_KEY, BASE_FRONT_URL } from '@/modal/constants/api';

class Success extends Component {

  closeAndReload = () => {
    hsp.closeCustomPopup(SDK_API_KEY, window.pid);
    window.parent.postMessage('refresh', BASE_FRONT_URL);
  }

  render() {
    return (
      <div className="success-page">
        <h3>Your post has been successfully {this.props.action}!</h3>
        <svg className="checkmark" viewBox="0 0 52 52">
          <circle className="checkmark__circle" cx="26" cy="26" r="100" fill="none" />
          <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <button
          className="button button--hootsuite button--hootsuite--centered"
          onClick={this.closeAndReload}
        >
          Close
        </button>
      </div>
    );
  }
}

export default Success;