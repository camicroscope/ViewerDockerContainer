<?php
session_start();
//require 'authenticate.php';
require_once 'config/security_config.php';
$_SESSION["name"] = "quip";
?>
<!DOCTYPE html>
<!--[if lt IE 7]>
<html class="no-js lt-ie9 lt-ie8 lt-ie7" lang=""> <![endif]-->
<!--[if IE 7]>
<html class="no-js lt-ie9 lt-ie8" lang=""> <![endif]-->
<!--[if IE 8]>
<html class="no-js lt-ie9" lang=""> <![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js" lang=""> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>[User: <?php echo $_SESSION["name"]; ?> -- QuIP login]</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="css/normalize.min.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/bootstrap/css/bootstrap.css">
	<link rel="stylesheet" href="css/frontPage.css">
    <link rel="stylesheet" href="css/selectPage.css">

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="js/vendor/modernizr-2.8.3.min.js"></script>
    <script src="https://apis.google.com/js/client:platform.js?onload=start" async defer></script>
    <script src="js/vendor/bootstrap/bootstrap.min.js"></script>
	<script src="featurescapeapps/js/findapi_config.js"></script>
    <script>
        function logOut() {
            $.post("security/server.php?logOut", {},
                    function () {
                        window.location = "index.php";
                    });
            gapi.auth.signOut();
        }
    </script>
</head>
<body>
<!--[if lt IE 8]>
<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade
    your browser</a> to improve your experience.</p>
<![endif]-->
<div class="container">
    <div class="navbar navbar-default navbar-fixed-top">
        <div class="container">
            <div>
                <div class="header">
                    <ul class="nav nav-pills pull-right">
                        <li>
                            <a href="#myModal" data-toggle="modal" data-target="#myModal">About</a>
                        </li>
                        <li><a href="http://imaging.cci.emory.edu/wiki/x/RwAJ">User Guide</a></li>
                        <!--<li><a onclick="logOut(); return false;" href="#">Logout <?php echo $_SESSION["email"]; ?></a>
                        </li>-->
                    </ul>
                    <h3 class="text-muted">QuIP</h3>
                </div>
                <div></div>
            </div>
        </div>
    </div>
    <div class="row marketing">
        <div class="panel">
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-12">Welcome to <span data-toggle="tooltip"
                                                            title="Quantitative Imaging in Pathology"><strong>QuIP</strong></span> &ndash;
                        a web accessible tool set designed to support
                        analysis, management, and exploration
                        of whole slide tissue images for cancer research. This is an NIH funded multi-site collaborative
                        effort between
                        Stony Brook University, Emory University, Oak Ridge National Labs, and Yale University. Click on
                        any of the
                        colored buttons to launch the associated tool.
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="panel panel-success">
        <div class="panel-heading">
            <h3 class="panel-title">Image and Results Viewer</h3>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-4"><a class="btn btn-success btn-block" href="/FlexTables/index.php" title="Access caMicroscope">caMicroscope</a></div>
                <div class="col-md-8">You can view whole slide tissue images and nuclear segmentations. Click on the magnifier icon to choose algorithm results. <b>You may zoom in, zoom out, and pan the images. Mouse Click: Zoom in, Shift-Click: Zoom out.</b>
                </div>
            </div>
        </div>
    </div>
    <div class="panel panel-info">
        <div class="panel-heading">
            <h3 class="panel-title">Visual Feature Analytics</h3>
        </div>
        <div class="panel-body">
            <!--<div class="row">
                <div class="col-md-12">
                    <p>
                    This suite of interactive tools work together to allow interrogation of multiple
                    parameters including: cancer
                    type, age, patient demographics, nuclear morphologic features and survival, gene expression, and the
                    interaction
                    that impact survival curve, allowing direct visual evaluation as well as computer extracted
                    information to
                    evaluate patient survival.</p>
                </div>
            </div>-->
            <!--<div class="row">
                <div class="col-md-4"><a class="btn btn-info btn-block"
                                         href="/featurescapeapps/featurescape/fig4.html">FeatureExplorer</a>
                </div>
                <div class="col-md-8">An interactive tool to allow patient-level feature exploration across   
                    multiple dimensions.
                </div>
            </div>
            <div class="row"><br></div>-->
            <div class="row">
                <div class="col-md-4"><a class="btn btn-info btn-block"
                                         href="/featurescapeapps/featurescape/u24Preview.html" title="Access FeatureScape">FeatureScape</a>
                </div>
                <div class="col-md-8">A visual analytics platform for exploring slide-level imaging features
                    generated by analysis of whole slide tissue images to QuIP
                </div>
            </div>
        </div>
    </div>
	<!--<div class="panel panel-warning">
        <div class="panel-heading">
            <h3 class="panel-title">Clinical Data Query</h3></div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-4"><a class="btn btn-warning btn-block"
                                         href="/featurescapeapps/openHealth/?/featurescapeapps/openHealth/tcgascope.js">TCGAScope</a>
                </div>
                <div class="col-md-8">An interactive dashboard to explore interrelations between patient demographics, pathologist-
				    generated diagnostic keywords, and outcomes based on publicly-available TCGA data. Through integration into
				    FeatureExplorer and FeatureScape individual corresponding images and results can be explored further.
                </div>
            </div>
        </div>
    </div>-->
	<!--Upload images start-->
	<div class="panel panel-warning">
        <div class="panel-heading">
            <h3 class="panel-title">Upload Images</h3>
        </div>
		<div class="panel-body">
            <div class="row">
                <div class="col-md-4"><a class="btn btn-warning btn-block"  onClick="location.href=dataLoaderConfig.dataLoaderAPI + ':' + dataLoaderConfig.port + '/' + 'imageformuploader.htm'" title="Access Image Loader">Image Loader</a></div>
                <div class="col-md-8">Web application for loading whole slide tissue images to QuIP
                </div>
            </div>
        </div>
    </div>
	<!--Upload images end-->
	<!--Other start-->
	 <div class="panel-group">
        <div class="panel panel-info">
            <div class="panel-heading">
                <h3 class="panel-title">
                    <a data-toggle="collapse" href="#collapse1" title="View GitHub Repositories">GitHub Repositories</a>
                </h3>
            </div>
            <div id="collapse1" class="panel-collapse collapse">
                <div class="panel-body"><p>Links to our GitHub repositories for FeatureDB, analysis codes and Region Templates framework</p>
                    <div>
                       <ul class="list-group">
                           <li class="list-group-item"><a href="https://github.com/SBU-BMI/pathomics_featuredb">FeatureDB</a></li>
                           <li class="list-group-item"><a href="https://github.com/SBU-BMI/pathomics_analysis">Analysis</a></li>
                           <li class="list-group-item"><a href="https://github.com/SBU-BMI/region-templates">Region Templates framework</a></li>
                        </ul>
                    </div>
                </div>
                <!--<div class="panel-footer">Panel Footer</div>-->
            </div>
        </div>
        <div class="panel panel-info">
            <div class="panel-heading">
                <h3 class="panel-title">
                    <a data-toggle="collapse" href="#collapse2" title="View Docker Hub Image Repository">Docker Hub Image Repository</a>
                </h3>
            </div>
            <div id="collapse2" class="panel-collapse collapse">
                <div class="panel-body">
                    <div>
                       <ul class="list-group">
                           <li class="list-group-item"><a href="https://hub.docker.com/r/sbubmi/pathomics_featuredb">FeatureDB Docker Image</a></li>
                           <li class="list-group-item"><a href="https://hub.docker.com/r/sbubmi/pathomics_nucleus">Docker Image for pathology imageanalysis codes</a></li>
                        </ul>
                    </div>
                </div>
                <!--<div class="panel-footer">Panel Footer</div>-->
            </div>
        </div>
		<div class="footer">
        <hr>
        <p>U24 CA18092401A1, <b>Tools to Analyze Morphology and Spatially Mapped Molecular Data</b>; <i>Joel Saltz
            PI</i> Stony Brook/Emory/Oak Ridge/Yale<br>NCIP/Leidos 14X138, <b>caMicroscope &ndash; A Digital Pathology
            Integrative Query System</b>; <i>Ashish Sharma PI</i> Emory/WUSTL/Stony Brook</p>
        </div>
    </div>
	<!--Other end-->
    <!--<div class="panel panel-success">

        <div class="panel-heading">
            <h3 class="panel-title">GitHub repositories</h3>
        </div>

        <div class="panel-body">
            <div><p>Links to our GitHub repositories for FeatureDB, analysis codes, Slicer pathology
                extensions, and Region Templates framework</p>
            </div>
            <table class="table">
                <tbody>
                <tr>
                    <td><a href="https://github.com/SBU-BMI/pathomics_featuredb">FeatureDB</a></td>
                </tr>
                <tr>
                    <td><a href="https://github.com/SBU-BMI/pathomics_analysis">Analysis</a></td>
                </tr>
                <tr>
                    <td><a href="https://github.com/SBU-BMI/SlicerPathology">Slicer pathology extensions</a></td>
                </tr>
                <tr>
                    <td><a href="https://github.com/SBU-BMI/region-templates">Region Templates framework</a></td>
                </tr>
                </tbody>
            </table>

        </div>
    </div>
    <div class="panel panel-info">
        <div class="panel-heading"><h3 class="panel-title">Docker Hub image repository</h3></div>
        <div class="panel-body">
            <table class="table">
                <tbody>
                <tr>
                    <td><a href="https://hub.docker.com/r/sbubmi/pathomics_featuredb">FeatureDB Docker Image</a></td>
                </tr>
                <tr>
                    <td><a href="https://hub.docker.com/r/sbubmi/pathomics_nucleus">Docker Image for pathology image
                        analysis codes</a></td>
                </tr>
                <tr>
                    <td><a href="https://hub.docker.com/r/sbubmi/pathomics_micnn">Docker Image for Multi-instance
                        CNN</a></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="footer">
        <hr>
        <p>U24 CA18092401A1, <b>Tools to Analyze Morphology and Spatially Mapped Molecular Data</b>; <i>Joel Saltz
            PI</i> Stony Brook/Emory/Oak Ridge/Yale<br>NCIP/Leidos 14X138, <b>caMicroscope &ndash; A Digital Pathology
            Integrative Query System</b>; <i>Ashish Sharma PI</i> Emory/WUSTL/Stony Brook</p>
    </div>
</div>-->
<!-- /container -->
<div class="modal fade" id="myModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"
                        aria-hidden="true">&times;
                </button>
                <h4 class="modal-title">About</h4>
            </div>
            <div class="modal-body">
                <p>This site hosts web accessible applications and tools designed to support analysis, management, and
                    exploration of whole slide tissue images for cancer research. The goals of the parent project are to
                    develop, deploy, and disseminate a suite of open source tools and integrated informatics platform
                    that will facilitate multi-scale, correlative analyses of high resolution whole slide tissue image
                    data, spatially mapped genetics and molecular data. The software and methods will enable cancer
                    researchers to assemble and visualize detailed, multi-scale descriptions of tissue morphologic
                    changes and to identify and analyze features across individuals and cohorts.</p>
                <!--<p>The current set of applications has been developed and supported by several frameworks and middleware
                    systems including:<br>
                <ul>
                    <li><b>caMicroscope</b> &ndash; Digital pathology data management, visualization and analysis
                        platform. It also includes <i>FeatureDB,</i>&nbsp;a database based on NoSQL technologies for
                        management and query of segmentation results and features from whole slide tissue image
                        analysis.
                    </li>
                    <li><span><b>OpenHealth</b> &ndash; a web computing application to query and explore publicly available health data.</span>
                    </li>
                    <li><span><b>Hadoop-GIS</b> &ndash; A Cloud-enabled spatial data system for high performance spatial queries and analytics.</span>
                    </li>
                    <li><span><b>WSI-Analytics</b> &ndash; A suite of methods for segmentation of nuclei in whole slide tissue images and computation of texture and shape features for each segmented nucleus.</span>
                    </li>
                </ul>-->
                <p>This work is supported in part by NCI U24 CA18092401A1 (Tools to Analyze Morphology and Spatially
                    Mapped Molecular Data, PI: Joel Saltz), NCIP/Leidos 14X138 (caMicroscope &ndash; A Digital Pathology
                    Integrative Query System; PI: Ashish Sharma). The U24 project is a collaboration between Stony Brook
                    University, Emory University, Oak Ridge National Laboratory and Yale University. The caMicroscope
                    project is a collaboration between Emory University, Washington University in St. Louis and Stony
                    Brook University.</p>
            </div>
        </div>
    </div>
</div>
<script src="js/main.js"></script>

<!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
<script>
    (function (b, o, i, l, e, r) {
        b.GoogleAnalyticsObject = l;
        b[l] || (b[l] =
                function () {
                    (b[l].q = b[l].q || []).push(arguments)
                });
        b[l].l = +new Date;
        e = o.createElement(i);
        r = o.getElementsByTagName(i)[0];
        e.src = '//www.google-analytics.com/analytics.js';
        r.parentNode.insertBefore(e, r)
    }(window, document, 'script', 'ga'));
    ga('create', 'UA-63421849-1', 'auto');
    ga('send', 'pageview');
</script>
</body>
</html>
