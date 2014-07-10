//d3.json("test.json", function (treefam_data) {

     
var pie5NetworkSize;
var rootChart, rootChart2;
// var familiesBubbleChart  = dc.bubbleChart("#families-bubble-chart"); 
//var familieslineChart  = dc.lineChart("#chart-line-families"); 
var fluctuationChart;
var conservationChart;
var speciesCountChart;
var modelOrganismChart;
var domainCoverageChart;
var mouseGenesChart;
var humanGenesChart;
var zebrafishChart;

var moveChart;
var volumeChart;

var pfam_coverageChart;
var hgncChart;
var pieTip;



//var div_width = d3.select("#crossfilter_div").style("width").replace("px","");
div_width = 900;


//d3.json("all_tf9_fams.json", function (treefam_data) {
d3.json("/static/trees/tf10_small.json", function (treefam_data) {


// load spinner


function print_filter(filter) {
    var f = eval(filter);
    if (typeof (f.length) != "undefined") {} else {}
    if (typeof (f.top) != "undefined") {
        f = f.top(Infinity);
    } else {}
    if (typeof (f.dimension) != "undefined") {
        f = f.dimension(function (d) {
            return "";
        }).top(Infinity);
    } else {}
    console.log(filter + "(" + f.length + ") = " + JSON.stringify(f).replace("[", "[\n\t").replace(/}\,/g, "},\n\t").replace("]", "\n]"));
}
function getvalues(d){
    var str=d.key.getDate() + "/" + (d.key.getMonth() + 1) + "/" + d.key.getFullYear()+"\n";
    var key_filter = dateDim.filter(d.key).top(Infinity);
    var total=0
    key_filter.forEach(function(a) {
        str+=a.status+": "+a.hits+" Hit(s)\n";
        total+=a.hits;
    });

    str+="Total:"+total;
    //remove filter so it doesn't effect the graphs,
    //this is the only filter so we can do this
    dateDim.filterAll();
    return str;
} 
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};




        
pie5NetworkSize = dc.pieChart("#pie5NetworkSize");
 rootChart = dc.rowChart("#org-chart");
 // rootChart2 = dc.pieChart("#org-chart2");
// var familiesBubbleChart  = dc.bubbleChart("#families-bubble-chart"); 
//var familieslineChart  = dc.lineChart("#chart-line-families"); 
 fluctuationChart = dc.barChart("#fluctuation-chart");
 conservationChart = dc.barChart("#conservation-chart");
 modelOrganismChart = dc.rowChart("#modelOrganism_chart");
 //domainCoverageChart = dc.barChart("#domain_coverage-chart");

 speciesCountChart = dc.barChart("#species_count-chart");
 
  mouseGenesChart = dc.barChart("#mouse_genes-chart");
  humanGenesChart = dc.barChart("#human_genes-chart");
  zebrafishChart = dc.barChart("#zebrafish_genes-chart");


 pfam_coverageChart = dc.barChart("#pfam-chart");

    // moveChart = dc.lineChart("#monthly-move-chart");
    // volumeChart = dc.barChart("#monthly-volume-chart");


var ndx_treefam = crossfilter(treefam_data); 
var modelDim  = ndx_treefam.dimension(function(d) {return d.geneCount;});
//print_filter("modelDim");    

var functionDim = modelDim.group().reduceSum(function (d) {return d.alnLength;});
//print_filter("functionDim");    

//var max_gene_count = d3.max(treefam_data, function(d) { return +d.geneCount;} );

var max_conservation = d3.max(treefam_data, function(d) { return +d.percentIdentity;} );
var max_coverage = d3.max(treefam_data, function(d) { return +d.coverage;} );

var max_human_genes = d3.max(treefam_data, function(d) { return +d.human_genes;} );
var max_mouse_genes = d3.max(treefam_data, function(d) { return +d.mouse_genes;} );
var max_zebrafish_genes = d3.max(treefam_data, function(d) { return +d.zebrafish_genes;} );
var max_root_taxa = d3.max(treefam_data, function(d) { return +d.rootTaxon;} );
var max_speciesCount = d3.max(treefam_data, function(d) { return +d.speciesCount;} );


var max_pfamCount = d3.max(treefam_data, function(d) { return +d.pfam;} );


var count_families = 0;
var count_rootFamilies  = new Object();

var no_families_threshold = Math.floor(treefam_data.length * 2 / 100); 

