<?php

date_default_timezone_set('Etc/UTC');
require 'phpMailer/PHPMailerAutoload.php';

$server = "smtp.service.emory.edu";
$port = 25;
$from = "admin@camicroscope.cci.emory.edu";
function sendMail($recepient, $subject, $content) {
	global $server, $port , $from;

	//Create a new PHPMailer instance
	$mail = new PHPMailer();
	//Tell PHPMailer to use SMTP
	$mail -> isSMTP();
	
	$mail -> SMTPDebug = 0;
	
	//Set the hostname of the mail server
	$mail -> Host = $server;
	//Set the SMTP port number - likely to be 25, 465 or 587
	$mail -> Port = $port;
	//Whether to use SMTP authentication
	$mail -> SMTPAuth = false;
	
	$mail -> setFrom($from, 'caMicroscope');
	
	//Set who the message is to be sent to
	$mail -> addAddress($recepient, $recepient );
	
	//Set the subject line
	$mail -> Subject = $subject;
	
	//Replace the plain text body with one created manually
	$mail -> Body = $content;
	
	//send the message, check for errors
	if (!$mail -> send()) {
		 error_log($mail -> ErrorInfo) ;
	} else {
		error_log("Mail Sent");
	}
}
?>