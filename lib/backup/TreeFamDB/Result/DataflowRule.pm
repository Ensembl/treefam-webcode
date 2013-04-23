use utf8;
package TreeFamDB::Result::DataflowRule;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

TreeFamDB::Result::DataflowRule

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

=head1 TABLE: C<dataflow_rule>

=cut

__PACKAGE__->table("dataflow_rule");

=head1 ACCESSORS

=head2 dataflow_rule_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_auto_increment: 1
  is_nullable: 0

=head2 from_analysis_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_foreign_key: 1
  is_nullable: 0

=head2 branch_code

  data_type: 'integer'
  default_value: 1
  is_nullable: 0

=head2 funnel_dataflow_rule_id

  data_type: 'integer'
  extra: {unsigned => 1}
  is_nullable: 1

=head2 to_analysis_url

  data_type: 'varchar'
  default_value: (empty string)
  is_nullable: 0
  size: 255

=head2 input_id_template

  data_type: 'text'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "dataflow_rule_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
  },
  "from_analysis_id",
  {
    data_type => "integer",
    extra => { unsigned => 1 },
    is_foreign_key => 1,
    is_nullable => 0,
  },
  "branch_code",
  { data_type => "integer", default_value => 1, is_nullable => 0 },
  "funnel_dataflow_rule_id",
  { data_type => "integer", extra => { unsigned => 1 }, is_nullable => 1 },
  "to_analysis_url",
  { data_type => "varchar", default_value => "", is_nullable => 0, size => 255 },
  "input_id_template",
  { data_type => "text", is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</dataflow_rule_id>

=back

=cut

__PACKAGE__->set_primary_key("dataflow_rule_id");

=head1 UNIQUE CONSTRAINTS

=head2 C<from_analysis_id>

=over 4

=item * L</from_analysis_id>

=item * L</branch_code>

=item * L</funnel_dataflow_rule_id>

=item * L</to_analysis_url>

=item * L</input_id_template>

=back

=cut

__PACKAGE__->add_unique_constraint(
  "from_analysis_id",
  [
    "from_analysis_id",
    "branch_code",
    "funnel_dataflow_rule_id",
    "to_analysis_url",
    "input_id_template",
  ],
);

=head1 RELATIONS

=head2 from_analysis

Type: belongs_to

Related object: L<TreeFamDB::Result::Analysis>

=cut

__PACKAGE__->belongs_to(
  "from_analysis",
  "TreeFamDB::Result::Analysis",
  { analysis_id => "from_analysis_id" },
  { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);


# Created by DBIx::Class::Schema::Loader v0.07017 @ 2012-05-25 13:30:03
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:jp7ngnLmVCYclmKuiHAgaQ


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
