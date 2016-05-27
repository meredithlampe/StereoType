/**
 * Created by meredith on 2/20/16.
 */




var width = 900;
var height = 600;
var rotate = [122, 0, 0];
var center = [0, 47.3097];
var scale  = 150000;
var offset = [1141.329833984375 - 263 + width / 2, 142582.609375 + 30];

//font to be used for text
var font = "Oswald";
//var font = "Impact";

//padding to be given between text and inscribed rectangle
var padding = "2";

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

//display various steps in text append process
var displayPolygons = true;
var displayRectangles = false;
var displayOnlyCenterRectangle = false;
var displayBounds = false;
var displayText = false;
var processAll = false; //does another recursive round of polyogn generation

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

                    //get current neighborhood shape
                    var pathCoords2d = NeighborhoodParser.get2dPathArray(this);

                    //find largest rectangle in polygon
                    if (pathCoords2d.length > 2) { //coordinates are enough to actually make a shape

                        //eliminate spaces from phrase
                        var nameWithoutSpaces = d.properties.name.replace(" ", "");
                        //var text = nameWithoutSpaces + nameWithoutSpaces;
                        //var text = nameWithoutSpaces;
                        //var text = nameWithoutSpaces;
                        var text = nameWithoutSpaces + nameWithoutSpaces + nameWithoutSpaces;

                        var rectanglesForText;
                        //var neighborhood = inscribedRectangleAlg(pathCoords2d, d);
                        var neighborhood = horizontalSliceAlg(svg, pathCoords2d, d);

                        //Necessary for inscribedRectAlg
                        //rectanglesForText = neighborhood.rectangles;

                        //generate next level of polygons

                        if (processAll) {
                            processMiniPolygons(neighborhood, rectanglesForText);
                        }

                        //TextUtil.fillNeighborhoodText(neighborhood.rectangles, d.properties.name.substring(0, Math.round(lengthWord *.75)), d, displayBounds, displayText);

                        //LATEST VERSION OF INSCRIBED RECTANGLE TEXT POPULATION
                        //TextUtil.fillNeighborhoodText(rectanglesForText, text, d, displayBounds, displayText, rectDatabase);
                    }
                //stop spinner--we're done!
                loadingIndicator.stop();
                return null;
            });

});

function processMiniPolygons(neighborhood, rectanglesForText) {
    //generate mini polygons in top segment
    if (neighborhood.polygons[0] != null && neighborhood.rectangles[0] != null &&
        neighborhood.rectangles[0].rect != null) {
        var topRectCoords = RectangleGenerator.findRectangleCorners(neighborhood.rectangles[0].rect);
        var topNeighborhood = PolygonGenerator.generateSidePolygons(topRectCoords, displayPolygons, displayRectangles, neighborhood.polygons[0], d, neighborhood.rectangles[0],
            true, "mini");
    }

    if (neighborhood.polygons[1] != null && neighborhood.rectangles[1] != null &&
        neighborhood.rectangles[1].rect != null) {
        var leftRectCoords = RectangleGenerator.findRectangleCorners(neighborhood.rectangles[1].rect);
        var leftNeighborhood = PolygonGenerator.generateSidePolygons(leftRectCoords, displayPolygons, displayRectangles, neighborhood.polygons[1], d, neighborhood.rectangles[1],
            true, "mini");
    }

    //skipping center rectangle

    if (neighborhood.polygons[3] != null && neighborhood.rectangles[3] != null &&
        neighborhood.rectangles[3].rect != null) {
        var rightRectCoords = RectangleGenerator.findRectangleCorners(neighborhood.rectangles[3].rect);
        var rightNeighborhood = PolygonGenerator.generateSidePolygons(rightRectCoords, displayPolygons, displayRectangles, neighborhood.polygons[3], d, neighborhood.rectangles[3],
            true, "mini");
    }
    //
    //if (neighborhood.polygons[4] != null && neighborhood.rectangles[4] != null) {
    //    var bottomRectCoords = RectangleGenerator.findRectangleCorners(neighborhood.rectangles[4].rect);
    //    var bottomNeighborhood = PolygonGenerator.generateSidePolygons(bottomRectCoords, displayPolygons, displayRectangles, neighborhood.polygons[4], d, neighborhood.rectangles[4],
    //        true, "mini");
    //}

    //if (rightPoly != null) {
    //    var rightNeighborPolygon = PolygonGenerator.generateNeighborhoodPoly(rightPoly);
    //    var rightRectCoords = RectangleGenerator.findRectangleCorners(rightRectangle);
    //    var miniRightPoly = PolygonGenerator.generateRightPolygon(d, rightRectCoords.topY, rightRectCoords.lowY, rightRectCoords.leftX, rightRectCoords.rightX,
    //        rightPoly, rightNeighborPolygon, displayPolygons, "mini");
    //    if (miniRightPoly != null) {
    //        var miniRightRect = generateInscribedRectangle(miniRightPoly, d, displayRectangles, "right_mini")
    //    }
    //
    //}
}

