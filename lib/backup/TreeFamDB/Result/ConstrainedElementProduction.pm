use utf8;
package TreeFamDB::Result::ConstrainedElementProduction;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::ConstrainedElementProduction

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

=head1 TABLE: C<constrained_element_production>

=cut

__PACKAGE__->table("constrained_element_production");

=head1 ACCESSORS

=head2 constrained_element_id

  data_type: 'bigint'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "constrained_element_id",
  {
    data_type => "bigint",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
);

=head1 PRIMARY KEY

=over 4

=item * L</constrained_element_id>

=back

=cut

__PACKAGE__->set_primary_key("constrained_element_id");


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:03
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:LdJjPWBu+ZgxUyK07gH5/A


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
