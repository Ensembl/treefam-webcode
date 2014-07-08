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
var domain_div;
var domain2color = {};

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



function draw_d3_tree(no_genes, alignment_length,json_tree, images_dir){
    console.log("no_genes is: "+no_genes);
    console.log("tree  is: "+json_tree);
    console.log("alignment_length: "+alignment_length);
     h = no_genes * 10;
    image_path = images_dir;
    var id_label;
     w = "800", h = h, i = 0, duration = 1000, root;
    
     var leaf_space = "400";
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

    // set the clipping path
        //var animGroup = nodeEnter.append("svg:g").attr("clip-path", "url(#clipper)");
     
      // Enter any new nodes at the parent's previous position.
// CIRCLE     
        var circles = nodeEnter.append("svg:circle")
          .attr("r", function(d){ return d.children ? circle_size : 0; })
          .attr("fill", function(d){return d.duplication == "Y"? "red":"green"})
          .on("click", click)
          //.on("click", get_all_children)
          //.on("click", color_subtree)
          .on("contextmenu", function(data, index) {
                d3.select('#my_custom_menu')
                  .style('position', 'absolute')
                  .style('left', d3.event.x + "px")
                  .style('top', d3.event.y + "px")
                  .style('display', 'block');
            d3.event.preventDefault();
    });



                        
// Tax rect    
//         var text_rec = nodeEnter.append("rect")
//             .attr("x", function(d) { return d.children ? 0 : leaf_group_x; })
//             .attr("y", function(d) { return d.children ? 0 : 3; })
//             .attr("rx", 5)
//             .attr("ry", 5)
//             .attr("class","tax_color")
//             .attr("width", function(d){return d.children ? "":"25";})
//             .style("fill-opacity", "1")
//             .attr("height", function(d){
//                        //console.log("looking at "+d.name+" with "+domainOnlyScale(d.seq_length));
//                        return d.children ? "": 170;
//                 })
//             .attr("transform", function(d){return d.children ? "":"rotate(-90 100 100)";})
//             .attr("fill", function(d){
//                 if(d.color){
//                 //console.log("well, "+d.name+" has "+d.color);
//                     return d.children ? "black" : d.color;
//                 }
//                       return d.children ? "":"blue";
//             })
        
// TEXT        
        var texts = nodeEnter.append("svg:text")
            .attr("x", function(d) { return d.children ? -5 : 25; })
            .attr("y", function(d) { return d.children ? -5 : 3; })
            //.attr("class","innerNode_label")
            .attr("text-anchor", function(d){ return d.children ? "end" : "start";})
            .attr("class",function(d){ 
                if(d.children){ return "innerNode_label"}
                else{ return "leaf_label"}
            })
            .text(function(d) { 
                        if(d.children){
                            if(show_taxa.hasOwnProperty(d.name)){
                                if(d.duplication == "Y"){return "";}
                                else{return d.name;}
                            }
                        }
                        else{return d.taxon; }})
                        .on('mouseover', function(d, i){
                            d3.select(this).select("circle").classed("hover", true);
                        })
                        .on('mouseout', function(d, i){
                            d3.select(this).select("circle").classed("hover", false);
                        })
                        .on('click', show_orthologs);

                        
// IMAGE
     var images = nodeEnter.append("svg:image")
            .attr("y", -10)
            //.attr("x", 12.5)
            .attr("text-anchor", function(d){ return  "end";})
            .attr("width", 20).attr("height", 20)
            //.attr("xlink:href", function(d) { return d.children == null? image_path+"/thumb_"+d.taxon+".png" : "";  });
        .attr("xlink:href", function(d) { return d.children == null? image_path+"/thumb_"+d.taxon+".png" : "";  });

// Sequence lines
var rects = nodeEnter.filter(function(d){ return d.type == "leaf"});
                rects.append("rect")
                .attr("x", leaf_group_x +8)
                .attr("y", sequence_start_y)
                .attr("class", "seq_string")
                .attr("width", function(d){return d.children ? "":"5";})
                .attr("height", function(d){
                        if(!d.children){
                                        //console.log("draw sequence from "+sequence_start_y+" to "+(sequence_start_y + sequenceScale(d.seq_length))+"("+d.seq_length+")");
                                        //console.log("transform "+d.seq_length+" to "+sequenceScale(d.seq_length)+" (start drawing at: "+sequence_start_y+")");
                        }
                       return d.children ? "": domainScale(d.seq_length);
                })
               .attr("transform", function(d){return d.children ? "":"rotate(-90 100 100)";})
               .attr("fill", 
               "url(#line_gradient)");
            //   function(d){return d.children ? "":"grey";});


        var domains = rects.selectAll(".domain").data(function(d) { return d.domains; })

// DOMAIN        
       var all_domains =  domains.enter().append("rect")
                       .attr("x", leaf_group_x + 4)
                       .attr("y", function(d){
                                   //console.log("draw domain from "+sequence_start_y+" to "+(sequence_start_y + domainOnlyScale(d.domain_start))+"("+d.domain_start+")");
                                   return sequence_start_y + domainScale(d.domain_start);
                           })
                       .attr("class", "domain")
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
                                    domain2color[d.name] = domain_colors[i];
                                    //console.log("will use: "+domain_colors[i]);
                                    return "url(#"+domain_colors[i]+")";
                                }
                                else{
                                    //console.log("found! using "+domain2color[d.name]);
                                    return "url(#"+domain2color[d.name]+")";
                                }
    //                            return "url(#"+domain_colors[i]+")";
                        });          
        
        var dom_labels = rects.selectAll(".domainlabel").data(function(d) { return d.domains; });
