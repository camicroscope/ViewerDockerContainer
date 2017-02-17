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
    <title>[User: quip -- Select Page]</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="css/normalize.min.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/bootstrap/css/bootstrap.css">
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
    <nav role="navigation" class="navbar navbar-default navbar-fixed-top">
        <div class="container">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" data-target="#navbarCollapse" data-toggle="collapse" class="navbar-toggle">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a href="#" class="navbar-brand"><abbr title="Quantitative Imaging for Pathology">QuIP</abbr></a>
            </div>
            <!-- Collection of nav links and other content for toggling -->
            <div id="navbarCollapse" class="collapse navbar-collapse">
                <ul class="nav navbar-nav navbar-right">
                    <li class="active"><a href="#"><abbr title="QuIP Home"><img src="/camicroscope/img/home_rest.png" alt="">Home</abbr></a></li>
                    <li><a href="/imageformuploader.htm" data-toggle="tooltip" data-placement="bottom" title="Upload images">Image Loader</a></li>
                    <li><a href="/FlexTables/index.php" data-toggle="tooltip" data-placement="bottom" title="Image and Results Viewer">caMicroscope</a></li>
                    <li><a href="/featurescapeapps/featurescape/u24Preview.html" data-toggle="tooltip" data-placement="bottom" title="Visual Feature Analytics">FeatureScape</a></li>
                    <li><a href="https://github.com/SBU-BMI/quip_distro" data-toggle="tooltip" data-placement="bottom" title="Distribution and Installation" target="_blank">Repository</a></li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="container">
        <div class="panel">
            <div class="panel-body">
                <div class="row">
                <div class="col-md-12">
                    <p>&nbsp;</p>
                </div>
            </div>
                <div class="row">
                    <div class="col-md-12">Welcome to <span data-toggle="tooltip" title="Quantitative Imaging for Pathology" style="font-size:16px;"><strong>QuIP:
                        Quantitative Imaging for Pathology</strong></span> &ndash; a web accessible tool set designed to support analysis, management, and exploration of whole slide tissue images for cancer research.  QuIP is under active development.  Stay tuned for more tools and applications!  The full QuIP suite will enable cancer researchers to assemble and visualize detailed, multi-scale descriptions of tissue morphologic changes and to identify and analyze features across individuals and cohorts. This is an NIH funded multi-site collaborative effort between Stony Brook University, Emory University, Oak Ridge National Labs, and Yale University. Click on any of the colored buttons to launch the associated tool.
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="panel panel-success">
            <div class="panel-heading">
                <h3 class="panel-title">Image Loader</h3>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-4"><a class="btn btn-success btn-block" href="/imageformuploader.htm" data-toggle="tooltip" data-placement="bottom" title="Upload whole slide tissue images to QuIP">Upload Images</a></div>
                    <div class="col-md-8">Web application for loading whole slide tissue images to QuIP.</div>
                </div>
                <div class="row"><br /></div>
            </div>
        </div>
        <div class="panel panel-info">
            <div class="panel-heading">
                <h3 class="panel-title">Image and Results Viewer</h3>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-12">
                        <p></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4"><a class="btn btn-info btn-block" href="/FlexTables/index.php" data-toggle="tooltip" data-placement="bottom" title="Access caMicroscope">caMicroscope</a></div>
                    <div class="col-md-8">You can view whole slide tissue images and nuclear segmentations. Click on the magnifier icon to choose algorithm results. <b>You may zoom in, zoom out, and pan the images. Mouse Click: Zoom in, Shift-Click: Zoom out.</b></div>
                </div>
                <div class="row"><br /></div>
            </div>
        </div>
        <div class="panel panel-warning">
            <div class="panel-heading"><h3 class="panel-title">Visual Feature Analytics</h3></div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-4"><a class="btn btn-warning btn-block" href="/featurescapeapps/featurescape/u24Preview.html" data-toggle="tooltip" data-placement="bottom" title="Access FeatureScape">FeatureScape</a></div>
                    <div class="col-md-8">A visual analytics platform for exploring slide-level imaging features
                        generated by analysis of whole slide tissue images to QuIP.</div>
                </div>
                <div class="row"><br /></div>
            </div>
        </div>
        <div class="panel panel-default" id="repository">
            <div class="panel-heading">
                <h3 class="panel-title"><a data-toggle="collapse" href="#collapse1"><abbr title="QuIP Distribution and Installation">QuIP Repository</abbr></a></h3>
            </div>
            <div id="collapse1" class="panel-collapse collapse">
                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-4"><a class="btn btn-default btn-block"  href="https://github.com/SBU-BMI/quip_distro" target="_blank" data-toggle="tooltip" data-placement="bottom" title="Information on  QuIP Distribution and Installation">DISTR &amp INST</a></div>
                        <div class="col-md-8">QuIP distribution and installation</div>
                    </div>
                    <div class="row"><br /></div>
                </div>
            </div>
        </div>
        <div class="footer">
            <p>U24 CA18092401A1, <b>Tools to Analyze Morphology and Spatially Mapped Molecular Data</b>; <i>Joel Saltz
                PI</i> Stony Brook/Emory/Oak Ridge/Yale<br>NCIP/Leidos 14X138, <b>caMicroscope &ndash; A Digital Pathology
                Integrative Query System</b>; <i>Ashish Sharma PI</i> Emory/WUSTL/Stony Brook<br /></p>
        </div>
</div>
<!-- /container -->
<script src="js/main.js"></script>
    
<script>
    $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();   
    });
</script>

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