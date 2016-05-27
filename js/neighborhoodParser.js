/**
 * Created by meredith on 5/25/16.
 *
 * Parses neighborhood bounds into usable array.
 */
var NeighborhoodParser = {
  get2dPathArray: function(element) {
    var neighborhoodBoundsString = element.getAttribute("neighborhoodBounds");

    //remove 'M' at beginning of path and find all subsequent coordinates by
    //splitting on 'L'
    var pathCoords = neighborhoodBoundsString.substring(1).split('L');
    var pathCoords2d = [];

    //transform pathCoords array into array of 2-d arrays
    for (var i = 0; i < pathCoords.length; i++) {
      var bothCoords = pathCoords[i].split(',');
      pathCoords2d[i] = [parseFloat(bothCoords[0]), parseFloat(bothCoords[1])];

    }
    return pathCoords2d;
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

  getNeighborhoodDimensions: function(pathCoords2d) {

    //find max and min y coords
    var firstCoord = pathCoords2d[0];
    var max = firstCoord[1]; //max is actually *lowest* y point
    var min = firstCoord[1]; //min is actually *highest* y point
    var leftMost = firstCoord[0];
    var rightMost = firstCoord[0];

    for (var i = 0; i < pathCoords2d.length; i++) {
      max = Math.max(pathCoords2d[i][1], max);
      min = Math.min(pathCoords2d[i][1], min);
      leftMost = Math.min(pathCoords2d[i][0], leftMost);
      rightMost = Math.max(pathCoords2d[i][0], rightMost);
    }
    var results = {max: max, min: min, left: leftMost, right: rightMost};
    return results;
  },

    divide: function(pathCoords2d, num, dimensions, svg, d) {
        //slice
        var heightOfSlice = (dimensions.max - dimensions.min) / num;

        //format polygon for polySlice
        var pathCoords1d = PolygonGenerator.twoToOneDimensional(pathCoords2d);
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
        var slices = [];

        for (var j = 0; j < num; j++) {

            //find top and bottom boundaries of slice
            var maxY = (j + 1) * heightOfSlice + dimensions.min;
            var minY =j * heightOfSlice + dimensions.min;

            //find slicing line...
            //nudge endpoints of line to outside of the polygon, or else PolyK complains
            //doesn't matter where the x coords are anyway--taking horizontal slice.
            var pathArrayTop = [[dimensions.right + 10, maxY],[dimensions.left - 10, maxY]];

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
                        var countPointsInLevel = 0;
                        var countPointsOutOfLevel = 0;
                        for (var k = 0; k < testPoly.length / 2; k++) {
                            if (testPoly[(2 * k) + 1] > maxY || testPoly[(2 * k) + 1] < minY) {
                                //point out of level
                                countPointsOutOfLevel++;
                            } else {
                                countPointsInLevel++;
                            }
                        }
                        //sort according to whether poly has more points in current slice,
                        //or belongs in remainder
                        if (countPointsInLevel > countPointsOutOfLevel) {
                            //poly belongs in current level
                            polysInSlice[polysInSlice.length] = testPoly;
                        } else {
                            polysOutOfSlice[polysOutOfSlice.length] = testPoly;
                        }
                    }

                } catch (e) {
                    console.log("exception exception Hayyyyy: " + e);
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

            //to keep track of vertical line segments in this chunk
            //var lineSegments = [];
            //var lineSegmentsSize = 0;
            //
            ////loop through coordinates--find coordinates in shape
            //for (var i = 0; i < pathCoords2d.length; i++) {
            //    var currY = pathCoords2d[i][1];
            //    //in this horizontal slice
            //    //first coord found for this line segment
            //    var currLineSegment = [];
            //    var currLineSegmentSize = 0;
            //    while (currY < maxY && currY > minY && i < pathCoords2d.length) {
            //        //we actually care about this line segment
            //        currLineSegment[currLineSegmentSize] = pathCoords2d[i];
            //        currLineSegmentSize++;
            //        i++;
            //        if (i >= pathCoords2d.length) {
            //            break;
            //        } else {
            //            currY = pathCoords2d[i][1];
            //        }
            //    }
            //    //finished with new line segment
            //    if (currLineSegmentSize > 1) {
            //        lineSegments[lineSegmentsSize] = currLineSegment;
            //        lineSegmentsSize++;
            //    }
            //}
            //
            //for (var i = 0; i < lineSegments.length; i++) {
            //    var pathStroke = displayBounds ? DebugTool.colors[i] : "none";
            //    var pathString = NeighborhoodParser.arrayToPath(lineSegments[i]);
            //    svg.append("path")
            //        .attr("d", pathString)
            //        .style("fill", "none")
            //        .style('stroke', pathStroke);
            //}
        return slices;

    }


};