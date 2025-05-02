import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import Popup from 'reactjs-popup';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getJwtToken } from '@/selectors/authSelectors';
import { withRouter } from 'react-router-dom';
import settingsIcon from '@/assets/images/settingsIcon.png';
import newPostIcon from '@/assets/images/newPostIcon.png';
import * as routes from '@/constants/routes';
import { DATA_USERNAME, DATA_STREAM } from '@/constants/reducerTypes';
import { revokeAuthorization, getGoogleUsername } from '@/actionCreators/authActionCreators';
import { handleServerError } from '@/utils/errorHandler';
import { BASE_FRONT_URL, MODAL } from '@/constants/api';

/**
 * Menu bar that sits at the top of some pages
 */
export class MenuBar extends Component {

  static props = {
    isMenuDropdownOpen: PropTypes.bool.isRequired,
    toggleMenuDropdown: PropTypes.func.isRequired,
    revokeAuthorization: PropTypes.func.isRequired,
    googleUserName: PropTypes.string.isRequired,
    getGoogleUsername: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    jwtToken: PropTypes.string.isRequired,
    stream: PropTypes.string.isRequired,
  }

  state = {
    modalOpen: false
  }

  componentDidMount = async () => {
    const { googleUserName, getGoogleUsername } = this.props;
    const usernameMissing = !googleUserName || googleUserName.length === 0;
    // googleUserName may have been stored as an array with irrelevant contents
    const incorrectDataStored = Array.isArray(googleUserName);

    if (usernameMissing || incorrectDataStored) {
      try {
        await getGoogleUsername();
      }
      catch (error) {
        handleServerError(error);
      }
    }
  }

  /**
   * Method that opens the external Hootsuite
   * modal.
   */
  showHootsuiteModal = () => {
    const { jwtToken } = this.props;
    hsp.showCustomPopup(
      encodeURI(`${BASE_FRONT_URL}${MODAL}?auth=${jwtToken}&pid=${window.pid}`),
      'Add New Post',
      400,
      500
    );
  }

  /**
   * Method that redirects to the `Locations` page.
   */
  handleManageLocationsClick = () => this.props.history.push(routes.LOCATIONS);

  /**
   * Method that disconnects the Google
   * account from the stream and redirects
   * to the `Login` page.
   */
  disconnectAccount = async () => {
    const { history, revokeAuthorization } = this.props;

    try {
      await revokeAuthorization();
      history.push(routes.LOGIN);
    }
    catch (error) {
      handleServerError(error);
    }
  }

  /**
   * Handles a confirmation click from the disconnect modal.
   */
  handleModalDisconnect = () => {
    this.closeModal();
    this.disconnectAccount();
  }

  /**
   * Sets state to open disconnect modal.
   */
  openModal = () => this.setState({ modalOpen: true });

  /**
   * Sets state to close disconnect modal.
   */
  closeModal = () => this.setState({ modalOpen: false });

  render() {
    const { isMenuDropdownOpen, toggleMenuDropdown, googleUserName, location, stream } = this.props;

    const dropdown = isMenuDropdownOpen
      ? <div className="menubar__dropdown">
        <p className="menubar__dropdown__user"><strong>User: </strong>{googleUserName}</p>
        <button className="button button--manage-locations" onClick={this.handleManageLocationsClick}>Manage Locations</button>
        <button className="button button--dark" onClick={this.openModal}>Disconnect</button>
      </div>
      : null;

    const newPost = stream === 'posts' && location.pathname !== routes.LOCATIONS
      ? <span data-tip="New Post" data-for="menubar">
        <img
          className="menubar__bar__icon menubar__bar__icon--new-post"
          src={newPostIcon}
          alt="New Post Icon"
          onClick={this.showHootsuiteModal}
        />
      </span>
      : null;

    return (
      <div className="menubar">
        <div className="menubar__bar">
          {newPost}
          <span data-tip="Settings" data-tip-disable={isMenuDropdownOpen} data-for="menubar">
            <img
              className="menubar__bar__icon"
              src={settingsIcon}
              alt="Stream settings"
              onClick={toggleMenuDropdown}
            />
          </span>
          <ReactTooltip
            id="menubar"
            place="left"
            effect="solid"
          />
        </div>
        {dropdown}
        <Popup
          open={this.state.modalOpen}
          closeOnDocumentClick
          onClose={this.closeModal}
        >
          <div className="disconnect-modal">
            <div className="disconnect-modal__body">
              <p className="disconnect-modal__body__title">Disconnect account?</p>
              <p className="disconnect-modal__body__message">This will disconnect all streams that are logged in with the current Google account.</p>
            </div>
            <div className="disconnect-modal__actions">
              <button className="button button--text button--uppercase" onClick={this.closeModal}>Cancel</button>
              <button className="button button--text button--uppercase" onClick={this.handleModalDisconnect}>Disconnect</button>
            </div>
          </div>
        </Popup>
      </div>
    );
  }
}

const mapDispatchToProps = {
  revokeAuthorization,
  getGoogleUsername,
};

const mapStateToProps = (state) => ({
  googleUserName: state[DATA_USERNAME].data,
  jwtToken: getJwtToken(state).jwt,
  stream: state[DATA_STREAM].data,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MenuBar));
