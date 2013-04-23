use utf8;
package TreeFamDB::Result::Sequence;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::Sequence

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

=head1 TABLE: C<sequence>

=cut

__PACKAGE__->table("sequence");

=head1 ACCESSORS

=head2 sequence_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 length

  data_type: 'integer'
  is_nullable: 0

=head2 sequence

  accessor: 'column_sequence'
  data_type: 'longtext'
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "sequence_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "length",
  { data_type => "integer", is_nullable => 0 },
  "sequence",
  {
    accessor    => "column_sequence",
    data_type   => "longtext",
    is_nullable => 0,
  },
);

=head1 PRIMARY KEY

=over 4

=item * L</sequence_id>

=back

=cut

__PACKAGE__->set_primary_key("sequence_id");


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:HG7k9o6fyBfe1kiVuKFD7A


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
