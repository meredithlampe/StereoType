/**
 * Created by meredith on 4/11/17.
 */
/**
 * Created by meredith on 2/20/16.
 */

require("./js/NeighborhoodGeolocation.js");
require("./js/TextUtil.js");
const Clipper = require("./Javascript_Clipper_6.2.1.2/clipper.js");
const raphael = require('raphael');
var MapUtil = require("./js/MapUtil.js");
//require("./js/SampleBestPlaces");
//require("./js/GridCache.js");
const Spinner = require("./spinner/spin.min.js");
const TextToSVG = require('text-to-svg');

import { sample_bestplaces as sample_bestplaces } from './js/SampleBestPlaces.js';
import { getGridCache as getGridCache } from './js/GridCache.js';

//function main() {
var width = 900;
var height = 1000;
var rotate = [122, 0, 0];
var center = [0, 47.3097];
var scale = 150000;
//var offset = [1141.329833984375 - 263 + width / 2, 142582.609375 + 30];
var offset = [1141.329833984375 - 450 + width / 2, 142582.609375 + 30];

var font = "din-condensed-bold";

var color1 = ['a', 'b', 'c', 'd', 'e', 'f'];
var color2 = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

//padding to be given between text and inscribed rectangle
var padding = 0.0; //given as percentage of total rectangle space

//any rectangles having area smaller than 40 pixels removed from
//text-filling algorithm
var AREA_CUTOFF = 40;

//use rectangle mods made in database
var USE_RECTANGLE_DATABASE = false;
var USE_GRID_CACHING = true;
var HORIZONTAL_SLICE_CAP = 6;
var CHAR_ASPECT_RATIO = .5;
var TEXT_SIZE_MULTIPLIER = 1.5;
var GRID_CACHE_OUTPUT = false;

var SEATTLE_OUTLINE_COLOR = "black";

//display various steps in text append process
var displayPolygons = false;
var displayRectangles = false;
var displayBounds = false;
var displayText = true;
var bestplaces;
var displayPaddedPolygons = false;

//these are for when we're in server
//
//var oReq = new XMLHttpRequest(); //New request object
//oReq.onload = function () {
//    bestplaces = JSON.parse(this.responseText);

var bestplaces = sample_bestplaces;
var neighborhood_bounds_output = {};

var svg = d3.select(".mapcontainer")
    .attr("id", "mapContainer")
    .append("svg")
    .attr("id", "mapSVG")
    .attr("height", height);
//.attr("width", parentWidth)

//create loader - spinny guy
var opts = {
    lines: 13 // The number of lines to draw
    , length: 28 // The length of each line
    , width: 14 // The line thickness
    , radius: 42 // The radius of the inner circle
    , scale: 1 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#000' // #rgb or #rrggbb or array of colors
    , opacity: 0.25 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
};

var loadingIndicator = new Spinner(opts);
loadingIndicator.spin(document.getElementById('mapContainer'));

var projection = d3.geo.mercator()
    .rotate(rotate)
    .scale(scale)
    .translate(offset)
    .precision(.5);

var path = d3.geo.path()
    .projection(projection);

var neighborhoodGroup = svg.append("g")
    .attr('id', 'neighborhoodGroup');

/*parses json, call back function selects all paths (none exist yet)
 and joins data (all neighborhoods) with each path. since there are no
 paths, all data points are waiting in 'update.enter'. calling
 'enter()' gives us these points, and appends a path for each of them,
 attributing a path and id to each.*/

var topoGeometries;

//var oReq = new XMLHttpRequest(); //New request object

//oReq.onload = theMeat
//
//function theMeat(response) {
//    //all that stuff
//    var bestplaces = JSON.parse(response.text);
//}

