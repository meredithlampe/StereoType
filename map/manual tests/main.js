var canvas = new fabric.Canvas('c', { selection: false });
const TextPoly = require('../../TextPoly/TextPoly.js');

var line, isDown, startedShape = false, finishedShape = false, startingPoint;
var shapePoints = [[]];
var font_for_map = '../DIN-Condensed-Bold.ttf';
var numClicksInBox = 0;
var hasClickedStartingPointAgain = false;
var hasClickedSubmit = false;
var c = document.getElementById('c');

canvas.on('mouse:down', function(o){

    if (!finishedShape) {
        var pointer = canvas.getPointer(o.e);
        var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
        if (!startedShape) {
            startedShape = true;
            startLine(o);
        } else {
            // finish current line
            line.set({ x2: pointer.x, y2: pointer.y });
            canvas.renderAll();
            startLine(o);
        }

        numClicksInBox++;
        if (numClicksInBox == 1) {
            startingPoint = [pointer.x, pointer.y];
            d3.select("#instructions_1").style("color", "#bcbcbc");
            d3.select("#instructions_2").style("color", "#505050");
        } else if (numClicksInBox == 3) {
            d3.select("#instructions_2").style("color", "#bcbcbc");
            d3.select("#instructions_3").style("color", "#505050");
        } else if (numClicksInBox > 3) {
            // get location of click, detect if it is by starting point
            var x_diff = pointer.x - startingPoint[0];
            var y_diff = pointer.y - startingPoint[1];
            var distance = Math.sqrt( x_diff*x_diff + y_diff*y_diff );
            if (distance < 5) {
                finishedShape = true;
                d3.select("#instructions_3").style("color", "#bcbcbc");
                d3.select("#instructions_4").style("color", "#505050");
            }
        }
    }
});

var submitButton = document.getElementById("submit_button");
submitButton.onclick = generateTextPolyOutput;

function appendCircleToCanvas(x, y) {
    var radius = 5;
    var context = c.getContext('2d');
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'black';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = '#003300';
    context.stroke();
    context.closePath();
}

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
    var nameArray = phrase.split(" ");
    var phraseNoSpaces = nameArray[0];
    for (var i = 1; i < nameArray.length; i++) {
        phraseNoSpaces += nameArray[i];
    }
    TextPoly.execute(
        shapePoints, // shape outline
        phraseNoSpaces, // phrase
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


