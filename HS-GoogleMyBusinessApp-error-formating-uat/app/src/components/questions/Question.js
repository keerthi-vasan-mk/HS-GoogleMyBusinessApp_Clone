import React, { Component } from 'react';
import PropTypes from 'prop-types';
import answerIcon from '@/assets/images/answerIcon.png';
import { relativeTime } from '@/components/common/DateFormatter';
import QuestionReply from './QuestionReply';
import QuestionResponse from './QuestionResponse';

export class Question extends Component {

  static propTypes = {
    addOrEditResponse: PropTypes.func.isRequired,
    deleteResponse: PropTypes.func.isRequired,
    question: PropTypes.object.isRequired
  }

  state = {
    replyView: false,
  }

  /**
   * Method that sets the `replyView` state variable.
   */
  toggleReply = () => this.setState({ replyView: !this.state.replyView })

  /**
   * Method that determines how many answers should be printed.
   */
  setNumOfResponses = () => this.setState({ answerIndex: this.state.answerIndex + 3 });

  renderReply = () => {
    const { addOrEditResponse, question } = this.props;
    const userAnswered = question.topAnswers
      ? question.topAnswers.find(answer => answer.currentUserReply)
      : null;

    return this.state.replyView
      ? <QuestionReply
        id={question.name}
        answerNameId={userAnswered ? userAnswered.name : null}
        addOrEditResponse={addOrEditResponse}
        close={this.toggleReply}
        defaultValue={userAnswered && userAnswered.text}
      />
      : !userAnswered
        ? <button className="button button--answer" onClick={this.toggleReply}>
          <img className="button__icon" src={answerIcon} alt="Reply Icon" />
          Answer
          </button>
        : null;
  }

  renderResponses = () => {
    const { answerIndex } = this.state;
    const { question, deleteResponse } = this.props;

    return question.topAnswers && question.topAnswers.map((answer, index) => {
      if ((this.state.replyView && answer.currentUserReply) || index >= answerIndex) {
        return null;
      }

      return (
        <QuestionResponse
          key={answer.name}
          answer={answer}
          toggleReply={this.toggleReply}
          deleteResponse={deleteResponse}
          questionNameId={question.name}
        />
      );
    })
  }

  renderMoreAnswersButton = () => {
    const { question } = this.props;
    const showMoreResponses = question.topAnswers < question.totalAnswerCount ? true : false;

    return showMoreResponses
      ? <button className="button button--text button--more-answers" onClick={this.setNumOfResponses}>
          More answers
        </button>
      : null;
  }

  render() {
    const { question } = this.props;
    const { text, updateTime } = question;

    return (
      <div className="location__questions-list__question">
        <div className="location__questions-list__question__info">
          <h5>{text}</h5>
          <h6>{relativeTime(updateTime)}</h6>
          <br />
          {this.renderReply()}
          {this.renderResponses()}
          {this.renderMoreAnswersButton()}
        </div>
        <br />
      </div>
    );
  }
}

export default Question;