d3.json("json/neighborhoods.json", function (error, topology) {

    TextToSVG.load('./css/DIN-Condensed-Bold.ttf', function (err, textToSVG) {
        if (err) {
            console.log(err);
        } else {

            topoGeometries = topojson.object(topology, topology.objects.neighborhoods)
                .geometries;

            //generate paths around each neighborhood
            neighborhoodGroup.selectAll(".neighborhood")
                .data(topoGeometries)
                .enter()
                .append("g")
                .attr("neighborhoodBounds", path)
                .attr("class", "neighborhood")
                .append("path")
                .attr("d", path)
                .attr("class", "neighborhoodUnFocus")
                .attr("class", "neighborhoodOutline")
                .attr("id", function (d) {
                    return "n_" + d.id
                });

            // fill text
            neighborhoodGroup.selectAll(".neighborhood")
                .each(function (d) {
                    var pathCoords3d = NeighborhoodParser.get3dPathArray(
                        d3.select(this)
                            .attr("neighborhoodBounds"), d.type == "MultiPolygon");

                    console.log("saving " + d.properties.name + " to bounds array");
                    neighborhood_bounds_output[d.properties.name] =
                        d3.select(this).attr("neighborhoodBounds");

                    var subj = new Clipper.Paths();
                    var solution = new Clipper.Paths();

                    for (var poly = 0; poly < pathCoords3d.length; poly++) {

                        //var scale = 100;
                        var innerArray = [];

                        for (var p = 0; p < pathCoords3d[poly].length; p++) {
                            innerArray[innerArray.length] = {"X": pathCoords3d[poly][p][0], "Y": pathCoords3d[poly][p][1]};
                        }
                        //Clipper.JS.ScaleUpPaths(subj, scale);
                        subj[poly] = innerArray;
                    }

                    //subj[0] = [{"X":348,"Y":257},{"X":364,"Y":148},{"X":362,"Y":148},{"X":326,"Y":241},{"X":295,"Y":219},{"X":258,"Y":88},{"X":440,"Y":129},{"X":370,"Y":196},{"X":372,"Y":275}];
                    var co = new Clipper.ClipperOffset(2, 0.25);
                    co.AddPaths(subj, Clipper.JoinType.jtRound, Clipper.EndType.etClosedPolygon);
                    var offset_val = -4.0;
                    //if (d.properties.name == "Rainier Beach") {
                    //    offset_val = -2.0;
                    //}
                    co.Execute(solution, offset_val);

                    //Clipper.JS.ScaleDownPaths(subj, scale);
                    var innerpoints = [];

                    // divide phrase into number of polygons that result from
                    // the Clipper transform
                    var nameArray = bestplaces[d.properties.name].bestmatch.split(" ");
                    var nameNoSpaces = nameArray[0];
                    for (var i = 1; i < nameArray.length; i++) {
                        nameNoSpaces += nameArray[i];
                    }
                    var slicedNameArray = TextUtil.slicePhrase(solution.length, nameNoSpaces);
                    for (var poly = 0; poly < solution.length; poly++) {
                        var innerPointsList = "";
                        for (var innerPoint = 0; innerPoint < solution[poly].length; innerPoint++) {
                            if (!isNaN(solution[poly][innerPoint].X)) {
                                var curr = solution[poly][innerPoint];
                                innerPointsList += curr.X + "," + curr.Y + " ";
                            }
                        }
                        var pathCoords3d = NeighborhoodParser.pathArray(innerPointsList);

                        if (pathCoords3d != null) { //coordinates are enough to actually make a shape
                            //MapUtil.horizontalSliceAlg(d3.select(this), pathCoords3d, d, slicedNameArray[poly], padding, getGridCache(),
                            //    USE_GRID_CACHING, displayRectangles, displayBounds, displayText, TEXT_SIZE_MULTIPLIER,
                            //    font, HORIZONTAL_SLICE_CAP, CHAR_ASPECT_RATIO, textToSVG, TextToSVG, raphael);
                        }
                        if (GRID_CACHE_OUTPUT) {
                            console.log(JSON.stringify(getGridCache()) + "end");
                        }
                        innerpoints[poly] = innerPointsList;
                    }

                    //d3.select(this)
                    //    .attr("neighborhoodBounds", innerpoints[0])
                    //    .append("polygon")
                    //    .attr("points", innerpoints[0])
                    //    .attr("class", "innertest")
                    //    .attr("fill", function (d) {
                    //        return displayPaddedPolygons ? "pink" : "none";
                    //    });
                })
                .attr("phrase", function (d) {
                    return bestplaces[d.properties.name].bestmatch;
                })
                .attr("categories", function (d) {
                    return JSON.stringify(bestplaces[d.properties.name].categories);
                })
                .attr("price", function (d) {
                    return bestplaces[d.properties.name].price;
                })
                .attr("reviewcount", function (d) {
                    return bestplaces[d.properties.name].review_count;
                })
                .on("mouseover", MapUtil.setLegend)
                .on("mouseout", MapUtil.resetLegend);

            console.log("logging neighborhood bounds output");
            console.log(neighborhood_bounds_output);
        }
    });

});

    //stop spinner--we're done!
    loadingIndicator.stop();
//};
//oReq.open("get", "yelp/getyelp.php", true);
//oReq.send();

//window.onload = main;


