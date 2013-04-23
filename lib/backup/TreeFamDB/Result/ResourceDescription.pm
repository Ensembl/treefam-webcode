use utf8;
package TreeFamDB::Result::ResourceDescription;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::ResourceDescription

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

=head1 TABLE: C<resource_description>

=cut

__PACKAGE__->table("resource_description");

=head1 ACCESSORS

=head2 rc_id

  data_type: 'integer'
  default_value: 0
  extra: {unsigned => 1}
  is_nullable: 0

=head2 meadow_type

  data_type: 'enum'
  default_value: 'LSF'
  extra: {list => ["LSF","LOCAL"]}
  is_nullable: 0

=head2 parameters

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 0
  size: 255

=head2 description

  data_type: 'varchar'
  is_nullable: 1
  size: 255

=cut

__PACKAGE__->add_columns(
  "rc_id",
  {
    data_type => "integer",
    default_value => 0,
    extra => { unsigned => 1 },
    is_nullable => 0,
  },
  "meadow_type",
  {
    data_type => "enum",
    default_value => "LSF",
    extra => { list => ["LSF", "LOCAL"] },
    is_nullable => 0,
  },
  "parameters",
  { data_type => "varchar", default_value => "", is_nullable => 0, size => 255 },
  "description",
  { data_type => "varchar", is_nullable => 1, size => 255 },
);

=head1 PRIMARY KEY

=over 4

=item * L</rc_id>

=item * L</meadow_type>

=back

=cut

__PACKAGE__->set_primary_key("rc_id", "meadow_type");


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:05
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:cxNMD1l8YoYCACZEDPZIPQ


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
