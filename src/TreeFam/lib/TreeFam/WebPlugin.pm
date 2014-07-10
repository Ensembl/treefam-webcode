#
#===============================================================================
#
#         FILE: SearchHelper.pm
#
#  DESCRIPTION:
#
#        FILES: ---
#         BUGS: ---
#        NOTES: ---
#       AUTHOR: Fabian Schreiber (), fs9@sanger.ac.uk
# ORGANIZATION:
#      VERSION: 1.0
#      CREATED: 09/26/2012 16:13:16
#     REVISION: ---
#===============================================================================
package TreeFam::WebPlugin;

use strict;
use warnings;
use Data::Dumper;

#--------------------------------------------------------------------
#Used by newick2json()
#--------------------------------------------------------------------
use Bio::Phylo::IO;
use JSON;
use IO::String;
use Bio::TreeIO;
use Bio::Phylo::Forest::Tree;
use Bio::Phylo::Factory;
use Bio::Phylo::IO qw'parse unparse';
use Bio::Phylo::Util::CONSTANT qw':objecttypes :namespaces';

#--------------------------------------------------------------------

sub report_homologs
{
	my ( $arg_ref ) = @_;
	my $tree_string = $arg_ref->{ 'tree_string' };
	my $io          = IO::String->new( $tree_string );
	my $treeio = Bio::TreeIO->new( -format => 'newick',
								   -fh     => $io );
	my $query_seq_id = "QUERY___EMBOSS_001";
	my $homology_string;

	if ( my $tree = $treeio->next_tree )
	{
		my $node = $tree->find_node( -id => $query_seq_id );
		if ( !$node )
		{
			die "Could not find node\n";
		}
		my %model_organism_ids;
		foreach my $leaf_node ( $tree->get_leaf_nodes )
		{
			print "leaf node is " . $leaf_node->id . "\n";
			if ( $leaf_node->id =~ /^ENSP0/ )
			{
				print "matches human\n";
				push( @{ $model_organism_ids{ human } }, $leaf_node );

				#print Dumper $model_organism_ids{ human };
			}
			push( @{ $model_organism_ids{ chicken } },      $leaf_node ) if $leaf_node->id =~ /^ENSGALP0/;
			push( @{ $model_organism_ids{ frog } },         $leaf_node ) if $leaf_node->id =~ /^ENSXETP0/;
			push( @{ $model_organism_ids{ yeast } },        $leaf_node ) if $leaf_node->id =~ /^YAL0/;
			push( @{ $model_organism_ids{ yeast } },        $leaf_node ) if $leaf_node->id =~ /^YAL0/;
			push( @{ $model_organism_ids{ worm } },         $leaf_node ) if $leaf_node->id =~ /^Y74C9A/;
			push( @{ $model_organism_ids{ fish } },         $leaf_node ) if $leaf_node->id =~ /^ENSDARP0/;
			push( @{ $model_organism_ids{ fly } },          $leaf_node ) if $leaf_node->id =~ /^FBpp0/;
			push( @{ $model_organism_ids{ mouse } },        $leaf_node ) if $leaf_node->id =~ /^ENSMUSP/;
			push( @{ $model_organism_ids{ rat } },          $leaf_node ) if $leaf_node->id =~ /^ENSRNOP/;
			push( @{ $model_organism_ids{ fissionyeast } }, $leaf_node ) if $leaf_node->id =~ /^SPAC212/;
		}
		my @query_nodes = $tree->find_node( -id => $query_seq_id );

		#print Dumper %model_organism_ids;

		# now get all pairs of Query and
		foreach my $model_orga ( keys( %model_organism_ids ) )
		{
			foreach my $mod_orga_node ( @{ $model_organism_ids{ $model_orga } } )
			{
				my @temp_array_of_leaves = ( $query_nodes[ 0 ] );
				push( @temp_array_of_leaves, $mod_orga_node );
				print "getting lca of " . $mod_orga_node->id . "\n";
				my $lca = $tree->get_lca( -nodes => \@temp_array_of_leaves );
				if ( !$lca ) { warn "Could not get LCA of " . join( ",", @temp_array_of_leaves ) . "\n"; next; }
				else
				{
					my @current_leaf_nodes = $lca->get_all_Descendents;
					my %taxa_count;
					foreach ( @current_leaf_nodes )
					{
						next if !$_->is_Leaf();
						$taxa_count{ chicken }++      if $_->id =~ /^ENSGALP0/;
						$taxa_count{ frog }++         if $_->id =~ /^ENSXETP0/;
						$taxa_count{ yeast }++        if $_->id =~ /^YAL0/;
						$taxa_count{ yeast }++        if $_->id =~ /^YAL0/;
						$taxa_count{ worm }++         if $_->id =~ /^Y74C9A/;
						$taxa_count{ fish }++         if $_->id =~ /^ENSDARP0/;
						$taxa_count{ fly }++          if $_->id =~ /^FBpp0/;
						$taxa_count{ mouse }++        if $_->id =~ /^ENSMUSP/;
						$taxa_count{ rat }++          if $_->id =~ /^ENSRNOP/;
						$taxa_count{ fissionyeast }++ if $_->id =~ /^SPAC212/;
					}
					print Dumper %taxa_count;
					if ( !exists $taxa_count{ $model_orga } )
					{
						#$homology_string .= "No homology for : $query_seq_id  - $model_orga (" . $mod_orga_node->id . ") \n";
						#print "No homology for : $query_seq_id  - $model_orga (" . $mod_orga_node->id . ") \n";
					}
					if ( $taxa_count{ $model_orga } > 1 )
					{
						$homology_string .= "Paralogy between: $query_seq_id  - $model_orga (" . $mod_orga_node->id . ") \n";
						print "Paralogy between: $query_seq_id  - $model_orga (" . $mod_orga_node->id . ") \n";
					}
					else
					{
						$homology_string .= "Orthology between: $query_seq_id  - $model_orga (" . $mod_orga_node->id . ") \n";
						print "Orthology between: $query_seq_id  - $model_orga (" . $mod_orga_node->id . ") \n";
					}
				}

				#die "here\n";
			}
		}

		return $homology_string;
	}
}

