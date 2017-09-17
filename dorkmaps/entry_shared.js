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
