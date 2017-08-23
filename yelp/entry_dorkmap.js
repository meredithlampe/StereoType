/**
 * Created by meredith on 2/20/16.
 */

var MapUtil = require("./js/MapUtil.js");
const TextToSVG = require('text-to-svg');
const d3 = require('d3');
const topojson = require('topojson');

const MAP_FONT = "./css/DIN-Condensed-Bold.ttf";

//var width = 900;
//var height = 1000;
//var rotate = [122, 0, 0];
//var scale = 150000;
//var offset = [1141.329833984375 - 450 + width / 2, 142582.609375 + 30];

var path;
var neighborhoodGroup;

d3.json("json/build_map_config.json", function (error_config, config) {
    svg = d3.select("#mapContainer")
        .append("svg")
        .attr("id", "mapSVG")
        .attr("height", config.height)
        .attr("width", config.width);

    /*
     <pattern id="image" x="0" y="0" patternUnits="userSpaceOnUse" height="1" width="1">
     <image x="0" y="0" xlink:href="url.png"></image>
     </pattern>
     */

    //var defs = svg.append("defs");
    //
    ////debugger;
    //
    //var pattern = defs.append("pattern")
    //    .attr("id", "overlay")
    //    .attr("x", "0")
    //    .attr("y", "0")
    //    .attr("patternUnits", "userSpaceOnUse")
    //    .attr("height", "1000")
    //    .attr("width", "900");
    //
    //pattern.append("image")
    //    .attr("x", "-160")
    //    .attr("y", "125")
    //    .attr("height", "900")
    //    .attr("width", "800")
    //    .attr("xlink:href", "img/background-test-v4.png");
    //
    //svg.append("rect")
    //    .attr("x", "0")
    //    .attr("y", "0")
    //    .attr("fill", "url(#overlay")
    //    .attr("height", "1000")
    //    .attr("width", "900");

    // project map - mercator
    var projection = d3.geoMercator()
        .rotate(JSON.parse(config.rotate))
        .scale(config.scale)
        .translate(JSON.parse(config.offset))
        .precision(.5);

    path = d3.geoPath()
        .projection(projection);


// make container for map
    neighborhoodGroup = svg.append("g")
        .attr('id', 'neighborhoodGroup');


    /*parses json, call back function selects all paths (none exist yet)
     and joins data (all neighborhoods) with each path. since there are no
     paths, all data points are waiting in 'update.enter'. calling
     'enter()' gives us these points, and appends a path for each of them,
     attributing a path and id to each.*/

    var topoGeometries;
    var demographic = {
        "Haller Lake": ".64",
        "Bitter Lake": ".73",
        "Lake City": ".74",
        "Blue Ridge": ".88",
        "Northgate": ".64",
        "Inverness": ".68",
        "North Beach": ".86",
        "Loyal Heights": ".88",
        "Ballard": ".90",
        "Fremont": ".84",
        "University": ".57",
        "Laurelhurst": ".84",
        "Windermere": ".84",
        "Madison Park": ".86",
        "Capitol Hill": ".74",
        "Central Area": ".54",
        "Beacon Hill": ".29",
        "Downtown": ".46",
        "Sodo": ".50",
        "Queen Anne": ".81",
        "Interbay": ".86",
        "Magnolia": ".90",
        "Harbor Island": ".74",
        "West Seattle": ".85",
        "Alki": ".88",
        "Delrid":".45",
        "Fauntleroy": ".86",
        "Arbor Heights": ".85",
        "Georgetown": ".70",
        "Rainier Valley": ".10",
        "Columbia City": ".42",
        "Rainier Beach": ".25"
    };

    //d3.json("json/demographic.json", function (error_demo, demographic) {
        d3.json("json/neighborhoods.json", function (error_neighborhoods, topology) {
            d3.json("build_map_output/neighborhood_chars.json", function (error_chars, chars) {
                d3.json("yelp_api/output.json", function (error_output, bestplaces) {
                    TextToSVG.load(MAP_FONT, function (error_font, textToSVG) {
                        if (error_neighborhoods || error_chars || error_output || error_font) {
                            debugger;
                            console.log("err");
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
                                }).style("fill", "gray")
                                .style("opacity", function(d) {
                                    if (demographic[d.properties.name]) {
                                        return demographic[d.properties.name];
                                    } else {
                                        console.log("no demographic data for " + d.properties.name);
                                        return "0.0";
                                }});

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
            //});
        });

    });
});


