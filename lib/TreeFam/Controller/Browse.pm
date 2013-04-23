
# Browse.pm
# jt6 20080314 WTSI
#
# $Id: Browse.pm,v 1.3 2009-01-06 11:51:13 jt6 Exp $

=head1 NAME

RfamWeb::Controller::Browse - controller to build the "browse" pages

=cut

package TreeFam::Controller::Browse;

=head1 DESCRIPTION

Retrieves the data for the various "browse" pages.

Generates a B<full page>.

$Id: Browse.pm,v 1.3 2009-01-06 11:51:13 jt6 Exp $

=cut

use strict;
use warnings;

use Data::Dump qw( dump );
use JSON;
use base 'Catalyst::Controller';

#-------------------------------------------------------------------------------

=head1 METHODS

=head2 begin : Private

Caches the page and notifies the navbar of the location.

=cut

sub begin : Private {
  my( $this, $c ) = @_;

 #  stash the parameters, after checking that they're valid
  ( $c->stash->{$_} ) = $c->req->param($_) || '' =~ m/^(\w)$/
    for qw( to from top20 numbers );

  # set the page to be cached for one week
  #$c->cache_page( 604800 );

  # tell the navbar where we are
  $c->stash->{nav} = 'browse';
}

#-------------------------------------------------------------------------------

=head2 browse : Global

Show an index page for the various "browse" pages.

=cut

sub browse : Global {
  my ( $this, $c ) = @_;
  
  #my $reg = $c->model('Registry');
  my $reg = 'Bio::EnsEMBL::Registry'; 
  my $compara_name = $c->request()->param('compara') || 'TreeFam';
  
  #try {
            #my $ma = $reg->get_adaptor($compara_name, 'compara', 'member');
            #$c->go('ReturnError', 'custom', ["No member adaptor found for $compara_name"]) unless $ma;
            #$c->stash(member_adaptor => $ma);
          
            my $gd = $reg->get_adaptor($compara_name, 'compara', 'GenomeDB');
            $c->go('ReturnError', 'custom', ["No homology adaptor found for $compara_name"]) unless $gd;
            $c->stash->{'genomedb_adaptor'} = $gd;
            
            my $ncbi = $reg->get_adaptor($compara_name, 'compara', 'NCBITaxon');
            $c->go('ReturnError', 'custom', ["No genetree adaptor found for $compara_name"]) unless $ncbi;
            $c->stash->{'ncbi_adaptor'} = $ncbi;
            #}
  #catch {
            #$c->go('ReturnError', 'from_ensembl', [$_]);
  #}; 
  # copy the kingdoms list into the stash so that we can use them to build the
  #$c->forward( 'browse_genomes_list' );
  $c->stash->{pageType} = 'browse';
  $c->stash->{template} = 'pages/layout.tt';
}

##-------------------------------------------------------------------------------
##- genomes ---------------------------------------------------------------------
##-------------------------------------------------------------------------------

=head2 browse_genomes : Chained PathPart CaptureArgs

Retrieves the list of genomes from the DB and stashes them for the template.

=cut

sub browse_genomes : Chained( '/' )
                     PathPart( 'genome' )
                     CaptureArgs( 0 ) {
  my ( $this, $c ) = @_;

  $c->log->debug( 'Browse::browse_genomes: building a list of genomes' )
    if $c->debug;
    
  $c->stash->{template} = 'pages/browse/genomes.tt';
}

#-------------------------------------------------------------------------------

=head2 browse_genomes_list : Chained PathPart Args

Retrieves the full list of genomes from the DB and stashes them for the 
template.

=cut

