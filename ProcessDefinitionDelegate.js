
/**
 * This class is a delegate to the processAPI on scriptr.io. 
 * It handles the loading and saving of process definitions
 * @class ProcessDefinitionDelegate
 * @constructor 
 * @param {Object} listener : this listener is invoked when a list of process definitions is loaded or when 
 * a process definition is obtained. The listener should provided the following callbacks respectively:
 * onProcessDefinitionListLoaded, onProcessDefinitionLoaded.
 * @param {Object} scriptrio : an instance of the Scriptr client (optional, if not provided creates its own instance)
 */

function ProcessDefinitionDelegate(listener, scriptrio) {

	this.listener = listener;
	this.scriptrio = scriptrio ? scriptrio : new Scriptr({token: AUTH_TOKEN}); // we assume that config.js is loaded
	//this.loadProcessDefinitions();
}

/**
 * Load available process definitions (list of names) from scriptr.io
 * Once this list is available, invoke the onProcessDefinitionListLoaded callback
 * of the provided listener
 * @method loadProcessDefinitions
 */
ProcessDefinitionDelegate.prototype.loadProcessDefinitions = function() {

	// invoke remote API on scriptr;
	var self = this;
	var dto = {
		
		api: "workflow/api/processAPI", 
		params: { 
			action: "listProcessDefinitions"
		},
		onSuccess: function(definitions){
			try {
				self.listener.onProcessDefinitionListLoaded.call(self.listener, definitions);
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
 * Load a complete process definition scriptr.io
 * Once this list is available, invoke the onProcessDefinitionLoaded callback
 * of the provided listener
 * @method loadProcessDefinitions
 * @para, {String} processDefinitionId : the identifier of an existing process definition
 */
ProcessDefinitionDelegate.prototype.getProcessDefinition = function(processDefinitionId) {

	// invoke remote API on scriptr;
	var self = this;
	var dto = {
		
		api: "workflow/api/processAPI", 
		params: { 
			action: "getProcessDefinition",
			actionParams: processDefinitionId
		},
		onSuccess: function(definition){
			self.listener.onProcessDefinitionLoaded.call(self.listener, definition);
		}, 
		onFailure: function(error) {alert(JSON.stringify(error));}
	};
	
	scriptrio.request(dto);
};

ProcessDefinitionDelegate.prototype.saveProcessDefinition = function(processDefinitionParam) {
		// invoke remote API on scriptr;
			var self = this;
			var dto = {
				
				api: "workflow/api/processAPI", 
				params: { 
					action: "saveProcessDefinition",
					actionParams: processDefinitionParam
				},
				method: "POST",
				asJson: true,
				onSuccess: function(definition){
					self.listener.onProcessDefinitionLoaded.call(self.listener, definition);
				}, 
				onFailure: function(error) {alert(JSON.stringify(error));}
			};
			
			scriptrio.request(dto);
};