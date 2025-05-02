import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import MDSpinner from 'react-md-spinner';
import { connect } from 'react-redux';
import locationIcon from '@/assets/images/locationIcon.png';
import MenuBar from '@/components/menubar/MenuBar';
import Question from '@/components/questions/Question';
import Banner from '@/components/banner/Banner';
import Notification from '@/components/notification/Notification';
import ErrorSplashPage from '@/components/errorPage/ErrorSplashPage';
import { getStartingQuestions, getMoreQuestions, addOrEditResponse, deleteResponse, getQuestionPolling } from '@/actionCreators/questionActionCreators';
import { checkForNotification, dismissNotification } from '@/actionCreators/notificationActionCreators';
import { DATA_QUESTIONS, REQUEST_QUESTIONS_GET, DATA_NOTIFICATION } from '@/constants/reducerTypes';
import { QUESTIONS_STREAM_TYPE } from '@/constants/streamTypes';
import { MSG_REFRESH_REPLY } from '@/constants/errorMessages';
import { LOADING_WHEEL_COLOR } from '@/constants/hexcodes';
import { POLLING_INTERVAL } from '@/constants/numbers';
import { handleServerError, handleStreamError } from '@/utils/errorHandler';
import { areAllInputsClosed } from '@/utils/generic';
import { toast } from 'react-toastify';

export class Questions extends Component {

