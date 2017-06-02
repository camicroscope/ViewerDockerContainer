<!DOCTYPE html>
<html>
<head>
    <title>FeatureExplorer</title>
    <script src="../js/vendor/jquery-2.2.4.min.js"></script>
    <link rel="stylesheet" href="../css/bootstrap.min.css">
    <link rel="stylesheet" href="../css/bootstrap-theme.min.css">
    <script src="../js/vendor/bootstrap.min.js"></script>
    <script src="../js/vendor/localforage.min.js"></script>
    <script src="../js/vendor/d3.min.js"></script>
    <script src="../js/vendor/crossfilter.min.js"></script>
    <script src="../js/vendor/dc.js"></script>
    <link rel="stylesheet" href="../css/dc.min.css">
    <script src="../js/vendor/plotly-latest.min.js"></script>
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
                <strong>FeatureExplorer</strong> &ndash; patient-level feature exploration
                <i class="fa fa-github-alt" style="color:maroon"></i>
            </a>
        </i>
    </h3>
    <p>An interactive tool to allow patient-level feature exploration across multiple dimensions.</p>
    <p><span class="bg-info">To explore this tool, click, drag, or highlight on each graphic to evaluate interactions. Refresh page to reset.</span>
    </p>
    <div id="info1" style="font-weight: bold;"></div>
    <div id="info2"></div>
    <hr>
</div>
<div id="msg"></div>
<div id="select"></div>
<br>
<div id="section"></div>
<br>
<div id="ptslides"></div>
<br>
<div id="footer"></div>

<script src="../js/config.js"></script>
<script src="../js/findapi_config.js"></script>
<script src="../js/abcUtil.js"></script>
<script src="../js/jmat.js"></script>
<script src="fig4.js"></script>

</body>
</html>
