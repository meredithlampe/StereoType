/**
 * Created by meredith on 5/25/16.
 *
 * Parses neighborhood bounds into usable array.
 */
var NeighborhoodParser = {
  get3dPathArray: function(element, isMultiPoly) {
    var neighborhoodBoundsString = element.getAttribute("neighborhoodBounds");
    var pathCoords2d;

      if (isMultiPoly) { //industrial district case
            var polyStrings = neighborhoodBoundsString.split('M');
          var pathCorods3d = [];
          for (var i = 0; i < polyStrings.length; i++) {
              var currString = polyStrings[i];
              var pathCoords = currString.split('L');
              var pathCoords2d = [];

              //fill 2d array
              for (var j = 0; j < pathCoords.length; j++) {
                  var bothCoords = pathCoords[j].split(',');
                  pathCoords2d[j] = [parseFloat(bothCoords[0]), parseFloat(bothCoords[1])];
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

  getNeighborhoodDimensions: function(pathCoords3d) {

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
    var results = {max: max, min: min, left: leftMost, right: rightMost};
    return results;
  },

    divide: function(pathCoords3d, num, dimensions, svg, d) {
        //slice
        var heightOfSlice = (dimensions.max - dimensions.min) / num;

        if (d.type != "MultiPolygon") {
            //format polygon for polySlice
            var pathCoords1d = PolygonGenerator.twoToOneDimensional(pathCoords3d[0]);
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

            //going to num - 1 because on the last iteration we don't
            //actually need to slice
            for (var j = 0; j < num -1; j++) {

                //find top and bottom boundaries of slice
                var maxY = (j + 1) * heightOfSlice + dimensions.min;
                var minY =j * heightOfSlice + dimensions.min;
                var midY = (maxY - minY) / 2 + minY;

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


                            //var countPointsInLevel = 0;
                            //var countPointsOutOfLevel = 0;

                            //loop through all points and place them in this slice or out
                            //for (var k = 0; k < testPoly.length / 2; k++) {
                            //    if (testPoly[(2 * k) + 1] > maxY || testPoly[(2 * k) + 1] < minY) {
                            //        //point out of level
                            //        countPointsOutOfLevel++;
                            //    } else {
                            //        countPointsInLevel++;
                            //    }
                            //}
                            ////sort according to whether poly has more points in current slice,
                            ////or belongs in remainder
                            //if (countPointsInLevel > countPointsOutOfLevel) {
                            //    //poly belongs in current level
                            //    polysInSlice[polysInSlice.length] = testPoly;
                            //} else {
                            //    polysOutOfSlice[polysOutOfSlice.length] = testPoly;
                            //}

                            //check if y coord of upper left corner of bounding box is less than
                            //y coord of midpoint of poly
                            var AABB = PolyK.GetAABB(testPoly);
                            if (AABB.y < midY && (AABB.y + heightOfSlice) > midY ) {
                                //this poly belongs in this slice
                                polysInSlice[polysInSlice.length] = testPoly;
                            } else {
                                //this poly is leftover
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

            //remember to save the last poly..the one that we didn't slice
            slices[slices.length] = unfilledPolys;
            return slices;
        } else { //multiPolynomial.
            return null;
        }

    }


};