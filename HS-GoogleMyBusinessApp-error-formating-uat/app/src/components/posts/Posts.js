import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import MDSpinner from 'react-md-spinner';
import { connect } from 'react-redux';
import MenuBar from '@/components/menubar/MenuBar';
import Post from '@/components/posts/Post';
import Banner from '@/components/banner/Banner';
import Notification from '@/components/notification/Notification';
import ErrorSplashPage from '@/components/errorPage/ErrorSplashPage';
import { getStartingPosts, getMorePosts, getPostsPolling } from '@/actionCreators/postActionCreators';
import { checkForNotification, dismissNotification } from '@/actionCreators/notificationActionCreators';
import { DATA_POSTS, REQUEST_POSTS_GET, DATA_NOTIFICATION } from '@/constants/reducerTypes';
import { POSTS_STREAM_TYPE } from '@/constants/streamTypes';
import { DEFAULT_POSTS_LENGTH, POLLING_INTERVAL } from '@/constants/numbers';
import { LOADING_WHEEL_COLOR } from '@/constants/hexcodes';
import { handleServerError } from '@/utils/errorHandler';
import { toast } from 'react-toastify';
import { ALL_POST_NOT_SHOWING } from '@/constants/errorMessages';

/**
 * Class that displays a listing of posts for the selected
 * locations. Will later allow for the creation of new posts.
 */

let toastShown;
export class Posts extends Component {
  static propTypes = {
    posts: PropTypes.array.isRequired,
    notification: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    getStartingPosts: PropTypes.func.isRequired,
    getMorePosts: PropTypes.func.isRequired,
    getPostsPolling: PropTypes.func.isRequired,
    checkForNotification: PropTypes.func.isRequired,
    dismissNotification: PropTypes.func.isRequired,
    postsRequest: PropTypes.object.isRequired,
  };

  state = {
    isMenuDropdownOpen: false,
    totalDisplayed: 0,
    pagination: [],
    pollingInterval: null,
    morePostsToFetch: true,
    loadingError: false,
  };

  messageHandler = async (event) => {
    if (
      event &&
      event.data &&
      event.data.event !== 'closepopup' &&
      event.data.params &&
      event.data.params[0] &&
      !event.data.params[0].text
    ) {
      try {
        await getStartingPosts();
      } catch (error) {
        console.log('inside error1', error);
        handleServerError(error);
      }
    }
  }

  /**
   * Lifecycle method that gets the
   * posts for the selected accounts
   * from the API.
   */
  async componentDidMount() {
    const { getStartingPosts, checkForNotification } = this.props;
    toast.dismiss();
    toastShown = false;

    try {
      await getStartingPosts();
      await checkForNotification({ streamType: POSTS_STREAM_TYPE });
      this.startNewContentPolling();
    } catch (error) {
      console.log('inside error', error);
      /*commented full page errors and made it into error toasts*/
      handleServerError(error);
      // this.setState({ loadingError: true });
    }

    const { posts } = this.props;

    const validPosts = posts.filter(this.checkPostHasMandatoryData);
    const totalDisplayed = validPosts.length < DEFAULT_POSTS_LENGTH ? validPosts.length : DEFAULT_POSTS_LENGTH;

    this.setState({ posts: validPosts, totalDisplayed });

    // Checks for iFrame request to reload the page
    // if the event posted isn't to close the popup
    // modal or to dismiss the notification
    window.addEventListener('message', this.messageHandler);

    const handleRefresh = async () => {
      try {
        await getStartingPosts();
        await checkForNotification({ streamType: POSTS_STREAM_TYPE });
      } catch (error) {
        console.log('inside error2', error);
        handleServerError(error);
      }
    };

    // Handle the Hootsuite refresh event for this page.
    window.hsp.bind('refresh', () => {
      this.setState({ loadingError: false }, handleRefresh);
    });
  }

  /**
   * Lifecycle method that stops
   * content polling before the
   * component unmounts.
   */
  componentWillUnmount() {
    this.stopContentPolling();
    window.removeEventListener('message', this.messageHandler);
  }

