import PropTypes from 'prop-types';
import React, { Component } from 'react';
import editIcon from '@/assets/images/editIcon.png';
import deleteIcon from '@/assets/images/deleteIcon.png';
import { relativeTime } from '@/components/common/DateFormatter';

/**
 * Class that displays an owner's response 
 * to a review and allows them to edit or 
 * delete responses.
 */
class ReviewResponse extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    toggleReply: PropTypes.func.isRequired,
    deleteReply: PropTypes.func.isRequired,
    response: PropTypes.object.isRequired,
  }

  render() {
    const { response, id, toggleReply, deleteReply } = this.props;
    const { comment, name, updateTime } = response;

    return (
      <div className="response">
        <div className="response__icon" />
        <div className="response__info">
          <div className="response__info__title">
            <h5>{name} (owner)</h5>
            <div className="response__info__title__buttons">
              <img
                alt="Edit Icon"
                src={editIcon}
                onClick={toggleReply}
              />
              <img
                alt="Delete Icon"
                src={deleteIcon}
                onClick={() => deleteReply(id)}
              />
            </div>
          </div>
          <h6>{relativeTime(updateTime)}</h6>
          <br />
          <p>{comment}</p>
        </div>
      </div>
    );
  }
}

export default ReviewResponse;
