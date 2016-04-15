/**
 * Enable native HTML camera capture
 */ 

// Force HTTPS (comment out for local use)
if (window.location.hostname != "localhost" && window.location.protocol != "https:") {
    window.location.href = 
    "https:" + window.location.href.substring(window.location.protocol.length);
}

if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
  console.log("enumerateDevices() not supported.");
}
// List cameras and microphones.
var cameraIds = [];
var currentCamera = 0;
navigator.mediaDevices.enumerateDevices()
  .then(function(devices) {
    devices.forEach(function(device) {
      if (device.kind === "videoinput") {
        cameraIds.push(device.deviceId);
      }
    });
  })
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  });

function showVideo() {
  // Grab elements, create settings, etc.
  var canvas = $("#canvas")[0];
  var context = canvas.getContext("2d");
  var video = $("#video")[0];
  var videoObj = {
    "video": {
      "optional": [{"sourceId": cameraIds[currentCamera]}]
    }
  };
  var errBack = function(error) {
      console.log("Video capture error: ", error.code); 
  };

  // Put video listeners into place
  if(navigator.getUserMedia) { // Standard
    navigator.getUserMedia(videoObj, function(stream) {
      video.src = stream;
      video.play();
    }, errBack);
  } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia(videoObj, function(stream){
      video.src = window.URL.createObjectURL(stream);
      video.play();
    }, errBack);
  } else if(navigator.mozGetUserMedia) { // Firefox-prefixed
    navigator.mozGetUserMedia(videoObj, function(stream){
      video.src = window.URL.createObjectURL(stream);
      video.play();
    }, errBack);
  } else {
    alert('Sorry, your browser does not support getUserMedia().');
  }
}

function takePicture() {
  $("#upload-form").submit();

  var canvas = $("#canvas")[0];
  var context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, 400, 300);
  var jpegUrl = canvas.toDataURL("image/jpeg");
  sendFileToCloudVision(
    jpegUrl.replace("data:image/jpeg;base64,", ""))
}

function switchSource() {
  console.log("Switching...");
  if (cameraIds.length > 1) {
    currentCamera = (currentCamera + 1) % cameraIds.length;
    showVideo();
  }
}

/**
 * 'submit' event handler - reads the image bytes
 */
function uploadFiles(event) {
  event.preventDefault(); // Prevent the default form post

  // Grab the file and asynchronously convert to base64.
  var file = $('#fileform [name=fileField]')[0].files[0];
  var reader = new FileReader();
  reader.onloadend = processFile;
  reader.readAsDataURL(file);
}

/**
 * Event handler for a file's data url - extract the image data and pass it off.
 */
function processFile(event) {
  var content = event.target.result;
  var img = new Image();
  img.src = content;
  (function(){
      if (img.complete){
          var canvas = $("#canvas")[0];
          var context = canvas.getContext("2d");
          context.drawImage(img, 0, 0, 400, 300);
          }
      else {
          setTimeout(arguments.callee, 50);
          }
      })();

  sendFileToCloudVision(
      content.replace("data:image/jpeg;base64,", ""));
}

// Put event listeners into place
$(document).ready(function() {
  $("#fileform").on("submit", uploadFiles);

  $("#upload-btn").on("click", function(){
    $("#picture-picker").click();
  });

  $("#picture-picker").change(function(){
    $("#fileform").submit();
 });

  $("#capture-btn").on("click", takePicture);
  $("#switch-btn").on("click", switchSource);  
  showVideo();  
});

