<?php
session_start();
require 'authenticate.php';
require_once 'config/security_config.php';
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
    <title>[User: <?php echo $_SESSION["name"]; ?> -- Select Page]</title>
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
    <script>
    function logOut() {
        $.post( "security/server.php?logOut", {},
        function() {
            window.location = "index.php";
        });
    gapi.auth.signOut();
    };
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
              <li> <a href="http://imaging.cci.emory.edu/wiki/x/RwAJ">User Guide</a> </li>
              <li> <a onclick="logOut(); return false;" href="#">Logout <?php echo $_SESSION["name"]; ?></a> </li>
            </ul>
            <h3 class="text-muted">caMicroscope</h3> </div>
        </div>
      </div>
    </div>
    <div class="row marketing">
      <div class="panel panel-primary">
        <div class="panel-heading">
          <h3 class="panel-title">Latest Version</h3> </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-md-8">This is the latest version of caMicroscope. The data in this site includes clinical data and whole slide images from the TCGA Breast Invasive Carcinoma (BRCA). More details on the data can be found <a href="https://tcga-data.nci.nih.gov/tcga/tcgaCancerDetails.jsp?diseaseType=BRCA&diseaseName=Breast%20invasive%20carcinoma">here</a>. <br>Upon launch, you are presented with a simplistic clinical data browser. Click on any patient to launch the whole slide image in caMicroscope. You may need to disable your popup blocker. </div>
            <div class="col-md-4"> <a class="btn btn-primary btn-block" href="camicroscope/index.php?viewer=osd">caMicroscope</a> </div>
          </div>
        </div>
      </div>
      <div class="panel panel-success">
        <div class="panel-heading">
          <h3 class="panel-title">Clinical Data Explorer</h3> </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-md-8">This is an interactive clinical data explorer that is built using Microsoft PivotViewer. You can browse the various clinical data attributes, filter on one or more columns, and obtain summary statistics. Once you have created a subset of interest you can then launch the associated whole slide images and visualize them using the caMicroscope OSD Edition.<br><font color="red">You will need the Sliverlight plugin, and will need to disable your popup blocker</font>. Here is a <a href="http://imaging.cci.emory.edu/wiki/download/attachments/589895/PivotHelpGuide.jpg?api=v2">simple user guide</a> to help you get started.</div>
            <!--            <div class="col-md-4"> <a class="btn btn-success btn-block" href="/camicroscope/pivot/">Clinical Data Explorer</a> </div>
 -->
            <div class="col-md-4"> <a class="btn btn-success btn-block" href="pivot/index.php">Clinical Data Explorer</a> </div>
          </div>
        </div>
      </div>
      <div class="panel panel-warning">
        <div class="panel-heading">
          <h3 class="panel-title">Data Scope — Alpha Version - UNSTABLE!!!</h3> </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-md-8">DataScope is an interactive explorer that allows you to browse and integrate multiple data types. In this demo, data from a coclinical study is presented. This data includes clinical data, radiology and pathology data, and pathology images. All visualization panels are interactive and are linked with each other. The data comes from Robert Cardiff (from UCDavis), and the TCGA BRCA study.</div>
            <div class="col-md-4"> <a class="btn btn-warning btn-block" href="http://imaging.cci.emory.edu/datascope/">Data Scope</a> </div>
          </div>
        </div>
      </div>
      <div class="panel panel-danger">
        <div class="panel-heading">
          <h3 class="panel-title">Developer Version</h3> </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-md-8">This version that is linked below is currently under development. This includes support for spatial queries as well as templates and analytical services. The data provided by this dev instance includes segmentations from the BMI department at StonyBrook University. This version renders images without any file conversion (i.e. Scanner --&gt; Viewer). The segmentations are stored as JSON documents on MongoDB. </div>
            <div class="col-md-4"> <a class="btn btn-danger btn-block" href="http://camicroscope.org/camicroscope-dev">Dev Version</a> </div>
          </div>
        </div>
      </div>
      <div class="panel panel-danger">
        <div class="panel-heading">
          <h3 class="panel-title">Developer Version Deprecate Mootools</h3> </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-md-8">This version that is linked below is currently under development. This includes support for spatial queries as well as templates and analytical services. The data provided by this dev instance includes segmentations from the BMI department at StonyBrook University. This version renders images without any file conversion (i.e. Scanner --&gt; Viewer). The segmentations are stored as JSON documents on MongoDB. </div>
            <div class="col-md-4"> <a class="btn btn-danger btn-block" href="http://camicroscope.org/camicroscope-dev2">Dev Version</a> </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
        <p>NCIP/Leidos 14X138, caMicroscope — A Digital Pathology Integrative Query System<br>Ashish Sharma (ashish.sharma@emory.edu) PI, Emory/WUSTL/StonyBrook</p>
    </div>
  </div>
  <!-- /container -->
    <div class="modal fade" id="myModal">
	    <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" 
            aria-hidden="true">×</button>
            <h4 class="modal-title">About</h4>
          </div>
          <div class="modal-body">
            <p class="para">This is the latest version of caMicroscope. It can interactively visualize digitized whole slide pathology images, in the proprietary scanner formats, without any image preprocessing. It supports popular formats such as Aperio, Hamamatsu, Leica, Ventana etc. It also gives users the ability to create markups and annotations, as well as display human and machine generated markups. The markups are stored in MongoDB. It also includes an API that can be used to access common query/retrieve functions. caMicroscope is built using robust open-source technologies and libraries such as IIPImage and OpenSeaDragon.</p>
           <p class="para">It is currently used to host and manage NLST Pathology data as well other pathology datasets in The Cancer Imaging Archive. It is also being used by the BMI department at Stonybrook University to manage ~20,000 images and associated nuclear segmentations.</p>
           <p class="para">This data on this site includes clinical data and whole slide images from the TCGA Breast Invasive Carcinoma (BRCA). More details on the data can be found <a href="https://tcga-data.nci.nih.gov/tcga/tcgaCancerDetails.jsp?diseaseType=BRCA&diseaseName=Breast%20invasive%20carcinoma">here</a></p>
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
    ga('create', 'UA-46271588-1', 'auto');
    ga('send', 'pageview');
</script>
</body>
</html>
