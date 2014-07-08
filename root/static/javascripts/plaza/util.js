/*
 * Object of a node,
 * with asociated functions.
 * 
 * A node is a general abstraction, and it can
 * represent both normal internal nodes, the root node,
 * and leaves.
 * 
 * If a node is internal, it has both childrennodes and a parentnode.
 * If a node is a leave, it has a parent node, but no children.
 * If a node is the root node, it has children but no parent.
 * 
 * We give a general empty ("") name to all newly constructed nodes,
 * so we will not have any null-references.
 */
function Node(value,pn){
	//variables
	this.value = value;				//every node can have an associated value.
	this.childrenNodes = new Array();		//array containing all children (can be empty)
	this.nodeName = "";				//the name of the node ("" if internal)
	this.parentNode = pn; 				//the reference to the parent node
	this.drawHeight = -1;				//the relative y-coord at which the node should be drawn
	this.drawDepth  = -1;				//the relative x-coord at which the node should be drawn
			
	//functions
	this.getValue = getValue;			//returns the value of this node
	this.getNodeName = getNodeName;			//returns the name of this node
	this.setNodeName = setNodeName;			//sets the name of this node
	this.addChild = addChild;			//adds a child node to this node
	this.getChild = getChild;			//returns a child (from certain index) from this node
	this.numChildren = numChildren;			//returns the number of children of this node
	this.toString2 = toString2;			//returns string representation of this node
	this.getDepth = getDepth;			//returns the depth (relative to root node)
	this.numLeaves = numLeaves;			//returns the number of leave-nodes that are children of this node
	this.getDrawHeight = getDrawHeight;		//returns the relative y-coord of this node
	this.getDrawDepth = getDrawDepth;		//returns the relative x-coord of this node 
	this.setDrawHeight = setDrawHeight;		//sets the relative y--coord of this node
	this.setDrawDepth = setDrawDepth;		//sets the relative x-coord of this node
	this.getLeaves = getLeaves;			//returns all the leaves which are children of this node
	this.getMaxDepth = getMaxDepth;			//returns the maximum depth of leaves connected to this node
	this.getParentNode = getParentNode;		//returns the parentnode of this node.
	this.isLeave = isLeave;				//returns whether or not this node is a leave
}

/*
 * returns whether or not the node is a leave
 */
function isLeave(){
    if(this.numChildren()==0)
	return true;
    else
	return false;
}

/*
 * returns the value of the node
 */
function getValue(){
    return this.value;
}

/*
 * Returns the parentnode of this node.
 */
function getParentNode(){
    return this.parentNode;
}

/*
 * returns the maximum depth of leaves connected to this node
 */
function getMaxDepth(){
    var leaves = this.getLeaves();
    var result = 0;
    for(var i=0;i<leaves.length;i++){
	var node = leaves[i];
	var depth = node.getDepth();
	if(depth>result)
	    result = depth;
    }
    return result;
}

/*
 * returns all the leaves which are children of this node
 */
function getLeaves(){
    var leaves = new Array();
    if(this.numChildren()==0){
	leaves.splice(leaves.length-1,0,this);
	return leaves;
    }
    else{
	for(var i=0;i<this.numChildren();i++){
	    var nod = this.getChild(i);
	    var tempLeaves = nod.getLeaves();
	    leaves = leaves.concat(tempLeaves);
	}
	return leaves;
    }
}

/*
 * sets the relative x-coord of this node
 */
function setDrawDepth(nd){
    this.drawDepth = nd;
}

/*
 * sets the relative y--coord of this node
 */
function setDrawHeight(nh){
    this.drawHeight = nh;
}

/*
 * returns the relative x-coord of this node
 */
function getDrawDepth(){
    return this.drawDepth;
}

/*
 * returns the relative y-coord of this node
 */
function getDrawHeight(){
    return this.drawHeight;
}


/*
 * adds a child node to this node
 */
function addChild(childNode){
    this.childrenNodes.splice(this.childrenNodes.length-1,0,childNode);
}


/*
 * returns a child (from certain index) from this node
 */
function getChild(ind){
    return this.childrenNodes[ind];
}

/*
 * returns the number of children of this node
 */
function numChildren(){
    return this.childrenNodes.length;
}

/*
 * returns the name of this node
 */
function getNodeName(){
    return this.nodeName;
}

/*
 * sets the name of this node
 */
function setNodeName(newName){
    this.nodeName = newName;
}

/*
 * returns string representation of this node
 */
