import React, { Component } from 'react';
import classnames from 'classnames';
import textIcon from '@/assets/images/textIcon.png';

/**
 * Class that renders the text area field
 * in the Hootsuite dashboard.
 */
class TextField extends Component {
  render() {
    const { handleTextInput, text = '' } = this.props
    const charCountClassNames = classnames(
      'new-post__field__header__char-count',
      { 'new-post__field__header__char-count--error': text.length >= 1500 }
    );

    return (
      <div className="new-post__field">
        <div className="new-post__field__header">
          <div className="new-post__field__header__title">
            <img src={textIcon} alt="Text Icon" />
            <h4>Text</h4>
          </div>
          <p className={charCountClassNames}>{text.length}/1500</p>
        </div>
        <textarea
          value={text}
          onChange={handleTextInput}
          maxLength="1500"
          placeholder="Enter your text and links..."
        />
      </div>
    );
  }
}

export default TextField;