function appendRectangle(rectangle, displayFlag, d, location) {
    if (rectangle != null && displayFlag) {
        svg.append("rect")
            .attr("width", rectangle[0].width)
            .attr("height", rectangle[0].height)
            .attr("x", rectangle[0].cx - (rectangle[0].width / 2))
            .attr("y", rectangle[0].cy - (rectangle[0].height / 2))
            .attr("transform", "rotate(" + rectangle[0].angle + "," + rectangle[0].cx + "," + rectangle[0].cy + ")")
            .attr("id", function() {
                return "rect_" + d.id + "_" + location;
            })
            .attr("fill", "#white")
            .attr("opacity", "0.5");
    }
}

//slice neighborhood horizontally, then vertically
//according to length of phrase to get grid over neighborhood.
//Use inscribed rectangles to fill each grid slot with a letter
function horizontalSliceAlg(svg, pathCoords2d, d) {

    //get height and width of polygon
    var dimensions = NeighborhoodParser.getNeighborhoodDimensions(pathCoords2d);
    var heightOfPoly = dimensions.max - dimensions.min;
    var widthOfPoly = dimensions.right - dimensions.left;

    //here our aspect ratio will always be height over width
    var roughAspectRatio = Math.max(heightOfPoly, widthOfPoly) / Math.min(heightOfPoly, widthOfPoly);
    var roughNumLevels = TextUtil.calculateNumLevels(roughAspectRatio, d.properties.name, 0, false);

    var phrasePieces = TextUtil.slicePhrase(roughNumLevels, d.properties.name);

    if (roughNumLevels != phrasePieces.length) {
        console.log("ERROR: phrase splitting for neighborhood: " + d.properties.name);
    }
    debugger;
    //get horizontal slices that are viable
    var slices = NeighborhoodParser.divide(pathCoords2d, roughNumLevels, dimensions, svg, d);
    //console.log(slices);
    if (slices != null) {

        if (d.id == 66) {
            debugger;
        }

        //loop through the slices
        for (var i = 0; i < slices.length; i++) {

            //get color for this slice
            var color = DebugTool.colors[i];
            var currSlice = slices[i];
            //loop through variables within a slice
            //paint entire slice the same color
            for (var j = 0; j < slices[i].length; j++) {
                
                neighborhoodGroup.append("path")
                    .attr("d", function() {
                        var twoDPath = NeighborhoodParser.oneDToTwoD(currSlice[j]);
                        console.log("twoDPath: " + twoDPath);
                        var pathString = NeighborhoodParser.arrayToPath(twoDPath);
                        console.log(pathString);
                        return pathString;
                    })
                    .attr("fill", color);
            }
        }

    } else {
        console.log("slices null for neighborhood: " + d.properties.name);
    }



}

function inscribedRectangleAlg(pathCoords2d, d) {
    var centerRectangle = RectangleGenerator.generateInscribedRectangle(pathCoords2d, d, displayRectangles || displayOnlyCenterRectangle, "center");

    //clockwise order, starting from top: topY, rightX, lowY, leftX
    var coords = RectangleGenerator.findRectangleCorners(centerRectangle);

    var neighborhood = PolygonGenerator.generateSidePolygons(coords, displayPolygons, displayRectangles, pathCoords2d,
        d, centerRectangle, true, "");

    return neighborhood;
}

function appendPathAndText(startPathX, startPathY, endPathX, endPathY,
                           phrase, d, k, displayText, displayBounds, verticalText, widthOfSlice,
                            heightOfSlice, rectangleId) {

    var pathStroke = displayBounds ? "black" : "none";

    var pathString = "M" + startPathX + "," + startPathY + "L" + endPathX + "," + endPathY;
    svg.append("path")
        .attr("id", "innerPath_" + rectangleId + "_" + k)
        .attr("d", pathString)
        .style("fill", "none")
        .style('stroke', pathStroke);

    var textSize = 1;

    var phantomSvg = d3.select("body").append("svg");
    var text = svg.append("text")
        .text(phrase)
        .attr("font-size", textSize + "pt");
    var bbox = text.node().getBBox();

    if (displayText) {

        var widthTransform = bbox.width;
        var heightTransform = bbox.height;

        var eBrake = true;

        while (widthTransform < widthOfSlice && heightTransform < heightOfSlice && eBrake) {

            textSize++;

            text = phantomSvg.append("text")
                .text(phrase)
                .attr("font-size", textSize + "pt");

            //var textNode = document.getElementById("t1");
            bbox = text.node().getBBox();
            widthTransform = bbox.width;
            heightTransform = bbox.height;

            if (textSize > 25) {
                eBrake = false;
            }

        }

        //use length of bbox, amt of characters on line and length of rectangle to
        //determine spacing in between rectangles
        //var extraSpace = widthOfSlice - widthTransform;
        //var spacePerChar = extraSpace / phrase.length;
        //.attr("letter-spacing", spacePerChar + "pt")

        var text = svg.append("text")
            .append("textPath")
            .attr("xlink:href", "#" + "innerPath_" + rectangleId + "_" + k)
            .style("text-anchor", "middle")
             .attr("startOffset", "50%")
            .text(phrase)
            .attr("font-size", (textSize * 1.2) + "pt")
            .attr("font-family", font);
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

