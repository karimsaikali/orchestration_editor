

function ToolBarView(processController){
	//this.processModel = processModel;
	this.buildView(processController);
	
}

ToolBarView.prototype.buildView = function(processController) {


    $('#MDItoolbar').w2toolbar({
        name: 'toolbar',
        items: [
            { type: 'button',  id: 'saveProcess' ,  name: 'saveProcess', caption: 'save Process', icon: 'fa-check', checked: true },
            { type: 'break',  id: 'break0' },
			{ type: 'button',  id: 'NewProcess' ,  name: 'NewProcess', caption: 'New Process', icon: 'fa-check', checked: true },
            { type: 'break', id: 'break1' , name: 'break1' },
			/*{ type: 'menu', id: 'processesList', name: 'processesList' , caption: 'Drop Down', img: 'icon-folder',
                items: [
                    { text: 'Item 1', img: 'icon-page' ,name: 'process1' }, 
                    { text: 'Item 2', img: 'icon-page',name: 'process2' }, 
                    { text: 'Item 3', img: 'icon-page',name: 'process3' }
                ]
            },*/
            { type: 'break', id: 'break3' ,name:'break3'},
			{ type: 'button',  id: 'ProcessGrid' ,  name: 'ProcessGrid', caption: 'Process Grid', icon: 'fa-check', checked: true },
            { type: 'spacer',name:'spacer' }
        ]
    });
   
    w2ui.toolbar.on('*', function (event) { 
        console.log('EVENT: '+ event.type + ' TARGET: '+ event.target, event);
		if (event.target =='saveProcess')
		{
			var saveProcess = new SaveProcessView("save the process",processController);
		}
		
		if (event.target =='NewProcess')
		{
			processController.NewProcess();
		}
		
		if (event.target =='ProcessGrid')
		{
			procesController.loadProcessDefinition();
			//var myVar = setTimeout(function(){var processGrid = new ProcessGrid(processController);},2000);
			
		}
		/*var index =0;
		index = event.target.indexOf(":");
		var indexProcessList =0 ;
		indexProcessList = event.target.indexOf("processesList");
		if (index!= -1 && indexProcessList!=-1 )
		{
		   processController.processDefinitionDelegate.getProcessDefinition(event.target.substr(index+1));
		}*/
    });
};
/*
ToolBarView.prototype.buildMenuProcess =function(PItems){
	 w2ui.toolbar.get('processesList').items =PItems;
};*/