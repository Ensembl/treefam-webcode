
# Sequence.pm
# jt6 20081205 WTSI
#
# $Id: Sequence.pm,v 1.2 2009-01-06 11:52:29 jt6 Exp $

=head1 NAME

RfamWeb::Controller::Sequence- controller to build the page for a sequence

=cut

package TreeFam::Controller::Genome;

=head1 DESCRIPTION

This is intended to be the base class for everything related to Rfam
sequences.

$Id: Sequence.pm,v 1.2 2009-01-06 11:52:29 jt6 Exp $

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
use Bio::AlignIO;
use namespace::autoclean;
use TreeFam::SearchHelper;
#use treefam::nhx_plot;

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
                                'application/json' => 'JSON',
                              }
                   );
#-------------------------------------------------------------------------------

=head1 METHODS
=head2 begin : Private

Tries to extract an NCBI taxonomy ID from the parameters and retrieves the 
details of the proteome with that tax ID.


=cut

#sub proteome_page : Chained( 'proteome' ) PathPart( '' ) Args( 0 )
#{
    #my ( $this, $c, $entry_arg ) = @_;
    #$c->log->debug("proteome : Chained( 'proteome' ) PathPart( '' )\n") if $c->debug;

#}

sub get_adaptors : Chained( '/' ) PathPart( 'genome' ) CaptureArgs(0)
{
  my ($self, $c) = @_;
  
  #my $reg = $c->model('Registry');
  my $reg = 'Bio::EnsEMBL::Registry'; 
  my $compara_name = $c->request()->param('compara');
  
  try {
            #my $ma = $reg->get_adaptor($compara_name, 'compara', 'member');
            #$c->go('ReturnError', 'custom', ["No member adaptor found for $compara_name"]) unless $ma;
            #$c->stash(member_adaptor => $ma);
          
            my $ncbi = $reg->get_adaptor($compara_name, 'compara', 'NCBITaxon');
            $c->go('ReturnError', 'custom', ["No ncbi adaptor found for $compara_name"]) unless $ncbi;
            $c->stash->{'ncbi_adaptor'} = $ncbi;
            
            my $gdb = $reg->get_adaptor($compara_name, 'compara', 'GenomeDB');
            $c->go('ReturnError', 'custom', ["No genomedb adaptor found for $compara_name"]) unless $gdb;
            $c->stash->{'genomedb_adaptor'} = $gdb;
            
            my $mb = $reg->get_adaptor($compara_name, 'compara', 'Member');
            $c->go('ReturnError', 'custom', ["No member adaptor found for $compara_name"]) unless $mb;
            $c->stash->{'member_adaptor'} = $mb;
        }
  catch {
            $c->go('ReturnError', 'from_ensembl', [$_]);
  }; 

}
# matches /proteome/3
sub genome : Chained( '/' ) PathPart( 'genome' ) Args( 1 )
{

    my ( $this, $c, $entry_arg ) = @_;
    $c->log->debug("proteome : Chained( '/' ) PathPart( 'genome' )\n") if $c->debug;
    my $tainted_entry = $c->stash->{param_entry} || $entry_arg || '';

    #$c->log->debug( $c->stash->action ) if $c->debug;
    #$c->log->debug("Family::family: tainted_entry: |$tainted_entry|") if $c->debug;
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
    $c->stash->{'acc'} = $entry;
    $c->stash->{'entry'} = $entry;
    $c->stash->{'treefam'}->{acc} = $entry;
	$c->stash->{treefam_family_id} = $entry;
    # retrieve data for the family
    #$c->log->debug("retrieve data for the family for $entry\n") if $c->debug;
    
	$c->forward( 'get_data'  ) if defined $entry;
	$c->log->debug("back from retrieving data. ncbi_id is ".$c->stash->{ncbi_id}."\n") if $c->debug;
	
	$c->forward( 'get_genomes_list', [$entry] ) if defined $entry;
	$c->forward( 'get_wikipedia_link', [$entry] ) if defined $entry;
	#$c->log->debug("back from retrieving data\n") if $c->debug;

    #$c->forward( 'get_family_sequences', [ $entry ] ) if defined $entry;
    
	#$c->log->debug("Reading sunburst data\n") if $c->debug;
	#$c->forward('get_sunburst_data', [$entry]);
	
	# Wikipedia content
	#$c->log->debug('Family::family_page: Retrieving wikipedia content') if $c->debug;
   	#$c->forward('get_wikipedia');
   	

    $c->log->debug('Family::family_page: adding summary info') if $c->debug;
    # Get Summary data
	#$c->forward('get_summary_data');
    if(! exists ($c->stash->{summaryData})){
    
    }   	
	$c->stash->{pageType} = 'genome';
    $c->stash->{template} = 'pages/layout.tt';
}

