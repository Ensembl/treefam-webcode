/** 
 * Tree component 
 * 
 * @class
 * @extends Biojs
 * 
 * @author <a href="mailto:fs@ebi.ac.uk">Fabian Schreiber</a>
 * @version 1.0.0
 * @category 3
 * 
 * @requires <a href='http://blog.jquery.com/2011/09/12/jquery-1-6-4-released/'>jQuery Core 1.6.4</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="../biojs/dependencies/jquery/jquery-1.4.2.min.js"></script>
 * 
 * @requires <a href='http://jqueryui.com/download'>jQuery UI 1.8.16</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="../biojs/dependencies/jquery/jquery-ui-1.8.2.custom.min.js"></script>
 * 
 * @param {Object} options An object with the options for Sequence component.
 *    
 * @option {string} target 
 *    Identifier of the DIV tag where the component should be displayed.
 *    
 * @option {string} sequence 
 *    The sequence to be displayed.
 *    
 * @option {string} [id] 
 *    Sequence identifier if apply.
 *    
 * @option {string} [format="FASTA"] 
 *    The display format for the sequence representation.
 *    
 * @option {Object[]} [highlights] 
 * 	  For highlighting multiple regions. 
 *    <pre class="brush: js" title="Syntax:"> 
 *    [
 *    	// Highlight aminoacids from 'start' to 'end' of the current strand using the specified 'color' (optional) and 'background' (optional).
 *    	{ start: &lt;startVal1&gt;, end: &lt;endVal1&gt; [, id:&lt;idVal1&gt;] [, color: &lt;HTMLColor&gt;] [, background: &lt;HTMLColor&gt;]}, 
 *    	//
 *    	// Any others highlights
 *    	...,  
 *    	// 
 *    	{ start: &lt;startValN&gt;, end: &lt;endValN&gt; [, id:&lt;idValN&gt;] [, color: &lt;HTMLColor&gt;] [, background: &lt;HTMLColor&gt;]}
 *    ]</pre>
 * 
 * <pre class="brush: js" title="Example:"> 
 * highlights : [
 * 		{ start:30, end:42, color:"white", background:"green", id:"spin1" },
 *		{ start:139, end:140 }, 
 *		{ start:631, end:633, color:"white", background:"blue" }
 *	]
 * </pre>
 * 
 * @option {Object} [columns={size:40,spacedEach:10}] 
 * 	  Options for displaying the columns. Syntax: { size: &lt;numCols&gt;, spacedEach: &lt;numCols&gt;}
 * 
 * @option {Object} [selection] 
 * 	  Positions for the current selected region. Syntax: { start: &lt;startValue&gt;, end: &lt;endValue&gt;}
 * 
 * @option {Object[]} [annotations] 
 *    Set of overlapping annotations. Must be an array of objects following the syntax:
 *     		<pre class="brush: js" title="Syntax:">
 *            [ 
 *              // An annotation:
 *              { name: &lt;name&gt;, 
 *                html: &lt;message&gt;, 
 *                color: &lt;color_code&gt;, 
 *                regions: [{ start: &lt;startVal1&gt;, end: &lt;endVal1&gt; color: &lt;HTMLColor&gt;}, ...,{ start: &lt;startValN&gt;, end: &lt;endValN&gt;, color: &lt;HTMLColor&gt;}] 
 *              }, 
 *              
 *              // ...
 *              // more annotations here 
 *              // ...
 *            ]
 *    		 </pre>
 *    where:
 *      <ul>
 *        <li><b>name</b> is the unique name for the annotation</li>
 *        <li><b>html</b> is the message (can be HTML) to be displayed in the tool tip.</li>
 *        <li><b>color</b> is the default HTML color code for all the regions.</li>
 *        <li><b>regions</b> array of objects defining the intervals which belongs to the annotation.</li>
 *        <li><b>regions[i].start</b> is the starting character for the i-th interval.</li>
 *        <li><b>regions[i].end</b> is the ending character for the i-th interval.</li>
 *        <li><b>regions[i].color</b> is an optional color for the i-th interval.   
 *      </ul> 
 *      
 * @option {Object} [formatOptions={title:true, footer:true}] 
 * 	  Options for displaying the title. by now just affecting the CODATA format.
 *    <pre class="brush: js" title="Syntax:"> 
 * 		formatOptions : {
 * 			title:false,
 * 			footer:false
 * 		}
 *    </pre>
 *    
 * @example 
 *			var json_tree = "../../main/resources/dependencies/data/trees/toy_tree.json";
 *			var no_genes = 4 * 2;
 *			var alignment_length = 54 * 2;
 *			var image_path = "http://www.ebi.ac.uk/~fs/d3treeviewer/data/images/species_files/";
 *			//var highlight_gene = "ENSBTAP00000001311";
 *			var highlight_gene = "";
 *			//var newick_tree = "../data/trees/newick_tree.nh";
 *			var newick_tree = "";
 *			var load_from_variable = 0;
 * myTree = new Biojs.Tree({
 *			        target : "tree",
 *			        tv_contentcontainer : "tv_contentcontainer",
 *			        format : 'CODATA',
 *					formatOptions : {
 *			 			title:false,
 *						footer:false,
 *						tree:'json',
 *			  		},
 *			        id : 'P918283',
 *					// tree parameters
 *					no_genes : no_genes, 
 *				    alignment_length : alignment_length, 
 *				    json_tree : json_tree, 
 *				    image_path : image_path,
 *				    newick_tree : newick_tree,
 *				    highlight_gene : highlight_gene,
 *				    json_tree_string : json_tree_string,
 *				    load_from_variable : load_from_variable,
 *					show_controls : show_controls,
 *					modelTreeOn : ""
 *			});
 * 
 */

