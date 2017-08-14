/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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


var path = "M" + phinney[0][0][0] + "," + phinney[0][0][1];
for (var i = 0; i < phinney.length; i++) {
   for (var j = 0;j < phinney[i].length; j++) {
        // append coords to SVG path
       path += "L" + phinney[i][j][0] + "," + phinney[i][j][1];
   }
}
path += "Z";

d3.select("#map")
    .attr("height", 1000)
    .attr("width","100%")
    .append("path")
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("d", path);

TextToSVG.load(font_for_map, function (err_font, textToSVG) {
    TextPoly.execute(phinney, "testtesttest", 0, font, textToSVG);
});



/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);