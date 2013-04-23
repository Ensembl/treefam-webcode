use utf8;
package TreeFamDB::Result::Job;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::Job

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

=head1 TABLE: C<job>

=cut

__PACKAGE__->table("job");

=head1 ACCESSORS

=head2 job_id

  data_type: 'integer'
  is_auto_increment: 1
  is_nullable: 0

=head2 prev_job_id

  data_type: 'integer'
  is_foreign_key: 1
  is_nullable: 1

=head2 analysis_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_foreign_key: 1
  is_nullable: 0

=head2 input_id

  data_type: 'char'
  is_nullable: 0
  size: 255

=head2 worker_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_foreign_key: 1
  is_nullable: 1

=head2 status

  data_type: 'enum'
  default_value: 'READY'
  extra: {list => ["READY","BLOCKED","CLAIMED","COMPILATION","GET_INPUT","RUN","WRITE_OUTPUT","DONE","FAILED","PASSED_ON"]}
  is_nullable: 0

=head2 retry_count

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 completed

  data_type: 'datetime'
  datetime_undef_if_invalid: 1
  is_nullable: 1

=head2 runtime_msec

  data_type: 'integer'
  is_nullable: 1

=head2 query_count

  data_type: 'integer'
  is_nullable: 1

=head2 semaphore_count

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 semaphored_job_id

  data_type: 'integer'
  is_foreign_key: 1
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "job_id",
  { data_type => "integer", is_auto_increment => 1, is_nullable => 0 },
  "prev_job_id",
  { data_type => "integer", is_foreign_key => 1, is_nullable => 1 },
  "analysis_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_foreign_key => 1,
    is_nullable => 0,
  },
  "input_id",
  { data_type => "char", is_nullable => 0, size => 255 },
  "worker_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_foreign_key => 1,
    is_nullable => 1,
  },
  "status",
  {
    data_type => "enum",
    default_value => "READY",
    extra => {
      list => [
        "READY",
        "BLOCKED",
        "CLAIMED",
        "COMPILATION",
        "GET_INPUT",
        "RUN",
        "WRITE_OUTPUT",
        "DONE",
        "FAILED",
        "PASSED_ON",
      ],
    },
    is_nullable => 0,
  },
  "retry_count",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "completed",
  {
    data_type => "datetime",
    datetime_undef_if_invalid => 1,
    is_nullable => 1,
  },
  "runtime_msec",
  { data_type => "integer", is_nullable => 1 },
  "query_count",
  { data_type => "integer", is_nullable => 1 },
  "semaphore_count",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "semaphored_job_id",
  { data_type => "integer", is_foreign_key => 1, is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</job_id>

=back

=cut

__PACKAGE__->set_primary_key("job_id");

=head1 UNIQUE CONSTRAINTS

=head2 C<input_id_analysis>

=over 4

=item * L</input_id>

=item * L</analysis_id>

=back

=cut

__PACKAGE__->add_unique_constraint("input_id_analysis", ["input_id", "analysis_id"]);

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

=head2 job_files

Type: has_many

Related object: L<TreeFamDB::Result::JobFile>

=cut

__PACKAGE__->has_many(
  "job_files",
  "TreeFamDB::Result::JobFile",
  { "foreign.job_id" => "self.job_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 job_messages

Type: has_many

Related object: L<TreeFamDB::Result::JobMessage>

=cut

__PACKAGE__->has_many(
  "job_messages",
  "TreeFamDB::Result::JobMessage",
  { "foreign.job_id" => "self.job_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 job_prev_jobs

Type: has_many

Related object: L<TreeFamDB::Result::Job>

=cut

__PACKAGE__->has_many(
  "job_prev_jobs",
  "TreeFamDB::Result::Job",
  { "foreign.prev_job_id" => "self.job_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 job_semaphored_jobs

Type: has_many

Related object: L<TreeFamDB::Result::Job>

=cut

__PACKAGE__->has_many(
  "job_semaphored_jobs",
  "TreeFamDB::Result::Job",
  { "foreign.semaphored_job_id" => "self.job_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 prev_job

Type: belongs_to

Related object: L<TreeFamDB::Result::Job>

=cut

__PACKAGE__->belongs_to(
  "prev_job",
  "TreeFamDB::Result::Job",
  { job_id => "prev_job_id" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);

=head2 semaphored_job

Type: belongs_to

Related object: L<TreeFamDB::Result::Job>

=cut

__PACKAGE__->belongs_to(
  "semaphored_job",
  "TreeFamDB::Result::Job",
  { job_id => "semaphored_job_id" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);

=head2 worker

Type: belongs_to

Related object: L<TreeFamDB::Result::Worker>

=cut

__PACKAGE__->belongs_to(
  "worker",
  "TreeFamDB::Result::Worker",
  { worker_id => "worker_id" },
  {
    is_deferrable => 1,
    join_type     => "LEFT",
    on_delete     => "CASCADE",
    on_update     => "CASCADE",
  },
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:03
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:hy58qDDWZXJQaEUVNpB82Q


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
