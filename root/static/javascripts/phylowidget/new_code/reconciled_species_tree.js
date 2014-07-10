
var image_path;
var root;
var vis;
var animGroup;
var domain_txt;
var circle_size = 4;
var duplication_circle_size = 15;
var sequence_rect_width = 12;
var leaf_group_x = 188;
var sequence_start_y = 180;
var node_thickness = "15px";
var domain_div;
var domain2color = {};
var link_type = "elbow";

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

// Outgroup
    var taxon_colors = new Object(); // or just {}
    taxon_colors['Protostomia'] = "blue";
    taxon_colors['Deuterostomia'] = "green";
    taxon_colors['Mammalia'] = "darkgreen";
    
    taxon_colors['Primates'] = "lightgreen";
    taxon_colors['Homininae'] = "lightgreen";
    taxon_colors['Hominidae'] = "lightgreen";
    taxon_colors['Hominoidea'] = "lightgreen";
    taxon_colors['Catarrhini'] = "lightgreen";
    taxon_colors['Simiiformes'] = "lightgreen";
    taxon_colors['Haplorrhini'] = "lightgreen";
    taxon_colors['Strepsirrhini'] = "lightgreen";
    
    taxon_colors['Arabidopsis_thaliana'] = "red";
    taxon_colors['Arabidopsis_thaliana'] = "red";
    taxon_colors['Ascomycota'] = "red";
    taxon_colors['Codonosigidae'] = "red";


    // Primates
    taxon_colors['Homo_sapiens'] = "lightgreen";
    taxon_colors['Pan_troglodytes'] = "lightgreen";
    taxon_colors['Gorilla_gorilla'] = "lightgreen";
    taxon_colors['Pongo_abelii'] = "lightgreen";
    taxon_colors['Nomascus_leucogenys'] = "lightgreen";
    taxon_colors['Macaca_mulatta'] = "lightgreen";
    taxon_colors['Callithrix_jacchus'] = "lightgreen";
    taxon_colors['Tarsius_syrichta'] = "lightgreen";
    taxon_colors['Microcebus_murinus'] = "lightgreen";
    taxon_colors['Callithrix_jacchus'] = "lightgreen";
    taxon_colors['Callithrix_jacchus'] = "lightgreen";
    taxon_colors['Callithrix_jacchus'] = "lightgreen";




    //var no_internal_nodes;

    var w, h, i, duration, root, leaf_space;
    var margin, width, height;
    var tree;
    var domainScale = d3.scale.linear().domain([20,4000]).range([1, 250]);