function toString2(){
    var res = "";
    for(var i=0;i<this.getDepth();i++)
	res = res + "&nbsp;&nbsp;&nbsp;";
    if(this.getNodeName()=="")
	res = res+ "NODE";
    else
	res = res + this.getNodeName();
    res = res + "("+this.getDepth()+")";
    res = res+ "<br>";
    for(var i=0;i<this.numChildren();i++)
	res+=this.getChild(i).toString2();
    return res;
}

/*
 * returns the number of leave-nodes that are children of this node
 */
function numLeaves(){
    var res = 0; 
    if(this.numChildren()==0)
	res = 1;
    else{
	for(var i=0;i<this.numChildren();i++){
	    res = res + this.getChild(i).numLeaves();
        }
    }
    return res;
}

/*
 * returns the depth (relative to root node)
 */
function getDepth(){
    var tempNode = this;
    var res = 0;
    while(tempNode.parentNode!=null){
	tempNode = tempNode.parentNode;
	res = res+1;
    }
    return res;
}






/*
 * ***********************************************************
 * 
 * Some other functions, not part of the Node object.
 * These functions are specifically designed to parse 
 * a tree-structure from the newick tree representation.
 * 
 * ***********************************************************
 */


/*
 * takes an array of leaves, and sets the correct
 * drawing depths and heights. Leaves are all set
 * to maxDepth.
 */
function setCorrectParameters(leaves,maxDepth){
    for(var i=0;i<leaves.length;i++){
	var node = leaves[i];
	node.setDrawDepth(maxDepth);
	node.setDrawHeight(i+1);
    }
}

/*
 * basic parsing function, takes a single newicktree string as variable.
 */
function parseNewick(s){
    var x = s.lastIndexOf(":");
    if(x==-1){
	s = extendTree(s);
    }
    else if(s.lastIndexOf(":")<s.lastIndexOf(")")){	//meaning there are indicated distances, but not one for the root node
	s+="100:0.1";
    }
    document.write(s);	
    x= s.lastIndexOf(":");
    var doubleVal = s.substr(x+1); 
    var pN = new Node(doubleVal,null);
    return build2(s,pN,0,x);
}

/*
 * basic parsing function, takes a single newicktree string as variable.
 */
function parseNewickSpecies(s){	
    if(s.charAt(s.length-1)==';')
	s = s.substring(0,s.length-1);
    var parentNode = new Node(0.1,null);
    parentNode.setNodeName("");
    return build2(s,parentNode,0,s.length,0);
}


/*
 * prints the parsed tree to the current document.
 * Is not really display safe (can overwrite the text of other stuff).
 */
function printParsedTree(parsedTree){
    if(parsedTree==null)
	document.write("Parsed tree is null!");
    else{
	//document.write(parsedTree.getNodeName()+" "+parsedTree.numChildren());
	for(var i=0;i<parsedTree.numChildren();i++){
	    printParsedNodes(parsedTree.getChild(i),parsedTree.getChild(i).getDepth());
	}
	document.write("<br>");
    }
}

/*
 * prints the information about one parsed node
 * (used by the printParsedTree method )
 */
function printParsedNodes(parsedNode,dep){
    if(parsedNode==null)
	document.write("Parsed node is null!");
    else{
	for(var i=0;i<dep;i++)
	    document.write("&nbsp;&nbsp;");
	document.write(parsedNode.getNodeName()+" :: "+parsedNode.getDepth()+" -> "+parsedNode.getParentNode().getDepth()+" || "+parsedNode.getDrawHeight());
	for(var i=0;i<parsedNode.numChildren();i++){
	    printParsedNodes(parsedNode.getChild(i),parsedNode.getChild(i).getDepth());
	}
	document.write("<br>");
    }
}


/*
 * The parsing function only works well when every node has an associated
 * value. Because not all newick forms have this, we have to adapt the original
 * string to make the tree representation parseable.
 * Used by the parseNewick method
 */
function extendTree(s){
    var newTreeString = "";
    for(var i = 0;i<s.length;i++){
	var p = s.charAt(i);
	if(p==')'){
	    var p2 =s.charAt(i-1);
	    var p3 = s.charAt(i+1);			
	    var isWritten = false;
	    if(p2 == ')'){
		newTreeString+=p;
		isWritten = true;
	    }
	    else{
	   	newTreeString+=":1.0";
		newTreeString+=p;
		isWritten = true;
	    }						
	    if(p3==','){
		if(!isWritten){newTreeString+=p;}
	    }
	    else{
		if(!isWritten){newTreeString+=p;}
	 	newTreeString+=":1.0";
	    }
	}
	else if(p==','){
	    newTreeString+=":1.0";
	    newTreeString+=p;
	}
	else{
	    newTreeString+=p;
	}
    } 
    return newTreeString;
}



