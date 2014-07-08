
# SingleSequence.pm
# jt6 20120514 WTSI
#
# $Id$

=head1 NAME

RfamWeb::Roles::Search::SingleSequence - role containing actions related to
single-sequence searching

=cut

package TreeFam::Roles::Search::SingleSequence;

=head1 DESCRIPTION

A role to add single sequence search-related methods to the main search
controller.

$Id$

=cut

use MooseX::MethodAttributes::Role;
use namespace::autoclean;
use TreeFam::HMMerModule;
use TreeFam::MafftModule;
use TreeFam::RAxMLModule;
use TreeFam::SearchHelper;
use TreeFam::WebPlugin;

use Data::Dumper ;
use Data::Dump ;
use JSON qw( to_json );
use File::Temp qw/ tempfile tempdir /;

sub get_adaptors : Private 
{
  my ($self, $c) = @_;
  
  #my $reg = $c->model('Registry');
  my $reg = 'Bio::EnsEMBL::Registry'; 
  my $compara_name = $c->request()->param('compara') || "TreeFam";
  
  #try {
            my $ma = $reg->get_adaptor($compara_name, 'compara', 'member');
            #$c->go('ReturnError', 'custom', ["No member adaptor found for $compara_name"]) unless $ma;
            $c->stash(member_adaptor => $ma);
          
            my $ha = $reg->get_adaptor($compara_name, 'compara', 'homology');
            #$c->go('ReturnError', 'custom', ["No homology adaptor found for $compara_name"]) unless $ha;
            $c->stash(homology_adaptor => $ha);
            
            my $gt = $reg->get_adaptor($compara_name, 'compara', 'GeneTree');
            #$c->go('ReturnError', 'custom', ["No genetree adaptor found for $compara_name"]) unless $gt;
            #$c->stash(genetree_adaptor => $gt);
            $c->stash->{'genetree_adaptor'} = $gt;
            #$c->log->debug("here is what we saved\n");
            #$c->log->debug(dump($c->stash->{'genetree_adaptor'}));
            #$c->log->debug(dump($gt));
            #$c->log->debug("done\n");
            #}
  #catch {
            #$c->go('ReturnError', 'from_ensembl', [$_]);
  #}; 

}


sub get_seq_info : Chained( 'sequence' ) PathPart( 'get_seq_info' ) Args(0){
    my ( $this, $c, $id ) = @_;
    my $tf_family = "NaN";
    my $homology_type = "";
    $c->log->debug("in get_seq_info with $id") if $c->debug;
    #$c->log->debug("perl path is @INC") if $c->debug;
    my ($homology_data,$sequence_data);
    my $member_adaptor = $c->stash->{'member_adaptor'};
    my $homology_adaptor = $c->stash->{'homology_adaptor'};
    my $genetree_adaptor = $c->stash->{'genetree_adaptor'};
    my $to_search = $id;
    my $result_data; 
    my $resultset = TreeFam::SearchHelper::get_MemberInformation4seq({"member_adaptor" => $member_adaptor, "to_search" => $to_search, "genetree_adaptor"=> $genetree_adaptor,"homology_adaptor" =>$homology_adaptor});

    if(!$resultset || !scalar(@$resultset)){
        $c->error("No results found");
    }
    else{
       $result_data = encode_json $resultset;
    }
        $c->res->content_type('application/json');
     
     $c->res->body( $result_data);

}
#-------------------------------------------------------------------------------
sub get_homology_download : Chained( '/' )
               PathPart( 'search/homology_download' )
               Args(1) 
               #ActionClass( 'REST::ForBrowsers' ) 
		{
  my ( $this, $c, $job_id ) = @_;
  $c->log->debug( 'Tree_insertion::homology_download'. $job_id ) if $c->debug;
	if(!$job_id){
		$c->log->error( "Tree_insertion::homology_download: error: no job_id provided: |$@|" ) if $c->debug;

   	 	$c->res->body( 'Missing Job id/job id not found' );
    		$c->res->status( 500 );
    		return;	
	}
    my $filename = 'TreeFam.tree_insertion_homologs_' . $job_id. '.txt';
	my $result_type = $c->request()->param('result_type') || "labelledtree";
  	$c->log->debug("rest_get_results: ".$job_id." and ".$result_type);
	my $result = TreeFam::RAxMLModule::rest_get_result($job_id, $result_type);
	if(!$result){
		$c->log->debug("result is ".$result ) if $c->debug;
	}
	# strip unwanted characters off
	my $tree_with_insertion = $result;
	$tree_with_insertion =~ s/\n//g;
    	$tree_with_insertion =~ s/(?<=\[)[^]]+[^[]+(?=\])//g;
    	$tree_with_insertion =~ s/(\[|\])//g;
    	my $tree_with_insertion_original_names = $tree_with_insertion;	

	my $result_type = $c->request()->param('result_type') || "aln-fasta";
	my $homologs = TreeFam::WebPlugin::report_homologs({"tree_string" => $tree_with_insertion});
	$c->res->content_type('text/plain');
    $c->res->header( 'Content-disposition' => "attachment; filename=$filename" );
    $c->res->body( $homologs );

}

sub alignment_download : Chained( '/' )
               PathPart( 'search/alignment_download' )
               Args(1) 
               #ActionClass( 'REST::ForBrowsers' ) 
		{
  my ( $this, $c, $job_id ) = @_;
  $c->log->debug( 'Tree_insertion::alignment_download'. $job_id ) if $c->debug;
  #my $job_id = $c->request()->param('job_id');
	if(!$job_id){
		$c->log->error( "Tree_insertion::alignment_download: error: no job_id provided: |$@|" ) if $c->debug;

    $c->res->body( 'Missing Job id/job id not found' );
    $c->res->status( 500 );
    return;	
	}
    my $filename = 'TreeFam.tree_insertion_' . $job_id. '.fa';
	my $result_type = $c->request()->param('result_type') || "aln-fasta";
  	$c->log->debug("rest_get_results: ".$job_id." and ".$result_type);
  	
	$c->log->debug("rest_get_results: ".$job_id." and ".$result_type);
	
	my $result = TreeFam::MafftModule::rest_get_result($job_id, $result_type);
	    $c->res->content_type('text/plain');
    $c->res->header( 'Content-disposition' => "attachment; filename=$filename" );
    $c->res->body( $result );

}

