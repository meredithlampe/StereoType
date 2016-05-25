/**
 * Created by meredith on 5/25/16.
 */
var DebugTool = {

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

    }
};