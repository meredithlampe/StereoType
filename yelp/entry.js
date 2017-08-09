/**
 * Created by meredith on 2/20/16.
 */

var MapUtil = require("./js/MapUtil.js");
const TextToSVG = require('text-to-svg');
const d3 = require('d3');
const topojson = require('topojson');

var width = 900;
var height = 1000;
var rotate = [122, 0, 0];
var scale = 150000;
var offset = [1141.329833984375 - 450 + width / 2, 142582.609375 + 30];

const MAP_FONT = "./css/DIN-Condensed-Bold.ttf";

// make container for map
var svg = d3.select(".mapcontainer")
    .attr("id", "mapContainer")
    .append("svg")
    .attr("id", "mapSVG")
    .attr("height", height);

// project map - mercatorjjj
var projection = d3.geoMercator()
    .rotate(rotate)
    .scale(scale)
    .translate(offset)
    .precision(.5);
var path = d3.geoPath()
    .projection(projection);

var neighborhoodGroup = svg.append("g")
    .attr('id', 'neighborhoodGroup');

/*parses json, call back function selects all paths (none exist yet)
  and joins data (all neighborhoods) with each path. since there are no
  paths, all data points are waiting in 'update.enter'. calling
  'enter()' gives us these points, and appends a path for each of them,
  attributing a path and id to each.*/

var topoGeometries;

d3.json("json/neighborhoods.json", function (error_neighborhoods, topology) {
    d3.json("../build_map/json/neighborhoodChars.json", function (error_chars, chars) {
        d3.json("yelp_api/output.txt", function (error_output, bestplaces) {
            TextToSVG.load(MAP_FONT, function (error_font, textToSVG) {
                if (error_neighborhoods || error_chars || error_output || error_font) {
                    console.log(err);
                } else {
                    topoGeometries = topojson.feature(topology, topology.objects.neighborhoods).features;
                    //generate paths around each neighborhood
                    var binding = neighborhoodGroup.selectAll(".neighborhood")
                        .data(topoGeometries);

                    binding.enter()
                        .append("g")
                        .attr("neighborhoodBounds", path)
                        .attr("class", "neighborhood")
                        .append("path")
                        .attr("d", path)
                        .attr("class", "neighborhoodUnFocus")
                        .attr("class", "neighborhoodOutline")
                        .attr("id", function (d) {
                            return "n_" + d.id
                        });

                    // fill text
                    neighborhoodGroup.selectAll(".neighborhood")
                        .each(function (d) {
                            // get chars for neighborhood from file
                            var chars_for_neighborhood = chars.result[d.properties.name];
                            for (var poly = 0; poly < chars_for_neighborhood.length; poly++) {
                                for (var i = 0; i < chars_for_neighborhood[poly].length; i++) {
                                    d3.select(this).append("path")
                                        .attr("d", chars_for_neighborhood[poly][i])
                                        .classed("charSVGThing", true);
                                }
                            }
                        })
                    .attr("phrase", function (d) {
                        return bestplaces[d.properties.name].bestmatch;
                    })
                    .attr("categories", function (d) {
                        return JSON.stringify(bestplaces[d.properties.name].categories);
                    })
                    .attr("price", function (d) {
                        return bestplaces[d.properties.name].price;
                    })
                    .attr("reviewcount", function (d) {
                        return bestplaces[d.properties.name].review_count;
                    })
                    .on("mouseover", MapUtil.setLegend)
                        .on("mouseout", MapUtil.resetLegend);
                }
            });
        });
    });

});