#-------------------------------------------------------------------------------
sub tree_download : Chained( '/' )
               PathPart( 'search/tree_download' )
               Args(1) 
               #ActionClass( 'REST::ForBrowsers' ) 
		{
  my ( $this, $c, $job_id ) = @_;
  $c->log->debug( 'Tree_insertion::tree_download'. $job_id ) if $c->debug;
  #my $job_id = $c->request()->param('job_id');
	if(!$job_id){
		$c->log->error( "Tree_insertion::download_tree: error: no job_id provided: |$@|" ) if $c->debug;

    $c->res->body( 'Missing Job id/job id not found' );
    $c->res->status( 500 );
    return;	
	}
    my $filename = 'TreeFam.tree_insertion_' . $job_id. '.nhx';
    $c->log->debug( 'Family::Tree::download: tree data: |' . $c->stash->{treeData} . '|' )
        if $c->debug;

    $c->log->debug("Family::Tree::download: tree filename: |$filename|") if $c->debug;
	my $result_type = $c->request()->param('result_type') || "labelledtree";
  	$c->log->debug("rest_get_results: ".$job_id." and ".$result_type);
	my $result = TreeFam::RAxMLModule::rest_get_result($job_id, $result_type);
	if(!$result){
		$c->log->debug("result is ".$result ) if $c->debug;
	}
	# strip unwanted characters off
	my $tree_with_insertion = $result;
	$tree_with_insertion =~ s/\n//g;
    	$tree_with_insertion =~ s/(?<=\[)[^]]+[^[]+(?=\])//g;
    	$tree_with_insertion =~ s/(\[|\])//g;
    	my $tree_with_insertion_original_names = $tree_with_insertion;	

    $c->res->content_type('text/plain');
    $c->res->header( 'Content-disposition' => "attachment; filename=$filename" );
    $c->res->body( $tree_with_insertion_original_names );

}

#-------------------------------------------------------------------------------
sub tree_status : Chained( 'search' )
               PathPart( 'tree_status' )
               Args(0) 
               #ActionClass( 'REST::ForBrowsers' ) 
		{
  my ( $this, $c ) = @_;
  $c->log->debug( 'Search::sequence_status' ) if $c->debug;
  my $job_id = $c->request()->param('job_id');
	if(!$job_id){
        	$c->res->content_type('text/plain');
		$c->response->status(404);}  
	else{
		$c->log->debug( "1. checking with job: ".$job_id ) if $c->debug;
 
  	#$job_id = "hmmer_hmmscan-R20130624-145937-0856-63212028-hx";
  	$c->log->debug( "checking with job: ".$job_id ) if $c->debug;
  	my $status = TreeFam::RAxMLModule::rest_get_status($job_id);
	$c->log->debug( "status is : ".$status ) if $c->debug;
 	if($status ne "FINISHED" && $status ne "PENDING" && $status ne "RUNNING"){
		 $c->stash->{json}{errors} = "job in error state";
		 #$c->error("job in error state");
  		$c->log->debug( "well, why is there an error" ) if $c->debug;
        	$c->res->content_type('text/plain');
		$c->response->status(400);
	}  
	
	else{
        	$c->res->content_type('text/plain');
		$c->response->status(200);
     		$c->res->body( $status);
	}

	}
	return ;
}

sub alignment_status : Chained( 'search' )
               PathPart( 'alignment_status' )
               Args(0) 
               #ActionClass( 'REST::ForBrowsers' ) 
		{
  my ( $this, $c ) = @_;
  $c->log->debug( 'Search::sequence_status' ) if $c->debug;
  my $job_id = $c->request()->param('job_id');
	if(!$job_id){
        	$c->res->content_type('text/plain');
		$c->response->status(404);}  
	else{
		$c->log->debug( "1. checking with job: ".$job_id ) if $c->debug;
 
  	#$job_id = "hmmer_hmmscan-R20130624-145937-0856-63212028-hx";
  	$c->log->debug( "checking with job: ".$job_id ) if $c->debug;
  	my $status = TreeFam::MafftModule::rest_get_status($job_id);
	$c->log->debug( "status is : ".$status ) if $c->debug;
 	if($status ne "FINISHED" && $status ne "PENDING" && $status ne "RUNNING"){
		 $c->stash->{json}{errors} = "job in error state";
		 #$c->error("job in error state");
  		$c->log->debug( "well, why is there an error" ) if $c->debug;
        	$c->res->content_type('text/plain');
		$c->response->status(400);
	}  
	
	else{
        	$c->res->content_type('text/plain');
		$c->response->status(200);
     		$c->res->body( $status);
	}

	}
	return ;
}


