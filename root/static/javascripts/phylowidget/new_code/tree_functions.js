
// Basic components
	function draw_circles(args){
		var nodeEnter = args.nodeEnter;
		var circle_size = args.circle_size;
		//console.log("drawing with size "+circle_size);
		var circles = nodeEnter.append("svg:circle")
          .attr("r", function(d){ return d.children ? circle_size : 0; })
          .attr("fill", function(d){return d.duplication == "Y"? "red":"green"})
          .on("click", click)
          //.on("click", focus)
          
          //.on("click", get_all_children)
          //.on("click", color_subtree)
          .on("contextmenu", function(data, index) {
          		//console.log("right-clicked on node");
                d3.select('#my_custom_menu')
                  .style('position', 'absolute')
                  .style('left', d3.event.x + "px")
                  .style('top', d3.event.y + "px")
                  .style('display', 'block');
            d3.event.preventDefault();
	    });
		return circles;	
	}
	function draw_nodes(args){
		var nodeEnter = args.nodeEnter;
		var node = args.node;
		var source = args.source;
		var duration = args.duration;
		
	// Transition nodes to their new position.
        nodeEnter.transition()
            .duration(duration)
            .attr("transform", function(d) { 
				return "translate(" + d.y + "," + d.x + ")"; })
            .style("opacity", 1)
            .select("circle");
          
        node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
            .style("opacity", 1);
    
        node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .style("opacity", 1e-6)
            .remove();
	}
	function draw_taxon_names(args){
			var nodeEnter = args.nodeEnter;
			var show_taxa = args.show_taxa;
			var highlight_gene = args.highlight_gene;
			var model_organisms = args.model_organisms;

	 		var texts = nodeEnter.append("svg:text")
            .attr("x", function(d) { return d.children ? -5 : 25; })
            .attr("y", function(d) { return d.children ? -5 : 3; })
            //.attr("class","innerNode_label")
            .attr("text-anchor", function(d){ return d.children ? "end" : "start";})
            //.attr("font-style", "italic")
            .attr("class",function(d){ 
                if(d.children){ return "innerNode_label"}
                else{ 
						if(model_organisms.hasOwnProperty(d.taxon)){
							return "leaf_label species_name model_organism";
						}
						else{				
							return "leaf_label species_name";
						}
                	}
            })
            .attr("fill", function(d){
            		if(d.name == highlight_gene){
            			return "red";
            		}
            		else{
            			return "";
            		}
            })
            .text(function(d) { 
                        if(d.children){
                            if(show_taxa.hasOwnProperty(d.name)){
                                if(d.duplication == "Y"){return "";}
                                else{return d.name;}
                            }
                        }
                        else{return d.taxon; }})
                        //.on('mouseover', function(d, i){
                        //    d3.select(this).select("circle").classed("hover", true);
                        //})
                        //.on('mouseout', function(d, i){
                        //    d3.select(this).select("circle").classed("hover", false);
                        //})
                        .on('mouseover', show_gene_information)
                        ;
		return texts;                        
	}
	function draw_bootstraps(args){
		 	var nodeEnter = args.nodeEnter;
			var show_taxa = args.show_taxa;
			var visibility = args.visibility;

	 		var texts = nodeEnter.append("svg:text")
            .attr("x", function(d) { if(d.children){return -5; }})
            .attr("y", function(d) { if(d.children){return -12; }})
            .attr("text-anchor", function(d){ return d.children ? "end" : "start";})
            .attr("class",function(d){ if(d.children){ return "bootstrap"; }})
            .attr("visibility",visibility)
            .text(function(d) { 
                        if(d.children){
                           return d.bootstrap;
                        }
                });
                        
		return texts;                      
	}
    function set_links(args){
		var link = args.link;
		var link_type = args.link_type;
		var node_thickness = args.node_thickness;
		var duration = args.duration;
		link_type = "elbow";
      // Enter any new links at the parent's previous position.
      link.enter().insert("svg:path", "g")
          .attr("class", "link")
          .attr("stroke-width", function(d){
              //console.log("drawing line with thickness "+node_thickness);
                return node_thickness;
          })
          .attr("stroke", function(d){
              
              return "black";
                //return taxon_colors.hasOwnProperty(d.name)? taxon_colors[d.name]: "black";
          })      
          .attr("d", elbow)
          //.attr("d", diagonal)
         //.attr("d", function(d) {
            //   var o = {x: source.x0, y: source.y0};
         //      return diagonal({source: o, target: o});
         //})
        .transition()
          .duration(duration)
          .attr("d", elbow)
          //.attr("d", diagonal)
          ;
    
      // Transition links to their new position.
      link.transition()
          .duration(duration)
          .attr("d", elbow)
          //.attr("d", diagonal)
          ;
    
      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
          .duration(duration)
          .attr("d", elbow)
          //.attr("d", diagonal)
          //.attr("d", function(d) {
             //   var o = {x: source.x, y: source.y};
            //    return diagonal({source: o, target: o});
          //})
          .remove();
    }

// For lines between nodes
    function elbow(d, i) {
        //    console.log("use M" + d.source.y + "," + d.source.x
        //   + "H" + d.target.y + "V" + d.target.x
        //   + (d.target.children ? "" : "h" + margin.right));
           
           return "M" + d.source.y + "," + d.source.x
      + "V" + d.target.x + "H" + d.target.y;
//      return "M" + d.source.y + "," + d.source.x
//           + "H" + d.target.y + "V" + d.target.x
//           + (d.target.children ? "" : "h" + margin.right);
    }
    function redraw() {
      //console.log("here", d3.event.translate, d3.event.scale);
          vis.attr("transform", "translate(" + d3.event.translate + ")"+ " scale(" + d3.event.scale + ")");
    }

