import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Banner extends Component {

  static propTypes = {
    message: PropTypes.string.isRequired,
    refresh: PropTypes.func.isRequired
  }
  
  render() {
    return (
      <div className="banner" onClick={this.props.refresh}>
        <p className="banner__text">{this.props.message}</p>
      </div>
    );
  }
}

export default Banner;
