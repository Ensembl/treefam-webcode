use utf8;
package TreeFamDB::Result::AnalysisCtrlRule;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::AnalysisCtrlRule

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

=head1 TABLE: C<analysis_ctrl_rule>

=cut

__PACKAGE__->table("analysis_ctrl_rule");

=head1 ACCESSORS

=head2 condition_analysis_url

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 0
  size: 255

=head2 ctrled_analysis_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_foreign_key: 1
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "condition_analysis_url",
  { data_type => "varchar", default_value => "", is_nullable => 0, size => 255 },
  "ctrled_analysis_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_foreign_key => 1,
    is_nullable => 0,
  },
);

=head1 UNIQUE CONSTRAINTS

=head2 C<condition_analysis_url>

=over 4

=item * L</condition_analysis_url>

=item * L</ctrled_analysis_id>

=back

=cut

__PACKAGE__->add_unique_constraint(
  "condition_analysis_url",
  ["condition_analysis_url", "ctrled_analysis_id"],
);

=head1 RELATIONS

=head2 ctrled_analysis

Type: belongs_to

Related object: L<TreeFamDB::Result::Analysis>

=cut

__PACKAGE__->belongs_to(
  "ctrled_analysis",
  "TreeFamDB::Result::Analysis",
  { analysis_id => "ctrled_analysis_id" },
  { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:02
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:WQDPuv7OcoFHq7cT3uf9MQ


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