sub sequence_status : Chained( 'search' )
               PathPart( 'sequence_status' )
               Args(0) 
               #ActionClass( 'REST::ForBrowsers' ) 
		{
  my ( $this, $c ) = @_;
  $c->log->debug( 'Search::sequence_status' ) if $c->debug;
  my $job_id = $c->request()->param('job_id');
	if(!$job_id){
        	$c->res->content_type('text/plain');
		$c->response->status(404);}  
	else{
		$c->log->debug( "1. checking with job: ".$job_id ) if $c->debug;
 
  	#$job_id = "hmmer_hmmscan-R20130624-145937-0856-63212028-hx";
  	$c->log->debug( "checking with job: ".$job_id ) if $c->debug;
  	my $status = TreeFam::HMMerModule::rest_get_status($job_id);
	$c->log->debug( "status is : ".$status ) if $c->debug;
 	if($status ne "FINISHED" && $status ne "PENDING" && $status ne "RUNNING"){
		 $c->stash->{json}{errors} = "job in error state";
		 #$c->error("job in error state");
  		$c->log->debug( "well, why is there an error" ) if $c->debug;
        	$c->res->content_type('text/plain');
		$c->response->status(400);
	}  
	
	else{
        	$c->res->content_type('text/plain');
		$c->response->status(200);
     		$c->res->body( $status);
	}

	}
	return ;
}
sub tree_get_results : Chained( 'search' )
               PathPart( 'tree_get_results' )
               Args(0) 
               #ActionClass( 'REST::ForBrowsers' ) 
		{
  	my ( $this, $c ) = @_;
  	$c->log->debug( 'Search::sequence_get_results' ) if $c->debug;
  	my $job_id = $c->request()->param('job_id');
  	my $to_file = $c->request()->param('to_file');
  	my $selected_treefam_family = $c->request()->param('selected_family');
  	my $result_type = $c->request()->param('result_type') || "labelledtree";
  	$c->log->debug("rest_get_results: ".$job_id." and ".$result_type);
	my $result = TreeFam::RAxMLModule::rest_get_result($job_id, $result_type);
	$c->log->debug("result is ".$result ) if $c->debug;
	
	# strip unwanted characters off
	my $tree_with_insertion = $result;
	$tree_with_insertion =~ s/\n//g;
    	$tree_with_insertion =~ s/(?<=\[)[^]]+[^[]+(?=\])//g;
    	$tree_with_insertion =~ s/(\[|\])//g;
    	my $tree_with_insertion_original_names = $tree_with_insertion;	
	$c->log->debug("result is ".$tree_with_insertion ) if $c->debug;
    	$c->forward( 'get_adaptors');
	
	#TreeFam::WebPlugin::reconvert_ids( { "raxml_results" => \$tree_with_insertion_original_names, "mafft_alignment" => \$ref_alignment, "ID_MAP" => \%ID_MAP } );
	# save tree to tmp
	#my $raxml_tree_cleaned = File::Temp->new( UNLINK => 1, SUFFIX => '.dat' );	
    	my $gene_tree_json =     TreeFam::WebPlugin::get_TF_gene_tree_json(
       				{ "genetree_adaptor" => $c->stash->{'genetree_adaptor'}, "selected_treefam_family" => $selected_treefam_family  });
  	#$c->log->debug("got gene_tree_json: ".$gene_tree_json);
     #  print $gene_tree_json."\n";
     #
     #  	#	die "end\n";
       	my $json = JSON->new->allow_nonref;
       	my $perl_scalar = $json->decode( $gene_tree_json );	
	my %leaf_information_hash;
	TreeFam::WebPlugin::analyse_json_tree_recursively({"node" => $perl_scalar, "leaf_href" =>\%leaf_information_hash});	
	my $domain_array = [];	
	TreeFam::WebPlugin::add_user_seq_info(
									   {
										 "leaf_href" => \%leaf_information_hash,
										 name        => "QUERY___EMBOSS_001",
										 taxon       => "UNKNOWN",
										 domains     => $domain_array
									   }
	);
	# convert to json	
	my $json_tree = TreeFam::WebPlugin::nhx2json( { input_tree_string => $tree_with_insertion, "leaf_href" =>\%leaf_information_hash } );
	#my $json_tree = TreeFam::WebPlugin::nh2json( { input_tree_string => $tree_with_insertion } );
	#$c->log->debug("tree json result is ".to_json($json_tree)) if $c->debug;
	my %result_to_json;
	#$result_to_json{"data"} =  $result;
	#$result_to_json{"json_tree"} =  $json_tree;
	#$result_to_json{"tree_with_insertion"} =  $tree_with_insertion;
  	#$c->log->debug("got gene_tree_json: ".to_json($json_tree));
       	$c->res->content_type('application/json');
	#$c->res->body( \%result_to_json);
	$c->res->body( to_json($json_tree));
	$c->response->status(200);	
	return 1;
	
}

sub alignment_get_results : Chained( 'search' )
               PathPart( 'alignment_get_results' )
               Args(0) 
               #ActionClass( 'REST::ForBrowsers' ) 
		{
  	my ( $this, $c ) = @_;
  	$c->log->debug( 'Search::alignment_get_results' ) if $c->debug;
  	
	my $job_id = $c->request()->param('job_id');
  	my $to_file = $c->request()->param('to_file');
  	my $result_type = $c->request()->param('result_type') || "aln-fasta";
  	
	$c->log->debug("rest_get_results: ".$job_id." and ".$result_type);
	
	my $result = TreeFam::MafftModule::rest_get_result($job_id, $result_type);
	my %result_to_json;
	$result_to_json{"data"} =  $result;
	#$c->log->debug("result is ".$result ) if $c->debug;
       	$c->res->content_type('text/plain');
	$c->res->body( to_json(\%result_to_json));
	$c->response->status(200);	
	return 1;
	
}
sub sequence_get_results : Chained( 'search' )
               PathPart( 'sequence_get_results' )
               Args(0) 
               #ActionClass( 'REST::ForBrowsers' ) 
		{
  	my ( $this, $c ) = @_;
  	$c->log->debug( 'Search::sequence_get_results' ) if $c->debug;
  	my $job_id = $c->request()->param('job_id');
  	my $to_file = $c->request()->param('to_file');
  	my $result_type = $c->request()->param('result_type') || "aln-fasta";
  	$c->log->debug( "1. checking with job: ".$job_id ) if $c->debug;
  	$c->log->debug( "checking with job: ".$job_id ) if $c->debug;
  	$c->log->debug("rest_get_results: ".$job_id." and ".$result_type);
	my $result = TreeFam::HMMerModule::rest_get_result($job_id, $result_type);
	my $hmmer_json = TreeFam::HMMerModule::convert_hmmer2json($result);	
	$c->log->debug("parse results here".$hmmer_json ) if $c->debug;
       	$c->res->content_type('text/plain');
	$c->res->body( $hmmer_json);
	return 1;
	
}