sub browse_genomes_list : Chained( 'browse_genomes' )
                          PathPart( 'browse' )
                          Args( 0 ) {
  my ( $this, $c ) = @_;

  $c->log->debug( 'Browse::browse_genome_list: building full list of genomes' )
    if $c->debug;



my $genome_db_adaptor = $c->stash->{genomedb_adaptor};
my $ncbi_adaptor = $c->stash->{ncbitaxon_adaptor};
#my $genome_db_adaptor = $db->get_GenomeDBAdaptor;
#my $ncbi_adaptor = $db->get_NCBITaxonAdaptor;

my @all_genome_dbs = @{$genome_db_adaptor->fetch_all()};

my @array_of_arrays;
   # get data in array format
    foreach my $genome(@all_genome_dbs){
        my @tmp_array;
		my $species_name = $genome->name;
        #my $species_image_file = "http://localhost:3000/static/images/species_pictures/species_files/thumb_".$species_name.".png";
        #my $species_image_file = "../static/images/species_pictures/species_files/thumb_".$species_name.".png";
		$species_name = ucfirst($species_name);
        my $species_image_file = "../static/images/species_pictures/species_files/thumb_".$species_name.".png";
        $species_name =~ tr/_/ /;
		push(@tmp_array, "<img src=\"$species_image_file\" /> ".$species_name);
        
        push(@tmp_array,$genome->taxon_id );
        my $classification = ($genome->taxon)->classification;
        my $new_classification = join(" ",( reverse(split(" ",$classification))));
        push(@tmp_array,$new_classification);
        #$c->log->debug( "Found line:  ".join(",",@tmp_array)."  members" ) if $c->debug;
        push(@array_of_arrays,\@tmp_array);
    }
    $c->stash->{genomes_array_json} =  encode_json \@array_of_arrays;


  # stash the results for the template
  #$c->stash->{genomes} = \$all_genome_dbs if scalar $all_genome_dbs;
}

#-------------------------------------------------------------------------------
#- families --------------------------------------------------------------------
#-------------------------------------------------------------------------------

=head2 browse_families : Chained PathPart CaptureArgs

Start of a chain for building the "browse families" pages.

=cut

#sub browse_families : Chained( '/' )
                      #PathPart( 'family' )
                      #CaptureArgs( 0 ) {
  #my ( $this, $c ) = @_;
  
  #$c->log->debug( 'Browse::browse_families: building a list of families' )
    #if $c->debug;
#}

#-------------------------------------------------------------------------------

=head2 browse_all_families : Chained PathPart Args

Build a page showing the list of all Rfam families. End of a dispatch chain.

=cut

#sub browse_all_families : Chained( 'browse_families' )
                          #PathPart( 'browse' )
                          #Args( 0 ) {
  #my ( $this, $c ) = @_;

  #$c->log->debug( 'Browse::browse_all_families: showing all families' )
      #if $c->debug;
## 	return;
  ## we need the "active_letters" data structure
  #$c->forward( 'build_active_letters' );
  #my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'root',-dbname => 'treefam_homology_67hmm', -host   => 'localhost',-pass => '123', -port => '3306');
##    my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'treefam_admin',-dbname => 'treefam_homology_67x', -host   => 'web-mei-treefam',-pass => $ENV{TFADMIN_PSW}, -port => '3365');
    #my $genetree_adaptor = $db->get_GeneTreeAdaptor;
    #my $all_trees = $genetree_adaptor->fetch_all();
    #$c->log->debug( 'Browse::browse_all_families: got |' . scalar @$all_trees
                  #. '| families' ) if $c->debug;
     #my @array_of_arrays;
   ## get data in array format
    #foreach my $tree(@$all_trees){
        #my @tmp_array;
        #push(@tmp_array,$tree->stable_id );
		#my $tagvalue_hashref = $tree->get_tagvalue_hash();
        #if(!keys(%$tagvalue_hashref)){
		
			#push(@tmp_array,$tagvalue_hashref->{gene_count} );
			#push(@tmp_array,$tagvalue_hashref->{aln_length} );
			#push(@tmp_array,$tagvalue_hashref->{aln_percent_identity} );
		#}
		#my $orthology_type_hashref ;
	    #eval "\$orthology_type_hashref = $tagvalue_hashref->{orthotree_types_hashstr}";
    	
    	#push(@tmp_array,$orthology_type_hashref->{ortholog_one2one} );
    	#push(@tmp_array,$orthology_type_hashref->{within_species_paralog} );
        ##$c->log->debug( "Found line:  ".join(",",@tmp_array)."  members" ) if $c->debug;
        #push(@array_of_arrays,\@tmp_array);
    #}
    
    #$c->stash->{families_array_json} =  encode_json \@array_of_arrays;
    ## my %gt_names;
    ##   foreach my $gt(@$all_trees){
    ##            my $tagvalue_hashref = $gt->get_tagvalue_hash();
    ##             if(!keys(%$tagvalue_hashref)){
    ##                      die "Could not get tagvalue_hashref for tree\n";
    ##                   }
    ##                    $gt_names{$tagvalue_hashref->{name}} = 1 if(exists $tagvalue_hashref->{name});
    ##    }
            

  #print "\tsearched for something\n";
  #$c->log->debug( 'Browse::browse_all_families: got |' . scalar @$all_trees
                  #. '| families' ) if $c->debug;

  #$c->stash->{all}      = 1;
  #$c->stash->{families} = $all_trees;
  ##$c->stash->{template} = 'pages/browse/all_families.tt';
