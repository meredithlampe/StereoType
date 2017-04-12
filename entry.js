/**
 * Created by meredith on 4/11/17.
 */
/**
 * Created by meredith on 2/20/16.
 */

const TextToSVG = require('text-to-svg');
require("./js/NeighborhoodGeolocation.js");
import { getGridCache as getGridCache } from './js/GridCache.js';

function main() {
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
var TEXT_SIZE_MULTIPLIER = 1;
var GRID_CACHE_OUTPUT = false;
var TWEET_CACHE_OUTPUT = false;
var TWEETS_PER_QUERY = 100;

var SEATTLE_OUTLINE_COLOR = "black";


//display various steps in text append process
var displayPolygons = true;
var displayRectangles = false;
var displayOnlyCenterRectangle = false;
var displayBounds = true;
var displayText = true;
var processAll = false; //does another recursive round of polyogn generation

//debugger;

var bestplaces;

// these are for when we're in server
//var oReq = new XMLHttpRequest(); //New request object
//oReq.onload = function() {
//    bestplaces = JSON.parse(this.responseText);
//    console.log(bestplaces);

bestplaces = {
    "University District": "Morsel",
    "North Beach": "Golden Gardens Park",
    "Broadview": "Carkeek Park",
    "View Ridge": "Seattle Select Moving",
    "Haller Lake": "The Bridge Coffee House",
    "Olympic Hills": "Man'oushe Express",
    "Cedar Park": "Jebena Cafe",
    "Northgate": "Gyro Hut",
    "Blue Ridge": "Carkeek Park",
    "Maple Leaf": "Cloud City Coffee",
    "Matthews Beach": "Burke-Gilman Trail",
    "Sand Point": "Warren G Magnuson Park - Off Leash Area",
    "Windermere": "Pagliacci Pizza",
    "Pinehurst": "Chaiyo Thai Cuisine",
    "Wedgwood": "Van Gogh Coffeehouse",
    "Wallingford": "Harvest Beat",
    "Fremont": "Paseo Caribbean Food - Fremont",
    "Laurelhurst": "Jak's Grill",
    "Hawthorne Hills": "Center For Spiritual Living",
    "Magnolia": "Discovery Park",
    "Queen Anne": "Storyville Coffee Company",
    "Lower Queen Anne": "Kerry Park",
    "Westlake": "Canlis",
    "Interbay": "Windy City Pie",
    "Eastlake": "Pomodoro",
    "Portage Bay": "Little Lago",
    "Beacon Hill": "Cafetal Quilombo",
    "Georgetown": "Calozzi's Cheesesteaks",
    "Belltown": "Some Random Bar",
    "West Seattle": "The Beer Junction",
    "Seward Park": "Seward Park Audubon Center",
    "Alki": "Alki Beach Park",
    "Fauntleroy": "Lincoln Park",
    "South Park": "Phorale",
    "Arbor Heights": "Alki Sewer",
    "Highland Park": "Wanna Teriyaki & Burger",
    "Columbia City": "La Teranga",
    "South Delridge": "Fresh Flours",
    "High Point": "Tug Inn",
    "Mount Baker": "Tacos El Asadero",
    "Industrial District": "Schooner Exact Brewing Company",
    "Madison Valley": "The Harvest Vine",
    "Madison Park": "Cactus Restaurants",
    "Denny-Blaine": "Viretta Park",
    "Downtown": "Monorail Espresso",
    "Whittier Heights": "Un Bien",
    "Broadmoor": "Washington Park Arboretum",
    "Brighton": "Othello Wok and Teriyaki",
    "Sunset Hill": "Geo's Cuban & Creole Cafe",
    "Rainier Beach": "Redwing Cafe",
    "South Lake Union": "I Love My GFF",
    "Capitol Hill": "Ada's Technical Books and Cafe",
    "First Hill": "George's Sausage & Delicatessen",
    "Meadowbrook": "Tubs Gourmet Subs",
    "Admiral": "Freshy's",
    "North College Park": "Tropicos Breeze",
    "Atlantic": "Wood Shop BBQ",
    "Loyal Heights": "Un Bien",
    "Central District": "Jackson's Catfish Corner",
    "International District": "goPok\u00e9",
    "Roosevelt": "Rain City Burgers",
    "Pioneer Square": "Il Corvo Pasta",
    "Ballard": "Caf\u00e9 Besalu",
    "Roxhill": "The Westy",
    "North Delridge": "Pearls Tea & Cafe",
    "Greenwood": "Valhalla Sandwiches",
    "Leschi": "Meet the Moon",
    "Riverview": "Portside Coffee Company",
    "Montlake": "Fuel",
    "Green Lake": "Green Lake Park",
    "Ravenna": "Ventoux Roasters",
    "Crown Hill": "Wild Mountain Cafe",
    "Madrona": "Bottlehouse",
    "Bitter Lake": "Forno Pizza",
    "Olympic Manor": "Taki's Mad Greek",
    "Victory Heights": "Hydra Clean Northwest",
    "Phinney Ridge": "The Dray",
    "Bryant": "Seattle Sunshine Coffee"
};
console.log(bestplaces);

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

d3.json("json/neighborhoods.json", function (error, topology) {

    topoGeometries = topojson.object(topology, topology.objects.neighborhoods)
        .geometries;

    //generate paths around each neighborhood
    neighborhoodGroup.selectAll("path")
        .data(topoGeometries)
        .enter()
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

            //if (d.properties.name == "University District") {
                //get current neighborhood shape - 3d list of coords
                var pathCoords3d = NeighborhoodParser.get3dPathArray(this, d.type == "MultiPolygon");

                if (pathCoords3d != null) { //coordinates are enough to actually make a shape
                    console.log("about to run slice alg for neighborhood: " + d.properties.name);
                    horizontalSliceAlg(svg, pathCoords3d, d, bestplaces[d.properties.name], padding, getGridCache(),
                        USE_GRID_CACHING, displayRectangles, displayBounds, displayText, TEXT_SIZE_MULTIPLIER, font);
                }
                //stop spinner--we're done!
                loadingIndicator.stop();
                if (GRID_CACHE_OUTPUT) {
                    //console.log(JSON.stringify(getGridCache()) + "end");
                }
                return null;
            //} else {
            //    return null;
            //}
        });


});
};

