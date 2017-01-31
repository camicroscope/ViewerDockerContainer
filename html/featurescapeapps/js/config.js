/**
 * Configure app in a block instead of hard-coding values inside the scripts.
 */
var config = {
    //domain: 'http://localhost:63342/FeatureScapeApps',
    domain: '/featurescapeapps',
    quipUrl: '/camicroscope/osdCamicroscope.php',
    //reserve4Url: 'http://reserve4.informatics.stonybrook.edu/dev1/osdCamicroscope.php',
    imgcoll: 'images',
    quot: "%22",
    iiifServer: location.hostname,
    iiifPrefix: 'fcgi-bin/iipsrv.fcgi?iiif=',
    default_execution_id: 'tahsin-test-1',
    default_db: 'quip',
    default_subject_id: 'TCGA-05-4396',
    default_case_id: 'TCGA-05-4396-01Z-00-DX1'
};