treefam_data.forEach(function(d,i){

    if(Number(d.percentIdentity) == 0 || isNaN(Number(d.percentIdentity))){ d.percentIdentity_t = "?"; }
        else if(Number(d.percentIdentity) < 30) { d.percentIdentity_t = "slow"; }
        else if(Number(d.percentIdentity) >= 30 && Number(d.percentIdentity) < 60) { d.percentIdentity_t = "medium"; }
        else if(Number(d.percentIdentity) >= 60) { d.percentIdentity_t = "fast"; }
    // put into gene size bin
        if(d.geneCount){ d.numberClass = Math.round(d.geneCount *  100 / max_gene_count); }

        d.domain_coverage = Math.floor(Math.random() * 100) + 1;

        var species_array = ["human", "mouse", "zebrafish", "plant"];
        d.modelOrganism = species_array[Math.floor(Math.random() * 4) ];
        d.modelOrga = new Array();
        ["human_genes", "mouse_genes", "zebrafish_genes", "plant_genes"].map(function(item){
            if(item === undefined || item === "undefined"){return}
            if(d[item] && d[item] >0 ){ d.modelOrga.push({ name : d[item] }); }
            
        });
        d.percentIdentity = Math.floor(d.percentIdentity);
        if(d.rootTaxon in count_rootFamilies){
            if(d.rootTaxon != "Caenorhabditis"){
                count_rootFamilies[d.rootTaxon]++;
            }
        }
        else{
            count_rootFamilies[d.rootTaxon] = 1;   
        }
        count_families++;

        d.tweaked_geneCount = d.geneCount > 600? 601 : d.geneCount;

        //if(d.rootTaxon ==)
        //d.realRoot = 

});
treefam_data.forEach(function(d,i){
    if(count_rootFamilies[d.rootTaxon] > no_families_threshold){
        d.cleanRoot = d.rootTaxon;
    }

});

var max_gene_count = d3.max(treefam_data, function(d) { return +d.tweaked_geneCount;} );

// set number of families
jQuery("#total_families").text(count_families);

var all = ndx_treefam.groupAll();

dc.dataCount(".dc-data-count")
        .dimension(ndx_treefam)
        .group(all);


dc.dataCount(".dc-data-count2")
        .dimension(ndx_treefam)
        .group(all);



var count_percentIdentityDimension = ndx_treefam.dimension(function(d){ return d.percentIdentity_t; });
var count_percentIdentityGroup = count_percentIdentityDimension.group();

pie5NetworkSize.width(90).height(90).radius(40).dimension(count_percentIdentityDimension).group(count_percentIdentityGroup).minAngleForLabel(0);

var conservation = ndx_treefam.dimension(function (d) {return d.percentIdentity;});
var conservationGroup = conservation.group();


conservationChart.width(Math.floor(div_width/3))
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(conservation)
        .group(conservationGroup)
        .elasticY(true)
        //.elasticX(true)
        // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
        //.centerBar(true)
        // (optional) set gap between bars manually in px, :default=2
        //.gap(1)
        // (optional) set filter brush rounding
        //.round(dc.round.floor)
        //.alwaysUseRounding(true)
        //.x(d3.scale.linear().domain([0,max_conservation]))
        .x(d3.scale.linear().domain([0,100]))
        .xAxisLabel('% alignment identity')
        .yAxisLabel('Number of families')
        .renderHorizontalGridLines(true);

var speciesCount_dim = ndx_treefam.dimension(function (d) {return d.speciesCount;});
var speciesCountGroup = speciesCount_dim.group();


speciesCountChart.width(Math.floor(div_width/3))
        .height(200)
         .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(speciesCount_dim)
        .group(speciesCountGroup)
        .elasticY(true)
        //.elasticX(true)
        // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
        .centerBar(true)
        // (optional) set gap between bars manually in px, :default=2
        .gap(1)
        // (optional) set filter brush rounding
        //.round(dc.round.floor)
        .alwaysUseRounding(true)
        //.x(d3.scale.linear().domain([0,max_conservation]))
        .x(d3.scale.linear().domain([0,max_speciesCount]))
        .xAxisLabel('Number of species')
        .yAxisLabel('Number of families')
        .renderHorizontalGridLines(true);

// human genes
var humanGenes_dim = ndx_treefam.dimension(function (d) {return d.human_genes; });
var humanGenes_grp = humanGenes_dim.group();
humanGenesChart.width(Math.floor(div_width/3))
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(humanGenes_dim)
        .group(humanGenes_grp)
        .elasticY(true)
        //.elasticX(true)
        // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
        //.centerBar(true)
        // (optional) set gap between bars manually in px, :default=2
        .gap(1)
        // (optional) set filter brush rounding
        //.round(dc.round.floor)
        //.alwaysUseRounding(true)
        .x(d3.scale.linear().domain([0,max_human_genes+1]))
        .xAxisLabel('No of human genes/family')
        .yAxisLabel('Number of families')
        //.renderHorizontalGridLines(true);

