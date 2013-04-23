use utf8;
package TreeFamDB::Result::LrIndexOffset;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::LrIndexOffset

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

=head1 TABLE: C<lr_index_offset>

=cut

__PACKAGE__->table("lr_index_offset");

=head1 ACCESSORS

=head2 lr_index_offset_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 table_name

  data_type: 'varchar'
  is_nullable: 0
  size: 64

=head2 lr_index

  data_type: 'integer'
  default_value: 0
  extra: {unsigned => 1}
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "lr_index_offset_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "table_name",
  { data_type => "varchar", is_nullable => 0, size => 64 },
  "lr_index",
  {
    data_type => "integer",
    default_value => 0,
    extra => { unsigned => 1 },
    is_nullable => 1,
  },
);

=head1 PRIMARY KEY

=over 4

=item * L</lr_index_offset_id>

=back

=cut

__PACKAGE__->set_primary_key("lr_index_offset_id");

=head1 UNIQUE CONSTRAINTS

=head2 C<table_name>

=over 4

=item * L</table_name>

=back

=cut

__PACKAGE__->add_unique_constraint("table_name", ["table_name"]);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-15 16:32:46
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:5MGkEEA/I8RBk8IUzGIN7Q


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
