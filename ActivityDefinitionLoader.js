// The URL of the API to invoke on the back-end in order to retrieve the list of available activity definitions
var URL = "https://api.scriptr.io/workflow/api/activityAPI?action=listActivityDefinitions&auth_token=YOUR_TOKEN";

/**
 * This class asynchronously loads the definitions of worflow activities that are available
 * on the back-end. The loaded definitions are loaded upon instanciation of the class and
 * are stored in the "availableDefinitions" property of the instance
 * @class ActivityDefinitionLoader
 * @constructor ActivityDefinitionLoader
 * @param {Object} listener : (optional) an instance of a class that has a "onActivityDefinitionsLoaded" method
 * this latter is called as soon as the activity definitions are loaded from the back-end
 */
function ActivityDefinitionLoader(listener) {

	this.availableDefinitions = {};
	this.listener = listener;
	this.loadDefinitions(listener);
}

/**
 * Asynchronously nvokes the back-end API that provides the list of activity definitions and their properties
 * If a listener was provided, it is notified once the list of definitions is loaded
 * @method loadDefinitions
 * @param {Object} listener : (optional) an instance of a class that has a "onActivityDefinitionsLoaded" method
 * this latter is called as soon as the activity definitions are loaded from the back-end
 */
ActivityDefinitionLoader.prototype.loadDefinitions = function(listener) {
	
	// invoke remote API on scriptr;
	var self = this;
	var xmlHttp = new XMLHttpRequest();
	var url = URL + "&apsws.time=" +  new Date().getTime();
	xmlHttp.onreadystatechange = function(event) {
		self._invokeListActivityDefinitionsAPI(event, xmlHttp, listener);
	};
	
	xmlHttp.open("GET", url, true);
	xmlHttp.send();
};

/**
 * @method getDefinition
 * @param {String} activityName : the name of an actity definition
 * @return {Object} an activity definition (name + properties)
 */
ActivityDefinitionLoader.prototype.getDefinition = function(activityName) {

	if (!this.availableDefinitions[activityName]) {
		
		throw {
			"errorCode": "Activity_Not_Found",
			"errorDetail": "Could not find a definition for activity " +  activityName
		}
	}
	
	return this.availableDefinitions[activityName];
};

ActivityDefinitionLoader.prototype._invokeListActivityDefinitionsAPI = function(event, xmlhttp, listener) {
	
	if (xmlhttp.readyState==4) {

		if (xmlhttp.status==200){
		
			try {
				
				var jsonResponse = JSON.parse(xmlhttp.responseText);
				var response = jsonResponse.response
				if (response.metadata.status == "failure") {
					
					throw {
						"errrorCode": "Loading_Failed",
						"errorDetail": "Failed to load the definitions of activities. Please try reloading the editor"
					};
				}
				
				if (listener) {
					listener.onActivityDefinitionsLoaded(response.result, listener);
				}
				
				return response.result;
			}catch(exception) {
				
				throw {
					"errorCode": "Internal_Error",
					"errorDetail": "Something went wrong ( " +  exception.message + ")"
				};
			}
		}else {
		
			throw {
				"errrorCode": "Loading_Failed",
				"errorDetail": "Failed to load the definitions of activities (" + xmlhttp.status + ")"
			};
		}
	}
};