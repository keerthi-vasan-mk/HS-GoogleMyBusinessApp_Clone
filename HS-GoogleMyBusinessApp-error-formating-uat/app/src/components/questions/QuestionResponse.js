import React, { Component } from 'react';
import editIcon from '@/assets/images/editIcon.png';
import deleteIcon from '@/assets/images/deleteIcon.png';
import { relativeTime } from '@/components/common/DateFormatter';

/**
 * Class that displays an owner's response 
 * to a question and allows them to edit or 
 * delete responses.
 */
class QuestionResponse extends Component {
  render() {
    const { answer, toggleReply, deleteResponse, questionNameId} = this.props;
    const { author, text, updateTime, currentUserReply, name } = answer;
    // If the current user responded then we want them to appear as the owner regardless who
    // actually answered the question. To do this we remove the user's name and photo.
    if (currentUserReply) {
      delete author.displayName;
      delete author.profilePhotoUrl;
    }

    return (
      <div className="question-response">
        {author.profilePhotoUrl 
          ? <img
              className="question-response__icon"
              src={author.profilePhotoUrl }
              alt="User's Profile Picture"
            />
          : <div className="question-response__icon question-response__icon--owner" />
        }
        <div className="question-response__info">
          <div className="question-response__info__title">
            <h5>{author.displayName || "(owner)"}</h5>
            {currentUserReply
              ? <div className="question-response__info__title__buttons">
                  <img
                    src={editIcon}
                    alt="Edit Icon"
                    onClick={toggleReply}
                  />
                  <img
                    src={deleteIcon}
                    alt="Delete Icon"
                    onClick={() => deleteResponse(questionNameId, name)}
                  />
                </div>
              : null}
          </div>
          <h6>{relativeTime(updateTime)}</h6>
          <br />
          <p>{text}</p>
        </div>
      </div>
    );
  }
}

export default QuestionResponse;