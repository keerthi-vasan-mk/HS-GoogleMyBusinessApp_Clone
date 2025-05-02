import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import { GOOGLE_LOCAL_CONTENT_POLICIES_LINK } from '@/constants/links';

/**
 * Class that handles owner's replies
 * to reviews.
 */
class ReviewReply extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    addOrEditReply: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    defaultValue: PropTypes.string,
  }

  state = {
    reply: ""
  }

  /**
   * Method that sets the `reply` state variable.
   * 
   * @param {Object} event
   */
  changeReply = (event) => this.setState({ reply: event.target.value });

  /**
   * Method that sends an owner's reply
   * to be posted.
   * 
   * @param {Object} event
   */
  handleSubmit = (event) => {
    const { close, addOrEditReply, id } = this.props;
    const { reply } = this.state;
    event.preventDefault();
    close();
    addOrEditReply(id, reply);
  }

  render() {
    const { close, defaultValue } = this.props;
    const { reply } = this.state;

    const disabled = reply.length < 1;
    const maxReached = reply.length >= 1000;
    const inputClassNames = classnames(
      'reply__info__input',
      { "reply__info__input--disabled": disabled, "reply__info__input--max-reached": maxReached }
    );
    const buttonClassNames = classnames('button button--reply button--post', { "button--disabled": disabled });

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="reply">
          <div className="reply__icon" />
          <div className="reply__info">
            <h5>(owner)</h5>
            <input
              defaultValue={defaultValue}
              className={inputClassNames}
              type="text"
              onChange={this.changeReply}
              placeholder="Your reply"
              maxLength={1000}
            />
            <p className="reply__info__subtitle">
              Please note that your reply will be displayed publicly on Google and must comply with Google’s local content policies.
              <a
                className="reply__info__subtitle__link"
                href={GOOGLE_LOCAL_CONTENT_POLICIES_LINK}
                target="_blank"
              >
                &nbsp;Learn more
              </a>
            </p>
            <div className="reply__info__buttons">
              <button
                className={buttonClassNames}
                disabled={disabled}
                type="submit"
              >
                Post reply
              </button>
              <button
                className="button button--text button--cancel"
                onClick={close}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default ReviewReply;
