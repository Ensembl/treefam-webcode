use utf8;
package TreeFamDB::Result::GeneTreeNodeTag;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::GeneTreeNodeTag

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

=head1 TABLE: C<gene_tree_node_tag>

=cut

__PACKAGE__->table("gene_tree_node_tag");

=head1 ACCESSORS

=head2 node_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_foreign_key: 1
  is_nullable: 0

=head2 tag

  data_type: 'varchar'
  is_nullable: 0
  size: 50

=head2 value

  data_type: 'mediumtext'
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "node_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_foreign_key => 1,
    is_nullable => 0,
  },
  "tag",
  { data_type => "varchar", is_nullable => 0, size => 50 },
  "value",
  { data_type => "mediumtext", is_nullable => 0 },
);

=head1 RELATIONS

=head2 node

Type: belongs_to

Related object: L<TreeFamDB::Result::GeneTreeNode>

=cut

__PACKAGE__->belongs_to(
  "node",
  "TreeFamDB::Result::GeneTreeNode",
  { node_id => "node_id" },
  { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:03
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:Fz+/wkLBKMHbV4qsJe8TCQ


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
