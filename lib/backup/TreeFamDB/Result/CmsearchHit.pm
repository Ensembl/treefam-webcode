use utf8;
package TreeFamDB::Result::CmsearchHit;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::CmsearchHit

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

=head1 TABLE: C<cmsearch_hit>

=cut

__PACKAGE__->table("cmsearch_hit");

=head1 ACCESSORS

=head2 hit_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 recovered_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 node_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 target_start

  data_type: 'integer'
  is_nullable: 0

=head2 target_stop

  data_type: 'integer'
  is_nullable: 0

=head2 query_start

  data_type: 'integer'
  is_nullable: 0

=head2 query_stop

  data_type: 'integer'
  is_nullable: 0

=head2 bit_sc

  data_type: 'float'
  is_nullable: 1
  size: [10,5]

=head2 evalue

  data_type: 'double precision'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "hit_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "recovered_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "node_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "target_start",
  { data_type => "integer", is_nullable => 0 },
  "target_stop",
  { data_type => "integer", is_nullable => 0 },
  "query_start",
  { data_type => "integer", is_nullable => 0 },
  "query_stop",
  { data_type => "integer", is_nullable => 0 },
  "bit_sc",
  { data_type => "float", is_nullable => 1, size => [10, 5] },
  "evalue",
  { data_type => "double precision", is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</hit_id>

=back

=cut

__PACKAGE__->set_primary_key("hit_id");


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:03
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:JoMqiLYktTVPy3inYTKCCw


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
