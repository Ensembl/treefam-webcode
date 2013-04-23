
# Family.pm
# jt6 20080306 WTSI
#
# $Id: Family.pm,v 1.6 2009-01-06 11:52:06 jt6 Exp $

=head1 NAME

TreeFam::Controller::Family - controller to build the main Rfam family page

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
use IO::String;
use Moose;
use namespace::autoclean;
use Bio::EnsEMBL::Compara::DBSQL::DBAdaptor;
use Bio::EnsEMBL::Compara::Family;
use Bio::EnsEMBL::Compara::DBSQL::GeneTreeAdaptor;
use Bio::EnsEMBL::Compara::GeneTree;
use Bio::EnsEMBL::Compara::Graph::OrthoXMLWriter;
use Bio::AlignIO;
use namespace::autoclean;

#use Encode; 
#require Encode::Detect; 



#use treefam::nhx_plot;
## Use TreeFam helpers
use TreeFam::HomologyHelper;
use TreeFam::SearchHelper;

BEGIN
{
    extends 'Catalyst::Controller::REST';
    print STDERR "[beginning of family controller]\n";
}

# set up the list of content-types that we handle
__PACKAGE__->config(
                     'default' => 'text/html',
                     'map'     => {
                                'text/html'        => [ 'View', 'TT' ],
                                'text/xml'         => [ 'View', 'TT' ],
                                'text/plain'       => [ 'View', 'TT' ],
                                'application/json' => 'JSON',
                              }
                   );

# set the name of the section
__PACKAGE__->config( SECTION => 'family' );


#with 'PfamBase::Roles::Section' => { -excludes => 'section' },
#with   'TreeFam::Roles::Family::HomologyMethods';
#-------------------------------------------------------------------------------

=head1 METHODS


=head2 family : Chained('/') PathPart('family') CaptureArgs(1)

Mid-point of a chain handling family-related data. Retrieves family information
from the DB.

=cut
#  /family/
sub get_adaptors : Chained( '/' ) PathPart( 'family' ) CaptureArgs(0)
{
  my ($self, $c) = @_;
  
  #my $reg = $c->model('Registry');
  my $reg = 'Bio::EnsEMBL::Registry'; 
  my $compara_name = $c->request()->param('compara');
  
  try {
            #my $ma = $reg->get_adaptor($compara_name, 'compara', 'member');
            #$c->go('ReturnError', 'custom', ["No member adaptor found for $compara_name"]) unless $ma;
            #$c->stash(member_adaptor => $ma);
          
            my $ha = $reg->get_adaptor($compara_name, 'compara', 'homology');
            $c->go('ReturnError', 'custom', ["No homology adaptor found for $compara_name"]) unless $ha;
            $c->stash(homology_adaptor => $ha);
            
            my $gt = $reg->get_adaptor($compara_name, 'compara', 'GeneTree');
            $c->go('ReturnError', 'custom', ["No genetree adaptor found for $compara_name"]) unless $gt;
            #$c->stash(genetree_adaptor => $gt);
            $c->stash->{'genetree_adaptor'} = $gt;
            #$c->log->debug("here is what we saved\n");
            #$c->log->debug(dump($c->stash->{'genetree_adaptor'}));
            #$c->log->debug(dump($gt));
            #$c->log->debug("done\n");
            }
  catch {
            $c->go('ReturnError', 'from_ensembl', [$_]);
  }; 

}


# /family/../
sub family_check : Chained( '/' ) PathPart( 'family' ) CaptureArgs(1)
{
    my ( $this, $c, $to_search ) = @_;
    $c->log->debug("family : Chained( '/' ) PathPart( 'family' )\n") if $c->debug;
    $c->stash->{acc} = $to_search;
  # tell the layout template to disable the summary icons
  $c->stash->{iconsDisabled} = 0;
    my $tainted_entry = $c->stash->{acc};

	$c->log->debug("Family::family: entry: $tainted_entry") if $c->debug;
    my $entry;
    if ($tainted_entry)
    {
        ($entry) = $tainted_entry =~ m/^([\w-]+)$/;
        $c->stash->{rest}->{error} = 'Invalid TreeFam family accession or ID' unless defined $entry;
    }
    else
    {
        $c->stash->{rest}->{error} = 'No TreeFam family accession or ID specified';
    }
    $c->log->debug("family_begin : Chained( '/' ) PathPart( 'family' )\n") if $c->debug;
    $c->log->debug("Check if valid id \n") if $c->debug;
    
    my $registry = 'Bio::EnsEMBL::Registry'; 
    my $genetree_adaptor = $registry->get_adaptor('TreeFam', 'Compara', 'GeneTree');
    $c->go('ReturnError', 'custom', ["No genetree adaptor found for TreeFam"]) unless $genetree_adaptor;
    $c->stash->{'genetree_adaptor'} = $genetree_adaptor;

    $to_search = TreeFam::SearchHelper::check_valid_family({"genetree_adaptor" => $genetree_adaptor,"to_search" => $to_search}); 
    $c->log->debug("mapped ID is $to_search \n");
   
    if(!$to_search ){
	$c->log->debug("no valid TreeFam accession number");
        $c->stash->{errorMsg} = "Invalid TreeFam accession number specified";
	$c->stash->{template} = "pages/error.tt";
	#return;
    }
	else{
    	# If TF101001 ne BRCA2
    		if($to_search ne $c->stash->{acc}){
       			$c->res->redirect( $c->uri_for( '/family', $to_search) );    
    		}
    		$c->stash->{acc} = $to_search;
	}

}

# matches /family/3
sub family_data : Chained( 'family_check' ) PathPart( '' ) Args(0)
{

    my ( $this, $c ) = @_;
    $c->log->debug("family : Chained( '/' ) PathPart( 'family' )\n") if $c->debug;
    
	 if($c->stash->{errorMsg}){
    		$c->log->debug("family : Chained( '/' ) PathPart( 'family' ): There was an error message\n") if $c->debug;
		return;
	}
	$c->stash->{treefam}->{acc} = $c->stash->{acc};
	$c->stash->{treefam_family_id} = $c->stash->{acc};
    # retrieve data for the family
    $c->log->debug("retrieve data for the family for ".$c->stash->{acc}."\n") if $c->debug;
    
	#$c->forward( 'get_data', [$entry] ) if defined $entry;
	#$c->log->debug("back from retrieving data\n") if $c->debug;

    #$c->forward( 'get_family_sequences', [ $entry ] ) if defined $entry;
    
	#$c->log->debug("Reading sunburst data\n") if $c->debug;
	#$c->forward('get_sunburst_data', [$entry]);
	
	# Wikipedia content
	#$c->log->debug('Family::family_page: Retrieving wikipedia content') if $c->debug;
    #$c->forward('get_wikipedia');
   	
    $c->log->debug('Family::family_page: adding summary info') if $c->debug;
    # Get Summary data
	$c->forward('get_summary_data');
    if(! exists ($c->stash->{summaryData})){
    
    }   	
    $c->log->debug('Family::family_page: adding sunburst info') if $c->debug;
    # Get Summary data
	#$c->forward('get_sunburst_data');
    if(! exists ($c->stash->{sunburst_data})){
        $c->stash->{no_sunburst}  = 1;
    } 	
    $c->stash->{pageType} = 'family';
    $c->stash->{template} = 'pages/layout.tt';
}

# Default tree show method
#
# matches /family/3/tree
sub default_tree : Chained( 'family_check' ) PathPart( 'tree' ) Args(0 )
 {
     my ( $this, $c ) = @_;
     $c->log->debug( "trying to get default tree data for " . $c->stash->{acc} . " $c\n" ) if $c->debug;
     # stash the tree object
     $c->forward('get_tree');
     # set up the TT view
     # cache the page (fragment) for one week
     #$c->cache_page( 604800 );
     #$c->log->debug('Family::Tree::tree: rendering treeMap.tt') if $c->debug;
     my $filename = '';
     $c->res->content_type('text/plain');
     #$c->res->header('Content-disposition' => "attachment; filename=$filename" );
     $c->res->body( $c->stash->{treeData} );
 }