  static propTypes = {
    questions: PropTypes.array.isRequired,
    notification: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]).isRequired,
    getStartingQuestions: PropTypes.func.isRequired,
    getMoreQuestions: PropTypes.func.isRequired,
    addOrEditResponse: PropTypes.func.isRequired,
    deleteResponse: PropTypes.func.isRequired,
    questionsRequest: PropTypes.object.isRequired,
    getQuestionPolling: PropTypes.func.isRequired,
    checkForNotification: PropTypes.func.isRequired,
    dismissNotification: PropTypes.func.isRequired
  }

  state = {
    isMenuDropdownOpen: false,
    newContent: false,
    pollingInterval: null,
    loadingError: false
  }

  /**
   * Lifecycle method that gets initial questions
   * and stores them in Redux store and starts polling.
   */
  async componentDidMount() {
    const { getStartingQuestions, checkForNotification } = this.props;
    toast.dismiss();

    const handleRefresh = async () => {
      try {
        // Gets all inputs, checks if they've been set, and returns the total
        // that have been set. If none were set, it refreshes the stream
        if (areAllInputsClosed('question-reply__info__input')) {
          await getStartingQuestions();
          await checkForNotification({ streamType: QUESTIONS_STREAM_TYPE });
        } else {
          handleStreamError(MSG_REFRESH_REPLY);
        }
      } catch (error) {
        handleServerError(error);
      }
    };

    // Handle the Hootsuite refresh event for this stream.
    window.hsp.bind('refresh', () => {
      this.setState({ loadingError: false }, handleRefresh);
    });

    try {
      await getStartingQuestions();
      await checkForNotification({ streamType: QUESTIONS_STREAM_TYPE });
      this.startNewContentPolling();
      

    }
    catch (error) {
      /*commented full page errors and made it into error toasts*/

      handleServerError(error);
      // this.setState({ loadingError: true });
    }
  }

  /**
   * Lifecycle method used to stop polling.
   */
  componentWillUnmount() {
    this.stopContentPolling();
  }

  /**
   * Method that gets up to three more
   * questions.
   */
  getMoreQuestions = async (locationNameId, nextPageToken) => {
    const { getMoreQuestions } = this.props;

    try {
      await getMoreQuestions(locationNameId, nextPageToken);
    }
    catch (error) {
      handleServerError(error);
    }
  }

  /**
   * Method that adds or updates an owner's response
   * to a question.
   *
   * @param {String} questionNameId
   * @param {String} answer
   * @param {String} answerNameId
   */
  addOrEditResponse = async (questionNameId, answer, answerNameId = null) => {
    const { addOrEditResponse } = this.props;

    try {
      await addOrEditResponse(questionNameId, answer, answerNameId);
    }
    catch (error) {
      handleServerError(error);
    }
  }

  /**
   * Method that deletes an owner's
   * response to a question.
   *
   * @param {String} questionNameId
   * @param {String} answer
   */
  deleteResponse = async (questionNameId, answerNameId) => {
    const { deleteResponse } = this.props;

    try {
      await deleteResponse(questionNameId, answerNameId);
    }
    catch (error) {
      handleServerError(error);
    }
  }

  /**
   * Starts polling for new questions.
   */
  startNewContentPolling = () => {
    const { questions, getQuestionPolling } = this.props;

    const interval = setInterval(async () => {
      try {
        const newQuestions = await getQuestionPolling();
        // Check if there are new questions for any locations
        questions.forEach(location => {
          const newQuestionLocation = newQuestions.find(newLocation => newLocation.locationNameId === location.locationNameId);
          if (newQuestionLocation && location.questions.totalSize !== newQuestionLocation.questions.totalSize) {
            this.setState({ newContent: true });
            this.stopContentPolling();
          }
        });
      } catch (error) {
        handleServerError(error);
      }
    }, POLLING_INTERVAL);

    this.setState({ pollingInterval: interval });
  }

  /**
   * Stops the polling interval.
   */
  stopContentPolling = () => {
    const { pollingInterval } = this.state;
    clearInterval(pollingInterval);
    this.setState({ pollingInterval: null });
  }

  /**
   * Method that removes the 'New Content' banner
   * and refreshes the stream with new questions.
   */
  getNewContent = () => {
    this.setState({ newContent: false });
    this.props.getStartingQuestions();
  }

  /**
   * Method that toggles the dropdown state in order to allow menu close on click outside
   * the dropdown.
   */
  toggleMenuDropdown = () => this.setState({ isMenuDropdownOpen: !this.state.isMenuDropdownOpen });

  render() {
    const { questions, notification, dismissNotification, questionsRequest } = this.props;
    const { isMenuDropdownOpen, newContent, loadingError } = this.state;
    
    /*commented full page errors and made it into error toasts*/
    // return loadingError ? <ErrorSplashPage /> : (
      return (
      <div className="stream-container">
        <MenuBar isMenuDropdownOpen={isMenuDropdownOpen} toggleMenuDropdown={this.toggleMenuDropdown} />
        {newContent
          ? <Banner message="New Content" refresh={this.getNewContent} />
          : null}
        <div className="content" onClick={isMenuDropdownOpen ? this.toggleMenuDropdown : undefined}>
          {notification && !Array.isArray(notification) && !notification.dismissed &&
            <Notification
              type={notification.type}
              text={notification.text}
              dismiss={dismissNotification}
            />
          }
          {questionsRequest.isFetching
            ? <MDSpinner className="loading-icon" singleColor={LOADING_WHEEL_COLOR} size="40" />
            : questions.map(location => (
              <div className="location" key={location.locationNameId}>
                <img className="location__icon" src={locationIcon} alt="Location Icon" />
                <h4>{location.locationName}</h4>
                <br />
                <p className="location__address">{location.locationAddress}</p>
                <div className="location__questions-list">
                  {location.questions && location.questions.questions
                    ? location.questions.questions.map(question => (
                      <Question
                        key={question.name}
                        question={question}
                        addOrEditResponse={this.addOrEditResponse}
                        deleteResponse={this.deleteResponse}
                      />
                    ))
                    : <p className="location__questions-list__no-reviews">There are no questions for this location.</p>}
                  {location.questions && location.questions.questions && location.questions.questions.length < location.questions.totalSize
                    ? <button
                      className="button button--text button--uppercase"
                      onClick={() => this.getMoreQuestions(location.locationNameId, location.questions.nextPageToken)}
                    >
                      More Questions
                    </button>
                    : null}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  getStartingQuestions,
  getMoreQuestions,
  addOrEditResponse,
  deleteResponse,
  getQuestionPolling,
  checkForNotification,
  dismissNotification
};

const mapStateToProps = (state) => ({
  questions: state[DATA_QUESTIONS].data,
  notification: state[DATA_NOTIFICATION].data,
  questionsRequest: state[REQUEST_QUESTIONS_GET]
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Questions));
