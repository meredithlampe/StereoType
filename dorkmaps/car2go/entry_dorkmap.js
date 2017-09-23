/**
 * Created by meredith on 2/20/16.
 */

const Dorkmap = require("../entry_shared.js");
const d3 = require('d3');
const topojson = require('topojson');

function resetLegend(d, i) {

    // set entire legend to be invisible
    d3.select(".maplegend").style("visibility", "hidden");

    var poly = d3.select(this);

    // weird scrolling thing -- gotta save scroll top
    var oldScrollTop = document.body.scrollTop;
    var name = d3.select("#neighborhoodname");
    name.style("visibility", "hidden");
    name.html("Hover to see name of neighborhood.");

    var phraseBox = d3.select("#neighborhoodphrase");
    phraseBox.style("visibility", "hidden");
    phraseBox.html("Hover to see zindex of neighborhood.");

    var pathinpoly = poly.select(".neighborhoodOutline");
    if (d3.select("#demographic_legend").style("visibility") == "hidden") {
        // legend is hidden, which means that map is not colored
        pathinpoly.style("fill", "white");
    }

    // pathinpoly.classed("neighborhoodFocus", false);
    // pathinpoly.classed("neighborhoodUnFocus", true);

    var chars = poly.selectAll(".charSVGThing").style("fill", "black");

    // set scrolling top so that we don't scroll
    document.body.scrollTop = oldScrollTop;
}

function setLegend(d, i) {

    d3.select(".maplegend").style("visibility", "visible");

    var poly = d3.select(this);

    // weird scrolling thing -- gotta save scroll top
    var oldScrollTop = document.body.scrollTop;

    // set name
    var name = d3.select("#neighborhoodname");

    if (d.properties.name == "") {
        name.style("visibility", "hidden");
        name.html("N/A");
    } else {
        name.html(d.properties.name);
        name.style("visibility", "visible");
    }

    // set phrase
    var phraseBox = d3.select("#neighborhoodphrase");
    var phrase = poly.attr("phrase");

    if (!phrase || phrase == "") {
        phraseBox.style("visibility", "hidden");
        phraseBox.html("filler");
    } else {
        phraseBox.html(phrase);
        phraseBox.style("visibility", "visible");
    }

    var chars = poly.selectAll(".charSVGThing");
    chars.style("fill", "white");

    var pathinpoly = poly.select(".neighborhoodOutline");
    if (d3.select("#demographic_legend").style("visibility") == "hidden") {
        // legend is hidden, which means that map is not colored
        pathinpoly.style("fill", "black");
    }
    // pathinpoly.classed("neighborhoodUnFocus", false);
    // pathinpoly.classed("neighborhoodFocus", true);

    // set scrolling top so that we don't scroll
    document.body.scrollTop = oldScrollTop;
}

function attachAPIOutputToElements(elem, d, api_output) {
    d3.select(elem)
        .attr("phrase", function (d) {
            return api_output[d.properties.name];
        });
}

function getTopoGeometries(topology) {
    return topojson.feature(topology, topology.objects.neighborhoods).features;
}

Dorkmap.appendMap(setLegend,
    resetLegend,
    attachAPIOutputToElements,
    getTopoGeometries,
    "#00adf0");
