import React, { Component } from 'react';
import sadOwl from '@/assets/images/sadOwl.png';

class NotFound extends Component {
  render() {
    return (
      <div className="error-splash-page">
      <p className="error-splash-page__title">404</p>
      <img className="error-splash-page__image" src={sadOwl} alt="Sad Owl" />
      <p className="error-splash-page__subtitle">Page Not Found</p>
    </div>
    )
  }
}

export default NotFound;
