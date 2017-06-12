import handlebars from 'handlebars/dist/handlebars';
import 'bootstrap';
import './components/photojshop.jquery';
import './app.style.scss';
import app from './components/FileApp';

$(()=>{
  const $dropZone = $('#dropzone');
  const fileListFunction = handlebars.compile($('#file-list').html());
  const $list = $('#files');
  const $modal = $('#editor');

  $modal.on('show.bs.modal', function(event){
    modalOnShow(event, $(this));
  });
  app.run($dropZone, (files)=>addFileList($list, files, fileListFunction));
});

function addFileList($list, files, fileListFunction){
  const output = fileListFunction({list:files});
  $list.empty();
  $list.append(output);
  bindEventHandlers();
}

function removeFile($elem){
  const fileName = $elem.attr('data-id');
  app.deleteFile(fileName);
}

function bindEventHandlers(){
  $('.delete').click(function(){
    removeFile($(this));
  });
}

function modalOnShow(event, $modal){
  const button = $(event.relatedTarget);
  const imageData = button.attr('data-image');
  const id = button.attr('data-id');

  $modal.find('#photoToEdit')
    .attr('src', imageData)
    .attr('data-id', id);

  bindEditorEvents($modal);
}

function bindEditorEvents($modal){
  $('button.edit').unbind().click(function(){
    const action = $(this).attr('data-action');
    $('#photoToEdit').PhotoJShop({
      effect: action,
      replace: true
    });
  });

  $('#save').unbind().click(function(){
    const $image = $('#photoToEdit');
    const newImage = {
      name: $image.attr("data-id"),
      data: $image.attr('src')
    };

    app.editFile(newImage);
    $modal.modal('hide');
  });
}