/*
 * builds nodes and links them in a recursive way
 * This is the main method used for parsing a newick string
 * + s          : The current newick string to be parsed
 * + nodeParent : The current parent node (to which new nodes can be attached)
 * + from       : Indicates the starting point in the string that will be parsed
 * + to         : Indicates the ending point in the string that will be parsed
 * + iterativeDepth : current depth in the recursion. Needed for determining depth of treenodes
 */
function build2(s,nodeParent,from,to,iterativeDepth){
    iterativeDepth++;
    if(s.charAt(from) != '('){
	nodeParent.setNodeName(s.substring(from,to));
	return nodeParent;
    }	
    var b = 0;	
    var colon = 0;
    var x = from;
    var lastClosed = 0;
    var lastLastClosed = 0;	
    for(var i =from;i<to;i++){
	var c = s.charAt(i);
	if(c=='('){
	    b++;
	}
	else if(c==')'){
	    b--;
	    lastLastClosed = lastClosed;
	    lastClosed = i;
	}
	else if(c==':'){
	    colon = i;
	}
	if(b==0){
	    var sub = s.substring(x+1,colon);
	    var tdrValue = s.substring(colon+1,i);
	    if(sub.lastIndexOf(')')==-1){//leave node
	    	var nn = new Node(tdrValue,nodeParent);
	    	var nb = build2(s,nn,x+1,colon,iterativeDepth);
	    	nodeParent.addChild(nb);
	    }
	    else{
	    	var tdrName = sub.substring(sub.lastIndexOf(')')+1,colon);	
	    	var nn = new Node(tdrValue,nodeParent);
	    	nn.setNodeName(tdrName);
	    	var nb = build2(s,nn,x+1,lastLastClosed+1,iterativeDepth);
	    	nodeParent.addChild(nb);
	    }
	    x = i;
	}
	else if((b==1 && c==',')){
	    var tdrValue = s.substring(colon+1,i);
	    var tdrName = s.substring(lastClosed+1,colon);
	    if(lastClosed==0){
		var nn = new Node(tdrValue,nodeParent);
		var nb = build2(s,nn,x+1,colon,iterativeDepth);
		nodeParent.addChild(nb);	
	    }
	    else{
		var sub = s.substring(x+1,lastClosed+1);
		if(sub.lastIndexOf(')')==-1){	//leave node
		    var nn = new Node(tdrValue,nodeParent);
		    var nb = build2(s,nn,x+1,colon,iterativeDepth);
		    nodeParent.addChild(nb);
		}
		else{
		    var nn = new Node(tdrValue,nodeParent);
		    nn.setNodeName(tdrName);
		    var nb = build2(s,nn,x+1,lastClosed+1,iterativeDepth);
		    nodeParent.addChild(nb);
		}
	    }
	    x= i;
	}	
	else{
		//do nothing
	}
    }
    return nodeParent;
}




/*
 * builds nodes and links them in a recursive way
 */
function build(s,nodeParent,from,to){
	if(s.charAt(from) != '('){
		nodeParent.setNodeName(s.substring(from,to));
		return nodeParent;
	}
	
	var b = 0;	
	var colon = 0;
	var x = from;
	
	for(var i =from;i<to;i++){
		var c = s.charAt(i);
		if(c=='('){
			b++;
		}
		else if(c==')'){
			b--;
		}
		else if(c==':'){
			colon = i;
		}
		if(b==0 || (b==1 && c==',')){
			var nn = new Node(s.substring(colon+1,i),nodeParent);
			var nb = build(s,nn,x+1,colon);
			nodeParent.addChild(nb);
			x = i;
		}	
	}
	return nodeParent;
}


function writeNodes(nodes){
	for(var i=0;i<nodes.length;i++){
		document.write(nodes[i].getNodeName()+"&nbsp;");
	}
	document.write("<br>");
}

function getMaximumDrawDepth(nodes){
	var max = 0;
	for(var i=0;i<nodes.length;i++){
		var temp = nodes[i].getDrawDepth();
		if(temp>max){
			max = temp;
		}
	}
	return max;
}






/*
 * Global drawing variables.
 */
var DEPTH_CONST = 50;
var DEPTH_CONST1 = 300;
var DEPTH_CONST2 = 50;
var HEIGHT_CONST = 18;
var DRAW_COLOR = "#000000";

function drawTreeCanvas(canvas,tree,local_depth_constant,local_height_constant,font1,font2,draw_clades,draw_species){  
    drawTreeCanvas(canvas,tree,local_depth_constant,local_height_constant,font1,font2,draw_clades,draw_species,null,null);
}

