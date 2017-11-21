/**
 * Created by meredith on 6/12/17.
 */

//const d3node = require('d3-node');
//const d3n = new d3node(); // initializes D3 with container element
//const d3 = d3n.d3;

/*
 USAGE:
 node build_map.js <phrases_for_map_file> <output_file>
 */
if (!process.argv[2] || !process.argv[3] || !process.argv[4] || !process.argv[5]) {
    console.log("usage: node build_map.js <phrases_for_map_file> <output_file> <config> <shapefile>");
    process.exit(1); // failure
}

const d3 = require('d3');

// make fake svg to use for letter fitting
const mock_browser = require('mock-browser').mocks.MockBrowser;
var mock = new mock_browser(),
    doc = mock.getDocument(),
    svg = d3.select(doc.createElement('svg'));

const jsonfile = require('jsonfile'),
    NeighborhoodParser = require("./js/NeighborhoodParser.js"),
    TextUtil = require("./js/TextUtil.js"),
    topojson = require('topojson'),
    sample_bestplaces = require('./json/SampleBestPlaces.js'),
    TextPoly = require('../TextPoly/TextPoly.js');


var font = "din-condensed-bold";
var font_for_map = './DIN-Condensed-Bold.ttf';

var seattle_topology = process.argv[5];
var outputfile = process.argv[3];

jsonfile.readFile(process.argv[4], function (error_config, config) {

    if (error_config) {
        console.log(error_config);
    }

    // have to JSON.parse rotate and offset because they're arrays in
    // string form

    var projection = d3.geoMercator()
        .rotate(JSON.parse(config.rotate))
        .scale(config.scale)
        .translate(JSON.parse(config.offset))
        .precision(.5);

    var path = d3.geoPath()
        .projection(projection);

    jsonfile.readFile(seattle_topology, function (err_topo, topology) {
        jsonfile.readFile(process.argv[2], function (err_best, bestplaces) {
                if (err_topo || err_best) {
                    if (err_topo) {
                        console.log(err_topo);
                    }
                    if (err_best) {
                        console.log(err_best);
                    }
                    process.exit(1);
                }

                var topoGeometries = topojson.feature(topology, topology.objects.neighborhoods)
                    .features;
                //var bestplaces = sample_bestplaces;
                // to contain result (result of text fitting) and actual text of best matches for neighborhood
                var output_container = {};
                var result = {};
                output_container.result = result;
                output_container.best_places = {};

                // result will be:
                /*  {
                 "NeighborhoodName":
                 [
                 first char path , // char paths are strings
                 second char path,
                 ...
                 last char path in neighborhood
                 ]
                 "SecondNeighborhoodName":
                 [
                 ""
                 ]

                 }
                 */

                var shapes_left = topoGeometries.length; // we'll at least need to call TextPoly this num times
                // loop through each neighborhood
                for (var i = 0; i < topoGeometries.length; i++) {

                    var topo = topoGeometries[i];

                    if (!bestplaces[topo.properties.name] || !bestplaces[topo.properties.name].bestmatch) {
                        continue;
                    }

                    console.log("processing " + topo.properties.name);

                    result[topo.properties.name] = []; // to store each sub-polygon for this shape
                    output_container.best_places[topo.properties.name] = bestplaces[topo.properties.name];

                    // convert path array to 3d array of coordinates
                    var pathCoords3d = NeighborhoodParser.get3dPathArray(
                        path(topo.geometry), topo.geometry.type == "MultiPolygon");

                    // divide phrase into number of polygons that result from
                    // the padding transform
                    var nameNoSpaces = TextUtil.removeSpaces(bestplaces[topo.properties.name].bestmatch);

                    var shape_info = {
                        name: topo.properties.name,
                        index: 0
                    };

                    if (pathCoords3d !== null) { //coordinates are enough to actually make a shape
                        TextPoly.execute(
                            pathCoords3d, // shape outline
                            nameNoSpaces, // phrase
                            4, // padding
                            font_for_map, // font file
                            svg, // phantom SVG (move this into library)
                            function(chars, shape_info) {
                                console.log("shapes left" + shapes_left);
                                shapes_left--;
                                result[shape_info.name][shape_info.index] = chars;

                                // if we're at the end of all of our for-loops, write to file
                                if (shapes_left == 0) {
                                    // write result out to file
                                    jsonfile.writeFileSync(outputfile, output_container);
                                }
                            },
                            shape_info // rando json to use in callback
                        );
                    }
                }

        });
    });
});
