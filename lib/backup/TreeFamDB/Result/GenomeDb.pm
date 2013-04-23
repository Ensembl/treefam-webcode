use utf8;
package TreeFamDB::Result::GenomeDb;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::GenomeDb

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

=head1 TABLE: C<genome_db>

=cut

__PACKAGE__->table("genome_db");

=head1 ACCESSORS

=head2 genome_db_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 taxon_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 name

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 0
  size: 40

=head2 assembly

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 0
  size: 100

=head2 assembly_default

  data_type: 'tinyint'
  default_value: 1
  is_nullable: 1

=head2 genebuild

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 0
  size: 100

=head2 locator

  data_type: 'varchar'
  is_nullable: 1
  size: 400

=cut

__PACKAGE__->add_columns(
  "genome_db_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "taxon_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "name",
  { data_type => "varchar", default_value => "", is_nullable => 0, size => 40 },
  "assembly",
  { data_type => "varchar", default_value => "", is_nullable => 0, size => 100 },
  "assembly_default",
  { data_type => "tinyint", default_value => 1, is_nullable => 1 },
  "genebuild",
  { data_type => "varchar", default_value => "", is_nullable => 0, size => 100 },
  "locator",
  { data_type => "varchar", is_nullable => 1, size => 400 },
);

=head1 PRIMARY KEY

=over 4

=item * L</genome_db_id>

=back

=cut

__PACKAGE__->set_primary_key("genome_db_id");

=head1 UNIQUE CONSTRAINTS

=head2 C<name>

=over 4

=item * L</name>

=item * L</assembly>

=item * L</genebuild>

=back

=cut

__PACKAGE__->add_unique_constraint("name", ["name", "assembly", "genebuild"]);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:liqr95kNr8HhcwbpqB/ooQ


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
