
/**
 * Handles the display of a dialog box on the screen
 * @class DialogView
 * @constructor DialogView
 */
function SaveProcessView(msg,ProcessController) {

	this.msg = msg;
	this.ProcessName= null;
	this.ProcessController = ProcessController;
	if (this.ProcessController.activityController.count==0){
		var msgAlert= "No need to save";
		var alertview = new AlertView(msgAlert);
	}else{
		this.buildView();
	}

}

SaveProcessView.prototype.buildView = function() {

	var self = this;
	var elementOverlay = document.getElementById("newElementOverlay");
	elementOverlay.style.display = "block";
	var dialogElement = document.getElementById("SaveDialog");
	dialogElement.style.display = "block";
	var msgSpan = document.getElementById("msgSpansave");
	var confirmBtn = document.getElementById("SaveBtn");
	var cancelBtn = document.getElementById("exitBtn");
	var ProcessName =document.getElementById("ProcessName");
	this.ProcessName =ProcessName;
	msgSpan.appendChild(document.createTextNode(this.msg));
	confirmBtn.appendChild(document.createTextNode("Save"));
	cancelBtn.appendChild(document.createTextNode("Exit"));
	cancelBtn.onclick = function() {
		self.closeDialog();
	};
	confirmBtn.onclick = function() {
		self.confirmAction();
	};
};

SaveProcessView.prototype.confirmAction = function() {
	
	this.ProcessController.saveProcessDefinition(this.ProcessName.value);
	this._closeDialog();
	
};

SaveProcessView.prototype.closeDialog = function() {
	
	this._closeDialog();
};

SaveProcessView.prototype._closeDialog = function() {

	var msgSpan = document.getElementById("msgSpansave");
	msgSpan.removeChild(msgSpan.childNodes[0]);
	var confirmBtn = document.getElementById("SaveBtn");
	confirmBtn.removeChild(confirmBtn.childNodes[0]);
	var cancelBtn = document.getElementById("exitBtn");
	cancelBtn.removeChild(cancelBtn.childNodes[0]);
	var elementOverlay = document.getElementById("newElementOverlay");
	elementOverlay.style.display = "none";
	var dialogElement = document.getElementById("SaveDialog");
	dialogElement.style.display = "none";
};

