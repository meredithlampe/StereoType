    <?php

        //authenticate
        require_once ('codebird-php-develop/src/codebird.php');
        \Codebird\Codebird::setConsumerKey('L9lgozTjiY4RZHfpHG5ucLogP', 'h15MrqDDVFsl3S9adLOGKRNznJDeWEJASZFP9rXJW8Jcox5ptn'); // static, see README

        $cb = \Codebird\Codebird::getInstance();

        $reply = $cb->oauth2_token();
        $bearer_token = $reply->access_token;

        \Codebird\Codebird::setBearerToken($bearer_token);

        $queryString = "q=&geocode=37.781157,-122.398720,1mi&count=5";

        $cb->setReturnFormat(CODEBIRD_RETURNFORMAT_ARRAY);

        $neighborhood_locations = fopen("js/geo.json", "r") or die("Unable to open file!");
        print($neighborhood_locations);

        $locations_file = fread($neighborhood_locations, filesize("js/geo.json"));
        print($locations_file);

        $locations = json_decode($locations_file, true);
        fclose($neighborhood_locations);

        $count = 0;

        foreach($locations as $name => $location) {
            foreach($location as $circle) {
                $query = "q=&geocode=" . $circle["lat"] . "," . $circle["long"]
                    . "," . $circle["radius"] . "mi&count=5";
                $reply = $cb->search_tweets($query, true);
                print("<pre>");
                print_r($reply);
                print("</pre>");

                $count += 1;
                if ($count > 10) {
                    break;
                }

            }
        }






    ?>