import React, { Component } from 'react';
import MDSpinner from 'react-md-spinner';
import { isURL } from 'validator';
import { Radio, Checkbox, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import classnames from 'classnames';
import { LOADING_WHEEL_COLOR } from '@/constants/hexcodes';
import { CTA_BUTTON_TYPES } from '@/constants/enums';
import { StyledDatePicker, StyledTimePicker } from '@/modal/fields/PickerFields';
import LocationSelector from '@/modal/fields/LocationSelector';
import TextField from '@/modal/fields/TextField';
import MediaSelector from '@/modal/fields/MediaSelector';
import ButtonTextSelector from '@/modal/fields/ButtonTextSelector';
import ButtonLinkField from '@/modal/fields/ButtonLinkField';
import APIRequest from './APIRequest';
import Success from './Success';
import MultiUseField from './fields/MultiUseField';
import moment from 'moment';
import calendarIcon from '@/assets/images/calendarIcon.png';
import informationIcon from '@/assets/images/informationIcon.png';
import expandMore from '@/assets/images/expandMore.png';
import expandLess from '@/assets/images/expandLess.png';
import { object } from 'prop-types';

const StyledCheckbox = withStyles({
  root: {
    color: '#80868b',
    '&$checked': {
      color: '80868b',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

/**
 * Class that displays the Add New Post
 * modal in the Hootsuite dashboard.
 */
class NewPostModal extends Component {

  state = {
    locations: [],
    selectedLocations: [],
    text: "",
    title: "",
    details: "",
    coupon: "",
    offerLink: "",
    tac: "",
    file: "",
    startDate: moment(),
    endDate: moment().add('1 day'),
    startTime: moment(), // TODO: init to 00:01
    endTime: moment().add('1 day'), // TODO: init to 23:59
    tempImageUrl: "",
    tempImageKey: "",
    selectedOption: 'post',
    enableTimes: false,
    showOptional: false,
    isValidFile: true,
    selectedButton: {},
    buttonLink: "",
    showButtonLink: false,
    isLoading: true,
    isGPhoto: false,
    submitted: false,
    isFileUploading: false,
    isCreatingPost: false,
    isCreatingOffer: false,
    error: null
  }

  /**
   * Lifecycle method that sets the 
   * `locations` state variable and 
   * stops the loader from being shown.
   */
  async componentDidMount() {
    const { token } = this.props;
    this.APIRequest = new APIRequest(null, token);

    try {
      const locations = await this.APIRequest.getLocations();
      this.setState({ locations, isLoading: false });
    } catch (error) {
      this.setError({ message: "Something went wrong. Please close the modal and refresh the stream." });
      this.setState({ isLoading: false });
    }
  }

  /**
   * Method that sets the `selectedLocations` state variable with the user's
   * selected locations.
   * 
   * @param {Array<Object>} selectedLocations
   */
  handleMultiSelect = (selectedLocations) => this.setState({ selectedLocations });

  /**
   * Method that sets the `text` state variable with the user's input.
   * 
   * @param {Object} event
   */
  handleTextInput = (event) => this.setState({ text: event.target.value });
  
  /**
   * Method that sets the `title` state variable with the user's input.
   * 
   * @param {Object} event
   */
  handleTitleInput = (event) => this.setState({ title: event.target.value });

  /**
   * Method that sets the `startDate` state variable with the user's input.
   * 
   * @param {Object} event
   */
  handleStartDateInput = (event) => this.setState({ startDate: event });

  /**
   * Method that sets the `endDate` state variable with the user's input.
   * 
   * @param {Object} event
   */
  handleEndDateInput = (event) => this.setState({ endDate: event });

  /**
   * Method that sets the `startTime` state variable with the user's input.
   * 
   * @param {Object} event
   */
  handleStartTimeInput = (event) => this.setState({ startTime: event });

  /**
   * Method that sets the `endTime` state variable with the user's input.
   * 
   * @param {Object} event
   */
  handleEndTimeInput = (event) => this.setState({ endTime: event });

  /**
   * Method that sets the `enableTimes` state variable with the user's input.
   * 
   * @param {boolean} isActive
   */
  handleEnableTimesInput = (isActive) => this.setState({ enableTimes: isActive });

  /**
   * Method that sets the `details` state variable with the user's input.
   * 
   * @param {Object} event
   */
  handleDetailsInput = (event) => this.setState({ details: event.target.value });

  /**
   * Method that sets the `couponCode` state variable with the user's input.
   * 
   * @param {Object} event
   */
  handleCouponInput = (event) => this.setState({ coupon: event.target.value });

  /**
   * Method that sets the `termsAndConditions (tac)` state variable with the user's input.
   * 
   * @param {Object} event
   */
  handleTacInput = (event) => this.setState({ tac: event.target.value });

  /**
   * Method that sets the `showOptional` state variable with the user's input.
   * 
   * @param {Object} event
   */
  handleShowOptional = (showOptional) => this.setState({ showOptional });

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
          this.setState({ tempImageUrl, tempImageKey, file: acceptedFiles[0], isValidFile: true, error: null });
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
    this.setState({ file: "" });
  }

  /**
   * Method that sets the selected file to a photo from Google
   * Photos.
   * 
   * @param {Object} file
   */
  setGPhoto = (file) => this.setState({ isGPhoto: true, file });

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
        this.setState({ file, tempImageUrl, tempImageKey, isValidFile: true, isGPhoto: true, error: null });
      } catch (error) {
        this.setState({ error, isValidFile: false, isGPhoto: false });
      }
      this.setState({ isFileUploading: false });
    });
  };

  /**
   * Method that deletes the selected Google Photos file.
   */
  deleteGPhoto = () => this.setState({ file: "", fileRef: "", isGPhoto: false });

  /**
   * Method that sets the `selectedButton` state variable with the user's
   * selected button text, and updates `showButtonLink` state variable.
   * 
   * @param {Object} selectedButton
   */
  handleSelect = (selectedButton) => {
    selectedButton !== null
      ? this.setState({
        selectedButton: selectedButton,
        showButtonLink: selectedButton.value !== CTA_BUTTON_TYPES.CALL
      })
      : this.setState({ selectedButton: {}, buttonLink: "", showButtonLink: false });
  }

  /**
   * Method that sets the `buttonLink` state variables with the user's
   * input.
   * 
   * @param {Object} event
   */
  handleButtonLinkInput = (event) => this.setState({ buttonLink: event.target.value, error: null });

  /**
   * Method that sets the `offerLink` state variables with the user's
   * input.
   * 
   * @param {Object} event
   */
  handleOfferLinkInput = (event) => this.setState({ offerLink: event.target.value, error: null });


  /**
   * Method that sets the `selectedOptopm` state variables with the current radio toggle
   * 
   * @param {Object} event
   */
  handleOptionChange = (event) => {
    this.setState({ selectedOption: event.target.value })
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
  handleSubmitPost = async () => {
    const {
      text, tempImageUrl, tempImageKey, file, selectedLocations,
      selectedButton, buttonLink, isGPhoto
    } = this.state;

    this.setState({ isCreatingPost: true });

    const media = file
      ? [
        isGPhoto && !file.googleDriveToken
          ? {
            mediaFormat: 'PHOTO',
            sourceUrl: file.baseUrl
          }
          : {
            mediaFormat: 'PHOTO',
            sourceUrl: tempImageUrl
          }
      ]
      : [];

    // Check if the buttonLink is a valid URL
    if (selectedButton.value && !isURL(buttonLink)) {
      this.setError({ message: "Invalid button link." });
      this.setState({ isCreatingPost: false });
      return;
    }

    const data = {
      locations: selectedLocations.map(location => location.value),
      post: {
        content: text,
        media: media,
        ctaButtonType: selectedButton.value,
        ctaButtonLink: buttonLink !== "" ? buttonLink : undefined
      },
      tempFileKey: tempImageKey || null
    };

    try {
      const submitted = await this.APIRequest.addPost(data) === 200;
      this.setState({ submitted, error: null, isCreatingPost: false });
    } catch (error) {
      this.setState({ error, isCreatingPost: false });
    }

  }

  /**
   * Method that submits the edited data to 
   * the backend.
   */
  handleSubmitOffer = async () => {
    const {
      selectedLocations, title,tempImageKey, tempImageUrl, startDate, endDate, startTime, endTime, file, details,
      coupon, offerLink, isGPhoto, tac, enableTimes
    } = this.state;

    this.setState({ isCreatingOffer: true });

    if ((startDate.valueOf() + startTime.valueOf()) >= (endDate.valueOf() + endTime.valueOf())) {
      this.setError({ message: 'The offer end date should be greater than the offer start date'});
      this.setState({ isCreatingOffer: false });
      return;
    }

    const media = file
      ? [
        isGPhoto && !file.googleDriveToken
          ? {
            mediaFormat: 'PHOTO',
            sourceUrl: file.baseUrl
          }
          : {
            mediaFormat: 'PHOTO',
            sourceUrl: tempImageUrl
          }
      ]
      : [];

    const startDateDTO = {
      year: parseInt(startDate.format('YYYY')),
      month: parseInt(startDate.format('M')),
      day: parseInt(startDate.format('D')),
    }

    const startTimeDTO = {
      hours: enableTimes ? parseInt(startTime.format('H')) : 0,
      minutes: enableTimes ? parseInt(startTime.format('m')) : 1,
      seconds: enableTimes ? parseInt(startTime.format('s')) : 0,
    }

    const endDateDTO = {
      year: parseInt(endDate.format('YYYY')),
      month: parseInt(endDate.format('M')),
      day: parseInt(endDate.format('D')),
    }

    const endTimeDTO = {
      hours: enableTimes ? parseInt(endTime.format('H')) : 0,
      minutes: enableTimes ? parseInt(endTime.format('m')) : 1,
      seconds: enableTimes ? parseInt(endTime.format('s')) : 0,
    }

    if (offerLink && !isURL(offerLink)) {
      this.setError({ message: "Invalid offer link." });
      this.setState({ isCreatingOffer: false });
      return;
    }

    const offerData = {
      couponCode: coupon ? coupon : undefined,
      redeemOnlineUrl: offerLink ? offerLink : undefined,
      termsConditions: tac ? tac : undefined
    }
    const isValidOffer = () => {
      return offerData.termsConditions !== undefined || offerData.couponCode !== undefined || offerData.redeemOnlineUrl !== undefined;
    };
    const data = {
      locations: selectedLocations.map(location => location.value),
      post: {
        content: details ? details : title,
        event: {
          title: title,
          schedule: {
            startDate: startDateDTO,
            startTime: startTimeDTO,
            endDate: endDateDTO,
            endTime: endTimeDTO,
          }
        },
        offer: isValidOffer() ? offerData : undefined,
        media: media,
      },
      tempFileKey: tempImageKey || null
    };

    try {
      const submitted = await this.APIRequest.addPost(data) === 200;
      this.setState({ submitted, error: null, isCreatingOffer: false });
    } catch (error) {
      this.setState({ error, isCreatingOffer: false });
      console.log(error)
    }

  }

  /**
   * Method that renders the Add Post modal body 
   *
   */
  renderAddPost = () => {
    const { locations, text,
      file, isValidFile, showButtonLink,
      isGPhoto, isFileUploading,
      error, isCreatingPost
    } = this.state;

    return (
      <div className="new-post">
        <LocationSelector locations={locations} handleMultiSelect={this.handleMultiSelect} />
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
        <ButtonTextSelector handleSelect={this.handleSelect} />

        {showButtonLink && <ButtonLinkField handleButtonLinkInput={this.handleButtonLinkInput} />}

        {error && <div className="error"><div className="error__content">{error.message}</div></div>}

        <button
          className="button button--hootsuite"
          onClick={this.handleSubmitPost}
          disabled={isFileUploading || isCreatingPost}
        >
          Post Now
        </button>
      </div>
    )
  }

  /**
   * Method that renders the Add Offer modal body 
   *
   */
  renderAddOffer = () => {
    const {
      title,
      startDate,
      endDate,
      enableTimes,
      showOptional,
      startTime,
      endTime,
      details,
      coupon,
      offerLink,
      tac,
      locations,
      file, 
      isValidFile,
      isGPhoto, 
      isFileUploading,
      isCreatingOffer,
      error
    } = this.state;

    return (
      <div className="new-post">
        <LocationSelector locations={locations} handleMultiSelect={this.handleMultiSelect} />
        <MultiUseField 
          title="Offer Title" 
          showIcon={true} 
          text={title} 
          handleTextInput={this.handleTitleInput}
          placeholderText="Enter your offer title..."
        />
        <div>
          <div className="new-post__field__header">
            <div className="new-post__field__header__title">
                <img src={calendarIcon} alt="Calendar Icon" />
              <h4>Start Date</h4>
            </div>
            <label className="new-post__checkbox__label">
              <StyledCheckbox 
                className="new-post__checkbox__toggle" 
                value={enableTimes} 
                onChange={() => this.handleEnableTimesInput(!enableTimes)} 
              />
              Add Time
            </label>
          </div>
        </div>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <div className="new-post__picker-group" >
            <StyledDatePicker
              value={startDate}
              changeHandler={this.handleStartDateInput}
            />

            {
              enableTimes
                ? <StyledTimePicker 
                    value={startTime} 
                    changeHandler={this.handleStartTimeInput} 
                  />
                : null
            }
          </div>
          <div className="new-post__field__header">
            <div className="new-post__field__header__title" style={{ paddingBottom: '10px'}}>
                <img src={calendarIcon} alt="Calendar Icon" />
              <h4>End Date</h4>
            </div>
          </div>
          <div className="new-post__picker-group" >
            <StyledDatePicker 
              value={endDate} 
              changeHandler={this.handleEndDateInput} 
            />
            {
              enableTimes
                ? <StyledTimePicker 
                    value={endTime} 
                    changeHandler={this.handleEndTimeInput} 
                  />
                : null
            }
          </div>
        </MuiPickersUtilsProvider>
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
        
        {/* Hidden in expander */}
        <div 
          className={classnames(
            "new-post__expanded-options",
            { "new-post__expanded-options--collapsed": !showOptional }
          )}
        >
          <div className="new-post__expanded-options__header">
            <img src={informationIcon} alt="Information Icon" className="new-post__expanded-options__header__info-icon" />
            Add more details (Optional)
            <div className="new-post__expanded-options__header__expander-wrapper">
              <IconButton className="new-post__expanded-options__header__icon-button" onClick={() => this.handleShowOptional(!showOptional)}>
                {
                  showOptional
                  ? <img src={expandLess} alt="Expand Less Icon" className="new-post__expanded-options__header__icon-button__expand-icon" />
                  : <img src={expandMore} alt="Expand More Icon" className="new-post__expanded-options__header__icon-button__expand-icon" />
                }
              </IconButton>
            </div>
          </div>
          <MultiUseField 
            title="Offer Details" 
            showIcon={false} 
            text={details} 
            handleTextInput={this.handleDetailsInput}
            placeholderText="Add offer details..." 
          />
          <MultiUseField 
            title="Coupon Code" 
            showIcon={false} 
            text={coupon} 
            handleTextInput={this.handleCouponInput} 
            placeholderText="Add a coupon code..."
          />
          <MultiUseField 
            title="Link to Redeem Offer" 
            showIcon={false} 
            text={offerLink} 
            handleTextInput={this.handleOfferLinkInput} 
            placeholderText="Copy and paste link URL to redeem offer..."
          />
          <MultiUseField 
            title="Terms and Conditions" 
            showIcon={false} 
            text={tac} 
            handleTextInput={this.handleTacInput} 
            placeholderText="Terms and conditions of offer..."
          />
        </div>

        {error && <div className="error"><div className="error__content">{error.message}</div></div>}

        <button
          className="button button--hootsuite"
          onClick={this.handleSubmitOffer}
          disabled={isFileUploading || isCreatingOffer}
        >
          Post Now
        </button>
      </div>
    )
  }

  render() {
    const { isLoading, submitted, selectedOption } = this.state;

    if (isLoading) {
      return (
        <div className="loader">
          <MDSpinner singleColor={LOADING_WHEEL_COLOR} size={40} />
        </div>
      );
    }

    if (submitted) {
      return <Success action="posted" />;
    }

    return (
      <div>
        <div className="new-post__radio-header">
          <label className="new-post__radio-header__label">
            <Radio
              value="post"
              color="default"
              checked={selectedOption === 'post'} 
              onChange={this.handleOptionChange} 
            />
          Add Post
          </label>
          <label className="new-post__radio-header__label">
            <Radio 
              value="offer" 
              color="default"
              checked={selectedOption === 'offer'} 
              onChange={this.handleOptionChange} 
            />
            Add Offer
          </label>
        </div>
        {

          selectedOption === 'post'
          ? this.renderAddPost()
          : this.renderAddOffer()

        }
      </div>
    );
  }
}

export default NewPostModal;
