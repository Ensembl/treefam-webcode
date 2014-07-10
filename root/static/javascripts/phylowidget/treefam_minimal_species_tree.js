var pie = d3.layout.pie().sort(null);
	var color = d3.scale.category20();
	//var colors = ["red","green"];
	var colors = ["DarkGreen","PaleGreen"];

	var blank_circles;
    var radius = 20;
	
	var arc = d3.svg.arc()    
    .outerRadius(10);

function draw_minimal_species_tree(minimal_species_tree_json){

	
	var minimal_species_tree_w = "400",
		minimal_species_tree_h = "300",
		i = 0,
		duration = 500,
		minimal_species_tree_minimal_species_tree;
	
	var margin = {top: 0, right: 10, bottom: 0, left: 0},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;
	

	//var zoom = d3.behavior.zoom(), zoomFactor = 300;
	
	
	var diagonal = d3.svg.diagonal()
		.projection(function(d) { return [d.y, d.x]; });
	
	var minimal_species_tree = d3.layout.cluster()
	.separation(function(a, b) { return a.parent === b.parent ? 4 : 4; })
	//.separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; })
	.size([minimal_species_tree_h, minimal_species_tree_w - 200]);
	
	var domainOnlyScale = d3.scale.linear().domain([0,7]);
	
	

	
	
// minimal_species_tree	
	var minimal_species_tree_vis = d3.select("#minimal_species_tree").append("svg:svg")
		.attr("width", minimal_species_tree_w)
		.attr("height", minimal_species_tree_h)
		//.attr("viewBox","0 0 50 50")
	  	.attr("transform", "translate(40,40)")
		//.attr("pointer-events", "all")
	    .append('svg:g')
    	.attr("transform", "translate(80,0)");
		//.attr("pointer-events", "all")
        //.call(d3.behavior.zoom().on("zoom", redraw))
        //.append('svg:g');
	
	//zoom.scale(zoomFactor);
	// minimal_species_tree_vis.append('svg:rect')
//     .attr('width', w)
//     .attr('height', h)
//     .attr('fill', 'white');
// 	
	
	 d3.json(minimal_species_tree_json, function(minimal_tree_json) {

	
	  update_minimal_species_tree(minimal_species_tree_root = minimal_tree_json);
	});
	
	function update_minimal_species_tree(source) {
	
	  // Compute the new minimal_species_tree layout.
	  var minimal_species_tree_nodes = minimal_species_tree.nodes(minimal_species_tree_root);
	  //minimal_species_tree_vis.attr({ width: 40000, height: 500});
	  // Update the nodes…
		var minimal_species_tree_node = minimal_species_tree_vis.selectAll("g.node").data(minimal_species_tree_nodes, function(d) { return d.id || (d.id = ++i); });
	
		var minimal_species_tree_nodeEnter = minimal_species_tree_node.enter().append("svg:g")
			.attr("class", "node")
			.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; });
	 
		//console.log("checking dataset.apples");
		//console.log(dataset.apples);
		//console.log("checking pie(dataset.apples)");
		//console.log(pie(dataset.apples));
		
		
		var pies = minimal_species_tree_vis.selectAll("g.node").data(minimal_species_tree_nodes, function(d) { return d.id || (d.id = ++i); });

	
 blank_circles = minimal_species_tree_node.append("svg:g").attr("class","blank_circles");
 blank_circles2 = blank_circles.append("svg:g").attr("class","blank_circles2");


								blank_circles.selectAll("path")
 		                       .data(function(d) {return pie(d.gene_presence); })
     		  				   .enter().append("svg:path")
 			    			   .attr("fill", function(d, i) { return colors[i]; })
			    			   .attr("class", "gene_pies")
			    			   //.style("visibility","visible")
 				     		   .attr("d", arc);
 				     		   
								blank_circles2.selectAll("path")
 		                       .data(function(d) {return pie(d.species_presence); })
     		  				   .enter().append("svg:path")
 			    			   .attr("fill", function(d, i) { return colors[i]; })
			    			   .attr("class", "species_pies")
			    			   .style("visibility","visible")
 				     		   .attr("d", arc);
	

// TEXT		
		var text = minimal_species_tree_nodeEnter.append("svg:text")
			.attr("x", function(d) { return d.children ? -70 : 12; })
			.attr("y", function(d) { return d.children ? -10 : 4; })
			.attr("class", "labels")
			.text(function(d) { 
						return d.name; 
			});		

