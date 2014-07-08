var pie = d3.layout.pie().sort(null);
	var color = d3.scale.category20();
	//var colors = ["red","green"];
	var colors = ["PaleGreen","DarkGreen"];
	var blank_circles;
    var radius = 20;
	
	var arc = d3.svg.arc()    
    .outerRadius(10);

function draw_legend(colors){

	var gene_presence = [1,0];
	var gene_absent = [0,1];
	var w = 100;
	var h = 100;
// minimal_species_tree	
	var minimal_species_tree_vis = d3.select("#tree_legend").append("svg:svg")
		.attr("width", w)
		.attr("height", h)
		//.attr("viewBox","0 0 50 50")
	  	.attr("transform", "translate(40,40)")
		//.attr("pointer-events", "all")
	    .append('svg:g')
    	.attr("transform", "translate(50,50)");
		//.attr("pointer-events", "all")
        //.call(d3.behavior.zoom().on("zoom", redraw))
        //.append('svg:g');

	
	// minimal_species_tree_vis.data(function(d) {return pie(gene_presence); })
//      		  				   .enter().append("svg:path")
//  			    			   .attr("fill", function(d, i) { return colors[0]; })
// 			    			   //.attr("class", "gene_pies")
// 			    			   //.style("visibility","visible")
//  				     		   .attr("d", arc);
// 
// 	minimal_species_tree_vis.data(function(d) {return pie(gene_presence); })
//      		  				   .enter().append("svg:path")
//  			    			   .attr("fill", function(d, i) { return colors[1]; })
// 			    			   //.attr("class", "gene_pies")
// 			    			   //.style("visibility","visible")
//  				     		   .attr("d", arc);

 				     		   
								minimal_species_tree_vis.selectAll("path")
 		                       .data(function(d) {return pie(gene_absent); })
     		  				   .enter().append("svg:path")
 			    			   .attr("fill", function(d, i) { return colors[0]; })
			    			   //.attr("class", "species_pies")
			    			   //.style("visibility","visible")
 				     		   .attr("d", arc);


								minimal_species_tree_vis.selectAll("path")
 		                       .data(function(d) {return pie(gene_absent); })
     		  				   .enter().append("svg:path")
 			    			   .attr("fill", function(d, i) { return colors[1]; })
			    			   //.attr("class", "species_pies")
			    			   //.style("visibility","visible")
 				     		   .attr("d", arc);

    }

