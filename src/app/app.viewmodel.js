import handlebars from 'handlebars/dist/handlebars';
import 'bootstrap';
import Loader from './editor/image.loader';
import Images from './editor/image.model';
import Editor from './editor/editor.viewmodel';

export default class AppViewModel{

  /**
   * Initialize view model with view objects
   * @param {Object.<jQuery>} $dropzone
   * @param {Object.<jQuery>} $files
   * @param {Object.<jQuery>} $modal
   * @param {Object.<jQuery>} $fileInput
   * @param {Function} fileListFunction compiled handlebars template function
   */
  constructor($dropzone, $files, $modal, $fileInput, fileListFunction){
    this._$dropzone = $dropzone;
    this._$list = $files;
    this._$modal = $modal;
    this._$fileInput = $fileInput;
    this._fileListFunction = fileListFunction;
  }

  /**
   * Utility function to handle complex creation of view model
   */
  static init(){

    const fileListFunction = handlebars.compile($('#file-list').html());
    const viewModal = new AppViewModel($('#dropzone'), $('#files'), $('#editor'), $('#fileInput'), fileListFunction);
    $('#upload').click(()=>viewModal._$fileInput.click());
    viewModal._bindUploadEvents();
  }

  /**
   * Bind elements that handle file uploading events
   * @private
   */
  _bindUploadEvents(){
    this._$dropzone.on('dragover', this._handleDragOver.bind(this));
    this._$dropzone.on('drop', this._handleDropEvent.bind(this));
    this._$fileInput.on('change', this._handleFileSelection.bind(this));
  }

  /**
   * Have to handle the original event and not jQuery wrapper here due to
   * https://stackoverflow.com/questions/14788862/drag-drop-doenst-not-work-dropeffect-of-undefined
   * @param {Object.<jQuery>} event representing drag over event
   * @private
   */
  _handleDragOver(event){
    event.stopPropagation();
    event.preventDefault();
    event.originalEvent.dataTransfer.dropEffect = 'copy';
  }

  /**
   * Handle file dropping event
   * @param {Object.<jQuery>} event containing file drop
   * @private
   */
  _handleDropEvent(event){
    event.stopPropagation();
    event.preventDefault();
    this.uploadFiles(event.originalEvent.dataTransfer.files);
  }

  /**
   * Handle file input selection event
   * @param {Object.<jQuery>} event representing file selection
   * @private
   */
  _handleFileSelection(event){
    const fileList = event.originalEvent.target.files;
    this.uploadFiles(fileList);
  }

  /**
   * Bind edit events for images
   * @private
   */
  _bindEditorEvents(){
    $("button[data-action='editor']").click((event)=>this._editImage($(event.target)));
  }

  /**
   * Open image editor and wait for return
   * Add edited image to list
   * @param {Object.<jQuery>}  $elem the edit button associated with the image
   * @returns {Promise.<void>}
   * @private
   */
  async _editImage($elem){
    const imageData = $elem.attr('data-image');
    const id = $elem.attr('data-id');

    const result = await (new Editor(this._$modal).run(imageData, id));
    if(result.action === 'save'){
      let files = Images.editFile(result.newImage);
      this.updateImageList(files);
    }
  }

  /**
   * Take the HTML5 FileList Object and add it to modal
   * @param {Object} fileList The HTML5 file list object
   * @returns {Promise.<void>}
   */
  async uploadFiles(fileList){
    const fileObjects = await Loader.processFileList(fileList);
    const files = Images.addFiles(fileObjects);
    this.updateImageList(files);
  }

  /**
   * Add files to view and attach remove handler
   * @param {Object} fileObjects obtained from file upload
   */
  updateImageList(fileObjects){
    const output = this._fileListFunction({list:fileObjects});
    this._$list.empty();
    this._$list.append(output);
    $('.delete').click((event)=>this.removeFile($(event.target)));
    this._bindEditorEvents();
  }

  /**
   * Removes image from modal
   * @param {Object.<jQuery>} $elem button that requested deletion
   */
  removeFile($elem){
    const fileName = $elem.attr('data-id');
    const files = Images.deleteFile(fileName);
    this.updateImageList(files);
  }
}
