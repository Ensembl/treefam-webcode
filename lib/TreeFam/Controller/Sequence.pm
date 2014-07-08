
# Sequence.pm
# jt6 20081205 WTSI
#
# $Id: Sequence.pm,v 1.2 2009-01-06 11:52:29 jt6 Exp $

=head1 NAME

RfamWeb::Controller::Sequence- controller to build the page for a sequence

=cut

package TreeFam::Controller::Sequence;

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
use TreeFam::HomologyHelper;
use TreeFam::SearchHelper;

#use treefam::nhx_plot;

BEGIN
{
    extends 'Catalyst::Controller::REST';
    #print STDERR "[beginning of family controller]\n";
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

=head1 METHODS

=head2 sequence_search : Chained PathPart Args

The entry point for a sequence search. We check for a parameter, "lookup", which
we detaint and stash. We then forward straight to L<sequence_page>, which will
retrieve and present the results.

Start and end of a chain.

=cut

sub submit_job : Chained( '/' ) 
                      PathPart( 'sequence_search' ) 
                      Args( 0 ) {
  my ( $this, $c ) = @_;
  
  $c->log->debug( 'Sequence::sequence_search: searching for TreeFam hits to a sequence' )
    if $c->debug;

  unless ( defined $c->req->param('entry') ) { 
    $c->log->debug( 'Sequence::sequence_search: no sequence accession found' )
      if $c->debug;  

	}

    # submit job
    my $evalue = 10.0;
    my $seq_file = "/static/tools/seq.fa";
    my $email = "fs\@ebi.ac.uk";	
    my $cmd = "/static/tools/hmmer_hmmscan_lwp.pl --async --email $email -E $evalue $seq_file";
	$c->log->debug("started hmmer job: $cmd");
    open(F, "$cmd|");
    while (<F>) {
    		print if /^hmmer_hmmscan/; 
    }
    close(F);
    #my $submit_output = `$cmd`;
    
    my $job_id = "";
 
    $c->stash->{template} = 'pages/search/sequence/result.tt';
    return;	
}





#-------------------------------------------------------------------------------

=head1 METHODS

=head2 sequence_search : Chained PathPart Args

The entry point for a sequence search. We check for a parameter, "lookup", which
we detaint and stash. We then forward straight to L<sequence_page>, which will
retrieve and present the results.

Start and end of a chain.

=cut
sub get_seq_info : Chained( '/' ) PathPart( 'get_seq_info' ) Args(1){
    my ( $this, $c, $id ) = @_;
    my $tf_family = "NaN";
    my $homology_type = "";
    $c->log->debug("in get_seq_info with $id") if $c->debug;
    #$c->log->debug("perl path is @INC") if $c->debug;
    my ($homology_data,$sequence_data);
    $c->forward('get_adaptors');
    my $member_adaptor = $c->stash->{'member_adaptor'};
    my $homology_adaptor = $c->stash->{'homology_adaptor'};
    my $genetree_adaptor = $c->stash->{'genetree_adaptor'};
    my $to_search = $id;
    my $result_data; 
    $c->log->debug("in get_seq_info with $to_search") if $c->debug;
    
    #my $homologies = TreeFam::HomologyHelper::get_homologs_for_gene({"homology_adaptor" => $homology_adaptor, "genetree_adaptor" => $genetree_adaptor, "source_object" => "test"});
	
    my $resultset = TreeFam::SearchHelper::get_MemberInformation4seq({"member_adaptor" => $member_adaptor, "to_search" => $to_search, "genetree_adaptor"=> $genetree_adaptor,"homology_adaptor" =>$homology_adaptor});

    if(!$resultset){
        $c->error("No results found");
    }
    else{
       $result_data = encode_json $resultset;
    }
        $c->res->content_type('application/json');
     
     $c->res->body( $result_data);

}


sub sequence_search : Chained( '/' ) 
                      PathPart( 'sequence_test' ) 
                      Args( 0 ) {
  my ( $this, $c ) = @_;
  
  $c->log->debug( 'Sequence::sequence_search: searching for TreeFam hits to a sequence' )
    if $c->debug;

  unless ( defined $c->req->param('entry') ) { 
    $c->log->debug( 'Sequence::sequence_search: no sequence accession found' )
      if $c->debug;  

    $c->stash->{errorMsg} = 'You must give a sequence accession';
    
    return;
  }

  my ( $entry ) = $c->req->param('entry') =~ m/^(\w+)(\.\d+)?$/;
  
  unless ( defined $entry ) { 
    $c->log->debug( 'Sequence::sequence_search: no valid sequence accession found' )
      if $c->debug;  

    $c->stash->{errorMsg} = 'You must give a valid sequence accession';
    
    return;
  }

  $c->forward( 'sequence_page', [ $entry ] );
}

#-------------------------------------------------------------------------------

=head2 sequence_page : Chained PathPart Args

Action to build a page showing all Rfam hits for a given sequence entry. Takes
the sequence accession/ID from the first argument.

Start and end of a chain.

=cut

sub sequence_page : Chained( '/' ) 
                    PathPart( 'sequence' ) 
                    Args( 1 ) {
  my ( $this, $c, $tainted_entry ) = @_;
  
  $c->log->debug( 'Sequence::sequence_page: building page of hits for a sequence' )
    if $c->debug;
    
  my ( $entry ) = $tainted_entry;
  #my ( $entry ) = $tainted_entry =~ m/^(\w+)(\.\d+)?$/;

  unless ( defined $entry ) {
    $c->log->debug( 'Sequence::sequence_page: no valid sequence accession found for '.$entry.' was ['.$tainted_entry.']' )
      if $c->debug;  

    $c->stash->{errorMsg} = 'You must supply a valid sequence accession';
    
    return;
  }

  $c->log->debug( "Sequence::sequence_page: looking up hits for |$entry|" ) if $c->debug;
    
  $c->stash->{entry} = $entry;
  # get us a db connection
    $c->forward('get_adaptors');
    
    my $to_search = $entry; 
    my $type;
    my $homology_type;
    my $member;
    my $sequence;
    my $sequence_cds;
    my $homology_hits;
    my $member_adaptor = $c->stash->{member_adaptor};
   
   my $member = TreeFam::SearchHelper::check_valid_sequence({"member_adaptor" => $member_adaptor, "to_search" => $to_search});
   if($member){
        $c->stash->{initial_entry} = $c->stash->{entry} if $member ne $c->stash->{entry};
        $c->stash->{entry} = $member->stable_id;
        $c->stash->{member_id} = $member->dbID;
        print "found useable id: $member\n";
   }
   else{
        print "could not find member\n";
        $c->stash->{errorMsg} = 'You must give a sequence accession';
        $c->stash->{template} = 'pages/search/sequence/error.tt';
        $c->stash->{entry} = "";
        return;
        $c->stash->{error} = "Could not find a seqeuence";
   }
    #my $genetree_adaptor = $c->stash->{genetree_adaptor};
    #my $homology_adaptor = $c->stash->{homology_adaptor};
    #my $resultset = TreeFam::SearchHelper::get_all_for_sequence_id({"member_adaptor" => $member_adaptor, 
                                                                    #"to_search" => $to_search, 
                                                                    #"genetree_adaptor"=> $genetree_adaptor, 
                                                                    #"homology_adaptor" =>$homology_adaptor, 
                                                                    #"type"=>$type,
                                                                    #"homology_type"=>$homology_type});

            # Number of family hits
        #$c->stash->{'no_homolog_hits'} = scalar(@{$resultset->{"homologies"}}); 
        #my @homologies = @{$resultset->{"homologies"}} ;
        #$c->stash->{'homologies_json'} = encode_json \@homologies;
        ## Number of sequence hits
        #$c->stash->{'no_homolog_hits'} = scalar(@homology_array);
        #$c->stash->{'no_xrefs_hits'} = scalar(@{$resultset->{"xref"}});
        #$c->stash->{'xrefs_json'} = encode_json $resultset->{'xref'};
        
        ### Total number of hits
        ##$c->stash->{'no_sections'};
        #if($c->stash->{'no_family_hits'} > 0){$c->stash->{'no_sections'} += 1;}
        #if($c->stash->{'no_homology_hits'} > 0){$c->stash->{'no_sections'} += 1;}
        #if($c->stash->{'no_xrefs_hits'} > 0){$c->stash->{'no_sections'} += 1;}
        
        #$c->stash->{'no_total_hits'} =  (defined($c->stash->{'no_family_hits'}) && $c->stash->{'no_family_hits'}) 
                                    #+  (defined($c->stash->{'no_sequence_hits'}) && $c->stash->{'no_sequence_hits'})
                                    #+ (defined($c->stash->{'no_xrefs_hits'}) && $c->stash->{'no_xrefs_hits'}); 
        ## Saving sequence data
        #$c->stash->{'sequence'} = $sequence; 
        #$c->stash->{'sequence_cds'} = $sequence_cds; 
        # set treefam id of sequence
        if(defined($member)){
            $c->stash->{'treefam_id'} = $member; 
        }
        $c->stash->{template} = 'pages/search/sequence/lookup.tt';
    #$c->stash->{"resultset"} = $resultset; 
  #$c->stash->{template} = 'pages/search/sequence/show_sequence.tt';
}

#-------------------------------------------------------------------------------

=head2 sequence_link : Chained PathPart CaptureArgs

Captures the first argument as a sequence accession/ID.

Part of a chain.

=cut

sub sequence_link : Chained( '/' ) 
                    PathPart( 'sequence' ) 
                    CaptureArgs( 1 ) {
  my ( $this, $c, $tainted_entry ) = @_;
  
  $c->log->debug( 'Sequence::sequence_link: checking sequence ID/acc' ) if $c->debug;
    
  my ( $entry ) = $tainted_entry =~ m/^(\w+)(\.\d+)?$/;

  unless ( defined $entry ) {
    $c->log->debug( 'Sequence::sequence_link: no valid sequence accession found' )
      if $c->debug;  

    $c->stash->{errorMsg} = 'You must provide a valid sequence accession';
    
    return;
  }

  $c->log->debug( "Sequence::sequence_link: looking up hits for |$entry|" )
    if $c->debug;
    
  $c->stash->{entry} = $entry;
}


#-------------------------------------------------------------------------------
#- private actions -------------------------------------------------------------
#-------------------------------------------------------------------------------
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
