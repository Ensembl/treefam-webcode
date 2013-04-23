
# Help.pm
# jt6 20060925 WTSI
#
# $Id: Help.pm,v 1.1 2009-01-06 11:32:23 jt6 Exp $

=head1 NAME

RfamWeb::Controller::Help - controller to build the help pages

=cut

package TreeFam::Controller::Help;

=head1 DESCRIPTION

Displays the help pages for the RfamWeb site.

Generates a B<tabbed page>.

$Id: Help.pm,v 1.1 2009-01-06 11:32:23 jt6 Exp $

=cut

use strict;
use warnings;

use base 'PfamBase::Controller::Help';

sub help : Global {
  my ( $this, $c ) = @_;

  # copy the kingdoms list into the stash so that we can use them to build the
  #$c->stash->{kingdoms} = [ sort keys %{ $this->{kingdoms} } ]; 
  $c->log->debug( 'Browse::browse_genome_list: building full list of genomes' ) if $c->debug;

  #$c->forward( 'build_active_letters' );
  #&browse_genomes_list;
  #$c->forward( 'browse_all_families' );
  #$c->forward( 'get_species_tree' );
  
  $c->stash->{pageType} = 'help';
  $c->stash->{template} = 'pages/layout.tt';
}

sub about : Global {
  my ( $this, $c ) = @_;
    $c->stash->{nav} = 'about';
  $c->stash->{template} = 'pages/about.tt';

}
sub forum : Global {
  my ( $this, $c ) = @_;
    $c->stash->{nav} = 'forum';
  $c->stash->{template} = 'pages/forum.tt';

}

#sub download : Global {
#  my ( $this, $c ) = @_;
#  
#  my $reg = 'Bio::EnsEMBL::Registry'; 
#  my $compara_name = $c->request()->param('compara') || "TreeFam";
  
#  my $genomedb_adaptor = $reg->get_adaptor($compara_name, 'compara', 'GenomeDB');
#  my $member_adaptor = $reg->get_adaptor($compara_name, 'compara', 'Member');
#  my @all_genome_dbs = @{$genomedb_adaptor->fetch_all()};
   # get data in array format
  
#   my @genomelist;
#   my @genomelist_ordered;
#    foreach my $genome(@all_genome_dbs){
#		my $species_name = $genome->name;
#        $species_name = ucfirst($species_name);
#        $species_name =~ tr/_/ /;
#	    push(@genomelist, $species_name);
#		#push(@tmp_array,$common_names[0]);
#    }
#    @genomelist = sort(@genomelist);
#    $c->stash->{genomelist} =  \@genomelist;
#
#
#  #$c->stash->{nav} = 'download';
#  #$c->stash->{template} = 'pages/download.tt';

#}#-------------------------------------------------------------------------------

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
