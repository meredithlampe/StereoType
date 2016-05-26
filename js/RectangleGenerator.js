/**
 * Created by meredith on 5/25/16.
 */
var RectangleGenerator = {
    //location parameter is: top, left, right, bottom relative to center inscribed rectangle
    generateInscribedRectangle: function(polyCoordinates, d, displayFlag, location) {

        var rectangle;

        //look up rectangle with given neighborhood and location.
        //if exists, use rect from database

        var savedNeighborhood = rectDatabase[d.properties.name];
        if (savedNeighborhood != null && d.id != -1 && USE_RECTANGLE_DATABASE) {
            //if (false) {
            var savedRect = rectDatabase[d.properties.name][location];
            //use rect from database (may be null--should be ok)
            rectangle = savedRect;
        } else {
            //generate largest inscribed rectangle for overall polygon
            rectangle = d3plus.geom.largestRect(polyCoordinates, {
                angle: [0, 90, 270], nTries: 50, tolerance: 0.02
            });
        }

        if (d.id == -1) {
            if (location === "center") {
                rectDatabase[d.properties.name] = {};
            }
            rectDatabase[d.properties.name][location] = rectangle;
            console.log(JSON.stringify(rectDatabase));
        }


        //should factor this out into view
        if (rectangle != null && rectangle[0] != null && displayFlag) {
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
    },

    //finds four corners of given rectangle object
    //rectangle object is of form returned by d3plus.geom.largestRect
    findRectangleCorners: function(rectangle) {

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
        }

        return rectCoords;
    },


    generateInscribedRectObject: function(rectangle, location, d) {
        return {
            rect: rectangle,
            location: location,
            num: d.id
        };
    },


    //apply padding dictated in global padding variable
    //effectively shrink available space in rectangle by changing corner coordinates and area
    applyPadding: function(rectangle) {
        rectangle.corners.leftX += (padding / 2.0);
        rectangle.corners.rightX -= (padding / 2.0);
        rectangle.corners.lowY -= (padding / 2.0);
        rectangle.corners.topY += (padding / 2.0);

        rectangle.area = (rectangle.corners.lowY - rectangle.corners.topY)
            * (rectangle.corners.rightX - rectangle.corners.leftX);
        return rectangle;
    }
};