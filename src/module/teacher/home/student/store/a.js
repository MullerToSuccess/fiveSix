document.getElementById("capturePhoto").addEventListener("click",function (){
  var optionObject = {
    quality: 50,
    encodingType: navigator.camera.EncodingType.JPEG,
    targetWidth: 200,
    targetHeight: 200,
    sourceType: navigator.camera.PictureSourceType.CAMERA
  };
  optionObject.allowEdit = true;
  optionObject.destinationType = navigator.camera.DestinationType.FILE_URI;
  navigator.camera.getPicture(function(message){
    alert(message);
  }, function(){}, optionObject);
},true);
document.getElementById("getImage").addEventListener("click",function (){
  var optionObject = {
    quality: 50,
    encodingType: navigator.camera.EncodingType.JPEG,
    targetWidth: 200,
    targetHeight: 200,
    sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
  };
  optionObject.allowEdit = true;
  optionObject.destinationType = navigator.camera.DestinationType.FILE_URI;
  navigator.camera.getPicture(function(message){
    alert(message);
  }, function(){}, optionObject);
},true);
