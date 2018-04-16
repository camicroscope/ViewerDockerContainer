<?php
//require '../authenticate.php';


/**
 * Step 1: Require the Slim Framework
 *
 * If you are not using Composer, you need to require the
 * Slim Framework and register its PSR-0 autoloader.
 *
 * If you are using Composer, you can skip this step.
 */
require 'Slim/Slim.php';
require 'classes/apc.caching.php';

\Slim\Slim::registerAutoloader();

/**
 * Step 2: Instantiate a Slim application
 *
 * This example instantiates a Slim application using
 * its default settings. However, you will usually configure
 * your Slim application now by passing an associative array
 * of setting names and values into the application constructor.
 */
$app = new \Slim\Slim();

$CONFIG_FILE = "config.json";

$config = file_get_contents($CONFIG_FILE);
if($_SESSION["db_name"] == "quip_comp"){
  $config = str_replace("Camicroscope_DataLoader","Camicroscope_DataLoader_comp",$config);
}
$config_json = json_decode($config, JSON_UNESCAPED_SLASHES);


$oCache = new CacheAPC(); 




// Connection constants
/**
 * Step 3: Define the Slim application routes
 *
 * Here we define several Slim application routes that respond
 * to appropriate HTTP request methods. In this example, the second
 * argument for `Slim::get`, `Slim::post`, `Slim::put`, `Slim::patch`, and `Slim::delete`
 * is an anonymous function.
 */

// GET route
$app->get(
    '/',
    function () use ($app) {

	//require '../authenticate.php';
	session_start();
        //$has_session = session_status();
	if (!isset($_SESSION["api_key"])) {

	    session_unset();
	    $app->redirect("http://".$_SERVER["HTTP_HOST"]."/index.php");
	    //header("Location:http://".$_SERVER["HTTP_HOST"].$folder_path."/index.php");
	}


        //if(!($has_session == PHP_SESSION_ACTIVE))
        //apc_clear_cache();


        $template = <<<EOT
<!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8"/>
            <title>Flex Tables</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha/css/bootstrap.css"/>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fixed-data-table/0.4.6/fixed-data-table.css" />
            <link rel="stylesheet" href="javascript/public/style.css" />
            <style>
            </style>
        </head>
        <body>

            <div id="app"></div>
        </body>
        <script type="text/javascript" src="javascript/build/bundle.js">

        </script>
    </html>
EOT;
        echo $template;
    }
);

// POST route
$app->post(
    '/post',
    function () {
        echo 'This is a POST route';
    }
);

// PUT route
$app->put(
    '/put',
    function () {
        echo 'This is a PUT route';
    }
);

// PATCH route
$app->patch('/patch', function () {
    echo 'This is a PATCH route';
});

// DELETE route
$app->delete(
    '/delete',
    function () {
        echo 'This is a DELETE route';
    }
);

$app->get(
  '/getConfig',
  function () use($config_json, $app) {
    $config_safe = array(
      "title" => $config_json["title"],
      "description" => $config_json["description"],
      "path" => $config_json["path"]
    );
    echo json_encode($config_safe);
  }
);

function filterData($data, $filterValue){
  $filtered_data = array();
  for($i = 0; $i < count($data); $i++){
    $row = $data[$i];
    $match = false;
    foreach($row as $key => $value){
      //echo $key;
      if(stripos($value, $filterValue) !== false){
        $match = true;
      }

    }

      if($match){
        $filtered_data[] = $row;
      }
  }
  return $filtered_data;
}

function sortData($data, $key, $desc=false){
  
  usort($data, function($a, $b) use($key, $desc){
    //echo $a->$key; 


    $return_val = 1;
    if ( isSet($a->$key) && isSet($b->$key) ) {
      if(gettype($a->$key == "string")){
        if(isSet($a->$key) && isSet($b->$key)){
          $return_val = strcmp($a->$key, $b->$key);
        }
        else
          $return_val =  1;
      }
      else{
        $return_val = $a->$key > $b->$key ? -1 : 1;
      }
    } else {
      $return_val =  -1;
    }

    if($desc){
      return (-1)*$return_val;
    } else {
      return $return_val;
    }
  });
  return $data;
}

function fetchData($dataUrl){

      $cSession = curl_init();
      try {
          $ch = curl_init();

          if (FALSE === $ch)
              throw new Exception('failed to initialize');

	  $dataUrl = trim($dataUrl);
          curl_setopt($ch,CURLOPT_URL, $dataUrl);
          curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
          curl_setopt($ch,CURLOPT_HEADER, false);

          $content = curl_exec($ch);

          if (FALSE === $content)
              throw new Exception(curl_error($ch), curl_errno($ch));
      
          // ...process $content now
      } catch(Exception $e) {
    
          $content = "Error";
          return $content;
         
      }
     
      $content_json = json_decode($content);
      return $content_json; 

}

$app->get(
  '/getData',
  function () use($config_json, $app, $oCache){
    session_start();
    $pathState = (int)$app->request->params("pathState");


    $dataUrl = $config_json["path"][$pathState]["dataUrl"];

    $apiKey = $_SESSION["api_key"];

    $pageId = (int)$app->request->params("pageId") ?: 0;
    $perPage = (int)$app->request->params("perPage") ?: 10;
    $dataUrl = $dataUrl . "?api_key=".$apiKey;
    
    $reqParams=""; 
    //Add parameters to dataUrl
    if( isset($config_json["path"][$pathState]["params"]) ){
      $params = $config_json["path"][$pathState]["params"];
      $reqParams = "";
      foreach($params as $param){


        $reqParams = urldecode($app->request->params($param));

        if($reqParams)
          $dataUrl = $dataUrl . "&" . $param . "=" . urlencode($reqParams);
      }
      
    }

    $content_json = array();
   	/* 
    if($oCache->bEnabled){
      $cached_data = $oCache->getData($dataUrl);
      if($cached_data){
        $content_json = $cached_data;
      } else {
        $content_json  = fetchData($dataUrl);
        $oCache->setData($dataUrl, $content_json);
      } 
    } else {
      $content_json = fetchData($dataUrl);
      
      if($content_json != "Error")
        $oCache->setData($dataUrl, $content_json);
    }
	*/
    $content_json = fetchData($dataUrl);
    if($content_json != "Error"){

      //Sorting stuff
      $sortBy = $app->request->params("sortBy");
      if(isset($sortBy)){

        $sortDir = $app->request->params("sortDir");
        $desc = false;
        if(isSet($sortDir)){
          if($sortDir == "DESC")
            $desc = true;
          else
            $desc = false;
        } 
        $sorted_data = (sortData($content_json, $sortBy, $desc));
         
      } else {
        $sorted_data = $content_json;
      }

      $filterBy = $app->request->params("filterBy");
      if(isSet($filterBy)){
        //echo $filterBy;
        
       $sorted_data =  filterData($sorted_data, $filterBy);
      }
      $contentLen = count($sorted_data);
   
      $end = (int)intval($contentLen/$perPage);
      $data = array_slice($sorted_data, $pageId*$perPage, $perPage);
      
      $payload = array(
        "pageId"    => $pageId,
        "perPage"   => $perPage,
        "endPageId" => $end,
        "data"      => $data
      );
      echo json_encode($payload);
    } else {
      echo $content_json;
    } 
    //echo $data;
  }
);

/**
 * Step 4: Run the Slim application
 *
 * This method should be called last. This executes the Slim application
 * and returns the HTTP response to the HTTP client.
 */
$app->run();
