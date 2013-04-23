use utf8;
package TreeFamDB::Result::GeneTreeRoot;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::GeneTreeRoot

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

=head1 TABLE: C<gene_tree_root>

=cut

__PACKAGE__->table("gene_tree_root");

=head1 ACCESSORS

=head2 root_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_foreign_key: 1
  is_nullable: 0

=head2 member_type

  data_type: 'enum'
  extra: {list => ["protein","ncrna"]}
  is_nullable: 0

=head2 tree_type

  data_type: 'enum'
  extra: {list => ["clusterset","supertree","tree"]}
  is_nullable: 0

=head2 clusterset_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 method_link_species_set_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_foreign_key: 1
  is_nullable: 0

=head2 stable_id

  data_type: 'varchar'
  is_nullable: 1
  size: 40

=head2 version

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "root_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_foreign_key => 1,
    is_nullable => 0,
  },
  "member_type",
  {
    data_type => "enum",
    extra => { list => ["protein", "ncrna"] },
    is_nullable => 0,
  },
  "tree_type",
  {
    data_type => "enum",
    extra => { list => ["clusterset", "supertree", "tree"] },
    is_nullable => 0,
  },
  "clusterset_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "method_link_species_set_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_foreign_key => 1,
    is_nullable => 0,
  },
  "stable_id",
  { data_type => "varchar", is_nullable => 1, size => 40 },
  "version",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</root_id>

=back

=cut

__PACKAGE__->set_primary_key("root_id");

=head1 UNIQUE CONSTRAINTS

=head2 C<stable_id>

=over 4

=item * L</stable_id>

=back

=cut

__PACKAGE__->add_unique_constraint("stable_id", ["stable_id"]);

=head1 RELATIONS

=head2 gene_tree_root_tags

Type: has_many

Related object: L<TreeFamDB::Result::GeneTreeRootTag>

=cut

__PACKAGE__->has_many(
  "gene_tree_root_tags",
  "TreeFamDB::Result::GeneTreeRootTag",
  { "foreign.root_id" => "self.root_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 method_link_species_set

Type: belongs_to

Related object: L<TreeFamDB::Result::MethodLinkSpeciesSet>

=cut

__PACKAGE__->belongs_to(
  "method_link_species_set",
  "TreeFamDB::Result::MethodLinkSpeciesSet",
  { method_link_species_set_id => "method_link_species_set_id" },
  { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);

=head2 root

Type: belongs_to

Related object: L<TreeFamDB::Result::GeneTreeNode>

=cut

__PACKAGE__->belongs_to(
  "root",
  "TreeFamDB::Result::GeneTreeNode",
  { node_id => "root_id" },
  { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:i+VJWGEqPLn4s6R8JPHPGA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
