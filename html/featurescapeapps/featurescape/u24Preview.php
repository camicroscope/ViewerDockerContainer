<!DOCTYPE html>
<html>
<head>
    <title>SlideSelect</title>
    <script src="../js/vendor/jquery-2.2.4.min.js"></script>
    <link rel="stylesheet" href="../css/bootstrap.min.css">
    <script src="../js/vendor/bootstrap.min.js"></script>
</head>
<body>
<script src="http://www.w3schools.com/lib/w3data.js"></script>
<div w3-include-html="../header.html"></div>
<script>
    w3IncludeHTML();
</script>
<!-- Begin Content -->
<div id="header">
    <h3>
        <i style="font-family:Palatino;color:maroon">
            <a href="https://github.com/SBU-BMI/FeatureScapeApps" target="_blank">
                <strong>SlideSelect</strong> &ndash; select a slide for FeatureScape
                <!--&ndash; Preview of using FeatureScape to explore different patient case
                IDs.-->
                <i class="fa fa-github-alt" style="color:maroon"></i>
            </a>
        </i>
    </h3>
    <p>Explore different diagnostic images below. The first link takes you to caMicroscope to view the diagnostic image and the Explore Features button lets you examine the features.</p>
    <div id="info1"></div>
    <div id="info2"></div>
    <hr>
</div>
<div id="msg"></div>
<div id="select"></div>
<br>
<div id="section"></div>
<br>
<div id="footer"></div>

<script src="../js/config.js"></script>
<!--<script src="../js/findapi_config.js"></script>-->
<script src="../../js/config.js"></script>
<script src="../js/abcUtil.js"></script>
<script src="u24Preview.js"></script>

</body>
</html>