// Toggle children on click.
    function click(d) {
	var circle_size = 4;
	var duplication_circle_size = 15;
		  if (d.children) {
			d._children = d.children;
			d.children = null;
		  } else {
			d.children = d._children;
			d._children = null;
		  }
      console.log("clicked on "+d.name);
      //console.log(d);
      //d3.select(this).text("hahaha");
      console.log("this node data: "+this.parentNode.__data__ );
      //var dad = this.parentNode;
      //d3.select(this).select("text").text(function(d){
          //console.log("trying to select: "+d.name)
      //    return "hahhaaa";
      //});
      // update node
        d3.select(this) .append("svg:path")
						.attr("d", function(d){
							var x = 200, y = 100;
							return 'M ' + x +' '+ y + ' l 4 4 l -8 0 z';
							})
						.attr("r",function(d){return d.duplication == "Y"? duplication_circle_size:circle_size;})
						.attr("class", "collapsed")    
						.attr("fill",function(d){return d.children? "":"white";})
						.attr("stroke",function(d){return d.children? "":"black";})
						.attr("stroke-width", function(d){return d.children? "":"2.5px";});
      
      
      //gTree.update(d);
      //update(d);
    }
    function focus(d) {
    	var duplication_circle_size = 15;
    	var circle_size = 4;
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      console.log("clicked on "+d.name);
      //console.log(d);
      d3.select(this).text("hahaha");
      console.log("this node data: "+this.parentNode.__data__ );
      //var dad = this.parentNode;
      d3.select(this).select("text").text(function(d){
          //console.log("trying to select: "+d.name)
          return "hahhaaa";
      });
      // update node
        d3.select(this).append("svg:path")
        .attr("d", function(d){
                var x = 200, y = 100;
                return 'M ' + x +' '+ y + ' l 4 4 l -8 0 z';
                })
            .attr("r",function(d){return d.duplication == "Y"? duplication_circle_size:circle_size;})
            .attr("class", "collapsed")    
            .attr("fill",function(d){return d.children? "":"white";})
            .attr("stroke",function(d){return d.children? "":"black";})
            .attr("stroke-width", function(d){return d.children? "":"2.5px";});
      update(d);
    }
    function collapse(d) {
            if (d.children) {
              d._children = d.children;
              d._children.forEach(collapse);
              d.children = null;
            }
    }


// Domains 
    function draw_sequences(args){
    	var leaf_group_x = args.leaf_group_x;
    	var sequence_start_y = args.sequence_start_y;
    	var nodeEnter = args.nodeEnter;
    	var domainScale = args.domainScale;
		var visibility = args.visibility;

    	var rects = nodeEnter.filter(function(d){ return d.type == "leaf"});
                rects.append("rect")
				.on('mouseover', show_gene_information)
                .attr("x", leaf_group_x +8)
                .attr("y", sequence_start_y)
                .attr("class", "seq_string")
				.attr("visibility",visibility)
                .attr("width", function(d){return d.children ? "":"5";})
                .attr("height", function(d){
                        if(!d.children){
                                        //console.log("draw sequence from "+sequence_start_y+" to "+(sequence_start_y + sequenceScale(d.seq_length))+"("+d.seq_length+")");
                                        //console.log("transform "+d.seq_length+" to "+sequenceScale(d.seq_length)+" (start drawing at: "+sequence_start_y+")");
                        }
                       return d.children ? "": domainScale(d.seq_length);
                })
               .attr("transform", function(d){return d.children ? "":"rotate(-90 100 100)";})
               .attr("fill", "url(#line_gradient)");
            //   function(d){return d.children ? "":"grey";});
		return rects;
    }
	function draw_domains(args){
		var domains = args.domains;
		var sequence_start_y = args.sequence_start_y;
		var domainScale = args.domainScale;
		var leaf_group_x = args.leaf_group_x;
		var domain_colors = args.domain_colors;
		var sequence_rect_width = args.sequence_rect_width;
		var visibility = args.visibility;
		var domain2color = {};
		var all_domains =  domains.enter().append("rect")
		.attr("x", leaf_group_x + 4)
		.attr("y", function(d){
			//console.log("draw domain from "+sequence_start_y+" to "+(sequence_start_y + domainOnlyScale(d.domain_start))+"("+d.domain_start+")");
			return sequence_start_y + domainScale(d.domain_start);
		})
		.attr("class", "domain")
		.attr("visibility",visibility)
		.attr("rx", 5)
		.attr("ry", 5)
		.attr("transform", "matrix(1,0,0,1,100,0)")
		.attr("stroke", "none")
		.attr("width", function(d){return sequence_rect_width;})
		.attr("height", function(d){
			var length = domainScale(d.domain_stop - d.domain_start);
			//console.log("sequence_rect: appending source is "+d.x);
			//console.log("transform domain length "+(d.domain_stop - d.domain_start)+" to "+length);
			return length;
		})
		.attr("transform", "rotate(-90 100 100)")
		.attr("fill", 
		//                        "url(#domain_gradient)")
		//                        ;
		function(d,i){
			//console.log("checking for "+d.name+" in domain2color");
			//                                if( d.name in domain2color ) {
				if( domain2color[d.name] === undefined ) {
					//console.log("not found");
					domain2color[d.name] = domain_colors[i % 5];
					console.log(d.name+" is "+i+" and will use: "+domain_colors[i]+ " length is "+domain_colors);
					return "url(#"+domain_colors[i % 5]+")";
				}
				else{
					//console.log("found! using "+domain2color[d.name]);
					return "url(#"+domain2color[d.name]+")";
				}
				//                            return "url(#"+domain_colors[i]+")";
			})
			.on('mouseover', show_domain_information);          
			return all_domains;
	}
