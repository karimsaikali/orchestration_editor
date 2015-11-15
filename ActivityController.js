
/**
 * This class controls everything that relates to activity definitions, from displaying
 * the list of available definitions to handling the events on activity definitons placed
 * on the design panel
 * @class ActivityController
 * @constructor ActivityController
 */
function ActivityController() {
	
	this.count = 0;
	this.definitions = {}; // Activity definitions as loaded from the back-end	
	this.activities = {}; // Activity definitions instances, built on the base of definitions
	this.selectedActivities = [];
	
	// detect key down events on page
	var self = this;
	document.onkeydown = function() {
		self.onActivityKeydown();
	};
}

/**
 * Handles the creation of a new activity definition instance of the editor panel
 * and in the activities property of the ActivityController instance
 * @method addElement
 * @param {Object} self :  (optional) the current ActivityController instance
 * in case the method was called out of the context of the controller
 */ 
ActivityController.prototype.addElement = function(self) {
	
	self = self ? self : this;	
	var id = event.target.id + this.count++; 
	var newActivityDefInstance = new ActivityModel(id, self.definitions[event.target.id], self);
	self.activities[id] = newActivityDefInstance;	
};

/**
 * Display a form to show the properties of the selected activity definition
 * @method onActivityDblClick
 * @param {Object} view : the view that issued the dble click event (self view)
 */ 
ActivityController.prototype.onActivityDblClick = function(view) {
	view.buildPropertiesView();
};

/**
 * First time clicked, select the current element. Second time, unselect it
 * @method onActivityClick
 * @param {Object} view : the view that issued the dble click event (self view)
 */ 
ActivityController.prototype.onActivityClick = function(view) {
	
	var pos = this.selectedActivities.indexOf(event.target.id);
	if (event.ctrlKey) {
	
		if (pos == -1) {
		
			this.selectedActivities.push(event.target.id);
			view.setSelected(true);
		}else {
		
			this.selectedActivities.splice(pos,1);
			jsPlumb.clearDragSelection();
			view.setSelected(false);
		}
	}else if (pos !== -1 ) { /** remove the selection of the activity on click      */
		this.selectedActivities.splice(pos,1);
		jsPlumb.clearDragSelection();
		view.setSelected(false);
	}
	
	if (this.selectedActivities) {
		jsPlumb.addToDragSelection(this.selectedActivities);
	}
};

/**
 * Handle onkeydown event of the main document. Notably used to delete an activity
 * or a selection of activities
 * @method onActivityKeydown
 */
ActivityController.prototype.onActivityKeydown = function() {

	switch(event.keyCode) {	
		case 46: this._handleDelete();break;
	};
};
 
/**
 * This method should be invoked when an activity has been updated in the editor
 * The method will reflect this changes when needed (e.g. the startCondition when 
 * the name changed)
 * @method onActivityChanged
 * @param {Object} oldAndNewValues : a JSON structure containing the modified
 * with their former and new values
 * {prop1:[old, new], ..., propN:[old, new]}}
 */
ActivityController.prototype.onActivityChanged = function(oldAndNewValues) {
	
	// loop through the existing activities and find any activity that has a startCondition
	// containing the former name of the modified activity
	var activity = null;
	var keys = Object.keys(this.activities);
	for (var i = 0; i < keys.length; i++) {
		
		activity = this.activities[keys[i]];
		if (activity.startCondition.indexOf(oldAndNewValues.name[0] + "_Done") > -1) {
			activity.startCondition = activity.startCondition.replace(oldAndNewValues.name[0], oldAndNewValues.name[1]);
		}
	}
};

/**
 * Listener method, that is automatically invoked once activity definitions are loaded from the back-end
 * The definitions are stored in an array adnd the list of definitions on the screen is refreshed
 * @param {Array} definitions : array of activity definitions and their properties (name, fullTypeName, filters, etc.)
 * @param {Object} self : a reference to the current instance of ActivityController since this method is called out of context
 */