sub get_sister_gene
{
	my ( $arg_ref ) = @_;
	my $tree_string = $arg_ref->{ 'tree_string' };

	my $forest = Bio::Phylo::IO->parse( -format => 'newick',
										-string => $tree_string );
	foreach my $tree ( @{ $forest->get_entities } )
	{

		foreach my $node ( @{ $tree->get_entities } )
		{

			# node has a parent, i.e. is not root
			if ( $node->get_name =~ /Query/i )
			{
				print "Found query in tree\n";
				my $n_sister          = $node->get_next_sister();
				my $parent            = $node->get_parent();
				my $leftmost_terminal = $node->get_rightmost_terminal;
				my @sisters           = @{ $node->get_sisters };
				print "found " . scalar( @sisters ) . " sisters\n";

				foreach my $sis_node ( @sisters )
				{
					print $sis_node->get_name() . "\n";
				}
				if ( $n_sister )
				{
					print "sister of " . $node->get_name() . " is " . $n_sister->get_name() . " and " . $leftmost_terminal->get_name() . "\n";
				}
			}
		}
	}


}

sub get_TF_fasta
{
	my ( $arg_ref )      = @_;
	my $genetree_adaptor = $arg_ref->{ 'genetree_adaptor' };
	my $TF_family        = $arg_ref->{ 'treefam_family' };
	my $fasta_seq        = $arg_ref->{ 'fasta_seq' };

	my $tree = $genetree_adaptor->fetch_by_stable_id( $TF_family );

	# get_tree
	my $all_leaves = ( $tree->root )->get_all_leaves();
	foreach my $leaf ( @{ $all_leaves } )
	{
		${ $fasta_seq } .= ">" . $leaf->stable_id . "\n" . $leaf->sequence . "\n";
	}

	if ( ${ $fasta_seq } ne "" )
	{
		return 1;
	}
	else
	{
		return 0;
	}
}

