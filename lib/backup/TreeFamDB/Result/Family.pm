use utf8;
package TreeFamDB::Result::Family;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::Family

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

=head1 TABLE: C<family>

=cut

__PACKAGE__->table("family");

=head1 ACCESSORS

=head2 family_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 stable_id

  data_type: 'varchar'
  is_nullable: 0
  size: 40

=head2 version

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 method_link_species_set_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 description

  data_type: 'varchar'
  is_nullable: 1
  size: 255

=head2 description_score

  data_type: 'double precision'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "family_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "stable_id",
  { data_type => "varchar", is_nullable => 0, size => 40 },
  "version",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "method_link_species_set_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "description",
  { data_type => "varchar", is_nullable => 1, size => 255 },
  "description_score",
  { data_type => "double precision", is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</family_id>

=back

=cut

__PACKAGE__->set_primary_key("family_id");

=head1 UNIQUE CONSTRAINTS

=head2 C<stable_id>

=over 4

=item * L</stable_id>

=back

=cut

__PACKAGE__->add_unique_constraint("stable_id", ["stable_id"]);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:w7xO7U+z+cAoveD4AL+qvA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
