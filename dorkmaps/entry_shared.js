const d3 = require('d3');
const topojson = require('topojson');

// percentage of white residents of each neighborhood
// in seattle
const demographic = {
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
    "Denny-Blaine": ".462"
};

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
    } else {
        legend.style("visibility", "hidden");
        var outlines = d3.selectAll(".neighborhoodOutline")
            .each(function(d) {
                d3.select(this).style("fill", "white");
            });
    }
}

export function appendMap(onMousoverNeighborhood, onMouseLeaveNeighborhood) {

    d3.json("json/build_map_config.json", function (error_config, config) {

        // append SVG to hold map
        var svg = appendMapSVG(config);

        // project map - mercator
        var projection = buildProjection(config);

        var path = d3.geoPath()
            .projection(projection);

        // make container for map
        var neighborhoodGroup = svg.append("g")
            .attr('id', 'neighborhoodGroup');

        d3.select("#demographic_button")
            .on("click", function () {
                module.exports.toggleDemographicVisibility("#00adf0");
            });

        /*parses json, call back function selects all paths (none exist yet)
         and joins data (all neighborhoods) with each path. since there are no
         paths, all data points are waiting in 'update.enter'. calling
         'enter()' gives us these points, and appends a path for each of them,
         attributing a path and id to each.*/

        var topoGeometries;
        var curr_min_white_percentage = 1.0;
        var curr_max_white_percentage = 0;

        //d3.json("json/demographic.json", function (error_demo, demographic) {
        d3.json("json/neighborhoods.json", function (error_neighborhoods, topology) {
            d3.json("build_map_output/neighborhood_chars.json", function (error_chars, chars) {
                d3.json("api/output.json", function (error_output, api_output) {
                    if (error_neighborhoods || error_chars || error_output) {
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
                            }).style("opacity", function (d) {
                            if (demographic[d.properties.name]) {
                                curr_max_white_percentage = Math.max(curr_max_white_percentage, demographic[d.properties.name]);
                                curr_min_white_percentage = Math.min(curr_min_white_percentage, demographic[d.properties.name]);
                                return demographic[d.properties.name];
                            } else {
                                console.log("no demographic data for " + d.properties.name);
                                return "0.0";
                            }
                        });

                        // fill text
                        neighborhoodGroup.selectAll(".neighborhood")
                            .each(function (d) {
                                // get chars for neighborhood from file
                                var chars_for_neighborhood = chars.result[d.properties.name];
                                if (chars_for_neighborhood != null) {
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
                                return api_output[d.properties.name];
                            })
                            .on("mouseover", onMousoverNeighborhood)
                            .on("mouseout", onMouseLeaveNeighborhood);

                        // make legend

                    }
                });
                //});
            });

        });
    });

}
