import React, { Component } from 'react';
import { GOOGLE_CHAINS_LINK } from '@/constants/links';

/**
 * Class that renders the custom option
 * view in a multi select.
 */
class Option extends Component {
  render() {
    const { data, innerRef, innerProps, isSelected, isDisabled } = this.props;
    const disabledClass = isDisabled ? ' select-multi__option--disabled' : '';

    return (
      <div className={`select-multi__option${disabledClass}`} ref={innerRef} {...innerProps}>
        <input
          checked={isSelected}
          value={data.value}
          type="checkbox"
          onChange={() => null} // Needed to prevent React `readOnly` error
        />
        <div style={{ width: '100%' }}>
          <div className="header">
            <h4>{data.label}</h4>
            {isDisabled &&
              <a
                href={GOOGLE_CHAINS_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn about chains
              </a>
            }
          </div>
          <p>{data.address}</p>
        </div>
      </div>
    );
  }
}


export default Option;