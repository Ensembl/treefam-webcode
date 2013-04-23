use utf8;
package TreeFamDB::Result::GenomeDbStat;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::GenomeDbStat

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

=head1 TABLE: C<genome_db_stats>

=cut

__PACKAGE__->table("genome_db_stats");

=head1 ACCESSORS

=head2 genome_db_id

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 data_type

  data_type: 'varchar'
  is_nullable: 0
  size: 20

=head2 count

  data_type: 'integer'
  is_nullable: 0

=head2 mean

  data_type: 'double precision'
  default_value: 0
  is_nullable: 0

=head2 median

  data_type: 'double precision'
  default_value: 0
  is_nullable: 0

=head2 mode

  data_type: 'double precision'
  is_nullable: 0

=head2 stddev

  data_type: 'double precision'
  is_nullable: 0

=head2 variance

  data_type: 'double precision'
  is_nullable: 0

=head2 min

  data_type: 'double precision'
  default_value: 0
  is_nullable: 0

=head2 max

  data_type: 'double precision'
  default_value: 0
  is_nullable: 0

=head2 overlap_count

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "genome_db_id",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "data_type",
  { data_type => "varchar", is_nullable => 0, size => 20 },
  "count",
  { data_type => "integer", is_nullable => 0 },
  "mean",
  { data_type => "double precision", default_value => 0, is_nullable => 0 },
  "median",
  { data_type => "double precision", default_value => 0, is_nullable => 0 },
  "mode",
  { data_type => "double precision", is_nullable => 0 },
  "stddev",
  { data_type => "double precision", is_nullable => 0 },
  "variance",
  { data_type => "double precision", is_nullable => 0 },
  "min",
  { data_type => "double precision", default_value => 0, is_nullable => 0 },
  "max",
  { data_type => "double precision", default_value => 0, is_nullable => 0 },
  "overlap_count",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
);

=head1 UNIQUE CONSTRAINTS

=head2 C<genome_db_id_type>

=over 4

=item * L</genome_db_id>

=item * L</data_type>

=back

=cut

__PACKAGE__->add_unique_constraint("genome_db_id_type", ["genome_db_id", "data_type"]);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:03
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:Jh38V8Jxe0WiYn/3DOPuNQ


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