# checks /family/3/all_species
sub get_all_species : Chained( 'family_check' ) PathPart( 'all_species' ) Args(0){
    my ( $this, $c ) = @_;
    my $treefam_family_id =$c->stash->{acc};
    my @all_species;
    #my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'treefam_admin',-dbname => 'treefam_homology_67hmm',-host   => 'web-mei-treefam',-pass => $ENV{TFADMIN_PSW},-port => '3365');
    #my $genetree_adaptor = $db->get_GeneTreeAdaptor;
    my $genetree_adaptor = $c->stash->{'genetree_adaptor'};
    my $tree             = $genetree_adaptor->fetch_by_stable_id($treefam_family_id);
    if ( !defined($tree) || $tree eq '' )
    {
    	$c->log->debug('Family::Tree::get_summary Could not find tree using stable_id') if $c->debug;
     	#try with root_id
    	# here we can only use numbers, no characters
        unless($treefam_family_id =~ m/^TF/){
            $tree             = $genetree_adaptor->fetch_by_root_id($treefam_family_id);
        }
        if ( !defined($tree) || $tree eq '' ){
        	print "Could not get tree\n";
            $c->log->debug('Family::Tree::get_summary Could not get tree') if $c->debug;
            $c->stash->{errorMsg} = 'We could not find a tree for the given accession number ' . $c->stash->{acc};
            return;
		}        
    }
    $c->log->debug("Family::get_all_species lets try to get species ") if $c->debug;
    my $all_ncbiTaxa = TreeFam::HomologyHelper::get_all_species_for_family({"genetree_adaptor" => $genetree_adaptor, "to_search" => $treefam_family_id});
    foreach my $species(sort @{$all_ncbiTaxa}){
        my @arr;
        push(@arr, $species);
    	$c->log->debug("Family::get_all_species found ".$species) if $c->debug;
        push(@all_species,\@arr);
    }
    my $data = encode_json \@all_species;
    $c->res->content_type('application/json');
    $c->res->body( $data );
 
}
# checks /family/3/all_ids
sub get_all_ids : Chained( 'family_check' ) PathPart( 'all_ids' ) Args(0){
    my ( $this, $c ) = @_;
    my $treefam_family_id =$c->stash->{acc};
    my @all_ids;
    #my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'treefam_admin',-dbname => 'treefam_homology_67hmm',-host   => 'web-mei-treefam',-pass => $ENV{TFADMIN_PSW},-port => '3365');
    #my $genetree_adaptor = $db->get_GeneTreeAdaptor;
    my $genetree_adaptor = $c->stash->{'genetree_adaptor'};
    my $tree             = $genetree_adaptor->fetch_by_stable_id($treefam_family_id);
    if ( !defined($tree) || $tree eq '' )
    {
    	$c->log->debug('Family::Tree::get_summary Could not find tree using stable_id') if $c->debug;
     	#try with root_id
    	# here we can only use numbers, no characters
        unless($treefam_family_id =~ m/^TF/){
            $tree             = $genetree_adaptor->fetch_by_root_id($treefam_family_id);
        }
        if ( !defined($tree) || $tree eq '' ){
        	print "Could not get tree\n";
            $c->log->debug('Family::Tree::get_summary Could not get tree') if $c->debug;
            $c->stash->{errorMsg} = 'We could not find a tree for the given accession number ' . $c->stash->{acc};
            return;
		}        
    }
    my $all_leaves = ( $tree->root )->get_all_leaves();
    foreach my $member(@{$all_leaves}){
        my @arr;
        push(@arr, $member->stable_id);
        push(@all_ids,\@arr);
    }
    my $data = encode_json \@all_ids;
    $c->res->content_type('application/json');
    $c->res->body( $data );
 
}
# checks /family/3/hmm
sub get_homologyType : Chained( 'family_check' ) PathPart( 'homologyType' ) Args(2){
    my ( $this, $c, $query1,$query2 ) = @_;
    use Data::Dumper;
    $c->log->debug(Dumper($c->request->param));
    #my $query1 = $c->request->param('query1');
    #my $query2 = $c->request->param('query2');
    $c->log->debug("in homologytype with $query1 and $query2");

    my $data = "some results back from server";
    if(!$query1 || $query2){
        $data = "Sorry, could not find the provided IDs in our db";
    }
     
    my $switch = "homology_relation_for_pair";
    my $source_id = $query1;
    my $source_id2 = $query2;
    my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'treefam_admin',-dbname => 'treefam_homology_67hmm',-host   => 'web-mei-treefam',-pass => $ENV{TFADMIN_PSW},-port => '3365');
    my $source_member2_object;
    my $source_member_object = get_member_object($db,$source_id);

    if(!$source_member_object){ die "Could not get member object for $source_id. Stopping\n"}
    print "Found member: ".$source_member_object->taxon_id."\n";
    if($source_id2){
        $source_member2_object = get_member_object($db,$source_id2);
        if(!$source_member2_object){ die "Could not get member object for $source_id2. Stopping\n"}
        print "Found second member: ".$source_member2_object->taxon_id."\n";
    }

    if($switch eq "homology_relation_for_pair"){
        my $homologies = TreeFam::HomologyHelper::get_homology_relation_for_gene_pair($db,$source_member_object, $source_member2_object);
        if(!$homologies){
            $data =     "did not find a relationship for gene pair\n";
        }
        else{
            my @arr;
            push(@arr,$source_id);
            push(@arr,"Taxon1");
            push(@arr,$source_id2);
            push(@arr,"Taxon2");
            push(@arr,$homologies->description);
            push(@arr,$homologies->taxonomy_level);
            
            my %row_hash = ("ID1"=>$source_id,"species1"=>"Taxon1","ID2"=>$source_id2,"species2"=>"Taxon2","type"=>$homologies->description,"tax_level"=>$homologies->taxonomy_level);
            my @found; 
            #push(@found, %row_hash); 
            push(@found,\@arr);
            
             $data = encode_json \@found;
        }    
    }
     $c->res->content_type('text/plain');
     $c->res->body( $data );
}
# checks /family/3/hmm
sub hmm : Chained( 'family_check' ) PathPart( 'hmm' ) Args(0)
 {
     my ( $this, $c, $format ) = @_;
     $c->log->debug( "trying to tree data for " . $c->stash->{acc} ." format: $format \n" ) if $c->debug;
     # stash the tree object
     # remember format
     $c->forward('get_hmm');
     # set up the TT view
     # cache the page (fragment) for one week
     #$c->cache_page( 604800 );
     $c->log->debug('Family::HMM we got an hmm, right?') if $c->debug;
     my $filename = $c->stash->{acc}.".hmm";
     $c->res->content_type('text/plain');
     $c->res->header('Content-disposition' => "attachment; filename=$filename" );
     $c->res->body( $c->stash->{hmm} );
 }

# checks /family/3/tree
sub check_tree : Chained( 'family_check' ) PathPart( 'tree' ) CaptureArgs(0)
 {
     my ( $this, $c, $format ) = @_;
     $format = (!defined($format)? "phyloxml":$format);
     $c->log->debug( "trying to tree data for " . $c->stash->{acc} ." format: $format \n" ) if $c->debug;
     # stash the tree object
     if($format ne "newick" || $format ne "phyloxml" || $format ne "png"){
     }
     # well, if we don't have a format, we take phyoxml?
     # remember format
     $c->stash->{tree_format} = $format;
     #$c->forward('get_tree');
     # set up the TT view
     # cache the page (fragment) for one week
     #$c->cache_page( 604800 );
     #$c->log->debug('Family::Tree::tree: rendering treeMap.tt') if $c->debug;
     #my $filename = '';
     #$c->res->content_type('text/plain');
     #$c->res->header('Content-disposition' => "attachment; filename=$filename" );
     #$c->res->body( $c->stash->{treeData} );
 }