sub tree_submit : Chained( 'search' )
               PathPart( 'tree_submit' )
               Args(0) 
		{
  		my ( $this, $c ) = @_;
  		$c->log->debug( 'Search::tree_submit' ) if $c->debug;
  		my $algorithm = $c->request()->param('algorithm');
  		$c->log->debug( 'Search::tree_submit with algorithm: '.$algorithm ) if $c->debug;
  		#my $alignment = $c->request()->param('alignment');
  		#my $newick = $c->request()->param('newick');
  		my $alignment_job_id= $c->request()->param('alignment_job_id');
  		#my $alignment_job_id= "mafft_addseq-R20130702-123736-0379-2799437-oy";
		
  		my $selected_treefam_family= $c->request()->param('family');
  		$c->log->debug("tree algorithm is ", $algorithm) if $c->debug;
  		$c->log->debug("alignment job id is ", $alignment_job_id) if $c->debug;
		my $email = "fs\@ebi.ac.uk";
		my $title = "TreeFam_Tree_job";
	
		my $genetree_adaptor = $c->stash->{'genetree_adaptor'};
		my $gene_tree;
		my $ref_alignment;	
		
  		#$c->log->debug($algorithm) if $c->debug;
  		my $result_type = $c->request()->param('result_type') || "aln-fasta";
		#my $job_id = "mafft_addseq-R20130702-212750-0931-58811591-pg";
		my $mafft_alignment = TreeFam::MafftModule::rest_get_result($alignment_job_id, $result_type);
		#my $mafft_alignment = TreeFam::MafftModule::rest_get_result( $alignment_job_id, "aln-fasta" );
  		$c->log->debug("printing fetched mafft alignment now") if $c->debug;
  		#$c->log->debug($result) if $c->debug;
		if(!TreeFam::WebPlugin::get_TF_data(
                  { "genetree_adaptor" => $genetree_adaptor, "selected_treefam_family" => $selected_treefam_family, "gene_tree" => \$gene_tree, "ref_alignment" => \$ref_alignment }
		)){
  			$c->log->debug( "could not get data " ) if $c->debug;
		}
  		$c->log->debug("printing newick tree") if $c->debug;
  		#$c->log->debug($gene_tree) if $c->debug;
		my %params;
		$params{"alignment"} = $mafft_alignment;
		$params{"newick"} = $gene_tree;
		$params{"algorithm"} = $algorithm;
		$c->log->debug( "tree algorithm is ",$algorithm) if $c->debug;
		$c->log->debug( $algorithm ) if $c->debug;
		#$c->log->debug( $alignment ) if $c->debug;
		$c->log->debug( "submitting job" ) if $c->debug;
	
        	#my $job_id;
        	my $job_id = TreeFam::RAxMLModule::rest_run($email, $title, \%params );
        #my $job_id = "hmmer_hmmscan-R20130319-165856-0335-1805896-hx";
		if($job_id){
			print "got job_id: $job_id\n";
			chomp($job_id);
  			$c->log->debug( "job_id is ",$job_id ) if $c->debug;
			$c->stash->{job_id} = $job_id;
        		$c->res->content_type('text/plain');
     			$c->res->body( $job_id);
			$c->response->status(200);  
			return ;
		}
		else{
  			$c->log->debug( "job submitssion failed ") if $c->debug;
			$c->error("Job submission failed");
			$c->stash(error_msg => 'Job submission failed.');
        		$c->res->content_type('text/plain');
			$c->response->status(400);  
			return "Job submission failed";
		}
}

sub alignment_submit : Chained( 'search' )
               PathPart( 'alignment_submit' )
               Args(0) 
		{
  		my ( $this, $c ) = @_;
  		$c->log->debug( 'Search::alignment_submit' ) if $c->debug;
  		my $seq = $c->request()->param('seq');
  		my $fastaalign = $c->request()->param('fastaalign');
  		my $selected_treefam_family = $c->request()->param('family');
  		$c->log->debug( $seq ) if $c->debug;
  		$c->log->debug( $selected_treefam_family ) if $c->debug;
    		my $genetree_adaptor = $c->stash->{'genetree_adaptor'};
		my $gene_tree;
		my $ref_alignment;	
		if(!TreeFam::WebPlugin::get_TF_data(
                  { "genetree_adaptor" => $genetree_adaptor, "selected_treefam_family" => $selected_treefam_family, "gene_tree" => \$gene_tree, "ref_alignment" => \$ref_alignment }
		)){
  			$c->log->debug( "could not get data " ) if $c->debug;
		}
		# get alignment here
		my $email = "fs\@ebi.ac.uk";
		my $title = "TreeFam_Align_job";
	
		my %params;
		$params{"sequence"} = $seq;
		$params{"fastaalign"} = $ref_alignment;
		$c->log->debug( "submitting job" ) if $c->debug;
        	my $job_id = TreeFam::MafftModule::rest_run($email, $title, \%params );
        #my $job_id = "hmmer_hmmscan-R20130319-165856-0335-1805896-hx";
		if($job_id){
			print "got job_id: $job_id\n";
			chomp($job_id);
  			$c->log->debug( "job_id is ",$job_id ) if $c->debug;
			$c->stash->{job_id} = $job_id;
        		$c->res->content_type('text/plain');
     			$c->res->body( $job_id);
			$c->response->status(200);  
			return ;
		}
		else{
  			$c->log->debug( "job submitssion failed ") if $c->debug;
			$c->error("Job submission failed");
			$c->stash(error_msg => 'Job submission failed.');
        		$c->res->content_type('text/plain');
			$c->response->status(400);  
			return "Job submission failed";
		}
}



sub sequence_submit : Chained( 'search' )
               PathPart( 'sequence_submit' )
               Args(0) 
               #ActionClass( 'REST::ForBrowsers' ) 
		{
  		my ( $this, $c ) = @_;
  		$c->log->debug( 'Search::sequence_submit' ) if $c->debug;
  		my $seq = $c->request()->param('seq');
  		my $database = $c->request()->param('database');
  		$c->log->debug( $seq ) if $c->debug;
		my $email = "fs\@ebi.ac.uk";
		my $title = "TreeFam_HMMScan_job";
	
		my %params;
		$params{"sequence"} = $seq;
		$params{"database"} = $database;
		$c->log->debug( "submitting job" ) if $c->debug;
        	my $job_id = TreeFam::HMMerModule::rest_run($email, $title, \%params );
        #my $job_id = "hmmer_hmmscan-R20130319-165856-0335-1805896-hx";
		if($job_id =~ /^hmmer_hmmscan/){
			print "got job_id: $job_id\n";
			chomp($job_id);
  			$c->log->debug( "job_id is ",$job_id ) if $c->debug;
			$c->stash->{job_id} = $job_id;
        		$c->res->content_type('text/plain');
     			$c->res->body( $job_id);
			$c->response->status(200);  
			return ;
		}
		else{
  			$c->log->debug( "job submitssion failed ") if $c->debug;
			$c->error("Job submission failed");
			$c->stash(error_msg => 'Job submission failed.');
        		$c->res->content_type('text/plain');
			$c->response->status(400);  
			return "Job submission failed";
		}
}
=head1 METHODS

=head2 sequence : Chained('search') PathPart('sequence') Args ActionClass('REST::ForBrowsers')

Hook for RESTful actions for submitting searches (POST) and retrieving results
(GET).

=cut

