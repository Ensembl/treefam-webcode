use utf8;
package TreeFamDB::Result::GenomeDbExtn;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::GenomeDbExtn

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

=head1 TABLE: C<genome_db_extn>

=cut

__PACKAGE__->table("genome_db_extn");

=head1 ACCESSORS

=head2 genome_db_id

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 phylum

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 0
  size: 40

=head2 locator

  data_type: 'mediumtext'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "genome_db_id",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "phylum",
  { data_type => "varchar", default_value => "", is_nullable => 0, size => 40 },
  "locator",
  { data_type => "mediumtext", is_nullable => 1 },
);

=head1 UNIQUE CONSTRAINTS

=head2 C<genome_db_id>

=over 4

=item * L</genome_db_id>

=back

=cut

__PACKAGE__->add_unique_constraint("genome_db_id", ["genome_db_id"]);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:03
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:eXoPwI7iSs71tkMG/71Fwg


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
