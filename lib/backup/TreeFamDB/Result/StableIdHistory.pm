use utf8;
package TreeFamDB::Result::StableIdHistory;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::StableIdHistory

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

=head1 TABLE: C<stable_id_history>

=cut

__PACKAGE__->table("stable_id_history");

=head1 ACCESSORS

=head2 mapping_session_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 stable_id_from

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 0
  size: 40

=head2 version_from

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 stable_id_to

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 0
  size: 40

=head2 version_to

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 contribution

  data_type: 'float'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "mapping_session_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "stable_id_from",
  { data_type => "varchar", default_value => "", is_nullable => 0, size => 40 },
  "version_from",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "stable_id_to",
  { data_type => "varchar", default_value => "", is_nullable => 0, size => 40 },
  "version_to",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "contribution",
  { data_type => "float", is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</mapping_session_id>

=item * L</stable_id_from>

=item * L</stable_id_to>

=back

=cut

__PACKAGE__->set_primary_key("mapping_session_id", "stable_id_from", "stable_id_to");


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:/m1ocQwmqc5Q9HYwgw5FMw


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