function drawTreeCanvas(canvas,tree,local_depth_constant,local_height_constant,font1,font2,draw_clades,draw_species,data,data_options){ 
    var leaves = tree.getLeaves();
    var maxDepth = tree.getMaxDepth();
    leaves = invertsPosition(leaves);
    setCorrectParameters(leaves,maxDepth);
    var toDrawNodes = new Array();
    toDrawNodes = toDrawNodes.concat(leaves);	
    var iterations = 0;
    while(toDrawNodes.length>1){
	if(iterations++ > 50){break;}
	for(var i=0;i<toDrawNodes.length;i++){
	    var n1 = toDrawNodes[i];
	    var sameParentArray = getSameParentNodesIndices(toDrawNodes,i+1,n1.getParentNode());
	    if(sameParentArray.length==0){
	    }
	    else{
		var drawNodes = new Array();
		drawNodes[0] = n1;
		for(var j=0;j<sameParentArray.length;j++)
		    drawNodes[j+1] = toDrawNodes[sameParentArray[j]];
		var newHeight = 0;
		for(var j=0;j<drawNodes.length;j++)
		    newHeight+= drawNodes[j].getDrawHeight();
		newHeight = newHeight/drawNodes.length;
		//prepare parent node 
		var parentNode = n1.getParentNode();
		parentNode.setDrawHeight(newHeight);
		//remove the nodes that were used.
		toDrawNodes = removeNodes(drawNodes,toDrawNodes);
		//push parent node onto stack of nodes to be drawn
		toDrawNodes.push(parentNode);
		//jump outta for loop, into outer while loop.
		break;
	    }
	}	
    }		
    //part 2, with the correct heights set, draw the correct branches with the approptiate lengths.
    //This is done by a bottom-up recursive algorithm.
    var maxDepth = tree.getMaxDepth();  		
    if(data!=undefined){
        var extra_data		= $H(data);
        var extra_data_options	= $H(data_options);
	drawBranchRecursiveCanvas(canvas,tree,30,maxDepth,local_height_constant,local_depth_constant,font1,font2,draw_clades,draw_species,extra_data,extra_data_options);
    }
    else{
	drawBranchRecursiveCanvas(canvas,tree,30,maxDepth,local_height_constant,local_depth_constant,font1,font2,draw_clades,draw_species,data,data_options);
    }      
}



/*
 * Draw the branches in a recursive manner
 */
function drawBranchRecursiveCanvas(canvas,node,startx,maxDepth,local_height_constant,local_depth_constant,
					font1,font2,draw_clades,draw_species,extra_data,extra_data_options){ 	 
//	alert(multiplier); 	
    var nodeName = node.getNodeName();
    var nodeLength = node.getValue();
    if(startx==0){nodeLength=nodeLength/5;}	
    var numChildren = node.numChildren();
    var height = node.getDrawHeight();
  
    canvas.strokeStyle 	= DRAW_COLOR;
    canvas.fillStyle    = DRAW_COLOR;
    canvas.lineWidth	= 2;
	
    //x,y coords needed for drawing
    var x1 = 0;
    var x2 = 0;
    var y1 = 0;
    var y2 = 0;
	
    var endHorizontal = startx+nodeLength*local_depth_constant;
    //horizontal line	
    x1 = startx;
    x2 = endHorizontal;
    y1 = height*local_height_constant;
    y2 = height*local_height_constant;
    //alert(local_height_constant);
	
    var w = x2-x1; if(w==0){w=2;}
    var h = y2-y1; if(h==0){h=2;}	    
	
    if(height>0){
	//alert("x1 : "+x1+"; y1 : "+y1+"; w : "+w+"; h : "+h);	
	canvas.fillRect(x1,y1,w,h);
    }     

    if(node.isLeave()){	
	canvas.font = font1;
	canvas.fillStyle = "#05636b";
	var totalNodeName = node.getNodeName();
	var speciesNodeName1 = totalNodeName.replace(/_/g," ");	
	if(draw_species){
	    canvas.fillText(speciesNodeName1,x2+10,parseInt(height*local_height_constant+4));	
	}
		
	if(extra_data!=undefined){
	   //find largest datapoint
	   var largest	= 0;
	   var dl	= parseInt(extra_data_options.get("max_length"));
	   extra_data.keys().each(function(k){
	      var val	= extra_data.get(k)[0];
	      if(val>largest){largest=val;}		
	   });
	   var val		= extra_data.get(speciesNodeName1);
	   val			= val[0];
	   var draw_length	= dl*val/largest;	   	   
	   canvas.strokeStyle	= extra_data_options.get("stroke_color");
	   canvas.fillStyle	= extra_data_options.get("fill_color");
	   var dx1	= x2+180;	//extra room for leave name
	   var dx2	= dx1+draw_length;
	   var dy1	= parseInt(height*local_height_constant-8);	
	   var dy2	= parseInt(height*local_height_constant+4);
	   canvas.fillRect(dx1,dy1,draw_length,15);
	   canvas.strokeRect(dx1,dy1,draw_length,15);
	   if(extra_data_options.get("draw_labels")){
		canvas.font 		= font2;
		canvas.fillStyle	= "#000000";
		canvas.fillText(val,dx2+5,dy2);
	   }
	}
	canvas.fillStyle = DRAW_COLOR; 
    }
    else{

	var totalNodeName = node.getNodeName();	
	if(totalNodeName!=""){	    	
	    canvas.font = font2;
	    canvas.fillStyle = "#353535";
	    var cladeNodeName = totalNodeName.replace(/_/g," ");
	    var cnnl 	  = canvas.measureText(cladeNodeName).width;
	    if(draw_clades){		
	        canvas.fillText(cladeNodeName,x2-3-cnnl,parseInt(height*local_height_constant-8));
	    }
	}
	canvas.fillStyle = DRAW_COLOR;			
	//draw vertical lines	
	for(var i=0;i<node.numChildren();i++){
	    var childnode = node.getChild(i);
	    x1 = endHorizontal;
 	    x2 = endHorizontal;
	    y1 = height*local_height_constant;
	    y2 = childnode.getDrawHeight()*local_height_constant;
	    w  = x2-x1; if(w==0){w=2;}
	    h  = y2-y1; if(h==0){h=2;}	
	    if(height>0){canvas.fillRect(x1,y1,w,h);}				
	    //draw children nodes in recursive way
	    drawBranchRecursiveCanvas(canvas,childnode,endHorizontal,maxDepth,local_height_constant,local_depth_constant,font1,font2,draw_clades,draw_species,extra_data,extra_data_options);
	}		
    }	
}