# checks /family/3/tree
sub newick : Chained( 'check_tree' ) PathPart( 'newick' ) Args(0 )
 {
     my ( $this, $c ) = @_;
     my ($acc,$format) = ($c->stash->{acc}, $c->stash->{tree_format}); 
     $c->log->debug( "trying to tree data for " . $c->stash->{acc} . " format $format\n" ) if $c->debug;
     $c->forward('get_tree', "newick");
     # set up the TT view
     # cache the page (fragment) for one week
     #$c->cache_page( 604800 );
     $c->log->debug('Family::Tree::newick: got the tree, now back ') if $c->debug;
     my $filename = $c->stash->{acc}.".nhx";
     $c->res->content_type('text/plain');
     $c->res->header('Content-disposition' => "attachment; filename=$filename" );
     $c->res->body( $c->stash->{treeData} );
 }
# matches /family/*/tree/png
 sub png : Chained( 'check_tree' ) PathPart( 'png' ) Args(0 )
 {
     my ( $this, $c ) = @_;
     my ($acc,$format) = ($c->stash->{acc}, $c->stash->{format}); 
     $c->log->debug( "trying to tree data for " . $c->stash->{acc} . " format $format\n" ) if $c->debug;
     
    
     $c->forward('get_tree', "png");
     # set up the TT view
     # cache the page (fragment) for one week
     #$c->cache_page( 604800 );
     #$c->log->debug('Family::Tree::tree: rendering treeMap.tt') if $c->debug;
     my $filename = '';
     $c->res->content_type( 'image/png' );
     #$c->res->header('Content-disposition' => "attachment; filename=$filename" );
     $c->res->body( $c->stash->{treeData} );
 }

# checks /family/3/tree
sub json_tree : Chained( 'check_tree' ) PathPart( 'json' ) Args(0 )
 {
     my ( $this, $c ) = @_;
     my ($acc,$format) = ($c->stash->{acc}, $c->stash->{format}); 
     $c->log->debug( "trying to tree data for " . $c->stash->{acc} . " format phyloxml\n" ) if $c->debug;
     $c->forward('get_tree_json', "json_tree");
     # cache the page (fragment) for one week
     #$c->cache_page( 604800 );
     my $filename = '';
     $c->res->content_type('text/plain');
     #$c->res->header('Content-disposition' => "attachment; filename=$filename" );
     $c->res->body( $c->stash->{treeData} );
 }

# checks /family/3/tree
sub minimal_species_json_tree : Chained( 'check_tree' ) PathPart( 'minimal_species_json' ) Args(0 )
 {
     my ( $this, $c ) = @_;
     my ($acc,$format) = ($c->stash->{acc}, $c->stash->{format}); 
     $c->log->debug( "trying to tree data for " . $c->stash->{acc} . " format phyloxml\n" ) if $c->debug;
     $c->forward('get_minimal_species_tree_json', "minimal_species_json_tree");
     # cache the page (fragment) for one week
     #$c->cache_page( 604800 );
     my $filename = '';
     $c->res->content_type('text/plain');
     #$c->res->header('Content-disposition' => "attachment; filename=$filename" );
     $c->res->body( $c->stash->{treeData} );
 }

# checks /family/3/tree
sub phyloxml : Chained( 'check_tree' ) PathPart( 'phyloxml' ) Args(0 )
 {
     my ( $this, $c ) = @_;
     my ($acc,$format) = ($c->stash->{acc}, $c->stash->{format}); 
     $c->log->debug( "trying to tree data for " . $c->stash->{acc} . " format phyloxml\n" ) if $c->debug;
     $c->forward('get_tree_phyloxml', "phyloxml");
     # cache the page (fragment) for one week
     #$c->cache_page( 604800 );
     my $filename = '';
     $c->res->content_type('text/plain');
     #$c->res->header('Content-disposition' => "attachment; filename=$filename" );
     $c->res->body( $c->stash->{treeData} );
 }


# matches /family/align/3
sub show_alignment : Chained( 'family_check' ) PathPart( 'alignment' ) Args( 0 )
#sub show_alignment : Chained( 'family_check' ) PathPart( 'alignment_backup' ) Args( 0 )
{
    my ( $this, $c ) = @_;

    #$c->log->debug("trying to get data for $integer \n") if $c->debug;
    #$c->stash->{acc} = $integer;
    $c->forward('get_alignment');

    # set up the TT view
    #$c->stash->{template} = 'components/blocks/family/treeMap.tt';

    # cache the page (fragment) for one week
    #$c->cache_page( 604800 );

    $c->log->debug('Family::Alignment::tree: rendering treeMap.tt') if $c->debug;

    my $filename = $c->stash->{acc}.".fa";
    $c->res->content_type('text/plain');
    $c->res->header('Content-disposition' => "attachment; filename=$filename" );
    $c->res->body( $c->stash->{alnData} );

}

#-------------------------------------------------------------------------------

=head2 download : Local

Serves the raw tree data as a downloadable file.

=cut

sub download : Local
{
    my ( $this, $c ) = @_;

    $c->log->debug('Family::Tree::download: dumping tree data to the response') if $c->debug;

    # stash the raw tree data
    #$c->forward('get_tree_data');

    return unless defined $c->stash->{treeData};

    my $filename = $c->stash->{acc} . '_' . $c->stash->{alnType} . '.nhx';
    $c->log->debug( 'Family::Tree::download: tree data: |' . $c->stash->{treeData} . '|' )
        if $c->debug;

    $c->log->debug("Family::Tree::download: tree filename: |$filename|")
        if $c->debug;

    $c->res->content_type('text/plain');
    $c->res->header( 'Content-disposition' => "attachment; filename=$filename" );
    $c->res->body( $c->stash->{treeData} );
}

#-------------------------------------------------------------------------------
#- private actions -------------------------------------------------------------
#-------------------------------------------------------------------------------

	
=head2 get_alignment : Private

Retrieves the raw alignment data. We first check the cache and then fall back to the 
database.

=cut

