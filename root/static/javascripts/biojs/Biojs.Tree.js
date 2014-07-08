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
 * @requires <a href='http://code.jquery.com/'>jQuery Core 1.9.2</a>
 * @dependency <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
 * 
 * @requires <a href='http://onehackoranother.com/projects/jquery/tipsy/'>jQuery Tipsy</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="http://www.treefam.org/static/javascripts/jquery/jquery.tipsy.js"></script>
 *
 * @requires <a href='http://d3js.org/'>D3</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="http://www.treefam.org/static/javascripts//d3/d3.v3.min.js"></script>
 * @requires <a href='http://www.ebi.ac.uk/~fs/static_files/tree_functions.js'>Additional tree functions</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="http://www.ebi.ac.uk/~fs/static_files/tree_functions.js"></script>

 * @requires <a href='http://dev.treefam.org/static/css/Biojs.Tree.css'>BioJS Tree css</a>
 * @dependency <link href="http://dev.treefam.org/static/css/Biojs.Tree.css" rel="stylesheet" type="text/css" />

 * @requires <a href='http://dev.treefam.org/static/css/tipsy.css'>jQuery Tipsy</a>
 * @dependency <link href="http://dev.treefam.org/static/css/tipsy.css" rel="stylesheet" type="text/css" />
 *
 *
 * @param {Object} options An object with the options for Sequence component.
 *    
 * @option {string} target 
 *    Identifier of the DIV tag where the component should be displayed.
 *    
     
 * @option {file} tree 
 * 	  JSON that contains the tree information. 
 *    <pre class="brush: js" title="Syntax:"> 
 *    [
 *    	// 
 *    	{ name: &lt;name&gt;, 
		  display_label: &lt;display_label&gt;,
		  duplication: &lt;duplication&gt;, 
		  branch_length: &lt;endVal1&gt;, 
		  common_name: &lt;common_name&gt;,
		  seq_length: &lt;seq_length&gt;,
		  type: &lt;type&gt;,
		  uniprot_name: &lt;uniprot_name&gt;,

		  children: []}, 
 *    	//
 *    	// Any others nodes
 *    	...,  
 *    	// 
 *    ]</pre>
 * 
 * <pre class="brush: js" title="Example:"> 
 * tree : [
 * 		{"name":"Amniota_1","branch_length":"0.2212","binary_alignment":"N/A","children": [..]
 *		,"common_name":"Chicken","seq_length":3397,"swissprot_gene_name":"N/A","display_label":"BRCA2"}
 *	   ]
 * </pre>
 *
 * @option {file} domains_file 
 *    Set of annotations for the leaves of the tree. Must be an array of objects following the syntax:
 *     		<pre class="brush: js" title="Syntax:">
 *            [ 
 *              // An annotation:
 *              { name: &lt;name&gt;, 
 *                species_name: &lt;message&gt;, 
 *                alignment_length: &lt;message&gt;, 
 *                seq_length: &lt;message&gt;, 
 *                cigar_string: &lt;color_code&gt;, 
 *                domains: [{ name: name; domain_start: &lt;startVal1&gt;, domain_end: &lt;endVal1&gt; id: &lt;HTMLColor&gt; name : name}, ...,{ start: &lt;startValN&gt;, end: &lt;endValN&gt;, color: &lt;HTMLColor&gt;}] 
 *              }, 
 *              
 *              // ...
 *              // more annotations here 
 *              // ...
 *            ]
 *    		 </pre>
 * <pre class="brush: js" title="Example:"> 
 * tree : [
 * 		{
 *        "cigar_string" : "4D22MD23M3D10MD13M2D44M2D23M3D7MD13M11D16MD57M5D27MD26M2D3M9D8MD9M2D3MD12MD11M2D10M3D3MD2MDMD9MD19M4D2MD17MD10MD24M5D7MD3MD24MD19MD10M3D6M10D26M6D5M2D17M12D11M2D10M2D52M2D7M2D12MD7M5D22M2D4M2D10M3D46MD20MD6M4D4M2D3M3DM2D11M4D4MDM2D4MDMD3MD5M4D5MD9M5D5M2DM7D18M3D5MD2MD6MD21MD5MDM2D6MDMD2MD23MD9M5D19M7D3M2D19MD2MD7M7D14M5D13MD9MD7M3D45MD7M2D4M3D7M8D3M13D2M12D3M5D4MD35MD44M3D2M2D18M15D17MD18M8D4M8DMD21MD36MD17MD2MD25M2D19MD6MD2MD3MD12M6D12MD21M4D11MD17MD18M2D79MD55M2D18M2D30M4D5MD5MD8MD11MD23MD42M8D26M4DMD25MD6M5D7M2D6M2D3MD15M6DMD14MD32M10D3MD6M5D43M3D13MD21MD6MD6M3D3MD8MD10M7D11M4D23M10D44MD12M5D4MDM3D19M13D34MD4MD15MD2MD6MD53M4D2MD10MD38MD13MD25MD104M3D62M2D15M5D5M6D37M2D6MDMD234MD3MD162MD11M2D30M2D45MD20MD2MD100M13D25M4D20M4D78M8D62MD38MD2MD8MD3MD4MD5MD41MD3MD4M16D11M2DM3D38M2D",
 *     "species_name" : "Ailuropoda_melanoleuca",
 *     "alignment_length" : 4010,
 *     "domains" : [ ..]
 *     "seq_length" : 3460,
 *     "name" : "ENSAMEP00000009909"}
 *	   ]
 * </pre>
 *
 *    where:
 *      <ul>
 *        <li><b>name</b> is the unique name corresponding to an id in the tree</li>
 *        <li><b>species_name</b> the species the annotation belong to.</li>
 *        <li><b>alignment_length</b> the length of the alignment sequence</li>
 *        <li><b>seq_length</b> the length of the sequence</li>
 *        <li><b>domains</b> array of objects defining the intervals which belongs to the annotation.</li>
 *        <li><b>domains[i].domain_start</b> domain's start position </li>
 *        <li><b>domains[i].domain_end</b> domain's stop position.</li>
 *        <li><b>domains[i].name</b> name of the domain, e.g. BRCA-2_OB1</li>.   
 *        <li><b>domains[i].id</b> the domain's id in the source database. Here, e.g. PF09103.5 </li>  
 *        <li><b>domains[i].evalue</b> the domains evalue </li>   
 *      </ul> 
 * 
 * @option {string} image_path
 *    Path to directory which contains species images.
 *
 * @option {string} [annotation_option="seqDomains"] 
 *    The display format for the annotations.
 *    
 * @option {boolean} [two_windows] 
 *    specifies whether the tree and the annotations should be printed into the same div/svg or separate
 *
 * @option {string} [highlight_gene]
 *    Gene identifier to be highlighted.
 *
 * 
 * @example 
 *			var alignment_file = "/target/test/data/just_sequences.json";
 *			var domain_file = "/target/test/data/just_domains.TF105041.json";
 *			var model_json_tree = "/target/test/data/TF105041_full.json";
 *
 *			var image_path = "http://www.ebi.ac.uk/~fs/d3treeviewer/data/images/species_files/";
 *			//var highlight_gene = "ENSBTAP00000001311";
 *			var highlight_gene = "";
 *			//var newick_tree = "../data/trees/newick_tree.nh";
 *			var newick_tree = "";
 *			var load_from_variable = 0;
 *		    var json_tree_string;
 *
 * myTree = new Biojs.Tree({
 *			        target : "YourOwnDivId",
 *					formatOptions : {
 *						tree:'json',
 *			  		},
 *					// tree parameters
 *				    json_tree : model_json_tree, 
 *					alignment_file : alignment_file,
 *					show_real_branchlength : "false",
 *					annotation_option : "seq_domains",
 *					domains_file : domain_file,
 *				    two_window : true,
 *				    image_path : image_path,
 *				    highlight_gene : highlight_gene,
 *				    json_tree_string : json_tree_string,
 *				    load_from_variable : load_from_variable,
 *			});
 * 
 */