function drawTreeNew(canvas,tree,url_org,url_group){

    //part 1, get the correct heights for all the leaves and branches.
    //This is done by a top-down iterative algorithm.
    //get the necessary variables from the tree
    var leaves = tree.getLeaves();
    var maxDepth = tree.getMaxDepth();
    leaves = invertsPosition(leaves);
    setCorrectParameters(leaves,maxDepth);
    var toDrawNodes = new Array();
    toDrawNodes = toDrawNodes.concat(leaves);	

    var iterations = 0;
    while(toDrawNodes.length>1){
	if(iterations++ > 50){break;}
	for(var i=0;i<toDrawNodes.length;i++){
	    var n1 = toDrawNodes[i];
	    var sameParentArray = getSameParentNodesIndices(toDrawNodes,i+1,n1.getParentNode());
	    if(sameParentArray.length==0){
	    }
	    else{
		var drawNodes = new Array();
		drawNodes[0] = n1;
		for(var j=0;j<sameParentArray.length;j++)
		    drawNodes[j+1] = toDrawNodes[sameParentArray[j]];
		var newHeight = 0;
		for(var j=0;j<drawNodes.length;j++)
		    newHeight+= drawNodes[j].getDrawHeight();
		newHeight = newHeight/drawNodes.length;
		//prepare parent node 
		var parentNode = n1.getParentNode();
		parentNode.setDrawHeight(newHeight);
		//remove the nodes that were used.
		toDrawNodes = removeNodes(drawNodes,toDrawNodes);
		//push parent node onto stack of nodes to be drawn
		toDrawNodes.push(parentNode);
		//jump outta for loop, into outer while loop.
		break;
	    }
	}	
    }		
    //part 2, with the correct heights set, draw the correct branches with the approptiate lengths.
    //This is done by a bottom-up recursive algorithm.
    var maxDepth = tree.getMaxDepth();
    if(url_org!=null && url_group!=null){
	drawBranchRecursive(canvas,tree,0,maxDepth,url_org,url_group);
    }
    else{
        drawBranchRecursive(canvas,tree,0,maxDepth);
    }
    canvas.paint();
}

/*
 * Draw the branches in a recursive manner
 */
