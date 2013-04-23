use utf8;
package TreeFamDB::Result::CafeTree;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::CafeTree

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

=head1 TABLE: C<CAFE_tree>

=cut

__PACKAGE__->table("CAFE_tree");

=head1 ACCESSORS

=head2 root_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 method_link_species_set_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 species_tree

  data_type: 'mediumtext'
  is_nullable: 0

=head2 lambdas

  data_type: 'varchar'
  is_nullable: 1
  size: 100

=head2 p_value_lim

  data_type: 'double precision'
  is_nullable: 1
  size: [5,4]

=cut

__PACKAGE__->add_columns(
  "root_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "method_link_species_set_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "species_tree",
  { data_type => "mediumtext", is_nullable => 0 },
  "lambdas",
  { data_type => "varchar", is_nullable => 1, size => 100 },
  "p_value_lim",
  { data_type => "double precision", is_nullable => 1, size => [5, 4] },
);

=head1 PRIMARY KEY

=over 4

=item * L</root_id>

=back

=cut

__PACKAGE__->set_primary_key("root_id");


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:aydICuazKXgTfU3WIXGeWw


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
