use utf8;
package TreeFamDB::Result::ConservationScore;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::ConservationScore

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

=head1 TABLE: C<conservation_score>

=cut

__PACKAGE__->table("conservation_score");

=head1 ACCESSORS

=head2 genomic_align_block_id

  data_type: 'bigint'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 window_size

  data_type: 'smallint'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 position

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 expected_score

  data_type: 'blob'
  is_nullable: 1

=head2 diff_score

  data_type: 'blob'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "genomic_align_block_id",
  { data_type => "bigint", extra => { unsigned => 1 }, is_nullable => 0 },
  "window_size",
  { data_type => "smallint", extra => { unsigned => 1 }, is_nullable => 0 },
  "position",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "expected_score",
  { data_type => "blob", is_nullable => 1 },
  "diff_score",
  { data_type => "blob", is_nullable => 1 },
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:G4gpi+2JmVtJ3PsvAktQ+A


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
