use utf8;
package TreeFamDB::Result::ProteinTreeHmmprofile;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::ProteinTreeHmmprofile

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

=head1 TABLE: C<protein_tree_hmmprofile>

=cut

__PACKAGE__->table("protein_tree_hmmprofile");

=head1 ACCESSORS

=head2 node_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 type

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 0
  size: 40

=head2 hmmprofile

  data_type: 'mediumtext'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "node_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "type",
  { data_type => "varchar", default_value => "", is_nullable => 0, size => 40 },
  "hmmprofile",
  { data_type => "mediumtext", is_nullable => 1 },
);

=head1 UNIQUE CONSTRAINTS

=head2 C<type_node_id>

=over 4

=item * L</type>

=item * L</node_id>

=back

=cut

__PACKAGE__->add_unique_constraint("type_node_id", ["type", "node_id"]);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-15 16:32:46
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:06j5qqnUtqdKySlxY+ykSQ


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
