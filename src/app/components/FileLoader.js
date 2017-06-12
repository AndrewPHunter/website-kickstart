
export default class FileLoader{

  attach($elem, callback){
    this.$elem = $elem;
    this.attachDragDropEvents();
    this.callback = callback;
  }

  attachDragDropEvents(){
    this.$elem.on('dragover',this._handleDragOver.bind(this));
    this.$elem.on('drop', this._handleDropEvent.bind(this));
  }

  /*
   * Have to handle the original event and not jQuery wrapper here due to
   * DataTransfer object not being added as of yet.
   * https://stackoverflow.com/questions/14788862/drag-drop-doenst-not-work-dropeffect-of-undefined
   */

  _handleDragOver(event){
    event.stopPropagation();
    event.preventDefault();
    event.originalEvent.dataTransfer.dropEffect = 'copy';
  }

  _handleDropEvent(event){
    event.stopPropagation();
    event.preventDefault();
    this._readFiles(event.originalEvent.dataTransfer.files);
  }

  _readFiles(fileList){

    const fileReadTasks = [];

    Array.from(fileList).forEach((file)=>{
      if(!file.type.match('image.*')){ //only process image files
        return;
      }
      fileReadTasks.push(this._processFile(file));
    });

    Promise.all(fileReadTasks)
      .then(fileObjects=>this.callback(fileObjects));
  }

  _processFile(file){
    return new Promise((resolve)=>{
      const reader = new FileReader();
      reader.onload = (event)=>{
        resolve( {
          name: file.name,
          data: event.target.result
        });
      };
      reader.readAsDataURL(file);
    });
  }
}
