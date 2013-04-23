use utf8;
package TreeFamDB::Result::KtreedistScore;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::KtreedistScore

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

=head1 TABLE: C<ktreedist_score>

=cut

__PACKAGE__->table("ktreedist_score");

=head1 ACCESSORS

=head2 node_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 tag

  data_type: 'varchar'
  is_nullable: 1
  size: 50

=head2 k_score_rank

  data_type: 'integer'
  is_nullable: 1

=head2 k_score

  data_type: 'float'
  is_nullable: 1
  size: [10,5]

=head2 scale_factor

  data_type: 'float'
  is_nullable: 1
  size: [10,5]

=head2 symm_difference

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 n_partitions

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "node_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "tag",
  { data_type => "varchar", is_nullable => 1, size => 50 },
  "k_score_rank",
  { data_type => "integer", is_nullable => 1 },
  "k_score",
  { data_type => "float", is_nullable => 1, size => [10, 5] },
  "scale_factor",
  { data_type => "float", is_nullable => 1, size => [10, 5] },
  "symm_difference",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "n_partitions",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
);

=head1 UNIQUE CONSTRAINTS

=head2 C<tag_node_id>

=over 4

=item * L</node_id>

=item * L</tag>

=back

=cut

__PACKAGE__->add_unique_constraint("tag_node_id", ["node_id", "tag"]);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:04
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:Hr2/9Y9T6mpjXZeXi9xAoA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
