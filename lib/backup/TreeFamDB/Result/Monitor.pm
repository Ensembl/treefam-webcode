use utf8;
package TreeFamDB::Result::Monitor;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::Monitor

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

=head1 TABLE: C<monitor>

=cut

__PACKAGE__->table("monitor");

=head1 ACCESSORS

=head2 time

  data_type: 'datetime'
  datetime_undef_if_invalid: 1
  default_value: '0000-00-00 00:00:00'
  is_nullable: 0

=head2 workers

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 throughput

  data_type: 'float'
  is_nullable: 1

=head2 per_worker

  data_type: 'float'
  is_nullable: 1

=head2 analysis

  data_type: 'varchar'
  is_nullable: 1
  size: 255

=cut

__PACKAGE__->add_columns(
  "time",
  {
    data_type => "datetime",
    datetime_undef_if_invalid => 1,
    default_value => "0000-00-00 00:00:00",
    is_nullable => 0,
  },
  "workers",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "throughput",
  { data_type => "float", is_nullable => 1 },
  "per_worker",
  { data_type => "float", is_nullable => 1 },
  "analysis",
  { data_type => "varchar", is_nullable => 1, size => 255 },
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:04
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:rc372XyoJrgG1iOa8a+lKw


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
