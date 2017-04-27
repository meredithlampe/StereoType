/**
 * Created by meredith on 5/25/16.
 *
 * Parses neighborhood bounds into usable array.
 */
var NeighborhoodParser = {
  get3dPathArray: function(neighborhoodBoundsString, isMultiPoly) {


    var pathCoords2d;
    var pathCorods3d;

      if (isMultiPoly) { //industrial district case
          pathCoords3d = [];
          var polyStrings = neighborhoodBoundsString.split('M');
          var indexIn3d = 0;

          for (var i = 0; i < polyStrings.length; i++) {
              var currString = polyStrings[i];

              if (currString.length > 0) {
                  var pathCoords = currString.split('L');
                  var pathCoords2d = [];

                  //fill 2d array
                  for (var j = 0; j < pathCoords.length; j++) {
                      var bothCoords = pathCoords[j].split(',');
                      pathCoords2d[j] = [parseFloat(bothCoords[0]), parseFloat(bothCoords[1])];
                  }

                  pathCoords3d[indexIn3d] = pathCoords2d;
                  indexIn3d++;
              } else {
                  //string is empty string -- when splitting on M causes empty string
                  //at the beginning: don't increment index in 3d array
              }
          }
      } else {
          //remove 'M' at beginning of path and find all subsequent coordinates by
          //splitting on 'L'
          var pathCoords = neighborhoodBoundsString.substring(1).split('L');
          pathCoords2d = [];

          //transform pathCoords array into array of 2-d arrays
          for (var i = 0; i < pathCoords.length; i++) {
              var bothCoords = pathCoords[i].split(',');
              pathCoords2d[i] = [parseFloat(bothCoords[0]), parseFloat(bothCoords[1])];

          }
          var pathCoords3d = [pathCoords2d];
      }

    return pathCoords3d;
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

  getNeighborhoodDimensions: function(pathCoords3d, padding) {

    //find max and min y coords
    var firstCoord = pathCoords3d[0][0];
    var max = firstCoord[1]; //max is actually *lowest* y point
    var min = firstCoord[1]; //min is actually *highest* y point
    var leftMost = firstCoord[0];
    var rightMost = firstCoord[0];

    for (var i = 0; i < pathCoords3d.length; i++) {
        for (var j = 0; j < pathCoords3d[i].length; j++) {
            max = Math.max(pathCoords3d[i][j][1], max);
            min = Math.min(pathCoords3d[i][j][1], min);
            leftMost = Math.min(pathCoords3d[i][j][0], leftMost);
            rightMost = Math.max(pathCoords3d[i][j][0], rightMost);
        }
    }
    var results = {max: max - padding, min: min + padding, left: leftMost + padding, right: rightMost - padding};
    return results;
  },

    divide: function(pathCoords3d, num, dimensions, svg, d, horizontalSliceFlag) {

        //slice (height is width if doing vertical slice)
        var heightOfSlice = (dimensions.max - dimensions.min) / num;
        var slices = [];

        for (var currPathCoord = 0; currPathCoord < pathCoords3d.length; currPathCoord++) {
            //format polygon for polySlice
            var pathCoords1d = PolygonGenerator.twoToOneDimensional(pathCoords3d[currPathCoord]);
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

    testGrid: function(pathCoords3d, dimensions, d, svg, phrase,
                       padding, HORIZONTAL_SLICE_CAP, CHAR_ASPECT_RATIO,
                       TEXT_SIZE_MULTIPLIER, font, TextToSVG) {

        var optimalHorizontalSlices = -1;
        var optimalHorizontalSlicesArea = -1;
        var lowestError = Number.MAX_VALUE;
        var lowestErrorArea = Number.MAX_VALUE;
        var lowestAreaDifference = Number.MAX_VALUE;

        //find total poly area
        var totalPolyArea = 0;
        for (var poly = 0; poly < pathCoords3d.length; poly++) {
            totalPolyArea += PolyK.GetArea(PolygonGenerator.twoToOneDimensional(pathCoords3d[poly]));
        }

        for (var horCount = 1; horCount < HORIZONTAL_SLICE_CAP; horCount++) {

            var horLevelError = 0;
            var horLevelError_Area = 0; //difference between char area and inscribed rectangle area
            var coveredArea = 0; //difference between inscribed rect area and total poly area

            //try this level. compare with optimal aspect ratio.
            //NeighborhoodParser.divide(pathCoords3d, horCount, dimensions,)

            //slice into n levels, where n = number of horizontal levels * number of polygons that make
            //up neighborhood
            var phrasePieces = TextUtil.slicePhrase(horCount * pathCoords3d.length, phrase);

            if (horCount * pathCoords3d.length != phrasePieces.length) {
                console.log("ERROR: phrase splitting for neighborhood: " + d.properties.name);
            }

            //get horizontal slices that are viable
            var slices = NeighborhoodParser.divide(pathCoords3d, horCount, dimensions, svg, d, true);

            if (slices != null) {

                //loop through the slices
                for (var i = 0; i < slices.length; i++) {

                    //get color for this slice
                    var color = DebugTool.colors[i];
                    var currSlice = slices[i];

                    //divide phrase for this slice into polys for this slice
                    var phraseSlicePoly = TextUtil.slicePhrase(currSlice.length, phrasePieces[i]);

                    //loop through polys within a slice
                    //slice vertically, but have to keep track of order, left to right
                    for (var j = 0; j < slices[i].length; j++) {
                        var currPolyInSlice = currSlice[j];

                        //paint color of whole horizontal slice
                        var polyInSlicePath = svg.append("path");
                        polyInSlicePath.attr("d", function() {
                                var twoDPath = NeighborhoodParser.oneDToTwoD(currPolyInSlice);
                                //console.log("twoDPath: " + twoDPath);
                                var pathString = NeighborhoodParser.arrayToPath(twoDPath);
                                //console.log(pathString);
                                return pathString;
                            })
                            .attr("fill", color);


                        //worry about vertical slicing horizontal slice now
                        var currPoly2d = NeighborhoodParser.oneDToTwoD(currPolyInSlice);
                        var currPoly3d = [currPoly2d];
                        var sliceDimensions = NeighborhoodParser.getNeighborhoodDimensions(currPoly3d, 0);
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
                        var verticalSlices = NeighborhoodParser.divide(currPoly3d, numVerticalSlices,
                            verDimensions, svg, d, false);

                        if (verticalSlices != null) {

                            //loop through each vertical slice
                            for (var g = 0; g < verticalSlices.length; g++) {
                                var vertColor = DebugTool.colorfulColors[g];
                                var currVertSlice = verticalSlices[g];

                                var currPhrase = phraseForSlicePiece[g];

                                //loop through each piece of this vertical slice
                                for (var k = 0; k < currVertSlice.length; k++) {

                                    var currPoly = currVertSlice[k];
                                    horLevelError += NeighborhoodParser.estimateError(currPoly, svg, CHAR_ASPECT_RATIO);

                                    //horLevelError_Area += NeighborhoodParser.estimateErrorByArea(currPolyInSlice,
                                    //    neighborhoodGroup, svg, d);

                                    var twoDPath = NeighborhoodParser.oneDToTwoD(currPoly);
                                    var vertSlicePath = svg.append("path")
                                        .attr("d", function() {
                                            //console.log("twoDPath: " + twoDPath);
                                            var pathString = NeighborhoodParser.arrayToPath(twoDPath);
                                            //console.log(pathString);
                                            return pathString;
                                        })
                                        .attr("opacity", ".50");

                                    var rectangle = d3plus.geom.largestRect(twoDPath, {
                                        angle: [0, 90, 270], nTries: 50, tolerance: 0.02
                                    });

                                    if (rectangle != null && rectangle[0] != null) {
                                        //var areaError = NeighborhoodParser.getDiffArea(twoDPath, svg, d, rectangle);
                                        //estimate error based on area
                                        var inscribedArea = rectangle[1];

                                        //do a sample append...doesn't really matter what character it is
                                        var pathAndText = TextUtil.appendCharacterIntoRectangle('X', rectangle,
                                            svg, d, "test", 0, false, false, TEXT_SIZE_MULTIPLIER, font, TextToSVG);
                                        var textBox = pathAndText[1].node().getBoundingClientRect();
                                        var textArea = textBox.width * textBox.height;

                                        //remove path and text
                                        pathAndText[0].remove();
                                        pathAndText[1].remove();

                                        //horLevelError_Area += areaError;
                                        coveredArea += textArea;
                                    }

                                    //the error was what we were really after.
                                    //remove this slice.
                                    vertSlicePath.remove();

                                }

                            }
                        } else {
                            console.log("error: vertical slices null for neighborhood: " + d.properties.name);
                        }

                        //remove this poly
                        polyInSlicePath.remove();
                    }

                }

            } else {
                console.log("slices null for neighborhood: " + d.properties.name);
            }

            //if (horLevelError < lowestError) {
            //    //this number of horizontal levels is a better
            //    //fit for our letters
            //    lowestError = horLevelError;
            //    optimalHorizontalSlices = horCount;
            //}


            //if (horLevelError_Area < lowestErrorArea) {
            //    //this number of horizontal levels is a better
            //    //fit for our letters
            //    lowestErrorArea = horLevelError_Area;
            //    optimalHorizontalSlicesArea = horCount;
            //}

            var areaDifference = totalPolyArea - coveredArea;
            if (areaDifference < lowestAreaDifference) {
                lowestAreaDifference = areaDifference;
                optimalHorizontalSlices = horCount;
            }

        }

        //DebugTool.showInCenterOfPoly(pathCoords3d, optimalHorizontalSlices, 0);
        return optimalHorizontalSlices;

    },

    //same as test grid, but doesn't loop through a bunch of different numbers
    //of horizontal levels...instead, uses known value
    createGrid: function(pathCoords3d, dimensions, numLevels, d, svg, phrase, padding,
                         displayRectangles, displayBounds) {

        //to be filled with rectangles that make up grid units
        var grid = [];

        var phrasePieces = TextUtil.slicePhrase(numLevels * pathCoords3d.length, phrase, padding);

        if (numLevels * pathCoords3d.length != phrasePieces.length) {
            console.log("ERROR: phrase splitting for neighborhood: " + d.properties.name + ", expected: " + numLevels * pathCoords3d.length
              + ", actual: " + phrasePieces.length);
        }

        //get horizontal slices that are viable
        var slices = NeighborhoodParser.divide(pathCoords3d, numLevels, dimensions, svg, d, true);

        if (slices != null) {

            //assert that everything is still working
            if (slices.length != numLevels || numLevels != phrasePieces.length) {
                console.log("slice error--number of slices != computed number of levels or num levels "
                    + " != number of phrase pieces");
            }

            //loop through the slices
            for (var i = 0; i < slices.length; i++) {

                //get color for this slice
                var color = DebugTool.colors[i];
                var currSlice = slices[i];

                //divide phrase for this slice into polys for this slice
                var phraseSlicePoly = TextUtil.slicePhrase(currSlice.length, phrasePieces[i]);

                //loop through polys within a slice
                //slice vertically, but have to keep track of order, left to right
                for (var j = 0; j < slices[i].length; j++) {
                    var currPolyInSlice = currSlice[j];

                    //paint color of whole horizontal slice
                    var polyInSlicePath = svg.append("path");
                    polyInSlicePath.attr("d", function() {
                            var twoDPath = NeighborhoodParser.oneDToTwoD(currPolyInSlice);
                            //console.log("twoDPath: " + twoDPath);
                            var pathString = NeighborhoodParser.arrayToPath(twoDPath);
                            //console.log(pathString);
                            return pathString;
                        })
                        .attr("fill", color);


                    //worry about vertical slicing horizontal slice now
                    var currPoly2d = NeighborhoodParser.oneDToTwoD(currPolyInSlice);
                    var currPoly3d = [currPoly2d];
                    var sliceDimensions = NeighborhoodParser.getNeighborhoodDimensions(currPoly3d, 0);
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
                    var verticalSlices = NeighborhoodParser.divide(currPoly3d, numVerticalSlices,
                        verDimensions, svg, d, false);

                    if (verticalSlices != null) {

                        //loop through each vertical slice
                        for (var g = 0; g < verticalSlices.length; g++) {
                            var vertColor = DebugTool.colorfulColors[g];
                            var currVertSlice = verticalSlices[g];

                            var currPhrase = phraseForSlicePiece[g];

                            //loop through each piece of this vertical slice
                            for (var k = 0; k < currVertSlice.length; k++) {
                                var twoDPath = NeighborhoodParser.oneDToTwoD(currVertSlice[k]);
                                var vertSlicePath = svg.append("path")
                                    .attr("d", function() {
                                        var pathString = NeighborhoodParser.arrayToPath(twoDPath);
                                        //console.log(pathString);
                                        return pathString;
                                    })
                                    .attr("fill", vertColor)
                                    .attr("opacity", ".50");

                                //get largest inscribed rectangle for this slice
                                //TODO: WHAT ABOUT MULTIPOLYGONS HEYYYY
                                var inscribed = d3plus.geom.largestRect(twoDPath, {
                                    angle: [90, 270], nTries: 50, tolerance: 0.02
                                });

                                if (inscribed != null && inscribed[0] != null) {
                                    //append inscribed rectangle
                                    if (displayRectangles) {
                                        DebugTool.appendRect(svg, inscribed, d);
                                    }
                                    inscribed.polygon = PolygonGenerator.twoToOneDimensional(twoDPath);
                                    grid[grid.length] = inscribed; // one dimensional array representing largest inscribed rectangle
                                }
                            }
                            if (!displayBounds && vertSlicePath != null) {
                                vertSlicePath.remove();
                            }

                        }
                    } else {
                        console.log("error: vertical slices null for neighborhood: " + d.properties.name);
                    }

                    if (!displayBounds && polyInSlicePath != null) {
                        polyInSlicePath.remove();
                    }

                }

            }

        } else {
            console.log("slices null for neighborhood: " + d.properties.name);
        }

        return grid;

    },

    estimateError: function(currPoly, neighborhoodGroup, CHAR_ASPECT_RATIO) {
        var twoDPath = NeighborhoodParser.oneDToTwoD(currPoly);
        var vertSlicePath = neighborhoodGroup.append("path")
            .attr("d", function() {
                //console.log("twoDPath: " + twoDPath);
                var pathString = NeighborhoodParser.arrayToPath(twoDPath);
                //console.log(pathString);
                return pathString;
            })
            .attr("opacity", ".50");

        var horLevelError = NeighborhoodParser.getDiffAspectRatio(twoDPath, CHAR_ASPECT_RATIO);

        //the error was what we were really after.
        //remove this slice.
        vertSlicePath.remove();
        return horLevelError;
    },


    getDiffAspectRatio: function(twoDPath, CHAR_ASPECT_RATIO) {
        //get largest inscribed rectangle for this slice
        //TODO: WHAT ABOUT MULTIPOLYGONS HEYYYY
        var inscribed = d3plus.geom.largestRect(twoDPath, {
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



};
