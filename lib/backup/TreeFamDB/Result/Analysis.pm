use utf8;
package TreeFamDB::Result::Analysis;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::Analysis

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

=head1 TABLE: C<analysis>

=cut

__PACKAGE__->table("analysis");

=head1 ACCESSORS

=head2 analysis_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 created

  data_type: 'datetime'
  datetime_undef_if_invalid: 1
  default_value: '0000-00-00 00:00:00'
  is_nullable: 0

=head2 logic_name

  data_type: 'varchar'
  is_nullable: 0
  size: 40

=head2 db

  data_type: 'varchar'
  is_nullable: 1
  size: 120

=head2 db_version

  data_type: 'varchar'
  is_nullable: 1
  size: 40

=head2 db_file

  data_type: 'varchar'
  is_nullable: 1
  size: 255

=head2 program

  data_type: 'varchar'
  is_nullable: 1
  size: 255

=head2 program_version

  data_type: 'varchar'
  is_nullable: 1
  size: 40

=head2 program_file

  data_type: 'varchar'
  is_nullable: 1
  size: 255

=head2 parameters

  data_type: 'text'
  is_nullable: 1

=head2 module

  data_type: 'varchar'
  is_nullable: 1
  size: 255

=head2 module_version

  data_type: 'varchar'
  is_nullable: 1
  size: 40

=head2 gff_source

  data_type: 'varchar'
  is_nullable: 1
  size: 40

=head2 gff_feature

  data_type: 'varchar'
  is_nullable: 1
  size: 40

=cut

__PACKAGE__->add_columns(
  "analysis_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "created",
  {
    data_type => "datetime",
    datetime_undef_if_invalid => 1,
    default_value => "0000-00-00 00:00:00",
    is_nullable => 0,
  },
  "logic_name",
  { data_type => "varchar", is_nullable => 0, size => 40 },
  "db",
  { data_type => "varchar", is_nullable => 1, size => 120 },
  "db_version",
  { data_type => "varchar", is_nullable => 1, size => 40 },
  "db_file",
  { data_type => "varchar", is_nullable => 1, size => 255 },
  "program",
  { data_type => "varchar", is_nullable => 1, size => 255 },
  "program_version",
  { data_type => "varchar", is_nullable => 1, size => 40 },
  "program_file",
  { data_type => "varchar", is_nullable => 1, size => 255 },
  "parameters",
  { data_type => "text", is_nullable => 1 },
  "module",
  { data_type => "varchar", is_nullable => 1, size => 255 },
  "module_version",
  { data_type => "varchar", is_nullable => 1, size => 40 },
  "gff_source",
  { data_type => "varchar", is_nullable => 1, size => 40 },
  "gff_feature",
  { data_type => "varchar", is_nullable => 1, size => 40 },
);

=head1 PRIMARY KEY

=over 4

=item * L</analysis_id>

=back

=cut

__PACKAGE__->set_primary_key("analysis_id");

=head1 UNIQUE CONSTRAINTS

=head2 C<logic_name>

=over 4

=item * L</logic_name>

=back

=cut

__PACKAGE__->add_unique_constraint("logic_name", ["logic_name"]);

=head1 RELATIONS

=head2 analysis_ctrl_rules

Type: has_many

Related object: L<TreeFamDB::Result::AnalysisCtrlRule>

=cut

__PACKAGE__->has_many(
  "analysis_ctrl_rules",
  "TreeFamDB::Result::AnalysisCtrlRule",
  { "foreign.ctrled_analysis_id" => "self.analysis_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 analysis_description

Type: might_have

Related object: L<TreeFamDB::Result::AnalysisDescription>

=cut

__PACKAGE__->might_have(
  "analysis_description",
  "TreeFamDB::Result::AnalysisDescription",
  { "foreign.analysis_id" => "self.analysis_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 analysis_stat

Type: might_have

Related object: L<TreeFamDB::Result::AnalysisStat>

=cut

__PACKAGE__->might_have(
  "analysis_stat",
  "TreeFamDB::Result::AnalysisStat",
  { "foreign.analysis_id" => "self.analysis_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 analysis_stats_monitor

Type: has_many

Related object: L<TreeFamDB::Result::AnalysisStatMonitor>

=cut

__PACKAGE__->has_many(
  "analysis_stats_monitor",
  "TreeFamDB::Result::AnalysisStatMonitor",
  { "foreign.analysis_id" => "self.analysis_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 dataflow_rules

Type: has_many

Related object: L<TreeFamDB::Result::DataflowRule>

=cut

__PACKAGE__->has_many(
  "dataflow_rules",
  "TreeFamDB::Result::DataflowRule",
  { "foreign.from_analysis_id" => "self.analysis_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 jobs

Type: has_many

Related object: L<TreeFamDB::Result::Job>

=cut

__PACKAGE__->has_many(
  "jobs",
  "TreeFamDB::Result::Job",
  { "foreign.analysis_id" => "self.analysis_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 workers

Type: has_many

Related object: L<TreeFamDB::Result::Worker>

=cut

__PACKAGE__->has_many(
  "workers",
  "TreeFamDB::Result::Worker",
  { "foreign.analysis_id" => "self.analysis_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:02
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:OMhUQ+dBVD1QFIpy4Mbw2Q


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
