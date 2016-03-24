/**
 * Created by meredith on 2/20/16.
 */

var width = 900;
var height = 600;
var rotate = [122, 0, 0];
var center = [0, 47.3097];
var scale  = 150000;
var offset = [1141.329833984375 - 263 + width / 2, 142582.609375 + 30];

var font = "Oswald";
var padding = "2";

var topPolyBounds = {};
var rightPolyBounds = {};
var bottomPolyBounds = {};
var leftPolyBounds = {};



var projection = d3.geo.mercator()
    .rotate(rotate)
    .scale(scale)
    .translate(offset)
    .precision(.5);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height * 2);

var path = d3.geo.path()
    .projection(projection);

var neighborhoodGroup = svg.append("g")
    .attr('id', 'neighborhoodGroup');

/*parses json, call back function selects all paths (none exist yet)
 and joins data (all neighborhoods) with each path. since there are no
 paths, all data points are waiting in 'update.enter'. calling
 'enter()' gives us these points, and appends a path for each of them,
 attributing a path and id to each.*/

//maybe don't need this
var topoGeometries;

d3.json("json/neighborhoods.json", function(error, topology) {

    topoGeometries = topojson.object(topology, topology.objects.neighborhoods)
        .geometries;

    neighborhoodGroup.selectAll("path")
        .data(topoGeometries)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "neighborhoodOutline")
        .attr("id", function(d) {
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


    neighborhoodGroup.selectAll(".neighborhoodInnerPath")
        .data(topoGeometries)
        .enter()
        .append("path")
        .attr("neighborhoodBounds", path)
        .attr("class", "neighborhoodInnerPath")
        .attr("id", function(d) {
            return "inner_" + d.id;
        })
        .attr("d", function(d) {

            //highlight current neighborhood
            //var currNeighborhood = d3.select("n_" + d.id)
            //                            .style("stroke", "red");

            var neighborhoodBoundsString = this.getAttribute("neighborhoodBounds");

            //remove 'M' at beginning of path and find all subsequent coordinates by
            //splitting on 'L'
            var pathCoords = neighborhoodBoundsString.substring(1).split('L');
            var pathCoords2d = [];

            //transform pathCoords array into array of 2-d arrays
            for (var i = 0; i < pathCoords.length; i++) {
                var bothCoords = pathCoords[i].split(',');
                pathCoords2d[i] = [parseFloat(bothCoords[0]), parseFloat(bothCoords[1])];

            }

            //find largest rectangle in polygon
            if (pathCoords2d.length > 2) {

                var displayPolygons = false;
                var displayRectangles = true;
                var displayBounds = false;
                var displayText = true;
                var processAll = false;

                var lengthWord = d.properties.name.length;
                var nameWithoutSpaces = d.properties.name.replace(" ", "");

                //TODO: special case for industrial district
                if (d.id != 41) {

                    var rectanglesForText;

                    var centerRectangle = generateInscribedRectangle(pathCoords2d, d, displayRectangles, "center");

                    //clockwise order, starting from top: topY, rightX, lowY, leftX
                    var coords = findRectangleCorners(centerRectangle);

                    var neighborhood = generateSidePolygons(coords, displayPolygons, displayRectangles, pathCoords2d,
                        d, centerRectangle, true, "");

                    rectanglesForText = neighborhood.rectangles;

                    //generate next level of polygons

                    if (processAll) {

                        //generate mini polygons in top segment
                        if (neighborhood.polygons[0] != null && neighborhood.rectangles[0] != null) {
                            var topRectCoords = findRectangleCorners(neighborhood.rectangles[0].rect);
                            var topNeighborhood = generateSidePolygons(topRectCoords, displayPolygons, displayRectangles, neighborhood.polygons[0], d, neighborhood.rectangles[0],
                                true, "mini");
                        }

                        if (neighborhood.polygons[1] != null && neighborhood.rectangles[1] != null) {
                            var leftRectCoords = findRectangleCorners(neighborhood.rectangles[1].rect);
                            var leftNeighborhood = generateSidePolygons(leftRectCoords, displayPolygons, displayRectangles, neighborhood.polygons[1], d, neighborhood.rectangles[1],
                                true, "mini");
                        }

                        //skpping center rectangle

                        if (neighborhood.polygons[3] != null && neighborhood.rectangles[3] != null) {
                            var rightRectCoords = findRectangleCorners(neighborhood.rectangles[3].rect);
                            var righttNeighborhood = generateSidePolygons(rightRectCoords, displayPolygons, displayRectangles, neighborhood.polygons[3], d, neighborhood.rectangles[3],
                                true, "mini");
                        }
                        //
                        //if (neighborhood.polygons[4] != null && neighborhood.rectangles[4] != null) {
                        //    var bottomRectCoords = findRectangleCorners(neighborhood.rectangles[4].rect);
                        //    var bottomNeighborhood = generateSidePolygons(bottomRectCoords, displayPolygons, displayRectangles, neighborhood.polygons[4], d, neighborhood.rectangles[4],
                        //        true, "mini");
                        //}

                        //if (rightPoly != null) {
                        //    var rightNeighborPolygon = generateNeighborhoodPoly(rightPoly);
                        //    var rightRectCoords = findRectangleCorners(rightRectangle);
                        //    var miniRightPoly = generateRightPolygon(d, rightRectCoords.topY, rightRectCoords.lowY, rightRectCoords.leftX, rightRectCoords.rightX,
                        //        rightPoly, rightNeighborPolygon, displayPolygons, "mini");
                        //    if (miniRightPoly != null) {
                        //        var miniRightRect = generateInscribedRectangle(miniRightPoly, d, displayRectangles, "right_mini")
                        //    }
                        //
                        //}
                    }

                    var text = nameWithoutSpaces;

                    if (d.id % 2 == 0) {
                        text = nameWithoutSpaces + nameWithoutSpaces;
                    }



                    //fillNeighborhoodText(neighborhood.rectangles, d.properties.name.substring(0, Math.round(lengthWord *.75)), d, displayBounds, displayText);
                    fillNeighborhoodText(rectanglesForText, text, d, displayBounds, displayText, rectDatabase);


                }
            }
            //debugger;
            return null;
        });


});

function generateSidePolygons(coords, displayPolygons, displayRectangles, pathCoords2d, d,
                              centerRectangle, processAllFlag, tag) {

    //generate neighborhood polygon object--one that has all coordinates, along with whether
    //or not the coordinates are listed in clockwise or counterclockwise order.
    var neighborPolygon = generateNeighborhoodPoly(pathCoords2d);

    var neighborhood  = {};
    neighborhood.polygons = [];
    neighborhood.rectangles = [];

    //debugger;

    var topPoly = generateTopPolygon(d, coords.topY, coords.lowY, coords.leftX, coords.rightX,
        pathCoords2d, neighborPolygon, displayPolygons, "");
    var topRectangle;
    if (topPoly != null) {
        topRectangle = generateInscribedRectangle(topPoly, d, displayRectangles, tag + "top");
    }
    if (processAllFlag) {
        var rightPoly = generateRightPolygon(topPoly, d, coords.topY, coords.lowY, coords.leftX, coords.rightX,
            pathCoords2d, neighborPolygon, displayPolygons);
        var rightRectangle;
        if (rightPoly != null) {
            rightRectangle = generateInscribedRectangle(rightPoly, d, displayRectangles, tag + "right");
        }

        var bottomPoly = generateBottomPolygon(rightPoly, d, coords.topY, coords.lowY, coords.leftX, coords.rightX,
            pathCoords2d, neighborPolygon, displayPolygons);
        var bottomRectangle;
        if (bottomPoly != null) {
            bottomRectangle = generateInscribedRectangle(bottomPoly, d, displayRectangles, tag + "bottom");
        }

        var leftPoly = generateLeftPolygon(bottomPoly, d, coords.topY, coords.lowY, coords.leftX, coords.rightX,
            pathCoords2d, neighborPolygon, displayPolygons);
        var leftRectangle;
        if (leftPoly != null) {
            leftRectangle = generateInscribedRectangle(leftPoly, d, displayRectangles, tag + "left");
        }

        neighborhood.polygons[0] = topPoly;
        neighborhood.polygons[1] = leftPoly;
        neighborhood.polygons[2] = null; //because center doesn't have poly, but alignment maintained
        neighborhood.polygons[3] = rightPoly;
        neighborhood.polygons[4] = leftPoly;

        neighborhood.rectangles[0] = generateInscribedRectObject(topRectangle, "top", d);
        neighborhood.rectangles[1] = generateInscribedRectObject(leftRectangle, "left", d);
        neighborhood.rectangles[2] = generateInscribedRectObject(centerRectangle, "center", d);
        neighborhood.rectangles[3] = generateInscribedRectObject(rightRectangle, "right", d);
        neighborhood.rectangles[4] = generateInscribedRectObject(bottomRectangle, "bottom", d);

        return neighborhood;
    }
}

function generateInscribedRectObject(rectangle, location, d) {
    return {
        rect: rectangle,
        location: location,
        num: d.id
    };
}

function markFourCorners(rectTopYCoord, rectLowYCoord, rectLeftXCoord, rectRightXCoord) {
    svg.append("circle").attr("cy", rectTopYCoord)
        .attr("cx", rectRightXCoord)
        .attr("r", 2);

    svg.append("circle").attr("cy", rectTopYCoord)
        .attr("cx", rectLeftXCoord)
        .attr("r", 2);

    svg.append("circle").attr("cy", rectLowYCoord)
        .attr("cx", rectRightXCoord)
        .attr("r", 2);

    svg.append("circle").attr("cy", rectLowYCoord)
        .attr("cx", rectLeftXCoord)
        .attr("r", 2);
}

function generateTopPolygon(d,  rectTopYCoord,
                            rectLowYCoord, rectLeftXCoord, rectRightXCoord, pathCoords2d,
                            neighborPolygon, displayFlag, tag) {

    //compare corners of rectangle with coords of poly--for each corner,
    // compare:

    var topPoly = [];

    //find points to include in topPoly

    var countFromStart = 0;
    var countFromEnd = pathCoords2d.length - 1;

    //assume that first point of outer poly is not in top poly
    while (countFromStart < pathCoords2d.length - 1 && pathCoords2d[countFromStart][1] >= rectTopYCoord) {
        countFromStart++;
    }
    while (countFromEnd > 0 && pathCoords2d[countFromEnd][1] >= rectTopYCoord) {
        countFromEnd--;
    }

    //set bounds to indicate which points were used in topPoly.
    //useful for generation of next poly.
    topPolyBounds.left = countFromStart;
    topPolyBounds.right = countFromEnd;

    if (Math.abs(countFromStart - countFromEnd) > 1) { //can't make polygon out of two points


        if (countFromStart == 0 || countFromEnd == pathCoords2d.length - 1) { //first point of poly IS in topPoly

            countFromStart = 0;

            while (countFromStart < pathCoords2d.length - 1 &&
            pathCoords2d[countFromStart + 1][1] < rectTopYCoord) {
                countFromStart++;
            }

            countFromEnd = pathCoords2d.length - 1;

            while (countFromEnd > 0 &&
            pathCoords2d[countFromEnd - 1][1] < rectTopYCoord) {
                countFromEnd--;
            }

            topPolyBounds.left = countFromEnd;
            topPolyBounds.right = countFromStart;

            //assuming clockwise order, so populating lower bound of topPoly right to left

            topPoly[0] = [rectRightXCoord, rectTopYCoord];
            topPoly[1] = [rectLeftXCoord, rectTopYCoord];

            var topPolyNextIndex = 2;

            if (pathCoords2d[countFromEnd][1] < rectTopYCoord) {

                //loop from count from end to start of outer poly path
                for (var i = countFromEnd; i < pathCoords2d.length; i++) {
                    topPoly[topPolyNextIndex] = [pathCoords2d[i][0], pathCoords2d[i][1]];
                    topPolyNextIndex++;
                }
            }

            if (pathCoords2d[countFromStart][1] < rectTopYCoord) {

                //loop from beginning of poly path to count from start
                for (var i = 0; i <= countFromStart; i++) {
                    topPoly[topPolyNextIndex] = [pathCoords2d[i][0], pathCoords2d[i][1]];
                    topPolyNextIndex++;
                }
            }


        } else { //first point of poly is not in topPoly

            var topPolyNextIndex = 2;

            //assuming clockwise order, so populating lower bound of topPoly right to left

            topPoly[0] = [rectRightXCoord, rectTopYCoord];
            topPoly[1] = [rectLeftXCoord, rectTopYCoord];

            for (var i = countFromStart; i < pathCoords2d.length; i++) {
                if (pathCoords2d[i][1] < rectTopYCoord) {
                    topPoly[topPolyNextIndex] = [pathCoords2d[i][0], pathCoords2d[i][1]];
                    topPolyNextIndex++;
                }
            }
        }

        var pathString = arrayToPath(topPoly);

        //if (topPolyBounds.right == -1) {
        //    topPolyBounds.right = pathCoords2d.length - 1;
        //}

        //if (topPolyBounds.left == pathCoords2d.length) {
        //    topPolyBounds.left = 0;
        //}

        //var countFromStart = svg.append("circle")
        //    .attr("cy", pathCoords2d[countFromStart][1])
        //    .attr("cx", pathCoords2d[countFromStart][0])
        //    .attr("r", 2)
        //    .attr("fill", "green");
        //
        //var countFromEnd = svg.append("circle")
        //    .attr("cy", pathCoords2d[countFromEnd][1])
        //    .attr("cx", pathCoords2d[countFromEnd][0])
        //    .attr("r", 2)
        //    .attr("fill", "red");
        //
        //var topPolyLeftBound = svg.append("circle")
        //    .attr("cy", pathCoords2d[topPolyBounds.left][1])
        //    .attr("cx", pathCoords2d[topPolyBounds.left][0])
        //    .attr("r", 2);
        //
        //var topPolyRightBound = svg.append("circle")
        //    .attr("cx", pathCoords2d[topPolyBounds.right][0])
        //    .attr("cy", pathCoords2d[topPolyBounds.right][1])
        //    .attr("r", 2);

        if (displayFlag) {
            var topPolygon = svg.append("path").attr("d", pathString)
                .attr("class", "topPolyRed")
                .attr("id", "topPoly_" + tag + "_" + d.id);
        }

        return topPoly;
    }
    return null;
}


function generateRightPolygon(topPoly, d, rectTopYCoord, rectLowYCoord, rectLeftXCoord, rectRightXCoord,
                              pathCoords2d, neighborPolygon, displayFlag) {

    //TODO: handle this edge case

        var rightPoly = [];

        rightPoly[0] = [rectRightXCoord, rectLowYCoord];
        rightPoly[1] = [rectRightXCoord, rectTopYCoord];

        var rightPolyNextIndex = 2;

        //loop from end of topPoly path to start of outer poly path
        //looping from last index used in topPoly to end of path coords array
        //subtracting three to account for points generated by inscribed rectangle at
        //beginning of topPoly, aka, topPoly lists all coords of pathCoords with index
        //offset 2, so accounting for that here

        var index = topPolyBounds.right;

        //loop to point at which we go beyond right side of rectangle
        while (index < pathCoords2d.length && pathCoords2d[index][0] <= rectRightXCoord) {
            index++;
        }

        rightPolyBounds.top = index;

        while (index < pathCoords2d.length && pathCoords2d[index][0] > rectRightXCoord) {
            //        for (var i = topPoly.length - 3; i < pathCoords2d.length; i++) {
            rightPoly[rightPolyNextIndex] = [pathCoords2d[index][0], pathCoords2d[index][1]];
            rightPolyNextIndex++;
            index++;

        }

        if (index == pathCoords2d.length) { //starting point of outer poly is in rightPoly
            index = 0; //continue looping

            while (index < pathCoords2d.length && pathCoords2d[index][0] > rectRightXCoord) {
                rightPoly[rightPolyNextIndex] = [pathCoords2d[index][0], pathCoords2d[index][1]];
                rightPolyNextIndex++;
                index++;
            }
        }

        rightPolyBounds.bottom = index - 1;

        if (rightPolyBounds.bottom == -1) {
            rightPolyBounds.bottom = pathCoords2d.length - 1;
        }

        var pathString = arrayToPath(rightPoly);


        if (displayFlag) {
            var rightPolygon = svg.append("path")
                .attr("d", pathString)
                .attr("class", "rightPolyGreen")
                .attr("id", "rightPoly_" + d.id);
        }

        return rightPoly;
}

//TODO: factor out redundancy with generate top, generate right, etc.
function generateBottomPolygon(rightPoly, d, rectTopYCoord, rectLowYCoord, rectLeftXCoord, rectRightXCoord,
                               pathCoords2d, neighborPolygon, displayFlag) {
        var bottomPoly = [];

        bottomPoly[0] = [rectLeftXCoord, rectLowYCoord];
        bottomPoly[1] = [rectRightXCoord, rectLowYCoord];

        var bottomPolyNextIndex = 2;

        var index = rightPolyBounds.bottom;

        //loop to point at which we go below bottom of rectangle
        while (index < pathCoords2d.length &&  pathCoords2d[index][1] <= rectLowYCoord) {
            index++;
        }

        bottomPolyBounds.right = index;

        //TODO: can factor this out
        while (index < pathCoords2d.length && pathCoords2d[index][1] > rectLowYCoord) {
            bottomPoly[bottomPolyNextIndex] = [pathCoords2d[index][0], pathCoords2d[index][1]];
            bottomPolyNextIndex++;
            index++;
        }

        if (index == pathCoords2d.length) { //starting point of outer poly is in bottomPoly
            index = 0; //to continue looping

            //TODO: factor this
            while (index < pathCoords2d.length && pathCoords2d[index][1] > rectLowYCoord) {
                bottomPoly[bottomPolyNextIndex] = [pathCoords2d[index][0], pathCoords2d[index][1]];
                bottomPolyNextIndex++;
                index++;
            }

        }

        bottomPolyBounds.left = index - 1;

        if (bottomPolyBounds.left == -1) {
            bottomPolyBounds.left = pathCoords2d.length - 1;
        }

        var pathString = arrayToPath(bottomPoly);

        if (displayFlag) {

            var bottomPolygon = svg.append("path")
                .attr("d", pathString)
                .attr("class", "bottomPolyBlue")
                .attr("id", "bottomPoly_" + d.id);
        }

        return bottomPoly;


}

function generateLeftPolygon(bottomPoly, d, rectTopYCoord, rectLowYCoord, rectLeftXCoord, rectRightXCoord,
    pathCoords2d, neighborPolygon, displayFlag) {

        var leftPoly = [];

        leftPoly[0] = [rectLeftXCoord, rectTopYCoord];
        leftPoly[1] = [rectLeftXCoord, rectLowYCoord];

        var leftPolyNextIndex = 2;

        //loop from end of topPoly path to start of outer poly path
        //looping from last index used in topPoly to end of path coords array
        //subtracting three to account for points generated by inscribed rectangle at
        //beginning of topPoly, aka, topPoly lists all coords of pathCoords with index
        //offset 2, so accounting for that here

        var index = bottomPolyBounds.left;

        //loop to point at which we go beyond left side of rectangle
        while (index < pathCoords2d.length && pathCoords2d[index][0] >= rectLeftXCoord) {
            index++;
        }

        leftPolyBounds.top = index;

        //loop while we haven't reached left bound of top polygon
        while (index < pathCoords2d.length && index != topPolyBounds.left) {
            leftPoly[leftPolyNextIndex] = [pathCoords2d[index][0], pathCoords2d[index][1]];
            leftPolyNextIndex++;
            index++;

        }

        if (index == pathCoords2d.length) { //starting point of outer poly is in rightPoly
            index = 0; //continue looping

            //loop while we haven't reached left bound of top polygon
            while (index < pathCoords2d.length && index != topPolyBounds.left) {
                leftPoly[leftPolyNextIndex] = [pathCoords2d[index][0], pathCoords2d[index][1]];
                leftPolyNextIndex++;
                index++;

            }
        }

        //add last point
        leftPoly[leftPolyNextIndex] = [pathCoords2d[index][0], pathCoords2d[index][1]];
        index++;

        leftPolyBounds.top = index - 1;

        if (leftPolyBounds.top == -1) {
            leftPolyBounds.top = pathCoords2d.length - 1;
        }

        var pathString = arrayToPath(leftPoly);

        if (displayFlag) {

            var leftPolygon = svg.append("path")
                .attr("d", pathString)
                .attr("class", "leftPoly")
                .attr("id", "leftPoly_" + d.id);
        }

        return leftPoly;

}

function generateNeighborhoodPoly(pathCoords2d) {

    var sum = 0;
    for (var i = 0; i < pathCoords2d.length - 1; i++) {
        var xDiff = pathCoords2d[i + 1][0] - pathCoords2d[i][0];
        var yDiff = pathCoords2d[i + 1][1] - pathCoords2d[i][1];

        sum += (xDiff * yDiff);

    }

    var clockwise = (sum >= 0);
    var neighborPoly = {
        clockwise: clockwise,
        pathCoords2d: pathCoords2d
    }

    return neighborPoly;
}

//location parameter is: top, left, right, bottom relative to center inscribed rectangle
function generateInscribedRectangle(polyCoordinates, d, displayFlag, location) {

    var rectangle;

    //look up rectangle with given neighborhood and location.
    //if exists, use rect from database

    var savedNeighborhood = rectDatabase[d.properties.name];
    if (savedNeighborhood != null) {
    //if (false) {
        var savedRect = rectDatabase[d.properties.name][location];
        //use rect from database (may be null--should be ok)
        rectangle = savedRect;
        console.log("using saved rectangle from database for neighborhood: " + d.properties.name);
    } else {
        //generate largest inscribed rectangle for overall polygon
        rectangle = d3plus.geom.largestRect(polyCoordinates, {
            angle: [0, 90, 270], nTries: 50, tolerance: 0.02
        });
    }

    //if (d.id == 60) {
    //    if (location === "center") {
    //        rectDatabase[d.properties.name] = {};
    //    }
    //    rectDatabase[d.properties.name][location] = rectangle;
    //    //console.log("\"" + location + "\": " + JSON.stringify(rectangle));
    //    console.log(JSON.stringify(rectDatabase));
    //    //debugger;
    //}

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

//                        //append angle as text on to rectangle
//                        svg.append("text").attr("x", rectangle[0].cx)
//                                .attr("y", rectangle[0].cy)
//                                .text(function(d) { return rectangle[0].angle; });

    return rectangle;
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

function calculateNumLevels(aspectRatio, phrase, addtlLevel) {

    //as aspectRatio increases, num levels increases
    var numLevels = Math.ceil(aspectRatio + addtlLevel);

    if (phrase.length > 15) {
        //as phrase length increases, num levels increases
        numLevels *= Math.round(phrase.length / 15);
    }

    return numLevels;

}

function displayClockwiseIndicator(pathCoords2d) {
    var radius = 0.1;

    svg.selectAll(".clockwiseIndicator")
        .data(pathCoords2d)
        .enter()
        .append("circle")
        .attr("r", function(d) {
            radius += 0.05;
            return radius;
        })
        .attr("cx", function(d) {
            return d[0];
        })
        .attr("cy", function(d) {
            return d[1];
        });

}

function arrayToPath(polyArray) {

    //generate path for topPoly
    var pathString = "M" + polyArray[0][0] + "," + polyArray[0][1];
    for (var j = 1; j < polyArray.length; j++) {
        pathString += "L" + polyArray[j][0] + "," + polyArray[j][1];
    }

    //add close path character to draw line back to initial point
    pathString+= 'Z';

    return pathString;
}

function findRectangleCorners(rectangle) {

    //return obj with four corners
    var rectCoords = {};

    //find four corners of rectangle
    if (rectangle[0].angle == 90 || rectangle[0].angle == 270) {
        rectCoords.lowY = rectangle[0].cy + (rectangle[0].width / 2);
        rectCoords.rightX = rectangle[0].cx + (rectangle[0].height / 2);
        rectCoords.topY = rectangle[0].cy - (rectangle[0].width / 2);
        rectCoords.leftX = rectangle[0].cx - (rectangle[0].height / 2);
    } else {
        rectCoords.lowY = rectangle[0].cy + (rectangle[0].height / 2);
        rectCoords.rightX = rectangle[0].cx + (rectangle[0].width / 2);
        rectCoords.topY = rectangle[0].cy - (rectangle[0].height / 2);
        rectCoords.leftX = rectangle[0].cx - (rectangle[0].width / 2);
    };

    return rectCoords;
}

function fillNeighborhoodText(neighborhoodRectangles, phrase, d, displayBounds, displayText, rectDatabase) {

    phrase = phrase.toUpperCase();
    var viableRectangles;


    viableRectangles = filterViableRectangles(neighborhoodRectangles, d);

    if (rectDatabase[d.properties.name] != null &&
                rectDatabase[d.properties.name].manual != null) {
        //fill text in rectangles based on
        //instructions delineated in rectangle database
        populateTextAlg2(viableRectangles, phrase, displayBounds, displayText, d);
    } else {
        //populateTextAreaRatio(viableRectangles, phrase, displayBounds, displayText, d);
        populateTextAlg1(viableRectangles, phrase, displayBounds, displayText, d);
    }
}

//apply padding dictated in global padding variable
function applyPadding(rectangle) {
    rectangle.corners.leftX += (padding / 2.0);
    rectangle.corners.rightX -= (padding / 2.0);
    rectangle.corners.lowY -= (padding / 2.0);
    rectangle.corners.topY += (padding / 2.0);

    rectangle.area = (rectangle.corners.lowY - rectangle.corners.topY)
                            * (rectangle.corners.rightX - rectangle.corners.leftX);
    return rectangle;
}

function filterViableRectangles(neighborhoodRectangles, d) {
    //keep track of how many rectangles are actually viable, i.e. big enough
    var nextIndexInViableRectangles = 0;
    var viableRectangles = [];

    var areaSum = 0;


    //compute total area and find viable rectangles
    for (var i = 0; i < neighborhoodRectangles.length; i++) {
        if (neighborhoodRectangles[i].rect != null) {
            var rectArea = neighborhoodRectangles[i].rect[0].width * neighborhoodRectangles[i].rect[0].height;
            var aspectRatio = neighborhoodRectangles[i].rect[0].width / neighborhoodRectangles[i].rect[0].height;
            if (rectArea > 70 && aspectRatio < 20) {
                viableRectangles[nextIndexInViableRectangles] = {
                    rect: neighborhoodRectangles[i].rect,
                    area: rectArea,
                    corners: findRectangleCorners(neighborhoodRectangles[i].rect),
                    aspectRatio: aspectRatio,
                    id: "rect_" + neighborhoodRectangles[i].num + "_" + neighborhoodRectangles[i].location
                };
                areaSum += rectArea;
                nextIndexInViableRectangles++;
            }
        }
    }

    return viableRectangles;
}

//pretty broken
function populateTextAreaRatio(viableRectangles, phrase, displayBounds, displayText, d) {

    var heightOfEachLevel = 10;

    //keep track of next available portion of phrase
    var currIndexInPhrase = 0;

    for (var i = 0; i < viableRectangles.length; i++) {

        //find area ratio for given rectangle
        //var areaRatio = (viableRectangles[i][0].width * viableRectangles[i][0].height) / areaSum;

        //use area ratio weighting all rectangles the same
        var areaRatio = 1 / viableRectangles.length;

        //use area ratio to partition phrase
        var numChars = Math.floor(areaRatio * phrase.length);
        var myChars = phrase.substring(currIndexInPhrase, currIndexInPhrase + numChars);

        currIndexInPhrase += numChars;

        var numHorizontalLevels = (viableRectangles[i].rect[0].height / heightOfEachLevel);

        //maybe do this somewhere with greater scope?
        var rectCoords = findRectangleCorners(viableRectangles[i].rect);

        if (displayBounds) {
            //for debug: mark corners
            markFourCorners(rectCoords.topY, rectCoords.lowY, rectCoords.leftX, rectCoords.rightX);
        }

        //save place in current set of chars
        var currIndexInMyChars = 0;
        var charsInEachLevel = Math.floor((1 / numHorizontalLevels) * myChars.length);

        //populate each horizontal level with text
        for (var j = 1; j <= numHorizontalLevels; j++) {

            //generate path for given horizontal level
            var startPathX = rectCoords.leftX;
            var startPathY = rectCoords.topY + (j * heightOfEachLevel);

            var endPathX = rectCoords.rightX;
            var endPathY = startPathY;

            var levelString
            if (j == Math.round(numHorizontalLevels)) {
                levelString = myChars.substring(currIndexInMyChars, myChars.length);
            } else {
                levelString = myChars.substring(currIndexInMyChars, currIndexInMyChars + charsInEachLevel);
            }
            currIndexInMyChars += charsInEachLevel;

            var pathFill;
            if (displayBounds) {
                pathFill = "black";
            } else {
                pathFill = "none";
            }

            var pathString = "M" + startPathX + "," + startPathY + "L" + endPathX + "," + endPathY;
            svg.append("path")
                .attr("id", "innerPath_" + d.id + "_" + (i + 1) + "_" + j)
                .attr("d", pathString)
                .style("fill", "none")
                .style('stroke', pathFill);

            if (displayText) {
                svg.append("text")
                    .append("textPath")
                    .attr("xlink:href", "#" + "innerPath_" + d.id + "_" + (i + 1) + "_" + j)
                    .style("text-anchor", "middle")
                    .text(levelString)
                    .attr("font-size", viableRectangles[i].rect[0].width / 5)
                    .attr("startOffset", "50%");
            }

        }
    }
}

function populateTextAlg1(viableRectangles, phrase, displayBounds, displayText, d) {

    //first letter goes in first viable rectangle
    //An angle of zero means that the longer side of the polygon
    // will be aligned with the x axis. An angle of +90 and/or -90 means that the
    // longer side of the polygon (the width) will be aligned with the y axis.
    if (displayText) {

        if (viableRectangles.length > 1) {

            var maxArea = viableRectangles[0].area;
            var indexOfMaxArea = 0;
            var aspectRatioBiggestRect = viableRectangles[0].aspectRatio;

            //find biggest rectangle, use for majority of text
            for (var i = 1; i < viableRectangles.length; i++) {
                var currArea = viableRectangles[i].area;
                if (currArea > maxArea) {
                    indexOfMaxArea = i;
                    maxArea = currArea;
                    aspectRatioBiggestRect = viableRectangles[i].aspectRatio;
                }
            }

            //apply padding to center rectangle
            viableRectangles[indexOfMaxArea] = applyPadding(viableRectangles[indexOfMaxArea]);

            //if there are viable rectangles appearing before biggest (i.e. top and left), fill with one letter each
            var currIndex = 0;
            var currRectIndex = 0;
            while (currRectIndex < indexOfMaxArea) {

                //get current rectangle
                var currRect = viableRectangles[currIndex];

                //if currRect is actually viable
                if (currRect.aspectRatio < 4) {

                    //append path and letter
                    var currLetter = phrase.substring(currIndex, currIndex + 1);
                    appendSingleLetter(currRect, currLetter, d, aspectRatioBiggestRect);
                    currIndex++;
                }
                currRectIndex++;
            }

            var currIndexFromEnd = viableRectangles.length - 1;
            var countLettersOffEnd = 0;

            while (currIndexFromEnd > indexOfMaxArea) {

                var currRect = viableRectangles[currIndexFromEnd];

                if (currRect.aspectRatio < 4) {
                    //append path and letter
                    var currLetter = phrase.charAt(phrase.length - 1 - countLettersOffEnd);
                    appendSingleLetter(currRect, currLetter, d);
                    countLettersOffEnd++;
                }
                currIndexFromEnd--;
            }

            //fill largest rectangle with wrapped text
            //pass phrase with first letters chopped off (depending on how many got their own rectangles) and
            //last letter chopped
            //fillRectWithText(phrase.substring(currIndex, phrase.length - (countLettersOffEnd)), viableRectangles[indexOfMaxArea]);
            fillRectTextManual(phrase.substring(currIndex,
                phrase.length - (countLettersOffEnd)), viableRectangles[indexOfMaxArea],
                displayText, displayBounds, d);
            //debugger;


            //last letter goes in last viable rectangle
            //if (viableRectangles.length > 2) {
            //    appendSingleLetter(viableRectangles[viableRectangles.length - 1], phrase.substring(phrase.length - 1), d);
            //}

        } else if (viableRectangles.length == 1) {
            //use entire phrase to fill only viable rectangle
            //fillRectWithText(phrase, viableRectangles[0]);
            fillRectTextManual(phrase, viableRectangles[0], displayText, displayBounds, d);
            //debugger;
        }


    }

    //last letter goes in last viable rectangle


}

function populateTextAlg2(viableRectangles, phrase, displayBounds, displayText, d) {
    //use multiple rectangles to fill text
    if (displayText) {

        //take them as they come: if rectangle wants one char, give it one char
        for (var i = 0; i < viableRectangles.length; i++) {

            var indexStart = Math.floor(viableRectangles[i].rect[3][0] * phrase.length);
            var indexEnd = Math.floor(viableRectangles[i].rect[3][1] * phrase.length);

            var phraseChunk = phrase.substring(indexStart, indexEnd);

            viableRectangles[i] = applyPadding(viableRectangles[i]);

            fillRectTextManual(phraseChunk, viableRectangles[i], displayText,
                            displayBounds, d);

        }
    }
}

//fill rectangle using svg wrapping from d3Plus
function fillRectWithText(phrase, rectangle) {


    //inserting spaces in between letters so that d3plus will wrap text mid-word
    var spaceAugmentedText = insertSpaces(phrase);

    //middle of phrase goes in big rectangle
    var newText = svg.append("text")
        .text(spaceAugmentedText)
        .attr("font-family", font);
        //.attr("font-size", "15pt");

    //var newText = phrase.substring(1);
    //
    //markFourCorners(
    //    rectangle.corners.topY,
    //    rectangle.corners.lowY,
    //    rectangle.corners.leftX,
    //    rectangle.corners.rightX
    //);

    var height = rectangle.corners.lowY - rectangle.corners.topY;
    var width = rectangle.corners.rightX - rectangle.corners.leftX;

    var text = d3plus.textwrap()
        .height(height)
        .width(width)
        .container(newText)
        .x(rectangle.corners.leftX)
        .y(rectangle.corners.topY)
        //.text(newText)
        .resize(true)
        .align("center")
        .draw();

    //text.attr("letter-spacing", 3);
}

function fillRectTextManual(phrase, rectangle, displayText, displayBounds, d) {

    var verticalDistance = rectangle.corners.lowY - rectangle.corners.topY;
    var horizontalDistance = rectangle.corners.rightX - rectangle.corners.leftX;

    var numLevels;

    if (rectangle.rect[4] === "horizontalText") { //force rectangle to use horizontal slicing
        //find num levels
        numLevels = calculateNumLevels(1 / rectangle.aspectRatio, phrase, 0);
    } else {
        numLevels = calculateNumLevels(rectangle.aspectRatio, phrase, 1); //Math.round(rectangle.aspectRatio) + 1
    }

    var phrasePieces = [];
    var indexInPhrase = 0; //next available letter

    for (var i = 0; i < numLevels; i++) {
        var piece = "";
        var bound = phrase.length / numLevels;

        while ((indexInPhrase < ((i + 1) * bound)) && (indexInPhrase < phrase.length)) {
            piece += phrase.charAt(indexInPhrase);
            indexInPhrase++;
        }

        phrasePieces[i] = piece;
    }
    var rectCoords = findRectangleCorners(rectangle.rect);

    if (verticalDistance > horizontalDistance || rectangle.rect[4] == "horizontalText") { //taller
        //split rectangle into four portions and find lower edge of each for text path

        //x coords don't change
        var startPathX = rectCoords.leftX;
        var endPathX = rectCoords.rightX;
        var verticalText = false;

        var widthOfSlice = horizontalDistance;
        var heightOfSlice = verticalDistance / numLevels;

        for (var k = 1; k <= numLevels; k++) {

            //current phrase piece
            var currPhrase = phrasePieces[k - 1];

            //find y coords
            var startPathY = rectCoords.topY + (k * (verticalDistance / numLevels));
            var endPathY = startPathY;

            appendPathAndText(startPathX, startPathY, endPathX, endPathY,
                currPhrase, d, k, displayText, displayBounds, verticalText, widthOfSlice,
                heightOfSlice, rectangle.id);
        }
    } else { //wider: make vertical slices
        //y coords don't change
        var startPathY = rectCoords.topY;
        var endPathY = rectCoords.lowY;
        var verticalText = true;

        var widthOfSlice = verticalDistance;
        var heightOfSlice = horizontalDistance / numLevels;

        for (var k = numLevels; k >= 1; k--) {

            //current phrase piece
            var currPhrase = phrasePieces[numLevels - k];

            //find x coords
            var startPathX = rectCoords.leftX + ((k - 1) * (horizontalDistance / numLevels));
            var endPathX = startPathX;

            appendPathAndText(startPathX, startPathY, endPathX, endPathY,
                currPhrase, d, k, displayText, displayBounds, verticalText, widthOfSlice,
                heightOfSlice, rectangle.id);
        }
    }


}


//not in use
function findTextSize(areaOfSlice, phrase) {

    //append text to phantom svg
    var phatomSvg = d3.select("body").append("svg");
    var text = svg.append("text")
        .text(phrase);


}

function insertSpaces(phrase) {
    var spaceAgumentedPhrase = "";
    for (var i = 0; i < phrase.length - 1; i++) {
        spaceAgumentedPhrase += phrase.charAt(i) + " ";
    }
    spaceAgumentedPhrase += phrase.charAt(phrase.length - 1);
    return spaceAgumentedPhrase;
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
            .attr("font-size", (textSize * 1.25) + "pt")
            .attr("font-family", font);
    }
}

function appendSingleLetter(rectangle, letter, d, aspectRatioBiggestRect) {

        var textPath;
        var letterSize;
        var rectWidth;
        var rectHeight;
        var upperLeftCornerX;
        var upperLeftCornerY;

    if (true) {
        //debugger;
    }

        if (rectangle.rect[0].angle == 0) { //longer side of rectangle is aligned with x axis(?)

            //find new X
            //var xWithPadding = rectangle.corners.rightX - padding;

            upperLeftCornerX = rectangle.corners.rightX;
            upperLeftCornerY = rectangle.corners.topY;


            //use right side of rectangle for bottom of path
            //textPath = "M" + rectangle.corners.rightX + "," + rectangle.corners.lowY
            //    + "L" + rectangle.corners.rightX + "," + rectangle.corners.topY;

            //use top of rectangle for bottom of path (letter falls on its right side)
            textPath = "M" + rectangle.corners.leftX + "," + rectangle.corners.topY
                 + "L" + rectangle.corners.leftX + "," + rectangle.corners.lowY;

        } else if (rectangle.rect[0].angle == 90 || rectangle.rect[0].angle == 270) {
            //find new y
            //var yWithPadding = rectangle.corners.lowY - padding;
            var y = rectangle.corners.lowY;

            upperLeftCornerX = rectangle.corners.leftX;
            upperLeftCornerY = rectangle.corners.topY;

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

