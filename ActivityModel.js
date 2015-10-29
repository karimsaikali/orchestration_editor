
/**
 * This class holds the properties of an Activity definition instance, i.e. an
 * activtiy that is added to the editor panel after clicking on an activity definition.
 * The ActivityModel is responsible for creating/destroying its own view.
 * The ActivityModel can handle simple events that occur on its own view.
 * @class ActivityModel
 * @constructor ActivityModel
 * @param {String} id : the identifier to be used as a name for this activity
 * @param {Object} definition : a json structure (activity definition) to be used as a template to this activity
 * @param {Object} controller : the activity controller 
 */
function ActivityModel(id, definition, controller) {

	this.name = id;
	this.controller = controller;
	this._buildFromDefinition(definition);
	this.view = new ActivityView(this);
}

/**
 * Update the properties of the model with the value of the provided structure 
 * updateData has field names == model's properties names ==> one to one mapping with properties)
 * @method update
 * @param {Object} updatedData : a json structure that maps the model's properties and has new values
 */
ActivityModel.prototype.update = function(updatedData) {

	var oldNew = {};
	var newValue = null;
	for (var key in updatedData) {
	
		if (typeof this[key] == "object" && this[key].constructor == Array) {
		
			if (updatedData[key]) {
				
				newValue = updatedData[key].split(",");
				oldNew[key] = [this[key], newValue]
				this[key] = newValue;
			}
		}else {
			
			newValue = updatedData[key] ? updatedData[key] : "";
			oldNew[key] = [this[key], newValue]
			this[key] = newValue;
		}
	}
	
	this.controller.onActivityChanged(oldNew);
};

/** 
 * Add properties to this instance according to the activity definition
 * it is based on
 * @method _buildFromDefinition
 * @param {Object} definition : the activity definition used as a template for this activity
 */
ActivityModel.prototype._buildFromDefinition = function(definition) {

	for (var key in definition) {
	
		if (key != "name") {
			this[key] = definition[key]
		}
	}
};