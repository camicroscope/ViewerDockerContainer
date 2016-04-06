<?php
//Google client info
$client_id = '524753584657-lljrbaiq8uooccgpo1ooqpjsjbptj0pr.apps.googleusercontent.com';
$client_secret = 'lg0IUtTRgvExLuTku05kwtLv';
$redirect_uri = 'postmessage';

//Bindaas info
$bindaas_trusted_id = 'demo-id';
$bindaas_trusted_secret = 'demo-secret-key';
$bindaas_trusted_url = 'http://imaging.cci.emory.edu:9099/trustedApplication';

$folder_path = '/phone/';
$mongo_client_url = 'mongodb://hudson.cci.emory.edu';

$admins = array( "ashishsharma@mac.com" );
function isAdmin($email) {
    global $admins;
        if (in_array($email, $admins)) {
                return TRUE;
        } else {
                return FALSE;
        }
}

function getAdminList() {
    global $admins;
    return $admins;
}

