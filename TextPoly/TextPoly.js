/**
 * Created by meredith on 8/13/17.
 */
const PolyK = require('polyk');
const debug_colors = ["#DCDCDD", "#C5C3C6", "#46494C", "#4C5C68", "#1985A1", "#114B5F"];
const largestRect = require('./largestRect.js');
const point_at_length = require('point-at-length');
const TextToSVG = require('text-to-svg');
const TextUtil = require("./js/TextUtil.js");
const NeighborhoodParser = require("./js/NeighborhoodParser.js");
const Clipper = require("./js/Javascript_Clipper_6.2.1.2/clipper.js");
"use strict";
// mock browser
// make fake svg to use for letter fitting
const d3 = require('d3');
const mock_browser = require('mock-browser').mocks.MockBrowser;
var mock = new mock_browser(),
    doc = mock.getDocument(),
    svg = d3.select(doc.createElement('svg'));

/*
Creating grid to overlay on polygon
 */
var HORIZONTAL_SLICE_CAP = 10; // max number of horizontal rows we'll attempt to use per shape

/*
Fitting letter into grid cell
 */
const FONT_SIZE_START = 5; // start w size 5 font when we iteratively increase size of chars
var CHAR_ASPECT_RATIO = .5; // what is our ideal aspect ratio for grid cells

// how many points will we check on the outside of each character to detect when it has crossed boundary of grid cell
const NUM_HIT_TEST_POINTS = 20;
const NUM_OVERLAPPING_POINTS = 1; // how many points on character are allowed to overlap w bounding grid cell

