const TextToSVG = require('text-to-svg');
const d3 = require('d3');

export function appendMapSVG(config) {
    return d3.select("#mapContainer")
        .append("svg")
        .attr("id", "mapSVG")
        .attr("height", config.height)
        .attr("width", config.width);
}

export function buildProjection(config) {
    var projection = d3.geoMercator()
        .rotate(JSON.parse(config.rotate))
        .scale(config.scale)
        .translate(JSON.parse(config.offset))
        .precision(.5);
    return projection;
}

export function toggleDemographicVisibility(fill_hex) {
    var legend = d3.select("#demographic_legend");
    if (legend.style("visibility") == "hidden") {
        // make visible
        legend.style("visibility", "visible");
        var outlines = d3.selectAll(".neighborhoodOutline")
            .each(function(d) {
                d3.select(this).style("fill", fill_hex);
            });
            // .attr("fill", "#1491ff");
    } else {
        legend.style("visibility", "hidden");
        // d3.selectAll(".neighborhoodOutline").attr("fill", "white");
        var outlines = d3.selectAll(".neighborhoodOutline")
            .each(function(d) {
                d3.select(this).style("fill", "white");
            });
    }
}
