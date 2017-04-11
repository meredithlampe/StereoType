<?php
header("Content-type: application/json");
// get list of name -> business name (1st in list of 'best match')

// get neighborhood names
$neighborhood_locations = fopen("../js/geo.json", "r") or die("Unable to open file!");
$locations_file = fread($neighborhood_locations, filesize("../js/geo.json"));
$locations = json_decode($locations_file, true);
fclose($neighborhood_locations);

// open file to add neighborhoods to
$num_locations = count($locations);
$curr_location_count = 1;
$response = array();

foreach($locations as $name => $location) { //loop through locations
    $encodedname = urlencode($name . ', Seattle, WA');
    $curl = curl_init('https://api.yelp.com/v3/businesses/search?location=' . $encodedname);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        'Authorization: Bearer gizMnc5_0GCIymbtjEzcsbpPbow6WiAtcAk9HaivKu3_kZKX7u5TRsS0i7QrbYQBtVXE19evr63JwVryoTaUpAVNQxYDo-Qmzu4V_ym8i5IDulhK4wMpsxaY1R3pWHYx'
        ));
    curl_exec($curl);
//    $result = curl_exec($curl);
//    $response[$name] = $result->businesses;
    curl_close($curl);
}
//echo json_encode($response);
?>

