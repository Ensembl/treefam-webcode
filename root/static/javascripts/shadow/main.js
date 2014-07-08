jQuery(document).ready(function() {
	jQuery('.box.standard').shadow();
	jQuery('.box.lifted').shadow('lifted');
	jQuery('.box.perspective').shadow('perspective');
	jQuery('.box.raised').shadow('raised');
	jQuery('.box.sides-vt-1').shadow({type:'sides',sides:'vt-1'});
	jQuery('.box.sides-vt-2').shadow({type:'sides',sides:'vt-2'});
	jQuery('.box.sides-hz-1').shadow({type:'sides',sides:'hz-1'});
	jQuery('.box.sides-hz-2').shadow({type:'sides',sides:'hz-2'});
	jQuery('.box.rotated').shadow({type:'rotated',rotate:'-5deg'});
});
