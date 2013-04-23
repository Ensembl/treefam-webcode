use utf8;
package TreeFamDB::Result::DomainMember;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::DomainMember

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

=head1 TABLE: C<domain_member>

=cut

__PACKAGE__->table("domain_member");

=head1 ACCESSORS

=head2 domain_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 member_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 member_start

  data_type: 'integer'
  is_nullable: 1

=head2 member_end

  data_type: 'integer'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "domain_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "member_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "member_start",
  { data_type => "integer", is_nullable => 1 },
  "member_end",
  { data_type => "integer", is_nullable => 1 },
);

=head1 UNIQUE CONSTRAINTS

=head2 C<domain_id>

=over 4

=item * L</domain_id>

=item * L</member_id>

=item * L</member_start>

=item * L</member_end>

=back

=cut

__PACKAGE__->add_unique_constraint(
  "domain_id",
  ["domain_id", "member_id", "member_start", "member_end"],
);

=head2 C<member_id>

=over 4

=item * L</member_id>

=item * L</domain_id>

=item * L</member_start>

=item * L</member_end>

=back

=cut

__PACKAGE__->add_unique_constraint(
  "member_id",
  ["member_id", "domain_id", "member_start", "member_end"],
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:+Q8vpy+bLn4bNg1lddI2Dw


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
