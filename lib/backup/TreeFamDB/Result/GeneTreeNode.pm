use utf8;
package TreeFamDB::Result::GeneTreeNode;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::GeneTreeNode

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

=head1 TABLE: C<gene_tree_node>

=cut

__PACKAGE__->table("gene_tree_node");

=head1 ACCESSORS

=head2 node_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 parent_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 root_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_foreign_key: 1
  is_nullable: 1

=head2 left_index

  data_type: 'integer'
  is_nullable: 0

=head2 right_index

  data_type: 'integer'
  is_nullable: 0

=head2 distance_to_parent

  data_type: 'double precision'
  default_value: 1
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "node_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "parent_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "root_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_foreign_key => 1,
    is_nullable => 1,
  },
  "left_index",
  { data_type => "integer", is_nullable => 0 },
  "right_index",
  { data_type => "integer", is_nullable => 0 },
  "distance_to_parent",
  { data_type => "double precision", default_value => 1, is_nullable => 0 },
);

=head1 PRIMARY KEY

=over 4

=item * L</node_id>

=back

=cut

__PACKAGE__->set_primary_key("node_id");

=head1 RELATIONS

=head2 gene_tree_node_attr

Type: might_have

Related object: L<TreeFamDB::Result::GeneTreeNodeAttr>

=cut

__PACKAGE__->might_have(
  "gene_tree_node_attr",
  "TreeFamDB::Result::GeneTreeNodeAttr",
  { "foreign.node_id" => "self.node_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 gene_tree_node_tags

Type: has_many

Related object: L<TreeFamDB::Result::GeneTreeNodeTag>

=cut

__PACKAGE__->has_many(
  "gene_tree_node_tags",
  "TreeFamDB::Result::GeneTreeNodeTag",
  { "foreign.node_id" => "self.node_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 gene_tree_nodes

Type: has_many

Related object: L<TreeFamDB::Result::GeneTreeNode>

=cut

__PACKAGE__->has_many(
  "gene_tree_nodes",
  "TreeFamDB::Result::GeneTreeNode",
  { "foreign.root_id" => "self.node_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 gene_tree_root

Type: might_have

Related object: L<TreeFamDB::Result::GeneTreeRoot>

=cut

__PACKAGE__->might_have(
  "gene_tree_root",
  "TreeFamDB::Result::GeneTreeRoot",
  { "foreign.root_id" => "self.node_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 root

Type: belongs_to

Related object: L<TreeFamDB::Result::GeneTreeNode>

=cut

__PACKAGE__->belongs_to(
  "root",
  "TreeFamDB::Result::GeneTreeNode",
  { node_id => "root_id" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:rYbeQr3gfRoMyVjEeQ/JNA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