#-------------------------------------------------------------------------------
#- exposed actions -------------------------------------------------------------
#-------------------------------------------------------------------------------

=head2 stats : Local

Builds a table showing the domain composition of the proteome. Intended to be 
called via AJAX and builds a page B<fragment>.

=cut

sub stats : Local {
  my( $this, $c ) = @_;
  
  $c->stash->{template} = 'components/blocks/proteome/statsTable.tt';  
}

#-------------------------------------------------------------------------------

=head2 graphics : Local

Generates domain graphics for each of the sequences containing the specified
Pfam-A domain.

=cut

sub graphics : Local {
  my( $this, $c ) = @_;
  
  $c->stash->{template} = 'components/blocks/proteome/graphicsTool.tt';
}

#-------------------------------------------------------------------------------
#- private actions -------------------------------------------------------------
#-------------------------------------------------------------------------------

=head2 get_data : Private

Retrieve data for this proteome.

=cut

sub get_data : Private {
  my ( $this,$c ) = @_;
  my $entry = $c->stash->{'entry'}; 
  $c->log->debug("dumping entry $entry" ) if $c->debug;
  $c->log->debug(dump($entry) ) if $c->debug;
  $c->forward('get_adaptors');
  my $genomedb_adaptor = $c->stash->{'genomedb_adaptor'};
  my $member_adaptor = $c->stash->{'member_adaptor'};
	if(!$member_adaptor){
    		$c->stash->{errorMsg} = 'Could not connect to database!';
		return;
	}
  #my $found_genome = $genomedb_adaptor->fetch_by_taxon_id($entry);
  my $found_genome = $genomedb_adaptor->fetch_by_dbID($entry);
  
  unless ( defined $found_genome ) {
    $c->stash->{errorMsg} = 'No valid NCBI taxonomy ID found';
    return;
  }
  $c->stash->{taxId} = $found_genome->taxon_id;
  $c->log->debug( 'Proteome::get_data: got a proteome entry' ) if $c->debug;
  my %proteomeSpecies;
  my $taxonomy = ($found_genome->taxon)->classification;
  my @correct_taxonomy;
  foreach(split(" ",$taxonomy)){
    unshift(@correct_taxonomy, $_);
  }
  $taxonomy = join(";",@correct_taxonomy);
  
  $proteomeSpecies{ncbi_taxid}{taxonomy} =  $taxonomy;
  my  $species_name = ucfirst($found_genome->name);
        $species_name =~ tr/_/ /;
  $proteomeSpecies{species} =  $species_name;
  $proteomeSpecies{ncbi_taxid}{ncbi_taxid} =  $found_genome->taxon_id;
  my $sp_gene_count = $member_adaptor->generic_count('source_name = "ENSEMBLPEP" AND genome_db_id = '.($found_genome->dbID));
  $proteomeSpecies{total_genome_proteins} = $sp_gene_count; 
  $proteomeSpecies{num_total_regions} =  "NaN";
  $proteomeSpecies{sequence_coverage} =  "NaN";
  $proteomeSpecies{residue_coverage} = "NaN";
    
  $c->stash->{ncbi_id} = $found_genome->taxon_id;
  $c->stash->{proteomeSpecies} = \%proteomeSpecies;
  $c->log->debug("Family::family: entry: %proteomeSpecies") if $c->debug;
  $c->log->debug("Found taxonomy: ".$proteomeSpecies{ncbi_taxid}{taxonomy}."") if $c->debug;
  
 
  
}
sub get_wikipedia_link : Private {
  my ( $this, $c ) = @_;
  my $to_search = $c->stash->{ncbi_id}; 

  $c->log->debug( 'getting wikipedia entry for '.$to_search.'' ) if $c->debug;
    $c->forward('get_adaptors');
    my $genome_db_adaptor = $c->stash->{'genomedb_adaptor'};
    my $wikipedia_id = TreeFam::SearchHelper::get_wikipedia4species({"db_adaptor" => $genome_db_adaptor, "to_search" => $to_search});
    $c->log->debug( 'got wikipedia id '.$wikipedia_id.' --> good' ) if $c->debug;
    if($wikipedia_id =~ /^\d+$/){
	$c->stash->{wikipedia_id} =  "http://en.wikipedia.org/wiki/index.html?curid=".$wikipedia_id;
    }
    else{
	$c->stash->{wikipedia_id} =  $wikipedia_id;
    }
    	$c->log->debug( 'got wikipedia id '.$c->stash->{wikipedia_id}.' --> good' ) if $c->debug;

}
sub get_genomes_list : Private {
  my ( $this, $c ) = @_;

  $c->log->debug( 'Browse::browse_genome_list: building full list of genomes' ) if $c->debug;
    $c->forward('get_adaptors');
    my $genome_db_adaptor = $c->stash->{'genomedb_adaptor'};
    my $ncbi_adaptor = $c->stash->{'ncbi_adaptor'};

#my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'root',-dbname => 'treefam_homology_67x', -host   => 'localhost',-pass => '123', -port => '3306');
#my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'treefam_admin',-dbname => 'treefam_homology_67hmm', -host   => 'web-mei-treefam',-pass => $ENV{TFADMIN_PSW}, -port => '3365');

#my $genome_db_adaptor = $db->get_GenomeDBAdaptor;
#my $ncbi_adaptor = $db->get_NCBITaxonAdaptor;
my @all_genome_dbs = @{$genome_db_adaptor->fetch_all()};
   # get data in array format
  
   my @genomelist;
   my @genomelist_ordered;
    foreach my $genome(@all_genome_dbs){
		my $species_name = $genome->name;
        $species_name = ucfirst($species_name);
        $species_name =~ tr/_/ /;
	    push(@genomelist, $species_name);
		#push(@tmp_array,$common_names[0]);
    }
    @genomelist = sort(@genomelist);
    $c->stash->{genomelist} =  \@genomelist;

    $c->log->debug( 'Browse::browse_genome_list: found ' . scalar @genomelist . ' genomes' ) if $c->debug;

  # stash the results for the template
  #$c->stash->{genomes} = \$all_genome_dbs if scalar $all_genome_dbs;
}
#-------------------------------------------------------------------------------
=head2 get_summary_data : Private