jQuery('.blank_circles').tipsy({ 
        gravity: 'sw', 
        html: true, 
        title: function() {
//          var d = this.__data__, c = colors(d.i);
           var c = "red";
           console.log("in blank_circles tipsy");
           var e = this.__data__;
           var species_presence_array = e.species_presence;
           var genes_presence_array = e.gene_presence;
           console.log(genes_presence_array);
//           var return_string = species_presence_array[1]+' '+e.name+' species have this gene ('+(species_presence_array[0]+species_presence_array[1])+' '+e.name+' total)';
  //         return_string = return_string+"<br>There are "+genes_presence_array[1]+" genes in this clades (the whole family has: "+(genes_presence_array[0]+genes_presence_array[1])+")";
//          return species_presence_array[1]+' '+e.name+' species have this gene ('+(species_presence_array[0]+species_presence_array[1])+' '+e.name+' total)<br>There are '+genes_presence_array[1]+' genes in this clades (the whole family has: '+(genes_presence_array[0]+genes_presence_array[1])+')'; 
		  return "clade: "+e.name+"<br>"+e.name+" species with this gene: "+species_presence_array[1]+" (total: "+(species_presence_array[0]+species_presence_array[1])+")<br>Gene copies in "+e.name+": "+genes_presence_array[1]+" (total: "+(genes_presence_array[0]+genes_presence_array[1])+")";
        }
      });





jQuery('.labels').tipsy({ 
        gravity: 'se', 
        html: true, 
        title: function() {
          console.log("in tispy");
//          var d = this.__data__, c = colors(d.i);
           var c = "red";
           //console.log(d.name);
           var e = this.__data__;
          return e.name+' consists of: Fungi, Choanoflagellates'; 
        }
      });
	
	  // Transition minimal_species_tree_nodes to their new position.
		minimal_species_tree_nodeEnter.transition()
			.duration(duration)
			.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
			.style("opacity", 1)
		  .select("circle");
			//.attr("cx", function(d) { return d.x; })
			//.attr("cy", function(d) { return d.y; })
			//.style("fill", "lightsteelblue");
		  
		minimal_species_tree_node.transition()
		  .duration(duration)
		  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
		  .style("opacity", 1);
		
	
		minimal_species_tree_node.exit().transition()
		  .duration(duration)
		  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
		  .style("opacity", 1e-6)
		  .remove();
	
	  // Update the links…
	  var minimal_species_tree_link = minimal_species_tree_vis.selectAll("path.link")
		  .data(minimal_species_tree.links(minimal_species_tree_nodes), function(d) { return d.target.id; });
	
	  // Enter any new links at the parent's previous position.
	  minimal_species_tree_link.enter().insert("svg:path", "g")
		  .attr("class", "link")
		  .attr("stroke-width", function(d){
				return "1.5px";
		  })
		  .attr("stroke", function(d){
			  //console.log("has property for "+d.source.name);
			  //if(taxon_colors.hasOwnProperty(d.source.name)){
			//		console.log("has property for "+d.source.name);
				//	return taxon_colors[d.source.name];
			  //}
			  //else{
				return "black";
			  //}
				//return taxon_colors.hasOwnProperty(d.name)? taxon_colors[d.name]: "black";
		  })      
		  //.attr("d", elbow)
		  .attr("d", diagonal)
	     //.attr("d", function(d) {
   		 //   var o = {x: source.x0, y: source.y0};
		 //      return diagonal({source: o, target: o});
	     //})
		.transition()
		  .duration(duration)
		  //.attr("d", elbow)
		  .attr("d", diagonal)
		  ;
	
	  // Transition links to their new position.
	  minimal_species_tree_link.transition()
		  .duration(duration)
		  //.attr("d", elbow)
		  .attr("d", diagonal)
		  ;
	
	  // Transition exiting minimal_species_tree_nodes to the parent's new position.
	  minimal_species_tree_link.exit().transition()
		  .duration(duration)
		  .attr("d", elbow)
		  //.attr("d", diagonal)
		  //.attr("d", function(d) {
		 	//   var o = {x: source.x, y: source.y};
			//	return diagonal({source: o, target: o});
		  //})
		  .remove();
	
	  // Stash the old positions for transition.
	  minimal_species_tree_nodes.forEach(function(d) {
		d.x0 = d.x;
		d.y0 = d.y;
	  });
	
	}


	

	function elbow(d, i) {
		//	console.log("use M" + d.source.y + "," + d.source.x
		//   + "H" + d.target.y + "V" + d.target.x
		//   + (d.target.children ? "" : "h" + margin.right));
		   
		   return "M" + d.source.y + "," + d.source.x
      + "V" + d.target.x + "H" + d.target.y;
//	  return "M" + d.source.y + "," + d.source.x
//		   + "H" + d.target.y + "V" + d.target.x
//		   + (d.target.children ? "" : "h" + margin.right);
	}

	
	
	d3.select(self.frameElement).style("height", "2000px");   
    
    }
    function show_species_pies(d) {
	    console.log("show species pies");
		 d3.selectAll(".species_pies").style('visibility', 'visible');
		 d3.selectAll(".gene_pies").style('visibility','hidden');

	}
	function show_gene_pies(d) {
		console.log("show gene pies");
		 d3.selectAll(".species_pies").style('visibility', 'hidden');
		 d3.selectAll(".gene_pies").style('visibility', 'visible');

	}