function drawBranchRecursive(canvas,node,startx,maxDepth,url_org,url_group){ 	  
    var nodeName = node.getNodeName();
    var nodeLength = node.getValue();
    if(startx==0){nodeLength=nodeLength/5;}	
    var numChildren = node.numChildren();
    var height = node.getDrawHeight();
  
    canvas.setColor(DRAW_COLOR);
    canvas.setStroke(2);
	
    //x,y coords needed for drawing
    var x1 = 0;
    var x2 = 0;
    var y1 = 0;
    var y2 = 0;
	
    var endHorizontal = startx+nodeLength*DEPTH_CONST1;
    //horizontal line
    x1 = startx;
    x2 = endHorizontal;
    y1 = height*HEIGHT_CONST;
    y2 = height*HEIGHT_CONST;
    if(height>0)
        canvas.drawLine(x1,y1,x2,y2);		
    if(node.isLeave()){	
	//draw string	
	canvas.setColor("#05636B");
	canvas.setFont("Arial","12px",Font.PLAIN);
	var totalNodeName = node.getNodeName();
	var speciesNodeName1 = totalNodeName.replace(/_/g,"+");
	var speciesNodeName2 = totalNodeName.replace(/_/g," ");	
	var newNodeName = "";
	if(url_org==null){
	    newNodeName = "<a class='species_tree_link' id='tree_link_"+speciesNodeName1+"' href='./organism/view/"+speciesNodeName1+"'>"+speciesNodeName2+"</a>";
	}
	else{
	    newNodeName = "<a class='species_tree_link' id='tree_link_"+speciesNodeName1+"' href='"+url_org+"/"+speciesNodeName1+"'>"+speciesNodeName2+"</a>";	
	}
	
	//canvas.drawString(newNodeName,parseInt((maxDepth-1)*DEPTH_CONST +20),parseInt(height*HEIGHT_CONST-7));
	canvas.drawString(newNodeName,x2+10,parseInt(height*HEIGHT_CONST-7));
	canvas.setColor(DRAW_COLOR); 
    }
    else{
	canvas.setColor("#000000");			
	//draw vertical lines
	for(var i=0;i<node.numChildren();i++){
	    var childnode = node.getChild(i);
	    x1 = endHorizontal;
 	    x2 = endHorizontal;
	    y1 = height*HEIGHT_CONST;
	    y2 = childnode.getDrawHeight()*HEIGHT_CONST;
	    if(height>0)	   
	        canvas.drawLine(x1,y1,x2,y2);				
	    //draw children nodes in recursive way
	    if(url_org!=null && url_group!=null)
		drawBranchRecursive(canvas,childnode,endHorizontal,maxDepth,url_org,url_group);
	    else
	    	drawBranchRecursive(canvas,childnode,endHorizontal,maxDepth);
	}
	var tr_height = height*HEIGHT_CONST-12;
	if(tr_height>0){	   
	    canvas.setFont("Helvetica","10px",Font.PLAIN);
	    canvas.setColor("#347C2C");
	    var innerNodeName = "";
	    if(url_group==null){		
		var nameLower = node.getNodeName().toLowerCase();
		var pl_ind    = nameLower.indexOf("plants");
		if(pl_ind!=-1){
		    nameLower = nameLower.substring(0,pl_ind) + "_"+nameLower.substring(pl_ind);
		}
	 	//innerNodeName = "<span class='tooltip_t tooltip_text_"+nameLower+"' style='color:#646D7E'>"+node.getNodeName()+"</span>";
		//innerNodeName = "<span style='color:#646D7E;'>"+node.getNodeName()+"</span>";		
		//var innerNodeName = "<a href='#' onclick='displayGroup(\""+node.getNodeName()+"\");return false;'>"+node.getNodeName()+"</a>";
		innerNodeName = "<span class='tooltip_t tooltip_text_"+nameLower+"' style='color:646D7E'><a href='./organism/group/"+node.getNodeName()+"'>"+node.getNodeName()+"</a></span>";		
	    }
	    else{
		//var innerNodeName = "<a href='"+url_group+"/"+node.getNodeName()+"'>"+node.getNodeName()+"</a>";
	    }
	    canvas.drawStringRect(innerNodeName,endHorizontal-203,height*HEIGHT_CONST-12,200,"right");
	    canvas.fillRect(endHorizontal-1,height*HEIGHT_CONST-1,4,4);	    
	    canvas.setColor("#000000");	  
	}	
    }	    
}



function drawTreeNewSelect(canvas,tree){
   drawTreeNewSelect(canvas,tree,""); 
}

/*
 * IMPORTANT! THIS IS AN ADAPTED VERSION OF THE NORMAL TREE-DRAWING 
 * ALOGORITHM, TO ACCOMODATE FOR THE INCLUSION OF SELECT BOXES.
 */
