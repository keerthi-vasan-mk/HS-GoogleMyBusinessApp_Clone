import React, { Component } from 'react';

/**
 * Class that renders the button link 
 * text field in the Hootsuite dashboard.
 */
class ButtonLinkField extends Component {
  render() {
    const { buttonLink, handleButtonLinkInput } = this.props;

    return (
      <div className="new-post__field">
        <div className="new-post__field__header">
          <div className="new-post__field__header__title">
            <h4>Link for Button</h4>
          </div>
        </div>
        <input
          className="new-post__field--text-input"
          value={buttonLink}
          onChange={handleButtonLinkInput}
          type="text"
        />
      </div>
    );
  }
}

export default ButtonLinkField;