sub sequence : Chained( 'search' )
               PathPart( 'sequence' )
               Args(0) 
               #ActionClass( 'REST::ForBrowsers' ) 
		{
  my ( $this, $c ) = @_;
  my @seqs = split /\n/, $c->req->param('seq');
  $c->stash->{tree_insertion} = $c->req->param('tree_insertion');
    $c->log->debug( "tree_algorithm is : ".$c->req->param('tree_insertion_algorithm'));
	if($c->req->param('tree_insertion_algorithm') eq "tree_insertion_parsimony"){
  		$c->stash->{tree_algorithm} = "y";
	}
	elsif($c->req->param('tree_insertion_algorithm') eq "tree_insertion_likelihood") {
  		$c->stash->{tree_algorithm} = "v";
	}
    $c->log->debug( "looking at tree_algorithm: ".$c->stash->{tree_algorithm});

  my $header;
  if ( $seqs[0] =~ /^\>([\w\s]+)/ ) {
    $c->log->debug( 'Search::parse_sequence: found a user-supplied FASTA header; stripping it' )
      if $c->debug;
    
    shift @seqs;
  }
  my $seq_without_gaps = uc( join '', @seqs );
	$seq_without_gaps =~ s/\s//g;
  if($seq_without_gaps =~ /^>/){
  	$seq_without_gaps =~ s/^>.+\n//;
  }	
  $c->stash->{seq} = $seq_without_gaps;
  $c->log->debug( "sequence is",$c->request()->param('seq') ) if $c->debug;
	
  $c->log->debug( 'Search::sequence: in sequence role' ) if $c->debug;
  $c->stash->{template} =  'pages/search/sequence/results.tt';
    return;
}
#-------------------------------------------------------------------------------

sub sequence_POST : Private {
  my ( $this, $c ) = @_;

  $c->log->debug( 'Search::sequence_POST: submitting search' )
    if $c->debug;
    $c->stash->{template} =  'pages/search/sequence/results.tt';
    return;

  # validate the input
  unless ( $c->forward('validate_single_sequence') ) {
  $c->log->debug( "sequence not valid\n" ) if $c->debug;

    if ( $c->req->looks_like_browser ) {
      # copy the error message to where it will be picked up by the search form
      # template
      $c->stash->{seqSearchError} = 
        $c->stash->{rest}->{error} || 
        'There was an unknown problem when validating your search sequence.';

      # go back to the search form
      $c->forward( 'search_page' );
    }
    else {
      $this->status_bad_request( # 400 Bad request
        $c,
        message => ( $c->stash->{rest}->{error} ||
                     'There was an unknown problem when validating your search.' )
      );

      # set a template, which will be used only if we're serialising to XML
      $c->stash->{template} = 'rest/search/error_xml.tt';
    }

    return;
  }

  # no errors with the input; try to submit the search

  if ( $c->forward('queue_seq_search') ) {
    # success
    $c->stash->{template} = $c->req->looks_like_browser
                          ? 'pages/search/sequence/results.tt'
                          : 'rest/search/poll_xml.tt';
  }
  else {
    # failure
    if ( $c->req->looks_like_browser ) {
      $c->stash->{seqSearchError} = 
        $c->stash->{rest}->{error} || 
        'There was an unknown problem when submitting your search.';
      $c->forward( 'search_page' );
    }
    else {
      # the "queue_seq_search" method will set an error status and a message if
      # there's a problem

      # set a template, which will be used only if we're serialising to XML
      $c->stash->{template} = 'rest/search/error_xml.tt';
    }
  }

  $c->log->debug( 'Search::sequence_POST: serialising results' )
    if $c->debug;
}

#-------------------------------------------------------------------------------

before [ 'sequence_GET', 'sequence_GET_html' ] => sub {
  my $this = shift;
  my ( $c, $job_id ) = @_;

  $c->log->debug( 'Search::before "sequence_GET*": checking job ID' )
    if $c->debug;

  # does the job ID look sensible ?
  unless ( $job_id =~ m/^\w{8}\-(\w{4}\-){3}\w{12}$/ ) {
    $c->log->debug( 'Search::before "sequence_GET*": no job ID or bad job ID' )
      if $c->debug;

    $this->status_bad_request( # 400 Bad request
      $c, 
      message => 'No valid job ID' 
    );

    return;
  }

  $c->stash->{jobId} = $job_id;

  $c->log->debug( qq(Search::before "sequence_GET*": got a valid job ID ($job_id)) )
    if $c->debug;
};

#---------------------------------------

sub sequence_GET_html : Private {
  my ( $this, $c, $job_id ) = @_;

  $c->log->debug( 'Search::sequence_GET_html: building HTML results page' )
    if $c->debug;

  $c->stash->{template} = 'pages/search/sequence/results.tt';
}

#---------------------------------------

