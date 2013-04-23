use utf8;
package TreeFamDB::Result::SitewiseAln;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::SitewiseAln

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

=head1 TABLE: C<sitewise_aln>

=cut

__PACKAGE__->table("sitewise_aln");

=head1 ACCESSORS

=head2 sitewise_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 aln_position

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 node_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 tree_node_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 omega

  data_type: 'float'
  is_nullable: 1
  size: [10,5]

=head2 omega_lower

  data_type: 'float'
  is_nullable: 1
  size: [10,5]

=head2 omega_upper

  data_type: 'float'
  is_nullable: 1
  size: [10,5]

=head2 optimal

  data_type: 'float'
  is_nullable: 1
  size: [10,5]

=head2 ncod

  data_type: 'integer'
  is_nullable: 1

=head2 threshold_on_branch_ds

  data_type: 'float'
  is_nullable: 1
  size: [10,5]

=head2 type

  data_type: 'enum'
  extra: {list => ["single_character","random","all_gaps","constant","default","negative1","negative2","negative3","negative4","positive1","positive2","positive3","positive4","synonymous"]}
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "sitewise_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "aln_position",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "node_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "tree_node_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "omega",
  { data_type => "float", is_nullable => 1, size => [10, 5] },
  "omega_lower",
  { data_type => "float", is_nullable => 1, size => [10, 5] },
  "omega_upper",
  { data_type => "float", is_nullable => 1, size => [10, 5] },
  "optimal",
  { data_type => "float", is_nullable => 1, size => [10, 5] },
  "ncod",
  { data_type => "integer", is_nullable => 1 },
  "threshold_on_branch_ds",
  { data_type => "float", is_nullable => 1, size => [10, 5] },
  "type",
  {
    data_type => "enum",
    extra => {
      list => [
        "single_character",
        "random",
        "all_gaps",
        "constant",
        "default",
        "negative1",
        "negative2",
        "negative3",
        "negative4",
        "positive1",
        "positive2",
        "positive3",
        "positive4",
        "synonymous",
      ],
    },
    is_nullable => 0,
  },
);

=head1 PRIMARY KEY

=over 4

=item * L</sitewise_id>

=back

=cut

__PACKAGE__->set_primary_key("sitewise_id");

=head1 UNIQUE CONSTRAINTS

=head2 C<aln_position_node_id_ds>

=over 4

=item * L</aln_position>

=item * L</node_id>

=item * L</threshold_on_branch_ds>

=back

=cut

__PACKAGE__->add_unique_constraint(
  "aln_position_node_id_ds",
  ["aln_position", "node_id", "threshold_on_branch_ds"],
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:Y9v/QeHBks7LyjUTcZqYcA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
