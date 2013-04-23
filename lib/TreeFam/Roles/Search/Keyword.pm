
# Keyword.pm
# jt6 20060807 WTSI
#
# $Id: Keyword.pm,v 1.3 2009-02-11 10:51:50 jt6 Exp $

=head1 NAME

RfamWeb::Controller::Search::Keyword - a keyword search engine for the site

=cut

package TreeFam::Roles::Search::Keyword;

=head1 DESCRIPTION

This controller reads a list of search plugins from the application
configuration and forwards to each of them in turn, collects the
results and hands off to a template to format them as a results page.

$Id: Keyword.pm,v 1.3 2009-02-11 10:51:50 jt6 Exp $

=cut

#use Moose;
#use strict;
#use warnings;
use MooseX::MethodAttributes::Role;
use Data::Dump qw( dump );
use JSON;
use URI::Escape;
#use base 'TreeFam::Controller::Search';
#use base 'PfamBase::Controller::Search::Keyword';

## Use TreeFam helpers
use TreeFam::HomologyHelper;
use TreeFam::SearchHelper;
#require "/nfs/users/nfs_f/fs9/bin/perl_modules/ensembl_main/treefam/modules/TreeFam/HomologyHelper.pm";
#require "/nfs/users/nfs_f/fs9/bin/perl_modules/ensembl_main/treefam/modules/TreeFam/SearchHelper.pm";

#with 'PfamBase::Roles::Search::Keyword';
#-------------------------------------------------------------------------------

=head1 METHODS

=cut
# /family/../
sub autocomplete_search : Chained( 'search' ) PathPart( 'autocomplete' ) Args()
{
    my ( $this, $c, $to_search ) = @_;
    $c->log->debug("autocomplete_search : Chained( 'search_check' ) PathPart( 'autocomplete' )\n") if $c->debug;
    
    unless ( (defined $c->req->param('search') and $c->req->param('search') ne '') or (defined $to_search and $to_search ne '')) {
        $c->stash->{rest}->{error} = 'You did not supply a keyword/id.';
        $c->{error} = 'You did not supply a keyword/id.';
        $c->log->debug( 'Search::parse_keyword: no keyword; failed' ) if $c->debug;
        #$c->stash->{template} = 'rest/search/error_xml.tt';
        return 0;
    }
    $to_search = $c->request->param('search');
    $c->log->debug("keyword_search : to search: $to_search\n") if $c->debug;
    $c->stash->{query} = $to_search; 
    my $member_adaptor = $c->stash->{'member_adaptor'};
    #my $dbh = DBI->connect('dbi:mysql:treefam_homology_67hmm;host=web-mei-treefam:3365','treefam_admin',$ENV{TFADMIN_PSW}) or die "Connection Error: $DBI::errstr\n";
    #my $db = new Bio::EnsEMBL::Compara::DBSQL::DBAdaptor(-user   => 'treefam_admin',-dbname => 'treefam_homology_67hmm',-host   => 'web-mei-treefam',-pass => $ENV{TFADMIN_PSW}, -port => '3365');
    my $xref_hits = TreeFam::SearchHelper::search_xref_families_hits({"member_adaptor" => $member_adaptor, "to_search" => $to_search, "type" => 'search_all'});
    if(!$xref_hits){
        #$c->error("No results found");
    }
    my $data;
    $data->{"rows"} = $xref_hits;
        $c->log->debug("Found ".scalar(@{$xref_hits})."\n") if $c->debug;
        $c->log->debug(dump($data)) if $c->debug;
        my $families  =  encode_json $xref_hits; 
        $c->res->content_type('application/json');
        $c->res->body(  encode_json $data );

}



