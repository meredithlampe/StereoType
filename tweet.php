    <?php

        $api_water_break = false;

        //authenticate
        require_once ('codebird-php-develop/src/codebird.php');
        \Codebird\Codebird::setConsumerKey(****removed****); // static, see README
        $cb = \Codebird\Codebird::getInstance();
        $reply = $cb->oauth2_token();
        $bearer_token = $reply->access_token;
        \Codebird\Codebird::setBearerToken($bearer_token);

        //prep query
        $queryString = "q=&geocode=37.781157,-122.398720,1mi&count=5";

        //pull neighborhood locations from file
        $neighborhood_locations = fopen("js/geo.json", "r") or die("Unable to open file!");
        $locations_file = fread($neighborhood_locations, filesize("js/geo.json"));
        $locations = json_decode($locations_file, true);
        fclose($neighborhood_locations);

        //prepare to catch data
        $cb->setReturnFormat(CODEBIRD_RETURNFORMAT_ARRAY);
        $count = 0;
        $popular_hashtags = array();
        $hashtags_file = fopen("hashtags.txt", "w") or die("Unable to open file!");

        //open file to add to cache
        $archive = fopen("tweet-archive/archive.txt", "w") or die("Unable to open tweet archive!"); 
        fwrite($archive, "{ \"archive\":\n{\n");

        $num_locations = count($locations);
        $curr_location_count = 1;

        foreach($locations as $name => $location) { //loop through locations

            if (!$api_water_break) {

                $hashtags_for_location = array();

                foreach($location as $circle) { //loop through areas within locations
                    $query = "q=&geocode=" . $circle["lat"] . "," . $circle["long"]
                        . "," . $circle["radius"] . "mi&count=5";

                    $reply = $cb->search_tweets($query, true);
                    // print("<pre>");
                    // print_r($reply);
                    // print("</pre>");

                    $statuses = $reply['statuses'];
                    // print(count($statuses));
                    foreach ($statuses as $status) {
                        $entities = $status['entities'];
                        if ($entities != null) {
                            // print_r("IAMENTITY" . $entities);
                            $hashtags = $entities['hashtags'];
                            if ($hashtags != null) {
                                // print_r("IAMHASHTAG" . $hashtags);
                                foreach ($hashtags as $hashtag) {
                                    if (!array_key_exists($hashtag["text"], $hashtags_for_location)) {
                                        $hashtags_for_location[$hashtag["text"]] = 1;
                                    } else {
                                        $hashtags_for_location[$hashtag["text"]] += 1;
                                    }
                                    // print($hashtag["text"]);
                                }
                            }
                        }
                    }

                }
                print("<pre>");
                print_r("json encoded hashtag array: " . json_encode($hashtags_for_location));
                print("</pre>");

                // $name_string = "\"" . $name . "\": {\n";
                // fwrite($archive, $name_string);

                //now hashtags for location has count of all hashtags in location
                //find top hashtag
                $max = 0;
                $max_tag = "none";
                $num_tags = count($hashtags_for_location);
                $curr = 1;
                if ($hashtags_for_location != null) {
                    foreach ($hashtags_for_location as $hashtag => $count) {
                        $hashtag_string = "\"" . $hashtag . "\":" . $count;    
                        if ($curr != $num_tags) {
                            $hashtag_string = $hashtag_string . ",\n";
                        } else {
                            $hashtag_string = $hashtag_string . "\n";
                        }
                        $curr = $curr + 1;
                        
                        // fwrite($archive, $hashtag_string);
                        if ($count > $max) {
                            $max = $count;
                            $max_tag = $hashtag;
                        }
                    }                    
                    //have found most popular hashtag for that neighborhood
                    $popular_hashtags[$name] = $max_tag;
                }
                if ($curr_location_count < $num_locations) {
                    // fwrite($archive, "},");    
                } else {
                    // fwrite($archive, "}");
                }
                $curr_location_count = $curr_location_count + 1;

            } else {
                $max_tag = "proxy";
            }
            print($max_tag);
            print ("<br>");
            
            //write max tag to file for neighborhood
            fwrite($hashtags_file, "" . $name . "," . $max_tag . "\n");

        }

        $name_string = "\"" . $name . "\": {\n";
        fwrite($archive, $name_string);
        fwrite($archive, json_decode($hashtags_for_location));
        fwrite($archive, "}\n}");
        fclose($archive);

        fclose($hashtags_file);

    ?>