// Conservation 
    function draw_aligned_sequences(args){
    
    	var leaf_group_x = args.leaf_group_x;
    	var sequence_start_y = args.sequence_start_y;
    	var nodeEnter = args.nodeEnter;
    	var domainScale = args.domainScale;
		var visibility = args.visibility;
    	var rects = nodeEnter.filter(function(d){ return d.type == "leaf"});
                rects.append("rect")
                .attr("x", leaf_group_x +8)
                .attr("y", sequence_start_y)
                .attr("class", "aligned_seq_string")
				.attr("visibility",visibility)
                .attr("width", function(d){return d.children ? "":"10";})
                .attr("height", function(d){
                        if(!d.children){
                                        //console.log("draw sequence from "+sequence_start_y+" to "+(sequence_start_y + sequenceScale(d.seq_length))+"("+d.seq_length+")");
                                        //console.log("transform "+d.seq_length+" to "+sequenceScale(d.seq_length)+" (start drawing at: "+sequence_start_y+")");
                        }
                       return d.children ? "": domainScale(4000);
                       return d.children ? "": domainScale(d.seq_length);
                })
               .attr("transform", function(d){return d.children ? "":"rotate(-90 100 100)";})
               .attr("fill", 
               "green");
            //   function(d){return d.children ? "":"grey";});

		return rects;
    }   
	function draw_gaps(args){
		var gaps = args.gaps;
		var sequence_start_y = args.sequence_start_y;
		var domainScale = args.domainScale;
		var leaf_group_x = args.leaf_group_x;
		var sequence_rect_width = args.sequence_rect_width;
		var visibility = args.visibility;
		var all_gaps =  gaps.enter().append("rect")
                       .attr("x", leaf_group_x + 9)
                       .attr("y", function(d){
                                   //console.log("draw domain from "+sequence_start_y+" to "+(sequence_start_y + domainOnlyScale(d.domain_start))+"("+d.domain_start+")");
                                   return sequence_start_y + domainScale(d.domain_start);
                           })
                       .attr("class", "gap")
					   .attr("visibility",visibility)
                       //.attr("rx", 5)
                       //.attr("ry", 5)
                       //.attr("transform", "matrix(1,0,0,1,100,0)")
                       //.attr("stroke", "none")
                       .attr("width", function(d){return sequence_rect_width - 4;})
                       .attr("height", function(d){
                               var length = domainScale(d.domain_stop - d.domain_start);
                                   //console.log("sequence_rect: appending source is "+d.x);
                                //console.log("transform domain length "+(d.domain_stop - d.domain_start)+" to "+length);
                               return length;
                        })
                        .attr("transform", "rotate(-90 100 100)")
                        .attr("fill", "white");
		return all_gaps;
 }
// Synteny
function draw_synteny_seqs(args){
    
    	var leaf_group_x = args.leaf_group_x;
    	var sequence_start_y = args.sequence_start_y;
    	var nodeEnter = args.nodeEnter;
    	var domainScale = args.domainScale;
		var visibility = args.visibility;

    	var synteny_rects = nodeEnter.filter(function(d){ return d.type == "leaf"});
                synteny_rects.append("rect")
                .attr("x", leaf_group_x +11)
                .attr("y", sequence_start_y)
                .attr("class", "synteny_seq_string")
				.attr("visibility",visibility)
                .attr("width", function(d){return d.children ? "":"2";})
                .attr("height", function(d){
                        if(!d.children){
                                        //console.log("draw sequence from "+sequence_start_y+" to "+(sequence_start_y + sequenceScale(d.seq_length))+"("+d.seq_length+")");
                                        //console.log("transform "+d.seq_length+" to "+sequenceScale(d.seq_length)+" (start drawing at: "+sequence_start_y+")");
                        }
                       return d.children ? "": domainScale(4000);
                       return d.children ? "": domainScale(d.seq_length);
                })
               .attr("transform", function(d){return d.children ? "":"rotate(-90 100 100)";})
               .attr("fill", "grey");
            //   function(d){return d.children ? "":"grey";});

		return synteny_rects;
}   
function draw_synteny(args){
		var syntenties = args.syntenties;
		var sequence_start_y = args.sequence_start_y;
		var domainScale = args.domainScale;
		var leaf_group_x = args.leaf_group_x;
		var sequence_rect_width = args.sequence_rect_width;
		var visibility = args.visibility;

		var all_syntenies =  syntenties.enter().append("rect")
                       .attr("x", leaf_group_x + 6)
                       .attr("y", function(d){
                                   //console.log("draw domain from "+sequence_start_y+" to "+(sequence_start_y + domainOnlyScale(d.domain_start))+"("+d.domain_start+")");
                                   return sequence_start_y + domainScale(d.length);
                        })
                       .attr("class", "synteny")
					   .attr("visibility",visibility)
                       //.attr("rx", 5)
                       //.attr("ry", 5)
                       //.attr("transform", "matrix(1,0,0,1,100,0)")
                       //.attr("stroke", "none")
                       .attr("width", function(d){return sequence_rect_width;})
                       .attr("height", function(d){
                               var length = domainScale(d.length);
                                   //console.log("sequence_rect: appending source is "+d.x);
                                //console.log("transform domain length "+(d.domain_stop - d.domain_start)+" to "+length);
                               return length;
                        })
                        .attr("transform", "rotate(-90 100 100)")
                        .attr("fill", "green");
		return all_syntenies;
}
// Images    
function draw_images(args){
     	var nodeEnter = args.nodeEnter;
     	var image_path = args.image_path;
     	
     	var images = nodeEnter.append("svg:image")
            .attr("y", -10)
            //.attr("x", 12.5)
            .attr("text-anchor", function(d){ return  "end";})
            .attr("width", 20).attr("height", 20)
            //.attr("xlink:href", function(d) { return d.children == null? image_path+"/thumb_"+d.taxon+".png" : "";  });
        .attr("xlink:href", function(d) { return d.children == null? image_path+"/thumb_"+d.taxon+".png" : "";  });
    }