Biojs.Tree = Biojs.extend(
/** @lends Biojs.Tree# */
{	
	constructor: function (options) {
		var self = this;

		this._container = jQuery( "#" + this.opt.target );
		this._contentcontainer = jQuery( "#" + this.opt.tv_contentcontainer );
		
		// Lazy initialization 
		this._container.ready(function() {
			self._initialize();
		});
	},
	
	/**
	 * Default values for the options
	 * @name Biojs.Sequence-opt
	 */
	opt : {
		
		// new opts for tree
		alignment_length : "",
		json_tree : "",
		image_path : "",
		newick_tree : "",
		tree_data : "",
		no_genes : "",
		tree : "",
		highlight_gene : "",
		load_from_variable : undefined,
		load_from_web : undefined,
		json_tree_string : "",
		root : "",
		tv_contentcontainer : "tv_contentcontainer",
		show_real_branchlength: false,
		//domainScale : d3.scale.linear().domain([20,4000]).range([1, 250]),
		
		sequence : "",
		id : "",
		target : "",
		format : "FASTA",
		selection: { start: 0, end: 0 },
		columns: { size: 35, spacedEach: 10 },
		highlights : [],
		annotations: [],
		sequenceUrl: 'http://www.ebi.ac.uk/das-srv/uniprot/das/uniprot/sequence',
		modelTreeOn: "",
		
		// Styles 
		duplication_circle_size : 15,
		circle_size : 3,
		sequence_rect_width : 12,
		leaf_group_x : 188,
		sequence_start_y : 300,
		link_type : "elbow",
		leaf_space : "300",
		i : 0, 
		duration : 100, 
		root: "",
		diagonal: "",
		fontSize: 10,
		tree_representation_type: "not-radial",
		max_seq_representation: 250,
		
		
		selectionColor : 'Yellow',
		selectionFontColor : 'black',
		highlightFontColor : 'red',
		highlightBackgroundColor : 'white',
		fontFamily: '"Andale mono", courier, monospace',
		fontSize: '12px',
		fontColor : 'inherit',
		backgroundColor : 'inherit',
		width: 1500,
		availablewidth: 1500,
		height: undefined,
		formatSelectorVisible: true
	},
	
	/**
	 * Array containing the supported event names
	 * @name Biojs.Sequence-eventTypes
	 */
	eventTypes : [
		/**
		 * @name Biojs.Sequence#onSelectionChanged
		 * @event
		 * @param {function} actionPerformed An function which receives an {@link Biojs.Event} object as argument.
		 * @eventData {Object} source The component which did triggered the event.
		 * @eventData {string} type The name of the event.
		 * @eventData {int} start A number indicating the start of the selection.
		 * @eventData {int} end A number indicating the ending of selection.
		 * @example 
		 * mySequence.onSelectionChanged(
		 *    function( objEvent ) {
		 *       alert("Selected: " + objEvent.start + ", " + objEvent.end );
		 *    }
		 * ); 
		 * 
		 * */
		"onSelectionChanged",
		
		/**
		 * @name Biojs.Sequence#onSelectionChange
		 * @event
		 * @param {function} actionPerformed An function which receives an {@link Biojs.Event} object as argument.
		 * @eventData {Object} source The component which did triggered the event.
		 * @eventData {string} type The name of the event.
		 * @eventData {int} start A number indicating the start of the selection.
		 * @eventData {int} end A number indicating the ending of selection.
		 * @example 
		 * mySequence.onSelectionChange(
		 *    function( objEvent ) {
		 *       alert("Selection in progress: " + objEvent.start + ", " + objEvent.end );
		 *    }
		 * );  
		 * 
		 * 
		 * */
		"onSelectionChange",
		
		/**
		 * @name Biojs.Sequence#onAnnotationClicked
		 * @event
		 * @param {function} actionPerformed An function which receives an {@link Biojs.Event} object as argument.
		 * @eventData {Object} source The component which did triggered the event.
		 * @eventData {string} type The name of the event.
		 * @eventData {string} name The name of the selected annotation.
		 * @eventData {int} pos A number indicating the position of the selected amino acid.
		 * @example 
		 * mySequence.onAnnotationClicked(
		 *    function( objEvent ) {
		 *       alert("Clicked " + objEvent.name + " on position " + objEvent.pos );
		 *    }
		 * );  
		 * 
		 * */
		"onAnnotationClicked"
	],

	// internal members
	_headerDiv : null,
	_contentDiv : null,
	
	// Methods

	_initialize: function () {
		var self = this;
		console.log("in initialise");
		// add zoom
		//this.addZoom();
		//this.chart = document.getElementById(this.opt.target);
		//this.cx = this.chart.clientWidth;
		//this.cy = this.chart.clientHeight;
		// DIV for the format selector
		//console.log("font size is "+this.opt.fontSize);
		//this._buildDivs();
		// set model organisms
		this.setModelOrganisms();
		// Read tree data
		this.tree_data = this.readTree({'load_from_variable': this.opt.load_from_variable,
										'tree_format' : this.opt.formatOptions.tree,
										'tree_data': this.opt.json_tree,
										'tree_data_variable' : this.opt.json_tree_string,
										'load_from_web' : this.opt.load_from_web});

		this.padding = {
		     "top":    0,
		     "right":  10,
		     "bottom": 0,
		     "left":   10
		  };		// set correct height

    	this.opt.tree = d3.layout.cluster();
    	var tree = this.opt.tree;
    	var nodes = tree.nodes(this.tree_data);
  		this.opt.height = nodes.length * 11;
  		//console.log("setting svg to height: "+this.opt.height+" and width: "+this.opt.width);
		var div_width = d3.select("#"+this.opt.target).style("width");							
  		this._setVisualSpace({'width':div_width,'height':this.opt.height});
  		//this.opt.vis.attr("transform", "translate(40,40)").append('svg:g');

		// set visual area to this.opt.vis
		var width = this.opt.width - this.padding.left - this.padding.right;
		var height = this.opt.height - this.padding.top - this.padding.bottom;
		var div_width = parseInt(d3.select("#"+this.opt.target).style("width")) - 400;	
		this.opt.leaf_space = parseInt( div_width/ 2);
		//console.log("setting tree to: heigth: "+height+" and width: "+width+" and available: "+div_width+" is: "+(div_width -this.opt.leaf_space));
		// div_width = width - leaf_space (50:50)
		//div_width = 300;
		this.opt.tree = d3.layout.cluster()
								 .separation(function(a, b) { return a.parent === b.parent ? 4 : 4; })
								 .size([height, div_width-this.opt.leaf_space])
								 //.size([height, width -this.opt.leaf_space])
								 ;
		// set diagonal
		//this.opt.diagonal = d3.svg.diagonal.radial().projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });
		this.opt.diagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });
		// set visual area to this.opt.vis

		console.log("heigth cx: "+this.cx+" and width: "+this.cy);
		//exsr
		//this.clear_divs();

 		console.log("h is now: "+this.opt.height);
  		if(this.opt.show_controls !== undefined){
  			console.log("show controls");
  			//this.setControls();
  		}
  		// set domain colors
  		this.setDomainColors();
  		// set taxa to show
  		this.setTaxaToShow();

  		console.log("tree data at end is");

  		console.log(this.tree_data);

  		//if ( this.opt.width !== undefined ) {
  		//	console.log("container width needs to be set?");
  			//this._container.width( this.opt.width );
			//}

  		//if ( this.opt.height !== undefined ) {
  			//this._container.height( this.opt.height );
			//}
  	  	//this.update(this.opt.root = this.tree_data); 
	  	this.update(this.tree_data); 
	},
	/**
	 * Setting the svg
	 * @param {string} seq The sequence strand.
	 * @param {string} [identifier] Sequence identifier.
	 * 
	 * @example 
	 * this._setvisualSpace();
	 * 
	 */
	_setVisualSpace: function ( args ) {
		var width = args.width;
		var height = args.height;
		var self = this;
		/*this.opt.vis = d3.select("#"+this.opt.target).append("svg:svg")
								.attr("width", width) 
								.attr("height", height)
								//.attr("padding", "40px");
								//.attr("pointer-events", "all")
								//.append('svg:g');
								
								*/
		var m = [40, 240, 40, 240],
								    w = 1000 -m[0] -m[0],
								    h = 1840 -m[0] -m[2],
								    i = 0,
								    root;
		var div_width = d3.select("#"+this.opt.target).style("width");							
		var div_heigth = d3.select("#"+this.opt.target).style("heigth");							
		console.log("heigth is "+div_heigth+" and width is "+div_width);
		//blaaaa
		self.opt.availablewidth = div_width;
		var w = window,
		    d = document,
		    e = d.documentElement,
		    g = d.getElementsByTagName('body')[0],
		    x = w.innerWidth || e.clientWidth || g.clientWidth,
		    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
		console.log("x: "+x+" y: "+y);
		//bla
		console.log("setting height to "+(height * 2));
		this.opt.vis = d3.select("#"+this.opt.target).append("svg:svg")
								    .attr("class","svg_container")
								    .attr("width", div_width)
								    .attr("height", height)
									//.attr("viewBox", "30 0 300 800")
								    //.style("overflow", "scroll")
								    //.style("background-color","#EEEEEE")
								    .append("svg:g")
								    .attr("class","drawarea");
									// add textares
		this.opt.vis
								    .append("svg:g")
								    .attr("class","axisarea");
		this.opt.vis  = this.opt.vis
									//.append("div")
										.append("svg:g")
										.attr("class","treearea")
								    .append("svg:g")
								    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
		
	//	self.zoomObject = d3.behavior.zoom()
	  //            .scaleExtent([0.5, 2])
	    //          .on("zoom", zoom);

	 // self.zoomObject = d3.behavior.zoom().scaleExtent([0.2, 8]).on("zoom", zoom);

	//	d3.select("#"+this.opt.target+" svg").call(self.zoomObject);								
									
	},
	slideZoom: function(zoom_level){
		
		console.log("ready to zoom-slide:"+zoom_level);
		//self.zoomObject = d3.behavior.zoom().scaleExtent([0.2, 8]).on("zoom", zoom);
		//console.log(this.zoomObject);
		//console.log(this.zoomObject.scale);
		//this.zoomObject.translate([0,0]).scale(1);
		//var currentScale = d3.event.scale;
		//this.zoomObject.scale(currentScale);
		
		
		zoom_slider({scale: [zoom_level] });
	},
	addZoom: function(args){
		//console.log("add zoom");
		var self = this;
		self.zoom_behavior =d3.behavior.zoom()
			              .scaleExtent([0.5, 2])
			              .on("zoom", zoom)
			
		d3.select("#"+this.opt.target+" svg").call(self.zoom_behavior);
			 // self.zoomObject = d3.behavior.zoom().scaleExtent([0.2, 8]).on("zoom", zoom);
	
		
	},
	
	removeZoom: function(args){
		//console.log("add zoom");
		//this.opt.vis.call(d3.behavior.zoom().on("zoom", this.redraw({vis : this.opt.vis})))
		//					.append('svg:g');	
		
		self.zoom_behavior = d3.behavior.zoom()
			              .scaleExtent([0.5, 2])
			              .on("zoom", null);
		d3.select("#"+this.opt.target+" svg").call(self.zoom_behavior);
	},
	resetZoom: function(args){
		var self = this;
		//console.log("add zoom");
		//this.opt.vis.call(d3.behavior.zoom().on("zoom", this.redraw({vis : this.opt.vis})))
		//					.append('svg:g');	
		self.zoom_behavior = d3.behavior.zoom()
			              .scaleExtent([0.5, 2])
			              .on("zoom", null);
		self.zoom_behavior.scale(1);
		self.zoom_behavior.translate([0, 0]);
		var vis = d3.select("#"+this.opt.target+" svg");
		vis.transition().duration(500).attr('transform', 'translate(' + zoom.translate() + ') scale(' + zoom.scale() + ')')
		
		//.call(self.zoom_behavior);
	},
	
	

	redraw: function(args){
		var vis = args.vis;
		console.log("in zoom");
		//console.log("here", d3.event.translate, d3.event.scale);
		  //vis.attr("transform",
		    //  "translate(" + d3.event.translate + ")"
		      //+ " scale(" + d3.event.scale + ")");
	},
	/**
	 * readTree in different formats
	 * @param {string} load_from_variable sequence strand.
	 * @param {string} [identifier] Sequence identifier.
	 * 
	 * @example 
	 * myTree.readTree();
	 * 
	 */
	readTree: function(args){
		var self = this;
		var load_from_variable = args.load_from_variable;
		var tree_format = args.tree_format;
		var tree_data = args.tree_data;
		var tree_data_variable = args.tree_data_variable;
		var load_from_web = args.load_from_web;
		var json_tree_data;
		console.log("load from web is: "+load_from_web);
		
		if(load_from_variable){
				console.log("load from variable selected");
				console.log(tree_data_variable);
				//json_tree_data = JSON.parse( 
				json_tree_data = JSON.parse(tree_data_variable);
				//self.update({'root' : json_tree_data}); 
				//self.update({'root' : tree_data_variable}); 
		}
		else if(load_from_web){
			json_tree_data = tree_data_variable;
		}
		else if(tree_format == "json" ){
			console.log("json selected");
			
			jQuery.ajax({
			          url: tree_data,
					  dataType: "json",
					  async: false,
			          //type: 'POST',
			          //data: {list_item: selected_from_list},

			          success: function(result){
						  console.log("have result");
					  		json_tree_data = result;
					  }
					  
					  });
			
			
		 	//d3.json(tree_data, function(json_tree_data) {
			//	  //gTree.update(root = json);
			//	  console.log("setting json data from "+tree_data+" ");
			//	  console.log(json_tree_data);
			//	  self.tree_data = json_tree_data;
			//	  some_test = json_tree_data;
			//	  //var pruned_tree = self.iterateTree(json_tree_data);
			//	  console.log(some_test);
			//	  console.log("done with d3.json");
			//	  return json_tree_data;
  			//	  //self.update(self.opt.root = json_tree_data); 
			//});
			//console.log("well, we are outside the json read routine");
			//console.log(json_tree_data);
			//return json_tree_data;
		}
		else{
			console.log("newick selected");
			d3.text(tree_data, function(text) {
		  	var x = newick.parse(text);
			var cluster = d3.layout.cluster()
								    .size([360, 1])
								    .sort(null)
								    .value(function(d) { return d.length; })
								    .children(function(d) { return d.branchset; })
								    .separation(function(a, b) { return 1; });
		  	var json_tree_data = cluster(x);
		  	console.log(x);
			self.update({'root' : json_tree_data}); 
			//gTree.update(root = nodes);
			});
		}
		
		//console.log("end of  'read_tree'")
		//console.log(some_test);
		//console.log(self.json_tree_data);
		
		//test
		return json_tree_data;
		
	},
	/**
	 * Sets controls.
	 * @param {string} seq The sequence strand.
	 * @param {string} [identifier] Sequence identifier.
	 * 
	 * @example 
	 * myTree.update();
	 * 
	 */
	
	
	iterateTree: function(obj) {
		var self = this;
	    for(var key in obj) { // iterate, `key` is the property key
	        var elem = obj[key]; // `obj[key]` is the value
			//console.log(key);
	        if(key === "taxon") { // found "text" property
				console.log(elem);
				if(elem == "Homo_sapiens"){
					console.log("delete it");
					delete(elem);
				}
	            //count++;
	        }

	        if(typeof elem === "object") { // is an object (plain object or array),// so contains children
	            self.iterateTree(elem); // call recursively
	        }
	    }
		return obj;
	},
	


	/**
	 * clears the div
	 * 
	 * @example 
	 * myTree.showModelTree();
	 * 
	 */	
	clear_divs: function(){
		jQuery('.added_button').remove();
		jQuery('#tree').empty();
		console.log("cleared divs");
	},
	/**
	 * Shows the tree based on a selected subset of species
	 * 
	 * @example 
	 * myTree.showModelTree();
	 * 
	 */
	showModelTree: function(){
		//var full_tree = this.tree_data;
		this.opt.modelTreeOn = "on";
		console.log("model tree with "+full_tree.length);
		//console.log(full_tree);
		this.update(); 
	},
	/**
	 * Shows the full tree
	 * 
	 * @example 
	 * myTree.showFullTree();
	 * 
	 */
	showFullTree: function(){
		//var full_tree = this.tree_data;
		this.opt.modelTreeOn = "";
		console.log("full tree with "+full_tree.length);
		//console.log(full_tree);
		this.update(); 
	},
	
	
	addAxis: function(args){
		var max_seq_length = args.max_seq_length;
		console.log("adding axis");
		// AXIS
		var annotation_scale = d3.scale.linear().domain([0, max_seq_length+((max_seq_length * 20) / 100)]).range([0, 400]);
		var xAnnotation_axis = d3.svg.axis().scale(annotation_scale).orient("bottom");				
		//d3.select("#"+this.opt.target).append("svg")
		d3.select(".axisarea").append("svg")
		//d3.select("#"+this.opt.target+" svg")
					.append("svg")
				      .attr("class", "axis")
					  .attr("x", 627)
					  //.attr("y", 0)
					  
					  .attr("orient", "top")
					  //.attr("transform", "translate(30,30)")
				      .call(xAnnotation_axis);

        /*this.opt.vis.append("svg")
						.append("text")      
			  		// text label for the x axis
			    		.attr("x", 800 )
			    		.attr("y",  8 )
			    		.style("text-anchor", "middle")
			    		.text("Sequence length"); */
		
		
	},
	
	_highlightSpeciesData: function(test,d){
			if(!d.children){ 
				//console.log("mouseovered a leaf");
				var group_circle_box = d3.select(test).select("svg circle");
				group_circle_box.attr("r", 6);
				//var group_image = d3.select(test).select("svg image");
				//group_image.attr("width", 40).attr("height", 40);
				//var group_text = d3.select(test).select("svg text");
				//group_text.attr("x", 65);
			}
	},
	_deHighlightSpeciesData: function(test,d){
			if(!d.children){ 
				//console.log("mouseovered a leaf");
				var group_circle_box = d3.select(test).select("svg circle");
				//console.log(group_circle_box);
				group_circle_box.attr("r", 0);
				//var group_image = d3.select(test).select("svg image");
				//group_image.attr("width", 20).attr("height", 20);
				//var group_text = d3.select(test).select("svg text");
				//group_text.attr("x", 35);
			}
	},
	
	set_branchlengths: function(n, offset) {
		var self = this;
		//console.log(n.name+" has "+n.branch_length);
  	  if (n.branch_length != null && n.branch_length != "N/A"){
		  if(n.branch_length == 0 || n.branch_length <  0.01){
		  	offset += 3;
		  }
		  else if(n.branch_length >  2){
		  	offset += 115;
			//console.log("found branch_length: offset += n.data.length * 115: "+offset+" += "+n.branch_length);
		  }
		  else{
			    offset += n.branch_length * 115;
				//console.log("found branch_length: offset += n.data.length * 115: "+offset+" += "+n.branch_length);
			}
		}
		else{
			offset += 100;
		}
		
	  //if (n.data && n.data.length != null){
	   // offset += n.data.length * 115;
	    //console.log("offset += n.data.length * 115: "+offset+" += "+n.data.length);
	  //}
	 // console.log("setting n.y to "+offset);
	  n.y = offset;
	  //offset = offset + Math.floor(Math.random()*61);
	  //offset = offset + 30;
	  if (n.children)
	    //console.log("has children");
	    n.children.forEach(function(n) {
		    //console.log(n)
	      self.set_branchlengths(n, offset);
	    });
	},
	show_gene_annotation: function(){
			show_leaf_common_name();
	},
	show_uniprot_annotation: function(){
			show_leaf_uniprot();
	},
	toggle_branchlength: function(){
		//var full_tree = this.tree_data;
		//console.log("about to toggle branch length is: "+this.opt.show_real_branchlength)
		//this.opt.show_real_branchlength = "on";
		this.opt.show_real_branchlength = !this.opt.show_real_branchlength;
		//console.log("is now: "+this.opt.show_real_branchlength)
		//console.log("model tree with "+full_tree.length);
		//console.log(full_tree);
		this.update(); 
	},
	show_bootstrap: function(){
		d3.select("#tree svg").selectAll(".bootstrap").attr("visibility", "");
	},
	hide_bootstrap: function(){
		d3.select("#tree svg").selectAll(".bootstrap").attr("visibility", "hidden");
	},
	show_taxlevel: function(){
		d3.select("#tree svg").selectAll(".innerNode_label").attr("visibility", "");
	},
	hide_taxlevel: function(){
		d3.select("#tree svg").selectAll(".innerNode_label").attr("visibility", "hidden");
	},
	/**
	 * Updates a tree layout.
	 * 
	 * @example 
	 * myTree.update();
	 * 
	 */
	update: function(source){
		var self = this;
		var root = this.tree_data;
		var target = d3.select(".treearea");
		
		//this.opt.target;
		var i = 0;
		//console.log("root is");
		//console.log(root);
	  	// Compute the new tree layout.
		//this.nodes  = this.set_nodes({'root': root});
		var tree = this.opt.tree;
		console.log("beginning of update");
		//console.log(tree);
		var nodes = tree.nodes(root);
		console.log("normal: "+nodes.length);


		var selected_nodes = nodes.slice(0);
		if(self.opt.show_real_branchlength){
			self.set_branchlengths(nodes[0], 0);
		}
		//console.log(selected_nodes);
		//if(this.opt.modelTreeOn == "on"){
		//		console.log("try prunging tree");
		//		this.pruneTree(selected_nodes);
		//		console.log("normal: "+nodes.length);
		//		console.log("normal: "+selected_nodes.length);
		//}
	  	//console.log("tree has "+selected_nodes.length+" nodes");


		//console.log(selected_nodes);
		// MAX SEQ LENGTH
		var max_seq_length = d3.max(selected_nodes, function(d) { return +d.seq_length;} );		
		// Add axis
		//this.addAxis({max_seq_length : max_seq_length});
		// set domain scale
		this.opt.domainScale = d3.scale.linear().domain([0,max_seq_length]).range([0, this.opt.max_seq_representation]);
		this.opt.divScale = d3.scale.linear().domain([0,5]).range([0, this.opt.availablewidth]);
		
	  	// Update the nodes
		var node = target.selectAll("g.node").data(selected_nodes, function(d) { return d.id || (d.id = ++i); });
		
		this.nodeEnter = node.enter().append("svg:g")
									.attr("class", "node")
									//.on("click", function(d) { toggle(d); self.update(d); })
									.on("mouseover", function(d){var test = this;self._highlightSpeciesData(test,d)})
									.on("mouseout", function(d){var test = this;self._deHighlightSpeciesData(test,d)})
									;

		draw_nodes({nodeEnter : this.nodeEnter, node : node, source : root  , tree_representation_type : this.opt.tree_representation_type, availablewidth : this.opt.availablewidth});
	  // Update the links…
	    var link = d3.select(".treearea")
						.selectAll("path.link")
						.data(tree.links(selected_nodes), function(d) { return d.target.id; });
		set_links({link: link, link_type : this.opt.link_type, duration : this.opt.duration});
		// CIRCLE     
		var circles = draw_circles({nodeEnter : this.nodeEnter, circle_size : this.opt.circle_size});

		// IMAGE
		var images = draw_images({nodeEnter : this.nodeEnter , image_path : this.opt.image_path});

		// Text
		var texts = draw_taxon_names({nodeEnter : this.nodeEnter, show_taxa: this.opt.show_taxa,highlight_gene : this.opt.highlight_gene,  model_organisms : this.opt.model_organisms});
		// Bootstrap 
		var texts = draw_bootstraps({nodeEnter : this.nodeEnter, visibility : "hidden"});
		
		// THIS IS FOR DRAWING ALIGNMENT PATTERNS 
		// ALIGNMENT
		/*var rects = draw_alignments({nodeEnter: this.nodeEnter, 
										domainScale : this.opt.domainScale , 
										leaf_group_x : this.opt.leaf_group_x, 
										sequence_start_y : this.opt.sequence_start_y,
										visibility : ""});
		var alignment_patterns = rects.selectAll(".alignment_pattern").data(function(d) { return d.binary_alignment.split(""); })
		var all_alignments =  draw_alignment_patterns({alignment_patterns : alignment_patterns, 
											sequence_start_y : this.opt.sequence_start_y, 
											domainScale: this.opt.domainScale, 
											sequence_rect_width : this.opt.sequence_rect_width,
											leaf_group_x : this.opt.leaf_group_x,
											domain_colors : this.opt.domain_colors,
											max_seq_representation : this.opt.max_seq_representation,
											visibility: "" });
		*/
		// Sequences
		var rects = draw_sequences({nodeEnter: this.nodeEnter, 
										domainScale : this.opt.domainScale , 
										leaf_group_x : this.opt.leaf_group_x, 
										sequence_start_y : this.opt.sequence_start_y,
										visibility : ""});
			
										console.log("after sequence drawn");
		// Domains
		var domains = rects.selectAll(".domain").data(function(d) { return d.domains; })
		var leaves = rects.selectAll(".leaf_label");
		this.opt.domainScale = d3.scale.linear().domain([0,max_seq_length]).range([0, this.opt.max_seq_representation]);
		var all_domains =  draw_domains({domains : domains, sequence_start_y : this.opt.sequence_start_y, 
											domainScale: this.opt.domainScale, sequence_rect_width : this.opt.sequence_rect_width,
											leaf_group_x : this.opt.leaf_group_x,domain_colors : this.opt.domain_colors,visibility: "" });
			
			
		add_tipsy({where : ".leaf_label"});	
		add_tipsy({where : ".domain"});	
		
		//show_projected_annotation({nodes : nodes});
			
	},
	
	/**
	 * Sets controls.
	 * @param {string} seq The sequence strand.
	 * @param {string} [identifier] Sequence identifier.
	 * 
	 * @example 
	 * myTree.setControls();
	 * 
	 */
	setControls: function(){},
	
	/**
	 * Sets domain colors.
	 * @param {string} seq The sequence strand.
	 * @param {string} [identifier] Sequence identifier.
	 * 
	 * @example 
	 * myTree.setDomainColors();
	 * 
	 */
	setDomainColors: function(){
		
		var domain_colors = new Object();
		domain_colors[0] = "domain_gradient";
		domain_colors[1] = "domain_gradient2";
		domain_colors[2] = "domain_gradient3";
		domain_colors[3] = "domain_gradient4";
		domain_colors[4] = "domain_gradient5";
		domain_colors[5] = "domain_gradient6";
		var gradient = this.opt.vis.append("svg:defs").append("svg:linearGradient")
		.attr("id", "line_gradient")
		.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "0").attr("x2", "2").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
		gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#999999");
		gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "40%").attr("stop-color", "#eeeeee");
		gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#cccccc");
		gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#999999");
		
		var gradient2 = this.opt.vis.append("svg:defs").append("svg:linearGradient")
		.attr("id", "domain_gradient")
		.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.12").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
		gradient2.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#FF8585");
		gradient2.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "50%").attr("stop-color", "#7a1e74");
		gradient2.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#7a1e74");
		gradient2.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#ffffff");

		var gradient3 = this.opt.vis.append("svg:defs").append("svg:linearGradient")
		.attr("id", "domain_gradient2")
		.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.12").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
		gradient3.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#0099CC");
		gradient3.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "50%").attr("stop-color", "#7a1e74");
		gradient3.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#7a1e74");
		gradient3.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#ffffff");

		var gradient4 = this.opt.vis.append("svg:defs").append("svg:linearGradient")
		.attr("id", "domain_gradient3")
		.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.12").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
		gradient4.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#CCF2CC");
		gradient4.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "50%").attr("stop-color", "#7a1e74");
		gradient4.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#7a1e74");
		gradient4.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#ffffff");

		var gradient5 = this.opt.vis.append("svg:defs").append("svg:linearGradient")
		.attr("id", "domain_gradient4")
		.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.12").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
		gradient5.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#14101f");
		gradient5.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "50%").attr("stop-color", "#7a1e74");
		gradient5.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#7a1e74");
		gradient5.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#ffffff");

		var gradient6 = this.opt.vis.append("svg:defs").append("svg:linearGradient")
		.attr("id", "domain_gradient5")
		.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.12").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
		gradient6.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#623e32");
		gradient6.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "50%").attr("stop-color", "#7a1e74");
		gradient6.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#7a1e74");
		gradient6.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#ffffff");
		
		this.opt.domain_colors = domain_colors;
	},
	
	
	
	/**
	 * Get maximal seq_length.
	 * @param {string} seq The sequence strand.
	 * @param {string} [identifier] Sequence identifier.
	 * 
	 * @example 
	 * myTree.getMaxSeqLength();
	 * 
	 */
	getMaxSeqLength: function(args){
		var self = this;
		var leaves = args.leaves;
		var max_seq_length;
		console.log("looking at "+leaves.length+" leaves");
		for (var i = 0; i < leaves.length; i++) {
			console.log("first leaf is: ");
			console.log(leaves[i]);
			console.log(leaves[i].seq_length);
			var temp_x, temp_y;
			var temp_seq_length = leaves[i].seq_length;
	
			if ( temp_seq_length >= max_seq_length ) { max_seq_length = temp_seq_length; }
	
		}
		return max_seq_length;
	},
	
	/**
	 * Sets model organism.
	 * @param {string} seq The sequence strand.
	 * @param {string} [identifier] Sequence identifier.
	 * 
	 * @example 
	 * myTree.setModelOrganisms();
	 * 
	 */
	setModelOrganisms: function (){
		
		var model_organisms = new Object(); // or just {}
			model_organisms['Homo_sapiens'] = "red";
			model_organisms['Pan_troglodytes'] = "red";
			
			model_organisms['Mus_musculus'] = "blue";
			model_organisms['Xenopus_tropicalis'] = "blue";
			model_organisms['Gallus_gallus'] = "blue";
			model_organisms['Drosophila_melanogaster'] = "blue";
			model_organisms['Arabidopsis_thaliana'] = "blue";
			model_organisms['Caenorhabditis_elegans'] = "blue";
		
		this.opt.model_organisms = model_organisms;
	},



	/**
	 * Prunes a tree given a selected subset of species
	 * @param {string} a list of nodes of the tree.
	 * 
	 * @example 
	 * myTree.pruneTree();
	 * 
	 */
	pruneTree: function (selected_nodes) {
		var self = this;
		var children2hide = new Object();
		var nodes2delete = new Array();
		for (var i = selected_nodes.length; i >= 0; i--) {
			if(!selected_nodes[i]){
				console.log("could not look at node "+i);
				continue;
			}
			var node = selected_nodes[i];
			var name = selected_nodes[i].name;
			var parent = node.parent;
			var taxon = selected_nodes[i].taxon;
			
			console.log("Looking at node: "+name+" taxon: "+taxon);
			//continue;
		// Leaf	
			if(!node.children){
				console.log("is a leaf");
			}
			// can implement inner node deletions here
			//if(!self.opt.innerNodes[taxon] && node.children){
			if(!self.opt.model_organisms[taxon] && !node.children){
					//console.log("should be deleted");
					// tell parent
					var parent = node.parent;
					if (typeof parent.children2hide == 'undefined' || parent.children2hide.length == 0) {
						//console.log("creating empty children2hash in parent: "+parent.name);
						parent.children2hide = {};
					}
					parent.children2hide[name] = 1;
					//console.log("adding node "+name+" to be deleted in parent: "+parent.name);
					selected_nodes.splice(i, 1);
					//nodes2delete.push(node);
			}
				else{	
					//console.log("keep it");
				}
				//}
			//else{
		// Inner Node		
				console.log("is a innerNode");
				//console.log("list of children2hide");
				//console.log(node.children2hide);
				//console.log("list of children2add");
				//console.log(node.children2add);
				console.log(node.children2hide);	
				console.log(node.children2add);
				if(node.children2hide){
					// since we are changing a node's children, let's make a backup.
					node._children = node.children;
					var size = 0, key;
					    for (key in node.children2hide) {
					        if (node.children2hide.hasOwnProperty(key)) size++;
					    }
					//console.log("has "+node.children.length+" children and to hide: "+size);
					if(size == node.children.length && typeof node.parent != 'undefined'){
						console.log("hide all children");
						// hide children (d3 will look for .children by default)
						node.children = null;
						// tell the parent about this
						if (typeof parent.children2hide == 'undefined' || parent.children2hide.length == 0) {
							//console.log("creating empty children2hash in parent: "+parent.name);
							parent.children2hide = {};
						}
						console.log("splice current node from selected nodes");
						parent.children2hide[name] = 1;
						//selected_nodes.splice(i, 1);
						//nodes2delete.push(node);
						
						// tell parent
						//console.log("now we have: 0 nodes");
					}
					else{
						//hide only a few nodes
						//console.log("looping over "+node.children.length+" children");
						//console.log(node.children);
						
						var copy_of_children = node.children.slice(0);
						for (var j = 0 ; j < node.children.length; j++) {
							var curr_child = node.children[j];
					      	var child_name = node.children[j].name;
							console.log("looking at child: "+child_name);
						  if(node.children2hide[child_name]){
							  console.log("slicing it no: "+j+" out!")
							  copy_of_children.splice(j, 1);
						  }
						  //else{
							  //}
					  }
					  // now copy back to children
					  node.children = copy_of_children.slice(0);
					  // do we need to copy a child child here?
					  // in case we deleted a child node and there is only one left (A)
					  // -> mark current node as to be deleted from parent.children
					  // but give him a copy of the current child node A
					}
				}

				if(node.children2add){

					var size_children2add = 0
				    for (key in node.children2add) {
				        if (node.children2add.hasOwnProperty(key)) size_children2add++;
				    }
					//for(var k=0; k < node.children2add.length; k++){
						
					//if (typeof node.children == 'undefined' || node.children.length == 0) {
					//	console.log("setting children to 0");
					//	node.children = [];
					//}	
					node.children = ( typeof node.children != 'undefined' && node.children instanceof Array ) ? node.children : [];
					
					for (key in node.children2add) {
						//console.log("will add node "+key)
						node.children.push(node.children2add[key]);
					}
					//console.log("has "+node.children.length+" children and to add: "+size_children2add);
					//console.log("afterwards has "+node.children.length+" children");
				}

				if(typeof node.children != 'undefined' && node.children instanceof Array){
					console.log("now we have: "+node.children.length+" nodes");
					if(node.children.length == 1 && typeof node.parent != 'undefined'){
						if (typeof parent.children2add == 'undefined' || parent.children2add.length == 0) {
							//console.log("adding empty children2add array");
							parent.children2add = {};
						}
						//console.log("well, let's keep node "+node.children[0].name+" in the parent");
						parent.children2add[node.children[0].name] = node.children[0];
						//console.log("ok, we tell the parent "+parent.name+" to add child "+curr_child.name);
						//console.log(parent.children2add);
					
						console.log("wow, just one child. tell my parent to hide/ignore this inner node!");
						if (typeof parent.children2hide == 'undefined' || parent.children2hide.length == 0) {
							//console.log("creating empty children2hash in parent: "+parent.name);
							parent.children2hide = {};
						}
						parent.children2hide[name] = 1;
						console.log("splice current node from selected nodes");
						selected_nodes.splice(i, 1);
						//nodes2delete.push(node);
					}
			  }
			  //if(typeof node.children == 'undefined' && node.children instanceof Array){
				  //}
		}

		console.log("done with the nodes");
		
		//console.log("have to delete "+nodes2delete.length+" nodes");
		//for (var i = 0; i < nodes2delete.length; ++i) {
		//       var obj = nodes2delete[i];
		//	   console.log("delete: "+obj.name);
		//}
		//sdsdad

		// get a list of leaf
		
		//var selected_nodes = selected_nodes
		/*			console.log("showing model tree only");
						var filtered_nodes = copy_of_nodes.filter(function(d){ 

							var current_node = d;
							var taxon = d.taxon;

							// is leaf node
							if(!d.children){
								if(!self.opt.model_organisms[taxon]){
									var parent = d.parent;
									if(parent.children){
									    var i = 0;
									    while(i < parent.children.length) {
									      var data = parent.children[i].taxon;
					  						if(!self.opt.model_organisms[data]){
												var child = parent.children.splice(i,1);
									  		}
											else{i++;}
									  	}
									  	console.log("parent now has: "+parent.children+" childen");
									  	if(!parent.children){
										  var parent_of_parent
									  	}
									}
								}
								else{
									return d;
								} 
							}
							else{ 
								return d;
							}
						});  */
				
						function prune(array, label) {
						    for (var i = 0; i < array.length; ++i) {
						        var obj = array[i];
								var taxon = obj.taxon;
								console.log("looking at taxon: "+taxon);
						        if (taxon === label) {
								//if(!self.opt.model_organisms[taxon]){
						            // splice out 1 element starting at position i
						            array.splice(i, 1);
						            //return true;
									//continue;
									console.log("found label: "+taxon);
						        }
						        if (typeof obj.children !== 'undefined' && obj.children.length > 0) {
									var no_children = obj.children.length;
									obj.node_type = "innerNode";
									console.log("internal node with "+no_children+" children");
									console.log("node_type is "+obj.node_type);
						            if (prune(obj.children, label)) {
						                if (obj.children.length === 0) {
						                    // delete children property when empty
						                    //delete obj.children;
											obj._children = obj.children;
											obj.children = null;
											
						                }
						                return true;
						            }
						        }
								else{ 
									if(obj.node_type == "innerNode"){
										console.log("is an innerNode, but is empty. splicing i:"+i);
							            array.splice(i, 1);
									}
									console.log("must be a leaf");
								}
						
						    }
						} 
						//var wasItPruned = prune(selected_nodes, "Pan_troglodytes");
						//var wasItPruned = prune(selected_nodes, "Homo_sapiens");
						//var wasItPruned = prune(selected_nodes, "Homininae");
						//var wasItPruned = prune(copy_of_nodes, "Pan_troglodytes");
						//var wasItPruned = prune(copy_of_nodes, "Pongo_abelii");
						//var wasItPruned = prune(copy_of_nodes, "Gorilla_gorilla");
						//var wasItPruned = prune(copy_of_nodes, "Tarsius_syrichta");
						//var wasItPruned = prune(copy_of_nodes, "Tupaia_belangeri");
						//var wasItPruned = prune(copy_of_nodes, "Microcebus_murinus");
						//var wasItPruned = prune(copy_of_nodes, "Otolemur_garnettii");
						//var wasItPruned = prune(copy_of_nodes, "Callithrix_jacchus");
						//var wasItPruned = prune(copy_of_nodes, "Macaca_mulatta"); 

	},
	_prune: function(array, label) {
		var self = this;
		for (var i = 0; i < array.length; ++i) {
		        var obj = array[i];
		        if (obj.label === label) {
		            // splice out 1 element starting at position i
		            array.splice(i, 1);
		            return true;
		        }
		        if (obj.children) {
		            if (self._prune(obj.children, label)) {
		                if (obj.children.length === 0) {
		                    // delete children property when empty
		                    delete obj.children;

		                    // or, to delete this parent altogether
		                    // as a result of it having no more children
		                    // do this instead
		                    array.splice(i, 1);
		                }
		                return true;
		            }
		        }
		    }
	},
	
	

	_buildDivs: function () {
		var self = this;
		
		//this._headerDiv = jQuery('<div></div>').appendTo(this._contentcontainer);
		
		jQuery(
			//'<table>'+
			//'<tr>'+
			//	'<td align="left" style="vertical-align: middle;">'+
			//		'<img class="dotted_line" style="width: 24px; height: 24px;" src="http://www.evolgenius.info/images/icons/24_new/rect_clado_normal.svg.png" title="view tree as rectanglar cladogram">'+
			//	'</td>'+
				
				//'<td align="left" style="vertical-align: middle;">'+
				' internal nodes: '+
					'<a href="#" onclick="show_internal_text();return false">'+
					'<img class="added_button" style="width: 24px; height: 24px;" src="http://dev.treefam.org/static/images/tree_controls/branchlength_onoff_active.svg.png" title="show/ hide internal-node labels">'+
					'</a>'+
				//'</td>'+
				//'<td align="left" style="vertical-align: middle;">'+
					'<a href="#" onclick="hide_internal_text();return false">'+
					'<img class="gwt-Image added_button" style="width: 24px; height: 24px;" src="http://dev.treefam.org/static/images/tree_controls/branchlength_onoff_disabled.svg.png" title="show/ hide leaf-node labels">'+
					'</a>'+
				//'</td>'+
				//'<td align="left" style="vertical-align: middle;">'+
					'<a href="#" onclick="show_bootstrap();return false">'+
					'<img class="hide_domains added_button" style="width: 24px; height: 24px;" src="http://dev.treefam.org/static/images/tree_controls/bootstrap_onoff_active.svg.png" title="show bootstrap values">'+
					'</a>'+
				//'</td>'+

				//'<td align="left" style="vertical-align: middle;">'+
					'<a href="#" onclick="hide_bootstrap();return false">'+
					'<img class="hide_domains added_button" style="width: 24px; height: 24px;" src="http://dev.treefam.org/static/images/tree_controls/bootstrap_onoff_disabled.svg.png" title="hide bootstrap values">'+
					'</a>'+
				//'</td>'+
				
			//	'<td align="left" style="vertical-align: middle;">'+
			//	'<img class="increase_font" style="width: 24px; height: 24px;" src="http://www.evolgenius.info/images/icons/24_new/fontSizeIncrease_normal.svg.png" title="increase leaf label font size">'+
			//	'</td>'+
			//	'<td align="left" style="vertical-align: middle;">'+
			//		'<img class="decrease_font" style="width: 24px; height: 24px;" src="http://www.evolgenius.info/images/icons/24_new/fontSizeDecrease_normal.svg.png" title="decrease leaf label font size">'+
			//		'</td>'+
					
				//	'<td align="left" style="vertical-align: middle;">'+
				//		'<a href="#" onclick="show_images();return false">'+
				//		'<img class="show_domains dotted_line" style="width: 20px; height: 20px;" //src="http://dev.treefam.org/static/images/tree_controls/dataset_colorstripOL_active.svg.png" title="show images">'+
//						'</a>'+
//					'</td>'+
//					'<td align="left" style="vertical-align: middle;">'+
//						'<a href="#" onclick="hide_images();return false">'+
//						'<img class="hide_domains" style="width: 24px; height: 24px;" src="http://dev.treefam.org/static/images/tree_controls/dataset_colorstripOL_disabled.svg.png" title="hide images">'+
//						'</a>'+
//					'</td>'+
					

					//'<td align="left" style="vertical-align: middle;">'+
					//	'<a href="#" onclick="show_leaf_swissprot();return false">'+
					//	'<img class="hide_domains" style="width: 24px; height: 24px;" src="http://www.evolgenius.info/images/icons/24_new/dataset_labelcolor_disabled.svg.png" title="show swissprot leaves">'+
					//	'</a>'+
					//'</td>'+
					//'<td align="left" style="vertical-align: middle;">'+
					'leaves: '+
						'<a href="#" onclick="show_leaf_common_name();return false">'+
						'<img class="hide_domains dotted_line added_button" style="height: 25px;" src="http://dev.treefam.org/static/images/tree_controls/leaflabel_align_disabled.svg.png" title="show common names">'+
						'</a>'+
					//'</td>'+
					
					//'<td align="left" style="vertical-align: middle;">'+
					//	'<a href="#" onclick="show_leaf_ids();return false">'+
					//	'<img class="hide_domains" style="width: 24px; height: 24px;" src="http://www.evolgenius.info/images/icons/24_new/dataset_labelcolor_disabled.svg.png" title="show ids names">'+
					//	'</a>'+
					//'</td>'+
					//'<td align="left" style="vertical-align: middle;">'+
						'<a href="#" onclick="show_leaf_taxa();return false">'+
						'<img class="hide_domains added_button" style="width: 24px; height: 24px;" src="http://dev.treefam.org/static/images/tree_controls/leaflabel_align_disabled.svg.png" title="show taxa names">'+
						'</a>'+
					//'</td>'+
					//'<td align="left" style="vertical-align: middle;">'+
						'<a href="#" onclick="show_leaf_uniprot();return false">'+
						'<img class="hide_domains added_button" style="height: 40px;" src="http://dev.treefam.org/static/images/uniprot_logo.jpeg" title="show Uniprot links">'+
						'</a>'
					//'</td>'+
				//	'<td align="left" style="vertical-align: middle;">'+
				//		'<a href="#" onclick="show_domains();return false">'+
				//		'<img class="show_domains dotted_line" style="width: 24px; height: 24px;" src="http://dev.treefam.org/static/images/tree_controls/dataset_protein_domains_active.svg.png" title="show protein domains">'+
				//		'</a>'+
				//	'</td>'+
				//	'<td align="left" style="vertical-align: middle;">'+
				//		'<a href="#" onclick="hide_domains();return false">'+
				//		'<img class="hide_domains"  style="width: 24px; height: 24px;" src="http://dev.treefam.org/static/images/tree_controls/dataset_protein_domains_disabled.svg.png" title="hide protein domains">'+
				//		'</a>'+
				//	'</td>'+






					
				//'</tr>'+
		//	'</table>'
		).appendTo('#tv_controls');
		//jQuery('<p>Lappen</p>').appendTo('#tv_controls');
		console.log("finished building div");
		//jQuery('<div  class="tree_container" id="tree"></div>').appentTo(jQuery("#tv_controls"));


		// font size
		jQuery('img.increase_font').click(function() {
			self.opt.fontSize = parseInt(self.opt.fontSize) + 1 + "px";
			d3.select("svg").selectAll(".text").attr("font-size", function(d){ return self.opt.fontSize; });
		});

		jQuery('img.decrease_font').click(function() {
			self.opt.fontSize = parseInt(self.opt.fontSize) - 1 + "px";
			d3.select("svg").selectAll(".text").attr("font-size", function(d){ return self.opt.fontSize; });
		});
		

		
	},
	/**
	 * Shows the columns indicated by the indexes array.
	 * @param {string} seq The sequence strand.
	 * @param {string} [identifier] Sequence identifier.
	 * 
	 * @example 
	 * myTree.setModelOrganisms();
	 * 
	 */
	setTaxaToShow: function (){
		
		var show_taxa = new Object();
		show_taxa['Metazoa'] = 1;
		show_taxa['Bilateria'] = 1;
		show_taxa['Mammalia'] = 1;
		show_taxa['Dipteria'] = 1;
		show_taxa['Primates'] = 1;
		show_taxa['Arabidopsis_thaliana'] = 1;
		
		
		this.opt.show_taxa = show_taxa;
	},
	/**
	 * Shows the columns indicated by the indexes array.
	 * @param {string} seq The sequence strand.
	 * @param {string} [identifier] Sequence identifier.
	 * 
	 * @example 
	 * myTree.setSequence();
	 * 
	 */
	drawProteinDomains: function (){
		console.log("drawing protein domains");
		// Sequences
		var rects = draw_sequences({nodeEnter: this.nodeEnter, 
										domainScale : this.opt.domainScale , 
										leaf_group_x : this.opt.leaf_group_x, 
										sequence_start_y : this.opt.sequence_start_y,
										visibility : ""});
		// Domains
		var domains = rects.selectAll(".domain").data(function(d) { return d.domains; })
		var all_domains =  draw_domains({domains : domains, 
											sequence_start_y : this.opt.sequence_start_y, 
											domainScale: this.opt.domainScale, 
											sequence_rect_width : this.opt.sequence_rect_width,
											leaf_group_x : this.opt.leaf_group_x,
											domain_colors : this.opt.domain_colors,
											visibility: "" });
		
	},
},
{
	EVT_ON_SELECTION_CHANGE: "onSelectionChange",
	EVT_ON_SELECTION_CHANGED: "onSelectionChanged",
	EVT_ON_ANNOTATION_CLICKED: "onAnnotationClicked"

});


