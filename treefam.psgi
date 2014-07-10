use strict;
use warnings;

use TreeFam;

my $app = TreeFam->apply_default_middlewares(TreeFam->psgi_app);
$app;