// ToolTip
	function add_tipsy(args){
			var where = args.where;
			console.log("where is "+where);
			if(where == ".leaf_label"){
					console.log("in leaf label");
					jQuery(where).tipsy({ 
					gravity: 'se', 
					html: true, 
					title: function() {
					   var c = "red";
					   var e = this.__data__;
					  return 'ID: '+e.name+'<br>Taxon: '+e.taxon+" <br>Gene name: "+e.swissprot_gene_name+"<br>Swiss-Prot annotation: "+e.swissprot_protein_name+""; 
					}
				  });

			}
			else{
					jQuery(where).tipsy({ 
					gravity: 'se', 
					html: true, 
					title: function() {
					   var c = "red";
					   var e = this.__data__;
					   var length = e.domain_stop - e.domain_start;
					  return 'Domain: '+e.name+'<br>Length: '+length+" AA<br> E-value: "+e.evalue+"<br>Start: "+e.domain_start+" End: "+e.domain_stop; 
					}
				  });
			}
	}
	function toggleAll(d) {
	        if (d.children) {
	          d.children.forEach(toggleAll);
	          click(d);
	        }
	}
      
	function draw_taxon_colors(args){
				var ID2Color = args.ID2Color;
				var SwissProt2colorDictionary = new Object();
				var p=d3.scale.category10();
				var r=p.range(); // ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", 
	                      // "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]
				var s=d3.scale.ordinal().range(r);
				var i = 0;
				var html ="";
				//console.log("one color is "+p(0));
				//d3.select("#tree svg").selectAll(".leaf_label")
				d3.select("#tree svg").selectAll("g.node").append("rect")
					.on('mouseover', show_gene_information)
	                .attr("x", 192)
	                .attr("y", 22)
	                .attr("class", "tax_color_rect")
					//.attr("visibility",visibility)
	                .attr("width", function(d){return d.children ? "1":"17";})
	                .attr("height", function(d){
	                       return d.children ? "1": 200;
	                })
	               .attr("transform", function(d){return d.children ? "1":"rotate(-90 100 100)";})
	               .attr("fill", function(d){
			               	//console.log("looking at "+d.swissprot_gene_name);
			               	if(d.swissprot_gene_name == 'NaN' || d.swissprot_gene_name == "undefined"){
			               			//console.log("no color");
					               	return "none";
			               	}
			               	else if( SwissProt2colorDictionary[d.swissprot_gene_name] === undefined ) {
			                                    console.log("not found");
			                                    SwissProt2colorDictionary[d.swissprot_gene_name] = p(i % p.range().length);
						               			html  = html + "<font style='color:"+SwissProt2colorDictionary[d.swissprot_gene_name]+"'>";
												html = html + "<a href='http://www.uniprot.org/uniprot/?query="+d.swissprot_gene_name+"+AND+reviewed%3Ayes&sort=score'>";
												html = html + d.swissprot_gene_name+"</a></font>: "+d.swissprot_protein_name+"<br>";
						               			console.log("use color "+p(i % p.range().length)+" name : "+d.swissprot_gene_name);
			                                    //ID2Color[d.name] = p(0)   SwissProt2color[i % p.domain().length];
                            
			                                    //console.log("will use: "+p(i % p.domain().length);
			                                    //console.log(" draw "+d.swissprot_gene_name+" using "+SwissProt2colorDictionary[d.swissprot_gene_name]);
			                                    //return "red";
			                                    i++;
			                                    return SwissProt2colorDictionary[d.swissprot_gene_name];
			                }
			                else{
			                                    //console.log("found! using "+domain2color[d.name]);
			                                    //ID2Color[d.name] = SwissProt2colorDictionary[d.swissprot_gene_name];
			                                    return SwissProt2colorDictionary[d.swissprot_gene_name];
							}
			               })
	               .attr("fill-opacity",0.2);
               
	               
	               // draw legend
				   
				   show_general_information({swissprot_annotation: html});
               
	}


	function show_general_information(args){
		// will populate the following fields
		var swissprot_annotation = args.swissprot_annotation|| "NaN";
		// room for more annotation
        // draw legend
		//console.log('ID: '+id+'<br>Taxon: '+taxon+" <br>Gene name: "+gene_name+"<br>Swiss-Prot annotation: "+swissprot_annotation+"");
        jQuery("#swissprot_annotation_container").html(swissprot_annotation);
	}

	function show_gene_information(d){
		//d3.select("#domain_annotation_container").style("visibility", "hidden");
		//d3.select("#sequence_annotation_container").attr("visibility", "");
		
		// will populate the following fields
		var id = d.name|| "NaN";
		var taxon = d.taxon|| "NaN";
		var gene_name = d.swissprot_gene_name|| "NaN";
		var swissprot_annotation =  d.swissprot_protein_name|| "NaN";
        // draw legend
		
		var url = species2sourceDB_mapping({species : taxon, identifier: id});
		console.log('ID: '+id+'<br>Taxon: '+taxon+" <br>Gene name: "+gene_name+"<br>Swiss-Prot annotation: "+swissprot_annotation+"");
        jQuery("#container_seq_id").html("<a href='"+url+"'>"+id+"</a> ");
        jQuery("#container_taxon_id").html("<font font-style='italic'>"+taxon+"</font>");
        jQuery("#container_gene_name").html(gene_name);
        jQuery("#container_swissprot_annotation").html(swissprot_annotation);
		
	}
	function show_domain_information(d){
		
		// hide gene_information
		//d3.select("#sequence_annotation_container").style("visibility", "hidden");
		//d3.select("#domain_annotation_container").style("visibility", "");
		
		// will populate the following fields
		var name = d.name|| "NaN";
		var start = d.domain_start|| "NaN";
		var stop = d.domain_stop|| "NaN";
		var annotation =  d.swissprot_protein_name|| "NaN";
		var evalue =  d.evalue|| "NaN";
		var length = d.domain_stop - d.domain_start || "NaN";
        // draw legend
		
		console.log('Domain: '+name+'<br>Length: '+length+" AA<br> E-value: "+evalue+"<br>Start: "+start+" End: "+stop);
        jQuery("#container_domain_name").html("<a href='http://pfam.sanger.ac.uk/family/"+name+"'>"+name+"</a>");
        jQuery("#container_domain_coord").html(start+"-"+stop);
		jQuery("#container_evalue_stop").html(evalue);
        //jQuery("#container_domain_annotation").html(annotation);
        jQuery("#container_domain_length").html(length);
	}
	