sub get_TF_gene_tree_json
{
	my ( $arg_ref )        = @_;
	my $genetree_adaptor   = $arg_ref->{ 'genetree_adaptor' };
	my $selected_TF_family = $arg_ref->{ 'selected_treefam_family' };
	print "getting tree $selected_TF_family\n";
	my $tree = $genetree_adaptor->fetch_by_stable_id( $selected_TF_family );
	return $tree->get_value_for_tag( "json_tree" );
}

sub get_TF_data
{
	my ( $arg_ref )        = @_;
	my $genetree_adaptor   = $arg_ref->{ 'genetree_adaptor' };
	my $selected_TF_family = $arg_ref->{ 'selected_treefam_family' };
	my $ref_gene_tree      = $arg_ref->{ 'gene_tree' };
	my $ref_alignment      = $arg_ref->{ 'ref_alignment' };

	my $tree = $genetree_adaptor->fetch_by_stable_id( $selected_TF_family );

	# get_tree
	my $root_of_tree = $tree->root;
	my $nhx_tree     = $root_of_tree->nhx_format;

	$nhx_tree =~ s/\n//g;
	$nhx_tree =~ s/(?<=\[)[^]]+[^[]+(?=\])//g;
	$nhx_tree =~ s/(\[|\])//g;

	#print "$selected_TF_family|$gene_count|$aln_length\n$nhx_tree\n";

	# get alignment
	my $simpleAlign = $tree->get_SimpleAlign();
	my $fasta_string;
	foreach my $seq ( $simpleAlign->each_seq )
	{
		$fasta_string .= ">" . $seq->id . "\n" . $seq->seq . "\n";
	}

	#Place the values on the reference variables.
	${ $ref_gene_tree } = $nhx_tree;
	${ $ref_alignment } = $fasta_string;

	if ( $tree ne "" && $fasta_string ne "" )
	{
		return 1;
	}
	else
	{
		return 0;
	}

=begin COMMENT
	#my $gene_count	= ($tree->get_value_for_tag('gene_count'))? $tree->get_value_for_tag('gene_count'): 'NaN';
	#my $aln_length	= ($tree->get_value_for_tag('aln_length'))? $tree->get_value_for_tag('aln_length'): 'NaN';
	#my $nhx_tree	= ($tree->get_value_for_tag('treenhx'))? $tree->get_value_for_tag('treenhx'): 'NaN';

	#my $root_id = 1192425;
	#my $tree = $genetree_adaptor->fetch_by_root_id($root_id);
	#print Dumper($tree);
	
    if (!defined($selected_TF_family) || $selected_TF_family eq '' || !defined($genetree_adaptor) || $genetree_adaptor eq ''){
        warn "missing parameter (to_search: $selected_TF_family, genetree_adaptor: $genetree_adaptor)\n";
        return undef;
    }

	#$selected_TF_family =~ s/TF//;

	# search gene_tree_root table for given tf family
	#my $tree             = $genetree_adaptor->fetch_by_root_id($selected_TF_family);
	my $tree             = $genetree_adaptor->fetch_by_stable_id($selected_TF_family);

	open(TREE,">$gene_tree");
	print TREE $tree;
	close(TREE);


=end COMMENT
=cut

}

sub convert_ids
{
	my ( $arg_ref )   = @_;
	my $ref_gene_tree = $arg_ref->{ 'gene_tree' };
	my $ref_align     = $arg_ref->{ 'ref_alignment' };
	my $ref_ID_MAP    = $arg_ref->{ 'ID_MAP' };

	my $geneCount = 0;

	my @lines = split /\n/, ${ $ref_align };
	foreach my $line ( @lines )
	{
		if ( $line =~ /^>/ )
		{
			my $seq_name = substr( $line, 1 );

			#print "$seq_name\tgene_$geneCount\n";
			${ $ref_gene_tree } =~ s/\Q$seq_name/gene_$geneCount/;
			${ $ref_align }     =~ s/\Q$seq_name/gene_$geneCount/;
			$ref_ID_MAP->{ "gene_$geneCount" } = $seq_name;

			$geneCount++;
		}
	}
}

