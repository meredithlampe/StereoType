/**
 * Created by meredith on 4/11/17.
 */
/**
 * Created by meredith on 2/20/16.
 */

require("./js/NeighborhoodGeolocation.js");
require("./js/TextUtil.js");
//const Clipper = require("./Javascript_Clipper_6.2.1.2/clipper.js");
//const raphael = require('raphael');
var MapUtil = require("./js/MapUtil.js");
//require("./js/SampleBestPlaces");
//require("./js/GridCache.js");
const Spinner = require("./spinner/spin.min.js");
const TextToSVG = require('text-to-svg');
//const d3plus = require('d3plus');
const d3 = require('d3');

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

var projection = d3.geoMercator()
    .rotate(rotate)
    .scale(scale)
    .translate(offset)
    .precision(.5);

var path = d3.geoPath()
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
    d3.json("../build_map/json/neighborhoodChars.json", function (error, chars) {
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
                        // get chars for neighborhood from file
                        var chars_for_neighborhood = chars.result[d.properties.name];
                        for (var poly = 0; poly < chars_for_neighborhood.length; poly++) {
                            for (var i = 0; i < chars_for_neighborhood[poly].length; i++) {
                                d3.select(this).append("path")
                                    .attr("d", chars_for_neighborhood[poly][i]);
                            }
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
            }
        });
    });

});

//stop spinner--we're done!
loadingIndicator.stop();
//};
//oReq.open("get", "yelp/getyelp.php", true);
//oReq.send();

//window.onload = main;


