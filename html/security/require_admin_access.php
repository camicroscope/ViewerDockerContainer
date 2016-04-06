<?php
//require 'authenticate.php';
require_once '../config/security_config.php';

if(isset($_SESSION["email"]) && isAdmin($_SESSION["email"]))
{
	global $folder_path;
	return;
}
else {
	?>
		<!DOCTYPE html>
<html>
	<head>
		<!-- Latest compiled and minified JavaScript -->
		<script src="http://code.jquery.com/jquery-1.9.0.js"></script>
		<script src="http://code.jquery.com/jquery-migrate-1.2.1.js"></script>
		<!-- Latest compiled and minified CSS -->
		<!-- Latest compiled and minified CSS -->
		<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css">

		<!-- Optional theme -->
		<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-theme.min.css">

		<!-- Latest compiled and minified JavaScript -->
		<script src="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>
	</head>
	<title>caMicroscope </title>
	<body style="padding-top: 10px;">
		
		<nav class="navbar navbar-inverse navbar-static-top" role="navigation">
  				<div class="navbar-header">
    
    			<a class="navbar-brand" href="<?php echo $folder_path ?>"><h1>caMicroscope</h1></a>
  				</div>
  				
  				
  				<div class="nav navbar-nav navbar-right">
  					<a  class="navbar-brand" href="http://imaging.cci.emory.edu/wiki/display/CAMIC/Home"><h5>Help</h5></a>
  				</div>
  				
		</nav>

		<div class="row" body >
			<div class="col-lg-1" left-margin>

			</div>
			<div class="col-lg-10">
				<div class="jumbotron">
					<p class="text-warning"><strong>You are not authorized to view this page </strong> </p>
				</div>
			</div>
			<div class="col-lg-1" right-margin>

			</div>
		</div>

		<div class="navbar navbar-fixed-bottom" footer>
			<hr />
			<div class="col-lg-9 col-lg-offset-3">
				<h5>caMicroscope is under development at the Department of Biomedical Informatics, Emory University</h5>
				<h5>It has been supported by NCI/SAIC-Fredrick through 10XS220 and the Google Summer of Code 2012</h5>
			</div>
		</div>

	</body>
</html>

	<?php
	
	die();
}

?>
