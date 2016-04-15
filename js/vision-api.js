// Copyright 2015, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Expecting this line in file named key.js
var apiKey = "AIzaSyAztm0VuBxU20ISVXYC7ht_srKWcIx0pkE";
var CV_URL = "https://vision.googleapis.com/v1/images:annotate?key=" + apiKey;

/**
 * Sends the given file contents to the Cloud Vision API and outputs the
 * results.
 */
function sendFileToCloudVision(content) {
  var type = $("#fileform [name=type]").val();

  // Strip out the file prefix when you convert to json.
  var request = {
    requests: [{
      image: {
        content: content
      },
      features: [
	      {
	        type: "LABEL_DETECTION",
	        maxResults: 2
	      },
	      {
	        type: "FACE_DETECTION",
	        maxResults: 2
	      },
	      {
	        type: "LANDMARK_DETECTION",
	        maxResults: 2
	      },
	      {
	        type: "LOGO_DETECTION",
	        maxResults: 1
	      },	      	      
	      {
	        type: "SAFE_SEARCH_DETECTION",
	      }	
      ]
    }]
  };

  $('#results').text('Loading...');
  $.post({
    url: CV_URL,
    data: JSON.stringify(request),
    contentType: 'application/json'
  }).fail(function(jqXHR, textStatus, errorThrown) {
  	speak("I have no idea what this is, stop wasting my time !");
    console.log('ERRORS: ' + textStatus + ' ' + errorThrown);
  }).done(parseResponse);
}