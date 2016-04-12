/**
 * Enable native HTML camera capture
 */ 
/*
// Force HTTPS (comment out for local use)
if (window.location.protocol != "https:") {
    window.location.href = 
    "https:" + window.location.href.substring(window.location.protocol.length);
}
*/

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
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var video = document.getElementById("video");
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

  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, 400, 300);
  var jpegUrl = canvas.toDataURL("image/jpeg");
  sendFileToCloudVision(
    jpegUrl.replace("data:image/jpeg;base64,", ""))
}


// Put event listeners into place
window.onload = function() {
  document.getElementById("capture-btn").addEventListener("click", takePicture);
  showVideo();
};

function switchSource() {
  if (cameraIds.length > 1) {
    currentCamera = (currentCamera + 1) % cameraIds.length;
  }
  showVideo();
}
/*

'use strict';


if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
  console.log("enumerateDevices() not supported.");
}

// List cameras and microphones.

navigator.mediaDevices.enumerateDevices()
.then(function(devices) {
  devices.forEach(function(device) {
    console.log(device.kind + ": " + device.label +
                " id = " + device.deviceId);
  });
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});

var videoElement = document.querySelector('video');
var videoSelect = document.querySelector('select#videoSource');

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function gotSources(sourceInfos) {
  for (var i = 0; i !== sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    var option = document.createElement('option');
    option.value = sourceInfo.id;
    if (true) {//sourceInfo.kind === 'video') {
      option.text = sourceInfo.label || 'camera ' + (videoSelect.length + 1);
      videoSelect.appendChild(option);
    } else {
      console.log('Some other kind of source: ', sourceInfo);
    }
  }
}

if (typeof MediaStreamTrack === 'undefined' ||
    typeof MediaStreamTrack.getSources === 'undefined') {
  alert('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
} else {
  MediaStreamTrack.getSources(gotSources);
}

function successCallback(stream) {
  window.stream = stream; // make stream available to console
  videoElement.src = window.URL.createObjectURL(stream);
  videoElement.play();
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function start() {
  if (window.stream) {
    videoElement.src = null;
    window.stream.stop();
  }
  var videoSource = videoSelect.value;
  var constraints = {
    video: {
      optional: [{
        sourceId: videoSource
      }]
    }
  };
  navigator.getUserMedia(constraints, successCallback, errorCallback);
}

//videoSelect.onchange = start;

start();
*/