ActivityController.prototype.onActivityDefinitionsLoaded = function(definitions, self) {
	
	for (var i = 0; i <  definitions.length; i++) {	
		self.definitions[definitions[i].name] = definitions[i];
	}
	
	self._refreshActivityDefinitions(definitions);
};

/**
 * This listener is automatically called by the JSPlumb framework when the designer drags a connection
 * from a source activity definition to a target one, and is about to connect it to the latter
 * The startCondition of the target activity is updated to include the new source activity
 * @method onBeforeDrop
 * @param {Object} event : the onBeforeDrop event that is emitted but the JSPlumb framework. 
 * It contains data about the source and target activity definitions that are about to be connected
 */
ActivityController.prototype.onBeforeDrop = function(event, self) {
	
	var targetActivity = self.activities[event.targetId];
	var sourceActivity = self.activities[event.sourceId];
	targetActivity.startCondition = sourceActivity.name + "_Done" + (targetActivity.startCondition ? " && " + targetActivity.startCondition : "");
};

/**
 * This listener is automatically called by the JSPlumb framework when the designer drags away 
 * an connection from a target activity definition in order to remove it.
 * The startCondition of the target activity is updated to remove the corresponding source activity
 * @method onBeforeDrop
 * @param {Object} event : the onBeforeDrop event that is emitted but the JSPlumb framework. 
 * It contains data about the source and target activity definitions that were connected
 */
ActivityController.prototype.onBeforeDetach = function(event, self) {
	
	var targetActivity = self.activities[event.targetId];
	var sourceActivity = self.activities[event.sourceId];
	var condition = " && " + sourceActivity.name + "_Done";
	var from = targetActivity.startCondition.indexOf(condition);
	if (from == -1) {
		
		condition = sourceActivity.name + "_Done" + " && ";
		from = targetActivity.startCondition.indexOf(condition);
	} 
	
	if (from == -1) {		
		condition = sourceActivity.name + "_Done";
	}
	
	targetActivity.startCondition = targetActivity.startCondition.replace(condition, "");
};

ActivityController.prototype._refreshActivityDefinitions = function(definitions) {
	
	var definitionNode = document.getElementById("definitions");
	var toolbarNode = document.getElementById("toolbar");
	toolbarNode.removeChild(definitionNode);
	var newDefinitions = document.createElement("div");
	newDefinitions.id = "definitions"; 
	toolbarNode.appendChild(newDefinitions);
	var currentDefinition = null;
	for (var i = 0; i < definitions.length; i++) {
		
		currentDefinition = {
			
			"name": definitions[i].name,
			"value": definitions[i]
		};
		
		this._addAvitivityDefinition(currentDefinition);
	}
};

ActivityController.prototype._addAvitivityDefinition = function(definition) {
	
	var self = this;
	var definitionNode = document.getElementById("definitions");
	var activityDefinition = document.createElement("div");
	activityDefinition.id = definition.name; 
	activityDefinition.className = "toolbarElement";
	activityDefinition.appendChild(document.createTextNode(definition.name));
	activityDefinition.onclick =  function() {self.addElement(self);};
	definitionNode.appendChild(activityDefinition);
};

ActivityController.prototype._handleDelete = function() {

	if (this.selectedActivities.length > 0) {
	
		var elt = this.selectedActivities.length == 1 ? "activity" : "activities";
		var msg = "Are you sure you want to delete the selected " + elt + "?";
		var dialogView = new DialogView(msg, this._deleteActivities);
		if (dialogView.confirmAction ){
				for (var i = 0; i < this.selectedActivities.length; i++) {
					jsPlumb.clearDragSelection();
					view.setSelected(false);
					this.selectedActivities.splice(pos,1);
					self.activities[i] = null ;  // or self.activities.slice(i,1);
				}
		}
	}

};

ActivityController.prototype._deleteActivities = function() {
	console.log("deleting");
};
