/**
 * Created by meredith on 5/25/16.
 * Functions to manipulate strings and characters
 */

const point_at_length = require('point-at-length');
//const polyk = require('./polyk.js');
const polyk = require('polyk');

module.exports = {

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

    getCharacterAsSVG: function (char, gridUnit, svg, d, tag, padding,
                                    displayText, displayBounds, TEXT_SIZE_MULTIPLIER,
                                    font, textToSVG, raphael) {

        var startPathX,
            startPathY,
            rectangleId,
            widthOfSlice,
            heightOfSlice;

        if (gridUnit[0].angle == 0 || gridUnit[0].angle == 180) {
            startPathX = gridUnit[0].cx - (gridUnit[0].width / 2);
            startPathY = gridUnit[0].cy + (gridUnit[0].height / 2);
            widthOfSlice = gridUnit[0].width;
            heightOfSlice = gridUnit[0].height;
        } else { //rectangle angle == 90 || 270
            startPathX = gridUnit[0].cx - (gridUnit[0].height / 2);
            startPathY = gridUnit[0].cy + (gridUnit[0].width / 2);
            widthOfSlice = gridUnit[0].height;
            heightOfSlice = gridUnit[0].width;
        }

        //apply padding
        var paddingScaledWidth = padding * widthOfSlice;
        var paddingScaledHeight = padding * heightOfSlice;
        startPathX += paddingScaledWidth;
        startPathY -= paddingScaledHeight;
        rectangleId = d.properties.name + "_inner";

        return module.exports.getChar(startPathX, startPathY, char, tag, displayText,
            displayBounds, rectangleId, svg, TEXT_SIZE_MULTIPLIER, font,
            gridUnit, textToSVG, raphael);

    },

    getChar: function (startPathX, startPathY,
                          phrase, k, displayText, displayBounds,
                          rectangleId, svg, TEXT_SIZE_MULTIPLIER, font,
                          rectangle, textToSVG, raphael) {

        var textSize = 5;

        var defaultOptions = {
            "x": startPathX,
            "y": startPathY,
            "fontSize": textSize
        };

        // just use this one for now
        var bestPath = textToSVG.getD(phrase.toUpperCase(), defaultOptions);
        var charToBig = false;

        var whileLoopCount = 0;
        // canvas for trying out char sizes - who even knows if these are the right dimensions
        //var paper = raphael(-500, -500, 320, 200);
        while (!charToBig) {
            whileLoopCount++;

            // if char is normal,
            // convert text to svg
            var options = {
                "x": startPathX,
                "y": startPathY,
                "fontSize": textSize
            };

            const charPath = textToSVG.getD(phrase.toUpperCase(), options);
            var countOutOfBounds = 0; // count num points found to be outside of the containing polygon
            var stopIterating = false;
            //var charPaperPath = paper.path(charPath);
            var numHitTestPoints = 20;
            //var totalLength = charPaperPath.getTotalLength();
            var point_at_length_instance = point_at_length(charPath);
            var totalLength = point_at_length_instance.length();
            var lengthIncrement = totalLength * 1.0 / numHitTestPoints;

            // check coords of char path, make sure they are inside of polygon
            for (var curr = 0; curr < numHitTestPoints; curr++) {
                //var point = charPaperPath.getPointAtLength(lengthIncrement * curr);
                var point = point_at_length_instance.at(lengthIncrement * curr);
                debugger;

                if (!point) {
                    console.log("found undefined point in appendChar");
                }

                // is point inside of polygon?
                //if (!point || !polyk.ContainsPoint(rectangle.polygon, point.x, point.y)) {
                if (!point || !polyk.ContainsPoint(rectangle.polygon, point[0], point[1])) {
                    if (!point) {
                       console.log("point is null");
                    }
                    countOutOfBounds++;
                    if (countOutOfBounds > 2) {
                        stopIterating = true;
                        break;
                    }
                }
            }

            if (!stopIterating) {
                bestPath = charPath;
                textSize += 1;
            } else {
                charToBig = true;
            }

        }

        console.log("while loop executed " + whileLoopCount + " times");

        return bestPath;
    },
};