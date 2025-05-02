import React, { Component } from 'react';
import MDSpinner from 'react-md-spinner';
import { isURL } from 'validator';
import { LOADING_WHEEL_COLOR } from '@/constants/hexcodes';
import { CTA_BUTTON_TYPES, CTA_BUTTON_LABELS } from '@/constants/enums';
import LocationSelector from '@/modal/fields/LocationSelector';
import TextField from '@/modal/fields/TextField';
import MediaSelector from '@/modal/fields/MediaSelector';
import ButtonTextSelector from '@/modal/fields/ButtonTextSelector';
import ButtonLinkField from '@/modal/fields/ButtonLinkField';
import APIRequest from './APIRequest';
import Success from './Success';

/**
 * Class that displays the Edit Post
 * modal in the Hootsuite dashboard.
 */
class EditPostModal extends Component {

  state = {
    initialPost: {
      locations: [],
      locationId: "",
      selectedLocations: [],
      text: "",
      file: {},
      fileRef: "",
      selectedButton: {},
      buttonLink: "",
      showButtonLink: false,
      isGPhoto: false,
    },
    updatedPost: {
      locations: [],
      locationId: "",
      selectedLocations: [],
      text: "",
      file: {},
      tempImageKey: "",
      tempImageUrl: "",
      selectedButton: {},
      buttonLink: "",
      showButtonLink: false,
      isGPhoto: false,
    },
    isValidFile: true,
    isLoading: true,
    submitted: false,
    isFileUploading: false,
    isUpdatingPost: false,
    error: null
  }

  /**
   * Lifecycle method that sets the initial
   * `state` variables with a single post's
   * information.
   */
  async componentDidMount() {
    const { postId, token } = this.props;
    this.APIRequest = new APIRequest(postId, token);

    try {
      const post = await this.APIRequest.getPost();

      const formattedPost = {
        locations: [{ label: post.location, value: post.locationId }],
        locationId: post.locationId,
        selectedLocations: [{ label: post.location, value: post.locationId }],
        text: post.content || '',
        file: post.media && {
          filename: post.updateTime,
          baseUrl: post.media[0].googleUrl,
          productUrl: post.media[0].googleUrl,
        },
        selectedButton: { label: CTA_BUTTON_LABELS[post.ctaButtonType], value: post.ctaButtonType },
        buttonLink: post.ctaButtonLink,
        isGPhoto: post.media,
        showButtonLink: post.ctaButtonLink !== "" && post.ctaButtonType !== CTA_BUTTON_TYPES.CALL,
      };

      this.setState({
        initialPost: formattedPost,
        updatedPost: formattedPost,
        isLoading: false,
      });
    }
    catch (error) {
      this.setState({
        error: { message: "Something went wrong. Please close the modal and refresh the stream." },
        isLoading: false
      });
    }
  }

  /**
   * Method that sets the `selectedLocations` state variable with the user's
   * selected locations.
   * 
   * @param {Array<Object>} selectedLocations
   */
  handleMultiSelect = (selectedLocations) => {
    const updatedPost = { ...this.state.updatedPost, selectedLocations };
    this.setState({ updatedPost });
  }

  /**
   * Method that sets the `text` state variable with the user's input.
   * 
   * @param {Object} event
   */
  handleTextInput = (event) => {
    const updatedPost = { ...this.state.updatedPost, text: event.target.value };
    this.setError(null);
    this.setState({ updatedPost });
  }

