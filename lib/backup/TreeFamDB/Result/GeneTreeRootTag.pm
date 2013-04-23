use utf8;
package TreeFamDB::Result::GeneTreeRootTag;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::GeneTreeRootTag

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

=head1 TABLE: C<gene_tree_root_tag>

=cut

__PACKAGE__->table("gene_tree_root_tag");

=head1 ACCESSORS

=head2 root_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_foreign_key: 1
  is_nullable: 0

=head2 tag

  data_type: 'varchar'
  is_nullable: 0
  size: 50

=head2 value

  data_type: 'mediumtext'
  is_nullable: 0

=cut

__PACKAGE__->add_columns(
  "root_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_foreign_key => 1,
    is_nullable => 0,
  },
  "tag",
  { data_type => "varchar", is_nullable => 0, size => 50 },
  "value",
  { data_type => "mediumtext", is_nullable => 0 },
);

=head1 RELATIONS

=head2 root

Type: belongs_to

Related object: L<TreeFamDB::Result::GeneTreeRoot>

=cut

__PACKAGE__->belongs_to(
  "root",
  "TreeFamDB::Result::GeneTreeRoot",
  { root_id => "root_id" },
  { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:03
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:kHZsVk7U8XtdRhUp/CS+0g


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
