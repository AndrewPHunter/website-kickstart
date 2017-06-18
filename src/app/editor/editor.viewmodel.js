import Processor from './image.processor';

export default class EditorViewModel{

  constructor($modal){
    this._$modal = $modal;
    this._canvas = document.createElement('canvas');
  }

  /**
   * Asynchronously run editor
   * @param {string} imageData the raw image data
   * @param {string} id the filename
   * @returns {Promise.<result>} containing image or cancel command
   */
  run(imageData, id){
    return new Promise(resolve=>{
      this._resolve = resolve;
      this._id = id;
      this._$image = this._$modal.find('#photoToEdit');
      this._$image.attr('src', imageData);
      this._loadImageToCanvas();
      this._$modal.modal('show');
      this._bindEvents();
    });
  }

  /**
   * Loads image into shadow canvas to perform manipulation
   * @private
   */
  _loadImageToCanvas(){
    const image = this._$image.get(0);
    this._canvas.width = image.naturalWidth;
    this._canvas.height = image.naturalHeight;
    const ctx = this._canvas.getContext('2d');
    ctx.drawImage(this._$image.get(0), 0, 0);
  }

  /**
   * Gets the array of pixels from canvas for editing
   * @returns {ImageData} returns pixel information of image
   * @private
   */
  _getPixelData(){
    const context = this._canvas.getContext('2d');
    return context.getImageData(0,0,this._$image.get(0).naturalWidth, this._$image.get(0).naturalHeight);
  }

  /**
   * Bind view events to viewmodel
   * @private
   */
  _bindEvents(){
    $('button.edit').unbind().click((event)=>this._editImage($(event.target)));
    $('#save').unbind().click(()=>this._saveImage());
    $('#cancel').unbind().click(()=>this._cancelEdit());
  }

  /**
   * Resolves promise and returns image data
   * @private
   */
  _saveImage(){
    this._$modal.modal('hide');
    this._resolve({
      action: 'save',
      newImage: {
        name: this._id,
        data: this._$image.attr('src')
      }
    });
  }

  /**
   * resolves promise returning user cancelled action
   * @private
   */
  _cancelEdit(){
    this._$modal.modal('hide');
    this._resolve({action:'cancel'});
  }

  async _editImage($elem){
    $('.edit').addClass('disabled');
    const action = $elem.attr('data-action');
    switch(action){
      case 'lighten': {
        const adjustedImageData = await Processor.adjustBrightness(this._getPixelData(), 10);
        this.updateImage(adjustedImageData);
        break;
      }
      case 'darken':{
        const adjustedImageData = await Processor.adjustBrightness(this._getPixelData(), -10);
        this.updateImage(adjustedImageData);
        break;
      }
      case 'grayscale':{
        const adjustedImageData = await Processor.grayScale(this._getPixelData());
        this.updateImage(adjustedImageData);
        break;
      }
      case 'contrast-up':{
        const adjustedImageData = await Processor.adjustContrast(this._getPixelData(), 30);
        this.updateImage(adjustedImageData);
        break;
      }
      case 'contrast-down':{
        const adjustedImageData = await Processor.adjustContrast(this._getPixelData(), -30);
        this.updateImage(adjustedImageData);
        break;
      }
    }
    $('.edit').removeClass('disabled');
  }

  updateImage(imageData){
    const context = this._canvas.getContext('2d');
    context.putImageData(imageData,0,0);
    this._$image.attr('src', this._canvas.toDataURL());
  }
}