# /family/../
sub front_search : Chained( 'search' ) PathPart( 'front_search' ) Args()
{
    my ( $this, $c, $to_search ) = @_;
    unless ( (defined $c->req->param('query') and $c->req->param('query') ne '') or (defined $to_search and $to_search ne '')) {
        $c->stash->{rest}->{error} = 'You did not supply a keyword/id.';
        $c->{error} = 'You did not supply a keyword/id.';
        $c->log->debug( 'Search::parse_keyword: no keyword; failed' ) if $c->debug;
        #$c->stash->{template} = 'rest/search/error_xml.tt';
        return 0;
    }
    $c->log->debug("keyword_search : Chained( 'front_search' ) PathPart( 'keyword' )\n") if $c->debug;
    $c->forward('get_adaptors');
    $to_search =$c->req->param('query') ;
    $c->stash->{query} = $to_search; 
    $c->stash->{entry} = $to_search; 
    print "\tsearch members for ensemblID ... \n";
    $c->log->debug("front_search : Chained( 'front_search' ) : $to_search\n") if $c->debug;
	my $member = TreeFam::SearchHelper::search_members({"member_adaptor" => $c->stash->{'member_adaptor'}, "to_search" => $to_search});
	if(defined($member)){
	    print " give it to /sequence/$to_search\n";
        $c->log->debug("front_search : redirecting to ".$c->uri_for('/sequence', $to_search)." $to_search\n") if $c->debug;
        $c->response->redirect($c->uri_for('/sequence', $to_search));
        return;
        }
	else{ 
        print "not in members\n";
        my $xref_hits = TreeFam::SearchHelper::search_xref_hits({"member_adaptor" => $c->stash->{'member_adaptor'}, "to_search" => $to_search, "type" => 'external_sequence'});
	    print Dumper $xref_hits;
        if(scalar(@{$xref_hits})){
            $c->log->debug("front_search : redirecting to ".$c->uri_for('/sequence', $to_search)." $to_search\n") if $c->debug;
            $c->response->redirect($c->uri_for('/sequence', $to_search));
	        print " give it to /sequence/$to_search\n";
        }
        else{
            $c->log->debug("front_search : redirecting to ".$c->uri_for('/search', $to_search)." $to_search\n") if $c->debug;
            $c->response->redirect($c->uri_for('/search/keyword', $to_search));
	        print " give it to /search/keyword/\n";
        }
            
    }
}






