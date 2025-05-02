import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import ReactStars from 'react-stars';
import ReactTooltip from 'react-tooltip';
import * as hexcodes from '@/constants/hexcodes';
import { relativeTime } from '@/components/common/DateFormatter';
import replyIcon from '@/assets/images/replyIcon.png';
import ReviewReply from './ReviewReply';
import ReviewResponse from './ReviewResponse';

export class Review extends Component {

  static propTypes = {
    review: PropTypes.object.isRequired,
    addOrEditReply: PropTypes.func.isRequired,
    deleteReply: PropTypes.func.isRequired,
  }

  state = {
    replyView: false
  }

  /**
   * Method that toggles the `replyView` state variable.
   */
  toggleReply = () => this.setState({ replyView: !this.state.replyView })

  /**
   * Method that converts a number
   * in lexical form to an integer.
   *
   * @param {String}
   * @returns {number} Returns the numerical representation of a word.
   */
  convertToNum = (word) => {
    switch (word) {
      case "ONE": return 1;
      case "TWO": return 2;
      case "THREE": return 3;
      case "FOUR": return 4;
      case "FIVE": return 5;
      default: return 0;
    }
  }

  renderReply = (review) => {
    const { name, reviewReply } = review;
    const { addOrEditReply } = this.props;

    return this.state.replyView
      ? <ReviewReply
        close={this.toggleReply}
        addOrEditReply={addOrEditReply}
        id={name}
        defaultValue={reviewReply && reviewReply.comment}
      />
      : <Fragment>
          <button className="button button--reply" onClick={this.toggleReply}>
            <img alt="Reply Icon" className="button__icon" src={replyIcon} />
            Reply
          </button>
        <ReactTooltip
          id="reply-disable"
          place="top"
          effect="solid"
          multiline={true}
        />
      </Fragment>;
  }

  render() {
    const { replyView } = this.state;
    const { review, deleteReply } = this.props;
    const { reviewer, starRating, createTime, comment, name, reviewReply } = review;

    return (
      <div className="location__reviews-list__review">
        <img
          alt="Reviewer's Profile Photo"
          className="location__reviews-list__review__icon"
          src={reviewer.profilePhotoUrl}
        />
        <div className="location__reviews-list__review__info">
          <h5>{reviewer.displayName}</h5>
          <ReactStars
            className="location__reviews-list__review__info__stars"
            count={5}
            color1={hexcodes.DISABLED_STAR}
            color2={hexcodes.ENABLED_STAR}
            edit={false}
            size={13}
            value={this.convertToNum(starRating)}
          />
          <h6>{relativeTime(createTime)}</h6>
          <br />
          {comment
            ? <p>{comment}</p>
            : <p className="location__reviews-list__review__info__no-comment">This user didn't write a review, and has just left a rating.</p>
          }
          <br />

          {reviewReply && !replyView
            ? <ReviewResponse
              response={review.reviewReply}
              id={name}
              deleteReply={deleteReply}
              toggleReply={this.toggleReply}
            />
            : this.renderReply(review)
          }

        </div>
        <br />
      </div>
    );
  }
}

export default Review;
