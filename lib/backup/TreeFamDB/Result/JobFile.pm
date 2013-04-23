use utf8;
package TreeFamDB::Result::JobFile;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::JobFile

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

=head1 TABLE: C<job_file>

=cut

__PACKAGE__->table("job_file");

=head1 ACCESSORS

=head2 job_id

  data_type: 'integer'
  is_foreign_key: 1
  is_nullable: 0

=head2 worker_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_foreign_key: 1
  is_nullable: 0

=head2 retry

  data_type: 'integer'
  is_nullable: 0

=head2 type

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 0
  size: 16

=head2 path

  data_type: 'varchar'
  is_nullable: 0
  size: 255

=cut

__PACKAGE__->add_columns(
  "job_id",
  { data_type => "integer", is_foreign_key => 1, is_nullable => 0 },
  "worker_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_foreign_key => 1,
    is_nullable => 0,
  },
  "retry",
  { data_type => "integer", is_nullable => 0 },
  "type",
  { data_type => "varchar", default_value => "", is_nullable => 0, size => 16 },
  "path",
  { data_type => "varchar", is_nullable => 0, size => 255 },
);

=head1 UNIQUE CONSTRAINTS

=head2 C<job_worker_type>

=over 4

=item * L</job_id>

=item * L</worker_id>

=item * L</type>

=back

=cut

__PACKAGE__->add_unique_constraint("job_worker_type", ["job_id", "worker_id", "type"]);

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
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:A8FpC4bMyfIRYrsL99B1eg


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
