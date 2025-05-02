import React, { Component } from 'react';
import sadOwl from '@/assets/images/sadOwl.png';

class ErrorSplashPage extends Component {
  render() {
    return (
      <div className="error-splash-page">
        <p className="error-splash-page__title">Oops! Something went wrong.</p>
        <img className="error-splash-page__image" src={sadOwl} alt="Sad Owl" />
        <p className="error-splash-page__subtitle">Please refresh your browser and try again.</p>
      </div>
    )
  }
}

export default ErrorSplashPage;