sub get_alignment : Private
{
    my ( $this, $c ) = @_;

    # see if we can extract the pre-built tree object from cache
    my $cacheKey = 'alnData' . $c->stash->{acc};
    #my $alnData  = $c->cache->get($cacheKey);
    my $alnData;
    $c->log->debug("stash has $cacheKey") if $c->debug;
    if ( defined $alnData )
    {
        $c->log->debug('Family::Alignment::get_alignment: extracted alignmente data from cache') if $c->debug;
    }
    else
    {
        $c->log->debug('Family::Alignment::get_alignment: failed to extract alignment data from cache; going to DB') if $c->debug;
        my $treefam_family_id = $c->stash->{acc};
        $c->log->debug("looking for $treefam_family_id id\n") if $c->debug;

      #my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'treefam_admin',-dbname => 'treefam_homology_67hmm',-host   => 'web-mei-treefam',-pass => $ENV{TFADMIN_PSW},
      #-port => '3365');
	  #my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor( -user => 'root', -dbname => 'treefam_homology_67x', -host => 'localhost', -pass => '123', -port => '3306' );
        #my $genetree_adaptor = $db->get_GeneTreeAdaptor;
        
        my $genetree_adaptor = $c->stash->{'genetree_adaptor'};
        my $tree             = $genetree_adaptor->fetch_by_stable_id($treefam_family_id);
	    if ( !defined($tree) || $tree eq '' )
    	{
    		$c->log->debug('Family::Tree::get_summary Could not find tree using stable_id') if $c->debug;
	     	#try with root_id
	    	$tree             = $genetree_adaptor->fetch_by_root_id($treefam_family_id);
	        if ( !defined($tree) || $tree eq '' ){
    	    	print "Could not get tree\n";
	            $c->log->debug('Family::Tree::get_summary Could not get tree') if $c->debug;
	            $c->stash->{errorMsg} = 'We could not find a tree for the given accession number ' . $c->stash->{acc};
	            return;
			}
	    }
            	my $root_of_tree = $tree->root;
	            $alnData = $tree->get_SimpleAlign();

    	        # so far we have a SimpleAlign object, but we want to extract the sequences
	            my $fasta_string;
	            foreach my $seq ( $alnData->each_seq )
    	        {
	                $fasta_string .= ">" . $seq->id . "\n" . $seq->seq . "\n";
	            }
	            $alnData = $fasta_string;
        unless ( defined $alnData )
        {
            $c->log->debug('Family::Alignment::get_alignment: failed to retrieve alignment data') if $c->debug;
            $c->stash->{errorMsg} = 'We could not extract the alignment data for ' . $c->stash->{acc};
            return;
        }

        # and now cache the populated tree data
        #$c->cache->set( $cacheKey, $alnData ) unless $ENV{NO_CACHE};
    }

    # stash the uncompressed tree
    $c->stash->{alnData} = $alnData;
}

=head2 get_tree : Private

Retrieves the raw tree data. We first check the cache and then fall back to the 
database.

=cut

 sub get_tree_image : Private
 {
     my ( $this, $c, $format ) = @_;
 
     # see if we can extract the pre-built tree object from cache
     my $cacheKey = 'treeData' . $c->stash->{acc};
     my $treeData = $c->cache->get($cacheKey);
     $c->log->debug("stash has $cacheKey") if $c->debug;
     if ( defined $treeData )
     {
         $c->log->debug('Family::Tree::get_tree_data: extracted tree data from cache') if $c->debug;
     }
     else
     {
         $c->log->debug('Family::Tree::get_tree_data: failed to extract tree data from cache; going to DB') if $c->debug;
         my $treefam_family_id = $c->stash->{acc};
         $c->log->debug("looking for $treefam_family_id id\n") if $c->debug;
 
       #my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'treefam_admin',-dbname => 'treefam_homology_67hmm',-host   => 'web-mei-treefam',-pass => $ENV{TFADMIN_PSW},
       #-port => '3365');
 	  #my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor( -user => 'root', -dbname => 'treefam_homology_67x', -host => 'localhost', -pass => '123', -port => '3306' );
         #my $genetree_adaptor = $db->get_GeneTreeAdaptor;
        my $genetree_adaptor = $c->stash->{'genetree_adaptor'};
         
         my $tree             = $genetree_adaptor->fetch_by_stable_id($treefam_family_id);
 	    if ( !defined($tree) || $tree eq '' )
     	{
     		$c->log->debug('Family::Tree::get_summary Could not find tree using stable_id') if $c->debug;
 	     	#try with root_id
 	    	$tree             = $genetree_adaptor->fetch_by_root_id($treefam_family_id);
 	        if ( !defined($tree) || $tree eq '' ){
     	    	print "Could not get tree\n";
 	            $c->log->debug('Family::Tree::get_summary Could not get tree') if $c->debug;
 	            $c->stash->{errorMsg} = 'We could not find a tree for the given accession number ' . $c->stash->{acc};
 	            return;
 			}
 		}	           
       # if($format eq "newick"){
 		    my $root_of_tree = $tree->root;	
 		        $treeData = $tree->get_value_for_tag('tree_image_png');
 	            $c->log->debug('Family::Tree::get_tree png') if $c->debug;
          #  }
        #}
        #elsif($format eq "phyloxml"){
        #   $treeData = $tree->get_value_for_tag('treephyloxml');
 	    #        $c->log->debug('Family::Tree::get_tree phyloxml') if $c->debug;
        #}
        #elsif($format eq "png"){
        #   $treeData = $tree->get_value_for_tag('tree_image_png');
 	    #        $c->log->debug('Family::Tree::get_tree png') if $c->debug;
        #}
        #$c->stash->{treeData} = $treeData;
        unless ( defined $treeData )
         {
             $c->log->debug('Family::Tree::get_tree_data: failed to retrieve tree data') if $c->debug;
             $c->stash->{errorMsg} = 'We could not extract the tree data for ' . $c->stash->{acc};
             return;
         }
 
         # and now cache the populated tree data
         $c->cache->set( $cacheKey, $treeData ) unless $ENV{NO_CACHE};
     }
 
     # stash the uncompressed tree
        $c->stash->{treeData} = $treeData;
 }

sub get_hmm : Private
 {
     my ( $this, $c, $format ) = @_;
 
     # see if we can extract the pre-built tree object from cache
     my $cacheKey = 'treeData' . $c->stash->{acc};
     #my $hmmData = $c->cache->get($cacheKey);
     my $hmmData;
     $c->log->debug("stash has $cacheKey") if $c->debug;
     if ( defined $hmmData )
     {
         $c->log->debug('Family::Tree::get_tree_data: extracted tree data from cache') if $c->debug;
     }
     else
     {
         $c->log->debug('Family::Tree::get_tree_data: failed to extract tree data from cache; going to DB') if $c->debug;
         my $treefam_family_id = $c->stash->{acc};
         $c->log->debug("looking for $treefam_family_id id\n") if $c->debug;
 
       #my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'treefam_admin',-dbname => 'treefam_homology_67hmm',-host   => 'web-mei-treefam',-pass => $ENV{TFADMIN_PSW},
       #-port => '3365');
 	  #my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor( -user => 'root', -dbname => 'treefam_homology_67x', -host => 'localhost', -pass => '123', -port => '3306' );
         #my $genetree_adaptor = $db->get_GeneTreeAdaptor;
        my $genetree_adaptor = $c->stash->{'genetree_adaptor'};
         
         my $tree             = $genetree_adaptor->fetch_by_stable_id($treefam_family_id);
 	    if ( !defined($tree) || $tree eq '' )
     	{
     		$c->log->debug('Family::Tree::get_summary Could not find tree using stable_id') if $c->debug;
 	     	#try with root_id
 	    	$tree             = $genetree_adaptor->fetch_by_root_id($treefam_family_id);
 	        if ( !defined($tree) || $tree eq '' ){
    	 	    	print "Could not get tree\n";
 		        $c->log->debug('Family::Tree::get_summary Could not get tree') if $c->debug;
 	        	$c->stash->{errorMsg} = 'We could not find a tree for the given accession number ' . $c->stash->{acc};
 	            	return;
 		}
 	}	           
	my $hmmData = TreeFam::HomologyHelper::get_hmm({"genetree_adaptor" => $genetree_adaptor, "to_search"=> $treefam_family_id});
 	        $c->log->debug('Family::Tree::get_hmm') if $c->debug;
                unless ( defined $hmmData ){
             		$c->log->debug('Family::Tree::get_tree_data: failed to retrieve tree data') if $c->debug;
             		$c->stash->{errorMsg} = 'We could not extract the tree data for ' . $c->stash->{acc};
             		return;
         	}
 
         # and now cache the populated tree data
         #$c->cache->set( $cacheKey, $hmmData ) unless $ENV{NO_CACHE};
     }
 
     # stash the uncompressed tree
        $c->stash->{hmm} = $hmmData;
 }
