import MDSpinner from 'react-md-spinner';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactStars from 'react-stars';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import * as hexcodes from '@/constants/hexcodes';
import locationIcon from '@/assets/images/locationIcon.png';
import MenuBar from '@/components/menubar/MenuBar';
import Review from '@/components/reviews/Review';
import Banner from '@/components/banner/Banner';
import Notification from '@/components/notification/Notification';
import ErrorSplashPage from '@/components/errorPage/ErrorSplashPage';
import {
  getStartingReviews,
  getMoreReviews,
  addReviewReply,
  getReviewsPolling,
  deleteReviewReply,
} from '@/actionCreators/reviewActionCreators';
import { checkForNotification, dismissNotification } from '@/actionCreators/notificationActionCreators';
import { MSG_REFRESH_REPLY } from '@/constants/errorMessages';
import { REQUEST_REVIEWS_GET, DATA_REVIEWS, DATA_NOTIFICATION } from '@/constants/reducerTypes';
import { REVIEWS_STREAM_TYPE } from '@/constants/streamTypes';
import { LOADING_WHEEL_COLOR } from '@/constants/hexcodes';
import { POLLING_INTERVAL } from '@/constants/numbers';
import { handleServerError, handleStreamError } from '@/utils/errorHandler';
import { areAllInputsClosed } from '@/utils/generic';
import { toast } from 'react-toastify';

/**
 * Class that shows reviews for specified
 * locations and allows the user to post
 * replies to reviews.
 */
export class Reviews extends Component {
  static propTypes = {
    reviews: PropTypes.array.isRequired,
    notification: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    getStartingReviews: PropTypes.func.isRequired,
    getMoreReviews: PropTypes.func.isRequired,
    addReviewReply: PropTypes.func.isRequired,
    deleteReviewReply: PropTypes.func.isRequired,
    reviewsRequest: PropTypes.object.isRequired,
    getReviewsPolling: PropTypes.func.isRequired,
    checkForNotification: PropTypes.func.isRequired,
    dismissNotification: PropTypes.func.isRequired,
  };

  state = {
    isMenuDropdownOpen: false,
    newContent: false,
    pollingInterval: null,
    loadingError: false,
  };

