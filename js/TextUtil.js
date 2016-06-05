/**
 * Created by meredith on 5/25/16.
 */
var TextUtil = {

    calculateNumLevels: function(aspectRatio, phrase, addtlLevel, forcedHorizontal, orientation) {

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

    insertSpaces: function(phrase) {
        var spaceAgumentedPhrase = "";
        for (var i = 0; i < phrase.length - 1; i++) {
            spaceAgumentedPhrase += phrase.charAt(i) + " ";
        }
        spaceAgumentedPhrase += phrase.charAt(phrase.length - 1);
        return spaceAgumentedPhrase;
    },

    fillNeighborhoodText: function(neighborhoodRectangles, phrase, d, displayBounds, displayText, rectDatabase) {

        if (phrase != null && neighborhoodRectangles != null) {

            phrase = phrase.toUpperCase();
            var viableRectangles;

            viableRectangles = TextUtil.filterViableRectangles(neighborhoodRectangles, d);

            if (viableRectangles != null) {
                if (rectDatabase[d.properties.name] != null &&
                    rectDatabase[d.properties.name].manual != null &&
                    USE_RECTANGLE_DATABASE) {
                    //fill text in rectangles based on
                    //instructions delineated in rectangle database
                    TextUtil.populateTextAlg2(viableRectangles, phrase, displayBounds, displayText, d);
                } else {
                    //populateTextAreaRatio(viableRectangles, phrase, displayBounds, displayText, d);
                    TextUtil.populateTextAlg1(viableRectangles, phrase, displayBounds, displayText, d);
                }
            }
        }
    },

    //filter rectangles that are unsuitable to be filled with text
    //i.e. null, too long and skinny, area too small
    filterViableRectangles: function(neighborhoodRectangles, d) {
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
    populateTextAreaRatio: function(viableRectangles, phrase, displayBounds, displayText, d) {

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
    populateTextAlg1: function(viableRectangles, phrase, displayBounds, displayText, d) {

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
                TextUtil.fillRectTextManual(phrase.substring(currIndex,
                        phrase.length - (countLettersOffEnd)), viableRectangles[indexOfMaxArea],
                    displayText, displayBounds, d);

            } else if (viableRectangles.length == 1) {
                //use entire phrase to fill only viable rectangle
                //TextUtil.fillRectWithText(phrase, viableRectangles[0]);
                TextUtil.fillRectTextManual(phrase, viableRectangles[0], displayText, displayBounds, d);
            }


        }

        //last letter goes in last viable rectangle


    },


    populateTextAlg2: function(viableRectangles, phrase, displayBounds, displayText, d) {
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

                    TextUtil.fillRectTextManual(phraseChunk, viableRectangles[i], displayText,
                        displayBounds, d);
                }

            }
        }
    },


    //fill rectangle using svg wrapping from d3Plus
    fillRectWithText: function(phrase, rectangle) {


        //inserting spaces in between letters so that d3plus will wrap text mid-word
        var spaceAugmentedText = TextUtil.insertSpaces(phrase);

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


    fillRectTextManual: function(phrase, rectangle, displayText, displayBounds, d) {

        var verticalDistance = rectangle.corners.lowY - rectangle.corners.topY;
        var horizontalDistance = rectangle.corners.rightX - rectangle.corners.leftX;

        //true if rectangle is tall and skinny
        var horizontalOrientation = verticalDistance > horizontalDistance || rectangle.rect[4] == "horizontalText";

        var orientation = horizontalOrientation ? "horizontal" : "vertical";

        var numLevels;

        if (rectangle.rect[4] === "horizontalText") { //force rectangle to use horizontal slicing
            //find num levels
            numLevels = TextUtil.calculateNumLevels(rectangle.aspectRatio, phrase, 1, true, orientation);
        } else {
            numLevels = TextUtil.calculateNumLevels(rectangle.aspectRatio, phrase, 1, false, orientation); //Math.round(rectangle.aspectRatio) + 1
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

    slicePhrase: function(numPieces, phrase) {
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

    formatInscription: function(dimensions, phrase) {

        //var idealLineLength = 12;
        //var charAspectRatio = 0.4451827;
        //
        ////calculate height of idea line
        //var idealLineAspectRatio = idealLineLength * charAspectRatio; //really not sure about this one
        //var idealLineWidth = dimensions.right - dimensions.left;
        //var idealLineHeight = idealLineWidth / idealLineAspectRatio;
        //var rectHeight = dimensions.max - dimensions.min;
        //var lineCount = Math.floor(rectHeight / idealLineHeight);
        //var idealCharPerLine = Math.min(60, Math.max(Math.round(phrase.length / lineCount), 1));
        //
        ////segment text into two lines
        //var preText;
        //var postText;
        //var finalText;
        //var preDiff;
        //var postDiff;
        //var charIndex = 0;
        //var lineText = [];
        //
        //var counter = 0;
        //
        ////while we still have words left, build the next line
        //while (charIndex < phrase.length) {
        //    var postText = "";
        //
        //    // build two strings (preText and postText) word by word, with one
        //    // string always one word behind the other, until
        //    // the length of one string is less than the ideal number of characters
        //    // per line, while the length of the other is greater than that ideal
        //    while (postText.length < idealCharPerLine) {
        //        preText = postText;
        //        postText += phrase.charAt(charIndex) + "";
        //        charIndex++;
        //        if (charIndex >= phrase.length) {
        //            break;
        //        }
        //    }
        //
        //    //calculate the difference between the two strings and the
        //    //ideal number of chars per line
        //    preDiff = idealCharPerLine - preText.length;
        //    postDiff = postText.length - idealCharPerLine;
        //
        //    // if the smaller string is closer to the length of the ideal than
        //    // the longer string, and doesn’t contain just a single space, then
        //    // use that one for the line
        //    if ((preDiff < postDiff) && (preText.length > 2)) {
        //        finalText = preText;
        //        charIndex--;
        //    } else { //otherwise, use the longer string for the line
        //        finalText = postText;
        //    }
        //    //kind weird...why taking sub here?
        //    lineText[lineText.length] = finalText.substring(0, finalText.length - 1);
        //
        //}
        //
        //debugger;



    },

    appendPathAndText: function(startPathX, startPathY, endPathX, endPathY,
        phrase, d, k, displayText, displayBounds, verticalText, widthOfSlice,
        heightOfSlice, rectangleId) {

        var pathStroke = displayBounds ? "black" : "none";

        var pathString = "M" + startPathX + "," + startPathY + "L" + endPathX + "," + endPathY;
        var path = svg.append("path")
            .attr("id", "innerPath_" + rectangleId + "_" + k)
            .attr("d", pathString)
            .style("fill", "none")
            .style('stroke', pathStroke);

        var textSize = 1;

        var phantomSvg = d3.select("body").append("svg");
        var text = svg.append("text")
            .text(phrase)
            .attr("font-size", textSize + "pt");
        var bbox = text.node().getBBox();

            var widthTransform = bbox.width;
            var heightTransform = bbox.height;

            var eBrake = true;

            while (widthTransform < widthOfSlice && heightTransform < heightOfSlice && eBrake) {

                textSize++;

                text = phantomSvg.append("text")
                    .text(phrase)
                    .attr("font-size", textSize + "pt");

                //var textNode = document.getElementById("t1");
                bbox = text.node().getBBox();
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
                .attr("font-family", font);

            //return path and text
            var result = [path, text];
            return result;

    },

    appendCharacterIntoRectangle: function(char, rectangle, svg, d, tag, padding) {

        //we're only applying padding to the bottom

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
            startPathY = rectangle[0].cy + (rectangle[0].height / 2) - padding;
            endPathX = startPathX + rectangle[0].width;
            widthOfSlice = rectangle[0].width;
            heightOfSlice = rectangle[0].height - padding;
        } else { //rectangle angle == 90 || 270
            startPathX = rectangle[0].cx - (rectangle[0].height / 2);
            startPathY = rectangle[0].cy + (rectangle[0].width / 2) - padding;
            endPathX = startPathX + rectangle[0].height;
            widthOfSlice = rectangle[0].height;
            heightOfSlice = rectangle[0].width - padding;
        }

        endPathY = startPathY;
        verticalText = false;
        rectangleId = d.properties.name + "_inner";

        var pathAndText = TextUtil.appendPathAndText(startPathX, startPathY, endPathX, endPathY, char, d, tag, displayText,
        displayBounds, verticalText, widthOfSlice, heightOfSlice, rectangleId);

        //return character that you just appended
        return pathAndText;
    }


};