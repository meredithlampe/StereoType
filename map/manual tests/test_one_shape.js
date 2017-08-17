/**
 * Created by meredith on 8/14/17.
 */

const font = "din-condensed-bold";
const font_for_map = './DIN-Condensed-Bold.ttf';
const phinney = [
    [
        [ 250.89612881715993, 282.0590479892853 ],
    [ 250.89612881715993, 283.3176339966594 ],
    [ 250.89612881715993, 284.57621219710563 ],
    [ 250.89612881715993, 298.420057193056 ],
    [ 231.67007789059141, 299.67854172259104 ],
    [ 213.92295395835902, 298.420057193056 ],
    [ 213.92295395835902, 309.74613698959 ],
    [ 212.4440269640229, 309.74613698959 ],
    [ 210.96509996962027, 309.74613698959 ],
    [ 209.48617297528426, 309.74613698959 ],
    [ 209.48617297528426, 308.4877148964151 ],
    [ 208.00724598094814, 308.4877148964151 ],
    [ 206.52831898661213, 307.2292849991354 ],
    [ 205.0493919922095, 305.97084729769267 ],
    [ 203.57046499794, 304.7124017919705 ],
    [ 200.61261100920137, 300.93701844714815 ],
    [ 200.61261100920137, 299.67854172259104 ],
    [ 199.13368401486525, 298.420057193056 ],
    [ 197.65475702052925, 295.90306471838267 ],
    [ 197.65475702052925, 293.38604102187674 ],
    [ 196.1758300261265, 292.1275174651528 ],
    [ 196.1758300261265, 256.8856882020191 ],
    [ 182.86548707696886, 256.8856882020191 ],
    [ 182.86548707696886, 227.9324624898727 ],
    [ 239.0647128623383, 227.9324624898727 ],
    [ 239.0647128623383, 234.22699351268238 ],
    [ 239.0647128623383, 235.48587628017412 ],
    [ 239.0647128623383, 236.744751235703 ],
    [ 239.0647128623383, 238.00361837938544 ],
    [ 237.58578586800218, 238.00361837938544 ],
    [ 237.58578586800218, 239.26247771130875 ],
    [ 237.58578586800218, 240.52132923161844 ],
    [ 236.10685887359955, 245.55665719951503 ],
    [ 236.10685887359955, 248.07427431744873 ],
    [ 236.10685887359955, 249.33307116036303 ],
    [ 236.10685887359955, 250.59186019279878 ],
    [ 236.10685887359955, 251.85064141484327 ],
    [ 234.62793187926354, 253.10941482667113 ],
    [ 234.62793187926354, 254.36818042839877 ],
    [ 233.14900488492742, 254.36818042839877 ],
    [ 233.14900488492742, 256.8856882020191 ],
    [ 233.14900488492742, 258.1444303742901 ],
    [ 234.62793187926354, 259.40316473698476 ],
    [ 234.62793187926354, 260.6618912903068 ],
    [ 236.10685887359955, 261.92061003428535 ],
    [ 236.10685887359955, 263.1793209691241 ],
    [ 237.58578586800218, 264.4380240949977 ],
    [ 239.0647128623383, 265.6967194120225 ],
    [ 240.5436398566743, 266.9554069203441 ],
    [ 240.5436398566743, 269.4727585113433 ],
    [ 240.5436398566743, 270.7314225943119 ],
    [ 242.02256685107704, 273.2487273357983 ],
    [ 242.02256685107704, 274.5073679946363 ],
    [ 242.02256685107704, 275.76600084573147 ],
    [ 243.50149384541305, 275.76600084573147 ],
    [ 243.50149384541305, 277.02462588905473 ],
    [ 244.98042083974906, 278.28324312501354 ],
    [ 249.4172018228238, 279.5418525536079 ],
    [ 250.89612881715993, 279.5418525536079 ],
    [ 250.89612881715993, 280.8004541749833 ],
    [ 250.89612881715993, 282.0590479892853 ] ] ];
const phinney_grid_1 = [[
    [203.25,
    268.5],
    [200,
    268.5],
    [200,
    257],
    [199,
    254],
    [196,
    253],
    [187,
    253],
    [187,
    232],
    [203.25,
    232]] ];
