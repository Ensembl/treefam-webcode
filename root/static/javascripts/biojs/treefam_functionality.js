		window.onload = function() {         



			var alignment_file = "../../main/resources/dependencies/data/trees/just_sequences.json";
			//var domains_file = "http://dev.treefam.org/family/TF105041/get_seqDomains";
			//var model_json_tree = "../../main/resources/dependencies/data/trees/treefam_trees/TF101222_model.json";
			// for testing the reconciled view
			//var model_json_tree = "../../main/resources/dependencies/data/trees/toy_gene_tree.json";
			//var species_tree = "../../main/resources/dependencies/data/trees/toy_species_tree.json"
			//var species_tree = "../../main/resources/dependencies/data/trees/treefam9.json";
			// this only works in chrome where we can allow cross-domain ajax calls
			
			//var model_json_tree = "http://www.treefam.org/family/TF105041/tree/model_json";
			//var domains_file = "../../main/resources/dependencies/data/trees/just_domains.TF101003.json";
			//var domains_file = "../../main/resources/dependencies/data/trees/xref_data.TF105041.json";
			// we should really call this annotation file and tell what type of annotation it is


			// var species_tree = "../../main/resources/dependencies/data/trees/treefam9.json";
			// var domains_file = "../../main/resources/dependencies/data/trees/xref_data.TF105041.json";
			// var model_json_tree = "../../main/resources/dependencies/data/trees/TF105041_model.json";
			// var wormbase_json_tree = "../../main/resources/dependencies/data/trees/TF101003_model.json";
			// var full_json_tree = "../../main/resources/dependencies/data/trees/TF105041_full.json";

			//var wormbase_json_tree = "http://www.treefam.org/family/TF101222/tree/model_json";
			//var full_json_tree = "http://www.treefam.org/family/TF105041/tree/json";
			
			//var model_json_tree = "../../main/resources/dependencies/data/trees/treefam_trees/TF101222_full.json";

			//var full_json_tree = "../../main/resources/dependencies/data/trees/treefam_trees/TF101222_full.json";

			//var wormbase_json_tree = "../../main/resources/dependencies/data/trees/treefam_trees/TF101222_wormbase.json";
			//TF101011.
			//var model_json_tree = "../../main/resources/dependencies/data/trees/treefam_trees/TF105221_model.json";
			//var full_json_tree = "../../main/resources/dependencies/data/trees/treefam_trees/TF105221_full.json";
			//var wormbase_json_tree = "../../main/resources/dependencies/data/trees/treefam_trees/TF333268_wormbase.json";
			
			var image_path = "http://www.ebi.ac.uk/~fs/d3treeviewer/data/images/species_files/";
			var highlight_gene ;
			//var highlight_gene = "ENSP00000369497";
			//var highlight_gene = "ENSSSCP00000004697";
			var annotation_option = "seq_domains";	
			//var annotation_option = "annotation_grid";	
			var two_window = "true";
// set treefam family in header
			var myGeneTree, mySpeciesTree;

			// var treefam_family = "TF101003";
			// var treefam_family_genes = "121";
			// var treefam_family_species = "21";
			// var treefam_family_alignment_conservation = "66";
			// var treefam_family_alignment_length = "1213";
			// var treefam_symbol = "CCNI";
			// var treefam_description = "Cyclin";
			// var default_view = "ensembl";
			//jQuery("#tf_family").text(treefam_family);
			//jQuery("#tf_sequences").text(treefam_family_genes);
			//jQuery("#tf_species").text(treefam_family_species);
			//jQuery("#tf_alignment_length").text(treefam_family_alignment_conservation);
			//jQuery("#tf_alignment_conservation").text(treefam_family_alignment_length);
			
			jQuery("#cite_panel").html(
				'TreeFam family '+treefam_family+' has '+treefam_family_genes+' from '+treefam_family_species+' species. '+
				'The sequences were aligned using MCoffee. The final alignment was '+treefam_family_alignment_length+' AA long '+
				'and on average '+treefam_family_alignment_conservation+'% conserved. '+
				'TreeBest (1) was used to build a gene tree and reconcile it with the species tree. '+ 
				'TreeBest build 5 source trees using nj and Phyml (2). It then merges them into one tree trying to minimize the number of duplications using a species tree.'+
				'<p id="footnote-1">(1) Ruan,J., Li,H., Chen,Z., Coghlan,A., Coin,L.J.M., Guo,Y., H&eacute;rich&eacute;,J.-K., Hu,Y., Kristiansen,K., Li,R., et al. (2008) TreeFam: 2008 Update. Nucleic Acids Res, 36, D735-40.<\/p> '+
				'<p id="footnote-2">(2) Guindon,S., Dufayard,J.-F., Lefort,V., Anisimova,M., Hordijk,W. and Gascuel,O. (2010) New algorithms and methods to estimate maximum-likelihood phylogenies: assessing the performance of PhyML 3.0. Syst Biol, 59, 307-321.<\/p> ');
			
			
			jQuery("#family_description").html(' ('+treefam_symbol+','+treefam_description+')');
			
			jQuery("#treefam_family").text(treefam_family);
			jQuery("#treefam_family").attr("href", "http://www.treefam.org/family/" +treefam_family);
			
			
		/* jQuery("#tree_type_tooltip").tipsy({ 
				gravity: 'nw', 
				html: true, 
				title: function() {
					var text_string  = "Beside the <b>full gene tree</b> for all species, TreeFam provides a pruned-down version focussing on <b>model</b> organims only";
				  return text_string; 
				}
			});
			jQuery("#branch_length_tooltip").tipsy({ 
					gravity: 'nw', 
					html: true, 
					title: function() {
						var text_string  = "Switch between an cladogram and a phylogenetic tree.<br>"
						text_string += "The cladogram shows the relationships between genes, but does not show real branch length.";
					  return text_string; 
					}
				});
			jQuery("#labels_tooltip").tipsy({ 
					gravity: 'nw', 
					html: true, 
					title: function() {
						var text_string  = "Toggle between gene names and UniProt IDs";
					  return text_string; 
					}
				});
			jQuery("#inner_nodes_tooltip").tipsy({ 
					gravity: 'nw', 
					html: true, 
					title: function() {
						var text_string  = "Click <i>Bootstrap</i> to see support values for inner nodes.<br>";
						text_string += "<b>Taxonomy</b> displays internal taxonomic group names";
					  return text_string; 
					}
				});
			jQuery("#zooming_tooltip").tipsy({ 
					gravity: 'nw', 
					html: true, 
					title: function() {
						var text_string  = "activate the zoom to use the mouse-wheel on the tree to zoom in.";
					  return text_string; 
					}
				});
		*/

		//jQuery("#settings_panel").show();
		        //$(".show_hide").show();

		 jQuery('#cite_li').click(function(){jQuery("#cite_panel").slideToggle();});
		 jQuery('#settings_li').click(function(){jQuery("#settings_panel").slideToggle();});
   		// jQuery('#legend_li').click(function(){jQuery("#legend_panel").slideToggle();});
		 jQuery('#paste_li').click(function(){jQuery("#paste_panel").slideToggle();});
		 //jQuery("#paste_panel").show();
			
			jQuery('#show_leaf_common_name').click(function(){
						//if (jQuery(this).is(':checked')){ 			
							myTree.show_gene_annotation();			
						//}
					});
			jQuery('#show_leaf_uniprot').click(function(){
						//if (jQuery(this).is(':checked')){		
							myTree.show_uniprot_annotation();		
						//}
			});
			
			jQuery( "#swap_children" ).click(function() {		myTree.swap_children();	 jQuery("#my_custom_menu").hide();});
			jQuery( "#focus_node" ).click(function() {		myTree._focus();	jQuery("#my_custom_menu").hide(); });
			jQuery( "#collapse_node" ).click(function() {		myTree.collapse_node();	jQuery("#my_custom_menu").hide(); });
			jQuery( "#expand_all" ).click(function() {		myTree.expand_all();	jQuery("#my_custom_menu").hide(); });
			//jQuery( "#switch_perspective" ).click(function() {		myTree.switch_perspective("uniprot");	 });
			jQuery( "#show_uniprot_perspective" ).click(function() {		myTree.show_uniprot_annotation;	 });
			

			


			/*
			jQuery( "#ultra_branch_length" ).click(function() {		
				myTree.toggle_branchlength();	
			});
			jQuery( "#real_branch_length" ).click(function() {		
				myTree.toggle_branchlength();	
			}); */
			jQuery(document).on("click", "#real_branch_length", function(event){
		    	myTree.show_real_branchlength();	
		    	//jQuery(this).addClass("active");
		    	jQuery("#ultra_branch_length").removeClass("active");
		    	jQuery("#real_branch_length").addClass("active");
			});	
			jQuery(document).on("click", "#ultra_branch_length", function(event){
		    	myTree.show_ultrametric_tree();	
		    	//jQuery(this).addClass("active");
		    	jQuery("#real_branch_length").removeClass("active");
		    	jQuery("#ultra_branch_length").addClass("active");
			});	
			

			jQuery( "#highlight_node" ).click(function() {		
																highlight_gene = myTree.opt.current_d.name;
			  													myTree.collapseTree();	
			  												});
			jQuery( ".show_domains" ).click(function() {			myTree.show_domains();			});
			jQuery( ".show_alignments" ).click(function() {			myTree.show_alignments();		});

			jQuery('#reset_tree').click(function() {
					myTree._reset_tree();
					jQuery("#my_custom_menu").hide();
			});
			jQuery('#menu_close').click(function() {
					jQuery("#my_custom_menu").hide();
			});
			// Code for context menu
			jQuery('#focus').click(function() {
					var current_d_node = myTree.current_d;
					myTree._focus();
			});
	

			// bootstrap
			jQuery('#bootstrap_check').click(function() {
			        if(jQuery(this).is(":checked")) {myTree.show_bootstrap();}
					else{myTree.hide_bootstrap();}
			});
			jQuery('#taxa_level').click(function() {
			        if(jQuery(this).is(":checked")) {myTree.show_taxlevel();}
					else{myTree.hide_taxlevel();}
			    });
			
			// zoom
			jQuery('.zoom_on').click(function(){
				console.log("adding zoom");
				if (jQuery(this).is(':checked')){
				      myTree.addZoom();
				}});
			jQuery('.zoom_off').click(function(){
				console.log("adding zoom");
				if (jQuery(this).is(':checked')){
					      myTree.removeZoom();
					}});
			jQuery('.zoom_reset').click(function(){
					console.log("adding zoom");
						if (jQuery(this).is(':checked')){
							     myTree.resetZoom();
			}});

		

				jQuery('#submit_tree').click(function() {
				  //console.log('Handler for .submit() called.');
				  var json_tree_string = jQuery('textarea#pasted_tree').val();
				  //json_tree_string = jQuery("#pasted_tree").val();
				 // console.log(json_tree_string);
				  load_from_variable = 0;
						myTree = new Biojs.Tree({
							target : "YourOwnDivId",
					        //tree_target : "tree_panel",
					        //annot_target : "annotation_panel",
							two_window: true,
							annotation_option : 'seq_domain',
							load_from_web : load_from_web,
							formatOptions : {
								tree:'nhx',
								//tree:'json',
							},
							//id : 'P918283',
							json_tree : model_json_tree, 
							alignment_file : alignment_file,
							domains_file : domains_file,
							species_tree : species_tree,
							show_real_branchlength : false,
							image_path : image_path,
							newick_tree : newick_tree,
							highlight_gene : highlight_gene,
							json_tree_string : json_tree_string,
							load_from_variable : load_from_variable,
						});
				  
						console.log("well, did we call the tree?");
				  
				  return false;
				});
			
			
						//var newick_tree = "../data/trees/newick_tree.nh";
			var newick_tree = "";
			var load_from_variable = 0;
			var load_from_web = 0;
			var json_tree_string;
			
			// ok, here we plot the default tree. which will be the gene tree

			myTree = new Biojs.Tree({
					target : "YourOwnDivId",
			        //tree_target : "tree_panel",
			        //annot_target : "annotation_panel",
					two_window: true,
					annotation_option: annotation_option,
					//annotation_option: "seq_domains",
					//annotation_option: "annotation_grid",
					load_from_web : load_from_web,
					formatOptions : {
						//tree:'nhx',
						tree:'json',
					},
					json_tree : full_json_tree, 
					//json_tree : full_json_tree, 
					//alignment_file : alignment_file,
					domains_file : domains_file,
					species_tree : species_tree,
					//show_real_branchlength : true,
					image_path : image_path,
					newick_tree : newick_tree,
					default_view : "ensembl",
					highlight_gene : highlight_gene,
					json_tree_string : json_tree_string,
					load_from_variable : load_from_variable,
			}); 

			jQuery('#seq_domains_link').click(function (e) {
  				//e.preventDefault();
  				//$(this).tab('show');
  				//jQuery("#annotation_panel div").hide();
  				
  				jQuery("#annotation_panel #annotation_grid_annotation_panel").hide("slow");
  				jQuery("#annotation_panel #seq_domains_annotation_panel").show("slow");
  				//jQuery("#tree_panel").css("padding-top", 30);
  				jQuery("#tree_panel").animate({"padding-top" : 30}, 500);
			});
			jQuery('#annotation_link').click(function (e) {
  				//e.preventDefault();
  				//$(this).tab('show');
  				//jQuery("#annotation_panel div").hide();

  				// in case the tab isn't loaded	
  				if(!myTree.opt.annotation_loaded){
  					myTree.opt.annotation_option = "annotation_grid";
  					myTree.update_annotation();
  				}
  				jQuery("#annotation_panel #seq_domains_annotation_panel").hide("slow");
  				jQuery("#annotation_panel #annotation_grid_annotation_panel").show("slow");
  				//jQuery("#tree_panel").css("padding-top", 68);
  				jQuery("#tree_panel").animate({"padding-top" : 68}, 500);

			});


		// register click events for annotation tabs
			// if click on seq_domains... show that div and hide others

			jQuery("#gene_tree_link").click(function(e) {
				e.preventDefault()
  				jQuery(this).tab('show')
  				jQuery("#gene_tree_view").show("slow");
  				jQuery("#species_tree_view").hide("slow");
			});

			// register species tree component
			jQuery("#species_tree_link").click(function(e) {
				if(!mySpeciesTree){
					mySpeciesTree = new Biojs.Tree({
						target : "YourOwnDivId",
			        	//tree_target : "tree_panel",
					        //annot_target : "annotation_panel",
							two_window: true,
							annotation_option: "species_genes",
							//annotation_option: "seq_domains",
							//annotation_option: "annotation_grid",
							load_from_web : load_from_web,
							formatOptions : {
								//tree:'nhx',
								tree:'json',
							},
							json_tree : model_json_tree, 
							//json_tree : full_json_tree, 
							//alignment_file : alignment_file,
							domains_file : domains_file,
							species_tree : species_tree,
							//show_real_branchlength : true,
							image_path : image_path,
							newick_tree : newick_tree,
							default_view : "ensembl",
							highlight_gene : highlight_gene,
							json_tree_string : json_tree_string,
							load_from_variable : load_from_variable,
					});
				} 
				e.preventDefault()
  				jQuery(this).tab('show')
  				jQuery("#species_tree_view").show("slow");
  				jQuery("#gene_tree_view").hide("slow");
			});
			
			jQuery(document).on("click", "#show_full_tree_id", function(event){
			
						myTree._clear_divs();
						jQuery('#show_leaf_common_name').attr('checked', true);
						jQuery('#show_leaf_uniprot').attr('checked', false);
						jQuery('#bootstrap_check').attr('checked', false);
						jQuery('#taxa_level').attr('checked', false);
						jQuery('show_leaf_common_name').attr('checked', true);
						
						
						//myTree.showFullTree();
						myTree = new Biojs.Tree({
								target : "YourOwnDivId",
								two_window: true,
								annotation_option: "seq_domains",
								formatOptions : {
									tree:'json',
								},
								json_tree : full_json_tree, 
								domains_file : domains_file,
								image_path : image_path,
								newick_tree : newick_tree,
								default_view : default_view,
								highlight_gene : highlight_gene,
								json_tree_string : json_tree_string,
								load_from_variable : load_from_variable,
						}); 

			});
			//$("#show_model_tree_id").click(function() {
			jQuery(document).on("click", "#show_model_tree_id", function(event){
							myTree._clear_divs();

							myTree = new Biojs.Tree({
								target : "YourOwnDivId",
								two_window: true,
								annotation_option: annotation_option,
								load_from_web : load_from_web,
								formatOptions : {
									//tree:'nhx',
									tree:'json',
								},
								json_tree : model_json_tree, 
								domains_file : domains_file,
								species_tree : species_tree,
								image_path : image_path,
								newick_tree : newick_tree,
								default_view : default_view,
								highlight_gene : highlight_gene,
								json_tree_string : json_tree_string,
								load_from_variable : load_from_variable,
								});
			});
			jQuery("#show_wormbase_tree_id").click(function() {
				myTree._clear_divs();
				myTree = new Biojs.Tree({
						target : "YourOwnDivId",
				        //tree_target : "tree_panel",
				        //annot_target : "annotation_panel",
						two_window: true,
						annotation_option: "seq_domains",
						formatOptions : {
							tree:'json',
						},
						// tree parameters
						json_tree : wormbase_json_tree, 
						//alignment_file : alignment_file,
						domains_file : domains_file,
						image_path : image_path,
						newick_tree : newick_tree,
						highlight_gene : highlight_gene,
						json_tree_string : json_tree_string,
						load_from_variable : load_from_variable,
				}); 	
			});
			jQuery( "#treefam_search" ).submit(function(e) {
			  console.log("clicked!!!!")
			

			var value = jQuery("#treefam_search_field").val();
			var begin_string = value.substring(0,3);
			if(value === "" || value ===null){
				alert("Please enter accession number\n");
				return false;
			}
			else if(begin_string === "TF"){
				alert("Please enter accession number like TF101003\n");
				return false;
			}
			//myTree._clear_divs();
				model_json_tree = "http://www.treefam.org/family/"+value+"/tree/model_json";
				wormbase_json_tree = "http://www.treefam.org/family/"+value+"/tree/wormbase_json";
				full_json_tree = "http://www.treefam.org/family/"+value+"/tree/json";
				domains_file = "http://dev.treefam.org/family/"+value+"/get_seqDomains";  
				
				myTree.updateAnnotationPanel({domains_file: domains_file});

		//	$("#e2").on("change", function(e) { 
			/* 	myTree._clear_divs();
				jQuery('<img id="tree_spinner" src="http://www.mapmatters.org/img/spinner_large.gif" alt="Loading tree" height="22" width="22">...loading tree data').appendTo("#tree_panel");
				 jQuery('<img id="annotation_spinner" src="http://www.mapmatters.org/img/spinner_large.gif" alt="Loading annotation" height="22" width="22">...loading annotation data').appendTo("#annotation_panel");
				model_json_tree = "http://www.treefam.org/family/"+value+"/tree/model_json";
				wormbase_json_tree = "http://www.treefam.org/family/"+value+"/tree/wormbase_json";
				full_json_tree = "http://www.treefam.org/family/"+value+"/tree/json";
				domains_file = "http://dev.treefam.org/family/"+value+"/get_seqDomains";  */
				/*domains_file = "../../main/resources/dependencies/data/trees/just_domains."+value+".json";
				model_json_tree = "../../main/resources/dependencies/data/trees/"+value+"_full.json";
				wormbase_json_tree = "../../main/resources/dependencies/data/trees/"+value+"_.json";
				full_json_tree = "../../main/resources/dependencies/data/trees/"+value+"_full.json"; */
				
				/*
				myTree = new Biojs.Tree({
						target : "YourOwnDivId",
				        //tree_target : "tree_panel",
				        //annot_target : "annotation_panel",
						two_window: two_window,
						annotation_option: annotation_option,
						load_from_web : load_from_web,
						formatOptions : {
							//tree:'nhx',
							tree:'json',
						},
						json_tree : model_json_tree, 
						alignment_file : alignment_file,
						domains_file : domains_file,
						species_tree : species_tree,
						image_path : image_path,
						newick_tree : newick_tree,
						highlight_gene : highlight_gene,
						json_tree_string : json_tree_string,
						load_from_variable : load_from_variable,
				}); 
			*/
				alert("now it is done\n");	
				console.log("something("+e.val+") has changed"); 
			}) 



		jQuery( "#e2" ).change(function(e) {
			  console.log("clicked!!!!")
			//});
			var value = this.value;
			
		//	$("#e2").on("change", function(e) { 
				myTree._clear_divs();
				jQuery('<img id="tree_spinner" src="http://www.buffalorose.net/shop/ccdata/images/spinner.gif" alt="Loading tree" height="22" width="22">...loading tree data').appendTo("#tree_panel");
				jQuery('<img id="annotation_spinner" src="http://www.buffalorose.net/shop/ccdata/images/spinner.gif" alt="Loading annotation" height="22" width="22">...loading annotation data').appendTo("#annotation_panel");
				model_json_tree = "http://www.treefam.org/family/"+value+"/tree/model_json";
				wormbase_json_tree = "http://www.treefam.org/family/"+value+"/tree/wormbase_json";
				full_json_tree = "http://www.treefam.org/family/"+value+"/tree/json";
				domains_file = "http://dev.treefam.org/family/"+value+"/get_seqDomains"; 
				/*domains_file = "../../main/resources/dependencies/data/trees/just_domains."+value+".json";
				model_json_tree = "../../main/resources/dependencies/data/trees/"+value+"_full.json";
				wormbase_json_tree = "../../main/resources/dependencies/data/trees/"+value+"_.json";
				full_json_tree = "../../main/resources/dependencies/data/trees/"+value+"_full.json"; */
				
				
				myTree = new Biojs.Tree({
						target : "YourOwnDivId",
				        //tree_target : "tree_panel",
				        //annot_target : "annotation_panel",
						two_window: two_window,
						annotation_option: annotation_option,
						format : 'CODATA',
						load_from_web : load_from_web,
						formatOptions : {
							//tree:'nhx',
							tree:'json',
						},
						id : 'P918283',
						json_tree : model_json_tree, 
						alignment_file : alignment_file,
						domains_file : domains_file,
						species_tree : species_tree,
						image_path : image_path,
						newick_tree : newick_tree,
						highlight_gene : highlight_gene,
						json_tree_string : json_tree_string,
						load_from_variable : load_from_variable,
				}); 
			
			
				console.log("something("+e.val+") has changed"); 
			}) 


	// allow scrolling of both divs
    /*  var target = jQuery("#tree_panel");
      jQuery("#annotation_svg_container").scroll(function() {
        target.prop("scrollTop", this.scrollTop)
              .prop("scrollLeft", this.scrollLeft);
      });
      var target = jQuery("#annotation_panel");
      jQuery("#tree_panel").scroll(function() {
        target.prop("scrollTop", this.scrollTop)
              .prop("scrollLeft", this.scrollLeft);
      });
	*/

//enabling stickUp on the '.navbar-wrapper' class
             //     jQuery('#widget_menu').affix();
		}; 