# /family/../
sub keyword_search : Chained( 'search' ) PathPart( 'keyword' ) Args()
{
    my ( $this, $c, $to_search ) = @_;
    $c->log->debug("keyword_search : Chained( 'search_check' ) PathPart( 'keyword' )\n") if $c->debug;
    #$c->forward('get_adaptors');
    my $usuable_keyword = 0;
    if($to_search  eq ''){
        if( !(defined $c->req->param('query') and $c->req->param('query') ne '')){
            $c->log->debug( 'Search::parse_keyword: no keyword; failed ($to_search)' ) if $c->debug;
            # set a template, which will be used only if we're serialising to XML
            $c->stash->{template} = 'rest/search/error_xml.tt';
            return 0;    
        }
        else{
            $to_search = $c->request->param('query') || $c->stash->{"query"};
        }    
    }
    #$to_search = $c->request->param('query') || $c->stash->{"query"};
    $c->log->debug("keyword_search : to search: $to_search, stash-query: ".$c->stash->{'query'}." req-query: ".$c->request->param('query')."\n") if $c->debug;
    $c->stash->{query} = $to_search; 
    $c->stash->{entry} = $to_search; 
    ## to be passed on to view
    my @members_array;
    my @xrefs_array;
    my @families_array;

    if($to_search =~ /TF\d+/){
        $c->log->debug("seems to be a treefam family\n") if $c->debug;
    }   
   
    #$c->log->debug("Search description \n") if $c->debug;
    #my $description_hits = TreeFam::SearchHelper::search_description({"genetree_adaptor" => $c->stash->{'genetree_adaptor'},"member_adaptor" => $c->stash->{'member_adaptor'},"to_search" => $to_search});
    #$c->log->debug("Found".scalar(@{$description_hits})."\n") if $c->debug;
    
    #$c->log->debug("Search xref families with $to_search\n") if $c->debug;
    #my $families_hits = TreeFam::SearchHelper::search_xref_families_hits({"member_adaptor" => $c->stash->{'member_adaptor'}, "to_search" => $to_search, "type" => "search_all"});
    #$c->log->debug("Found".scalar(@{$families_hits})."\n") if $c->debug;
    
    #$c->log->debug("Search xref with $to_search\n") if $c->debug;
    #my $xref_hits = TreeFam::SearchHelper::search_xref_hits({"member_adaptor" => $c->stash->{'member_adaptor'}, "to_search" => $to_search, "type" => "external"});
    #$c->log->debug("Found".scalar(@{$xref_hits})."\n") if $c->debug;
    ##if(defined($xref_hits) &&scalar(@{$xref_hits})){
            ##print "done (found ".scalar(@{$xref_hits})." xref sequences)\n";
            ##push(@xrefs_array,@{$xref_hits}); # add to resultset
    ##}
    ##else{   
        ##print "did not find xref hits)\n";
    ##}  
    #my $got_hits;# = &();
    #$got_hits = (scalar(@{$description_hits}) || scalar(@{$xref_hits})  || scalar(@{$families_hits}))? 1:0;
    #$got_hits = 1;
    #if(!$got_hits){
        #$c->stash->{template} = 'pages/search/keyword/error.tt';
    #}
    #else{
    ### should do some fake things and render to results page
        #$c->stash->{sequences_array_json}  =  $description_hits; 
        #$c->stash->{xrefs_array_json}  = $xref_hits; 
        ##$c->stash->{xrefs_families_array_json}  = $xref_families_hits; 
        #$c->stash->{families_array_json}  = $families_hits; 

        #push(@{$c->stash->{pluginsArray}}, "Families" );
        #push(@{$c->stash->{pluginsArray}}, "Sequences" );
        #push(@{$c->stash->{pluginsArray}}, "External references" );

        ## Number of family hits
        #$c->stash->{'no_family_hits'} = scalar(@families_array); 
        ## Number of sequence hits
        #$c->stash->{'no_sequence_hits'} = scalar(@{$description_hits});
        #$c->stash->{'no_xrefs_hits'} = scalar(@{$xref_hits});
        #$c->stash->{'no_families_hits'} = scalar(@{$families_hits});
        #$c->log->debug(dump($families_hits)) if $c->debug;
        
        ### Total number of hits
        ##$c->stash->{'no_sections'};
        #if($c->stash->{'no_families_hits'} > 0){$c->stash->{'no_sections'} += 1;}
        #if($c->stash->{'no_sequence_hits'} > 0){$c->stash->{'no_sections'} += 1;}
        #if($c->stash->{'no_xrefs_hits'} > 0){$c->stash->{'no_sections'} += 1;}
        
        #$c->stash->{'no_total_hits'} =  (defined($c->stash->{'no_family_hits'}) && $c->stash->{'no_family_hits'}) 
                                    #+  (defined($c->stash->{'no_sequence_hits'}) && $c->stash->{'no_sequence_hits'})
                                    #+ (defined($c->stash->{'no_xrefs_hits'}) && $c->stash->{'no_xrefs_hits'}); 

        $c->stash->{template} = 'pages/search/keyword/results.tt';
    #}
} 

sub xref_hits_keyword : Chained( 'search' ) 
                    PathPart( 'xrefs4keyword' ) 
                    Args( 1 ) {
  my ( $this, $c, $tainted_entry ) = @_;
  
  $c->log->debug( 'Sequence::sequence_page: building page of hits for a sequence' ) if $c->debug;
    
  my ( $entry ) = $tainted_entry =~ m/^(\w+)(\.\d+)?$/;
  $entry = uri_unescape( $entry );
  unless ( defined $entry ) {
    $c->log->debug( 'Sequence::sequence_page: no valid sequence accession found' ) if $c->debug;  

    $c->stash->{errorMsg} = 'You must supply a valid sequence accession';
    
    return;
  }

  $c->log->debug( "Sequence::sequence_page: looking up hits for |$entry|" ) if $c->debug;
    
  $c->stash->{entry} = $entry;
  my $to_search = $entry;
  # get us a db connection
    $c->forward('get_adaptors');
    $c->log->debug("Search xref families with $to_search\n") if $c->debug;
    my $xref_hits = TreeFam::SearchHelper::search_xref_hits({"member_adaptor" => $c->stash->{'member_adaptor'}, "to_search" => $to_search, "type" => "external"});
    $c->log->debug("Found".scalar(@{$xref_hits})."\n") if $c->debug;
    
        if($xref_hits){
                $c->stash->{no_xref_hits} = scalar(@{$xref_hits});
        $c->log->debug( "found ".$c->stash->{no_xref_hits}." external hits\n" ) if $c->debug;
        #$xref_data = encode_json $xref_hits;
        $c->res->content_type('application/json');
        $c->res->body( encode_json $xref_hits);
    }
    else{
        print "could not find member\n";
        $c->stash->{errorMsg} = 'You must give a sequence accession';
        $c->stash->{template} = 'pages/search/sequence/error.tt';
        $c->stash->{entry} = "";
        return;
        $c->stash->{error} = "Could not find a seqeuence";
    }

}


