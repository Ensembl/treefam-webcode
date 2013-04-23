
# Search.pm
# jt6 20061108 WTSI
#
# $Id: Search.pm,v 1.1 2008-09-12 09:13:10 jt6 Exp $

=head1 NAME

RfamWeb::Controller::Search - top-level platform for performing various searches

=cut

package TreeFam::Controller::Search;

=head1 DESCRIPTION

This controller is responsible for running searches. This is actually just an
empty wrapper around a shared base class. See
L<PfamBase::Controller::Search> for more details.

$Id: Search.pm,v 1.1 2008-09-12 09:13:10 jt6 Exp $

=cut

use strict;
use warnings;
use Data::UUID;

# need to use Module::Pluggable here, otherwise the Search plugins don't 
# get correctly registered
#use Module::Pluggable;

use strict;
use warnings;
use Compress::Zlib;
use MIME::Base64;
use JSON;
use File::Temp qw( tempfile );
#use Data::Dump qw( dump );
use Moose;
#use Bio::EnsEMBL::Compara::DBSQL::DBAdaptor;
#use Bio::EnsEMBL::Compara::Family;
#use Bio::EnsEMBL::Compara::DBSQL::GeneTreeAdaptor;
#use Bio::EnsEMBL::Compara::GeneTree;
#use Bio::AlignIO;
use namespace::autoclean;

#use treefam::nhx_plot;

BEGIN
{
    extends 'Catalyst::Controller::REST';
    #extends 'Catalyst::Controller';
    print STDERR "[beginning of search controller]\n";
}
with   'TreeFam::Roles::Search::SingleSequence';
with   'TreeFam::Roles::Search::Keyword';
with   'TreeFam::Roles::Search::Batch';
with   'TreeFam::Roles::Search::Homology';

# set up the list of content-types that we handle
__PACKAGE__->config(
  'default' => 'text/html',
  'map'     => {
    'text/html'          => [ 'View', 'TT' ],
    'text/xml'           => [ 'View', 'TT' ],
    'text/plain'         => [ 'SeqSearchResultsFormatter', 'tsv' ],
    'application/x-gff3' => [ 'SeqSearchResultsFormatter', 'gff' ],
    'application/json'   => 'JSON',
  }
);

# set the name of the section
__PACKAGE__->config( SECTION => 'search' );


#-------------------------------------------------------------------------------

=head2 METHODS

=head2 begin : Private

Sets up the stash for all types of search.

=cut

after 'begin' => sub {
#sub begin : Private {
  my( $this, $c ) = @_;

  # tell the navbar where we are
  $c->stash->{nav} = 'search';
  
  # tell the layout template to disable the summary icons
  $c->stash->{iconsDisabled} = 1;
  $c->log->debug( 'Search::begin just setting nav and iconsdisabled' ) if $c->debug;

  };

#-------------------------------------------------------------------------------

=head2 search : Chained('/') PathPart('search') CaptureArgs(0)

Start of a chain for handling search actions.

=cut

sub search  : Chained( '/' ) PathPart( 'search' ) CaptureArgs(0){
    my ( $this, $c ) = @_;
    
    my $reg = 'Bio::EnsEMBL::Registry'; 
    my $compara_name = $c->request()->param('compara') || "TreeFam";
  
    #try {
            my $ma = $reg->get_adaptor($compara_name, 'compara', 'member');
            $c->go('ReturnError', 'custom', ["No member adaptor found for $compara_name"]) unless $ma;
            $c->stash->{'member_adaptor'} = $ma;
            #$c->log->debug(dump($c->stash->{'member_adaptor'}));
          
            my $ha = $reg->get_adaptor($compara_name, 'compara', 'homology');
            $c->go('ReturnError', 'custom', ["No homology adaptor found for $compara_name"]) unless $ha;
            $c->stash->{'homology_adaptor'} = $ha;
            #$c->log->debug(Core::dump($c->stash->{'homology_adaptor'}));
            
            my $gt = $reg->get_adaptor($compara_name, 'compara', 'GeneTree');
            $c->go('ReturnError', 'custom', ["No genetree adaptor found for $compara_name"]) unless $gt;
            $c->stash->{'genetree_adaptor'} = $gt;
            #$c->log->debug(Core::dump($c->stash->{'genetree_adaptor'}));
        #}
  #catch {
            #$c->go('ReturnError', 'from_ensembl', [$_]);
  #};	
    $c->stash->{pageType} = 'search';
    $c->stash->{template} = 'pages/layout.tt';
    $c->log->debug( 'Search::search: start of chain' ) if $c->debug;
}


#-------------------------------------------------------------------------------

=head2 search : Chained('search') PathPart('') Args(0)

Shows the search page.

