use utf8;
package TreeFamDB::Result::Dnafrag;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::Dnafrag

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

=head1 TABLE: C<dnafrag>

=cut

__PACKAGE__->table("dnafrag");

=head1 ACCESSORS

=head2 dnafrag_id

  data_type: 'bigint'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 length

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 name

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 0
  size: 40

=head2 genome_db_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 coord_system_name

  data_type: 'varchar'
  is_nullable: 1
  size: 40

=head2 is_reference

  data_type: 'tinyint'
  default_value: 1
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "dnafrag_id",
  {
    data_type => "bigint",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "length",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "name",
  { data_type => "varchar", default_value => "", is_nullable => 0, size => 40 },
  "genome_db_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "coord_system_name",
  { data_type => "varchar", is_nullable => 1, size => 40 },
  "is_reference",
  { data_type => "tinyint", default_value => 1, is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</dnafrag_id>

=back

=cut

__PACKAGE__->set_primary_key("dnafrag_id");

=head1 UNIQUE CONSTRAINTS

=head2 C<name>

=over 4

=item * L</genome_db_id>

=item * L</name>

=back

=cut

__PACKAGE__->add_unique_constraint("name", ["genome_db_id", "name"]);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:Cl9feycUoXxoOLiM2l9bVA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