#}


#-------------------------------------------------------------------------------
##- private actions -------------------------------------------------------------
##-------------------------------------------------------------------------------
#
#=head2 build_active_letters : Private
#
#Builds a data structure that can be used for building the lists of first-letters
#in the various browse pages.
#
#=cut

#sub build_active_letters : Private {
  #my ( $this, $c ) = @_;
  
  #my $cache_key = 'browse_active_letters_hash';
  #my $active_letters = $c->cache->get( $cache_key );
  #my $family_sizes = $c->cache->get( $cache_key );
  
	#my %range_hash = (
	#"very small" => {'min' => 0,'max' => 10},
	#"small" => {'min' => 10,'max' => 30},
	#"normal" => {'min' => 30,'max' => 100},
	#"big" => {'min' => 100,'max' => 300},
	#"very big" => {'min' => 300,'max' => 10000000},
	#);
   
  ## very small = < 10
##  small = 10 - 30
## normal = 30 - 10
## big = 100 - 200
## very big = > 200
  
  
  #if ( defined $active_letters ) {
    #$c->log->debug( 'Browse::build_active_letters: retrieved active letters list from cache' )
      #if $c->debug;
  #}
  #else {
    #$c->log->debug( 'Browse::build_active_letters: failed to retrieve active letters list from cache; going to DB' )
      #if $c->debug;

    ##----------------------------------------
   ##my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'treefam_admin',-dbname => 'treefam_homology_67x', -host   => 'web-mei-treefam',-pass => $ENV{TFADMIN_PSW}, -port => '3365');
   #my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'root',-dbname => 'treefam_homology_67x', -host   => 'localhost',-pass => '123', -port => '3306');


#my $genome_db_adaptor = $db->get_GenomeDBAdaptor;
#my $genetree_adaptor = $db->get_GeneTreeAdaptor;

#my $ncbi_adaptor = $db->get_NCBITaxonAdaptor;
    ## get a list of all families and join to pdb_rfam_reg, so that we can find
    ## those families for which there's a 3-D structure
    ##my @families = $c->model( 'TreeFamDB::Family' )
    ##                 ->search( {},
    ##                           );#{ prefetch => [ 'pdb_rfam_regs' ] } );
    ##                          
   ## my @families = $c->model('TreeFamDB::Family')->search( {},);
   ## 								#{ prefetch => [ 'pdb_rfam_regs' ] } );
                              
   ##      $c->log->debug( "Found ".scalar(@families)." families" ) if $c->debug;                     
    #my $first_letter;
    #my @all_trees = @{$genetree_adaptor->fetch_all()};
   #my $take_a_few_tree_only = 5; 
    ##foreach my $family ( @families ) {
    #foreach my $family ( @all_trees ) {
        #my $tagvalue_hashref = $family->get_tagvalue_hash();
        #next if(not exists $tagvalue_hashref->{name});
    ##use Data::Dumper;
      #$first_letter = uc( substr( $tagvalue_hashref->{name}, 0, 1 ) );
      #$first_letter = '0 - 9' if $first_letter =~ m/^\d+$/;
      #$active_letters->{families}->{$first_letter} = 1;
      
      ##my $number = $family->n_seed;
      #my $number = '143';
      #$family_sizes->{families}->{$tagvalue_hashref->{gene_count}} = 1;
       #last if $take_a_few_tree_only-- ==0;
      #}
    #$family_sizes = scalar(@all_trees);
    ##----------------------------------------

