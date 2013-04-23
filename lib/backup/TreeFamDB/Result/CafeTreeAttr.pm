use utf8;
package TreeFamDB::Result::CafeTreeAttr;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::CafeTreeAttr

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

=head1 TABLE: C<CAFE_tree_attr>

=cut

__PACKAGE__->table("CAFE_tree_attr");

=head1 ACCESSORS

=head2 node_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 fam_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 taxon_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 n_members

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 p_value

  data_type: 'double precision'
  is_nullable: 1
  size: [5,4]

=head2 avg_pvalue

  data_type: 'double precision'
  is_nullable: 1
  size: [5,4]

=cut

__PACKAGE__->add_columns(
  "node_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "fam_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "taxon_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "n_members",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "p_value",
  { data_type => "double precision", is_nullable => 1, size => [5, 4] },
  "avg_pvalue",
  { data_type => "double precision", is_nullable => 1, size => [5, 4] },
);

=head1 UNIQUE CONSTRAINTS

=head2 C<node_id>

=over 4

=item * L</node_id>

=item * L</fam_id>

=back

=cut

__PACKAGE__->add_unique_constraint("node_id", ["node_id", "fam_id"]);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:fD37l86A1P65nGrhb4ENvg


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
