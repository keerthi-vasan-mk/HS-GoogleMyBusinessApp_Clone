import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { STREAM_OPTIONS } from '@/constants/enums';

export class AdminSelect extends Component {
  
  static propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired
  }
  
  render() {
    const { input, meta } = this.props;
    const selectClassName = meta.touched && meta.error 
      ? 'admin-portal--error'
      : 'admin-portal';

    return (
      <Fragment>
        <Select
          {...input}
          classNamePrefix={selectClassName}
          options={STREAM_OPTIONS}
          onChange={value => input.onChange(value)} 
          onBlur={() => input.onBlur(input.value)}
          closeMenuOnSelect={false}
          isMulti
        />
        <span className="error error--no-title">{meta.touched && meta.error}</span>
      </Fragment>
    );
  }
}

export default AdminSelect;
