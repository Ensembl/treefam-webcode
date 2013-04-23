use utf8;
package TreeFamDB::Result::Worker;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::Worker

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

=head1 TABLE: C<worker>

=cut

__PACKAGE__->table("worker");

=head1 ACCESSORS

=head2 worker_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 analysis_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_foreign_key: 1
  is_nullable: 0

=head2 meadow_type

  data_type: 'enum'
  extra: {list => ["LSF","LOCAL"]}
  is_nullable: 0

=head2 meadow_name

  data_type: 'varchar'
  is_nullable: 1
  size: 40

=head2 host

  data_type: 'varchar'
  is_nullable: 1
  size: 40

=head2 process_id

  data_type: 'varchar'
  is_nullable: 1
  size: 40

=head2 work_done

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 status

  data_type: 'enum'
  default_value: 'READY'
  extra: {list => ["READY","COMPILATION","GET_INPUT","RUN","WRITE_OUTPUT","DEAD"]}
  is_nullable: 0

=head2 born

  data_type: 'timestamp'
  datetime_undef_if_invalid: 1
  default_value: current_timestamp
  is_nullable: 0

=head2 last_check_in

  data_type: 'datetime'
  datetime_undef_if_invalid: 1
  is_nullable: 0

=head2 died

  data_type: 'datetime'
  datetime_undef_if_invalid: 1
  is_nullable: 1

=head2 cause_of_death

  data_type: 'enum'
  default_value: (empty string)
  extra: {list => [",",",",",",",",",",",",",",",",","]}
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "worker_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "analysis_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_foreign_key => 1,
    is_nullable => 0,
  },
  "meadow_type",
  {
    data_type => "enum",
    extra => { list => ["LSF", "LOCAL"] },
    is_nullable => 0,
  },
  "meadow_name",
  { data_type => "varchar", is_nullable => 1, size => 40 },
  "host",
  { data_type => "varchar", is_nullable => 1, size => 40 },
  "process_id",
  { data_type => "varchar", is_nullable => 1, size => 40 },
  "work_done",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "status",
  {
    data_type => "enum",
    default_value => "READY",
    extra => {
      list => [
        "READY",
        "COMPILATION",
        "GET_INPUT",
        "RUN",
        "WRITE_OUTPUT",
        "DEAD",
      ],
    },
    is_nullable => 0,
  },
  "born",
  {
    data_type => "timestamp",
    datetime_undef_if_invalid => 1,
    default_value => \"current_timestamp",
    is_nullable => 0,
  },
  "last_check_in",
  {
    data_type => "datetime",
    datetime_undef_if_invalid => 1,
    is_nullable => 0,
  },
  "died",
  {
    data_type => "datetime",
    datetime_undef_if_invalid => 1,
    is_nullable => 1,
  },
  "cause_of_death",
  {
    data_type => "enum",
    default_value => "",
    extra => { list => [",", ",", ",", ",", ",", ",", ",", ",", ","] },
    is_nullable => 0,
  },
);

=head1 PRIMARY KEY

=over 4

=item * L</worker_id>

=back

=cut

__PACKAGE__->set_primary_key("worker_id");

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
  { "foreign.worker_id" => "self.worker_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 job_messages

Type: has_many

Related object: L<TreeFamDB::Result::JobMessage>

=cut

__PACKAGE__->has_many(
  "job_messages",
  "TreeFamDB::Result::JobMessage",
  { "foreign.worker_id" => "self.worker_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);

=head2 jobs

Type: has_many

Related object: L<TreeFamDB::Result::Job>

=cut

__PACKAGE__->has_many(
  "jobs",
  "TreeFamDB::Result::Job",
  { "foreign.worker_id" => "self.worker_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:05
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:TTCsyV8bTr9sqqKBrWVG1g


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
