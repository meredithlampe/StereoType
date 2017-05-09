/**
 * Created by meredith on 4/11/17.
 */
/**
 * Created by meredith on 2/20/16.
 */

var scaleSVG = require("scale-svg-path");
var parseSVG = require('parse-svg-path');
var serializeSVG = require('serialize-svg-path');
var Offset = require('polygon-offset');

require("./js/NeighborhoodGeolocation.js");
const Clipper = require("./Javascript_Clipper_6.2.1.2/clipper.js");
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
var offset = [1141.329833984375 - 400 + width / 2, 142582.609375 + 30];
//var offset = 0;

//font to be used for text
var font = "Oswald";
//var font = "Impact";

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

d3.json("json/neighborhoods.json", function (error, topology) {

    TextToSVG.load('./fonts/Oswald-Bold.ttf', function (err, textToSVG) {
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

                    var pointslist = "";
                    for (var point = 0; point < pathCoords3d[0].length; point++) {
                        var curr = pathCoords3d[0][point];
                        pointslist += curr[0] + "," + curr[1] + " ";
                    }
                    d3.select(this)
                        .append("polygon")
                        .attr("points", pointslist)
                        .attr("fill", "none");

                    var subj = new Clipper.Paths();
                    var solution = new Clipper.Paths();
                    var scale = 100;
                    var innerArray = [];

                    Clipper.JS.ScaleUpPaths(subj, scale);
                    for (var p = 0; p < pathCoords3d[0].length; p++) {
                        innerArray[innerArray.length] = {"X": pathCoords3d[0][p][0], "Y": pathCoords3d[0][p][1]};
                    }
                    subj[0] = innerArray;
                    //subj[0] = [{"X":348,"Y":257},{"X":364,"Y":148},{"X":362,"Y":148},{"X":326,"Y":241},{"X":295,"Y":219},{"X":258,"Y":88},{"X":440,"Y":129},{"X":370,"Y":196},{"X":372,"Y":275}];
                    var co = new Clipper.ClipperOffset(2, 0.25);
                    co.AddPaths(subj, Clipper.JoinType.jtRound, Clipper.EndType.etClosedPolygon);
                    co.Execute(solution, -4.0);
                    Clipper.JS.ScaleDownPaths(subj, scale);
                    for (var poly = 0; poly < solution.length; poly++) {
                        var innerPointsList = "";
                        for (var innerPoint = 0; innerPoint < solution[poly].length; innerPoint++) {
                            if (!isNaN(solution[poly][innerPoint].X)) {
                                var curr = solution[poly][innerPoint];
                                innerPointsList += curr.X + "," + curr.Y + " ";
                            }
                        }
                        d3.select(this)
                            .attr("neighborhoodBounds", innerPointsList)
                            .append("polygon")
                            .attr("points", innerPointsList)
                            .attr("class", "innertest")
                            .attr("fill", function (d) {
                                return displayPaddedPolygons ? "pink" : "none";
                            });
                    }
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
            //.attr("transform-origin", function(d) {
            //    // get center of polygon
            //    var pathString = this.getAttribute("neighborhoodBounds");
            //    var pathArray = TextUtil.pathToArray(pathString);
            //
            //    var aabb = PolyK.GetAABB(pathArray);
            //    var xcenter = aabb.x + (aabb.width * 1.0 / 2);
            //    var ycenter = aabb.y + (aabb.height * 1.0 / 2);
            //    return xcenter + " " + ycenter;
            //})
            //.attr("transform", "scale(" + (1 - padding) + ", " + (1 - padding) + ")");

            neighborhoodGroup.selectAll(".neighborhood")
                .each(function (d) {
                    debugger;
                    var neighborhoodBoundsString = this.getAttribute("neighborhoodBounds");
                    var pathCoords3d = NeighborhoodParser.get3dPathArray(neighborhoodBoundsString, d.type == "MultiPolygon");

                    if (pathCoords3d != null) { //coordinates are enough to actually make a shape
                        var nameArray = bestplaces[d.properties.name].bestmatch.split(" ");
                        var nameNoSpaces = nameArray[0];
                        for (var i = 1; i < nameArray.length; i++) {
                            nameNoSpaces += nameArray[i];
                        }
                        MapUtil.horizontalSliceAlg(d3.select(this), pathCoords3d, d, nameNoSpaces, padding, getGridCache(),
                            USE_GRID_CACHING, displayRectangles, displayBounds, displayText, TEXT_SIZE_MULTIPLIER,
                            font, HORIZONTAL_SLICE_CAP, CHAR_ASPECT_RATIO, textToSVG, TextToSVG);
                    }
                    if (GRID_CACHE_OUTPUT) {
                        console.log(JSON.stringify(getGridCache()) + "end");
                    }
                    //} else {
                    //    return null;
                    //}

                    //return serializeSVG(polyScaled);
                });
        }

        //stop spinner--we're done!
        loadingIndicator.stop();
    });
});


//};
//
//oReq.open("get", "yelp/getyelp.php", true);
//oReq.send();
//};

//window.onload = main;


