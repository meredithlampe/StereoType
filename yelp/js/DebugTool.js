/**
 * Created by meredith on 5/25/16.
 */
var DebugTool = {

    colors: ["#DCDCDD", "#C5C3C6", "#46494C", "#4C5C68", "#1985A1", "#114B5F"],
    colorfulColors: ["#9D8189", "#F4ACB7", "#FFCAD4", "#FFE5D9", "#D8E2DC"],

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

    showInCenterOfPoly: function(pathCoords3d, message, verticalOffset) {

        //get height and width of polygon
        var dimensions = NeighborhoodParser.getNeighborhoodDimensions(pathCoords3d, 0);
        var heightOfPoly = dimensions.max - dimensions.min;
        var widthOfPoly = dimensions.right - dimensions.left;

        //find middle point
        var middleY = dimensions.max - (heightOfPoly / 2);
        var middleX = dimensions.left + (widthOfPoly / 2);

        svg.append("text").text(message + "").attr("font-size", 10 + "pt")
            .attr("x", middleX).attr("y", middleY + verticalOffset);
    },

    appendRect: function(svg, rectangle, d) {
        svg.append("rect")
            .attr("width", rectangle[0].width)
            .attr("height", rectangle[0].height)
            .attr("x", rectangle[0].cx - (rectangle[0].width / 2))
            .attr("y", rectangle[0].cy - (rectangle[0].height / 2))
            .attr("transform", "rotate(" + rectangle[0].angle + "," + rectangle[0].cx + "," + rectangle[0].cy + ")")
            .attr("id", function() {
                return "rect_" + d.id + "_" + location;
            })
            .attr("fill", "white")
            .attr("opacity", "0.5");
    }
};