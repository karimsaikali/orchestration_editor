
/**
 * This class handles the display logic of an ActivityModel. It delegates most events
 * to the controller of the model it is related to. 
 * @class ActivityView
 * @constructor ActivityView
 * @param {Object} model : the instance of ActivityModel this view relates to
 */
function ActivityView(model) {

	this.activityNode = null;
	this.propertyNode = null;
	this.model = model;
	this._buildElement();	
}

/**
 * Build the overlay that will contain the activity's properties as well
 * as the shade in the background
 * @method buildPropertiesView
 */
ActivityView.prototype.buildPropertiesView = function() {

	var elementOverlay = document.getElementById("newElementOverlay");
	elementOverlay.style.display = "block";
	var elementFormDiv = document.getElementById("newElementFormDiv");
	elementFormDiv.style.display = "block";
	var newElementForm = document.getElementById("newElementForm");
	var insideTable = this._buildDefinitionForm();
	newElementForm.appendChild(insideTable);

};

ActivityView.prototype.setSelected = function(selected) {

	if (selected) {
		this.activityNode.classList.add("eltSelected");
	}else {
		this.activityNode.classList.remove("eltSelected");
	}
}

/**
 * Refresh the current layout of the activity according to the model
 * @method update
 */
ActivityView.prototype.update = function() {
	
	this.activityNode.name = this.model.name;
	this.activityNode.childNodes[0].nodeValue = this.model.name;
};

/**
 * Retrieve the new values from the properties form and pass them to the model 
 * so it can update itself 
 * @method updateProperties
 */
ActivityView.prototype.updateProperties =  function() {
	
	var formNode = this.propertyNode.parentNode;
	var elements = formNode.elements;
	var input = null;
	var updatedProperties = {};
	for (var i = 0; i < elements.length; i++) {
	
		input = elements[i];
		if (input.id.indexOf(this.model.name) > -1) {
			
			var propName = input.id.substring(input.id.indexOf(this.model.name) + this.model.name.length + 1);
			updatedProperties[propName] = elements[i].value ? elements[i].value : elements[i].text;
		}
	}
	
	this.model.update(updatedProperties);
	this.closeProperties();
	this.update();
};

/**
 * Hide the property from node and delete the table that contains the properties
 * @method closeProperties
 */
ActivityView.prototype.closeProperties =  function() {
	
	if (this.propertyNode) {
		
		var formNode = this.propertyNode.parentNode;
		formNode.removeChild(this.propertyNode);
	}
	
	var elementOverlay = document.getElementById("newElementOverlay");
	elementOverlay.style.display = "none";
	var elementFormDiv = document.getElementById("newElementFormDiv");
	elementFormDiv.style.display = "none";
	this.propertyNode = null;
};

/**
 * Build the visual representation of the activity on the editor 
 * and executes any necessary jsPlumb tweaking (add endpoints and set as draggable)
 * @method _buildElement
 */
ActivityView.prototype._buildElement = function() {

	var self = this;
	var panel = document.getElementById("panel");
	var newElement = document.createElement("div");
	newElement.id = this.model.name;
	newElement.name = this.model.name;
	newElement.className = "element";	
	panel.appendChild(newElement);
	jsPlumb.draggable(newElement.id, {containment: true});
	jsPlumb.addEndpoint(newElement.id, leftEndPointProperties, targetConnector); 
	jsPlumb.addEndpoint(newElement.id, rightEndPointProperties, sourceConnector); 
	newElement.appendChild(document.createTextNode(newElement.id));
	
	// add the model's controller as a mouse double-click listener to this element
	newElement.ondblclick = function() {
		self.model.controller.onActivityDblClick(self);
	};
	
	// add the model's controller as a mouse click listener to this element
	newElement.onclick = function() {
		self.model.controller.onActivityClick(self);
	};
	
	this.activityNode = newElement;
};

/**
 * Build a property table (html) and form inputs by introspecting the content of the ActivityModel instance
 * related to the current view. 
 * @method_buildDefinitionForm
 * @return {Node} the html table
 */
ActivityView.prototype._buildDefinitionForm = function() {

	var self = this;
	var nodeInput = null;
	var nodeLabel = null;
	var nodeRow = null;
	
	// create the table and its caption
	var nodeTable = document.createElement("table");
	nodeTable.id = "propertyTable";
	nodeTable.className = "propTable";
	var nodeCaption = document.createElement("caption");
	nodeCaption.className = "caption";
	nodeCaption.appendChild(document.createTextNode(this.model.name));
	nodeTable.appendChild(nodeCaption);
	
	// introspect the activity and add a row/cell/label +  input for every property
	for (var prop in this.model) {
		
		var type = typeof(this.model[prop]);
		var isProperty = type != "function";
		isProperty = isProperty && type != "object";
		isProperty = isProperty ||  (this.model[prop].constructor == Array);
		if (isProperty && prop != "fullTypeName") {
		
			nodeRow = document.createElement("tr");
			nodeLblCell = document.createElement("td");
			nodeLblCell.className = "propLabelCell";
			nodeIptCell = document.createElement("td");
			nodeRow.appendChild(nodeLblCell);
			nodeRow.appendChild(nodeIptCell);
			nodeLabel = document.createElement("label");
			nodeLabel.for = prop;
			nodeLabel.appendChild(document.createTextNode(prop));
			nodeLblCell.appendChild(nodeLabel);
			if (prop == "startCondition") {  		
				
				// start condition is not directly editable	so we display it as a label
				// since labels automatically expand according to their content
				var startLabel = document.createElement("label");
				startLabel.appendChild(document.createTextNode(this.model[prop]));
				nodeIptCell.appendChild(startLabel);				
			}else {
			
				nodeInput = document.createElement("input");
				nodeInput.type = "text";
				nodeInput.className = "propInput";
				nodeInput.id = this.model.name + "_" + prop;
				nodeInput.value = this.model[prop];
				nodeIptCell.appendChild(nodeInput);
			}
			
			nodeTable.appendChild(nodeRow);
		}
	}
	
	// add update and dismiss button inside a specific row
	// add listeners to the update and dismiss buttons
	nodeRow = document.createElement("tr");
	var buttonCell = document.createElement("td");
	buttonCell.colSpan = 2;
	var buttonDiv = document.createElement("div");
	buttonDiv.style.marginTop = "20px";
	buttonCell.appendChild(buttonDiv);
	
	// dismiss button
	var dismissButton = document.createElement("a");
	dismissButton.className = "btn";
	dismissButton.appendChild(document.createTextNode("dismiss"));
	dismissButton.onclick = function() {
		self.closeProperties();
	};
	
	buttonDiv.appendChild(dismissButton);
	
	// update button
	var updateButton = document.createElement("a");
	updateButton.className = "btn";
	updateButton.appendChild(document.createTextNode("update"));
	updateButton.onclick = function() {
		self.updateProperties();
	};
	
	buttonDiv.appendChild(updateButton);
	
	// add cell to row and row to table
	nodeRow.appendChild(buttonCell);
	nodeTable.appendChild(nodeRow);	
	this.propertyNode = nodeTable;
	return nodeTable;
};