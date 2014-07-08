
# Family.pm
# jt6 20080306 WTSI
#
# $Id: Family.pm,v 1.6 2009-01-06 11:52:06 jt6 Exp $

=head1 NAME

TreeFam::Controller::Family - controller to build the main Rfam family page

=cut

package TreeFam::Controller::Tree;

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
sub get_adaptors : Private 
{
  my ($self, $c) = @_;
  
  #my $reg = $c->model('Registry');
  my $reg = 'Bio::EnsEMBL::Registry'; 
  my $compara_name = $c->request()->param('compara') || "TreeFam";
  
  #try {
            my $ma = $reg->get_adaptor($compara_name, 'compara', 'member');
            #$c->go('ReturnError', 'custom', ["No member adaptor found for $compara_name"]) unless $ma;
            $c->stash(member_adaptor => $ma);
          
            my $ha = $reg->get_adaptor($compara_name, 'compara', 'homology');
            #$c->go('ReturnError', 'custom', ["No homology adaptor found for $compara_name"]) unless $ha;
            $c->stash(homology_adaptor => $ha);
            
            my $gt = $reg->get_adaptor($compara_name, 'compara', 'GeneTree');
            #$c->go('ReturnError', 'custom', ["No genetree adaptor found for $compara_name"]) unless $gt;
            #$c->stash(genetree_adaptor => $gt);
            $c->stash->{'genetree_adaptor'} = $gt;
            #$c->log->debug("here is what we saved\n");
            #$c->log->debug(dump($c->stash->{'genetree_adaptor'}));
            #$c->log->debug(dump($gt));
            #$c->log->debug("done\n");
            #}
  #catch {
            #$c->go('ReturnError', 'from_ensembl', [$_]);
  #}; 

}



# /family/../
sub family_check : Chained( '/' ) PathPart( 'viewtree' ) Args(1)
{
    my ( $this, $c, $to_search ) = @_;
    $c->log->debug("family : Chained( '/' ) PathPart( 'family' )\n") if $c->debug;
    $c->stash->{acc} = $to_search;
    $c->stash->{highlight_gene} = "";
    $c->stash->{numSequences} = "100";
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
    $c->forward('get_adaptors');

    $to_search = TreeFam::SearchHelper::check_valid_family({member_adaptor => $c->stash->{'member_adaptor'}, "genetree_adaptor" => $c->stash->{'genetree_adaptor'},"to_search" => $to_search}); 
    $c->log->debug("mapped ID is $to_search \n");
    $c->stash->{template} = "pages/search/tree/lookup.tt";
   
    if(!$to_search ){
	$c->log->debug("no valid TreeFam accession number");
        #$c->stash->{errorMsg} = "Invalid TreeFam accession number specified";
        $c->stash->{errorMsg} = "Sorry, we couldn't find a tree for id: ".$c->stash->{acc}." in TreeFam";
	#$c->stash->{template} = "pages/error.tt";
	#return;
    }
	else{
    	$c->log->debug("found something $to_search \n");
	# need to get number of sequences
    	my $tree             = $c->stash->{'genetree_adaptor'}->fetch_by_stable_id($to_search);
    	$c->stash->{numSequences}              = $tree->get_value_for_tag('numSequences');
	$c->stash->{json_tree_string}= $tree->get_value_for_tag('json_tree');
	$c->stash->{numSpecies}                = $tree->get_value_for_tag('numspecies');
    	$c->stash->{aln_percent_identity}      = $tree->get_value_for_tag('aln_percent_identity');
    	$c->stash->{aln_percent_identity}      =~ s/\.\d*//g;
    	$c->stash->{percentIdentity}      = $c->stash->{aln_percent_identity};
    	$c->stash->{aln_length}                = $tree->get_value_for_tag('aln_length');
    	$c->stash->{description} = $tree->get_value_for_tag('fam_description');   
    	$c->stash->{symbol} = $tree->get_value_for_tag('fam_symbol');   
    	$c->stash->{treefam_acc} = $tree->stable_id;   
	

	# If TF101001 ne BRCA2
    		if($to_search ne $c->stash->{acc}){
       		#	$c->res->redirect( $c->uri_for( '/family', $to_search) );    
			$c->stash->{highligt_gene} = $c->stash->{acc};
			$c->stash->{acc} = $to_search;
		}
	}

}
__PACKAGE__->meta->make_immutable;

1;

