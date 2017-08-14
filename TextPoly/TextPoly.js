/**
 * Created by meredith on 8/13/17.
 */
const PolyK = require('polyk');
const debug_colors = ["#DCDCDD", "#C5C3C6", "#46494C", "#4C5C68", "#1985A1", "#114B5F"];
const largestRect = require('./largestRect.js');
const point_at_length = require('point-at-length');
// mock browser
// text to svg

// constants to control alg
var HORIZONTAL_SLICE_CAP = 10; // max number of horizontal rows we'll attempt to use per shape
var CHAR_ASPECT_RATIO = .5;
var TEXT_SIZE_MULTIPLIER = 1;

module.exports = {

    //slice neighborhood horizontally, then vertically
    //according to length of phrase to get grid over neighborhood.
    //Use inscribed rectangles to fill each grid slot with a letter
    execute: function (pathCoords3d, phrase, padding, font, textToSVG, svg) {

        //get height and width of polygon
        var dimensions = module.exports.getShapeDimensions(pathCoords3d);

        // get number of horizontal slices we should be using for optimal letter fitting
        var optimalHorizontalSlices = module.exports.testGrid(pathCoords3d, dimensions, svg, phrase, padding);

        console.log("num horizontal slices: " + optimalHorizontalSlices);

        // get individual grid cells that each letter will be fit into
        // TODO: sometimes this doesn't return enough grid cells!
        var gridUnits = module.exports.createGrid(pathCoords3d, dimensions, optimalHorizontalSlices, svg, phrase, padding);
        if (gridUnits.length != phrase.length) {
            console.log("number of cells != phrase length for phrase: " + phrase);
        }

        var chars = [];

        // for each unit of the grid, fit a letter into it
        for (var i = 0; i < gridUnits.length; i++) {
            chars[chars.length] = module.exports.getCharacterAsSVG(phrase.charAt(i), gridUnits[i], svg, i, padding, font, textToSVG);
            //console.log(chars[chars.length - 1]);
        }

        return chars;
    },

    getShapeDimensions: function(pathCoords3d) {

        //find max and min y coords
        var firstCoord = pathCoords3d[0][0];
        var max = firstCoord[1]; //max is actually *lowest* y point
        var min = firstCoord[1]; //min is actually *highest* y point
        var leftMost = firstCoord[0];
        var rightMost = firstCoord[0];

        for (var i = 0; i < pathCoords3d.length; i++) {
            for (var j = 0; j < pathCoords3d[i].length; j++) {
                if (j != pathCoords3d[i].length - 2) {
                    max = Math.max(pathCoords3d[i][j][1], max);
                    min = Math.min(pathCoords3d[i][j][1], min);
                    leftMost = Math.min(pathCoords3d[i][j][0], leftMost);
                    rightMost = Math.max(pathCoords3d[i][j][0], rightMost);
                }
            }
        }
        var results = {max: max, min: min, left: leftMost, right: rightMost};
        return results;
    },

    testGrid: function (pathCoords3d, dimensions, svg, phrase, padding) {

        var optimalHorizontalSlices = -1;
        //var lowestAreaDifference = Number.MAX_VALUE;
        var lowestError = Number.MAX_VALUE;

        //find total poly area (of all polys in path coords 3d)
        //var totalPolyArea = 0;
        //for (var poly = 0; poly < pathCoords3d.length; poly++) {
        //    totalPolyArea += PolyK.GetArea(module.exports.twoToOneDimensional(pathCoords3d[poly]));
        //}

        // for each possible number of horizontal grid rows
        for (var horCount = 1; horCount < HORIZONTAL_SLICE_CAP; horCount++) {

            var horLevelError = 0;
            //var coveredArea = 0; //difference between inscribed rect area and total poly area

            //slice into n levels, where n = number of horizontal levels * number of polygons that make
            //up neighborhood
            var phrasePieces = module.exports.slicePhrase(horCount * pathCoords3d.length, phrase);

            if (horCount * pathCoords3d.length != phrasePieces.length) {
                console.log("ERROR: phrase splitting for shape with phrase: " + phrase);
            }

            //get horizontal slices that are viable
            var slices = module.exports.divide(pathCoords3d, horCount, dimensions, svg, true);

            if (slices != null) {

                //loop through the horizontal slices
                for (var i = 0; i < slices.length; i++) {

                    //get color for this slice
                    var color = debug_colors[i];
                    var currSlice = slices[i];

                    //divide phrase for this slice into polys for this slice
                    var phraseSlicePoly = module.exports.slicePhrase(currSlice.length, phrasePieces[i]);

                    //loop through polys within a slice (sometimes slicing horizontally results
                    // in more than two slices (i.e. more than the top and bottom slices)
                    //slice vertically, but have to keep track of order, left to right
                    for (var j = 0; j < slices[i].length; j++) {
                        var currPolyInSlice = currSlice[j];

                        //paint color of whole horizontal slice
                        //var polyInSlicePath = svg.append("path");
                        //polyInSlicePath.attr("d", function() {
                        //        var twoDPath = module.exports.oneDToTwoD(currPolyInSlice);
                        //        //console.log("twoDPath: " + twoDPath);
                        //        var pathString = module.exports.arrayToPath(twoDPath);
                        //        //console.log(pathString);
                        //        return pathString;
                        //    })
                        //    .attr("fill", color);


                        //worry about vertical slicing horizontal slice now
                        var currPoly2d = this.oneDToTwoD(currPolyInSlice);
                        var currPoly3d = [currPoly2d];
                        var sliceDimensions = this.getShapeDimensions(currPoly3d);
                        var phraseForSlicePiece = phraseSlicePoly[j];

                        //make new dimensions for vertical slice (flip 90 degrees clockwise)
                        var verDimensions = {
                            max: sliceDimensions.right,
                            min: sliceDimensions.left,
                            left: sliceDimensions.min,
                            right: sliceDimensions.max
                        };

                        //slice vertically
                        var numVerticalSlices = phraseForSlicePiece.length;
                        var verticalSlices = this.divide(currPoly3d, numVerticalSlices,
                            verDimensions, svg, false);

                        if (verticalSlices != null) {

                            //loop through each vertical slice
                            for (var g = 0; g < verticalSlices.length; g++) {
                                //var vertColor = DebugTool.colorfulColors[g];
                                var currVertSlice = verticalSlices[g];

                                var currPhrase = phraseForSlicePiece[g];

                                //loop through each piece of this vertical slice
                                for (var k = 0; k < currVertSlice.length; k++) {

                                    var currPoly = currVertSlice[k];
                                    horLevelError += module.exports.estimateError(currPoly, svg, CHAR_ASPECT_RATIO);

                                    //horLevelError_Area += NeighborhoodParser.estimateErrorByArea(currPolyInSlice,
                                    //    neighborhoodGroup, svg, d);

                                    var twoDPath = module.exports.oneDToTwoD(currPoly);
                                    var vertSlicePath = svg.append("path")
                                        .attr("d", function() {
                                            //console.log("twoDPath: " + twoDPath);
                                            var pathString = module.exports.arrayToPath(twoDPath);
                                            //console.log(pathString);
                                            return pathString;
                                        })
                                        .attr("opacity", ".50");

                                    //var rectangle = d3plus.geom.largestRect(twoDPath, {
                                    //    angle: [0, 90, 270], nTries: 50, tolerance: 0.02
                                    //});

                                    var rectangle = largestRect(twoDPath, {
                                        angle: [0, 90, 270], nTries: 50, tolerance: 0.02
                                    });

                                    if (rectangle != null && rectangle[0] != null) {
                                        //var areaError = NeighborhoodParser.getDiffArea(twoDPath, svg, d, rectangle);
                                        //estimate error based on area
                                        var inscribedArea = rectangle[1];

                                        //do a sample append...doesn't really matter what character it is
                                        //var pathAndText = TextUtil.appendCharacterIntoRectangle('X', rectangle,
                                        //    svg, d, "test", 0, false, false, TEXT_SIZE_MULTIPLIER, font, TextToSVG);
                                        //var textBox = pathAndText[1].node().getBoundingClientRect();
                                        //var textArea = textBox.width * textBox.height;

                                        //remove path and text
                                        //pathAndText[0].remove();
                                        //pathAndText[1].remove();

                                        //horLevelError_Area += areaError;
                                        //coveredArea += textArea;
                                    }

                                    //the error was what we were really after.
                                    //remove this slice.
                                    vertSlicePath.remove();

                                }

                            }
                        } else {
                            console.log("error: vertical slices null for shape with phrase: " + phrase);
                        }

                        //remove this poly
                        //polyInSlicePath.remove();
                    }

                }

            } else {
                console.log("slices null for shape: " + phrase);
            }

            if (horLevelError < lowestError) {
                //this number of horizontal levels is a better
                //fit for our letters
                lowestError = horLevelError;
                optimalHorizontalSlices = horCount;
            }
        }
        return optimalHorizontalSlices;

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


    divide: function(pathCoords3d, num, dimensions, svg, horizontalSliceFlag) {

        //slice (height is width if doing vertical slice)
        var heightOfSlice = (dimensions.max - dimensions.min) / num;
        var slices = [];

        for (var currPathCoord = 0; currPathCoord < pathCoords3d.length; currPathCoord++) {
            //format polygon for polySlice
            var pathCoords1d = module.exports.twoToOneDimensional(pathCoords3d[currPathCoord]);
            var unfilledPolys = [pathCoords1d];
            //3d array of polys in each level:
            /*
             [
             [
             [poly1],
             [poly2],
             ...
             [poly n] in level 1
             ],
             [
             [poly1],
             [poly2],
             ...
             [poly n] in level 2
             ],
             ...
             ...
             [
             [poly1],
             [poly2],
             ...
             [poly n] in level n
             ]
             ]
             */

            //going to num - 1 because on the last iteration we don't
            //actually need to slice
            for (var j = 0; j < num - 1; j++) {

                //find top and bottom boundaries of slice
                var maxVal = (j + 1) * heightOfSlice + dimensions.min; //for vertical slices, rightmost in slice
                var minVal = j * heightOfSlice + dimensions.min; //for vertical slices, leftmost in slice
                var midVal = (maxVal - minVal) / 2 + minVal;

                //find slicing line...
                //nudge endpoints of line to outside of the polygon, or else PolyK complains
                var pathArrayTop;
                if (horizontalSliceFlag) {
                    pathArrayTop = [[dimensions.right + 10, maxVal],[dimensions.left - 10, maxVal]];
                } else { //have to flip x and y if vertical slices.
                    pathArrayTop = [[maxVal, dimensions.right + 10], [maxVal, dimensions.left - 10]];
                }


                //Loop through all of the remaining polygons
                //and slice them
                var polysInSlice = [];
                var polysOutOfSlice = [];

                for (var g = 0; g < unfilledPolys.length; g++) {
                    try {

                        var polysAfterTopSlice = PolyK.Slice(unfilledPolys[g], pathArrayTop[0][0], pathArrayTop[0][1],
                            pathArrayTop[1][0], pathArrayTop[1][1]);

                        //for all polys after split, sort them according to what side of split they're on
                        for (var i = 0; i < polysAfterTopSlice.length; i++) {
                            var testPoly = polysAfterTopSlice[i];
                            var AABB = PolyK.GetAABB(testPoly);
                            var comparisonVal = horizontalSliceFlag ? AABB.y : AABB.x;

                            //test what bucket poly should go into according to bounding box
                            if (comparisonVal < midVal && (comparisonVal + heightOfSlice) > midVal ) {
                                //this poly belongs in this slice
                                polysInSlice[polysInSlice.length] = testPoly;
                            } else {
                                //this poly is leftover
                                polysOutOfSlice[polysOutOfSlice.length] = testPoly;
                            }
                        }

                    } catch (e) {
                        console.log("exception exception Hayyyyy: " + e);
                        slices[slices.length] = polysOutOfSlice;
                        return slices;
                    }
                }

                slices[slices.length] = polysInSlice;

                //put all leftover polys in unfilled poly
                unfilledPolys = polysOutOfSlice;

                if (unfilledPolys == null && j < num - 1) {
                    debugger;
                }
            }
            //remember to save the last poly..the one that we didn't slice
            slices[slices.length] = unfilledPolys;
        }

        return slices;
    },

    twoToOneDimensional: function(twoDArray) {
        var result = [];
        for (var i = 0; i < twoDArray.length; i++) {
            result[2 * i] = twoDArray[i][0];
            result[(2 * i) + 1] = twoDArray[i][1];
        }
        return result;
    },

    //same as test grid, but doesn't loop through a bunch of different numbers
    //of horizontal levels...instead, uses known value
    createGrid: function (pathCoords3d, dimensions, numLevels, svg, phrase, padding) {

        //to be filled with rectangles that make up grid units
        var grid = [];

        //get horizontal slices that are viable
        var slices = module.exports.divide(pathCoords3d, numLevels, dimensions, svg, true);

        if (slices != null) {

            var phrasePieces = module.exports.slicePhrase(slices.length * pathCoords3d.length, phrase, padding);

            //assert that everything is still working
            if (slices.length != numLevels || numLevels != phrasePieces.length) {
                if (slices.length != numLevels) {
                    console.log("ERROR: number of slices != computed number of levels");
                } else {
                    console.log("ERROR: num levels "
                        + " != number of phrase pieces");
                }
            }

            //loop through the slices
            for (var i = 0; i < slices.length; i++) {

                //get color for this slice
                var color = debug_colors[i];
                var currSlice = slices[i];

                //divide phrase for this slice into polys for this slice
                if (!phrasePieces[i]) {
                    continue;
                }
                var phraseSlicePoly = module.exports.slicePhrase(currSlice.length, phrasePieces[i]);

                //loop through polys within a slice
                //slice vertically, but have to keep track of order, left to right
                for (var j = 0; j < slices[i].length; j++) {
                    var currPolyInSlice = currSlice[j];

                    //paint color of whole horizontal slice
                    var polyInSlicePath = svg.append("path");
                    polyInSlicePath.attr("d", function() {
                            var twoDPath = module.exports.oneDToTwoD(currPolyInSlice);
                            //console.log("twoDPath: " + twoDPath);
                            var pathString = module.exports.arrayToPath(twoDPath);
                            //console.log(pathString);
                            return pathString;
                        })
                        .attr("fill", color);


                    //worry about vertical slicing horizontal slice now
                    var currPoly2d = module.exports.oneDToTwoD(currPolyInSlice);
                    var currPoly3d = [currPoly2d];
                    var sliceDimensions = module.exports.getShapeDimensions(currPoly3d);
                    var phraseForSlicePiece = phraseSlicePoly[j];

                    //make new dimensions for vertical slice (flip 90 degrees clockwise)
                    var verDimensions = {
                        max: sliceDimensions.right,
                        min: sliceDimensions.left,
                        left: sliceDimensions.min,
                        right: sliceDimensions.max
                    };

                    //slice vertically
                    var numVerticalSlices = phraseForSlicePiece.length;

                    var verticalSlices = this.divide(currPoly3d, numVerticalSlices,
                        verDimensions, svg, false);

                    if (verticalSlices != null) {

                        //loop through each vertical slice
                        for (var g = 0; g < verticalSlices.length; g++) {
                            var vertColor = debug_colors[g];
                            var currVertSlice = verticalSlices[g];

                            var currPhrase = phraseForSlicePiece[g];

                            //loop through each piece of this vertical slice
                            for (var k = 0; k < currVertSlice.length; k++) {
                                var twoDPath = module.exports.oneDToTwoD(currVertSlice[k]);
                                //var vertSlicePath = svg.append("path")
                                //    .attr("d", function() {
                                //        var pathString = this.arrayToPath(twoDPath);
                                //        //console.log(pathString);
                                //        return pathString;
                                //    })
                                //    .attr("fill", vertColor)
                                //    .attr("opacity", ".50");

                                var inscribed = largestRect(twoDPath, {
                                    angle: [90, 270], nTries: 50, tolerance: 0.02
                                });

                                if (inscribed != null && inscribed[0] != null) {
                                    //append inscribed rectangle
                                    inscribed.polygon = currVertSlice[k];

                                    // package inscribed rectangle and original polygon
                                    // for this cell into grid
                                    grid[grid.length] = inscribed; // one dimensional array representing largest inscribed rectangle
                                } else {
                                    console.log("ERROR: null inscribed rectangle");
                                }
                            }
                        }
                    } else {
                        console.log("error: vertical slices null for shape with phrase: " + phrase);
                    }
                }
            }

        } else {
            console.log("slices null for shape with phrase: " + phrase);
        }

        return grid;

    },

    //returns new 2d coord array from 1d coord array
    //usually to make the stuff that comes out of PolyK play nice with d3
    oneDToTwoD: function(oneDArray) {
        var twoDArray = [];
        for (var i = 0; i < oneDArray.length / 2; i++) {
            twoDArray[i] = [oneDArray[2 * i], oneDArray[2 * i + 1]];
        }
        return twoDArray;
    },


    getCharacterAsSVG: function (char, gridUnit, svg, tag, padding, font,
                                 textToSVG) {

        var startPathX,
            startPathY,
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

        return module.exports.getChar(startPathX, startPathY, char,
            tag, svg, TEXT_SIZE_MULTIPLIER, font, gridUnit, textToSVG);

    },

    estimateError: function(currPoly, neighborhoodGroup, CHAR_ASPECT_RATIO) {
        var twoDPath = module.exports.oneDToTwoD(currPoly);
        var vertSlicePath = neighborhoodGroup.append("path")
            .attr("d", function() {
                //console.log("twoDPath: " + twoDPath);
                var pathString = module.exports.arrayToPath(twoDPath);
                //console.log(pathString);
                return pathString;
            })
            .attr("opacity", ".50");

        var horLevelError = module.exports.getDiffAspectRatio(twoDPath, CHAR_ASPECT_RATIO);

        //the error was what we were really after.
        //remove this slice.
        vertSlicePath.remove();
        return horLevelError;
    },


    getDiffAspectRatio: function(twoDPath, CHAR_ASPECT_RATIO) {

        //get largest inscribed rectangle for this slice
        var inscribed = largestRect(twoDPath, {
            angle: [90, 270], nTries: 10, tolerance: 0.02
        });

        var horLevelError;

        if (inscribed != null && inscribed[0] != null) {
            var inscribedAspectRatio = Math.min(inscribed[0].height, inscribed[0].width) /
                Math.max(inscribed[0].height, inscribed[0].width);
            horLevelError = Math.abs(inscribedAspectRatio - CHAR_ASPECT_RATIO);
        }
        return horLevelError;
    },


    /*converts given 2d array of form:
     [
     [x1, y1]
     [x2, y2]
     ...
     [xn, yn]
     ]
     to SVG path string of form:
     "Mx1,y1Lx2,y2...Lxn,yn"
     Inserting move-to and line-to characters as necessary.
     Coordinates must encompass one shape.
     */
    arrayToPath: function(polyArray) {

        //generate path for topPoly
        var pathString = "M" + polyArray[0][0] + "," + polyArray[0][1];
        for (var j = 1; j < polyArray.length; j++) {
            pathString += "L" + polyArray[j][0] + "," + polyArray[j][1];
        }

        //add close path character to draw line back to initial point
        pathString+= 'Z';

        return pathString;
    },

    getChar: function (startPathX, startPathY,
                       phrase, k, svg, TEXT_SIZE_MULTIPLIER,
                       font, rectangle, textToSVG) {

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

                if (!point) {
                    console.log("found undefined point in appendChar");
                }

                // is point inside of polygon?
                //if (!point || !polyk.ContainsPoint(rectangle.polygon, point.x, point.y)) {
                if (!point || !PolyK.ContainsPoint(rectangle.polygon, point[0], point[1])) {
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

        //console.log("while loop executed " + whileLoopCount + " times");

        return bestPath;
    }

};
