/**
 * Created by meredith on 4/24/17.
 */

const TextToSVG = require('text-to-svg');
const NeighborhoodParser = require('./NeighborhoodParser.js');
const TextUtil = require('./TextUtil.js');

module.exports = {

    setMapOpacityFade: function () {
        d3.selectAll(".neighborhood").attr("opacity", "0.5");
    },

    setMapOpacityStrong: function () {
        d3.selectAll(".neighborhood").attr("opacity", "1.0");
    },

    setLegend: function (d, i) {

        d3.select(".maplegend").style("visibility", "visible");

        var poly = d3.select(this);

        // weird scrolling thing -- gotta save scroll top
        var oldScrollTop = document.body.scrollTop;

        // set name
        var name = d3.select("#neighborhoodname");
        name.html(d.properties.name);

        // set phrase
        var phraseBox = d3.select("#neighborhoodphrase");
        var phrase = poly.attr("phrase");
        phraseBox.html(phrase);

        // set type
        var categories = JSON.parse(poly.attr("categories"));
        var categoryBox = d3.select("#neighborhoodcategory");
        if (categories != null) {
            categoryBox.html(categories[0].title);
        }

        // set price range
        var price = poly.attr("price");
        if (!price) {
            price = "filler";
        }
        d3.select("#neighborhoodprice").html(price);

        // set number of ratings
        d3.select("#neighborhoodreviewcount").html(poly.attr("reviewcount"));

        //var chars = poly.selectAll(".charSVGThing").attr("stroke", "white");
        var chars = poly.selectAll(".charSVGThing");
        chars.style("fill", "white");

        var pathinpoly = poly.select(".neighborhoodOutline");
        pathinpoly.classed("neighborhoodUnFocus", false);
        pathinpoly.classed("neighborhoodFocus", true);

        // set scrolling top so that we don't scroll
        document.body.scrollTop = oldScrollTop;
    },

    resetLegend: function (d, i) {

        // set entire legend to be invisible
        d3.select(".maplegend").style("visibility", "hidden");

        var poly = d3.select(this);

        // weird scrolling thing -- gotta save scroll top
        var oldScrollTop = document.body.scrollTop;
        var name = d3.select("#neighborhoodname");

        var phraseBox = d3.select("#neighborhoodphrase");

        // set categories
        d3.select("#neighborhoodcategory");

        // set price range
        d3.select("#neighborhoodprice");

        // set number of ratings
        d3.select("#neighborhoodreviewcount");

        var pathinpoly = poly.select(".neighborhoodOutline");
        pathinpoly.classed("neighborhoodFocus", false);
        pathinpoly.classed("neighborhoodUnFocus", true);

        //var chars = poly.selectAll(".charSVGThing").attr("stroke", "black");
        var chars = poly.selectAll(".charSVGThing").style("fill", "black");

        // set scrolling top so that we don't scroll
        document.body.scrollTop = oldScrollTop;
    },

    //slice neighborhood horizontally, then vertically
    //according to length of phrase to get grid over neighborhood.
    //Use inscribed rectangles to fill each grid slot with a letter
    horizontalSliceAlg: function (pathCoords3d, d, phrase, padding,
                                  TEXT_SIZE_MULTIPLIER, font, HORIZONTAL_SLICE_CAP,
                                  CHAR_ASPECT_RATIO, textToSVG, TextToSVG, raphael,
                                    svg) {

        //get height and width of polygon
        //don't use padding this time (padding = 0)
        var dimensions = NeighborhoodParser.getNeighborhoodDimensions(pathCoords3d, 0);

        // get number of horizontal slices we should be using for optimal letter fitting
        var optimalHorizontalSlices = NeighborhoodParser.testGrid(pathCoords3d, dimensions, d, svg,
            phrase, padding, HORIZONTAL_SLICE_CAP, CHAR_ASPECT_RATIO, TEXT_SIZE_MULTIPLIER, font, TextToSVG);
        console.log("num horizontal slices: " + optimalHorizontalSlices);


        // get individual grid cells that each letter will be fit into
        var gridUnits = NeighborhoodParser.createGrid(pathCoords3d, dimensions, optimalHorizontalSlices, d, svg,
            phrase, padding);

        //console.log(gridUnits[0]);
        var chars = [];

        for (var i = 0; i < gridUnits.length; i++) {
            var character = phrase.charAt(i);
            //TextUtil.appendCharacterAsSVG(character, gridUnits[i], svg, d, i, padding, displayText, displayBounds,
            //    TEXT_SIZE_MULTIPLIER, font, textToSVG, raphael);
            chars[chars.length] = TextUtil.getCharacterAsSVG(character, gridUnits[i], svg, d, i, padding,
                null, null,
                TEXT_SIZE_MULTIPLIER, font, textToSVG, raphael);

            console.log(chars[chars.length - 1]);
        }
    },

    appendSingleLetter: function (rectangle, letter, d) {

        var textPath;
        var rectWidth;
        var rectHeight;

        if (rectangle.rect[0].angle == 0) { //longer side of rectangle is aligned with x axis

            //use top of rectangle for bottom of path (letter falls on its right side)
            textPath = "M" + rectangle.corners.leftX + "," + rectangle.corners.topY
                + "L" + rectangle.corners.leftX + "," + rectangle.corners.lowY;

        } else if (rectangle.rect[0].angle == 90 || rectangle.rect[0].angle == 270) {
            //find new y
            //var yWithPadding = rectangle.corners.lowY - padding;
            var y = rectangle.corners.lowY;

            //use bottom of rectangle for bottom of path
            textPath = "M" + rectangle.corners.leftX + "," + y
                + "L" + rectangle.corners.rightX + "," + y;

        }

        rectWidth = rectangle.rect[0].height;
        rectHeight = rectangle.rect[0].width;

        var textSize = 1;

        var phantomSvg = d3.select("body").append("svg");
        var text = svg.append("text")
            .text(letter)
            .attr("font-size", textSize + "pt");
        var bbox = text.node().getBBox();

        var widthTransform = bbox.width;
        var heightTransform = bbox.height;

        var eBrake = true;

        while (widthTransform < rectWidth && heightTransform < rectHeight && eBrake) {

            textSize += 0.5;

            text = phantomSvg.append("text")
                .text(letter)
                .attr("font-size", textSize + "pt");

            //var textNode = document.getElementById("t1");
            bbox = text.node().getBBox();
            widthTransform = bbox.width;
            heightTransform = bbox.height;

            if (textSize > 50) {
                eBrake = false;
            }
        }
        //
        //var rectangle = svg.append("rect")
        //    .attr("x", upperLeftCornerX)
        //    .attr("y", upperLeftCornerY)
        //    .attr("width", widthTransform)
        //    .attr("height", heightTransform)
        //    .attr("fill", "red")
        //    .attr("id", "bounding_text_rect_" + d.id);


        //find appropriate letter size based on area of horizontal distance
        //letterSize = Math.min(rectangle.corners.lowY - rectangle.corners.topY, rectangle.corners.rightX - rectangle.corners.leftX);

        svg.append("path")
            .attr("id", rectangle.id + "_letter_path")
            .attr("d", textPath)
            .style("fill", "none");
        //.style('stroke', "red");

        svg.append("text")
            .append("textPath")
            .attr("xlink:href", "#" + rectangle.id + "_letter_path")
            .style("text-anchor", "middle")
            .text(letter)
            .attr("font-size", (textSize * 1.2) + "pt")
            .attr("startOffset", "50%")
            .attr("font-family", font);
    }
};
