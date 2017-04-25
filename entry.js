/**
 * Created by meredith on 4/11/17.
 */
/**
 * Created by meredith on 2/20/16.
 */

const TextToSVG = require('text-to-svg');
var scaleSVG = require("scale-svg-path");
var parseSVG = require('parse-svg-path');
var serializeSVG = require('serialize-svg-path');

require("./js/NeighborhoodGeolocation.js");
//require("./js/GridCache.js");
const Spinner = require("./spinner/spin.min.js");

import { getGridCache as getGridCache } from './js/GridCache.js';

//function main() {
    var width = 900;
    var height = 600;
    var rotate = [122, 0, 0];
    var center = [0, 47.3097];
    var scale = 150000;
    var offset = [1141.329833984375 - 263 + width / 2, 142582.609375 + 30];

//font to be used for text
    var font = "Oswald";
//var font = "Impact";

    var color1 = ['a', 'b', 'c', 'd', 'e', 'f'];
    var color2 = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

//padding to be given between text and inscribed rectangle
    var padding = 0.1; //given as percentage of total rectangle space

//keep track of area of each polygon already processed
    var topPolyBounds = {};
    var rightPolyBounds = {};
    var bottomPolyBounds = {};
    var leftPolyBounds = {};

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
    var TWEET_CACHE_OUTPUT = false;
    var TWEETS_PER_QUERY = 100;

    var SEATTLE_OUTLINE_COLOR = "black";


//display various steps in text append process
    var displayPolygons = false;
    var displayRectangles = false;
    var displayOnlyCenterRectangle = false;
    var displayBounds = false;
    var displayText = true;
    var bestplaces;

    //these are for when we're in server

    var oReq = new XMLHttpRequest(); //New request object
    oReq.onload = function () {
        bestplaces = JSON.parse(this.responseText);

//get width of parent
//        var parentWidth = d3.select(".mapcontainer").attr("width");

        var svg = d3.select(".mapcontainer")
            .attr("id", "mapContainer")
            .append("svg")
            .attr("id", "mapSVG")
            .attr("height", height * 2);
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

            topoGeometries = topojson.object(topology, topology.objects.neighborhoods)
                .geometries;



            //generate paths around each neighborhood
            neighborhoodGroup.selectAll(".neighborhood")
                .data(topoGeometries)
                .enter()
                .append("g")
                .attr("neighborhoodBounds", path)
                .attr("opacity", ".5")
                .attr("class", "neighborhood")
                .append("path")
                .attr("d", path)
                .attr("class", "neighborhoodOutline")
                .attr("fill", function () {

                    var colorA = color1[Math.floor(Math.random() * color1.length)];
                    var colorB = color2[Math.floor(Math.random() * color2.length)];
                    var pair = colorA + "" + colorB;
                    var color = "#" + pair + pair + pair;
                    return color;
                })
                .attr("id", function (d) {
                    return "n_" + d.id
                });

           //generate inner paths to append text to
            neighborhoodGroup.selectAll(".neighborhood")
                .append("path")
                .attr("neighborhoodBounds", path)
                .attr("class", "neighborhoodInnerPath")
                .attr("id", function (d) {
                    return "inner_" + d.id;
                })
                .attr("d", function (d) {
                    return this.getAttribute("neighborhoodBounds");
                });

            neighborhoodGroup.selectAll(".neighborhood")
                .each(function(d) {
                    var pathCoords3d = NeighborhoodParser.get3dPathArray(
                        d3.select(this).select(".neighborhoodInnerPath").attr("neighborhoodBounds"),
                        d.type == "MultiPolygon");
                    // make polygon
                    var pointslist = "";
                    for (var point = 0; point < pathCoords3d[0].length; point++) {
                        var curr = pathCoords3d[0][point];
                        pointslist += curr[0] + "," + curr[1] + " ";
                    }
                    d3.select(this)
                        .append("polygon")
                        .attr("points", pointslist)
                        .attr("fill", "none");
                })
                .attr("phrase", function(d){ return bestplaces[d.properties.name].bestmatch; })
                .attr("categories", function(d) {return JSON.stringify(bestplaces[d.properties.name].categories); })
                .attr("price", function(d) { return bestplaces[d.properties.name].price; })
                .attr("reviewcount", function(d) { return bestplaces[d.properties.name].review_count; })
                .on("mouseover", setLegend)
                .on("mouseout", resetLegend);
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
                    // scale path
                    //var polyString = this.getAttribute("neighborhoodBounds");
                    //console.log("before scaling: " + polyString);
                    //var pathParsed = parseSVG(polyString);
                    //console.log(pathParsed);
                    //var polyScaled = scaleSVG(pathParsed, 1 - padding);
                    //console.log(polyScaled);
                    //console.log("after scaling: " + serializeSVG(polyScaled));
                    var neighborhoodBoundsString = this.getAttribute("neighborhoodBounds");
                    var pathCoords3d = NeighborhoodParser.get3dPathArray(neighborhoodBoundsString, d.type == "MultiPolygon");

                    if (pathCoords3d != null) { //coordinates are enough to actually make a shape
                        console.log("about to run slice alg for neighborhood: " + d.properties.name);
                        var nameArray = bestplaces[d.properties.name].bestmatch.split(" ");
                        var nameNoSpaces = nameArray[0];
                        for (var i = 1; i < nameArray.length; i++) {
                            nameNoSpaces += nameArray[i];
                        }
                        horizontalSliceAlg(d3.select(this), pathCoords3d, d, nameNoSpaces, padding, getGridCache(),
                            USE_GRID_CACHING, displayRectangles, displayBounds, displayText, TEXT_SIZE_MULTIPLIER,
                            font, HORIZONTAL_SLICE_CAP);
                    }
                    if (GRID_CACHE_OUTPUT) {
                        console.log(JSON.stringify(getGridCache()) + "end");
                    }
                    //} else {
                    //    return null;
                    //}

                    //return serializeSVG(polyScaled);
                });


        });

        //stop spinner--we're done!
        loadingIndicator.stop();

    };

    oReq.open("get", "yelp/getyelp.php", true);
    oReq.send();