const phinney_grid_2 = [[
    [ 219.5, 268.5], [203.25, 268.5], [203.25, 232], [219.5, 232]] ];
const phinney_grid_3 = [[
    [ 219.5,
    232],
    [235,
    232],
    [235,
    235],
    [234,
    238],
    [234,
    239],
    [232,
    244],
    [232,
    251],
    [231,
    251],
    [231,
    251],
    [229,
    254],
    [229,
    258],
    [231,
    261],
    [232,
    264],
    [235,
    267],
    [235.75,
    268.5],
    [219.5,
    268.5 ] ] ];

var test = phinney;
var testb = phinney_grid_3;

const TextToSVG = require('text-to-svg');
const TextPoly = require('../../TextPoly/bundle.js');

var path = "M" + test[0][0][0] + "," + test[0][0][1];
for (var i = 0; i < test.length; i++) {
   for (var j = 0;j < test[i].length; j++) {
        // append coords to SVG path
       path += "L" + test[i][j][0] + "," + test[i][j][1];
   }
}
path += "Z";

var svg = d3.select("#map");

svg.attr("height", 1000)
    .attr("width","100%")
    .append("path")
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("d", path);

var path_b = "M" + testb[0][0][0] + "," + testb[0][0][1];
for (var i = 0; i < testb.length; i++) {
    for (var j = 0;j < testb[i].length; j++) {
        // append coords to SVG path
        path_b += "L" + testb[i][j][0] + "," + testb[i][j][1];
    }
}
path_b += "Z";

var svg = d3.select("#map");

svg.attr("height", 1000)
    .attr("width","100%")
    .append("path")
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("d", path_b);

svg.append("path")
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("d", 'M205.80 261.66L205.80 246.62L205.80 246.62Q205.80 244.90 206.40 243.58L206.40 243.58L206.40 243.58Q207.00 242.26 207.98 241.40L207.98 241.40L207.98 241.40Q208.96 240.54 210.18 240.10L210.18 240.10L210.18 240.10Q211.40 239.66 212.64 239.66L212.64 239.66L212.64 239.66Q213.88 239.66 215.10 240.10L215.10 240.10L215.10 240.10Q216.32 240.54 217.30 241.40L217.30 241.40L217.30 241.40Q218.28 242.26 218.88 243.58L218.88 243.58L218.88 243.58Q219.48 244.90 219.48 246.62L219.48 246.62L219.48 261.66L219.48 261.66Q219.48 263.42 218.88 264.72L218.88 264.72L218.88 264.72Q218.28 266.02 217.30 266.88L217.30 266.88L217.30 266.88Q216.32 267.74 215.10 268.18L215.10 268.18L215.10 268.18Q213.88 268.62 212.64 268.62L212.64 268.62L212.64 268.62Q211.40 268.62 210.18 268.18L210.18 268.18L210.18 268.18Q208.96 267.74 207.98 266.88L207.98 266.88L207.98 266.88Q207.00 266.02 206.40 264.72L206.40 264.72L206.40 264.72Q205.80 263.42 205.80 261.66L205.80 261.66ZM209.88 246.62L209.88 261.66L209.88 261.66Q209.88 263.14 210.70 263.84L210.70 263.84L210.70 263.84Q211.52 264.54 212.64 264.54L212.64 264.54L212.64 264.54Q213.76 264.54 214.58 263.84L214.58 263.84L214.58 263.84Q215.40 263.14 215.40 261.66L215.40 261.66L215.40 246.62L215.40 246.62Q215.40 245.14 214.58 244.44L214.58 244.44L214.58 244.44Q213.76 243.74 212.64 243.74L212.64 243.74L212.64 243.74Q211.52 243.74 210.70 244.44L210.70 244.44L210.70 244.44Q209.88 245.14 209.88 246.62L209.88 246.62Z');
//TextToSVG.load(font_for_map, function (err_font, textToSVG) {
TextPoly.execute(test, "testtesttest", 0, font, textToSVG, svg);