function drawTreeNewSelect(canvas,tree,species_select){
	//part 1, get the correct heights for all the leaves and branches.
	//This is done by a top-down iterative algorithm.
	//get the necessary variables from the tree
	var leaves = tree.getLeaves();
	var maxDepth = tree.getMaxDepth();
	leaves = invertsPosition(leaves);
	setCorrectParameters(leaves,maxDepth);
	var toDrawNodes = new Array();
	toDrawNodes = toDrawNodes.concat(leaves);
	var iterations = 0;
	while(toDrawNodes.length>1){
		if(iterations++ > 50){break;}
		for(var i=0;i<toDrawNodes.length;i++){
			var n1 = toDrawNodes[i];
			var sameParentArray = getSameParentNodesIndices(toDrawNodes,i+1,n1.getParentNode());
			if(sameParentArray.length==0){
			}
			else{
				var drawNodes = new Array();
				drawNodes[0] = n1;
				for(var j=0;j<sameParentArray.length;j++)
					drawNodes[j+1] = toDrawNodes[sameParentArray[j]];
				var newHeight = 0;
				for(var j=0;j<drawNodes.length;j++)
					newHeight+= drawNodes[j].getDrawHeight();
				newHeight = newHeight/drawNodes.length;
				//prepare parent node 
				var parentNode = n1.getParentNode();
				parentNode.setDrawHeight(newHeight);
				//remove the nodes that were used.
				toDrawNodes = removeNodes(drawNodes,toDrawNodes);
				//push parent node onto stack of nodes to be drawn
				toDrawNodes.push(parentNode);
				//jump outta for loop, into outer while loop.
				break;
			}
		}	
	}	
	//part 2, with the correct heights set, draw the correct branches
	//with the approptiate lengths.
	//This is done by a bottom-up recursive algorithm.
	var maxDepth = tree.getMaxDepth();
	drawBranchRecursiveSelect(canvas,tree,0,maxDepth,species_select);
	canvas.paint();
}

/*
 * IMPORTANT! THIS IS AN ADAPTED VERSION OF THE NORMAL TREE-DRAWING 
 * ALOGORITHM, TO ACCOMODATE FOR THE INCLUSION OF SELECT BOXES.
 */
function drawBranchRecursiveSelect(canvas,node,startx,maxDepth,species_select){
	var nodeName = node.getNodeName();
	var nodeLength = node.getValue();
	if(startx==0){nodeLength=nodeLength/5;}
	var numChildren = node.numChildren();
	var height = node.getDrawHeight();
	//canvas.setColor("#8D625B");
	canvas.setColor(DRAW_COLOR);	
	canvas.setStroke(2);
	
	//x,y coords needed for drawing
	var x1 = 0;
	var x2 = 0;
	var y1 = 0;
	var y2 = 0;
	
	var endHorizontal = startx+nodeLength*DEPTH_CONST1;
	//horizontal line
	x1 = startx;
	x2 = endHorizontal;
	y1 = height*HEIGHT_CONST;
	y2 = height*HEIGHT_CONST;
	if(height>0)
	    canvas.drawLine(x1,y1,x2,y2);
	
	if(node.isLeave()){

		//draw string
		canvas.setColor("#05636b");
		canvas.setFont("Arial","12px",Font.PLAIN);
		var totalNodeName = node.getNodeName();
		var split = totalNodeName.split("+");

		if(species_select=="species_select"){
		    var speciesNodeName1 = split[0].replace(/_/g,"+");
		    var speciesNodeName2 = split[0].replace(/_/g," ");
		    var speciesNodeName  = split[1].replace(/_/g," ");
		    var newNodeName ="<a class='species_tree_link' href= '../organism/view/"+speciesNodeName1+"'>"+speciesNodeName2+"</a>";
		    var newNodeSelectName = "<input class='species_select' id='species_select_"+speciesNodeName+"' type='checkbox' name='species_select_"+speciesNodeName+"' value='species_select_"+speciesNodeName+"' checked='checked' />";
		    canvas.drawString(newNodeName,x2+10,parseInt(height*HEIGHT_CONST-7));		
		    canvas.drawString(newNodeSelectName,(maxDepth)*DEPTH_CONST,height*HEIGHT_CONST-7);	
		    canvas.setColor(DRAW_COLOR);
		}
		else{
		    var speciesNodeName1 = split[0].replace(/_/g,"+");
		    var speciesNodeName2 = split[0].replace(/_/g," ");
		    var sourceNodeName = split[1].replace(/_/g," ");

		    var newNodeName = "<a class='species_tree_link' href= '../organism/view/"+speciesNodeName1+"'>"+speciesNodeName2+" ("+sourceNodeName+")"+"</a>";		
		    var newNodeSelectName = "<input id='"+split[0]+"' type='checkbox' name='checkbox_organism_"+speciesNodeName1+"' value='checkbox_organism_"+speciesNodeName1+"'checked>";
		    canvas.drawString(newNodeName,x2+10,parseInt(height*HEIGHT_CONST-7));		
		    canvas.drawString(newNodeSelectName,(maxDepth+4)*DEPTH_CONST,height*HEIGHT_CONST-7);	
		    canvas.setColor(DRAW_COLOR);
		}
	}
	else{
		
		//draw node name
		//canvas.setFont("Helvetica","8px",Font.PLAIN);
		//canvas.drawStringRect(node.getNodeName(),endHorizontal-200,height*HEIGHT_CONST-12,200,"right");
		
		//draw vertical lines
		for(var i=0;i<node.numChildren();i++){
			var childnode = node.getChild(i);
			x1 = endHorizontal;
			x2 = endHorizontal;
			y1 = height*HEIGHT_CONST;
			y2 = childnode.getDrawHeight()*HEIGHT_CONST;
			if(height>0)
				canvas.drawLine(x1,y1,x2,y2);
			
			//draw children nodes in recursive way
			drawBranchRecursiveSelect(canvas,childnode,endHorizontal,maxDepth,species_select);
		}	
	}	
}