Biojs.Tree = Biojs.extend(
/** @lends Biojs.Tree# */
{	
	constructor: function (options) {
		var self = this;

		this._container = jQuery( "#" + this.opt.target );
		//this._contentcontainer = jQuery( "#" + this.opt.tv_contentcontainer );
		
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
		//show_alignments: false,
		//show_domains: false,
		//show_species_tree: false,
		show_lost_taxa: false, // alignment, domains, seq_domains, speciestree || false
		tree_view: "", // reconciledView
		annotation_option: false, // species_genes,alignment, domains, seq_domains, speciestree, annotation || false
		//species_nodes: 190,
		alignment_length : "",
		domains_file : "",
		json_tree : "",
		species_tree : "",
		image_path : "",
		newick_tree : "",
		tree_data : "",
		tree_target : "",
		max_annot_div_width : "", // in case an alignment will be shown, the svg in the annotation panel needs to be a lot wider
		default_view : "ensembl", // "ensembl", "treefam", "hgnc", "uniprot"
		annot_target : "",
		no_genes : "",
		tree : "",
		highlight_gene : "",
		load_from_variable : undefined,
		load_from_web : undefined,
		json_tree_string : "",
		json_alignment_string : "",
		json_domain_string : "",
		root : "",
		show_real_branchlength: false,
		alignment_font_size:8,
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
		duration : 500, 
		two_window: false,
		root: "",
		diagonal: "",
		fontSize: 10,
		tree_representation_type: "not-radial",
		max_seq_representation: 400,
		
		
		selectionColor : 'Yellow',
		selectionFontColor : 'black',
		highlightFontColor : 'red',
		highlightBackgroundColor : 'white',
		fontFamily: '"Andale mono", courier, monospace',
		fontSize: '12px',
		fontColor : 'inherit',
		backgroundColor : 'inherit',
		width: 400,
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

		//this.setModelOrganisms();
		// Read tree data
		//if(self.opt.tree_view == "reconciledView"){
			// have to set this to the species tree
			//this.opt.json_tree = this.opt.species_tree;
		//	console.log("changed to species tree");
		//}
		// read tree
		// read also annotation	
// set padding for tree window
		this.padding = {
		     "top":    0,
		     "right":  0,
		     "bottom": 0,
		     "left":   0
		  };


		self._get_where_to_plot_right();
		jQuery('<div id="tree_spinner"><img src="http://www.ebi.ac.uk/~fs/d3treeviewer/data/images/loadinfo.net.gif" alt="Loading tree" height="22" width="22">Loading tree data...</div>').appendTo("#"+this.opt.tree_target);
		jQuery('<div id="annotation_spinner"><img  src="http://www.ebi.ac.uk/~fs/d3treeviewer/data/images/loadinfo.net.gif" alt="Loading annotation" height="22" width="22">Loading annotation data...</div>').appendTo("#"+this.opt.annot_target);
		//jQuery("#tree_spinner").hide();	
		//jQuery("#annotation_spinner").hide();	
		
	
		// this is important!!!
		// because we are getting data via an asyncronous ajax call, the function will continue
		// we have to be aware the things are getting executed within the "success" function
		// If we are building a species tree
		if(this.opt.annotation_option === "species_genes"){
			jQuery('<div id="species_tree_panel" ></div><div id="species_annotation_panel" ></div>').appendTo("#species_tree_view");
			this.tree_data = this.readTree({'load_from_variable': this.opt.load_from_variable,'tree_format' : this.opt.formatOptions.tree,
										'tree_data': this.opt.species_tree,'tree_data_variable' : this.opt.json_tree_string,
										'load_from_web' : this.opt.load_from_web});
		}
		else{	
			// add new components here
			jQuery('<ul id="tree_navigation" class="nav nav-tabs">\
  				<li id="gene_tree_li"><a href="#gene_tree" id="gene_tree_link" data-toggle="tab">Gene Tree</a></li>\
  				<li id="species_tree_li"><a href="#species_tree" id="species_tree_link" data-toggle="tab">Species Tree</a></li> \
				</ul>\
				<div id="tree_content" class="tab-content">\
  				<div class="tab-pane active" id="gene_tree_view"></div>\
				<div class="tab-pane" id="species_tree_view"></div>\
				</div>').appendTo("#"+this.opt.target);

			jQuery('<div id="tree_panel" ></div><div id="annotation_panel" ></div>').appendTo("#gene_tree_view");

			jQuery('<div class="gene_tree_menu">Species:\
					<div class="btn-group  btn-sm" data-toggle-name="is_private" data-toggle="buttons-radio">\
  					<button id="show_model_tree_id" type="button" value="0" class="btn btn-xs active" data-toggle="button">model organism</button>\
  					<button id="show_full_tree_id" type="button" value="1" class="btn btn-xs" data-toggle="button">all</button>\
					</div>\
					Coloring: by\
					<label class="checkbox-inline">\
  							<input type="checkbox" id="color_taxonomy" value="option1"> taxonomy</label>\
					<label class="checkbox-inline">\
  							<input type="checkbox" id="color_function" value="option2"> function</label>\
					<!--<div class="btn-group  btn-sm" data-toggle-name="is_private" data-toggle="buttons-radio">\
  						<button type="button" value="0" class="btn btn-xs active" data-toggle="button">Taxonomy</button>\
  						<button type="button" value="1" class="btn btn-xs" data-toggle="button">Function</button>\
					</div>-->\
					Branch length:\
					<div class="btn-group  btn-sm" data-toggle-name="is_private" data-toggle="buttons-radio">\
  							<button id="real_branch_length" type="button" value="0" class="btn btn-xs" data-toggle="button">Real</button>\
  							<button id="ultra_branch_length" type="button" value="1" class="btn btn-xs active" data-toggle="button">Ultrametric</button>\
					</div></div>').appendTo("#tree_panel");

			jQuery('<ul class="nav nav-tabs">\
			  	<li id="seq_domains_li"><a href="#home" id="seq_domains_link" data-toggle="tab">Sequences</a></li>\
			  	<li id="annotation_li"><a href="#profile" id="annotation_link" data-toggle="tab">AnnotationMatrix</a></li>\
				</ul>\
				<!-- Tab panes -->\
				<div class="tab-content">\
				<div class="tab-pane active" id="seq_domains_annotation_panel"></div>\
			  	<div class="tab-pane" id="annotation_grid_annotation_panel"></div>\
				</div>').appendTo("#annotation_panel");

			this.tree_data = this.readTree({'load_from_variable': this.opt.load_from_variable,'tree_format' : this.opt.formatOptions.tree,
										'tree_data': this.opt.json_tree,'tree_data_variable' : this.opt.json_tree_string,
										'load_from_web' : this.opt.load_from_web});
										}



			if(self.opt.annotation_option == "species_genes"){
				
				jQuery("#species_tree_panel").animate({"padding-top":65}, 500);
				//jQuery("#species_tree_li").toggleClass("active");				
				
				//jQuery("#tree_panel").css("padding-top", function(d){ return jQuery("#tree_panel").css("padding-top") + 40; });
			//	jQuery("#annotation_panel").css("padding-top", 40);
				//jQuery("#"+self.opt.tree_panel).css("padding-top", function(d){ return jQuery("#"+self.opt.tree_panel).css("padding-top") + 40; });
				//jQuery("#"+self.opt.annot_panel).css("padding-top", function(d){ return jQuery("#"+self.opt.annot_panel).css("padding-top") + 40; });
			}
			else{
				// set the tabs to default
				jQuery("#"+this.opt.annotation_option+"_li").toggleClass("active");				
				jQuery("#gene_tree_li").toggleClass("active");				
				//jQuery("#gene_tree_li").toggleClass("active");				
				//jQuery("#tree_panel").css("padding-top", 22);
			
			}

			// coloring
			// set taxonomy color by default
			// initialise checkboxes

			jQuery('#color_taxonomy').prop({checked: true});
			jQuery('#color_function').prop({checked: true});

    		jQuery('#color_taxonomy').change(function() {
        		if(jQuery(this).is(":checked")) {
            		//var returnVal = confirm("Are you sure?");
					jQuery(".clade_tax_rect").show( "slow", function() { });        				
            		jQuery(this).prop({checked: true});
        		}
        		else{
        			//var returnVal = confirm("Are you sure?");
        			jQuery(".clade_tax_rect").hide( "slow", function() { });        				
        			jQuery(this).prop({checked: false});	
        		}
    		});
			jQuery('#color_function').change(function() {
        		if(jQuery(this).is(":checked")) {
					jQuery(".tax_color_rect").show( "slow", function() { });        				
            		jQuery(this).prop({checked: true});
        		}
        		else{
        			jQuery(".tax_color_rect").hide( "slow", function() { });        				
        			jQuery(this).prop({checked: false});	
        		}
    		});

	
	},
	_get_where_to_plot_right: function (  ) {
		var self = this;
		if(self.opt.two_window){
			// this will be the main div
			self.opt.tree_target = "tree_panel";
			self.opt.annot_target = "annotation_panel";
			if(self.opt.annotation_option == "species_genes"){
				self.opt.tree_target = "species_tree_panel";
				self.opt.annot_target = "species_annotation_panel";

			}
			else{
				self.opt.annot_target = self.opt.annotation_option+"_annotation_panel";
			}
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
		var two_window = args.two_window;
		var annot_div_width = args.annot_div_width;
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
		var div_width, div_height,computed_div_width,div_width_half;
		if(two_window){
			div_width = d3.select("#"+self.opt.target).style("width");
										
			//div_width = jQuery("#wrapper").width;							
			div_heigth = parseInt(d3.select("#"+self.opt.target).style("height"));	
			div_width_half = div_width.replace("px","");
			div_width_half = parseInt(div_width_half /2);
			computed_div_width = div_width_half+"px";
			console.log("half width is "+div_width_half+" ("+div_width+"), "+computed_div_width+"");						
		}
		else{
			div_width = d3.select("#"+this.opt.target).style("width");							
			div_heigth = parseInt(d3.select("#"+this.opt.target).style("height"));							
		}
		
		self.opt.div_width_half = div_width_half;
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
		console.log("setting height to "+(height * 2));
		
		if(self.opt.two_window){
				this.opt.tree_panel = d3.select("#"+this.opt.tree_target).append("svg:svg")
										    .attr("class","svg_container")
										    .attr("width", div_width_half)
										    .attr("height", height)
										    .style("overflow", "scroll")
										    //.style("background-color","#EEEEEE")
										    .append("svg:g")
										    .attr("class","drawarea")
										    .on("click", function(d){
													jQuery("#my_custom_menu").hide();
											});
				//this.opt.tree_panel.append("svg:g").attr("class","axisarea");
				this.opt.tree_panel  = this.opt.tree_panel
											//.append("div")
												.append("svg:g")
												.attr("class","treearea")
										    .append("svg:g")
										    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");					
				// which svgs to draw
				var svgs_to_draw = new Array;
				if(this.opt.annotation_option === "species_genes"){
					svgs_to_draw.push("species_annotation_panel");
				}
				else{
					svgs_to_draw.push("seq_domains_annotation_panel","annotation_grid_annotation_panel");
				}


				svgs_to_draw.forEach(function(tab_div){
						self.opt.annot_panel = d3.select("#"+tab_div).append("svg:svg");
			  			self.opt.annot_panel.append("svg:g").attr("class","axisarea");
					
						console.log("annotation svg with: "+annot_div_width);
						self.opt.annot_panel.attr("class","svg_container")
											    .attr("width", annot_div_width)
											    .attr("height", height + 200)
												.attr("id", tab_div)
											    .style("overflow", "auto")
											    //.style("background-color","#EEEEEE")
											    .append("svg:g")
											    .attr("class","annot_area");

			  			self.opt.annot_panel  = self.opt.annot_panel
			  									//.append("div")
			  										.append("svg:g")
			  										.attr("class","annotationarea")
													.style("padding", "20")
			  								    .append("svg:g")
			  								    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
				});									
				

		  		// do we need to create additional svgs


		}
		else{
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
										}
			//	self.zoomObject = d3.behavior.zoom()
			  //            .scaleExtent([0.5, 2])
			    //          .on("zoom", zoom);

			 // self.zoomObject = d3.behavior.zoom().scaleExtent([0.2, 8]).on("zoom", zoom);

			//	d3.select("#"+this.opt.target+" svg").call(self.zoomObject);								
											
	},

_setTreeSpace: function ( args ) {
		var width = args.width;
		var height = args.height;
		var two_window = args.two_window;
		var annot_div_width = args.annot_div_width;
		var self = this;
		var m = [40, 240, 40, 240],
								    w = 1000 -m[0] -m[0],
								    h = 1840 -m[0] -m[2],
								    i = 0,
								    root;
		var div_width, div_height,computed_div_width,div_width_half;
		if(two_window){
			div_width = d3.select("#"+self.opt.target).style("width");
										
			//div_width = jQuery("#wrapper").width;							
			div_heigth = parseInt(d3.select("#"+self.opt.target).style("height"));	
			div_width_half = div_width.replace("px","");
			div_width_half = parseInt(div_width_half /2);
			computed_div_width = div_width_half+"px";
			console.log("half width is "+div_width_half+" ("+div_width+"), "+computed_div_width+"");						
		}
		else{
			div_width = d3.select("#"+this.opt.target).style("width");							
			div_heigth = parseInt(d3.select("#"+this.opt.target).style("height"));							
		}
		self.opt.div_width_half = div_width_half;
		self.opt.availablewidth = div_width;
		
		var w = window,
		    d = document,
		    e = d.documentElement,
		    g = d.getElementsByTagName('body')[0],
		    x = w.innerWidth || e.clientWidth || g.clientWidth,
		    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
		console.log("x: "+x+" y: "+y);
		console.log("setting height to "+(height * 2));
		
		if(self.opt.two_window){
			this.opt.tree_panel = d3.select("#"+this.opt.tree_target).append("svg:svg")
								    .attr("class","svg_container")
								    .attr("width", div_width_half)
								    .attr("height", height)
								    .style("overflow", "scroll")
								    //.style("background-color","#EEEEEE")
								    .append("svg:g")
								    .attr("class","drawarea");
			//this.opt.tree_panel.append("svg:g").attr("class","axisarea");
			this.opt.tree_panel  = this.opt.tree_panel
									//.append("div")
										.append("svg:g")
										.attr("class","treearea")
								    .append("svg:g")
								    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");					

		}
		else{
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
								}
								
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
	_addZoom: function(args){
		//console.log("add zoom");
		var self = this;
		self.zoom_behavior =d3.behavior.zoom()
			              .scaleExtent([0.5, 2])
			              .on("zoom", zoom);
		if(self.opt.two_window){
			console.log("adding to annot");
			d3.select("#"+this.opt.annot_target+" svg").call(self.zoom_behavior);
		}
		else{
			console.log("not adding to annot");
			d3.select("#"+this.opt.target+" svg").call(self.zoom_behavior);
		}	
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
	
	comparator: function (a, b) {
		var a_name = a.children? a.name.replace(/_\d+/g, '') : a.taxon;
		var b_name = b.children? b.name.replace(/_\d+/g, '') : b.taxon;
		var species2index = new Object();
		species2index["Tetraodon_nigroviridis"] = 0;
		species2index["Takifugu_rubripes"] = 1;
		species2index["Tetraodontidae"] = 2;
		species2index["Oreochromis_niloticus"] = 3;
		species2index["Gasterosteus_aculeatus"] = 4;
		species2index["Oryzias_latipes"] = 5;
		species2index["Xiphophorus_maculatus"] = 6;
		species2index["Atherinomorpha"] = 7;
		species2index["Smegmamorpha"] = 8;
		species2index["Percomorpha"] = 9;
		species2index["Gadus_morhua"] = 10;
		species2index["Holacanthopterygii"] = 11;
		species2index["Danio_rerio"] = 12;
		species2index["Clupeocephala"] = 13;
		species2index["Tupaia_belangeri"] = 14;
		species2index["Cavia_porcellus"] = 15;
		species2index["Spermophilus_tridecemlineatus"] = 16;
		species2index["Rattus_norvegicus"] = 17;
		species2index["Mus_musculus"] = 18;
		species2index["Murinae"] = 19;
		species2index["Dipodomys_ordii"] = 20;
		species2index["Sciurognathi"] = 21;
		species2index["Rodentia"] = 22;
		species2index["Oryctolagus_cuniculus"] = 23;
		species2index["Ochotona_princeps"] = 24;
		species2index["Lagomorpha"] = 25;
		species2index["Glires"] = 26;
		species2index["Otolemur_garnettii"] = 27;
		species2index["Microcebus_murinus"] = 28;
		species2index["Strepsirrhini"] = 29;
		species2index["Nomascus_leucogenys"] = 30;
		species2index["Pongo_abelii"] = 31;
		species2index["Homo_sapiens"] = -3;
		species2index["Pan_troglodytes"] = -2;
		species2index["Gorilla_gorilla"] = -1;
		species2index["Homininae"] = 0;
		species2index["Hominidae"] = 36;
		species2index["Hominoidea"] = 37;
		species2index["Macaca_mulatta"] = 38;
		species2index["Catarrhini"] = 39;
		species2index["Callithrix_jacchus"] = 40;
		species2index["Simiiformes"] = 41;
		species2index["Tarsius_syrichta"] = 42;
		species2index["Haplorrhini"] = 43;
		species2index["Primates"] = 44;
		species2index["Euarchontoglires"] = -3;
		species2index["Procavia_capensis"] = 46;
		species2index["Loxodonta_africana"] = 47;
		species2index["Echinops_telfairi"] = 48;
		species2index["Afrotheria"] = 49;
		species2index["Pteropus_vampyrus"] = 50;
		species2index["Myotis_lucifugus"] = 51;
		species2index["Chiroptera"] = 52;
		species2index["Equus_caballus"] = 53;
		species2index["Vicugna_pacos"] = 54;
		species2index["Bos_taurus"] = 55;
		species2index["Sus_scrofa"] = 56;
		species2index["Tursiops_truncatus"] = 57;
		species2index["Cetartiodactyla"] = 58;
		species2index["Felis_catus"] = 59;
		species2index["Mustela_putorius_furo"] = 60;
		species2index["Ailuropoda_melanoleuca"] = 61;
		species2index["Canis_lupus_familiaris"] = 62;
		species2index["Caniformia"] = 63;
		species2index["Carnivora"] = 64;
		species2index["Sorex_araneus"] = 65;
		species2index["Erinaceus_europaeus"] = 66;
		species2index["Insectivora"] = 67;
		species2index["Laurasiatheria"] = 68;
		species2index["Dasypus_novemcinctus"] = 69;
		species2index["Choloepus_hoffmanni"] = 70;
		species2index["Xenarthra"] = 71;
		species2index["Eutheria"] = 72;
		species2index["Monodelphis_domestica"] = 73;
		species2index["Macropus_eugenii"] = 74;
		species2index["Sarcophilus_harrisii"] = 75;
		species2index["Metatheria"] = 76;
		species2index["Theria"] = 77;
		species2index["Ornithorhynchus_anatinus"] = 78;
		species2index["Mammalia"] = 79;
		species2index["Pelodiscus_sinensis"] = 80;
		species2index["Anolis_carolinensis"] = 81;
		species2index["Taeniopygia_guttata"] = 82;
		species2index["Meleagris_gallopavo"] = 83;
		species2index["Gallus_gallus"] = 84;
		species2index["Phasianidae"] = 85;
		species2index["Neognathae"] = 86;
		species2index["Sauria"] = 87;
		species2index["Sauropsida"] = 88;
		species2index["Amniota"] = 89;
		species2index["Xenopus_tropicalis"] = 90;
		species2index["Tetrapoda"] = 91;
		species2index["Latimeria_chalumnae"] = 92;
		species2index["Sarcopterygii"] = 93;
		species2index["Euteleostomi"] = 94;
		species2index["Petromyzon_marinus"] = 95;
		species2index["Vertebrata"] = 96;
		species2index["Ciona_savignyi"] = 97;
		species2index["Ciona_intestinalis"] = 98;
		species2index["Ciona"] = 99;
		species2index["Chordata"] = 100;
		species2index["Strongylocentrotus_purpuratus"] = 101;
		species2index["Deuterostomia"] = 102;
		species2index["Lottia_gigantea"] = 103;
		species2index["Capitella_teleta"] = 104;
		species2index["Helobdella_robusta"] = 105;
		species2index["Annelida"] = 106;
		species2index["Lophotrochozoa"] = 107;
		species2index["Ixodes_scapularis"] = 108;
		species2index["Atta_cephalotes"] = 109;
		species2index["Apis_mellifera"] = 110;
		species2index["Aculeata"] = 111;
		species2index["Nasonia_vitripennis"] = 112;
		species2index["Apocrita"] = 113;
		species2index["Drosophila_virilis"] = 114;
		species2index["Drosophila_mojavensis"] = 115;
		species2index["Drosophila"] = 116;
		species2index["Drosophila_grimshawi"] = 117;
		species2index["Drosophila_willistoni"] = 118;
		species2index["Drosophila_pseudoobscura_pseudoobscura"] = 119;
		species2index["Drosophila_persimilis"] = 120;
		species2index["pseudoobscura_subgroup"] = 121;
		species2index["Drosophila_yakuba"] = 122;
		species2index["Drosophila_simulans"] = 123;
		species2index["Drosophila_sechellia"] = 124;
		species2index["Drosophila_melanogaster"] = 125;
		species2index["Drosophila_erecta"] = 126;
		species2index["melanogaster_subgroup"] = 127;
		species2index["Drosophila_ananassae"] = 128;
		species2index["melanogaster_group"] = 129;
		species2index["Sophophora"] = 130;
		species2index["Drosophila"] = 131;
		species2index["Anopheles_darlingi"] = 132;
		species2index["Anopheles_gambiae"] = 133;
		species2index["Anopheles"] = 134;
		species2index["Culex_quinquefasciatus"] = 135;
		species2index["Aedes_aegypti"] = 136;
		species2index["Culicinae"] = 137;
		species2index["Culicidae"] = 138;
		species2index["Diptera"] = 139;
		species2index["Heliconius_melpomene"] = 140;
		species2index["Danaus_plexippus"] = 141;
		species2index["Nymphalidae"] = 142;
		species2index["Bombyx_mori"] = 143;
		species2index["Obtectomera"] = 144;
		species2index["Tribolium_castaneum"] = 145;
		species2index["Endopterygota"] = 146;
		species2index["Pediculus_humanus_corporis"] = 147;
		species2index["Acyrthosiphon_pisum"] = 148;
		species2index["Paraneoptera"] = 149;
		species2index["Neoptera"] = 150;
		species2index["Daphnia_pulex"] = 151;
		species2index["Pancrustacea"] = 152;
		species2index["Arthropoda"] = 153;
		species2index["Trichinella_spiralis"] = 154;
		species2index["Pristionchus_pacificus"] = 155;
		species2index["Bursaphelenchus_xylophilus"] = 156;
		species2index["Meloidogyne_hapla"] = 157;
		species2index["Tylenchida"] = 158;
		species2index["Strongyloides_ratti"] = 159;
		species2index["Heterorhabditis_bacteriophora"] = 160;
		species2index["Caenorhabditis_briggsae_AF16"] = 161;
		species2index["Caenorhabditis_japonica"] = 162;
		species2index["Caenorhabditis_brenneri"] = 163;
		species2index["Caenorhabditis_remanei"] = 164;
		species2index["Caenorhabditis_elegans"] = 165;
		species2index["Caenorhabditis"] = 166;
		species2index["Rhabditoidea"] = 167;
		species2index["Rhabditida"] = 168;
		species2index["Chromadorea"] = 169;
		species2index["Nematoda"] = 170;
		species2index["Ecdysozoa"] = 171;
		species2index["Protostomia"] = 172;
		species2index["Schistosoma_mansoni"] = 173;
		species2index["Bilateria"] = 174;
		species2index["Nematostella_vectensis"] = 175;
		species2index["Eumetazoa"] = 176;
		species2index["Amphimedon_queenslandica"] = 177;
		species2index["Trichoplax_adhaerens"] = 178;
		species2index["Metazoa"] = 179;
		species2index["Saccharomyces_cerevisiae_S288c"] = 180;
		species2index["Schizosaccharomyces_pombe_972h-"] = 181;
		species2index["Ascomycota"] = 182;
		species2index["Proterospongia"] = 183;
		species2index["Monosiga_brevicollis"] = 184;
		species2index["Codonosigidae"] = 185;
		species2index["Opisthokonta"] = 186;
		species2index["Arabidopsis_thaliana"] = 187;
		species2index["Eukaryota"] = 188;
		
		var collected_nodes1 = get_all_children(a);
		var collected_nodes2 = get_all_children(b);
		var comparison = collected_nodes1.length <= collected_nodes2.length;

		//var comparison = species2index[a_name] > species2index[b_name];

		//console.log("comparing "+a_name+" ("+species2index[a_name]+") and "+b_name+" ("+species2index[b_name]+") : "+comparison);
		return comparison;
	},

	redraw: function(args){
		var vis = args.vis;
		console.log("in zoom");
		//console.log("here", d3.event.translate, d3.event.scale);
		  //vis.attr("transform",
		    //  "translate(" + d3.event.translate + ")"
		      //+ " scale(" + d3.event.scale + ")");
	},
	/*
	 * readAnnotation in different formats
	 * @param {string} load_from_variable whether to read the annotation from a file or variable.
	 * @param {string} data_source file/variable.
	 * @param {string} format nhx|json.
	 * 
	 * @example 
	 * myTree.readAnnotation();
	 * 
	 */
	readAnnotation: function(args){
		var self = this;
		var load_from_variable = args.load_from_variable;
		var format = args.format;
		var data_source = args.data_source;
		var data_variable = args.data_variable;
		var load_from_web = args.load_from_web;
		var json_annotation_data;
		console.log("load annotation from web is: "+load_from_variable);
		
		if(load_from_variable){
				console.log("load from variable selected");
				console.log(data_variable);
				//json_tree_data = JSON.parse( 
				json_annotation_data = JSON.parse(data_variable);
				//self.update({'root' : json_tree_data}); 
				//self.update({'root' : tree_data_variable}); 
		}
		else if(load_from_web){
			json_annotation_data = data_variable;
		}

		if(format == "json" ){
			console.log("json selected");
			var test_url  = data_source;
			console.log("loading annotation from "+test_url);
			jQuery.ajax({
			          url: test_url,
					  dataType: "json",
					  async: false,
			          beforeSend: function(){
			            	jQuery("#annotation_spinner").show();        				
						},
						complete: function(){
    						 jQuery('#annotation_spinner').hide();
  						},
						//type: 'POST',
			          //data: {list_item: selected_from_list},

			          success: function(result){
						  console.log("have result");
						  //return result;
					  		json_annotation_data = result;
							self.annotation_data = result;
							self.update_annotation(json_annotation_data);
							//console.log(result);
					  },
					  error: function(){
					      alert('Failed to retrieve annotations from '+test_url);
					    }
					  
					  });
			
			
		 	//d3.json(tree_data, function(json_tree_data) {
			//	  //gTree.update(root = json);
			//	  console.log("setting json data from "+tree_data+" ");
			//	  console.log(json_tree_data);
			//	  self.tree_data = json_tree_data;
			//	  some_test = json_tree_data;
			//	  //var pruned_tree = self._iterateTree(json_tree_data);
			//	  console.log(some_test);
			//	  console.log("done with d3.json");
			//	  return json_tree_data;
  			//	  //self.update(self.opt.root = json_tree_data); 
			//});
			//console.log("well, we are outside the json read routine");
			//console.log(json_tree_data);
			//return json_tree_data;
		}
		//test
		//console.log(json_annotation_data);
		return json_annotation_data;
		
	},
	
	
	readNHFormat: function(args){
		var self = this;
		var result = args.result;
		var json_tree_data;
		  console.log("have result");
		var x = newick.parse(result);
		console.log(x);
		var cluster = d3.layout.cluster()
						    .size([360, 1])
						    .sort(null)
						    .value(function(d) { return d.length; })
						    .children(function(d) { return d.branchset; })
						    .separation(function(a, b) { return 1; });
		json_tree_data = cluster(x);
		var nodes = cluster.nodes(x);
		
		//console.log(json_tree_data);
		//json_tree_data = x;
  		return json_tree_data;	
		
		
	},
	
	collapseTree: function(){
		var self = this;
		var found_node;
		jQuery.each(self.selected_nodes, function(i,d){
		
			if(d.name == self.opt.highlight_gene){
				found_node = d;	
				return false;
			}		
		});
		if(found_node){
			var curr_node = found_node;
		
			while(parent = curr_node.parent){
				parent.children.forEach(function(d) {
					if(d.name === curr_node.name){
						curr_node = parent;
							return false;
					}
			if (d.children) {
				d._collapsed_children = get_all_childs(d).length - 1;
				d._children = d.children;
				d.children = null;
			
			}		
				});
				curr_node = parent;
			}
		}
		
		self.root = self.selected_nodes[0];
			
		self.update_tree(self.selected_nodes[0]);
		self.update_annotation();
	},	
	collapseSpeciesTree: function(){
		var self = this;
		var found_node;
		// iterate over all nodes
		// check if 
		jQuery.each(self.selected_nodes, function(i,d){
		
				if(d.children){
						var new_children = new Array;
					jQuery.each(d.children, function(counter, child){
							var all_children = get_all_childs(child);
							var subtree_with_genes = false;
							jQuery.each(all_children, function(child_counter, subchild){
									if(subchild.genes){
											subtree_with_genes = true;
										return false;
									}					
							});
						// hiding children?
							if(subtree_with_genes){
									new_children.push(child);
							}
					});
					d._children = d.children;
					d._species_collapsed = true;
					d.children = new_children ? new_children: null;
				}
		});
		self.root = self.selected_nodes[0];
			
		self.update_tree(self.selected_nodes[0]);
		self.update_annotation();
	},	
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
					if(tree_format == "json" ){
						json_tree_data = JSON.parse(tree_data_variable);
					}
					else{
						console.log("read nh tree");
						json_tree_data = self.readNHFormat({result : tree_data_variable});
					}
		}
		else if(load_from_web){
			json_tree_data = tree_data_variable;
		}
		else if(tree_format == "json" ){
			console.log("json selected");
			
			jQuery.ajax({
			          url: tree_data,
					  dataType: "json",
					  beforeSend: function(){
			            	jQuery("#tree_spinner").show();        				
						},
						complete: function(){
    						 jQuery('#tree_spinner').hide();
  						},
						//async: false,
			          //type: 'POST',
			          //data: {list_item: selected_from_list},

			          success: function(result){
						  console.log("have result");
					  		json_tree_data = result;
							self.root = json_tree_data;
							self.all_data= json_tree_data;


							self.update_tree(json_tree_data);
						// ok, do we read annotations as well?
					  		if(self.opt.two_window){
								console.log("remove spinner");
								jQuery("#tree_spinner").remove;
								//$('#tree_spinner').remove()
								self.domain_data = self.readAnnotation({load_from_variable: self.opt.load_from_variable,format : "json",
															data_source: self.opt.domains_file,data_variable : self.opt.json_domain_string});	
								console.log("remove spinner");
								jQuery("#annotation_spinner").remove;
								//$('#annotation_spinner').remove()
							}
							else{
								// so annotation is in the tree json
								var domains = rects.selectAll(".domain").data(function(d) { return d.domains; })
								self.update_annotation();
							}	

							if(self.opt.highlight_gene){
								self.collapseTree();
							} 	
							if(self.opt.annotation_option === "species_genes"){
								//self.collapseSpeciesTree();
							} 	


					}
					  
					  });
			
			
		 	//d3.json(tree_data, function(json_tree_data) {
			//	  //gTree.update(root = json);
			//	  console.log("setting json data from "+tree_data+" ");
			//	  console.log(json_tree_data);
			//	  self.tree_data = json_tree_data;
			//	  some_test = json_tree_data;
			//	  //var pruned_tree = self._iterateTree(json_tree_data);
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
			console.log("nh selected");
			var test_url  = "../../main/resources/dependencies/data/trees/life.txt";
			console.log("loading tree from "+test_url);
			
			jQuery.ajax({
			          url: test_url,
					  //dataType: "json",
					  async: false,
			          //type: 'POST',
			          //data: {list_item: selected_from_list},

			          success: function(result){
						  console.log("have result");
						  json_tree_data = self.readNHFormat({result : result});
			  		  	//var x = newick.parse(result);
			  			//console.log(x);
			  			//var cluster = d3.layout.cluster()
			  			//					    .size([360, 1])
			  			//					    .sort(null)
			  			//					    .value(function(d) { return d.length !== undefined; })
			  			//					    .children(function(d) { return d.branchset !== undefined; })
			  			//					    .separation(function(a, b) { return 1; });
			  		  	//json_tree_data = cluster(x);
			  		  	//console.log(json_tree_data);
			  			//json_tree_data = x;
					  	return json_tree_data;	
					  },
					  error: function(){
					      alert('Failed to retrieve annotations from '+test_url);
					    }
					  
					  });
			
		}
		
		//console.log("end of  'read_tree'")
		//console.log(some_test);
		console.log(json_tree_data);
		
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
	
	
	_iterateTree: function(obj) {
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
	            self._iterateTree(elem); // call recursively
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
	_clear_divs: function(){
		jQuery('.added_button').remove();
		jQuery('#tree').empty();
		jQuery('#tree_panel').empty();
		jQuery('#annotation_panel').empty();
		jQuery('#YourOwnDivId').empty();
		jQuery('#species_tree_panel').empty();
		jQuery('#species_annotation_panel').empty();
		

		//jQuery('#tree').children().fadeOut(500).promise().then(function() {	jQuery('#tree').empty();});
		//jQuery('#tree_panel').children().fadeOut(500).promise().then(function() {	jQuery('#tree_panel').empty();});
		//jQuery('#annotation_panel').children().fadeOut(500).promise().then(function() {	jQuery('#annotation_panel').empty();});
		//jQuery('#YourOwnDivId').children().fadeOut(500).promise().then(function() {	jQuery('#YourOwnDivId').empty();});
		//jQuery('#species_tree_panel').children().fadeOut(500).promise().then(function() {	jQuery('#species_tree_panel').empty();});
		//jQuery('#species_annotation_panel').children().fadeOut(500).promise().then(function() {	jQuery('#species_annotation_panel').empty();});

		//console.log("cleared divs");
	},
	switch_perspective: function(new_perspective){
		var self = this;
		if(new_perspective === self.default_view){}
		else{
			self.default_view = new_perspective;
			this.update_tree();
			this.update_annotation();
    		jQuery('#my_custom_menu').hide();
		}
	},
	swap_children: function(){
		var self = this;
		var current_d = self.opt.current_d;
		var test;
		if(current_d.children){
			var no_children = Object.size(current_d.children);
			if(no_children >1 && no_children < 3){
				var first_child = current_d.children[0];
				var second_child = current_d.children[1];
				current_d.children[1] = first_child;
				current_d.children[0] = second_child;
				this.update_tree(current_d);
				this.update_annotation(current_d);
			}	
		}
    	jQuery('#my_custom_menu').hide();
	},
	collapse_node: function(){
		var self = this;
		var current_d = self.opt.current_d;
		self._collapseNode(current_d);
    	jQuery('#my_custom_menu').hide();
	},
	expand_all: function(){
		var self = this;
		jQuery.each(self.nodes, function(seq_no,d){
			var species = d.name; 
			if(d._children){
				d.children = d._children;
				d._children = null;
			}
		});	
		this.update_tree();
		this.update_annotation();
    	jQuery('#my_custom_menu').hide(400);
	},
	focus_node: function(){
		var self = this;
		var current_d = self.opt.current_d;
		self.highlight_gene = current_d.name;
		self.update_tree;
		self.update_annotation;
    	jQuery('#my_custom_menu').hide();
	},


	updateAnnotationPanel: function(args){
		var self = this;		
		var domains_file = args.domains_file;
		// read annotation?							 
		self.opt.domains_file = domains_file;
		jQuery('#annotation_panel').empty();
		if(self.opt.two_window){
					self.domain_data = self.readAnnotation({load_from_variable: self.opt.load_from_variable,format : "json",
															data_source: self.opt.domains_file,data_variable : self.opt.json_domain_string});	
					//			jQuery("#annotation_spinner").remove;
					//			$('#annotation_spinner').remove()
	//							self.update_annotation();
		}
		else{
								// so annotation is in the tree json
								var domains = rects.selectAll(".domain").data(function(d) { return d.domains; })
								self.update_annotation();
		}					   
	},

	
	showModelTree: function(){
		//var full_tree = this.tree_data;
		this.opt.modelTreeOn = "on";
		console.log("model tree with "+full_tree.length);
		//console.log(full_tree);
		this.update(); 
	},
	showFullTree: function(full_tree){
		//var full_tree = this.tree_data;
		this.opt.modelTreeOn = "";
		console.log("full tree with "+full_tree.length);
		var new_tree_data = this.readTree({'load_from_variable': this.opt.load_from_variable,'tree_format' : this.opt.formatOptions.tree,
										'tree_data': full_tree,'tree_data_variable' : this.opt.json_tree_string,
										'load_from_web' : this.opt.load_from_web});
		//console.log(full_tree);
    	var tree_layout = d3.layout.cluster();
    	var nodes = tree_layout.nodes(new_tree_data);
		// set correct height
		var current_size = this.opt.tree.size;
  		var new_height = nodes.length * 11;
		this.opt.tree.size([new_height, this.opt.div_width_half-this.opt.leaf_space]);
		d3.select("#"+this.opt.tree_target+" svg").style("height", new_height);	
		this.update(new_tree_data); 
	},
	
	
	addAxis: function(args){
		var max_value = args.max_value;
		var max_width = args.max_width;
		var self = this;
		// AXIS
		//var annotation_scale = d3.scale.linear().domain([0, max_seq_length+((max_seq_length * 20) / 100)]).range([0, 400]);
		max_value = max_value+((max_value * 20) / 100);
		console.log("adding axis :max_seq_length "+max_value+"  max_width:"+max_width+" max_value: "+max_value);
		
		var annotation_scale = d3.scale.linear().domain([0, max_value]).range([0, this.opt.max_seq_representation]);
		
		var xAnnotation_axis = d3.svg.axis().scale(annotation_scale).orient("bottom");				
		
		
		//d3.select("#"+this.opt.target).append("svg")
		jQuery('.axis').remove();
		d3.select(".axisarea").append("svg")
		//d3.select("#"+this.opt.target+" svg")
					//.append("svg")
				      .attr("class", "axis")
					  .attr("x", 0)
					  .attr("y", 0)
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
	
	
	_highlightGeneData: function(test,d){
		var self = this;
		
		console.log("looking at "+d.name);
		var name = d.name;

		//var found_nodes = d3.select(".treearea").selectAll("[taxon="+name+"]");
		
		var found_nodes = d3.selectAll(".treearea").selectAll("g.node").filter(function(d) {
			return d.taxon == name;
		})
		//var found_nodes = self.selected_nodes.filter(function(d){
		//	return d.taxon == name
		//})
		jQuery.each(found_nodes, function(d){
			//var test = this;
			//var group_circle_box = d3.select(d).select("svg circle");
			//group_circle_box.attr("r", 6);
			//console.log("looking at node "+d.name);
			var this_node = d3.select(this);
			this_node.name = "ahhhhh";
			//var d_node = d3.select(d);
			

			//var group_circle_box = this_node.select("circle");
			//var group_circle_box2 = d_node.select("circle");

			//group_circle_box.attr("r", 6);
			
			//var test = this;
			//self._highlightSpeciesData(test,d);
		})
		// now have to find species in gene tree
		console.log("some test here");

	},
	
	_highlightSpeciesData: function(test,d){
			if(!d.children){ 
				//console.log("mouseovered a leaf");
				var selected_group = d3.select(test);
				var selected_text  = selected_group.select("text");
				selected_text.classed("highlight_gene",true);
				var selected_path  = selected_group.select("path");

				//group_circle_box.style("font-size","34px")
				//group_circle_box.attr("font-size", 6);
				//var group_image = d3.select(test).select("svg image");
				//group_image.attr("width", 40).attr("height", 40);
				//var group_text = d3.select(test).select("svg text");
				//group_text.attr("x", 65);
			}
	},
	_deHighlightSpeciesData: function(test,d){
			if(!d.children){ 
				//console.log("mouseovered a leaf");
				var selected_group = d3.select(test);
				var selected_text  = selected_group.select("text");
				selected_text.classed("highlight_gene",false);
				var selected_path  = selected_group.select("path");

				//console.log(group_circle_box);
				//group_circle_box.attr("r", 0);
				//var group_image = d3.select(test).select("svg image");
				//group_image.attr("width", 20).attr("height", 20);
				//var group_text = d3.select(test).select("svg text");
				//group_text.attr("x", 35);
			}
	},
	
	set_branchlengths: function(n, offset) {
		var self = this;
		var plot_domain = self.opt.plottableDomain;
		var max_branch_length = self.opt.max_branch_length;
		//  
		//	
		//console.log(n.name+" has "+n.branch_length);
		//if (n.length != null) offset += n.length * 115;
		//  n.y = offset;
		  
		
  	  if (n.branch_length != null && n.branch_length != "N/A"){
		  if(n.branch_length ===  0){
		  	offset += 0;
			}
			else if(n.depth === 0 ){ 
			offset += plot_domain(parseFloat(max_branch_length*0.1));
		}
		else if( n.branch_length <  0.01){
		  	//offset += 3;
		  	offset += plot_domain(max_branch_length);
		  }
		  else if(n.branch_length >  2){
		  	//offset += 115;
		  	offset += plot_domain(max_branch_length);
			//console.log("found branch_length: offset += n.data.length * 115: "+offset+" += "+n.branch_length);
		  }
		  else{
			    //offset += n.branch_length * 115;
			    offset += plot_domain(n.branch_length);
				//console.log("found branch_length: offset += n.data.length * 115: "+offset+" += "+n.branch_length);
			}
		}
		else{
			//offset += 100;
			offset += plot_domain(max_branch_length);
		}
		
	  //if (n.data && n.data.length != null){
	   // offset += n.data.length * 115;
	    //console.log("offset += n.data.length * 115: "+offset+" += "+n.data.length);
	  //}
	  //console.log("setting n.y to "+offset);
	  //offset = plot_domain(offset); 
	  n.y = offset;
	  var offset_test = offset;
	  if (n.children)
	    //console.log("has children");
	    n.children.forEach(function(n) {
		    //console.log(n)
	      self.set_branchlengths(n, offset_test);
	    });
	},
	show_gene_annotation: function(){
			show_leaf_common_name({target: this.opt.target});
	},
	show_uniprot_annotation: function(){
			show_leaf_uniprot({target:this.opt.target});
	},
	toggleAll: function(d) {
	        if (d.children) {
	          d.children.forEach(toggle);
	          //click(d);
	        }
	},
      
// Toggle children.
	toggle: function(d) {
	  if (d.children) {
	    d._children = d.children;
	    d.children = null;
	  } else {
	    d.children = d._children;
	    d._children = null;
	  }
	} ,

	toggle_branchlength: function(){
		// remove everything in annotation div
		var all_nodes = jQuery('.annotation_panel .node');
		console.log("Found "+all_nodes.length+" nodes");
		all_nodes.remove();
		console.log("about to toggle branch length is: "+this.opt.show_real_branchlength)
		if(this.opt.show_real_branchlength){
			this.opt.show_real_branchlength = false;
		}
		else{
			this.opt.show_real_branchlength = true;
		}
		this.update_tree(); 
	},
	show_ultrametric_tree: function(){
		// remove everything in annotation div
		var all_nodes = jQuery('.annotation_panel .node');
		console.log("Found "+all_nodes.length+" nodes");
		all_nodes.remove();
		console.log("about to toggle branch length is: "+this.opt.show_real_branchlength)
		if(this.opt.show_real_branchlength){
			this.opt.show_real_branchlength = false;
		}
		this.update_tree(); 
	},
	show_real_branchlength: function(){
		// remove everything in annotation div
		var all_nodes = jQuery('.annotation_panel .node');
		console.log("Found "+all_nodes.length+" nodes");
		all_nodes.remove();
		console.log("about to toggle branch length is: "+this.opt.show_real_branchlength)
		if(!this.opt.show_real_branchlength){
			this.opt.show_real_branchlength = true;
		}
		this.update_tree(); 
	},


	show_alignments: function(){
		this.opt.annotation_option = "alignment";
		console.log("showing alignments now");
		this.update(); 
	},
	show_domains: function(){
		//var full_tree = this.tree_data;
		//console.log("about to toggle branch length is: "+this.opt.show_real_branchlength)
		//this.opt.show_real_branchlength = "on";
		//jQuery('#annotation_panel').empty();
		//jQuery('#annotation_panel').empty();
		var myNode = document.getElementsByClassName("annotationarea");
		while (myNode.firstChild) {
		    myNode.removeChild(myNode.firstChild);
		}
		this.opt.show_alignments = false;
		this.opt.show_domains = true;
		this.opt.annotation_option = "domains";
		
		console.log("showing domains now");
		//console.log("model tree with "+full_tree.length);
		//console.log(full_tree);
		this.update(); 
	},
	
	show_bootstrap: function(){
		d3.select("#"+this.opt.target+" svg").selectAll(".bootstrap").attr("visibility", "");
		//d3.select("#tree svg").selectAll(".bootstrap").attr("visibility", "");
	},
	hide_bootstrap: function(){
		d3.select("#"+this.opt.target+" svg").selectAll(".bootstrap").attr("visibility", "hidden");
		//d3.select("#tree svg").selectAll(".bootstrap").attr("visibility", "hidden");
	},
	show_taxlevel: function(){
		d3.select("#"+this.opt.target+" svg").selectAll(".innerNode_label").attr("visibility", "");
		//d3.select("#tree svg").selectAll(".innerNode_label").attr("visibility", "");
	},
	hide_taxlevel: function(){
		d3.select("#"+this.opt.target+" svg").selectAll(".innerNode_label").attr("visibility", "hidden");
		//d3.select("#tree svg").selectAll(".innerNode_label").attr("visibility", "hidden");
	},
	/*
	 * Updates a tree layout.
	 * 
	 * @example 
	 * myTree.update();
	 * 
	 */
	update_tree: function(source){
		var self = this;
		var root = this.root;
		var i = 0;
		// get tree data
		this.opt.tree = d3.layout.cluster();
    	var tree = this.opt.tree;
    	var nodes = tree.nodes(root).reverse();
	
		// set correct height
  		this.opt.height = nodes.length * 11;
		// get available width of div
		this.opt.div_width = parseInt(d3.select("#"+this.opt.target).style("width"));	
		if(self.opt.two_window){ 
			if(this.opt.show_alignments){
				// setting width of annotation div to max alignment length
				this.opt.max_annot_div_width = d3.max(self.alignment_data, function(d) { return +d.alignment_length;} ) * this.opt.alignment_font_size;		
			}
			else{
				div_width = d3.select("#"+self.opt.target).style("width");
				div_width_half = div_width.replace("px","");
				div_width_half = parseInt(div_width_half /2);
				this.opt.div_width_half = div_width_half;
				this.opt.max_annot_div_width = div_width_half;
				this.opt.max_seq_representation = div_width_half;
			}
		}
		// build the svg(s)
		// if using two divs/windows, there will be one div to hold the tree and another one to hold the annotation
		if (!jQuery("#"+this.opt.tree_target+" svg").length){
			this._setVisualSpace({'width':div_width,'height':this.opt.height, "two_window": self.opt.two_window, "annot_div_width" : this.opt.max_annot_div_width});
		}
		// set visual area to this.opt.vis
		var width = this.opt.width - this.padding.left - this.padding.right;
		var height = this.opt.height - this.padding.top - this.padding.bottom;
		var div_width;
		
		//
		if(self.opt.two_window){
			div_width = parseInt(d3.select("#"+this.opt.tree_target).style("width"));	
			this.opt.leaf_space = parseInt( div_width/ 3);
			//this.opt.tree = d3.layout.cluster()
				if(this.opt.annotation_option == "species_genes"){
						height -= 300;
				}
				this.opt.tree
									 .separation(function(a, b) { 
										 return a.parent === b.parent ? 4 : 4; 
									 })
									 //.sort(this.comparator)
									 .size([height, self.opt.div_width_half-this.opt.leaf_space]);
		}
		else{ 
			div_width= parseInt(d3.select("#"+this.opt.target).style("width")) - 400;	
			this.opt.leaf_space = parseInt( div_width/ 2);
									this.opt.tree
									 .separation(function(a, b) { return a.parent === b.parent ? 4 : 4; })
									 .size([height, div_width-this.opt.leaf_space]);
		}
		this.opt.diagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });

  		var target = d3.select("#"+this.opt.tree_target+" .treearea");
		var tree_target = d3.select("#"+this.opt.tree_target+" .treearea");
		var annot_target = d3.select("#"+this.opt.annot_target+" .annotationarea");
		
  		// define colors used to draw the domains
  		if(self.opt.annotation_option == "species_genes"){}
  		else{
	  		if(!self.opt.two_window){
				console.log("domaincolors: opt.vis");
				this.setDomainColors({target : this.opt.vis});
			}
			else{
				console.log("domaincolors: opt.annot_panel");
				this.setDomainColors({target : annot_target});
			}
		}
		
    	//var tree = this.opt.tree;
    	var nodes = this.opt.tree.nodes(root);
		// set correct height
  		//this.opt.height = nodes.length * 11;

		// get the tree's nodes
		var selected_nodes = nodes;

		if(self.opt.formatOptions.tree == "json"){
			console.log("using json in branch length test");
			selected_nodes = nodes.slice(0);
	 	}
		else{
			console.log("well, selecting nodes and setting branch lengths");
			selected_nodes = nodes[0].slice(0);
			//self.set_branchlengths(selected_nodes[0], 0);
		}
		
		// from here on --> all nodes should be in self.selected_nodes
		self.selected_nodes = selected_nodes;
			
		selected_nodes = self.selected_nodes;
		nodes = self.selected_nodes;
		// showing ultrametric tree or using real branch length
		// sets the "branch_length" field of each node
		if(self.opt.show_real_branchlength){
			console.log("switched on real branch length");
			if(!self.opt.formatOptions.tree === "json"){
				console.log("well, selecting nodes and setting branch lengths");
				selected_nodes = nodes[0].slice(0);
			}
			self.opt.plottable_tree_space = self.opt.div_width_half-self.opt.leaf_space;
			self.opt.max_branch_length= d3.max(selected_nodes, function(d) { return +d.branch_length;} );
			
			self.opt.max_depth= d3.max(selected_nodes, function(d) { return +d.depth;} );
			var max_estimated_tree_length = self.opt.max_depth * self.opt.max_branch_length;
			self.opt.plottableDomain = d3.scale.linear().domain([0,max_estimated_tree_length]).range([0, self.opt.plottable_tree_space]);
			self.set_branchlengths(selected_nodes[0], 0);
		}
		self.nodes = nodes;
		
	/*	if(self.opt.two_window){
			console.log("remove spinner");
			jQuery("#tree_spinner").remove;
			jQuery("#annotation_spinner").remove;
			$('#tree_spinner').remove()
			$('#annotation_spinner').remove()
		} */
		this.opt.domainScale = d3.scale.linear().domain([0,4000]).range([0, 400]);
		this.opt.divScale = d3.scale.linear().domain([0,5]).range([0, this.opt.availablewidth]);
		
		
	  	// Recompute the layout: update the nodes
		var node = target.selectAll("g.node").data(selected_nodes, function(d) { return d.id || (d.id = ++i); });

		//var node = target.selectAll("g.node").data(tree.nodes(root), function(d) { 
		//	return d.id || (d.id = ++i); 
		//});
		this.nodeEnter = node.enter().append("svg:g").attr("class", "node")
									//.on("click", function(d){
									//		console.log("clicked!!!!");
									//		//self._focus(d);
									//		console.log("clicked!!!!");
									//		self._collapseNode(d);
									//		})
									//.on("dblclick", function(d) { self._reset_tree(d) })
								.on("contextmenu", function(d, index) {
											var position = d3.mouse(this);
											var offsetLeft = document.getElementById("tree_panel").offsetLeft;
											var offsetTop = document.getElementById("tree_panel").offsetTop;
											var mouse_x =d3.event.x ;
											var mouse_y =d3.event.y ;
											self.opt.current_d = d;
    										d3.select('#my_custom_menu')
      											.style('position', 'absolute')
      											.style('left', mouse_x + "px")
      											.style('top',  mouse_y + "px") 
      											.style('display', 'block');
   									//	 self._buildContextMenu(d);

   												// set information in menu
   												jQuery('#menu_name span').html(d.name);
    											jQuery('#menu_info span').html("Blah");
    											
    											d3.event.preventDefault();

											})
									.on("mouseover", function(d){
											var test = this;
											self._highlightSpeciesData(test,d)
											//var corresponding_dom_element = d3.select(d);
											//d3.select(d);
											//corresponding_dom_element[0].css('z-index', 100);
									})
									.on("mouseout", function(d){
											var test = this;
											self._deHighlightSpeciesData(test,d)
									})
		// Update the links…
		var link = target.selectAll("path.link").data(tree.links(nodes), function(d) { return d.source.id + "-" + d.target.id; });

		draw_nodes({nodeEnter : this.nodeEnter, node : node, source : self.tree_data  , circle_size : this.opt.circle_size,tree_representation_type : this.opt.tree_representation_type, availablewidth : this.opt.availablewidth,
		annotation_option : self.opt.annotation_option	});
		
		var species_silhouette = self.opt.tree_view == "reconciledView"? true: false;
		set_links({link: link, link_type : this.opt.link_type, duration : this.opt.duration, species_silhouette : species_silhouette});
		
		jQuery('.tax_color_rect').remove();
		jQuery('.clade_tax_rect').remove();

		// colors based on taxonomy
		 var subtree_colors = get_subtree_color_data({nodeEnter : this.nodeEnter, highlight_gene : this.opt.highlight_gene, target : this.opt.target});
		//jQuery('.clade_tax_rect').remove();
		 var color_codes = color_subtrees({subtree_colors : subtree_colors, target : this.opt.target});		
		//console.log("here are the color codes: ");
		//this._addLegend({target : "legend_panel", legend_dictionary : color_codes})		
		

		var draw_color4leaves = 1;
		if(draw_color4leaves){
			//var how_to_color_hash = new Object;
			//how_to_color_hash['BRCA2'] = "yellow";
			var how_to_color_hash = get_gene_color_stats({nodeEnter : this.nodeEnter, highlight_gene : this.opt.highlight_gene, target : this.opt.target});
			draw_leaf_colors({target : this.opt.target, how_to_color_hash : how_to_color_hash});
		}
		// shall we print the species tree silhouette here?
		if(self.opt.tree_view == "reconciledView"){
			//collect_data_from_plotted_tree({target : this.opt.target});
			//print_species_tree_silhouette({link: link, link_type : this.opt.link_type, duration : this.opt.duration, species_silhouette : species_silhouette});
			self.showSpeciesTreeSilhouette({annot_target : annot_target});
		}
		
		//console.log(color_codes);
		

		


		// remove on update
		//jQuery('.tax_color_rect').remove();
		
		var circles = draw_circles({nodeEnter : this.nodeEnter, circle_size : this.opt.circle_size});   // Draw the little symbols for each node
		var images = draw_images({nodeEnter : this.nodeEnter , image_path : this.opt.image_path}); 		// Draw images for species

		// Bootstrap nodes

		// Draw taxon names (leaf nodes)
		var texts = draw_taxon_names({nodeEnter : this.nodeEnter, show_taxa: this.opt.show_taxa,highlight_gene : this.opt.highlight_gene,  default_view : this.opt.default_view,
		annotation_option : self.opt.annotation_option});
		var bootstrap_texts = draw_bootstraps({nodeEnter : this.nodeEnter, visibility : "hidden"});     // Draw bootstrap values 
		self.setTooltips();
		//self.show_bootstrap();
		//self.show_taxlevel();
		//self.root.children.forEach(self._toggleAll);

		//collapse nodes

	},


	update: function(source){
		var self = this;
	//	var root = this.tree_data;
		var root = source;
		var target = d3.select(".treearea");
		var tree_target = d3.select(".treearea");
		var annot_target = d3.select(".annotationarea");
		//this.opt.target;
		var i = 0;

		// tree data
		this.opt.tree = d3.layout.cluster();
    	var tree = this.opt.tree;
    	var nodes = tree.nodes(root);
		// get the tree's nodes
		var selected_nodes;
		//nodes.forEach(function(d) { 
		//	if(d.depth == 0){ d.y = 10;}
		//	else{
		//		d.y = d.depth * 180; 
		//	}
		//	});
		/*if(self.opt.show_lost_taxa){
			console.log("show lost taxa");
			var copy_of_nodes = nodes.slice(0);
			for (var i = 0 ; i < nodes.length; i++) {
				//console.log(selected_nodes[i]);
					var node = nodes[i];
					var name = node.name;
					//console.log("node "+name+" has lost taxa and "+node.children.length+" children");
					
					if(node.lost_taxa){
							var n = {name: "lost_taxon","branch_length":"1536","taxon":"Danio_rerio","x":95, "y":689,"children":[]};
							//node.children.push(node.lost_taxa);
							console.log("node "+name+" has lost taxa");
							//console.log("now "+node.children.length+" children");
							//selected_nodes.push(node.lost_taxa);
							
							if (node.children){
								node.children.push(n);
							} 
							else{
								node.children = [n];
							}
							//Array.prototype.insert = function (index, item) {
							//  this.splice(index, 0, item);
							//};
							var first_part = copy_of_nodes.slice(0,i);
							var second_part = copy_of_nodes.slice(i,copy_of_nodes.length);
							  //selected_nodes.insert(i,n);
							  var all = first_part.concat(n,second_part);
							  copy_of_nodes = all.slice(0);
							  console.log("test");
							
					}
					//var x = node.x;
					//nodeindex[name] = x;
		
			}
			//sdf
			nodes = copy_of_nodes.slice(0);
		}	*/
		
		/*var n = {id: nodes.length, name : "lost_taxon", taxon: "lost_taxon", type: "leaf"},
		      p = nodes[4];
		  if (p.children) p.children.push(n); else p.children = [n];
		  nodes.push(n);
		*/
		//self.set_branchlengths(nodes[0], 0);
		// make a copy of all nodes 
		
		if(self.opt.formatOptions.tree == "json"){
			console.log("using json in branch length test");
			selected_nodes = nodes.slice(0);
	 	}
		else{
			console.log("well, selecting nodes and setting branch lengths");
			selected_nodes = nodes[0].slice(0);
			self.set_branchlengths(selected_nodes[0], 0);
		}
		
		// from here on --> all nodes should be in self.selected_nodes
		
		self.selected_nodes = selected_nodes;
		nodes = selected_nodes;
		self.nodes = nodes;
		// showing ultrametric tree or using real branch length
		// sets the "branch_length" field of each node
		if(self.opt.show_real_branchlength){
			console.log("switched on real branch length");
			self.set_branchlengths(nodes[0], 0);
		}
		
		if(self.opt.two_window){
			console.log("remove spinner");
			jQuery("#tree_spinner").remove;
			jQuery("#annotation_spinner").remove;
			//$('#tree_spinner').remove()
			//$('#annotation_spinner').remove()
		}

		//console.log(selected_nodes);
		// get the max of either 
		//  - length of aligned sequence
		//  - domain 
		//  - length of unaligned sequence
		var max_seq_length, max_value, max_width;
		this.get_max_values();
		 // this will add an axis to the top of the annotation panel
		if(this.opt.annotation_option && this.opt.annotation_option != "speciestree" && this.opt.two_window){
			this.addAxis({max_value : this.opt.max_value, max_width: this.opt.max_width});
		}
		// since the annotation space is limited, we define a domain that maps all input values to a certain range.
		// e.g. an unaligned sequence might be 3432 AA long, so we can do domainScale(3432) and get the value e.g. 374
		// set domain scale
		this.opt.domainScale = d3.scale.linear().domain([0,this.opt.max_seq_length]).range([0, this.opt.max_seq_representation]);
		this.opt.divScale = d3.scale.linear().domain([0,5]).range([0, this.opt.availablewidth]);
		
		
	  	// Recompute the layout: update the nodes
		//var node = target.selectAll("g.node").data(selected_nodes, function(d) { return d.id || (d.id = ++i); });
		var node = target.selectAll("g.node").data(tree.nodes(root), function(d) { 
			return d.id || (d.id = ++i); 
		});
		this.nodeEnter = node.enter().append("svg:g").attr("class", "node")
									//.on("click", function(d){console.log("uff, clicked");self._collapseNode(d);})
									.on("click", function(d){console.log("uff, clicked");self._focus(d);})
									//.on("mouseover", function(d){var test = this;self._highlightSpeciesData(test,d)})
									//.on("mouseout", function(d){var test = this;self._deHighlightSpeciesData(test,d)})
		// Update the links…
		var link = target.selectAll("path.link").data(tree.links(nodes), function(d) { return d.source.id + "-" + d.target.id; });

		draw_nodes({nodeEnter : this.nodeEnter, node : node, source : self.tree_data  , circle_size : this.opt.circle_size,tree_representation_type : this.opt.tree_representation_type, availablewidth : this.opt.availablewidth});
		
		var species_silhouette = self.opt.tree_view == "reconciledView"? true: false;
		set_links({link: link, link_type : this.opt.link_type, duration : this.opt.duration, species_silhouette : species_silhouette});
		
		
		// colors based on taxonomy
		var subtree_colors = get_subtree_color_data({nodeEnter : this.nodeEnter, highlight_gene : this.opt.highlight_gene, target : this.opt.target});
		jQuery('.clade_tax_rect').remove();
		var color_codes = color_subtrees({subtree_colors : subtree_colors, target : this.opt.target});		
		//console.log("here are the color codes: ");
		this._addLegend({target : "legend_panel", legend_dictionary : color_codes})		
		
		// shall we print the species tree silhouette here?
		if(self.opt.tree_view == "reconciledView"){
			//collect_data_from_plotted_tree({target : this.opt.target});
			//print_species_tree_silhouette({link: link, link_type : this.opt.link_type, duration : this.opt.duration, species_silhouette : species_silhouette});
			self.showSpeciesTreeSilhouette({annot_target : annot_target});
		}
		
		//console.log(color_codes);
		

		var how_to_color_hash = get_gene_color_stats({nodeEnter : this.nodeEnter, highlight_gene : this.opt.highlight_gene, target : this.opt.target});


		// remove on update
		jQuery('.tax_color_rect').remove();
		
		var circles = draw_circles({nodeEnter : this.nodeEnter, circle_size : this.opt.circle_size});   // Draw the little symbols for each node
		var images = draw_images({nodeEnter : this.nodeEnter , image_path : this.opt.image_path}); 		// Draw images for species

		// Bootstrap nodes

		// Draw taxon names (leaf nodes)
		var texts = draw_taxon_names({nodeEnter : this.nodeEnter, show_taxa: this.opt.show_taxa,highlight_gene : this.opt.highlight_gene,  default_view : this.opt.default_view});
		var bootstrap_texts = draw_bootstraps({nodeEnter : this.nodeEnter, visibility : "hidden"});     // Draw bootstrap values 
		
		
		
		console.log("showing annotation: "+this.opt.annotation_option);
		if(this.opt.annotation_option == "speciestree"){
			console.log("showing speciestree");
				self.showSpeciesTree({annot_target : annot_target});
		}
		else if(this.opt.annotation_option == "alignment" 
			|| this.opt.annotation_option == "domains"
			|| this.opt.annotation_option == "seq_domains"){
				var nodeindex = self.getNodeIndices({selected_nodes : selected_nodes});
		
				switch(this.opt.annotation_option){
					case "alignment":
						console.log("adding alignment");
						self.showAlignments({nodeindex : nodeindex, annot_target : annot_target});
						break;
					case "domains":
						console.log("adding domains");
						self.showDomains({nodeindex : nodeindex, annot_target : annot_target});
						break;
					case "seq_domains":
						console.log("adding seq_domains");
						self.showSeqDomains({nodeindex : nodeindex, annot_target : annot_target});
						break;
						
						
					default:
						console.log("no annotation selected");
				}
		}		
			self.setTooltips();
		
	},
	/* Updates a tree annotationlayout.
	 * 
	 * @example 
	 * myTree.update_annotation();
	 * 
	 */
	update_annotation: function(source){
		var self = this;
	//	var root = this.tree_data;
		self._get_where_to_plot_right();
		var annotation_data = self.annotation_data;
		var target = d3.select("#"+this.opt.tree_target+" .treearea");
		var tree_target = d3.select("#"+this.opt.tree_target+" .treearea");
		var annot_target = d3.select("#"+this.opt.annot_target+" .annotationarea");
		//this.opt.target;
		var i = 0;
		self.domain_data = annotation_data;
		//console.log(selected_nodes);
		// get the max of either 
		//  - length of aligned sequence
		//  - domain 
		//  - length of unaligned sequence
		var max_seq_length, max_value, max_width;
		this.get_max_values({annotation : annotation_data});
		 // this will add an axis to the top of the annotation panel
		if(this.opt.annotation_option 
			&& this.opt.annotation_option != "species_genes" 
			&& this.opt.annotation_option != "speciestree" 
			&& this.opt.annotation_option != "annotation_grid" 
			&& this.opt.two_window){
			this.addAxis({max_value : this.opt.max_value, max_width: this.opt.max_width});
		}
		// since the annotation space is limited, we define a domain that maps all input values to a certain range.
		// e.g. an unaligned sequence might be 3432 AA long, so we can do domainScale(3432) and get the value e.g. 374
		// set domain scale
		this.opt.domainScale = d3.scale.linear().domain([0,this.opt.max_seq_length]).range([0, this.opt.max_seq_representation]);
		this.opt.divScale = d3.scale.linear().domain([0,5]).range([0, this.opt.availablewidth]);
		

		console.log("showing annotation: "+this.opt.annotation_option);
		if(this.opt.annotation_option == "speciestree"){
			console.log("showing speciestree");
				self.showSpeciesTree({annot_target : annot_target});

				//jQuery("#tree_panel").css("padding-top", 68);
				jQuery("#tree_panel").animate({"padding-top" : 60}, 500);
		}
		else if(this.opt.annotation_option == "alignment" 
			|| this.opt.annotation_option == "domains"
			|| this.opt.annotation_option == "annotation_grid"
			|| this.opt.annotation_option == "species_genes"
			|| this.opt.annotation_option == "seq_domains"){
				var nodeindex = self.getNodeIndices({selected_nodes : this.nodes});
				//jQuery("#tree_panel").css("padding-top", 30);
				jQuery("#tree_panel").animate({"padding-top" : 30}, 500);
				switch(this.opt.annotation_option){
					case "alignment":
						console.log("adding alignment");
						self.showAlignments({nodeindex : nodeindex, annot_target : annot_target});
						break;
					case "domains":
						console.log("adding domains");
						self.showDomains({nodeindex : nodeindex, annot_target : annot_target});
						break;
					case "seq_domains":
						console.log("adding seq_domains");
						self.showSeqDomains({nodeindex : nodeindex, annot_target : annot_target});
						break;
					case "annotation_grid":
						console.log("adding annotation_grid");
						self.showAnnotationMatrix({nodeindex : nodeindex, annot_target : annot_target});
						//jQuery("#tree_panel").css("padding-top", 68);
						jQuery("#tree_panel").animate({"padding-top" : 68}, 500);
						break;
					case "species_genes":
						console.log("adding species_genes");
						self.showSpeciesGenes({nodeindex : nodeindex, annot_target : annot_target});
						break;
	
						
					default:
						console.log("no annotation selected");
				}
		}		
			self.setTooltips();
			jQuery("#annotation_spinner").remove;
			//$('#annotation_spinner').remove()
		
	},
	
	
	get_max_values: function(args){
		var annotation = args.annotation;
		if(this.opt.two_window){
				if(this.opt.annotation_option){
						 if(this.opt.annotation_option == "seq_domains"){
							 this.opt.max_value = d3.max(annotation, function(d) { return +d.alignment_length;} );
							 this.opt.max_width = this.opt.max_value;
							 this.opt.max_seq_length = this.opt.max_value;
						 }
						 else{
							 this.opt.max_width = d3.max(annotation, function(d) { return +d.seq_length;} );		
							 this.opt.max_value = this.opt.max_width;
							 this.opt.max_seq_length = this.opt.max_width;
						 }
			 }
		}
		else{
			 this.opt.max_width = d3.max(annotation, function(d) { return +d.seq_length;} );
			 this.opt.max_value = this.opt.max_value;
			  this.opt.max_seq_length = this.opt.max_width;
		 }
	},
	
	getNodeIndices: function(args){
		var selected_nodes = args.selected_nodes;
		var nodeindex = new Object();
		//console.log(selected_nodes);
		for (var i = 0 ; i < selected_nodes.length; i++) {
			//console.log(selected_nodes[i]);
				var node = selected_nodes[i];
				var name = node.name;
				var x = node.x;
				nodeindex[name] = x;
		
		}
		if(nodeindex.length < 1){
			console.log("could not map annotations");
			// need to capture this case
		}
		return nodeindex;
	},
	
	showAlignments: function(args){
		var nodeindex = args.nodeindex;
		var annot_target = args.annot_target;
		var self = this;

		console.log("nodeindex is: ");
		console.log(nodeindex);

		var annot_node = annot_target.selectAll("g.node").data(self.alignment_data);
		annot_node.exit().remove();
		this.annot_nodeEnter = annot_node.enter()
									.append("svg:g").filter(function(d){ return nodeindex.hasOwnProperty(d.name)})
									.attr("class", "node")
									//.on("click", function(d) { toggle(d); self.update(d); })
									.on("mouseover", function(d){var test = this;self._highlightSpeciesData(test,d)})
									.on("mouseout", function(d){var test = this;self._deHighlightSpeciesData(test,d)});
				if(self.opt.two_window){
											this.nodeEnter = this.annot_nodeEnter;
				}			
				draw_nodes({two_window:self.opt.two_window, nodeEnter : this.nodeEnter, nodeindex: nodeindex, node : annot_node, source : self.tree_data  , tree_representation_type : this.opt.tree_representation_type});
				var alignment_patterns = this.nodeEnter.selectAll("text").data(function(d) { return d.sequence;})
				this.aligned_sequences = draw_alignment_sequences({alignment_patterns: alignment_patterns, 
													domainScale : this.opt.domainScale , 
													leaf_group_x : this.opt.leaf_group_x, 
													sequence_start_y : this.opt.sequence_start_y,
													two_window : this.opt.two_window,
													nodeindex : nodeindex,
													alignment_font_size : this.opt.alignment_font_size,
													visibility : ""});
				
									
	},
	



	showAnnotationGrid: function(args){
		var nodeindex = args.nodeindex;
		var annot_target = args.annot_target;
		var self = this;
		Object.size = function(obj) {
		    var size = 0, key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) size++;
		    }
		    return size;
		};
		
		var size = Object.size(nodeindex);

		// columns are: protein_id, sf_name, definition, organism, gene_id, gene_symbol, molecular function, biological process, cellular component, protein class
		// well, which of those do we need?
		// expande

		// determine the amount of space needed.
		// foreach 
		var column_width = new Array();
		["protein_id","sf_name", "definition", "gene_id", "molecular_function", "biological_process", "cellular_component", "protein_class"].map(function(annotation_class){
				var test = annotation_class;
				column_width[annotation_class] = d3.max(self.annotation_data, function(d) { 
					if(d.xref){
						if(d.xref[annotation_class]){
							return String(d.xref[annotation_class]).length;
						}
						else{return 0;}
					}
					else{return 0;}
				} );

		});
		var max_column_width = d3.max(column_width, function(d) { return d; }); // max column width
		var leaves = self.annotation_data.filter(function(t){
			return t.xref;
			//return t.xref  && nodeindex.hasOwnProperty(t.name);
		});	
		var annot_nodes = annot_target.selectAll("g").data(leaves); // bind annotation data

		var annot_nodeEnter = annot_nodes.enter()
									.append("svg:g")
									.attr("class", "annotation_text")
									.each(add_annotation_line);

		var add_annotation_line	 = function(d){
			var curr_data = d;
			if(d.xref){
						d3.select(this).selectAll(".annotation_text").data(d.xref).enter()
													//.append("rect")
													.append("text")
													.attr("x", function(d) { return 35; })
            										.attr("y", function(d) { return 4; })
			}
		};


		var table_html = "<table>";
		jQuery.each(self.annotation_data, function(seq_no,d){
				table_html += "<tr>";		
						if(d.xref){
							if(d.xref.protein_id){table_html += "<td>"+d.xref.protein_id+"</td>"}
							else {table_html += "<td></td>"}
							if(d.xref.sf_name){table_html += "<td>"+d.xref.sf_name+"</td>"}
							else {table_html += "<td></td>"}
							if(d.xref.definition){table_html += "<td>"+d.xref.definition+"</td>"}
							else {table_html += "<td></td>"}
							if(d.xref.gene_id){table_html += "<td>"+d.xref.gene_id+"</td>"}
							else {table_html += "<td></td>"}
							if(d.xref.molecular_function){table_html += "<td>"+d.xref.molecular_function+"</td>"}
							else {table_html += "<td></td>"}
							if(d.xref.biological_process){table_html += "<td>"+d.xref.biological_process+"</td>"}
							else {table_html += "<td></td>"}
							if(d.xref.cellular_component){table_html += "<td>"+d.xref.cellular_component+"</td>"}
							else {table_html += "<td></td>"}
							if(d.xref.protein_class){table_html += "<td>"+d.xref.protein_class+"</td>"}
							else {table_html += "<td></td>"}

						}
				table_html += "</tr>";
				});
				table_html += "</table>";
				jQuery("#annotation_svg_container").remove();
				jQuery( "span" ).appendTo( "#annotation_panel" );
				jQuery("#annotation_panel").append(table_html);

		},

	showSeqDomains: function(args){
		var nodeindex = args.nodeindex;
		var annot_target = args.annot_target;
		var self = this;
		Object.size = function(obj) {
		    var size = 0, key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) size++;
		    }
		    return size;
		}

		// bind data to nodes
		
		var leaves = self.annotation_data.filter(function(t){
			return t.children === undefined  && nodeindex.hasOwnProperty(t.name);
		});	
		var annot_node = annot_target.selectAll("g.node").data(self.annotation_data);
		
		// enter selection
		this.annot_nodeEnter = annot_node.enter()
									.append("svg:g").filter(function(d){ 
											var test = d;
											if(nodeindex.hasOwnProperty(d.name)){ 
												//console.log("take "+d.name); 
											}
											else{
												//console.log("could not map "+d.name);	
											}
											return nodeindex.hasOwnProperty(d.name)})
									.attr("class", "xref_node")
		
		// exit selection
		annot_node.exit().remove();
		if(self.opt.two_window){
											this.nodeEnter = this.annot_nodeEnter;
		}			
		// draw conservation patterns
		var alignment_length = this.opt.max_value;
		//var rects = this.annot_nodeEnter.filter(function(d){ return typeof d.children == 'undefined' });
		//draw_xref_nodes({two_window:self.opt.two_window, nodeEnter : this.nodeEnter, nodeindex: nodeindex, node : annot_node, source : self.tree_data  , tree_representation_type : this.opt.tree_representation_type});

		//};
		
		var size = Object.size(nodeindex);
		var offset_dictionary = {};
		console.log("looking at the domains, nodeindex: "+size);
		//console.log(nodeindex);
		console.log(self.domain_data);
		var alignment_length;
		
		/*
		todo: save offset mapping for each seq.
			this will be used for mapping the domains correctly.
			Given: domain start+end: 34-114
			want: start+stop coordinates mapped onto alignment
			todo: foreach position in alignment count number of gaps until here
			dict[curr_pos-gaps] = curr_pos
		*/
		var offset_dictionary = {};	
		jQuery.each(self.domain_data, function(seq_no,d){
			var gap_counter = 0,
				real_position= 1,
				cigar_array = [];
			if(d.cigar_string){
				var offset  = 0; // this is to plot the rects next to each other	
				var result = d.cigar_string.match(/(\d*\w)/g);
				//for (var set = 0; set < result.length; set++) {
				for (var set = 0; set < result.length; set++) {
					var submatch = result[set].match(/(\d*)(\w)/),
						length,
						cigar_type = submatch[2];
					if(submatch[1]){
						// there was a number for this cigar state
						length = parseInt(submatch[1]);
					}
					else{
						length = 1;
					}
					if(cigar_type.toLowerCase() === "d"){
						gap_counter += length;
					}
					if(cigar_type.toLowerCase() === "m"){
					for (var j=0; j < length; j++){
							if(offset_dictionary[d.name] === undefined){
								offset_dictionary[d.name] = {};
							}
							var new_real_position = j+real_position;
							offset_dictionary[d.name][new_real_position] = gap_counter + new_real_position;
						
						}
							real_position +=length;
					cigar_array.push({"type": cigar_type, "length": length, "offset" : offset});
					}
					offset = offset + length;	
				}
				//alignment_length = offset;
			}
			// change the coordinates of the domains
			if(d.domains){
				jQuery.each(d.domains, function(iteration,domain){
					if(offset_dictionary[d.name] !== undefined){
						domain.domain_start = offset_dictionary[d.name][domain.domain_start];
						domain.domain_stop = offset_dictionary[d.name][domain.domain_stop];
					}
				});
			}
			d.cigar_array = cigar_array;
		})
		
		this.opt.cigarScale = d3.scale.linear().domain([0,this.opt.max_value]).range([0, this.opt.max_seq_representation]);
		var annot_node = annot_target.selectAll("g.node").data(self.domain_data);
		// enter selection
		this.annot_nodeEnter = annot_node.enter()
									.append("svg:g").filter(function(d){ 
											var test = d;
											if(nodeindex.hasOwnProperty(d.name)){ 
												//console.log("take "+d.name); 
											}
											else{
												//console.log("could not map "+d.name);	
											}
											return nodeindex.hasOwnProperty(d.name)})
									.attr("class", "node")
									.on("mouseover", function(d){var test = this;self._highlightSpeciesData(test,d)})
									.on("mouseout", function(d){var test = this;self._deHighlightSpeciesData(test,d)});
		
		// exit selection
		annot_node.exit().remove();
		//console.log(this.annot_nodeEnter);
		if(self.opt.two_window){
											this.nodeEnter = this.annot_nodeEnter;
		}			
		// draw conservation patterns
		var alignment_length = this.opt.max_value;
		//var rects = this.annot_nodeEnter.filter(function(d){ return typeof d.children == 'undefined' });
		draw_nodes({two_window:self.opt.two_window, nodeEnter : this.nodeEnter, nodeindex: nodeindex, node : annot_node, source : self.tree_data  , tree_representation_type : this.opt.tree_representation_type});
		var rects = draw_cigar_borders({nodeEnter: this.nodeEnter, 
											domainScale : this.opt.cigarScale , 
											leaf_group_x : this.opt.leaf_group_x+2, 
											sequence_start_y : this.opt.sequence_start_y,
											two_window : this.opt.two_window,
											nodeindex : nodeindex,
											visibility : "",
											alignment_length: alignment_length});
		
		
		var cigars = rects.selectAll(".cigar_rect").data(function(d) { return d.cigar_array});
			
		//draw_nodes({two_window:self.opt.two_window, nodeEnter : this.nodeEnter, nodeindex: nodeindex, node : annot_node, source : self.tree_data  , tree_representation_type : this.opt.tree_representation_type});
				
		var cigar_rects = draw_cigar_sequences({domains: cigars, 
											domainScale : this.opt.cigarScale, 
											leaf_group_x : this.opt.leaf_group_x+4, 
											sequence_rect_width : this.opt.sequence_rect_width - 4,
											sequence_start_y : this.opt.sequence_start_y,
											two_window : this.opt.two_window,
											nodeindex : nodeindex,
											visibility : "",
											});							
		// Domains
		var domains = rects.selectAll(".domain").data(function(d) { return d.domains; })
		var leaves = rects.selectAll(".leaf_label");
						//console.log(domains);
						//console.log(" after specified domains/leaves");
		//this.opt.domainScale = d3.scale.linear().domain([0,this.opt.max_seq_length]).range([0, this.opt.max_seq_representation]);
		this.all_domains =  draw_domains({domains : domains, sequence_start_y : this.opt.sequence_start_y, 
															domainScale: this.opt.cigarScale, sequence_rect_width : this.opt.sequence_rect_width,
															two_window : this.opt.two_window,
															leaf_group_x : this.opt.leaf_group_x,domain_colors : this.opt.domain_colors,visibility: "" });
	
	},

	showSpeciesGenes: function(args){
		var nodeindex = args.nodeindex;
		var annot_target = args.annot_target;
		var self = this;
		//var annot_panel = d3.select("#annotation_svg_container");
		var annot_panel = d3.select("#"+this.opt.annot_target+" .annotationarea");
		annot_panel.attr("width", 500);
		Object.size = function(obj) {
		    var size = 0, key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) size++;
		    }
		    return size;
			}
		var species2genes= new Object(); //
		var geneCounts = new Object();		

		// collect annotation by species 
		jQuery.each(self.annotation_data, function(seq_no,d){
			var species = d.species_name; 
			if(species in species2genes){
				var current_array = species2genes[species];
				current_array.push(d);
				species2genes[species] = current_array;
			}
			else{
				var new_array = new Array();
				new_array.push(d);
				species2genes[species] = new_array;
			}
		
			// remember gene names
			if(d.display_label){
			var upper_case_name = d.display_label.toUpperCase();
			d.display_label = d.display_label.toUpperCase();
			if(upper_case_name in geneCounts){
				geneCounts[upper_case_name] = geneCounts[upper_case_name]+1;
			}
			else{
				geneCounts[upper_case_name] =1;
			}
			}
			});	
		jQuery.each(self.nodes, function(seq_no,d){
			var species = d.name; 
			if(species in species2genes){
				d.genes = species2genes[species]
			}
		});
		var found_gene = new Object();
		var total_no_genes = Object.size(self.annotation_data);
		var column_counter = 0;
		// count the different genes.
		jQuery.each(geneCounts, function(gene_name,occur){
				var gene_perc = 0.05 * total_no_genes;
				if(occur > gene_perc){
					found_gene[gene_name] = column_counter++;
				} 
		});


	// exit selection
		if(self.opt.two_window){
											this.nodeEnter = this.annot_nodeEnter;
		}			
		// draw conservation patterns
		var alignment_length = this.opt.max_value;
		//var rects = this.annot_nodeEnter.filter(function(d){ return typeof d.children == 'undefined' });
			
		this.opt.cigarScale = d3.scale.linear().domain([0,this.opt.max_value]).range([0, this.opt.max_seq_representation]);
		
		//var annot_node = annot_target.selectAll("g.node").data(self.nodes,function(d){return d.taxon });
	
		// focussing on leaves
		var leaves = self.nodes.filter(function(t){
			return t.children === undefined  && nodeindex.hasOwnProperty(t.name) && t.genes;
		});	
		
		// binding 
		// plotting stuff for known genes is ok
		// but plotting stuff for unknown...
		var known_genes_dict = new Object();
		var Gene2colorDictionary = new Object();
		var p=d3.scale.category20c();
		var r=p.range(); // ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", 
	                      // "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]
		var p_taxa=d3.scale.category10();
		var r_taxa=p_taxa.range();		  
				
		var i = 0;
		var i_taxa = 0;

		var annot_nodes = annot_target.selectAll("g").data(leaves);
		

		var add_gene_boxes	 = function(d){
										
										var circles = false;	
										if(circles){
												d3.select(this).selectAll(".gene_box_rect").data(d.genes).enter()
													//.append("rect")
													.append("circle")
													.attr("cx",function(e,i){
														if(found_gene.hasOwnProperty(e.display_label)){
															var offset = found_gene[e.display_label];
															var value = offset * 40 + 10;
												
															if(known_genes_dict.hasOwnProperty(e.species_name)){
																known_genes_dict[e.species_name] += 1;
															}
															else{
																known_genes_dict[e.species_name] = 1;
															}
															return value;
														}
											else{
												var y_position = i;
												if(known_genes_dict.hasOwnProperty(e.species_name)){
													y_position -= known_genes_dict[e.species_name];
												}
												
												var no_genes = Object.size(found_gene);
												var value = (y_position + no_genes) * 40+10;
												return value;
												}
										})
										.attr("cy",function(e){
												return nodeindex[e.species_name] +3;
												//return d.y
										})
										//.attr("width", 30)
										//.attr("height",10)
										.attr("r","8")
										.attr("class","gene_box_rect")
										.attr("fill", function(e){
												if(e.species_name === "Dasypus_novemcinctus"){
													var test;
												}
										if(found_gene.hasOwnProperty(e.display_label)){
											if( Gene2colorDictionary[e.display_label] === undefined ) {
												Gene2colorDictionary[e.display_label] = p_taxa(i_taxa % p_taxa.range().length);
												i_taxa++;
											}	
												return Gene2colorDictionary[e.display_label]	
										}
										else{
											return "grey";
										}
											//"url(#line_gradient)";
										})
							            //.transition().duration(1750);
										}
										else{
										d3.select(this).selectAll(".gene_box_rect").data(d.genes).enter()
										.append("rect")
										.attr("x",function(e,i){
											if(found_gene.hasOwnProperty(e.display_label)){
												var offset = found_gene[e.display_label];
												var value = offset * 40;
												
												if(known_genes_dict.hasOwnProperty(e.species_name)){
													known_genes_dict[e.species_name] += 1;
												}
												else{
													known_genes_dict[e.species_name] = 1;
												}
												if(e.species_name === "Takifugu_rubripes"){
													var test;
												}
												return value;
											}
											else{
												var y_position = i;
												if(known_genes_dict.hasOwnProperty(e.species_name)){
													y_position -= known_genes_dict[e.species_name];
												}
												
												var no_genes = Object.size(found_gene);
												var value = (y_position + no_genes) * 40;
												if(e.species_name === "Takifugu_rubripes"){
													var test;
												}
												return value;
												}
										})
										.attr("y",function(e){
												return nodeindex[e.species_name] + 55;
												//return d.y
										})
										.attr("rx", 4)
										.attr("ry", 4)
										.attr("width", 30)
										.attr("height",10)
										.attr("class","gene_box_rect")
										.attr("fill", function(e){
												if(e.species_name === "Dasypus_novemcinctus"){
													var test;
												}
										if(found_gene.hasOwnProperty(e.display_label)){
											if( Gene2colorDictionary[e.display_label] === undefined ) {
												Gene2colorDictionary[e.display_label] = p_taxa(i_taxa % p_taxa.range().length);
												i_taxa++;
											}	
												return Gene2colorDictionary[e.display_label]	
										}
										else{
											return "grey";
										}
											//"url(#line_gradient)";
										})
							            //.transition().duration(1750);
										};	
									};						
		// enter selection
		var annot_nodeEnter = annot_nodes.enter()
									.append("svg:g")
									.attr("class", "gene_node")
									.each(add_gene_boxes);
									//.on("mouseover", function(d){var test = this;self._highlightSpeciesData(test,d)})
									//.on("mouseout", function(d){var test = this;self._deHighlightSpeciesData(test,d)});
		

		
		// exit selection
		annot_nodes.exit().remove();
		// add gene labels 
			var werte = d3.keys(found_gene);
			werte.push("N/A");
			var label_svg = d3.select("#"+this.opt.annot_target+" .axisarea");
			//var label_svg = d3.select(".axisarea");
			var assigned_label = label_svg.selectAll(".labeltext").data(werte);
			
			assigned_label.enter().append("text")
					//.attr("y",function(d,i){ return +(i*-40);})
					.style("font-size","10px")
					//.attr("transform", function(d){ return "rotate(-65)"})
					//.attr("x", "10")
					.attr("transform", function(d,i) { 
							var translateVariableX = (i*40)+15;
							var translateVariableY = 50;
							var rotate_value = -65;
							return "translate(" + translateVariableX + ", " + translateVariableY + ") rotate(" + rotate_value + ")" })
					.text(function(d){return d;});

					  //.attr("transform", "translate(30,30)")
			add_tipsy({where : ".gene_box_rect", default_view:this.opt.default_view});	
	
	},
	

