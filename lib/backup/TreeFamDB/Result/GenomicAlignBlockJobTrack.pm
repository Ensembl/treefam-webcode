use utf8;
package TreeFamDB::Result::GenomicAlignBlockJobTrack;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::GenomicAlignBlockJobTrack

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

=head1 TABLE: C<genomic_align_block_job_track>

=cut

__PACKAGE__->table("genomic_align_block_job_track");

=head1 ACCESSORS

=head2 genomic_align_block_id

  data_type: 'bigint'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 analysis_job_id

  data_type: 'integer'
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "genomic_align_block_id",
  { data_type => "bigint", extra => { unsigned => 1 }, is_nullable => 0 },
  "analysis_job_id",
  { data_type => "integer", is_nullable => 0 },
);

=head1 UNIQUE CONSTRAINTS

=head2 C<genomic_align_block_id>

=over 4

=item * L</genomic_align_block_id>

=item * L</analysis_job_id>

=back

=cut

__PACKAGE__->add_unique_constraint(
  "genomic_align_block_id",
  ["genomic_align_block_id", "analysis_job_id"],
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:03
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:Na2UxjZtsVDxxI5Z1DKu5g


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
