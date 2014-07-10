var TreeInsertion = function(args){
	this.method = args.method;
	this.tree_insertion = args.tree_insertion;
	this.tree_algorithm = args.tree_algorithm;
	this.selected_family = args.selected_family;
	this.alignment_job_id = args.alignment_job_id;
	console.log("we are here with tree_algorithm: ",this.tree_algorithm," and selected_family: "+this.selected_family);
	
	switch(this.method){
		//case "pfamscan": this.active_job_id = "hmmer_hmmscan-R20130820-162954-0175-86845714-hx"; break;
		//case "treefamscan": this.active_job_id = "hmmer_hmmscan-R20130820-162955-0104-36364468-hx"; break;
		//case "alignment": this.active_job_id = "mafft_addseq-R20130820-145748-0955-61818369-oy"; break;
		//case "tree_building": this.active_job_id = "raxml_epa-R20130820-145755-0824-18851365-hx"; break;
	}
	this.seq = args.seq;
	this.seq_length = args.seq.length;
	this.start_time = new Date();
	this.get_data();
	// for alignment testing
	//this.hmmscan_done = 1;
	//this.alignment_done = 1;
	this.submit_job();
	//this.check_job_status();
	//this.get_job_result();
};
TreeInsertion.prototype = {
    some_property: null,
    some_other_property: 0,
    //active_job_id: 0,
    selected_family: null,
    treefamscan_done: false,
    pfamscan_done: false,
    hmmscan_done: false,
    alignment_done: false,
    tree_building_done: false,
    no_of_insertions: null,
    time_interval: 0,
    //tree_insertion: 0,
    counter: 0,

    doSomething: function(msg) {
        this.some_property = msg;
        alert(this.some_property);
    },
   
submit_job: function(){
	var method = this.method;
	var url;
	var self = this;
	var values  = new Object();
	var base_url ="http://www.ebi.ac.uk/Tools/services/rest/" 
	// url
	switch(method){
		case "treefamscan": 
				values['seq'] = self.seq;
				self.result_type = "domtblout";
				self.submit_url = "/search/sequence_submit";
				self.status_url = "/search/sequence_status";
				self.result_url = "/search/sequence_get_results";
		break;
		case "pfamscan": 
				values['seq'] = self.seq;
				values['database'] = "pfam-a"; 
				self.result_type = "domtblout";
				self.submit_url = "/search/sequence_submit";
				self.status_url = "/search/sequence_status";
				self.result_url = "/search/sequence_get_results";
		break;
		case "alignment": 
				values['seq'] = self.seq;
				//values['fastaalign'] = self.fastaalign;
				values['family'] = self.selected_family;
				self.result_type = "aln-fasta";
				self.submit_url = "/search/alignment_submit";
				self.status_url = "/search/alignment_status";
				self.result_url = "/search/alignment_get_results";
		break;
		case "tree_building": 
				self.result_type = "labelledtree";
				//values['newick'] = self.tree_newick;
				//values['alignment'] = self.final_alignment;
				values['family'] = self.selected_family;
				values['algorithm'] = self.tree_algorithm;
				values['alignment_job_id'] = self.alignment_job_id;
				self.submit_url = "/search/tree_submit";
				self.status_url = "/search/tree_status";
				self.result_url = "/search/tree_get_results";
		break;
	}
	// is it ok to submit?
	//if(self.method == "alignment" && !self.hmmscan_done){
	//	console.log("object is mafft, cannot submit yet");	
	//}
	//if(self.method == "tree_building" && !self.alignment_done){
	//	console.log("object is tree_building, cannot submit yet");	
	//}	
	// arguments
	if(self.active_job_id){
		console.log("Found active job id: "+self.active_job_id);
		self.check_job_status();
	}
	else{
		console.log("submitting job to url: "+self.submit_url);
		jQuery.ajax({
      				//url: "/search/sequence_submit",
      				url: self.submit_url,
      				type: "post",
      				data: values,
				//async: false,
      				success: function(returned_job_id){
          				//alert("success: ",job_id);
					console.log("job submitted, can check now");
					self.active_job_id = returned_job_id;
					self.status = "running";
              				self.set_progress_bars();
					self.check_job_status();
	      				},
      				error:function(errormsg){
        				console.log("Problem submitting the job");
	  				alert("There was a Problem submitting the job. Try again ");
    	      				}   
    		});
	}
    },
    check_job_status: function(temp_id, temp_this){
	var job_id = temp_id? temp_id : this.active_job_id;
	var self = temp_this? temp_this: this;
	//varvar status = "PENDING";
	//var job_id = "hmmer_hmmscan-R20130625-163913-0345-11869948-oy";
	
	var values  = new Object();
	values['job_id'] = job_id;
	url = self.status_url;
	console.log("checking job status for id: "+job_id+" url: ",url,"");
	jQuery.ajax({
      			url: url,
      			type: "post",
      			data: values,
			//async:   false,
      				success: 
					function(returned_status){
						console.log("got response from server. got: "+ returned_status);
						status = returned_status;
      						if(returned_status == 'FINISHED'){
							console.log("job is finished");
							self.get_job_result();
						}
						else if(returned_status == "PENDING" || returned_status == "RUNNING"){
							console.log("job is still running. let's check job_id: ",job_id," again ");
							setTimeout(self.check_job_status, 1000, job_id, self);
						}
						else{ 	
							console.log("uff, there was an error");
						}	
					},
      				error:
					function(errormsg){
						self.status = "error";
              					self.set_progress_bars();
						console.log("Error while checking job status!");
      					}
	});
    },
    get_job_result: function(temp_id, temp_this){
	var job_id = temp_id? temp_id : this.active_job_id;
	var self = temp_this? temp_this: this;
	var values  = new Object();
	values["result_type"] = self.result_type;
	values["job_id"] = job_id;
	values["selected_family"] = self.selected_family;
	console.log("getting job results");
	url = self.result_url;
	console.log("getting result for id: "+job_id+" url: ",url,"");
    	jQuery.ajax({
  					url: url,
      					type: "post",
      					data: values,
					dataType : "json",
      					//async:   false,
					success: 
						function(result){
							console.log("successful in retrieving results, method is "+self.method);
    							//jQuery("#hmmscan_status").html("done");
							var timediff = new Date() - self.start_time;
							self.time_spent = ~~(timediff / 1000);
							self.status = "done";
              						self.set_progress_bars();
    							
							switch(self.method){
								case "treefamscan": 
									console.log("draw treefam hits");
									self.treefam_hits = result;
									//var treefam_string = JSON.stringify(self.treefam_hits);	
									if(self.treefam_hits.length == 0){
										console.log("no TreeFam family found");
										self.report_warnings_errors({"type": "no_treefam_hits"});
										self.status = "unavailable";
              									self.set_progress_bars({"for_method": "alignment"});
              									self.set_progress_bars({"for_method": "tree_building"});
	
									}
									else{
										self.select_best_family();
										self.draw_treefam_hits({hmmer_output_json : result});
										console.log("back from selecting family: "+self.selected_family);
										if(self.tree_insertion){
											console.log("doing tree insertion");
											var myTreeInsertionObject = new TreeInsertion({method: "alignment", 	
																seq: self.seq, 
																tree_insertion : self.tree_insertion, 
																selected_family: self.selected_family, 
																tree_algorithm: self.tree_algorithm});
										}
									}
									break;
								case "pfamscan": 
									self.pfam_hits = result;
									if(self.pfam_hits.length == 0){
										console.log("no Pfam hits found");
										self.report_warnings_errors({"type": "no_pfam_hits"});
									}
									else{
										console.log("back from pfam hits");
										console.log(self.pfam_hits);
										self.draw_pfam_hits({hmmer_output_json : result});
									//self.draw_treefam_hits();
									}
									break;
								case "alignment":	
									console.log("alignment done");
									self.alignment = result.data;
									//console.log(self.alignment);
									if(self.tree_insertion){
										var myTreeInsertionObject = new TreeInsertion({method:"tree_building", seq: self.seq, tree_insertion : self.tree_insertion, selected_family: self.selected_family,tree_algorithm: self.tree_algorithm,
																alignment_job_id : self.active_job_id});
									}
									break;
								case "tree_building":	
									console.log("doing some tree_building stuff");
									//console.log(result);
									self.json_tree = result;
									self.no_of_insertions = self.was_inserted_multiple_times();
									if(self.no_of_insertions > 1){	
										console.log("warn about multiple insertions");	
										self.report_warnings_errors({"type": "multiple_insertions"});
									}
									//self.tree = result.data;
									self.draw_tree();

									break;
							}
    							//jQuery("#hmmscan_spinner").removeClass("loadingBar");
							//jQuery("#hmmscan_spinner").attr("src","http://xctrack.org/images/4/47/Done.png");
      					},
      					error:
						function (xhr, ajaxOptions, thrownError) {
       								 alert(xhr.status);
        							alert(thrownError);
							//console.log("rest call gave us an error: "+errormsg);
							//console.log(errormsg);
							self.status = "error";
              						self.set_progress_bars();
							console.log("Error getting results!");
      					}
		});
	},
    set_interval: function(args){
	console.log("setting time interval");
	this.time_interval = setInterval(this.check_job_status, 4000);
    },	
    clear_interval: function(args){
	console.log("clearing interval");
	clearInterval(this.time_interval);
    },
    was_inserted_multiple_times: function(args){
		var self = this;
		var tree_string = JSON.stringify(self.json_tree);	
		var count_matches = 0;	
		var found = tree_string.match(/(EMBOSS)/ig);
		jQuery.each(found, function(i, v) {
    			//alert(i+" = "+v);
			count_matches++;
		});
		return count_matches;
		//console.log("trying to find best hit");
	},	
	select_best_family: function(args){
		var self = this;
		//console.log(self.treefam_hits);
		var hitsObj = self.treefam_hits;	
		var best_hit;
		//console.log("trying to find best hit");
		jQuery.each(hitsObj, function(i, val) {
				console.log(val);
       				best_hit = val.target_name;
				console.log("best hit was: "+best_hit);
				return false;
		})
		//console.log("best hit is "+best_hit);
		self.selected_family = best_hit;
	},
    draw_tree: function(args){
			var self = this;
		        var json_tree = "http://dev.treefam.org/family/TF105041/tree/json";
			var no_genes = 48 * 2;
			var alignment_length = 54 * 2;
			//var image_path = "http://www.ebi.ac.uk/~fs/d3treeviewer/data/images/species_files/";
			var image_path = "/static/images/species_pictures/species_files/";
			var highlight_gene = "QUERY___EMBOSS_001";
			//var highlight_gene = "";
			//var newick_tree = "../data/trees/newick_tree.nh";
			var newick_tree = "";
			var load_from_variable = 0;
			var load_from_web = 1;
			console.log("drawing the tree using ");
			//var json_tree_string  = JSON.stringify(self.json_tree);
			var json_tree_string  = self.json_tree;
			console.log(json_tree_string);
			var show_controls = 1;
			myTree = new Biojs.Tree({
			        target : "tree",
			        tv_contentcontainer : "tv_contentcontainer",
				width : 1000,
				load_from_web : load_from_web,
				show_real_branchlength : false,
				load_from_variable : load_from_variable,
			        format : 'CODATA',
					formatOptions : {
			 			title:false,
						footer:false,
						tree:'json',
			  		},
			        id : 'P918283',
				    no_genes : no_genes, 
				    alignment_length : alignment_length, 
				    json_tree : json_tree, 
				    image_path : image_path,
				    newick_tree : newick_tree,
				    highlight_gene : highlight_gene,
				    json_tree_string : json_tree_string,
				    load_from_variable : load_from_variable,
				show_controls : show_controls,
			}); 
	},
    draw_pfam_hits: function(args){
	var hmmer_output_json = args.hmmer_output_json;
	var pfam_hmm_output = "http://dev.treefam.org/static/test/pfam_hmmer.json";
	myPfamResults = new Biojs.HMMerResults({ target : "PfamBlock", formatOptions : { title:false, footer:false, tree:'json', }, 
			//tree parameters 
			database : "pfam",
			width: 600,
			seq_length_visible: 500,
			height: 100, query_seq_length: this.seq_length, 
			//hmm_output: pfam_hmm_output, 
			load_from_variable : 1, hmmer_output_json : hmmer_output_json
			});	
	},
     draw_treefam_hits: function(args){
		//var hmmer_output_json  ;
		var hmmer_output_json = args.hmmer_output_json;
		console.log("showing results: "+hmmer_output_json);
		var treefam_hmm_output = "http://dev.treefam.org/static/test/treefam_hmmer.json";
		console.log("tree insertion is: ",this.tree_insertion);
		var max_hits = (this.tree_insertion) ? 1 : 3;
		myPfamResults = new Biojs.HMMerResults({ target : "TreeFamBlock", formatOptions : { title:false, footer:false, tree:'json', }, 
			//tree parameters 
			database : "treefam", 
			width: 600,
			seq_length_visible: 500,
			height: 100, query_seq_length: this.seq_length, 
			//hmm_output: treefam_hmm_output, 
			max_hits: max_hits,
			load_from_variable : 1, hmmer_output_json : hmmer_output_json
		});	
	},
     get_data: function(){
	var self = this;
			switch(this.method){
				case "alignment":
					console.log("need to get alignment here");
					// get best hit
					// data is in self.treefam_hits;
										break;
				case "tree_building":
					console.log("getting newick tree");
					break;
			}
    },
	report_warnings_errors: function(args){
		var self = this;	
		var type = args.type;
		console.log("gonna report "+type);
		switch(type){
				case "no_pfam_hits": 
					jQuery("#pfam_hits_status").html("There are no Pfam hits for the sequence provided");
					jQuery("#pfam_results").show();
					break;
				case "no_treefam_hits":
					jQuery("#treefam_hits_status").html("There are no TreeFam hits for the sequence provided");
					jQuery("#treefam_results").show();
					break; 
				case "multiple_insertions":
					console.log("gonna report "+type);
					jQuery("#tree_insertion_status").html("Warning. Maxmimum parsimony inserted your sequence in "+self.no_of_insertions+" places in the tree. You could search again using the maximum likelihood option.");
					jQuery("#tree_insertion_status").show();
		}
	},
	set_progress_bars: function(args){
		var self = this;	
		var seconds = self.time_spent;
		var method = (typeof args === 'undefined' || typeof args.for_method === 'undefined')? self.method : args.for_method;
		console.log("set progress bar for: "+method);
		switch(method){
				case "treefamscan": 
					jQuery("#treefamscan_spinner").hide();
					if(self.status == "done"){
						jQuery("#treefamscan_status").empty();
						jQuery("#treefamscan_status").append("<img id='theImg' src='http://xctrack.org/images/4/47/Done.png'/>");
						jQuery("#treefamscan_status").append(" (took ",seconds," s)");
						jQuery("#treefam_results").show();
					}
					else if(self.status == "running"){
						jQuery("#treefamscan_spinner").show();
						jQuery("#treefamscan_status").html(" running ");
					}
					else{
						jQuery("#treefamscan_status").append("<img id='theImg' src='http://www.cisco.com/web/fw/softwareportal/images/errorIcon.gif'/>");
						jQuery("#treefamscan_status").append(" (analysis failed, try again or contact authors)");
					}
					break;
				case "pfamscan": 
					jQuery("#pfamscan_spinner").hide();
					if(self.status == "done"){
						jQuery("#pfamscan_status").empty();
						jQuery("#pfamscan_status").append("<img id='theImg' src='http://xctrack.org/images/4/47/Done.png'/>");
						jQuery("#pfamscan_status").append("(took ",seconds," s)");
						jQuery("#pfam_results").show();
					}
					else if(self.status == "running"){
						jQuery("#pfamscan_spinner").show();
						jQuery("#pfamscan_status").html(" running ");
					}
					else{
						jQuery("#pfamscan_status").append("<img id='theImg' src='http://www.cisco.com/web/fw/softwareportal/images/errorIcon.gif'/>");
						jQuery("#pfamscan_status").append(" (analysis failed, try again or contact authors)");
					}
					break;
				case "alignment":	
					console.log("got a nice alignment");
					jQuery("#alignment_spinner").hide();
					if(self.status == "done"){
						jQuery("#alignment_status").empty();
						jQuery("#alignment_status").append("<img id='theImg' src='http://xctrack.org/images/4/47/Done.png'/>");
						jQuery("#alignment_status").append("(took ",seconds," s)");
						jQuery("#alignment_status").append(", <a href='http://www.treefam.org/search/alignment_download/" + self.active_job_id+ "'><img id='theImg' Title='Download the alignment in fasta format' src='http://www.ebi.ac.uk/web_guidelines/images/icons/EBI-Functional/Functional%20icons/download.png'  width='20' heigth='20' /></a> (fasta alignment)");
					}
					else if(self.status == "running"){
						jQuery("#alignment_spinner").show();
						jQuery("#alignment_status").html(" running ");
					}else if(self.status == "unavailable"){
						jQuery("#alignment_status").empty();
						jQuery("#alignment_status").append("<img id='theImg' src='http://www.cisco.com/web/fw/softwareportal/images/errorIcon.gif'/>");
						jQuery("#alignment_status").append(" (No alignment job available)");
					}else{
						jQuery("#alignment_status").append("<img id='theImg' src='http://www.cisco.com/web/fw/softwareportal/images/errorIcon.gif'/>");
						jQuery("#alignment_status").append(" (analysis failed, try again or contact authors)");
					}
					break;
				case "tree_building":	
					jQuery("#tree_spinner").hide();
					if(self.status == "done"){
						console.log("got a nice tree");
						jQuery("#tree_status").empty();
						jQuery("#tree_status").append("<img id='theImg' src='http://xctrack.org/images/4/47/Done.png'/>");
						jQuery("#tree_status").append("(took ",seconds," s)");
						jQuery("#tree_results").show();
						
						console.log("adding links to download");	
						// add download links to 
						jQuery("#tree_status").append(", <a href='http://www.treefam.org/search/tree_download/" + self.active_job_id + "'><img id='theImg' Title='Download the tree in newick format' src='http://www.ebi.ac.uk/web_guidelines/images/icons/EBI-Functional/Functional%20icons/download.png' width='20' heigth='20' /></a> (newick tree)");
						jQuery("#tree_status").append(", <a href='http://www.treefam.org/search/homology_download/" + self.active_job_id + "'><img id='theImg' Title='Download the homologs of your query in text format' src='http://www.ebi.ac.uk/web_guidelines/images/icons/EBI-Functional/Functional%20icons/download.png' width='20' heigth='20' /></a> (homologs for model species)");
					}
					else if(self.status == "running"){
						jQuery("#tree_spinner").show();
						jQuery("#tree_status").html(" running ");
					}else if(self.status == "unavailable"){
						jQuery("#tree_status").empty();
						jQuery("#tree_status").append("<img id='theImg' src='http://www.cisco.com/web/fw/softwareportal/images/errorIcon.gif'/>");
						jQuery("#tree_status").append(" (No tree job available)");
					}else{
						jQuery("#tree_status").append("<img id='theImg' src='http://www.cisco.com/web/fw/softwareportal/images/errorIcon.gif'/>");
						jQuery("#tree_status").append(" (analysis failed, try again or contact authors)");
					}
					break;
			}
    },
};