//};

//window.onload = main;

function setLegend(d, i) {
    var poly = d3.select(this);

   // weird scrolling thing -- gotta save scroll top
    var oldScrollTop = document.body.scrollTop;

    // set name
    var name = d3.select("#neighborhoodname");
    name.html(d.properties.name);

    // set phrase
    var phraseBox = d3.select("#neighborhoodphrase");
    var phrase = poly.attr("phrase");
    phraseBox.html(phrase);

    // set type
    var categories = JSON.parse(poly.attr("categories"));
    var categoryBox = d3.select("#neighborhoodcategories");
    categoryBox.html("");
    for (var i = 0; i < categories.length; i++) {
        categoryBox.append("h3").html(categories[i].title);
    }

    // set price range
    d3.select("#neighborhoodprice").html(poly.attr("price"));

    // set number of ratings
    d3.select("#neighborhoodreviewcount").html(poly.attr("reviewcount"));

    // change opacity
    var neighborhood = d3.select(this);
    neighborhood.attr("opacity", "1.0");

    // set scrolling top so that we don't scroll
    document.body.scrollTop = oldScrollTop;
}

function resetLegend(d, i) {

    // weird scrolling thing -- gotta save scroll top
    var oldScrollTop = document.body.scrollTop;
     var name = d3.select("#neighborhoodname");
    name.html("...");

    var phraseBox = d3.select("#neighborhoodphrase");
    phraseBox.html("...");

    // set categories
    d3.select("#neighborhoodcategories").html("...");

    // set price range
    d3.select("#neighborhoodprice").html("...");

    // set number of ratings
    d3.select("#neighborhoodreviewcount").html("...");

    var neighborhood = d3.select(this);
    neighborhood.attr("opacity", ".5");

    // set scrolling top so that we don't scroll
    document.body.scrollTop = oldScrollTop;
}

