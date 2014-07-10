var geneTree = function () {

	var image_path;
	var root;
	var vis;
	var animGroup;
	var domain_txt;
	var circle_size = 3;
	var duplication_circle_size = 15;
	var sequence_rect_width = 12;
	var leaf_group_x = 188;
	var highlight_gene;
	var sequence_start_y = 230;
	var domain_div;
	var link_type = "elbow";
	var load_from_variable;
	var json_tree_string;
	

	// Defined showable taxa
		var show_taxa = new Object();
		show_taxa['Metazoa'] = 1;
		show_taxa['Bilateria'] = 1;
		show_taxa['Mammalia'] = 1;
		show_taxa['Dipteria'] = 1;
		show_taxa['Primates'] = 1;
		show_taxa['Arabidopsis_thaliana'] = 1;

		var domain_colors = new Object();
		domain_colors[0] = "domain_gradient";
		domain_colors[1] = "domain_gradient2";
		domain_colors[2] = "domain_gradient3";
		domain_colors[3] = "domain_gradient4";
		domain_colors[3] = "domain_gradient5";

		var model_organisms = new Object(); // or just {}
		model_organisms['Homo_sapiens'] = "red";
		model_organisms['Mus_musculus'] = "blue";
		model_organisms['Xenopus_tropicalis'] = "blue";
		model_organisms['Gallus_gallus'] = "blue";
		model_organisms['Drosophila_melanogaster'] = "blue";
		model_organisms['Arabidopsis_thaliana'] = "blue";
		model_organisms['Caenorhabditis_elegans'] = "blue";





		//var no_internal_nodes;

		var w, h, i, duration, root, leaf_space;
		var margin, width, height;
		var tree;
		var domainScale = d3.scale.linear().domain([20,4000]).range([1, 250]);

		
	// Returned closure
		var gTree = function (args) {
				//function draw_d3_tree(args){
				json_tree = args.json_tree;
				newick_tree = args.newick_tree;
				no_genes = args.no_genes;
				highlight_gene = args.highlight_gene;
				load_from_variable = args.load_from_variable;
				json_tree_string = args.json_tree_string;
				h = no_genes * 10;
				image_path = args.image_path;
				var id_label;
		
				 w = "1000", h = h, i = 0, duration = 100, root;
	
				var leaf_space = "600";
					margin = {top: 0, right: 0, bottom: 0, left: 0},
					width = 960 - margin.left - margin.right,
					height = 500 - margin.top - margin.bottom;

				var diagonal = d3.svg.diagonal() .projection(function(d) { return [d.y, d.x]; });

				tree  = d3.layout.cluster()
								 .separation(function(a, b) { return a.parent === b.parent ? 4 : 4; })
								 .size([h, w -leaf_space]);

				vis = d3.select("#tree")
						.append("svg:svg") 
						.attr("width", w) 
						.attr("height", h);
		
				vis.attr("transform", "translate(40,40)")
					//.attr("pointer-events", "all")
					.append('svg:g')
					//.attr("transform", "translate(40,0)")
					//.attr("pointer-events", "all")
					//.call(d3.behavior.zoom().on("zoom", redraw))
					//.append('svg:g')
					;
				// Add the clipping path
				vis.append("svg:clipPath").attr("id", "clipper")
					.append("svg:rect")
					.attr('id', 'clip-rect');


					var gradient = vis.append("svg:defs").append("svg:linearGradient")
					.attr("id", "line_gradient")
					.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "0").attr("x2", "2").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
					gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#999999");
					gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "40%").attr("stop-color", "#eeeeee");
					gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#cccccc");
					gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#999999");


					
					
					
					var gradient2 = vis.append("svg:defs").append("svg:linearGradient")
					.attr("id", "domain_gradient")
					.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.12").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
					gradient2.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#FF8585");
					gradient2.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "50%").attr("stop-color", "#7a1e74");
					gradient2.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#7a1e74");
					gradient2.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#ffffff");

					var gradient3 = vis.append("svg:defs").append("svg:linearGradient")
					.attr("id", "domain_gradient2")
					.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.12").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
					gradient3.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#0099CC");
					gradient3.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "50%").attr("stop-color", "#7a1e74");
					gradient3.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#7a1e74");
					gradient3.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#ffffff");

					var gradient4 = vis.append("svg:defs").append("svg:linearGradient")
					.attr("id", "domain_gradient3")
					.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.12").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
					gradient4.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#CCF2CC");
					gradient4.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "50%").attr("stop-color", "#7a1e74");
					gradient4.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#7a1e74");
					gradient4.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#ffffff");

					var gradient5 = vis.append("svg:defs").append("svg:linearGradient")
					.attr("id", "domain_gradient4")
					.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.12").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
					gradient5.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#14101f");
					gradient5.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "50%").attr("stop-color", "#7a1e74");
					gradient5.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#7a1e74");
					gradient5.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#ffffff");

					var gradient6 = vis.append("svg:defs").append("svg:linearGradient")
					.attr("id", "domain_gradient5")
					.attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("x1", "0").attr("y1", "1").attr("x2", "6.12").attr("y2", "0").attr("gradientTransform", "matrix(1,0,0,1,0,0)");
					gradient6.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "0%").attr("stop-color", "#623e32");
					gradient6.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "50%").attr("stop-color", "#7a1e74");
					gradient6.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "60%").attr("stop-color", "#7a1e74");
					gradient6.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)").attr("offset", "100%").attr("stop-color", "#ffffff");



				if(load_from_variable){
										console.log("load from variable selected");
										json = JSON.parse( json_tree_string );
										gTree.update(root = json);
				}
				else if(json_tree ){
					console.log("json selected");
				 	d3.json(json_tree, function(json) {
					//  json = JSON.parse( myjson );
					  gTree.update(root = json);
				});
				}
				else{
					console.log("newick selected");
					d3.text(newick_tree, function(text) {
				  	var x = newick.parse(text);
					var cluster = d3.layout.cluster()
										    .size([360, 1])
										    .sort(null)
										    .value(function(d) { return d.length; })
										    .children(function(d) { return d.branchset; })
										    .separation(function(a, b) { return 1; });
				  	var nodes = cluster(x);
				  	console.log(x);
					gTree.update(root = nodes);
					});
				}
				
		}
	
	
	
		gTree.update = function (source){
			//function update(source) {
	
			  // Compute the new tree layout.
			  var nodes = tree.nodes(root);
			  console.log("tree has "+nodes.length+" nodes");
			  // Update the nodes…
				var node = d3.select("#tree svg").selectAll("g.node").data(nodes, function(d) { return d.id || (d.id = ++i); });
				var nodeEnter = node.enter().append("svg:g")
											.attr("class", "node")
											.attr("transform", function(d) { 
												return "translate(" + source.y0 + "," + source.x0 + ")"; });

				// code to draw axis 
				var annotation_scale = d3.scale.linear().domain([0, 4000]).range([0, 400]);
				var xAnnotation_axis = d3.svg.axis()
										    .scale(annotation_scale)
											//.tickValues([0, 4, 7, 1000, 2000, 3000, 4000])
											.orient("bottom");				

				//d3.select("#tree svg").append("g")
				//      .attr("class", "x axis")
				//	  .attr("transform", "translate(400,15)")
				//      .call(xAnnotation_axis);
				  
		  		//d3.select("#tree svg").append("text")      // text label for the x axis
		  		//	        .attr("x", 600 )
		  		//	        .attr("y",  8 )
		  		//	        .style("text-anchor", "middle")
		  		//	        .text("Sequence length");

			
				  
				  		
				draw_nodes({nodeEnter : nodeEnter,node : node ,source : source  })
			  // Update the links…
			  var link = d3.select("#tree svg")
						.selectAll("path.link")
						.data(tree.links(nodes), function(d) { return d.target.id; });

				set_links({link: link, link_type : link_type, duration : duration});


		// CIRCLE     
			var circles = draw_circles({nodeEnter : nodeEnter, circle_size : circle_size});
		// Text
			var texts = draw_taxon_names({nodeEnter : nodeEnter, show_taxa : show_taxa, highlight_gene : highlight_gene,  model_organisms : model_organisms});
		// Bootstrap 
			var texts = draw_bootstraps({nodeEnter : nodeEnter, visibility : "hidden"});
		// IMAGE
			draw_images({nodeEnter : nodeEnter , image_path : image_path});
		// Sequences
			var rects = draw_sequences({nodeEnter: nodeEnter, 
										domainScale : domainScale , 
										leaf_group_x : leaf_group_x, 
										sequence_start_y : sequence_start_y,
										visibility : "hidden"});
		// Domains
			var domains = rects.selectAll(".domain").data(function(d) { return d.domains; })
			var all_domains =  draw_domains({domains : domains, 
											sequence_start_y : sequence_start_y, 
											domainScale:domainScale, 
											sequence_rect_width : sequence_rect_width,
											leaf_group_x : leaf_group_x,
											domain_colors : domain_colors,
											visibility: "hidden" });

		// Conservation plots
			console.log("draw conservation plots");
			var cons_rects = draw_aligned_sequences({nodeEnter: nodeEnter, 
													domainScale : domainScale , 
													leaf_group_x : leaf_group_x, 
													sequence_start_y : sequence_start_y,
													visibility: "hidden"});
			// Gaps
			var gaps = rects.selectAll(".gaps").data(function(d) { return d.domains; })
			var all_gap_positions =  draw_gaps({gaps : gaps, 
												sequence_start_y : sequence_start_y, 
												domainScale:domainScale, 
												sequence_rect_width : sequence_rect_width,
												leaf_group_x : leaf_group_x,
												visibility: "hidden" });

		// Synteny
			var synteny_rects = draw_synteny_seqs({nodeEnter: nodeEnter, 
													domainScale : domainScale , 
													leaf_group_x : leaf_group_x, 
													sequence_start_y : sequence_start_y,
													visibility: "hidden"});
			// Synteny blocks
			//var syntenties = synteny_rects.selectAll(".synteny").data(function(d) { return d.syntenies; })
			//var all_syntenies =  draw_synteny({syntenties : syntenties, 
			//								sequence_start_y : sequence_start_y, 
			//								domainScale:domainScale, 
			//								sequence_rect_width : sequence_rect_width,
			//								leaf_group_x : leaf_group_x,
			//								visibility : "hidden" });


		// Domain mouseover   
			//var dom_labels = rects.selectAll(".domainlabel").data(function(d) { return d.domains; });
			//add_tipsy({ where : ".domain"});
			//add_tipsy({ where : ".leaf_label"});
			animGroup = vis.append("svg:g").attr("clip-path", "url(#clipper)");
	
	
			// default options
			show_leaf_swissprot();
			show_domains();
		
			// Cache the UI elements
			ui = {
				svgRoot: vis,
				nodeGroup: node,
				linkGroup: link,
				animGroup: animGroup
			};
	
			  // Stash the old positions for transition.
			  nodes.forEach(function(d) {
				d.x0 = d.x;
				d.y0 = d.y;
			  });
	
			}
		
		
			//d3.select(self.frameElement).style("height", "2000px");   

	
		   gTree.duration = function (d) {
	          if (!arguments.length) {
	             return duration;
	         }
	         duration = d;
	         return gTree;
	       };
	       gTree.sequences = function (d) {
	          // Sequences
			var rects = draw_sequences({nodeEnter: nodeEnter, 
										domainScale : domainScale , 
										leaf_group_x : leaf_group_x, 
										sequence_start_y : sequence_start_y,
										visibility : ""});
			// Domains
			var domains = rects.selectAll(".domain").data(function(d) { return d.domains; })
			var all_domains =  draw_domains({domains : domains, 
											sequence_start_y : sequence_start_y, 
											domainScale:domainScale, 
											sequence_rect_width : sequence_rect_width,
											leaf_group_x : leaf_group_x,
											domain_colors : domain_colors,
											visibility: "" });
          
          
	         return gTree;
	    };
       
       
	
		return gTree;

};