module.exports = {

    //slice neighborhood horizontally, then vertically
    //according to length of phrase to get grid over neighborhood.
    //Use inscribed rectangles to fill each grid slot with a letter
    execute: function (path, phrase, padding, font_file, callback, shape_info) {

        var pathCoords = path;

        TextToSVG.load(font_file, function (error_font, textToSVG) {

            if (error_font) {
                console.log(error_font);
            }

            // pad polygon between letters and border of shape
            var solution = module.exports.pad_polygon(path, padding);
            var slicedNameArray = TextUtil.slicePhrase(solution.length, phrase);
            var chars = [];
            // for each polygon in the overall shape, fill with text
            // loop through polygons in result of padding operation
            for (var poly = 0; poly < solution.length; poly++) {

                var innerPointsList = "";
                for (var innerPoint = 0; innerPoint < solution[poly].length; innerPoint++) {
                    if (!isNaN(solution[poly][innerPoint].X)) {
                        var curr = solution[poly][innerPoint];
                        innerPointsList += curr.X + "," + curr.Y + " ";
                    }
                }
                var pathCoords3d = NeighborhoodParser.pathArray(innerPointsList);

                //get height and width of polygon - use as boundaries of grid
                var dimensions = module.exports.getShapeDimensions(pathCoords3d);

                // get number of horizontal slices we should be using for optimal letter fitting
                var optimalHorizontalSlices = module.exports.testGrid(pathCoords3d,
                    dimensions, svg, slicedNameArray[poly]);

                console.log("num horizontal slices: " + optimalHorizontalSlices);

                // get individual grid cells that each letter will be fit into
                // TODO: sometimes this doesn't return enough grid cells!
                var gridUnits = module.exports.createGrid(pathCoords3d, dimensions,
                    optimalHorizontalSlices, svg, slicedNameArray[poly]);
                if (gridUnits.length != slicedNameArray[poly].length) {
                    console.log("number of cells != phrase length for phrase: "
                        + slicedNameArray[poly]);
                }

                debugger;
                // for each unit of the grid, fit a letter into it
                for (var i = 0; i < gridUnits.length; i++) {
                    chars[chars.length] =
                        module.exports.getCharacterAsSVG(slicedNameArray[poly].charAt(i),
                            gridUnits[i], svg, i, textToSVG);
                }
            }
            callback(chars, shape_info);
        });
    },
    pad_polygon: function(coords, padding) {
        var subj = new Clipper.Paths();
        var solution = new Clipper.Paths();
        for (var poly = 0; poly < coords.length; poly++) {
            var innerArray = [];
            for (var p = 0; p < coords[poly].length; p++) {
                innerArray[innerArray.length] = {"X": coords[poly][p][0], "Y": coords[poly][p][1]};
            }
            subj[poly] = innerArray;
        }
        var co = new Clipper.ClipperOffset(2, 0.25);
        co.AddPaths(subj, Clipper.JoinType.jtRound, Clipper.EndType.etClosedPolygon);
        var offset_val = 0 - padding;
        co.Execute(solution, offset_val);
        return solution;
    },

    getShapeDimensions: function (pathCoords3d) {
        debugger;

        //find max and min y coords
        var firstCoord = pathCoords3d[0][0];
        var max = firstCoord[1]; //max is actually *lowest* y point
        var min = firstCoord[1]; //min is actually *highest* y point
        var leftMost = firstCoord[0];
        var rightMost = firstCoord[0];

        for (var i = 0; i < pathCoords3d.length; i++) {
            for (var j = 0; j < pathCoords3d[i].length; j++) {
                // if (j != pathCoords3d[i].length - 2) {
                    max = Math.max(pathCoords3d[i][j][1], max);
                    min = Math.min(pathCoords3d[i][j][1], min);
                    leftMost = Math.min(pathCoords3d[i][j][0], leftMost);
                    rightMost = Math.max(pathCoords3d[i][j][0], rightMost);
                // }
            }
        }
        var results = {max: max, min: min, left: leftMost, right: rightMost};
        return results;
    },

    testGrid: function (pathCoords3d, dimensions, svg, phrase) {

        var optimalHorizontalSlices = -1;
        var lowestError = Number.MAX_VALUE;

        // for each possible number of horizontal grid rows
        for (var horCount = 1; horCount < HORIZONTAL_SLICE_CAP; horCount++) {

            var horLevelError = 0;

            // if we run into an issue creating a grid with this
            // number of horizontal rows, we flip this
            // so that we know that that number of horizontal slices is invalid
            var valid = true;

            //slice into n levels, where n = number of horizontal levels * number of polygons that make
            //up neighborhood
            var phrasePieces = module.exports.slicePhrase(horCount * pathCoords3d.length, phrase);

            if (horCount * pathCoords3d.length != phrasePieces.length) {
                console.log("ERROR: phrase splitting for shape with phrase: " + phrase);
            }

            //get horizontal slices that are viable
            var slices = module.exports.divide(pathCoords3d, horCount, dimensions, svg, true);

            if (slices != null && slices.length != 0 && slices[0].length != 0) {

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
                                        .attr("d", function () {
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
                            valid = false;
                            break;
                        }

                        //remove this poly
                        //polyInSlicePath.remove();
                    }

                    if (!valid) {
                        horLevelError = Number.MAX_VALUE;
                        break;
                    }

                }

                if (horLevelError < lowestError) {
                    //this number of horizontal levels is a better
                    //fit for our letters
                    lowestError = horLevelError;
                    optimalHorizontalSlices = horCount;
                }

                console.log("horizontal level error for " + horCount + " is " + horLevelError);

            } else {
                console.log("slices null for shape: " + phrase);
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


    divide: function (pathCoords3d, num, dimensions, svg, horizontalSliceFlag) {
      //slice (height is width if doing vertical slice)
        var heightOfSlice = (dimensions.max - dimensions.min) / num;
        var slices = [];

        // loop through distinct polygons
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
                    pathArrayTop = [[dimensions.right + 10, maxVal], [dimensions.left - 10, maxVal]];
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
                            if (comparisonVal < midVal && (comparisonVal + heightOfSlice) > midVal) {
                                //this poly belongs in this slice
                                polysInSlice[polysInSlice.length] = testPoly;
                            } else {
                                //this poly is leftover
                                polysOutOfSlice[polysOutOfSlice.length] = testPoly;
                            }
                        }

                    } catch (e) {
                        console.log("PolyK Exception: " + e);
                        // dump all unfilled polys into slices
                        //for (var h = 0; h < unfilledPolys.length; h++) {
                        //    slices[slices.length] = unfilledPolys[h];
                        //}
                        //return slices;
                        return null;
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
        if (slices.length == num) {
            return slices;
        } else {
            return null;
        }
    },

    twoToOneDimensional: function (twoDArray) {
        var result = [];
        for (var i = 0; i < twoDArray.length; i++) {
            result[2 * i] = twoDArray[i][0];
            result[(2 * i) + 1] = twoDArray[i][1];
        }
        return result;
    },

    //same as test grid, but doesn't loop through a bunch of different numbers
    //of horizontal levels...instead, uses known value
    createGrid: function (pathCoords3d, dimensions, numLevels, svg, phrase) {

        //to be filled with rectangles that make up grid units
        var grid = [];

        //get horizontal slices that are viable
        var slices = module.exports.divide(pathCoords3d, numLevels, dimensions, svg, true);

        if (slices != null) {

            debugger;
            // split phrase into chars for each row
            var phrasePieces = module.exports.slicePhrase(slices.length * pathCoords3d.length, phrase);

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
                    polyInSlicePath.attr("d", function () {
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
    oneDToTwoD: function (oneDArray) {
        var twoDArray = [];
        for (var i = 0; i < oneDArray.length / 2; i++) {
            twoDArray[i] = [oneDArray[2 * i], oneDArray[2 * i + 1]];
        }
        return twoDArray;
    },

    tryUprightAndSidewaysCharacter: function (char, tag, svg, gridUnit, textToSVG) {

        var startPathX,
            startPathY,
            widthOfSlice,
            heightOfSlice;

        var getCharUpright;
        var getCharSideways;

        // startPathX = gridUnit[0].cx - (gridUnit[0].width / 2);
        // startPathY = gridUnit[0].cy + (gridUnit[0].height / 2);
        // widthOfSlice = gridUnit[0].width;
        // heightOfSlice = gridUnit[0].height;
        // getCharSideways = module.exports.getChar(startPathX, startPathY, char, tag, svg, gridUnit, textToSVG);


        //TODO: implement sideways characters

        startPathX = gridUnit[0].cx - (gridUnit[0].height / 2);
        startPathY = gridUnit[0].cy + (gridUnit[0].width / 2);
        widthOfSlice = gridUnit[0].height;
        heightOfSlice = gridUnit[0].width;
        getCharUpright = module.exports.getChar(startPathX, startPathY, char, tag, svg, gridUnit, textToSVG);

        return getCharUpright.path;
    },

    getCharacterAsSVG:

        function (char, gridUnit, svg, tag, textToSVG) {

            return module.exports.tryUprightAndSidewaysCharacter(char, tag, svg, gridUnit, textToSVG);

        }

    ,

    estimateError: function (currPoly, neighborhoodGroup, CHAR_ASPECT_RATIO) {
        var twoDPath = module.exports.oneDToTwoD(currPoly);
        var vertSlicePath = neighborhoodGroup.append("path")
            .attr("d", function () {
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
    }
    ,


    getDiffAspectRatio: function (twoDPath, CHAR_ASPECT_RATIO) {

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
    }
    ,


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
    arrayToPath: function (polyArray) {

        //generate path for topPoly
        var pathString = "M" + polyArray[0][0] + "," + polyArray[0][1];
        for (var j = 1; j < polyArray.length; j++) {
            pathString += "L" + polyArray[j][0] + "," + polyArray[j][1];
        }

        //add close path character to draw line back to initial point
        pathString += 'Z';

        return pathString;
    }
    ,

    getChar: function (startPathX, startPathY,
                       phrase, k, svg, rectangle,
                       textToSVG) {

        // viable anchors: bottom, left, middle, baseline

        const ANCHOR_OPTIONS = ["bottom", "left", "middle", "baseline"];

        var options = {
            "x": startPathX,
            "y": startPathY,
            "anchor": ANCHOR_OPTIONS[0],
            "fontSize": FONT_SIZE_START
        };
        var bestPath = textToSVG.getD(phrase.toUpperCase(), options);
        var bestFontSize = FONT_SIZE_START;

        // loop through all anchors that we can pass to text-to-svg
        for (var i = 0; i < ANCHOR_OPTIONS.length; i++) {

            options.anchor = ANCHOR_OPTIONS[i];
            options.fontSize = FONT_SIZE_START;

            var charToBig = false;
            var bestPathForAnchor = textToSVG.getD(phrase.toUpperCase(), options);

            var whileLoopCount = 0;

            // canvas for trying out char sizes - who even knows if these are the right dimensions
            while (!charToBig) {
                whileLoopCount++;

                // get character as SVG path
                const charPath = textToSVG.getD(phrase.toUpperCase(), options);

                // count num points found to be outside of the containing polygon
                var countOutOfBounds = 0;

                // flag
                var stopIterating = false;

                var point_at_length_instance = point_at_length(charPath);
                var totalLength = point_at_length_instance.length();
                var lengthIncrement = totalLength * 1.0 / NUM_HIT_TEST_POINTS;

                // check points along char path, make sure they are inside of polygon
                for (var curr = 0; curr < NUM_HIT_TEST_POINTS; curr++) {
                    var point = point_at_length_instance.at(lengthIncrement * curr);

                    if (!point) {
                        console.log("found undefined point in appendChar");
                    }

                    // is point inside of polygon?
                    if (!PolyK.ContainsPoint(rectangle.polygon, point[0], point[1])) {
                        countOutOfBounds++;
                        if (countOutOfBounds > NUM_OVERLAPPING_POINTS) {
                            stopIterating = true;
                            break;
                        }
                    }
                }

                if (!stopIterating) {
                    bestPathForAnchor = charPath;
                    options.fontSize += 1;
                } else {
                    charToBig = true;
                }

            }

            if (options.fontSize > bestFontSize) {
                // update overall best path
                bestPath = bestPathForAnchor;
                bestFontSize = options.fontSize;
            }
        }

        return {path: bestPath, fontSize: bestFontSize};
    }

}
;

var TextPoly = module.exports.execute;