
/**
 * This class controls everything that relates to process definitions, from displaying
 * the list of available definitions to handling the events on process definitions placed
 * on the design panel
 * @class ProcessController
 * @constructor
 */
function ProcessController(activityController, scriptrio) {
	this.toolbar= null;
	this.definitions = {};
	this.currentProcess = {};
	this.items=[];
	this.itemsList=[];
	this.activityController = activityController;
	this.activityController.addOnActivityUpdateListener(this);
	this.processDefinitionDelegate = new ProcessDefinitionDelegate(this, scriptrio);
}

ProcessController.prototype.setToolbar = function(toolbar){
	this.toolbar= toolbar;
}

ProcessController.prototype.loadProcessDefinition= function(){
	this.processDefinitionDelegate.loadProcessDefinitions();
}

/**
 * This method is a callback invoked by the ProcessDefinitionDelegate once it has received the list
 * of process definitions ids from scriptr.io
 * @method onProcessDefinitionListLoaded
 * @param {Array} definitions array of process definitions id
 */
ProcessController.prototype.onProcessDefinitionListLoaded = function(definitions) {
	
	for (var i = 0; i <  definitions.length; i++) {	
		this.definitions[definitions[i]] = {};
	}
	
	this._refreshProcessDefinitionsList(definitions);
};

/**
 * This listener is invoked whenever the user clicks on a process definition id.
 * It triggers the loading of the corresponding complete process definition
 * @method onProcessDefinitionIdClick
 * @param {Object} event click event
 */
ProcessController.prototype.onProcessDefinitionIdClick = function(event) {
	
	var processDefinitionId = event.target.id;
	this.processDefinitionDelegate.getProcessDefinition(processDefinitionId);
};

/**
 * This method is a callback invoked by the ProcessDefinitionDelegate once it has received 
 * a complete process definitions from scriptr.io. The methods builds the visual respresentation
 * of the process and displays it onto the design panel
 * @method onProcessDefinitionLoaded
 * @param {Object} processDefinition a process definition, notable composed of class definitions
 */
ProcessController.prototype.onProcessDefinitionLoaded = function(processDefinition) {
	
	if (processDefinition){
		
		this.definitions[processDefinition.name] = processDefinition;
		var activityModels = {};
		for (var activityDefinition in processDefinition.activityDefinitions) {
			
			var activityModel = new ActivityModel(activityDefinition, processDefinition.activityDefinitions[activityDefinition], this.activityController);
			activityModels[activityDefinition] = activityModel;
			this.activityController.addActivity(activityModel);
		}
		
		this.currentProcess = {
			name: processDefinition.name,
			activityModels: activityModels
		};
		
		this._rebuildConnections(activityModels);
	}
};


/**
 * @method onActivityUpdated
 * @param {String} activityName: the name of the updated activity
 */
ProcessController.prototype.onActivityUpdated = function(activityName) {
	console.log(activityName);
}

/*
 * Build the list of available process definitions in the toolbar, based on the 
 * definitions parameter (array of process definitions ids)
 */
ProcessController.prototype._refreshProcessDefinitionsList = function(definitions) {
	
	//var definitionNode = document.getElementById("process_definitions");
	//var definitionList = document.getElementById("tb_toolbar_item_Process");
	//while (definitionNode.firstChild) {
	//	definitionNode.removeChild(definitionNode.firstChild);
	//}

	for (var i = 0; i < definitions.length; i++) {
		//this._addProcessDefinitionId(definitions[i]);
		 var e1 = document.createElement("process"+i);
		// var Item ={text: definitions[i], img: 'icon-page' ,name: definitions[i]};
		 var ItemList ={Name: definitions[i],Description:definitions[i]};
		// e1.type = "text";
       //  e1.name = definitions[i];
		// this.items[i]=Item;
		 this.itemsList[i]=ItemList;
		// definitionList.appendChild(e1);

	}
	//this.toolbar.buildMenuProcess(this.items);
	var processGrid = new ProcessGrid(this);
};

ProcessController.prototype.saveProcessDefinition = function(ProcessName){
	this.activityController.refreshActivityDef();
	var processDefinitionParam = {
			processData:{
				name:ProcessName
			},
			activities: this.activityController.activitiesDef
	};
	this.processDefinitionDelegate.saveProcessDefinition(processDefinitionParam);
	//this.processDefinitionDelegate.loadProcessDefinitions();
};

/*
 * Add the received process definition Id to the list of available process definitions on the toolbar
 * The process definition is turned into a link (anchor)
 */
ProcessController.prototype._addProcessDefinitionId = function(processDefinitionId) {
	
	var self = this;
	var definitionsListNode = document.getElementById("process_definitions");
	var definitionLink = document.createElement("a");
	definitionLink.id = processDefinitionId;
	definitionLink.url = "#";
	definitionLink.onclick = function(event) {
		self.onProcessDefinitionIdClick.call(self, event);
	};
	
	definitionLink.appendChild(document.createTextNode(processDefinitionId));
	definitionsListNode.appendChild(definitionLink);
};

/*
 * Loop through all the ActivityModel instances (activityModels) and use their startCondition
 * to create visual connectors among their visual representations (ActivityView)
 */
ProcessController.prototype._rebuildConnections = function(activityModels) {
	
	
	
	for (var activityName in activityModels) {
			
		var startCondition = activityModels[activityName].startCondition;
		var parts = startCondition.split("&&"); // for now we only handle "&&" operators visually
		for (var j = 0; j < parts.length; j++) {
			
			parts[j] = parts[j].trim();
			var doneIndex = parts[j].indexOf(DONE);
			if (doneIndex > -1) {
				
				var sourceName = parts[j].substring(0, doneIndex);
				var sourceActivity = activityModels[sourceName];
				var targetActivity = activityModels[activityName];
				var targerEndpoint = jsPlumb.getEndpoint();
				jsPlumb.connect({
					source:sourceActivity.view.rightEndpoint, 
					target:targetActivity.view.leftEndpoint
				});
			}
		}
	}
};

ProcessController.prototype.NewProcess = function() {
	this.activityController.eraseAllActivities();
};