sub get_tree_json : Private
 {
     my ( $this, $c, $format ) = @_;
 
     # see if we can extract the pre-built tree object from cache
     my $cacheKey = 'treeData' . $c->stash->{acc};
     my $treeData;
     #my $treeData = $c->cache->get($cacheKey);
     $c->log->debug("stash has $cacheKey") if $c->debug;
     if ( defined $treeData )
     {
         $c->log->debug('Family::Tree::get_tree_data: extracted tree data from cache') if $c->debug;
     }
     else
     {
         $c->log->debug('Family::Tree::get_tree_data: failed to extract tree data from cache; going to DB') if $c->debug;
         my $treefam_family_id = $c->stash->{acc};
         $c->log->debug("looking for $treefam_family_id id\n") if $c->debug;
              my $genetree_adaptor = $c->stash->{'genetree_adaptor'};
         my $tree             = $genetree_adaptor->fetch_by_stable_id($treefam_family_id);
 	    if ( !defined($tree) || $tree eq '' )
     	{
     		$c->log->debug('Family::Tree::get_summary Could not find tree using stable_id') if $c->debug;
 	     	#try with root_id
 	    	$tree             = $genetree_adaptor->fetch_by_root_id($treefam_family_id);
 	        if ( !defined($tree) || $tree eq '' ){
     	    	print "Could not get tree\n";
 	            $c->log->debug('Family::Tree::get_summary Could not get tree') if $c->debug;
 	            $c->stash->{errorMsg} = 'We could not find a tree for the given accession number ' . $c->stash->{acc};
 	            return;
 			}
 		}	           
 		    my $root_of_tree = $tree->root;	
 		        $treeData = $tree->get_value_for_tag('json_tree');
 	            $c->log->debug('Family::Tree::get_tree phyloxml') if $c->debug;
                unless ( defined $treeData )
         {
             $c->log->debug('Family::Tree::get_tree_data: failed to retrieve tree data') if $c->debug;
             $c->stash->{errorMsg} = 'We could not extract the tree data for ' . $c->stash->{acc};
             return;
         }
 
         # and now cache the populated tree data
         #$c->cache->set( $cacheKey, $treeData ) unless $ENV{NO_CACHE};
     }
 
     # stash the uncompressed tree
        $c->stash->{treeData} = $treeData;
 }


sub get_minimal_species_tree_json : Private
 {
     my ( $this, $c, $format ) = @_;
 
     # see if we can extract the pre-built tree object from cache
     my $cacheKey = 'treeData' . $c->stash->{acc};
     my $treeData;
     #my $treeData = $c->cache->get($cacheKey);
     $c->log->debug("stash has $cacheKey") if $c->debug;
     if ( defined $treeData )
     {
         $c->log->debug('Family::Tree::get_tree_data: extracted tree data from cache') if $c->debug;
     }
     else
     {
         $c->log->debug('Family::Tree::get_minimal_json_tree: failed to extract tree data from cache; going to DB') if $c->debug;
         my $treefam_family_id = $c->stash->{acc};
         $c->log->debug("looking for $treefam_family_id id\n") if $c->debug;
              my $genetree_adaptor = $c->stash->{'genetree_adaptor'};
         my $tree             = $genetree_adaptor->fetch_by_stable_id($treefam_family_id);
 	    if ( !defined($tree) || $tree eq '' )
     	{
     		$c->log->debug('Family::Tree::get_summary Could not find tree using stable_id') if $c->debug;
 	     	#try with root_id
 	    	$tree             = $genetree_adaptor->fetch_by_root_id($treefam_family_id);
 	        if ( !defined($tree) || $tree eq '' ){
     	    	print "Could not get tree\n";
 	            $c->log->debug('Family::Tree::get_minimal_tree_json Could not get tree') if $c->debug;
 	            $c->stash->{errorMsg} = 'We could not find a tree for the given accession number ' . $c->stash->{acc};
 	            return;
 			}
 		}	           
 		    my $root_of_tree = $tree->root;	
 		        $treeData = $tree->get_value_for_tag('minimal_species_tree_json');
 	            $c->log->debug('Family::Tree::get_value_for_tag(minimal_species_tree_json)') if $c->debug;
                unless ( defined $treeData )
         {
             $c->log->debug('Family::Tree::get_tree_data: failed to retrieve tree data') if $c->debug;
             $c->stash->{errorMsg} = 'We could not extract the tree data for ' . $c->stash->{acc};
             return;
         }
 
         # and now cache the populated tree data
         #$c->cache->set( $cacheKey, $treeData ) unless $ENV{NO_CACHE};
     }
 
     # stash the uncompressed tree
        $c->stash->{treeData} = $treeData;
 }
sub get_tree_phyloxml : Private
 {
     my ( $this, $c, $format ) = @_;
 
     # see if we can extract the pre-built tree object from cache
     my $cacheKey = 'treeData' . $c->stash->{acc};
     #my $treeData = $c->cache->get($cacheKey);
     my $treeData;
     $c->log->debug("stash has $cacheKey") if $c->debug;
     if ( defined $treeData )
     {
         $c->log->debug('Family::Tree::get_tree_data: extracted tree data from cache') if $c->debug;
     }
     else
     {
         $c->log->debug('Family::Tree::get_tree_data: failed to extract tree data from cache; going to DB') if $c->debug;
         my $treefam_family_id = $c->stash->{acc};
         $c->log->debug("looking for $treefam_family_id id\n") if $c->debug;
              my $genetree_adaptor = $c->stash->{'genetree_adaptor'};
         my $tree             = $genetree_adaptor->fetch_by_stable_id($treefam_family_id);
 	    if ( !defined($tree) || $tree eq '' )
     	{
     		$c->log->debug('Family::Tree::get_summary Could not find tree using stable_id') if $c->debug;
 	     	#try with root_id
 	    	$tree             = $genetree_adaptor->fetch_by_root_id($treefam_family_id);
 	        if ( !defined($tree) || $tree eq '' ){
     	    	print "Could not get tree\n";
 	            $c->log->debug('Family::Tree::get_summary Could not get tree') if $c->debug;
 	            $c->stash->{errorMsg} = 'We could not find a tree for the given accession number ' . $c->stash->{acc};
 	            return;
 			}
 		}	           
 		    my $root_of_tree = $tree->root;	
 		        $treeData = $tree->get_value_for_tag('treephyloxml');
 	            $c->log->debug('Family::Tree::get_tree phyloxml') if $c->debug;
                unless ( defined $treeData )
         {
             $c->log->debug('Family::Tree::get_tree_data: failed to retrieve tree data') if $c->debug;
             $c->stash->{errorMsg} = 'We could not extract the tree data for ' . $c->stash->{acc};
             return;
         }
 
         # and now cache the populated tree data
         #$c->cache->set( $cacheKey, $treeData ) unless $ENV{NO_CACHE};
     }
 
     # stash the uncompressed tree
        $c->stash->{treeData} = $treeData;
 }


