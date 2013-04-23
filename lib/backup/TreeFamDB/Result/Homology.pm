use utf8;
package TreeFamDB::Result::Homology;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::Homology

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

=head1 TABLE: C<homology>

=cut

__PACKAGE__->table("homology");

=head1 ACCESSORS

=head2 homology_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 method_link_species_set_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 description

  data_type: 'enum'
  extra: {list => ["ortholog_one2one","apparent_ortholog_one2one","ortholog_one2many","ortholog_many2many","within_species_paralog","other_paralog","putative_gene_split","contiguous_gene_split","between_species_paralog","possible_ortholog","UBRH","BRH","MBRH","RHS","projection_unchanged","projection_altered"]}
  is_nullable: 1

=head2 subtype

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 0
  size: 40

=head2 dn

  data_type: 'float'
  is_nullable: 1
  size: [10,5]

=head2 ds

  data_type: 'float'
  is_nullable: 1
  size: [10,5]

=head2 n

  data_type: 'float'
  is_nullable: 1
  size: [10,1]

=head2 s

  data_type: 'float'
  is_nullable: 1
  size: [10,1]

=head2 lnl

  data_type: 'float'
  is_nullable: 1
  size: [10,3]

=head2 threshold_on_ds

  data_type: 'float'
  is_nullable: 1
  size: [10,5]

=head2 ancestor_node_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 tree_node_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "homology_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "method_link_species_set_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "description",
  {
    data_type => "enum",
    extra => {
      list => [
        "ortholog_one2one",
        "apparent_ortholog_one2one",
        "ortholog_one2many",
        "ortholog_many2many",
        "within_species_paralog",
        "other_paralog",
        "putative_gene_split",
        "contiguous_gene_split",
        "between_species_paralog",
        "possible_ortholog",
        "UBRH",
        "BRH",
        "MBRH",
        "RHS",
        "projection_unchanged",
        "projection_altered",
      ],
    },
    is_nullable => 1,
  },
  "subtype",
  { data_type => "varchar", default_value => "", is_nullable => 0, size => 40 },
  "dn",
  { data_type => "float", is_nullable => 1, size => [10, 5] },
  "ds",
  { data_type => "float", is_nullable => 1, size => [10, 5] },
  "n",
  { data_type => "float", is_nullable => 1, size => [10, 1] },
  "s",
  { data_type => "float", is_nullable => 1, size => [10, 1] },
  "lnl",
  { data_type => "float", is_nullable => 1, size => [10, 3] },
  "threshold_on_ds",
  { data_type => "float", is_nullable => 1, size => [10, 5] },
  "ancestor_node_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "tree_node_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
);

=head1 PRIMARY KEY

=over 4

=item * L</homology_id>

=back

=cut

__PACKAGE__->set_primary_key("homology_id");


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:shu2nP0Iw1MSiWocDPk6EA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
