use utf8;
package TreeFamDB::Result::GenomicAlignBlock;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::GenomicAlignBlock

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

=head1 TABLE: C<genomic_align_block>

=cut

__PACKAGE__->table("genomic_align_block");

=head1 ACCESSORS

=head2 genomic_align_block_id

  data_type: 'bigint'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 method_link_species_set_id

  data_type: 'integer'
  default_value: 0
  extra: {unsigned => 1}
  is_nullable: 0

=head2 score

  data_type: 'double precision'
  is_nullable: 1

=head2 perc_id

  data_type: 'tinyint'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 length

  data_type: 'integer'
  is_nullable: 1

=head2 group_id

  data_type: 'bigint'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 level_id

  data_type: 'tinyint'
  default_value: 0
  extra: {unsigned => 1}
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "genomic_align_block_id",
  {
    data_type => "bigint",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "method_link_species_set_id",
  {
    data_type => "integer",
    default_value => 0,
    extra => { unsigned => 1 },
    is_nullable => 0,
  },
  "score",
  { data_type => "double precision", is_nullable => 1 },
  "perc_id",
  { data_type => "tinyint", extra => { unsigned => 1 }, is_nullable => 1 },
  "length",
  { data_type => "integer", is_nullable => 1 },
  "group_id",
  { data_type => "bigint", extra => { unsigned => 1 }, is_nullable => 1 },
  "level_id",
  {
    data_type => "tinyint",
    default_value => 0,
    extra => { unsigned => 1 },
    is_nullable => 0,
  },
);

=head1 PRIMARY KEY

=over 4

=item * L</genomic_align_block_id>

=back

=cut

__PACKAGE__->set_primary_key("genomic_align_block_id");


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:ryGqIoA1R4qntF46NAi5VA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
