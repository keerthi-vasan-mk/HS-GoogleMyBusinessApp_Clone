import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import locationIcon from '@/assets/images/locationIconGrey.png';
import Option from './Option';

/**
 * Class that renders the location multi
 * select in the Hootsuite dashboard.
 */
class LocationSelector extends Component {
  
  static propTypes = {
    locations: PropTypes.array.isRequired,
    selectedLocations: PropTypes.array,
    handleMultiSelect: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool
  }
  
  render() {
    const { locations, selectedLocations, handleMultiSelect, isDisabled } = this.props;

    return (
      <div className="new-post__field">
        <div className="new-post__field__header">
          <div className="new-post__field__header__title">
            <img src={locationIcon} alt="Location Icon" />
            <h4>{isDisabled ? 'Posted To' : 'Post To'}</h4>
          </div>
        </div>
        <div className="new-post__field__select-container">
          <Select
            classNamePrefix="select-multi"
            value={selectedLocations}
            onChange={handleMultiSelect}
            options={locations}
            placeholder="Select locations/listings..."
            components={{ Option: Option }}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            isDisabled={isDisabled}
            isOptionDisabled={option => option.disabled}
            isSearchable
            isMulti
          />
        </div>
      </div>
    );
  }
}

export default LocationSelector;