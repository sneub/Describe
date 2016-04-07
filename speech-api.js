
/**
 * Parses the response from the Vision api
 */
function parseResponse(data) {
	var description = 
		labelDescriptor(data.labelAnnotations) + " " +
		peopleDescriptor(data.faceAnnotations) + " " + 
		landmarkDescriptor(data.landmarkAnnotation) + " " +
		safeSearchDescriptor(data.safeSearchAnnotation);

	$("#resultsDescription").text(description);
}

function labelDescriptor(data) {
	var labelDescription = "This is a person.";

	return labelDescription;
}

function peopleDescriptor(data) {
	var peopleDescription = "Quite happy.";

	return peopleDescription;
}

function landmarkDescriptor(data) {
	var landmarkDescription = "This looks like the eiffel tower.";

	return landmarkDescription;	
}

function safeSearchDescriptor(data) {
	var safeSearchDescription = "This doesn't look like porn.";

	return safeSearchDescription;	
}