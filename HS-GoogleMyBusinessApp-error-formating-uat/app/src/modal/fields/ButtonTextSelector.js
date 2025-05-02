import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Select from 'react-select';
import buttonIcon from '@/assets/images/buttonIcon.png';
import { BUTTON_OPTIONS } from '@/constants/enums';

/**
 * Class that renders the button text 
 * select field in the Hootsuite dashboard.
 */
class ButtonTextSelector extends Component {

  static propTypes = {
    selectedButton: PropTypes.object,
    handleSelect: PropTypes.func.isRequired
  }

  /**
   * Method that scrolls the bottom of
   * the select menu into view when 
   * opened.
   */
  scrollIntoView = () => {
    window.setTimeout(() => {
      const post = document.getElementsByClassName('new-post')[0];
      post.scrollTo(0, post.scrollHeight);
    }, 50);
  }

  render() {
    const { selectedButton, handleSelect } = this.props;
    const value = (selectedButton && selectedButton.value !== '') ? selectedButton : null;

    return (
      <div className="new-post__field">
        <div className="new-post__field__header">
          <div className="new-post__field__header__title">
            <img src={buttonIcon} alt="Button Icon" />
            <h4>Button (Optional)</h4>
          </div>
        </div>
        <div className="new-post__field__select-container">
          <Select
            classNamePrefix="select"
            defaultValue={value}
            onChange={handleSelect}
            options={BUTTON_OPTIONS}
            placeholder="Select button text..."
            hideSelectedOptions={false}
            isClearable
            onMenuOpen={this.scrollIntoView}
          />
        </div>
      </div>
    );
  }
}

export default ButtonTextSelector;