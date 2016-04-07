
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
	var closing = ".";
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

	var intro = "I see";
	var closing = ".";
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
		elements += " sad";
	}
	if (data.angerLikelihood != "VERY_UNLIKELY") {
		elements += " angry";		
	}
	if (data.surpriseLikelihood != "VERY_UNLIKELY") {
		elements += " surprised";
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
	if (data.headwearLikelihood != "VERY_UNLIKELY") {
		headCap = "And nice hat bro !";
	}

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
	var closing = ". I hate that brand !";
	var element = data[0].description;

	return intro + element + closing;
}

function safeSearchDescriptor(data) {
	if (!data) {
		return "";
	}

	if (data.adult != "VERY_UNLIKELY") {
		return	"There's something kinky, I like it !";	
	}

	return "";	
}

/*
 * Speaks out loud the input text sentence
 */
function speak(text) {
    var msg = new SpeechSynthesisUtterance(text);
	var voices = window.speechSynthesis.getVoices();
    msg.default = false;
	msg.voice = voices.filter(function(voice) { return voice.name == 'Alice'; })[0];
    msg.lang = 'en-GB';

	/*msg.voiceURI = 'native';
	msg.volume = 1; // 0 to 1
	msg.rate = 1; // 0.1 to 10
	msg.pitch = 2; //0 to 2
	msg.lang = 'en-US';    */
    speechSynthesis.speak(msg);
}