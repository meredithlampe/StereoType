/**
 * Created by meredith on 6/12/17.
 */
    const d3 = require('d3');


var projection = d3.geo.mercator()
    .rotate(rotate)
    .scale(scale)
    .translate(offset)
    .precision(.5);

var path = d3.geo.path()
    .projection(projection);
