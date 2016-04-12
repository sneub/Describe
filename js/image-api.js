
/**
 * Enable native HTML camera capture
 */ 

// Force HTTPS
if (window.location.protocol != "https:") {
    window.location.href = 
    "https:" + window.location.href.substring(window.location.protocol.length);
}

// Put event listeners into place
window.addEventListener("DOMContentLoaded", function() {
  // Grab elements, create settings, etc.
  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    video = document.getElementById("video"),
    videoObj = { "video": true },
    errBack = function(error) {
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
    alert('Sorry, your browser does not support getUserMedia');
  }
}, false);

// Trigger photo take
window.onload=function(){
  document.getElementById("video").addEventListener("click", function() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, 400, 300);
    var jpegUrl = canvas.toDataURL("image/jpeg");
    document.getElementById("base64").innerHTML = jpegUrl;
    sendFileToCloudVision(
      jpegUrl.replace("data:image/jpeg;base64,", ""))
  })
};