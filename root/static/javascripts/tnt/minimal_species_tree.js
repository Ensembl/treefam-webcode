var tnt_theme_minimal_species_tree = function() {
    "use strict";
    var tree = tnt.tree();
    var tree_theme = function(tree_vis, div) {

        var species_tree_newick = "((((Ensembl:4,EnsemblMetazoa:4)Metazoa:4,EnsemblFungi:4)Opisthokonta:4,EnsemblProtists:4,EnsemblPlants:4)Eukaryota:4,EnsemblBacteria:4)cellular_organisms:4;";
        // var newick = "(((((homo_sapiens:9,pan_troglodytes:9)207598:34,callithrix_jacchus:43)314293:52,mus_musculus:95)314146:215,taeniopygia_guttata:310)32524:107,danio_rerio:417)117571:135;"

        // var data = tnt.tree.parse_newick(newick);

        tree
                .data(tnt.tree.parse_newick(species_tree_newick))
                .layout(tnt.tree.layout.vertical()
                    .width(430)
                    .scale(false))
                .label(tnt.tree.label.text()
                     .fontsize(12)
                     .height(30)
                    // joined_label  // labels with pictures
                    // tnt.tree.label.text()
                    // .fontsize(12)
                    // .height(height)
            );

            
        // var tree = tree_vis.tree();
        tree.on_click (function(node){
            // sT
                node.toggle()
                tree.update();
        });

        // The visualization is started at this point
        tree(div);
        

    };

    return tree_theme;
};