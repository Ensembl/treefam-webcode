/** 
 * Alignment component 
 * 
 * @class
 * @extends Biojs
 * 
 * @requires <a href='http://blog.jquery.com/2011/09/12/jquery-1-6-4-released/'>jQuery Core 1.6.4</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="../biojs/dependencies/jquery/jquery-1.4.2.min.js"></script>
 * 
 * @author <a href="mailto:ian.sillitoe@gmail.com">Ian Sillitoe</a>, based on the code made 
 * by <a href="mailto:secevalliv@gmail.com">Jose Villaveces</a>
 *
 * @param {Object} options An object with the options for Alignment component.
 *
 * @option {string} target
 *    Identifier of the DIV tag where the component should be displayed.
 *
 * @option {Object[]} sequences
 *    The sequences to be displayed.
 *
 * @option {Object} consensus_sequence
 *    A sequence containing consensus information to be displayed.
 *
 */
jQuery.noConflict 
Biojs.Alignment = Biojs.extend(
/** @lends Biojs.Alignment# */
{	
	constructor: function (options) {
		var self = this;
		
		self._headerDiv = jQuery('<div></div>').appendTo("#"+self.opt.target);
		self._headerDiv
			.css('font-family','"Heveltica Neue", Arial, "sans serif"')
			.css('font-size','14px')
			;
		
		jQuery('<div></div>').addClass( 'alignment-header-container row-fluid' ).appendTo("#"+self.opt.target);
		
		self._alnRowsDiv = jQuery('<div></div>').addClass( 'alignment-rows-container' ).appendTo( '#alignment-header-container' );
		self._alnRowsDiv
			.css('font-family',this.opt.fontFamily)
			.css('font-size',this.opt.fontSize)
			.addClass( 'span11 offset1' )
			;

		self._contentDiv = jQuery('<div></div>').addClass( 'alignment-content-container row-fluid' ).appendTo("#"+self.opt.target);

		var content_sel = "#" + self.opt.target + ' .alignment-content-container';

		self._alnIdsDiv = jQuery('<div></div>').addClass( 'alignment-ids-container' ).appendTo( content_sel );
		self._alnIdsDiv
			.css('font-family',this.opt.fontFamily)
			.css('font-size',this.opt.fontSize)
			.css('overflow', 'hidden')
			.css('color', this.opt.alnIdsColor )
			.css('height', this.opt.height)
			.css('padding-bottom', 10 )
			.addClass( 'span1' )
			;
		
		self._alnSeqsDiv = jQuery('<div></div>').addClass( 'alignment-data-container' ).appendTo( content_sel );
		self._alnSeqsDiv
			.css('font-family',this.opt.fontFamily)
			.css('font-size',this.opt.fontSize)
			.css('overflow', 'scroll' )
			.css('color', this.opt.alnSeqsColor )
			.css('height', this.opt.height)
			.css('padding-bottom', 10 )
			.addClass( 'span11' )
			//.css( 'width', '840' )  // should be 870px but need to give space for
			;
		
		// make sure the scroll pane for the IDs is tied to the pane for the sequences
		self._alnSeqsDiv.scroll(function(event) {
			self._alnIdsDiv.scrollTop( self._alnSeqsDiv.scrollTop() );
		});
		
		// load the FASTA (if we've been given a URL)
		if ( self.opt.fastaUrl ) {
			
			jQuery.ajax({
				url:      self.opt.fastaUrl,
				dataType: 'text',
				beforeSend: function() {
					self.showLoadingScreen( 'Loading FASTA data...' );
				},
				success: function(fastaFile){
					self.parseFasta(fastaFile);
					//jQuery( '#alignment-container-title' ).text( aln_widget.countSequences() + ' sequences / ' + aln_widget.getAlignmentLength() + ' alignment positions' );
				},
				error: function(qXHR, textStatus, errorThrown){
					alert( "Problem loading FASTA alignment from server: " + textStatus);
				},
				complete: function() {
					self.hideLoadingScreen();
				}
			});
		}
		
		// load the SCORECONS (if we've been given a URL)
		if ( self.opt.scoreconsUrl ) {
			jQuery.ajax({
				url:      self.opt.scoreconsUrl,
				dataType: 'text',
				beforeSend: function() {
					self.showLoadingScreen( 'Loading Scorecons data...' );
				},
				success: function(scoreconsFile){
					self.parseScorecons(scoreconsFile);
					//jQuery( '#alignment-container-title' ).text( aln_widget.countSequences() + ' sequences / ' + aln_widget.getAlignmentLength() + ' alignment positions' );
				},
				error: function(qXHR, textStatus, errorThrown){
					alert( "Problem loading SCORECONS file from server: " + textStatus);
				},
				complete: function() {
					self.hideLoadingScreen();
				}
			});
		}
		
	/*	
		self._alnWindowDiv.draggable( {axis: "y", containment: "parent"} );
		self._alnSeqsDiv.draggable( {axis: "x", containment: "parent"} );
		*/
		self._sequences = this.opt.sequences;
		
		self._redraw();
	},
	
	
	/**
	 * Default values for the options
	 * @name Biojs.Sequence-opt
	 */
	opt : {
		sequences : [],
		consensus_sequence : "",
		scoreconsUrl: "",
		fastaUrl: "",
		id : "",
		target : "",
		format : "FASTA",
		selection: { startPos: 0, endPos: 0 },
		height : 400,
		
		// Styles 
		selectionColor : 'Yellow',
		highlightFontColor : 'red',
		highlightBackgroundColor : 'white',
		fontFamily: '"Andale mono", Courier, monospace',
		fontSize: '11px',
		fontColor : 'black',
		backgroundColor : 'white',
		seqIdLinkUriStem : '/sequence/',
		loadingStatusImage: '/static/images/ajax-loader.gif',

		colorScheme: 'scorecons_cutoff',
		scoreconsCutoff: 0.8,
		scoreconsColor: 'red',
		scoreconsCutoffFunction: function(self, score) {
			return score >= self.opt.scoreconsCutoff ? self.opt.scoreconsColor : false;
		},
	},
	
	/**
	 * Array containing the supported event names
	 * @name Biojs.Sequence-eventTypes
	 */
	eventTypes : [
		/**
		 * @name Biojs.Sequence#onSelectionChanged
		 * @event
		 * @param {function} actionPerformed An function which receives an {@link Biojs.Event} object as argument.
		 * @eventData {Object} source The component which did triggered the event.
		 * @eventData {string} type The name of the event.
		 * @eventData {int} start A number indicating the start of the selection.
		 * @eventData {int} end A number indicating the ending of selection.
		 * @example 
		 * mySequence.onSelectionChanged(
		 *    function( objEvent ) {
		 *       alert("Selected: " + objEvent.start + ", " + objEvent.end );
		 *    }
		 * ); 
		 * 
		 * */
		"onSelectionChanged",
		
		/**
		 * @name Biojs.Sequence#onSelectionChange
		 * @event
		 * @param {function} actionPerformed An function which receives an {@link Biojs.Event} object as argument.
		 * @eventData {Object} source The component which did triggered the event.
		 * @eventData {string} type The name of the event.
		 * @eventData {int} start A number indicating the start of the selection.
		 * @eventData {int} end A number indicating the ending of selection.
		 * @example 
		 * mySequence.onSelectionChange(
		 *    function( objEvent ) {
		 *       alert("Selection in progress: " + objEvent.start + ", " + objEvent.end );
		 *    }
		 * );  
		 * 
		 * 
		 * */
		"onSelectionChange",
		
		/**
		 * @name Biojs.Sequence#onAnnotationClicked
		 * @event
		 * @param {function} actionPerformed An function which receives an {@link Biojs.Event} object as argument.
		 * @eventData {Object} source The component which did triggered the event.
		 * @eventData {string} type The name of the event.
		 * @eventData {string} name The name of the selected annotation.
		 * @eventData {int} pos A number indicating the position of the selected amino acid.
		 * @example 
		 * mySequence.onAnnotationClicked(
		 *    function( objEvent ) {
		 *       alert("Clicked " + objEvent.name + " on position " + objEvent.pos );
		 *    }
		 * );  
		 * 
		 * */
		"onAnnotationClicked"
	],

	// internal members
	_sequences  : null,
	_headerDiv  : null,
	_contentDiv : null,
	_alnRowsDiv : null,
	_alnIdsDiv  : null,
	_alnSeqsDiv : null,
	_alnLength  : null,
	_scoreconsData : null,
	
	// Methods

	/**
    * Set the current selection in the alignment row(s) causing the event {@link Biojs.Alignment#onSelectionChanged}
    *
    * @example
    * // set selection from alignment position 100 to 150 
    * myAlignment.setRowSelection(100, 150);
    * 
    * @param {int} start The starting character of the selection.
    * @param {int} end The ending character of the selection
    */
	setRowSelection : function(start, end) {
		if(start > end) {
			var aux = end;
			end = start;
			start = aux;
		}

		if(start != this.opt.selection.startPos || end != this.opt.selection.endPos) {
			this._setRowSelection(start, end);
			this.raiseEvent('onSelectionChanged', {
				start : start,
				end : end
			});
		}
	},
	
	showLoadingScreen : function ( message ) {
		var self = this;
		
		var image = '<img id="image_' + self.getId() + '" src="' + self.opt.loadingStatusImage + '" style="display:block; margin: 0 auto;" />';
		
		jQuery("div#"+self.opt.target).append('<div id="loadingImage" />');
		
		jQuery('#' + self.opt.target + ' div#loadingImage')
			.css("padding","0px")
			.css("width",self.opt.width)
			.css("height",self.opt.height)
			.css("overflow","hidden")
			.css('display','table-cell')
			.css('vertical-align','middle')
			.html( image );
	},
	
	hideLoadingScreen : function ( ) {
		var self = this;
		jQuery( '#' + self.opt.target + ' div#loadingImage' ).remove();
	},
	
	/**
    * Sets the internal sequence data
    *
    * @example
    * var seqData = [
    * 	{ id: 'pdb|seq1', seq: 'EDD--FSLEEAMKIKE--SSDTDVEVVSVGPDRV' },
    * 	{ id: 'pdb|seq2', seq: '--D--FSLM---KIKE--SSVSV-EVVSVGPDRV' }
    * ];
    * myAlignment.setSequenceData( seqData );
    * 
    * @param {Object[]} data sequence data structure
    */
	setSequenceData : function(seqData) {
		var self = this;
		// should probably store these as Biojs.Sequence objects with length checking, etc.
		self._sequences = seqData;
		self._redraw();
	},
	
	getSequenceData : function() {
		var self = this;
		return self._sequences;
	},
	
	countSequences : function() {
		var seqData = this.getSequenceData();
		return seqData.length;
	},
	
	setAlignmentLength : function(len) {
		this._alnLength = len;
	},
	
	getAlignmentLength : function() {
		return this._alnLength;
	},
	
	setScoreconsData : function(d) {
		this._scoreconsData = d;
	},
	
	getScoreconsData : function() {
		return this._scoreconsData;
	},

  getScoreconsScoreAtOffset : function( offset ) {
  	return this._scoreconsData[ offset ];
  },

	/**
    * Highlights a region using the font color defined in {Biojs.Alignment#highlightFontColor} by default is red.
    *
    * @example
    * // highlight the characters within the alignment positions 100 to 150, included.
    * myAlignment.highlight(100, 150);
    * 
    * @param {int} start The starting character of the highlighting.
    * @param {int} end The ending character of the highlighting
    */
	highlight : function (start, end) {
		if ( start <= end ) {
			for ( var i=start; i <= end; i++ ){
				this._contentDiv.find('span.row-'+i)
					.css("color", this.opt.highlightFontColor)
					.addClass("highlighted");
			}
		}
	},
	
	/**
    * Clear a highlighted region using.
    *
    * @example
    * // Clear the highlighted characters within the alignment positions 100 to 150, included.
    * myAlignment.unHighlight(100, 150);
    * 
    * @param {int} start The starting character.
    * @param {int} end The ending character.
    */
	unHighlight : function (start, end) {	
		for( var i=start; i <= end; i++ ) {
			this._contentDiv.find('span.highlighted.row-'+i)
				.removeClass("highlighted")
				.css("color", this.opt.fontColor);
		}
	},
	
	/**
    * Clear the highlights of whole sequence.
    *
    */
	unHighlightAll : function () {
		this._contentDiv.find('span.sequence.highlighted').each( function() {
			jQuery(this).removeClass("highlighted").css("color", this.opt.fontColor);
		});
	},
	
	/**
    * Hides the whole component.
    * 
    */
	hide : function () {
		this._headerDiv.hide();
		this._contentDiv.hide();
	},

	/**
    * Shows the whole component.
    * 
    */
	show : function () {
		this._headerDiv.show();
		this._contentDiv.show();
	},
	
	_setRowSelection : function(start, end) {
		var self = this;
		
		self.opt.selection.startPos = start;
		self.opt.selection.endPos = end;

		var spans = this._contentDiv.find('.sequence');
		for(var i = 0; i < spans.length; i++) {
			if(i + 1 >= start && i + 1 <= end) {
				jQuery(spans[i]).css("background-color", self.opt.selectionColor);
			} else {
				jQuery(spans[i]).css("background-color", self.opt.backgroundColor);
			}
		}
	},
	
	_formatSeqIdLink : function(s) {
		var self = this;
		return self.opt.seqIdLinkUriStem + s.id;
	},
		
	_redraw : function() {
		var i = 0;	
		var self = this;
		var rowsStep    = 5;
		var highlighted = [];

		this._contentDiv.find('.sequence.highlighted').each( function(){
			highlighted.push(jQuery(this).attr("id"));
		});
		
		// Reset the content
		self._alnRowsDiv.text('');
		self._alnIdsDiv.text('');
		self._alnSeqsDiv.text('');
		
		var seqData = self.getSequenceData();
		
		Biojs.console.log( "Drawing " + seqData.length + " sequences" );
		
		// more efficient to add a single node via jQuery
		var seqDivInner = '';
		var rowsDivInner = '';
		
		var alnLength   = 0;
		var seqIndex    = 0;
		
		var lpad = function(str, len, pad) {
			str = "" + str;
			if (len + 1 >= str.length) {
				str = Array(len + 1 - str.length).join(pad) + str;
			}
			return str;
		}
		
		var idDiv   = jQuery('<div />').addClass( 'biojs-aln-ids' );
		var seqDiv  = document.createElement('div');
		var rowsDiv = document.createElement('div');
		
		seqDiv.setAttribute( 'class', 'biojs-aln-seqs' );
		
		jQuery( seqData ).each( function(seqIdx, s) {
			//Biojs.console.log( "Adding sequence to alignment: ", seqData );
// 			idDivInner    = idDivInner  + '<div class="sequence-id seqidx-' + seqIdx + '" style="white-space:pre">' + s.id + '</div>';
			
			var seqTitle = s.id;
			if ( s.uniprot_ids.length > 0) {
				seqTitle = s.uniprot_ids.join(",");
			}
			
			var seqId = jQuery( '<div />' )
										.addClass( 'sequence-id seqidx-' + seqIdx )
										.css( 'white-space', 'pre' )
										.data( 'seqData', s )
										.html( jQuery( '<a />' ).attr( 'href', self._formatSeqIdLink( s ) ).text( seqTitle ) )
										.appendTo( idDiv );
			
			var seqPositionStr = '';
			
			jQuery.each( s.seq.split( '' ), function( aln_offset, seq_char ) {
				var is_gap  = seq_char == '-' ? 1 : 0;
				var hex_rgb = self._getResidueColour( self.opt.colorScheme, { aln_pos: (aln_offset + 1), seq_char: seq_char, is_gap: is_gap } );
				seqPositionStr += '<span ' +
					                  ' class="seqp seqp-' + aln_offset + ' ' + ( is_gap ? 'gap' : '' ) + '"' +
					                  ( hex_rgb ? ' style="background-color: ' + hex_rgb + ';"' : '' ) +
					                  '>' +
					                  seq_char +
					                '</span>';
			});
			
			seqDivInner   = seqDivInner + '<div class="seq seqidx-' + seqIdx + '" style="white-space:pre">' + seqPositionStr + '</div>';
			alnLength     = s.seq.length;
		});
		
		// sort out the row counter
		for ( var alnCounter=1; alnCounter < alnLength; alnCounter++ ) {
			if ( alnCounter % 5 == 0 ) {
				rowsDivInner = rowsDivInner + lpad( alnCounter, rowsStep, ' ' );
			}
		}
		
		rowsDivInner = '<div class="biojs-aln-rows" style="white-space:pre">'+ rowsDivInner +'</div>';
		seqDiv.innerHTML = rowsDivInner + seqDivInner;
		
		// add a dummy row to the top of the ids to balance out the sequence index
		idDiv.prepend( '<div class="sequence-id-fake">&nbsp</div>' );

		jQuery( self._alnIdsDiv ).append( idDiv );
		jQuery( self._alnSeqsDiv ).append( seqDiv );
		
		this._setRowSelection(this.opt.selection.startPos, this.opt.selection.endPos);
		
		// Restore the highlighted regions
		for ( var i in highlighted ) {
			this._contentDiv.find('.sequence#'+highlighted[i]).each( function(){
				jQuery(this).css("color", self.opt.highlightFontColor).addClass("highlighted");
			});	
		}
		
		Biojs.console.log( "Colouring alignment by scorecons" );
		
		this._addSpanEvents();
	},
	
	
	/**
    * Parses a FASTA alignment into an array of sequence data
    *
    * @example
    * // parse the FASTA file into this object
    * myAlignment.parseFasta( ">pdb|1cuk\nEDDD--FSLEEAMKIKE--SSDTDVEVVVVSVGPDRV" );
    * 
    * @param {str} aln The FASTA alignment as a string
    */
	
	parseFasta : function(aln_str) {
		var self = this;
		
		var
			seqData          = [],
			idx              = 0,
			max_lines        = 50000, // safety measure
			line_count       = 0,
			last_header      = '',
			last_seq         = '',
			last_uniprot_ids = [];
		
		Biojs.console.log( "Parsing sequences from FASTA alignment (length: " + aln_str.length + ")" );
		
		var header_line_regexp = /^>(\S+)/m;        // should we try and parse out a readable ID / sequence range ?
		var uniprot_regexp     = /UNIPROT:\w+/g;
		
		while ( idx < aln_str.length && line_count++ < max_lines ) {
			
			// get a single line
			var idx_line_end   = aln_str.indexOf( '\n', idx );
			var line           = aln_str.substr( idx, idx_line_end - idx );
			idx                = idx_line_end + 1;
			
			// trim white space
			line = line.replace(/^\s+/, '');
			line = line.replace(/\s+$/, '');
			
			// see if this is a header
			var header_matches = line.match( header_line_regexp );
			
			if ( header_matches ) {
				// deal with the last sequence before starting a new one
				if ( last_seq ) {
					last_uniprot_ids = last_header.match( uniprot_regexp ) || [];
					
					// remove 'UNIPROT:' from the start of each one
					for (var i=0; i<last_uniprot_ids.length; i++) {
						last_uniprot_ids[i] = last_uniprot_ids[i].substr( 8 );
					}
					
// 					console.log( "HEADER: " + last_header );
// 					console.log( "SEQUENCE: " + last_seq );
// 					console.log( "UNIPROT_IDS: " + uniprot_ids.join(", ") );
					
 					seqData.push({ 
						id:          last_header,
						seq:         last_seq,
						uniprot_ids: last_uniprot_ids,
					});
				}
				last_header = header_matches[1];
				last_seq    = '';
			}
			else {
				last_seq = last_seq + line;
			}
		}
		
		// deal with the final sequence
		seqData.push( { id: last_header, seq: last_seq, uniprot_ids: last_uniprot_ids } );
		
		// set the alignment length
		self.setAlignmentLength( last_seq.length );
		
		//Biojs.console.log( seqData );
		
		Biojs.console.log( 'Parsed ' + seqData.length + ' sequences from FASTA alignment' );
		
		self.setSequenceData( seqData );
		
		self._redraw();
	},
	
	

	/**
    * Parses a SCORECONS file
    *
    * @example
    * // parse the FASTA file into an array (one entry for each alignment position)
    * myAlignment.parseScorecons( "..." );
    * 
    * 0.000           #
    * -------------------------M---------------------------------
    * 0.089           #
    * --------------------QQ------QQ---QQQRQ-----QQQ----QQQ-QQ-K-
    * 
    * @param {str} aln The scorecons data as a string
    */
	
	parseScorecons : function(scorecons_str) {
		var self = this;
		
		var
			scoreconsData    = [],
			idx              = 0,
			max_lines        = 500000, // safety measure
			line_count       = 0,
			last_header      = '',
			last_seq         = '';
		
		Biojs.console.log( "Parsing scorecons data from file (length: " + scorecons_str.length + ")..." );
		
		var score_line_regexp = /^([0-9.]+)\s+#/m;
		
		// don't want to split the whole thing on new lines as it may be huge...
		while ( idx < scorecons_str.length && line_count++ < max_lines ) {
			
			// get a single line
			var idx_line_end   = scorecons_str.indexOf( '\n', idx );
			var line           = scorecons_str.substr( idx, idx_line_end - idx );
			idx                = idx_line_end + 1;
			
			// see if this is a header
			var score_matches = line.match( score_line_regexp );
			
			if ( score_matches ) {
				var score = score_matches[1];
				scoreconsData.push( score )
			}
		
		}
		
		Biojs.console.log( 'Parsed ' + scoreconsData.length + ' scorecons positions' );
		
		// set the alignment length
		self.setScoreconsData( scoreconsData );
		
		Biojs.console.log( 'Redrawing' );
		
		self._redraw();
	},
	
	_colourResidueFunctions: {
		scorecons: function (self, data) {
			var min_col = 9; // out of 15
			
			if ( data.is_gap ) { return false };
			
			var scoreconsData = self.getScoreconsData();
			
			if ( !scoreconsData ) { return false }; 
			
			var aln_pos = data.aln_pos;
			var score   = scoreconsData[ aln_pos - 1 ];
			
			var r = parseInt( min_col + ( (score) * (15 - min_col) ) ).toString( 16 );
			var g = min_col.toString( 16 );
			var b = parseInt( min_col + ( (1 - score) * (15 - min_col) ) ).toString( 16 );
			
			var col = '#' + r + r + g + g + b + b;
		
			return col;
		},
		scorecons_cutoff: function( self, data ) {
			if (data.is_gap) { return false }

			var scoreconsData = self.getScoreconsData();

			if (!scoreconsData) { return false }

			var aln_pos       = data.aln_pos;
			var score         = scoreconsData[ aln_pos - 1 ];
			
			var scoreconsFunction = self.opt.scoreconsCutoffFunction;
			
			return self.opt.scoreconsCutoffFunction( self, score );
		}
	},
	
	_getResidueColour: function( scheme, data ) {
		var self = this;
		var colourScheme = this._colourResidueFunctions[ scheme ];
		
		if ( ! colourScheme ) {
			//Biojs.console.log( "getResidueColour colour schema '" + colourScheme +  "' does not exist!" );
			return false;
		}
		
		return colourScheme( self, data );
	},
	
	_addSpanEvents : function() {
		var self = this;
		
		// add mouseover highlighting / tooltip for each sequence id
		self._contentDiv.find('.sequence-id').each( function () {
			var seqData = jQuery(this).data( 'seqData' );
			
			//Biojs.console.log( jQuery(this) );
			var title = seqData.id;
			
			jQuery(this)
				.hover( function() { jQuery(this).addClass('highlight') }, function() { jQuery(this).removeClass('highlight') } )
				.tooltip({ title: 'Sequence: ' + title, placement: 'right' });
		});

		// add mouseover highlighting / tooltip for each alignment row
		// TODO: requires residue semantics rather than dumb sequence strings

		
	},
	
	// TODO:
	_addRowEvent : function() {
		var self = this;
	},
	
   /**
    * Annotate a set of intervals provided in the argument.
    * 
    * @example
    * // Annotations using regions with different colors.
    * mySequence.setAnnotation({
	*    name:"UNIPROT", 
	*    html:"&lt;br&gt; Example of &lt;b&gt;HTML&lt;/b&gt;", 
	*    color:"green", 
	*    regions: [
	*       {start: 540, end: 560},
	*       {start: 561, end:580, color: "#FFA010"}, 
	*       {start: 581, end:590, color: "red"}, 
	*       {start: 690, end:710}]
	* });
	* 
    * 
    * @param {Object} annotation The intervals belonging to the same annotation. 
    * Syntax: { name: &lt;value&gt;, color: &lt;HTMLColorCode&gt;, html: &lt;HTMLString&gt;, regions: [{ start: &lt;startVal1&gt;, end: &lt;endVal1&gt;}, ...,  { start: &lt;startValN&gt;, end: &lt;endValN&gt;}] }
    */
	setAnnotation: function ( annotation ) {
		this.opt.annotations.push(annotation);
		this._redraw();
	},
	
	/**
    * Removes an annotation by means of its name.
    * 
    * @example 
    * // Remove the UNIPROT annotation.
    * mySequence.removeAnnotation('UNIPROT'); 
    * 
    * @param {string} name The name of the annotation to be removed.
    * 
    */
	removeAnnotation: function ( name ) {
		var a = [];
		
		for (var i=0; i < this.opt.annotations.length ; i++ ){
			if(name != this.opt.annotations[i].name){
				a.push(this.opt.annotations[i]);
			}
		}
		this.opt.annotations = a;
		this._redraw();
	}
	
	
	
});


