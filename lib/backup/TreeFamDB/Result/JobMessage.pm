use utf8;
package TreeFamDB::Result::JobMessage;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::JobMessage

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

=head1 TABLE: C<job_message>

=cut

__PACKAGE__->table("job_message");

=head1 ACCESSORS

=head2 job_message_id

  data_type: 'integer'
  is_auto_increment: 1
  is_nullable: 0

=head2 job_id

  data_type: 'integer'
  is_foreign_key: 1
  is_nullable: 0

=head2 worker_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_foreign_key: 1
  is_nullable: 0

=head2 time

  data_type: 'timestamp'
  datetime_undef_if_invalid: 1
  default_value: current_timestamp
  is_nullable: 0

=head2 retry

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 status

  data_type: 'enum'
  default_value: 'UNKNOWN'
  extra: {list => ["UNKNOWN","COMPILATION","GET_INPUT","RUN","WRITE_OUTPUT","PASSED_ON"]}
  is_nullable: 1

=head2 msg

  data_type: 'text'
  is_nullable: 1

=head2 is_error

  data_type: 'tinyint'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "job_message_id",
  { data_type => "integer", is_auto_increment => 1, is_nullable => 0 },
  "job_id",
  { data_type => "integer", is_foreign_key => 1, is_nullable => 0 },
  "worker_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_foreign_key => 1,
    is_nullable => 0,
  },
  "time",
  {
    data_type => "timestamp",
    datetime_undef_if_invalid => 1,
    default_value => \"current_timestamp",
    is_nullable => 0,
  },
  "retry",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "status",
  {
    data_type => "enum",
    default_value => "UNKNOWN",
    extra => {
      list => [
        "UNKNOWN",
        "COMPILATION",
        "GET_INPUT",
        "RUN",
        "WRITE_OUTPUT",
        "PASSED_ON",
      ],
    },
    is_nullable => 1,
  },
  "msg",
  { data_type => "text", is_nullable => 1 },
  "is_error",
  { data_type => "tinyint", is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</job_message_id>

=back

=cut

__PACKAGE__->set_primary_key("job_message_id");

=head1 RELATIONS

=head2 job

Type: belongs_to

Related object: L<TreeFamDB::Result::Job>

=cut

__PACKAGE__->belongs_to(
  "job",
  "TreeFamDB::Result::Job",
  { job_id => "job_id" },
  { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);

=head2 worker

Type: belongs_to

Related object: L<TreeFamDB::Result::Worker>

=cut

__PACKAGE__->belongs_to(
  "worker",
  "TreeFamDB::Result::Worker",
  { worker_id => "worker_id" },
  { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:03
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:cYOvUnl9Tv/OAlJlwN76EA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
