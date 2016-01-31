var DONE = "_done";

function getErrorMessage(error) {
	
	var message = "";
	if (typeof error == "object") {
		message = JSON.stringify(error)
	} else {
		message = error;
	}
	
	return message;
};