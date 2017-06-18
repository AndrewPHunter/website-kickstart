import Loader from './image.loader';

/**
 * Represents the total model for the app providing access to all files uploaded
 * Named export for testing purposes
 */
export class ImageModel{

  constructor(){
    this._files = [];
  }

  /**
   * Add an array of files to the model
   * @param {Array} files the files to add to the model
   * @returns {Array} all of the files
   */
  addFiles(files){
    this._files = this._files.concat(files);
    return this._files;
  }

  /**
   * Removes a file from the model
   * @param {string} fileName name of file to be removed
   * @returns {Array} the files in the model
   */
  deleteFile(fileName){
    this._files = this._files.filter(file=>file.name !== fileName);
    return this._files;
  }

  /**
   * Removes existing photo in model and adds edited copy
   * @param {Object} editedFile the newly edited photo
   * @returns {Array} the files in model
   */
  editFile(editedFile){
    editedFile["objectUrl"] = Loader.dataUriToBlobUrl(editedFile.data);
    this._files = this._files
      .filter(file=> file.name !== editedFile.name)
      .concat(editedFile);
    return this._files;
  }

  /**
   * Getter access for files in model
   * @returns {Array} the files in model
   */
  get files(){
    return this._files;
  }
}

/**
 * Provides default iterator access to collection
 * @private
 */
ImageModel[Symbol.iterator] = ImageModel._files;

const singleton = new ImageModel();

export default singleton;