jQuery('.domain').tipsy({ 
        gravity: 'se', 
        html: true, 
        title: function() {
          //console.log("in tispy");
          //var d = this.__data__, c = colors(d.i);
           var c = "red";
           //console.log(d.name);
           var e = this.__data__;
           var length = e.domain_stop - e.domain_start;
           //console.log(e);
//          return 'There are 23 species with this gene (43 arthropoda total)'; 
          return 'Domain: '+e.name+'<br>Length: '+length+" AA<br> E-value: "+e.evalue+"<br>Start: "+e.domain_start+" End: "+e.domain_stop; 
        }
      });

      // Transition nodes to their new position.
        nodeEnter.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
            .style("opacity", 1)
          .select("circle");
            //.attr("cx", function(d) { return d.x; })
            //.attr("cy", function(d) { return d.y; })
            //.style("fill", "lightsteelblue");
          
        node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
          .style("opacity", 1);
        
    
        node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .style("opacity", 1e-6)
          .remove();
    /*
        var nodeTransition = node.transition()
            .duration(duration);
      
      nodeTransition.select("circle")
          .attr("cx", function(d) { return d.y; })
          .attr("cy", function(d) { return d.x; })
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
      
      nodeTransition.select("text")
          .attr("dx", function(d) { return d._children ? -8 : 8; })
          .attr("dy", 3)
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#5babfc"; });
    
      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit();
      
      nodeExit.select("circle").transition()
          .duration(duration)
          .attr("cx", function(d) { return source.y; })
          .attr("cy", function(d) { return source.x; })
          .remove();
      
      nodeExit.select("text").transition()
          .duration(duration)
          .remove();
    */
      // Update the links…
      var link = d3.select("#tree svg").selectAll("path.link")
          .data(tree.links(nodes), function(d) { return d.target.id; });
    
      // Enter any new links at the parent's previous position.
      link.enter().insert("svg:path", "g")
          .attr("class", "link")
          .attr("stroke-width", function(d){
                return "3.5px";
          })
          .attr("stroke", function(d){
              //console.log("has property for "+d.source.name);
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
    
    animGroup = vis.append("svg:g")
        .attr("clip-path", "url(#clipper)");
    
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

    function toggleAll(d) {
        if (d.children) {
          d.children.forEach(toggleAll);
          click(d);
        }
      }
      
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
    
    
    // IDS
    function show_leaf_ids(d) {
         d3.select("#tree svg").selectAll(".leaf_label").text(function(d) { 
            return  d.name; 
        });
    }
    function show_leaf_taxa(d) {
         d3.select("#tree svg").selectAll(".leaf_label").text(function(d) { 
            return d.children ? d.name:d.taxon; 
        });
    }
// Domains
    function hide_domains(d) {
         d3.select("#tree svg").selectAll(".domain").attr("visibility", "hidden");
         d3.select("#tree svg").selectAll(".seq_string").attr("visibility", "hidden");
         d3.select("#tree svg").selectAll(".domainlabel").attr("visibility", "hidden");
    }
    function show_domains(d) {
         d3.select("#tree svg").selectAll(".domain").attr("visibility", "");
         d3.select("#tree svg").selectAll(".seq_string").attr("visibility", "");
         d3.select("#tree svg").selectAll(".domainlabel").attr("visibility", "");
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
          vis.attr("transform",
      "translate(" + d3.event.translate + ")"
      + " scale(" + d3.event.scale + ")");
    }

    // Toggle children on click.


    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      
      //console.log("clicked on "+d.name);
      //console.log(d);
      d3.select(this).text("hahaha");
      console.log("this node data: "+this.parentNode.__data__ );
      var dad = this.parentNode;
      d3.select(this).select("text").text(function(d){
          //console.log("trying to select: "+d.name)
          return "hahhaaa";
      });
      // update node
        d3.select(this)
        .append("svg:path")
        .attr("d", function(d){
                var x = 200, y = 100;
                return 'M ' + x +' '+ y + ' l 4 4 l -8 0 z';
                })
//        d3.svg.symbol())
        
        
            .attr("r",function(d){return d.duplication == "Y"? duplication_circle_size:circle_size;})
            .attr("class", "collapsed")    
            .attr("fill",function(d){return d.children? "":"white";})
            .attr("stroke",function(d){return d.children? "":"black";})
            .attr("stroke-width", function(d){return d.children? "":"2.5px";})
;
      
      
      
      update(d);
    }
    function collapse(d) {
            if (d.children) {
              d._children = d.children;
              d._children.forEach(collapse);
              d.children = null;
            }
          }
    
    
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
    
    
    function animateParentChain(links, nodes)
{

                //console.log(nodes);
                    d3.selectAll("circle")
                    .data(nodes)
                    .enter().append("svg:circle")
                    .attr("r", function(d){ return d.children ? circle_size : 0; })
                    .attr("fill", "orange");
            
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
    
    function get_all_children(d){
        var all_children = new Array;
        //return ;
        all_children = get_all_childs(d);
        if(all_children != null){
            console.log("end, our array has: "+all_children.length+" elements");
            all_children.forEach(function(elem){
                console.log(elem);
            });
        }
        else{
            console.log("Could not find children");
        }
        return all_children;
    }
    
    function get_all_childs(d){
        var temp_array  = new Array;
        console.log("in the get_all_childs for "+d.name+" with id: "+d.id);
        if(d.children){
                var children = d.children;
                for (var i = 0; i < children.length; i++) {
                    var temp_array_child = new Array;
                    if(temp_array_child != null){
                        temp_array_child = get_all_childs(children[i]);
                        console.log("got from child: : "+temp_array_child.length+" children");
                        temp_array_child.forEach(function(elem){
                            console.log(elem);
                            temp_array.push(elem);
                        })
                    }
                    //temp_array.push(temp_array_child);
                }
                temp_array.push(d);
        }
        else{
            console.log("well, this is a child, return its name: "+d);
            temp_array.push(d);
            return temp_array;
        }
        return temp_array;
    }
    
    
    
    
    
 
 