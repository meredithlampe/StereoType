/**
 * Created by meredith on 2/20/16.
 */

var MapUtil = require("./js/MapUtil.js");
const TextToSVG = require('text-to-svg');
const d3 = require('d3');
const topojson = require('topojson');

//var width = 900;
//var height = 1000;
//var rotate = [122, 0, 0];
//var scale = 149000;
//var offset = [1141.329833984375 - 450 + width / 2, 141700.609375];

const MAP_FONT = "./css/DIN-Condensed-Bold.ttf";
var path;
var neighborhoodGroup;

d3.json("json/build_map_config_dorkmap.json", function(error_config, config) {
    var svg = d3.select("#mapContainer")
        .append("svg")
        .attr("id", "mapSVG")
        .attr("height", config.height)
        .attr("width", config.width);

    var defs = svg.append("defs");

    //debugger;

    var pattern = defs.append("pattern")
        .attr("id", "overlay")
        .attr("x", "0")
        .attr("y", "0")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("height", "1000")
        .attr("width", "900");

    pattern.append("image")
        .attr("x", "-270")
        .attr("y", "23")
        .attr("height", "1160")
        .attr("width", "1100")
        .attr("xlink:href", "img/demo0.png");

    svg.append("rect")
        .attr("id", "demo_image")
        .attr("x", "0")
        .attr("y", "0")
        .attr("z", "-100")
        .attr("fill", "url(#overlay")
        .attr("height", "1000")
        .attr("width", "900")
        .attr("visibility", "hidden");

    // project map - mercator
    var projection = d3.geoMercator()
        .rotate(JSON.parse(config.rotate))
        .scale(config.scale)
        .translate(JSON.parse(config.offset))
        .precision(.5);

    path = d3.geoPath()
        .projection(projection);

    neighborhoodGroup = svg.append("g")
        .attr('id', 'neighborhoodGroup');

    d3.select("#demographic_button")
        .on("click", function() {
            var demo_image = d3.select("#demo_image");
            var visibility = demo_image.attr("visibility");
            if (visibility == "visible") {
                demo_image.attr("visibility", "hidden");
            } else {
                demo_image.attr("visibility", "visible");
            }
        });
});



/*parses json, call back function selects all paths (none exist yet)
  and joins data (all neighborhoods) with each path. since there are no
  paths, all data points are waiting in 'update.enter'. calling
  'enter()' gives us these points, and appends a path for each of them,
  attributing a path and id to each.*/

var topoGeometries;

d3.json("json/zillow_neighborhoods.json", function (error_neighborhoods, zillow_map) {
    d3.json("build_map_output/neighborhood_chars.json", function (error_chars, chars) {
        d3.json("zillow_api/zillow_response_trimmed.json", function (error_output, zillow) {
            TextToSVG.load(MAP_FONT, function (error_font, textToSVG) {
                if (error_neighborhoods || error_chars || error_output || error_font) {
                    console.log("error"); // lol bad
                } else {
                    topoGeometries = [];
                    for (var i = 0; i < zillow_map.features.length; i++) {
                        if (zillow_map.features[i].properties.City == "Seattle") {
                            topoGeometries[topoGeometries.length] = zillow_map.features[i];
                        }
                    }
                    //generate paths around each neighborhood
                    var binding = neighborhoodGroup.selectAll(".neighborhood")
                        .data(topoGeometries);

                    binding.enter()
                        .append("g")
                        .attr("neighborhoodBounds", path)
                        .attr("class", "neighborhood")
                        .append("path")
                        .attr("d", path)
                        .attr("class", "neighborhoodUnFocus neighborhoodOutline")
                        .attr("id", function (d) {
                            return "n_" + d.id
                        });


                    // fill text
                    neighborhoodGroup.selectAll(".neighborhood")
                        .each(function (d) {
                            // get chars for neighborhood from file
                            var chars_for_neighborhood = chars.result[d.properties.Name];
                            if (chars_for_neighborhood) {
                                for (var poly = 0; poly < chars_for_neighborhood.length; poly++) {
                                    for (var i = 0; i < chars_for_neighborhood[poly].length; i++) {
                                        d3.select(this).append("path")
                                            .attr("d", chars_for_neighborhood[poly][i])
                                            .classed("charSVGThing", true);
                                    }
                                }
                            }
                        })
                    .attr("phrase", function (d) {
                        if (zillow[d.properties.Name]) {
                            return '$' + numberWithCommas(zillow[d.properties.Name].bestmatch);
                        } else {
                            return "";
                        }
                    })
                    .on("mouseover", MapUtil.setLegend)
                    .on("mouseout", MapUtil.resetLegend);
                }
            });
        });
    });

});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


