
export default class ImageLoader{

  /**
   * Reads and process file list
   * @param {Object} fileList HTML5 FileList containing images to read
   * @returns {Promise.<Array.<Object>>} Processed file Objects
   */
  static processFileList(fileList){
    const fileReadTasks = [];
    return new Promise(resolve=>{
      Array.from(fileList).forEach((file)=>{
        if(!file.type.match('image.*')){ //only process image files
          return;
        }
        fileReadTasks.push(ImageLoader._processFile(file));
      });

      Promise.all(fileReadTasks)
        .then(fileObjects=>resolve(fileObjects));
    });
  }

  /**
   * Uploads and processes file using FileReader
   * @param {Object} file Html File Object
   * @returns {Promise.<Object>} representing processed file
   * @private
   */
  static _processFile(file){
    return new Promise((resolve)=>{
      const reader = new FileReader();
      reader.onload = (event)=>{
        resolve( {
          name: file.name,
          data: event.target.result,
          objectUrl: ImageLoader.dataUriToBlobUrl(event.target.result)
        });
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Produces Object URL from raw image data
   * @param {string} data representing the image
   * @returns {string} Object Url
   */
  static dataUriToBlobUrl(data) {
    let arr = data.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    const blob = new Blob([u8arr], {type: mime});
    return URL.createObjectURL(blob);
  }
}
