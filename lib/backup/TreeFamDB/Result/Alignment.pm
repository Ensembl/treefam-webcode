use utf8;
package TreeFamDB::Result::Alignment;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::Alignment

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

=head1 TABLE: C<alignment>

=cut

__PACKAGE__->table("alignment");

=head1 ACCESSORS

=head2 alignment_id

  data_type: 'varchar'
  is_nullable: 0
  size: 100

=head2 compara_table

  data_type: 'enum'
  extra: {list => ["compara","ncrna"]}
  is_nullable: 0

=head2 compara_key

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "alignment_id",
  { data_type => "varchar", is_nullable => 0, size => 100 },
  "compara_table",
  {
    data_type => "enum",
    extra => { list => ["compara", "ncrna"] },
    is_nullable => 0,
  },
  "compara_key",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 0 },
);

=head1 PRIMARY KEY

=over 4

=item * L</alignment_id>

=back

=cut

__PACKAGE__->set_primary_key("alignment_id");

=head1 RELATIONS

=head2 aligned_sequences

Type: has_many

Related object: L<TreeFamDB::Result::AlignedSequence>

=cut

__PACKAGE__->has_many(
  "aligned_sequences",
  "TreeFamDB::Result::AlignedSequence",
  { "foreign.alignment_id" => "self.alignment_id" },
  { cascade_copy => 0, cascade_delete => 0 },
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:02
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:Y3dR2zWwLHLIfgAU7+e4gg


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
