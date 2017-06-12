import FileLoader from './FileLoader';


class App{

  constructor(){
    this.files = [];
  }
  run($elem, filesUploaded){
      this.loader = new FileLoader().attach($elem, this.filesUploadedEvent.bind(this));
      this.filesUploaded = filesUploaded;
  }

  filesUploadedEvent(files){
    this.files = this.files.concat(files);
    this.filesUploaded(this.files);
  }

  deleteFile(fileName){
    this.files = this.files.filter((file)=>file.name !== fileName);
    this.filesUploaded(this.files);
  }

  editFile(editedFile){
    this.files = this.files
      .filter(file=>file.name !== editedFile.name)
      .concat(editedFile);
    this.filesUploaded(this.files);
  }

}

const singleton = new App();

export default singleton;
