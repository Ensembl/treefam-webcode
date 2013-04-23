use utf8;
package TreeFamDB::Result::MappingSession;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::MappingSession

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

=head1 TABLE: C<mapping_session>

=cut

__PACKAGE__->table("mapping_session");

=head1 ACCESSORS

=head2 mapping_session_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 type

  data_type: 'enum'
  extra: {list => ["family","tree"]}
  is_nullable: 1

=head2 when_mapped

  data_type: 'timestamp'
  datetime_undef_if_invalid: 1
  default_value: current_timestamp
  is_nullable: 0

=head2 rel_from

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 rel_to

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 prefix

  data_type: 'char'
  is_nullable: 0
  size: 4

=cut

__PACKAGE__->add_columns(
  "mapping_session_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "type",
  {
    data_type => "enum",
    extra => { list => ["family", "tree"] },
    is_nullable => 1,
  },
  "when_mapped",
  {
    data_type => "timestamp",
    datetime_undef_if_invalid => 1,
    default_value => \"current_timestamp",
    is_nullable => 0,
  },
  "rel_from",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "rel_to",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "prefix",
  { data_type => "char", is_nullable => 0, size => 4 },
);

=head1 PRIMARY KEY

=over 4

=item * L</mapping_session_id>

=back

=cut

__PACKAGE__->set_primary_key("mapping_session_id");

=head1 UNIQUE CONSTRAINTS

=head2 C<type>

=over 4

=item * L</type>

=item * L</rel_from>

=item * L</rel_to>

=item * L</prefix>

=back

=cut

__PACKAGE__->add_unique_constraint("type", ["type", "rel_from", "rel_to", "prefix"]);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:7EjzpMy8Exo0E7rAk4VrOA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
