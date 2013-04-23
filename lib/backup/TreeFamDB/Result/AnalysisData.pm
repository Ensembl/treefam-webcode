use utf8;
package TreeFamDB::Result::AnalysisData;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::AnalysisData

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

=head1 TABLE: C<analysis_data>

=cut

__PACKAGE__->table("analysis_data");

=head1 ACCESSORS

=head2 analysis_data_id

  data_type: 'integer'
  is_auto_increment: 1
  is_nullable: 0

=head2 data

  data_type: 'longtext'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "analysis_data_id",
  { data_type => "integer", is_auto_increment => 1, is_nullable => 0 },
  "data",
  { data_type => "longtext", is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</analysis_data_id>

=back

=cut

__PACKAGE__->set_primary_key("analysis_data_id");


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:02
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:4LfTphrvUqTI8ZQRBSEFTw


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
