use utf8;
package TreeFamDB::Result::Progress;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::Progress - VIEW

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

=head1 TABLE: C<progress>

=cut

__PACKAGE__->table("progress");

=head1 ACCESSORS

=head2 analysis_name_and_id

  data_type: 'varchar'
  is_nullable: 1
  size: 52

=head2 status

  data_type: 'enum'
  default_value: 'READY'
  extra: {list => ["READY","BLOCKED","CLAIMED","COMPILATION","GET_INPUT","RUN","WRITE_OUTPUT","DONE","FAILED","PASSED_ON"]}
  is_nullable: 1

=head2 retry_count

  data_type: 'integer'
  default_value: 0
  is_nullable: 1

=head2 cnt

  data_type: 'bigint'
  default_value: 0
  is_nullable: 0

=head2 example_job_id

  data_type: 'integer'
  default_value: 0
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "analysis_name_and_id",
  { data_type => "varchar", is_nullable => 1, size => 52 },
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
    is_nullable => 1,
  },
  "retry_count",
  { data_type => "integer", default_value => 0, is_nullable => 1 },
  "cnt",
  { data_type => "bigint", default_value => 0, is_nullable => 0 },
  "example_job_id",
  { data_type => "integer", default_value => 0, is_nullable => 1 },
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:04
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:jmxwxjzXFPFFjQx5HRyghw


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
