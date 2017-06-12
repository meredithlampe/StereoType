<?php

$outputfilename = "../yelp/output.txt";

header("Content-type: application/json");
// get list of name -> business name (1st in list of 'best match')

// get neighborhood names
$neighborhood_locations = fopen("../js/geo.json", "r") or die("Unable to open file!");
$locations_file = fread($neighborhood_locations, filesize("../js/geo.json"));
$locations = json_decode($locations_file, true);
fclose($neighborhood_locations);
$response = array();

foreach($locations as $name => $location) { //loop through locations
    echo "querying for " + $name + "\n";
    $encodedname = urlencode($name . ', Seattle, WA');
    $curl = curl_init('https://api.yelp.com/v3/businesses/search?location=' . $encodedname);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        'Authorization: Bearer gizMnc5_0GCIymbtjEzcsbpPbow6WiAtcAk9HaivKu3_kZKX7u5TRsS0i7QrbYQBtVXE19evr63JwVryoTaUpAVNQxYDo-Qmzu4V_ym8i5IDulhK4wMpsxaY1R3pWHYx'
        ));
    $result = json_decode(curl_exec($curl));
    $response[$name] = array();
    $response[$name]["bestmatch"] = $result->businesses[0]->name;
    $response[$name]["categories"] = array();
    foreach($result->businesses[0]->categories as $category) {
        array_push($response[$name]["categories"], $category);
    }
    $response[$name]["review_count"] = $result->businesses[0]->review_count;
    $response[$name]["rating"] = $result->businesses[0]->rating;
    $response[$name]["price"] = $result->businesses[0]->price;
    curl_close($curl);
}
$outputfile = fopen($outputfilename, "w") or die ("Unable to open file");
fwrite($outputfile, json_encode($response));
fclose($outputfile);
echo json_encode($response);

?>