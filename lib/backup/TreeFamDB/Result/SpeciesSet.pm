use utf8;
package TreeFamDB::Result::SpeciesSet;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::SpeciesSet

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

=head1 TABLE: C<species_set>

=cut

__PACKAGE__->table("species_set");

=head1 ACCESSORS

=head2 species_set_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 genome_db_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "species_set_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "genome_db_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
);

=head1 UNIQUE CONSTRAINTS

=head2 C<species_set_id>

=over 4

=item * L</species_set_id>

=item * L</genome_db_id>

=back

=cut

__PACKAGE__->add_unique_constraint("species_set_id", ["species_set_id", "genome_db_id"]);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:05
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:zWxEsRapi9D58lgO/VGo3w


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
