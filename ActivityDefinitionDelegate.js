
/**
 * This class asynchronously loads the definitions of worflow activities that are available
 * on the back-end. The loaded definitions are loaded upon instanciation of the class and
 * are stored in the "availableDefinitions" property of the instance
 * @class ActivityDefinitionDelegate
 * @constructor
 * @param {Object} listener : (optional) an instance of a class that has a "onActivityDefinitionsLoaded" method
 * this latter is called as soon as the activity definitions are loaded from the back-end
 * @param {Object} scriptrio : an instance of the Scriptr client (optional, if not provided creates its own instance)
 */
function ActivityDefinitionDelegate(listener, scriptrio) {

	this.availableDefinitions = {};
	this.listener = listener;	
	this.scriptrio = scriptrio ? scriptrio : new Scriptr({token: AUTH_TOKEN}); // we assume that config.js is loaded
	this.loadDefinitions(listener);
}

/**
 * Asynchronously invokes the back-end API that provides the list of activity definitions and their properties
 * If a listener was provided, it is notified once the list of definitions is loaded
 * @method loadDefinitions
 * @param {Object} listener : (optional) an instance of a class that has a "onActivityDefinitionsLoaded" method
 * this latter is called as soon as the activity definitions are loaded from the back-end
 */
ActivityDefinitionDelegate.prototype.loadDefinitions = function(listener) {
	
	// invoke remote API on scriptr;
	var dto = {
		
		api: "workflow/api/activityAPI", 
		params: { 
			action: "listActivityDefinitions"
		},
		onSuccess: function(definitions){
			
			try {
				listener.onActivityDefinitionsLoaded.call(listener, definitions);
			}catch(exception) {				
				alert(getErrorMessage(exception));
			}
		}, 
		onFailure: function(error) {			
			alert(getErrorMessage(error));
		}
	};
	
	scriptrio.request(dto);
};

/**
 * @method getDefinition
 * @param {String} activityName : the name of an actity definition
 * @return {Object} an activity definition (name + properties)
 */
ActivityDefinitionDelegate.prototype.getDefinition = function(activityName) {

	if (!this.availableDefinitions[activityName]) {
		
		throw {
			"errorCode": "Activity_Not_Found",
			"errorDetail": "Could not find a definition for activity " +  activityName
		}
	}
	
	return this.availableDefinitions[activityName];
};

