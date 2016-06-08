/**
 * Created by meredith on 5/25/16.
 */
var Model = {

    cb: null,
    proxy: true,

    initTwitter: function() {


        /*v2*/

        if (!this.proxy) {


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
        } else {
            //nothing! pulling phrase locally
        }
    },

    //"q=&geocode=37.781157,-122.398720,1mi"
    twitterRequest: function(neighborhoodName, callback) {

        console.log("querying for " + neighborhoodName);

        if (NeighborhoodGeolocation[neighborhoodName] == null
                || NeighborhoodGeolocation[neighborhoodName].length == 0) {
            debugger;
            return null;
        }
        //CHANGE THIS
        var tweets;

        //look up geolocations for neighborhood
        if (NeighborhoodGeolocation[neighborhoodName] != null) {
            //loop through all center points for geolocation circles
            //and search at each point
            var hoods = NeighborhoodGeolocation[neighborhoodName];
            tweets = [];
            var countFinished = 0;
            for (var i = 0; i < hoods.length; i++) {

                var queryString = "q=&geocode=" + hoods[i].lat + "," + hoods[i].long +
                        "," + hoods[i].radius + "mi&count=" + TWEETS_PER_QUERY;

                if (!this.proxy) {
                    console.log(!this.proxy);
                    cb.__call(
                        "search_tweets",
                        queryString,
                        function (reply, err) {
                            //debugger;
                            if (err) {
                                console.log("queries remaining: " + err.remaining + " / " + err.limit);
                            }
                            if (reply) {
                                tweets = tweets.concat(reply.statuses);
                            }
                            countFinished++;
                            if (countFinished == hoods.length) {
                                //console.log(JSON.stringify(tweets));
                                callback(tweets);
                            }
                        },
                        true // this parameter required
                    );
                } else {
                    //set up proxy twitter status array for testing
                    tweets = TweetProxy.tweets;
                    callback(tweets);
                }

            }
        }

    },

    checkRequestLimit: function () {

    }
}
;