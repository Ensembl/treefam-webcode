use utf8;
package TreeFamDB::Result::MclSparseMatrix;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::MclSparseMatrix

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

=head1 TABLE: C<mcl_sparse_matrix>

=cut

__PACKAGE__->table("mcl_sparse_matrix");

=head1 ACCESSORS

=head2 row_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 column_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 value

  data_type: 'float'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "row_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "column_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "value",
  { data_type => "float", is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</row_id>

=item * L</column_id>

=back

=cut

__PACKAGE__->set_primary_key("row_id", "column_id");


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:04
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:94b2R9E3VeGYmxG9je/t5g


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