//
// interactive functions  
//

// Internal text
	function hide_internal_text(d) {
	         d3.select("#tree svg").selectAll(".innerNode_label").text(function(d){
	                return d.children ? "": d.taxon; 
	        });
	}
	function show_internal_text(d) {
	        //console.log("we are here");
	         d3.select("#tree svg").selectAll(".innerNode_label").text(function(d) { 
	        if(d.duplication == "Y"){
	                return "";
	        }
	        else{
	                    return d.children ? d.name:d.taxon; 
	        }
	        });
	}
	function show_internal_text_important(d) {
	         d3.select("#tree svg").selectAll(".innerNode_label").text(function(d) { 
	            if(d.children){
	                if(show_taxa.hasOwnProperty(d.name)){
	                    if(d.duplication == "Y"){
	                        return "";
	                    }
	                else{
	                    return d.name;
	                }
	            }
	        }
	        else{
	            return d.taxon; 
	        }
	        });
	}
    
// show/hide IDS
    function show_leaf_ids(d) {
	     d3.select("#tree svg").selectAll(".tax_color_rect").attr("visibility", "hidden");
		 
         d3.select("#tree svg").selectAll(".leaf_label").text(function(d) { 
				return  d.name; 
			})
		.classed("species_name", false);
    }
	function show_leaf_taxa(d) {
  	     d3.select("#tree svg").selectAll(".tax_color_rect").attr("visibility", "hidden");
         d3.select("#tree svg").selectAll(".leaf_label").text(function(d) { 
            return d.children ? d.name:d.taxon; 
        })
		.classed("species_name", true);
    }
	function show_leaf_uniprot(d) {
		
		     d3.select("#tree svg").selectAll(".tax_color_rect").attr("visibility", "hidden");


			var UniProt2color = ["grey","lightblue","lightgreen", "blue","green"];
			var UniProt2colorDictionary = new Object();
         	d3.select("#tree svg").selectAll(".leaf_label")
			.classed("species_name", false)
         	.text(function(d) { 
         			if(d.uniprot_name == "NaN"){
         				d.uniprot_name = "not mapped";
         			}
		         	return d.children ? d.name:d.uniprot_name; 
         	})
         	.style("fill", function(d,i){
				//if(!d.children){
// 			        var matches = d.uniprot_name.match(/(.*)_(.*)/); // Match uniprot KB
// 					if(matches){
// 		    		    console.log("looking at: "+d.uniprot_name+" with "+matches.length);
// 						if(typeof matches[1] !== 'undefined') {
// 							var uniprot_id = matches[1];
// 							console.log("found first part: "+uniprot_id);
// 							if( UniProt2colorDictionary[uniprot_id] === undefined ) {
//                                     //console.log("not found");
//                                     UniProt2colorDictionary[uniprot_id] = UniProt2color[i % UniProt2color.length];
//                                     console.log("will use: "+UniProt2color[i % UniProt2color.length]);
//                                     //return "red";
//                                     return UniProt2color[i % UniProt2color.length];
//                                 }
//                                 else{
//                                     //console.log("found! using "+domain2color[d.name]);
//                                     return UniProt2colorDictionary[uniprot_id];
//                                 }
// 							}
// 						if(typeof matches[2] !== 'undefined') {
// 							console.log("found second part: "+matches[2]);
// 						}
// 						
// 					}
// 			      //  console.log("matches: "+firstPart+" and: "+secondPart);
// 				
// 				}
				});
	        // color uniprotkb ids
	        // e.g. BRCA2_HUMAN
	        // e.g all BRCA2 make color x
	        
	        
    }
    function show_leaf_swissprot(d) {
			var SwissProt2color = ["darkgreen","red","blue","grey"];
			var SwissProt2colorDictionary = new Object();
			var ID2Color = new Object();
			
            d3.select("#tree svg").selectAll(".leaf_label")
          	 .text(function(d) { 
          	 		if(d.swissprot_gene_name == "NaN"){
          	 			d.swissprot_gene_name = "not mapped";
          	 		}
 		         	return d.children ? d.name : ""+d.swissprot_gene_name+" ("+d.taxon+")"; 
          	 });
//          	.style("fill", function(d,i){
// 				if(!d.children){
// 			        	if( SwissProt2colorDictionary[d.swissprot_gene_name] === undefined ) {
//                                     //console.log("not found");
//                                     SwissProt2colorDictionary[d.swissprot_gene_name] = SwissProt2color[i % SwissProt2color.length];
//                                     ID2Color[d.name] = SwissProt2color[i % SwissProt2color.length];
//                             
//                                     console.log("will use: "+SwissProt2color[i % SwissProt2color.length]);
//                                     //return "red";
//                                     return SwissProt2color[i % SwissProt2color.length];
//                         }
//                         else{
//                                     //console.log("found! using "+domain2color[d.name]);
//                                     ID2Color[d.name] = SwissProt2colorDictionary[d.swissprot_gene_name];
//                                     return SwissProt2colorDictionary[d.swissprot_gene_name];
// 						}
// 				}
// 			});
			draw_taxon_colors({ID2Color: ID2Color});
	}
    
    