showAnnotationMatrix: function(args){
		var nodeindex = args.nodeindex;
		var annot_target = args.annot_target;
		var self = this;
		//var annot_panel = d3.select("#annotation_svg_container");
		var annot_panel = d3.select("#"+this.opt.annot_target+" .annotationarea");
		annot_panel.attr("width", 500);
		Object.size = function(obj) {
		    var size = 0, key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) size++;
		    }
		    return size;
			}
		var species2genes= new Object(); //
		var geneCounts = new Object();		



		// Ok, we want to plot all the annotation data
		// we need an order in how we plot the annotation


		var nonTextAnnotation = {biological_process:'test',molecular_function:'test',cellular_component:'test', protein_class:'0',sf_name:'1'};
		var all_bio_process = new Array, all_mol_function = new Array, all_cell_comp = new Array;
		var annotation4leaf = new Object();
		var bio_process_dict = new Object();
		var mol_function_dict = new Object();
		var cell_comp_dict = new Object();
		jQuery.each(self.annotation_data, function(seq_no,leaf){
			if(leaf.xref){
				// total counter for bio_process, mol_functio, cell_comp
				var no_bio_process = 0, no_mol_function = 0, no_cell_comp = 0;
				jQuery.each(leaf.xref, function(anot_no,annotation){
					if(nonTextAnnotation.hasOwnProperty(annotation.type)){
						if(annotation.type === "biological_process"){ 
							bio_process_dict[annotation.value] = 1;
							no_bio_process += 1;
						}
						if(annotation.type === "molecular_function"){ 
							mol_function_dict[annotation.value] = 1;
							no_mol_function += 1;
						}
						if(annotation.type === "cellular_component"){ 
							cell_comp_dict[annotation.value] = 1;
							no_cell_comp += 1;
						}
						if(annotation4leaf.hasOwnProperty(leaf.name)){
							annotation.id = leaf.name;
							annotation4leaf[leaf.name].push(annotation);	
						}
						else{
							var tmp_array = [];
							annotation.id = leaf.name;
							tmp_array.push(annotation);
							annotation4leaf[leaf.name] = tmp_array;
						}
					}
				})
			}
			all_bio_process.push(no_bio_process);
			all_mol_function.push(no_mol_function);
			all_cell_comp.push(no_cell_comp);
		});
		// get max no of elements for GO categories
		var go_molecular_function_terms = d3.max(all_mol_function); 
		var go_biological_process_terms = d3.max(all_bio_process); 
		var go_cellular_component_terms = d3.max(all_cell_comp); 

		// build an index into which column annotation should go.
		var annotation_index = {"protein_class" : 0, "sf_name" : 1};
		var index_counter = 2;
		for (var index in bio_process_dict){ annotation_index[index]  = index_counter++;};
		for (var index in mol_function_dict){ annotation_index[index]  = index_counter++;};
		for (var index in cell_comp_dict){ annotation_index[index]  = index_counter++;};
