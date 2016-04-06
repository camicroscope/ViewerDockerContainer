<?php
/*
 We are NOT using authenticate.php in this file becuase we want the admin to approve/deny requests without having to login.
authenticate.php requires login.
*/
if(!isset($_REQUEST['doAction'])) {
    header('HTTP/1.0 404 Not Found');
}
require 'registration_info.php';
require_once 'mailWrapper.php';
require_once '../config/security_config.php';



function handleAdminActions()
{

	if(strcmp($_REQUEST["doAction"] , "request-accepted") == 0)
	{
		error_log("processing ....... request-accepted ");
		if(isset($_REQUEST["verification_code"]))
		{
			$verification_code = $_REQUEST["verification_code"];	
			$request = UserRegistrationInfo::allowUserAccess($verification_code);

			if(isset($request) && $request )
			{	
				writeHeaderHTML();
				$first_line = $request["email"] .  " has been granted access to caMicroscope";
				$second_line = "";
				display_message($first_line, $second_line);
				writeFooterHTML();

				doSendMail( $request["name"], $request["email"] ,  $_REQUEST["doAction"]);
				die();
			}
			else {
				writeHeaderHTML();
				$first_line = "There was some problem processing your request.";
				$second_line = "The verification code you provided may no longer be valid or the user may already have access";
				display_message($first_line, $second_line);
				writeFooterHTML();
				die();
			}

		}
		else {
			header("Location: error.php?message=verfication_code not provided");
			die();
		}
	}
	elseif( strcmp($_REQUEST["doAction"] , "request-denied") == 0){

		if(isset($_REQUEST["verification_code"]))
		{
			error_log("processing ....... request-accepted ");
			$verification_code = $_REQUEST["verification_code"];		
			$request = UserRegistrationInfo::denyUserAccess($verification_code);
			if(isset($request) && $request )
			{
				writeHeaderHTML();
				$first_line = $request["email"] . " has been denied access to caMicroscope";
				$second_line = "";
				display_message($first_line, $second_line);
				writeFooterHTML();
				doSendMail( $request["name"], $request["email"] ,  $_REQUEST["doAction"]);
				die();   
			}
			else {
				writeHeaderHTML();
				$first_line = "There was some problem processing your request";
				$second_line = "The verification code you provided may no longer be valid";
				display_message($first_line, $second_line);
				writeFooterHTML();
				die();
			}

		}
		else {
			header("Location: error.php?message=verfication_code not provided");
			die();
		}
	}
	else
	{
		header("Location: error.php?message=unknwon action");
		die();
	}
}


function handleRequest() {

	if(!isset($_REQUEST["doAction"]))
	{
		$_REQUEST["doAction"] = "unknown";	
	}

	// initialize 	
	try {		
		UserRegistrationInfo::init();
		handleAdminActions();
	}
	catch(ErrorException $exception)
	{
		handleError($exception -> getMessage(), TRUE);
	}
}

function display_message($first_line , $second_line)
{
	?>
		<div class="jumbotron">
		<p class="text-warning"><strong><?php echo $first_line; ?></strong> </p>
		<p><?php echo $second_line; ?></p>
		</div>
		<?php
}

function doSendMail( $name , $email , $action)
{
	global $folder_path;
	if(strcmp($action , "request-accepted") == 0)
	{
		// send mail to user 	

		$subject = "Your request for access to caMicroscope has been accepted";
		$url = get_host_port_url() . $folder_path . "select.php";
		$content = "Congratulations $name !!\nYour request for access to caMicroscope has been accepted\n\nPlease visit: \n\n " . "http://imaging.cci.emory.edu" . $folder_path . "?logout";
		error_log("sending email .......");
		sendMail($email, $subject, $content);

	}
	elseif(strcmp($action ,"request-denied") == 0){
		$subject = "Your request for access to caMicroscope has been denied";

		$content = "Sorry $name !!\nYour request for access to caMicroscope has been denied\n\n ";
		error_log("sending email .......");
		sendMail($email, $subject, $content);
	}
}

function get_host_port_url()
{
	$s = empty($_SERVER["HTTPS"]) ? '' : ($_SERVER["HTTPS"] == "on") ? "s" : "";
	$sp = strtolower($_SERVER["SERVER_PROTOCOL"]);
	$protocol = substr($sp, 0, strpos($sp, "/")) . $s;
	$port = ($_SERVER["SERVER_PORT"] == "80") ? "" : (":".$_SERVER["SERVER_PORT"]);
	return $protocol . "://" . $_SERVER['SERVER_NAME'] . $port ;
}





function writeHeaderHTML()
{
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

		<a class="navbar-brand" href="/camicroscope/"><h1>caMicroscope</h1></a>
		</div>

		<div class="nav navbar-nav navbar-right">
		<a  class="navbar-brand" href="http://imaging.cci.emory.edu/wiki/display/CAMIC/Home"><h5>Help</h5></a>
		</div>




		</nav>

		<div class="row" body >
		<div class="col-lg-1" left-margin>

		</div>
		<div class="col-lg-10">

		<?php }

function writeFooterHTML()
{
	?>

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

}

handleRequest();
?>
