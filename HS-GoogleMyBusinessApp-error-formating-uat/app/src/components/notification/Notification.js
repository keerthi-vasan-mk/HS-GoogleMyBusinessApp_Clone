import React, { Component, Fragment } from 'react'
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as notificationTypes from '@/constants/notificationTypes';
import infoIcon from 'assets/images/infoIcon.png';
import warningIcon from 'assets/images/warningIcon.png';
import closeIcon from 'assets/images/closeIcon.png';

/**
 * Class that renders a dismissible notification.
 */
export class Notification extends Component {

  static propTypes = {
    type: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    dismiss: PropTypes.func,
    isPostsStream: PropTypes.bool
  }

  render() {
    const { type, text, dismiss, isPostsStream } = this.props;
    const isWarning = type === notificationTypes.WARNING_NOTIFICATION_TYPE;
    const notificationClassNames = classnames(
      'notification',
      {
        'notification--posts': isPostsStream,
        'notification--warn': isWarning,
        'notification--info': !isWarning
      }
    );
    const notificationTextClassNames = classnames(
      'notification__text',
      {
        'notification__text--warn': isWarning,
        'notification__text--info': !isWarning
      }
    );

    return (
      <Fragment>
        <div className={notificationClassNames}>
          <img className="notification__icon" src={isWarning ? warningIcon : infoIcon} />
          <p className={notificationTextClassNames}>{text}</p> 
          <img className="notification__close-icon" src={closeIcon} onClick={dismiss} />
        </div>
        {/* 
          This prevents the bevel effect when using two different colored borders,
          and allows the notification to appear as it's own card. 
        */}
        {isPostsStream
          ? <div className="border-bottom border-bottom--posts" />
          : <div className="border-bottom" />
        }
      </Fragment>
    );
  }
}

export default Notification;