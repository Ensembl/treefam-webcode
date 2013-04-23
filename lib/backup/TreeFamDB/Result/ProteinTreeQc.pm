use utf8;
package TreeFamDB::Result::ProteinTreeQc;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::ProteinTreeQc

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

=head1 TABLE: C<protein_tree_qc>

=cut

__PACKAGE__->table("protein_tree_qc");

=head1 ACCESSORS

=head2 genome_db_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_foreign_key: 1
  is_nullable: 0

=head2 total_orphans_num_clusterset

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 prop_orphans_clusterset

  data_type: 'double precision'
  is_nullable: 1

=head2 common_orphans_num_clusterset

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 new_orphans_num_clusterset

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 total_orphans_num_genetreeset

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 prop_orphans_genetreeset

  data_type: 'double precision'
  is_nullable: 1

=head2 common_orphans_num_genetreeset

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 new_orphans_num_genetreeset

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "genome_db_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_foreign_key => 1,
    is_nullable => 0,
  },
  "total_orphans_num_clusterset",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "prop_orphans_clusterset",
  { data_type => "double precision", is_nullable => 1 },
  "common_orphans_num_clusterset",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "new_orphans_num_clusterset",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "total_orphans_num_genetreeset",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "prop_orphans_genetreeset",
  { data_type => "double precision", is_nullable => 1 },
  "common_orphans_num_genetreeset",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "new_orphans_num_genetreeset",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</genome_db_id>

=back

=cut

__PACKAGE__->set_primary_key("genome_db_id");

=head1 RELATIONS

=head2 genome_db

Type: belongs_to

Related object: L<TreeFamDB::Result::GenomeDb>

=cut

__PACKAGE__->belongs_to(
  "genome_db",
  "TreeFamDB::Result::GenomeDb",
  { genome_db_id => "genome_db_id" },
  { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:04
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:2bIV7IlBtCQRFUP3lFZ/RA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
