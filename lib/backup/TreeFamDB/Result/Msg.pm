use utf8;
package TreeFamDB::Result::Msg;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::Msg - VIEW

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

=head1 TABLE: C<msg>

=cut

__PACKAGE__->table("msg");

=head1 ACCESSORS

=head2 analysis_id

  data_type: 'integer'
  default_value: 0
  extra: {unsigned => 1}
  is_nullable: 0

=head2 logic_name

  data_type: 'varchar'
  is_nullable: 0
  size: 40

=head2 job_message_id

  data_type: 'integer'
  default_value: 0
  is_nullable: 0

=head2 job_id

  data_type: 'integer'
  is_nullable: 0

=head2 worker_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 time

  data_type: 'timestamp'
  datetime_undef_if_invalid: 1
  default_value: '0000-00-00 00:00:00'
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
  "analysis_id",
  {
    data_type => "integer",
    default_value => 0,
    extra => { unsigned => 1 },
    is_nullable => 0,
  },
  "logic_name",
  { data_type => "varchar", is_nullable => 0, size => 40 },
  "job_message_id",
  { data_type => "integer", default_value => 0, is_nullable => 0 },
  "job_id",
  { data_type => "integer", is_nullable => 0 },
  "worker_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "time",
  {
    data_type => "timestamp",
    datetime_undef_if_invalid => 1,
    default_value => "0000-00-00 00:00:00",
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


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:04
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:SKg35qSDdQ5IepcLvic9fQ


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
