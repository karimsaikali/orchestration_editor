
/**
 * This class controls everything that relates to activity definitions, from displaying
 * the list of available definitions to handling the events on activity definitions placed
 * on the design panel
 * @class ActivityController
 * @constructor ActivityController
 */
function ActivityController(scriptrio) {
	
	this.count = 0;
	this.definitions = {}; // Activity definitions as loaded from the back-end	
	this.activities = {}; // Activity models instances, built on the base of definitions
	this.selectedActivities = [];
	this.activityUpdateListeners = [];
	
	// detect key down events on page
	var self = this;
	document.onkeydown = function() {
		self.onActivityKeydown();
	};
	
	this.activityDefinitionDelegate = new ActivityDefinitionDelegate(this, scriptrio);
}

/**
 * Add a listener to changes that happen on activities, to the list of listeners
 * The listeners should implement the onActivityUpdated method
 * @method addOnActivityUpdateListener
 * @param {Object} listener an instance of any object that implements the onActivityUpdate method
 * @return {Boolean} true if the listener was added, false otherwise
 */
ActivityController.prototype.addOnActivityUpdateListener = function(listener) {	

	if (listener && listener.onActivityUpdated && typeof listener.onActivityUpdated == "function") {
		
		this.activityUpdateListeners.push(listener);
		return true;
	}	
	
	return false;
};

/**
 * Remove a listener from the list of listeners
 * @method removeActivityUpdateListener
 * @param {Object} listener an instance 
 * @return {Boolean} true if the listener was removed, else otherwise (usually because not in the list)
 */
ActivityController.prototype.removeActivityUpdateListener = function(listener) {	

	if (listener) {
		
		var index = his.activityUpdateListeners.indexOf(listener);
		if (index > -1) {
			
			this.activityUpdateListeners.splice(index, 1);
			return true;
		}
	}	
	
	return false;
};

/**
 * Handles the creation of a new activity definition instance of the editor panel
 * and in the activities property of the ActivityController instance
 * @method addElement
 * in case the method was called out of the context of the controller
 */ 
ActivityController.prototype.addElement = function() {
	
	var id = event.target.id + this.count++; 
	var newActivityDefInstance = new ActivityModel(id, this.definitions[event.target.id], this);
	this.addActivity(newActivityDefInstance);	
};

ActivityController.prototype.addActivity = function(activityModel) {
	this.activities[activityModel.name] = activityModel;	
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
			if (this.selectedActivities) {
				jsPlumb.addToDragSelection(this.selectedActivities);
			}
		}else {
		
			this.selectedActivities.splice(pos,1);
			jsPlumb.removeFromDragSelection(event.target.id);
			view.setSelected(false);
		}
	}else {
		
		for (var i = 0; i < this.selectedActivities.length; i++) {
			
			var activity = this.activities[this.selectedActivities[i]];
			activity.view.setSelected(false);
		}
		
		this.selectedActivities = [];
		jsPlumb.clearDragSelection();
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
 * The method will reflect these changes when needed (e.g. the startCondition when 
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
		if (activity.startCondition.indexOf(oldAndNewValues.name[0] + DONE) > -1) {
			activity.startCondition = activity.startCondition.replace(oldAndNewValues.name[0], oldAndNewValues.name[1]);
		}
	}
	
	for (var i = 0; i < this.activityUpdateListeners.length; i++) {
		this.activityUpdateListeners[i].onActivityUpdated(oldAndNewValues.name[1]);
	}
};

/**
 * Listener method, that is automatically invoked once activity definitions are loaded from the back-end
 * The definitions are stored in an array adnd the list of definitions on the screen is refreshed
 * @param {Array} definitions : array of activity definitions and their properties (name, fullTypeName, filters, etc.)
 * @param {Object} self : a reference to the current instance of ActivityController since this method is called out of context
 */
ActivityController.prototype.onActivityDefinitionsLoaded = function(definitions) {
	
	for (var i = 0; i <  definitions.length; i++) {	
		this.definitions[definitions[i].name] = definitions[i];
	}
	
	this._refreshActivityDefinitions(definitions);
};

/**
 * This listener is automatically called by the JSPlumb framework when the designer drags a connection
 * from a source activity definition to a target one, and is about to connect it to the latter
 * The startCondition of the target activity is updated to include the new source activity
 * @method onBeforeDrop
 * @param {Object} event : the onBeforeDrop event that is emitted but the JSPlumb framework. 
 * It contains data about the source and target activity definitions that are about to be connected
 */
ActivityController.prototype.onBeforeDrop = function(event) {
	
	var targetActivity = this.activities[event.targetId];
	var sourceActivity = this.activities[event.sourceId];
	targetActivity.startCondition = sourceActivity.name + DONE + (targetActivity.startCondition ? " && " + targetActivity.startCondition : "");
};

/**
 * This listener is automatically called by the JSPlumb framework when the designer drags away 
 * a connection from a target activity definition in order to remove it.
 * The startCondition of the target activity is updated to remove the corresponding source activity
 * @method onBeforeDetach
 * @param {Object} event : the onBeforeDrop event that is emitted but the JSPlumb framework. 
 * It contains data about the source and target activity definitions that were connected
 */
ActivityController.prototype.onBeforeDetach = function(event) {
	
	var targetActivity = this.activities[event.targetId];
	var sourceActivity = this.activities[event.sourceId];
	var condition = " && " + sourceActivity.name + DONE;
	var from = targetActivity.startCondition.indexOf(condition);
	if (from == -1) {
		
		condition = sourceActivity.name + DONE + " && ";
		from = targetActivity.startCondition.indexOf(condition);
	} 
	
	if (from == -1) {		
		condition = sourceActivity.name + DONE;
	}
	
	targetActivity.startCondition = targetActivity.startCondition.replace(condition, "");
};

ActivityController.prototype._refreshActivityDefinitions = function(definitions) {
	
	var definitionNode = document.getElementById("definitions");
	while (definitionNode.firstChild) {
		definitionNode.removeChild(definitionNode.firstChild);
	}
	
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
	activityDefinition.onclick =  function() {self.addElement.call(self);};
	definitionNode.appendChild(activityDefinition);
};

ActivityController.prototype._handleDelete = function() {

	if (this.selectedActivities.length > 0) {
	
		var elt = this.selectedActivities.length == 1 ? "activity" : "activities";
		var msg = "Are you sure you want to delete the selected " + elt + "?";
		var self = this;
		var dialogView = new DialogView(msg, function(){self._deleteActivities.call(self)});
	}	
};

ActivityController.prototype._deleteActivities = function() {
	console.log("deleting");
};