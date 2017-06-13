/**
 * Created by meredith on 6/12/17.
 */

//const d3node = require('d3-node');
//const d3n = new d3node(); // initializes D3 with container element
//const d3 = d3n.d3;

const d3 = require('d3');

// make fake svg to use for letter fitting
const mock_browser = require('mock-browser').mocks.MockBrowser;
var mock = new mock_browser(),
    doc = mock.getDocument(),
    svg = d3.select(doc.createElement('svg'));

const jsonfile = require('jsonfile'),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    xhr = new XMLHttpRequest(),
    Clipper = require("./js/Javascript_Clipper_6.2.1.2/clipper.js"),
    NeighborhoodParser = require("./js/NeighborhoodParser.js"),
    TextUtil = require("./js/TextUtil.js"),
    MapUtil = require("./js/MapUtil.js"),
    TextToSVG = require('text-to-svg'),
    //raphael = require('raphael'),
     topojson = require('topojson'),
    sample_bestplaces = require('./js/SampleBestPlaces.js');

var HORIZONTAL_SLICE_CAP = 6;
var CHAR_ASPECT_RATIO = .5;
var TEXT_SIZE_MULTIPLIER = 1.5;

var font = "din-condensed-bold";
var file = './json/neighborhoods.json';
var font_for_map = './css/DIN-Condensed-Bold.ttf';

// copied from the yelp stereotype page --> bad
var rotate = [122, 0, 0];
var scale = 150000;
var width = 900;
var offset = [1141.329833984375 - 450 + width / 2, 142582.609375 + 30];

var projection = d3.geoMercator()
    .rotate(rotate)
    .scale(scale)
    .translate(offset)
    .precision(.5);

var path = d3.geoPath()
    .projection(projection);

jsonfile.readFile(file, function (err, topology) {
    TextToSVG.load(font_for_map, function (err, textToSVG) {
        var topoGeometries = topojson.feature(topology, topology.objects.neighborhoods)
            .features;
        var bestplaces = sample_bestplaces;

        for (var i = 0; i < topoGeometries.length; i++) {

            var topo = topoGeometries[i];

            // convert path array to 3d array of coordinates
            var pathCoords3d = NeighborhoodParser.get3dPathArray(
                path(topo.geometry), topo.geometry.type == "MultiPolygon");

            // pad polygon between letters and border of shape
            var solution = pad_polygon(pathCoords3d);

            // divide phrase into number of polygons that result from
            // the padding transform
            var nameNoSpaces = TextUtil.removeSpaces(bestplaces[topo.properties.name].bestmatch);
            var slicedNameArray = TextUtil.slicePhrase(solution.length, nameNoSpaces);

            // for each polygon in the overall shape, fill with text
            for (var poly = 0; poly < solution.length; poly++) {
                var innerPointsList = "";
                for (var innerPoint = 0; innerPoint < solution[poly].length; innerPoint++) {
                    if (!isNaN(solution[poly][innerPoint].X)) {
                        var curr = solution[poly][innerPoint];
                        innerPointsList += curr.X + "," + curr.Y + " ";
                    }
                }
                var pathCoords3d = NeighborhoodParser.pathArray(innerPointsList);

                if (pathCoords3d != null) { //coordinates are enough to actually make a shape
                    MapUtil.horizontalSliceAlg(pathCoords3d, topo, slicedNameArray[poly], 0,
                        TEXT_SIZE_MULTIPLIER, font, HORIZONTAL_SLICE_CAP, CHAR_ASPECT_RATIO,
                        textToSVG, TextToSVG, null, svg);
                }
            }

        }
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
