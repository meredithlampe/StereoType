    <?php

        $api_water_break = false;

        //authenticate
        require_once ('codebird-php-develop/src/codebird.php');
        \Codebird\Codebird::setConsumerKey('L9lgozTjiY4RZHfpHG5ucLogP', 'h15MrqDDVFsl3S9adLOGKRNznJDeWEJASZFP9rXJW8Jcox5ptn'); // static, see README
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


        foreach($locations as $name => $location) { //loop through locations
            if (!$api_water_break) {

                $hashtags_for_location = array();

                foreach($location as $circle) { //loop through areas within locations
                    $query = "q=&geocode=" . $circle["lat"] . "," . $circle["long"]
                        . "," . $circle["radius"] . "mi&count=5";

                    $reply = $cb->search_tweets($query, true);
                    //print("<pre>");
                    //print_r($reply);
                    //print("</pre>");
                    $statuses = $reply['statuses'];
                    //print(count($statuses));
                    foreach ($statuses as $status) {
                        $entities = $status['entities'];
                        if ($entities != null) {
                            //print_r("IAMENTITY" . $entities);
                            $hashtags = $entities['hashtags'];
                            if ($hashtags != null) {
                                //print_r("IAMHASHTAG" . $hashtags);
                                foreach ($hashtags as $hashtag) {
                                    if (!array_key_exists($hashtag["text"], $hashtags_for_location)) {
                                        print($hashtag["text"]);
                                        $hashtags_for_location[$hashtag["text"]] = 1;
                                    } else {
                                        print($hashtag["text"]);
                                        $hashtags_for_location[$hashtag["text"]] += 1;
                                    }
                                }
                            }
                        }
                    }

                }
                print("<pre>");
                print_r($hashtags_for_location);
                print("</pre>");

                //now hashtags for location has count of all hashtags in location
                //find top hashtag
                $max = 0;
                $max_tag = "none";
                if ($hashtags != null) {
                    fwrite($hashtags_file, "hashtags not null");
                    foreach ($hashtags_for_location as $hashtag => $count) {
                       if ($count > $max) {
                            $max = $count;
                            $max_tag = $hashtag;
                        }
                    }
                } else {
                    fwrite($hashtags_file, "hashtags null");
                }

                //have found most popular hashtag for that neighborhood
                $popular_hashtags[$name] = $max_tag;
            } else {
                $max_tag = "proxy";
            }
            print($max_tag);
            print ("<br>");
            
            //write max tag to file for neighborhood
            fwrite($hashtags_file, "" . $name . "," . $max_tag . "\n");
        }

        fclose($hashtags_file);

    ?>