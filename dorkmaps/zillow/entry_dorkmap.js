/**
 * Created by meredith on 2/20/16.
 */

require("../entry_shared.js");
const TextToSVG = require('text-to-svg');
const d3 = require('d3');
const MAP_FONT = "./css/DIN-Condensed-Bold.ttf";
var MapUtil = require("../js/MapUtil.js"); // relative from yelp and zillow files
const topojson = require('topojson');

var path;
var neighborhoodGroup;
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
    "Delrid": ".45",
    "Fauntleroy": ".86",
    "Arbor Heights": ".85",
    "Georgetown": ".70",
    "Rainier Valley": ".10",
    "Columbia City": ".42",
    "Rainier Beach": ".25",
    "Sand Point": ".7862",
    "South Park": ".8590",
    "Pinehurst": ".8429",
    "Brighton": ".1484",

    "Maple Leaf": ".7647",

    "Sunset Hill": ".8982",

    "Broadmoor": ".8568",

    "Whittier Heights": ".8813",

    "High Point": ".8045",

    "View Ridge": ".8290",

    "Matthews Beach": ".8336",

    "Wedgwood": ".7970",

    "South Lake Union": ".8020",

    "First Hill": ".7195",

    "Lower Queen Anne": ".8120",

    "Eastlake": ".8522",

    "Mount Baker": ".7747",

    "Meadowbrook": ".6780",

    "Admiral": ".8515",

    "North College Park": ".7508",

    "Atlantic": ".3637",

    "Denny - Blaine": ".7747",

    "Madison Valley": ".7676",

    "Central District": ".5726",

    "International District": ".7897",

    "Industrial District": ".4975",

    "University District": ".5726",

    "Roosevelt": ".8202",

    "Pioneer Square": ".4563",

    "Portage Bay": ".8522",

    "Roxhill": ".9049",

    "North Delridge": ".8307",

    "Highland Park": ".8594",

    "Wallingford": ".8505",

    "Hawthorne Hills": ".8165",

    "Greenwood": ".8567",

    "Leschi": ".7747",

    "Riverview": ".5215",

    "Montlake": ".8568",

    "Green Lake": ".8760",

    "Olympic Hills": ".6661",

    "Ravenna": ".8429",

    "Crown Hill": ".7716",

    "Madrona": ".7747",

    "Broadview": ".8771",

    "Seward Park": ".5911",

    "Olympic Manor": ".8965",

    "South Delridge": ".5510",

    "Cedar Park": ".5859",

    "Victory Heights": ".6661",

    "Phinney Ridge": ".8943",

    "Belltown": ".7140",

    "Bryant": ".8183",
    "Westlake": ".960",
    "Denny-Blaine": ".462",
    "Minor": ".826",
    "North Beacon Hill": ".451",
    "South Beacon Hill": ".530",
    "Uptown": ".918",
    "Fairmount Park": ".960",
    "Mt. Baker": ".538",
    "Holly Park": ".626",
    "East Queen Anne": ".974",
    "Denny Triangle": ".918",
    "Central": ".462",
    "Waterfront": ".761",
    "Junction": ".983",
    "Rainier View": ".981",
    "Dunlap": ".800",
    "Lakewood": ".658",
    "Yesler Terrace": ".729",
    "West Queen Anne": ".960",
    "Garfield": ".140",
    "Judkins Park": ".451",
    "Jackson Place": ".140",
    "Little Saigon": ".382",
    "Seaview": ".981",
    "North Queen Anne": ".974",
    "Woodland": ".975",
    "West Woodland": ".967",
    "Gatewood": ".982",
    "Hillman City": ".670",
    "Genesee": ".976"
};

d3.json("json/build_map_config_dorkmap.json", function (error_config, config) {
    var svg = d3.select("#mapContainer")
        .append("svg")
        .attr("id", "mapSVG")
        .attr("height", config.height)
        .attr("width", config.width);

    // var defs = svg.append("defs");
    //
    // //debugger;
    //
    // var pattern = defs.append("pattern")
    //     .attr("id", "overlay")
    //     .attr("x", "0")
    //     .attr("y", "0")
    //     .attr("patternUnits", "userSpaceOnUse")
    //     .attr("height", "1000")
    //     .attr("width", "900");
    //
    // pattern.append("image")
    //     .attr("x", "-270")
    //     .attr("y", "23")
    //     .attr("height", "1160")
    //     .attr("width", "1100")
    //     .attr("xlink:href", "img/demo0.png");
    //
    // svg.append("rect")
    //     .attr("id", "demo_image")
    //     .attr("x", "0")
    //     .attr("y", "0")
    //     .attr("z", "-100")
    //     .attr("fill", "url(#overlay")
    //     .attr("height", "1000")
    //     .attr("width", "900")
    //     .attr("visibility", "hidden");

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

    // d3.select("#demographic_button")
    //     .on("click", function () {
    //         var demo_image = d3.select("#demo_image");
    //         var demo_key = d3.select("#demo_key");
    //         var visibility = demo_image.attr("visibility");
    //         if (visibility == "visible") {
    //             demo_image.attr("visibility", "hidden");
    //             demo_key.style("visibility", "hidden");
    //         } else {
    //             demo_image.attr("visibility", "visible");
    //             demo_key.style("visibility", "visible");
    //         }
    //     });
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
                        .attr("class", "neighborhoodFocus")
                        .attr("class", "neighborhoodOutline")
                        .attr("id", function (d) {
                            return "n_" + d.id
                        })
                        .style("fill", "#1491ff")
                        .style("opacity", function (d) {
                            if (demographic[d.properties.Name]) {
                                return demographic[d.properties.Name];
                            } else {
                                console.log("no demographic data for " + d.properties.Name);
                                return "0.0";
                            }
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


