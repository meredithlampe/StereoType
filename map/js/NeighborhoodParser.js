/**
 * Created by meredith on 5/25/16.
 *
 * Parses neighborhood bounds into usable array.
 */

//const PolyK = require('./polyk.js');
    const PolyK = require('polyk');
const TextUtil = require('./TextUtil.js');
const DebugTool = require('./DebugTool.js');

// stole single function from the d3plus library
const largestRect = require('./largestRect.js');

module.exports = {

    /*
    converts given shape bounds to 3d array of coords
     */
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
          var i = 0;
          for (; i < pathCoords.length; i++) {
              var bothCoords = pathCoords[i].split(',');
              pathCoords2d[i] = [parseFloat(bothCoords[0]), parseFloat(bothCoords[1])];
          }

          // put first coords at the end again
          var lastCoords = pathCoords[0].split(',');
          pathCoords2d[i] = [parseFloat(lastCoords[0]), parseFloat(lastCoords[1])];
          var pathCoords3d = [pathCoords2d];
      }

    return pathCoords3d;
  },

    pathArray: function (neighborhoodBoundsString) {
         var pathCoords = neighborhoodBoundsString.trim().split(' ');
         var pathCoords2d = [];

          //transform pathCoords array into array of 2-d arrays
          var i = 0;
          for (; i < pathCoords.length; i++) {
              var bothCoords = pathCoords[i].split(',');
              pathCoords2d[i] = [parseFloat(bothCoords[0]), parseFloat(bothCoords[1])];
          }

          // put first coords at the end again
          var lastCoords = pathCoords[0].split(',');
          pathCoords2d[i] = [parseFloat(lastCoords[0]), parseFloat(lastCoords[1])];
          var pathCoords3d = [pathCoords2d];
        return pathCoords3d;
    },




    twoToOneDimensional: function(twoDArray) {
        var result = [];
        for (var i = 0; i < twoDArray.length; i++) {
            result[2 * i] = twoDArray[i][0];
            result[(2 * i) + 1] = twoDArray[i][1];
        }
        return result;
    }



};