  /**
   * Method that handles file upload from the dropzone.
   * 
   * @param {Array<File>} acceptedFiles
   * @param {Array<File>} rejectedFiles
   */
  handleFile = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length === 0) {
      this.setState({ isFileUploading: true }, async () => {
        try {
          const { imageLocation: tempImageUrl, imageKey: tempImageKey } = await this.APIRequest.uploadMedia(acceptedFiles[0]);
          const updatedPost = { ...this.state.updatedPost, file: acceptedFiles[0], tempImageKey, tempImageUrl };
          this.setState({ updatedPost, isValidFile: true, error: null });
        } catch (error) {
          this.setState({ error, isValidFile: false });
        }
        this.setState({ isFileUploading: false });
      });
    } else {
      this.setState({ isValidFile: false });
    }

  }

  /**
   * Method that deletes the file from the
   * local URL and from state.
   * 
   * @param {String} url
   */
  deleteFile = (url) => {
    URL.revokeObjectURL(url);
    const updatedPost = { ...this.state.updatedPost, file: "", isGPhoto: false };
    this.setState({ updatedPost });
  }

  /**
   * Method that sets the selected file to a photo from Google
   * Photos.
   * 
   * @param {Object} file
   */
  setGPhoto = (file) => {
    const updatedPost = { ...this.state.updatedPost, isGPhoto: true, file };
    this.setError(null);
    this.setState({ updatedPost });
  }

  /**
   * Method that sets the selected file to a photo from Google
   * Drive.
   * 
   * @param {Object} file
   */
  setGDrivePhoto = (file) => {
    const data = {
      googleDriveToken: file.googleDriveToken,
      sourceUrl: file.downloadUrl
    };

    this.setState({ isFileUploading: true }, async () => {
      try {
        const { imageLocation: tempImageUrl, imageKey: tempImageKey } = await this.APIRequest.uploadGoogleDriveMedia(data);
        const updatedPost = { ...this.state.updatedPost, file, tempImageUrl, tempImageKey, isGPhoto: true };
        this.setState({ updatedPost, isValidFile: true, error: null });
      } catch (error) {
        this.setState({ error, isValidFile: false });
      }
      this.setState({ isFileUploading: false });
    });
  };

  /**
   * Method that deletes the selected Google Photos file.
   */
  deleteGPhoto = () => {
    const updatedPost = { ...this.state.updatedPost, file: "", isGPhoto: false };
    this.setState({ updatedPost });
  }

  /**
   * Method that sets the `selectedButton` state variable with the user's
   * selected button text, and updates `showButtonLink` state variable.
   * 
   * @param {Object} selectedButton
   */
  handleSelect = (selectedButton) => {
    if (selectedButton) {
      const updatedPost = { ...this.state.updatedPost, showButtonLink: selectedButton.value !== CTA_BUTTON_TYPES.CALL, selectedButton };
      this.setError(null);
      this.setState({ updatedPost });
    }
    else {
      const updatedPost = { ...this.state.updatedPost, showButtonLink: false, selectedButton: {}, buttonLink: "" };
      this.setError(null);
      this.setState({ updatedPost });
    }
  }

  /**
   * Method that sets the `buttonLink` state variables with the user's
   * input.
   * 
   * @param {Object} event
   */
  handleButtonLinkInput = (event) => {
    const updatedPost = { ...this.state.updatedPost, buttonLink: event.target.value };
    this.setError(null);
    this.setState({ updatedPost });
  }

  /**
   * Method that allows the `<MediaSelector />`
   * component set errors from Google Drive or
   * Google Photos.
   * 
   * @param {Object} error
   */
  setError = (error) => this.setState({ error });

  /**
   * Method that submits the edited data to 
   * the backend.
   */
  handleSubmit = async () => {
    const { initialPost, updatedPost } = this.state;

    this.setState({ isUpdatingPost: true });
    const post = {};

    // As this is a PATCH request, only send the fields that have changed.
    if (JSON.stringify(initialPost.file) !== JSON.stringify(updatedPost.file)) {
      const media = updatedPost.file
        ? [
          updatedPost.isGPhoto && !updatedPost.file.googleDriveToken
            ? {
              mediaFormat: 'PHOTO',
              sourceUrl: updatedPost.file.baseUrl
            }
            : {
              mediaFormat: 'PHOTO',
              sourceUrl: updatedPost.tempImageUrl
            }
        ]
        : [];

      post.media = media;
    }

    if (initialPost.text !== updatedPost.text) {
      post.content = updatedPost.text;
    }

    // Check if the buttonLink is a valid URL
    if (updatedPost.selectedButton.value && !isURL(updatedPost.buttonLink)) {
      this.setError({ message: "Invalid button link." });
      this.setState({ isUpdatingPost: false });
      return;
    }

    // These two fields must always be sent together even if only one changes.
    if (initialPost.selectedButton.value !== updatedPost.selectedButton.value || initialPost.buttonLink !== updatedPost.buttonLink) {
      post.ctaButtonType = updatedPost.selectedButton.value || '';
      post.ctaButtonLink = updatedPost.selectedButton.value === CTA_BUTTON_TYPES.CALL ? '' : updatedPost.buttonLink;
    }

    if (Object.keys(post).length === 0) {
      this.setError({ message: "Nothing has been edited!" });
      this.setState({ isUpdatingPost: false });
      return;
    }

    const data = {
      post,
      tempFileKey: updatedPost.tempImageKey || null
    };

    try {
      const submitted = await this.APIRequest.editPost(data) === 200;
      this.setState({ submitted, error: null, isUpdatingPost: false });
    } catch (error) {
      this.setState({ error, isUpdatingPost: false });
    }

  }

  render() {
    const { updatedPost, isLoading, isValidFile,
      submitted, isFileUploading, error, isUpdatingPost
    } = this.state;

    const { locations, text, file,
      showButtonLink, selectedLocations,
      selectedButton, buttonLink, isGPhoto
    } = updatedPost;

    if (isLoading) {
      return (
        <div className="loader">
          <MDSpinner singleColor={LOADING_WHEEL_COLOR} size={40} />
        </div>
      );
    }

    if (submitted) {
      return <Success action="edited" />;
    }

    return (
      <div className="new-post">
        <LocationSelector
          locations={locations}
          selectedLocations={selectedLocations}
          handleMultiSelect={this.handleMultiSelect}
          isDisabled
        />
        <TextField text={text} handleTextInput={this.handleTextInput} />
        <MediaSelector
          file={file}
          handleFile={this.handleFile}
          deleteFile={this.deleteFile}
          setGPhoto={this.setGPhoto}
          deleteGPhoto={this.deleteGPhoto}
          setGDrivePhoto={this.setGDrivePhoto}
          isValidFile={isValidFile}
          isGPhoto={isGPhoto}
          isFileUploading={isFileUploading}
          setError={this.setError}
        />
        <ButtonTextSelector selectedButton={selectedButton} handleSelect={this.handleSelect} />

        {showButtonLink && <ButtonLinkField buttonLink={buttonLink} handleButtonLinkInput={this.handleButtonLinkInput} />}

        {error && <div className="error"><div className="error__content">{error.message}</div></div>}

        <button
          className="button button--hootsuite"
          onClick={this.handleSubmit}
          disabled={isFileUploading || isUpdatingPost}
        >
          Post Now
        </button>
      </div>
    );
  }
}

export default EditPostModal;