##    # clans
##    my @clans = $c->model('RfamDB::Clans')
##                  ->search();
##
##    foreach my $clan ( @clans ) {
##      $first_letter = uc( substr( $clan->clan_id, 0, 1 ) );
##      $first_letter = '0 - 9' if $first_letter =~ m/^\d+$/;
##      $active_letters->{clans}->{$first_letter} = 1;
##    }

    ##----------------------------------------

##    # genomes
#$genome_db_adaptor = $db->get_GenomeDBAdaptor;
#my @all_genome_dbs = @{$genome_db_adaptor->fetch_all()};
#foreach my $genome_db ( @all_genome_dbs) {
      #$first_letter = uc( substr( $genome_db->name, 0, 1 ) );
      #$first_letter = '0 - 9' if $first_letter =~ m/^\d+$/;
      #$active_letters->{genomes}->{$first_letter} = 1;
#}

    ##----------------------------------------

##    # articles
##    my $articles_cache_key = 'article_mapping';
##    my $article_mapping_and_letters = $c->cache->get( $articles_cache_key );
##    if ( defined $article_mapping_and_letters ) {
##      $c->log->debug( 'Browse::build_active_letters: retrieved article mapping from cache' )
##        if $c->debug;
##    }
##    else {
##      $c->log->debug( 'Browse::build_active_letters: failed to retrieve article mapping from cache; going to DB' )
##        if $c->debug;
##      $article_mapping_and_letters = $c->forward('build_articles_list');
##      $c->cache->set( $articles_cache_key, $article_mapping_and_letters ) unless $ENV{NO_CACHE};
##    }
##
##    $active_letters->{articles} = $article_mapping_and_letters->{active_letters};
##    $c->stash->{articles}       = $article_mapping_and_letters->{mapping};

    ##----------------------------------------
    
    #$c->cache->set( $cache_key, $active_letters ) unless $ENV{NO_CACHE};
  #}

  #$c->stash->{active_letters} = $active_letters;
  #$c->stash->{family_sizes} = $family_sizes;
#}




=head2 browse_genomes : Chained PathPart CaptureArgs

Retrieves the list of genomes from the DB and stashes them for the template.

=cut

# matches /family/tree/3
sub get_species_tree : Private {
    my ( $this, $c ) = @_;

    $c->log->debug( "trying to get data for species tree" ) if $c->debug;
	my $phyloxmlspeciesfile = "/Users/fs9/bioinformatics/current_projects/treefam9/TreeFamPipeline/testing_area/trees/treefam9_spec.phyloxml";
	my $content_of_file = `cat $phyloxmlspeciesfile`;

    $c->log->debug('Browse::SpeciesTree rendering tree') if $c->debug;

    #my $filename = '';
    #$c->res->content_type('text/plain');

    #$c->res->header('Content-disposition' => "attachment; filename=$filename" );
    #$c->res->body( $content_of_file );
    $c->stash->{'speciesTreePhyloXML'} = $content_of_file;
	return 1;
}
#-------------------------------------------------------------------------------

=head1 AUTHOR

John Tate, C<jt6@sanger.ac.uk>

Paul Gardner, C<pg5@sanger.ac.uk>

Jennifer Daub, C<jd7@sanger.ac.uk>

=head1 COPYRIGHT

Copyright (c) 2007: Genome Research Ltd.

Authors: John Tate (jt6@sanger.ac.uk), Paul Gardner (pg5@sanger.ac.uk), 
         Jennifer Daub (jd7@sanger.ac.uk)

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