=cut
sub search_page : Chained( 'search' )
                  PathPart( '' )
                  Args( 0 ) {
  my ( $this, $c ) = @_;

  $c->log->debug( 'Search::search_page: end of chain; showing search page' )
    if $c->debug;

  $c->stash->{pageType} = 'search';
  $c->stash->{template} = 'pages/layout.tt';
}

#sub keyword_search : Chained( '/' ) PathPart( 'search/keyword' ) Args(0){
    #my ( $this, $c) = @_;
    #my $entry_arg   = $c->req->param( 'query' );
    #if(!defined($entry_arg) || $entry_arg eq ''){
        #$c->log->debug("Problem with search/keyword, no query defined\n"); 
    #}
    #$c->log->debug("search : Chained( '/' ) PathPart( 'search/keyword' ) with $entry_arg\n") if $c->debug;
    #$c->stash->{query}  = $c->request->param( 'query' );
    #$c->res->redirect( $c->uri_for( '/search', $c->stash->{query}, 'keyword') );
    
#}

#sub search_check : Chained( '/' ) PathPart( 'search' ) CaptureArgs(1)
#{

    #my ( $this, $c, $entry_arg ) = @_;
    #$c->log->debug("search : Chained( '/' ) PathPart( 'search' ) with $entry_arg\n") if $c->debug;
    #$c->stash->{query} = $entry_arg; 
    #if($entry_arg =~ /TF\d+/){
        #$c->log->debug("seems to be a treefam family\n") if $c->debug;
        ## TODO: implement this check
        ##if(&check_valid_family){
            #$c->res->redirect( $c->uri_for( '/family', $c->stash->{query},  $c->req->params ) );
        ##}
    #}
    #$c->log->debug("Finished checking search ($entry_arg)\n") if $c->debug;

#}

## matches /family/3
#sub search_do : Chained( 'search_check' ) PathPart( '' ) Args( 0 )
#{
    #my ( $this, $c, $entry_arg ) = @_;
    #$c->log->debug("search : Chained( '/' ) PathPart( 'search' )\n") if $c->debug;
    #my $tainted_entry = $c->stash->{param_entry} || $entry_arg || '';
     #if($entry_arg =~ /TF\d+/){
        #$c->log->debug("seems to be a treefam family\n") if $c->debug;
    #}
    ##$c->log->debug( $c->stash->action ) if $c->debug;
    ##$c->log->debug("Family::family: tainted_entry: |$tainted_entry|") if $c->debug;
	#$c->log->debug("Family::family: entry: $tainted_entry") if $c->debug;
    #my $entry;
    #if ($tainted_entry)
    #{
        #($entry) = $tainted_entry =~ m/^([\w-]+)$/;
        #$c->stash->{rest}->{error} = 'Invalid TreeFam family accession or ID' unless defined $entry;
    #}
    #else
    #{
        #$c->stash->{rest}->{error} = 'No TreeFam family accession or ID specified';
    #}
    #$c->stash->{acc} = $entry;
    #$c->stash->{treefam}->{acc} = $entry;
	#$c->stash->{treefam_family_id} = $entry;
    ## retrieve data for the family
    ##$c->log->debug("retrieve data for the family for $entry\n") if $c->debug;
    
	##$c->forward( 'get_data', [$entry] ) if defined $entry;
	##$c->log->debug("back from retrieving data\n") if $c->debug;

    ##$c->forward( 'get_family_sequences', [ $entry ] ) if defined $entry;
    
	##$c->log->debug("Reading sunburst data\n") if $c->debug;
	##$c->forward('get_sunburst_data', [$entry]);
	
	## Wikipedia content
	##$c->log->debug('Family::family_page: Retrieving wikipedia content') if $c->debug;
   	##$c->forward('get_wikipedia');
   	

    ##$c->log->debug('Family::family_page: adding summary info') if $c->debug;
    ## Get Summary data
	##$c->forward('get_summary_data');
    ##if(! exists ($c->stash->{summaryData})){
    
    ##}   	
	#$c->stash->{pageType} = 'search';
    #$c->stash->{template} = 'pages/layout.tt';
#}

#sub check_valid_family : Private{
    

#}

#-------------------------------------------------------------------------------

=head1 AUTHOR

John Tate, C<jt6@sanger.ac.uk>

Rob Finn, C<rdf@sanger.ac.uk>

=head1 COPYRIGHT

Copyright (c) 2007: Genome Research Ltd.

Authors: Rob Finn (rdf@sanger.ac.uk), John Tate (jt6@sanger.ac.uk)

This is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
details.

You should have received a copy of the GNU General Public License along with
this program. If not, see <http://www.gnu.org/licenses/>.

=cut

1;
