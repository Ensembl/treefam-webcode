/** 
 * HMMResults component 
 * 
 * @class
 * @extends Biojs
 * 
 * @author <a href="mailto:fs@ebi.ac.uk">Fabian Schreiber</a>
 * @version 1.0.0
 * @category 3
 * 
 * @requires <a href='http://blog.jquery.com/2011/09/12/jquery-1-6-4-released/'>D3 v3</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="../biojs/dependencies/d3/d3.v3.min.js"></script>

 * @requires <a href='http://blog.jquery.com/2011/09/12/jquery-1-6-4-released/'>jQuery Core 1.7.2</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="../biojs/dependencies/jquery/jquery-1.7.2.min.js"></script>
 * 
 * @requires <a href='http://jqueryui.com/download'>jQuery UI 1.8.16</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="../biojs/dependencies/jquery/jquery-ui-1.8.2.custom.min.js"></script>
 * 
 * @requires <a href='http://blog.jquery.com/2011/09/12/jquery-1-6-4-released/'>jQuery Tipsy</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="../biojs/dependencies/extern/jquery.tipsy.js"></script>
 * 
 * @requires <a href='http://blog.jquery.com/2011/09/12/jquery-1-6-4-released/'>Biojs.js</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="../biojs/Biojs.js"></script>
 * 
 * @requires <a href='http://blog.jquery.com/2011/09/12/jquery-1-6-4-released/'>Biojs.HMMerResults</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="../biojs/Biojs.HMMerResults.js"></script>
 * 

 * @requires <a href='http://blog.jquery.com/2011/09/12/jquery-1-6-4-released/'>Tipsy css</a>
 * @dependency <script language="stylesheet" type="text/css" src="../biojs/css/tipsy.css"></script>
	  
	<!-- ><link href="../../main/resources/css/Biojs.HMMerResults.css" rel="stylesheet" type="text/css" />	  -->
	<!-- <link href="../../main/resources/css/tipsy.css" rel="stylesheet" type="text/css" /> -->

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
 *			var pfam_hmm_output = "../../main/resources/dependencies/data/hmmer_output/los";
 *			//var pfam_hmm_output = "http://dev.treefam.org/static/test/pfam_hmmer.json";
 *			//var treefam_hmm_output = "../../main/resources/dependencies/data/hmmer_output/treefam_hmmer.json";
 *			var treefam_hmm_output = "../../main/resources/dependencies/data/hmmer_output/treefam.los";
 *			//var treefam_hmm_output = "http://dev.treefam.org/static/test/treefam_hmmer.json";
 *			//var no_genes = 48 * 2;
 *			//var alignment_length = 54 * 2;
 *			var image_path = "http://www.ebi.ac.uk/~fs/d3treeviewer/data/images/species_files/";
 *			var highlight_gene = "";
 *			var newick_tree = "";
 *			var load_from_variable;
 *
 *			myTreeFamResults = new Biojs.HMMerResults({
 *			        target : "TreeFamBlock",
 *					formatOptions : {
 *			 			title:false,
 *						footer:false,
 *						tree:'json',
 *			  		},
 *					// tree parameters
 *					database : "treefam", 
 *					width: 1200,
 *					height: 1000,
 *					//query_seq_length: 4343,
 *					hmm_output: treefam_hmm_output,
 *					max_hits: 4,
 *					load_from_variable : 0, 
 *					//hmmer_output_json : hmmer_output_json
 *			});
 *
 * 
 */

