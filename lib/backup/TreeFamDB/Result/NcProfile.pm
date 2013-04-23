use utf8;
package TreeFamDB::Result::NcProfile;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::NcProfile

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

=head1 TABLE: C<nc_profile>

=cut

__PACKAGE__->table("nc_profile");

=head1 ACCESSORS

=head2 model_id

  data_type: 'varchar'
  is_nullable: 0
  size: 10

=head2 name

  data_type: 'varchar'
  is_nullable: 1
  size: 40

=head2 type

  data_type: 'varchar'
  default_value: 'ncrna'
  is_nullable: 0
  size: 40

=head2 hc_profile

  data_type: 'mediumtext'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "model_id",
  { data_type => "varchar", is_nullable => 0, size => 10 },
  "name",
  { data_type => "varchar", is_nullable => 1, size => 40 },
  "type",
  {
    data_type => "varchar",
    default_value => "ncrna",
    is_nullable => 0,
    size => 40,
  },
  "hc_profile",
  { data_type => "mediumtext", is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</model_id>

=back

=cut

__PACKAGE__->set_primary_key("model_id");


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-15 16:32:46
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:NzCFMA3sN29Euo0D8SkXFw


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
