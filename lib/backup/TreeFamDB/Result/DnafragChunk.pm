use utf8;
package TreeFamDB::Result::DnafragChunk;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::DnafragChunk

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

=head1 TABLE: C<dnafrag_chunk>

=cut

__PACKAGE__->table("dnafrag_chunk");

=head1 ACCESSORS

=head2 dnafrag_chunk_id

  data_type: 'integer'
  is_auto_increment: 1
  is_nullable: 0

=head2 dnafrag_id

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 seq_start

  data_type: 'integer'
  default_value: 0
  extra: {unsigned => 1}
  is_nullable: 0

=head2 seq_end

  data_type: 'integer'
  default_value: 0
  extra: {unsigned => 1}
  is_nullable: 0

=head2 method_link_species_set_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 masking_tag_name

  data_type: 'varchar'
  is_nullable: 1
  size: 50

=head2 sequence_id

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "dnafrag_chunk_id",
  { data_type => "integer", is_auto_increment => 1, is_nullable => 0 },
  "dnafrag_id",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "seq_start",
  {
    data_type => "integer",
    default_value => 0,
    extra => { unsigned => 1 },
    is_nullable => 0,
  },
  "seq_end",
  {
    data_type => "integer",
    default_value => 0,
    extra => { unsigned => 1 },
    is_nullable => 0,
  },
  "method_link_species_set_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "masking_tag_name",
  { data_type => "varchar", is_nullable => 1, size => 50 },
  "sequence_id",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
);

=head1 PRIMARY KEY

=over 4

=item * L</dnafrag_chunk_id>

=back

=cut

__PACKAGE__->set_primary_key("dnafrag_chunk_id");

=head1 UNIQUE CONSTRAINTS

=head2 C<uniq_chunk>

=over 4

=item * L</dnafrag_id>

=item * L</seq_start>

=item * L</seq_end>

=item * L</method_link_species_set_id>

=item * L</masking_tag_name>

=back

=cut

__PACKAGE__->add_unique_constraint(
  "uniq_chunk",
  [
    "dnafrag_id",
    "seq_start",
    "seq_end",
    "method_link_species_set_id",
    "masking_tag_name",
  ],
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:03
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:KX/4d/Ui0gqru/ygnewP1A


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