  /**
   * Lifecycle method that gets initial reviews
   * and stores them in Redux store and starts polling.
   */
  async componentDidMount() {
    const { getStartingReviews, checkForNotification } = this.props;
    toast.dismiss();

    // Don't refresh if any `Reply` views are open.
    const handleRefresh = async () => {
      try {
        // Gets all inputs, checks if they've been set, and returns the total
        // that have been set. If none were set, it refreshes the stream
        if (areAllInputsClosed('reply__info__input')) {
          await getStartingReviews();
          await checkForNotification({ streamType: REVIEWS_STREAM_TYPE });
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
      await getStartingReviews();
      await checkForNotification({ streamType: REVIEWS_STREAM_TYPE });
      this.startNewContentPolling();
    } catch (error) {
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
   * reviews.
   *
   * @param {String} locationNameId
   * @param {String} nextPageToken
   */
  getMoreReviews = async (locationNameId, nextPageToken) => {
    const { getMoreReviews } = this.props;
    try {
      await getMoreReviews(locationNameId, nextPageToken);
    } catch (error) {
      handleServerError(error);
    }
  };

  /**
   * Method that rounds a number to
   * the nearest 0.5 for the review's
   * star ratings.
   *
   * @param {number} num
   * @returns {number} Returns a number rounded to its nearest half.
   */
  roundToHalf = (num) => Math.round(num * 2) / 2;

  /**
   * Method that rounds a number to
   * the nearest 0.1 for the average
   * star ratings.
   *
   * @param {number} num
   * @returns {number} Returns a number rounded to its nearest tenth.
   */
  roundToDecimal = (num) => (Math.round(num * 10) / 10).toFixed(1);

  /**
   * Method that adds an owner's response
   * to a review.
   *
   * @param {String} id
   * @param {String} name
   * @param {String} comment
   */
  addOrEditReply = async (reviewId, comment) => {
    const { addReviewReply } = this.props;
    try {
      await addReviewReply(reviewId, comment);
    } catch (error) {
      handleServerError(error);
    }
  };

  /**
   * Method that deletes an owner's
   * response to a review.
   */
  deleteReply = async (reviewId) => {
    const { deleteReviewReply } = this.props;
    try {
      await deleteReviewReply(reviewId);
    } catch (error) {
      handleServerError(error);
    }
  };

  /**
   * Starts polling for new reviews.
   */
  startNewContentPolling = () => {
    const { reviews, getReviewsPolling } = this.props;

    const interval = setInterval(async () => {
      try {
        const newReviews = await getReviewsPolling();
        // Check if there are new reviews for any locations
        reviews.forEach((location) => {
          const newReviewLocation = newReviews.find(
            (newLocation) => newLocation.locationNameId === location.locationNameId,
          );
          if (newReviewLocation && location.reviews.totalReviewCount !== newReviewLocation.reviews.totalReviewCount) {
            this.setState({ newContent: true });
            this.stopContentPolling();
          }
        });
      } catch (error) {
        handleServerError(error);
      }
    }, POLLING_INTERVAL);

    this.setState({ pollingInterval: interval });
  };

  /**
   * Stops the polling interval.
   */
  stopContentPolling = () => {
    const { pollingInterval } = this.state;
    clearInterval(pollingInterval);
    this.setState({ pollingInterval: null });
  };

  /**
   * Method that removes the 'New Content' banner
   * and refreshes the stream with new reviews.
   */
  getNewContent = () => {
    this.setState({ newContent: false });
    this.props.getStartingReviews();
  };

  /**
   * Method that toggles the dropdown state in order to allow menu close on click outside
   * the dropdown.
   */
  toggleMenuDropdown = () => this.setState({ isMenuDropdownOpen: !this.state.isMenuDropdownOpen });

  render() {
    const { reviews, notification, dismissNotification, reviewsRequest } = this.props;
    const { isMenuDropdownOpen, newContent, loadingError } = this.state;

    /*commented full page errors and made it into error toasts*/

    // return loadingError ? <ErrorSplashPage /> : (
    return (
      <div className="stream-container">
        <MenuBar isMenuDropdownOpen={isMenuDropdownOpen} toggleMenuDropdown={this.toggleMenuDropdown} />
        {newContent ? <Banner message="New Content" refresh={this.getNewContent} /> : null}
        <div className="content" onClick={isMenuDropdownOpen ? this.toggleMenuDropdown : undefined}>
          {notification && !Array.isArray(notification) && !notification.dismissed && (
            <Notification type={notification.type} text={notification.text} dismiss={dismissNotification} />
          )}
          {reviewsRequest.isFetching ? (
            <MDSpinner className="loading-icon" singleColor={LOADING_WHEEL_COLOR} size="40" />
          ) : (
            reviews.map(
              (location) =>
                location.reviews && (
                  <div className="location" key={location.locationNameId}>
                    <img alt="Location Icon" className="location__icon" src={locationIcon} />
                    <h4>{location.locationName}</h4>
                    <br />
                    <p className="location__address">{location.locationAddress}</p>
                    <br />
                    <p>
                      {location.reviews.totalReviewCount ? this.roundToDecimal(location.reviews.averageRating) : null}
                    </p>
                    <ReactStars
                      className="location__stars"
                      count={5}
                      color1={hexcodes.DISABLED_STAR}
                      color2={hexcodes.ENABLED_STAR}
                      edit={false}
                      size={13}
                      value={this.roundToHalf(location.reviews && location.reviews.averageRating)}
                    />
                    <p>
                      ({location.reviews && location.reviews.totalReviewCount ? location.reviews.totalReviewCount : 0})
                    </p>
                    <div className="location__reviews-list">
                      {location.reviews && location.reviews.reviews ? (
                        location.reviews.reviews.map((review) => (
                          <Review
                            key={review.reviewId}
                            addOrEditReply={this.addOrEditReply}
                            deleteReply={this.deleteReply}
                            review={review}
                          />
                        ))
                      ) : (
                        <p className="location__reviews-list__no-reviews">There are no reviews for this location.</p>
                      )}
                      {location.reviews &&
                      location.reviews.reviews &&
                      location.reviews.reviews.length < location.reviews.totalReviewCount ? (
                        <button
                          className="button button--text button--uppercase"
                          onClick={() => this.getMoreReviews(location.locationNameId, location.reviews.nextPageToken)}
                        >
                          More Reviews
                        </button>
                      ) : null}
                    </div>
                  </div>
                ),
            )
          )}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  getStartingReviews,
  getMoreReviews,
  addReviewReply,
  deleteReviewReply,
  getReviewsPolling,
  checkForNotification,
  dismissNotification,
};

const mapStateToProps = (state) => ({
  reviews: state[DATA_REVIEWS].data,
  notification: state[DATA_NOTIFICATION].data,
  reviewsRequest: state[REQUEST_REVIEWS_GET],
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Reviews));