//slice neighborhood horizontally, then vertically
//according to length of phrase to get grid over neighborhood.
//Use inscribed rectangles to fill each grid slot with a letter
function horizontalSliceAlg(svg, pathCoords3d, d, phrase, padding, gridCache,
                            USE_GRID_CACHING, displayRectangles, displayBounds,
                            displayText, TEXT_SIZE_MULTIPLIER, font, HORIZONTAL_SLICE_CAP,
                            CHAR_ASPECT_RATIO) {

    console.log("rendering neighborhodd: " + d.properties.name);
    if (d.properties.name == "Mount Baker") {
        return;
    }

    //get height and width of polygon
    //don't use padding this time (padding = 0)
    var dimensions = NeighborhoodParser.getNeighborhoodDimensions(pathCoords3d, 0);
    var heightOfPoly = dimensions.max - dimensions.min;
    var widthOfPoly = dimensions.right - dimensions.left;

    var optimalHorizontalSlices;
    if (USE_GRID_CACHING && gridCache[d.properties.name] != null &&
        gridCache[d.properties.name][phrase.length] != null) {
        optimalHorizontalSlices = gridCache[d.properties.name][phrase.length];
    } else { //cache optimal slices..only used to use output and save
        optimalHorizontalSlices = NeighborhoodParser.testGrid(pathCoords3d, dimensions, d, svg,
            phrase, padding, HORIZONTAL_SLICE_CAP, CHAR_ASPECT_RATIO, TEXT_SIZE_MULTIPLIER, font, TextToSVG);
        if (gridCache[d.properties.name] == null) {
            gridCache[d.properties.name] = {};
        }
        gridCache[d.properties.name][phrase.length] = optimalHorizontalSlices;
    }

    var gridUnits = NeighborhoodParser.createGrid(pathCoords3d, dimensions, optimalHorizontalSlices, d, svg,
        phrase, padding, displayRectangles, displayBounds);

    if (displayText) {
        for (var i = 0; i < gridUnits.length; i++) {
            var character = phrase.charAt(i);
            TextUtil.appendCharacterAsSVG(character, gridUnits[i], svg, d, i, padding, displayText, displayBounds,
                TEXT_SIZE_MULTIPLIER, font, TextToSVG);
        }
    }
}

function appendSingleLetter(rectangle, letter, d) {

    var textPath;
    var rectWidth;
    var rectHeight;

    if (rectangle.rect[0].angle == 0) { //longer side of rectangle is aligned with x axis

        //use top of rectangle for bottom of path (letter falls on its right side)
        textPath = "M" + rectangle.corners.leftX + "," + rectangle.corners.topY
            + "L" + rectangle.corners.leftX + "," + rectangle.corners.lowY;

    } else if (rectangle.rect[0].angle == 90 || rectangle.rect[0].angle == 270) {
        //find new y
        //var yWithPadding = rectangle.corners.lowY - padding;
        var y = rectangle.corners.lowY;

        //use bottom of rectangle for bottom of path
        textPath = "M" + rectangle.corners.leftX + "," + y
            + "L" + rectangle.corners.rightX + "," + y;

    }

    rectWidth = rectangle.rect[0].height;
    rectHeight = rectangle.rect[0].width;

    var textSize = 1;

    var phantomSvg = d3.select("body").append("svg");
    var text = svg.append("text")
        .text(letter)
        .attr("font-size", textSize + "pt");
    var bbox = text.node().getBBox();

    var widthTransform = bbox.width;
    var heightTransform = bbox.height;

    var eBrake = true;

    while (widthTransform < rectWidth && heightTransform < rectHeight && eBrake) {

        textSize += 0.5;

        text = phantomSvg.append("text")
            .text(letter)
            .attr("font-size", textSize + "pt");

        //var textNode = document.getElementById("t1");
        bbox = text.node().getBBox();
        widthTransform = bbox.width;
        heightTransform = bbox.height;

        if (textSize > 50) {
            eBrake = false;
        }
    }
    //
    //var rectangle = svg.append("rect")
    //    .attr("x", upperLeftCornerX)
    //    .attr("y", upperLeftCornerY)
    //    .attr("width", widthTransform)
    //    .attr("height", heightTransform)
    //    .attr("fill", "red")
    //    .attr("id", "bounding_text_rect_" + d.id);


    //find appropriate letter size based on area of horizontal distance
    //letterSize = Math.min(rectangle.corners.lowY - rectangle.corners.topY, rectangle.corners.rightX - rectangle.corners.leftX);

    svg.append("path")
        .attr("id", rectangle.id + "_letter_path")
        .attr("d", textPath)
        .style("fill", "none");
    //.style('stroke', "red");

    svg.append("text")
        .append("textPath")
        .attr("xlink:href", "#" + rectangle.id + "_letter_path")
        .style("text-anchor", "middle")
        .text(letter)
        .attr("font-size", (textSize * 1.2) + "pt")
        .attr("startOffset", "50%")
        .attr("font-family", font);
}

