
# Family.pm
# jt6 20080306 WTSI
#
# $Id: Family.pm,v 1.6 2009-01-06 11:52:06 jt6 Exp $

=head1 NAME

RfamWeb::Controller::Family - controller to build the main Rfam family page

=cut

package TreeFam::Controller::Family;

=head1 DESCRIPTION

This is intended to be the base class for everything related to Rfam
families across the site. The L<begin|/"begin : Private"> method tries
to extract a Rfam ID or accession from the captured URL and tries to
load a Rfam object from the model.

Generates a B<tabbed page>.

$Id: Family.pm,v 1.6 2009-01-06 11:52:06 jt6 Exp $

=cut

use strict;
use warnings;

use Compress::Zlib;
use MIME::Base64;
use JSON;
use File::Temp qw( tempfile );
use Data::Dump qw( dump );
use Moose;
use Bio::EnsEMBL::Compara::DBSQL::DBAdaptor;
use Bio::EnsEMBL::Compara::Family;
use Bio::EnsEMBL::Compara::DBSQL::GeneTreeAdaptor;
use Bio::EnsEMBL::Compara::GeneTree;
use namespace::autoclean;
#use treefam::nhx_plot;

BEGIN {
  extends 'Catalyst::Controller::REST';
  print STDERR "[beginning of family controller]\n";
}

# set up the list of content-types that we handle
__PACKAGE__->config(
  'default' => 'text/html',
  'map'     => {
    'text/html' => [ 'View', 'TT' ],
    'text/xml'  => [ 'View', 'TT' ],
    'application/json' => 'JSON',
  }
);

# set the name of the section
__PACKAGE__->config( SECTION => 'family' );

# this is really ugly, but it makes sense to have this image easily to hand.
# Ideally we'd use a __DATA__ stream, but that breaks in mod_perl and we
# probably shouldn't try it in a FastCGI environment either. 
# See: http://modperlbook.org/html/6-6-1-_-_END_-_-and-_-_DATA_-_-Tokens.html
our $no_alignment_image = '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';
    
#-------------------------------------------------------------------------------

=head1 METHODS

=head2 begin : Private

Extracts values from the parameters. Accepts "acc", "id" and "entry", in lieu
of having them as path components.

=cut

#sub begin : Private {
#  my ( $this, $c ) = @_;
#  #use Data::Dumper;
#  #print Dumper $c;
#  #exit;
#  # get a handle on the entry, if supplied as params, and detaint it
#  my $tainted_entry = $c->req->param('ac')   ||
#                      $c->req->param('id')    ||
#                      $c->req->param('entry') ||
#                      '';
#	$c->log->debug( "tainted entry is $tainted_entry\n" ) if $c->debug;
#  if ( $tainted_entry ) {
#    $c->log->debug( 'Family::begin: got a tainted entry' )
#      if $c->debug;
#    ( $c->stash->{param_entry} ) = $tainted_entry =~ m/^([\w-]+)$/;
#  }
#}

#-------------------------------------------------------------------------------

=head2 family : Chained('/') PathPart('family') CaptureArgs(1)

Mid-point of a chain handling family-related data. Retrieves family information
from the DB.

=cut

sub family : Chained( '/' ) PathPart( 'family' ) CaptureArgs( 1 ) {

  my ( $this, $c, $entry_arg ) = @_;
  $c->log->debug( "family : Chained( '/' ) PathPart( 'family' )\n" ) if $c->debug;
  my $tainted_entry = $c->stash->{param_entry} || $entry_arg ||'';
  #$c->log->debug( $c->stash->action ) if $c->debug;
  $c->log->debug( "Family::family: tainted_entry: |$tainted_entry|" ) if $c->debug;

  my $entry;
  if ( $tainted_entry ) {
    ( $entry ) = $tainted_entry =~ m/^([\w-]+)$/;
    $c->stash->{rest}->{error} = 'Invalid TreeFam family accession or ID' unless defined $entry;
  }
  else {
    $c->stash->{rest}->{error} = 'No TreeFam family accession or ID specified';
  }
  $c->stash->{acc} = $entry;

  # retrieve data for the family
  $c->log->debug( "retrieve data for the family for $entry\n" ) if $c->debug;
  $c->forward( 'get_data', [ $entry ] ) if defined $entry;
  $c->log->debug( "back from retrieving data\n" ) if $c->debug;
  
  
  #$c->forward( 'get_sequences', [ $entry ] ) if defined $entry;
  
  $c->log->debug( 'Family::family_page: adding summary info' ) if $c->debug;
  $c->forward( 'get_summary_data' );
  
  
  $c->stash->{pageType} = 'family';
  $c->stash->{template} = 'pages/layout.tt';
}