  /**
   * Method that gets more posts by either
   * allowing more to print by changing the
   * `totalDisplayed` state variable, or by
   * getting more from the API.
   */
  getMorePosts = async () => {
    const { totalDisplayed, pagination, morePostsToFetch } = this.state;
    const { getMorePosts, posts } = this.props;
    const newTotalDisplayed = totalDisplayed + DEFAULT_POSTS_LENGTH;

    if (posts && newTotalDisplayed >= posts.length && morePostsToFetch) {
      try {
        const newPosts = await getMorePosts(pagination);
        const newPagination = newPosts.pagination;

        this.setState({
          pagination: newPagination,
          morePostsToFetch: newPagination.length > 0,
        });
      } catch (error) {
        console.log('inside error3', error);
        handleServerError(error);
      }
    }

    this.setState({ totalDisplayed: newTotalDisplayed });
  };

  /**
   * Method that starts polling for new posts.
   */
  startNewContentPolling = () => {
    const { posts, getPostsPolling } = this.props;

    const interval = setInterval(async () => {
      try {
        const newPosts = await getPostsPolling();
        // Check if there are any new posts
        if (newPosts && posts.posts && posts.posts.length !== newPosts.posts.length) {
          this.setState({ newContent: true });
          this.stopContentPolling();
        }
      } catch (error) {
        console.log('inside error4', error);
        handleServerError(error);
      }
    }, POLLING_INTERVAL);

    this.setState({ pollingInterval: interval });
  };

  /**
   * Method that stops the polling interval.
   */
  stopContentPolling = () => {
    const { pollingInterval } = this.state;
    clearInterval(pollingInterval);
    this.setState({ pollingInterval: null });
  };

  /**
   * Method that removes the 'New Content' banner
   * and refreshes the stream with new posts.
   */
  getNewContent = () => {
    this.setState({ newContent: false });
    try {
      this.props.getStartingPosts();
    } catch (error) {
      console.log('inside error5', error);
      handleServerError(error);
    }
  };

  /**
   * Method that toggles the dropdown state in order to allow menu close on click outside
   * the dropdown.
   */
  toggleMenuDropdown = () => this.setState({ isMenuDropdownOpen: !this.state.isMenuDropdownOpen });

  // Checks if the post contains values for the mandatory fields
  checkPostHasMandatoryData = (post) => {
    if (!(post.createTime && post.location && post.locationAddress && post.content)) {
      if (!toastShown) {
        toastShown = true;
        toast.error(ALL_POST_NOT_SHOWING);
      }
      return false;
    }
    return true;
  }

  render() {
    const { notification, dismissNotification, postsRequest } = this.props;
    const { isMenuDropdownOpen, newContent, totalDisplayed, morePostsToFetch, loadingError, posts } = this.state;

    const morePostsToDisplay = posts && totalDisplayed < posts.length;
    const morePosts = morePostsToFetch || morePostsToDisplay;

    /*commented full page errors and made it into error toasts*/

    // return loadingError ? (
    //   <ErrorSplashPage />
    // ) : (
    return (
      <div className="stream-container">
        <MenuBar isMenuDropdownOpen={isMenuDropdownOpen} toggleMenuDropdown={this.toggleMenuDropdown} />
        {newContent ? <Banner message="New Content" refresh={this.getNewContent} /> : null}
        <div className="content-posts" onClick={isMenuDropdownOpen ? this.toggleMenuDropdown : undefined}>
          {notification &&
            !Array.isArray(notification) &&
            !notification.dismissed && (
              <Notification
                type={notification.type}
                text={notification.text}
                dismiss={dismissNotification}
                isPostsStream
              />
            )}
          {postsRequest?.isFetching ? (
            <MDSpinner className="loading-icon" singleColor={LOADING_WHEEL_COLOR} size="40" />
          ) : (
            <Fragment>
              {posts &&
                posts.length > 0 &&
                posts.map((post, index) => {
                  return index < totalDisplayed && <Post key={post.id} post={post} />;
                })}
              {morePosts && (
                <button
                  className="button button--text button--uppercase button--more-posts"
                  onClick={this.getMorePosts}
                >
                  More Posts
                </button>
              )}
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  getStartingPosts,
  getMorePosts,
  getPostsPolling,
  checkForNotification,
  dismissNotification,
};

const mapStateToProps = state => ({
  posts: state[DATA_POSTS].data,
  notification: state[DATA_NOTIFICATION].data,
  postsRequest: state[REQUEST_POSTS_GET],
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Posts),
);
