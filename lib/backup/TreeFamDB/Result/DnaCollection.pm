use utf8;
package TreeFamDB::Result::DnaCollection;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::DnaCollection

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

=head1 TABLE: C<dna_collection>

=cut

__PACKAGE__->table("dna_collection");

=head1 ACCESSORS

=head2 dna_collection_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_foreign_key: 1
  is_nullable: 0

=head2 table_name

  data_type: 'varchar'
  is_nullable: 1
  size: 80

=head2 foreign_id

  data_type: 'integer'
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "dna_collection_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_foreign_key => 1,
    is_nullable => 0,
  },
  "table_name",
  { data_type => "varchar", is_nullable => 1, size => 80 },
  "foreign_id",
  { data_type => "integer", is_nullable => 0 },
);

=head1 UNIQUE CONSTRAINTS

=head2 C<dna_collection_id>

=over 4

=item * L</dna_collection_id>

=item * L</table_name>

=item * L</foreign_id>

=back

=cut

__PACKAGE__->add_unique_constraint(
  "dna_collection_id",
  ["dna_collection_id", "table_name", "foreign_id"],
);

=head1 RELATIONS

=head2 dna_collection

Type: belongs_to

Related object: L<TreeFamDB::Result::Subset>

=cut

__PACKAGE__->belongs_to(
  "dna_collection",
  "TreeFamDB::Result::Subset",
  { subset_id => "dna_collection_id" },
  { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:03
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:ERqmfMHKH/HMBWah/WaZIA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