sub tree : Chained( 'family' ) PathPart( 'tree' ) Args( 1 ) {
    my ( $this, $c, $integer ) = @_;


    $c->log->debug("trying to get data for ".$c->stash->{acc}." $c\n") if $c->debug;
    # stash the tree object
    $c->log->debug("trying to get data for $integer \n") if $c->debug;
    $c->stash->{acc} = $integer;
    $c->forward('get_tree');

    # set up the TT view
    $c->stash->{template} = 'components/blocks/family/treeMap.tt';

    # cache the page (fragment) for one week
    #$c->cache_page( 604800 );

    $c->log->debug('Family::Tree::tree: rendering treeMap.tt') if $c->debug;

    my $filename = '';
    $c->res->content_type('text/plain');
    #$c->res->header('Content-disposition' => "attachment; filename=$filename" );
    $c->res->body( $c->stash->{treeData} );

}


#-------------------------------------------------------------------------------

=head2 download : Local

Serves the raw tree data as a downloadable file.

=cut

sub download : Local {
  my ( $this, $c ) = @_;

  $c->log->debug( 'Family::Tree::download: dumping tree data to the response' ) if $c->debug;

  # stash the raw tree data
  $c->forward( 'get_tree_data' );

  return unless defined $c->stash->{treeData};

  my $filename = $c->stash->{acc} . '_' . $c->stash->{alnType} . '.nhx';
  $c->log->debug( 'Family::Tree::download: tree data: |' . $c->stash->{treeData} . '|' )
    if $c->debug;

  $c->log->debug( "Family::Tree::download: tree filename: |$filename|" )
    if $c->debug;

  $c->res->content_type( 'text/plain' );
  $c->res->header( 'Content-disposition' => "attachment; filename=$filename" );
  $c->res->body( $c->stash->{treeData} );
}

#-------------------------------------------------------------------------------
#- private actions -------------------------------------------------------------
#-------------------------------------------------------------------------------


=head2 get_tree : Private

Builds the TreeFam tree object for the specified family and alignment type 
(seed or full). We first check the cache for the pre-built tree object and 
then fall back to the database if it's not already available in the cache.

=cut

sub get_tree : Private {
  my ( $this, $c) = @_;

  # retrieve the tree from the DB
  $c->forward( 'get_tree_data' );

  unless ( defined $c->stash->{treeData} ) {
    $c->stash->{errorMsg} = 'We could not extract the ' . $c->stash->{alnType}
                            . 'tree for ' . $c->stash->{acc};
    return;
  }
          $c->stash->{tree} = $c->stash->{treeData};
   return $c->stash->{tree}; 
}

=head2 getTreeData : Private

Retrieves the raw tree data. We first check the cache and then fall back to the 
database.

=cut

sub get_tree_data : Private {
  my ( $this, $c) = @_;

  # see if we can extract the pre-built tree object from cache
  my $cacheKey = 'treeData' 
                 . $c->stash->{acc}
                 . $c->stash->{alnType};
  my $treeData = $c->cache->get( $cacheKey );
    $c->log->debug( "stash has $cacheKey" ) if $c->debug;  
    use Data::Dumper;
    print Dumper $c->stash;
  if ( defined $treeData ) {
    $c->log->debug( 'Family::Tree::get_tree_data: extracted tree data from cache' )
      if $c->debug;  
  }
  else {
    $c->log->debug( 'Family::Tree::get_tree_data: failed to extract tree data from cache; going to DB' )
      if $c->debug;  
   	my $treefam_family_id = $c->stash->{acc};
	$c->log->debug("looking for $treefam_family_id id\n") if $c->debug;
   #my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'treefam_admin',
                                    #-dbname => 'treefam_homology_67x',
                                    #-host   => 'web-mei-treefam',
                                    #-pass => $ENV{TFADMIN_PSW},
                                    #-port => '3365');
my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'root',-dbname => 'treefam_homology_67x',-host   => 'localhost',-pass => '123',-port => '3306');   
   my $genetree_adaptor = $db->get_GeneTreeAdaptor; 
    my $tree = $genetree_adaptor->fetch_by_root_id($treefam_family_id);
    if ( !defined($tree) ) {
            print "Could not get tree\n";
            return $treeData;
    }
    else{
        my $root_of_tree = $tree->root;
        $treeData = $root_of_tree->nhx_format;
    }
        unless ( defined $treeData ) {
      $c->log->debug( 'Family::Tree::get_tree_data: failed to retrieve tree data' )
        if $c->debug;
      $c->stash->{errorMsg} = 'We could not extract the tree data for '
                              . $c->stash->{acc};
      return;
    }

    # and now cache the populated tree data
    $c->cache->set( $cacheKey, $treeData ) unless $ENV{NO_CACHE};
  }

  # stash the uncompressed tree
  $c->stash->{treeData} = $treeData;
}




=head2 get_data : Private

Retrieves family data for the given entry. Accepts the entry ID or accession as
the first argument. Does not return any value but drops the L<ResultSet> for
the relevant row into the stash.

=cut

