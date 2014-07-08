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
package TreeFam::MafftLocalModule;

use strict;
use warnings;
use Data::Dumper;

my $mafft_bin	= "/ebi/extserv/bin/mafft-6.850/bin/mafft";

sub run_mafft
{
	my ($arg_ref)		= @_;
	my $run_id			= $arg_ref->{'run_id'};
	#--auto --quiet --add
	my $arguments		= $arg_ref->{'arguments'};
	my $fasta_sequence	= $arg_ref->{'fasta_sequence'};
	my $ref_alignment	= $arg_ref->{'ref_alignment'};
	my $query_fasta		= $arg_ref->{'query_fasta'};
	my $mafft_alignment	= $arg_ref->{'mafft_alignment'};
	my $tmp_dir			= $arg_ref->{'tmp_dir'};
	my $out_file		= $arg_ref->{'out_file'};

	if ($arguments =~ /add/)
	{	
		open(ALN,">$tmp_dir/$run_id\_ref.aln");
		print ALN "${$ref_alignment}";
		close(ALN);

		open(QRY,">$tmp_dir/$run_id\_query.fasta");
		print QRY ">QRY\n";
		print QRY "${$query_fasta}";
		close(QRY);

		print "Running mafft:\n";
		system("$mafft_bin $arguments $tmp_dir/$run_id\_query.fasta $tmp_dir/$run_id\_ref.aln > $tmp_dir/$out_file");
	}
	else
	{	
		open(SEQ,">$tmp_dir/$run_id\_seq.fasta");
		print SEQ "${$fasta_sequence}";
		close(SEQ);

		print "Running mafft:  $mafft_bin $arguments $tmp_dir/$run_id\_seq.fasta > $tmp_dir/$out_file \n";
		system("$mafft_bin $arguments $tmp_dir/$run_id\_seq.fasta > $tmp_dir/$out_file");
	}

	${$mafft_alignment} = `cat $tmp_dir/$out_file`;
}
1;