sub reconvert_ids
{
	my ( $arg_ref )     = @_;
	my $raxml_results   = $arg_ref->{ 'raxml_results' };
	my $mafft_alignment = $arg_ref->{ 'mafft_alignment' };
	my $ref_ID_MAP      = $arg_ref->{ 'ID_MAP' };

	foreach my $gene ( keys %{ $ref_ID_MAP } )
	{
		${ $raxml_results }   =~ s/\Q$gene/$ref_ID_MAP->{$gene}/;
		${ $mafft_alignment } =~ s/\Q$gene/$ref_ID_MAP->{$gene}/;
	}

	#print ">>>\n${$raxml_results}\n<<<\n";
}

sub prepare_for_website
{
}

use Bio::Phylo::IO;
use JSON;
use Data::Dumper;
use Bio::TreeIO;
use Bio::Phylo::Forest::Tree;
use Bio::Phylo::Factory;
use Bio::Phylo::IO qw'parse unparse';
use Bio::Phylo::Util::CONSTANT qw':objecttypes :namespaces';

sub newick2json
{

	#my $output_tree = "/nfs/production/xfam/treefam/treefam_tools/lib/TreeFam/output.tre";
	my $output_tree = "/tmp/output.tre";
	my $debug       = 0;
	my %leafNodesMapping;
	my %internalNodesMapping;
	my %allNodesMapping;
	my %mapBack2ID;

	my ( $arg_ref ) = @_;
	my $input_tree = $arg_ref->{ input_tree } || "/tmp/output.tre";
	my $input_tree_string = $arg_ref->{ input_tree_string };

	#open my $nw_tree_out, ">", $input_tree or die "Could not open $input_tree\n";
	#print {$nw_tree_out} $input_tree_string."\n";
	#close $nw_tree_out || die "Could not close $input_tree\n";
	#die "finished reading tree here, check $input_tree\n";
	if (
		 !read_tree_io(
						{
						  "input_tree"           => $input_tree,
						  "output_tree"          => $output_tree,
						  "leafNodesMapping"     => \%leafNodesMapping,
						  "internalNodesMapping" => \%internalNodesMapping,
						  "allNodesMapping"      => \%allNodesMapping,
						  "mapBack2ID"           => \%mapBack2ID
						}
		 )
	  )
	{
		die "could not read tree $input_tree\n";
	}

	#print Dumper %leafNodesMapping;
	#print Dumper %allNodesMapping;

################################################################################
########     Parse as Bio::Phylo::Project
################################################################################
	# we parse the newick as a project so that we end
	# up with an object that has both the tree and the
	# annotated OTUs
	my $proj = parse( '-format' => 'newick', '-file' => $output_tree, '-as_project' => 1, );
	my ( $forest ) = @{ $proj->get_items( _FOREST_ ) };

	my $tree   = $forest->next;
	my $result = traverse( $tree->get_root );

	return ( JSON->new->pretty->encode( $result ) );

	sub traverse
	{
		my $node      = shift;
		my $node_name = $node->get_name;

		#my $result = { 'name' => $node->get_name };

		my $result = {
					   name => ( exists $mapBack2ID{ $node_name } ) ? $mapBack2ID{ $node_name } : $node_name,
					   duplication => ( exists $allNodesMapping{ $node_name }{ D } && $allNodesMapping{ $node_name }{ D } eq "Y" ) ? "Y" : "N",
					   taxon     => ( exists $mapBack2ID{ $node_name } )           ? $mapBack2ID{ $node_name }           : $node_name,
					   bootstrap => ( exists $allNodesMapping{ $node_name }{ B } ) ? $allNodesMapping{ $node_name }{ B } : "NaN",
					   common_name => "NaN",
		};
		$result->{ length } = "0.5"  if exists $leafNodesMapping{ $node_name };
		$result->{ length } = "5"    if not exists $leafNodesMapping{ $node_name };
		$result->{ type }   = "leaf" if exists $leafNodesMapping{ $node_name };
		$result->{ type }   = "node" if not exists $leafNodesMapping{ $node_name };

		#$result->{domains} = [{domain_start=>100, domain_stop=>120, name=>"BRCA1"},{domain_start=>200, domain_stop=>240, name=>"BRCA2"}] if exists $leafNodesMapping{$node_name};
		#$result->{domains} = [{domain_start=>100, domain_stop=>240, name=>"BRCA2"}];
		#$result->{seq_length} = 400;

		if ( my @children = @{ $node->get_children } )
		{
			$result->{ 'children' } = [ map { traverse( $_ ) } @children ];
		}
		return $result;
	}

	sub read_tree_io
	{
		my ( $arg_ref )          = @_;
		my $input_tree           = $arg_ref->{ input_tree };
		my $output_tree          = $arg_ref->{ output_tree };
		my $leafNodesMapping     = $arg_ref->{ leafNodesMapping };
		my $internalNodesMapping = $arg_ref->{ internalNodesMapping };
		my $allNodesMapping      = $arg_ref->{ allNodesMapping };
		my $mapBack2ID           = $arg_ref->{ mapBack2ID };
		my %alreadyMapped;

		#my $temp_tree = $treefam_id."temp_tree.nhx";
		my $in = Bio::TreeIO->new( '-format' => 'nhx', '-file' => "$input_tree" );
		while ( my $tree = $in->next_tree )
		{
			my @nodes = $tree->get_nodes();

			#print "Found ".scalar(@nodes)." nodes in total\n";
			die "Could not get nodes from tree" if !scalar( @nodes );
			foreach my $node ( @nodes )
			{

				if ( $node->is_Leaf )
				{
					my $name = $node->id;
					my @tags = $node->get_all_tags;
					foreach ( @tags )
					{

						#print "get value for $_\n";
						my @values = $node->get_tag_values( $_ );
						$leafNodesMapping{ $name }{ $_ } = $values[ 0 ];
						$allNodesMapping{ $name }{ $_ }  = $values[ 0 ];
					}
				}

				# internal node
				# need to replace ids
				else
				{
					my $name = $node->id;
					next if !defined $name || $name eq "";
					my @tags  = $node->get_all_tags;
					my $newID = $name . "_" . $alreadyMapped{ $name }++;
					$mapBack2ID{ $newID } = $name;
					print "name is $name ($newID)\t" if $debug;

					foreach ( @tags )
					{
						my @values = $node->get_tag_values( $_ );
						$internalNodesMapping{ $newID }{ $_ } = $values[ 0 ];
						$allNodesMapping{ $newID }{ $_ }      = $values[ 0 ];
						print "\t\tvalue for $_ is " . $values[ 0 ] . "\n" if $debug;
					}

					#print "BOOTSTRAP saved: ".$node->bootstrap."\n";
					$internalNodesMapping{ $newID }{ 'bootstrap' } = $node->bootstrap;
					$allNodesMapping{ $newID }{ 'bootstrap' }      = $node->bootstrap;

					#$node->id($name);
					#$internalNodesMapping{$newID}{'bootstrap'} = $node->bootstrap;
					$node->id( $newID );
				}
			}
			my $out = new Bio::TreeIO( -file => ">$output_tree", -format => 'nhx' );
			$out->write_tree( $tree );
		}
		return ( -e $output_tree && -s $output_tree ) ? 1 : undef;
	}
}

