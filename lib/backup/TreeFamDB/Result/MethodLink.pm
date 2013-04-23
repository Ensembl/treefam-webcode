use utf8;
package TreeFamDB::Result::MethodLink;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::MethodLink

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

=head1 TABLE: C<method_link>

=cut

__PACKAGE__->table("method_link");

=head1 ACCESSORS

=head2 method_link_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 type

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 0
  size: 50

=head2 class

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 0
  size: 50

=cut

__PACKAGE__->add_columns(
  "method_link_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "type",
  { data_type => "varchar", default_value => "", is_nullable => 0, size => 50 },
  "class",
  { data_type => "varchar", default_value => "", is_nullable => 0, size => 50 },
);

=head1 PRIMARY KEY

=over 4

=item * L</method_link_id>

=back

=cut

__PACKAGE__->set_primary_key("method_link_id");

=head1 UNIQUE CONSTRAINTS

=head2 C<type>

=over 4

=item * L</type>

=back

=cut

__PACKAGE__->add_unique_constraint("type", ["type"]);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:04
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:Uqx0AGrl9isGzI9YKsPS+w


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