function draw_species_shape_tree(args){
	json_tree = args.json_tree;

    console.log("no_genes is: "+args.no_genes);
    console.log("tree  is: "+args.json_tree);
    console.log("alignment_length: "+args.alignment_length);
    no_genes = args.no_genes;
     h = no_genes * 10;
    image_path = args.image_path;
    var id_label;
     w = "1000", h = h, i = 0, duration = 1000, root;
    
     var leaf_space = "800";
        margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
    var diagonal = d3.svg.diagonal() .projection(function(d) { return [d.y, d.x]; });

    tree  = d3.layout.cluster() .separation(function(a, b) { return a.parent === b.parent ? 4 : 4; }) .size([h, w -leaf_space])

    vis = d3.select("#tree").append("svg:svg") .attr("width", w) .attr("height", h);
        
    vis.attr("transform", "translate(40,0)")
        .attr("pointer-events", "all")
        .append('svg:g')
        .attr("transform", "translate(40,0)")
        .attr("pointer-events", "all")
        .call(d3.behavior.zoom().on("zoom", redraw))
        .append('svg:g');
    
    //vis.append('svg:rect')
    //.attr('width', w)
    //.attr('height', h)
    //.attr('fill', 'white');


    
    
    // Add the clipping path
    vis.append("svg:clipPath").attr("id", "clipper")
        .append("svg:rect")
        .attr('id', 'clip-rect');
    // Add the clipping path
         // vis.append("svg:clipPath").attr("id", "clipper")
//              .append("svg:rect")
//              .attr('id', 'clip-rect');


var gradient = vis.append("svg:defs")
  .append("svg:linearGradient")
    .attr("id", "line_gradient")
    .attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)")
    .attr("x1", "0")
    .attr("y1", "0")
    .attr("x2", "2")
    .attr("y2", "0")
    .attr("gradientTransform", "matrix(1,0,0,1,0,0)");
 gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)")
    .attr("offset", "0%").attr("stop-color", "#999999");

 gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)")
    .attr("offset", "40%").attr("stop-color", "#eeeeee");

 gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)")
    .attr("offset", "60%").attr("stop-color", "#cccccc");

 gradient.append("svg:stop").attr("webkit-tap-highlight-color", "rgba(0, 0, 0, 0)")
    .attr("offset", "100%").attr("stop-color", "#999999");


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




     d3.json(json_tree, function(json) {
    //  json = JSON.parse( myjson );
      update(root = json);
    });
    
    }
    
    function update(source) {
    
      // Compute the new tree layout.
      var nodes = tree.nodes(root);
      console.log("tree has "+nodes.length+" nodes");
      // Update the nodes…
        var node = d3.select("#tree svg").selectAll("g.node").data(nodes, function(d) { return d.id || (d.id = ++i); });
        var nodeEnter = node.enter().append("svg:g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; });

		draw_nodes({nodeEnter : nodeEnter,node : node ,  })
      
	   
      // Update the links…
      var link = d3.select("#tree svg").selectAll("path.link")
          .data(tree.links(nodes), function(d) { return d.target.id; });
    
    	set_links({link: link, link_type : link_type, node_thickness: node_thickness});


// CIRCLE     
// 	var circles = draw_circles({nodeEnter : nodeEnter});
// Text
// 	var texts = draw_taxon_names({nodeEnter : nodeEnter, show_taxa : show_taxa});
// 
// Bootstrap 
// 	var texts = draw_bootstraps({nodeEnter : nodeEnter, visibility : "hidden"});
// 
// IMAGE
// 	draw_images({nodeEnter : nodeEnter , image_path : image_path});
// 
// 
// Sequences
// 	var rects = draw_sequences({nodeEnter: nodeEnter, 
// 								domainScale : domainScale , 
// 								leaf_group_x : leaf_group_x, 
// 								sequence_start_y : sequence_start_y,
// 								visibility : "hidden"});
// 	// Domains
// 	var domains = rects.selectAll(".domain").data(function(d) { return d.domains; })
// 	var all_domains =  draw_domains({domains : domains, 
// 									sequence_start_y : sequence_start_y, 
// 									domainScale:domainScale, 
// 									sequence_rect_width : sequence_rect_width,
// 									visibility: "hidden" });
// 
// Conservation plots
// 	console.log("draw conservation plots");
// 	var cons_rects = draw_aligned_sequences({nodeEnter: nodeEnter, 
// 											domainScale : domainScale , 
// 											leaf_group_x : leaf_group_x, 
// 											sequence_start_y : sequence_start_y,
// 											visibility: "hidden"});
// 	// Gaps
// 	var gaps = rects.selectAll(".gaps").data(function(d) { return d.domains; })
// 	var all_gap_positions =  draw_gaps({gaps : gaps, 
// 										sequence_start_y : sequence_start_y, 
// 										domainScale:domainScale, 
// 										sequence_rect_width : sequence_rect_width,
// 										visibility: "hidden" });
// 
// Synteny
// 	var synteny_rects = draw_synteny_seqs({nodeEnter: nodeEnter, 
// 											domainScale : domainScale , 
// 											leaf_group_x : leaf_group_x, 
// 											sequence_start_y : sequence_start_y,
// 											visibility: ""});
// 	// Synteny blocks
// 	var syntenties = synteny_rects.selectAll(".synteny").data(function(d) { return d.syntenies; })
// 	var all_domains =  draw_synteny({syntenties : syntenties, 
// 									sequence_start_y : sequence_start_y, 
// 									domainScale:domainScale, 
// 									sequence_rect_width : sequence_rect_width,
// 									visibility : "" });


// Domain mouseover   
    //var dom_labels = rects.selectAll(".domainlabel").data(function(d) { return d.domains; });
	add_tipsy({ where : ".domain"});
    
    animGroup = vis.append("svg:g").attr("clip-path", "url(#clipper)");
    
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
        d3.select(self.frameElement).style("height", "2000px");   



// External functions


/*
   Utility function: populates the <FORM> with the SVG data
   and the requested output format, and submits the form.
*/
