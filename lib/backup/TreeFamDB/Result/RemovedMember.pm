use utf8;
package TreeFamDB::Result::RemovedMember;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::RemovedMember

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

=head1 TABLE: C<removed_member>

=cut

__PACKAGE__->table("removed_member");

=head1 ACCESSORS

=head2 removed_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 node_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 stable_id

  data_type: 'varchar'
  is_nullable: 0
  size: 128

=head2 genome_db_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "removed_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "node_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "stable_id",
  { data_type => "varchar", is_nullable => 0, size => 128 },
  "genome_db_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</removed_id>

=back

=cut

__PACKAGE__->set_primary_key("removed_id");

=head1 UNIQUE CONSTRAINTS

=head2 C<stable_id>

=over 4

=item * L</stable_id>

=back

=cut

__PACKAGE__->add_unique_constraint("stable_id", ["stable_id"]);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:05
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:JlEHcryqH8ZE7zdT0zU/9Q


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
