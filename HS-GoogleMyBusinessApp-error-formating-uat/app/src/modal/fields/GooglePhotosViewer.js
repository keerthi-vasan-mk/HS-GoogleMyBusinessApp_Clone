import React, { Component } from 'react';
import classnames from 'classnames';
import sadOwl from '@/assets/images/sadOwl.png';

/**
 * Class that renders the Google Photos photo
 * picker in the Hootsuite dashboard.
 */
class GooglePhotosViewer extends Component {

  state = {
    selectedPhoto: {},
    selectedPhotoId: "",
    isPhotoSelected: false,
    invalidPhotoId: ""
  }

  /**
   * Method that sets the selected photo and
   * changes the style to indicate it is
   * selected inside the Google Photos photo 
   * picker.
   * 
   * @param {Object} selectedPhoto
   */
  setSelectedPhoto = (selectedPhoto) => {
    const fileType = selectedPhoto.mimeType.split('/')[1];

    if(['jpeg', 'jpg', 'png'].includes(fileType)) {
      const isDifferentPhoto = this.state.selectedPhoto.id !== selectedPhoto.id;
      
      this.setState({
        selectedPhoto: isDifferentPhoto ? selectedPhoto : {},
        selectedPhotoId: isDifferentPhoto ? selectedPhoto.id : "",
        isPhotoSelected: isDifferentPhoto,
        invalidPhotoId: ""
      });

    } else {
      const isDifferentPhoto = this.state.invalidPhotoId !== selectedPhoto.id;
    
      this.setState({
        selectedPhoto: {},
        selectedPhotoId: "",
        isPhotoSelected: false,
        invalidPhotoId: isDifferentPhoto ? selectedPhoto.id : ""
      });

    }

  }

  /**
   * Method that sets the selected photo
   * in the file preview and closes the 
   * photo picker.
   */
  submitSelectedPhoto = () => {
    const { selectedPhoto } = this.state;
    const { setGPhoto, close } = this.props;

    setGPhoto(selectedPhoto);
    close(false);
  }

  render() {
    const { isPhotoSelected, selectedPhotoId, invalidPhotoId } = this.state;
    const { photos, close, getGPhotos, showLoadMore } = this.props;

    if (photos.length === 0) {
      return (
        <div className="gphotos-viewer gphotos-viewer--none">
          <p>Sorry, you have no photos to choose from.</p>
          <img src={sadOwl} alt="Sad owl" />
          <button
            className="button button--hootsuite button--hootsuite--centered"
            onClick={() => close(false)}
          >
            Close
          </button>
        </div>
      );
    }

    return (
      <div className="gphotos-viewer">
        <div className="gphotos-viewer__grid">
          {photos.map(photo => (
            <div
              key={photo.id}
              className={classnames(
                'gphotos-viewer__grid__photo',
                {
                  'gphotos-viewer__grid__photo--selected': selectedPhotoId === photo.id,
                  'gphotos-viewer__grid__photo--invalid': invalidPhotoId === photo.id
                }
              )}
            >
              <img
                src={`${photo.baseUrl}=w120-h80-c`}
                onClick={() => this.setSelectedPhoto(photo)}
                alt={photo.filename}
              />
            </div>
          ))}
          {showLoadMore &&
            <button
              className="button button--text button--text-hootsuite"
              onClick={getGPhotos}
            >
              Load more
          </button>
          }
        </div>
        <div className="gphotos-viewer__footer">
          {invalidPhotoId !== "" &&
            <div className="gphotos-viewer__footer__error">
              You can only select JPGs, JPEGs or PNGs.
            </div>
          }
          <button
            className="button button--text button--text-hootsuite button--modal"
            onClick={() => close(false)}
          >
            Cancel
          </button>
          <button
            className="button button--hootsuite button--modal"
            onClick={this.submitSelectedPhoto}
            disabled={!isPhotoSelected}
          >
            Continue
          </button>
        </div>

      </div>
    );
  }
}

export default GooglePhotosViewer;