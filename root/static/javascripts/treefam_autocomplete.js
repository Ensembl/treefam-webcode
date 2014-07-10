/*! mygene_query.js
 *  An autocomplete widget for gene query provides suggestions while you type a gene
 *  symbol or name into the field. Here the gene suggestions are displayed as
 *  "<Symbol>:<Name>", automatically triggered when at least two characters are entered
 *  into the field.
 *  Copyright (c) 2012 Chunlei Wu; Apache License, Version 2.0.
 */

mygene={};

mygene.url_root = 'http://mygene.info/widget/autocomplete/';
//any input tag with class "mygene_query_target" will be enabled for gene autocompletion feature.
mygene.input_selector = "input.mygene_query_target";
//this is the name of callback function should be defined by user.
mygene.default_select_callback_name = "mygene_query_select_callback";

mygene.loadfile = function(filesrc, filetype, onload){
 if (filetype=="js"){ //if filename is a external JavaScript file
  var fileref=document.createElement('script')
  fileref.setAttribute("type","text/javascript")
  fileref.setAttribute("src", filesrc)
  //fileref.setAttribute("async", false)
 }
 else if (filetype=="css"){ //if filename is an external CSS file
  var fileref=document.createElement("link")
  fileref.setAttribute("rel", "stylesheet")
  fileref.setAttribute("type", "text/css")
  fileref.setAttribute("href", filesrc)
  //fileref.setAttribute("async", false)
 }
 if (typeof fileref!="undefined")
  if (fileref.readyState) {
    fileref.onreadystatechange = function () { // For old versions of IE
        if (this.readyState == 'complete' || this.readyState == 'loaded') {
            onload();
        }
    };
  } else {
    fileref.onload = onload;
  }

  (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(fileref)
}


//ref:http://www.tomhoppe.com/index.php/2008/03/dynamically-adding-css-through-javascript/
mygene.add_css = function(cssCode) {
    var styleElement = document.createElement("style");
    styleElement.type = "text/css";
    if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = cssCode;
    } else {
    styleElement.appendChild(document.createTextNode(cssCode));
    }
    document.getElementsByTagName("head")[0].appendChild(styleElement);
}

mygene.genequery = function(select_callback){
        //TODO: select_only option
        var $ = window.$ || window.JQuery;
        var target_input = $(mygene.input_selector);
        console.log("we are here");
        target_input.autocomplete({
            source: function( request, response ) {
        		console.log("in function source");
                $.ajax({
                    url: "http://dev.treefam.org/search/autocomplete",
                    dataType: "json",
                    jsonp: 'jsoncallback',
                    data: {
                        //exact match with symbol is boosted.
                        //q: '(symbol:'+request.term + ' OR symbol:'+request.term + '* OR name:' + request.term + '* OR summary:' + request.term + '*) AND species:human',
                        search: ''+request.term+'',
                        //sort:'_score,_id',
                        limit:20
                    },
                    success: function( data ) {
			console.log("have results");    
			jQuery.each(data, function() {
				console.log(this);
		    	});
			
			//if (data.total_rows > 0){
				console.log("have rows");    
                            response( $.map( data.rows, function( item ) {
                                    console.log("item: "+item.symbol+" name:"+item.symbol);
                                
				return {
                                    //label: item.symbol+': '+item.name+':'+item.sort_order[0],
                                    label: item.symbol+': '+item.name,
                                    id: item.id,
                                    value: item.symbol
                                }
                            }));
                        //}else{
			//	console.log("have results, but no rows");    
                        //    response([{label:'no matched gene found.', value:''}]);
                        //}
                    },
			error: function(data){
					console.log("Could not find data (in error)");
                            response([{label:'no matched gene found.', value:''}]);
					//jQuery('#error_div').html("<h3>Sorry, we could not find a homology relationship for the IDs you entered</h3");
				        //jQuery('#error_div').show('slow');
			}
                });
            },
            minLength: 2,
            select: select_callback || mygene.default_select_callback,
            open: function() {
                $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
            },
            close: function() {
                $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
            }
        });
        //set default title attribute if not set already.
        if (target_input.attr("title") === undefined){
            target_input.attr("title", 'Powered by mygene.info');
        }

};

mygene.default_select_callback = function(event, ui) {
            //    alert( ui.item ?
            //        "Selected: " + ui.item.label + '('+ui.item.id+')':
            //        "Nothing selected, input was " + this.value);
	    	var adress = document.URL.replace(/#/g,"")
		var new_adress = adress+'/family/'+ui.item.id;
		console.log(new_adress);
		window.location.href = new_adress;
};


mygene_init = function() {

    function check_jquery_ui(){
        //console.log('jquery_ui');
        var jquery = window.$ || window.JQuery;
        //console.log('jqueryui: '+(jquery.ui?jquery.ui.version:'null'));
        if (jquery.ui === undefined || jquery.ui.version !== '1.8.21') {
            mygene.loadfile(mygene.url_root+'js/jquery-ui-1.8.21.custom.min.js', 'js', main);
            console.log('jqueryui: loaded');
        }else{
            main();
        }

    };

    function check_jquery(){
        //console.log('jquery');
        var jquery = window.$ || window.JQuery;
        //console.log('jquery: '+(jquery?(jquery.fn?jquery.fn.jquery:'null'):'null'));
        if (jquery === undefined || jquery.fn === undefined || jquery.fn.jquery !== '1.7.2')  {
            mygene.loadfile(mygene.url_root+'js/jquery-1.7.2.min.js', 'js', check_jquery_ui);
            //console.log('jquery: loaded');
        }else{
            check_jquery_ui();
        }

    };

    function main(){
        //console.log('main');
        //init input element for auto_completion
        mygene.genequery(window[mygene.default_select_callback_name]);
        //loading JQuery UI theme
        mygene.loadfile(mygene.url_root+'css/ui-lightness/jquery-ui-1.8.21.custom.css', 'css');
        //adding style for loading icon
        mygene.add_css('.ui-autocomplete-loading { background: white url("'+mygene.url_root+'img/ui-anim_basic_16x16.gif") right center no-repeat; }')
    };

    check_jquery();
};

mygene_init();