sub get_tree : Private
 {
     my ( $this, $c, $format ) = @_;
 
     # see if we can extract the pre-built tree object from cache
     my $cacheKey = 'treeData' . $c->stash->{acc};
     #my $treeData = $c->cache->get($cacheKey);
     my $treeData;
     $c->log->debug("stash has $cacheKey") if $c->debug;
     if ( defined $treeData )
     {
         $c->log->debug('Family::Tree::get_tree_data: extracted tree data from cache') if $c->debug;
     }
     else
     {
         $c->log->debug('Family::Tree::get_tree_data: failed to extract tree data from cache; going to DB') if $c->debug;
         my $treefam_family_id = $c->stash->{acc};
         $c->log->debug("looking for $treefam_family_id id\n") if $c->debug;
 
       #my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'treefam_admin',-dbname => 'treefam_homology_67hmm',-host   => 'web-mei-treefam',-pass => $ENV{TFADMIN_PSW},
       #-port => '3365');
 	  #my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor( -user => 'root', -dbname => 'treefam_homology_67x', -host => 'localhost', -pass => '123', -port => '3306' );
         #my $genetree_adaptor = $db->get_GeneTreeAdaptor;
        my $genetree_adaptor = $c->stash->{'genetree_adaptor'};
         
         my $tree             = $genetree_adaptor->fetch_by_stable_id($treefam_family_id);
 	    if ( !defined($tree) || $tree eq '' )
     	{
     		$c->log->debug('Family::Tree::get_summary Could not find tree using stable_id') if $c->debug;
 	     	#try with root_id
 	    	$tree             = $genetree_adaptor->fetch_by_root_id($treefam_family_id);
 	        if ( !defined($tree) || $tree eq '' ){
     	    	print "Could not get tree\n";
 	            $c->log->debug('Family::Tree::get_summary Could not get tree') if $c->debug;
 	            $c->stash->{errorMsg} = 'We could not find a tree for the given accession number ' . $c->stash->{acc};
 	            return;
 			}
 		}	           
       # if($format eq "newick"){
 		    my $root_of_tree = $tree->root;	
 		    $treeData = $tree->get_value_for_tag('treenhx');
            if($format eq "phyloxml"){
 		        $treeData = $tree->get_value_for_tag('treephyloxml');
 	            $c->log->debug('Family::Tree::get_tree phyloxml') if $c->debug;
            }
        #}
        #elsif($format eq "phyloxml"){
        #   $treeData = $tree->get_value_for_tag('treephyloxml');
 	    #        $c->log->debug('Family::Tree::get_tree phyloxml') if $c->debug;
        #}
        #elsif($format eq "png"){
        #   $treeData = $tree->get_value_for_tag('tree_image_png');
 	    #        $c->log->debug('Family::Tree::get_tree png') if $c->debug;
        #}
        #$c->stash->{treeData} = $treeData;
        unless ( defined $treeData )
         {
             $c->log->debug('Family::Tree::get_tree_data: failed to retrieve tree data') if $c->debug;
             $c->stash->{errorMsg} = 'We could not extract the tree data for ' . $c->stash->{acc};
             return;
         }
 
         # and now cache the populated tree data
         #$c->cache->set( $cacheKey, $treeData ) unless $ENV{NO_CACHE};
     }
 
     # stash the uncompressed tree
        $c->stash->{treeData} = $treeData;
 }

=head2 get_data : Private

Retrieves family data for the given entry. Accepts the entry ID or accession as
the first argument. Does not return any value but drops the L<ResultSet> for
the relevant row into the stash.

=cut

#sub get_data : Private
#{
    #my ( $this, $c, $entry ) = @_;

    ## check for a family
    ##my $treefam = $c->model('TreeFamDB::Family')
    ##->search( [ { stable_id => $entry},] )
    ##->single;
    #my $treefam = $c->model('TreeFamDB::GeneTreeRootTag')->search( [ { root_id => $entry }, ] )->single;

    #unless ( defined $treefam )
    #{
        #$c->log->debug("Family::get_data: no row for that accession/ID ($entry)")
            #if $c->debug;

        ## there's a status helper that fits here...
        #$this->status_not_found( $c, message => 'No valid TreeFam family accession or ID' );

        #return;
    #}

    ##use Data::Dumper;
    ##print Dumper $treefam;
    #$c->log->debug( "Family::get_data: got a family with id " . $treefam->{family_id} )
        #if $c->debug;

    ##$c->stash->{treefam}           = $treefam;
    #$c->stash->{treefam_family_id} = $treefam->root_id;
#}
=head2 get_family_sequences : Private

Retrieves summary data for the family. For most fields this is a simple look-up
on the Rfam object that we already have, but for the number of interactions
we have to do one more query.

=cut

sub get_family_sequences : Private
{
    my ( $this, $c, $entry ) = @_;
    my $treefam_family_id = $c->stash->{treefam_family_id};
    my $summaryData       = {};

    #$treefam_family_id = 1;
    $c->log->debug("looking for $treefam_family_id id\n") if $c->debug;

    #my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'treefam_admin',
    #-dbname => 'treefam_homology_67x',
    #-host   => 'web-mei-treefam',
    #-pass => $ENV{TFADMIN_PSW},
    #-port => '3365');
    #my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'treefam_admin',-dbname => 'treefam_homology_67hmm',-host   => 'web-mei-treefam',-pass => $ENV{TFADMIN_PSW},
     #-port => '3365');
} 
=head2 get_summary_data : Private

Retrieves summary data for the family. For most fields this is a simple look-up
on the Rfam object that we already have, but for the number of interactions
we have to do one more query.

=cut

