/**
 * Voices pre-loading
 */
var speech_voices;
if ('speechSynthesis' in window) {
  speech_voices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = function() {
    speech_voices = window.speechSynthesis.getVoices();
  };
  console.log(speech_voices);
}

/**
 * Parses the response from the Vision api
 */
function parseResponse(data) {
	//console.log(JSON.stringify(data, null, 4));

	if (!data) {
		speak("I have no idea what this is, stop wasting my time !");	
		return;	
	}
	
	data = data.responses[0];

	var description = 
		landmarkDescriptor(data.landmarkAnnotations) + " " +
		labelDescriptor(data.labelAnnotations) + " " +
		peopleDescriptor(data.faceAnnotations) + " " + 
		logoDescriptor(data.logoAnnotations) + " " +
		safeSearchDescriptor(data.safeSearchAnnotation);

	$("#resultsDescription").text(description);

	speak(description);
}

function landmarkDescriptor(data) {
	if (!data) {
		return "";
	}

	var intro = "This looks like a famous landmark, probably";
	var items = [". It's a shame it's so ugly.",". It's beautiful"]
	var closing = items[Math.floor(Math.random()*items.length)];	
	var elements = "";
	var prefix = " the ";

	for (var i = 0; i < data.length; i++) {
		if (i != 0) {
			prefix = " or the ";			
		}
		elements = elements + prefix + data[i].description;
	}

	if (elements == "") {
		return "";
	}

	return intro + elements + closing;
}

function labelDescriptor(data) {
	if (!data) {
		return "";
	}

	var intro = "I think I see";
	var items = [". Boring...",". Brilliant...",". Strange...",". What a useless thing..."]
	var closing = items[Math.floor(Math.random()*items.length)];
	var elements = "";
	var prefix = " a ";

	for (var i = 0; i < data.length; i++) {
		if (i != 0) {
			prefix = " or a ";		
		}
		elements = elements + prefix + data[i].description;
	}

	if (elements == "") {
		return "";
	}

	return intro + elements + closing;
}

function peopleDescriptor(data) {
	if (!data) {
		return "";
	}

	data = data[0];

	var intro = "This person looks";
	var closing = ".";
	var elements = "";

	if (data.joyLikelihood != "VERY_UNLIKELY") {
		elements += " happy";
	}
	if (data.sorrowLikelihood != "VERY_UNLIKELY") {
		if (elements != "") {
			elements += " or sad";
		} else {
			elements += " sad";
		}
	}
	if (data.angerLikelihood != "VERY_UNLIKELY") {
		if (elements != "") {
			elements += " angry";					
		} else {
			elements += " angry";			
		}	
	}
	if (data.surpriseLikelihood != "VERY_UNLIKELY") {
		if (elements != "") {
			elements += " or surprised";	
		} else {
			elements += " surprised";	
		}		
	}
	if (elements != "") {
		var emotion = intro + elements + closing;		
	} else {
		var emotion = "";
	}

	intro = "The picture is ";
	elements = "";
	if (data.underExposedLikelihood != "VERY_UNLIKELY") {
		elements += " underexposed";		
	}
	if (data.blurredLikelihood != "VERY_UNLIKELY") {
		elements += " blurry";
	}
	if (elements != "") {
		var pictureQuality = intro + elements + closing;
	} else {
		var pictureQuality = "";
	}

	var headCap = "";
	// Hat detection is too enthusiastic at the moment	
	/*
	if (data.headwearLikelihood != "VERY_UNLIKELY") {
		headCap = "And nice hat !";
	}
	*/

	var result = "";
	if (emotion != "") {
		result += emotion + " ";
	}
	if (emotion != "") {
		result += pictureQuality + " ";
	}
	if (emotion != "") {
		result += headCap + " ";
	}

	return result;
}

function logoDescriptor(data) {
	if (!data) {
		return "";
	}

	var intro = "Is that a ";
	var items = ["logo ? I hate that brand !","logo ? I love that brand !"]
	var closing = items[Math.floor(Math.random()*items.length)];	
	var element = data[0].description;

	return intro + element + closing;
}

function safeSearchDescriptor(data) {
	if (!data) {
		return "";
	}

	if (data.adult != "UNLIKELY" && data.adult != "VERY_UNLIKELY") {
		return	"There's something kinky about it, I like it !";	
	}

	return "";	
}

/*
 * Speaks out loud the input text sentence
 */
function speak(text) {
	var platform = navigator.platform;
    var msg = new SpeechSynthesisUtterance(text);
    if (platform === "MacIntel") {
		msg.voice = speech_voices.filter(function(voice) { return voice.name == 'Daniel'; })[0];
		msg.pitch = 2;
	} else {
		msg.voice = speech_voices.filter(function(voice) { return voice.name == 'Google UK English Male'; })[0];	
	}
    speechSynthesis.speak(msg);
}