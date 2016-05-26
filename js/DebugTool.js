/**
 * Created by meredith on 5/25/16.
 */
var DebugTool = {

    colors: ["red", "orange", "yellow", "green", "blue", "purple"],

    markFourCorners: function(rectTopYCoord, rectLowYCoord, rectLeftXCoord, rectRightXCoord) {
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
    },

    //appends circles of increasing size to coordinates
    //used to tell direction in which coordinates are given
    displayClockwiseIndicator: function(pathCoords2d) {
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

    },

    showInCenterOfPoly: function(pathCoords2d, message, verticalOffset) {

        //get height and width of polygon
        var dimensions = NeighborhoodParser.getNeighborhoodDimensions(pathCoords2d);
        var heightOfPoly = dimensions.max - dimensions.min;
        var widthOfPoly = dimensions.right - dimensions.left;

        //find middle point
        var middleY = dimensions.max - (heightOfPoly / 2);
        var middleX = dimensions.left + (widthOfPoly / 2);

        svg.append("text").text(message).attr("font-size", 10 + "pt")
            .attr("x", middleX).attr("y", middleY + verticalOffset);
    }
};