<?php
require_once 'trusted_app_client.php';
require_once '../config/security_config.php';

class UserRegistrationInfo {

	public static $db;
	public static $initialized;
	public static $requests;
	public static $historyLog;
	public static $client;
 
	public static function init() {
		global $mongo_client_url;
		$m = new MongoClient($mongo_client_url);
		// connect
		self::$requests = $m -> camicWebapp -> requests;
		self::$historyLog = $m -> camicWebapp -> historyLog;
		
		self::$client = new TrustedApplicationClient();
		self::$client->initialize("demo-id","demo-secret-key" , "http://imaging.cci.emory.edu:9099/trustedApplication");
		// initialize
		self::$initialized = TRUE;
		
		error_log("MongoDB initialized");
	}

	public static function isInitialized() {
		return self::$initialized;
	}

	// returns true if user has a request pending in the system
	public static function isRequestPending($email) {
		$request = self::$requests -> findOne(array("email" => $email ));
		if(isset($request))
		{
			return TRUE;
		}
		else
			return FALSE;
	}

	public static function generate_api_key($request) {
		return self::$client -> generateAPIKey($request["email"]);
	}

	// generates API key for the user in bindaas
	public static function allowUserAccess($verificationCode) {
		try {

			$request =  self::$requests -> findOne(array("verification_code" => $verificationCode));
			
			if (isset($request)) {
				// generate api_key
				$serverMessage = self::generate_api_key($request);
				error_log("Bindaas Server : $serverMessage");
				self::$requests -> remove(array("verification_code" => $verificationCode));
				$historyLog = new HistoryLog();
				$historyLog -> request = $request;
				$historyLog -> time = time();
				$historyLog -> activity = "approved";
				self::$historyLog -> save($historyLog);
				return $request;
			} else {
				$historyLog = new HistoryLog();
				$historyLog -> time = time();
				$historyLog -> activity = "verification code [$verificationCode] not found";
				self::$historyLog -> save($historyLog);
				return FALSE;
			}

		} catch(Exception $exception) {
			error_log("Error in allowUserAccess: " . $exception -> getMessage());
			return FALSE;
		}
	}

	public static function denyUserAccess($verificationCode) {
		try {

			$request =  self::$requests -> findOne(array("verification_code" => $verificationCode));
			if (isset($request)) {
				self::$requests -> remove(array("verification_code" => $verificationCode));
				$historyLog = new HistoryLog();
				$historyLog -> request = $request;
				$historyLog -> time = time();
				$historyLog -> activity = "denied";
				self::$historyLog -> save($historyLog);
				return $request;
			} else {
				$historyLog = new HistoryLog();
				$historyLog -> time = time();
				$historyLog -> activity = "verification code [$verificationCode] not found";
				self::$historyLog -> save($historyLog);
				return FALSE;
			}

		} catch(ErrorException $exception) {
			error_log("Error in allowUserAccess:\n" . $exception -> getMessage());
			return FALSE;
		}

	}

	// create a new sign-up request for new user. returns verification_code
	public static function createNewRequest($email, $name, $reason) {
		$uuid = uniqid("code_");
		$new_request = new Request();
		$new_request -> email = $email;
		$new_request -> name = $name;
		$new_request -> reason = $reason;
		$new_request -> verification_code = $uuid;
		self::$requests -> save($new_request);

		$historyLog = new HistoryLog();
		$historyLog -> request = $new_request;
		$historyLog -> time = time();
		$historyLog -> activity = "signup";
		self::$historyLog -> save($historyLog);
		return $uuid;

	}

}

class HistoryLog {
	public $request;
	public $time;
	public $activity;

}

class Request {

	public $email;
	public $name;
	public $reason;
	public $verification_code;
}
?>
