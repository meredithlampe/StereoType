/**
 * Created by meredith on 6/6/16.
 */
var TweetUtil = {

    //parses array of tweets and returns map from hashtag to number of times seen,
    //along with array of all hashtag objects, which include metadata about hashtag
    extractHashtags: function (tweets) {
        var hashtagPackage = {};
        var hashtags = []
        var hashtagPrevalance = {};
        var mostUsedTag = null;
        var highestCount = 0;
        for (var i = 0; i < tweets.length; i++) {
            var tweet = tweets[i];
            if (tweet.entities != null) {
                var hashtagsInTweet = tweet.entities.hashtags;
                if (hashtagsInTweet != null && hashtagsInTweet.length > 0){
                    hashtags = hashtags.concat(hashtagsInTweet);
                    for (var tag = 0; tag < hashtagsInTweet.length; tag++) {
                        var hashtag = hashtagsInTweet[tag];
                        var hashtagText = hashtag.text;
                        if (hashtagText.toUpperCase() != "SEATTLE") {
                            if (hashtagPrevalance[hashtagText] == null) {
                                hashtagPrevalance[hashtagText] = 1;
                                if (highestCount == 0) {
                                    mostUsedTag = hashtagText;
                                    highestCount = 1;
                                }
                            } else {
                                hashtagPrevalance[hashtagText] += 1;
                                if (hashtagPrevalance[hashtagText] > highestCount) {
                                    highestCount = hashtagPrevalance[hashtagText];
                                    mostUsedTag = hashtagText;
                                }
                            }
                        } else {
                            //skip seattle hashtags...so basic
                        }
                    }
                } else {
                    //something different came back from the tweets...console log it?
                    console.log(JSON.stringify(tweets));
                }
            }

        }
        hashtagPackage = {
            "hashtags": hashtags,
            "hashtagPrevalence": hashtagPrevalance,
            "mostUsed": mostUsedTag
        };
        return hashtagPackage;
    },
    //
    //getSortedHashtags: function(hashtagPackage) {
    //    var sortedHashtags = [];
    //    var seen = [];
    //    for (var hashtag in hashtagPackage.hashtagPrevalence) {
    //        var num = hashtagPackage[hashtag];
    //        if (num > nextGreatest && !seen.contains(hashtag)) {
    //
    //        }
    //    }
    //}
};