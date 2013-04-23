use utf8;
package TreeFamDB::Result::Domain;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::Domain

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

=head1 TABLE: C<domain>

=cut

__PACKAGE__->table("domain");

=head1 ACCESSORS

=head2 domain_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 stable_id

  data_type: 'varchar'
  is_nullable: 0
  size: 40

=head2 method_link_species_set_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 description

  data_type: 'varchar'
  is_nullable: 1
  size: 255

=cut

__PACKAGE__->add_columns(
  "domain_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "stable_id",
  { data_type => "varchar", is_nullable => 0, size => 40 },
  "method_link_species_set_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "description",
  { data_type => "varchar", is_nullable => 1, size => 255 },
);

=head1 PRIMARY KEY

=over 4

=item * L</domain_id>

=back

=cut

__PACKAGE__->set_primary_key("domain_id");

=head1 UNIQUE CONSTRAINTS

=head2 C<stable_id>

=over 4

=item * L</stable_id>

=item * L</method_link_species_set_id>

=back

=cut

__PACKAGE__->add_unique_constraint("stable_id", ["stable_id", "method_link_species_set_id"]);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:Vb3FckWmxCKiT+it55ulWg


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
