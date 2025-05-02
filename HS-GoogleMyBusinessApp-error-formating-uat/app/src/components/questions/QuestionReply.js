import React, { Component } from 'react';
import classnames from 'classnames';
import { GOOGLE_LOCAL_CONTENT_POLICIES_LINK } from '@/constants/links';

class QuestionReply extends Component {

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
   * Method that submits and saves the
   * user entered response. [Will be changed
   * to API call later].
   * 
   * @param {Object} event
   */
  handleSubmit = (event) => {
    const { close, addOrEditResponse, id, answerNameId } = this.props;
    const { reply } = this.state;
    event.preventDefault();
    close();
    addOrEditResponse(id, reply, answerNameId);
  }

  render() {
    const { close, defaultValue } = this.props;
    const { reply } = this.state;

    const disabled = reply.length < 1;
    const maxReached = reply.length >= 4000;
    const inputClassNames = classnames('question-reply__info__input', { "question-reply__info__input--max-reached": maxReached });
    const buttonClassNames = classnames('button button--reply button--reply-answer', { "button--disabled": disabled });

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="question-reply">
          <div className="question-reply__icon" />
          <div className="question-reply__info">
            <h5>(owner)</h5>
            <textarea
              className={inputClassNames}
              type="text"
              onChange={this.changeReply}
              placeholder="Add a public answer"
              defaultValue={defaultValue}
              maxLength={4000}
            />
            <p className="question-reply__info__subtitle">
              Please note that your reply will be displayed publicly on Google and must comply with Google’s local content policies.
              <a
                className="question-reply__info__subtitle__link"
                href={GOOGLE_LOCAL_CONTENT_POLICIES_LINK}
                target="_blank"
              >
                &nbsp;Learn more
              </a>
            </p>
            <div className="question-reply__info__buttons">
              <button
                className={buttonClassNames}
                type="submit"
                disabled={disabled}
              >
                Post Answer
              </button>
              <button
                className="button button--text button--cancel"
                onClick={close}
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

export default QuestionReply;