sub add_user_seq_info
{
	my ( $arg_ref ) = @_;
	my $name        = $arg_ref->{ name };
	my $taxon       = $arg_ref->{ taxon };
	my $domains     = $arg_ref->{ domains };
	my $leaf_href   = $arg_ref->{ leaf_href };

	$leaf_href->{ $name }{ "name" }    = $name;
	$leaf_href->{ $name }{ "taxon" }   = ( defined $taxon ) ? $taxon : "N/A";
	$leaf_href->{ $name }{ "domains" } = ( defined $domains ) ? $domains : "N/A";

	#print Dumper $leaf_href->{$name};
	#die "";
	return 1;
}

sub nhx2json
{
	my ( $arg_ref )       = @_;
	my $input_tree        = $arg_ref->{ input_tree };
	my $leaf_href         = $arg_ref->{ leaf_href };
	my $input_tree_string = $arg_ref->{ input_tree_string };

	my $input_tree         = shift || "example.newick";
	my $output_tree        = "output.tre";
	my $taxon2species_file = "taxid2species.txt";
	my $debug              = 0;
	my %leafNodesMapping;
	my %internalNodesMapping;
	my %allNodesMapping;
	my %taxid2species_hash;
	my %mapBack2ID;

	my $tree = Bio::Phylo::IO->parse(
									  '-string' => $input_tree_string,
									  '-format' => 'newick',
	)->first;

	#print Dumper $tree->get_root;
	my $result = traverse_gene_tree( { "node" => $tree->get_root, "leaf_href" => $leaf_href } );
	return $result;

	sub traverse_gene_tree
	{
		my ( $args )  = @_;
		my $node      = $args->{ node };
		my $leaf_href = $args->{ leaf_href };

		#my $node      = shift;
		my $node_name = $node->get_name;

		#my $result = { 'name' => $node->get_name };
		print "current node: $node_name\n";
		my $result;

		$result = {
					name                   => ( exists $leaf_href->{ $node_name }{ name } )                   ? $leaf_href->{ $node_name }{ name }                   : "N/A",
					duplication            => ( exists $leaf_href->{ $node_name }{ duplication } )            ? $leaf_href->{ $node_name }{ duplication }            : "N/A",
					taxon                  => ( exists $leaf_href->{ $node_name }{ taxon } )                  ? $leaf_href->{ $node_name }{ taxon }                  : $node_name,
					bootstrap              => ( exists $leaf_href->{ $node_name }{ boostrap } )               ? $leaf_href->{ $node_name }{ bootstrap }              : "NaN",
					seq_length             => ( exists $leaf_href->{ $node_name }{ seq_length } )             ? $leaf_href->{ $node_name }{ seq_length }             : "NaN",
					common_name            => ( exists $leaf_href->{ $node_name }{ common_name } )            ? $leaf_href->{ $node_name }{ common_name }            : "NaN",
					binary_alignment       => ( exists $leaf_href->{ $node_name }{ binary_alignment } )       ? $leaf_href->{ $node_name }{ binary_alignment }       : "NaN",
					uniprot_name           => ( exists $leaf_href->{ $node_name }{ uniprot_name } )           ? $leaf_href->{ $node_name }{ uniprot_name }           : "NaN",
					display_label          => ( exists $leaf_href->{ $node_name }{ display_label } )          ? $leaf_href->{ $node_name }{ display_label }          : "NaN",
					swissprot_gene         => ( exists $leaf_href->{ $node_name }{ swissprot_gene } )         ? $leaf_href->{ $node_name }{ swissprot_gene }         : "NaN",
					swissprot_protein_name => ( exists $leaf_href->{ $node_name }{ swissprot_protein_name } ) ? $leaf_href->{ $node_name }{ swissprot_protein_name } : "NaN",
					swissprot_lca_name     => ( exists $leaf_href->{ $node_name }{ swissprot_lca_name } )     ? $leaf_href->{ $node_name }{ swissprot_lca_name }     : "NaN",
					domains                => ( exists $leaf_href->{ $node_name }{ domains } )                ? $leaf_href->{ $node_name }{ domains }                : "NaN",
					type                   => "leaf"
		};

		if ( my @children = @{ $node->get_children } )
		{
			$result->{ 'children' } = [ map { traverse_gene_tree( { "node" => $_, "leaf_href" => $leaf_href } ) } @children ];
		}
		return $result;
	}

}