// mouse genes
var mouseGenes_dim = ndx_treefam.dimension(function (d) {return d.mouse_genes;});
var mouseGenes_grp = mouseGenes_dim.group();
mouseGenesChart.width(Math.floor(div_width/3))
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(mouseGenes_dim)
        .group(mouseGenes_grp)
        .elasticY(true)
        //.elasticX(true)
        // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
        .centerBar(true)
        // (optional) set gap between bars manually in px, :default=2
        .gap(1)
        // (optional) set filter brush rounding
        //.round(dc.round.floor)
        //.alwaysUseRounding(true)
        //.x(d3.scale.linear().domain([0,max_mouse_genes+1]))
        .x(d3.scale.linear().domain([0,50]))
        .xAxisLabel('No of mouse genes/family')
        .yAxisLabel('Number of families')
        .renderHorizontalGridLines(true);


var zebrafishGenes_dim = ndx_treefam.dimension(function (d) {return d.zebrafish_genes;});
var zebrafishGenes_grp = zebrafishGenes_dim.group();
zebrafishChart.width(Math.floor(div_width/3))
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(zebrafishGenes_dim)
        .group(zebrafishGenes_grp)
        .elasticY(true)
        //.elasticX(true)
        // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
        .centerBar(true)
        // (optional) set gap between bars manually in px, :default=2
        //.gap(1)
        // (optional) set filter brush rounding
        //.round(dc.round.floor)
        //.alwaysUseRounding(true)
        //.x(d3.scale.linear().domain([0,max_zebrafish_genes+1]))
        .x(d3.scale.linear().domain([0,50]))
        .xAxisLabel('No of zebrafish genes/family')
        .yAxisLabel('Number of families')
        .renderHorizontalGridLines(true);

// pfa


// moveChart
//         .renderArea(true)
//         .width(600)
//         .height(200)
//         .transitionDuration(1000)
//         .margins({top: 30, right: 50, bottom: 25, left: 40})
//         .dimension(humanGenes_dim)
//         //.mouseZoomable(true)
//         // Specify a range chart to link the brush extent of the range with the zoom focue of the current chart.
//         .rangeChart(volumeChart)
//         .x(d3.scale.linear().domain([0,30]))
//         //.round(d3.time.month.round)
//         //.xUnits(d3.time.months)
//         .elasticY(true)
//         //.renderHorizontalGridLines(true)
//         .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
//         .brushOn(false)
//         // Add the base layer of the stack with group. The second parameter specifies a series name for use in the legend
//         // The `.valueAccessor` will be used for the base layer
//         .group(humanGenes_grp, "Human genes")
//           .valueAccessor(function (d) {
//              return d.value;
//           })
//         // stack additional layers with `.stack`. The first paramenter is a new group.
//         // The second parameter is the series name. The third is a value accessor.
//         .stack(mouseGenes_grp, "Mouse genes", function (d) {
//              return d.value;
//          })
//         .stack(zebrafishGenes_grp, "Mouse genes", function (d) {
//              return d.value;
//          })
//         // .stack(humanGenes_dim, "Mouse genes", function (d) {
//         //      return d.value;
//         //  })

//         // .stack(humanGenes_grp, "Human genes", function (d) {
//         //      return d.value;
//         //  })
//         // title can be called by any stack layer.
//         // .title(function (d) {
//         //     var value = d.value.avg ? d.value.avg : d.value;
//         //     if (isNaN(value)) value = 0;
//         //     return dateFormat(d.key) + "\n" + numberFormat(value);
//         // })
//         .xAxisLabel('No of model organism genes')
//         .yAxisLabel('No of families')
//         ;


// volumeChart.width(600)
//         .height(90)
//         .margins({top: 0, right: 50, bottom: 20, left: 40})
//         .dimension(humanGenes_dim)
//         .group(humanGenes_grp)
//         .centerBar(true)
//         .gap(1)
//         .x(d3.scale.linear().domain([0,30]))
//         //.round(d3.time.month.round)
//         //.alwaysUseRounding(true)
//         //.xUnits(d3.time.months)
//         ;

// domain coverage

// var domain_coverage = ndx_treefam.dimension(function (d) {return d.domain_coverage;});
// var domainCoverageGroup = domain_coverage.group();

