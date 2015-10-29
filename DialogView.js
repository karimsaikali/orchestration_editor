
/**
 * Handles the display of a dialog box on the screen
 * @class DialogView
 * @constructor DialogView
 */
function DialogView(msg, confirmCallback, cancelCallback) {

	this.msg = msg;
	this.confirmCallback = confirmCallback;
	this.cancelCallback = cancelCallback;
	this.buildView();
}

DialogView.prototype.buildView = function() {

	var self = this;
	var elementOverlay = document.getElementById("newElementOverlay");
	elementOverlay.style.display = "block";
	var dialogElement = document.getElementById("newDialog");
	dialogElement.style.display = "block";
	var msgSpan = document.getElementById("msgSpan");
	var confirmBtn = document.getElementById("confirmBtn");
	var cancelBtn = document.getElementById("cancelBtn");
	msgSpan.appendChild(document.createTextNode(this.msg));
	cancelBtn.appendChild(document.createTextNode("Cancel"));
	cancelBtn.onclick = function() {
		self.closeDialog();
	};
	
	confirmBtn.appendChild(document.createTextNode("Confirm"));
	confirmBtn.onclick = function() {
		self.confirmAction();
	};
};

DialogView.prototype.confirmAction = function() {
	
	this._closeDialog();
	if (this.confirmCallback) {
		this.confirmCallback();
	}
};

DialogView.prototype.closeDialog = function() {
	
	this._closeDialog();
	if (this.cancelCallback) {
		this.cancelCallback();
	}
};

DialogView.prototype._closeDialog = function() {

	var msgSpan = document.getElementById("msgSpan");
	msgSpan.removeChild(msgSpan.childNodes[0]);
	var confirmBtn = document.getElementById("confirmBtn");
	confirmBtn.removeChild(confirmBtn.childNodes[0]);
	var cancelBtn = document.getElementById("cancelBtn");
	cancelBtn.removeChild(cancelBtn.childNodes[0]);
	var elementOverlay = document.getElementById("newElementOverlay");
	elementOverlay.style.display = "none";
	var dialogElement = document.getElementById("newDialog");
	dialogElement.style.display = "none";
};

