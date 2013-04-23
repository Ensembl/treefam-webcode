use utf8;
package TreeFamDB::Result::CafeData;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::CafeData

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

=head1 TABLE: C<CAFE_data>

=cut

__PACKAGE__->table("CAFE_data");

=head1 ACCESSORS

=head2 fam_id

  data_type: 'varchar'
  is_nullable: 0
  size: 20

=head2 tree

  data_type: 'mediumtext'
  is_nullable: 0

=head2 tabledata

  data_type: 'mediumtext'
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "fam_id",
  { data_type => "varchar", is_nullable => 0, size => 20 },
  "tree",
  { data_type => "mediumtext", is_nullable => 0 },
  "tabledata",
  { data_type => "mediumtext", is_nullable => 0 },
);

=head1 PRIMARY KEY

=over 4

=item * L</fam_id>

=back

=cut

__PACKAGE__->set_primary_key("fam_id");


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:02
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:tOrzVVP5oqMeMk6pO/9dMA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
