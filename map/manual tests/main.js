var canvas = new fabric.Canvas('c', { selection: false });
const TextPoly = require('../../TextPoly/TextPoly.js');

var line, isDown, startedShape;
var shapePoints = [[]];
var font_for_map = '../DIN-Condensed-Bold.ttf';

canvas.on('mouse:down', function(o){
    if (!startedShape) {
        startedShape = true;
        startLine(o);
    } else {
        // finish current line
        var pointer = canvas.getPointer(o.e);
        var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
        line.set({ x2: pointer.x, y2: pointer.y });
        canvas.renderAll();
        startLine(o);
    }
});

var submitButton = document.getElementById("submit_button");
submitButton.onclick = generateTextPolyOutput;

function startLine(o) {
    var pointer = canvas.getPointer(o.e);
    var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
    shapePoints[0][shapePoints[0].length] = [pointer.x, pointer.y];
    line = new fabric.Line(points, {
        strokeWidth: 5,
        fill: 'darkgray',
        stroke: 'darkgray',
        originX: 'center',
        originY: 'center'
    });
    canvas.add(line);
}

function generateTextPolyOutput() {
    var phrase = document.getElementById("phrase_input").value;
    TextPoly.execute(
        shapePoints, // shape outline
        phrase, // phrase
        4, // padding
        font_for_map, // font file
        function(chars, shape_info) {
            var svg = d3.select("#shape_svg");
            svg.append("path")
                .attr("d", arrayToPath(shapePoints[0]))
                .classed("neighborhoodUnFocus", true);
            for (var i = 0; i < chars.length; i++) {
                svg.append("path")
                    .attr("d", chars[i]);
            }
        },
        null // rando json to use in callback
    );
}

/*converts given 2d array of form:
 [
 [x1, y1]
 [x2, y2]
 ...
 [xn, yn]
 ]
 to SVG path string of form:
 "Mx1,y1Lx2,y2...Lxn,yn"
 Inserting move-to and line-to characters as necessary.
 Coordinates must encompass one shape.
 */
function  arrayToPath(polyArray) {

    //generate path for topPoly
    var pathString = "M" + polyArray[0][0] + "," + polyArray[0][1];
    for (var j = 1; j < polyArray.length; j++) {
        pathString += "L" + polyArray[j][0] + "," + polyArray[j][1];
    }

    //add close path character to draw line back to initial point
    pathString += 'Z';

    return pathString;
}