window.onload = main;

//};
//oReq.open("get", "yelp/getyelp.php", true);
//oReq.send();

//slice neighborhood horizontally, then vertically
//according to length of phrase to get grid over neighborhood.
//Use inscribed rectangles to fill each grid slot with a letter
function horizontalSliceAlg(svg, pathCoords3d, d, phrase, padding, gridCache,
                            USE_GRID_CACHING, displayRectangles, displayBounds,
                            displayText, TEXT_SIZE_MULTIPLIER, font) {

    console.log("rendering neighborhodd: " + d.properties.name);
    if (d.properties.name == "Mount Baker") { return; }

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
        optimalHorizontalSlices = NeighborhoodParser.testGrid(pathCoords3d, dimensions, d, svg, phrase, padding);
        if (gridCache[d.properties.name] == null ) {
            gridCache[d.properties.name] = {};
        }
        gridCache[d.properties.name][phrase.length] = optimalHorizontalSlices;
    }

    var gridUnits = NeighborhoodParser.createGrid(pathCoords3d, dimensions, optimalHorizontalSlices, d, svg,
        phrase, padding, displayRectangles, displayBounds);

    if (displayText) {
        for (var i = 0; i < gridUnits.length; i++) {
            var character = phrase.charAt(i);
            TextUtil.appendCharacterIntoRectangle(character, gridUnits[i], svg, d, i,
                padding, displayText, displayBounds, TEXT_SIZE_MULTIPLIER, font, TextToSVG, pathCoords3d);
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