// show/hide Domains
    function hide_domains(d) {
         d3.select("#tree svg").selectAll(".domain").attr("visibility", "hidden");
         d3.select("#tree svg").selectAll(".seq_string").attr("visibility", "hidden");
         d3.select("#tree svg").selectAll(".domainlabel").attr("visibility", "hidden");
    }
    function show_domains(d) {
    	hide_conservation();
    	hide_synteny();
         d3.select("#tree svg").selectAll(".domain").attr("visibility", "");
         d3.select("#tree svg").selectAll(".seq_string").attr("visibility", "");
         d3.select("#tree svg").selectAll(".domainlabel").attr("visibility", "");
    }
    
// show/hide Conservation
    function hide_conservation(d) {
         d3.select("#tree svg").selectAll(".gap").attr("visibility", "hidden");
         d3.select("#tree svg").selectAll(".aligned_seq_string").attr("visibility", "hidden");
         //d3.select("#tree svg").selectAll(".domainlabel").attr("visibility", "hidden");
    }
    function show_conservation(d) {
	    hide_domains();
	    hide_synteny();
         d3.select("#tree svg").selectAll(".gap").attr("visibility", "");
         d3.select("#tree svg").selectAll(".aligned_seq_string").attr("visibility", "");
         //d3.select("#tree svg").selectAll(".domainlabel").attr("visibility", "");
    }

// show/hide Gene neighborhood
    function hide_synteny(d) {
         d3.select("#tree svg").selectAll(".synteny").attr("visibility", "hidden");
         d3.select("#tree svg").selectAll(".synteny_seq_string").attr("visibility", "hidden");
         //d3.select("#tree svg").selectAll(".domainlabel").attr("visibility", "hidden");
    }
    function show_synteny(d) {
	    hide_domains();
	    hide_conservation();
         d3.select("#tree svg").selectAll(".synteny").attr("visibility", "");
         d3.select("#tree svg").selectAll(".synteny_seq_string").attr("visibility", "");
         //d3.select("#tree svg").selectAll(".domainlabel").attr("visibility", "");
    }

// show/hide Bootstrap
	function show_bootstrap(d){
		d3.select("#tree svg").selectAll(".bootstrap").attr("visibility", "");
	}
	function hide_bootstrap(d){
		d3.select("#tree svg").selectAll(".bootstrap").attr("visibility", "hidden");
	}
    
// Images
    function hide_images(d) {
         d3.select("#tree svg").selectAll("image").attr("visibility", "hidden");
    }
    function show_images(d) {
         d3.select("#tree svg").selectAll("image").attr("visibility", "");
    }

// evolutionary events
    function hide_evol_nodes(d) {
        d3.select("#tree svg").selectAll("circle").attr("fill", "black");
    }
    function show_evol_nodes(d) {
        d3.select("#tree svg").selectAll("image").attr("visibility", "");
        d3.select("#tree svg").selectAll("circle")
        //.attr("r", function(d){
        //        if(d.children){
        //            return d.duplication == "Y"? 10:5;
        //        }
        //})
        .attr("fill", function(d){return d.duplication == "Y"? "red":"green"})
        .on("click", click);
    }    

// Taxon colors
    function show_taxon_colors(d){
         d3.select("#tree svg").selectAll(".tax_color").attr("visibility", "");
    }
    function hide_taxon_colors(d){
        d3.select("#tree svg").selectAll(".tax_color").attr("visibility", "hidden");
    }

