use utf8;
package TreeFamDB::Result::AnalysisDescription;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::AnalysisDescription

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

=head1 TABLE: C<analysis_description>

=cut

__PACKAGE__->table("analysis_description");

=head1 ACCESSORS

=head2 analysis_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_foreign_key: 1
  is_nullable: 0

=head2 description

  data_type: 'text'
  is_nullable: 1

=head2 display_label

  data_type: 'varchar'
  is_nullable: 1
  size: 255

=head2 displayable

  data_type: 'tinyint'
  default_value: 1
  is_nullable: 0

=head2 web_data

  data_type: 'text'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "analysis_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_foreign_key => 1,
    is_nullable => 0,
  },
  "description",
  { data_type => "text", is_nullable => 1 },
  "display_label",
  { data_type => "varchar", is_nullable => 1, size => 255 },
  "displayable",
  { data_type => "tinyint", default_value => 1, is_nullable => 0 },
  "web_data",
  { data_type => "text", is_nullable => 1 },
);

=head1 UNIQUE CONSTRAINTS

=head2 C<analysis_idx>

=over 4

=item * L</analysis_id>

=back

=cut

__PACKAGE__->add_unique_constraint("analysis_idx", ["analysis_id"]);

=head1 RELATIONS

=head2 analysis

Type: belongs_to

Related object: L<TreeFamDB::Result::Analysis>

=cut

__PACKAGE__->belongs_to(
  "analysis",
  "TreeFamDB::Result::Analysis",
  { analysis_id => "analysis_id" },
  { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:02
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:JJbDW4PDe/2d30wZy75z2Q


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
