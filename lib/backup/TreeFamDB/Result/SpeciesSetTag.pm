use utf8;
package TreeFamDB::Result::SpeciesSetTag;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::SpeciesSetTag

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

=head1 TABLE: C<species_set_tag>

=cut

__PACKAGE__->table("species_set_tag");

=head1 ACCESSORS

=head2 species_set_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 tag

  data_type: 'varchar'
  is_nullable: 0
  size: 50

=head2 value

  data_type: 'mediumtext'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "species_set_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "tag",
  { data_type => "varchar", is_nullable => 0, size => 50 },
  "value",
  { data_type => "mediumtext", is_nullable => 1 },
);

=head1 UNIQUE CONSTRAINTS

=head2 C<tag_species_set_id>

=over 4

=item * L</species_set_id>

=item * L</tag>

=back

=cut

__PACKAGE__->add_unique_constraint("tag_species_set_id", ["species_set_id", "tag"]);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-15 16:32:46
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:pOTr4q+FQmySH0SEB22s0w


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
