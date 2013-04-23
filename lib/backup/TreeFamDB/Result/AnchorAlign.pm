use utf8;
package TreeFamDB::Result::AnchorAlign;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::AnchorAlign

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

=head1 TABLE: C<anchor_align>

=cut

__PACKAGE__->table("anchor_align");

=head1 ACCESSORS

=head2 anchor_align_id

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

=head2 dnafrag_start

  data_type: 'integer'
  is_nullable: 1

=head2 dnafrag_end

  data_type: 'integer'
  is_nullable: 1

=head2 dnafrag_strand

  data_type: 'tinyint'
  is_nullable: 1

=head2 score

  data_type: 'float'
  is_nullable: 1

=head2 num_of_organisms

  data_type: 'smallint'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 num_of_sequences

  data_type: 'smallint'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 evalue

  data_type: 'varchar'
  is_nullable: 1
  size: 10

=head2 anchor_status

  data_type: 'integer'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "anchor_align_id",
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
  "dnafrag_start",
  { data_type => "integer", is_nullable => 1 },
  "dnafrag_end",
  { data_type => "integer", is_nullable => 1 },
  "dnafrag_strand",
  { data_type => "tinyint", is_nullable => 1 },
  "score",
  { data_type => "float", is_nullable => 1 },
  "num_of_organisms",
  { data_type => "smallint", extra => { unsigned => 1 }, is_nullable => 1 },
  "num_of_sequences",
  { data_type => "smallint", extra => { unsigned => 1 }, is_nullable => 1 },
  "evalue",
  { data_type => "varchar", is_nullable => 1, size => 10 },
  "anchor_status",
  { data_type => "integer", is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</anchor_align_id>

=back

=cut

__PACKAGE__->set_primary_key("anchor_align_id");


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:03
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:1WMdfvtCG1NY8dICnoYHSA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
