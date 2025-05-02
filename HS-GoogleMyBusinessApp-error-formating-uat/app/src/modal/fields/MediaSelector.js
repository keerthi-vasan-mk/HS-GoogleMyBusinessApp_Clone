import React, { Component } from 'react';
import axios from 'axios';
import MDSpinner from 'react-md-spinner';
import mediaIcon from '@/assets/images/mediaIcon.png';
import DropFiles from './DropFiles';
import GooglePhotosViewer from './GooglePhotosViewer';
import { GOOGLE_CLIENT_ID, GOOGLE_SCOPE, APP_ID, DEVELOPER_KEY } from '@/modal/constants/api';
import { LOADING_WHEEL_COLOR } from '@/constants/hexcodes';
import { SYSTEM_ERROR } from '@/constants/errorMessages';
import { ERROR_UNAUTHORIZED } from '@/constants/serverErrors';

let client;
let access_token;
/**
 * Class that renders the media selector field
 * in the Hootsuite dashboard.
 */
class MediaSelector extends Component {
  state = {
    auth2Client: null,
    showPhotoPicker: false,
    photos: [],
    nextPageToken: null,
  };

  /**
   * Lifecycle method that initializes the Google
   * API client library.
   */
  componentWillMount() {
    console.log('inside media selctor');
    this.initClient();
  }

  initClient() {
    client = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: GOOGLE_SCOPE,
      callback: (tokenResponse) => {
        access_token = tokenResponse.access_token;
      },
    });
  }

  /**
   * Method that logs in a Google user, or if
   * they are already logged in, gets their info.
   *
   * @returns {Object} Returns the OAuth2 access token.
   */
  // handleLogin = async () => {
  //   client = window.google.accounts.oauth2.initCodeClient({
  //     client_id: GOOGLE_CLIENT_ID,
  //     scope: GOOGLE_SCOPE,
  //     callback: this.createGDrivePicker,
  //   });
  // const { auth2Client } = this.state;
  // const GoogleUser = auth2Client.isSignedIn.get() ? await auth2Client.currentUser.get() : await auth2Client.signIn();

  // return GoogleUser.getAuthResponse(true).access_token;
  // };

  // onGoogleLoginSuccess = async (response) => {
  //   return response.code;
  // };

  /**
   * Method that opens the Google
   * Drive File Picker.
   */
  openGDrive = () => {
    this.createGDrivePicker();
  };

  /**
   * Method that creates the Google
   * Drive File Picker with a filter
   * for only images and videos.
   */
  createGDrivePicker = async () => {
    client.requestAccessToken();
    const token = access_token;
    if (token) {
      const view = new google.picker.View(google.picker.ViewId.DOCS_IMAGES);
      const picker = new google.picker.PickerBuilder()
        .setAppId(APP_ID)
        .setDeveloperKey(DEVELOPER_KEY)
        .setOAuthToken(access_token)
        .setOrigin('https://hootsuite.com')
        .addView(view)
        .setSize(400, 500)
        .setTitle('Select a photo')
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .setCallback(this.setGDriveImage)
        .build();
      picker.setVisible(true);
    }
  };

  /**
   * Method that gets the selected file
   * from Google Drive and displays it
   * in the file preview.
   */
  setGDriveImage = async (data) => {
    client.requestAccessToken();
    if (data.action == google.picker.Action.PICKED) {
      const { setGDrivePhoto, setError } = this.props;
      const fileId = data.docs[0].id;
      const token = access_token;
      const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;

      try {
        const file = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          params: { fields: 'thumbnailLink, webContentLink, webViewLink, name, mimeType, size' },
        });

        const photo = {
          filename: file.data.name,
          mimeType: file.data.mimeType,
          baseUrl: file.data.webContentLink,
          productUrl: file.data.webViewLink,
          googleDriveToken: token,
          downloadUrl: `${url}?alt=media`,
        };

        setGDrivePhoto(photo);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  /**
   * Method that either shows or hides the Google Photos picker
   * by setting the `showPhotoPicker` state variable.
   *
   * @param {boolean} showPhotoPicker
   */
  togglePhotoPicker = (showPhotoPicker) => this.setState({ showPhotoPicker });

  /**
   * Method that gets photos from Google
   * Photos and appends them to the `photos`
   * state variable. Opens the photo picker
   * as well.
   */
  getGPhotos = async () => {
    const { nextPageToken } = this.state;
    const { setError } = this.props;
    client.requestAccessToken();
    const token = access_token;
    try {
      const mediaItems = await axios.get('https://photoslibrary.googleapis.com/v1/mediaItems', {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageSize: '100', pageToken: nextPageToken },
      });

      if (mediaItems.data.mediaItems) {
        const allPhotos = [...this.state.photos].concat(mediaItems.data.mediaItems);
        // Removes duplicates
        const photos = allPhotos.filter(
          (photo, index, self) => self.findIndex((temp) => temp.id === photo.id) === index,
        );
        this.setState({ photos, nextPageToken: mediaItems.data.nextPageToken });
      } else {
        this.setState({ photos: [] });
      }
      this.togglePhotoPicker(true);
    } catch (error) {
      console.log(error.response, 'error getGPhotos');
      // Remove this condition once the app verified with google
      if(error.response.status === ERROR_UNAUTHORIZED) {
        setError({message: `The app has not been verified by Google. ${SYSTEM_ERROR}`});
      }
      else {
        setError({message: error.message});
      }
    }
  };

  render() {
    const { showPhotoPicker, photos, nextPageToken } = this.state;
    const { handleFile, deleteFile, setGPhoto, file, isValidFile, isGPhoto, deleteGPhoto, isFileUploading } =
      this.props;

    return (
      <div className="new-post__field">
        <div className="new-post__field__header">
          <div className="new-post__field__header__title">
            <img src={mediaIcon} alt="Media Icon" />
            <h4>Photo</h4>
          </div>
          <p>
            Select from&nbsp;
            <a className="new-post__field__header__link" onClick={this.getGPhotos}>
              Google Photos
            </a>
            &nbsp;or&nbsp;
            <a className="new-post__field__header__link" onClick={this.openGDrive}>
              Google Drive
            </a>
          </p>
        </div>
        {isFileUploading ? (
          <MDSpinner className="centered-loader" singleColor={LOADING_WHEEL_COLOR} size={20} />
        ) : (
          <DropFiles
            isValidFile={isValidFile}
            file={file}
            handleFile={handleFile}
            deleteFile={deleteFile}
            isGPhoto={isGPhoto}
            deleteGPhoto={deleteGPhoto}
          />
        )}
        {showPhotoPicker && (
          <GooglePhotosViewer
            photos={photos}
            setGPhoto={setGPhoto}
            getGPhotos={this.getGPhotos}
            close={this.togglePhotoPicker}
            showLoadMore={nextPageToken}
          />
        )}
      </div>
    );
  }
}

export default MediaSelector;
