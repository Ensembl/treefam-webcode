use utf8;
package TreeFamDB::Result::MethodLinkSpeciesSet;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::MethodLinkSpeciesSet

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

=head1 TABLE: C<method_link_species_set>

=cut

__PACKAGE__->table("method_link_species_set");

=head1 ACCESSORS

=head2 method_link_species_set_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 method_link_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 species_set_id

  data_type: 'integer'
  default_value: 0
  extra: {unsigned => 1}
  is_nullable: 0

=head2 name

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 0
  size: 255

=head2 source

  data_type: 'varchar'
  default_value: 'ensembl'
  is_nullable: 0
  size: 255

=head2 url

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 0
  size: 255

=cut

__PACKAGE__->add_columns(
  "method_link_species_set_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "method_link_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "species_set_id",
  {
    data_type => "integer",
    default_value => 0,
    extra => { unsigned => 1 },
    is_nullable => 0,
  },
  "name",
  { data_type => "varchar", default_value => "", is_nullable => 0, size => 255 },
  "source",
  {
    data_type => "varchar",
    default_value => "ensembl",
    is_nullable => 0,
    size => 255,
  },
  "url",
  { data_type => "varchar", default_value => "", is_nullable => 0, size => 255 },
);

=head1 PRIMARY KEY

=over 4

=item * L</method_link_species_set_id>

=back

=cut

__PACKAGE__->set_primary_key("method_link_species_set_id");

=head1 UNIQUE CONSTRAINTS

=head2 C<method_link_id>

=over 4

=item * L</method_link_id>

=item * L</species_set_id>

=back

=cut

__PACKAGE__->add_unique_constraint("method_link_id", ["method_link_id", "species_set_id"]);

=head1 RELATIONS

=head2 gene_tree_roots

Type: has_many

Related object: L<TreeFamDB::Result::GeneTreeRoot>

=cut

__PACKAGE__->has_many(
  "gene_tree_roots",
  "TreeFamDB::Result::GeneTreeRoot",
  {
    "foreign.method_link_species_set_id" => "self.method_link_species_set_id",
  },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:6/kaP0PMG5O+nnPDXPKNWw


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
