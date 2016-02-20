/**
 * Created by meredith on 2/20/16.
 */

var width = 900;
var height = 600;
var rotate = [122, 0, 0];
var center = [0, 47.3097];
var scale  = 150000;
var offset = [1141.329833984375 - 263 + width / 2, 142582.609375 + 30];

var topPolyBounds = {};


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


                var centerRectangle = generateInscribedRectangle(pathCoords2d, d);

                //find second rectangle--one that fits in remaining space
                //longer side -> width
                //shorter side -> height
                var rectTopYCoord;
                var rectRightXCoord;
                var rectLowYCoord;
                var rectLeftXCoord;

                //find four corners of rectangle
                if (centerRectangle[0].angle == 90 || centerRectangle[0].angle == 270) {
                    rectLowYCoord = centerRectangle[0].cy + (centerRectangle[0].width / 2);
                    rectRightXCoord = centerRectangle[0].cx + (centerRectangle[0].height / 2);
                    rectTopYCoord = centerRectangle[0].cy - (centerRectangle[0].width / 2);
                    rectLeftXCoord = centerRectangle[0].cx - (centerRectangle[0].height / 2);
                } else {
                    rectLowYCoord = centerRectangle[0].cy + (centerRectangle[0].height / 2);
                    rectRightXCoord = centerRectangle[0].cx + (centerRectangle[0].width / 2);
                    rectTopYCoord = centerRectangle[0].cy - (centerRectangle[0].height / 2);
                    rectLeftXCoord = centerRectangle[0].cx - (centerRectangle[0].width / 2);
                };

                //mark corners of rectangle with circles -- for debugging
//                        markFourCorners(rectTopYCoord, rectLowYCoord, rectLeftXCoord, rectRightXCoord);


                //generate neighborhood polygon object--one that has all coordinates, along with whether
                //or not the coordinates are listed in clockwise or counterclockwise order.
                var neighborPolygon = generateNeighborhoodPoly(pathCoords2d);

                //TODO: special case for industrial district
                if (d.id != 41) {

                    var topPoly = generateTopPolygon(d, rectTopYCoord, rectLowYCoord, rectLeftXCoord, rectRightXCoord,
                        pathCoords2d, neighborPolygon);
//                                                    var topRectangle = generateTopRectangle(topPoly, d);

                    if (d.id == 65) {
                        //display circles along coordinates of outer polygon in increasing size to show
                        //direction of provided points in path coordinates array
//                            displayClockwiseIndicator(pathCoords2d);
                        debugger;
                    }

                    var rightPoly = generateRightPolygon(topPoly, d, rectTopYCoord, rectLowYCoord, rectLeftXCoord, rectRightXCoord,
                        pathCoords2d, neighborPolygon);
                }
            }



            return null;
        });


});

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
                            rectLowYCoord, rectLeftXCoord, rectRightXCoord, pathCoords2d, neighborPolygon) {

    //compare corners of rectangle with coords of poly--for each corner,
    // compare:

    var topPoly = [];

    //find points to include in topPoly

    var countFromStart = 0;
    var countFromEnd = pathCoords2d.length - 1;

    //assume that first point of outer poly is not in top poly
    while (countFromStart < pathCoords2d.length - 1 && pathCoords2d[countFromStart + 1][1] >= rectTopYCoord) {
        countFromStart++;
    }
    while (countFromEnd > 0 && pathCoords2d[countFromEnd - 1][1] >= rectTopYCoord) {
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

        var topPolyLeftBound = svg.append("circle")
            .attr("cy", pathCoords2d[topPolyBounds.left][1])
            .attr("cx", pathCoords2d[topPolyBounds.left][0])
            .attr("r", 2);

        var topPolyRightBound = svg.append("circle")
            .attr("cx", pathCoords2d[topPolyBounds.right][0])
            .attr("cy", pathCoords2d[topPolyBounds.right][1])
            .attr("r", 2);

        var topPolygon = svg.append("path").attr("d", pathString)
            .attr("class", "topPolyRed")
            .attr("id", "topPoly_" + d.id);

        return topPoly;
    }
    return null;
}

function generateTopRectangle(topPoly, d) {
    //generate top rectangle
    if (topPoly.length > 2) {
        var topRectangle = d3plus.geom.largestRect(topPoly, {
            angle: [0, 90, 270], nTries: 50, tolerance: 0.02
        });

//                            neighborhoodGroup.selectAll("path")
//                                    .data(topoGeometries)
//                                    .enter()
//                                    .append("path")
//                                    .attr("d", path)
//                                    .attr("class", "neighborhoodOutline")
//                                    .attr("id", function(d) {
//                                        return "n_" + d.id
//                                    });

        svg.append("rect")
            .attr("width", topRectangle[0].width)
            .attr("height", topRectangle[0].height)
            .attr("x", topRectangle[0].cx - (topRectangle[0].width / 2))
            .attr("y", topRectangle[0].cy - (topRectangle[0].height / 2))
            .attr("transform", "rotate(" + topRectangle[0].angle + "," + topRectangle[0].cx + "," + topRectangle[0].cy + ")")
            .attr("id", function() {
                return "topRect_" + d.id;
            })
            .attr("fill", function() {
                var letters = '0123456789ABCDEF'.split('');
                var color = '#';
                for (var i = 0; i < 6; i++ ) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            });
        return topRectangle;
    }
}

