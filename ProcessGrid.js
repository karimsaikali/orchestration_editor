function ProcessGrid(processController)
{
	this.processController = processController;
	this.buildView();
	

}
ProcessGrid.prototype.buildView = function() {
	//procesController.loadProcessDefinition();
	var self = this;
	var elementOverlay = document.getElementById("newElementOverlay");
	elementOverlay.style.display = "block";
	var dialogElement = document.getElementById("ProcessDialog");
	var cancelBtn = document.getElementById("CloseBtn");
	cancelBtn.appendChild(document.createTextNode("Cancel"));
	dialogElement.style.display = "block";
	cancelBtn.onclick = function() {
		self.closeDialog();
	};
	
	var state = null;
	//$(document).ready(function(){
			// prepare the data
			var data = procesController.itemsList;
			var source =
			{
				localdata: data,
				datafields:
				[
					
					{ name: 'Name', type: 'string' },
					{ name: 'Description', type: 'string' },
				   
				],

				datatype: "array",
				 pager: function (pagenum, pagesize, oldpagenum) {
					// callback called when a page or page size is changed.
					
				}
			};
			var dataAdapter = new $.jqx.dataAdapter(source);
			// initialize jqxGrid
			$("#jqxgrid").jqxGrid(
			{
				width: 440,
				height: 300,
				pageable: true,
				source: dataAdapter,
				sortable:true,
				columns: [
				  { text: 'Name', datafield: 'Name', width: 200 },
				  { text: 'Description', datafield: 'Description', width: 220 },
				 
				]
			});

			// enable or disable the selection.
			//  $("#enableselection").on('select', function (event) {
			//     $("#selectrowbutton").jqxButton({ disabled: false });
			//	$("#jqxgrid").jqxGrid('selectionmode', 'singlerow');
			 
			//  });

			// enable or disable the hover state.
			$("#enablehover").on('change', function (event) {
				$("#jqxgrid").jqxGrid('enablehover', true);
			});
			
			$("#jqxgrid").bind('rowselect', function (event) { 

			var row = event.args.rowindex;
			var datarow = $("#jqxgrid").jqxGrid('getrowdata', row);
			self.GetProcess(datarow.Name);
			});


			
	//		$("#jqxgrid").on('cellselect', function (event) {   
		//			var datafield = event.args.datafield;
			//		var row = event.args.rowindex; 
				//	var columntext = $("#jqxgrid").jqxGrid('getcolumn', event.args.datafield).text;
					//debugger;
					//  this.processController.processDefinitionDelegate.getProcessDefinition(columntext);
			//});




			// display selected row index.
			// $("#jqxgrid").on('rowselect', function (event) {
			 //   $("#selectrowindex").text(event.args.rowindex);
			// });

			// display unselected row index.
			//$("#jqxgrid").on('rowunselect', function (event) {
			//    $("#unselectrowindex").text(event.args.rowindex);
			//});

			// on ppage change
			// $("#jqxgrid").on("pagechanged", function (event) {
			//	var args = event.args;
			//	var pagenum = args.pagenum;

			//	$.jqx.cookie.cookie("jqxGrid_jqxWidget", pagenum);
			//});

			// select the second row.
			//  $("#jqxgrid").jqxGrid('selectrow', 2);
	//})  
};

ProcessGrid.prototype.closeDialog = function() {
	
	this._closeDialog();
	if (this.cancelCallback) {
		this.cancelCallback();
	}
};

ProcessGrid.prototype._closeDialog = function() {

	var cancelBtn = document.getElementById("CloseBtn");
	cancelBtn.removeChild(cancelBtn.childNodes[0]);
	var elementOverlay = document.getElementById("newElementOverlay");
	elementOverlay.style.display = "none";
	var dialogElement = document.getElementById("ProcessDialog");
	dialogElement.style.display = "none";
};

ProcessGrid.prototype.GetProcess = function( name) {
	this.processController.processDefinitionDelegate.getProcessDefinition(name);
	this.closeDialog();
	
	
}
