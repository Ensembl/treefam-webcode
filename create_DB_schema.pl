use DBIx::Class::Schema::Loader qw/ make_schema_at /;
    make_schema_at(
            'TreeFamDB',
            { debug => 1, dump_directory => '/Users/fs9/bioinformatics/current_projects/treefam9/TreeFamWeb/db/' },
                    [ "dbi:mysql:dbname=treefam_homology_67x;host=localhost;port=3306", "root", "123",
                                    ],
                                        );