Just gets the data items for the overview bar.

=cut

sub get_summary_data : Private {
  my ( $this, $c ) = @_;

  my %summaryData;

  #----------------------------------------

  # number of architectures
  my $rs = $c->model( 'PfamDB::Pfamseq' )
             ->find( { ncbi_taxid => $c->stash->{taxId},
                       genome_seq => 1 },
                     { select     => [
                                       {
                                         count => [
                                                    { distinct => [ qw( auto_architecture ) ] }
                                                  ]
                                       }
                                     ],
                       as         => [ 'numArch' ] } );

  $summaryData{numArchitectures} = $rs->get_column( 'numArch' );

  #----------------------------------------

  # number of sequences
  $summaryData{numSequences} = $c->stash->{proteomeSpecies}->total_genome_proteins;

  #----------------------------------------

  # number of structures
  $rs = $c->model( 'PfamDB::PdbPfamaReg' )
          ->find( { 'auto_pfamseq.ncbi_taxid' => $c->stash->{taxId},
                    'auto_pfamseq.genome_seq' => 1 },
                    { select => [
                                  {
                                    count => [
                                               { distinct => [ 'pdb_id' ] }
                                             ]
                                  }
                                ],
                      as     => [ 'numPdb' ],
                      join   => [ 'auto_pfamseq' ] } );

  $summaryData{numStructures}  = $rs->get_column( 'numPdb' );

  #----------------------------------------

  # number of species. As we are dealing with a proteome, this is 1
  $summaryData{numSpecies} = 1;

  #----------------------------------------

  # number of interactions - For now set to zero
  $summaryData{numInt} = 0;

  #----------------------------------------

  $c->stash->{summaryData} = \%summaryData;
}

#-------------------------------------------------------------------------------

=head2 get_stats : Private

Just gets the data items for the stats Page. This is really quick

=cut

sub get_stats : Private {
  my( $this, $c ) = @_;
  $c->log->debug( 'Proteome::get_stats: getting domain statistics...' )
    if $c->debug;

  my @rs = $c->model('PfamDB::ProteomeRegions')
             ->search( { auto_proteome => $c->stash->{proteomeSpecies}->auto_proteome },
                       { join      => [ qw( auto_pfama ) ],
                         select    => [ qw( auto_pfama.pfama_id
                                            auto_pfama.pfama_acc
                                            auto_pfama.description
                                            me.auto_pfama ), 
                                        { count => 'auto_pfamseq' }, 
                                        { sum   => 'me.count' } ],
                         as        => [ qw( pfama_id 
                                            pfama_acc 
                                            description 
                                            auto_pfama 
                                            numberSeqs 
                                            numberRegs ) ],
                         group_by => [ qw( me.auto_pfama ) ],
                         order_by => \'sum(me.count) DESC', 
                         #prefetch => [ qw( pfam ) ]
                       }
                     );
  $c->log->debug( 'Proteome::get_stats: found |' . scalar @rs . '| rows' )
    if $c->debug;

  $c->stash->{statsData} = \@rs;
}
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
            $c->stash(homology_adaptor => $ha);
            
            my $gd = $reg->get_adaptor($compara_name, 'compara', 'GenomeDB');
            $c->stash('genomedb_adaptor' => $gd);
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
