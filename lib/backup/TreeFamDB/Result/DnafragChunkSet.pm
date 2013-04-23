use utf8;
package TreeFamDB::Result::DnafragChunkSet;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::DnafragChunkSet

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

=head1 TABLE: C<dnafrag_chunk_set>

=cut

__PACKAGE__->table("dnafrag_chunk_set");

=head1 ACCESSORS

=head2 subset_id

  data_type: 'integer'
  is_nullable: 0

=head2 dnafrag_chunk_id

  data_type: 'integer'
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "subset_id",
  { data_type => "integer", is_nullable => 0 },
  "dnafrag_chunk_id",
  { data_type => "integer", is_nullable => 0 },
);

=head1 UNIQUE CONSTRAINTS

=head2 C<subset_id>

=over 4

=item * L</subset_id>

=item * L</dnafrag_chunk_id>

=back

=cut

__PACKAGE__->add_unique_constraint("subset_id", ["subset_id", "dnafrag_chunk_id"]);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:03
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:0ltiG/YguxWKHBouMIFkSw


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
