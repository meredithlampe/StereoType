<?php

$outputfilename = "output.txt";

header("Content-type: application/json");
// get list of name -> business name (1st in list of 'best match')

// get yelp auth
$config = fopen("../../config.json", "r") or die("Unable to open config file");
$config_data = json_decode(fread($config, filesize("../../config.json")), true);
fclose($config);

// get neighborhood names
$neighborhood_locations = fopen("../js/geo.json", "r") or die("Unable to open file!");
$locations_file = fread($neighborhood_locations, filesize("../js/geo.json"));
$locations = json_decode($locations_file, true);
fclose($neighborhood_locations);

// get best match for each neighborhood
$response = array();
foreach($locations as $name => $location) { //loop through locations
    echo "working....";
    $encodedname = urlencode($name . ', Seattle, WA');
    $curl = curl_init('https://api.yelp.com/v3/businesses/search?location=' . $encodedname);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array($config_data["yelp"]["auth"]));
    $result = json_decode(curl_exec($curl));
    $response[$name] = $result->businesses[0]->name;
    curl_close($curl);
}

$outputfile = fopen($outputfilename, "w") or die ("Unable to open file");
fwrite($outputfile, json_encode($response));
fclose($outputfile);

echo "done";

?>