sub nh2json
{
	my ( $arg_ref ) = @_;
	my $input_tree = $arg_ref->{ input_tree } || "/tmp/output.tre";
	my $input_tree_string = $arg_ref->{ input_tree_string };

	my $input_tree         = shift || "example.newick";
	my $output_tree        = "output.tre";
	my $taxon2species_file = "taxid2species.txt";
	my $debug              = 0;
	my %leafNodesMapping;
	my %internalNodesMapping;
	my %allNodesMapping;
	my %taxid2species_hash;
	my %mapBack2ID;

	my $tree = Bio::Phylo::IO->parse(
									  '-string' => $input_tree_string,
									  '-format' => 'newick',
	)->first;

	my $result = traverse( $tree->get_root );

	#my $out=[];
	#my $children=$out;
	#my $cur;
	#my $parent;
	#$tree->visit_breadth_first(
	#-pre=>sub {
	#my $node = shift;
	#my $node_name = $node->get_name;
	#print "$node_name has: ".$allNodesMapping{$node_name}{D}."\n" if $debug;
	#$cur={
	#name=>$node_name,
	#duplication=> (exists $allNodesMapping{$node_name}{D} && $allNodesMapping{$node_name}{D} eq "Y")?"Y":"N",
	#taxon=> (exists $allNodesMapping{$node_name}{T})? $taxid2species_hash{$allNodesMapping{$node_name}{T}}:"NaN",
	#bootstrap=>(exists $allNodesMapping{$node_name}{B})?$allNodesMapping{$node_name}{B}:"NaN"
	#};
	#push @$children, $cur;
	#},
	#-pre_daughter=>sub { $cur->{children}=[]; $parent=$cur; $children=$cur->{children} },
	#);
	#print JSON->new->pretty->encode($result);

	return $result;

## Please see file perltidy.ERR
## Please see file perltidy.ERR
## Please see file perltidy.ERR
## Please see file perltidy.ERR
## Please see file perltidy.ERR
## Please see file perltidy.ERR
	sub traverse
	{
		my $node      = shift;
		my $node_name = $node->get_name;

		#my $result = { 'name' => $node->get_name };


		my $result = {
					   name => ( exists $mapBack2ID{ $node_name } ) ? $mapBack2ID{ $node_name } : $node_name,
					   duplication => ( exists $allNodesMapping{ $node_name }{ D } && $allNodesMapping{ $node_name }{ D } eq "Y" ) ? "Y" : "N",
					   taxon     => ( exists $mapBack2ID{ $node_name } )           ? $mapBack2ID{ $node_name }           : $node_name,
					   bootstrap => ( exists $allNodesMapping{ $node_name }{ B } ) ? $allNodesMapping{ $node_name }{ B } : "NaN",
					   common_name => "NaN",
		};
		$result->{ length } = "0.5"  if exists $leafNodesMapping{ $node_name };
		$result->{ length } = "5"    if not exists $leafNodesMapping{ $node_name };
		$result->{ type }   = "leaf" if exists $leafNodesMapping{ $node_name };
		$result->{ type }   = "node" if not exists $leafNodesMapping{ $node_name };

		#$result->{domains} = [{domain_start=>100, domain_stop=>120, name=>"BRCA1"},{domain_start=>200, domain_stop=>240, name=>"BRCA2"}] if exists $leafNodesMapping{$node_name};
		#$result->{domains} = [{domain_start=>100, domain_stop=>240, name=>"BRCA2"}];
		#$result->{seq_length} = 400;


		if ( my @children = @{ $node->get_children } )
		{
			$result->{ 'children' } = [ map { traverse( $_ ) } @children ];
		}
		return $result;
	}

	sub read_tree_io
	{
		my ( $arg_ref )          = @_;
		my $input_tree           = $arg_ref->{ input_tree };
		my $output_tree          = $arg_ref->{ output_tree };
		my $leafNodesMapping     = $arg_ref->{ leafNodesMapping };
		my $internalNodesMapping = $arg_ref->{ internalNodesMapping };
		my $allNodesMapping      = $arg_ref->{ allNodesMapping };
		my $mapBack2ID           = $arg_ref->{ mapBack2ID };
		my %alreadyMapped;

		#my $temp_tree = $treefam_id."temp_tree.nhx";
		my $in = Bio::TreeIO->new( '-format' => 'nhx', '-file' => $input_tree );
		while ( my $tree = $in->next_tree )
		{
			my @nodes = $tree->get_nodes();

			#print "Found ".scalar(@nodes)." nodes in total\n";
			die "Could not get nodes from tree" if !scalar( @nodes );
			foreach my $node ( @nodes )
			{

				if ( $node->is_Leaf )
				{
					my $name = $node->id;
					my @tags = $node->get_all_tags;
					foreach ( @tags )
					{

						#print "get value for $_\n";
						my @values = $node->get_tag_values( $_ );
						$leafNodesMapping{ $name }{ $_ } = $values[ 0 ];
						$allNodesMapping{ $name }{ $_ }  = $values[ 0 ];
					}
				}

				# internal node
				# need to replace ids
				else
				{
					my $name = $node->id;
					next if !defined $name || $name eq "";
					my @tags  = $node->get_all_tags;
					my $newID = $name . "_" . $alreadyMapped{ $name }++;
					$mapBack2ID{ $newID } = $name;
					print "name is $name ($newID)\t" if $debug;

					foreach ( @tags )
					{
						my @values = $node->get_tag_values( $_ );
						$internalNodesMapping{ $newID }{ $_ } = $values[ 0 ];
						$allNodesMapping{ $newID }{ $_ }      = $values[ 0 ];
						print "\t\tvalue for $_ is " . $values[ 0 ] . "\n" if $debug;
					}

					#print "BOOTSTRAP saved: ".$node->bootstrap."\n";
					$internalNodesMapping{ $newID }{ 'bootstrap' } = $node->bootstrap;
					$allNodesMapping{ $newID }{ 'bootstrap' }      = $node->bootstrap;

					#$node->id($name);
					#$internalNodesMapping{$newID}{'bootstrap'} = $node->bootstrap;
					$node->id( $newID );
				}
			}
			my $out = new Bio::TreeIO( -file => ">$output_tree", -format => 'nhx' );
			$out->write_tree( $tree );
		}
		return ( -e $output_tree && -s $output_tree ) ? 1 : undef;
	}


}

