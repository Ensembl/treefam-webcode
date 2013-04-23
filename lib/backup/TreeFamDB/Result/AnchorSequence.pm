use utf8;
package TreeFamDB::Result::AnchorSequence;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::AnchorSequence

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

=head1 TABLE: C<anchor_sequence>

=cut

__PACKAGE__->table("anchor_sequence");

=head1 ACCESSORS

=head2 anchor_seq_id

  data_type: 'bigint'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 method_link_species_set_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 anchor_id

  data_type: 'bigint'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 dnafrag_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 start

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 end

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 strand

  data_type: 'tinyint'
  default_value: 0
  is_nullable: 1

=head2 sequence

  accessor: 'column_sequence'
  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 1
  size: 250

=head2 length

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "anchor_seq_id",
  {
    data_type => "bigint",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "method_link_species_set_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "anchor_id",
  { data_type => "bigint", extra => { unsigned => 1 }, is_nullable => 1 },
  "dnafrag_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "start",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "end",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "strand",
  { data_type => "tinyint", default_value => 0, is_nullable => 1 },
  "sequence",
  {
    accessor => "column_sequence",
    data_type => "varchar",
    default_value => "",
    is_nullable => 1,
    size => 250,
  },
  "length",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</anchor_seq_id>

=back

=cut

__PACKAGE__->set_primary_key("anchor_seq_id");


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:03
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:qEnJ+6jjNqEcJqXl3Ob4lA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