sub get_summary_data : Private
{
    my ( $this, $c ) = @_;
    my $treefam_family_id = $c->stash->{treefam_family_id};
    my $summaryData       = {};

    $c->log->debug("looking for $treefam_family_id id\n") if $c->debug;
    
    # genetree adaptor
    #my $registry = 'Bio::EnsEMBL::Registry'; 
    #my $genetree_adaptor = $registry->get_adaptor('TreeFam', 'Compara', 'GeneTree');
    #$c->go('ReturnError', 'custom', ["No genetree adaptor found for TreeFam"]) unless $genetree_adaptor;
    my $genetree_adaptor = $c->stash->{'genetree_adaptor'};
    if(!$genetree_adaptor){
    $c->log->debug(dump($c->stash->{genetree_adaptor})) if $c->debug;
    }
    my $tree             = $genetree_adaptor->fetch_by_stable_id($treefam_family_id);
    if ( !defined($tree) || $tree eq '' )
    {
    	$c->log->debug('Family::Tree::get_summary Could not find tree using stable_id') if $c->debug;
     	#try with root_id
    	# here we can only use numbers, no characters
        unless($treefam_family_id =~ m/^TF/){
            $tree             = $genetree_adaptor->fetch_by_root_id($treefam_family_id);
        }
        if ( !defined($tree) || $tree eq '' ){
        	print "Could not get tree\n";
            $c->log->debug('Family::Tree::get_summary Could not get tree') if $c->debug;
            $c->stash->{errorMsg} = 'We could not find a tree for the given accession number ' . $c->stash->{acc};
            return;
		}        
    }
	$c->log->debug('Family::Tree::get_summary Got tree') if $c->debug;

    #  print Dumper $tagvalue_hashref;
    $summaryData->{numSequences}              = $tree->get_value_for_tag('numSequences');
	#$summaryData->{tree_max_branch}           = $tree->get_value_for_tag('tree_max_branch');
    #$summaryData->{tree_num_human_peps}       = $tree->get_value_for_tag('tree_num_human_peps');
    $summaryData->{tree_num_dup_nodes}        = $tree->get_value_for_tag('tree_num_dup_nodes');
    $summaryData->{tree_num_spec_nodes}        = $tree->get_value_for_tag('tree_num_spec_nodes');

    # Number of inner nodes is: number_of_leaves / 2
    $summaryData->{tree_num_internal_nodes}        = int ($summaryData->{numSequences} / 2);
    if(!($summaryData->{tree_num_internal_nodes}) || $summaryData->{tree_num_internal_nodes} eq ''){
        $summaryData->{tree_percentage_duplications}        = "NaN";
        $summaryData->{tree_percentage_speciations}        = "NaN";
    }
    else{
        # percentage of duplication nodes
        $summaryData->{tree_percentage_duplications}        = int (($summaryData->{tree_num_dup_nodes} * 100 / $summaryData->{tree_num_internal_nodes}));
        $summaryData->{tree_percentage_speciations}        = int (($summaryData->{tree_num_spec_nodes} * 100 / $summaryData->{tree_num_internal_nodes}));
    }
    #$summaryData->{aln_method}                = $tree->get_value_for_tag('aln_method');
   
   # cut percent identity
    $summaryData->{aln_percent_identity}      = $tree->get_value_for_tag('aln_percent_identity');
    $summaryData->{aln_percent_identity}      =~ s/\.\d*//g;
	$c->log->debug("Truncated value: ".$summaryData->{aln_percent_identity}." %");
    $summaryData->{percentIdentity}      = $summaryData->{aln_percent_identity};

    $summaryData->{aln_num_residues}          = $tree->get_value_for_tag('aln_num_residues');
    $summaryData->{tree_num_spec_nodes}       = $tree->get_value_for_tag('tree_num_spec_node');
    $summaryData->{aln_length}                = $tree->get_value_for_tag('aln_length');
    $c->stash->{tree}{phyloxml}             = $tree->get_value_for_tag('treenphyloxml');
    $c->stash->{sequence_array_json}          = $tree->get_value_for_tag('sequence_array_json');
	$summaryData->{numSpecies}                = $tree->get_value_for_tag('numspecies');
    $c->log->debug("numSequences is ".$summaryData->{numSequences}." species ".$summaryData->{numSpecies});   
	my $avg_seq_species = (!$summaryData->{numSequences} || !$summaryData->{numSpecies})? 1: ($summaryData->{numSequences}/ $summaryData->{numSpecies});
    if($avg_seq_species =~ /\d+\.\d+/){
        $avg_seq_species = $avg_seq_species =~ m/(\d+\.\d)/;
    }
    $summaryData->{avg_seq_per_species} = $avg_seq_species? $avg_seq_species : 'NaN';
    

	#$summaryData->{fasta_aln}                = $tree->get_value_for_tag('fasta_aln');
	#$summaryData->{"homologs_array_json"} = $tree->get_value_for_tag('homologs_array_json'); 

### data for header
    $c->stash->{treefam}{acc} = $tree->stable_id;   
    $c->stash->{treefam}{description} = $tree->get_value_for_tag('fam_description');   
    $c->stash->{treefam}{full_description} = $tree->get_value_for_tag('fam_full_description');   
    $c->stash->{treefam}{symbol} = $tree->get_value_for_tag('fam_symbol');   
    $c->stash->{treefam}{wikigene} = $tree->get_value_for_tag('wikigene');   
    $c->log->debug("wikigene is ".$c->stash->{treefam}{wikigene});   
    $c->stash->{treefam}{taxa_count} = $tree->get_value_for_tag('taxa_count');   
    $c->log->debug("TaxaCount is ".$c->stash->{treefam}{taxa_count});   
    $c->stash->{treefam}{hgnc} = $tree->get_value_for_tag('hgnc');   
    $c->log->debug("hgnc is ".$c->stash->{treefam}{hgnc});   
    
    my $pfam_string = $tree->get_value_for_tag('pfam');   
    my @pfam_array;
    foreach(split(" ", $pfam_string)){
        my %pfam_entry_hash;
        my ($id,$name,$count) = split("->",$_);
        $c->log->debug("$id,$name,$count");
        $pfam_entry_hash{'name'} = $id;
        $pfam_entry_hash{'id'} = $name;
        $pfam_entry_hash{'count'} = $count;
        push(@pfam_array,\%pfam_entry_hash);
    }
    $c->stash->{treefam}{pfam} = \@pfam_array;   
	$c->log->debug("Family::Tree::get_summary PFAMS found ".$c->stash->{treefam}{pfam}." pfams");
	
	$c->log->debug("Family::Tree::get_summary Found ".$summaryData->{numSpecies}." species");

	# Store tree
	#my $cacheKey = 'treeData' . $c->stash->{acc};
	#$c->cache->set( $cacheKey, $c->stash->{tree_info}{seed} ) unless $ENV{NO_CACHE};
	#$c->log->debug("Family::Tree::get_summary Stored tree under $cacheKey");
	
	#$cacheKey = 'alnData' . $c->stash->{acc};
	#$c->cache->set( $cacheKey, $summaryData->{fasta_aln} ) unless $ENV{NO_CACHE};
	#$c->log->debug("Family::Tree::get_summary Stored aln under $cacheKey");

	# my $treeData = $c->cache->get($cacheKey);
    
    #$summaryData->{numStructures} = 2;
    #$summaryData->{numInt}        = 0;

    $c->stash->{summaryData} = $summaryData;
    $c->stash->{numSequences} = $summaryData->{numSequences};
    $c->stash->{numSpecies} = $summaryData->{numSpecies};

    $c->stash->{treefam}->{num_full} = $summaryData->{numSequences};
    my $symbol_backup;
    my $description_backup;
    #### TEST get all entries from xrefID2Sequence table for this family
    my %pfams;
    #my $dbh = DBI->connect('dbi:mysql:treefam_homology_67hmm;host=web-mei-treefam:3365','treefam_admin',$ENV{TFADMIN_PSW}) or die "Connection Error: $DBI::errstr\n";
    my $extID2seq_sth = $genetree_adaptor->prepare('select * from xrefID2Sequence where gene_tree_stable_id= ?');
    #my $extID2seq_sth = $dbh->prepare('select * from xrefID2Sequence where gene_tree_stable_id= ?');
    $extID2seq_sth->bind_param(1,$treefam_family_id);
    $extID2seq_sth->execute() or die "SQL Error: $DBI::errstr\n";
    my %dupl_hgncs;
    while ( my ($extID,$extName,$db,$memberID,$gtID,$gtName,$description) = $extID2seq_sth->fetchrow_array() ){;
        if($db eq "HGNC"){ 
	            $c->log->debug("Family::Tree::get_summary HGNC: found ID: $extID, name: $extName ");
                if(!exists $dupl_hgncs{$extID} && $extName ne "NULL" && defined($extName) ){
                    push(@{$c->stash->{hgncs}},{"id"=>$extID,"name"=>$extName});
                }
                $symbol_backup = $extName;
                $description_backup = $description;

                $dupl_hgncs{$extID} = 1;
        }
        elsif($db eq "Wikigene"){ push(@{$c->stash->{wikigenes}},{"id"=>$extID,"name"=>"NaN"});}
        elsif($db eq "Pfam"){  
                $pfams{$extName}{count}++;
                $pfams{$extName}{id} = $extID;
            }
    }
   	$c->log->debug("Family::Tree::get_summary HGNC".$c->stash->{hgncs}) if $c->debug;
   	if(exists($c->stash->{wikigenes})){$c->log->debug("Family::Tree::get_summary WIKIGENE: ".join(",",@{$c->stash->{wikigenes}})) if $c->debug;}
    
    foreach my $pfam(keys(%pfams)){
        my $pfam_count = ($summaryData->{numSequences} != 0) ? int($pfams{$pfam}{count}*100/$summaryData->{numSequences}) : "NaN";
	push(@{$c->stash->{pfams}}, {"name"=>$pfam,"id"=>$pfams{$pfam}{id},"count"=>$pfam_count})
    }


    # make sure 
    # symbol and
    # description are set
    if($c->stash->{'treefam'}->{'symbol'} eq '' || !defined($c->stash->{'treefam'}->{'symbol'})){
       $c->stash->{'treefam'}->{'symbol'}  = $symbol_backup;
    }
    if($c->stash->{'treefam'}->{'description'} eq '' || !defined($c->stash->{'treefam'}->{'description'})){
       $c->stash->{'treefam'}->{'description'}  = $description_backup;
    }

    return 1;

}

=head2 image : Local

If we successfully generated a tree image, returns it directly as
an "image/gif". Otherwise returns a blank image.

=cut

