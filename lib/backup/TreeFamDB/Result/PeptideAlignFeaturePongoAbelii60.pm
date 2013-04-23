use utf8;
package TreeFamDB::Result::PeptideAlignFeaturePongoAbelii60;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::PeptideAlignFeaturePongoAbelii60

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

=head1 TABLE: C<peptide_align_feature_pongo_abelii_60>

=cut

__PACKAGE__->table("peptide_align_feature_pongo_abelii_60");

=head1 ACCESSORS

=head2 peptide_align_feature_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 qmember_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 hmember_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 qgenome_db_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 hgenome_db_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 analysis_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 qstart

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 qend

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 hstart

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 hend

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 score

  data_type: 'double precision'
  default_value: 0.0000
  is_nullable: 0
  size: [16,4]

=head2 evalue

  data_type: 'double precision'
  is_nullable: 1

=head2 align_length

  data_type: 'integer'
  is_nullable: 1

=head2 identical_matches

  data_type: 'integer'
  is_nullable: 1

=head2 perc_ident

  data_type: 'integer'
  is_nullable: 1

=head2 positive_matches

  data_type: 'integer'
  is_nullable: 1

=head2 perc_pos

  data_type: 'integer'
  is_nullable: 1

=head2 hit_rank

  data_type: 'integer'
  is_nullable: 1

=head2 cigar_line

  data_type: 'mediumtext'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "peptide_align_feature_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "qmember_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "hmember_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "qgenome_db_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "hgenome_db_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "analysis_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "qstart",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "qend",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "hstart",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "hend",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "score",
  {
    data_type => "double precision",
    default_value => "0.0000",
    is_nullable => 0,
    size => [16, 4],
  },
  "evalue",
  { data_type => "double precision", is_nullable => 1 },
  "align_length",
  { data_type => "integer", is_nullable => 1 },
  "identical_matches",
  { data_type => "integer", is_nullable => 1 },
  "perc_ident",
  { data_type => "integer", is_nullable => 1 },
  "positive_matches",
  { data_type => "integer", is_nullable => 1 },
  "perc_pos",
  { data_type => "integer", is_nullable => 1 },
  "hit_rank",
  { data_type => "integer", is_nullable => 1 },
  "cigar_line",
  { data_type => "mediumtext", is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</peptide_align_feature_id>

=back

=cut

__PACKAGE__->set_primary_key("peptide_align_feature_id");


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:04
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:SL76FXGNNzgl6TuBo25Xyg


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