// domainCoverageChart.width(350)
//         .height(200)
//         .margins({top: 10, right: 50, bottom: 30, left: 40})
//         .dimension(domain_coverage)
//         .group(domainCoverageGroup)
//         .elasticY(true)
//         // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
//         .centerBar(true)
//         // (optional) set gap between bars manually in px, :default=2
//         .gap(1)
//         // (optional) set filter brush rounding
//         .round(dc.round.floor)
//         .alwaysUseRounding(true)
//         .x(d3.scale.linear().domain([0,100]))
//         .xAxisLabel('% pfam residue coverage')
//         .yAxisLabel('Number of families')
//         .renderHorizontalGridLines(true)


var pfam_coverage = ndx_treefam.dimension(function (d) {return d.pfam;});
var pfamGroup = pfam_coverage.group();

pfam_coverageChart.width(Math.floor(div_width/3))
// pfam_coverageChart.width(300)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(pfam_coverage)
        .group(pfamGroup)
        .elasticY(true)
        // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
        .centerBar(true)
        // (optional) set gap between bars manually in px, :default=2
        //.gap(1)
        // (optional) set filter brush rounding
        //.round(dc.round.floor)
        //.alwaysUseRounding(true)
        .x(d3.scale.linear().domain([0,20]))
        .xAxisLabel('Number of Pfam families / TreeFam family')
        .yAxisLabel('Number of families')
        .renderHorizontalGridLines(true);

// pfam_coverageChart.width(Math.floor(div_width/3)) // (optional) define chart width, :default = 200
//                 .height(rootChartHight) // (optional) define chart height, :default = 200
//                 .transitionDuration(750)
//                 .dimension(rootTaxon_dim) // set dimension
//                 .group(rootTaxon_grp) // set group
//                 .renderLabel(true)
//                 .elasticX(true)
//                 // .labelOffsetX(1)
//                 //.x(d3.scale.linear().domain([0,max_root_taxa+10]))
//                 .x(d3.scale.linear().domain([0,10]))
//                 //.xAxisLabel('Number of families')
//                 .margins({top: 20, left: 10, right: 10, bottom: 20});


var diff_root = new Object();
var rootTaxon_dim = ndx_treefam.dimension(function (d) {
    diff_root[d.cleanRoot] = 1;
    return d.cleanRoot;
});
var no_root_taxa = Object.size(diff_root);
var rootChartHight = Math.max(no_root_taxa * 40, 100);
var rootTaxon_grp = rootTaxon_dim.group();
//var rootTaxon_heigth = rootTaxon_grp.length();
rootChart.width(Math.floor(div_width/3)) // (optional) define chart width, :default = 200
                .height(rootChartHight) // (optional) define chart height, :default = 200
                .transitionDuration(750)
                .dimension(rootTaxon_dim) // set dimension
                .group(rootTaxon_grp) // set group
                .renderLabel(true)
                .elasticX(true)
                .labelOffsetX(1)
                //.x(d3.scale.linear().domain([0,max_root_taxa+10]))
                .x(d3.scale.linear().domain([0,10]))
                //.xAxisLabel('Number of families')
                .margins({top: 20, left: 10, right: 10, bottom: 20});

// tooltips for pie chart
            pieTip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function (d) { return "<span style='color: black'>" +  d.data.key + "</span> : "  + d.value; });


// rootChart2.width(100)
//                     .height(200)    
//                     .transitionDuration(750)
//                     .radius(50)
//                     .innerRadius(30)
//                     .dimension(rootTaxon_dim)
//                     .title(function (d) { return ""; })
//                     .group(rootTaxon_grp)
//                     //.colors(expenseColors)
//                     .renderLabel(false);


var modelOrganism_dim = ndx_treefam.dimension(function (d) {return d.modelOrganism;});
var modelOrganism_grp = modelOrganism_dim.group();
modelOrganismChart.width(280) // (optional) define chart width, :default = 200
                .height(200) // (optional) define chart height, :default = 200
                .dimension(modelOrganism_dim) // set dimension
                .group(modelOrganism_grp) // set group
                .elasticX(true)
                .labelOffsetX(1)
                //.xAxisLabel('Number of families')
                .margins({top: 20, left: 10, right: 10, bottom: 20});

var sizeDim = ndx_treefam.dimension(function(d) {return d.geneCount;});
var size_grp = sizeDim.group();
var percentDim = sizeDim.group().reduceSum(function(d) {return d.percentIdentity;}); 

// var max_size = d3.max(treefam_data, function(d) { return d.geneCount;  });
// var min_size = d3.min(treefam_data, function(d) { return d.geneCount;  });