#sub image : Chained( 'family' ) PathPart( 'tree' ) Args( 0 ) {
##sub image : Chained( 'tree' ) PathPart( 'image' ) Args( 0 ) {
  #my ( $this, $c ) = @_;

  ## cache page for 1 week
  #$c->cache_page( 604800 ); 
  #$c->log->debug( 'Family::TF101001::Tree dumping tree data to the response' ) if $c->debug;
  
  ## stash the tree object
  #$c->forward( 'get_tree_data' );

  #if ( defined $c->stash->{tree} ) {
    #$c->res->content_type( 'image/gif' );
    ##$c->res->body( $c->stash->{tree}->plot_core( 1 )->gif );
  #}
    #else {
    ## TODO this is bad. We should avoid hard-coding a path to an image here
    #$c->res->redirect( $c->uri_for( '/shared/images/blank.gif' ) ) if $c->debug;
  #}

#}

##-------------------------------------------------------------------------------

#=head2 download : Chained

#Serves the raw tree data as a downloadable file.

#=cut

#sub download : Chained( 'tree' )
               #PathPart( 'download' )
               #Args( 0 ) {
  #my ( $this, $c ) = @_;

  ## cache page for 1 week
  #$c->cache_page( 604800 ); 
  
  #$c->log->debug( 'Family::Tree::download: dumping tree data to the response' ) if $c->debug;

  ## stash the raw tree data
  #$c->forward( 'get_tree_data' );

  #return unless defined $c->stash->{treeData};

  #my $filename = $c->stash->{acc} . '_' . $c->stash->{alnType} . '.nhx';

  #$c->log->debug( "Family::Tree::download: tree filename: |$filename|" )
    #if $c->debug;

  #$c->res->content_type( 'text/plain' );
  #$c->res->header( 'Content-disposition' => "attachment; filename=$filename" );
  #$c->res->body( $c->stash->{treeData} );
#}

#=head2 getTreeData : Private

#Retrieves the raw tree data. We first check the cache and then fall back to the 
#database.

#=cut

#sub get_tree_data : Private {
  #my ( $this, $c) = @_;
	#$c->log->debug( "Getting Tree from Tree.pm" ) if $c->debug;  
    #my $tree_format = "newick";
  ## see if we can extract the pre-built tree object from cache
  #my $cacheKey = 'treeData'. $c->stash->{acc};
  #my $treeData = $c->cache->get( $cacheKey );
  #$c->log->debug( "stash has $cacheKey" ) if $c->debug;  
  #if ( defined $treeData ) {
    #$c->log->debug( 'Family::Tree::get_tree_data: extracted tree data from cache' )
      #if $c->debug;  
  #}
  #else {
        #$c->log->debug( 'Family::Tree::get_tree_data: failed to extract tree data from cache; going to DB' )
        #if $c->debug;  
   	    #my $treefam_family_id = $c->stash->{acc};
	    #$c->log->debug("looking for $treefam_family_id id\n") if $c->debug;
        #my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'treefam_admin',-dbname => 'treefam_homology_67hmm',-host   => 'web-mei-treefam',-pass => $ENV{TFADMIN_PSW},-port => '3365');
     ##my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'root',-dbname => 'treefam_homology_67x',-host   => 'localhost',-pass => '123',-port => '3306');   
        #my $genetree_adaptor = $db->get_GeneTreeAdaptor; 
        #my $tree             = $genetree_adaptor->fetch_by_stable_id($treefam_family_id);
	    #if ( !defined($tree) || $tree eq '' )
    	#{
		    #my $tree = $genetree_adaptor->fetch_by_root_id($treefam_family_id);
		    #if ( !defined($tree) ) {
        	    #print "Could not get tree\n";
            	#return $treeData;
		    #}
    	#}
        
        #$c->stash->{tree_info}{seed}             = $tree->get_value_for_tag('treenhx');
        #$c->stash->{tree}             = $tree->get_value_for_tag('treenhx');
        #$c->stash->{tree_info}{phyloxml}             = $tree->get_value_for_tag('treephyloxml');
		
        ##my $root_of_tree = $tree->root;
		#$treeData = ($tree_format eq 'phyloxml')? $tree->get_value_for_tag('treephyloxml'): $tree->get_value_for_tag('treenhx');
    
        #unless ( defined $treeData ) {
      #$c->log->debug( 'Family::Tree::get_tree_data: failed to retrieve tree data' )
        #if $c->debug;
      #$c->stash->{errorMsg} = 'We could not extract the tree data for '
                              #. $c->stash->{acc};
      #return;
    #}

    ## and now cache the populated tree data
    #$c->cache->set( $cacheKey, $treeData ) unless $ENV{NO_CACHE};
  #}

  ## stash the uncompressed tree
  #$c->stash->{treeData} = $treeData;
#}

# get sunburst json-string
=head2 get_summary_data : Private

Retrieves summary data for the family. For most fields this is a simple look-up
on the Rfam object that we already have, but for the number of interactions
we have to do one more query.

=cut
sub get_wikipedia : Private {
  my ( $this, $c ) = @_;
  #my $acc_to_use_here = "PF00134"; 
  #my $bla = $c->model('TreeFamDB::GeneTreeRootTag')->search( [ { root_id => $acc_to_use_here }, ] )->single;
 my $acc_to_use_here = $c->stash->{treefam}->{acc}; 
  $c->log->debug( 'Family::get_wikipedia: using ',$acc_to_use_here  ) if $c->debug;
  
  
  my @articles = $c->model('WebUser::ArticleMapping')->search( { accession => $acc_to_use_here },
                             { join     => [ 'wikitext' ],
                               prefetch => [ 'wikitext' ] } );

  #my @articles = $c->model('WebUser')->table('ArticleMapping')->search( { accession => $acc_to_use_here },
  #                            { join     => [ 'wikitext' ],
  #                              prefetch => [ 'wikitext' ] } );

  return unless scalar @articles;

  $c->log->debug( 'Family::get_wikipedia: found ' . scalar @articles . ' articles' ) if $c->debug;
  #my $utf8 = decode("Detect", @articles);
  $c->stash->{articles} = \@articles;
}

#sub get_genetree_object{
    #my ($db,$genetree_id) = (@_);
    #my $genetree_object = $db->get_GeneTreeAdaptor;
    #my $genetree = $genetree_object->fetch_by_stable_id($genetree_id);
    #return defined($genetree)?$genetree:undef;
#}

#sub get_member_object : Private {
    #my ($db,$source_id) = (@_);
    #my $member_object = $db->get_MemberAdaptor;
    #my $member = $member_object->fetch_by_source_stable_id(undef,$source_id);
    #return defined($member)?$member:undef;
#}
#sub get_homology_relation_for_gene_pair : Private {
    #my ($db,$source_member_object, $source_member2_object) = (@_);
    #my ($memberID1,$memberID2) = ($source_member_object->dbID, $source_member2_object->dbID);
    ## the api requires member ids (int) rather than member objects
    #my $homology_adaptor = $db->get_HomologyAdaptor;
    #my $homologies = $homology_adaptor->fetch_by_Member_id_Member_id($memberID1,$memberID2);
    #return defined($homologies)?$homologies:undef
#}

#sub get_all_species_for_family{
    #my ($db,$genetree_id) = (@_);
    #my %have_species;
    #my @all_species;
    #my $gt = &get_genetree_object($db,$genetree_id);
    #if(!$gt){return undef;}
    #my $all_members = ($gt->root)->get_all_leaves();
    #foreach my $member(@{$all_members}){
    #my $species_name = $member->taxon->name;
        #push(@all_species, $species_name)  if !exists $have_species{$species_name};
        #$have_species{$species_name} = 1;
    #}

    #return scalar(@all_species)?\@all_species:undef;
#}
#
__PACKAGE__->meta->make_immutable;

1;

