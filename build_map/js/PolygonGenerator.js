/**
 * Created by meredith on 5/25/16.
 */
//TODO: probably shouldn't be calling rectangle generator from polygon generator
module.exports = {
    generateSidePolygons: function(coords, displayPolygons, displayRectangles, pathCoords2d, d,
        centerRectangle, processAllFlag, tag) {

        //generate neighborhood polygon object--one that has all coordinates, along with whether
        //or not the coordinates are listed in clockwise or counterclockwise order.
        var neighborPolygon = PolygonGenerator.generateNeighborhoodPoly(pathCoords2d);

        var neighborhood = {};
        neighborhood.polygons = [];
        neighborhood.rectangles = [];

        var topPoly = PolygonGenerator.generateTopPolygon(d, coords.topY, coords.lowY, coords.leftX, coords.rightX,
            pathCoords2d, neighborPolygon, displayPolygons, "");
        var topRectangle;
        if (topPoly != null) {
            topRectangle = RectangleGenerator.generateInscribedRectangle(topPoly, d, displayRectangles, tag + "top");
        }
        if (processAllFlag) {
            var rightPoly = PolygonGenerator.generateRightPolygon(topPoly, d, coords.topY, coords.lowY, coords.leftX, coords.rightX,
                pathCoords2d, neighborPolygon, displayPolygons);
            var rightRectangle;
            if (rightPoly != null) {
                rightRectangle = RectangleGenerator.generateInscribedRectangle(rightPoly, d, displayRectangles, tag + "right");
            }

            var bottomPoly = PolygonGenerator.generateBottomPolygon(rightPoly, d, coords.topY, coords.lowY, coords.leftX, coords.rightX,
                pathCoords2d, neighborPolygon, displayPolygons);
            var bottomRectangle;
            if (bottomPoly != null) {
                bottomRectangle = RectangleGenerator.generateInscribedRectangle(bottomPoly, d, displayRectangles, tag + "bottom");
            }

            var leftPoly = PolygonGenerator.generateLeftPolygon(bottomPoly, d, coords.topY, coords.lowY, coords.leftX, coords.rightX,
                pathCoords2d, neighborPolygon, displayPolygons);
            var leftRectangle;
            if (leftPoly != null) {
                leftRectangle = RectangleGenerator.generateInscribedRectangle(leftPoly, d, displayRectangles, tag + "left");
            }

            neighborhood.polygons[0] = topPoly;
            neighborhood.polygons[1] = leftPoly;
            neighborhood.polygons[2] = null; //because center doesn't have poly, but alignment maintained
            neighborhood.polygons[3] = rightPoly;
            neighborhood.polygons[4] = leftPoly;

            //TODO: move these somehwere else...they don't belong here
            neighborhood.rectangles[0] = RectangleGenerator.generateInscribedRectObject(topRectangle, "top", d);
            neighborhood.rectangles[1] = RectangleGenerator.generateInscribedRectObject(leftRectangle, "left", d);
            neighborhood.rectangles[2] = RectangleGenerator.generateInscribedRectObject(centerRectangle, "center", d);
            neighborhood.rectangles[3] = RectangleGenerator.generateInscribedRectObject(rightRectangle, "right", d);
            neighborhood.rectangles[4] = RectangleGenerator.generateInscribedRectObject(bottomRectangle, "bottom", d);

            return neighborhood;
        }
    },

    generateTopPolygon: function(d,  rectTopYCoord,
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

            var pathString = NeighborhoodParser.arrayToPath(topPoly);

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
    },

    generateRightPolygon: function(topPoly, d, rectTopYCoord, rectLowYCoord, rectLeftXCoord, rectRightXCoord,
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

        var pathString = NeighborhoodParser.arrayToPath(rightPoly);


        if (displayFlag) {
            var rightPolygon = svg.append("path")
                .attr("d", pathString)
                .attr("class", "rightPolyGreen")
                .attr("id", "rightPoly_" + d.id);
        }

        return rightPoly;
    },

    //TODO: factor out redundancy with generate top, generate right, etc.
    generateBottomPolygon: function(rightPoly, d, rectTopYCoord, rectLowYCoord, rectLeftXCoord, rectRightXCoord,
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

        var pathString = NeighborhoodParser.arrayToPath(bottomPoly);

        if (displayFlag) {

            var bottomPolygon = svg.append("path")
                .attr("d", pathString)
                .attr("class", "bottomPolyBlue")
                .attr("id", "bottomPoly_" + d.id);
        }

        return bottomPoly;


    },

    generateLeftPolygon: function(bottomPoly, d, rectTopYCoord, rectLowYCoord, rectLeftXCoord, rectRightXCoord,
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

        var pathString = NeighborhoodParser.arrayToPath(leftPoly);

        if (displayFlag) {

            var leftPolygon = svg.append("path")
                .attr("d", pathString)
                .attr("class", "leftPoly")
                .attr("id", "leftPoly_" + d.id);
        }

        return leftPoly;

    },

    generateNeighborhoodPoly: function(pathCoords2d) {

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
