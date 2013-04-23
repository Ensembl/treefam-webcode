use utf8;
package TreeFamDB::Result::ConstrainedElement;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::ConstrainedElement

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

=head1 TABLE: C<constrained_element>

=cut

__PACKAGE__->table("constrained_element");

=head1 ACCESSORS

=head2 constrained_element_id

  data_type: 'bigint'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 dnafrag_id

  data_type: 'bigint'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 dnafrag_start

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 dnafrag_end

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 dnafrag_strand

  data_type: 'integer'
  is_nullable: 1

=head2 method_link_species_set_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 p_value

  data_type: 'double precision'
  is_nullable: 1

=head2 score

  data_type: 'double precision'
  default_value: 0
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "constrained_element_id",
  { data_type => "bigint", extra => { unsigned => 1 }, is_nullable => 0 },
  "dnafrag_id",
  { data_type => "bigint", extra => { unsigned => 1 }, is_nullable => 0 },
  "dnafrag_start",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "dnafrag_end",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "dnafrag_strand",
  { data_type => "integer", is_nullable => 1 },
  "method_link_species_set_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "p_value",
  { data_type => "double precision", is_nullable => 1 },
  "score",
  { data_type => "double precision", default_value => 0, is_nullable => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:HeU/1LZm7t16OouneJT4Jw


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
