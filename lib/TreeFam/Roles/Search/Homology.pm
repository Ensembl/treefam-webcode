
# Homology.pm
# jt6 20060807 WTSI
#
# $Id: Keyword.pm,v 1.3 2009-02-11 10:51:50 jt6 Exp $

=head1 NAME

RfamWeb::Controller::Search::Keyword - a keyword search engine for the site

=cut

package TreeFam::Roles::Search::Homology;

=head1 DESCRIPTION

This controller reads a list of search plugins from the application
configuration and forwards to each of them in turn, collects the
results and hands off to a template to format them as a results page.

$Id: Homology.pm,v 1.3 2009-02-11 10:51:50 jt6 Exp $

=cut

use MooseX::MethodAttributes::Role;
use Data::Dump qw( dump );
use JSON;
use strict;
use warnings;
use JSON;

## Use TreeFam helpers
use TreeFam::HomologyHelper;
use TreeFam::SearchHelper;

#require "/nfs/users/nfs_f/fs9/bin/perl_modules/ensembl_main/treefam/modules/TreeFam/HomologyHelper.pm";
#require "/nfs/users/nfs_f/fs9/bin/perl_modules/ensembl_main/treefam/modules/TreeFam/SearchHelper.pm";

#-------------------------------------------------------------------------------

=head1 METHODS

=cut
# checks /search/homologyType/ENSAMEP00000009417/ENSACAP00000010148
sub get_homolog4gene : Chained( 'search' ) PathPart( 'homologs4gene' ) Args(2){
    my ( $this, $c, $source_id,$type ) = @_;
    my $source_member_object;
    my $tf_family = "NaN";
    my $homology_type = "";
    $c->log->debug("in homologs4gene with $source_id and $type") if $c->debug;
    #$c->log->debug("perl path is @INC") if $c->debug;
    my ($homology_data,$sequence_data);
    my $member_adaptor = $c->stash->{'member_adaptor'};
    my $homology_adaptor = $c->stash->{'homology_adaptor'};
    my $genetree_adaptor = $c->stash->{'genetree_adaptor'};

    # we need to get the gene member rather than 
    $c->log->debug("homologs for gene\n") if $c->debug;
    $source_member_object = TreeFam::HomologyHelper::get_member_object({"member_adaptor" => $member_adaptor,"to_search" => $source_id});
    if(!$source_member_object){
        $c->log->debug("\tsearching in ext references with $source_id  ...") if $c->debug;
        $source_member_object = TreeFam::HomologyHelper::get_member_by_xref({ "db_adaptor" => $member_adaptor, "to_search" => $source_id});
    }
    if($source_member_object->gene_member()){
        $source_member_object    = $source_member_object->gene_member();
        $c->log->debug("switched to gene member\n") if $c->debug;
    }
    $c->log->debug("Checking existence\n") if $c->debug;
    TreeFam::HomologyHelper::check_existence($source_member_object, "member"); 

    my $homologies = TreeFam::HomologyHelper::get_homologs_for_gene({"homology_adaptor" => $homology_adaptor, "genetree_adaptor" => $genetree_adaptor, "source_object" => $source_member_object, "type" =>  $type, "homology_type" => $homology_type});
    if(!$homologies || !scalar(@$homologies)){
        $c->error("No results found");
    }
    else{
       $homology_data = encode_json $homologies;
    }
        $c->res->content_type('application/json');
     
     $c->res->body( $homology_data);

}

sub get_pairwise_homologs : Chained( 'search' ) PathPart( 'pairwiseHomologs' ) Args(){
    my ( $this, $c, $query1,$query2 ) = @_;
  	my $speciesA = $c->request()->param('first_genome');
  	my $speciesB = $c->request()->param('second_genome');
	$speciesA =~ s/ /_/g;
	$speciesB =~ s/ /_/g;
    	#$c->forward('get_adaptors');
    	#my $genomedb_adaptor = $c->stash->{'genomedb_adaptor'};
  	my $reg = 'Bio::EnsEMBL::Registry'; 
  	my $compara_name = $c->request()->param('compara');
        my $genomedb_adaptor = $reg->get_adaptor("TreeFam", 'compara', 'GenomeDB');
    	#$c->log->debug("in pairwise with $speciesA and $speciesB with adaptor: ".$genomedb_adaptor);
	# retrieve data:
	my $pairwise_zipped_data = TreeFam::HomologyHelper::get_pairwise_homologs({"speciesA" => $speciesA, "speciesB" => $speciesB, "genomedb_adaptor" => $genomedb_adaptor});
 
        my $filename = "$speciesA-$speciesB.txt.gz";
        $c->res->content_type('applicaton/x-gzip');
        $c->res->header('Content-disposition' => "attachment; filename=$filename" );
        $c->res->body( $pairwise_zipped_data );

}
# checks /search/homologyType/ENSAMEP00000009417/ENSACAP00000010148
sub get_homologyType : Chained( 'search' ) PathPart( 'homologyType' ) Args(2){
    my ( $this, $c, $query1,$query2 ) = @_;
    $c->log->debug("in homologytype with $query1 and $query2");
    my $data = "some results back from server";
    if(!$query1 || $query2){
        $data = "Sorry, could not find the provided IDs in our db";
    }
     
    my $switch = "homology_relation_for_pair";
    my $member_adaptor = $c->stash->{'member_adaptor'};
    my $homology_adaptor = $c->stash->{'homology_adaptor'};
    my $genetree_adaptor = $c->stash->{'genetree_adaptor'};
    my $source_id = $query1;
    my $source_id2 = $query2;
    my $source_member2_object;
    my $source_member_object = TreeFam::HomologyHelper::get_member_object({"member_adaptor" => $member_adaptor,"to_search" => $source_id});

    if(!$source_member_object){ 
            $c->error( "Could not find first ID in db");
    }
    print "Found member: ".$source_member_object->taxon_id."\n";
    if($source_id2){
        $source_member2_object = TreeFam::HomologyHelper::get_member_object({"member_adaptor" => $member_adaptor,"to_search" => $source_id2});
        if(!$source_member2_object){ 
            $c->error( "Could not find second ID in db");
        }
        print "Found second member: ".$source_member2_object->taxon_id."\n";
    }

    if($switch eq "homology_relation_for_pair"){
    my $homologies = TreeFam::HomologyHelper::get_homology_relation_for_gene_pair({"homology_adaptor" => $homology_adaptor,"genetree_adaptor" => $genetree_adaptor,"source_object" => $source_member_object, "source_object2" => $source_member2_object});
        if(!$homologies){
            $data =     "did not find a relationship for gene pair\n";
            $c->error("No results found");
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

sub get_adaptors
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
            
            my $gd = $reg->get_adaptor($compara_name, 'compara', 'GenomeDB');
            $c->go('ReturnError', 'custom', ["No genomedb adaptor found for $compara_name"]) unless $gd;
            #$c->stash(genetree_adaptor => $gt);
            $c->stash->{'genomedb_adaptor'} = $gd;
            $c->log->debug("here is what we saved\n");
            #$c->log->debug(dump($c->stash->{'genetree_adaptor'}));
            #$c->log->debug(dump($gt));
            $c->log->debug("done\n");
            }
  catch {
            $c->go('ReturnError', 'from_ensembl', [$_]);
  }; 

}


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
