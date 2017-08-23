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
    Clipper = require("./js/Javascript_Clipper_6.2.1.2/clipper.js"),
    NeighborhoodParser = require("./js/NeighborhoodParser.js"),
    TextUtil = require("./js/TextUtil.js"),
    MapUtil = require("./js/MapUtil.js"),
    TextToSVG = require('text-to-svg'),
    topojson = require('topojson'),
    sample_bestplaces = require('./json/SampleBestPlaces.js'),
    TextPoly = require('../TextPoly/TextPoly.js');

var font = "din-condensed-bold";
var font_for_map = './DIN-Condensed-Bold.ttf';

//var seattle_topology = './json/neighborhoods.json';
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

    jsonfile.readFile(seattle_topology, function (err_topo, map) {
        jsonfile.readFile(process.argv[2], function (err_best, bestplaces) {
            TextToSVG.load(font_for_map, function (err_font, textToSVG) {
                if (err_topo || err_best || err_font) {


                    if (err_topo) {
                        console.log(err_topo);
                    }
                    if (err_best) {
                        console.log(err_best);
                    }
                    if (err_font) {
                        console.log(err_font);
                    }
                    process.exit(1);
                }

                var topoGeometries = [];
                for (var i = 0; i < map.features.length; i++) {
                    if (map.features[i].properties.City == "Seattle") {
                        topoGeometries[topoGeometries.length] = map.features[i];
                    }
                }

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
                // loop through each neighborhood
                for (var i = 0; i < topoGeometries.length; i++) {

                    var topo = topoGeometries[i];


                    if (!bestplaces[topo.properties.Name] || !bestplaces[topo.properties.Name].bestmatch) {
                        continue;
                    }

                    console.log("processing " + topo.properties.Name);

                    result[topo.properties.Name] = []; // to store each sub-polygon for this shape
                    output_container.best_places[topo.properties.Name] = bestplaces[topo.properties.Name];

                    // convert path array to 3d array of coordinates
                    var pathCoords3d = NeighborhoodParser.get3dPathArray(
                        path(topo.geometry), topo.geometry.type == "MultiPolygon");

                    // pad polygon between letters and border of shape
                    var solution = pad_polygon(pathCoords3d);

                    // divide phrase into number of polygons that result from
                    // the padding transform
                    var nameNoSpaces = TextUtil.removeSpaces(bestplaces[topo.properties.Name].bestmatch);
                    var slicedNameArray = TextUtil.slicePhrase(solution.length, nameNoSpaces);

                    // for each polygon in the overall shape, fill with text
                    // loop through polygons in result of padding operation
                    for (var poly = 0; poly < solution.length; poly++) {

                        var innerPointsList = "";
                        for (var innerPoint = 0; innerPoint < solution[poly].length; innerPoint++) {
                            if (!isNaN(solution[poly][innerPoint].X)) {
                                var curr = solution[poly][innerPoint];
                                innerPointsList += curr.X + "," + curr.Y + " ";
                            }
                        }
                        var pathCoords3d = NeighborhoodParser.pathArray(innerPointsList);

                        if (topo.properties.Name == "Woodland") {
                            debugger;
                        }

                        debugger;

                        if (pathCoords3d != null) { //coordinates are enough to actually make a shape
                            result[topo.properties.Name][poly] = TextPoly.execute(pathCoords3d, slicedNameArray[poly], 0,
                                font,
                                textToSVG, svg);
                        }
                    }
                }

                // write result out to file
                jsonfile.writeFileSync(outputfile, output_container);
            });
        });
    });
});

function pad_polygon(pathCoords3d) {

    var subj = new Clipper.Paths();
    var solution = new Clipper.Paths();
    //
    for (var poly = 0; poly < pathCoords3d.length; poly++) {

        //var scale = 100;
        var innerArray = [];

        for (var p = 0; p < pathCoords3d[poly].length; p++) {
            innerArray[innerArray.length] = {"X": pathCoords3d[poly][p][0], "Y": pathCoords3d[poly][p][1]};
        }
        //Clipper.JS.ScaleUpPaths(subj, scale);
        subj[poly] = innerArray;
    }
    //
    ////subj[0] = [{"X":348,"Y":257},{"X":364,"Y":148},{"X":362,"Y":148},{"X":326,"Y":241},{"X":295,"Y":219},{"X":258,"Y":88},{"X":440,"Y":129},{"X":370,"Y":196},{"X":372,"Y":275}];
    var co = new Clipper.ClipperOffset(2, 0.25);
    co.AddPaths(subj, Clipper.JoinType.jtRound, Clipper.EndType.etClosedPolygon);
    var offset_val = -4.0;
    co.Execute(solution, offset_val);
    return solution;
}