/*
 * inverts the position of all elements in an array
 */
function invertsPosition(nodes){
	var newNodes = new Array();
	for(var i=nodes.length-1;i>=0;i--){
		var node = nodes[i];
		newNodes.push(node);
	}
	return newNodes;
}


function removeNodes(nodeArray,nodes){
	var result = new Array();
	for(var i=0;i<nodes.length;i++){
		var n = nodes[i];
		var contains = containsNode(n,nodeArray);
		if(contains){
			//do nothing	
		}
		else{
			result.push(n);
		}
	}
	return result;
}

function containsNode(node,nodes){
	var result = false;
	for(var i=0;i<nodes.length;i++){
		var n = nodes[i];
		if(n==node){
			result = true;
			break;
		}
	}
	return result;
}

/*
 * removes two used nodes from the array that should draw those nodes.
 
function removeNodes(node1,node2,nodes){
	var newNodes = new Array();
	for(var i=0;i<nodes.length;i++){
		var node = nodes[i];
		if((node==node1)||(node==node2)){
			//do nothing
		}
		else{
			newNodes.push(node);
		}
	}
	return newNodes;
}
*/


/*
 * returns the correct x-offset
 */
function getGoodOffset(node,maxDepth){
	if(parseInt(node.getDrawDepth())==maxDepth)
		return 0.75;
	else
		return 1.0;
}

/*
 * just returns the minimum of two numbers
 */
function min(a,b){
	if(a>b)
		return b;
	else
		return a;
} 

//this gets an array with Nodes as param
function min(a){
	var result = a[0].getDrawDepth();
	for(var j=1;j<a.length;j++){
		var temp = a[j].getDrawDepth();
		if(temp<result)
			result = temp;
	}
	return result;
}

//this gets an array with Nodes as param
function minDrawDepth(a){
	var result = a[0].getDrawDepth();
	for(var j=1;j<a.length;j++){
		var temp = a[j].getDrawDepth();
		if(temp<result)
			result = temp;
	}
	return result;
}
 
 
function getSameParentNodesIndices(nodes,startIndex,parentNode){
	var result = new Array();
	for(var i=startIndex;i<nodes.length;i++){
		var n = nodes[i];
		var nParent = n.getParentNode();
		if(nParent==parentNode){
			var tpe = new Array(""+i);
			result = result.concat(tpe);
		}
	}
	return result;
} 
 
/*
 * This method tries to find a node in the array nodes, with 
 * the same parentnode as given by the function. Startindex 
 * is given to prevent nodes as indicating themselves as having the 
 * same parent. 
 */
function getSameParentNodeIndex(nodes,startIndex,parentNode){
	var result = -1;
	for(var i=startIndex;i<nodes.length;i++){
		var n = nodes[i];
		
		/*
		 * TODO: CHANGED 04/04/2008
		 * ORIGINAL:
		 * var nParent = n.getParentNode();
		 *	if(nParent == parentNode){
		 *		result = i;
		 *		break;
		 *	}
		 */
		if(n != null){
			var nParent = n.getParentNode();
			if(nParent == parentNode){
				result = i;
				break;
			}
		}
		else{
			break;
		}
	}
	return result;
}


/*
 * Sets the div as indicated to be a certain height, depending on the 
 * given tree.
 */
function setCorrectDivHeight(tree,divid){
	var numLeaves = tree.numLeaves();
	var totalHeight = (numLeaves*HEIGHT_CONST + 20)+"px";
	document.getElementById(divid).style.height=totalHeight;
} 
 
