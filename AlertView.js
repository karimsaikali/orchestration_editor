function AlertView(msg) {
	this.msg = msg;
	this.buildView();
}

AlertView.prototype.buildView = function() {

	var self = this;
	var elementOverlay = document.getElementById("newElementOverlay");
	elementOverlay.style.display = "block";
	var dialogElement = document.getElementById("AlertDialog");
	dialogElement.style.display = "block";
	var msgSpan = document.getElementById("msgSpanok");
	var cancelBtn = document.getElementById("okBtn");
	msgSpan.appendChild(document.createTextNode(this.msg));
	cancelBtn.appendChild(document.createTextNode("OK"));
	cancelBtn.onclick = function() {
		self.closeDialog();
	};
};

AlertView.prototype.closeDialog = function() {
	
	this._closeDialog();
};


AlertView.prototype._closeDialog = function() {

	var msgSpan = document.getElementById("msgSpanok");
	msgSpan.removeChild(msgSpan.childNodes[0]);
	var confirmBtn = document.getElementById("okBtn");
	confirmBtn.removeChild(confirmBtn.childNodes[0]);
	var elementOverlay = document.getElementById("newElementOverlay");
	elementOverlay.style.display = "none";
	var dialogElement = document.getElementById("AlertDialog");
	dialogElement.style.display = "none";
};
