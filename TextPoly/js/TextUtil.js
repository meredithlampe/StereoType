/**
 * Created by meredith on 5/25/16.
 * Functions to manipulate strings and characters
 */

//const polyk = require('./polyk.js');
const polyk = require('polyk');

module.exports = {


    // in: phrase with spaces
    // out: array of characters representing the phrase with the
    // spces removed
    removeSpaces: function(phrase) {
        var nameArray = phrase.split(" ");
        var nameNoSpaces = nameArray[0];
        for (var i = 1; i < nameArray.length; i++) {
            nameNoSpaces += nameArray[i];
        }
        return nameNoSpaces;
    },


    slicePhrase: function (numPieces, phrase) {
        var newbie = [];
        var pieceLength = phrase.length / numPieces;
        for (var i = 0; i < numPieces; i++) {
            newbie[i] = phrase.substring(i * pieceLength, (i + 1) * pieceLength);
        }

        //pick up extras. put them in last slot.
        if (numPieces * pieceLength < phrase.length) {
            var leftovers = phrase.length - numPieces * pieceLength;
            for (var i = numPieces * pieceLength; i < phrase.length; i++) {
                newbie[numPieces - 1] += phrase.charAt(i);
            }
        }

        return newbie;
    },
};