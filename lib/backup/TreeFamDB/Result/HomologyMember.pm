use utf8;
package TreeFamDB::Result::HomologyMember;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::HomologyMember

=cut

use strict;
use warnings;

use Moose;
use MooseX::NonMoose;
use MooseX::MarkAsMethods autoclean => 1;
extends 'DBIx::Class::Core';

=head1 COMPONENTS LOADED

=over 4

=item * L<DBIx::Class::InflateColumn::DateTime>

=back

=cut

__PACKAGE__->load_components("InflateColumn::DateTime");

=head1 TABLE: C<homology_member>

=cut

__PACKAGE__->table("homology_member");

=head1 ACCESSORS

=head2 homology_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 member_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 peptide_member_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 cigar_line

  data_type: 'mediumtext'
  is_nullable: 1

=head2 perc_cov

  data_type: 'integer'
  is_nullable: 1

=head2 perc_id

  data_type: 'integer'
  is_nullable: 1

=head2 perc_pos

  data_type: 'integer'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "homology_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "member_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "peptide_member_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "cigar_line",
  { data_type => "mediumtext", is_nullable => 1 },
  "perc_cov",
  { data_type => "integer", is_nullable => 1 },
  "perc_id",
  { data_type => "integer", is_nullable => 1 },
  "perc_pos",
  { data_type => "integer", is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</homology_id>

=item * L</member_id>

=back

=cut

__PACKAGE__->set_primary_key("homology_id", "member_id");


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:2812y2qd+I3iEG13k5JCGA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