Biojs.HMMerResults = Biojs.extend(
/** @lends Biojs.HMMerResults# */
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
	 * @name Biojs.HMMerResultsSequence-opt
	 */
	opt : {
		
		// new opts for tree
		database : "",
		vis : "",
		load_from_variable : undefined,
		//domainScale : d3.scale.linear().domain([20,4000]).range([1, 250]),
		query_seq_length: "",
		width: 1000,
		height: 400,
		seq_length_visible: 800,
		hmm_output: "",
		domain_width: 20,
		hmm_output_format: "json",
		max_hits: 100,
		data_from_hmmer: ""
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
		
		// set correct height
		//this.opt.height = this.opt.no_genes * 10,
		// set diagonal
		//this.opt.diagonal = d3.svg.diagonal.radial().projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });
		//this.opt.diagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });
		// set domain scale
		//this.opt.domainScale = d3.scale.linear().domain([20,this.opt.query_seq_length]).range([1, 250]);
		// set tree drawing
		//this.opt.tree = d3.layout.cluster()
		//						 .separation(function(a, b) { return a.parent === b.parent ? 4 : 4; })
		//						 .size([this.opt.height, this.opt.width -this.opt.leaf_space]);
		
 		//this.opt.tree = d3.layout.tree()
		//					.size([this.opt.height, this.opt.width -this.opt.leaf_space]);

		
		// set visual area to this.opt.vis
		//this.opt.vis = 
		

		// set domain colors

		//console.log(this.opt.vis);
		//this.opt.vis.attr("transform", "translate(40,40)").append('svg:g');
		// add zoom
		//this.addZoom();
		
		// DIV for the format selector
		console.log("read data");
		//this._buildDivs();
		
		var self = this;
		var data_from_hmmer;
		console.log("variable is "+self.opt.load_from_variable);
		if(self.opt.load_from_variable){
			console.log("parsing variable");
			//console.log(self.opt.hmmer_output_json)
			//self.opt.data_from_hmmer = JSON.parse(self.opt.hmmer_output_json);
			self.opt.data_from_hmmer = self.opt.hmmer_output_json;
			
			// get seq length
			var seq_length = d3.max(self.opt.data_from_hmmer, function(d) { return +d.seq_length;} );	
			self.opt.query_seq_length = seq_length;	
			
			
			if(self.opt.database == "treefam"){
				console.log("treefam database selected");
				console.log("need to know how many hits we have");
					self._set_hits_div();
					//var hits_div = d3.select("#"+self.opt.target).append('div').attr('class','prot_entries');
					// var hits_ol = hits_div.append('ol').attr('class','entries');
					var hits_counter = 0;
					var max_seq_length = d3.max(self.opt.data_from_hmmer, function(d) { return +d.seq_length;} );		

					console.log(self.opt.data_from_hmmer);
					console.log("max length is :"+max_seq_length);
					jQuery.each( self.opt.data_from_hmmer, function( key, value ) {
						self._set_hit_line({value:value});
						var seq = self.drawSequence({div: self.opt.hits_svg, db_name: "", max_seq_length : 400});
						var fake_json = [];
						fake_json.push(value);
						self.drawProteinDomains({seq : seq, hmmer_data : fake_json, 
												domain_colors : self.opt.domain_colors,
												seq_length_visible: self.opt.seq_length_visible, 
												seq_length: seq_length, 
											    domain_width : self.opt.domain_width});
			
						console.log("current counter is "+hits_counter+" / "+self.opt.max_hits);
												hits_counter = hits_counter + 1;
							if( hits_counter >= self.opt.max_hits){
								return false;
							}					
					})
			}
			else if(self.opt.database == "pfam"){
				self._setVisualSpace({'width':self.opt.width,'height':self.opt.height});
				self.setDomainColors();
				console.log(self.opt.data_from_hmmer);
				console.log("pfam selected");
				  	console.log(self.opt.data_from_hmmer);
					var seq = self.drawSequence({div: self.opt.vis, db_name: "Pfam", max_seq_length : 400});
					console.log("draw domains");
					self.drawProteinDomains({seq : seq, hmmer_data : self.opt.data_from_hmmer, 
											domain_colors : self.opt.domain_colors,
											seq_length_visible: self.opt.seq_length_visible, 
											seq_length: seq_length, 
										domain_width : self.opt.domain_width});
					self.add_tipsy();
			}
			else{
				console.log("no database selected");
			}
		}
		else{
			console.log("trying to read from "+self.opt.hmm_output);
			d3.json(self.opt.hmm_output, function(error, json) {
              	if (error) return console.warn(error);
				console.log("parsing file "+self.opt.hmm_output);
				self.opt.data_from_hmmer = json;		
				data_from_hmmer = json;		

				// get seq length
				var seq_length = d3.max(self.opt.data_from_hmmer, function(d) { return +d.seq_length;} );	
				self.opt.query_seq_length = seq_length;	
				//console.log("max length is :"+max_seq_length);
				//self.opt.query_seq_length = max_seq_length;
				//var domainScale = d3.scale.linear().domain([20,self.opt.max_seq_length]).range([1, 800]);
				//console.log(self.opt.data_from_hmmer);
					if(self.opt.database == "treefam"){
						console.log("treefam database selected");
							self._set_hits_div();
							//var hits_div = d3.select("#"+self.opt.target).append('div').attr('class','prot_entries');
							// var hits_ol = hits_div.append('ol').attr('class','entries');
							var hits_counter = 0;
							console.log(self.opt.data_from_hmmer);
							jQuery.each( self.opt.data_from_hmmer, function( key, value ) {
								self._set_hit_line({value:value});
								var seq = self.drawSequence({div: self.opt.hits_svg, db_name: "", max_seq_length : 400});
								var fake_json = [];
								fake_json.push(value);
								self.drawProteinDomains({seq : seq, hmmer_data : fake_json, 
														domain_colors : self.opt.domain_colors,
														seq_length_visible: self.opt.seq_length_visible, 
														seq_length: seq_length, 
													    domain_width : self.opt.domain_width});
					
								console.log("current counter is "+hits_counter+" / "+self.opt.max_hits);
														hits_counter = hits_counter + 1;
									if( hits_counter >= self.opt.max_hits){
										return false;
									}					
							})
					}
					else if(self.opt.database == "pfam"){
						
						self._setVisualSpace({'width':self.opt.width,'height':self.opt.height});
						self.setDomainColors();
						console.log(self.opt.data_from_hmmer);
						console.log("pfam selected");
						  	console.log(self.opt.data_from_hmmer);
							var seq = self.drawSequence({div: self.opt.vis, db_name: "Pfam", max_seq_length : 400});
							console.log("draw domains");
							self.drawProteinDomains({seq : seq, hmmer_data : self.opt.data_from_hmmer, 
													domain_colors : self.opt.domain_colors,
													seq_length_visible: self.opt.seq_length_visible, 
													seq_length: seq_length, 
												domain_width : self.opt.domain_width});
							self.add_tipsy();
					}
					else{
						console.log("no database selected");
					}
				})
	    }
		
		// Read tree data
		//this.readTree({'load_from_variable': this.opt.load_from_variable,
		//								'tree_format' : this.opt.formatOptions.tree,
		//								'tree_data': this.opt.json_tree});
		//console.log(this.tree_data);
		//console.log("h is now: "+this.opt.height);
		//if(this.opt.show_controls !== undefined){
			//console.log("show controls");
			//this.setControls();
			//}
		// set model organisms
		//this.setModelOrganisms();
		// set taxa to show
		//this.setTaxaToShow();

		//console.log("tree data at end is");
		
		//console.log(this.tree_data);
		//this.update();
		
		//this.drawProteinDomains();
		// add text
		
		// add images
		//console.log(this.nodeEnter);
		
		//draw_images({nodeEnter : this.nodeEnter , image_path : this.opt.image_path});
		
		//var domains = rects.selectAll(".domain").data(function(d) { return d.domains; })
		//var all_domains =  draw_domains({domains : domains, 
		//									sequence_start_y : this.opt.sequence_start_y, 
		//									domainScale: this.opt.domainScale, 
		//									sequence_rect_width : this.opt.sequence_rect_width,
		//									leaf_group_x : this.opt.leaf_group_x,
		//									domain_colors : this.opt.domain_colors,
		//									visibility: "" });
		
		//console.log("set model organisms");
		//console.log(this.model_organisms);
		// done --> now redraw||update
		//this.update({'root' : this.tree_data});
		
		if ( this.opt.width !== undefined ) {
			//console.log("container width needs to be set?");
			this._container.width( this.opt.width );
		}
		
		if ( this.opt.height !== undefined ) {
			this._container.height( this.opt.height );
		}
		
		
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
		//var self = this;
		this.opt.vis = d3.select("#"+this.opt.target).append("svg:svg")
								.attr("width", width) 
								.attr("height", height);
								//.attr("pointer-events", "all")
								//.append('svg:g');
	},
	
	
	
	_set_hits_div: function ( args ) {
		var hits_div = d3.select("#"+this.opt.target).append('div').attr('class','prot_entries');
		this.opt.hits_ol = hits_div.append('ol').attr('class','entries');
		
		//return hits_ol;
	},
	_set_hit_line: function ( args ) {
		var value = args.value
		var hits_li = this.opt.hits_ol.append('li').attr('class','entry Family-row');
		
	// top div
		var top_div = hits_li.append('div').attr('class', 'top-row');
		var top_left_div = top_div.append('div').attr('class', 'top-left');
	// TF FAMILY
		top_left_div.append("a").attr("xlink:href", function(d) {return "http://pfam.sanger.ac.uk//family/"+value.name}).text(value.name);
		var top_right_div = top_div.append('div').attr('class', 'top-right');

	// DESCRIPTION
		top_right_div.text(function(d){ 
			console.log(value.desc);
			if(value.desc){return value.desc+" evalue: "+value.evalue+"; bit-score: "+value.bits}
			else{ return "No description ; evalue: "+value.evalue+"; bit-score: "+value.bits}
		});
		
	// bottom div
		var bottom_div = hits_li.append('div').attr('class', 'bottom-row');
		var hits_svg_ol = bottom_div.append('ol').attr('class', 'signatures');
		
		var hits_svg_li = hits_svg_ol.append('li').attr('class','signature entry-signatures');
	
	// svg div
	this.opt.hits_svg = hits_svg_li.append('svg').attr("width", 1000).attr("height", 40);
		
		
		//return hits_ol;
	},
	
	
	
	addZoom: function(args){
		console.log("add zoom");
		this.opt.vis.call(d3.behavior.zoom().on("zoom", this.redraw({vis : this.opt.vis})))
							.append('svg:g');	
		
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
	readHMMOutput: function(args){
		var self = this;
		var load_from_variable = args.load_from_variable;
		var hmm_output_format = args.hmm_output_format;
		var hmm_output = args.hmm_output;
		var json_hmmer_data;
		
		if(load_from_variable){
				console.log("load from variable selected");
				json_hmmer_data = JSON.parse( hmm_output );
				self.update({'root' : json_hmmer_data}); 
		}
		else if(hmm_output_format == "json" ){
			//console.log("json selected");
		 	d3.json(hmm_output, function(data) {
				  //gTree.update(root = json);
				  console.log("setting json data from "+hmm_output+" ");
				  json_hmmer_data = data;
				  //console.log(json_hmmer_data);
  				  //
				  self.drawSequences({json_hmmer_data:json_hmmer_data}); 
				  

			});
			//console.log("well, we are outside the json read routine");
			//console.log(json_tree_data);
			//return json_tree_data;
		}
		else{
			console.log("newick selected");
			d3.text(hmm_output, function(text) {
		  	var x = newick.parse(text);
			var cluster = d3.layout.cluster()
								    .size([360, 1])
								    .sort(null)
								    .value(function(d) { return d.length; })
								    .children(function(d) { return d.branchset; })
								    .separation(function(a, b) { return 1; });
		  	var json_hmmer_data = cluster(x);
		  	console.log(x);
			self.update({'root' : json_hmmer_data}); 
			//gTree.update(root = nodes);
			});
		}
		//console.log(json_hmmer_data);
		return json_hmmer_data;
		
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
	
	
	update: function(source){
		var self = this;
		var root = this.opt.root;
		var target = this.opt.target;
		var i = 0;
		console.log("updating now with root: "+root);
	  	// Compute the new tree layout.
		//this.nodes  = this.set_nodes({'root': root});
		var tree = this.opt.tree;
		//console.log(tree);
		var nodes = tree.nodes(root);
	  	console.log("tree has "+nodes.length+" nodes");
	  	// Update the nodes
		var node = d3.select("#"+target+" svg").selectAll("g.node").data(nodes, function(d) { return d.id || (d.id = ++i); });
		
		this.nodeEnter = node.enter().append("svg:g")
									.attr("class", "node")
									.attr("transform", function(d) { 
										//return "translate(" + source.y0 + "," + source.x0 + ")"; 
									})
									.on("click", function(d) { toggle(d); self.update(d); });;

									console.log(this.nodeEnter);
		// code to draw axis 
		var annotation_scale = d3.scale.linear().domain([0, 4000]).range([0, 400]);
		var xAnnotation_axis = d3.svg.axis()
								    .scale(annotation_scale)
									//.tickValues([0, 4, 7, 1000, 2000, 3000, 4000])
									.orient("bottom");				

		//d3.select("#"+this.opt.target+" svg").append("g")
		//      .attr("class", "x axis")
		//	  .attr("transform", "translate(400,15)")
		//      .call(xAnnotation_axis);
		  
  		//d3.select("#"+this.opt.target+" svg").append("text")      
		// text label for the x axis
  		//	        .attr("x", 600 )
  		//	        .attr("y",  8 )
  		//	        .style("text-anchor", "middle")
  		//	        .text("Sequence length");
		draw_nodes({nodeEnter : this.nodeEnter, node : node, source : root  , tree_representation_type : this.opt.tree_representation_type});
	  // Update the links…
	    var link = d3.select("#"+this.opt.target+" svg")
				.selectAll("path.link")
				.data(tree.links(nodes), function(d) { return d.target.id; });
		set_links({link: link, link_type : this.opt.link_type, duration : this.opt.duration});
		// CIRCLE     
		var circles = draw_circles({nodeEnter : this.nodeEnter, circle_size : this.opt.circle_size});
		// Text
		var texts = draw_taxon_names({nodeEnter : this.nodeEnter, show_taxa: this.opt.show_taxa,highlight_gene : this.opt.highlight_gene,  model_organisms : this.opt.model_organisms});
	
		// IMAGE
			draw_images({nodeEnter : this.nodeEnter , image_path : this.opt.image_path});
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
		domain_colors[3] = "domain_gradient5";
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
	 * Sets model organism.
	 * @param {string} seq The sequence strand.
	 * @param {string} [identifier] Sequence identifier.
	 * 
	 * @example 
	 * myTree.setModelOrganisms();
	 * 
	 */
	drawSequence: function (args){
		
		var draw_div = args.div;
		var db_name = args.db_name;
		var query_seq_length = args.max_seq_length;
		var domainScale = d3.scale.linear().domain([0,query_seq_length]).range([0,this.opt.seq_length_visible]);
		
		console.log("drawing sequence here");
		var gradient = draw_div.append("svg:defs").append("svg:linearGradient")
		.attr("id", "line_gradient")
		.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "0").attr("x2", "2").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
		gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#999999");
		gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "40%").attr("stop-color", "#eeeeee");
		gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#cccccc");
		gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#999999");


		if(this.opt.database == "pfam"){
		// write "Pfam" to the front
			draw_div.append("text")
		        .attr("dx", function(d){return 20})
				.attr("dy", function(d){return 38})        
				.text(db_name);

			// write seq length in the end
	        draw_div.append("text")
	        .attr("dx", function(d){return query_seq_length + 80})
			.attr("dy", function(d){return 38})        
	        .text(query_seq_length);
		}
		else{
			//draw_div.append("text")
	        //.attr("dx", function(d){return 20})
			//.attr("dy", function(d){return 38})        
			//.text(db_name);

			// write seq length in the end
	        draw_div.append("text")
	        .attr("dx", function(d){return query_seq_length + 100})
			.attr("dy", function(d){return 38})        
	        .text(query_seq_length);
		}
		

         var seq = draw_div;
		 		seq.append("rect")
				//.on('mouseover', show_gene_information)
                .attr("x", 162)
                .attr("y", 90)
                //.attr("y", sequence_start_y)
                .attr("class", "seq_string")
                .attr("width", "10")
                .attr("height", function(d){   
						console.log("query is: "+query_seq_length+" domain is "+domainScale(query_seq_length));  
						return domainScale(query_seq_length);
					})
               .attr("transform", function(d){return "rotate(-90 100 100)";})
               .attr("fill", "url(#line_gradient)");
            //   function(d){return d.children ? "":"grey";});
			return seq;
		
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
	drawProteinDomains: function (args){
		var seq = args.seq;
		var self = this;
		var hmmer_data = args.hmmer_data;
		var seq_length = args.seq_length; 
		var seq_length_visible = args.seq_length_visible; 
		console.log("drawing protein domains");
		console.log(hmmer_data);
		
		
		var sequence_start_y = 40;
		var domainScale = args.domainScale;
		console.log(domainScale);
		var leaf_group_x = 40;
		var domain_colors = args.domain_colors;
		var domain_width = args.domain_width;
		var database_type = args.database_type;
		var visibility = args.visibility;
		var domain2color = new Object();
		//var domainScale  = this.opt.domainScale;
		var domainScale = d3.scale.linear().domain([0,seq_length]).range([0,seq_length_visible]);
		// bind data to seq
		// Domains
		//console.log(seq);
		var seqs = seq.selectAll(".pfam_domain").data(hmmer_data);// , function(d) { return d.name; });
		//console.log(seqs);
		//asdasdds
		
		var all_domains =  seqs.enter()
								.append("a")
								.attr("xlink:href", function(d) {
									if(self.opt.database == "treefam"){
										return "http://www.treefam.org/family/"+d.name
									}
									else{
										return "http://pfam.sanger.ac.uk//family/"+d.name
									}
								})
								.attr("target", "_blank")
								.append("rect")
								.attr("x", function(d){
										return 156;
									})
								.attr("y", function(d){
									var x_coord = domainScale(Number(d.seq.from)) + 100;
									//console.log("setting x to "+leaf_group_x+" + "+d.seq.from+" "+x_coord);
										return x_coord;
								})
								.attr("class", function(d){ return "pfam_domain"})
								//.attr("visibility",visibility)
								.attr("rx", 5)
								.attr("ry", 5)
								//.attr("transform", "matrix(1,0,0,1,100,0)")
								.attr("stroke", "none")
								.attr("width", function(d){
									return domain_width;		
								})
								.attr("height", function(d){
									var length = domainScale(d.seq.to - d.seq.from);
									return length;
								})
								.attr("transform", "rotate(-90 100 100)")
								.attr("fill", 
								//                        "url(#domain_gradient)")
								//                        ;
										function(d,i){
											if(self.opt.database == "treefam"){
												return "grey";
											}
											//console.log("checking for "+d.name+" in domain2color");
											//return "red";
											if( domain2color[d.name] === undefined ) {
												//console.log("not found");
												domain2color[d.name] = domain_colors[i % 5];
												//console.log(d.name+" is "+i+" and will use: "+domain_colors[i]+ " length is "+domain_colors);
												return "url(#"+domain_colors[i % 5]+")";
											}
											else{
												//console.log("found! using "+domain2color[d.name]);
												return "url(#"+domain2color[d.name]+")";
											}
											//return "url(#"+domain_colors[i]+")";
										})
									//.on('mouseover', show_domain_information)
		
									console.log("should have drawn something by now");
									//stooop
		
	 },
	
	
	add_tipsy: function(args){
			//var where = args.where;
			console.log("in leaf label");
			jQuery(".pfam_domain").tipsy({ 
					gravity: 'ne', 
					html: true, 
					title: function() {
					   var c = "red";
					   var e = this.__data__;
					   var html = "<br><br>Description: "+e.name+"<br>e-value: "+e.evalue+"  <br>sequence coordinates: "+e.seq.from+"-"+e.seq.to+"<br>model coordinates: "+e.hmm.from+"-"+e.hmm.to+"<br>Source: Pfam"
					  return html; 
					}
			});
	  },	
},
{
	EVT_ON_SELECTION_CHANGE: "onSelectionChange",
	EVT_ON_SELECTION_CHANGED: "onSelectionChanged",
	EVT_ON_ANNOTATION_CLICKED: "onAnnotationClicked"

});