sub sequence_GET : Private {
  my ( $this, $c, $job_id ) = @_;

  $c->log->debug( 'Search::sequence_GET: trying to retrieve results' )
    if $c->debug;

  # try to retrieve results
  $c->forward( 'JobManager', 'retrieveResults', [ $job_id  ] );

  # we should get *something*, even if there are no results, but let's just
  # check quickly
  unless ( $c->stash->{results}->{$job_id} ) {
    $c->log->debug( 'Search::sequence_GET: no results retrieved' )
      if $c->debug;

    $this->status_no_content( # 204 No content
      $c, 
      message => "We could not find any results for job ID $job_id" 
    );

    return;
  }

  my $results = $c->stash->{results}->{$job_id};

  # search is complete
  if ( $results->{status} eq 'DONE' ) {
    $c->log->debug( 'Search::sequence_GET: search complete, results retrieved' )
      if $c->debug;

    # parse the results
    $c->forward( 'handle_results', [ $job_id  ] );
  }

  # on hold
  elsif ( $results->{status} eq 'HOLD' ) {
    $c->log->debug( 'Search::sequence_GET": search on hold' )
      if $c->debug;
    
    $c->res->status( 503 ); # 503 Service unavailable
    $c->stash->{rest}->{error} = 'HOLD';
  }

  # deleted
  elsif ( $results->{status} eq 'DEL' ) {
    $c->log->debug( 'Search::sequence_GET": search deleted' )
      if $c->debug;
    
    $this->status_gone(
      $c,
      message => 'DEL'
    );
  }

  # either pending or running
  elsif ( $results->{status} eq 'PEND' or
          $results->{status} eq 'RUN' ) {
    $c->log->debug( 'Search::sequence_GET": search pending or running' )
      if $c->debug;
    
    $this->status_accepted( # 202 Accepted
      $c,
      location => $c->req->uri,
      entity => {
          status => $results->{status}
      }
    );
  }

  # any other status code indicates some terminal problem. Retrieve the 
  # contents of the stderr column from job_stream and return it in the
  # response
  else {
    $c->log->debug( 'Search::sequence_GET: search failed' )
      if $c->debug;

    # retrieve error message from STDERR
    my $error_message = $results->{job}->job_stream->stderr ||
                        'There was a problem running your job.';

    $c->res->status( 500 ); # Internal server error
    $c->stash->{rest}->{error} = $error_message;
  }

  # set the XML template. We may not use it, if the requested output format
  # is JSON, say, but it does no harm to set it. The same template should
  # handle the situation where there are no hits from the search
  $c->stash->{template} = 'rest/search/results_xml.tt';

  my $filename;
  if ( $c->req->accepts( 'application/json') ) {
    $filename = "rfam_search_$job_id.json";
  }
  elsif ( $c->req->accepts( 'text/xml') ) {
    $filename = "rfam_search_$job_id.xml";
  }

  $c->res->header( 'Content-Disposition' => "attachment; filename=$filename" )
    if $filename;

  # make sure there were some results
  unless ( scalar keys %{ $c->stash->{results} } ) {
    $c->log->debug( 'Search::sequence_GET: no results found' ) 
      if $c->debug;

    $this->status_no_content( # 204 No content
      $c, 
      message => "There there were no hits for job ID $job_id" 
    );

    return;
  }

  $c->log->debug( 'Search::sequence_GET: serialising results' )
    if $c->debug;
}

#-------------------------------------------------------------------------------
#- private actions -------------------------------------------------------------
#-------------------------------------------------------------------------------

=head2 validate_single_sequence : Private

Validate the form input. Returns 1 if all input validated, 0 otherwise.
Error messages are returned in the stash as "searchError". 

=cut

# this method made a lot more sense in Pfam, where it was used for processing
# fields in the form other than the sequence. In Rfam, there are no options, 
# but this stub is here just in case we want to add them at some point
sub validate_single_sequence : Private {
  my ( $this, $c ) = @_;
  
  # parse and validate the sequence itself
  unless ( $c->forward('parse_sequence') ) {
    $c->stash->{rest}->{error} ||= 'Invalid sequence. Please try again with a valid RNA sequence.';

    $c->log->debug( 'Search::validate_single_sequence: sequence parsing failed' )
      if $c->debug;

    return 0;
  }

  # no options to check right now

  $c->log->debug( 'Search::validate_single_sequence: validating input was successful' )
    if $c->debug;
      
  return 1;
}

#-------------------------------------------------------------------------------
  
=head2 parse_sequence : Private

Parses the sequence supplied by the CGI parameter "seq". Drops the sequence 
into the stash if it passed validation. Sets an error message in the stash if 
there was a specific problem.

=cut

sub parse_sequence : Private {
  my ( $this, $c ) = @_;

  # make sure we actually have a sequence...
  unless ( defined $c->req->param('seq') and
           $c->req->param('seq') ne '' ) {
    $c->stash->{rest}->{error} = 'You did not supply a nucleic-acid sequence.';
    
    $c->log->debug( 'Search::parse_sequence: no sequence; failed' )
      if $c->debug;
      
    return 0;
  }
 
   #$c->log->debug("$this is: ".Dumper($this)) if $c->debug; 
  # break the string into individual lines and get parse any FASTA header lines
  # before recombining. If there is no user-supplied FASTA header, one will be
  # supplied for them
  my @seqs = split /\n/, $c->req->param('seq');

  my $header;
  if ( $seqs[0] =~ /^\>([\w\s]+)/ ) {
    $c->log->debug( 'Search::parse_sequence: found a user-supplied FASTA header; stripping it' )
      if $c->debug;
    
    shift @seqs;
  }

  my $seq = uc( join '', @seqs );

  # handle various line endings. No need to worry about \n, since we got rid of
  # that with the "split" above
  $seq =~ s/[\s\r\d]+//g;
    $this->{maxSeqLength} = 1000;
    $this->{sequenceValidationRegex}  = '^[ACGUTSWMKRYBDHVN\-\.]+$'; 
# check the length of the sequence at this point. If it's too long, bail
  my $length = length $seq;
  if ( $length > $this->{maxSeqLength} ) {
    $c->stash->{rest}->{error} = 
        'Your sequence is too long. The maximum length of search sequences is '
      . $this->{maxSeqLength} . '  ('. $c->stash->{maxSeqLength}.') bases. The sequence you submitted is '. $length .' long. Please try again with a shorter '
      . 'sequence, or use the batch search form and get your results by email.';
    
    $c->log->debug( 'Search::parse_sequence: sequence is too long; failed' )
      if $c->debug;
    
    return 0;
  }

  # check that the sequence string contains only the appropriate letters. Bail
  # if it has anything else in it
  my $regex_string = $this->{sequenceValidationRegex};      
  my $regex = qr/$regex_string/i;
  if ( $seq =~ m/$regex/ ) {
  #unless ( $seq =~ m/$regex/ ) {
    $c->stash->{rest}->{error} = 
      'Invalid sequence. Please try again with a valid nucleic-acid sequence';
    
    $c->log->debug( 'Search::parse_sequence: sequence contains illegal characters' )
      if $c->debug;
    
    return 0;
  }

  # passed all checks; stuff the header (either user-supplied or generated here)
  # and the sequence into the stash
  $c->stash->{input}  = "> UserSeq\n" . $seq;

  $c->log->debug( 'Search::parse_sequence: parsing sequence was successful' )
    if $c->debug;
      
  return 1;
}

#-------------------------------------------------------------------------------

=head2 queue_seq_search : Private

Queues an Rfam search. Sets the HTTP response status and body appropriately.

=cut

