var leftEndPointProperties = { 
			
	anchors: ["Left"],
	endpoint:"Rectangle",
	paintStyle:{fillStyle:"#d87702", outlineColor:"black", outlineWidth:2},
	hoverPaintStyle:{ fillStyle:"yellow" },
	connectorOverlays: [ [ "Arrow", { location:0.8 } ] ],
	maxConnections:10
};

var rightEndPointProperties = { 
	
	anchors: ["Right"],
	endpoint:"Rectangle",
	paintStyle:{fillStyle:"#d87702", outlineColor:"black", outlineWidth:2},
	hoverPaintStyle:{ fillStyle:"yellow" },
	connectorOverlays: [ [ "Arrow", { location:0.8 } ] ],
	newConnection: true,
	maxConnections:10
};

var targetConnector = {

	isSource:false,
	isTarget:true,
	//overlays:[ ["Arrow" , {width:10, length:10, location:0.67}]]
};

var sourceConnector = {

	isSource:true,
	isTarget:false,
	//overlays:[ ["Arrow" , {width:10, length:10, location:0.67}]]
};