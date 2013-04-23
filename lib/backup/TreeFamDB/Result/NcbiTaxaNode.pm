use utf8;
package TreeFamDB::Result::NcbiTaxaNode;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::NcbiTaxaNode

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

=head1 TABLE: C<ncbi_taxa_node>

=cut

__PACKAGE__->table("ncbi_taxa_node");

=head1 ACCESSORS

=head2 taxon_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 parent_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=head2 rank

  data_type: 'char'
  default_value: (empty string)
  is_nullable: 0
  size: 32

=head2 genbank_hidden_flag

  data_type: 'tinyint'
  default_value: 0
  is_nullable: 0

=head2 left_index

  data_type: 'integer'
  is_nullable: 0

=head2 right_index

  data_type: 'integer'
  is_nullable: 0

=head2 root_id

  data_type: 'integer'
  default_value: 1
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "taxon_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "parent_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
  "rank",
  { data_type => "char", default_value => "", is_nullable => 0, size => 32 },
  "genbank_hidden_flag",
  { data_type => "tinyint", default_value => 0, is_nullable => 0 },
  "left_index",
  { data_type => "integer", is_nullable => 0 },
  "right_index",
  { data_type => "integer", is_nullable => 0 },
  "root_id",
  { data_type => "integer", default_value => 1, is_nullable => 0 },
);

=head1 PRIMARY KEY

=over 4

=item * L</taxon_id>

=back

=cut

__PACKAGE__->set_primary_key("taxon_id");


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-31 19:21:06
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:jX9apX46/TYFPUZUJ9rrBA


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
