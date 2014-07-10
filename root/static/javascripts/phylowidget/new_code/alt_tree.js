function visit(parent, visitFun, childrenFun){
    if (!parent) return;

    visitFun(parent);

    var children = childrenFun(parent);
    if (children) {
        var count = children.length;
        for (var i = 0; i < count; i++) {
            visit(children[i], visitFun, childrenFun);
        }
    }
}


function elbow(d, i) {
      return "M" + d.source.y + "," + d.source.x
            + "V" + d.target.x + "H" + d.target.y;
}


var ui;

function buildTree(containerName, treeData, customOptions){
    // build the options object
    var options = $.extend({
        nodeRadius: 5, fontSize: 12
    }, customOptions);


    // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;
    visit(treeData, function(d) {
        totalNodes++;
        maxLabelLength = Math.max(d.name ? d.name.length : 0, maxLabelLength);
    }, function(d) {
        return d.children && d.children.length > 0 ? d.children : null;
    });
    console.log("max label width: "+maxLabelLength);

    // size of the diagram
    var size = { width:$(containerName).outerWidth(), height: totalNodes * (options.fontSize+3)};

    var tree = d3.layout.cluster()
        .sort(null)
        .size([size.height, size.width - maxLabelLength * options.fontSize]);

    var nodes = tree.nodes(treeData);
    var links = tree.links(nodes);


    /*
     <svg>
     <g class="container" />
     </svg>
     */
    var svgRoot = d3.select(containerName)
        .append("svg:svg").attr("width", size.width).attr("height", size.height);

    // Add the clipping path
    svgRoot.append("svg:clipPath").attr("id", "clipper")
        .append("svg:rect")
        .attr('id', 'clip-rect');

    var layoutRoot = svgRoot
        .append("svg:g")
        .attr("class", "container")
        .attr("transform", "translate(" + maxLabelLength + ",0)");


    // Edges between nodes as a <path class="link" />
    var link = d3.svg.diagonal()
        .projection(function(d) {
            return [d.y, d.x];
        });

    var linkGroup = layoutRoot.append("svg:g");

    linkGroup.selectAll("path.link")
        .data(links)
        .enter()
        .append("svg:path")
        .attr("class", "link")
        .attr("d", link);


    var animGroup = layoutRoot.append("svg:g")
        .attr("clip-path", "url(#clipper)");

    /*
     Nodes as
     <g class="node">
     <circle class="node-dot" />
     <text />
     </g>
     */
    var nodeGroup = layoutRoot.selectAll("g.node")
        .data(nodes)
        .enter()
        .append("svg:g")
        .attr("class", "node")
        .attr("transform", function(d){
            return "translate(" + d.y + "," + d.x + ")";
        });

    // Cache the UI elements
    ui = {
        svgRoot: svgRoot,
        nodeGroup: nodeGroup,
        linkGroup: linkGroup,
        animGroup: animGroup
    };

    // Attach the hover and click handlers
    setupMouseEvents();

    nodeGroup.append("svg:circle")
        .attr("class", "node-dot")
        .attr("r", options.nodeRadius);

    nodeGroup.append("svg:text")
        .attr("text-anchor", function(d)
        {
            return d.children ? "end" : "start";
        })
        .attr("dx", function(d)
        {
            var gap = 2 * options.nodeRadius;
            return d.children ? -gap : gap;
        })
        .attr("dy", 3)
        .text(function(d)
        {
            return d.name ? d.name : "n/a";
        });

}

function setupMouseEvents(){
    ui.nodeGroup
        .on('mouseover', function(d, i){
            d3.select(this).select("circle").classed("hover", true);
        })
        .on('mouseout', function(d, i){
            d3.select(this).select("circle").classed("hover", false);
        })
        .on('click', function(nd, i) {
            // Walk parent chain
            var subnodes = [];
            visit(nd, function(d) {
                subnodes.push(d);
            }, function(d) {
                return d.children && d.children.length > 0 ? d.children : null;
            });
           
            // Get the matched links
            var matchedLinks = [];
            ui.linkGroup.selectAll('path.link')
                .filter(function(d, i)
                {
                    return _.any(subnodes, function(p)
                    {
                        return p === d.source;
                    });
                })
                .each(function(d)
                {
                    matchedLinks.push(d);
                });

            animateParentChain(matchedLinks);
        });
}

function animateParentChain(links){
    var linkRenderer = d3.svg.diagonal()
        .projection(function(d)
        {
            return [d.y, d.x];
        });

    // Links
    ui.animGroup.selectAll("path.selected")
        .data([])
        .exit().remove();

    ui.animGroup
        .selectAll("path.selected")
        .data(links)
        .enter().append("svg:path")
        .attr("class", "selected")
        .attr("d", linkRenderer);

    // Animate the clipping path
    var overlayBox = ui.svgRoot.node().getBBox();

    ui.svgRoot.select("#clip-rect")
        .attr("x", overlayBox.x + overlayBox.width)
        .attr("y", overlayBox.y)
        .attr("width", 0)
        .attr("height", overlayBox.height)
        .transition().duration(500)
        .attr("x", overlayBox.x)
        .attr("width", overlayBox.width);
}
