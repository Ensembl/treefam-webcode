use utf8;
package TreeFamDB::Result::GeneTreeNodeAttr;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::GeneTreeNodeAttr

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

=head1 TABLE: C<gene_tree_node_attr>

=cut

__PACKAGE__->table("gene_tree_node_attr");

=head1 ACCESSORS

=head2 node_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_foreign_key: 1
  is_nullable: 0

=head2 node_type

  data_type: 'enum'
  extra: {list => ["duplication","dubious","speciation","gene_split"]}
  is_nullable: 1

=head2 taxon_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 taxon_name

  data_type: 'varchar'
  is_nullable: 1
  size: 255

=head2 bootstrap

  data_type: 'tinyint'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 duplication_confidence_score

  data_type: 'double precision'
  is_nullable: 1
  size: [5,4]

=head2 tree_support

  data_type: 'set'
  extra: {list => ["phyml_nt","nj_ds","phyml_aa","nj_dn","nj_mm","quicktree"]}
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "node_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_foreign_key => 1,
    is_nullable => 0,
  },
  "node_type",
  {
    data_type => "enum",
    extra => { list => ["duplication", "dubious", "speciation", "gene_split"] },
    is_nullable => 1,
  },
  "taxon_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "taxon_name",
  { data_type => "varchar", is_nullable => 1, size => 255 },
  "bootstrap",
  { data_type => "tinyint", extra => { unsigned => 1 }, is_nullable => 1 },
  "duplication_confidence_score",
  { data_type => "double precision", is_nullable => 1, size => [5, 4] },
  "tree_support",
  {
    data_type => "set",
    extra => {
      list => ["phyml_nt", "nj_ds", "phyml_aa", "nj_dn", "nj_mm", "quicktree"],
    },
    is_nullable => 1,
  },
);

=head1 PRIMARY KEY

=over 4

=item * L</node_id>

=back

=cut

__PACKAGE__->set_primary_key("node_id");

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
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:jSVDoBp8omhi7t6lglzGUQ


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
