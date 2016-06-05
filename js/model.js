/**
 * Created by meredith on 5/25/16.
 */
var Model = {

    cb: null,

    initTwitter: function() {
        /*v2*/
        cb = new Codebird;
        cb.setConsumerKey("L9lgozTjiY4RZHfpHG5ucLogP", "h15MrqDDVFsl3S9adLOGKRNznJDeWEJASZFP9rXJW8Jcox5ptn");


        cb.__call(
            "oauth2_token",
            {},
            function (reply, err) {
                var bearer_token;
                if (err) {
                    console.log("error response or timeout exceeded" + err.error);
                }
                if (reply) {
                    bearer_token = reply.access_token;
                }
                cb.setBearerToken(bearer_token);
                console.log("bearer_token: " + bearer_token);
            }
        );
    },

    //"q=&geocode=37.781157,-122.398720,1mi"
    twitterRequest: function(neighborhoodName) {

        console.log("querying for " + neighborhoodName);

        //CHANGE THIS
        neighborhoodName = "University District";

        var tweets;

        //look up geolocations for neighborhood
        if (NeighborhoodGeolocation[neighborhoodName] != null) {
            //loop through all center points for geolocation circles
            //and search at each point
            var hoods = NeighborhoodGeolocation[neighborhoodName];
            tweets = [];
            for (var i = 0; i < hoods.length; i++) {

                var queryString = "q=&geocode=" + hoods[i].lat + "," + hoods[i].long +
                        "," + hoods[i].radius + "mi";

                cb.__call(
                    "search_tweets",
                    queryString,
                    function (reply, err) {
                        if (err) {
                            console.log("err: " + err);
                        }
                        if (reply) {
                            console.log("reply: " + reply);
                            for (var i = 0; i < reply.statuses.length; i++) {
                                console.log(reply.statuses[i]);
                            }
                            tweets.concat(reply.statuses);
                        }
                    },
                    true // this parameter required
                );
            }



        }

        return tweets;

    }
}
;