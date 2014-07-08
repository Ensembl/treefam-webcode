Shadowbox.init({
    handleOversize:     	"drag",
    displayNav:         		false,
    handleUnsupported: "remove",
    displayCounter:		false,
    autoplayMovies:     	false
});


$(document).ready(function(){
	$("#togglelink_more").click(function(){
		$(this).slideToggle("fast");
		$("#infobox").slideToggle("fast");
		$("#togglelink_less").slideToggle("fast");
		return false; 
	});
	$("#togglelink_less").click(function(){
		$(this).slideToggle("fast");
		$("#infobox").slideToggle("fast");
		$("#togglelink_more").slideToggle("fast");
		return false; 
	});
});
