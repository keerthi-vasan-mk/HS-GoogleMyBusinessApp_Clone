import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

/**
 * Class that renders a custom input field 
 * to pass into a Redux Form Field.
 */
export class AdminInput extends Component {
  
  static propTypes = {
    className: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    max: PropTypes.string,
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired
  }
  
  render() {
    const { className, type, placeholder, input, meta, max } = this.props;
    const inputClassName = meta.touched && meta.error 
      ? `${className} ${className}--error`
      : className;

    return (
      <Fragment>
        <input
          className={inputClassName}
          type={type}
          placeholder={placeholder}
          max={max}
          {...input}
        />
        <span className="error error--no-title">{meta.touched && meta.error}</span>
      </Fragment>
    );
  }
}

export default AdminInput;