sub analyse_json_tree_recursively
{
	my ( $args )  = @_;
	my $TAXA_TREE = $args->{ node };
	my $leaf_href = $args->{ leaf_href };

	#print Dumper $TAXA_TREE;
	my $node_name = $TAXA_TREE->{ "name" };

	#print Dumper  $TAXA_TREE->{"children"} ;
	if ( exists $TAXA_TREE->{ "children" } )
	{

		#print "node $node_name has chidren\n";
		foreach my $child ( @{ $TAXA_TREE->{ "children" } } )
		{

			#print "looking at child\n";

			#print Dumper $_;
			analyse_json_tree_recursively( { "node" => $child, "leaf_href" => $leaf_href } );
		}
	}
	else
	{
		unless ( $node_name eq "" )
		{

			#print "must be a leaf. should same data to $node_name\n";
			(
			   $leaf_href->{ $node_name }{ "name" },
			   $leaf_href->{ $node_name }{ "duplication" },
			   $leaf_href->{ $node_name }{ "taxon" },
			   $leaf_href->{ $node_name }{ "bootstrap" },
			   $leaf_href->{ $node_name }{ "common_name" },
			   $leaf_href->{ $node_name }{ "binary_alignment" },
			   $leaf_href->{ $node_name }{ "uniprot_name" },
			   $leaf_href->{ $node_name }{ "display_label" },
			   $leaf_href->{ $node_name }{ "swissprot_gene" },
			   $leaf_href->{ $node_name }{ "swissprot_protein_name" },
			   $leaf_href->{ $node_name }{ "swissprot_lca_name" },
			   $leaf_href->{ $node_name }{ "seq_length" },
			   $leaf_href->{ $node_name }{ "domains" }
			  )
			  = (
				  $TAXA_TREE->{ "name" },
				  $TAXA_TREE->{ "duplication" },
				  $TAXA_TREE->{ "taxon" },
				  $TAXA_TREE->{ "bootstrap" },
				  $TAXA_TREE->{ "common_name" },
				  $TAXA_TREE->{ "binary_alignment" },
				  $TAXA_TREE->{ "uniprot_name" },
				  $TAXA_TREE->{ "display_label" },
				  $TAXA_TREE->{ "swissprot_gene" },
				  $TAXA_TREE->{ "swissprot_protein_name" },
				  $TAXA_TREE->{ "swissprot_lca_gene_name" },
				  $TAXA_TREE->{ "seq_length" },
				  $TAXA_TREE->{ "domains" },
			  );

			#$leaf_href->{ $node_name }{ "domains" }
			#print Dumper $TAXA_TREE->{ "domains" };
			#$leaf_href->{ $node_name }{ "domains" } =    $TAXA_TREE->{ "domains" };
			#print Dumper $leaf_href->{ $node_name }{ "domains" };
			#die "after domains\n";
			#die "here\n";
		}
	}
}
1;
