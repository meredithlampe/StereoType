/**
 * Created by meredith on 2/20/16.
 */

const TextToSVG = require('text-to-svg');


var width = 900;
var height = 600;
var rotate = [122, 0, 0];
var center = [0, 47.3097];
var scale  = 150000;
var offset = [1141.329833984375 - 263 + width / 2, 142582.609375 + 30];

//font to be used for text
var font = "Oswald";
//var font = "Impact";

var color1 = ['a', 'b', 'c', 'd', 'e', 'f'];
var color2 = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

//padding to be given between text and inscribed rectangle
var padding = 0.05; //given as percentage of total rectangle space

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
var TEXT_SIZE_MULTIPLIER = 1.2;
var GRID_CACHE_OUTPUT = false;
var TWEET_CACHE_OUTPUT = false;
var TWEETS_PER_QUERY = 100;

var SEATTLE_OUTLINE_COLOR = "black";


//display various steps in text append process
var displayPolygons = false;
var displayRectangles = true;
var displayOnlyCenterRectangle = false;
var displayBounds = true;
var displayText = true;
var processAll = false; //does another recursive round of polyogn generation

//debugger;

var bestplaces;
var oReq = new XMLHttpRequest(); //New request object
oReq.onload = function() {
    console.log(this.responseText);
    bestplaces = JSON.parse(this.responseText);

    //get width of parent
    var parentWidth = d3.select(".jumbotron").attr("width");

    var svg = d3.select(".jumbotron")
      .attr("id", "mapContainer")
        .append("svg")
        .attr("id", "mapSVG")
        .attr("width", parentWidth)
        .attr("height", height * 2);

    //create loader - spinny guy
    var loadingIndicator = Object.create(LoadingIndicator);
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

    d3.json("json/neighborhoods.json", function(error, topology) {

    topoGeometries = topojson.object(topology, topology.objects.neighborhoods)
        .geometries;

    //generate paths around each neighborhood
    neighborhoodGroup.selectAll("path")
            .data(topoGeometries)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "neighborhoodOutline")
            .attr("fill", function() {

                                 var colorA = color1[Math.floor(Math.random() * color1.length)];
                                 var colorB = color2[Math.floor(Math.random() * color2.length)];
                                 var pair = colorA + "" + colorB;
                                 var color = "#" + pair + pair + pair;
                                 return color;
                                 })
            .attr("id", function (d) {
                return "n_" + d.id
            });
//                .attr("fill", function() {
//                    var letters = '0123456789ABCDEF'.split('');
//                    var color = '#';
//                    for (var i = 0; i < 6; i++ ) {
//                        color += letters[Math.floor(Math.random() * 16)];
//                    }
//                    return color;
//                });

    //generate inner paths to append text to
    neighborhoodGroup.selectAll(".neighborhoodInnerPath")
        .data(topoGeometries)
        .enter()
        .append("path")
        .attr("neighborhoodBounds", path)
        .attr("class", "neighborhoodInnerPath")
        .attr("id", function (d) {
            return "inner_" + d.id;
        })
        .attr("d", function (d) {

            //get current neighborhood shape - 3d list of coords
            var pathCoords3d = NeighborhoodParser.get3dPathArray(this, d.type == "MultiPolygon");

            if (pathCoords3d != null) { //coordinates are enough to actually make a shape
                console.log("about to run slice alg for neighborhood: " + d.properties.name);
                horizontalSliceAlg(svg, pathCoords3d, d, bestplaces[d.properties.name], padding, gridCache);
            }
            //stop spinner--we're done!
            loadingIndicator.stop();
            if (GRID_CACHE_OUTPUT) {
                console.log(JSON.stringify(gridCache) + "end");
            }
                return null;
            });


    });

};
oReq.open("get", "yelp/getyelp.php", true);
oReq.send();

//slice neighborhood horizontally, then vertically
//according to length of phrase to get grid over neighborhood.
//Use inscribed rectangles to fill each grid slot with a letter
function horizontalSliceAlg(svg, pathCoords3d, d, phrase, padding, gridCache) {

    console.log("rendering neighborhodd: " + d.properties.name);
    if (d.properties.name == "Mount Baker") { return; }

    //get height and width of polygon
    //don't use padding this time (padding = 0)
    var dimensions = NeighborhoodParser.getNeighborhoodDimensions(pathCoords3d, 0);
    var heightOfPoly = dimensions.max - dimensions.min;
    var widthOfPoly = dimensions.right - dimensions.left;

    //here our aspect ratio will always be height over width
    //var roughAspectRatio = Math.max(heightOfPoly, widthOfPoly) / Math.min(heightOfPoly, widthOfPoly);
    //var roughNumLevels = TextUtil.calculateNumLevels(roughAspectRatio, d.properties.name, 0, false);

    var optimalHorizontalSlices;
    if (USE_GRID_CACHING && gridCache[d.properties.name] != null &&
        gridCache[d.properties.name][phrase.length] != null) {
        optimalHorizontalSlices = gridCache[d.properties.name][phrase.length];
    } else { //cache optimal slices..only used to use output and save
        optimalHorizontalSlices = NeighborhoodParser.testGrid(pathCoords3d, dimensions, d, svg, phrase, padding);
        if (gridCache[d.properties.name] == null ) {
            gridCache[d.properties.name] = {};
        }
        gridCache[d.properties.name][phrase.length] = optimalHorizontalSlices;
    }

    var gridUnits = NeighborhoodParser.createGrid(pathCoords3d, dimensions, optimalHorizontalSlices, d, svg,
        phrase, padding);

    if (displayText) {
        for (var i = 0; i < gridUnits.length; i++) {
            var character = phrase.charAt(i);
            TextUtil.appendCharacterIntoRectangle(character, gridUnits[i], svg, d, i, padding,
                displayText, displayBounds, TEXT_SIZE_MULTIPLIER, font);
        }
    }

    console.log(gridCache);

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