sub queue_seq_search : Private {
  my ( $this, $c ) = @_;
  
  # first, check there's room on the queue
  my $rs = $c->model( 'WebUser::JobHistory' )
             ->find( { status   => 'PEND',
                       #job_type => 'rfam' },
                       job_type => 'treefam' },
                     { select => [ { count => 'status' } ],
                       as     => [ 'numberPending' ] } );
  
  $c->stash->{numberPending} = $rs->get_column( 'numberPending' );
  $c->log->debug( 'Search::queue_seq_search: |' . 
                  $c->stash->{numberPending} . '| jobs pending' ) if $c->debug;
 $this->{pendingLimit} = 100; 
  if ( $c->stash->{numberPending} >= $this->{pendingLimit} ) {
    $c->log->debug( 'Search::queue_seq_search: too many TreeFam jobs in queue ('
                    . $c->stash->{numberPending} . ')' ) if $c->debug;

    $c->res->status( 503 ); # 503 Service unavailable
    $c->stash->{rest}->{error} = 
      'There are currently too many TreeFam jobs in the sequence search queue. ' . 
      'Please try again in a little while';

    return 0;
  }
  
  #----------------------------------------

  # ok. There's room on the queue, so we can submit the hmmer job and, if 
  # required, the blast job
  my @jobs;
  
  unless ( $c->forward('queue_rfam') ) {
    $c->log->debug( 'Search::queue_seq_search: problem submitting Rfam search' )
      if $c->debug;
    
    $c->res->status( 500 ); # 500 Internal server error
    $c->stash->{rest}->{error} ||= 'There was a problem queuing your Rfam search';

    return 0;
  }

  #----------------------------------------

  # if we get to here, the job submission worked
  my $json = JSON::XS->new->utf8->convert_blessed;
  $c->stash->{jobStatusJSON} = $json->encode( $c->stash->{jobStatus} );
  
  $c->log->debug( 'Search::queue_seq_search: json string: |' 
                  . $c->stash->{jobStatusJSON} . '|' ) if $c->debug;

  $this->status_created( # 201 Created
    $c,
    location => $c->uri_for( $c->action, $c->stash->{jobId} ),
    entity   => $c->stash->{jobStatus}
  );

  $c->log->debug( 'Search::queue_seq_search: sequence search submitted')
    if $c->debug;

  return 1;
}

#-------------------------------------------------------------------------------

=head2 handle_results : Private

Parses the results and filter based on the the users defined parameters. The 
parsed results are put in a very generic format so that they can then be used 
for generating the results tables and graphics.

=cut

sub handle_results : Private {
  my ( $this, $c, $job_id ) = @_;
  
  $c->log->debug( "Search::handle_results: handling results for |$job_id|" )
    if $c->debug;

  # parse the log into a sensible data structure  
  $c->forward( 'parse_log', [ $job_id ] );
#  $c->log->debug( 'Search::Sequence::handle_results: results data structure: ' .
#                  dump( $c->stash->{rest}->{hits} ) ) if $c->debug;  

  # foreach my $hit ( @{ $c->stash->{rest}->{hits} } ) {
  foreach my $id ( keys %{ $c->stash->{rest}->{hits} } ) {
    foreach my $hit ( @{ $c->stash->{rest}->{hits}->{$id} } ) {
      $c->log->debug( 'Search::handle_results: hit: ', dump( $hit ) )
        if $c->debug;
      
      $hit->{alignment}->{ss}       = '           ';
      $hit->{alignment}->{hit_seq}  = sprintf '%10d ', $hit->{blocks}->[0]->{hit}->{start};
      $hit->{alignment}->{match}    = '           ';
      $hit->{alignment}->{user_seq} = sprintf '%10d ', $hit->{start};
          
      foreach my $block ( @{ $hit->{blocks} } ) {
        $hit->{alignment}->{ss}       .= $block->{ss};
        $hit->{alignment}->{hit_seq}  .= $block->{hit}->{seq};
        $hit->{alignment}->{match}    .= $block->{match};
        $hit->{alignment}->{user_seq} .= $block->{user}->{seq};
      }
          
      $hit->{alignment}->{ss}       .= '           ';
      $hit->{alignment}->{hit_seq}  .= sprintf ' %-10d', $hit->{blocks}->[-1]->{hit}->{end};
      $hit->{alignment}->{match}    .= '           ';
      $hit->{alignment}->{user_seq} .= sprintf ' %-10d', $hit->{end};

      # the blocks are really only need for building up the complete alignment
      # snippet so we'll remove them here to avoid having them clutter up output
      # formats like JSON
      delete $hit->{blocks};

      # keep track of the total number of matches
      $c->stash->{rest}->{numHits}++;
    }
  }

  # need to hash the hits according to rfam_acc, so that in the XML output
  # there will be one <match> per rfam family, under which there will be
  # one <location> for each hit for that family on the search sequence.

  # add some metadata
  my $raw = $c->stash->{results}->{$job_id}->{job};
  $c->stash->{rest}->{jobId}   = $job_id;
  $c->stash->{rest}->{opened}  = $raw->opened;
  $c->stash->{rest}->{started} = $raw->started;
  $c->stash->{rest}->{closed}  = $raw->closed;
  ( $c->stash->{rest}->{searchSequence} ) = $raw->stdin =~ m/^\> UserSeq\n(.*)/;
  # (strip off the FASTA header that was added before storing the sequence
  # in job_stream.)
  
  $c->log->debug( 'Search::handle_results: modified results data structure: ' .
                  dump( $c->stash->{rest}->{hits} ) ) if $c->debug;
}

#-------------------------------------------------------------------------------

=head2 parse_log : Private

Parses the output from the rfam_scan script and dumps the resulting data 
structure into the stash.

=cut

