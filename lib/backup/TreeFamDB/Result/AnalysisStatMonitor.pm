use utf8;
package TreeFamDB::Result::AnalysisStatMonitor;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::AnalysisStatMonitor

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

=head1 TABLE: C<analysis_stats_monitor>

=cut

__PACKAGE__->table("analysis_stats_monitor");

=head1 ACCESSORS

=head2 time

  data_type: 'datetime'
  datetime_undef_if_invalid: 1
  default_value: '0000-00-00 00:00:00'
  is_nullable: 0

=head2 analysis_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_foreign_key: 1
  is_nullable: 0

=head2 status

  data_type: 'enum'
  default_value: 'READY'
  extra: {list => ["BLOCKED","LOADING","SYNCHING","READY","WORKING","ALL_CLAIMED","DONE","FAILED"]}
  is_nullable: 0

=head2 batch_size

  data_type: 'integer'
  default_value: 1
  is_nullable: 0

=head2 avg_msec_per_job

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 avg_input_msec_per_job

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 avg_run_msec_per_job

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 avg_output_msec_per_job

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 hive_capacity

  data_type: 'integer'
  default_value: 1
  is_nullable: 0

=head2 behaviour

  data_type: 'enum'
  default_value: 'STATIC'
  extra: {list => ["STATIC","DYNAMIC"]}
  is_nullable: 0

=head2 input_capacity

  data_type: 'integer'
  default_value: 4
  is_nullable: 0

=head2 output_capacity

  data_type: 'integer'
  default_value: 4
  is_nullable: 0

=head2 total_job_count

  data_type: 'integer'
  is_nullable: 0

=head2 unclaimed_job_count

  data_type: 'integer'
  is_nullable: 0

=head2 done_job_count

  data_type: 'integer'
  is_nullable: 0

=head2 max_retry_count

  data_type: 'integer'
  default_value: 3
  is_nullable: 0

=head2 failed_job_count

  data_type: 'integer'
  is_nullable: 0

=head2 failed_job_tolerance

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 num_running_workers

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 num_required_workers

  data_type: 'integer'
  is_nullable: 0

=head2 last_update

  data_type: 'datetime'
  datetime_undef_if_invalid: 1
  is_nullable: 0

=head2 sync_lock

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 rc_id

  data_type: 'integer'
  default_value: 0
  extra: {unsigned => 1}
  is_nullable: 0

=head2 can_be_empty

  data_type: 'tinyint'
  default_value: 0
  extra: {unsigned => 1}
  is_nullable: 0

=head2 priority

  data_type: 'tinyint'
  default_value: 0
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "time",
  {
    data_type => "datetime",
    datetime_undef_if_invalid => 1,
    default_value => "0000-00-00 00:00:00",
    is_nullable => 0,
  },
  "analysis_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_foreign_key => 1,
    is_nullable => 0,
  },
  "status",
  {
    data_type => "enum",
    default_value => "READY",
    extra => {
      list => [
        "BLOCKED",
        "LOADING",
        "SYNCHING",
        "READY",
        "WORKING",
        "ALL_CLAIMED",
        "DONE",
        "FAILED",
      ],
    },
    is_nullable => 0,
  },
  "batch_size",
  { data_type => "integer", default_value => 1, is_nullable => 0 },
  "avg_msec_per_job",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "avg_input_msec_per_job",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "avg_run_msec_per_job",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "avg_output_msec_per_job",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "hive_capacity",
  { data_type => "integer", default_value => 1, is_nullable => 0 },
  "behaviour",
  {
    data_type => "enum",
    default_value => "STATIC",
    extra => { list => ["STATIC", "DYNAMIC"] },
    is_nullable => 0,
  },
  "input_capacity",
  { data_type => "integer", default_value => 4, is_nullable => 0 },
  "output_capacity",
  { data_type => "integer", default_value => 4, is_nullable => 0 },
  "total_job_count",
  { data_type => "integer", is_nullable => 0 },
  "unclaimed_job_count",
  { data_type => "integer", is_nullable => 0 },
  "done_job_count",
  { data_type => "integer", is_nullable => 0 },
  "max_retry_count",
  { data_type => "integer", default_value => 3, is_nullable => 0 },
  "failed_job_count",
  { data_type => "integer", is_nullable => 0 },
  "failed_job_tolerance",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "num_running_workers",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "num_required_workers",
  { data_type => "integer", is_nullable => 0 },
  "last_update",
  {
    data_type => "datetime",
    datetime_undef_if_invalid => 1,
    is_nullable => 0,
  },
  "sync_lock",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "rc_id",
  {
    data_type => "integer",
    default_value => 0,
    extra => { unsigned => 1 },
    is_nullable => 0,
  },
  "can_be_empty",
  {
    data_type => "tinyint",
    default_value => 0,
    extra => { unsigned => 1 },
    is_nullable => 0,
  },
  "priority",
  { data_type => "tinyint", default_value => 0, is_nullable => 0 },
);

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


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:03
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:ljXZBLxDjee5KrURwzTfXQ


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
