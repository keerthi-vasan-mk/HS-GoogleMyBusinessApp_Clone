import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { getJwtToken } from '@/selectors/authSelectors';
import editIcon from '@/assets/images/editIconWhite.png';
import locationIcon from '@/assets/images/locationIcon.png';
import clicksIcon from '@/assets/images/clicksIcon.png';
import viewsIcon from '@/assets/images/viewsIcon.png';
import { CTA_BUTTON_LABELS } from '@/constants/enums';
import { BASE_FRONT_URL, MODAL } from '@/constants/api';

/**
 * Class that displays a preview of an individual post,
 * and links to the full post.
 */
export class Post extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
  };

  state = {
    text: '',
  };

  /**
   * Lifecycle method that
   * truncates the inital post.
   */
  componentDidMount() {
    this.truncateText();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.post.content !== this.props.post.content) {
      this.truncateText();
    }
  }
  
  /**
   * Method that opens the external Hootsuite
   * modal.
   *
   * @param {String} postId
   */
  showHootsuiteModal = (postId) => {
    const { jwtToken } = this.props;
    hsp.showCustomPopup(
      encodeURI(`${BASE_FRONT_URL}${MODAL}?postId=${postId}&auth=${jwtToken}&pid=${window.pid}`),
      'Edit Post',
      400,
      500,
    );
  };

  /**
   * Method that appends a `... Read more`
   * button to the post text if it's longer
   * than 500 characters and truncates the
   * post text to 500 characters.
   *
   * @returns {JSX.Element} Returns the truncated text with a `Read more` button.
   */
  truncateText = () => {
    const { content } = this.props.post;
    if (!content) {
      return;
    }
    const truncated =
      content.length > 500 ? (
        <p>
          {content.substring(0, 500)}...
          <span className="post__info--link" onClick={this.expandText}>
            &nbsp;Read more
          </span>
        </p>
      ) : (
        <p>{content}</p>
      );

    this.setState({ text: truncated });
  };

  /**
   * Method that appends a `Read less`
   * button to the post text if the user
   * has clicked the `Read more` button
   * and expands to show all the text.
   *
   * @returns {JSX.Element} Returns the expanded text with a `Read less` button.
   */
  expandText = () => {
    const { content } = this.props.post;
    if (!content) {
      return;
    }
    const expanded = (
      <p>
        {content}
        <span className="post__info--link" onClick={this.truncateText}>
          &nbsp;Read less
        </span>
      </p>
    );

    this.setState({ text: expanded });
  };

  /**
   * Method that gets the banner for
   * the post with a media preview if
   * a photo or video was uploaded.
   *
   * @param {Object} media
   * @returns {JSX.Element} Returns a media preview photo or video.
   */
  getMediaPreview = (media) => {
    return media ? (
      <img className="post__image" src={media[0].googleUrl} alt="Post Preview" />
    ) : (
      <img className="post__image" src={'https://blog.hubspot.com/hubfs/image8-2.jpg'} alt="Post Preview" />
    );
  };

  /**
   * Method that gets the Call To Action (CTA)
   * button if one was created for the post.
   *
   * @param {String} ctaButtonLink
   * @param {String} ctaButtonType
   * @returns {JSX.Element} Returns a CTA button.
   */
  getButton = (ctaButtonLink, ctaButtonType) =>
    ctaButtonType !== '' ? (
      <button className="button button--cta" onClick={() => window.open(ctaButtonLink)}>
        {CTA_BUTTON_LABELS[ctaButtonType]}
      </button>
    ) : null;

  render() {
    const { post } = this.props;
    const { createTime, media, location, locationAddress, id, ctaButtonLink, ctaButtonType, postInsight } = post;

    const preview = this.getMediaPreview(media);
    const ctaButton = this.getButton(ctaButtonLink, ctaButtonType);

    return (
      <div className="post">
        <div className="post__header">
          {preview}
          <div className="post__header__title">
            <p>
              Posted {new Date(createTime).toDateString()}
              {/* <span className="post__header__title__metrics" title="Views">
                <img className="post__header__title__metrics__icon" src={viewsIcon} alt="Views Icon" />
                {postInsight?.metricValues[0]?.totalValue?.value}
              </span>
              <span className="post__header__title__metrics" title="Clicks">
                <img className="post__header__title__metrics__icon" src={clicksIcon} alt="Clicks Icon" />
                {postInsight?.metricValues[1]?.totalValue?.value}
              </span> */}
            </p>
            <img
              className="post__header__title__icon"
              src={editIcon}
              onClick={() => this.showHootsuiteModal(id)}
              alt="Edit Icon"
            />
          </div>
        </div>
        <div className="post__info">
          <div className="post__info__location">
            <img className="post__info__location__icon" src={locationIcon} alt="Location Icon" />
            <h5>{location}</h5>
            <br />
          </div>
          <p className="post__info__address">{locationAddress}</p>
          {this.state.text}
          {ctaButton}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  jwtToken: getJwtToken(state).jwt,
});

export default connect(mapStateToProps)(Post);