sub xref_families_hits : Chained( 'search' ) 
                    PathPart( 'families4keyword' ) 
                    Args( 1 ) {
  my ( $this, $c, $tainted_entry ) = @_;
  
  $c->log->debug( 'Sequence::sequence_page: building page of hits for a sequence' ) if $c->debug;
    
  my ( $entry ) = $tainted_entry =~ m/^(\w+)(\.\d+)?$/;

  unless ( defined $entry ) {
    $c->log->debug( 'Sequence::sequence_page: no valid sequence accession found' ) if $c->debug;  

    $c->stash->{errorMsg} = 'You must supply a valid sequence accession';
    
    return;
  }

  $c->log->debug( "Sequence::sequence_page: looking up hits for |$entry|" ) if $c->debug;
    
  $c->stash->{entry} = $entry;
  my $to_search = $entry;
  # get us a db connection
    $c->forward('get_adaptors');
    $c->log->debug("Search xref families with $to_search\n") if $c->debug;
    my $families_hits = TreeFam::SearchHelper::search_xref_families_hits({"member_adaptor" => $c->stash->{'member_adaptor'}, "to_search" => $to_search, "type" => "search_all"});
    $c->log->debug("Found".scalar(@{$families_hits})."\n") if $c->debug;
    
        if($families_hits){
                $c->stash->{no_families_hits} = scalar(@{$families_hits});
        $c->log->debug( "found ".$c->stash->{no_families_hits}." external hits\n" ) if $c->debug;
        #$xref_data = encode_json $xref_hits;
        $c->res->content_type('application/json');
          $c->res->body( encode_json $families_hits);
    }
    else{
        print "could not find member\n";
        $c->stash->{errorMsg} = 'You must give a sequence accession';
        $c->stash->{template} = 'pages/search/sequence/error.tt';
        $c->stash->{entry} = "";
        return;
        $c->stash->{error} = "Could not find a seqeuence";
    }

}