//			annotation_index["molecular_function"] = annotation_index["biological_process"]+go_biological_process_terms;
//			annotation_index["cellular_component"] = annotation_index["molecular_function"]+go_molecular_function_terms;

	// exit selection
		if(self.opt.two_window){
											this.nodeEnter = this.annot_nodeEnter;
		}			
		this.opt.cigarScale = d3.scale.linear().domain([0,this.opt.max_value]).range([0, this.opt.max_seq_representation]);
		
		
		
		
		//var annot_node = annot_target.selectAll("g.node").data(self.nodes,function(d){return d.taxon });
	
		// focussing on leaves
		jQuery.each(self.nodes, function(i,d){
			if(annotation4leaf[d.name]){
				d.annotation = annotation4leaf[d.name];
			}
		});
		var leaves = self.nodes.filter(function(t){
			return t.children === undefined  && nodeindex.hasOwnProperty(t.name) && t.annotation;
		});	
		
		// binding 
		// plotting stuff for known genes is ok
		// but plotting stuff for unknown...
		var known_genes_dict = new Object();
		var Gene2colorDictionary = new Object();
				var p=d3.scale.category20c();
				var r=p.range(); // ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", 
	                      // "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]
		  		var p_taxa=d3.scale.category10();
		  		var r_taxa=p_taxa.range();		  
				
				var i = 0;
				var i_taxa = 0;

		var annot_nodes = annot_target.selectAll("g").data(leaves);
	
	var add_annotation_nodes = function(d){
										
										var circles = true;	
										if(circles){
												d3.select(this).selectAll(".annotation_box").data(d.annotation).enter()
													//.append("rect")
													.append("circle")
													.attr("cx",function(e,i){
														if(annotation_index.hasOwnProperty(e.type)){
															var offset = annotation_index[e.type];
															var value = offset * 41 + 10;
															return value;
														}
														else{
															if(annotation_index.hasOwnProperty(e.value)){
																var offset = annotation_index[e.value];
																var value = offset * 41 + 10;
																return value;
															}
														}
													})
													.attr("cy",function(e,i){
															//return nodeindex[e.id] -480;
															
															var test = nodeindex[e.id];
															return nodeindex[e.id]+63;
															//return d.y
													})
													//.attr("width", 30)
													//.attr("height",10)
													.attr("r","6")
													.attr("class","annotation_box")
													.attr("fill", function(e){
															if(e.species_name === "Dasypus_novemcinctus"){
																var test;
															}
															
																return "grey";
														//"url(#line_gradient)";
													})
										            //.transition().duration(1750);
										}
									};		
		var annot_nodeEnter = annot_nodes.enter()
									.append("svg:g")
									.attr("class", "annotation_bla_node")
									.each(add_annotation_nodes);

						
		// enter selection
		
									//.on("mouseover", function(d){var test = this;self._highlightSpeciesData(test,d)})
									//.on("mouseout", function(d){var test = this;self._deHighlightSpeciesData(test,d)});
		

		
		// exit selection
		//annot_nodes.exit().remove();
		// add gene labels 
			var werte = d3.keys(annotation_index);
			//werte.push("N/A");
			var label_svg = d3.select("#"+this.opt.annot_target+" .axisarea");
			//var label_svg = d3.select(".axisarea");
			var assigned_label = label_svg.selectAll(".labeltext").data(werte);
			
			assigned_label.enter().append("text")
					//.attr("y",function(d,i){ return +(i*-40);})
					.style("font-size","10px")
					//.attr("transform", function(d){ return "rotate(-65)"})
					//.attr("x", "10")
					.attr("class", function(d){ 
						var test;
					})
					.attr("transform", function(d,i) { 
							var translateVariableX = (i*40)+10;
							var translateVariableY = 50;
							var rotate_value = -35;
							return "translate(" + translateVariableX + ", " + translateVariableY + ") rotate(" + rotate_value + ")" })
					.text(function(d){return d;});

					  //.attr("transform", "translate(30,30)")
			add_tipsy({where : ".gene_box_rect", default_view:this.opt.default_view});	
		self.opt.annotation_loaded = 1;
	},

	showDomains: function(args){
		var nodeindex = args.nodeindex;
		var annot_target = args.annot_target;
		var self = this;
		
		
		Object.size = function(obj) {
		    var size = 0, key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) size++;
		    }
		    return size;
		};
		
		var size = Object.size(nodeindex);

		// binding data 
		var annot_node = annot_target.selectAll("g.node").data(self.domain_data);
		this.annot_nodeEnter = annot_node.enter()
									.append("svg:g").filter(function(d){ 
											//if(nodeindex.hasOwnProperty(d.name)){ console.log("take "+d.name); }
											return nodeindex.hasOwnProperty(d.name)})
									.attr("class", "node")
									.on("mouseover", function(d){var test = this;self._highlightSpeciesData(test,d)})
									.on("mouseout", function(d){var test = this;self._deHighlightSpeciesData(test,d)});
									
		annot_node.exit().remove();
		if(self.opt.two_window){
					this.nodeEnter = this.annot_nodeEnter;
		}			
		draw_nodes({two_window:self.opt.two_window, nodeEnter : this.nodeEnter, nodeindex: nodeindex, node : annot_node, source : self.tree_data  , tree_representation_type : this.opt.tree_representation_type,
		species_tree : species_tree});
		var rects = draw_sequences({nodeEnter: this.nodeEnter, 
											domainScale : this.opt.domainScale , 
											leaf_group_x : this.opt.leaf_group_x, 
											sequence_start_y : this.opt.sequence_start_y,
											two_window : this.opt.two_window,
											nodeindex : nodeindex,
											visibility : ""});
	//

											console.log("after sequence drawn");

						// Domains
						var domains = rects.selectAll(".domain").data(function(d) { return d.domains; })
						var leaves = rects.selectAll(".leaf_label");
						//console.log(domains);
						//console.log(" after specified domains/leaves");
						console.log("setting domainscale to "+this.opt.max_seq_length);
						this.opt.domainScale = d3.scale.linear().domain([0,this.opt.max_seq_length]).range([0, this.opt.max_seq_representation]);
						console.log(" after domainscale");
						this.all_domains =  draw_domains({domains : domains, sequence_start_y : this.opt.sequence_start_y, 
															domainScale: this.opt.domainScale, sequence_rect_width : this.opt.sequence_rect_width,
															two_window : this.opt.two_window,
															leaf_group_x : this.opt.leaf_group_x,domain_colors : this.opt.domain_colors,visibility: "" });
	
	},
		
	showSpeciesTreeSilhouette: function(args){
		var annot_target = args.annot_target;
		var right2left = false;
		var class_type_path = "species_link";
		var class_type_node = "species_node";
		var i = 0;
		console.log("before reading tree")
			this.species_tree_data = this.readTree({'load_from_variable': this.opt.load_from_variable,'tree_format' : this.opt.formatOptions.tree,
													'tree_data': this.opt.species_tree,'tree_data_variable' : this.opt.json_tree_string,
													'load_from_web' : this.opt.load_from_web});

											    	var temp_tree = d3.layout.cluster();
		
											    	var temp_nodes = temp_tree.nodes(this.species_tree_data);
													// set correct height
            //var species_height = this.opt.species_nodes * 11;
            var species_height = temp_nodes.length * 11;							
            jQuery("#annotation_svg_container").height(species_height);
            console.log("d3.layout.cluster: "+species_height+", "+this.opt.div_width_half+"-"+this.opt.leaf_space+"");
										
			var available_width = this.opt.div_width_half-this.opt.leaf_space;							
			var species_tree = d3.layout.cluster()
										.separation(function(a, b) { return a.parent === b.parent ? 4 : 4; })
										.size([species_height , available_width ]);
										console.log("read tree");
			console.log(this.species_tree_data);
										
			// get the tree's nodes
			var species_nodes = species_tree.nodes(this.species_tree_data);
			
			
			
			
			var species_node = annot_target.selectAll("g.node").data(species_nodes, function(d) { 
				var value = d.id || (d.id = ++i);
				return value; 
			});
			
			this.speciesnodeEnter = species_node.enter().append("svg:g").attr("class", "node");
			
			draw_nodes({nodeEnter : this.speciesnodeEnter, node : species_node, source : this.species_tree_data, 
						right2left : right2left,
						circle_size : this.opt.circle_size,tree_representation_type : this.opt.tree_representation_type, availablewidth : this.opt.div_width_half});
		  // Update the links…
		    var link = annot_target.selectAll("path."+class_type_path).data(species_tree.links(species_nodes), function(d) { return d.target.id; });

			set_links({link: link, link_type : this.opt.link_type, duration : this.opt.duration, right2left : right2left, availablewidth : this.opt.div_width_half,
						species_silhouette: true, class_type : class_type_path, opacity: 0.3, node_thickness : 30});
			//var species_subtree_colors = get_subtree_color_data({nodeEnter : this.speciesnodeEnter, highlight_gene : this.opt.highlight_gene, target : this.opt.annot_target});
			//jQuery('.clade_tax_rect').remove();
			//var species_color_codes = color_subtrees({subtree_colors : species_subtree_colors, target : this.opt.annot_target, right2left : right2left});		
			//console.log("here are the color codes: ");
			//console.log(color_codes);

			//this._addLegend({target : "legend_panel", legend_dictionary : color_codes})
			//var how_to_color_hash = get_gene_color_stats({nodeEnter : this.speciesnodeEnter, highlight_gene : this.opt.highlight_gene, target : this.opt.target});


			// remove on update
			//jQuery('.tax_color_rect').remove();
			// Draw the little symbols for each node
			//var circles = draw_circles({nodeEnter : this.speciesnodeEnter, circle_size : this.opt.circle_size});
			// Draw images for species
			//var images = draw_images({nodeEnter : this.speciesnodeEnter , image_path : this.opt.image_path, right2left : right2left});
			// Bootstrap nodes
			// Draw taxon names (leaf nodes)
			//var texts = draw_taxon_names({nodeEnter : this.speciesnodeEnter, show_taxa: this.opt.show_taxa,
			//	right2left : right2left,highlight_gene : this.opt.highlight_gene,  model_organisms : this.opt.model_organisms});
			// Draw bootstrap values 
			//var bootstrap_texts = draw_bootstraps({nodeEnter : this.speciesnodeEnter, visibility : "hidden"});		
		
	},	
		
	showSpeciesTree: function(args){
		var annot_target = args.annot_target;
		var class_type_path = "species_link";
		var class_type_node = "species_node";
		var right2left = true;
		var self = this;
		console.log("before reading tree")
			this.species_tree_data = this.readTree({'load_from_variable': this.opt.load_from_variable,'tree_format' : this.opt.formatOptions.tree,
										'tree_data': this.opt.species_tree,'tree_data_variable' : this.opt.json_tree_string,
										'load_from_web' : this.opt.load_from_web});


            var species_height = this.opt.species_nodes * 5;
            jQuery("#annotation_svg_container").height(species_height);
            console.log("d3.layout.cluster: "+species_height+", "+this.opt.div_width_half+"-"+this.opt.leaf_space+"");
										
			var available_width = this.opt.div_width_half-this.opt.leaf_space;							
			var species_tree = d3.layout.cluster()
										.separation(function(a, b) { return a.parent === b.parent ? 1 : 1; })
										.size([species_height , available_width ]);
										
			console.log("read tree");
			console.log(this.species_tree_data);
			
			// get gt node data
			var geneNode2Coordinate = {};
			var speciesNode2Path = [];
			
			self._getGTNodeInfo({speciesNode2Path: speciesNode2Path, geneNode2Coordinate : geneNode2Coordinate})
			
										
			// get the tree's nodes
			var species_nodes = species_tree.nodes(this.species_tree_data);
			var i = 0;
			var species_node = annot_target.selectAll("g.node").data(species_nodes, function(d) { return d.id || (d.id = ++i); });
			
			this.speciesnodeEnter = species_node.enter().append("svg:g").attr("class", "node")
									.on("mouseover", function(d){
										var test = this;
										self._highlightGeneData(test,d)
									});
			
			draw_nodes({nodeEnter : this.speciesnodeEnter, node : species_node, source : this.species_tree_data  , 
						right2left : right2left,
						circle_size : this.opt.circle_size,tree_representation_type : this.opt.tree_representation_type, availablewidth : this.opt.div_width_half});
		  // Update the links…
		    var link = annot_target.selectAll("path.link").data(species_tree.links(species_nodes), function(d) { return d.target.id; });

			// ok, we want to show branches leading to species not in the gene tree with different lines

			set_links({link: link, link_type : this.opt.link_type, duration : this.opt.duration, right2left : right2left, availablewidth : this.opt.div_width_half,
								class_type : class_type_path, genePresence: geneNode2Coordinate});
			//var species_subtree_colors = get_subtree_color_data({nodeEnter : this.speciesnodeEnter, highlight_gene : this.opt.highlight_gene, target : this.opt.annot_target});
			//jQuery('.clade_tax_rect').remove();
			//var species_color_codes = color_subtrees({subtree_colors : species_subtree_colors, target : this.opt.annot_target, right2left : right2left});		
			//console.log("here are the color codes: ");
			//console.log(color_codes);

			//this._addLegend({target : "legend_panel", legend_dictionary : color_codes})
			//var how_to_color_hash = get_gene_color_stats({nodeEnter : this.speciesnodeEnter, highlight_gene : this.opt.highlight_gene, target : this.opt.target});


			// remove on update
			//jQuery('.tax_color_rect').remove();
			// Draw the little symbols for each node
			var circles = draw_circles({nodeEnter : this.speciesnodeEnter, circle_size : this.opt.circle_size});
			// Draw images for species
			//var images = draw_images({nodeEnter : this.speciesnodeEnter , image_path : this.opt.image_path, right2left : right2left});
			// Bootstrap nodes
			// Draw taxon names (leaf nodes)
			var texts = draw_taxon_names({nodeEnter : this.speciesnodeEnter, show_taxa: this.opt.show_taxa,
				right2left : right2left,highlight_gene : this.opt.highlight_gene,  model_organisms : this.opt.model_organisms,
				genePresence : geneNode2Coordinate});
			// Draw bootstrap values 
			//var bootstrap_texts = draw_bootstraps({nodeEnter : this.speciesnodeEnter, visibility : "hidden"});		
		
		
			// now we save the coordinates for gene tree and species tree nodes
			var geneNode2Coordinate = {};
			var speciesNode2Path = [];
			self.selected_nodes.forEach(function(d) {
				var coordinates = {"y":d.y, "x":d.x};
				geneNode2Coordinate[d.taxon] = coordinates;
					/*if(geneNode2Coordinate.hasOwnProperty(d.taxon)){
						var tmp_array = [];
						tmp_array =  geneNode2Coordinate[d.taxon];
						tmp_array.push(coordinates);
						geneNode2Coordinate[d.taxon] = tmp_array;
					}
					else{
						var tmp_array = [];
						tmp_array.push(coordinates);
						geneNode2Coordinate[d.taxon] = coordinates;
					}*/	
				//d.y = d.depth * 180; 
			});
			/*species_nodes.forEach(function(d) {
				
				var species_name = d.name;
				if(geneNode2Coordinate.hasOwnProperty(species_name)){
					var gene4species = geneNode2Coordinate[species_name];
					if(gene4species){
						var path_coord = {
							"species_name":species_name,
							"source": {"x":d.x,"y": d.y},
							"target": {"x":gene4species.x, "y":gene4species.y}
						}
						speciesNode2Path.push(path_coord);
					}
				}
				else{
					//console.log("skipping "+species_name);

				}
			});*/
		
		//  on mouseover
		// 	
		   // var btw_link = d3.select("#"+self.opt.target).selectAll("path.link").data(speciesNode2Path);
		//	set_links({link: btw_link, link_type : this.opt.link_type, duration : this.opt.duration, right2left : right2left, availablewidth : this.opt.div_width_half});
		//	return speciesNode2Path;
		
	},
	_getGTNodeInfo: function(args){
		var self = this;
		
		var geneNode2Coordinate = args.geneNode2Coordinate;
		var speciesNode2Path = args.speciesNode2Path;
		self.selected_nodes.forEach(function(d) {
			var coordinates = {"y":d.y, "x":d.x};
			geneNode2Coordinate[d.taxon] = coordinates;
				/*if(geneNode2Coordinate.hasOwnProperty(d.taxon)){
					var tmp_array = [];
					tmp_array =  geneNode2Coordinate[d.taxon];
					tmp_array.push(coordinates);
					geneNode2Coordinate[d.taxon] = tmp_array;
				}
				else{
					var tmp_array = [];
					tmp_array.push(coordinates);
					geneNode2Coordinate[d.taxon] = coordinates;
				}*/	
			//d.y = d.depth * 180; 
		});
		/*species_nodes.forEach(function(d) {
			
			var species_name = d.name;
			if(geneNode2Coordinate.hasOwnProperty(species_name)){
				var gene4species = geneNode2Coordinate[species_name];
				if(gene4species){
					var path_coord = {
						"species_name":species_name,
						"source": {"x":d.x,"y": d.y},
						"target": {"x":gene4species.x, "y":gene4species.y}
					}
					speciesNode2Path.push(path_coord);
				}
			}
			else{
				//console.log("skipping "+species_name);

			}
		});*/
		
	},
	
	setTooltips: function(){
		add_tipsy({where : ".leaf_label", default_view:this.opt.default_view});	
		add_tipsy({where : ".domain", default_view:this.opt.default_view});	
		add_tipsy({where : ".clade_tax_rect", default_view:this.opt.default_view});	
		
	},
	
	/*
	 * Sets controls.
	 * @param {string} seq The sequence strand.
	 * @param {string} [identifier] Sequence identifier.
	 * 
	 * @example 
	 * myTree.setControls();
	 * 
	 */
	setControls: function(){},
	
	/*
	 * Sets domain colors.
	 * @param {string} seq The sequence strand.
	 * @param {string} [identifier] Sequence identifier.
	 * 
	 * @example 
	 * myTree.setDomainColors();
	 * 
	 */
	setDomainColors: function(arg){
		var target = arg.target;
		console.log("set domain colors to: "+target);
		var domain_colors = new Object();
		domain_colors[0] = "domain_gradient";
		domain_colors[1] = "domain_gradient2";
		domain_colors[2] = "domain_gradient3";
		domain_colors[3] = "domain_gradient4";
		domain_colors[4] = "domain_gradient5";
		domain_colors[5] = "domain_gradient6";
		var gradient = target.append("svg:defs").append("svg:linearGradient")
		.attr("id", "line_gradient")
		.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "0").attr("x2", "2").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
		gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#999999");
		gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "40%").attr("stop-color", "#eeeeee");
		gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#cccccc");
		gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#999999");
		
		var gradient2 = target.append("svg:defs").append("svg:linearGradient")
		.attr("id", "domain_gradient")
		.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.12").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
		gradient2.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#FF8585");
		gradient2.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "50%").attr("stop-color", "#7a1e74");
		gradient2.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#7a1e74");
		gradient2.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#ffffff");

		var gradient3 = target.append("svg:defs").append("svg:linearGradient")
		.attr("id", "domain_gradient2")
		.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.12").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
		gradient3.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#0099CC");
		gradient3.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "50%").attr("stop-color", "#7a1e74");
		gradient3.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#7a1e74");
		gradient3.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#ffffff");

		var gradient4 = target.append("svg:defs").append("svg:linearGradient")
		.attr("id", "domain_gradient3")
		.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.12").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
		gradient4.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#CCF2CC");
		gradient4.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "50%").attr("stop-color", "#7a1e74");
		gradient4.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#7a1e74");
		gradient4.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#ffffff");

		var gradient5 = target.append("svg:defs").append("svg:linearGradient")
		.attr("id", "domain_gradient4")
		.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.12").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
		gradient5.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#14101f");
		gradient5.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "50%").attr("stop-color", "#7a1e74");
		gradient5.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#7a1e74");
		gradient5.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#ffffff");

		var gradient6 = target.append("svg:defs").append("svg:linearGradient")
		.attr("id", "domain_gradient5")
		.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.12").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
		gradient6.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#623e32");
		gradient6.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "50%").attr("stop-color", "#7a1e74");
		gradient6.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#7a1e74");
		gradient6.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#ffffff");
		
		this.opt.domain_colors = domain_colors;
	},
	
	

	
	_collapseNode: function(d){
		//var d = arg.d;
		console.log("collapsing "+d.name);
		//d3.select(d).append("svg:circle")
		  //        .attr("r", function(d){ 
			//		  return d.children ? circle_size : 0; })
		    //      .attr("fill", function(d){return d.duplication == "Y"? "red":"green"})
		if (d.children) {
			d._collapsed_children = get_all_childs(d).length - 1;
			d._children = d.children;
			d.children = null;
			
		} else {
			d.children = d._children;
			d._children = null;
		}
		this.update_tree(d);
		this.update_annotation(d);
	},	
	expandNode: function(arg){},	

	
	/*
	 * Get maximal length of domain/aligned_seq.
	 * @param {array} leaves The leaves of the tree with annotated domains.
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
	
	/*
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
	 * myTree._pruneTree();
	 * 
	 */
	_pruneTree: function (selected_nodes) {
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
	_focus: function(d) {
		var self = this;
			
		// determine the subset of 
		if(self.opt.current_d){
			self.root = self.opt.current_d;
		}
		else{
			self.root = d;
		}
		self.update_tree();
		self.update_annotation();
	}
	,
	_reset_tree: function(d) {
		
		var self = this;
		
		// determine the subset of 

		this.root = this.all_data;
		self.update_tree();
		self.update_annotation();
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
	
	
	_addLegend: function (args) {
		var self = this;
		var target = args.target;
		var legend_dictionary = args.legend_dictionary;
		var html_text = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1'>";
		
		//html_text += "<ul>";
		for (var key in legend_dictionary) {
			console.log("<span style='background-color:"+legend_dictionary[key]+"'>"+key+"</span><br>");
			html_text += "<rect width='10' height='5'  style='fill:"+legend_dictionary[key]+";stroke-width:1;stroke:rgb(0,0,0)'/><text>"+key+"</text>";
			//html_text += "<li><span style='position:static;opacity:0.1;background-color:"+legend_dictionary[key]+"'><font style='color:black'>"+key+"</font></span></li>";
		}
		//html_text += "</ul>";
		html_text += "</svg>";
		
		jQuery("#"+target).html(html_text);
		console.log("added to #legend_panel: "+html_text);
	},

	_buildContextMenu: function(d){
			var self = this;
			jQuery("<li class=\"context-menu-item icon icon-cut\"><span>Information: </span></li>").appendTo('#my_custom_menu ul');
			jQuery("<li class=\"context-menu-item icon icon-cut\"><a id='collapseNode' href='#' onclick=self._collapseNode()<span>collapse: </span></a></li>").appendTo('#my_custom_menu ul');
			jQuery("<li class=\"context-menu-item icon icon-cut\"><a id='focus' href='#' <span id='focus'>focus on this node: </span></a></li>").appendTo('#my_custom_menu ul');
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
	_setTaxaToShow: function (){
		
		var show_taxa = new Object();
		show_taxa['Metazoa'] = 1;
		show_taxa['Bilateria'] = 1;
		show_taxa['Mammalia'] = 1;
		show_taxa['Dipteria'] = 1;
		show_taxa['Primates'] = 1;
		show_taxa['Arabidopsis_thaliana'] = 1;
		
		
		this.opt.show_taxa = show_taxa;
	},
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