// Functions to be tested
    function show_orthologs(d){
       // Walk parent chain
            var ancestors = [];
            var parent = d;
            while (!_.isUndefined(parent) && parent.duplication != "Y") {
                ancestors.push(parent);
                parent = parent.parent;
            }
            // console.log(parent);
//             console.log("(before: Found "+ancestors.length+" ancestors");
//             ancestors = ancestors.slice(0,ancestors.length -1);
//             console.log("(sliced: "+ancestors.length+" ancestors");
//             console.log(ancestors);
//             console.log("getting children for "+parent.name+"");
// 
//             var additional_children = get_all_children(parent);
//             if(additional_children != null){
//                 console.log("(from children: Found "+additional_children.length+" children");
//                 additional_children.forEach(function(node){
//                     console.log(node);
//                     ancestors.push(node);
//                 })
//             }
            // ok, we now have all parents, but lets now collect all children
            //while (!_.isUndefined(parent.children)) {
            //    parent.children.forEach(function(d) {
            //        while (!_.isUndefined(d.children)) {
            //    }
            //    ancestors.push(parent.children)
                
            //}
            //console.log("(after: Found "+ancestors.length+" ancestors");
            
            // Get the matched links
            var matchedLinks = [];
            d3.selectAll('path.link')
                .filter(function(d, i)
                {
                    return _.any(ancestors, function(p)
                    {
                        return p === d.target;
                    });
                })
                .each(function(d)
                {
                    matchedLinks.push(d);
                });
             //console.log("found "+matchedLinks.length+" links");           
             //console.log("found "+ancestors.length+" ancestors");           
     
             
             animateParentChain(matchedLinks, ancestors);
            //matchedLinks.attr("stroke-width", "2.5px");
    }
    function animateParentChain(links, nodes, color){

                console.log("coloring with "+color);
                    d3.selectAll("circle")
                    .data(nodes)
                    .enter().append("svg:circle")
                    .attr("r", function(d){ return d.children ? circle_size : 0; })
                    .attr("fill", color);
            
                var linkRenderer = d3.svg.diagonal()
                    .projection(function(d)
                    {
                        return [d.y, d.x];
                    });
            
                // Links
                ui.animGroup.selectAll("path.selected")
                    .data([])
                    .exit().remove();
            
                //console.log("removed previous links");
            
                ui.animGroup
                    .selectAll("path.selected")
                    .data(links)
                    .enter().append("svg:path")
                    .attr("class", "selected link")
                    .attr("d", elbow);
        
//           .attr("stroke-width", function(d){
//                 return "3.5px";
//           })
//           .attr("stroke", function(d){
//               //console.log("has property for "+d.source.name);
//               return "black";
//                 //return taxon_colors.hasOwnProperty(d.name)? taxon_colors[d.name]: "black";
//           })      
//           .attr("d", elbow)
        
        

	    //console.log("selected new links");

	    // Animate the clipping path
	    var overlayBox = ui.svgRoot.node().getBBox();
	    //console.log("initiated overlay box");

	    ui.svgRoot.select("#clip-rect")
	        .attr("x", overlayBox.x + overlayBox.width)
	        .attr("y", overlayBox.y)
	        .attr("width", 0)
	        .attr("height", overlayBox.height)
	        .transition().duration(500)
	        .attr("x", overlayBox.x)
	        .attr("width", overlayBox.width);
	        //console.log("attached animation");
	}
    function show_tax_group(d){
        // have predefined set of inner nodes
        // iterate over those nodes and find them in the tree
        for(var taxon in show_taxa){
            console.log("ok, collect them all for "+taxon);
            var chosen_nodes = d3.select("#tree svg").selectAll("[name=Eutheria]");
                console.log(chosen_nodes);
                chosen_nodes.each(function(chosen_node){
                        var collected_nodes = get_all_children(chosen_node);
                        if(collected_nodes != null){
                            console.log("end, collected: "+collected_nodes.length+" elements");
                        }
                })
                //console.log("well, we return after the first one");
                        return;
            
        }
        // get all children for 
    }
    function color_subtree(d, color){
					console.log("Color subtree for "+d.name);
                    var collected_nodes = get_all_children(d);
                    if(collected_nodes != null){
                            console.log("end, collected: "+collected_nodes.length+" elements");
                    }
                    // Get the matched links
					var matchedLinks = [];
					d3.selectAll('path.link')
						.filter(function(d, i)
						{
							return _.any(collected_nodes, function(p)
							{
								return p === d.target;
							});
						})
						.each(function(d)
						{
							matchedLinks.push(d);
						});
                    color = "darkgreen";
                    animateParentChain(matchedLinks, collected_nodes, color);
    }
    
    function get_all_children(d){
        var all_children = new Array;
        //return ;
        all_children = get_all_childs(d);
        if(all_children != null){
            //console.log("end, our array has: "+all_children.length+" elements");
            all_children.forEach(function(elem){
                //console.log(elem);
            });
        }
        else{
            console.log("Could not find children");
        }
        return all_children;
    }
    function get_all_childs(d){
        var temp_array  = new Array;
        //console.log("in the get_all_childs for "+d.name+" with id: "+d.id);
        if(d.children){
                var children = d.children;
                for (var i = 0; i < children.length; i++) {
                    var temp_array_child = new Array;
                    if(temp_array_child != null){
                        temp_array_child = get_all_childs(children[i]);
                       // console.log("got from child: : "+temp_array_child.length+" children");
                        temp_array_child.forEach(function(elem){
                            //console.log(elem);
                            temp_array.push(elem);
                        })
                    }
                    //temp_array.push(temp_array_child);
                }
                temp_array.push(d);
        }
        else{
            //console.log("well, this is a child, return its name: "+d);
            temp_array.push(d);
            return temp_array;
        }
        return temp_array;
    }
    function submit_download_form(output_format){
		// Get the d3js SVG element
		var tmp = document.getElementById("tree");
		var svg = tmp.getElementsByTagName("svg")[0];
		// Extract the data as SVG text string
		var svg_xml = (new XMLSerializer).serializeToString(svg);

		// Submit the <FORM> to the server.
		// The result will be an attachment file to download.
		var form = document.getElementById("svgform");
		form['output_format'].value = output_format;
		form['data'].value = svg_xml ;
		form.submit();
	}
	function show_svg_code(){
		// Get the d3js SVG element
		var tmp  = document.getElementById("tree");
		var svg = tmp.getElementsByTagName("svg")[0];

		// Extract the data as SVG text string
		var svg_xml = (new XMLSerializer).serializeToString(svg);

		//Optional: prettify the XML with proper indentations
		svg_xml = vkbeautify.xml(svg_xml);

		// Set the content of the <pre> element with the XML
		jQuery("#svg_code").text(svg_xml);

		//Optional: Use Google-Code-Prettifier to add colors.
		prettyPrint();
	}
    
    
    function search_gene(d, highlight_gene){
		//console.log("we are here");
         d3.select("#tree svg").selectAll(".leaf_label").text(function(d) { 
			console.log("checking "+highlight_gene+" = "+d.name);
       		 if(d.name == highlight_gene){
                return "";
			}
	        else{
                    return d.children ? d.name:d.taxon; 
           }
        });
    }
	
	
	function species2sourceDB_mapping(args){
		
		var species = args.species;
		var id = args.identifier;
		
		var ensembl_species = new Object();
		
		var ensembl_genomes_species = new Object();
		var species2db = new Object();
		
		var url = "";
		species2db["acyrthosiphon_pisum"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["aedes_aegypti"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["ailuropoda_melanoleuca"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["amphimedon_queenslandica"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["anolis_carolinensis"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["anopheles_darlingi"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["anopheles_gambiae"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["apis_mellifera"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["arabidopsis_thaliana"] = "http://plants.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["atta_cephalotes"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["bombyx_mori"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["bos_taurus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["bursaphelenchus_xylophilus"] = "http://www.wormbase.org/search/gene/";
		species2db["caenorhabditis_brenneri"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["caenorhabditis_briggsae"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["caenorhabditis_elegans"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["caenorhabditis_japonica"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["caenorhabditis_remanei"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["callithrix_jacchus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["canis_familiaris"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["capitella_teleta"] = "http://genome.jgi-psf.org/cgi-bin/dispGeneModel?db=Capca1&id=";
		species2db["cavia_porcellus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["choloepus_hoffmanni"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["ciona_intestinalis"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["ciona_savignyi"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["culex_quinquefasciatus"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["danaus_plexippus"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["danio_rerio"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["daphnia_pulex"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["dasypus_novemcinctus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["dipodomys_ordii"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["drosophila_ananassae"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["drosophila_erecta"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["drosophila_grimshawi"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["drosophila_melanogaster"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["drosophila_mojavensis"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["drosophila_persimilis"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["drosophila_pseudoobscura"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["drosophila_sechellia"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["drosophila_simulans"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["drosophila_virilis"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["drosophila_willistoni"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["drosophila_yakuba"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["echinops_telfairi"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["equus_caballus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["erinaceus_europaeus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["felis_catus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["gadus_morhua"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["gallus_gallus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["gasterosteus_aculeatus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["gorilla_gorilla"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["heliconius_melpomene"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["helobdella_robusta"] = "http://genome.jgi-psf.org/cgi-bin/dispGeneModel?db=Helro1&id=";
		species2db["heterorhabditis_bacteriophora"] = "http://www.wormbase.org/search/gene/";
		species2db["homo_sapiens"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["ictidomys_tridecemlineatus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["ixodes_scapularis"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["latimeria_chalumnae"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["lottia_gigantea"] = "http://genome.jgi-psf.org/cgi-bin/dispGeneModel?db=Lotgi1&id=";
		species2db["loxodonta_africana"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["macaca_mulatta"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["macropus_eugenii"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["meleagris_gallopavo"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["meloidogyne_hapla"] = "http://www.wormbase.org/search/gene/";
		species2db["microcebus_murinus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["monodelphis_domestica"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["monosiga_brevicollis"] = "http://genome.jgi-psf.org/cgi-bin/dispGeneModel?db=Monbr1&id=";
		species2db["mustela_putorius_furo"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["mus_musculus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["myotis_lucifugus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["nasonia_vitripennis"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["nematostella_vectensis"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["nomascus_leucogenys"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["ochotona_princeps"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["oreochromis_niloticus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["ornithorhynchus_anatinus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["oryctolagus_cuniculus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["oryzias_latipes"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["otolemur_garnettii"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["pan_troglodytes"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["pediculus_humanus"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["pelodiscus_sinensis"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["petromyzon_marinus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["pongo_abelii"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["pristionchus_pacificus"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["procavia_capensis"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["proterospongia_sp"] = "nle_MAKER_updated_Ensembl";
		species2db["pteropus_vampyrus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["rattus_norvegicus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["saccharomyces_cerevisiae"] = "http://fungi.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["sarcophilus_harrisii"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["schistosoma_mansoni"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["schizosaccharomyces_pombe"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["sorex_araneus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["strongylocentrotus_purpuratus"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["strongyloides_ratti"] = "http://www.wormbase.org/search/gene/";
		species2db["sus_scrofa"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["taeniopygia_guttata"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["takifugu_rubripes"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["tarsius_syrichta"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["tetraodon_nigroviridis"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["tribolium_castaneum"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["trichinella_spiralis"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["trichoplax_adhaerens"] = "http://metazoa.ensembl.org/Multi/Search/Results?species=all;q=";
		species2db["tupaia_belangeri"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["tursiops_truncatus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["vicugna_pacos"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["xenopus_tropicalis"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		species2db["xiphophorus_maculatus"] = "http://www.ensembl.org/Multi/Search/Results?species=all;idx=;q=";
		
		
		if(species == "capitella_teleta"){
		}
		
		console.log("Looking at id "+id+" from species "+species);
		
		url = species2db[species.toLowerCase()]+id;
		console.log("url is "+url);
		
		// return URL for given ID
		return url;
	}
	
    