sub description_hits : Chained( 'search' ) 
                    PathPart( 'sequences4keyword' ) 
                    Args( 1 ) {
  my ( $this, $c, $tainted_entry ) = @_;
  
  $c->log->debug( 'Sequence::sequence_page: building page of hits for a sequence' ) if $c->debug;
    
  my ( $entry ) = $tainted_entry =~ m/^(\w+)(\.\d+)?$/;

  unless ( defined $entry ) {
    $c->log->debug( 'Sequence::sequence_page: no valid sequence accession found' ) if $c->debug;  

    $c->stash->{errorMsg} = 'You must supply a valid sequence accession';
    
    return;
  }

  $c->log->debug( "Sequence::sequence_page: looking up hits for |$entry|" ) if $c->debug;
    
  $c->stash->{entry} = $entry;
  my $to_search = $entry;
  # get us a db connection
    $c->forward('get_adaptors');
    $c->log->debug("Search description \n") if $c->debug;
    my $description_hits = TreeFam::SearchHelper::search_description({"genetree_adaptor" => $c->stash->{'genetree_adaptor'},"member_adaptor" => $c->stash->{'member_adaptor'},"to_search" => $to_search});
    $c->log->debug("Found".scalar(@{$description_hits})."\n") if $c->debug;
    if($description_hits){
        $c->stash->{no_description_hits} = scalar(@{$description_hits});
        $c->log->debug( "found ".$c->stash->{no_description_hits}." external hits\n" ) if $c->debug;
        #$xref_data = encode_json $xref_hits;
        $c->res->content_type('application/json');
          $c->res->body( encode_json $description_hits);
    }
    else{
        print "could not find member\n";
        $c->stash->{errorMsg} = 'You must give a sequence accession';
        $c->stash->{template} = 'pages/search/sequence/error.tt';
        $c->stash->{entry} = "";
        return;
        $c->stash->{error} = "Could not find a seqeuence";
    }

}

 sub xref_hits : Chained( 'search' ) 
                    PathPart( 'xrefs4gene' ) 
                    Args( 1 ) {
  my ( $this, $c, $tainted_entry ) = @_;
  
  $c->log->debug( 'Sequence::sequence_page: building page of hits for a sequence' ) if $c->debug;
    
  my ( $entry ) = $tainted_entry =~ m/^(\w+)(\.\d+)?$/;

  unless ( defined $entry ) {
    $c->log->debug( 'Sequence::sequence_page: no valid sequence accession found' ) if $c->debug;  

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
    my $xref_hits = TreeFam::SearchHelper::search_xref_hits({"member_adaptor" => $member_adaptor, "to_search" => $to_search, "type" => "member" });
    if($xref_hits){
        $c->stash->{no_xref_hits} = scalar(@{$xref_hits});
        $c->log->debug( "found ".$c->stash->{no_xref_hits}." external hits\n" ) if $c->debug;
        #$xref_data = encode_json $xref_hits;
        $c->res->content_type('application/json');
          $c->res->body( encode_json $xref_hits);
    }
    else{
        print "could not find member\n";
        $c->stash->{errorMsg} = 'You must give a sequence accession';
        $c->stash->{template} = 'pages/search/sequence/error.tt';
        $c->stash->{entry} = "";
        return;
        $c->stash->{error} = "Could not find a seqeuence";
    }
}

#sub search_families : Private {
    #my ($db,$member) = (@_);
    #my $genetree_adaptor = $db->get_GeneTreeAdaptor;
    
    #my $all_trees = $genetree_adaptor->fetch_all_by_Member($member, "default");
    #return $all_trees;
#}

#=head2 lookup_term : Private

#Does a quick look-up to see if the search term matches a Pfam ID
#or accession.

#=cut

#sub lookup_term : Private {
  #my ( $this, $c ) = @_;

   #my $rs = $c->model('TreeFamDB::Family')
              #->search( [ { description => $c->stash->{rawQueryTerms} },
                          #{ description  => $c->stash->{rawQueryTerms} } ] );

  ## we're going to assume that there's only one hit here... we're in
  ## trouble if there's more than one, certainly
  #my $hit = $rs->next;
  #$c->stash->{lookupHit} = $hit if $hit;
#}

#-------------------------------------------------------------------------------

=head2 merge

Merges results from plugins. Merging requires that each row of the C<ResultSet>
has access to an Rfam accession. We'll try to get it using

  $rs->rfam_acc

or

  $rs->auto_rfam->rfam_acc

but if neither method works, the row is skipped.

=cut

sub merge : Private {
  my ( $this, $c, $pluginName, $rs ) = @_;

  ROW: while ( my $row = $rs->next ) {

    my ( $acc, $hit );

    TRY: {

      # first try accessing the accession on the table row directly
      eval {
        $acc = $row->stable_id;
      };
      if ( $@ ) {
        $c->log->debug( 'Search::Keyword::merge: caught an exception when trying '
                       . " \$row->rfam_acc for plugin |$pluginName|: $@" ) if $c->debug;
      }
		$c->log->info("acc is $acc\n");

      if ( defined $acc ) {
        $hit = $c->stash->{results}->{$acc} ||= {};
        $hit->{dbObj} = $row;
        last TRY;
      }

      # we couldn't find the accession on the row itself, so try walking down one
      # possible relationship, "auto_rfam", and see if that gets us to another
      # table, which hopefully does store the details of the Rfam family
      #
      # This is all a bit convoluted, but it means that we shouldn't need to add
      # proxy columns indiscriminately throughout the model, just so that text
      # searching can work
      eval {
        $acc = $row->auto_treefam->stable_id;
      };
      if ( $@ ) {
        $c->log->debug( 'Search::Keyword::merge: caught an exception when trying '
                       . " \$row->auto_rfam->rfam_acc for plugin |$pluginName|: $@" )
          if $c->debug;
      }

      if ( defined $acc ) {
        $hit = $c->stash->{results}->{$acc} ||= {};
        $hit->{dbObj} = $row->auto_treefam;
        # last TRY;
      }

    }

    $hit->{query}->{$pluginName} = 1;
    $c->stash->{pluginHits}->{$pluginName} += 1;

    # score this hit
    $this->_computeScore( $c, $hit );
  }
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
