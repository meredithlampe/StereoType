/**
 * Created by meredith on 5/25/16.
 */

//const raphael = require('raphael');
const point_at_length = require('point-at-length');
const polyk = require('polyk');

module.exports = {

    calculateNumLevels: function (aspectRatio, phrase, addtlLevel, forcedHorizontal, orientation) {

        var numLevels;

        if (forcedHorizontal && aspectRatio > 1.2) { //flat and wide, but horizontal text orientation (left to right)
            numLevels = 1;
            numLevels += Math.floor(phrase.length / 10);

            if (aspectRatio < 1.5) {
                //square-ish...add more levels
                numLevels += Math.floor(phrase.length / 8);
            }

        } else {
            numLevels = Math.ceil(aspectRatio + addtlLevel);
            numLevels += Math.floor(phrase.length / 12);
        }

        return numLevels;

    },

    insertSpaces: function (phrase) {
        var spaceAgumentedPhrase = "";
        for (var i = 0; i < phrase.length - 1; i++) {
            spaceAgumentedPhrase += phrase.charAt(i) + " ";
        }
        spaceAgumentedPhrase += phrase.charAt(phrase.length - 1);
        return spaceAgumentedPhrase;
    },

    fillNeighborhoodText: function (neighborhoodRectangles, phrase, d, displayBounds, displayText, rectDatabase) {

        if (phrase != null && neighborhoodRectangles != null) {

            phrase = phrase.toUpperCase();
            var viableRectangles;

            viableRectangles = module.exports.filterViableRectangles(neighborhoodRectangles, d);

            if (viableRectangles != null) {
                if (rectDatabase[d.properties.name] != null &&
                    rectDatabase[d.properties.name].manual != null &&
                    USE_RECTANGLE_DATABASE) {
                    //fill text in rectangles based on
                    //instructions delineated in rectangle database
                    module.exports.populateTextAlg2(viableRectangles, phrase, displayBounds, displayText, d);
                } else {
                    //populateTextAreaRatio(viableRectangles, phrase, displayBounds, displayText, d);
                    module.exports.populateTextAlg1(viableRectangles, phrase, displayBounds, displayText, d);
                }
            }
        }
    },

    //filter rectangles that are unsuitable to be filled with text
    //i.e. null, too long and skinny, area too small
    filterViableRectangles: function (neighborhoodRectangles, d) {
        //keep track of how many rectangles are actually viable, i.e. big enough
        var nextIndexInViableRectangles = 0;
        var viableRectangles = [];

        var areaSum = 0;


        //compute total area and find viable rectangles
        for (var i = 0; i < neighborhoodRectangles.length; i++) {
            if (neighborhoodRectangles[i].rect != null) {
                var rectArea = neighborhoodRectangles[i].rect[0].width * neighborhoodRectangles[i].rect[0].height;
                var aspectRatio = neighborhoodRectangles[i].rect[0].width / neighborhoodRectangles[i].rect[0].height;
                if (rectArea > AREA_CUTOFF && aspectRatio < 20) {
                    viableRectangles[nextIndexInViableRectangles] = {
                        rect: neighborhoodRectangles[i].rect,
                        area: rectArea,
                        corners: RectangleGenerator.findRectangleCorners(neighborhoodRectangles[i].rect),
                        aspectRatio: aspectRatio,
                        id: "rect_" + neighborhoodRectangles[i].num + "_" + neighborhoodRectangles[i].location
                    };
                    areaSum += rectArea;
                    nextIndexInViableRectangles++;
                }
            }
        }

        return viableRectangles;
    },


    //pretty broken
    populateTextAreaRatio: function (viableRectangles, phrase, displayBounds, displayText, d) {

        var heightOfEachLevel = 10;

        //keep track of next available portion of phrase
        var currIndexInPhrase = 0;

        for (var i = 0; i < viableRectangles.length; i++) {

            //find area ratio for given rectangle
            //var areaRatio = (viableRectangles[i][0].width * viableRectangles[i][0].height) / areaSum;

            //use area ratio weighting all rectangles the same
            var areaRatio = 1 / viableRectangles.length;

            //use area ratio to partition phrase
            var numChars = Math.floor(areaRatio * phrase.length);
            var myChars = phrase.substring(currIndexInPhrase, currIndexInPhrase + numChars);

            currIndexInPhrase += numChars;

            var numHorizontalLevels = (viableRectangles[i].rect[0].height / heightOfEachLevel);

            //maybe do this somewhere with greater scope?
            var rectCoords = RectangleGenerator.findRectangleCorners(viableRectangles[i].rect);

            if (displayBounds) {
                //for debug: mark corners
                DebugTool.markFourCorners(rectCoords.topY, rectCoords.lowY, rectCoords.leftX, rectCoords.rightX);
            }

            //save place in current set of chars
            var currIndexInMyChars = 0;
            var charsInEachLevel = Math.floor((1 / numHorizontalLevels) * myChars.length);

            //populate each horizontal level with text
            for (var j = 1; j <= numHorizontalLevels; j++) {

                //generate path for given horizontal level
                var startPathX = rectCoords.leftX;
                var startPathY = rectCoords.topY + (j * heightOfEachLevel);

                var endPathX = rectCoords.rightX;
                var endPathY = startPathY;

                var levelString
                if (j == Math.round(numHorizontalLevels)) {
                    levelString = myChars.substring(currIndexInMyChars, myChars.length);
                } else {
                    levelString = myChars.substring(currIndexInMyChars, currIndexInMyChars + charsInEachLevel);
                }
                currIndexInMyChars += charsInEachLevel;

                var pathFill;
                if (displayBounds) {
                    pathFill = "black";
                } else {
                    pathFill = "none";
                }

                var pathString = "M" + startPathX + "," + startPathY + "L" + endPathX + "," + endPathY;
                svg.append("path")
                    .attr("id", "innerPath_" + d.id + "_" + (i + 1) + "_" + j)
                    .attr("d", pathString)
                    .style("fill", "none")
                    .style('stroke', pathFill);

                if (displayText) {
                    svg.append("text")
                        .append("textPath")
                        .attr("xlink:href", "#" + "innerPath_" + d.id + "_" + (i + 1) + "_" + j)
                        .style("text-anchor", "middle")
                        .text(levelString)
                        .attr("font-size", viableRectangles[i].rect[0].width / 5)
                        .attr("startOffset", "50%")
                        .attr("startOffset", "50%");
                }

            }
        }
    },


    //pre: phrase != null && viableRectangles != null
    populateTextAlg1: function (viableRectangles, phrase, displayBounds, displayText, d) {

        //first letter goes in first viable rectangle
        //An angle of zero means that the longer side of the polygon
        // will be aligned with the x axis. An angle of +90 and/or -90 means that the
        // longer side of the polygon (the width) will be aligned with the y axis.
        if (displayText) {

            if (viableRectangles.length > 1) {

                var maxArea = viableRectangles[0].area;
                var indexOfMaxArea = 0;
                var aspectRatioBiggestRect = viableRectangles[0].aspectRatio;

                //find biggest rectangle, use for majority of text
                for (var i = 1; i < viableRectangles.length; i++) {
                    var currArea = viableRectangles[i].area;
                    if (currArea > maxArea) {
                        indexOfMaxArea = i;
                        maxArea = currArea;
                        aspectRatioBiggestRect = viableRectangles[i].aspectRatio;
                    }
                }

                //apply padding to center rectangle
                viableRectangles[indexOfMaxArea] = RectangleGenerator.applyPadding(viableRectangles[indexOfMaxArea]);

                //if there are viable rectangles appearing before biggest (i.e. top and left), fill with one letter each
                var currIndex = 0;
                var currRectIndex = 0;
                while (currRectIndex < indexOfMaxArea) {

                    //get current rectangle
                    var currRect = viableRectangles[currIndex];

                    //if currRect is actually viable
                    if (currRect.aspectRatio < 4) {

                        //append path and letter
                        var currLetter = phrase.substring(currIndex, currIndex + 1);
                        appendSingleLetter(currRect, currLetter, d);
                        currIndex++;
                    }
                    currRectIndex++;
                }

                var currIndexFromEnd = viableRectangles.length - 1;
                var countLettersOffEnd = 0;

                while (currIndexFromEnd > indexOfMaxArea) {

                    var currRect = viableRectangles[currIndexFromEnd];

                    if (currRect.aspectRatio < 4) {
                        //append path and letter
                        var currLetter = phrase.charAt(phrase.length - 1 - countLettersOffEnd);
                        appendSingleLetter(currRect, currLetter, d);
                        countLettersOffEnd++;
                    }
                    currIndexFromEnd--;
                }

                //fill largest rectangle with wrapped text
                //pass phrase with first letters chopped off (depending on how many got their own rectangles) and
                //last letter chopped
                //TextUtil.fillRectWithText(phrase.substring(currIndex, phrase.length - (countLettersOffEnd)), viableRectangles[indexOfMaxArea]);
                module.exports.fillRectTextManual(phrase.substring(currIndex,
                        phrase.length - (countLettersOffEnd)), viableRectangles[indexOfMaxArea],
                    displayText, displayBounds, d);

            } else if (viableRectangles.length == 1) {
                //use entire phrase to fill only viable rectangle
                //TextUtil.fillRectWithText(phrase, viableRectangles[0]);
                module.exports.fillRectTextManual(phrase, viableRectangles[0], displayText, displayBounds, d);
            }


        }

        //last letter goes in last viable rectangle


    },


    populateTextAlg2: function (viableRectangles, phrase, displayBounds, displayText, d) {
        //use multiple rectangles to fill text
        if (displayText) {

            var nextAvailableIndex = 0;

            //take them as they come: if rectangle wants one char, give it one char
            for (var i = 0; i < viableRectangles.length; i++) {

                var phraseChunk;

                if (viableRectangles[i].rect[4] === "singleChar") {
                    phraseChunk = phrase.charAt(nextAvailableIndex);
                    nextAvailableIndex++;
                    appendSingleLetter(viableRectangles[i], phraseChunk, d);
                } else {

                    //var indexStart = Math.floor(viableRectangles[i].rect[3][0] * phrase.length);
                    var indexStart = nextAvailableIndex;

                    var indexEnd = Math.floor(viableRectangles[i].rect[3][1] * phrase.length);

                    //special case: last letter as standalone: take from preceding rectangle
                    if (i == viableRectangles.length - 2 &&
                        viableRectangles[i + 1].rect[4] == "singleChar") {
                        indexEnd--;
                    }

                    if (indexStart <= indexEnd) {
                        phraseChunk = phrase.substring(indexStart, indexEnd);
                    } else {
                        phraseChunk = " ";
                    }

                    viableRectangles[i] = RectangleGenerator.applyPadding(viableRectangles[i]);

                    nextAvailableIndex = indexEnd;

                    module.exports.fillRectTextManual(phraseChunk, viableRectangles[i], displayText,
                        displayBounds, d);
                }

            }
        }
    },


    //fill rectangle using svg wrapping from d3Plus
    fillRectWithText: function (phrase, rectangle) {


        //inserting spaces in between letters so that d3plus will wrap text mid-word
        var spaceAugmentedText = module.exports.insertSpaces(phrase);

        //middle of phrase goes in big rectangle
        var newText = svg.append("text")
            .text(spaceAugmentedText)
            .attr("font-family", font);
        //.attr("font-size", "15pt");

        //var newText = phrase.substring(1);
        //
        //DebugTool.markFourCorners(
        //    rectangle.corners.topY,
        //    rectangle.corners.lowY,
        //    rectangle.corners.leftX,
        //    rectangle.corners.rightX
        //);

        var height = rectangle.corners.lowY - rectangle.corners.topY;
        var width = rectangle.corners.rightX - rectangle.corners.leftX;

        var text = d3plus.textwrap()
            .height(height)
            .width(width)
            .container(newText)
            .x(rectangle.corners.leftX)
            .y(rectangle.corners.topY)
            //.text(newText)
            .resize(true)
            .align("center")
            .draw();

        //text.attr("letter-spacing", 3);
    },


    fillRectTextManual: function (phrase, rectangle, displayText, displayBounds, d) {

        var verticalDistance = rectangle.corners.lowY - rectangle.corners.topY;
        var horizontalDistance = rectangle.corners.rightX - rectangle.corners.leftX;

        //true if rectangle is tall and skinny
        var horizontalOrientation = verticalDistance > horizontalDistance || rectangle.rect[4] == "horizontalText";

        var orientation = horizontalOrientation ? "horizontal" : "vertical";

        var numLevels;

        if (rectangle.rect[4] === "horizontalText") { //force rectangle to use horizontal slicing
            //find num levels
            numLevels = module.exports.calculateNumLevels(rectangle.aspectRatio, phrase, 1, true, orientation);
        } else {
            numLevels = module.exports.calculateNumLevels(rectangle.aspectRatio, phrase, 1, false, orientation); //Math.round(rectangle.aspectRatio) + 1
        }

        var phrasePieces = [];
        var indexInPhrase = 0; //next available letter

        for (var i = 0; i < numLevels; i++) {
            var piece = "";
            var bound = phrase.length / numLevels;

            while ((indexInPhrase < ((i + 1) * bound)) && (indexInPhrase < phrase.length)) {
                piece += phrase.charAt(indexInPhrase);
                indexInPhrase++;
            }

            phrasePieces[i] = piece;
        }
        var rectCoords = RectangleGenerator.findRectangleCorners(rectangle.rect);

        if (orientation == "horizontal") { //taller
            //split rectangle into four portions and find lower edge of each for text path

            //x coords don't change
            var startPathX = rectCoords.leftX;
            var endPathX = rectCoords.rightX;
            var verticalText = false;

            var widthOfSlice = horizontalDistance;
            var heightOfSlice = verticalDistance / numLevels;

            for (var k = 1; k <= numLevels; k++) {

                //current phrase piece
                var currPhrase = phrasePieces[k - 1];

                //find y coords
                var startPathY = rectCoords.topY + (k * (verticalDistance / numLevels));
                var endPathY = startPathY;

                appendPathAndText(startPathX, startPathY, endPathX, endPathY,
                    currPhrase, d, k, displayText, displayBounds, verticalText, widthOfSlice,
                    heightOfSlice, rectangle.id);
            }
        } else { //wider and flatter: make vertical slices

            //y coords don't change
            var startPathY = rectCoords.topY;
            var endPathY = rectCoords.lowY;
            var verticalText = true;

            var widthOfSlice = verticalDistance;
            var heightOfSlice = horizontalDistance / numLevels;

            for (var k = numLevels; k >= 1; k--) {

                //current phrase piece
                var currPhrase = phrasePieces[numLevels - k];

                //find x coords
                var startPathX = rectCoords.leftX + ((k - 1) * (horizontalDistance / numLevels));
                var endPathX = startPathX;

                appendPathAndText(startPathX, startPathY, endPathX, endPathY,
                    currPhrase, d, k, displayText, displayBounds, verticalText, widthOfSlice,
                    heightOfSlice, rectangle.id);
            }
        }


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

    appendCharacterIntoRectangle: function (char, rectangle, svg, d, tag, padding,
                                            displayText, displayBounds, TEXT_SIZE_MULTIPLIER,
                                            font, TextToSVG) {

        var startPathX,
            startPathY,
            endPathX,
            endPathY,
            verticalText,
            widthOfSlice,
            heightOfSlice,
            rectangleId;

        if (rectangle[0].angle == 0 || rectangle[0].angle == 180) {
            startPathX = rectangle[0].cx - (rectangle[0].width / 2);
            startPathY = rectangle[0].cy + (rectangle[0].height / 2);
            endPathX = startPathX + rectangle[0].width;
            widthOfSlice = rectangle[0].width;
            heightOfSlice = rectangle[0].height;
        } else { //rectangle angle == 90 || 270
            startPathX = rectangle[0].cx - (rectangle[0].height / 2);
            startPathY = rectangle[0].cy + (rectangle[0].width / 2);
            endPathX = startPathX + rectangle[0].height;
            widthOfSlice = rectangle[0].height;
            heightOfSlice = rectangle[0].width;
        }

        //apply padding
        var paddingScaledWidth = padding * widthOfSlice;
        var paddingScaledHeight = padding * heightOfSlice;
        startPathX += paddingScaledWidth;
        startPathY -= paddingScaledHeight;
        endPathX -= paddingScaledWidth;
        widthOfSlice -= 2 * paddingScaledWidth;
        heightOfSlice -= paddingScaledHeight;


        endPathY = startPathY;
        verticalText = false;
        rectangleId = d.properties.name + "_inner";

        var pathAndText = module.exports.appendPathAndText(startPathX, startPathY, endPathX, endPathY, char, d, tag, displayText,
            displayBounds, verticalText, widthOfSlice, heightOfSlice, rectangleId, svg, TEXT_SIZE_MULTIPLIER, font);

        //return character that you just appended
        return pathAndText;
    },

    // like append path and text, but using char converted to svg
    appendChar: function (startPathX, startPathY,
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
        var shapeG = svg.append("g");

        // canvas for trying out char sizes - who even knows if these are the right dimensions
        //var paper = raphael(-500, -500, 320, 200);
        while (!charToBig) {

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
            var charPaperPath = paper.path(charPath);
            var numHitTestPoints = 20;
            var totalLength = charPaperPath.getTotalLength();
            var lengthIncrement = totalLength * 1.0 / numHitTestPoints;

            // check coords of char path, make sure they are inside of polygon
            for (var curr = 0; curr < numHitTestPoints; curr++) {
                var point = charPaperPath.getPointAtLength(lengthIncrement * curr);
                if (!point) {
                    console.log("found undefined point in appendChar");
                }

                // is point inside of polygon?
                if (!point || !PolyK.ContainsPoint(rectangle.polygon, point.x, point.y)) {
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

        var path = shapeG.append("path")
            .attr("class", "charSVGThing")
            .attr("d", bestPath)
            .style("fill", "black");
    },

    // only works with single polygons
    pathToArray: function (path) {
        var pathCoords = path.substring(1).split('L');
        var result = [];

        for (var i = 0; i < pathCoords.length; i++) {
            var bothCoords;
            if (pathCoords[i].indexOf(',') != -1) {
                bothCoords = pathCoords[i].split(',');
            } else {
                bothCoords = pathCoords[i].split(' ');
            }
            result[i * 2] = parseFloat(bothCoords[0]);
            result[(i * 2) + 1] = parseFloat(bothCoords[1]);
        }
        return result;
    },


    // used in testGrid
    appendPathAndText: function (startPathX, startPathY, endPathX, endPathY,
                                 phrase, d, k, displayText, displayBounds, verticalText, widthOfSlice,
                                 heightOfSlice, rectangleId, svg, TEXT_SIZE_MULTIPLIER, font) {

        var pathStroke = displayBounds ? "black" : "none";

        var pathString = "M" + startPathX + "," + startPathY + "L" + endPathX + "," + endPathY;
        var path = svg.append("path")
            .attr("id", "innerPath_" + rectangleId + "_" + k)
            .attr("d", pathString)
            .style("fill", "none")
            .style('stroke', pathStroke);

        var textSize = 1;

        //var phantomSvg = d3.select("body").append("svg");
        var phantomSvg = svg;
        var text = phantomSvg.append("text")
            .text(phrase)
            .attr("font-size", textSize + "pt");
        var text_node = text.node();
        var bbox = text_node.getBoundingClientRect();

        debugger;
        var widthTransform = bbox.width;
        var heightTransform = bbox.height;

        var eBrake = true;

        while (widthTransform < widthOfSlice && heightTransform < heightOfSlice && eBrake) {

            textSize++;

            text = phantomSvg.append("text")
                .text(phrase)
                .attr("font-size", textSize + "pt");

            //var textNode = document.getElementById("t1");
            bbox = text.node().getBoundingClientRect();
            widthTransform = bbox.width;
            heightTransform = bbox.height;

            if (textSize > 25) {
                eBrake = false;
            }

        }

        //use length of bbox, amt of characters on line and length of rectangle to
        //determine spacing in between rectangles
        //var extraSpace = widthOfSlice - widthTransform;
        //var spacePerChar = extraSpace / phrase.length;
        //.attr("letter-spacing", spacePerChar + "pt")

        var text = svg.append("text")
            .append("textPath")
            .attr("xlink:href", "#" + "innerPath_" + rectangleId + "_" + k)
            .style("text-anchor", "middle")
            .attr("startOffset", "50%")
            .text(phrase)
            .attr("font-size", (textSize * TEXT_SIZE_MULTIPLIER) + "pt")
            .attr("font-family", font)
            .attr("class", ".remove-me");

        // remove all of the stuff we used for iterating
        phantomSvg.remove();

        //return path and text
        var result = [path, text]; // these get removed by calling function if they want to
        return result;

    },


    appendCharacterAsSVG: function (char, gridUnit, svg, d, tag, padding,
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

        module.exports.appendChar(startPathX, startPathY, char, tag, displayText,
            displayBounds, rectangleId, svg, TEXT_SIZE_MULTIPLIER, font,
            gridUnit, textToSVG, raphael);

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
                if (!point || !polyk.ContainsPoint(rectangle.polygon, point.x, point.y)) {
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

    arrayToPath: function(oneDArray) {
        var result = "M";
        if (oneDArray.length > 0)  {
            result += oneDArray[0] + "," + oneDArray[1];
            for (var i = 2; i < oneDArray.length; i += 2) {
                result += "L" + oneDArray[i] + "," + oneDArray[i+1];
            }
            result += 'Z';
        }
        return result;
    }


};