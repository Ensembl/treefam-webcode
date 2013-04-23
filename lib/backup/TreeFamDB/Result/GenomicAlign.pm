use utf8;
package TreeFamDB::Result::GenomicAlign;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::GenomicAlign

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

=head1 TABLE: C<genomic_align>

=cut

__PACKAGE__->table("genomic_align");

=head1 ACCESSORS

=head2 genomic_align_id

  data_type: 'bigint'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 genomic_align_block_id

  data_type: 'bigint'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 method_link_species_set_id

  data_type: 'integer'
  default_value: 0
  extra: {unsigned => 1}
  is_nullable: 0

=head2 dnafrag_id

  data_type: 'bigint'
  default_value: 0
  extra: {unsigned => 1}
  is_nullable: 0

=head2 dnafrag_start

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 dnafrag_end

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 dnafrag_strand

  data_type: 'tinyint'
  default_value: 0
  is_nullable: 0

=head2 cigar_line

  data_type: 'mediumtext'
  is_nullable: 1

=head2 visible

  data_type: 'tinyint'
  default_value: 1
  extra: {unsigned => 1}
  is_nullable: 0

=head2 node_id

  data_type: 'bigint'
  extra: {unsigned => 1}
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "genomic_align_id",
  {
    data_type => "bigint",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "genomic_align_block_id",
  { data_type => "bigint", extra => { unsigned => 1 }, is_nullable => 0 },
  "method_link_species_set_id",
  {
    data_type => "integer",
    default_value => 0,
    extra => { unsigned => 1 },
    is_nullable => 0,
  },
  "dnafrag_id",
  {
    data_type => "bigint",
    default_value => 0,
    extra => { unsigned => 1 },
    is_nullable => 0,
  },
  "dnafrag_start",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "dnafrag_end",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "dnafrag_strand",
  { data_type => "tinyint", default_value => 0, is_nullable => 0 },
  "cigar_line",
  { data_type => "mediumtext", is_nullable => 1 },
  "visible",
  {
    data_type => "tinyint",
    default_value => 1,
    extra => { unsigned => 1 },
    is_nullable => 0,
  },
  "node_id",
  { data_type => "bigint", extra => { unsigned => 1 }, is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</genomic_align_id>

=back

=cut

__PACKAGE__->set_primary_key("genomic_align_id");


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:bXmgwjD+zzxfUeEOYNMRvw


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
