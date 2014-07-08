function submit_job(oArg){
			var values  = new Object();
			values['seq'] = oArg.seq;
			var result_type = oArg.result_type;
			var job_id;
			console.log("in job submission (javascript)");
		 	jQuery.ajax({
      				url: "/search/sequence_submit",
      				type: "post",
      				data: values,
				//async: false,
      				success: function(returned_job_id){
          				//alert("success: ",job_id);
					job_id = returned_job_id;
					console.log("after success job_id is "+ job_id);
           				console.log("Job submitted...");
					console.log("in submit: check status..");
					check_status({job_id : job_id, result_type : result_type});
					//$("#result").html('submitted successfully');
      				},
      				error:function(errormsg){
          				alert("failure with ",errormsg);
    					jQuery("#spinner").removeClass("loadingBar");
    					jQuery("#summary").show();
    					jQuery("#error_div").show();
    					jQuery("#errors").html("wrong sequence");
          				//$("#result").html('there is error while submit');
      				}   
    				});
			return job_id;
		}	 

function check_status(oArg){
			var values  = new Object();
			values['job_id'] = oArg.job_id;
			var job_id = oArg.job_id ;
			var result_type = oArg.result_type ;
			var status;
			var job_finished = 0;
			var no_errors = 0;
			var no_timeout = 10;
			console.log("Checking the status");
			console.log("loop parameters are: job_finished = "+job_finished+" and no_timeout: "+no_timeout);
			

			//var checkIntervId = setInterval(function(){
					console.log("inside the timer: ");
				while(!job_finished && no_timeout){
					jQuery.ajax({
      						url: "/search/sequence_status",
      						type: "post",
      						data: values,
						async:   false,
      						success: 
							function(returned_status){
									//status = "FINISHED";
									console.log("checked status is "+ returned_status);
									status = returned_status;
									//jQuery("#spinner").removeClass("loadingBar");
    									//jQuery("#summary").show();
           								//$("#result").html('submitted successfully');
      							},
      						error:
							function(errormsg){
    									jQuery("#spinner").removeClass("loadingBar");
    									jQuery("#summary").show();
    									jQuery("#error_div").show();
    									jQuery("#errors").html("error checking job status");
          								console.log("Error while checking job status!");
          								//$("#result").html('there is error while submit');
      						}
					});
					console.log("after having checked the status, it is: "+status);
					if(status == "FINISHED"){
						console.log("has finished\n");
						job_finished = 1;
					}
   				 	else if(status != "PENDING" && status != "RUNNING"){
						console.log("Error with job (not running and not pending)\n");
						no_error = 1;
					}
					no_timeout--;
					console.log("timeout is "+no_timeout);
					console.log("sleeping a bit\n");
					setTimeout(function() {
							console.log("now we should wait 5 seconds");
						      // Do something after 5 seconds
					}, 5000);		
			}	
		//	}, 5000);	
			
			if(status == "FINISHED"){
				console.log("get results now");
				//get_results({job_id : job_id, result_type : result_type});	
			}
			else{
				console.log("at the end but no results");
			}
			return status;
		}

function get_results(oArg){
		var values  = new Object();
		//values["result_type"] = oArg.result_type;
		values["result_type"] = "tblout";
		values["job_id"] = oArg.job_id;
		console.log("Trying to get results for "+values["job_id"] +" (format: "+ values["result_type"]+")");
		jQuery.ajax({
  					url: "/search/sequence_get_results",
      					type: "post",
      					data: values,
					dataType : "json",
      					async:   false,
					success: 
						function(result){
							console.log("after getting results: "+ result);
    								jQuery("#spinner").removeClass("loadingBar");
    								jQuery("#summary").show();
    								jQuery("#resultsHeader").show();
    								//jQuery("#results").html(result);
								var tbl = "<table align='center'><tr><th>TreeFam family</th><th>E-value</th<th>Bit-Score</th></tr>";
    								
								jQuery.each(result, function(i,item) 			{
										
										var tbl_row = "<tr><td><a href='/family/"+result[i].target_name+"'>"+result[i].target_name+"</a></td><td>"+result[i].evalue+"</td><td>"+result[i].score+"</td></tr>";
        									tbl += "<tr>"+tbl_row+"</tr>";                 
    									})
								tbl = tbl+"</table>";	
    								jQuery("#results").html(tbl);
      					},
      					error:
						function(errormsg){
								console.log("after getting results: "+ errormsg +" error");
    								jQuery("#spinner").removeClass("loadingBar");
    								jQuery("#summary").show();
    								jQuery("#error_div").show();
    								jQuery("#errors").html("error getting results");
          							console.log("Error getting results!");
      					}
		});	
}

var submit_job_new = function (args){
	var values  = new Object();
	var job_id = "";
	values['seq'] = args.seq;
	values['database'] = args.database;

	console.log("in job submission (javascript)");
		jQuery.ajax({
      				url: "/search/sequence_submit",
      				type: "post",
      				data: values,
				async: false,
      				success: function(returned_job_id){
          				//alert("success: ",job_id);
					job_id = returned_job_id;
					console.log("after success job_id is "+ job_id);
           				//console.log("Job submitted...");
					//console.log("in submit: check status..");
					//check_status({job_id : job_id, result_type : result_type});
					//$("#result").html('submitted successfully');
      				},
      				error:function(errormsg){
          				alert("failure with ",errormsg);
    					//jQuery("#spinner").removeClass("loadingBar");
    					//jQuery("#summary").show();
    					//jQuery("#error_div").show();
    					//jQuery("#errors").html("wrong sequence");
          				//$("#result").html('there is error while submit');
      				}   
    			});
			return job_id;	

}
var check_status_new = function (args)
{
	var values  = new Object();
	var job_id = args.job_id;
	var div_name = args.div_name;
	var url = args.url;
	var message_div = args.message_div;
	values['job_id'] = job_id;
	var return_code;
  	console.log("checking something for: "+job_id);
	$("#"+div_name).smartupdater({
			url : url,
			type: 'post',
      			data: values,
			maxFailedRequests : 1,
			maxFailedRequestsCb : function(xhr, textStatus, errorThrown){
				console.log("callback function maxFailedRequestsCb() is called");
				$("#"+div_name).html("job_id not found");
				return_code = "FAIL";
			},
			minTimeout: 2000 // 2 seconds
			}, function (data) {
				console.log(" status check was: "+data);
				if(data == "FINISHED"){
					console.log("is finished. stopping "+div_name+" hide: "+message_div);
					jQuery("#treefam_status").smartupdater("stop");
					jQuery("#"+div_name).smartupdater("stop");
					jQuery("#"+message_div).hide;
				}
				// deactivate spinner
				return_code = "OK";
			}
		);	
	console.log("returning from status_checking");
	return return_code;
}