sub get_data : Private {
  my ( $this, $c, $entry ) = @_;
 
  # check for a family
  #my $treefam = $c->model('TreeFamDB::Family')
               #->search( [ { stable_id => $entry},] )
               #->single;
my $treefam = $c->model('TreeFamDB::GeneTreeRootTag')
        ->search( [ { root_id => $entry},] )
            ->single;
    

  unless ( defined $treefam ) {
    $c->log->debug( "Family::get_data: no row for that accession/ID ($entry)" )
      if $c->debug;
 
    # there's a status helper that fits here...
    $this->status_not_found( $c,message => 'No valid TreeFam family accession or ID');

    return;
  } 
  	#use Data::Dumper;
	#print Dumper $treefam;
  $c->log->debug( "Family::get_data: got a family with id ".$treefam->{family_id} )
    if $c->debug;

  $c->stash->{treefam} = $treefam;
  $c->stash->{treefam_family_id} = $treefam->root_id;
}

=head2 get_summary_data : Private

Retrieves summary data for the family. For most fields this is a simple look-up
on the Rfam object that we already have, but for the number of interactions
we have to do one more query.

=cut

sub get_summary_data : Private {
  my ( $this, $c, $entry ) = @_;
	my $treefam_family_id = $c->stash->{treefam_family_id};
  	my $summaryData = {};
	#$treefam_family_id = 1;
	$c->log->debug("looking for $treefam_family_id id\n") if $c->debug;
   #my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'treefam_admin',
                                    #-dbname => 'treefam_homology_67x',
                                    #-host   => 'web-mei-treefam',
                                    #-pass => $ENV{TFADMIN_PSW},
                                    #-port => '3365');

my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'root',-dbname => 'treefam_homology_67x',-host   => 'localhost',-pass => '123',-port => '3306');

#'dbi:mysql:database=treefam_homology_67x;host=localhost;port=3306', user => 'root', password => '123'

my $genetree_adaptor = $db->get_GeneTreeAdaptor; 
    my $tree = $genetree_adaptor->fetch_by_root_id($treefam_family_id);
    if ( !defined($tree) ) {
            print "Could not get tree\n";
    }
    #get tag-values for this tree
    my $tagvalue_hashref = $tree->get_tagvalue_hash();
    if(!keys(%$tagvalue_hashref)){
        die "Could not get tagvalue_hashref for tree\n";
            }
          #  print Dumper $tagvalue_hashref;
    
	$summaryData->{numSequences} = $tagvalue_hashref->{gene_count};
	$summaryData->{tree_max_branch} = $tagvalue_hashref->{tree_max_branch};
	$summaryData->{tree_num_human_peps} = $tagvalue_hashref->{tree_num_human_peps};
	$summaryData->{tree_num_dup_nodes} = $tagvalue_hashref->{tree_num_dup_nodes};
	$summaryData->{aln_method} = $tagvalue_hashref->{aln_method};
	$summaryData->{aln_percent_identity} = $tagvalue_hashref->{aln_percent_identity};
	$summaryData->{aln_num_residues} = $tagvalue_hashref->{aln_num_residues};
	$summaryData->{tree_num_spec_nodes} = $tagvalue_hashref->{tree_num_spec_node};
	$summaryData->{aln_length} = $tagvalue_hashref->{aln_length};
	$summaryData->{aln_runtime} = $tagvalue_hashref->{aln_runtime};
	$summaryData->{tree_max_length} = $tagvalue_hashref->{tree_max_length};
	$summaryData->{buildhmm_runtime_msec} = $tagvalue_hashref->{buildhmm_runtime_msec};
	$summaryData->{njtree_phyml_runtime_msec} = $tagvalue_hashref->{njtree_phyml_runtime_msec};
	$summaryData->{orthotree_runtime_msec} = $tagvalue_hashref->{orthotree_runtime_msec};
	$summaryData->{tree_num_leaves} = $tagvalue_hashref->{tree_num_leaves};
	
	$summaryData->{numStructures} = 2;
	$summaryData->{numInt} = 0;

  $c->stash->{summaryData} = $summaryData;

    #$c->stash->{treefam}->{num_full} = $treefam_genes4family;
    $c->stash->{treefam}->{num_full} = $tagvalue_hashref->{gene_count};



# Getting hmmer matches
#my @treefam_hmmermatches = $c->model('TreeFamDB::HmmerMatches')
#               ->search( [ { ac => $entry },
 #              				 ] );
	$c->stash->{showAll} = 1;
	$c->stash->{showText} = 1;
     
# Get Tree
my $root_of_tree = $tree->root;
$c->log->debug( "Got Tree") if $c->debug;

my @member_list = @{$root_of_tree->get_all_leaves};


#my %species_count = map { $_->taxon_id => 1 } @member_list;
my %species_count = { 'bla'=> 1, 'test => 2' } ;

$c->log->debug( "Found ".keys(%species_count)." species") if $c->debug;
	$summaryData->{numSpecies} = keys(%species_count);


# Get Alignment
 my $simpleAlign = $tree->get_SimpleAlign();

$c->stash->{tree_info}{seed} = $root_of_tree->nhx_format;
$c->stash->{alignment_info}{seed} = $simpleAlign;
$c->stash->{alignment_info}{num_seed} = $tagvalue_hashref->{tree_num_leaves};


}



#
__PACKAGE__->meta->make_immutable;

1;