function generateRightPolygon(topPoly, d, rectTopYCoord, rectLowYCoord, rectLeftXCoord, rectRightXCoord,
                              pathCoords2d, neighborPolygon) {

    //TODO: handle this edge case
    if (topPoly != null) {


        var rightPoly = [];


        //
        //        var countFromStart = 0;
        //        var countFromEnd = pathCoords2d.length - 1;
        //
        //        //assume that first point of outer poly is not in right poly
        //        while (countFromStart < pathCoords2d.length - 1 && pathCoords2d[countFromStart + 1][0] <= rectRightXCoordXCoord) {
        //            countFromStart++;
        //        }
        //        while (countFromEnd > 0 && pathCoords2d[countFromEnd - 1][0] <= rectRightXCoord) {
        //            countFromEnd--;
        //
        rightPoly[0] = [rectRightXCoord, rectLowYCoord]
        rightPoly[1] = [rectRightXCoord, rectTopYCoord];
        //rightPoly[2] = [topPoly[topPoly.length - 1][0], topPoly[topPoly.length - 1] [1]];

        //                countFromStart = 0;
        //
        //                while (countFromStart < pathCoords2d.length - 1 &&
        //                pathCoords2d[countFromStart + 1][0] < rectRightXCoord) {
        //                    countFromStart++;
        //                }
        //
        //                countFromEnd = pathCoords2d.length - 1;
        //
        //                while (countFromEnd > 0 &&
        //                pathCoords2d[countFromEnd - 1][0] < rectRightXCoord) {
        //                    countFromEnd--;
        //                }
        var rightPolyNextIndex = 2;

        //loop from end of topPoly path to start of outer poly path
        //looping from last index used in topPoly to end of path coords array
        //subtracting three to account for points generated by inscribed rectangle at
        //beginning of topPoly, aka, topPoly lists all coords of pathCoords with index
        //offset 2, so accounting for that here

        var index = topPoly.length - 3;

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

        var pathString = arrayToPath(rightPoly);

        var rightPolygon = svg.append("path")
            .attr("d", pathString)
            .attr("class", "rightPolyGreen")
            .attr("id", "rightPoly_" + d.id);

        return rightPoly;

    }
}

function generateIntersectionPointFromStart(pathCoords2d, countFrom, rectTopYCoord, d) {
    var startPoint = [pathCoords2d[countFrom][0], pathCoords2d[countFrom][1]];
    var endPoint = [pathCoords2d[countFrom + 1][0], pathCoords2d[countFrom + 1][1]];

    var slope = Math.sqrt(Math.pow(startPoint[0] - endPoint[0], 2) + Math.pow(startPoint[1] - endPoint[1], 2));
    var newX = (Math.abs(endPoint[1] - startPoint[1]) / slope) + startPoint[0];

    svg.append("path")
        .attr("d", "M" + startPoint[0] + "," + startPoint[1] + "L" + endPoint[0] + "," + endPoint[1])
        .attr("stroke", "red");

    svg.append("circle").attr("cy", rectTopYCoord)
        .attr("cx", newX)
        .attr("r", 2)
        .attr("fill", "red")
        .attr("id", "startIntersection_" + d.id);

}

function generateIntersectionPointFromEnd(pathCoords2d, countFrom, rectTopYCoord, d) {
    var startPoint = [pathCoords2d[countFrom][0], pathCoords2d[countFrom][1]];
    var endPoint = [pathCoords2d[countFrom - 1][0], pathCoords2d[countFrom - 1][1]];

    var slope = Math.sqrt(Math.pow(startPoint[0] - endPoint[0], 2) + Math.pow(startPoint[1] - endPoint[1], 2));
    var newX = (Math.abs(endPoint[1] - startPoint[1]) / slope) + startPoint[0];

    svg.append("path")
        .attr("d", "M" + startPoint[0] + "," + startPoint[1] + "L" + endPoint[0] + "," + endPoint[1])
        .attr("stroke", "red");

    svg.append("circle").attr("cy", rectTopYCoord)
        .attr("cx", newX)
        .attr("r", 2)
        .attr("fill", "red")
        .attr("id", "endIntersection_" + d.id);

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

function generateInscribedRectangle(pathCoords2d, d) {
    //generate largest inscribed rectangle for overall polygon
    var rectangle = d3plus.geom.largestRect(pathCoords2d, {
        angle: [0, 90, 270], nTries: 50, tolerance: 0.02
    });
    svg.append("rect")
        .attr("width", rectangle[0].width)
        .attr("height", rectangle[0].height)
        .attr("x", rectangle[0].cx - (rectangle[0].width / 2))
        .attr("y", rectangle[0].cy - (rectangle[0].height / 2))
        .attr("transform", "rotate(" + rectangle[0].angle + "," + rectangle[0].cx + "," + rectangle[0].cy + ")")
        .attr("id", function() {
            return "rect_" + d.id;
        })
        .attr("fill", "#9999FF")
        .attr("opacity", "0.5");

//                        //append angle as text on to rectangle
//                        svg.append("text").attr("x", rectangle[0].cx)
//                                .attr("y", rectangle[0].cy)
//                                .text(function(d) { return rectangle[0].angle; });

    return rectangle;
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