var datatable   = dc.dataTable("#dc-data-familiestable");
datatable
    .dimension(sizeDim)
    .group(function(d) { return ""})
    .columns([
         function(d) { return "<a href ='/family/"+d.modelName+"' >"+d.modelName+"</a>" },
        //function(d) {return d.description; },
        function(d) {return d.geneCount;},
        function(d) {return d.alnLength;},
        function(d) {return d.percentIdentity;},        
        function(d) {return d.rootTaxon;},
    ])
    .size(50)
    .order(d3.ascending);


var fluctuation = ndx_treefam.dimension(function (d) {
        // avoid too large families
        return d.tweaked_geneCount;
        return d.geneCount;
    });
var fluctuationGroup = fluctuation.group();
fluctuationChart.width(div_width)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(fluctuation)
        .group(fluctuationGroup)
       // .elasticY(true)
       // .elasticX(true)
    
        // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
        //.centerBar(true)
        // (optional) set gap between bars manually in px, :default=2
        .gap(1)
        // (optional) set filter brush rounding
        .round(dc.round.floor)
        .alwaysUseRounding(true)
        .x(d3.scale.linear().domain([0,max_gene_count+20]))
        .xAxisLabel('Number of genes/family')
        .yAxisLabel('Number of families')
        .renderHorizontalGridLines(true)
        // customize the filter displayed in the control span
        //.filterPrinter(function (filters) {
        //    var filter = filters[0], s = "";
        //    s += numberFormat(filter[0]) + "% -> " + numberFormat(filter[1]) + "%";
        //    return s;
        //        })
;



dc.renderAll(); 
jQuery("#tree_spinner").hide();   

// d3.selectAll(".pie-slice").call(pieTip);
//                 d3.selectAll(".pie-slice").on('mouseover', pieTip.show)
//                     .on('mouseout', pieTip.hide);


window.rootfilter = function(filters) {
    rootChart.filter('Vertebrata');
    dc.renderAll();
  };

// window.familiesfilter = function(filters) {
//     fluctuationChart.filter([100,109]);
//     dc.renderAll();
//   };

// window.alignmentfilter = function(filters) {
//     conservationChart.filter([80,100]);
//     dc.renderAll();
//   };

});


// reset all charts
function reset() {
    fluctuationChart.filterAll();
    rootChart.filterAll();
    conservationChart.filterAll();
    modelOrganismChart.filterAll();
    //domainCoverageChart.filterAll();
    pie5NetworkSize.filterAll();
    dc.redrawAll();
};



// function rootfilter(filters) {
//     reset();
//     for (var i = 0; i < filters.length; i++) {
//         rootChart.filter(filters[i]);   
//     }
//     dc.redrawAll();
// }

function familiesfilter(filters) {
    reset();
    for (var i = 0; i < filters.length; i++) {
        fluctuationChart.filter(filters[i]);   
    }
    dc.redrawAll();
}


function alignmentfilter(filters) {
    reset();
    for (var i = 0; i < filters.length; i++) {
        conservationChart.filter(filters[i]);   
    }
    dc.redrawAll();
}



jQuery("#tipsy_tax_root").tipsy({ 
                    gravity: 'sw', html: true, 
                    title: function() {
                        var text_string  = "Shows the last common ancestor of TreeFam families. E.g. if a family contains a set of genes from";
                        text_string += " Human, Chimpanzee, Mouse, and Rat, then the last common ancestor would be 'Euarchontoglires' (Supraprimates) .";
                      return text_string; 
                    }
                });


jQuery("#tipsy_modorga").tipsy({ 
                    gravity: 'sw', html: true, 
                    title: function() {
                        var text_string  = "Shows the total number of genes from some model organisms.";
                      return text_string; 
                    }
                });
jQuery("#tipsy_pfam").tipsy({ 
                    gravity: 'sw', html: true, 
                    title: function() {
                        var text_string  = "Shows the number of assigned Pfam families for TreeFam families.";
                      return text_string; 
                    }
                });
jQuery("#tipsy_alignment").tipsy({ 
                    gravity: 'sw', html: true, 
                    title: function() {
                        var text_string  = "Shows the alignment conservation of the alignmnents underlying the TreeFam families in %.";
                      return text_string; 
                    }
                });
jQuery("#tipsy_family").tipsy({ 
                    gravity: 'sw', html: true, 
                    title: function() {
                        var text_string  = "Shows the TreeFam families according to the number of gene members.<br>";
                        text_string += "(Note that all families with >= 600 members were collapsed and are shown as the 600 line)";
                      return text_string; 
                    }
                });

