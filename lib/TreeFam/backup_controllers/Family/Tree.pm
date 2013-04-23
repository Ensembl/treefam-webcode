
# Tree.pm
# jt6 20060511 WTSI
#
# $Id: Tree.pm,v 1.3 2009-01-06 11:52:51 jt6 Exp $

=head1 NAME

RfamWeb::Controller::Family::Tree;

Controller to build the tree view of the family.

=cut

package TreeFam::Controller::Family::Tree;

=head1 DESCRIPTION

Uses treefam drawing code to generate images of the tree for
a given family.

$Id: Tree.pm,v 1.3 2009-01-06 11:52:51 jt6 Exp $

=cut

use strict;
use warnings;

use Compress::Zlib;
use Data::Dump qw( dump );

#use treefamlib::nhx_plot;

use base 'TreeFam::Controller::Family';

#-------------------------------------------------------------------------------
#- exposed actions -------------------------------------------------------------
#-------------------------------------------------------------------------------

=head1 METHODS

=head2 tree : Path

Plots the tree that we loaded in "auto" and hands off to a template that
builds HTML for the image and associated image map.

=cut

#sub tree : Path {
sub tree : Chained( '/' ) PathPart( 'family/tree' ) Args( 1 ) {
    my ( $this, $c, $integer ) = @_;

    #$c->log->debug("trying to get data for ".$c->{acc}." $c\n") if $c->debug;
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
#-------------------------------------------------------------------------------

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