sub parse_log : Private {
  my ( $this, $c, $job_id ) = @_;
  
  # we need to look up the accession for a family, based on the ID
  #$c->forward( 'get_id_acc_mapping' );

  # split the log into individual lines and parse them 
  my @lines = split /\n/, $c->stash->{results}->{$job_id}->{rawData};
  
  my $hits     = {}; # everything...
  my $hit;           # an individual hit
  my $id       = ''; # the current family
  my $strand   = ''; # the current strand, plus or minus
  my ( $seq_start, $seq_end ); # sequence start/end positions
  my ( $hit_start, $hit_end ); # hit start/end positions

  for ( my $n = 0; $n < scalar @lines; $n++ ) {
    my $line = $lines[$n];
    
    # $c->log->debug( sprintf "Search::Sequence::parse_log: line % 3d: %s",
    #                         $n, $line ) if $c->debug;
    
    # store the name of the family for this hit
    if ( $line =~ m/^CM: ([\w\-]+)/ ) {
      # $c->log->debug( "Search::Sequence::parse_log: results for |$1|" )
      #   if $c->debug;
      $id = $1;
    }

    # sequence start/end
    elsif ( $line =~ m|^>.*?/(\d+)\-(\d+)$| ) {
      # $c->log->debug( "Search::Sequence::parse_log: sequence start-end: |$1-$2|" )
      #   if $c->debug;

      # store the ID for later
      $seq_start = $1;
      $seq_end   = $2;
    }

    # plus or minus strand
    elsif ( $line =~ m/^\s*(.*?) strand results/ ) {
      # $c->log->debug( "Search::Sequence::parse_log: results for |$1| strand" )
      #   if $c->debug;

      # store the strand
      $strand = $1 eq 'Plus' ? '+' : '-';
    }

    # get the sequence, start and end
    elsif ( $line =~ m|Query = (\d+) - (\d+), Target = (\d+) - (\d+)| ) {
      # if ( $c->debug ) {
      #   $c->log->debug( "Search::Sequence::parse_log: query start-end:  |$1 - $2|" );
      #   $c->log->debug( "Search::Sequence::parse_log: target start-end: |$3 - $4|" );
      # }

      if ( $4 > $3 ) {
        $hit_start = $3;
        $hit_end   = $4;
      }
      else {
        $hit_start = $4;
        $hit_end   = $3;
      }
    }

    # get the score, etc.
    elsif ( $line =~ m|Score = (.*?), E = (.*?), P = (.*?), GC =\s+(.*)$| ) {
      # if ( $c->debug ) {
      #   $c->log->debug( "Search::Sequence::parse_log: score: |$1|" );
      #   $c->log->debug( "Search::Sequence::parse_log: E:     |$2|" );
      #   $c->log->debug( "Search::Sequence::parse_log: P:     |$3|" );
      #   $c->log->debug( "Search::Sequence::parse_log: GC:    |$4|" );
      # }

      $hit = {
        id     => $id,
        strand => $strand,
        start  => $hit_start + $seq_start - 1,
        end    => $hit_end   + $seq_start - 1,
        score  => $1,
        E      => $2,
        P      => $3,
        GC     => $4,
        blocks => []
      };

      # try to map the family ID to its accession and store that too
      if ( $c->stash->{id_acc_mapping} and
           $c->stash->{id_acc_mapping}->{$id}) {
        $hit->{acc} = $c->stash->{id_acc_mapping}->{$id};
      }

      push @{ $hits->{$id} }, $hit;
      
      # parse the alignment blocks
      for ( my $b = $n + 2; $b < scalar @lines; $b += 5 ) {
        last unless $lines[$b+1] =~ m/^\s+\d+.*?\s+\d+\s*$/;
        
        # $c->log->debug( 'Search::Sequence::parse_log: block constitutes lines ' .
        #                 "$b - " . ( $b + 3 ) ) if $c->debug; 
        
        my $block = read_block( [ @lines[ $b .. $b+3 ] ] );
  
        # $c->log->debug( 'Search::Sequence::parse_log: block: ' .
        #                 dump( $block ) ) if $c->debug; 
        
        push @{ $hit->{blocks} }, $block;
      }
    }
  }
  
  # stash the parsed results
  $c->stash->{rest}->{hits} = $hits;
}

#-------------------------------------------------------------------------------

sub get_id_acc_mapping : Private {
  my ( $this, $c ) = @_;

  my $cache_key = 'id_acc_mapping';
  my $mapping = $c->cache->get( $cache_key );

  if ( $mapping ) {
    $c->log->debug( 'Search::get_id_acc_mapping: retrieved ID-to-acc mapping from cache' )
      if $c->debug;
  }
  else {
    $c->log->debug( 'Search::get_id_acc_mapping: failed to retrieve ID-to-acc mapping from cache; going to DB' )
      if $c->debug;

    my @families = $c->model( 'RfamDB::Rfam' )
                     ->search( {},
                               { columns => [ qw( rfam_acc rfam_id ) ] } );

    unless ( @families ) {
      $c->log->debug( 'Search::get_id_acc_mapping: failed to get list of families from DB' )
        if $c->debug;
      return;
    }

    %$mapping = map { $_->rfam_id => $_->rfam_acc } @families;

    unless ( scalar( keys %$mapping ) ) {
      $c->log->debug( 'Search::get_id_acc_mapping: no keys in mapping hash; not storing mapping' )
        if $c->debug;
      return;
    }

    # cache for one week
    $c->cache->set( $cache_key, $mapping, 604800 ) unless $ENV{NO_CACHE};
  }

  $c->log->debug( 'Search::get_id_acc_mapping: found ' . scalar( keys %$mapping ) 
                  . ' families in the mapping' )
    if $c->debug;

  $c->stash->{id_acc_mapping} = $mapping;
}

#-------------------------------------------------------------------------------
#- methods ---------------------------------------------------------------------
#-------------------------------------------------------------------------------

=head1 NON-ACTION METHODS

=head2 read_block

Given a reference to an array containing the four lines of an alignment block,
this function parses the block and returns a reference to a hash containing all 
of the relevant information.

=cut

sub read_block {
  my $lines = shift;

  my $block = {};

  $lines->[0] =~ s/^\s*(.*?)\s*$/$1/;
  $block->{ss} = $1;

  $lines->[1] =~ m/^\s+(\d+)\s+(.*?)\s+(\d+)\s*$/;
  $block->{hit}->{seq}   = $2;
  $block->{hit}->{start} = $1;
  $block->{hit}->{end}   = $3;

  $block->{match} = substr $lines->[2], 11, length $2;

  $lines->[3] =~ m/^\s+(\d+)\s+(.*?)\s+(\d+)\s*$/;
  $block->{user}->{seq}   = $2;
  $block->{user}->{start} = $1;
  $block->{user}->{end}   = $3;

  return $block;
}

#-------------------------------------------------------------------------------

=head1 AUTHOR

John Tate, C<jt6@sanger.ac.uk>

=head1 COPYRIGHT

Copyright (c) 2012 Genome Research Ltd.

Authors: John Tate (jt6@sanger.ac.uk)

This is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
details.

You should have received a copy of the GNU General Public License along with
this program. If not, see <http://www.gnu.org/licenses/>.

=cut

1;
