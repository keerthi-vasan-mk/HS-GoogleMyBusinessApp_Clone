import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import classnames from 'classnames';
import closeIcon from '@/assets/images/closeIcon.png';

/**
 * Class that renders the drag and
 * drop file picker or the Google
 * Photos photo picker in the 
 * Hootsuite dashboard.
 */
class DropFiles extends Component {
  render() {
    const {
      handleFile, deleteFile, file,
      isValidFile, isGPhoto, deleteGPhoto
    } = this.props;
  
    if ((file && file.size && file.size !== 0) || isGPhoto) {
      const fileName = isGPhoto ? file.filename : file.name;
      const url = isGPhoto ? file.baseUrl : URL.createObjectURL(file);
      const externalUrl = isGPhoto ? file.productUrl : url;

      const close = isGPhoto
        ? deleteGPhoto
        : () => deleteFile(url);

      return (
        <div className="new-post__field__dropzone new-post__field__dropzone--uploaded">
          <div className="left">
            <div className="left__image-box">
              <a href={externalUrl} target="_blank">
                <img src={url} alt="Uploaded Image" />
              </a>
            </div>
            <p>{fileName}</p>
          </div>
          <img className="close-icon" src={closeIcon} onClick={close} />
        </div>
      );
    }

    return (
      <Dropzone
        onDrop={handleFile}
        multiple={false}
        accept={['image/jpeg', 'image/jpg', 'image/png',]}
      >
        {({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
          const dropzoneClassNames = classnames(
            "new-post__field__dropzone",
            {
              "new-post__field__dropzone--is-active": isDragActive,
              "new-post__field__dropzone--error": isDragReject || !isValidFile
            }
          );

          const dropzoneError = !isValidFile
            ? <p className="new-post__field__dropzone__subtitle new-post__field__dropzone__subtitle--error">Invalid File.</p>
            : null;

          return (
            <div
              {...getRootProps()}
              className={dropzoneClassNames}
            >
              <input {...getInputProps()} />
              <p className="new-post__field__dropzone__subtitle">
                Drag & Drop files here or
              <a className="new-post__field__dropzone__subtitle__link">&nbsp;select a file to upload</a>
              </p>
              {dropzoneError}
            </div>
          );
        }}
      </Dropzone>
    );
  }
}

export default DropFiles;