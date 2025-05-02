import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ToastType } from '@/constants/enums';
import { TOAST } from '@/constants/reducerTypes';
import { closeToast } from '@/actions/toastActions';


export class ToastMessage extends Component {

  static propTypes = {
    toastInfo: PropTypes.object.isRequired,
  };

  render() {
    const { toastInfo } = this.props;

    const toastContentClassName = classNames(
      'toast__content',
      {
        "toast__content--info": toastInfo.type === ToastType.INFO,
        "toast__content--error": toastInfo.type === ToastType.ERROR,
      }
    );

    return (
      toastInfo.message && toastInfo.isOpen
        ? <div className="toast">
            <div className={toastContentClassName}>{toastInfo.message}</div>
          </div>
        : null
    );
  }
}

const mapStateToProps = (state) => ({
  toastInfo: state[TOAST],
});

const mapDispatchToProps = {
  closeToast,
};

const Toast = connect(mapStateToProps, mapDispatchToProps)(ToastMessage);

export { Toast };
