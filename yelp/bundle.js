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
/******/ 	return __webpack_require__(__webpack_require__.s = 53);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Parsing utility functions



var check = __webpack_require__(1);

// Retrieve an unsigned byte from the DataView.
exports.getByte = function getByte(dataView, offset) {
    return dataView.getUint8(offset);
};

exports.getCard8 = exports.getByte;

// Retrieve an unsigned 16-bit short from the DataView.
// The value is stored in big endian.
function getUShort(dataView, offset) {
    return dataView.getUint16(offset, false);
}

exports.getUShort = exports.getCard16 = getUShort;

// Retrieve a signed 16-bit short from the DataView.
// The value is stored in big endian.
exports.getShort = function(dataView, offset) {
    return dataView.getInt16(offset, false);
};

// Retrieve an unsigned 32-bit long from the DataView.
// The value is stored in big endian.
exports.getULong = function(dataView, offset) {
    return dataView.getUint32(offset, false);
};

// Retrieve a 32-bit signed fixed-point number (16.16) from the DataView.
// The value is stored in big endian.
exports.getFixed = function(dataView, offset) {
    var decimal = dataView.getInt16(offset, false);
    var fraction = dataView.getUint16(offset + 2, false);
    return decimal + fraction / 65535;
};

// Retrieve a 4-character tag from the DataView.
// Tags are used to identify tables.
exports.getTag = function(dataView, offset) {
    var tag = '';
    for (var i = offset; i < offset + 4; i += 1) {
        tag += String.fromCharCode(dataView.getInt8(i));
    }

    return tag;
};

// Retrieve an offset from the DataView.
// Offsets are 1 to 4 bytes in length, depending on the offSize argument.
exports.getOffset = function(dataView, offset, offSize) {
    var v = 0;
    for (var i = 0; i < offSize; i += 1) {
        v <<= 8;
        v += dataView.getUint8(offset + i);
    }

    return v;
};

// Retrieve a number of bytes from start offset to the end offset from the DataView.
exports.getBytes = function(dataView, startOffset, endOffset) {
    var bytes = [];
    for (var i = startOffset; i < endOffset; i += 1) {
        bytes.push(dataView.getUint8(i));
    }

    return bytes;
};

// Convert the list of bytes to a string.
exports.bytesToString = function(bytes) {
    var s = '';
    for (var i = 0; i < bytes.length; i += 1) {
        s += String.fromCharCode(bytes[i]);
    }

    return s;
};

var typeOffsets = {
    byte: 1,
    uShort: 2,
    short: 2,
    uLong: 4,
    fixed: 4,
    longDateTime: 8,
    tag: 4
};

// A stateful parser that changes the offset whenever a value is retrieved.
// The data is a DataView.
function Parser(data, offset) {
    this.data = data;
    this.offset = offset;
    this.relativeOffset = 0;
}

Parser.prototype.parseByte = function() {
    var v = this.data.getUint8(this.offset + this.relativeOffset);
    this.relativeOffset += 1;
    return v;
};

Parser.prototype.parseChar = function() {
    var v = this.data.getInt8(this.offset + this.relativeOffset);
    this.relativeOffset += 1;
    return v;
};

Parser.prototype.parseCard8 = Parser.prototype.parseByte;

Parser.prototype.parseUShort = function() {
    var v = this.data.getUint16(this.offset + this.relativeOffset);
    this.relativeOffset += 2;
    return v;
};

Parser.prototype.parseCard16 = Parser.prototype.parseUShort;
Parser.prototype.parseSID = Parser.prototype.parseUShort;
Parser.prototype.parseOffset16 = Parser.prototype.parseUShort;

Parser.prototype.parseShort = function() {
    var v = this.data.getInt16(this.offset + this.relativeOffset);
    this.relativeOffset += 2;
    return v;
};

Parser.prototype.parseF2Dot14 = function() {
    var v = this.data.getInt16(this.offset + this.relativeOffset) / 16384;
    this.relativeOffset += 2;
    return v;
};

Parser.prototype.parseULong = function() {
    var v = exports.getULong(this.data, this.offset + this.relativeOffset);
    this.relativeOffset += 4;
    return v;
};

Parser.prototype.parseFixed = function() {
    var v = exports.getFixed(this.data, this.offset + this.relativeOffset);
    this.relativeOffset += 4;
    return v;
};

Parser.prototype.parseString = function(length) {
    var dataView = this.data;
    var offset = this.offset + this.relativeOffset;
    var string = '';
    this.relativeOffset += length;
    for (var i = 0; i < length; i++) {
        string += String.fromCharCode(dataView.getUint8(offset + i));
    }

    return string;
};

Parser.prototype.parseTag = function() {
    return this.parseString(4);
};

// LONGDATETIME is a 64-bit integer.
// JavaScript and unix timestamps traditionally use 32 bits, so we
// only take the last 32 bits.
// + Since until 2038 those bits will be filled by zeros we can ignore them.
Parser.prototype.parseLongDateTime = function() {
    var v = exports.getULong(this.data, this.offset + this.relativeOffset + 4);
    // Subtract seconds between 01/01/1904 and 01/01/1970
    // to convert Apple Mac timstamp to Standard Unix timestamp
    v -= 2082844800;
    this.relativeOffset += 8;
    return v;
};

Parser.prototype.parseVersion = function() {
    var major = getUShort(this.data, this.offset + this.relativeOffset);

    // How to interpret the minor version is very vague in the spec. 0x5000 is 5, 0x1000 is 1
    // This returns the correct number if minor = 0xN000 where N is 0-9
    var minor = getUShort(this.data, this.offset + this.relativeOffset + 2);
    this.relativeOffset += 4;
    return major + minor / 0x1000 / 10;
};

Parser.prototype.skip = function(type, amount) {
    if (amount === undefined) {
        amount = 1;
    }

    this.relativeOffset += typeOffsets[type] * amount;
};

///// Parsing lists and records ///////////////////////////////

// Parse a list of 16 bit integers. The length of the list can be read on the stream
// or provided as an argument.
Parser.prototype.parseOffset16List =
Parser.prototype.parseUShortList = function(count) {
    if (count === undefined) { count = this.parseUShort(); }
    var offsets = new Array(count);
    var dataView = this.data;
    var offset = this.offset + this.relativeOffset;
    for (var i = 0; i < count; i++) {
        offsets[i] = dataView.getUint16(offset);
        offset += 2;
    }

    this.relativeOffset += count * 2;
    return offsets;
};

/**
 * Parse a list of items.
 * Record count is optional, if omitted it is read from the stream.
 * itemCallback is one of the Parser methods.
 */
Parser.prototype.parseList = function(count, itemCallback) {
    if (!itemCallback) {
        itemCallback = count;
        count = this.parseUShort();
    }
    var list = new Array(count);
    for (var i = 0; i < count; i++) {
        list[i] = itemCallback.call(this);
    }
    return list;
};

/**
 * Parse a list of records.
 * Record count is optional, if omitted it is read from the stream.
 * Example of recordDescription: { sequenceIndex: Parser.uShort, lookupListIndex: Parser.uShort }
 */
Parser.prototype.parseRecordList = function(count, recordDescription) {
    // If the count argument is absent, read it in the stream.
    if (!recordDescription) {
        recordDescription = count;
        count = this.parseUShort();
    }
    var records = new Array(count);
    var fields = Object.keys(recordDescription);
    for (var i = 0; i < count; i++) {
        var rec = {};
        for (var j = 0; j < fields.length; j++) {
            var fieldName = fields[j];
            var fieldType = recordDescription[fieldName];
            rec[fieldName] = fieldType.call(this);
        }
        records[i] = rec;
    }
    return records;
};

// Parse a data structure into an object
// Example of description: { sequenceIndex: Parser.uShort, lookupListIndex: Parser.uShort }
Parser.prototype.parseStruct = function(description) {
    if (typeof description === 'function') {
        return description.call(this);
    } else {
        var fields = Object.keys(description);
        var struct = {};
        for (var j = 0; j < fields.length; j++) {
            var fieldName = fields[j];
            var fieldType = description[fieldName];
            struct[fieldName] = fieldType.call(this);
        }
        return struct;
    }
};

Parser.prototype.parsePointer = function(description) {
    var structOffset = this.parseOffset16();
    if (structOffset > 0) {                         // NULL offset => return indefined
        return new Parser(this.data, this.offset + structOffset).parseStruct(description);
    }
};

/**
 * Parse a list of offsets to lists of 16-bit integers,
 * or a list of offsets to lists of offsets to any kind of items.
 * If itemCallback is not provided, a list of list of UShort is assumed.
 * If provided, itemCallback is called on each item and must parse the item.
 * See examples in tables/gsub.js
 */
Parser.prototype.parseListOfLists = function(itemCallback) {
    var offsets = this.parseOffset16List();
    var count = offsets.length;
    var relativeOffset = this.relativeOffset;
    var list = new Array(count);
    for (var i = 0; i < count; i++) {
        var start = offsets[i];
        if (start === 0) {                  // NULL offset
            list[i] = undefined;            // Add i as owned property to list. Convenient with assert.
            continue;
        }
        this.relativeOffset = start;
        if (itemCallback) {
            var subOffsets = this.parseOffset16List();
            var subList = new Array(subOffsets.length);
            for (var j = 0; j < subOffsets.length; j++) {
                this.relativeOffset = start + subOffsets[j];
                subList[j] = itemCallback.call(this);
            }
            list[i] = subList;
        } else {
            list[i] = this.parseUShortList();
        }
    }
    this.relativeOffset = relativeOffset;
    return list;
};

///// Complex tables parsing //////////////////////////////////

// Parse a coverage table in a GSUB, GPOS or GDEF table.
// https://www.microsoft.com/typography/OTSPEC/chapter2.htm
// parser.offset must point to the start of the table containing the coverage.
Parser.prototype.parseCoverage = function() {
    var startOffset = this.offset + this.relativeOffset;
    var format = this.parseUShort();
    var count = this.parseUShort();
    if (format === 1) {
        return {
            format: 1,
            glyphs: this.parseUShortList(count)
        };
    } else if (format === 2) {
        var ranges = new Array(count);
        for (var i = 0; i < count; i++) {
            ranges[i] = {
                start: this.parseUShort(),
                end: this.parseUShort(),
                index: this.parseUShort()
            };
        }
        return {
            format: 2,
            ranges: ranges
        };
    }
    check.assert(false, '0x' + startOffset.toString(16) + ': Coverage format must be 1 or 2.');
};

// Parse a Class Definition Table in a GSUB, GPOS or GDEF table.
// https://www.microsoft.com/typography/OTSPEC/chapter2.htm
Parser.prototype.parseClassDef = function() {
    var startOffset = this.offset + this.relativeOffset;
    var format = this.parseUShort();
    if (format === 1) {
        return {
            format: 1,
            startGlyph: this.parseUShort(),
            classes: this.parseUShortList()
        };
    } else if (format === 2) {
        return {
            format: 2,
            ranges: this.parseRecordList({
                start: Parser.uShort,
                end: Parser.uShort,
                classId: Parser.uShort
            })
        };
    }
    check.assert(false, '0x' + startOffset.toString(16) + ': ClassDef format must be 1 or 2.');
};

///// Static methods ///////////////////////////////////
// These convenience methods can be used as callbacks and should be called with "this" context set to a Parser instance.

Parser.list = function(count, itemCallback) {
    return function() {
        return this.parseList(count, itemCallback);
    };
};

Parser.recordList = function(count, recordDescription) {
    return function() {
        return this.parseRecordList(count, recordDescription);
    };
};

Parser.pointer = function(description) {
    return function() {
        return this.parsePointer(description);
    };
};

Parser.tag = Parser.prototype.parseTag;
Parser.byte = Parser.prototype.parseByte;
Parser.uShort = Parser.offset16 = Parser.prototype.parseUShort;
Parser.uShortList = Parser.prototype.parseUShortList;
Parser.struct = Parser.prototype.parseStruct;
Parser.coverage = Parser.prototype.parseCoverage;
Parser.classDef = Parser.prototype.parseClassDef;

///// Script, Feature, Lookup lists ///////////////////////////////////////////////
// https://www.microsoft.com/typography/OTSPEC/chapter2.htm

var langSysTable = {
    reserved: Parser.uShort,
    reqFeatureIndex: Parser.uShort,
    featureIndexes: Parser.uShortList
};

Parser.prototype.parseScriptList = function() {
    return this.parsePointer(Parser.recordList({
        tag: Parser.tag,
        script: Parser.pointer({
            defaultLangSys: Parser.pointer(langSysTable),
            langSysRecords: Parser.recordList({
                tag: Parser.tag,
                langSys: Parser.pointer(langSysTable)
            })
        })
    }));
};

Parser.prototype.parseFeatureList = function() {
    return this.parsePointer(Parser.recordList({
        tag: Parser.tag,
        feature: Parser.pointer({
            featureParams: Parser.offset16,
            lookupListIndexes: Parser.uShortList
        })
    }));
};

Parser.prototype.parseLookupList = function(lookupTableParsers) {
    return this.parsePointer(Parser.list(Parser.pointer(function() {
        var lookupType = this.parseUShort();
        check.argument(1 <= lookupType && lookupType <= 8, 'GSUB lookup type ' + lookupType + ' unknown.');
        var lookupFlag = this.parseUShort();
        var useMarkFilteringSet = lookupFlag & 0x10;
        return {
            lookupType: lookupType,
            lookupFlag: lookupFlag,
            subtables: this.parseList(Parser.pointer(lookupTableParsers[lookupType])),
            markFilteringSet: useMarkFilteringSet ? this.parseUShort() : undefined
        };
    })));
};

exports.Parser = Parser;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Run-time checking of preconditions.



exports.fail = function(message) {
    throw new Error(message);
};

// Precondition function that checks if the given predicate is true.
// If not, it will throw an error.
exports.argument = function(predicate, message) {
    if (!predicate) {
        exports.fail(message);
    }
};

// Precondition function that checks if the given assertion is true.
// If not, it will throw an error.
exports.assert = exports.argument;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Table metadata



var check = __webpack_require__(1);
var encode = __webpack_require__(5).encode;
var sizeOf = __webpack_require__(5).sizeOf;
/**
 * @exports opentype.Table
 * @class
 * @param {string} tableName
 * @param {Array} fields
 * @param {Object} options
 * @constructor
 */
function Table(tableName, fields, options) {
    var i;
    for (i = 0; i < fields.length; i += 1) {
        var field = fields[i];
        this[field.name] = field.value;
    }

    this.tableName = tableName;
    this.fields = fields;
    if (options) {
        var optionKeys = Object.keys(options);
        for (i = 0; i < optionKeys.length; i += 1) {
            var k = optionKeys[i];
            var v = options[k];
            if (this[k] !== undefined) {
                this[k] = v;
            }
        }
    }
}

/**
 * Encodes the table and returns an array of bytes
 * @return {Array}
 */
Table.prototype.encode = function() {
    return encode.TABLE(this);
};

/**
 * Get the size of the table.
 * @return {number}
 */
Table.prototype.sizeOf = function() {
    return sizeOf.TABLE(this);
};

/**
 * @private
 */
function ushortList(itemName, list, count) {
    if (count === undefined) {
        count = list.length;
    }
    var fields = new Array(list.length + 1);
    fields[0] = {name: itemName + 'Count', type: 'USHORT', value: count};
    for (var i = 0; i < list.length; i++) {
        fields[i + 1] = {name: itemName + i, type: 'USHORT', value: list[i]};
    }
    return fields;
}

/**
 * @private
 */
function tableList(itemName, records, itemCallback) {
    var count = records.length;
    var fields = new Array(count + 1);
    fields[0] = {name: itemName + 'Count', type: 'USHORT', value: count};
    for (var i = 0; i < count; i++) {
        fields[i + 1] = {name: itemName + i, type: 'TABLE', value: itemCallback(records[i], i)};
    }
    return fields;
}

/**
 * @private
 */
function recordList(itemName, records, itemCallback) {
    var count = records.length;
    var fields = [];
    fields[0] = {name: itemName + 'Count', type: 'USHORT', value: count};
    for (var i = 0; i < count; i++) {
        fields = fields.concat(itemCallback(records[i], i));
    }
    return fields;
}

// Common Layout Tables

/**
 * @exports opentype.Coverage
 * @class
 * @param {opentype.Table}
 * @constructor
 * @extends opentype.Table
 */
function Coverage(coverageTable) {
    if (coverageTable.format === 1) {
        Table.call(this, 'coverageTable',
            [{name: 'coverageFormat', type: 'USHORT', value: 1}]
            .concat(ushortList('glyph', coverageTable.glyphs))
        );
    } else {
        check.assert(false, 'Can\'t create coverage table format 2 yet.');
    }
}
Coverage.prototype = Object.create(Table.prototype);
Coverage.prototype.constructor = Coverage;

function ScriptList(scriptListTable) {
    Table.call(this, 'scriptListTable',
        recordList('scriptRecord', scriptListTable, function(scriptRecord, i) {
            var script = scriptRecord.script;
            var defaultLangSys = script.defaultLangSys;
            check.assert(!!defaultLangSys, 'Unable to write GSUB: script ' + scriptRecord.tag + ' has no default language system.');
            return [
                {name: 'scriptTag' + i, type: 'TAG', value: scriptRecord.tag},
                {name: 'script' + i, type: 'TABLE', value: new Table('scriptTable', [
                    {name: 'defaultLangSys', type: 'TABLE', value: new Table('defaultLangSys', [
                        {name: 'lookupOrder', type: 'USHORT', value: 0},
                        {name: 'reqFeatureIndex', type: 'USHORT', value: defaultLangSys.reqFeatureIndex}]
                        .concat(ushortList('featureIndex', defaultLangSys.featureIndexes)))}
                    ].concat(recordList('langSys', script.langSysRecords, function(langSysRecord, i) {
                        var langSys = langSysRecord.langSys;
                        return [
                            {name: 'langSysTag' + i, type: 'TAG', value: langSysRecord.tag},
                            {name: 'langSys' + i, type: 'TABLE', value: new Table('langSys', [
                                {name: 'lookupOrder', type: 'USHORT', value: 0},
                                {name: 'reqFeatureIndex', type: 'USHORT', value: langSys.reqFeatureIndex}
                                ].concat(ushortList('featureIndex', langSys.featureIndexes)))}
                        ];
                    })))}
            ];
        })
    );
}
ScriptList.prototype = Object.create(Table.prototype);
ScriptList.prototype.constructor = ScriptList;

/**
 * @exports opentype.FeatureList
 * @class
 * @param {opentype.Table}
 * @constructor
 * @extends opentype.Table
 */
function FeatureList(featureListTable) {
    Table.call(this, 'featureListTable',
        recordList('featureRecord', featureListTable, function(featureRecord, i) {
            var feature = featureRecord.feature;
            return [
                {name: 'featureTag' + i, type: 'TAG', value: featureRecord.tag},
                {name: 'feature' + i, type: 'TABLE', value: new Table('featureTable', [
                    {name: 'featureParams', type: 'USHORT', value: feature.featureParams},
                    ].concat(ushortList('lookupListIndex', feature.lookupListIndexes)))}
            ];
        })
    );
}
FeatureList.prototype = Object.create(Table.prototype);
FeatureList.prototype.constructor = FeatureList;

/**
 * @exports opentype.LookupList
 * @class
 * @param {opentype.Table}
 * @param {Object}
 * @constructor
 * @extends opentype.Table
 */
function LookupList(lookupListTable, subtableMakers) {
    Table.call(this, 'lookupListTable', tableList('lookup', lookupListTable, function(lookupTable) {
        var subtableCallback = subtableMakers[lookupTable.lookupType];
        check.assert(!!subtableCallback, 'Unable to write GSUB lookup type ' + lookupTable.lookupType + ' tables.');
        return new Table('lookupTable', [
            {name: 'lookupType', type: 'USHORT', value: lookupTable.lookupType},
            {name: 'lookupFlag', type: 'USHORT', value: lookupTable.lookupFlag}
        ].concat(tableList('subtable', lookupTable.subtables, subtableCallback)));
    }));
}
LookupList.prototype = Object.create(Table.prototype);
LookupList.prototype.constructor = LookupList;

// Record = same as Table, but inlined (a Table has an offset and its data is further in the stream)
// Don't use offsets inside Records (probable bug), only in Tables.
exports.Record = exports.Table = Table;
exports.Coverage = Coverage;
exports.ScriptList = ScriptList;
exports.FeatureList = FeatureList;
exports.LookupList = LookupList;

exports.ushortList = ushortList;
exports.tableList = tableList;
exports.recordList = recordList;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Geometric objects



var bbox = __webpack_require__(9);

/**
 * A bézier path containing a set of path commands similar to a SVG path.
 * Paths can be drawn on a context using `draw`.
 * @exports opentype.Path
 * @class
 * @constructor
 */
function Path() {
    this.commands = [];
    this.fill = 'black';
    this.stroke = null;
    this.strokeWidth = 1;
}

/**
 * @param  {number} x
 * @param  {number} y
 */
Path.prototype.moveTo = function(x, y) {
    this.commands.push({
        type: 'M',
        x: x,
        y: y
    });
};

/**
 * @param  {number} x
 * @param  {number} y
 */
Path.prototype.lineTo = function(x, y) {
    this.commands.push({
        type: 'L',
        x: x,
        y: y
    });
};

/**
 * Draws cubic curve
 * @function
 * curveTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control 1
 * @param  {number} y1 - y of control 1
 * @param  {number} x2 - x of control 2
 * @param  {number} y2 - y of control 2
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 */

/**
 * Draws cubic curve
 * @function
 * bezierCurveTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control 1
 * @param  {number} y1 - y of control 1
 * @param  {number} x2 - x of control 2
 * @param  {number} y2 - y of control 2
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 * @see curveTo
 */
Path.prototype.curveTo = Path.prototype.bezierCurveTo = function(x1, y1, x2, y2, x, y) {
    this.commands.push({
        type: 'C',
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        x: x,
        y: y
    });
};

/**
 * Draws quadratic curve
 * @function
 * quadraticCurveTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control
 * @param  {number} y1 - y of control
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 */

/**
 * Draws quadratic curve
 * @function
 * quadTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control
 * @param  {number} y1 - y of control
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 */
Path.prototype.quadTo = Path.prototype.quadraticCurveTo = function(x1, y1, x, y) {
    this.commands.push({
        type: 'Q',
        x1: x1,
        y1: y1,
        x: x,
        y: y
    });
};

/**
 * Closes the path
 * @function closePath
 * @memberof opentype.Path.prototype
 */

/**
 * Close the path
 * @function close
 * @memberof opentype.Path.prototype
 */
Path.prototype.close = Path.prototype.closePath = function() {
    this.commands.push({
        type: 'Z'
    });
};

/**
 * Add the given path or list of commands to the commands of this path.
 * @param  {Array} pathOrCommands - another opentype.Path, an opentype.BoundingBox, or an array of commands.
 */
Path.prototype.extend = function(pathOrCommands) {
    if (pathOrCommands.commands) {
        pathOrCommands = pathOrCommands.commands;
    } else if (pathOrCommands instanceof bbox.BoundingBox) {
        var box = pathOrCommands;
        this.moveTo(box.x1, box.y1);
        this.lineTo(box.x2, box.y1);
        this.lineTo(box.x2, box.y2);
        this.lineTo(box.x1, box.y2);
        this.close();
        return;
    }

    Array.prototype.push.apply(this.commands, pathOrCommands);
};

/**
 * Calculate the bounding box of the path.
 * @returns {opentype.BoundingBox}
 */
Path.prototype.getBoundingBox = function() {
    var box = new bbox.BoundingBox();

    var startX = 0;
    var startY = 0;
    var prevX = 0;
    var prevY = 0;
    for (var i = 0; i < this.commands.length; i++) {
        var cmd = this.commands[i];
        switch (cmd.type) {
            case 'M':
                box.addPoint(cmd.x, cmd.y);
                startX = prevX = cmd.x;
                startY = prevY = cmd.y;
                break;
            case 'L':
                box.addPoint(cmd.x, cmd.y);
                prevX = cmd.x;
                prevY = cmd.y;
                break;
            case 'Q':
                box.addQuad(prevX, prevY, cmd.x1, cmd.y1, cmd.x, cmd.y);
                prevX = cmd.x;
                prevY = cmd.y;
                break;
            case 'C':
                box.addBezier(prevX, prevY, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
                prevX = cmd.x;
                prevY = cmd.y;
                break;
            case 'Z':
                prevX = startX;
                prevY = startY;
                break;
            default:
                throw new Error('Unexpected path commmand ' + cmd.type);
        }
    }
    if (box.isEmpty()) {
        box.addPoint(0, 0);
    }
    return box;
};

/**
 * Draw the path to a 2D context.
 * @param {CanvasRenderingContext2D} ctx - A 2D drawing context.
 */
Path.prototype.draw = function(ctx) {
    ctx.beginPath();
    for (var i = 0; i < this.commands.length; i += 1) {
        var cmd = this.commands[i];
        if (cmd.type === 'M') {
            ctx.moveTo(cmd.x, cmd.y);
        } else if (cmd.type === 'L') {
            ctx.lineTo(cmd.x, cmd.y);
        } else if (cmd.type === 'C') {
            ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
        } else if (cmd.type === 'Q') {
            ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
        } else if (cmd.type === 'Z') {
            ctx.closePath();
        }
    }

    if (this.fill) {
        ctx.fillStyle = this.fill;
        ctx.fill();
    }

    if (this.stroke) {
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.strokeWidth;
        ctx.stroke();
    }
};

/**
 * Convert the Path to a string of path data instructions
 * See http://www.w3.org/TR/SVG/paths.html#PathData
 * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
 * @return {string}
 */
Path.prototype.toPathData = function(decimalPlaces) {
    decimalPlaces = decimalPlaces !== undefined ? decimalPlaces : 2;

    function floatToString(v) {
        if (Math.round(v) === v) {
            return '' + Math.round(v);
        } else {
            return v.toFixed(decimalPlaces);
        }
    }

    function packValues() {
        var s = '';
        for (var i = 0; i < arguments.length; i += 1) {
            var v = arguments[i];
            if (v >= 0 && i > 0) {
                s += ' ';
            }

            s += floatToString(v);
        }

        return s;
    }

    var d = '';
    for (var i = 0; i < this.commands.length; i += 1) {
        var cmd = this.commands[i];
        if (cmd.type === 'M') {
            d += 'M' + packValues(cmd.x, cmd.y);
        } else if (cmd.type === 'L') {
            d += 'L' + packValues(cmd.x, cmd.y);
        } else if (cmd.type === 'C') {
            d += 'C' + packValues(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
        } else if (cmd.type === 'Q') {
            d += 'Q' + packValues(cmd.x1, cmd.y1, cmd.x, cmd.y);
        } else if (cmd.type === 'Z') {
            d += 'Z';
        }
    }

    return d;
};

/**
 * Convert the path to an SVG <path> element, as a string.
 * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
 * @return {string}
 */
Path.prototype.toSVG = function(decimalPlaces) {
    var svg = '<path d="';
    svg += this.toPathData(decimalPlaces);
    svg += '"';
    if (this.fill && this.fill !== 'black') {
        if (this.fill === null) {
            svg += ' fill="none"';
        } else {
            svg += ' fill="' + this.fill + '"';
        }
    }

    if (this.stroke) {
        svg += ' stroke="' + this.stroke + '" stroke-width="' + this.strokeWidth + '"';
    }

    svg += '/>';
    return svg;
};

Path.prototype.toDOMElement = function(decimalPlaces) {
    var temporaryPath = this.toPathData(decimalPlaces);
    var newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    newPath.setAttribute('d', temporaryPath);

    return newPath;
};

exports.Path = Path;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Glyph encoding



var cffStandardStrings = [
    '.notdef', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quoteright',
    'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two',
    'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater',
    'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore',
    'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', 'exclamdown', 'cent', 'sterling',
    'fraction', 'yen', 'florin', 'section', 'currency', 'quotesingle', 'quotedblleft', 'guillemotleft',
    'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'endash', 'dagger', 'daggerdbl', 'periodcentered', 'paragraph',
    'bullet', 'quotesinglbase', 'quotedblbase', 'quotedblright', 'guillemotright', 'ellipsis', 'perthousand',
    'questiondown', 'grave', 'acute', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'dieresis', 'ring',
    'cedilla', 'hungarumlaut', 'ogonek', 'caron', 'emdash', 'AE', 'ordfeminine', 'Lslash', 'Oslash', 'OE',
    'ordmasculine', 'ae', 'dotlessi', 'lslash', 'oslash', 'oe', 'germandbls', 'onesuperior', 'logicalnot', 'mu',
    'trademark', 'Eth', 'onehalf', 'plusminus', 'Thorn', 'onequarter', 'divide', 'brokenbar', 'degree', 'thorn',
    'threequarters', 'twosuperior', 'registered', 'minus', 'eth', 'multiply', 'threesuperior', 'copyright',
    'Aacute', 'Acircumflex', 'Adieresis', 'Agrave', 'Aring', 'Atilde', 'Ccedilla', 'Eacute', 'Ecircumflex',
    'Edieresis', 'Egrave', 'Iacute', 'Icircumflex', 'Idieresis', 'Igrave', 'Ntilde', 'Oacute', 'Ocircumflex',
    'Odieresis', 'Ograve', 'Otilde', 'Scaron', 'Uacute', 'Ucircumflex', 'Udieresis', 'Ugrave', 'Yacute',
    'Ydieresis', 'Zcaron', 'aacute', 'acircumflex', 'adieresis', 'agrave', 'aring', 'atilde', 'ccedilla', 'eacute',
    'ecircumflex', 'edieresis', 'egrave', 'iacute', 'icircumflex', 'idieresis', 'igrave', 'ntilde', 'oacute',
    'ocircumflex', 'odieresis', 'ograve', 'otilde', 'scaron', 'uacute', 'ucircumflex', 'udieresis', 'ugrave',
    'yacute', 'ydieresis', 'zcaron', 'exclamsmall', 'Hungarumlautsmall', 'dollaroldstyle', 'dollarsuperior',
    'ampersandsmall', 'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', '266 ff', 'onedotenleader',
    'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle', 'fouroldstyle', 'fiveoldstyle', 'sixoldstyle',
    'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'commasuperior', 'threequartersemdash', 'periodsuperior',
    'questionsmall', 'asuperior', 'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', 'isuperior', 'lsuperior',
    'msuperior', 'nsuperior', 'osuperior', 'rsuperior', 'ssuperior', 'tsuperior', 'ff', 'ffi', 'ffl',
    'parenleftinferior', 'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall',
    'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall',
    'Msmall', 'Nsmall', 'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall',
    'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah', 'Tildesmall', 'exclamdownsmall',
    'centoldstyle', 'Lslashsmall', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall', 'Brevesmall', 'Caronsmall',
    'Dotaccentsmall', 'Macronsmall', 'figuredash', 'hypheninferior', 'Ogoneksmall', 'Ringsmall', 'Cedillasmall',
    'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds',
    'zerosuperior', 'foursuperior', 'fivesuperior', 'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior',
    'zeroinferior', 'oneinferior', 'twoinferior', 'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior',
    'seveninferior', 'eightinferior', 'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior',
    'commainferior', 'Agravesmall', 'Aacutesmall', 'Acircumflexsmall', 'Atildesmall', 'Adieresissmall',
    'Aringsmall', 'AEsmall', 'Ccedillasmall', 'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall',
    'Igravesmall', 'Iacutesmall', 'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall', 'Ogravesmall',
    'Oacutesmall', 'Ocircumflexsmall', 'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall',
    'Uacutesmall', 'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall', 'Ydieresissmall', '001.000',
    '001.001', '001.002', '001.003', 'Black', 'Bold', 'Book', 'Light', 'Medium', 'Regular', 'Roman', 'Semibold'];

var cffStandardEncoding = [
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quoteright',
    'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two',
    'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater',
    'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore',
    'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    'exclamdown', 'cent', 'sterling', 'fraction', 'yen', 'florin', 'section', 'currency', 'quotesingle',
    'quotedblleft', 'guillemotleft', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', '', 'endash', 'dagger',
    'daggerdbl', 'periodcentered', '', 'paragraph', 'bullet', 'quotesinglbase', 'quotedblbase', 'quotedblright',
    'guillemotright', 'ellipsis', 'perthousand', '', 'questiondown', '', 'grave', 'acute', 'circumflex', 'tilde',
    'macron', 'breve', 'dotaccent', 'dieresis', '', 'ring', 'cedilla', '', 'hungarumlaut', 'ogonek', 'caron',
    'emdash', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'AE', '', 'ordfeminine', '', '', '',
    '', 'Lslash', 'Oslash', 'OE', 'ordmasculine', '', '', '', '', '', 'ae', '', '', '', 'dotlessi', '', '',
    'lslash', 'oslash', 'oe', 'germandbls'];

var cffExpertEncoding = [
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', 'space', 'exclamsmall', 'Hungarumlautsmall', '', 'dollaroldstyle', 'dollarsuperior',
    'ampersandsmall', 'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', 'twodotenleader', 'onedotenleader',
    'comma', 'hyphen', 'period', 'fraction', 'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle',
    'fouroldstyle', 'fiveoldstyle', 'sixoldstyle', 'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'colon',
    'semicolon', 'commasuperior', 'threequartersemdash', 'periodsuperior', 'questionsmall', '', 'asuperior',
    'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', '', '', 'isuperior', '', '', 'lsuperior', 'msuperior',
    'nsuperior', 'osuperior', '', '', 'rsuperior', 'ssuperior', 'tsuperior', '', 'ff', 'fi', 'fl', 'ffi', 'ffl',
    'parenleftinferior', '', 'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall',
    'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall',
    'Msmall', 'Nsmall', 'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall',
    'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah', 'Tildesmall', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    'exclamdownsmall', 'centoldstyle', 'Lslashsmall', '', '', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall',
    'Brevesmall', 'Caronsmall', '', 'Dotaccentsmall', '', '', 'Macronsmall', '', '', 'figuredash', 'hypheninferior',
    '', '', 'Ogoneksmall', 'Ringsmall', 'Cedillasmall', '', '', '', 'onequarter', 'onehalf', 'threequarters',
    'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds', '',
    '', 'zerosuperior', 'onesuperior', 'twosuperior', 'threesuperior', 'foursuperior', 'fivesuperior',
    'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior', 'zeroinferior', 'oneinferior', 'twoinferior',
    'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior', 'seveninferior', 'eightinferior',
    'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior', 'commainferior', 'Agravesmall',
    'Aacutesmall', 'Acircumflexsmall', 'Atildesmall', 'Adieresissmall', 'Aringsmall', 'AEsmall', 'Ccedillasmall',
    'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall', 'Igravesmall', 'Iacutesmall',
    'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall', 'Ogravesmall', 'Oacutesmall',
    'Ocircumflexsmall', 'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall', 'Uacutesmall',
    'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall', 'Ydieresissmall'];

var standardNames = [
    '.notdef', '.null', 'nonmarkingreturn', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent',
    'ampersand', 'quotesingle', 'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash',
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less',
    'equal', 'greater', 'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright',
    'asciicircum', 'underscore', 'grave', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde',
    'Adieresis', 'Aring', 'Ccedilla', 'Eacute', 'Ntilde', 'Odieresis', 'Udieresis', 'aacute', 'agrave',
    'acircumflex', 'adieresis', 'atilde', 'aring', 'ccedilla', 'eacute', 'egrave', 'ecircumflex', 'edieresis',
    'iacute', 'igrave', 'icircumflex', 'idieresis', 'ntilde', 'oacute', 'ograve', 'ocircumflex', 'odieresis',
    'otilde', 'uacute', 'ugrave', 'ucircumflex', 'udieresis', 'dagger', 'degree', 'cent', 'sterling', 'section',
    'bullet', 'paragraph', 'germandbls', 'registered', 'copyright', 'trademark', 'acute', 'dieresis', 'notequal',
    'AE', 'Oslash', 'infinity', 'plusminus', 'lessequal', 'greaterequal', 'yen', 'mu', 'partialdiff', 'summation',
    'product', 'pi', 'integral', 'ordfeminine', 'ordmasculine', 'Omega', 'ae', 'oslash', 'questiondown',
    'exclamdown', 'logicalnot', 'radical', 'florin', 'approxequal', 'Delta', 'guillemotleft', 'guillemotright',
    'ellipsis', 'nonbreakingspace', 'Agrave', 'Atilde', 'Otilde', 'OE', 'oe', 'endash', 'emdash', 'quotedblleft',
    'quotedblright', 'quoteleft', 'quoteright', 'divide', 'lozenge', 'ydieresis', 'Ydieresis', 'fraction',
    'currency', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'daggerdbl', 'periodcentered', 'quotesinglbase',
    'quotedblbase', 'perthousand', 'Acircumflex', 'Ecircumflex', 'Aacute', 'Edieresis', 'Egrave', 'Iacute',
    'Icircumflex', 'Idieresis', 'Igrave', 'Oacute', 'Ocircumflex', 'apple', 'Ograve', 'Uacute', 'Ucircumflex',
    'Ugrave', 'dotlessi', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'ring', 'cedilla', 'hungarumlaut',
    'ogonek', 'caron', 'Lslash', 'lslash', 'Scaron', 'scaron', 'Zcaron', 'zcaron', 'brokenbar', 'Eth', 'eth',
    'Yacute', 'yacute', 'Thorn', 'thorn', 'minus', 'multiply', 'onesuperior', 'twosuperior', 'threesuperior',
    'onehalf', 'onequarter', 'threequarters', 'franc', 'Gbreve', 'gbreve', 'Idotaccent', 'Scedilla', 'scedilla',
    'Cacute', 'cacute', 'Ccaron', 'ccaron', 'dcroat'];

/**
 * This is the encoding used for fonts created from scratch.
 * It loops through all glyphs and finds the appropriate unicode value.
 * Since it's linear time, other encodings will be faster.
 * @exports opentype.DefaultEncoding
 * @class
 * @constructor
 * @param {opentype.Font}
 */
function DefaultEncoding(font) {
    this.font = font;
}

DefaultEncoding.prototype.charToGlyphIndex = function(c) {
    var code = c.charCodeAt(0);
    var glyphs = this.font.glyphs;
    if (glyphs) {
        for (var i = 0; i < glyphs.length; i += 1) {
            var glyph = glyphs.get(i);
            for (var j = 0; j < glyph.unicodes.length; j += 1) {
                if (glyph.unicodes[j] === code) {
                    return i;
                }
            }
        }
    } else {
        return null;
    }
};

/**
 * @exports opentype.CmapEncoding
 * @class
 * @constructor
 * @param {Object} cmap - a object with the cmap encoded data
 */
function CmapEncoding(cmap) {
    this.cmap = cmap;
}

/**
 * @param  {string} c - the character
 * @return {number} The glyph index.
 */
CmapEncoding.prototype.charToGlyphIndex = function(c) {
    return this.cmap.glyphIndexMap[c.charCodeAt(0)] || 0;
};

/**
 * @exports opentype.CffEncoding
 * @class
 * @constructor
 * @param {string} encoding - The encoding
 * @param {Array} charset - The charcater set.
 */
function CffEncoding(encoding, charset) {
    this.encoding = encoding;
    this.charset = charset;
}

/**
 * @param  {string} s - The character
 * @return {number} The index.
 */
CffEncoding.prototype.charToGlyphIndex = function(s) {
    var code = s.charCodeAt(0);
    var charName = this.encoding[code];
    return this.charset.indexOf(charName);
};

/**
 * @exports opentype.GlyphNames
 * @class
 * @constructor
 * @param {Object} post
 */
function GlyphNames(post) {
    var i;
    switch (post.version) {
        case 1:
            this.names = exports.standardNames.slice();
            break;
        case 2:
            this.names = new Array(post.numberOfGlyphs);
            for (i = 0; i < post.numberOfGlyphs; i++) {
                if (post.glyphNameIndex[i] < exports.standardNames.length) {
                    this.names[i] = exports.standardNames[post.glyphNameIndex[i]];
                } else {
                    this.names[i] = post.names[post.glyphNameIndex[i] - exports.standardNames.length];
                }
            }

            break;
        case 2.5:
            this.names = new Array(post.numberOfGlyphs);
            for (i = 0; i < post.numberOfGlyphs; i++) {
                this.names[i] = exports.standardNames[i + post.glyphNameIndex[i]];
            }

            break;
        case 3:
            this.names = [];
            break;
    }
}

/**
 * Gets the index of a glyph by name.
 * @param  {string} name - The glyph name
 * @return {number} The index
 */
GlyphNames.prototype.nameToGlyphIndex = function(name) {
    return this.names.indexOf(name);
};

/**
 * @param  {number} gid
 * @return {string}
 */
GlyphNames.prototype.glyphIndexToName = function(gid) {
    return this.names[gid];
};

/**
 * @alias opentype.addGlyphNames
 * @param {opentype.Font}
 */
function addGlyphNames(font) {
    var glyph;
    var glyphIndexMap = font.tables.cmap.glyphIndexMap;
    var charCodes = Object.keys(glyphIndexMap);

    for (var i = 0; i < charCodes.length; i += 1) {
        var c = charCodes[i];
        var glyphIndex = glyphIndexMap[c];
        glyph = font.glyphs.get(glyphIndex);
        glyph.addUnicode(parseInt(c));
    }

    for (i = 0; i < font.glyphs.length; i += 1) {
        glyph = font.glyphs.get(i);
        if (font.cffEncoding) {
            glyph.name = font.cffEncoding.charset[i];
        } else if (font.glyphNames.names) {
            glyph.name = font.glyphNames.glyphIndexToName(i);
        }
    }
}

exports.cffStandardStrings = cffStandardStrings;
exports.cffStandardEncoding = cffStandardEncoding;
exports.cffExpertEncoding = cffExpertEncoding;
exports.standardNames = standardNames;
exports.DefaultEncoding = DefaultEncoding;
exports.CmapEncoding = CmapEncoding;
exports.CffEncoding = CffEncoding;
exports.GlyphNames = GlyphNames;
exports.addGlyphNames = addGlyphNames;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Data types used in the OpenType font file.
// All OpenType fonts use Motorola-style byte ordering (Big Endian)

/* global WeakMap */



var check = __webpack_require__(1);

var LIMIT16 = 32768; // The limit at which a 16-bit number switches signs == 2^15
var LIMIT32 = 2147483648; // The limit at which a 32-bit number switches signs == 2 ^ 31

/**
 * @exports opentype.decode
 * @class
 */
var decode = {};
/**
 * @exports opentype.encode
 * @class
 */
var encode = {};
/**
 * @exports opentype.sizeOf
 * @class
 */
var sizeOf = {};

// Return a function that always returns the same value.
function constant(v) {
    return function() {
        return v;
    };
}

// OpenType data types //////////////////////////////////////////////////////

/**
 * Convert an 8-bit unsigned integer to a list of 1 byte.
 * @param {number}
 * @returns {Array}
 */
encode.BYTE = function(v) {
    check.argument(v >= 0 && v <= 255, 'Byte value should be between 0 and 255.');
    return [v];
};
/**
 * @constant
 * @type {number}
 */
sizeOf.BYTE = constant(1);

/**
 * Convert a 8-bit signed integer to a list of 1 byte.
 * @param {string}
 * @returns {Array}
 */
encode.CHAR = function(v) {
    return [v.charCodeAt(0)];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.CHAR = constant(1);

/**
 * Convert an ASCII string to a list of bytes.
 * @param {string}
 * @returns {Array}
 */
encode.CHARARRAY = function(v) {
    var b = [];
    for (var i = 0; i < v.length; i += 1) {
        b[i] = v.charCodeAt(i);
    }

    return b;
};

/**
 * @param {Array}
 * @returns {number}
 */
sizeOf.CHARARRAY = function(v) {
    return v.length;
};

/**
 * Convert a 16-bit unsigned integer to a list of 2 bytes.
 * @param {number}
 * @returns {Array}
 */
encode.USHORT = function(v) {
    return [(v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.USHORT = constant(2);

/**
 * Convert a 16-bit signed integer to a list of 2 bytes.
 * @param {number}
 * @returns {Array}
 */
encode.SHORT = function(v) {
    // Two's complement
    if (v >= LIMIT16) {
        v = -(2 * LIMIT16 - v);
    }

    return [(v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.SHORT = constant(2);

/**
 * Convert a 24-bit unsigned integer to a list of 3 bytes.
 * @param {number}
 * @returns {Array}
 */
encode.UINT24 = function(v) {
    return [(v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.UINT24 = constant(3);

/**
 * Convert a 32-bit unsigned integer to a list of 4 bytes.
 * @param {number}
 * @returns {Array}
 */
encode.ULONG = function(v) {
    return [(v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.ULONG = constant(4);

/**
 * Convert a 32-bit unsigned integer to a list of 4 bytes.
 * @param {number}
 * @returns {Array}
 */
encode.LONG = function(v) {
    // Two's complement
    if (v >= LIMIT32) {
        v = -(2 * LIMIT32 - v);
    }

    return [(v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.LONG = constant(4);

encode.FIXED = encode.ULONG;
sizeOf.FIXED = sizeOf.ULONG;

encode.FWORD = encode.SHORT;
sizeOf.FWORD = sizeOf.SHORT;

encode.UFWORD = encode.USHORT;
sizeOf.UFWORD = sizeOf.USHORT;

/**
 * Convert a 32-bit Apple Mac timestamp integer to a list of 8 bytes, 64-bit timestamp.
 * @param {number}
 * @returns {Array}
 */
encode.LONGDATETIME = function(v) {
    return [0, 0, 0, 0, (v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.LONGDATETIME = constant(8);

/**
 * Convert a 4-char tag to a list of 4 bytes.
 * @param {string}
 * @returns {Array}
 */
encode.TAG = function(v) {
    check.argument(v.length === 4, 'Tag should be exactly 4 ASCII characters.');
    return [v.charCodeAt(0),
            v.charCodeAt(1),
            v.charCodeAt(2),
            v.charCodeAt(3)];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.TAG = constant(4);

// CFF data types ///////////////////////////////////////////////////////////

encode.Card8 = encode.BYTE;
sizeOf.Card8 = sizeOf.BYTE;

encode.Card16 = encode.USHORT;
sizeOf.Card16 = sizeOf.USHORT;

encode.OffSize = encode.BYTE;
sizeOf.OffSize = sizeOf.BYTE;

encode.SID = encode.USHORT;
sizeOf.SID = sizeOf.USHORT;

// Convert a numeric operand or charstring number to a variable-size list of bytes.
/**
 * Convert a numeric operand or charstring number to a variable-size list of bytes.
 * @param {number}
 * @returns {Array}
 */
encode.NUMBER = function(v) {
    if (v >= -107 && v <= 107) {
        return [v + 139];
    } else if (v >= 108 && v <= 1131) {
        v = v - 108;
        return [(v >> 8) + 247, v & 0xFF];
    } else if (v >= -1131 && v <= -108) {
        v = -v - 108;
        return [(v >> 8) + 251, v & 0xFF];
    } else if (v >= -32768 && v <= 32767) {
        return encode.NUMBER16(v);
    } else {
        return encode.NUMBER32(v);
    }
};

/**
 * @param {number}
 * @returns {number}
 */
sizeOf.NUMBER = function(v) {
    return encode.NUMBER(v).length;
};

/**
 * Convert a signed number between -32768 and +32767 to a three-byte value.
 * This ensures we always use three bytes, but is not the most compact format.
 * @param {number}
 * @returns {Array}
 */
encode.NUMBER16 = function(v) {
    return [28, (v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.NUMBER16 = constant(3);

/**
 * Convert a signed number between -(2^31) and +(2^31-1) to a five-byte value.
 * This is useful if you want to be sure you always use four bytes,
 * at the expense of wasting a few bytes for smaller numbers.
 * @param {number}
 * @returns {Array}
 */
encode.NUMBER32 = function(v) {
    return [29, (v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.NUMBER32 = constant(5);

/**
 * @param {number}
 * @returns {Array}
 */
encode.REAL = function(v) {
    var value = v.toString();

    // Some numbers use an epsilon to encode the value. (e.g. JavaScript will store 0.0000001 as 1e-7)
    // This code converts it back to a number without the epsilon.
    var m = /\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/.exec(value);
    if (m) {
        var epsilon = parseFloat('1e' + ((m[2] ? +m[2] : 0) + m[1].length));
        value = (Math.round(v * epsilon) / epsilon).toString();
    }

    var nibbles = '';
    var i;
    var ii;
    for (i = 0, ii = value.length; i < ii; i += 1) {
        var c = value[i];
        if (c === 'e') {
            nibbles += value[++i] === '-' ? 'c' : 'b';
        } else if (c === '.') {
            nibbles += 'a';
        } else if (c === '-') {
            nibbles += 'e';
        } else {
            nibbles += c;
        }
    }

    nibbles += (nibbles.length & 1) ? 'f' : 'ff';
    var out = [30];
    for (i = 0, ii = nibbles.length; i < ii; i += 2) {
        out.push(parseInt(nibbles.substr(i, 2), 16));
    }

    return out;
};

/**
 * @param {number}
 * @returns {number}
 */
sizeOf.REAL = function(v) {
    return encode.REAL(v).length;
};

encode.NAME = encode.CHARARRAY;
sizeOf.NAME = sizeOf.CHARARRAY;

encode.STRING = encode.CHARARRAY;
sizeOf.STRING = sizeOf.CHARARRAY;

/**
 * @param {DataView} data
 * @param {number} offset
 * @param {number} numBytes
 * @returns {string}
 */
decode.UTF8 = function(data, offset, numBytes) {
    var codePoints = [];
    var numChars = numBytes;
    for (var j = 0; j < numChars; j++, offset += 1) {
        codePoints[j] = data.getUint8(offset);
    }

    return String.fromCharCode.apply(null, codePoints);
};

/**
 * @param {DataView} data
 * @param {number} offset
 * @param {number} numBytes
 * @returns {string}
 */
decode.UTF16 = function(data, offset, numBytes) {
    var codePoints = [];
    var numChars = numBytes / 2;
    for (var j = 0; j < numChars; j++, offset += 2) {
        codePoints[j] = data.getUint16(offset);
    }

    return String.fromCharCode.apply(null, codePoints);
};

/**
 * Convert a JavaScript string to UTF16-BE.
 * @param {string}
 * @returns {Array}
 */
encode.UTF16 = function(v) {
    var b = [];
    for (var i = 0; i < v.length; i += 1) {
        var codepoint = v.charCodeAt(i);
        b[b.length] = (codepoint >> 8) & 0xFF;
        b[b.length] = codepoint & 0xFF;
    }

    return b;
};

/**
 * @param {string}
 * @returns {number}
 */
sizeOf.UTF16 = function(v) {
    return v.length * 2;
};

// Data for converting old eight-bit Macintosh encodings to Unicode.
// This representation is optimized for decoding; encoding is slower
// and needs more memory. The assumption is that all opentype.js users
// want to open fonts, but saving a font will be comperatively rare
// so it can be more expensive. Keyed by IANA character set name.
//
// Python script for generating these strings:
//
//     s = u''.join([chr(c).decode('mac_greek') for c in range(128, 256)])
//     print(s.encode('utf-8'))
/**
 * @private
 */
var eightBitMacEncodings = {
    'x-mac-croatian':  // Python: 'mac_croatian'
        'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø' +
        '¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊©⁄€‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ',
    'x-mac-cyrillic':  // Python: 'mac_cyrillic'
        'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњ' +
        'јЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю',
    'x-mac-gaelic':
        // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/GAELIC.TXT
        'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØḂ±≤≥ḃĊċḊḋḞḟĠġṀæø' +
        'ṁṖṗɼƒſṠ«»… ÀÃÕŒœ–—“”‘’ṡẛÿŸṪ€‹›Ŷŷṫ·Ỳỳ⁊ÂÊÁËÈÍÎÏÌÓÔ♣ÒÚÛÙıÝýŴŵẄẅẀẁẂẃ',
    'x-mac-greek':  // Python: 'mac_greek'
        'Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦€ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩ' +
        'άΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ\u00AD',
    'x-mac-icelandic':  // Python: 'mac_iceland'
        'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
        '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
    'x-mac-inuit':
        // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/INUIT.TXT
        'ᐃᐄᐅᐆᐊᐋᐱᐲᐳᐴᐸᐹᑉᑎᑏᑐᑑᑕᑖᑦᑭᑮᑯᑰᑲᑳᒃᒋᒌᒍᒎᒐᒑ°ᒡᒥᒦ•¶ᒧ®©™ᒨᒪᒫᒻᓂᓃᓄᓅᓇᓈᓐᓯᓰᓱᓲᓴᓵᔅᓕᓖᓗ' +
        'ᓘᓚᓛᓪᔨᔩᔪᔫᔭ… ᔮᔾᕕᕖᕗ–—“”‘’ᕘᕙᕚᕝᕆᕇᕈᕉᕋᕌᕐᕿᖀᖁᖂᖃᖄᖅᖏᖐᖑᖒᖓᖔᖕᙱᙲᙳᙴᙵᙶᖖᖠᖡᖢᖣᖤᖥᖦᕼŁł',
    'x-mac-ce':  // Python: 'mac_latin2'
        'ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅ' +
        'ņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ',
    macintosh:  // Python: 'mac_roman'
        'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
        '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
    'x-mac-romanian':  // Python: 'mac_romanian'
        'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂȘ∞±≤≥¥µ∂∑∏π∫ªºΩăș' +
        '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›Țț‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
    'x-mac-turkish':  // Python: 'mac_turkish'
        'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
        '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙˆ˜¯˘˙˚¸˝˛ˇ'
};

/**
 * Decodes an old-style Macintosh string. Returns either a Unicode JavaScript
 * string, or 'undefined' if the encoding is unsupported. For example, we do
 * not support Chinese, Japanese or Korean because these would need large
 * mapping tables.
 * @param {DataView} dataView
 * @param {number} offset
 * @param {number} dataLength
 * @param {string} encoding
 * @returns {string}
 */
decode.MACSTRING = function(dataView, offset, dataLength, encoding) {
    var table = eightBitMacEncodings[encoding];
    if (table === undefined) {
        return undefined;
    }

    var result = '';
    for (var i = 0; i < dataLength; i++) {
        var c = dataView.getUint8(offset + i);
        // In all eight-bit Mac encodings, the characters 0x00..0x7F are
        // mapped to U+0000..U+007F; we only need to look up the others.
        if (c <= 0x7F) {
            result += String.fromCharCode(c);
        } else {
            result += table[c & 0x7F];
        }
    }

    return result;
};

// Helper function for encode.MACSTRING. Returns a dictionary for mapping
// Unicode character codes to their 8-bit MacOS equivalent. This table
// is not exactly a super cheap data structure, but we do not care because
// encoding Macintosh strings is only rarely needed in typical applications.
var macEncodingTableCache = typeof WeakMap === 'function' && new WeakMap();
var macEncodingCacheKeys;
var getMacEncodingTable = function(encoding) {
    // Since we use encoding as a cache key for WeakMap, it has to be
    // a String object and not a literal. And at least on NodeJS 2.10.1,
    // WeakMap requires that the same String instance is passed for cache hits.
    if (!macEncodingCacheKeys) {
        macEncodingCacheKeys = {};
        for (var e in eightBitMacEncodings) {
            /*jshint -W053 */  // Suppress "Do not use String as a constructor."
            macEncodingCacheKeys[e] = new String(e);
        }
    }

    var cacheKey = macEncodingCacheKeys[encoding];
    if (cacheKey === undefined) {
        return undefined;
    }

    // We can't do "if (cache.has(key)) {return cache.get(key)}" here:
    // since garbage collection may run at any time, it could also kick in
    // between the calls to cache.has() and cache.get(). In that case,
    // we would return 'undefined' even though we do support the encoding.
    if (macEncodingTableCache) {
        var cachedTable = macEncodingTableCache.get(cacheKey);
        if (cachedTable !== undefined) {
            return cachedTable;
        }
    }

    var decodingTable = eightBitMacEncodings[encoding];
    if (decodingTable === undefined) {
        return undefined;
    }

    var encodingTable = {};
    for (var i = 0; i < decodingTable.length; i++) {
        encodingTable[decodingTable.charCodeAt(i)] = i + 0x80;
    }

    if (macEncodingTableCache) {
        macEncodingTableCache.set(cacheKey, encodingTable);
    }

    return encodingTable;
};

/**
 * Encodes an old-style Macintosh string. Returns a byte array upon success.
 * If the requested encoding is unsupported, or if the input string contains
 * a character that cannot be expressed in the encoding, the function returns
 * 'undefined'.
 * @param {string} str
 * @param {string} encoding
 * @returns {Array}
 */
encode.MACSTRING = function(str, encoding) {
    var table = getMacEncodingTable(encoding);
    if (table === undefined) {
        return undefined;
    }

    var result = [];
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);

        // In all eight-bit Mac encodings, the characters 0x00..0x7F are
        // mapped to U+0000..U+007F; we only need to look up the others.
        if (c >= 0x80) {
            c = table[c];
            if (c === undefined) {
                // str contains a Unicode character that cannot be encoded
                // in the requested encoding.
                return undefined;
            }
        }
        result[i] = c;
        // result.push(c);
    }

    return result;
};

/**
 * @param {string} str
 * @param {string} encoding
 * @returns {number}
 */
sizeOf.MACSTRING = function(str, encoding) {
    var b = encode.MACSTRING(str, encoding);
    if (b !== undefined) {
        return b.length;
    } else {
        return 0;
    }
};

// Convert a list of values to a CFF INDEX structure.
// The values should be objects containing name / type / value.
/**
 * @param {Array} l
 * @returns {Array}
 */
encode.INDEX = function(l) {
    var i;
    //var offset, offsets, offsetEncoder, encodedOffsets, encodedOffset, data,
    //    i, v;
    // Because we have to know which data type to use to encode the offsets,
    // we have to go through the values twice: once to encode the data and
    // calculate the offets, then again to encode the offsets using the fitting data type.
    var offset = 1; // First offset is always 1.
    var offsets = [offset];
    var data = [];
    for (i = 0; i < l.length; i += 1) {
        var v = encode.OBJECT(l[i]);
        Array.prototype.push.apply(data, v);
        offset += v.length;
        offsets.push(offset);
    }

    if (data.length === 0) {
        return [0, 0];
    }

    var encodedOffsets = [];
    var offSize = (1 + Math.floor(Math.log(offset) / Math.log(2)) / 8) | 0;
    var offsetEncoder = [undefined, encode.BYTE, encode.USHORT, encode.UINT24, encode.ULONG][offSize];
    for (i = 0; i < offsets.length; i += 1) {
        var encodedOffset = offsetEncoder(offsets[i]);
        Array.prototype.push.apply(encodedOffsets, encodedOffset);
    }

    return Array.prototype.concat(encode.Card16(l.length),
                           encode.OffSize(offSize),
                           encodedOffsets,
                           data);
};

/**
 * @param {Array}
 * @returns {number}
 */
sizeOf.INDEX = function(v) {
    return encode.INDEX(v).length;
};

/**
 * Convert an object to a CFF DICT structure.
 * The keys should be numeric.
 * The values should be objects containing name / type / value.
 * @param {Object} m
 * @returns {Array}
 */
encode.DICT = function(m) {
    var d = [];
    var keys = Object.keys(m);
    var length = keys.length;

    for (var i = 0; i < length; i += 1) {
        // Object.keys() return string keys, but our keys are always numeric.
        var k = parseInt(keys[i], 0);
        var v = m[k];
        // Value comes before the key.
        d = d.concat(encode.OPERAND(v.value, v.type));
        d = d.concat(encode.OPERATOR(k));
    }

    return d;
};

/**
 * @param {Object}
 * @returns {number}
 */
sizeOf.DICT = function(m) {
    return encode.DICT(m).length;
};

/**
 * @param {number}
 * @returns {Array}
 */
encode.OPERATOR = function(v) {
    if (v < 1200) {
        return [v];
    } else {
        return [12, v - 1200];
    }
};

/**
 * @param {Array} v
 * @param {string}
 * @returns {Array}
 */
encode.OPERAND = function(v, type) {
    var d = [];
    if (Array.isArray(type)) {
        for (var i = 0; i < type.length; i += 1) {
            check.argument(v.length === type.length, 'Not enough arguments given for type' + type);
            d = d.concat(encode.OPERAND(v[i], type[i]));
        }
    } else {
        if (type === 'SID') {
            d = d.concat(encode.NUMBER(v));
        } else if (type === 'offset') {
            // We make it easy for ourselves and always encode offsets as
            // 4 bytes. This makes offset calculation for the top dict easier.
            d = d.concat(encode.NUMBER32(v));
        } else if (type === 'number') {
            d = d.concat(encode.NUMBER(v));
        } else if (type === 'real') {
            d = d.concat(encode.REAL(v));
        } else {
            throw new Error('Unknown operand type ' + type);
            // FIXME Add support for booleans
        }
    }

    return d;
};

encode.OP = encode.BYTE;
sizeOf.OP = sizeOf.BYTE;

// memoize charstring encoding using WeakMap if available
var wmm = typeof WeakMap === 'function' && new WeakMap();

/**
 * Convert a list of CharString operations to bytes.
 * @param {Array}
 * @returns {Array}
 */
encode.CHARSTRING = function(ops) {
    // See encode.MACSTRING for why we don't do "if (wmm && wmm.has(ops))".
    if (wmm) {
        var cachedValue = wmm.get(ops);
        if (cachedValue !== undefined) {
            return cachedValue;
        }
    }

    var d = [];
    var length = ops.length;

    for (var i = 0; i < length; i += 1) {
        var op = ops[i];
        d = d.concat(encode[op.type](op.value));
    }

    if (wmm) {
        wmm.set(ops, d);
    }

    return d;
};

/**
 * @param {Array}
 * @returns {number}
 */
sizeOf.CHARSTRING = function(ops) {
    return encode.CHARSTRING(ops).length;
};

// Utility functions ////////////////////////////////////////////////////////

/**
 * Convert an object containing name / type / value to bytes.
 * @param {Object}
 * @returns {Array}
 */
encode.OBJECT = function(v) {
    var encodingFunction = encode[v.type];
    check.argument(encodingFunction !== undefined, 'No encoding function for type ' + v.type);
    return encodingFunction(v.value);
};

/**
 * @param {Object}
 * @returns {number}
 */
sizeOf.OBJECT = function(v) {
    var sizeOfFunction = sizeOf[v.type];
    check.argument(sizeOfFunction !== undefined, 'No sizeOf function for type ' + v.type);
    return sizeOfFunction(v.value);
};

/**
 * Convert a table object to bytes.
 * A table contains a list of fields containing the metadata (name, type and default value).
 * The table itself has the field values set as attributes.
 * @param {opentype.Table}
 * @returns {Array}
 */
encode.TABLE = function(table) {
    var d = [];
    var length = table.fields.length;
    var subtables = [];
    var subtableOffsets = [];
    var i;

    for (i = 0; i < length; i += 1) {
        var field = table.fields[i];
        var encodingFunction = encode[field.type];
        check.argument(encodingFunction !== undefined, 'No encoding function for field type ' + field.type + ' (' + field.name + ')');
        var value = table[field.name];
        if (value === undefined) {
            value = field.value;
        }

        var bytes = encodingFunction(value);

        if (field.type === 'TABLE') {
            subtableOffsets.push(d.length);
            d = d.concat([0, 0]);
            subtables.push(bytes);
        } else {
            d = d.concat(bytes);
        }
    }

    for (i = 0; i < subtables.length; i += 1) {
        var o = subtableOffsets[i];
        var offset = d.length;
        check.argument(offset < 65536, 'Table ' + table.tableName + ' too big.');
        d[o] = offset >> 8;
        d[o + 1] = offset & 0xff;
        d = d.concat(subtables[i]);
    }

    return d;
};

/**
 * @param {opentype.Table}
 * @returns {number}
 */
sizeOf.TABLE = function(table) {
    var numBytes = 0;
    var length = table.fields.length;

    for (var i = 0; i < length; i += 1) {
        var field = table.fields[i];
        var sizeOfFunction = sizeOf[field.type];
        check.argument(sizeOfFunction !== undefined, 'No sizeOf function for field type ' + field.type + ' (' + field.name + ')');
        var value = table[field.name];
        if (value === undefined) {
            value = field.value;
        }

        numBytes += sizeOfFunction(value);

        // Subtables take 2 more bytes for offsets.
        if (field.type === 'TABLE') {
            numBytes += 2;
        }
    }

    return numBytes;
};

encode.RECORD = encode.TABLE;
sizeOf.RECORD = sizeOf.TABLE;

// Merge in a list of bytes.
encode.LITERAL = function(v) {
    return v;
};

sizeOf.LITERAL = function(v) {
    return v.length;
};

exports.decode = decode;
exports.encode = encode;
exports.sizeOf = sizeOf;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The GlyphSet object



var _glyph = __webpack_require__(10);

// Define a property on the glyph that depends on the path being loaded.
function defineDependentProperty(glyph, externalName, internalName) {
    Object.defineProperty(glyph, externalName, {
        get: function() {
            // Request the path property to make sure the path is loaded.
            glyph.path; // jshint ignore:line
            return glyph[internalName];
        },
        set: function(newValue) {
            glyph[internalName] = newValue;
        },
        enumerable: true,
        configurable: true
    });
}

/**
 * A GlyphSet represents all glyphs available in the font, but modelled using
 * a deferred glyph loader, for retrieving glyphs only once they are absolutely
 * necessary, to keep the memory footprint down.
 * @exports opentype.GlyphSet
 * @class
 * @param {opentype.Font}
 * @param {Array}
 */
function GlyphSet(font, glyphs) {
    this.font = font;
    this.glyphs = {};
    if (Array.isArray(glyphs)) {
        for (var i = 0; i < glyphs.length; i++) {
            this.glyphs[i] = glyphs[i];
        }
    }

    this.length = (glyphs && glyphs.length) || 0;
}

/**
 * @param  {number} index
 * @return {opentype.Glyph}
 */
GlyphSet.prototype.get = function(index) {
    if (typeof this.glyphs[index] === 'function') {
        this.glyphs[index] = this.glyphs[index]();
    }

    return this.glyphs[index];
};

/**
 * @param  {number} index
 * @param  {Object}
 */
GlyphSet.prototype.push = function(index, loader) {
    this.glyphs[index] = loader;
    this.length++;
};

/**
 * @alias opentype.glyphLoader
 * @param  {opentype.Font} font
 * @param  {number} index
 * @return {opentype.Glyph}
 */
function glyphLoader(font, index) {
    return new _glyph.Glyph({index: index, font: font});
}

/**
 * Generate a stub glyph that can be filled with all metadata *except*
 * the "points" and "path" properties, which must be loaded only once
 * the glyph's path is actually requested for text shaping.
 * @alias opentype.ttfGlyphLoader
 * @param  {opentype.Font} font
 * @param  {number} index
 * @param  {Function} parseGlyph
 * @param  {Object} data
 * @param  {number} position
 * @param  {Function} buildPath
 * @return {opentype.Glyph}
 */
function ttfGlyphLoader(font, index, parseGlyph, data, position, buildPath) {
    return function() {
        var glyph = new _glyph.Glyph({index: index, font: font});

        glyph.path = function() {
            parseGlyph(glyph, data, position);
            var path = buildPath(font.glyphs, glyph);
            path.unitsPerEm = font.unitsPerEm;
            return path;
        };

        defineDependentProperty(glyph, 'xMin', '_xMin');
        defineDependentProperty(glyph, 'xMax', '_xMax');
        defineDependentProperty(glyph, 'yMin', '_yMin');
        defineDependentProperty(glyph, 'yMax', '_yMax');

        return glyph;
    };
}
/**
 * @alias opentype.cffGlyphLoader
 * @param  {opentype.Font} font
 * @param  {number} index
 * @param  {Function} parseCFFCharstring
 * @param  {string} charstring
 * @return {opentype.Glyph}
 */
function cffGlyphLoader(font, index, parseCFFCharstring, charstring) {
    return function() {
        var glyph = new _glyph.Glyph({index: index, font: font});

        glyph.path = function() {
            var path = parseCFFCharstring(font, glyph, charstring);
            path.unitsPerEm = font.unitsPerEm;
            return path;
        };

        return glyph;
    };
}

exports.GlyphSet = GlyphSet;
exports.glyphLoader = glyphLoader;
exports.ttfGlyphLoader = ttfGlyphLoader;
exports.cffGlyphLoader = cffGlyphLoader;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["getGridCache"] = getGridCache;
/**
 * Created by meredith on 6/4/16.
 */

var gridCache = {
    "Westlake": {"6": 5, "8": 4},
    "Sand Point": {"9": 2, "32": 5, "39": 5},
    "South Park": {"7": 2, "9": 3},
    "Pinehurst": {"9": 4, "17": 5, "19": 5},
    "Brighton": {"8": 3, "21": 4, "24": 4},
    "Maple Leaf": {"9": 3, "15": 4, "17": 4},
    "Sunset Hill": {"10": 4, "21": 5, "25": 5},
    "Beacon Hill": {"10": 8, "15": 5, "16": 5},
    "Rainier Beach": {"11": 4, "12": 3},
    "Broadmoor": {"9": 3, "23": 5, "25": 5},
    "Madison Park": {"11": 4, "17": 5, "18": 5},
    "Whittier Heights": {"6": 2, "7": 3, "15": 4},
    "High Point": {"6": 3, "7": 3, "9": 3},
    "Interbay": {"8": 4, "12": 4, "14": 4},
    "View Ridge": {"9": 2, "19": 4, "21": 4},
    "Matthews Beach": {"13": 4, "17": 5, "18": 5},
    "Wedgwood": {"8": 2, "18": 2, "20": 3},
    "South Lake Union": {"10": 2, "13": 2, "15": 2},
    "Capitol Hill": {"11": 3, "26": 4, "30": 5},
    "First Hill": {"9": 2, "28": 4, "31": 4},
    "Arbor Heights": {"9": 3, "10": 3, "12": 3},
    "Northgate": {"7": 2, "8": 2, "9": 2},
    "Lower Queen Anne": {"9": 2, "10": 2, "15": 3},
    "Eastlake": {"8": 4},
    "Mount Baker": {"10": 3},
    "Fauntleroy": {"10": 3, "11": 2, "12": 2},
    "Windermere": {"10": 2, "14": 2, "15": 2},
    "Haller Lake": {"10": 3, "20": 5, "23": 5},
    "Meadowbrook": {"11": 4, "15": 4, "17": 5},
    "Downtown": {"8": 3, "16": 4, "17": 5},
    "Admiral": {"7": 2, "8": 2},
    "North College Park": {"14": 4, "15": 4, "17": 4},
    "Queen Anne": {"9": 2, "23": 5, "25": 5},
    "Atlantic": {"8": 4, "11": 5, "13": 5},
    "Loyal Heights": {"6": 2, "7": 2, "12": 3},
    "North Beach": {"10": 2, "17": 3, "19": 3},
    "Denny-Blaine": {"11": 4, "12": 4},
    "Madison Valley": {"13": 3, "14": 3, "16": 3},
    "Central District": {"15": 4, "22": 5, "24": 5},
    "International District": {"6": 1, "21": 2},
    "Industrial District": {"18": 3, "27": 4, "30": 5},
    "University District": {"6": 2, "18": 4},
    "Roosevelt": {"9": 3, "15": 4, "17": 4},
    "Pioneer Square": {"12": 4, "13": 4, "14": 4},
    "Blue Ridge": {"9": 2, "11": 2, "12": 2},
    "Ballard": {"7": 2, "10": 2, "11": 2},
    "Portage Bay": {"10": 3, "11": 3},
    "Roxhill": {"7": 3, "8": 3, "9": 3},
    "North Delridge": {"13": 3, "14": 3, "17": 3},
    "Highland Park": {"12": 3, "20": 4, "23": 4},
    "Fremont": {"7": 2, "26": 4, "30": 4},
    "Wallingford": {"11": 3, "12": 3},
    "Hawthorne Hills": {"14": 2, "24": 3, "27": 3},
    "Greenwood": {"9": 3, "18": 4, "19": 4},
    "Leschi": {"6": 3, "11": 3, "13": 4},
    "Columbia City": {"9": 2, "10": 3, "12": 3},
    "Riverview": {"9": 3, "21": 5, "23": 5},
    "Montlake": {"4": 2, "8": 3},
    "Green Lake": {"9": 2, "13": 3, "15": 3},
    "Olympic Hills": {"12": 3, "16": 3, "17": 3},
    "Ravenna": {"7": 2, "8": 3, "15": 3, "16": 4},
    "Laurelhurst": {"10": 2, "11": 3},
    "Crown Hill": {"9": 3, "16": 4, "18": 4},
    "Madrona": {"7": 2, "11": 3},
    "Broadview": {"9": 3, "11": 3, "12": 4},
    "Bitter Lake": {"10": 5, "11": 5},
    "Seward Park": {"10": 3, "23": 4, "26": 5},
    "Olympic Manor": {"12": 3, "14": 3, "16": 4},
    "South Delridge": {"11": 4, "12": 4, "13": 4},
    "Cedar Park": {"9": 3, "10": 3, "11": 4},
    "Victory Heights": {"14": 5, "19": 5, "21": 5},
    "Magnolia": {"8": 2, "13": 2, "14": 4},
    "Phinney Ridge": {"7": 2, "8": 2, "12": 3},
    "West Seattle": {"11": 5, "15": 5, "17": 5},
    "Belltown": {"8": 1, "13": 2, "15": 2},
    "Bryant": {"6": 3, "21": 5, "23": 5},
    "Alki": {"4": 1, "13": 1, "15": 1},
    "Georgetown": {"10": 2, "21": 3, "22": 4}

};

function getGridCache() {
    return gridCache;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The Bounding Box object



function derive(v0, v1, v2, v3, t) {
    return Math.pow(1 - t, 3) * v0 +
        3 * Math.pow(1 - t, 2) * t * v1 +
        3 * (1 - t) * Math.pow(t, 2) * v2 +
        Math.pow(t, 3) * v3;
}
/**
 * A bounding box is an enclosing box that describes the smallest measure within which all the points lie.
 * It is used to calculate the bounding box of a glyph or text path.
 *
 * On initialization, x1/y1/x2/y2 will be NaN. Check if the bounding box is empty using `isEmpty()`.
 *
 * @exports opentype.BoundingBox
 * @class
 * @constructor
 */
function BoundingBox() {
    this.x1 = Number.NaN;
    this.y1 = Number.NaN;
    this.x2 = Number.NaN;
    this.y2 = Number.NaN;
}

/**
 * Returns true if the bounding box is empty, that is, no points have been added to the box yet.
 */
BoundingBox.prototype.isEmpty = function() {
    return isNaN(this.x1) || isNaN(this.y1) || isNaN(this.x2) || isNaN(this.y2);
};

/**
 * Add the point to the bounding box.
 * The x1/y1/x2/y2 coordinates of the bounding box will now encompass the given point.
 * @param {number} x - The X coordinate of the point.
 * @param {number} y - The Y coordinate of the point.
 */
BoundingBox.prototype.addPoint = function(x, y) {
    if (typeof x === 'number') {
        if (isNaN(this.x1) || isNaN(this.x2)) {
            this.x1 = x;
            this.x2 = x;
        }
        if (x < this.x1) {
            this.x1 = x;
        }
        if (x > this.x2) {
            this.x2 = x;
        }
    }
    if (typeof y === 'number') {
        if (isNaN(this.y1) || isNaN(this.y2)) {
            this.y1 = y;
            this.y2 = y;
        }
        if (y < this.y1) {
            this.y1 = y;
        }
        if (y > this.y2) {
            this.y2 = y;
        }
    }
};

/**
 * Add a X coordinate to the bounding box.
 * This extends the bounding box to include the X coordinate.
 * This function is used internally inside of addBezier.
 * @param {number} x - The X coordinate of the point.
 */
BoundingBox.prototype.addX = function(x) {
    this.addPoint(x, null);
};

/**
 * Add a Y coordinate to the bounding box.
 * This extends the bounding box to include the Y coordinate.
 * This function is used internally inside of addBezier.
 * @param {number} y - The Y coordinate of the point.
 */
BoundingBox.prototype.addY = function(y) {
    this.addPoint(null, y);
};

/**
 * Add a Bézier curve to the bounding box.
 * This extends the bounding box to include the entire Bézier.
 * @param {number} x0 - The starting X coordinate.
 * @param {number} y0 - The starting Y coordinate.
 * @param {number} x1 - The X coordinate of the first control point.
 * @param {number} y1 - The Y coordinate of the first control point.
 * @param {number} x2 - The X coordinate of the second control point.
 * @param {number} y2 - The Y coordinate of the second control point.
 * @param {number} x - The ending X coordinate.
 * @param {number} y - The ending Y coordinate.
 */
BoundingBox.prototype.addBezier = function(x0, y0, x1, y1, x2, y2, x, y) {
    // This code is based on http://nishiohirokazu.blogspot.com/2009/06/how-to-calculate-bezier-curves-bounding.html
    // and https://github.com/icons8/svg-path-bounding-box

    var p0 = [x0, y0];
    var p1 = [x1, y1];
    var p2 = [x2, y2];
    var p3 = [x, y];

    this.addPoint(x0, y0);
    this.addPoint(x, y);

    for (var i = 0; i <= 1; i++) {
        var b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
        var a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
        var c = 3 * p1[i] - 3 * p0[i];

        if (a === 0) {
            if (b === 0) continue;
            var t = -c / b;
            if (0 < t && t < 1) {
                if (i === 0) this.addX(derive(p0[i], p1[i], p2[i], p3[i], t));
                if (i === 1) this.addY(derive(p0[i], p1[i], p2[i], p3[i], t));
            }
            continue;
        }

        var b2ac = Math.pow(b, 2) - 4 * c * a;
        if (b2ac < 0) continue;
        var t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
        if (0 < t1 && t1 < 1) {
            if (i === 0) this.addX(derive(p0[i], p1[i], p2[i], p3[i], t1));
            if (i === 1) this.addY(derive(p0[i], p1[i], p2[i], p3[i], t1));
        }
        var t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
        if (0 < t2 && t2 < 1) {
            if (i === 0) this.addX(derive(p0[i], p1[i], p2[i], p3[i], t2));
            if (i === 1) this.addY(derive(p0[i], p1[i], p2[i], p3[i], t2));
        }
    }
};

/**
 * Add a quadratic curve to the bounding box.
 * This extends the bounding box to include the entire quadratic curve.
 * @param {number} x0 - The starting X coordinate.
 * @param {number} y0 - The starting Y coordinate.
 * @param {number} x1 - The X coordinate of the control point.
 * @param {number} y1 - The Y coordinate of the control point.
 * @param {number} x - The ending X coordinate.
 * @param {number} y - The ending Y coordinate.
 */
BoundingBox.prototype.addQuad = function(x0, y0, x1, y1, x, y) {
    var cp1x = x0 + 2 / 3 * (x1 - x0);
    var cp1y = y0 + 2 / 3 * (y1 - y0);
    var cp2x = cp1x + 1 / 3 * (x - x0);
    var cp2y = cp1y + 1 / 3 * (y - y0);
    this.addBezier(x0, y0, cp1x, cp1y, cp2x, cp2y, x, y);
};

exports.BoundingBox = BoundingBox;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The Glyph object



var check = __webpack_require__(1);
var draw = __webpack_require__(35);
var path = __webpack_require__(3);

function getPathDefinition(glyph, path) {
    var _path = path || { commands: [] };
    return {
        configurable: true,

        get: function() {
            if (typeof _path === 'function') {
                _path = _path();
            }

            return _path;
        },

        set: function(p) {
            _path = p;
        }
    };
}
/**
 * @typedef GlyphOptions
 * @type Object
 * @property {string} [name] - The glyph name
 * @property {number} [unicode]
 * @property {Array} [unicodes]
 * @property {number} [xMin]
 * @property {number} [yMin]
 * @property {number} [xMax]
 * @property {number} [yMax]
 * @property {number} [advanceWidth]
 */

// A Glyph is an individual mark that often corresponds to a character.
// Some glyphs, such as ligatures, are a combination of many characters.
// Glyphs are the basic building blocks of a font.
//
// The `Glyph` class contains utility methods for drawing the path and its points.
/**
 * @exports opentype.Glyph
 * @class
 * @param {GlyphOptions}
 * @constructor
 */
function Glyph(options) {
    // By putting all the code on a prototype function (which is only declared once)
    // we reduce the memory requirements for larger fonts by some 2%
    this.bindConstructorValues(options);
}

/**
 * @param  {GlyphOptions}
 */
Glyph.prototype.bindConstructorValues = function(options) {
    this.index = options.index || 0;

    // These three values cannnot be deferred for memory optimization:
    this.name = options.name || null;
    this.unicode = options.unicode || undefined;
    this.unicodes = options.unicodes || options.unicode !== undefined ? [options.unicode] : [];

    // But by binding these values only when necessary, we reduce can
    // the memory requirements by almost 3% for larger fonts.
    if (options.xMin) {
        this.xMin = options.xMin;
    }

    if (options.yMin) {
        this.yMin = options.yMin;
    }

    if (options.xMax) {
        this.xMax = options.xMax;
    }

    if (options.yMax) {
        this.yMax = options.yMax;
    }

    if (options.advanceWidth) {
        this.advanceWidth = options.advanceWidth;
    }

    // The path for a glyph is the most memory intensive, and is bound as a value
    // with a getter/setter to ensure we actually do path parsing only once the
    // path is actually needed by anything.
    Object.defineProperty(this, 'path', getPathDefinition(this, options.path));
};

/**
 * @param {number}
 */
Glyph.prototype.addUnicode = function(unicode) {
    if (this.unicodes.length === 0) {
        this.unicode = unicode;
    }

    this.unicodes.push(unicode);
};

/**
 * Calculate the minimum bounding box for this glyph.
 * @return {opentype.BoundingBox}
 */
Glyph.prototype.getBoundingBox = function() {
    return this.path.getBoundingBox();
};

/**
 * Convert the glyph to a Path we can draw on a drawing context.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {Object=} options - xScale, yScale to strech the glyph.
 * @return {opentype.Path}
 */
Glyph.prototype.getPath = function(x, y, fontSize, options) {
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    options = options !== undefined ? options : {xScale: 1.0, yScale: 1.0};
    fontSize = fontSize !== undefined ? fontSize : 72;
    var scale = 1 / this.path.unitsPerEm * fontSize;
    var xScale = options.xScale * scale;
    var yScale = options.yScale * scale;

    var p = new path.Path();
    var commands = this.path.commands;
    for (var i = 0; i < commands.length; i += 1) {
        var cmd = commands[i];
        if (cmd.type === 'M') {
            p.moveTo(x + (cmd.x * xScale), y + (-cmd.y * yScale));
        } else if (cmd.type === 'L') {
            p.lineTo(x + (cmd.x * xScale), y + (-cmd.y * yScale));
        } else if (cmd.type === 'Q') {
            p.quadraticCurveTo(x + (cmd.x1 * xScale), y + (-cmd.y1 * yScale),
                               x + (cmd.x * xScale), y + (-cmd.y * yScale));
        } else if (cmd.type === 'C') {
            p.curveTo(x + (cmd.x1 * xScale), y + (-cmd.y1 * yScale),
                      x + (cmd.x2 * xScale), y + (-cmd.y2 * yScale),
                      x + (cmd.x * xScale), y + (-cmd.y * yScale));
        } else if (cmd.type === 'Z') {
            p.closePath();
        }
    }

    return p;
};

/**
 * Split the glyph into contours.
 * This function is here for backwards compatibility, and to
 * provide raw access to the TrueType glyph outlines.
 * @return {Array}
 */
Glyph.prototype.getContours = function() {
    if (this.points === undefined) {
        return [];
    }

    var contours = [];
    var currentContour = [];
    for (var i = 0; i < this.points.length; i += 1) {
        var pt = this.points[i];
        currentContour.push(pt);
        if (pt.lastPointOfContour) {
            contours.push(currentContour);
            currentContour = [];
        }
    }

    check.argument(currentContour.length === 0, 'There are still points left in the current contour.');
    return contours;
};

/**
 * Calculate the xMin/yMin/xMax/yMax/lsb/rsb for a Glyph.
 * @return {Object}
 */
Glyph.prototype.getMetrics = function() {
    var commands = this.path.commands;
    var xCoords = [];
    var yCoords = [];
    for (var i = 0; i < commands.length; i += 1) {
        var cmd = commands[i];
        if (cmd.type !== 'Z') {
            xCoords.push(cmd.x);
            yCoords.push(cmd.y);
        }

        if (cmd.type === 'Q' || cmd.type === 'C') {
            xCoords.push(cmd.x1);
            yCoords.push(cmd.y1);
        }

        if (cmd.type === 'C') {
            xCoords.push(cmd.x2);
            yCoords.push(cmd.y2);
        }
    }

    var metrics = {
        xMin: Math.min.apply(null, xCoords),
        yMin: Math.min.apply(null, yCoords),
        xMax: Math.max.apply(null, xCoords),
        yMax: Math.max.apply(null, yCoords),
        leftSideBearing: this.leftSideBearing
    };

    if (!isFinite(metrics.xMin)) {
        metrics.xMin = 0;
    }

    if (!isFinite(metrics.xMax)) {
        metrics.xMax = this.advanceWidth;
    }

    if (!isFinite(metrics.yMin)) {
        metrics.yMin = 0;
    }

    if (!isFinite(metrics.yMax)) {
        metrics.yMax = 0;
    }

    metrics.rightSideBearing = this.advanceWidth - metrics.leftSideBearing - (metrics.xMax - metrics.xMin);
    return metrics;
};

/**
 * Draw the glyph on the given context.
 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {Object=} options - xScale, yScale to strech the glyph.
 */
Glyph.prototype.draw = function(ctx, x, y, fontSize, options) {
    this.getPath(x, y, fontSize, options).draw(ctx);
};

/**
 * Draw the points of the glyph.
 * On-curve points will be drawn in blue, off-curve points will be drawn in red.
 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 */
Glyph.prototype.drawPoints = function(ctx, x, y, fontSize) {

    function drawCircles(l, x, y, scale) {
        var PI_SQ = Math.PI * 2;
        ctx.beginPath();
        for (var j = 0; j < l.length; j += 1) {
            ctx.moveTo(x + (l[j].x * scale), y + (l[j].y * scale));
            ctx.arc(x + (l[j].x * scale), y + (l[j].y * scale), 2, 0, PI_SQ, false);
        }

        ctx.closePath();
        ctx.fill();
    }

    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize !== undefined ? fontSize : 24;
    var scale = 1 / this.path.unitsPerEm * fontSize;

    var blueCircles = [];
    var redCircles = [];
    var path = this.path;
    for (var i = 0; i < path.commands.length; i += 1) {
        var cmd = path.commands[i];
        if (cmd.x !== undefined) {
            blueCircles.push({x: cmd.x, y: -cmd.y});
        }

        if (cmd.x1 !== undefined) {
            redCircles.push({x: cmd.x1, y: -cmd.y1});
        }

        if (cmd.x2 !== undefined) {
            redCircles.push({x: cmd.x2, y: -cmd.y2});
        }
    }

    ctx.fillStyle = 'blue';
    drawCircles(blueCircles, x, y, scale);
    ctx.fillStyle = 'red';
    drawCircles(redCircles, x, y, scale);
};

/**
 * Draw lines indicating important font measurements.
 * Black lines indicate the origin of the coordinate system (point 0,0).
 * Blue lines indicate the glyph bounding box.
 * Green line indicates the advance width of the glyph.
 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 */
Glyph.prototype.drawMetrics = function(ctx, x, y, fontSize) {
    var scale;
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize !== undefined ? fontSize : 24;
    scale = 1 / this.path.unitsPerEm * fontSize;
    ctx.lineWidth = 1;

    // Draw the origin
    ctx.strokeStyle = 'black';
    draw.line(ctx, x, -10000, x, 10000);
    draw.line(ctx, -10000, y, 10000, y);

    // This code is here due to memory optimization: by not using
    // defaults in the constructor, we save a notable amount of memory.
    var xMin = this.xMin || 0;
    var yMin = this.yMin || 0;
    var xMax = this.xMax || 0;
    var yMax = this.yMax || 0;
    var advanceWidth = this.advanceWidth || 0;

    // Draw the glyph box
    ctx.strokeStyle = 'blue';
    draw.line(ctx, x + (xMin * scale), -10000, x + (xMin * scale), 10000);
    draw.line(ctx, x + (xMax * scale), -10000, x + (xMax * scale), 10000);
    draw.line(ctx, -10000, y + (-yMin * scale), 10000, y + (-yMin * scale));
    draw.line(ctx, -10000, y + (-yMax * scale), 10000, y + (-yMax * scale));

    // Draw the advance width
    ctx.strokeStyle = 'green';
    draw.line(ctx, x + (advanceWidth * scale), -10000, x + (advanceWidth * scale), 10000);
};

exports.Glyph = Glyph;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The `CFF` table contains the glyph outlines in PostScript format.
// https://www.microsoft.com/typography/OTSPEC/cff.htm
// http://download.microsoft.com/download/8/0/1/801a191c-029d-4af3-9642-555f6fe514ee/cff.pdf
// http://download.microsoft.com/download/8/0/1/801a191c-029d-4af3-9642-555f6fe514ee/type2.pdf



var encoding = __webpack_require__(4);
var glyphset = __webpack_require__(6);
var parse = __webpack_require__(0);
var path = __webpack_require__(3);
var table = __webpack_require__(2);

// Custom equals function that can also check lists.
function equals(a, b) {
    if (a === b) {
        return true;
    } else if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }

        for (var i = 0; i < a.length; i += 1) {
            if (!equals(a[i], b[i])) {
                return false;
            }
        }

        return true;
    } else {
        return false;
    }
}

// Parse a `CFF` INDEX array.
// An index array consists of a list of offsets, then a list of objects at those offsets.
function parseCFFIndex(data, start, conversionFn) {
    //var i, objectOffset, endOffset;
    var offsets = [];
    var objects = [];
    var count = parse.getCard16(data, start);
    var i;
    var objectOffset;
    var endOffset;
    if (count !== 0) {
        var offsetSize = parse.getByte(data, start + 2);
        objectOffset = start + ((count + 1) * offsetSize) + 2;
        var pos = start + 3;
        for (i = 0; i < count + 1; i += 1) {
            offsets.push(parse.getOffset(data, pos, offsetSize));
            pos += offsetSize;
        }

        // The total size of the index array is 4 header bytes + the value of the last offset.
        endOffset = objectOffset + offsets[count];
    } else {
        endOffset = start + 2;
    }

    for (i = 0; i < offsets.length - 1; i += 1) {
        var value = parse.getBytes(data, objectOffset + offsets[i], objectOffset + offsets[i + 1]);
        if (conversionFn) {
            value = conversionFn(value);
        }

        objects.push(value);
    }

    return {objects: objects, startOffset: start, endOffset: endOffset};
}

// Parse a `CFF` DICT real value.
function parseFloatOperand(parser) {
    var s = '';
    var eof = 15;
    var lookup = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'E', 'E-', null, '-'];
    while (true) {
        var b = parser.parseByte();
        var n1 = b >> 4;
        var n2 = b & 15;

        if (n1 === eof) {
            break;
        }

        s += lookup[n1];

        if (n2 === eof) {
            break;
        }

        s += lookup[n2];
    }

    return parseFloat(s);
}

// Parse a `CFF` DICT operand.
function parseOperand(parser, b0) {
    var b1;
    var b2;
    var b3;
    var b4;
    if (b0 === 28) {
        b1 = parser.parseByte();
        b2 = parser.parseByte();
        return b1 << 8 | b2;
    }

    if (b0 === 29) {
        b1 = parser.parseByte();
        b2 = parser.parseByte();
        b3 = parser.parseByte();
        b4 = parser.parseByte();
        return b1 << 24 | b2 << 16 | b3 << 8 | b4;
    }

    if (b0 === 30) {
        return parseFloatOperand(parser);
    }

    if (b0 >= 32 && b0 <= 246) {
        return b0 - 139;
    }

    if (b0 >= 247 && b0 <= 250) {
        b1 = parser.parseByte();
        return (b0 - 247) * 256 + b1 + 108;
    }

    if (b0 >= 251 && b0 <= 254) {
        b1 = parser.parseByte();
        return -(b0 - 251) * 256 - b1 - 108;
    }

    throw new Error('Invalid b0 ' + b0);
}

// Convert the entries returned by `parseDict` to a proper dictionary.
// If a value is a list of one, it is unpacked.
function entriesToObject(entries) {
    var o = {};
    for (var i = 0; i < entries.length; i += 1) {
        var key = entries[i][0];
        var values = entries[i][1];
        var value;
        if (values.length === 1) {
            value = values[0];
        } else {
            value = values;
        }

        if (o.hasOwnProperty(key)) {
            throw new Error('Object ' + o + ' already has key ' + key);
        }

        o[key] = value;
    }

    return o;
}

// Parse a `CFF` DICT object.
// A dictionary contains key-value pairs in a compact tokenized format.
function parseCFFDict(data, start, size) {
    start = start !== undefined ? start : 0;
    var parser = new parse.Parser(data, start);
    var entries = [];
    var operands = [];
    size = size !== undefined ? size : data.length;

    while (parser.relativeOffset < size) {
        var op = parser.parseByte();

        // The first byte for each dict item distinguishes between operator (key) and operand (value).
        // Values <= 21 are operators.
        if (op <= 21) {
            // Two-byte operators have an initial escape byte of 12.
            if (op === 12) {
                op = 1200 + parser.parseByte();
            }

            entries.push([op, operands]);
            operands = [];
        } else {
            // Since the operands (values) come before the operators (keys), we store all operands in a list
            // until we encounter an operator.
            operands.push(parseOperand(parser, op));
        }
    }

    return entriesToObject(entries);
}

// Given a String Index (SID), return the value of the string.
// Strings below index 392 are standard CFF strings and are not encoded in the font.
function getCFFString(strings, index) {
    if (index <= 390) {
        index = encoding.cffStandardStrings[index];
    } else {
        index = strings[index - 391];
    }

    return index;
}

// Interpret a dictionary and return a new dictionary with readable keys and values for missing entries.
// This function takes `meta` which is a list of objects containing `operand`, `name` and `default`.
function interpretDict(dict, meta, strings) {
    var newDict = {};

    // Because we also want to include missing values, we start out from the meta list
    // and lookup values in the dict.
    for (var i = 0; i < meta.length; i += 1) {
        var m = meta[i];
        var value = dict[m.op];
        if (value === undefined) {
            value = m.value !== undefined ? m.value : null;
        }

        if (m.type === 'SID') {
            value = getCFFString(strings, value);
        }

        newDict[m.name] = value;
    }

    return newDict;
}

// Parse the CFF header.
function parseCFFHeader(data, start) {
    var header = {};
    header.formatMajor = parse.getCard8(data, start);
    header.formatMinor = parse.getCard8(data, start + 1);
    header.size = parse.getCard8(data, start + 2);
    header.offsetSize = parse.getCard8(data, start + 3);
    header.startOffset = start;
    header.endOffset = start + 4;
    return header;
}

var TOP_DICT_META = [
    {name: 'version', op: 0, type: 'SID'},
    {name: 'notice', op: 1, type: 'SID'},
    {name: 'copyright', op: 1200, type: 'SID'},
    {name: 'fullName', op: 2, type: 'SID'},
    {name: 'familyName', op: 3, type: 'SID'},
    {name: 'weight', op: 4, type: 'SID'},
    {name: 'isFixedPitch', op: 1201, type: 'number', value: 0},
    {name: 'italicAngle', op: 1202, type: 'number', value: 0},
    {name: 'underlinePosition', op: 1203, type: 'number', value: -100},
    {name: 'underlineThickness', op: 1204, type: 'number', value: 50},
    {name: 'paintType', op: 1205, type: 'number', value: 0},
    {name: 'charstringType', op: 1206, type: 'number', value: 2},
    {name: 'fontMatrix', op: 1207, type: ['real', 'real', 'real', 'real', 'real', 'real'], value: [0.001, 0, 0, 0.001, 0, 0]},
    {name: 'uniqueId', op: 13, type: 'number'},
    {name: 'fontBBox', op: 5, type: ['number', 'number', 'number', 'number'], value: [0, 0, 0, 0]},
    {name: 'strokeWidth', op: 1208, type: 'number', value: 0},
    {name: 'xuid', op: 14, type: [], value: null},
    {name: 'charset', op: 15, type: 'offset', value: 0},
    {name: 'encoding', op: 16, type: 'offset', value: 0},
    {name: 'charStrings', op: 17, type: 'offset', value: 0},
    {name: 'private', op: 18, type: ['number', 'offset'], value: [0, 0]}
];

var PRIVATE_DICT_META = [
    {name: 'subrs', op: 19, type: 'offset', value: 0},
    {name: 'defaultWidthX', op: 20, type: 'number', value: 0},
    {name: 'nominalWidthX', op: 21, type: 'number', value: 0}
];

// Parse the CFF top dictionary. A CFF table can contain multiple fonts, each with their own top dictionary.
// The top dictionary contains the essential metadata for the font, together with the private dictionary.
function parseCFFTopDict(data, strings) {
    var dict = parseCFFDict(data, 0, data.byteLength);
    return interpretDict(dict, TOP_DICT_META, strings);
}

// Parse the CFF private dictionary. We don't fully parse out all the values, only the ones we need.
function parseCFFPrivateDict(data, start, size, strings) {
    var dict = parseCFFDict(data, start, size);
    return interpretDict(dict, PRIVATE_DICT_META, strings);
}

// Parse the CFF charset table, which contains internal names for all the glyphs.
// This function will return a list of glyph names.
// See Adobe TN #5176 chapter 13, "Charsets".
function parseCFFCharset(data, start, nGlyphs, strings) {
    var i;
    var sid;
    var count;
    var parser = new parse.Parser(data, start);

    // The .notdef glyph is not included, so subtract 1.
    nGlyphs -= 1;
    var charset = ['.notdef'];

    var format = parser.parseCard8();
    if (format === 0) {
        for (i = 0; i < nGlyphs; i += 1) {
            sid = parser.parseSID();
            charset.push(getCFFString(strings, sid));
        }
    } else if (format === 1) {
        while (charset.length <= nGlyphs) {
            sid = parser.parseSID();
            count = parser.parseCard8();
            for (i = 0; i <= count; i += 1) {
                charset.push(getCFFString(strings, sid));
                sid += 1;
            }
        }
    } else if (format === 2) {
        while (charset.length <= nGlyphs) {
            sid = parser.parseSID();
            count = parser.parseCard16();
            for (i = 0; i <= count; i += 1) {
                charset.push(getCFFString(strings, sid));
                sid += 1;
            }
        }
    } else {
        throw new Error('Unknown charset format ' + format);
    }

    return charset;
}

// Parse the CFF encoding data. Only one encoding can be specified per font.
// See Adobe TN #5176 chapter 12, "Encodings".
function parseCFFEncoding(data, start, charset) {
    var i;
    var code;
    var enc = {};
    var parser = new parse.Parser(data, start);
    var format = parser.parseCard8();
    if (format === 0) {
        var nCodes = parser.parseCard8();
        for (i = 0; i < nCodes; i += 1) {
            code = parser.parseCard8();
            enc[code] = i;
        }
    } else if (format === 1) {
        var nRanges = parser.parseCard8();
        code = 1;
        for (i = 0; i < nRanges; i += 1) {
            var first = parser.parseCard8();
            var nLeft = parser.parseCard8();
            for (var j = first; j <= first + nLeft; j += 1) {
                enc[j] = code;
                code += 1;
            }
        }
    } else {
        throw new Error('Unknown encoding format ' + format);
    }

    return new encoding.CffEncoding(enc, charset);
}

// Take in charstring code and return a Glyph object.
// The encoding is described in the Type 2 Charstring Format
// https://www.microsoft.com/typography/OTSPEC/charstr2.htm
function parseCFFCharstring(font, glyph, code) {
    var c1x;
    var c1y;
    var c2x;
    var c2y;
    var p = new path.Path();
    var stack = [];
    var nStems = 0;
    var haveWidth = false;
    var width = font.defaultWidthX;
    var open = false;
    var x = 0;
    var y = 0;

    function newContour(x, y) {
        if (open) {
            p.closePath();
        }

        p.moveTo(x, y);
        open = true;
    }

    function parseStems() {
        var hasWidthArg;

        // The number of stem operators on the stack is always even.
        // If the value is uneven, that means a width is specified.
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
            width = stack.shift() + font.nominalWidthX;
        }

        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
    }

    function parse(code) {
        var b1;
        var b2;
        var b3;
        var b4;
        var codeIndex;
        var subrCode;
        var jpx;
        var jpy;
        var c3x;
        var c3y;
        var c4x;
        var c4y;

        var i = 0;
        while (i < code.length) {
            var v = code[i];
            i += 1;
            switch (v) {
                case 1: // hstem
                    parseStems();
                    break;
                case 3: // vstem
                    parseStems();
                    break;
                case 4: // vmoveto
                    if (stack.length > 1 && !haveWidth) {
                        width = stack.shift() + font.nominalWidthX;
                        haveWidth = true;
                    }

                    y += stack.pop();
                    newContour(x, y);
                    break;
                case 5: // rlineto
                    while (stack.length > 0) {
                        x += stack.shift();
                        y += stack.shift();
                        p.lineTo(x, y);
                    }

                    break;
                case 6: // hlineto
                    while (stack.length > 0) {
                        x += stack.shift();
                        p.lineTo(x, y);
                        if (stack.length === 0) {
                            break;
                        }

                        y += stack.shift();
                        p.lineTo(x, y);
                    }

                    break;
                case 7: // vlineto
                    while (stack.length > 0) {
                        y += stack.shift();
                        p.lineTo(x, y);
                        if (stack.length === 0) {
                            break;
                        }

                        x += stack.shift();
                        p.lineTo(x, y);
                    }

                    break;
                case 8: // rrcurveto
                    while (stack.length > 0) {
                        c1x = x + stack.shift();
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y + stack.shift();
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                case 10: // callsubr
                    codeIndex = stack.pop() + font.subrsBias;
                    subrCode = font.subrs[codeIndex];
                    if (subrCode) {
                        parse(subrCode);
                    }

                    break;
                case 11: // return
                    return;
                case 12: // flex operators
                    v = code[i];
                    i += 1;
                    switch (v) {
                        case 35: // flex
                            // |- dx1 dy1 dx2 dy2 dx3 dy3 dx4 dy4 dx5 dy5 dx6 dy6 fd flex (12 35) |-
                            c1x = x   + stack.shift();    // dx1
                            c1y = y   + stack.shift();    // dy1
                            c2x = c1x + stack.shift();    // dx2
                            c2y = c1y + stack.shift();    // dy2
                            jpx = c2x + stack.shift();    // dx3
                            jpy = c2y + stack.shift();    // dy3
                            c3x = jpx + stack.shift();    // dx4
                            c3y = jpy + stack.shift();    // dy4
                            c4x = c3x + stack.shift();    // dx5
                            c4y = c3y + stack.shift();    // dy5
                            x = c4x + stack.shift();      // dx6
                            y = c4y + stack.shift();      // dy6
                            stack.shift();                // flex depth
                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
                            break;
                        case 34: // hflex
                            // |- dx1 dx2 dy2 dx3 dx4 dx5 dx6 hflex (12 34) |-
                            c1x = x   + stack.shift();    // dx1
                            c1y = y;                      // dy1
                            c2x = c1x + stack.shift();    // dx2
                            c2y = c1y + stack.shift();    // dy2
                            jpx = c2x + stack.shift();    // dx3
                            jpy = c2y;                    // dy3
                            c3x = jpx + stack.shift();    // dx4
                            c3y = c2y;                    // dy4
                            c4x = c3x + stack.shift();    // dx5
                            c4y = y;                      // dy5
                            x = c4x + stack.shift();      // dx6
                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
                            break;
                        case 36: // hflex1
                            // |- dx1 dy1 dx2 dy2 dx3 dx4 dx5 dy5 dx6 hflex1 (12 36) |-
                            c1x = x   + stack.shift();    // dx1
                            c1y = y   + stack.shift();    // dy1
                            c2x = c1x + stack.shift();    // dx2
                            c2y = c1y + stack.shift();    // dy2
                            jpx = c2x + stack.shift();    // dx3
                            jpy = c2y;                    // dy3
                            c3x = jpx + stack.shift();    // dx4
                            c3y = c2y;                    // dy4
                            c4x = c3x + stack.shift();    // dx5
                            c4y = c3y + stack.shift();    // dy5
                            x = c4x + stack.shift();      // dx6
                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
                            break;
                        case 37: // flex1
                            // |- dx1 dy1 dx2 dy2 dx3 dy3 dx4 dy4 dx5 dy5 d6 flex1 (12 37) |-
                            c1x = x   + stack.shift();    // dx1
                            c1y = y   + stack.shift();    // dy1
                            c2x = c1x + stack.shift();    // dx2
                            c2y = c1y + stack.shift();    // dy2
                            jpx = c2x + stack.shift();    // dx3
                            jpy = c2y + stack.shift();    // dy3
                            c3x = jpx + stack.shift();    // dx4
                            c3y = jpy + stack.shift();    // dy4
                            c4x = c3x + stack.shift();    // dx5
                            c4y = c3y + stack.shift();    // dy5
                            if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
                                x = c4x + stack.shift();
                            } else {
                                y = c4y + stack.shift();
                            }

                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
                            break;
                        default:
                            console.log('Glyph ' + glyph.index + ': unknown operator ' + 1200 + v);
                            stack.length = 0;
                    }
                    break;
                case 14: // endchar
                    if (stack.length > 0 && !haveWidth) {
                        width = stack.shift() + font.nominalWidthX;
                        haveWidth = true;
                    }

                    if (open) {
                        p.closePath();
                        open = false;
                    }

                    break;
                case 18: // hstemhm
                    parseStems();
                    break;
                case 19: // hintmask
                case 20: // cntrmask
                    parseStems();
                    i += (nStems + 7) >> 3;
                    break;
                case 21: // rmoveto
                    if (stack.length > 2 && !haveWidth) {
                        width = stack.shift() + font.nominalWidthX;
                        haveWidth = true;
                    }

                    y += stack.pop();
                    x += stack.pop();
                    newContour(x, y);
                    break;
                case 22: // hmoveto
                    if (stack.length > 1 && !haveWidth) {
                        width = stack.shift() + font.nominalWidthX;
                        haveWidth = true;
                    }

                    x += stack.pop();
                    newContour(x, y);
                    break;
                case 23: // vstemhm
                    parseStems();
                    break;
                case 24: // rcurveline
                    while (stack.length > 2) {
                        c1x = x + stack.shift();
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y + stack.shift();
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    x += stack.shift();
                    y += stack.shift();
                    p.lineTo(x, y);
                    break;
                case 25: // rlinecurve
                    while (stack.length > 6) {
                        x += stack.shift();
                        y += stack.shift();
                        p.lineTo(x, y);
                    }

                    c1x = x + stack.shift();
                    c1y = y + stack.shift();
                    c2x = c1x + stack.shift();
                    c2y = c1y + stack.shift();
                    x = c2x + stack.shift();
                    y = c2y + stack.shift();
                    p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    break;
                case 26: // vvcurveto
                    if (stack.length % 2) {
                        x += stack.shift();
                    }

                    while (stack.length > 0) {
                        c1x = x;
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x;
                        y = c2y + stack.shift();
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                case 27: // hhcurveto
                    if (stack.length % 2) {
                        y += stack.shift();
                    }

                    while (stack.length > 0) {
                        c1x = x + stack.shift();
                        c1y = y;
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y;
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                case 28: // shortint
                    b1 = code[i];
                    b2 = code[i + 1];
                    stack.push(((b1 << 24) | (b2 << 16)) >> 16);
                    i += 2;
                    break;
                case 29: // callgsubr
                    codeIndex = stack.pop() + font.gsubrsBias;
                    subrCode = font.gsubrs[codeIndex];
                    if (subrCode) {
                        parse(subrCode);
                    }

                    break;
                case 30: // vhcurveto
                    while (stack.length > 0) {
                        c1x = x;
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y + (stack.length === 1 ? stack.shift() : 0);
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                        if (stack.length === 0) {
                            break;
                        }

                        c1x = x + stack.shift();
                        c1y = y;
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        y = c2y + stack.shift();
                        x = c2x + (stack.length === 1 ? stack.shift() : 0);
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                case 31: // hvcurveto
                    while (stack.length > 0) {
                        c1x = x + stack.shift();
                        c1y = y;
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        y = c2y + stack.shift();
                        x = c2x + (stack.length === 1 ? stack.shift() : 0);
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                        if (stack.length === 0) {
                            break;
                        }

                        c1x = x;
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y + (stack.length === 1 ? stack.shift() : 0);
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                default:
                    if (v < 32) {
                        console.log('Glyph ' + glyph.index + ': unknown operator ' + v);
                    } else if (v < 247) {
                        stack.push(v - 139);
                    } else if (v < 251) {
                        b1 = code[i];
                        i += 1;
                        stack.push((v - 247) * 256 + b1 + 108);
                    } else if (v < 255) {
                        b1 = code[i];
                        i += 1;
                        stack.push(-(v - 251) * 256 - b1 - 108);
                    } else {
                        b1 = code[i];
                        b2 = code[i + 1];
                        b3 = code[i + 2];
                        b4 = code[i + 3];
                        i += 4;
                        stack.push(((b1 << 24) | (b2 << 16) | (b3 << 8) | b4) / 65536);
                    }
            }
        }
    }

    parse(code);

    glyph.advanceWidth = width;
    return p;
}

// Subroutines are encoded using the negative half of the number space.
// See type 2 chapter 4.7 "Subroutine operators".
function calcCFFSubroutineBias(subrs) {
    var bias;
    if (subrs.length < 1240) {
        bias = 107;
    } else if (subrs.length < 33900) {
        bias = 1131;
    } else {
        bias = 32768;
    }

    return bias;
}

// Parse the `CFF` table, which contains the glyph outlines in PostScript format.
function parseCFFTable(data, start, font) {
    font.tables.cff = {};
    var header = parseCFFHeader(data, start);
    var nameIndex = parseCFFIndex(data, header.endOffset, parse.bytesToString);
    var topDictIndex = parseCFFIndex(data, nameIndex.endOffset);
    var stringIndex = parseCFFIndex(data, topDictIndex.endOffset, parse.bytesToString);
    var globalSubrIndex = parseCFFIndex(data, stringIndex.endOffset);
    font.gsubrs = globalSubrIndex.objects;
    font.gsubrsBias = calcCFFSubroutineBias(font.gsubrs);

    var topDictData = new DataView(new Uint8Array(topDictIndex.objects[0]).buffer);
    var topDict = parseCFFTopDict(topDictData, stringIndex.objects);
    font.tables.cff.topDict = topDict;

    var privateDictOffset = start + topDict['private'][1];
    var privateDict = parseCFFPrivateDict(data, privateDictOffset, topDict['private'][0], stringIndex.objects);
    font.defaultWidthX = privateDict.defaultWidthX;
    font.nominalWidthX = privateDict.nominalWidthX;

    if (privateDict.subrs !== 0) {
        var subrOffset = privateDictOffset + privateDict.subrs;
        var subrIndex = parseCFFIndex(data, subrOffset);
        font.subrs = subrIndex.objects;
        font.subrsBias = calcCFFSubroutineBias(font.subrs);
    } else {
        font.subrs = [];
        font.subrsBias = 0;
    }

    // Offsets in the top dict are relative to the beginning of the CFF data, so add the CFF start offset.
    var charStringsIndex = parseCFFIndex(data, start + topDict.charStrings);
    font.nGlyphs = charStringsIndex.objects.length;

    var charset = parseCFFCharset(data, start + topDict.charset, font.nGlyphs, stringIndex.objects);
    if (topDict.encoding === 0) { // Standard encoding
        font.cffEncoding = new encoding.CffEncoding(encoding.cffStandardEncoding, charset);
    } else if (topDict.encoding === 1) { // Expert encoding
        font.cffEncoding = new encoding.CffEncoding(encoding.cffExpertEncoding, charset);
    } else {
        font.cffEncoding = parseCFFEncoding(data, start + topDict.encoding, charset);
    }

    // Prefer the CMAP encoding to the CFF encoding.
    font.encoding = font.encoding || font.cffEncoding;

    font.glyphs = new glyphset.GlyphSet(font);
    for (var i = 0; i < font.nGlyphs; i += 1) {
        var charString = charStringsIndex.objects[i];
        font.glyphs.push(i, glyphset.cffGlyphLoader(font, i, parseCFFCharstring, charString));
    }
}

// Convert a string to a String ID (SID).
// The list of strings is modified in place.
function encodeString(s, strings) {
    var sid;

    // Is the string in the CFF standard strings?
    var i = encoding.cffStandardStrings.indexOf(s);
    if (i >= 0) {
        sid = i;
    }

    // Is the string already in the string index?
    i = strings.indexOf(s);
    if (i >= 0) {
        sid = i + encoding.cffStandardStrings.length;
    } else {
        sid = encoding.cffStandardStrings.length + strings.length;
        strings.push(s);
    }

    return sid;
}

function makeHeader() {
    return new table.Record('Header', [
        {name: 'major', type: 'Card8', value: 1},
        {name: 'minor', type: 'Card8', value: 0},
        {name: 'hdrSize', type: 'Card8', value: 4},
        {name: 'major', type: 'Card8', value: 1}
    ]);
}

function makeNameIndex(fontNames) {
    var t = new table.Record('Name INDEX', [
        {name: 'names', type: 'INDEX', value: []}
    ]);
    t.names = [];
    for (var i = 0; i < fontNames.length; i += 1) {
        t.names.push({name: 'name_' + i, type: 'NAME', value: fontNames[i]});
    }

    return t;
}

// Given a dictionary's metadata, create a DICT structure.
function makeDict(meta, attrs, strings) {
    var m = {};
    for (var i = 0; i < meta.length; i += 1) {
        var entry = meta[i];
        var value = attrs[entry.name];
        if (value !== undefined && !equals(value, entry.value)) {
            if (entry.type === 'SID') {
                value = encodeString(value, strings);
            }

            m[entry.op] = {name: entry.name, type: entry.type, value: value};
        }
    }

    return m;
}

// The Top DICT houses the global font attributes.
function makeTopDict(attrs, strings) {
    var t = new table.Record('Top DICT', [
        {name: 'dict', type: 'DICT', value: {}}
    ]);
    t.dict = makeDict(TOP_DICT_META, attrs, strings);
    return t;
}

function makeTopDictIndex(topDict) {
    var t = new table.Record('Top DICT INDEX', [
        {name: 'topDicts', type: 'INDEX', value: []}
    ]);
    t.topDicts = [{name: 'topDict_0', type: 'TABLE', value: topDict}];
    return t;
}

function makeStringIndex(strings) {
    var t = new table.Record('String INDEX', [
        {name: 'strings', type: 'INDEX', value: []}
    ]);
    t.strings = [];
    for (var i = 0; i < strings.length; i += 1) {
        t.strings.push({name: 'string_' + i, type: 'STRING', value: strings[i]});
    }

    return t;
}

function makeGlobalSubrIndex() {
    // Currently we don't use subroutines.
    return new table.Record('Global Subr INDEX', [
        {name: 'subrs', type: 'INDEX', value: []}
    ]);
}

function makeCharsets(glyphNames, strings) {
    var t = new table.Record('Charsets', [
        {name: 'format', type: 'Card8', value: 0}
    ]);
    for (var i = 0; i < glyphNames.length; i += 1) {
        var glyphName = glyphNames[i];
        var glyphSID = encodeString(glyphName, strings);
        t.fields.push({name: 'glyph_' + i, type: 'SID', value: glyphSID});
    }

    return t;
}

function glyphToOps(glyph) {
    var ops = [];
    var path = glyph.path;
    ops.push({name: 'width', type: 'NUMBER', value: glyph.advanceWidth});
    var x = 0;
    var y = 0;
    for (var i = 0; i < path.commands.length; i += 1) {
        var dx;
        var dy;
        var cmd = path.commands[i];
        if (cmd.type === 'Q') {
            // CFF only supports bézier curves, so convert the quad to a bézier.
            var _13 = 1 / 3;
            var _23 = 2 / 3;

            // We're going to create a new command so we don't change the original path.
            cmd = {
                type: 'C',
                x: cmd.x,
                y: cmd.y,
                x1: _13 * x + _23 * cmd.x1,
                y1: _13 * y + _23 * cmd.y1,
                x2: _13 * cmd.x + _23 * cmd.x1,
                y2: _13 * cmd.y + _23 * cmd.y1
            };
        }

        if (cmd.type === 'M') {
            dx = Math.round(cmd.x - x);
            dy = Math.round(cmd.y - y);
            ops.push({name: 'dx', type: 'NUMBER', value: dx});
            ops.push({name: 'dy', type: 'NUMBER', value: dy});
            ops.push({name: 'rmoveto', type: 'OP', value: 21});
            x = Math.round(cmd.x);
            y = Math.round(cmd.y);
        } else if (cmd.type === 'L') {
            dx = Math.round(cmd.x - x);
            dy = Math.round(cmd.y - y);
            ops.push({name: 'dx', type: 'NUMBER', value: dx});
            ops.push({name: 'dy', type: 'NUMBER', value: dy});
            ops.push({name: 'rlineto', type: 'OP', value: 5});
            x = Math.round(cmd.x);
            y = Math.round(cmd.y);
        } else if (cmd.type === 'C') {
            var dx1 = Math.round(cmd.x1 - x);
            var dy1 = Math.round(cmd.y1 - y);
            var dx2 = Math.round(cmd.x2 - cmd.x1);
            var dy2 = Math.round(cmd.y2 - cmd.y1);
            dx = Math.round(cmd.x - cmd.x2);
            dy = Math.round(cmd.y - cmd.y2);
            ops.push({name: 'dx1', type: 'NUMBER', value: dx1});
            ops.push({name: 'dy1', type: 'NUMBER', value: dy1});
            ops.push({name: 'dx2', type: 'NUMBER', value: dx2});
            ops.push({name: 'dy2', type: 'NUMBER', value: dy2});
            ops.push({name: 'dx', type: 'NUMBER', value: dx});
            ops.push({name: 'dy', type: 'NUMBER', value: dy});
            ops.push({name: 'rrcurveto', type: 'OP', value: 8});
            x = Math.round(cmd.x);
            y = Math.round(cmd.y);
        }

        // Contours are closed automatically.

    }

    ops.push({name: 'endchar', type: 'OP', value: 14});
    return ops;
}

function makeCharStringsIndex(glyphs) {
    var t = new table.Record('CharStrings INDEX', [
        {name: 'charStrings', type: 'INDEX', value: []}
    ]);

    for (var i = 0; i < glyphs.length; i += 1) {
        var glyph = glyphs.get(i);
        var ops = glyphToOps(glyph);
        t.charStrings.push({name: glyph.name, type: 'CHARSTRING', value: ops});
    }

    return t;
}

function makePrivateDict(attrs, strings) {
    var t = new table.Record('Private DICT', [
        {name: 'dict', type: 'DICT', value: {}}
    ]);
    t.dict = makeDict(PRIVATE_DICT_META, attrs, strings);
    return t;
}

function makeCFFTable(glyphs, options) {
    var t = new table.Table('CFF ', [
        {name: 'header', type: 'RECORD'},
        {name: 'nameIndex', type: 'RECORD'},
        {name: 'topDictIndex', type: 'RECORD'},
        {name: 'stringIndex', type: 'RECORD'},
        {name: 'globalSubrIndex', type: 'RECORD'},
        {name: 'charsets', type: 'RECORD'},
        {name: 'charStringsIndex', type: 'RECORD'},
        {name: 'privateDict', type: 'RECORD'}
    ]);

    var fontScale = 1 / options.unitsPerEm;
    // We use non-zero values for the offsets so that the DICT encodes them.
    // This is important because the size of the Top DICT plays a role in offset calculation,
    // and the size shouldn't change after we've written correct offsets.
    var attrs = {
        version: options.version,
        fullName: options.fullName,
        familyName: options.familyName,
        weight: options.weightName,
        fontBBox: options.fontBBox || [0, 0, 0, 0],
        fontMatrix: [fontScale, 0, 0, fontScale, 0, 0],
        charset: 999,
        encoding: 0,
        charStrings: 999,
        private: [0, 999]
    };

    var privateAttrs = {};

    var glyphNames = [];
    var glyph;

    // Skip first glyph (.notdef)
    for (var i = 1; i < glyphs.length; i += 1) {
        glyph = glyphs.get(i);
        glyphNames.push(glyph.name);
    }

    var strings = [];

    t.header = makeHeader();
    t.nameIndex = makeNameIndex([options.postScriptName]);
    var topDict = makeTopDict(attrs, strings);
    t.topDictIndex = makeTopDictIndex(topDict);
    t.globalSubrIndex = makeGlobalSubrIndex();
    t.charsets = makeCharsets(glyphNames, strings);
    t.charStringsIndex = makeCharStringsIndex(glyphs);
    t.privateDict = makePrivateDict(privateAttrs, strings);

    // Needs to come at the end, to encode all custom strings used in the font.
    t.stringIndex = makeStringIndex(strings);

    var startOffset = t.header.sizeOf() +
        t.nameIndex.sizeOf() +
        t.topDictIndex.sizeOf() +
        t.stringIndex.sizeOf() +
        t.globalSubrIndex.sizeOf();
    attrs.charset = startOffset;

    // We use the CFF standard encoding; proper encoding will be handled in cmap.
    attrs.encoding = 0;
    attrs.charStrings = attrs.charset + t.charsets.sizeOf();
    attrs.private[1] = attrs.charStrings + t.charStringsIndex.sizeOf();

    // Recreate the Top DICT INDEX with the correct offsets.
    topDict = makeTopDict(attrs, strings);
    t.topDictIndex = makeTopDictIndex(topDict);

    return t;
}

exports.parse = parseCFFTable;
exports.make = makeCFFTable;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The `cmap` table stores the mappings from characters to glyphs.
// https://www.microsoft.com/typography/OTSPEC/cmap.htm



var check = __webpack_require__(1);
var parse = __webpack_require__(0);
var table = __webpack_require__(2);

function parseCmapTableFormat12(cmap, p) {
    var i;

    //Skip reserved.
    p.parseUShort();

    // Length in bytes of the sub-tables.
    cmap.length = p.parseULong();
    cmap.language = p.parseULong();

    var groupCount;
    cmap.groupCount = groupCount = p.parseULong();
    cmap.glyphIndexMap = {};

    for (i = 0; i < groupCount; i += 1) {
        var startCharCode = p.parseULong();
        var endCharCode = p.parseULong();
        var startGlyphId = p.parseULong();

        for (var c = startCharCode; c <= endCharCode; c += 1) {
            cmap.glyphIndexMap[c] = startGlyphId;
            startGlyphId++;
        }
    }
}

function parseCmapTableFormat4(cmap, p, data, start, offset) {
    var i;

    // Length in bytes of the sub-tables.
    cmap.length = p.parseUShort();
    cmap.language = p.parseUShort();

    // segCount is stored x 2.
    var segCount;
    cmap.segCount = segCount = p.parseUShort() >> 1;

    // Skip searchRange, entrySelector, rangeShift.
    p.skip('uShort', 3);

    // The "unrolled" mapping from character codes to glyph indices.
    cmap.glyphIndexMap = {};
    var endCountParser = new parse.Parser(data, start + offset + 14);
    var startCountParser = new parse.Parser(data, start + offset + 16 + segCount * 2);
    var idDeltaParser = new parse.Parser(data, start + offset + 16 + segCount * 4);
    var idRangeOffsetParser = new parse.Parser(data, start + offset + 16 + segCount * 6);
    var glyphIndexOffset = start + offset + 16 + segCount * 8;
    for (i = 0; i < segCount - 1; i += 1) {
        var glyphIndex;
        var endCount = endCountParser.parseUShort();
        var startCount = startCountParser.parseUShort();
        var idDelta = idDeltaParser.parseShort();
        var idRangeOffset = idRangeOffsetParser.parseUShort();
        for (var c = startCount; c <= endCount; c += 1) {
            if (idRangeOffset !== 0) {
                // The idRangeOffset is relative to the current position in the idRangeOffset array.
                // Take the current offset in the idRangeOffset array.
                glyphIndexOffset = (idRangeOffsetParser.offset + idRangeOffsetParser.relativeOffset - 2);

                // Add the value of the idRangeOffset, which will move us into the glyphIndex array.
                glyphIndexOffset += idRangeOffset;

                // Then add the character index of the current segment, multiplied by 2 for USHORTs.
                glyphIndexOffset += (c - startCount) * 2;
                glyphIndex = parse.getUShort(data, glyphIndexOffset);
                if (glyphIndex !== 0) {
                    glyphIndex = (glyphIndex + idDelta) & 0xFFFF;
                }
            } else {
                glyphIndex = (c + idDelta) & 0xFFFF;
            }

            cmap.glyphIndexMap[c] = glyphIndex;
        }
    }
}

// Parse the `cmap` table. This table stores the mappings from characters to glyphs.
// There are many available formats, but we only support the Windows format 4 and 12.
// This function returns a `CmapEncoding` object or null if no supported format could be found.
function parseCmapTable(data, start) {
    var i;
    var cmap = {};
    cmap.version = parse.getUShort(data, start);
    check.argument(cmap.version === 0, 'cmap table version should be 0.');

    // The cmap table can contain many sub-tables, each with their own format.
    // We're only interested in a "platform 3" table. This is a Windows format.
    cmap.numTables = parse.getUShort(data, start + 2);
    var offset = -1;
    for (i = cmap.numTables - 1; i >= 0; i -= 1) {
        var platformId = parse.getUShort(data, start + 4 + (i * 8));
        var encodingId = parse.getUShort(data, start + 4 + (i * 8) + 2);
        if (platformId === 3 && (encodingId === 0 || encodingId === 1 || encodingId === 10)) {
            offset = parse.getULong(data, start + 4 + (i * 8) + 4);
            break;
        }
    }

    if (offset === -1) {
        // There is no cmap table in the font that we support, so return null.
        // This font will be marked as unsupported.
        return null;
    }

    var p = new parse.Parser(data, start + offset);
    cmap.format = p.parseUShort();

    if (cmap.format === 12) {
        parseCmapTableFormat12(cmap, p);
    } else if (cmap.format === 4) {
        parseCmapTableFormat4(cmap, p, data, start, offset);
    } else {
        throw new Error('Only format 4 and 12 cmap tables are supported.');
    }

    return cmap;
}

function addSegment(t, code, glyphIndex) {
    t.segments.push({
        end: code,
        start: code,
        delta: -(code - glyphIndex),
        offset: 0
    });
}

function addTerminatorSegment(t) {
    t.segments.push({
        end: 0xFFFF,
        start: 0xFFFF,
        delta: 1,
        offset: 0
    });
}

function makeCmapTable(glyphs) {
    var i;
    var t = new table.Table('cmap', [
        {name: 'version', type: 'USHORT', value: 0},
        {name: 'numTables', type: 'USHORT', value: 1},
        {name: 'platformID', type: 'USHORT', value: 3},
        {name: 'encodingID', type: 'USHORT', value: 1},
        {name: 'offset', type: 'ULONG', value: 12},
        {name: 'format', type: 'USHORT', value: 4},
        {name: 'length', type: 'USHORT', value: 0},
        {name: 'language', type: 'USHORT', value: 0},
        {name: 'segCountX2', type: 'USHORT', value: 0},
        {name: 'searchRange', type: 'USHORT', value: 0},
        {name: 'entrySelector', type: 'USHORT', value: 0},
        {name: 'rangeShift', type: 'USHORT', value: 0}
    ]);

    t.segments = [];
    for (i = 0; i < glyphs.length; i += 1) {
        var glyph = glyphs.get(i);
        for (var j = 0; j < glyph.unicodes.length; j += 1) {
            addSegment(t, glyph.unicodes[j], i);
        }

        t.segments = t.segments.sort(function(a, b) {
            return a.start - b.start;
        });
    }

    addTerminatorSegment(t);

    var segCount;
    segCount = t.segments.length;
    t.segCountX2 = segCount * 2;
    t.searchRange = Math.pow(2, Math.floor(Math.log(segCount) / Math.log(2))) * 2;
    t.entrySelector = Math.log(t.searchRange / 2) / Math.log(2);
    t.rangeShift = t.segCountX2 - t.searchRange;

    // Set up parallel segment arrays.
    var endCounts = [];
    var startCounts = [];
    var idDeltas = [];
    var idRangeOffsets = [];
    var glyphIds = [];

    for (i = 0; i < segCount; i += 1) {
        var segment = t.segments[i];
        endCounts = endCounts.concat({name: 'end_' + i, type: 'USHORT', value: segment.end});
        startCounts = startCounts.concat({name: 'start_' + i, type: 'USHORT', value: segment.start});
        idDeltas = idDeltas.concat({name: 'idDelta_' + i, type: 'SHORT', value: segment.delta});
        idRangeOffsets = idRangeOffsets.concat({name: 'idRangeOffset_' + i, type: 'USHORT', value: segment.offset});
        if (segment.glyphId !== undefined) {
            glyphIds = glyphIds.concat({name: 'glyph_' + i, type: 'USHORT', value: segment.glyphId});
        }
    }

    t.fields = t.fields.concat(endCounts);
    t.fields.push({name: 'reservedPad', type: 'USHORT', value: 0});
    t.fields = t.fields.concat(startCounts);
    t.fields = t.fields.concat(idDeltas);
    t.fields = t.fields.concat(idRangeOffsets);
    t.fields = t.fields.concat(glyphIds);

    t.length = 14 + // Subtable header
        endCounts.length * 2 +
        2 + // reservedPad
        startCounts.length * 2 +
        idDeltas.length * 2 +
        idRangeOffsets.length * 2 +
        glyphIds.length * 2;

    return t;
}

exports.parse = parseCmapTable;
exports.make = makeCmapTable;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The `GSUB` table contains ligatures, among other things.
// https://www.microsoft.com/typography/OTSPEC/gsub.htm



var check = __webpack_require__(1);
var Parser = __webpack_require__(0).Parser;
var subtableParsers = new Array(9);         // subtableParsers[0] is unused
var table = __webpack_require__(2);

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#SS
subtableParsers[1] = function parseLookup1() {
    var start = this.offset + this.relativeOffset;
    var substFormat = this.parseUShort();
    if (substFormat === 1) {
        return {
            substFormat: 1,
            coverage: this.parsePointer(Parser.coverage),
            deltaGlyphId: this.parseUShort()
        };
    } else if (substFormat === 2) {
        return {
            substFormat: 2,
            coverage: this.parsePointer(Parser.coverage),
            substitute: this.parseOffset16List()
        };
    }
    check.assert(false, '0x' + start.toString(16) + ': lookup type 1 format must be 1 or 2.');
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#MS
subtableParsers[2] = function parseLookup2() {
    var substFormat = this.parseUShort();
    check.argument(substFormat === 1, 'GSUB Multiple Substitution Subtable identifier-format must be 1');
    return {
        substFormat: substFormat,
        coverage: this.parsePointer(Parser.coverage),
        sequences: this.parseListOfLists()
    };
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#AS
subtableParsers[3] = function parseLookup3() {
    var substFormat = this.parseUShort();
    check.argument(substFormat === 1, 'GSUB Alternate Substitution Subtable identifier-format must be 1');
    return {
        substFormat: substFormat,
        coverage: this.parsePointer(Parser.coverage),
        alternateSets: this.parseListOfLists()
    };
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#LS
subtableParsers[4] = function parseLookup4() {
    var substFormat = this.parseUShort();
    check.argument(substFormat === 1, 'GSUB ligature table identifier-format must be 1');
    return {
        substFormat: substFormat,
        coverage: this.parsePointer(Parser.coverage),
        ligatureSets: this.parseListOfLists(function() {
            return {
                ligGlyph: this.parseUShort(),
                components: this.parseUShortList(this.parseUShort() - 1)
            };
        })
    };
};

var lookupRecordDesc = {
    sequenceIndex: Parser.uShort,
    lookupListIndex: Parser.uShort
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#CSF
subtableParsers[5] = function parseLookup5() {
    var start = this.offset + this.relativeOffset;
    var substFormat = this.parseUShort();

    if (substFormat === 1) {
        return {
            substFormat: substFormat,
            coverage: this.parsePointer(Parser.coverage),
            ruleSets: this.parseListOfLists(function() {
                var glyphCount = this.parseUShort();
                var substCount = this.parseUShort();
                return {
                    input: this.parseUShortList(glyphCount - 1),
                    lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
                };
            })
        };
    } else if (substFormat === 2) {
        return {
            substFormat: substFormat,
            coverage: this.parsePointer(Parser.coverage),
            classDef: this.parsePointer(Parser.classDef),
            classSets: this.parseListOfLists(function() {
                var glyphCount = this.parseUShort();
                var substCount = this.parseUShort();
                return {
                    classes: this.parseUShortList(glyphCount - 1),
                    lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
                };
            })
        };
    } else if (substFormat === 3) {
        var glyphCount = this.parseUShort();
        var substCount = this.parseUShort();
        return {
            substFormat: substFormat,
            coverages: this.parseList(glyphCount, Parser.pointer(Parser.coverage)),
            lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
        };
    }
    check.assert(false, '0x' + start.toString(16) + ': lookup type 5 format must be 1, 2 or 3.');
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#CC
subtableParsers[6] = function parseLookup6() {
    var start = this.offset + this.relativeOffset;
    var substFormat = this.parseUShort();
    if (substFormat === 1) {
        return {
            substFormat: 1,
            coverage: this.parsePointer(Parser.coverage),
            chainRuleSets: this.parseListOfLists(function() {
                return {
                    backtrack: this.parseUShortList(),
                    input: this.parseUShortList(this.parseShort() - 1),
                    lookahead: this.parseUShortList(),
                    lookupRecords: this.parseRecordList(lookupRecordDesc)
                };
            })
        };
    } else if (substFormat === 2) {
        return {
            substFormat: 2,
            coverage: this.parsePointer(Parser.coverage),
            backtrackClassDef: this.parsePointer(Parser.classDef),
            inputClassDef: this.parsePointer(Parser.classDef),
            lookaheadClassDef: this.parsePointer(Parser.classDef),
            chainClassSet: this.parseListOfLists(function() {
                return {
                    backtrack: this.parseUShortList(),
                    input: this.parseUShortList(this.parseShort() - 1),
                    lookahead: this.parseUShortList(),
                    lookupRecords: this.parseRecordList(lookupRecordDesc)
                };
            })
        };
    } else if (substFormat === 3) {
        return {
            substFormat: 3,
            backtrackCoverage: this.parseList(Parser.pointer(Parser.coverage)),
            inputCoverage: this.parseList(Parser.pointer(Parser.coverage)),
            lookaheadCoverage: this.parseList(Parser.pointer(Parser.coverage)),
            lookupRecords: this.parseRecordList(lookupRecordDesc)
        };
    }
    check.assert(false, '0x' + start.toString(16) + ': lookup type 6 format must be 1, 2 or 3.');
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#ES
subtableParsers[7] = function parseLookup7() {
    // Extension Substitution subtable
    var substFormat = this.parseUShort();
    check.argument(substFormat === 1, 'GSUB Extension Substitution subtable identifier-format must be 1');
    var extensionLookupType = this.parseUShort();
    var extensionParser = new Parser(this.data, this.offset + this.parseULong());
    return {
        substFormat: 1,
        lookupType: extensionLookupType,
        extension: subtableParsers[extensionLookupType].call(extensionParser)
    };
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#RCCS
subtableParsers[8] = function parseLookup8() {
    var substFormat = this.parseUShort();
    check.argument(substFormat === 1, 'GSUB Reverse Chaining Contextual Single Substitution Subtable identifier-format must be 1');
    return {
        substFormat: substFormat,
        coverage: this.parsePointer(Parser.coverage),
        backtrackCoverage: this.parseList(Parser.pointer(Parser.coverage)),
        lookaheadCoverage: this.parseList(Parser.pointer(Parser.coverage)),
        substitutes: this.parseUShortList()
    };
};

// https://www.microsoft.com/typography/OTSPEC/gsub.htm
function parseGsubTable(data, start) {
    start = start || 0;
    var p = new Parser(data, start);
    var tableVersion = p.parseVersion();
    check.argument(tableVersion === 1, 'Unsupported GSUB table version.');
    return {
        version: tableVersion,
        scripts: p.parseScriptList(),
        features: p.parseFeatureList(),
        lookups: p.parseLookupList(subtableParsers)
    };
}

// GSUB Writing //////////////////////////////////////////////
var subtableMakers = new Array(9);

subtableMakers[1] = function makeLookup1(subtable) {
    if (subtable.substFormat === 1) {
        return new table.Table('substitutionTable', [
            {name: 'substFormat', type: 'USHORT', value: 1},
            {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)},
            {name: 'deltaGlyphID', type: 'USHORT', value: subtable.deltaGlyphId}
        ]);
    } else {
        return new table.Table('substitutionTable', [
            {name: 'substFormat', type: 'USHORT', value: 2},
            {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)}
        ].concat(table.ushortList('substitute', subtable.substitute)));
    }
    check.fail('Lookup type 1 substFormat must be 1 or 2.');
};

subtableMakers[3] = function makeLookup3(subtable) {
    check.assert(subtable.substFormat === 1, 'Lookup type 3 substFormat must be 1.');
    return new table.Table('substitutionTable', [
        {name: 'substFormat', type: 'USHORT', value: 1},
        {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)}
    ].concat(table.tableList('altSet', subtable.alternateSets, function(alternateSet) {
        return new table.Table('alternateSetTable', table.ushortList('alternate', alternateSet));
    })));
};

subtableMakers[4] = function makeLookup4(subtable) {
    check.assert(subtable.substFormat === 1, 'Lookup type 4 substFormat must be 1.');
    return new table.Table('substitutionTable', [
        {name: 'substFormat', type: 'USHORT', value: 1},
        {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)}
    ].concat(table.tableList('ligSet', subtable.ligatureSets, function(ligatureSet) {
        return new table.Table('ligatureSetTable', table.tableList('ligature', ligatureSet, function(ligature) {
            return new table.Table('ligatureTable',
                [{name: 'ligGlyph', type: 'USHORT', value: ligature.ligGlyph}]
                .concat(table.ushortList('component', ligature.components, ligature.components.length + 1))
            );
        }));
    })));
};

function makeGsubTable(gsub) {
    return new table.Table('GSUB', [
        {name: 'version', type: 'ULONG', value: 0x10000},
        {name: 'scripts', type: 'TABLE', value: new table.ScriptList(gsub.scripts)},
        {name: 'features', type: 'TABLE', value: new table.FeatureList(gsub.features)},
        {name: 'lookups', type: 'TABLE', value: new table.LookupList(gsub.lookups, subtableMakers)}
    ]);
}

exports.parse = parseGsubTable;
exports.make = makeGsubTable;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The `head` table contains global information about the font.
// https://www.microsoft.com/typography/OTSPEC/head.htm



var check = __webpack_require__(1);
var parse = __webpack_require__(0);
var table = __webpack_require__(2);

// Parse the header `head` table
function parseHeadTable(data, start) {
    var head = {};
    var p = new parse.Parser(data, start);
    head.version = p.parseVersion();
    head.fontRevision = Math.round(p.parseFixed() * 1000) / 1000;
    head.checkSumAdjustment = p.parseULong();
    head.magicNumber = p.parseULong();
    check.argument(head.magicNumber === 0x5F0F3CF5, 'Font header has wrong magic number.');
    head.flags = p.parseUShort();
    head.unitsPerEm = p.parseUShort();
    head.created = p.parseLongDateTime();
    head.modified = p.parseLongDateTime();
    head.xMin = p.parseShort();
    head.yMin = p.parseShort();
    head.xMax = p.parseShort();
    head.yMax = p.parseShort();
    head.macStyle = p.parseUShort();
    head.lowestRecPPEM = p.parseUShort();
    head.fontDirectionHint = p.parseShort();
    head.indexToLocFormat = p.parseShort();
    head.glyphDataFormat = p.parseShort();
    return head;
}

function makeHeadTable(options) {
    // Apple Mac timestamp epoch is 01/01/1904 not 01/01/1970
    var timestamp = Math.round(new Date().getTime() / 1000) + 2082844800;
    var createdTimestamp = timestamp;

    if (options.createdTimestamp) {
        createdTimestamp = options.createdTimestamp + 2082844800;
    }

    return new table.Table('head', [
        {name: 'version', type: 'FIXED', value: 0x00010000},
        {name: 'fontRevision', type: 'FIXED', value: 0x00010000},
        {name: 'checkSumAdjustment', type: 'ULONG', value: 0},
        {name: 'magicNumber', type: 'ULONG', value: 0x5F0F3CF5},
        {name: 'flags', type: 'USHORT', value: 0},
        {name: 'unitsPerEm', type: 'USHORT', value: 1000},
        {name: 'created', type: 'LONGDATETIME', value: createdTimestamp},
        {name: 'modified', type: 'LONGDATETIME', value: timestamp},
        {name: 'xMin', type: 'SHORT', value: 0},
        {name: 'yMin', type: 'SHORT', value: 0},
        {name: 'xMax', type: 'SHORT', value: 0},
        {name: 'yMax', type: 'SHORT', value: 0},
        {name: 'macStyle', type: 'USHORT', value: 0},
        {name: 'lowestRecPPEM', type: 'USHORT', value: 0},
        {name: 'fontDirectionHint', type: 'SHORT', value: 2},
        {name: 'indexToLocFormat', type: 'SHORT', value: 0},
        {name: 'glyphDataFormat', type: 'SHORT', value: 0}
    ], options);
}

exports.parse = parseHeadTable;
exports.make = makeHeadTable;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The `hhea` table contains information for horizontal layout.
// https://www.microsoft.com/typography/OTSPEC/hhea.htm



var parse = __webpack_require__(0);
var table = __webpack_require__(2);

// Parse the horizontal header `hhea` table
function parseHheaTable(data, start) {
    var hhea = {};
    var p = new parse.Parser(data, start);
    hhea.version = p.parseVersion();
    hhea.ascender = p.parseShort();
    hhea.descender = p.parseShort();
    hhea.lineGap = p.parseShort();
    hhea.advanceWidthMax = p.parseUShort();
    hhea.minLeftSideBearing = p.parseShort();
    hhea.minRightSideBearing = p.parseShort();
    hhea.xMaxExtent = p.parseShort();
    hhea.caretSlopeRise = p.parseShort();
    hhea.caretSlopeRun = p.parseShort();
    hhea.caretOffset = p.parseShort();
    p.relativeOffset += 8;
    hhea.metricDataFormat = p.parseShort();
    hhea.numberOfHMetrics = p.parseUShort();
    return hhea;
}

function makeHheaTable(options) {
    return new table.Table('hhea', [
        {name: 'version', type: 'FIXED', value: 0x00010000},
        {name: 'ascender', type: 'FWORD', value: 0},
        {name: 'descender', type: 'FWORD', value: 0},
        {name: 'lineGap', type: 'FWORD', value: 0},
        {name: 'advanceWidthMax', type: 'UFWORD', value: 0},
        {name: 'minLeftSideBearing', type: 'FWORD', value: 0},
        {name: 'minRightSideBearing', type: 'FWORD', value: 0},
        {name: 'xMaxExtent', type: 'FWORD', value: 0},
        {name: 'caretSlopeRise', type: 'SHORT', value: 1},
        {name: 'caretSlopeRun', type: 'SHORT', value: 0},
        {name: 'caretOffset', type: 'SHORT', value: 0},
        {name: 'reserved1', type: 'SHORT', value: 0},
        {name: 'reserved2', type: 'SHORT', value: 0},
        {name: 'reserved3', type: 'SHORT', value: 0},
        {name: 'reserved4', type: 'SHORT', value: 0},
        {name: 'metricDataFormat', type: 'SHORT', value: 0},
        {name: 'numberOfHMetrics', type: 'USHORT', value: 0}
    ], options);
}

exports.parse = parseHheaTable;
exports.make = makeHheaTable;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The `hmtx` table contains the horizontal metrics for all glyphs.
// https://www.microsoft.com/typography/OTSPEC/hmtx.htm



var parse = __webpack_require__(0);
var table = __webpack_require__(2);

// Parse the `hmtx` table, which contains the horizontal metrics for all glyphs.
// This function augments the glyph array, adding the advanceWidth and leftSideBearing to each glyph.
function parseHmtxTable(data, start, numMetrics, numGlyphs, glyphs) {
    var advanceWidth;
    var leftSideBearing;
    var p = new parse.Parser(data, start);
    for (var i = 0; i < numGlyphs; i += 1) {
        // If the font is monospaced, only one entry is needed. This last entry applies to all subsequent glyphs.
        if (i < numMetrics) {
            advanceWidth = p.parseUShort();
            leftSideBearing = p.parseShort();
        }

        var glyph = glyphs.get(i);
        glyph.advanceWidth = advanceWidth;
        glyph.leftSideBearing = leftSideBearing;
    }
}

function makeHmtxTable(glyphs) {
    var t = new table.Table('hmtx', []);
    for (var i = 0; i < glyphs.length; i += 1) {
        var glyph = glyphs.get(i);
        var advanceWidth = glyph.advanceWidth || 0;
        var leftSideBearing = glyph.leftSideBearing || 0;
        t.fields.push({name: 'advanceWidth_' + i, type: 'USHORT', value: advanceWidth});
        t.fields.push({name: 'leftSideBearing_' + i, type: 'SHORT', value: leftSideBearing});
    }

    return t;
}

exports.parse = parseHmtxTable;
exports.make = makeHmtxTable;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The `ltag` table stores IETF BCP-47 language tags. It allows supporting
// languages for which TrueType does not assign a numeric code.
// https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6ltag.html
// http://www.w3.org/International/articles/language-tags/
// http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry



var check = __webpack_require__(1);
var parse = __webpack_require__(0);
var table = __webpack_require__(2);

function makeLtagTable(tags) {
    var result = new table.Table('ltag', [
        {name: 'version', type: 'ULONG', value: 1},
        {name: 'flags', type: 'ULONG', value: 0},
        {name: 'numTags', type: 'ULONG', value: tags.length}
    ]);

    var stringPool = '';
    var stringPoolOffset = 12 + tags.length * 4;
    for (var i = 0; i < tags.length; ++i) {
        var pos = stringPool.indexOf(tags[i]);
        if (pos < 0) {
            pos = stringPool.length;
            stringPool += tags[i];
        }

        result.fields.push({name: 'offset ' + i, type: 'USHORT', value: stringPoolOffset + pos});
        result.fields.push({name: 'length ' + i, type: 'USHORT', value: tags[i].length});
    }

    result.fields.push({name: 'stringPool', type: 'CHARARRAY', value: stringPool});
    return result;
}

function parseLtagTable(data, start) {
    var p = new parse.Parser(data, start);
    var tableVersion = p.parseULong();
    check.argument(tableVersion === 1, 'Unsupported ltag table version.');
    // The 'ltag' specification does not define any flags; skip the field.
    p.skip('uLong', 1);
    var numTags = p.parseULong();

    var tags = [];
    for (var i = 0; i < numTags; i++) {
        var tag = '';
        var offset = start + p.parseUShort();
        var length = p.parseUShort();
        for (var j = offset; j < offset + length; ++j) {
            tag += String.fromCharCode(data.getInt8(j));
        }

        tags.push(tag);
    }

    return tags;
}

exports.make = makeLtagTable;
exports.parse = parseLtagTable;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The `maxp` table establishes the memory requirements for the font.
// We need it just to get the number of glyphs in the font.
// https://www.microsoft.com/typography/OTSPEC/maxp.htm



var parse = __webpack_require__(0);
var table = __webpack_require__(2);

// Parse the maximum profile `maxp` table.
function parseMaxpTable(data, start) {
    var maxp = {};
    var p = new parse.Parser(data, start);
    maxp.version = p.parseVersion();
    maxp.numGlyphs = p.parseUShort();
    if (maxp.version === 1.0) {
        maxp.maxPoints = p.parseUShort();
        maxp.maxContours = p.parseUShort();
        maxp.maxCompositePoints = p.parseUShort();
        maxp.maxCompositeContours = p.parseUShort();
        maxp.maxZones = p.parseUShort();
        maxp.maxTwilightPoints = p.parseUShort();
        maxp.maxStorage = p.parseUShort();
        maxp.maxFunctionDefs = p.parseUShort();
        maxp.maxInstructionDefs = p.parseUShort();
        maxp.maxStackElements = p.parseUShort();
        maxp.maxSizeOfInstructions = p.parseUShort();
        maxp.maxComponentElements = p.parseUShort();
        maxp.maxComponentDepth = p.parseUShort();
    }

    return maxp;
}

function makeMaxpTable(numGlyphs) {
    return new table.Table('maxp', [
        {name: 'version', type: 'FIXED', value: 0x00005000},
        {name: 'numGlyphs', type: 'USHORT', value: numGlyphs}
    ]);
}

exports.parse = parseMaxpTable;
exports.make = makeMaxpTable;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The `GPOS` table contains kerning pairs, among other things.
// https://www.microsoft.com/typography/OTSPEC/gpos.htm



var types = __webpack_require__(5);
var decode = types.decode;
var check = __webpack_require__(1);
var parse = __webpack_require__(0);
var table = __webpack_require__(2);

// Parse the metadata `meta` table.
// https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6meta.html
function parseMetaTable(data, start) {
    var p = new parse.Parser(data, start);
    var tableVersion = p.parseULong();
    check.argument(tableVersion === 1, 'Unsupported META table version.');
    p.parseULong(); // flags - currently unused and set to 0
    p.parseULong(); // tableOffset
    var numDataMaps = p.parseULong();

    var tags = {};
    for (var i = 0; i < numDataMaps; i++) {
        var tag = p.parseTag();
        var dataOffset = p.parseULong();
        var dataLength = p.parseULong();
        var text = decode.UTF8(data, start + dataOffset, dataLength);

        tags[tag] = text;
    }
    return tags;
}

function makeMetaTable(tags) {
    var numTags = Object.keys(tags).length;
    var stringPool = '';
    var stringPoolOffset = 16 + numTags * 12;

    var result = new table.Table('meta', [
        {name: 'version', type: 'ULONG', value: 1},
        {name: 'flags', type: 'ULONG', value: 0},
        {name: 'offset', type: 'ULONG', value: stringPoolOffset},
        {name: 'numTags', type: 'ULONG', value: numTags}
    ]);

    for (var tag in tags) {
        var pos = stringPool.length;
        stringPool += tags[tag];

        result.fields.push({name: 'tag ' + tag, type: 'TAG', value: tag});
        result.fields.push({name: 'offset ' + tag, type: 'ULONG', value: stringPoolOffset + pos});
        result.fields.push({name: 'length ' + tag, type: 'ULONG', value: tags[tag].length});
    }

    result.fields.push({name: 'stringPool', type: 'CHARARRAY', value: stringPool});

    return result;
}

exports.parse = parseMetaTable;
exports.make = makeMetaTable;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The `name` naming table.
// https://www.microsoft.com/typography/OTSPEC/name.htm



var types = __webpack_require__(5);
var decode = types.decode;
var encode = types.encode;
var parse = __webpack_require__(0);
var table = __webpack_require__(2);

// NameIDs for the name table.
var nameTableNames = [
    'copyright',              // 0
    'fontFamily',             // 1
    'fontSubfamily',          // 2
    'uniqueID',               // 3
    'fullName',               // 4
    'version',                // 5
    'postScriptName',         // 6
    'trademark',              // 7
    'manufacturer',           // 8
    'designer',               // 9
    'description',            // 10
    'manufacturerURL',        // 11
    'designerURL',            // 12
    'license',                // 13
    'licenseURL',             // 14
    'reserved',               // 15
    'preferredFamily',        // 16
    'preferredSubfamily',     // 17
    'compatibleFullName',     // 18
    'sampleText',             // 19
    'postScriptFindFontName', // 20
    'wwsFamily',              // 21
    'wwsSubfamily'            // 22
];

var macLanguages = {
    0: 'en',
    1: 'fr',
    2: 'de',
    3: 'it',
    4: 'nl',
    5: 'sv',
    6: 'es',
    7: 'da',
    8: 'pt',
    9: 'no',
    10: 'he',
    11: 'ja',
    12: 'ar',
    13: 'fi',
    14: 'el',
    15: 'is',
    16: 'mt',
    17: 'tr',
    18: 'hr',
    19: 'zh-Hant',
    20: 'ur',
    21: 'hi',
    22: 'th',
    23: 'ko',
    24: 'lt',
    25: 'pl',
    26: 'hu',
    27: 'es',
    28: 'lv',
    29: 'se',
    30: 'fo',
    31: 'fa',
    32: 'ru',
    33: 'zh',
    34: 'nl-BE',
    35: 'ga',
    36: 'sq',
    37: 'ro',
    38: 'cz',
    39: 'sk',
    40: 'si',
    41: 'yi',
    42: 'sr',
    43: 'mk',
    44: 'bg',
    45: 'uk',
    46: 'be',
    47: 'uz',
    48: 'kk',
    49: 'az-Cyrl',
    50: 'az-Arab',
    51: 'hy',
    52: 'ka',
    53: 'mo',
    54: 'ky',
    55: 'tg',
    56: 'tk',
    57: 'mn-CN',
    58: 'mn',
    59: 'ps',
    60: 'ks',
    61: 'ku',
    62: 'sd',
    63: 'bo',
    64: 'ne',
    65: 'sa',
    66: 'mr',
    67: 'bn',
    68: 'as',
    69: 'gu',
    70: 'pa',
    71: 'or',
    72: 'ml',
    73: 'kn',
    74: 'ta',
    75: 'te',
    76: 'si',
    77: 'my',
    78: 'km',
    79: 'lo',
    80: 'vi',
    81: 'id',
    82: 'tl',
    83: 'ms',
    84: 'ms-Arab',
    85: 'am',
    86: 'ti',
    87: 'om',
    88: 'so',
    89: 'sw',
    90: 'rw',
    91: 'rn',
    92: 'ny',
    93: 'mg',
    94: 'eo',
    128: 'cy',
    129: 'eu',
    130: 'ca',
    131: 'la',
    132: 'qu',
    133: 'gn',
    134: 'ay',
    135: 'tt',
    136: 'ug',
    137: 'dz',
    138: 'jv',
    139: 'su',
    140: 'gl',
    141: 'af',
    142: 'br',
    143: 'iu',
    144: 'gd',
    145: 'gv',
    146: 'ga',
    147: 'to',
    148: 'el-polyton',
    149: 'kl',
    150: 'az',
    151: 'nn'
};

// MacOS language ID → MacOS script ID
//
// Note that the script ID is not sufficient to determine what encoding
// to use in TrueType files. For some languages, MacOS used a modification
// of a mainstream script. For example, an Icelandic name would be stored
// with smRoman in the TrueType naming table, but the actual encoding
// is a special Icelandic version of the normal Macintosh Roman encoding.
// As another example, Inuktitut uses an 8-bit encoding for Canadian Aboriginal
// Syllables but MacOS had run out of available script codes, so this was
// done as a (pretty radical) "modification" of Ethiopic.
//
// http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/Readme.txt
var macLanguageToScript = {
    0: 0,  // langEnglish → smRoman
    1: 0,  // langFrench → smRoman
    2: 0,  // langGerman → smRoman
    3: 0,  // langItalian → smRoman
    4: 0,  // langDutch → smRoman
    5: 0,  // langSwedish → smRoman
    6: 0,  // langSpanish → smRoman
    7: 0,  // langDanish → smRoman
    8: 0,  // langPortuguese → smRoman
    9: 0,  // langNorwegian → smRoman
    10: 5,  // langHebrew → smHebrew
    11: 1,  // langJapanese → smJapanese
    12: 4,  // langArabic → smArabic
    13: 0,  // langFinnish → smRoman
    14: 6,  // langGreek → smGreek
    15: 0,  // langIcelandic → smRoman (modified)
    16: 0,  // langMaltese → smRoman
    17: 0,  // langTurkish → smRoman (modified)
    18: 0,  // langCroatian → smRoman (modified)
    19: 2,  // langTradChinese → smTradChinese
    20: 4,  // langUrdu → smArabic
    21: 9,  // langHindi → smDevanagari
    22: 21,  // langThai → smThai
    23: 3,  // langKorean → smKorean
    24: 29,  // langLithuanian → smCentralEuroRoman
    25: 29,  // langPolish → smCentralEuroRoman
    26: 29,  // langHungarian → smCentralEuroRoman
    27: 29,  // langEstonian → smCentralEuroRoman
    28: 29,  // langLatvian → smCentralEuroRoman
    29: 0,  // langSami → smRoman
    30: 0,  // langFaroese → smRoman (modified)
    31: 4,  // langFarsi → smArabic (modified)
    32: 7,  // langRussian → smCyrillic
    33: 25,  // langSimpChinese → smSimpChinese
    34: 0,  // langFlemish → smRoman
    35: 0,  // langIrishGaelic → smRoman (modified)
    36: 0,  // langAlbanian → smRoman
    37: 0,  // langRomanian → smRoman (modified)
    38: 29,  // langCzech → smCentralEuroRoman
    39: 29,  // langSlovak → smCentralEuroRoman
    40: 0,  // langSlovenian → smRoman (modified)
    41: 5,  // langYiddish → smHebrew
    42: 7,  // langSerbian → smCyrillic
    43: 7,  // langMacedonian → smCyrillic
    44: 7,  // langBulgarian → smCyrillic
    45: 7,  // langUkrainian → smCyrillic (modified)
    46: 7,  // langByelorussian → smCyrillic
    47: 7,  // langUzbek → smCyrillic
    48: 7,  // langKazakh → smCyrillic
    49: 7,  // langAzerbaijani → smCyrillic
    50: 4,  // langAzerbaijanAr → smArabic
    51: 24,  // langArmenian → smArmenian
    52: 23,  // langGeorgian → smGeorgian
    53: 7,  // langMoldavian → smCyrillic
    54: 7,  // langKirghiz → smCyrillic
    55: 7,  // langTajiki → smCyrillic
    56: 7,  // langTurkmen → smCyrillic
    57: 27,  // langMongolian → smMongolian
    58: 7,  // langMongolianCyr → smCyrillic
    59: 4,  // langPashto → smArabic
    60: 4,  // langKurdish → smArabic
    61: 4,  // langKashmiri → smArabic
    62: 4,  // langSindhi → smArabic
    63: 26,  // langTibetan → smTibetan
    64: 9,  // langNepali → smDevanagari
    65: 9,  // langSanskrit → smDevanagari
    66: 9,  // langMarathi → smDevanagari
    67: 13,  // langBengali → smBengali
    68: 13,  // langAssamese → smBengali
    69: 11,  // langGujarati → smGujarati
    70: 10,  // langPunjabi → smGurmukhi
    71: 12,  // langOriya → smOriya
    72: 17,  // langMalayalam → smMalayalam
    73: 16,  // langKannada → smKannada
    74: 14,  // langTamil → smTamil
    75: 15,  // langTelugu → smTelugu
    76: 18,  // langSinhalese → smSinhalese
    77: 19,  // langBurmese → smBurmese
    78: 20,  // langKhmer → smKhmer
    79: 22,  // langLao → smLao
    80: 30,  // langVietnamese → smVietnamese
    81: 0,  // langIndonesian → smRoman
    82: 0,  // langTagalog → smRoman
    83: 0,  // langMalayRoman → smRoman
    84: 4,  // langMalayArabic → smArabic
    85: 28,  // langAmharic → smEthiopic
    86: 28,  // langTigrinya → smEthiopic
    87: 28,  // langOromo → smEthiopic
    88: 0,  // langSomali → smRoman
    89: 0,  // langSwahili → smRoman
    90: 0,  // langKinyarwanda → smRoman
    91: 0,  // langRundi → smRoman
    92: 0,  // langNyanja → smRoman
    93: 0,  // langMalagasy → smRoman
    94: 0,  // langEsperanto → smRoman
    128: 0,  // langWelsh → smRoman (modified)
    129: 0,  // langBasque → smRoman
    130: 0,  // langCatalan → smRoman
    131: 0,  // langLatin → smRoman
    132: 0,  // langQuechua → smRoman
    133: 0,  // langGuarani → smRoman
    134: 0,  // langAymara → smRoman
    135: 7,  // langTatar → smCyrillic
    136: 4,  // langUighur → smArabic
    137: 26,  // langDzongkha → smTibetan
    138: 0,  // langJavaneseRom → smRoman
    139: 0,  // langSundaneseRom → smRoman
    140: 0,  // langGalician → smRoman
    141: 0,  // langAfrikaans → smRoman
    142: 0,  // langBreton → smRoman (modified)
    143: 28,  // langInuktitut → smEthiopic (modified)
    144: 0,  // langScottishGaelic → smRoman (modified)
    145: 0,  // langManxGaelic → smRoman (modified)
    146: 0,  // langIrishGaelicScript → smRoman (modified)
    147: 0,  // langTongan → smRoman
    148: 6,  // langGreekAncient → smRoman
    149: 0,  // langGreenlandic → smRoman
    150: 0,  // langAzerbaijanRoman → smRoman
    151: 0   // langNynorsk → smRoman
};

// While Microsoft indicates a region/country for all its language
// IDs, we omit the region code if it's equal to the "most likely
// region subtag" according to Unicode CLDR. For scripts, we omit
// the subtag if it is equal to the Suppress-Script entry in the
// IANA language subtag registry for IETF BCP 47.
//
// For example, Microsoft states that its language code 0x041A is
// Croatian in Croatia. We transform this to the BCP 47 language code 'hr'
// and not 'hr-HR' because Croatia is the default country for Croatian,
// according to Unicode CLDR. As another example, Microsoft states
// that 0x101A is Croatian (Latin) in Bosnia-Herzegovina. We transform
// this to 'hr-BA' and not 'hr-Latn-BA' because Latin is the default script
// for the Croatian language, according to IANA.
//
// http://www.unicode.org/cldr/charts/latest/supplemental/likely_subtags.html
// http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
var windowsLanguages = {
    0x0436: 'af',
    0x041C: 'sq',
    0x0484: 'gsw',
    0x045E: 'am',
    0x1401: 'ar-DZ',
    0x3C01: 'ar-BH',
    0x0C01: 'ar',
    0x0801: 'ar-IQ',
    0x2C01: 'ar-JO',
    0x3401: 'ar-KW',
    0x3001: 'ar-LB',
    0x1001: 'ar-LY',
    0x1801: 'ary',
    0x2001: 'ar-OM',
    0x4001: 'ar-QA',
    0x0401: 'ar-SA',
    0x2801: 'ar-SY',
    0x1C01: 'aeb',
    0x3801: 'ar-AE',
    0x2401: 'ar-YE',
    0x042B: 'hy',
    0x044D: 'as',
    0x082C: 'az-Cyrl',
    0x042C: 'az',
    0x046D: 'ba',
    0x042D: 'eu',
    0x0423: 'be',
    0x0845: 'bn',
    0x0445: 'bn-IN',
    0x201A: 'bs-Cyrl',
    0x141A: 'bs',
    0x047E: 'br',
    0x0402: 'bg',
    0x0403: 'ca',
    0x0C04: 'zh-HK',
    0x1404: 'zh-MO',
    0x0804: 'zh',
    0x1004: 'zh-SG',
    0x0404: 'zh-TW',
    0x0483: 'co',
    0x041A: 'hr',
    0x101A: 'hr-BA',
    0x0405: 'cs',
    0x0406: 'da',
    0x048C: 'prs',
    0x0465: 'dv',
    0x0813: 'nl-BE',
    0x0413: 'nl',
    0x0C09: 'en-AU',
    0x2809: 'en-BZ',
    0x1009: 'en-CA',
    0x2409: 'en-029',
    0x4009: 'en-IN',
    0x1809: 'en-IE',
    0x2009: 'en-JM',
    0x4409: 'en-MY',
    0x1409: 'en-NZ',
    0x3409: 'en-PH',
    0x4809: 'en-SG',
    0x1C09: 'en-ZA',
    0x2C09: 'en-TT',
    0x0809: 'en-GB',
    0x0409: 'en',
    0x3009: 'en-ZW',
    0x0425: 'et',
    0x0438: 'fo',
    0x0464: 'fil',
    0x040B: 'fi',
    0x080C: 'fr-BE',
    0x0C0C: 'fr-CA',
    0x040C: 'fr',
    0x140C: 'fr-LU',
    0x180C: 'fr-MC',
    0x100C: 'fr-CH',
    0x0462: 'fy',
    0x0456: 'gl',
    0x0437: 'ka',
    0x0C07: 'de-AT',
    0x0407: 'de',
    0x1407: 'de-LI',
    0x1007: 'de-LU',
    0x0807: 'de-CH',
    0x0408: 'el',
    0x046F: 'kl',
    0x0447: 'gu',
    0x0468: 'ha',
    0x040D: 'he',
    0x0439: 'hi',
    0x040E: 'hu',
    0x040F: 'is',
    0x0470: 'ig',
    0x0421: 'id',
    0x045D: 'iu',
    0x085D: 'iu-Latn',
    0x083C: 'ga',
    0x0434: 'xh',
    0x0435: 'zu',
    0x0410: 'it',
    0x0810: 'it-CH',
    0x0411: 'ja',
    0x044B: 'kn',
    0x043F: 'kk',
    0x0453: 'km',
    0x0486: 'quc',
    0x0487: 'rw',
    0x0441: 'sw',
    0x0457: 'kok',
    0x0412: 'ko',
    0x0440: 'ky',
    0x0454: 'lo',
    0x0426: 'lv',
    0x0427: 'lt',
    0x082E: 'dsb',
    0x046E: 'lb',
    0x042F: 'mk',
    0x083E: 'ms-BN',
    0x043E: 'ms',
    0x044C: 'ml',
    0x043A: 'mt',
    0x0481: 'mi',
    0x047A: 'arn',
    0x044E: 'mr',
    0x047C: 'moh',
    0x0450: 'mn',
    0x0850: 'mn-CN',
    0x0461: 'ne',
    0x0414: 'nb',
    0x0814: 'nn',
    0x0482: 'oc',
    0x0448: 'or',
    0x0463: 'ps',
    0x0415: 'pl',
    0x0416: 'pt',
    0x0816: 'pt-PT',
    0x0446: 'pa',
    0x046B: 'qu-BO',
    0x086B: 'qu-EC',
    0x0C6B: 'qu',
    0x0418: 'ro',
    0x0417: 'rm',
    0x0419: 'ru',
    0x243B: 'smn',
    0x103B: 'smj-NO',
    0x143B: 'smj',
    0x0C3B: 'se-FI',
    0x043B: 'se',
    0x083B: 'se-SE',
    0x203B: 'sms',
    0x183B: 'sma-NO',
    0x1C3B: 'sms',
    0x044F: 'sa',
    0x1C1A: 'sr-Cyrl-BA',
    0x0C1A: 'sr',
    0x181A: 'sr-Latn-BA',
    0x081A: 'sr-Latn',
    0x046C: 'nso',
    0x0432: 'tn',
    0x045B: 'si',
    0x041B: 'sk',
    0x0424: 'sl',
    0x2C0A: 'es-AR',
    0x400A: 'es-BO',
    0x340A: 'es-CL',
    0x240A: 'es-CO',
    0x140A: 'es-CR',
    0x1C0A: 'es-DO',
    0x300A: 'es-EC',
    0x440A: 'es-SV',
    0x100A: 'es-GT',
    0x480A: 'es-HN',
    0x080A: 'es-MX',
    0x4C0A: 'es-NI',
    0x180A: 'es-PA',
    0x3C0A: 'es-PY',
    0x280A: 'es-PE',
    0x500A: 'es-PR',

    // Microsoft has defined two different language codes for
    // “Spanish with modern sorting” and “Spanish with traditional
    // sorting”. This makes sense for collation APIs, and it would be
    // possible to express this in BCP 47 language tags via Unicode
    // extensions (eg., es-u-co-trad is Spanish with traditional
    // sorting). However, for storing names in fonts, the distinction
    // does not make sense, so we give “es” in both cases.
    0x0C0A: 'es',
    0x040A: 'es',

    0x540A: 'es-US',
    0x380A: 'es-UY',
    0x200A: 'es-VE',
    0x081D: 'sv-FI',
    0x041D: 'sv',
    0x045A: 'syr',
    0x0428: 'tg',
    0x085F: 'tzm',
    0x0449: 'ta',
    0x0444: 'tt',
    0x044A: 'te',
    0x041E: 'th',
    0x0451: 'bo',
    0x041F: 'tr',
    0x0442: 'tk',
    0x0480: 'ug',
    0x0422: 'uk',
    0x042E: 'hsb',
    0x0420: 'ur',
    0x0843: 'uz-Cyrl',
    0x0443: 'uz',
    0x042A: 'vi',
    0x0452: 'cy',
    0x0488: 'wo',
    0x0485: 'sah',
    0x0478: 'ii',
    0x046A: 'yo'
};

// Returns a IETF BCP 47 language code, for example 'zh-Hant'
// for 'Chinese in the traditional script'.
function getLanguageCode(platformID, languageID, ltag) {
    switch (platformID) {
        case 0:  // Unicode
            if (languageID === 0xFFFF) {
                return 'und';
            } else if (ltag) {
                return ltag[languageID];
            }

            break;

        case 1:  // Macintosh
            return macLanguages[languageID];

        case 3:  // Windows
            return windowsLanguages[languageID];
    }

    return undefined;
}

var utf16 = 'utf-16';

// MacOS script ID → encoding. This table stores the default case,
// which can be overridden by macLanguageEncodings.
var macScriptEncodings = {
    0: 'macintosh',           // smRoman
    1: 'x-mac-japanese',      // smJapanese
    2: 'x-mac-chinesetrad',   // smTradChinese
    3: 'x-mac-korean',        // smKorean
    6: 'x-mac-greek',         // smGreek
    7: 'x-mac-cyrillic',      // smCyrillic
    9: 'x-mac-devanagai',     // smDevanagari
    10: 'x-mac-gurmukhi',     // smGurmukhi
    11: 'x-mac-gujarati',     // smGujarati
    12: 'x-mac-oriya',        // smOriya
    13: 'x-mac-bengali',      // smBengali
    14: 'x-mac-tamil',        // smTamil
    15: 'x-mac-telugu',       // smTelugu
    16: 'x-mac-kannada',      // smKannada
    17: 'x-mac-malayalam',    // smMalayalam
    18: 'x-mac-sinhalese',    // smSinhalese
    19: 'x-mac-burmese',      // smBurmese
    20: 'x-mac-khmer',        // smKhmer
    21: 'x-mac-thai',         // smThai
    22: 'x-mac-lao',          // smLao
    23: 'x-mac-georgian',     // smGeorgian
    24: 'x-mac-armenian',     // smArmenian
    25: 'x-mac-chinesesimp',  // smSimpChinese
    26: 'x-mac-tibetan',      // smTibetan
    27: 'x-mac-mongolian',    // smMongolian
    28: 'x-mac-ethiopic',     // smEthiopic
    29: 'x-mac-ce',           // smCentralEuroRoman
    30: 'x-mac-vietnamese',   // smVietnamese
    31: 'x-mac-extarabic'     // smExtArabic
};

// MacOS language ID → encoding. This table stores the exceptional
// cases, which override macScriptEncodings. For writing MacOS naming
// tables, we need to emit a MacOS script ID. Therefore, we cannot
// merge macScriptEncodings into macLanguageEncodings.
//
// http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/Readme.txt
var macLanguageEncodings = {
    15: 'x-mac-icelandic',    // langIcelandic
    17: 'x-mac-turkish',      // langTurkish
    18: 'x-mac-croatian',     // langCroatian
    24: 'x-mac-ce',           // langLithuanian
    25: 'x-mac-ce',           // langPolish
    26: 'x-mac-ce',           // langHungarian
    27: 'x-mac-ce',           // langEstonian
    28: 'x-mac-ce',           // langLatvian
    30: 'x-mac-icelandic',    // langFaroese
    37: 'x-mac-romanian',     // langRomanian
    38: 'x-mac-ce',           // langCzech
    39: 'x-mac-ce',           // langSlovak
    40: 'x-mac-ce',           // langSlovenian
    143: 'x-mac-inuit',       // langInuktitut
    146: 'x-mac-gaelic'       // langIrishGaelicScript
};

function getEncoding(platformID, encodingID, languageID) {
    switch (platformID) {
        case 0:  // Unicode
            return utf16;

        case 1:  // Apple Macintosh
            return macLanguageEncodings[languageID] || macScriptEncodings[encodingID];

        case 3:  // Microsoft Windows
            if (encodingID === 1 || encodingID === 10) {
                return utf16;
            }

            break;
    }

    return undefined;
}

// Parse the naming `name` table.
// FIXME: Format 1 additional fields are not supported yet.
// ltag is the content of the `ltag' table, such as ['en', 'zh-Hans', 'de-CH-1904'].
function parseNameTable(data, start, ltag) {
    var name = {};
    var p = new parse.Parser(data, start);
    var format = p.parseUShort();
    var count = p.parseUShort();
    var stringOffset = p.offset + p.parseUShort();
    for (var i = 0; i < count; i++) {
        var platformID = p.parseUShort();
        var encodingID = p.parseUShort();
        var languageID = p.parseUShort();
        var nameID = p.parseUShort();
        var property = nameTableNames[nameID] || nameID;
        var byteLength = p.parseUShort();
        var offset = p.parseUShort();
        var language = getLanguageCode(platformID, languageID, ltag);
        var encoding = getEncoding(platformID, encodingID, languageID);
        if (encoding !== undefined && language !== undefined) {
            var text;
            if (encoding === utf16) {
                text = decode.UTF16(data, stringOffset + offset, byteLength);
            } else {
                text = decode.MACSTRING(data, stringOffset + offset, byteLength, encoding);
            }

            if (text) {
                var translations = name[property];
                if (translations === undefined) {
                    translations = name[property] = {};
                }

                translations[language] = text;
            }
        }
    }

    var langTagCount = 0;
    if (format === 1) {
        // FIXME: Also handle Microsoft's 'name' table 1.
        langTagCount = p.parseUShort();
    }

    return name;
}

// {23: 'foo'} → {'foo': 23}
// ['bar', 'baz'] → {'bar': 0, 'baz': 1}
function reverseDict(dict) {
    var result = {};
    for (var key in dict) {
        result[dict[key]] = parseInt(key);
    }

    return result;
}

function makeNameRecord(platformID, encodingID, languageID, nameID, length, offset) {
    return new table.Record('NameRecord', [
        {name: 'platformID', type: 'USHORT', value: platformID},
        {name: 'encodingID', type: 'USHORT', value: encodingID},
        {name: 'languageID', type: 'USHORT', value: languageID},
        {name: 'nameID', type: 'USHORT', value: nameID},
        {name: 'length', type: 'USHORT', value: length},
        {name: 'offset', type: 'USHORT', value: offset}
    ]);
}

// Finds the position of needle in haystack, or -1 if not there.
// Like String.indexOf(), but for arrays.
function findSubArray(needle, haystack) {
    var needleLength = needle.length;
    var limit = haystack.length - needleLength + 1;

    loop:
    for (var pos = 0; pos < limit; pos++) {
        for (; pos < limit; pos++) {
            for (var k = 0; k < needleLength; k++) {
                if (haystack[pos + k] !== needle[k]) {
                    continue loop;
                }
            }

            return pos;
        }
    }

    return -1;
}

function addStringToPool(s, pool) {
    var offset = findSubArray(s, pool);
    if (offset < 0) {
        offset = pool.length;
        for (var i = 0, len = s.length; i < len; ++i) {
            pool.push(s[i]);
        }

    }

    return offset;
}

function makeNameTable(names, ltag) {
    var nameID;
    var nameIDs = [];

    var namesWithNumericKeys = {};
    var nameTableIds = reverseDict(nameTableNames);
    for (var key in names) {
        var id = nameTableIds[key];
        if (id === undefined) {
            id = key;
        }

        nameID = parseInt(id);

        if (isNaN(nameID)) {
            throw new Error('Name table entry "' + key + '" does not exist, see nameTableNames for complete list.');
        }

        namesWithNumericKeys[nameID] = names[key];
        nameIDs.push(nameID);
    }

    var macLanguageIds = reverseDict(macLanguages);
    var windowsLanguageIds = reverseDict(windowsLanguages);

    var nameRecords = [];
    var stringPool = [];

    for (var i = 0; i < nameIDs.length; i++) {
        nameID = nameIDs[i];
        var translations = namesWithNumericKeys[nameID];
        for (var lang in translations) {
            var text = translations[lang];

            // For MacOS, we try to emit the name in the form that was introduced
            // in the initial version of the TrueType spec (in the late 1980s).
            // However, this can fail for various reasons: the requested BCP 47
            // language code might not have an old-style Mac equivalent;
            // we might not have a codec for the needed character encoding;
            // or the name might contain characters that cannot be expressed
            // in the old-style Macintosh encoding. In case of failure, we emit
            // the name in a more modern fashion (Unicode encoding with BCP 47
            // language tags) that is recognized by MacOS 10.5, released in 2009.
            // If fonts were only read by operating systems, we could simply
            // emit all names in the modern form; this would be much easier.
            // However, there are many applications and libraries that read
            // 'name' tables directly, and these will usually only recognize
            // the ancient form (silently skipping the unrecognized names).
            var macPlatform = 1;  // Macintosh
            var macLanguage = macLanguageIds[lang];
            var macScript = macLanguageToScript[macLanguage];
            var macEncoding = getEncoding(macPlatform, macScript, macLanguage);
            var macName = encode.MACSTRING(text, macEncoding);
            if (macName === undefined) {
                macPlatform = 0;  // Unicode
                macLanguage = ltag.indexOf(lang);
                if (macLanguage < 0) {
                    macLanguage = ltag.length;
                    ltag.push(lang);
                }

                macScript = 4;  // Unicode 2.0 and later
                macName = encode.UTF16(text);
            }

            var macNameOffset = addStringToPool(macName, stringPool);
            nameRecords.push(makeNameRecord(macPlatform, macScript, macLanguage,
                                            nameID, macName.length, macNameOffset));

            var winLanguage = windowsLanguageIds[lang];
            if (winLanguage !== undefined) {
                var winName = encode.UTF16(text);
                var winNameOffset = addStringToPool(winName, stringPool);
                nameRecords.push(makeNameRecord(3, 1, winLanguage,
                                                nameID, winName.length, winNameOffset));
            }
        }
    }

    nameRecords.sort(function(a, b) {
        return ((a.platformID - b.platformID) ||
                (a.encodingID - b.encodingID) ||
                (a.languageID - b.languageID) ||
                (a.nameID - b.nameID));
    });

    var t = new table.Table('name', [
        {name: 'format', type: 'USHORT', value: 0},
        {name: 'count', type: 'USHORT', value: nameRecords.length},
        {name: 'stringOffset', type: 'USHORT', value: 6 + nameRecords.length * 12}
    ]);

    for (var r = 0; r < nameRecords.length; r++) {
        t.fields.push({name: 'record_' + r, type: 'RECORD', value: nameRecords[r]});
    }

    t.fields.push({name: 'strings', type: 'LITERAL', value: stringPool});
    return t;
}

exports.parse = parseNameTable;
exports.make = makeNameTable;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The `OS/2` table contains metrics required in OpenType fonts.
// https://www.microsoft.com/typography/OTSPEC/os2.htm



var parse = __webpack_require__(0);
var table = __webpack_require__(2);

var unicodeRanges = [
    {begin: 0x0000, end: 0x007F}, // Basic Latin
    {begin: 0x0080, end: 0x00FF}, // Latin-1 Supplement
    {begin: 0x0100, end: 0x017F}, // Latin Extended-A
    {begin: 0x0180, end: 0x024F}, // Latin Extended-B
    {begin: 0x0250, end: 0x02AF}, // IPA Extensions
    {begin: 0x02B0, end: 0x02FF}, // Spacing Modifier Letters
    {begin: 0x0300, end: 0x036F}, // Combining Diacritical Marks
    {begin: 0x0370, end: 0x03FF}, // Greek and Coptic
    {begin: 0x2C80, end: 0x2CFF}, // Coptic
    {begin: 0x0400, end: 0x04FF}, // Cyrillic
    {begin: 0x0530, end: 0x058F}, // Armenian
    {begin: 0x0590, end: 0x05FF}, // Hebrew
    {begin: 0xA500, end: 0xA63F}, // Vai
    {begin: 0x0600, end: 0x06FF}, // Arabic
    {begin: 0x07C0, end: 0x07FF}, // NKo
    {begin: 0x0900, end: 0x097F}, // Devanagari
    {begin: 0x0980, end: 0x09FF}, // Bengali
    {begin: 0x0A00, end: 0x0A7F}, // Gurmukhi
    {begin: 0x0A80, end: 0x0AFF}, // Gujarati
    {begin: 0x0B00, end: 0x0B7F}, // Oriya
    {begin: 0x0B80, end: 0x0BFF}, // Tamil
    {begin: 0x0C00, end: 0x0C7F}, // Telugu
    {begin: 0x0C80, end: 0x0CFF}, // Kannada
    {begin: 0x0D00, end: 0x0D7F}, // Malayalam
    {begin: 0x0E00, end: 0x0E7F}, // Thai
    {begin: 0x0E80, end: 0x0EFF}, // Lao
    {begin: 0x10A0, end: 0x10FF}, // Georgian
    {begin: 0x1B00, end: 0x1B7F}, // Balinese
    {begin: 0x1100, end: 0x11FF}, // Hangul Jamo
    {begin: 0x1E00, end: 0x1EFF}, // Latin Extended Additional
    {begin: 0x1F00, end: 0x1FFF}, // Greek Extended
    {begin: 0x2000, end: 0x206F}, // General Punctuation
    {begin: 0x2070, end: 0x209F}, // Superscripts And Subscripts
    {begin: 0x20A0, end: 0x20CF}, // Currency Symbol
    {begin: 0x20D0, end: 0x20FF}, // Combining Diacritical Marks For Symbols
    {begin: 0x2100, end: 0x214F}, // Letterlike Symbols
    {begin: 0x2150, end: 0x218F}, // Number Forms
    {begin: 0x2190, end: 0x21FF}, // Arrows
    {begin: 0x2200, end: 0x22FF}, // Mathematical Operators
    {begin: 0x2300, end: 0x23FF}, // Miscellaneous Technical
    {begin: 0x2400, end: 0x243F}, // Control Pictures
    {begin: 0x2440, end: 0x245F}, // Optical Character Recognition
    {begin: 0x2460, end: 0x24FF}, // Enclosed Alphanumerics
    {begin: 0x2500, end: 0x257F}, // Box Drawing
    {begin: 0x2580, end: 0x259F}, // Block Elements
    {begin: 0x25A0, end: 0x25FF}, // Geometric Shapes
    {begin: 0x2600, end: 0x26FF}, // Miscellaneous Symbols
    {begin: 0x2700, end: 0x27BF}, // Dingbats
    {begin: 0x3000, end: 0x303F}, // CJK Symbols And Punctuation
    {begin: 0x3040, end: 0x309F}, // Hiragana
    {begin: 0x30A0, end: 0x30FF}, // Katakana
    {begin: 0x3100, end: 0x312F}, // Bopomofo
    {begin: 0x3130, end: 0x318F}, // Hangul Compatibility Jamo
    {begin: 0xA840, end: 0xA87F}, // Phags-pa
    {begin: 0x3200, end: 0x32FF}, // Enclosed CJK Letters And Months
    {begin: 0x3300, end: 0x33FF}, // CJK Compatibility
    {begin: 0xAC00, end: 0xD7AF}, // Hangul Syllables
    {begin: 0xD800, end: 0xDFFF}, // Non-Plane 0 *
    {begin: 0x10900, end: 0x1091F}, // Phoenicia
    {begin: 0x4E00, end: 0x9FFF}, // CJK Unified Ideographs
    {begin: 0xE000, end: 0xF8FF}, // Private Use Area (plane 0)
    {begin: 0x31C0, end: 0x31EF}, // CJK Strokes
    {begin: 0xFB00, end: 0xFB4F}, // Alphabetic Presentation Forms
    {begin: 0xFB50, end: 0xFDFF}, // Arabic Presentation Forms-A
    {begin: 0xFE20, end: 0xFE2F}, // Combining Half Marks
    {begin: 0xFE10, end: 0xFE1F}, // Vertical Forms
    {begin: 0xFE50, end: 0xFE6F}, // Small Form Variants
    {begin: 0xFE70, end: 0xFEFF}, // Arabic Presentation Forms-B
    {begin: 0xFF00, end: 0xFFEF}, // Halfwidth And Fullwidth Forms
    {begin: 0xFFF0, end: 0xFFFF}, // Specials
    {begin: 0x0F00, end: 0x0FFF}, // Tibetan
    {begin: 0x0700, end: 0x074F}, // Syriac
    {begin: 0x0780, end: 0x07BF}, // Thaana
    {begin: 0x0D80, end: 0x0DFF}, // Sinhala
    {begin: 0x1000, end: 0x109F}, // Myanmar
    {begin: 0x1200, end: 0x137F}, // Ethiopic
    {begin: 0x13A0, end: 0x13FF}, // Cherokee
    {begin: 0x1400, end: 0x167F}, // Unified Canadian Aboriginal Syllabics
    {begin: 0x1680, end: 0x169F}, // Ogham
    {begin: 0x16A0, end: 0x16FF}, // Runic
    {begin: 0x1780, end: 0x17FF}, // Khmer
    {begin: 0x1800, end: 0x18AF}, // Mongolian
    {begin: 0x2800, end: 0x28FF}, // Braille Patterns
    {begin: 0xA000, end: 0xA48F}, // Yi Syllables
    {begin: 0x1700, end: 0x171F}, // Tagalog
    {begin: 0x10300, end: 0x1032F}, // Old Italic
    {begin: 0x10330, end: 0x1034F}, // Gothic
    {begin: 0x10400, end: 0x1044F}, // Deseret
    {begin: 0x1D000, end: 0x1D0FF}, // Byzantine Musical Symbols
    {begin: 0x1D400, end: 0x1D7FF}, // Mathematical Alphanumeric Symbols
    {begin: 0xFF000, end: 0xFFFFD}, // Private Use (plane 15)
    {begin: 0xFE00, end: 0xFE0F}, // Variation Selectors
    {begin: 0xE0000, end: 0xE007F}, // Tags
    {begin: 0x1900, end: 0x194F}, // Limbu
    {begin: 0x1950, end: 0x197F}, // Tai Le
    {begin: 0x1980, end: 0x19DF}, // New Tai Lue
    {begin: 0x1A00, end: 0x1A1F}, // Buginese
    {begin: 0x2C00, end: 0x2C5F}, // Glagolitic
    {begin: 0x2D30, end: 0x2D7F}, // Tifinagh
    {begin: 0x4DC0, end: 0x4DFF}, // Yijing Hexagram Symbols
    {begin: 0xA800, end: 0xA82F}, // Syloti Nagri
    {begin: 0x10000, end: 0x1007F}, // Linear B Syllabary
    {begin: 0x10140, end: 0x1018F}, // Ancient Greek Numbers
    {begin: 0x10380, end: 0x1039F}, // Ugaritic
    {begin: 0x103A0, end: 0x103DF}, // Old Persian
    {begin: 0x10450, end: 0x1047F}, // Shavian
    {begin: 0x10480, end: 0x104AF}, // Osmanya
    {begin: 0x10800, end: 0x1083F}, // Cypriot Syllabary
    {begin: 0x10A00, end: 0x10A5F}, // Kharoshthi
    {begin: 0x1D300, end: 0x1D35F}, // Tai Xuan Jing Symbols
    {begin: 0x12000, end: 0x123FF}, // Cuneiform
    {begin: 0x1D360, end: 0x1D37F}, // Counting Rod Numerals
    {begin: 0x1B80, end: 0x1BBF}, // Sundanese
    {begin: 0x1C00, end: 0x1C4F}, // Lepcha
    {begin: 0x1C50, end: 0x1C7F}, // Ol Chiki
    {begin: 0xA880, end: 0xA8DF}, // Saurashtra
    {begin: 0xA900, end: 0xA92F}, // Kayah Li
    {begin: 0xA930, end: 0xA95F}, // Rejang
    {begin: 0xAA00, end: 0xAA5F}, // Cham
    {begin: 0x10190, end: 0x101CF}, // Ancient Symbols
    {begin: 0x101D0, end: 0x101FF}, // Phaistos Disc
    {begin: 0x102A0, end: 0x102DF}, // Carian
    {begin: 0x1F030, end: 0x1F09F}  // Domino Tiles
];

function getUnicodeRange(unicode) {
    for (var i = 0; i < unicodeRanges.length; i += 1) {
        var range = unicodeRanges[i];
        if (unicode >= range.begin && unicode < range.end) {
            return i;
        }
    }

    return -1;
}

// Parse the OS/2 and Windows metrics `OS/2` table
function parseOS2Table(data, start) {
    var os2 = {};
    var p = new parse.Parser(data, start);
    os2.version = p.parseUShort();
    os2.xAvgCharWidth = p.parseShort();
    os2.usWeightClass = p.parseUShort();
    os2.usWidthClass = p.parseUShort();
    os2.fsType = p.parseUShort();
    os2.ySubscriptXSize = p.parseShort();
    os2.ySubscriptYSize = p.parseShort();
    os2.ySubscriptXOffset = p.parseShort();
    os2.ySubscriptYOffset = p.parseShort();
    os2.ySuperscriptXSize = p.parseShort();
    os2.ySuperscriptYSize = p.parseShort();
    os2.ySuperscriptXOffset = p.parseShort();
    os2.ySuperscriptYOffset = p.parseShort();
    os2.yStrikeoutSize = p.parseShort();
    os2.yStrikeoutPosition = p.parseShort();
    os2.sFamilyClass = p.parseShort();
    os2.panose = [];
    for (var i = 0; i < 10; i++) {
        os2.panose[i] = p.parseByte();
    }

    os2.ulUnicodeRange1 = p.parseULong();
    os2.ulUnicodeRange2 = p.parseULong();
    os2.ulUnicodeRange3 = p.parseULong();
    os2.ulUnicodeRange4 = p.parseULong();
    os2.achVendID = String.fromCharCode(p.parseByte(), p.parseByte(), p.parseByte(), p.parseByte());
    os2.fsSelection = p.parseUShort();
    os2.usFirstCharIndex = p.parseUShort();
    os2.usLastCharIndex = p.parseUShort();
    os2.sTypoAscender = p.parseShort();
    os2.sTypoDescender = p.parseShort();
    os2.sTypoLineGap = p.parseShort();
    os2.usWinAscent = p.parseUShort();
    os2.usWinDescent = p.parseUShort();
    if (os2.version >= 1) {
        os2.ulCodePageRange1 = p.parseULong();
        os2.ulCodePageRange2 = p.parseULong();
    }

    if (os2.version >= 2) {
        os2.sxHeight = p.parseShort();
        os2.sCapHeight = p.parseShort();
        os2.usDefaultChar = p.parseUShort();
        os2.usBreakChar = p.parseUShort();
        os2.usMaxContent = p.parseUShort();
    }

    return os2;
}

function makeOS2Table(options) {
    return new table.Table('OS/2', [
        {name: 'version', type: 'USHORT', value: 0x0003},
        {name: 'xAvgCharWidth', type: 'SHORT', value: 0},
        {name: 'usWeightClass', type: 'USHORT', value: 0},
        {name: 'usWidthClass', type: 'USHORT', value: 0},
        {name: 'fsType', type: 'USHORT', value: 0},
        {name: 'ySubscriptXSize', type: 'SHORT', value: 650},
        {name: 'ySubscriptYSize', type: 'SHORT', value: 699},
        {name: 'ySubscriptXOffset', type: 'SHORT', value: 0},
        {name: 'ySubscriptYOffset', type: 'SHORT', value: 140},
        {name: 'ySuperscriptXSize', type: 'SHORT', value: 650},
        {name: 'ySuperscriptYSize', type: 'SHORT', value: 699},
        {name: 'ySuperscriptXOffset', type: 'SHORT', value: 0},
        {name: 'ySuperscriptYOffset', type: 'SHORT', value: 479},
        {name: 'yStrikeoutSize', type: 'SHORT', value: 49},
        {name: 'yStrikeoutPosition', type: 'SHORT', value: 258},
        {name: 'sFamilyClass', type: 'SHORT', value: 0},
        {name: 'bFamilyType', type: 'BYTE', value: 0},
        {name: 'bSerifStyle', type: 'BYTE', value: 0},
        {name: 'bWeight', type: 'BYTE', value: 0},
        {name: 'bProportion', type: 'BYTE', value: 0},
        {name: 'bContrast', type: 'BYTE', value: 0},
        {name: 'bStrokeVariation', type: 'BYTE', value: 0},
        {name: 'bArmStyle', type: 'BYTE', value: 0},
        {name: 'bLetterform', type: 'BYTE', value: 0},
        {name: 'bMidline', type: 'BYTE', value: 0},
        {name: 'bXHeight', type: 'BYTE', value: 0},
        {name: 'ulUnicodeRange1', type: 'ULONG', value: 0},
        {name: 'ulUnicodeRange2', type: 'ULONG', value: 0},
        {name: 'ulUnicodeRange3', type: 'ULONG', value: 0},
        {name: 'ulUnicodeRange4', type: 'ULONG', value: 0},
        {name: 'achVendID', type: 'CHARARRAY', value: 'XXXX'},
        {name: 'fsSelection', type: 'USHORT', value: 0},
        {name: 'usFirstCharIndex', type: 'USHORT', value: 0},
        {name: 'usLastCharIndex', type: 'USHORT', value: 0},
        {name: 'sTypoAscender', type: 'SHORT', value: 0},
        {name: 'sTypoDescender', type: 'SHORT', value: 0},
        {name: 'sTypoLineGap', type: 'SHORT', value: 0},
        {name: 'usWinAscent', type: 'USHORT', value: 0},
        {name: 'usWinDescent', type: 'USHORT', value: 0},
        {name: 'ulCodePageRange1', type: 'ULONG', value: 0},
        {name: 'ulCodePageRange2', type: 'ULONG', value: 0},
        {name: 'sxHeight', type: 'SHORT', value: 0},
        {name: 'sCapHeight', type: 'SHORT', value: 0},
        {name: 'usDefaultChar', type: 'USHORT', value: 0},
        {name: 'usBreakChar', type: 'USHORT', value: 0},
        {name: 'usMaxContext', type: 'USHORT', value: 0}
    ], options);
}

exports.unicodeRanges = unicodeRanges;
exports.getUnicodeRange = getUnicodeRange;
exports.parse = parseOS2Table;
exports.make = makeOS2Table;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The `post` table stores additional PostScript information, such as glyph names.
// https://www.microsoft.com/typography/OTSPEC/post.htm



var encoding = __webpack_require__(4);
var parse = __webpack_require__(0);
var table = __webpack_require__(2);

// Parse the PostScript `post` table
function parsePostTable(data, start) {
    var post = {};
    var p = new parse.Parser(data, start);
    var i;
    post.version = p.parseVersion();
    post.italicAngle = p.parseFixed();
    post.underlinePosition = p.parseShort();
    post.underlineThickness = p.parseShort();
    post.isFixedPitch = p.parseULong();
    post.minMemType42 = p.parseULong();
    post.maxMemType42 = p.parseULong();
    post.minMemType1 = p.parseULong();
    post.maxMemType1 = p.parseULong();
    switch (post.version) {
        case 1:
            post.names = encoding.standardNames.slice();
            break;
        case 2:
            post.numberOfGlyphs = p.parseUShort();
            post.glyphNameIndex = new Array(post.numberOfGlyphs);
            for (i = 0; i < post.numberOfGlyphs; i++) {
                post.glyphNameIndex[i] = p.parseUShort();
            }

            post.names = [];
            for (i = 0; i < post.numberOfGlyphs; i++) {
                if (post.glyphNameIndex[i] >= encoding.standardNames.length) {
                    var nameLength = p.parseChar();
                    post.names.push(p.parseString(nameLength));
                }
            }

            break;
        case 2.5:
            post.numberOfGlyphs = p.parseUShort();
            post.offset = new Array(post.numberOfGlyphs);
            for (i = 0; i < post.numberOfGlyphs; i++) {
                post.offset[i] = p.parseChar();
            }

            break;
    }
    return post;
}

function makePostTable() {
    return new table.Table('post', [
        {name: 'version', type: 'FIXED', value: 0x00030000},
        {name: 'italicAngle', type: 'FIXED', value: 0},
        {name: 'underlinePosition', type: 'FWORD', value: 0},
        {name: 'underlineThickness', type: 'FWORD', value: 0},
        {name: 'isFixedPitch', type: 'ULONG', value: 0},
        {name: 'minMemType42', type: 'ULONG', value: 0},
        {name: 'maxMemType42', type: 'ULONG', value: 0},
        {name: 'minMemType1', type: 'ULONG', value: 0},
        {name: 'maxMemType1', type: 'ULONG', value: 0}
    ]);
}

exports.parse = parsePostTable;
exports.make = makePostTable;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

exports.isBrowser = function() {
    return typeof window !== 'undefined';
};

exports.isNode = function() {
    return typeof window === 'undefined';
};

exports.nodeBufferToArrayBuffer = function(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }

    return ab;
};

exports.arrayBufferToNodeBuffer = function(ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }

    return buffer;
};

exports.checkArgument = function(expression, message) {
    if (!expression) {
        throw message;
    }
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(32).Buffer))

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2016 Hideki Shiro
 */

module.exports = __webpack_require__(49);


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__js_SampleBestPlaces_js__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__js_GridCache_js__ = __webpack_require__(8);
/**
 * Created by meredith on 4/11/17.
 */
/**
 * Created by meredith on 2/20/16.
 */

__webpack_require__(28);
__webpack_require__(30);
const Clipper = __webpack_require__(26);
const raphael = __webpack_require__(48);
var MapUtil = __webpack_require__(27);
//require("./js/SampleBestPlaces");
//require("./js/GridCache.js");
const Spinner = __webpack_require__(52);
const TextToSVG = __webpack_require__(24);




//function main() {
var width = 900;
var height = 1000;
var rotate = [122, 0, 0];
var center = [0, 47.3097];
var scale = 150000;
//var offset = [1141.329833984375 - 263 + width / 2, 142582.609375 + 30];
var offset = [1141.329833984375 - 450 + width / 2, 142582.609375 + 30];

var font = "din-condensed-bold";

var color1 = ['a', 'b', 'c', 'd', 'e', 'f'];
var color2 = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

//padding to be given between text and inscribed rectangle
var padding = 0.0; //given as percentage of total rectangle space

//any rectangles having area smaller than 40 pixels removed from
//text-filling algorithm
var AREA_CUTOFF = 40;

//use rectangle mods made in database
var USE_RECTANGLE_DATABASE = false;
var USE_GRID_CACHING = true;
var HORIZONTAL_SLICE_CAP = 6;
var CHAR_ASPECT_RATIO = .5;
var TEXT_SIZE_MULTIPLIER = 1.5;
var GRID_CACHE_OUTPUT = false;

var SEATTLE_OUTLINE_COLOR = "black";

//display various steps in text append process
var displayPolygons = false;
var displayRectangles = false;
var displayBounds = false;
var displayText = true;
var bestplaces;
var displayPaddedPolygons = false;

//these are for when we're in server
//
//var oReq = new XMLHttpRequest(); //New request object
//oReq.onload = function () {
//    bestplaces = JSON.parse(this.responseText);

var bestplaces = __WEBPACK_IMPORTED_MODULE_0__js_SampleBestPlaces_js__["a" /* sample_bestplaces */];
var neighborhood_bounds_output = {};

var svg = d3.select(".mapcontainer")
    .attr("id", "mapContainer")
    .append("svg")
    .attr("id", "mapSVG")
    .attr("height", height);
//.attr("width", parentWidth)

//create loader - spinny guy
var opts = {
    lines: 13 // The number of lines to draw
    , length: 28 // The length of each line
    , width: 14 // The line thickness
    , radius: 42 // The radius of the inner circle
    , scale: 1 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#000' // #rgb or #rrggbb or array of colors
    , opacity: 0.25 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
};

var loadingIndicator = new Spinner(opts);
loadingIndicator.spin(document.getElementById('mapContainer'));

var projection = d3.geo.mercator()
    .rotate(rotate)
    .scale(scale)
    .translate(offset)
    .precision(.5);

var path = d3.geo.path()
    .projection(projection);

var neighborhoodGroup = svg.append("g")
    .attr('id', 'neighborhoodGroup');

/*parses json, call back function selects all paths (none exist yet)
 and joins data (all neighborhoods) with each path. since there are no
 paths, all data points are waiting in 'update.enter'. calling
 'enter()' gives us these points, and appends a path for each of them,
 attributing a path and id to each.*/

var topoGeometries;

//var oReq = new XMLHttpRequest(); //New request object

//oReq.onload = theMeat
//
//function theMeat(response) {
//    //all that stuff
//    var bestplaces = JSON.parse(response.text);
//}

d3.json("json/neighborhoods.json", function (error, topology) {
   debugger;

    TextToSVG.load('./css/DIN-Condensed-Bold.ttf', function (err, textToSVG) {
        if (err) {
            console.log(err);
        } else {

            topoGeometries = topojson.object(topology, topology.objects.neighborhoods)
                .geometries;

            //generate paths around each neighborhood
            neighborhoodGroup.selectAll(".neighborhood")
                .data(topoGeometries)
                .enter()
                .append("g")
                .attr("neighborhoodBounds", path)
                .attr("class", "neighborhood")
                .append("path")
                .attr("d", path)
                .attr("class", "neighborhoodUnFocus")
                .attr("class", "neighborhoodOutline")
                .attr("id", function (d) {
                    return "n_" + d.id
                });

            // fill text
            neighborhoodGroup.selectAll(".neighborhood")
                .each(function (d) {
                    var pathCoords3d = NeighborhoodParser.get3dPathArray(
                        d3.select(this)
                            .attr("neighborhoodBounds"), d.type == "MultiPolygon");

                    console.log("saving " + d.properties.name + " to bounds array");
                    neighborhood_bounds_output[d.properties.name] =
                        d3.select(this).attr("neighborhoodBounds");

                    var subj = new Clipper.Paths();
                    var solution = new Clipper.Paths();

                    for (var poly = 0; poly < pathCoords3d.length; poly++) {

                        //var scale = 100;
                        var innerArray = [];

                        for (var p = 0; p < pathCoords3d[poly].length; p++) {
                            innerArray[innerArray.length] = {"X": pathCoords3d[poly][p][0], "Y": pathCoords3d[poly][p][1]};
                        }
                        //Clipper.JS.ScaleUpPaths(subj, scale);
                        subj[poly] = innerArray;
                    }

                    //subj[0] = [{"X":348,"Y":257},{"X":364,"Y":148},{"X":362,"Y":148},{"X":326,"Y":241},{"X":295,"Y":219},{"X":258,"Y":88},{"X":440,"Y":129},{"X":370,"Y":196},{"X":372,"Y":275}];
                    var co = new Clipper.ClipperOffset(2, 0.25);
                    co.AddPaths(subj, Clipper.JoinType.jtRound, Clipper.EndType.etClosedPolygon);
                    var offset_val = -4.0;
                    //if (d.properties.name == "Rainier Beach") {
                    //    offset_val = -2.0;
                    //}
                    co.Execute(solution, offset_val);

                    //Clipper.JS.ScaleDownPaths(subj, scale);
                    var innerpoints = [];

                    // divide phrase into number of polygons that result from
                    // the Clipper transform
                    var nameArray = bestplaces[d.properties.name].bestmatch.split(" ");
                    var nameNoSpaces = nameArray[0];
                    for (var i = 1; i < nameArray.length; i++) {
                        nameNoSpaces += nameArray[i];
                    }
                    var slicedNameArray = TextUtil.slicePhrase(solution.length, nameNoSpaces);
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
                            //MapUtil.horizontalSliceAlg(d3.select(this), pathCoords3d, d, slicedNameArray[poly], padding, getGridCache(),
                            //    USE_GRID_CACHING, displayRectangles, displayBounds, displayText, TEXT_SIZE_MULTIPLIER,
                            //    font, HORIZONTAL_SLICE_CAP, CHAR_ASPECT_RATIO, textToSVG, TextToSVG, raphael);
                        }
                        if (GRID_CACHE_OUTPUT) {
                            console.log(JSON.stringify(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__js_GridCache_js__["getGridCache"])()) + "end");
                        }
                        innerpoints[poly] = innerPointsList;
                    }

                    //d3.select(this)
                    //    .attr("neighborhoodBounds", innerpoints[0])
                    //    .append("polygon")
                    //    .attr("points", innerpoints[0])
                    //    .attr("class", "innertest")
                    //    .attr("fill", function (d) {
                    //        return displayPaddedPolygons ? "pink" : "none";
                    //    });
                })
                .attr("phrase", function (d) {
                    return bestplaces[d.properties.name].bestmatch;
                })
                .attr("categories", function (d) {
                    return JSON.stringify(bestplaces[d.properties.name].categories);
                })
                .attr("price", function (d) {
                    return bestplaces[d.properties.name].price;
                })
                .attr("reviewcount", function (d) {
                    return bestplaces[d.properties.name].review_count;
                })
                .on("mouseover", MapUtil.setLegend)
                .on("mouseout", MapUtil.resetLegend);

            console.log("logging neighborhood bounds output");
            console.log(neighborhood_bounds_output);
        }
    });

});

    //stop spinner--we're done!
    loadingIndicator.stop();
//};
//oReq.open("get", "yelp/getyelp.php", true);
//oReq.send();

//window.onload = main;




/***/ }),
/* 26 */
/***/ (function(module, exports) {

// rev 482
/********************************************************************************
 *                                                                              *
 * Author    :  Angus Johnson                                                   *
 * Version   :  6.2.1                                                          *
 * Date      :  31 October 2014                                                 *
 * Website   :  http://www.angusj.com                                           *
 * Copyright :  Angus Johnson 2010-2014                                         *
 *                                                                              *
 * License:                                                                     *
 * Use, modification & distribution is subject to Boost Software License Ver 1. *
 * http://www.boost.org/LICENSE_1_0.txt                                         *
 *                                                                              *
 * Attributions:                                                                *
 * The code in this library is an extension of Bala Vatti's clipping algorithm: *
 * "A generic solution to polygon clipping"                                     *
 * Communications of the ACM, Vol 35, Issue 7 (July 1992) pp 56-63.             *
 * http://portal.acm.org/citation.cfm?id=129906                                 *
 *                                                                              *
 * Computer graphics and geometric modeling: implementation and algorithms      *
 * By Max K. Agoston                                                            *
 * Springer; 1 edition (January 4, 2005)                                        *
 * http://books.google.com/books?q=vatti+clipping+agoston                       *
 *                                                                              *
 * See also:                                                                    *
 * "Polygon Offsetting by Computing Winding Numbers"                            *
 * Paper no. DETC2005-85513 pp. 565-575                                         *
 * ASME 2005 International Design Engineering Technical Conferences             *
 * and Computers and Information in Engineering Conference (IDETC/CIE2005)      *
 * September 24-28, 2005 , Long Beach, California, USA                          *
 * http://www.me.berkeley.edu/~mcmains/pubs/DAC05OffsetPolygon.pdf              *
 *                                                                              *
 *******************************************************************************/
/*******************************************************************************
 *                                                                              *
 * Author    :  Timo                                                            *
 * Version   :  6.2.1.2                                                         *
 * Date      :  27 November 2016                                                 *
 *                                                                              *
 * This is a translation of the C# Clipper library to Javascript.               *
 * Int128 struct of C# is implemented using JSBN of Tom Wu.                     *
 * Because Javascript lacks support for 64-bit integers, the space              *
 * is a little more restricted than in C# version.                              *
 *                                                                              *
 * C# version has support for coordinate space:                                 *
 * +-4611686018427387903 ( sqrt(2^127 -1)/2 )                                   *
 * while Javascript version has support for space:                              *
 * +-4503599627370495 ( sqrt(2^106 -1)/2 )                                      *
 *                                                                              *
 * Tom Wu's JSBN proved to be the fastest big integer library:                  *
 * http://jsperf.com/big-integer-library-test                                   *
 *                                                                              *
 * This class can be made simpler when (if ever) 64-bit integer support comes.  *
 *                                                                              *
 *******************************************************************************/
/*******************************************************************************
 *                                                                              *
 * Basic JavaScript BN library - subset useful for RSA encryption.              *
 * http://www-cs-students.stanford.edu/~tjw/jsbn/                               *
 * Copyright (c) 2005  Tom Wu                                                   *
 * All Rights Reserved.                                                         *
 * See "LICENSE" for details:                                                   *
 * http://www-cs-students.stanford.edu/~tjw/jsbn/LICENSE                        *
 *                                                                              *
 *******************************************************************************/

(function(){function k(a,b,c){d.biginteger_used=1;null!=a&&("number"==typeof a&&"undefined"==typeof b?this.fromInt(a):"number"==typeof a?this.fromNumber(a,b,c):null==b&&"string"!=typeof a?this.fromString(a,256):this.fromString(a,b))}function m(){return new k(null,void 0,void 0)}function R(a,b,c,e,d,g){for(;0<=--g;){var f=b*this[a++]+c[e]+d;d=Math.floor(f/67108864);c[e++]=f&67108863}return d}function S(a,b,c,e,d,g){var f=b&32767;for(b>>=15;0<=--g;){var l=this[a]&32767,k=this[a++]>>15,n=b*l+k*f,l=f*
l+((n&32767)<<15)+c[e]+(d&1073741823);d=(l>>>30)+(n>>>15)+b*k+(d>>>30);c[e++]=l&1073741823}return d}function T(a,b,c,e,d,g){var f=b&16383;for(b>>=14;0<=--g;){var l=this[a]&16383,k=this[a++]>>14,n=b*l+k*f,l=f*l+((n&16383)<<14)+c[e]+d;d=(l>>28)+(n>>14)+b*k;c[e++]=l&268435455}return d}function M(a,b){var c=D[a.charCodeAt(b)];return null==c?-1:c}function x(a){var b=m();b.fromInt(a);return b}function E(a){var b=1,c;0!=(c=a>>>16)&&(a=c,b+=16);0!=(c=a>>8)&&(a=c,b+=8);0!=(c=a>>4)&&(a=c,b+=4);0!=(c=a>>2)&&
(a=c,b+=2);0!=a>>1&&(b+=1);return b}function A(a){this.m=a}function B(a){this.m=a;this.mp=a.invDigit();this.mpl=this.mp&32767;this.mph=this.mp>>15;this.um=(1<<a.DB-15)-1;this.mt2=2*a.t}function U(a,b){return a&b}function K(a,b){return a|b}function N(a,b){return a^b}function O(a,b){return a&~b}function C(){}function P(a){return a}function z(a){this.r2=m();this.q3=m();k.ONE.dlShiftTo(2*a.t,this.r2);this.mu=this.r2.divide(a);this.m=a}var d={use_lines:!0,use_xyz:!1},F=!1;"undefined"!==typeof module&&
module.exports?(module.exports=d,F=!0):"undefined"!==typeof document?window.ClipperLib=d:self.ClipperLib=d;var q;if(F)r="chrome",q="Netscape";else{var r=navigator.userAgent.toString().toLowerCase();q=navigator.appName}var G,L,H,I,J,Q;G=-1!=r.indexOf("chrome")&&-1==r.indexOf("chromium")?1:0;F=-1!=r.indexOf("chromium")?1:0;L=-1!=r.indexOf("safari")&&-1==r.indexOf("chrome")&&-1==r.indexOf("chromium")?1:0;H=-1!=r.indexOf("firefox")?1:0;r.indexOf("firefox/17");r.indexOf("firefox/15");r.indexOf("firefox/3");
I=-1!=r.indexOf("opera")?1:0;r.indexOf("msie 10");r.indexOf("msie 9");J=-1!=r.indexOf("msie 8")?1:0;Q=-1!=r.indexOf("msie 7")?1:0;r=-1!=r.indexOf("msie ")?1:0;d.biginteger_used=null;"Microsoft Internet Explorer"==q?(k.prototype.am=S,q=30):"Netscape"!=q?(k.prototype.am=R,q=26):(k.prototype.am=T,q=28);k.prototype.DB=q;k.prototype.DM=(1<<q)-1;k.prototype.DV=1<<q;k.prototype.FV=Math.pow(2,52);k.prototype.F1=52-q;k.prototype.F2=2*q-52;var D=[],w;q=48;for(w=0;9>=w;++w)D[q++]=w;q=97;for(w=10;36>w;++w)D[q++]=
w;q=65;for(w=10;36>w;++w)D[q++]=w;A.prototype.convert=function(a){return 0>a.s||0<=a.compareTo(this.m)?a.mod(this.m):a};A.prototype.revert=function(a){return a};A.prototype.reduce=function(a){a.divRemTo(this.m,null,a)};A.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c);this.reduce(c)};A.prototype.sqrTo=function(a,b){a.squareTo(b);this.reduce(b)};B.prototype.convert=function(a){var b=m();a.abs().dlShiftTo(this.m.t,b);b.divRemTo(this.m,null,b);0>a.s&&0<b.compareTo(k.ZERO)&&this.m.subTo(b,b);return b};
B.prototype.revert=function(a){var b=m();a.copyTo(b);this.reduce(b);return b};B.prototype.reduce=function(a){for(;a.t<=this.mt2;)a[a.t++]=0;for(var b=0;b<this.m.t;++b){var c=a[b]&32767,e=c*this.mpl+((c*this.mph+(a[b]>>15)*this.mpl&this.um)<<15)&a.DM,c=b+this.m.t;for(a[c]+=this.m.am(0,e,a,b,0,this.m.t);a[c]>=a.DV;)a[c]-=a.DV,a[++c]++}a.clamp();a.drShiftTo(this.m.t,a);0<=a.compareTo(this.m)&&a.subTo(this.m,a)};B.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c);this.reduce(c)};B.prototype.sqrTo=function(a,
b){a.squareTo(b);this.reduce(b)};k.prototype.copyTo=function(a){for(var b=this.t-1;0<=b;--b)a[b]=this[b];a.t=this.t;a.s=this.s};k.prototype.fromInt=function(a){this.t=1;this.s=0>a?-1:0;0<a?this[0]=a:-1>a?this[0]=a+this.DV:this.t=0};k.prototype.fromString=function(a,b){var c;if(16==b)c=4;else if(8==b)c=3;else if(256==b)c=8;else if(2==b)c=1;else if(32==b)c=5;else if(4==b)c=2;else{this.fromRadix(a,b);return}this.s=this.t=0;for(var e=a.length,d=!1,g=0;0<=--e;){var h=8==c?a[e]&255:M(a,e);0>h?"-"==a.charAt(e)&&
(d=!0):(d=!1,0==g?this[this.t++]=h:g+c>this.DB?(this[this.t-1]|=(h&(1<<this.DB-g)-1)<<g,this[this.t++]=h>>this.DB-g):this[this.t-1]|=h<<g,g+=c,g>=this.DB&&(g-=this.DB))}8==c&&0!=(a[0]&128)&&(this.s=-1,0<g&&(this[this.t-1]|=(1<<this.DB-g)-1<<g));this.clamp();d&&k.ZERO.subTo(this,this)};k.prototype.clamp=function(){for(var a=this.s&this.DM;0<this.t&&this[this.t-1]==a;)--this.t};k.prototype.dlShiftTo=function(a,b){var c;for(c=this.t-1;0<=c;--c)b[c+a]=this[c];for(c=a-1;0<=c;--c)b[c]=0;b.t=this.t+a;b.s=
this.s};k.prototype.drShiftTo=function(a,b){for(var c=a;c<this.t;++c)b[c-a]=this[c];b.t=Math.max(this.t-a,0);b.s=this.s};k.prototype.lShiftTo=function(a,b){var c=a%this.DB,e=this.DB-c,d=(1<<e)-1,g=Math.floor(a/this.DB),h=this.s<<c&this.DM,l;for(l=this.t-1;0<=l;--l)b[l+g+1]=this[l]>>e|h,h=(this[l]&d)<<c;for(l=g-1;0<=l;--l)b[l]=0;b[g]=h;b.t=this.t+g+1;b.s=this.s;b.clamp()};k.prototype.rShiftTo=function(a,b){b.s=this.s;var c=Math.floor(a/this.DB);if(c>=this.t)b.t=0;else{var e=a%this.DB,d=this.DB-e,g=
(1<<e)-1;b[0]=this[c]>>e;for(var h=c+1;h<this.t;++h)b[h-c-1]|=(this[h]&g)<<d,b[h-c]=this[h]>>e;0<e&&(b[this.t-c-1]|=(this.s&g)<<d);b.t=this.t-c;b.clamp()}};k.prototype.subTo=function(a,b){for(var c=0,e=0,d=Math.min(a.t,this.t);c<d;)e+=this[c]-a[c],b[c++]=e&this.DM,e>>=this.DB;if(a.t<this.t){for(e-=a.s;c<this.t;)e+=this[c],b[c++]=e&this.DM,e>>=this.DB;e+=this.s}else{for(e+=this.s;c<a.t;)e-=a[c],b[c++]=e&this.DM,e>>=this.DB;e-=a.s}b.s=0>e?-1:0;-1>e?b[c++]=this.DV+e:0<e&&(b[c++]=e);b.t=c;b.clamp()};
k.prototype.multiplyTo=function(a,b){var c=this.abs(),e=a.abs(),d=c.t;for(b.t=d+e.t;0<=--d;)b[d]=0;for(d=0;d<e.t;++d)b[d+c.t]=c.am(0,e[d],b,d,0,c.t);b.s=0;b.clamp();this.s!=a.s&&k.ZERO.subTo(b,b)};k.prototype.squareTo=function(a){for(var b=this.abs(),c=a.t=2*b.t;0<=--c;)a[c]=0;for(c=0;c<b.t-1;++c){var e=b.am(c,b[c],a,2*c,0,1);(a[c+b.t]+=b.am(c+1,2*b[c],a,2*c+1,e,b.t-c-1))>=b.DV&&(a[c+b.t]-=b.DV,a[c+b.t+1]=1)}0<a.t&&(a[a.t-1]+=b.am(c,b[c],a,2*c,0,1));a.s=0;a.clamp()};k.prototype.divRemTo=function(a,
b,c){var e=a.abs();if(!(0>=e.t)){var d=this.abs();if(d.t<e.t)null!=b&&b.fromInt(0),null!=c&&this.copyTo(c);else{null==c&&(c=m());var g=m(),h=this.s;a=a.s;var l=this.DB-E(e[e.t-1]);0<l?(e.lShiftTo(l,g),d.lShiftTo(l,c)):(e.copyTo(g),d.copyTo(c));e=g.t;d=g[e-1];if(0!=d){var v=d*(1<<this.F1)+(1<e?g[e-2]>>this.F2:0),n=this.FV/v,v=(1<<this.F1)/v,p=1<<this.F2,y=c.t,q=y-e,t=null==b?m():b;g.dlShiftTo(q,t);0<=c.compareTo(t)&&(c[c.t++]=1,c.subTo(t,c));k.ONE.dlShiftTo(e,t);for(t.subTo(g,g);g.t<e;)g[g.t++]=0;
for(;0<=--q;){var r=c[--y]==d?this.DM:Math.floor(c[y]*n+(c[y-1]+p)*v);if((c[y]+=g.am(0,r,c,q,0,e))<r)for(g.dlShiftTo(q,t),c.subTo(t,c);c[y]<--r;)c.subTo(t,c)}null!=b&&(c.drShiftTo(e,b),h!=a&&k.ZERO.subTo(b,b));c.t=e;c.clamp();0<l&&c.rShiftTo(l,c);0>h&&k.ZERO.subTo(c,c)}}}};k.prototype.invDigit=function(){if(1>this.t)return 0;var a=this[0];if(0==(a&1))return 0;var b=a&3,b=b*(2-(a&15)*b)&15,b=b*(2-(a&255)*b)&255,b=b*(2-((a&65535)*b&65535))&65535,b=b*(2-a*b%this.DV)%this.DV;return 0<b?this.DV-b:-b};
k.prototype.isEven=function(){return 0==(0<this.t?this[0]&1:this.s)};k.prototype.exp=function(a,b){if(4294967295<a||1>a)return k.ONE;var c=m(),e=m(),d=b.convert(this),g=E(a)-1;for(d.copyTo(c);0<=--g;)if(b.sqrTo(c,e),0<(a&1<<g))b.mulTo(e,d,c);else var h=c,c=e,e=h;return b.revert(c)};k.prototype.toString=function(a){if(0>this.s)return"-"+this.negate().toString(a);if(16==a)a=4;else if(8==a)a=3;else if(2==a)a=1;else if(32==a)a=5;else if(4==a)a=2;else return this.toRadix(a);var b=(1<<a)-1,c,e=!1,d="",
g=this.t,h=this.DB-g*this.DB%a;if(0<g--)for(h<this.DB&&0<(c=this[g]>>h)&&(e=!0,d="0123456789abcdefghijklmnopqrstuvwxyz".charAt(c));0<=g;)h<a?(c=(this[g]&(1<<h)-1)<<a-h,c|=this[--g]>>(h+=this.DB-a)):(c=this[g]>>(h-=a)&b,0>=h&&(h+=this.DB,--g)),0<c&&(e=!0),e&&(d+="0123456789abcdefghijklmnopqrstuvwxyz".charAt(c));return e?d:"0"};k.prototype.negate=function(){var a=m();k.ZERO.subTo(this,a);return a};k.prototype.abs=function(){return 0>this.s?this.negate():this};k.prototype.compareTo=function(a){var b=
this.s-a.s;if(0!=b)return b;var c=this.t,b=c-a.t;if(0!=b)return 0>this.s?-b:b;for(;0<=--c;)if(0!=(b=this[c]-a[c]))return b;return 0};k.prototype.bitLength=function(){return 0>=this.t?0:this.DB*(this.t-1)+E(this[this.t-1]^this.s&this.DM)};k.prototype.mod=function(a){var b=m();this.abs().divRemTo(a,null,b);0>this.s&&0<b.compareTo(k.ZERO)&&a.subTo(b,b);return b};k.prototype.modPowInt=function(a,b){var c;c=256>a||b.isEven()?new A(b):new B(b);return this.exp(a,c)};k.ZERO=x(0);k.ONE=x(1);C.prototype.convert=
P;C.prototype.revert=P;C.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c)};C.prototype.sqrTo=function(a,b){a.squareTo(b)};z.prototype.convert=function(a){if(0>a.s||a.t>2*this.m.t)return a.mod(this.m);if(0>a.compareTo(this.m))return a;var b=m();a.copyTo(b);this.reduce(b);return b};z.prototype.revert=function(a){return a};z.prototype.reduce=function(a){a.drShiftTo(this.m.t-1,this.r2);a.t>this.m.t+1&&(a.t=this.m.t+1,a.clamp());this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);for(this.m.multiplyLowerTo(this.q3,
this.m.t+1,this.r2);0>a.compareTo(this.r2);)a.dAddOffset(1,this.m.t+1);for(a.subTo(this.r2,a);0<=a.compareTo(this.m);)a.subTo(this.m,a)};z.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c);this.reduce(c)};z.prototype.sqrTo=function(a,b){a.squareTo(b);this.reduce(b)};var u=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,
313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997],V=67108864/u[u.length-1];k.prototype.chunkSize=function(a){return Math.floor(Math.LN2*
this.DB/Math.log(a))};k.prototype.toRadix=function(a){null==a&&(a=10);if(0==this.signum()||2>a||36<a)return"0";var b=this.chunkSize(a),b=Math.pow(a,b),c=x(b),e=m(),d=m(),g="";for(this.divRemTo(c,e,d);0<e.signum();)g=(b+d.intValue()).toString(a).substr(1)+g,e.divRemTo(c,e,d);return d.intValue().toString(a)+g};k.prototype.fromRadix=function(a,b){this.fromInt(0);null==b&&(b=10);for(var c=this.chunkSize(b),e=Math.pow(b,c),d=!1,g=0,h=0,l=0;l<a.length;++l){var v=M(a,l);0>v?"-"==a.charAt(l)&&0==this.signum()&&
(d=!0):(h=b*h+v,++g>=c&&(this.dMultiply(e),this.dAddOffset(h,0),h=g=0))}0<g&&(this.dMultiply(Math.pow(b,g)),this.dAddOffset(h,0));d&&k.ZERO.subTo(this,this)};k.prototype.fromNumber=function(a,b,c){if("number"==typeof b)if(2>a)this.fromInt(1);else for(this.fromNumber(a,c),this.testBit(a-1)||this.bitwiseTo(k.ONE.shiftLeft(a-1),K,this),this.isEven()&&this.dAddOffset(1,0);!this.isProbablePrime(b);)this.dAddOffset(2,0),this.bitLength()>a&&this.subTo(k.ONE.shiftLeft(a-1),this);else{c=[];var e=a&7;c.length=
(a>>3)+1;b.nextBytes(c);c[0]=0<e?c[0]&(1<<e)-1:0;this.fromString(c,256)}};k.prototype.bitwiseTo=function(a,b,c){var e,d,g=Math.min(a.t,this.t);for(e=0;e<g;++e)c[e]=b(this[e],a[e]);if(a.t<this.t){d=a.s&this.DM;for(e=g;e<this.t;++e)c[e]=b(this[e],d);c.t=this.t}else{d=this.s&this.DM;for(e=g;e<a.t;++e)c[e]=b(d,a[e]);c.t=a.t}c.s=b(this.s,a.s);c.clamp()};k.prototype.changeBit=function(a,b){var c=k.ONE.shiftLeft(a);this.bitwiseTo(c,b,c);return c};k.prototype.addTo=function(a,b){for(var c=0,e=0,d=Math.min(a.t,
this.t);c<d;)e+=this[c]+a[c],b[c++]=e&this.DM,e>>=this.DB;if(a.t<this.t){for(e+=a.s;c<this.t;)e+=this[c],b[c++]=e&this.DM,e>>=this.DB;e+=this.s}else{for(e+=this.s;c<a.t;)e+=a[c],b[c++]=e&this.DM,e>>=this.DB;e+=a.s}b.s=0>e?-1:0;0<e?b[c++]=e:-1>e&&(b[c++]=this.DV+e);b.t=c;b.clamp()};k.prototype.dMultiply=function(a){this[this.t]=this.am(0,a-1,this,0,0,this.t);++this.t;this.clamp()};k.prototype.dAddOffset=function(a,b){if(0!=a){for(;this.t<=b;)this[this.t++]=0;for(this[b]+=a;this[b]>=this.DV;)this[b]-=
this.DV,++b>=this.t&&(this[this.t++]=0),++this[b]}};k.prototype.multiplyLowerTo=function(a,b,c){var e=Math.min(this.t+a.t,b);c.s=0;for(c.t=e;0<e;)c[--e]=0;var d;for(d=c.t-this.t;e<d;++e)c[e+this.t]=this.am(0,a[e],c,e,0,this.t);for(d=Math.min(a.t,b);e<d;++e)this.am(0,a[e],c,e,0,b-e);c.clamp()};k.prototype.multiplyUpperTo=function(a,b,c){--b;var e=c.t=this.t+a.t-b;for(c.s=0;0<=--e;)c[e]=0;for(e=Math.max(b-this.t,0);e<a.t;++e)c[this.t+e-b]=this.am(b-e,a[e],c,0,0,this.t+e-b);c.clamp();c.drShiftTo(1,c)};
k.prototype.modInt=function(a){if(0>=a)return 0;var b=this.DV%a,c=0>this.s?a-1:0;if(0<this.t)if(0==b)c=this[0]%a;else for(var e=this.t-1;0<=e;--e)c=(b*c+this[e])%a;return c};k.prototype.millerRabin=function(a){var b=this.subtract(k.ONE),c=b.getLowestSetBit();if(0>=c)return!1;var e=b.shiftRight(c);a=a+1>>1;a>u.length&&(a=u.length);for(var d=m(),g=0;g<a;++g){d.fromInt(u[Math.floor(Math.random()*u.length)]);var h=d.modPow(e,this);if(0!=h.compareTo(k.ONE)&&0!=h.compareTo(b)){for(var l=1;l++<c&&0!=h.compareTo(b);)if(h=
h.modPowInt(2,this),0==h.compareTo(k.ONE))return!1;if(0!=h.compareTo(b))return!1}}return!0};k.prototype.clone=function(){var a=m();this.copyTo(a);return a};k.prototype.intValue=function(){if(0>this.s){if(1==this.t)return this[0]-this.DV;if(0==this.t)return-1}else{if(1==this.t)return this[0];if(0==this.t)return 0}return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]};k.prototype.byteValue=function(){return 0==this.t?this.s:this[0]<<24>>24};k.prototype.shortValue=function(){return 0==this.t?this.s:this[0]<<
16>>16};k.prototype.signum=function(){return 0>this.s?-1:0>=this.t||1==this.t&&0>=this[0]?0:1};k.prototype.toByteArray=function(){var a=this.t,b=[];b[0]=this.s;var c=this.DB-a*this.DB%8,e,d=0;if(0<a--)for(c<this.DB&&(e=this[a]>>c)!=(this.s&this.DM)>>c&&(b[d++]=e|this.s<<this.DB-c);0<=a;)if(8>c?(e=(this[a]&(1<<c)-1)<<8-c,e|=this[--a]>>(c+=this.DB-8)):(e=this[a]>>(c-=8)&255,0>=c&&(c+=this.DB,--a)),0!=(e&128)&&(e|=-256),0==d&&(this.s&128)!=(e&128)&&++d,0<d||e!=this.s)b[d++]=e;return b};k.prototype.equals=
function(a){return 0==this.compareTo(a)};k.prototype.min=function(a){return 0>this.compareTo(a)?this:a};k.prototype.max=function(a){return 0<this.compareTo(a)?this:a};k.prototype.and=function(a){var b=m();this.bitwiseTo(a,U,b);return b};k.prototype.or=function(a){var b=m();this.bitwiseTo(a,K,b);return b};k.prototype.xor=function(a){var b=m();this.bitwiseTo(a,N,b);return b};k.prototype.andNot=function(a){var b=m();this.bitwiseTo(a,O,b);return b};k.prototype.not=function(){for(var a=m(),b=0;b<this.t;++b)a[b]=
this.DM&~this[b];a.t=this.t;a.s=~this.s;return a};k.prototype.shiftLeft=function(a){var b=m();0>a?this.rShiftTo(-a,b):this.lShiftTo(a,b);return b};k.prototype.shiftRight=function(a){var b=m();0>a?this.lShiftTo(-a,b):this.rShiftTo(a,b);return b};k.prototype.getLowestSetBit=function(){for(var a=0;a<this.t;++a)if(0!=this[a]){var b=a*this.DB;a=this[a];if(0==a)a=-1;else{var c=0;0==(a&65535)&&(a>>=16,c+=16);0==(a&255)&&(a>>=8,c+=8);0==(a&15)&&(a>>=4,c+=4);0==(a&3)&&(a>>=2,c+=2);0==(a&1)&&++c;a=c}return b+
a}return 0>this.s?this.t*this.DB:-1};k.prototype.bitCount=function(){for(var a=0,b=this.s&this.DM,c=0;c<this.t;++c){for(var e=this[c]^b,d=0;0!=e;)e&=e-1,++d;a+=d}return a};k.prototype.testBit=function(a){var b=Math.floor(a/this.DB);return b>=this.t?0!=this.s:0!=(this[b]&1<<a%this.DB)};k.prototype.setBit=function(a){return this.changeBit(a,K)};k.prototype.clearBit=function(a){return this.changeBit(a,O)};k.prototype.flipBit=function(a){return this.changeBit(a,N)};k.prototype.add=function(a){var b=m();
this.addTo(a,b);return b};k.prototype.subtract=function(a){var b=m();this.subTo(a,b);return b};k.prototype.multiply=function(a){var b=m();this.multiplyTo(a,b);return b};k.prototype.divide=function(a){var b=m();this.divRemTo(a,b,null);return b};k.prototype.remainder=function(a){var b=m();this.divRemTo(a,null,b);return b};k.prototype.divideAndRemainder=function(a){var b=m(),c=m();this.divRemTo(a,b,c);return[b,c]};k.prototype.modPow=function(a,b){var c=a.bitLength(),e,d=x(1),g;if(0>=c)return d;e=18>
c?1:48>c?3:144>c?4:768>c?5:6;g=8>c?new A(b):b.isEven()?new z(b):new B(b);var h=[],l=3,k=e-1,n=(1<<e)-1;h[1]=g.convert(this);if(1<e)for(c=m(),g.sqrTo(h[1],c);l<=n;)h[l]=m(),g.mulTo(c,h[l-2],h[l]),l+=2;for(var p=a.t-1,y,q=!0,t=m(),c=E(a[p])-1;0<=p;){c>=k?y=a[p]>>c-k&n:(y=(a[p]&(1<<c+1)-1)<<k-c,0<p&&(y|=a[p-1]>>this.DB+c-k));for(l=e;0==(y&1);)y>>=1,--l;0>(c-=l)&&(c+=this.DB,--p);if(q)h[y].copyTo(d),q=!1;else{for(;1<l;)g.sqrTo(d,t),g.sqrTo(t,d),l-=2;0<l?g.sqrTo(d,t):(l=d,d=t,t=l);g.mulTo(t,h[y],d)}for(;0<=
p&&0==(a[p]&1<<c);)g.sqrTo(d,t),l=d,d=t,t=l,0>--c&&(c=this.DB-1,--p)}return g.revert(d)};k.prototype.modInverse=function(a){var b=a.isEven();if(this.isEven()&&b||0==a.signum())return k.ZERO;for(var c=a.clone(),d=this.clone(),f=x(1),g=x(0),h=x(0),l=x(1);0!=c.signum();){for(;c.isEven();)c.rShiftTo(1,c),b?(f.isEven()&&g.isEven()||(f.addTo(this,f),g.subTo(a,g)),f.rShiftTo(1,f)):g.isEven()||g.subTo(a,g),g.rShiftTo(1,g);for(;d.isEven();)d.rShiftTo(1,d),b?(h.isEven()&&l.isEven()||(h.addTo(this,h),l.subTo(a,
l)),h.rShiftTo(1,h)):l.isEven()||l.subTo(a,l),l.rShiftTo(1,l);0<=c.compareTo(d)?(c.subTo(d,c),b&&f.subTo(h,f),g.subTo(l,g)):(d.subTo(c,d),b&&h.subTo(f,h),l.subTo(g,l))}if(0!=d.compareTo(k.ONE))return k.ZERO;if(0<=l.compareTo(a))return l.subtract(a);if(0>l.signum())l.addTo(a,l);else return l;return 0>l.signum()?l.add(a):l};k.prototype.pow=function(a){return this.exp(a,new C)};k.prototype.gcd=function(a){var b=0>this.s?this.negate():this.clone();a=0>a.s?a.negate():a.clone();if(0>b.compareTo(a)){var c=
b,b=a;a=c}var c=b.getLowestSetBit(),d=a.getLowestSetBit();if(0>d)return b;c<d&&(d=c);0<d&&(b.rShiftTo(d,b),a.rShiftTo(d,a));for(;0<b.signum();)0<(c=b.getLowestSetBit())&&b.rShiftTo(c,b),0<(c=a.getLowestSetBit())&&a.rShiftTo(c,a),0<=b.compareTo(a)?(b.subTo(a,b),b.rShiftTo(1,b)):(a.subTo(b,a),a.rShiftTo(1,a));0<d&&a.lShiftTo(d,a);return a};k.prototype.isProbablePrime=function(a){var b,c=this.abs();if(1==c.t&&c[0]<=u[u.length-1]){for(b=0;b<u.length;++b)if(c[0]==u[b])return!0;return!1}if(c.isEven())return!1;
for(b=1;b<u.length;){for(var d=u[b],f=b+1;f<u.length&&d<V;)d*=u[f++];for(d=c.modInt(d);b<f;)if(0==d%u[b++])return!1}return c.millerRabin(a)};k.prototype.square=function(){var a=m();this.squareTo(a);return a};k.prototype.IsNegative=function(){return-1==this.compareTo(k.ZERO)?!0:!1};k.op_Equality=function(a,b){return 0==a.compareTo(b)?!0:!1};k.op_Inequality=function(a,b){return 0!=a.compareTo(b)?!0:!1};k.op_GreaterThan=function(a,b){return 0<a.compareTo(b)?!0:!1};k.op_LessThan=function(a,b){return 0>
a.compareTo(b)?!0:!1};k.op_Addition=function(a,b){return(new k(a)).add(new k(b))};k.op_Subtraction=function(a,b){return(new k(a)).subtract(new k(b))};k.Int128Mul=function(a,b){return(new k(a)).multiply(new k(b))};k.op_Division=function(a,b){return a.divide(b)};k.prototype.ToDouble=function(){return parseFloat(this.toString())};q=function(a,b){var c;if("undefined"==typeof Object.getOwnPropertyNames)for(c in b.prototype){if("undefined"==typeof a.prototype[c]||a.prototype[c]==Object.prototype[c])a.prototype[c]=
b.prototype[c]}else for(var d=Object.getOwnPropertyNames(b.prototype),f=0;f<d.length;f++)"undefined"==typeof Object.getOwnPropertyDescriptor(a.prototype,d[f])&&Object.defineProperty(a.prototype,d[f],Object.getOwnPropertyDescriptor(b.prototype,d[f]));for(c in b)"undefined"==typeof a[c]&&(a[c]=b[c]);a.$baseCtor=b};d.Path=function(){return[]};d.Paths=function(){return[]};d.DoublePoint=function(){var a=arguments;this.Y=this.X=0;1==a.length?(this.X=a[0].X,this.Y=a[0].Y):2==a.length&&(this.X=a[0],this.Y=
a[1])};d.DoublePoint0=function(){this.Y=this.X=0};d.DoublePoint1=function(a){this.X=a.X;this.Y=a.Y};d.DoublePoint2=function(a,b){this.X=a;this.Y=b};d.PolyNode=function(){this.m_Parent=null;this.m_polygon=new d.Path;this.m_endtype=this.m_jointype=this.m_Index=0;this.m_Childs=[];this.IsOpen=!1};d.PolyNode.prototype.IsHoleNode=function(){for(var a=!0,b=this.m_Parent;null!==b;)a=!a,b=b.m_Parent;return a};d.PolyNode.prototype.ChildCount=function(){return this.m_Childs.length};d.PolyNode.prototype.Contour=
function(){return this.m_polygon};d.PolyNode.prototype.AddChild=function(a){var b=this.m_Childs.length;this.m_Childs.push(a);a.m_Parent=this;a.m_Index=b};d.PolyNode.prototype.GetNext=function(){return 0<this.m_Childs.length?this.m_Childs[0]:this.GetNextSiblingUp()};d.PolyNode.prototype.GetNextSiblingUp=function(){return null===this.m_Parent?null:this.m_Index==this.m_Parent.m_Childs.length-1?this.m_Parent.GetNextSiblingUp():this.m_Parent.m_Childs[this.m_Index+1]};d.PolyNode.prototype.Childs=function(){return this.m_Childs};
d.PolyNode.prototype.Parent=function(){return this.m_Parent};d.PolyNode.prototype.IsHole=function(){return this.IsHoleNode()};d.PolyTree=function(){this.m_AllPolys=[];d.PolyNode.call(this)};d.PolyTree.prototype.Clear=function(){for(var a=0,b=this.m_AllPolys.length;a<b;a++)this.m_AllPolys[a]=null;this.m_AllPolys.length=0;this.m_Childs.length=0};d.PolyTree.prototype.GetFirst=function(){return 0<this.m_Childs.length?this.m_Childs[0]:null};d.PolyTree.prototype.Total=function(){var a=this.m_AllPolys.length;
0<a&&this.m_Childs[0]!=this.m_AllPolys[0]&&a--;return a};q(d.PolyTree,d.PolyNode);d.Math_Abs_Int64=d.Math_Abs_Int32=d.Math_Abs_Double=function(a){return Math.abs(a)};d.Math_Max_Int32_Int32=function(a,b){return Math.max(a,b)};d.Cast_Int32=r||I||L?function(a){return a|0}:function(a){return~~a};d.Cast_Int64=G?function(a){return-2147483648>a||2147483647<a?0>a?Math.ceil(a):Math.floor(a):~~a}:H&&"function"==typeof Number.toInteger?function(a){return Number.toInteger(a)}:Q||J?function(a){return parseInt(a,
10)}:r?function(a){return-2147483648>a||2147483647<a?0>a?Math.ceil(a):Math.floor(a):a|0}:function(a){return 0>a?Math.ceil(a):Math.floor(a)};d.Clear=function(a){a.length=0};d.PI=3.141592653589793;d.PI2=6.283185307179586;d.IntPoint=function(){var a=arguments,b=a.length;this.Y=this.X=0;d.use_xyz?(this.Z=0,3==b?(this.X=a[0],this.Y=a[1],this.Z=a[2]):2==b?(this.X=a[0],this.Y=a[1],this.Z=0):1==b?a[0]instanceof d.DoublePoint?(a=a[0],this.X=d.Clipper.Round(a.X),this.Y=d.Clipper.Round(a.Y),this.Z=0):(a=a[0],
"undefined"==typeof a.Z&&(a.Z=0),this.X=a.X,this.Y=a.Y,this.Z=a.Z):this.Z=this.Y=this.X=0):2==b?(this.X=a[0],this.Y=a[1]):1==b?a[0]instanceof d.DoublePoint?(a=a[0],this.X=d.Clipper.Round(a.X),this.Y=d.Clipper.Round(a.Y)):(a=a[0],this.X=a.X,this.Y=a.Y):this.Y=this.X=0};d.IntPoint.op_Equality=function(a,b){return a.X==b.X&&a.Y==b.Y};d.IntPoint.op_Inequality=function(a,b){return a.X!=b.X||a.Y!=b.Y};d.use_xyz?(d.IntPoint0=function(){this.Z=this.Y=this.X=0},d.IntPoint1=function(a){this.X=a.X;this.Y=a.Y;
this.Z=a.Z},d.IntPoint1dp=function(a){this.X=d.Clipper.Round(a.X);this.Y=d.Clipper.Round(a.Y);this.Z=0},d.IntPoint2=function(a,b){this.X=a;this.Y=b;this.Z=0},d.IntPoint3=function(a,b,c){this.X=a;this.Y=b;this.Z=c}):(d.IntPoint0=function(){this.Y=this.X=0},d.IntPoint1=function(a){this.X=a.X;this.Y=a.Y},d.IntPoint1dp=function(a){this.X=d.Clipper.Round(a.X);this.Y=d.Clipper.Round(a.Y)},d.IntPoint2=function(a,b){this.X=a;this.Y=b});d.IntRect=function(){var a=arguments,b=a.length;4==b?(this.left=a[0],
this.top=a[1],this.right=a[2],this.bottom=a[3]):1==b?(this.left=ir.left,this.top=ir.top,this.right=ir.right,this.bottom=ir.bottom):this.bottom=this.right=this.top=this.left=0};d.IntRect0=function(){this.bottom=this.right=this.top=this.left=0};d.IntRect1=function(a){this.left=a.left;this.top=a.top;this.right=a.right;this.bottom=a.bottom};d.IntRect4=function(a,b,c,d){this.left=a;this.top=b;this.right=c;this.bottom=d};d.ClipType={ctIntersection:0,ctUnion:1,ctDifference:2,ctXor:3};d.PolyType={ptSubject:0,
ptClip:1};d.PolyFillType={pftEvenOdd:0,pftNonZero:1,pftPositive:2,pftNegative:3};d.JoinType={jtSquare:0,jtRound:1,jtMiter:2};d.EndType={etOpenSquare:0,etOpenRound:1,etOpenButt:2,etClosedLine:3,etClosedPolygon:4};d.EdgeSide={esLeft:0,esRight:1};d.Direction={dRightToLeft:0,dLeftToRight:1};d.TEdge=function(){this.Bot=new d.IntPoint;this.Curr=new d.IntPoint;this.Top=new d.IntPoint;this.Delta=new d.IntPoint;this.Dx=0;this.PolyTyp=d.PolyType.ptSubject;this.Side=d.EdgeSide.esLeft;this.OutIdx=this.WindCnt2=
this.WindCnt=this.WindDelta=0;this.PrevInSEL=this.NextInSEL=this.PrevInAEL=this.NextInAEL=this.NextInLML=this.Prev=this.Next=null};d.IntersectNode=function(){this.Edge2=this.Edge1=null;this.Pt=new d.IntPoint};d.MyIntersectNodeSort=function(){};d.MyIntersectNodeSort.Compare=function(a,b){var c=b.Pt.Y-a.Pt.Y;return 0<c?1:0>c?-1:0};d.LocalMinima=function(){this.Y=0;this.Next=this.RightBound=this.LeftBound=null};d.Scanbeam=function(){this.Y=0;this.Next=null};d.OutRec=function(){this.Idx=0;this.IsOpen=
this.IsHole=!1;this.PolyNode=this.BottomPt=this.Pts=this.FirstLeft=null};d.OutPt=function(){this.Idx=0;this.Pt=new d.IntPoint;this.Prev=this.Next=null};d.Join=function(){this.OutPt2=this.OutPt1=null;this.OffPt=new d.IntPoint};d.ClipperBase=function(){this.m_CurrentLM=this.m_MinimaList=null;this.m_edges=[];this.PreserveCollinear=this.m_HasOpenPaths=this.m_UseFullRange=!1;this.m_CurrentLM=this.m_MinimaList=null;this.m_HasOpenPaths=this.m_UseFullRange=!1};d.ClipperBase.horizontal=-9007199254740992;d.ClipperBase.Skip=
-2;d.ClipperBase.Unassigned=-1;d.ClipperBase.tolerance=1E-20;d.ClipperBase.loRange=47453132;d.ClipperBase.hiRange=0xfffffffffffff;d.ClipperBase.near_zero=function(a){return a>-d.ClipperBase.tolerance&&a<d.ClipperBase.tolerance};d.ClipperBase.IsHorizontal=function(a){return 0===a.Delta.Y};d.ClipperBase.prototype.PointIsVertex=function(a,b){var c=b;do{if(d.IntPoint.op_Equality(c.Pt,a))return!0;c=c.Next}while(c!=b);return!1};d.ClipperBase.prototype.PointOnLineSegment=function(a,b,c,d){return d?a.X==
b.X&&a.Y==b.Y||a.X==c.X&&a.Y==c.Y||a.X>b.X==a.X<c.X&&a.Y>b.Y==a.Y<c.Y&&k.op_Equality(k.Int128Mul(a.X-b.X,c.Y-b.Y),k.Int128Mul(c.X-b.X,a.Y-b.Y)):a.X==b.X&&a.Y==b.Y||a.X==c.X&&a.Y==c.Y||a.X>b.X==a.X<c.X&&a.Y>b.Y==a.Y<c.Y&&(a.X-b.X)*(c.Y-b.Y)==(c.X-b.X)*(a.Y-b.Y)};d.ClipperBase.prototype.PointOnPolygon=function(a,b,c){for(var d=b;;){if(this.PointOnLineSegment(a,d.Pt,d.Next.Pt,c))return!0;d=d.Next;if(d==b)break}return!1};d.ClipperBase.prototype.SlopesEqual=d.ClipperBase.SlopesEqual=function(){var a=arguments,
b=a.length,c,e,f;if(3==b)return b=a[0],c=a[1],(a=a[2])?k.op_Equality(k.Int128Mul(b.Delta.Y,c.Delta.X),k.Int128Mul(b.Delta.X,c.Delta.Y)):d.Cast_Int64(b.Delta.Y*c.Delta.X)==d.Cast_Int64(b.Delta.X*c.Delta.Y);if(4==b)return b=a[0],c=a[1],e=a[2],(a=a[3])?k.op_Equality(k.Int128Mul(b.Y-c.Y,c.X-e.X),k.Int128Mul(b.X-c.X,c.Y-e.Y)):0===d.Cast_Int64((b.Y-c.Y)*(c.X-e.X))-d.Cast_Int64((b.X-c.X)*(c.Y-e.Y));b=a[0];c=a[1];e=a[2];f=a[3];return(a=a[4])?k.op_Equality(k.Int128Mul(b.Y-c.Y,e.X-f.X),k.Int128Mul(b.X-c.X,
e.Y-f.Y)):0===d.Cast_Int64((b.Y-c.Y)*(e.X-f.X))-d.Cast_Int64((b.X-c.X)*(e.Y-f.Y))};d.ClipperBase.SlopesEqual3=function(a,b,c){return c?k.op_Equality(k.Int128Mul(a.Delta.Y,b.Delta.X),k.Int128Mul(a.Delta.X,b.Delta.Y)):d.Cast_Int64(a.Delta.Y*b.Delta.X)==d.Cast_Int64(a.Delta.X*b.Delta.Y)};d.ClipperBase.SlopesEqual4=function(a,b,c,e){return e?k.op_Equality(k.Int128Mul(a.Y-b.Y,b.X-c.X),k.Int128Mul(a.X-b.X,b.Y-c.Y)):0===d.Cast_Int64((a.Y-b.Y)*(b.X-c.X))-d.Cast_Int64((a.X-b.X)*(b.Y-c.Y))};d.ClipperBase.SlopesEqual5=
function(a,b,c,e,f){return f?k.op_Equality(k.Int128Mul(a.Y-b.Y,c.X-e.X),k.Int128Mul(a.X-b.X,c.Y-e.Y)):0===d.Cast_Int64((a.Y-b.Y)*(c.X-e.X))-d.Cast_Int64((a.X-b.X)*(c.Y-e.Y))};d.ClipperBase.prototype.Clear=function(){this.DisposeLocalMinimaList();for(var a=0,b=this.m_edges.length;a<b;++a){for(var c=0,e=this.m_edges[a].length;c<e;++c)this.m_edges[a][c]=null;d.Clear(this.m_edges[a])}d.Clear(this.m_edges);this.m_HasOpenPaths=this.m_UseFullRange=!1};d.ClipperBase.prototype.DisposeLocalMinimaList=function(){for(;null!==
this.m_MinimaList;){var a=this.m_MinimaList.Next;this.m_MinimaList=null;this.m_MinimaList=a}this.m_CurrentLM=null};d.ClipperBase.prototype.RangeTest=function(a,b){if(b.Value)(a.X>d.ClipperBase.hiRange||a.Y>d.ClipperBase.hiRange||-a.X>d.ClipperBase.hiRange||-a.Y>d.ClipperBase.hiRange)&&d.Error("Coordinate outside allowed range in RangeTest().");else if(a.X>d.ClipperBase.loRange||a.Y>d.ClipperBase.loRange||-a.X>d.ClipperBase.loRange||-a.Y>d.ClipperBase.loRange)b.Value=!0,this.RangeTest(a,b)};d.ClipperBase.prototype.InitEdge=
function(a,b,c,e){a.Next=b;a.Prev=c;a.Curr.X=e.X;a.Curr.Y=e.Y;d.use_xyz&&(a.Curr.Z=e.Z);a.OutIdx=-1};d.ClipperBase.prototype.InitEdge2=function(a,b){a.Curr.Y>=a.Next.Curr.Y?(a.Bot.X=a.Curr.X,a.Bot.Y=a.Curr.Y,d.use_xyz&&(a.Bot.Z=a.Curr.Z),a.Top.X=a.Next.Curr.X,a.Top.Y=a.Next.Curr.Y,d.use_xyz&&(a.Top.Z=a.Next.Curr.Z)):(a.Top.X=a.Curr.X,a.Top.Y=a.Curr.Y,d.use_xyz&&(a.Top.Z=a.Curr.Z),a.Bot.X=a.Next.Curr.X,a.Bot.Y=a.Next.Curr.Y,d.use_xyz&&(a.Bot.Z=a.Next.Curr.Z));this.SetDx(a);a.PolyTyp=b};d.ClipperBase.prototype.FindNextLocMin=
function(a){for(var b;;){for(;d.IntPoint.op_Inequality(a.Bot,a.Prev.Bot)||d.IntPoint.op_Equality(a.Curr,a.Top);)a=a.Next;if(a.Dx!=d.ClipperBase.horizontal&&a.Prev.Dx!=d.ClipperBase.horizontal)break;for(;a.Prev.Dx==d.ClipperBase.horizontal;)a=a.Prev;for(b=a;a.Dx==d.ClipperBase.horizontal;)a=a.Next;if(a.Top.Y!=a.Prev.Bot.Y){b.Prev.Bot.X<a.Bot.X&&(a=b);break}}return a};d.ClipperBase.prototype.ProcessBound=function(a,b){var c,e=a,f;if(e.OutIdx==d.ClipperBase.Skip){a=e;if(b){for(;a.Top.Y==a.Next.Bot.Y;)a=
a.Next;for(;a!=e&&a.Dx==d.ClipperBase.horizontal;)a=a.Prev}else{for(;a.Top.Y==a.Prev.Bot.Y;)a=a.Prev;for(;a!=e&&a.Dx==d.ClipperBase.horizontal;)a=a.Next}a==e?e=b?a.Next:a.Prev:(a=b?e.Next:e.Prev,c=new d.LocalMinima,c.Next=null,c.Y=a.Bot.Y,c.LeftBound=null,c.RightBound=a,a.WindDelta=0,e=this.ProcessBound(a,b),this.InsertLocalMinima(c));return e}a.Dx==d.ClipperBase.horizontal&&(c=b?a.Prev:a.Next,c.OutIdx!=d.ClipperBase.Skip&&(c.Dx==d.ClipperBase.horizontal?c.Bot.X!=a.Bot.X&&c.Top.X!=a.Bot.X&&this.ReverseHorizontal(a):
c.Bot.X!=a.Bot.X&&this.ReverseHorizontal(a)));c=a;if(b){for(;e.Top.Y==e.Next.Bot.Y&&e.Next.OutIdx!=d.ClipperBase.Skip;)e=e.Next;if(e.Dx==d.ClipperBase.horizontal&&e.Next.OutIdx!=d.ClipperBase.Skip){for(f=e;f.Prev.Dx==d.ClipperBase.horizontal;)f=f.Prev;f.Prev.Top.X==e.Next.Top.X?b||(e=f.Prev):f.Prev.Top.X>e.Next.Top.X&&(e=f.Prev)}for(;a!=e;)a.NextInLML=a.Next,a.Dx==d.ClipperBase.horizontal&&a!=c&&a.Bot.X!=a.Prev.Top.X&&this.ReverseHorizontal(a),a=a.Next;a.Dx==d.ClipperBase.horizontal&&a!=c&&a.Bot.X!=
a.Prev.Top.X&&this.ReverseHorizontal(a);e=e.Next}else{for(;e.Top.Y==e.Prev.Bot.Y&&e.Prev.OutIdx!=d.ClipperBase.Skip;)e=e.Prev;if(e.Dx==d.ClipperBase.horizontal&&e.Prev.OutIdx!=d.ClipperBase.Skip){for(f=e;f.Next.Dx==d.ClipperBase.horizontal;)f=f.Next;f.Next.Top.X==e.Prev.Top.X?b||(e=f.Next):f.Next.Top.X>e.Prev.Top.X&&(e=f.Next)}for(;a!=e;)a.NextInLML=a.Prev,a.Dx==d.ClipperBase.horizontal&&a!=c&&a.Bot.X!=a.Next.Top.X&&this.ReverseHorizontal(a),a=a.Prev;a.Dx==d.ClipperBase.horizontal&&a!=c&&a.Bot.X!=
a.Next.Top.X&&this.ReverseHorizontal(a);e=e.Prev}return e};d.ClipperBase.prototype.AddPath=function(a,b,c){d.use_lines?c||b!=d.PolyType.ptClip||d.Error("AddPath: Open paths must be subject."):c||d.Error("AddPath: Open paths have been disabled.");var e=a.length-1;if(c)for(;0<e&&d.IntPoint.op_Equality(a[e],a[0]);)--e;for(;0<e&&d.IntPoint.op_Equality(a[e],a[e-1]);)--e;if(c&&2>e||!c&&1>e)return!1;for(var f=[],g=0;g<=e;g++)f.push(new d.TEdge);var h=!0;f[1].Curr.X=a[1].X;f[1].Curr.Y=a[1].Y;d.use_xyz&&(f[1].Curr.Z=
a[1].Z);var l={Value:this.m_UseFullRange};this.RangeTest(a[0],l);this.m_UseFullRange=l.Value;l.Value=this.m_UseFullRange;this.RangeTest(a[e],l);this.m_UseFullRange=l.Value;this.InitEdge(f[0],f[1],f[e],a[0]);this.InitEdge(f[e],f[0],f[e-1],a[e]);for(g=e-1;1<=g;--g)l.Value=this.m_UseFullRange,this.RangeTest(a[g],l),this.m_UseFullRange=l.Value,this.InitEdge(f[g],f[g+1],f[g-1],a[g]);for(g=a=e=f[0];;)if(a.Curr!=a.Next.Curr||!c&&a.Next==e){if(a.Prev==a.Next)break;else if(c&&d.ClipperBase.SlopesEqual(a.Prev.Curr,
a.Curr,a.Next.Curr,this.m_UseFullRange)&&(!this.PreserveCollinear||!this.Pt2IsBetweenPt1AndPt3(a.Prev.Curr,a.Curr,a.Next.Curr))){a==e&&(e=a.Next);a=this.RemoveEdge(a);g=a=a.Prev;continue}a=a.Next;if(a==g||!c&&a.Next==e)break}else{if(a==a.Next)break;a==e&&(e=a.Next);g=a=this.RemoveEdge(a)}if(!c&&a==a.Next||c&&a.Prev==a.Next)return!1;c||(this.m_HasOpenPaths=!0,e.Prev.OutIdx=d.ClipperBase.Skip);a=e;do this.InitEdge2(a,b),a=a.Next,h&&a.Curr.Y!=e.Curr.Y&&(h=!1);while(a!=e);if(h){if(c)return!1;a.Prev.OutIdx=
d.ClipperBase.Skip;a.Prev.Bot.X<a.Prev.Top.X&&this.ReverseHorizontal(a.Prev);b=new d.LocalMinima;b.Next=null;b.Y=a.Bot.Y;b.LeftBound=null;b.RightBound=a;b.RightBound.Side=d.EdgeSide.esRight;for(b.RightBound.WindDelta=0;a.Next.OutIdx!=d.ClipperBase.Skip;)a.NextInLML=a.Next,a.Bot.X!=a.Prev.Top.X&&this.ReverseHorizontal(a),a=a.Next;this.InsertLocalMinima(b);this.m_edges.push(f);return!0}this.m_edges.push(f);h=null;d.IntPoint.op_Equality(a.Prev.Bot,a.Prev.Top)&&(a=a.Next);for(;;){a=this.FindNextLocMin(a);
if(a==h)break;else null==h&&(h=a);b=new d.LocalMinima;b.Next=null;b.Y=a.Bot.Y;a.Dx<a.Prev.Dx?(b.LeftBound=a.Prev,b.RightBound=a,f=!1):(b.LeftBound=a,b.RightBound=a.Prev,f=!0);b.LeftBound.Side=d.EdgeSide.esLeft;b.RightBound.Side=d.EdgeSide.esRight;b.LeftBound.WindDelta=c?b.LeftBound.Next==b.RightBound?-1:1:0;b.RightBound.WindDelta=-b.LeftBound.WindDelta;a=this.ProcessBound(b.LeftBound,f);a.OutIdx==d.ClipperBase.Skip&&(a=this.ProcessBound(a,f));e=this.ProcessBound(b.RightBound,!f);e.OutIdx==d.ClipperBase.Skip&&
(e=this.ProcessBound(e,!f));b.LeftBound.OutIdx==d.ClipperBase.Skip?b.LeftBound=null:b.RightBound.OutIdx==d.ClipperBase.Skip&&(b.RightBound=null);this.InsertLocalMinima(b);f||(a=e)}return!0};d.ClipperBase.prototype.AddPaths=function(a,b,c){for(var d=!1,f=0,g=a.length;f<g;++f)this.AddPath(a[f],b,c)&&(d=!0);return d};d.ClipperBase.prototype.Pt2IsBetweenPt1AndPt3=function(a,b,c){return d.IntPoint.op_Equality(a,c)||d.IntPoint.op_Equality(a,b)||d.IntPoint.op_Equality(c,b)?!1:a.X!=c.X?b.X>a.X==b.X<c.X:b.Y>
a.Y==b.Y<c.Y};d.ClipperBase.prototype.RemoveEdge=function(a){a.Prev.Next=a.Next;a.Next.Prev=a.Prev;var b=a.Next;a.Prev=null;return b};d.ClipperBase.prototype.SetDx=function(a){a.Delta.X=a.Top.X-a.Bot.X;a.Delta.Y=a.Top.Y-a.Bot.Y;a.Dx=0===a.Delta.Y?d.ClipperBase.horizontal:a.Delta.X/a.Delta.Y};d.ClipperBase.prototype.InsertLocalMinima=function(a){if(null===this.m_MinimaList)this.m_MinimaList=a;else if(a.Y>=this.m_MinimaList.Y)a.Next=this.m_MinimaList,this.m_MinimaList=a;else{for(var b=this.m_MinimaList;null!==
b.Next&&a.Y<b.Next.Y;)b=b.Next;a.Next=b.Next;b.Next=a}};d.ClipperBase.prototype.PopLocalMinima=function(){null!==this.m_CurrentLM&&(this.m_CurrentLM=this.m_CurrentLM.Next)};d.ClipperBase.prototype.ReverseHorizontal=function(a){var b=a.Top.X;a.Top.X=a.Bot.X;a.Bot.X=b;d.use_xyz&&(b=a.Top.Z,a.Top.Z=a.Bot.Z,a.Bot.Z=b)};d.ClipperBase.prototype.Reset=function(){this.m_CurrentLM=this.m_MinimaList;if(null!=this.m_CurrentLM)for(var a=this.m_MinimaList;null!=a;){var b=a.LeftBound;null!=b&&(b.Curr.X=b.Bot.X,
b.Curr.Y=b.Bot.Y,d.use_xyz&&(b.Curr.Z=b.Bot.Z),b.Side=d.EdgeSide.esLeft,b.OutIdx=d.ClipperBase.Unassigned);b=a.RightBound;null!=b&&(b.Curr.X=b.Bot.X,b.Curr.Y=b.Bot.Y,d.use_xyz&&(b.Curr.Z=b.Bot.Z),b.Side=d.EdgeSide.esRight,b.OutIdx=d.ClipperBase.Unassigned);a=a.Next}};d.Clipper=function(a){"undefined"==typeof a&&(a=0);this.m_PolyOuts=null;this.m_ClipType=d.ClipType.ctIntersection;this.m_IntersectNodeComparer=this.m_IntersectList=this.m_SortedEdges=this.m_ActiveEdges=this.m_Scanbeam=null;this.m_ExecuteLocked=
!1;this.m_SubjFillType=this.m_ClipFillType=d.PolyFillType.pftEvenOdd;this.m_GhostJoins=this.m_Joins=null;this.StrictlySimple=this.ReverseSolution=this.m_UsingPolyTree=!1;d.ClipperBase.call(this);this.m_SortedEdges=this.m_ActiveEdges=this.m_Scanbeam=null;this.m_IntersectList=[];this.m_IntersectNodeComparer=d.MyIntersectNodeSort.Compare;this.m_UsingPolyTree=this.m_ExecuteLocked=!1;this.m_PolyOuts=[];this.m_Joins=[];this.m_GhostJoins=[];this.ReverseSolution=0!==(1&a);this.StrictlySimple=0!==(2&a);this.PreserveCollinear=
0!==(4&a);d.use_xyz&&(this.ZFillFunction=null)};d.Clipper.ioReverseSolution=1;d.Clipper.ioStrictlySimple=2;d.Clipper.ioPreserveCollinear=4;d.Clipper.prototype.Clear=function(){0!==this.m_edges.length&&(this.DisposeAllPolyPts(),d.ClipperBase.prototype.Clear.call(this))};d.Clipper.prototype.DisposeScanbeamList=function(){for(;null!==this.m_Scanbeam;){var a=this.m_Scanbeam.Next;this.m_Scanbeam=null;this.m_Scanbeam=a}};d.Clipper.prototype.Reset=function(){d.ClipperBase.prototype.Reset.call(this);this.m_SortedEdges=
this.m_ActiveEdges=this.m_Scanbeam=null;for(var a=this.m_MinimaList;null!==a;)this.InsertScanbeam(a.Y),a=a.Next};d.Clipper.prototype.InsertScanbeam=function(a){if(null===this.m_Scanbeam)this.m_Scanbeam=new d.Scanbeam,this.m_Scanbeam.Next=null,this.m_Scanbeam.Y=a;else if(a>this.m_Scanbeam.Y){var b=new d.Scanbeam;b.Y=a;b.Next=this.m_Scanbeam;this.m_Scanbeam=b}else{for(var c=this.m_Scanbeam;null!==c.Next&&a<=c.Next.Y;)c=c.Next;a!=c.Y&&(b=new d.Scanbeam,b.Y=a,b.Next=c.Next,c.Next=b)}};d.Clipper.prototype.Execute=
function(){var a=arguments,b=a.length,c=a[1]instanceof d.PolyTree;if(4!=b||c){if(4==b&&c){var b=a[0],e=a[1],c=a[2],a=a[3];if(this.m_ExecuteLocked)return!1;this.m_ExecuteLocked=!0;this.m_SubjFillType=c;this.m_ClipFillType=a;this.m_ClipType=b;this.m_UsingPolyTree=!0;try{(f=this.ExecuteInternal())&&this.BuildResult2(e)}finally{this.DisposeAllPolyPts(),this.m_ExecuteLocked=!1}return f}if(2==b&&!c||2==b&&c)return b=a[0],e=a[1],this.Execute(b,e,d.PolyFillType.pftEvenOdd,d.PolyFillType.pftEvenOdd)}else{b=
a[0];e=a[1];c=a[2];a=a[3];if(this.m_ExecuteLocked)return!1;this.m_HasOpenPaths&&d.Error("Error: PolyTree struct is need for open path clipping.");this.m_ExecuteLocked=!0;d.Clear(e);this.m_SubjFillType=c;this.m_ClipFillType=a;this.m_ClipType=b;this.m_UsingPolyTree=!1;try{var f=this.ExecuteInternal();f&&this.BuildResult(e)}finally{this.DisposeAllPolyPts(),this.m_ExecuteLocked=!1}return f}};d.Clipper.prototype.FixHoleLinkage=function(a){if(null!==a.FirstLeft&&(a.IsHole==a.FirstLeft.IsHole||null===a.FirstLeft.Pts)){for(var b=
a.FirstLeft;null!==b&&(b.IsHole==a.IsHole||null===b.Pts);)b=b.FirstLeft;a.FirstLeft=b}};d.Clipper.prototype.ExecuteInternal=function(){try{this.Reset();if(null===this.m_CurrentLM)return!1;var a=this.PopScanbeam();do{this.InsertLocalMinimaIntoAEL(a);d.Clear(this.m_GhostJoins);this.ProcessHorizontals(!1);if(null===this.m_Scanbeam)break;var b=this.PopScanbeam();if(!this.ProcessIntersections(b))return!1;this.ProcessEdgesAtTopOfScanbeam(b);a=b}while(null!==this.m_Scanbeam||null!==this.m_CurrentLM);for(var a=
0,c=this.m_PolyOuts.length;a<c;a++){var e=this.m_PolyOuts[a];null===e.Pts||e.IsOpen||(e.IsHole^this.ReverseSolution)==0<this.Area(e)&&this.ReversePolyPtLinks(e.Pts)}this.JoinCommonEdges();a=0;for(c=this.m_PolyOuts.length;a<c;a++)e=this.m_PolyOuts[a],null===e.Pts||e.IsOpen||this.FixupOutPolygon(e);this.StrictlySimple&&this.DoSimplePolygons();return!0}finally{d.Clear(this.m_Joins),d.Clear(this.m_GhostJoins)}};d.Clipper.prototype.PopScanbeam=function(){var a=this.m_Scanbeam.Y;this.m_Scanbeam=this.m_Scanbeam.Next;
return a};d.Clipper.prototype.DisposeAllPolyPts=function(){for(var a=0,b=this.m_PolyOuts.length;a<b;++a)this.DisposeOutRec(a);d.Clear(this.m_PolyOuts)};d.Clipper.prototype.DisposeOutRec=function(a){this.m_PolyOuts[a].Pts=null;this.m_PolyOuts[a]=null};d.Clipper.prototype.AddJoin=function(a,b,c){var e=new d.Join;e.OutPt1=a;e.OutPt2=b;e.OffPt.X=c.X;e.OffPt.Y=c.Y;d.use_xyz&&(e.OffPt.Z=c.Z);this.m_Joins.push(e)};d.Clipper.prototype.AddGhostJoin=function(a,b){var c=new d.Join;c.OutPt1=a;c.OffPt.X=b.X;c.OffPt.Y=
b.Y;d.use_xyz&&(c.OffPt.Z=b.Z);this.m_GhostJoins.push(c)};d.Clipper.prototype.SetZ=function(a,b,c){null!==this.ZFillFunction&&0==a.Z&&null!==this.ZFillFunction&&(d.IntPoint.op_Equality(a,b.Bot)?a.Z=b.Bot.Z:d.IntPoint.op_Equality(a,b.Top)?a.Z=b.Top.Z:d.IntPoint.op_Equality(a,c.Bot)?a.Z=c.Bot.Z:d.IntPoint.op_Equality(a,c.Top)?a.Z=c.Top.Z:this.ZFillFunction(b.Bot,b.Top,c.Bot,c.Top,a))};d.Clipper.prototype.InsertLocalMinimaIntoAEL=function(a){for(;null!==this.m_CurrentLM&&this.m_CurrentLM.Y==a;){var b=
this.m_CurrentLM.LeftBound,c=this.m_CurrentLM.RightBound;this.PopLocalMinima();var e=null;null===b?(this.InsertEdgeIntoAEL(c,null),this.SetWindingCount(c),this.IsContributing(c)&&(e=this.AddOutPt(c,c.Bot))):(null==c?(this.InsertEdgeIntoAEL(b,null),this.SetWindingCount(b),this.IsContributing(b)&&(e=this.AddOutPt(b,b.Bot))):(this.InsertEdgeIntoAEL(b,null),this.InsertEdgeIntoAEL(c,b),this.SetWindingCount(b),c.WindCnt=b.WindCnt,c.WindCnt2=b.WindCnt2,this.IsContributing(b)&&(e=this.AddLocalMinPoly(b,c,
b.Bot))),this.InsertScanbeam(b.Top.Y));null!=c&&(d.ClipperBase.IsHorizontal(c)?this.AddEdgeToSEL(c):this.InsertScanbeam(c.Top.Y));if(null!=b&&null!=c){if(null!==e&&d.ClipperBase.IsHorizontal(c)&&0<this.m_GhostJoins.length&&0!==c.WindDelta)for(var f=0,g=this.m_GhostJoins.length;f<g;f++){var h=this.m_GhostJoins[f];this.HorzSegmentsOverlap(h.OutPt1.Pt.X,h.OffPt.X,c.Bot.X,c.Top.X)&&this.AddJoin(h.OutPt1,e,h.OffPt)}0<=b.OutIdx&&null!==b.PrevInAEL&&b.PrevInAEL.Curr.X==b.Bot.X&&0<=b.PrevInAEL.OutIdx&&d.ClipperBase.SlopesEqual(b.PrevInAEL,
b,this.m_UseFullRange)&&0!==b.WindDelta&&0!==b.PrevInAEL.WindDelta&&(f=this.AddOutPt(b.PrevInAEL,b.Bot),this.AddJoin(e,f,b.Top));if(b.NextInAEL!=c&&(0<=c.OutIdx&&0<=c.PrevInAEL.OutIdx&&d.ClipperBase.SlopesEqual(c.PrevInAEL,c,this.m_UseFullRange)&&0!==c.WindDelta&&0!==c.PrevInAEL.WindDelta&&(f=this.AddOutPt(c.PrevInAEL,c.Bot),this.AddJoin(e,f,c.Top)),e=b.NextInAEL,null!==e))for(;e!=c;)this.IntersectEdges(c,e,b.Curr,!1),e=e.NextInAEL}}};d.Clipper.prototype.InsertEdgeIntoAEL=function(a,b){if(null===
this.m_ActiveEdges)a.PrevInAEL=null,a.NextInAEL=null,this.m_ActiveEdges=a;else if(null===b&&this.E2InsertsBeforeE1(this.m_ActiveEdges,a))a.PrevInAEL=null,a.NextInAEL=this.m_ActiveEdges,this.m_ActiveEdges=this.m_ActiveEdges.PrevInAEL=a;else{null===b&&(b=this.m_ActiveEdges);for(;null!==b.NextInAEL&&!this.E2InsertsBeforeE1(b.NextInAEL,a);)b=b.NextInAEL;a.NextInAEL=b.NextInAEL;null!==b.NextInAEL&&(b.NextInAEL.PrevInAEL=a);a.PrevInAEL=b;b.NextInAEL=a}};d.Clipper.prototype.E2InsertsBeforeE1=function(a,
b){return b.Curr.X==a.Curr.X?b.Top.Y>a.Top.Y?b.Top.X<d.Clipper.TopX(a,b.Top.Y):a.Top.X>d.Clipper.TopX(b,a.Top.Y):b.Curr.X<a.Curr.X};d.Clipper.prototype.IsEvenOddFillType=function(a){return a.PolyTyp==d.PolyType.ptSubject?this.m_SubjFillType==d.PolyFillType.pftEvenOdd:this.m_ClipFillType==d.PolyFillType.pftEvenOdd};d.Clipper.prototype.IsEvenOddAltFillType=function(a){return a.PolyTyp==d.PolyType.ptSubject?this.m_ClipFillType==d.PolyFillType.pftEvenOdd:this.m_SubjFillType==d.PolyFillType.pftEvenOdd};
d.Clipper.prototype.IsContributing=function(a){var b,c;a.PolyTyp==d.PolyType.ptSubject?(b=this.m_SubjFillType,c=this.m_ClipFillType):(b=this.m_ClipFillType,c=this.m_SubjFillType);switch(b){case d.PolyFillType.pftEvenOdd:if(0===a.WindDelta&&1!=a.WindCnt)return!1;break;case d.PolyFillType.pftNonZero:if(1!=Math.abs(a.WindCnt))return!1;break;case d.PolyFillType.pftPositive:if(1!=a.WindCnt)return!1;break;default:if(-1!=a.WindCnt)return!1}switch(this.m_ClipType){case d.ClipType.ctIntersection:switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0!==
a.WindCnt2;case d.PolyFillType.pftPositive:return 0<a.WindCnt2;default:return 0>a.WindCnt2}case d.ClipType.ctUnion:switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0===a.WindCnt2;case d.PolyFillType.pftPositive:return 0>=a.WindCnt2;default:return 0<=a.WindCnt2}case d.ClipType.ctDifference:if(a.PolyTyp==d.PolyType.ptSubject)switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0===a.WindCnt2;case d.PolyFillType.pftPositive:return 0>=a.WindCnt2;
default:return 0<=a.WindCnt2}else switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0!==a.WindCnt2;case d.PolyFillType.pftPositive:return 0<a.WindCnt2;default:return 0>a.WindCnt2}case d.ClipType.ctXor:if(0===a.WindDelta)switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0===a.WindCnt2;case d.PolyFillType.pftPositive:return 0>=a.WindCnt2;default:return 0<=a.WindCnt2}}return!0};d.Clipper.prototype.SetWindingCount=function(a){for(var b=a.PrevInAEL;null!==
b&&(b.PolyTyp!=a.PolyTyp||0===b.WindDelta);)b=b.PrevInAEL;if(null===b)a.WindCnt=0===a.WindDelta?1:a.WindDelta,a.WindCnt2=0,b=this.m_ActiveEdges;else{if(0===a.WindDelta&&this.m_ClipType!=d.ClipType.ctUnion)a.WindCnt=1;else if(this.IsEvenOddFillType(a))if(0===a.WindDelta){for(var c=!0,e=b.PrevInAEL;null!==e;)e.PolyTyp==b.PolyTyp&&0!==e.WindDelta&&(c=!c),e=e.PrevInAEL;a.WindCnt=c?0:1}else a.WindCnt=a.WindDelta;else a.WindCnt=0>b.WindCnt*b.WindDelta?1<Math.abs(b.WindCnt)?0>b.WindDelta*a.WindDelta?b.WindCnt:
b.WindCnt+a.WindDelta:0===a.WindDelta?1:a.WindDelta:0===a.WindDelta?0>b.WindCnt?b.WindCnt-1:b.WindCnt+1:0>b.WindDelta*a.WindDelta?b.WindCnt:b.WindCnt+a.WindDelta;a.WindCnt2=b.WindCnt2;b=b.NextInAEL}if(this.IsEvenOddAltFillType(a))for(;b!=a;)0!==b.WindDelta&&(a.WindCnt2=0===a.WindCnt2?1:0),b=b.NextInAEL;else for(;b!=a;)a.WindCnt2+=b.WindDelta,b=b.NextInAEL};d.Clipper.prototype.AddEdgeToSEL=function(a){null===this.m_SortedEdges?(this.m_SortedEdges=a,a.PrevInSEL=null,a.NextInSEL=null):(a.NextInSEL=this.m_SortedEdges,
a.PrevInSEL=null,this.m_SortedEdges=this.m_SortedEdges.PrevInSEL=a)};d.Clipper.prototype.CopyAELToSEL=function(){var a=this.m_ActiveEdges;for(this.m_SortedEdges=a;null!==a;)a.PrevInSEL=a.PrevInAEL,a=a.NextInSEL=a.NextInAEL};d.Clipper.prototype.SwapPositionsInAEL=function(a,b){if(a.NextInAEL!=a.PrevInAEL&&b.NextInAEL!=b.PrevInAEL){if(a.NextInAEL==b){var c=b.NextInAEL;null!==c&&(c.PrevInAEL=a);var d=a.PrevInAEL;null!==d&&(d.NextInAEL=b);b.PrevInAEL=d;b.NextInAEL=a;a.PrevInAEL=b;a.NextInAEL=c}else b.NextInAEL==
a?(c=a.NextInAEL,null!==c&&(c.PrevInAEL=b),d=b.PrevInAEL,null!==d&&(d.NextInAEL=a),a.PrevInAEL=d,a.NextInAEL=b,b.PrevInAEL=a,b.NextInAEL=c):(c=a.NextInAEL,d=a.PrevInAEL,a.NextInAEL=b.NextInAEL,null!==a.NextInAEL&&(a.NextInAEL.PrevInAEL=a),a.PrevInAEL=b.PrevInAEL,null!==a.PrevInAEL&&(a.PrevInAEL.NextInAEL=a),b.NextInAEL=c,null!==b.NextInAEL&&(b.NextInAEL.PrevInAEL=b),b.PrevInAEL=d,null!==b.PrevInAEL&&(b.PrevInAEL.NextInAEL=b));null===a.PrevInAEL?this.m_ActiveEdges=a:null===b.PrevInAEL&&(this.m_ActiveEdges=
b)}};d.Clipper.prototype.SwapPositionsInSEL=function(a,b){if(null!==a.NextInSEL||null!==a.PrevInSEL)if(null!==b.NextInSEL||null!==b.PrevInSEL){if(a.NextInSEL==b){var c=b.NextInSEL;null!==c&&(c.PrevInSEL=a);var d=a.PrevInSEL;null!==d&&(d.NextInSEL=b);b.PrevInSEL=d;b.NextInSEL=a;a.PrevInSEL=b;a.NextInSEL=c}else b.NextInSEL==a?(c=a.NextInSEL,null!==c&&(c.PrevInSEL=b),d=b.PrevInSEL,null!==d&&(d.NextInSEL=a),a.PrevInSEL=d,a.NextInSEL=b,b.PrevInSEL=a,b.NextInSEL=c):(c=a.NextInSEL,d=a.PrevInSEL,a.NextInSEL=
b.NextInSEL,null!==a.NextInSEL&&(a.NextInSEL.PrevInSEL=a),a.PrevInSEL=b.PrevInSEL,null!==a.PrevInSEL&&(a.PrevInSEL.NextInSEL=a),b.NextInSEL=c,null!==b.NextInSEL&&(b.NextInSEL.PrevInSEL=b),b.PrevInSEL=d,null!==b.PrevInSEL&&(b.PrevInSEL.NextInSEL=b));null===a.PrevInSEL?this.m_SortedEdges=a:null===b.PrevInSEL&&(this.m_SortedEdges=b)}};d.Clipper.prototype.AddLocalMaxPoly=function(a,b,c){this.AddOutPt(a,c);0==b.WindDelta&&this.AddOutPt(b,c);a.OutIdx==b.OutIdx?(a.OutIdx=-1,b.OutIdx=-1):a.OutIdx<b.OutIdx?
this.AppendPolygon(a,b):this.AppendPolygon(b,a)};d.Clipper.prototype.AddLocalMinPoly=function(a,b,c){var e,f;d.ClipperBase.IsHorizontal(b)||a.Dx>b.Dx?(e=this.AddOutPt(a,c),b.OutIdx=a.OutIdx,a.Side=d.EdgeSide.esLeft,b.Side=d.EdgeSide.esRight,f=a,a=f.PrevInAEL==b?b.PrevInAEL:f.PrevInAEL):(e=this.AddOutPt(b,c),a.OutIdx=b.OutIdx,a.Side=d.EdgeSide.esRight,b.Side=d.EdgeSide.esLeft,f=b,a=f.PrevInAEL==a?a.PrevInAEL:f.PrevInAEL);null!==a&&0<=a.OutIdx&&d.Clipper.TopX(a,c.Y)==d.Clipper.TopX(f,c.Y)&&d.ClipperBase.SlopesEqual(f,
a,this.m_UseFullRange)&&0!==f.WindDelta&&0!==a.WindDelta&&(c=this.AddOutPt(a,c),this.AddJoin(e,c,f.Top));return e};d.Clipper.prototype.CreateOutRec=function(){var a=new d.OutRec;a.Idx=-1;a.IsHole=!1;a.IsOpen=!1;a.FirstLeft=null;a.Pts=null;a.BottomPt=null;a.PolyNode=null;this.m_PolyOuts.push(a);a.Idx=this.m_PolyOuts.length-1;return a};d.Clipper.prototype.AddOutPt=function(a,b){var c=a.Side==d.EdgeSide.esLeft;if(0>a.OutIdx){var e=this.CreateOutRec();e.IsOpen=0===a.WindDelta;var f=new d.OutPt;e.Pts=
f;f.Idx=e.Idx;f.Pt.X=b.X;f.Pt.Y=b.Y;d.use_xyz&&(f.Pt.Z=b.Z);f.Next=f;f.Prev=f;e.IsOpen||this.SetHoleState(a,e);a.OutIdx=e.Idx}else{var e=this.m_PolyOuts[a.OutIdx],g=e.Pts;if(c&&d.IntPoint.op_Equality(b,g.Pt))return g;if(!c&&d.IntPoint.op_Equality(b,g.Prev.Pt))return g.Prev;f=new d.OutPt;f.Idx=e.Idx;f.Pt.X=b.X;f.Pt.Y=b.Y;d.use_xyz&&(f.Pt.Z=b.Z);f.Next=g;f.Prev=g.Prev;f.Prev.Next=f;g.Prev=f;c&&(e.Pts=f)}return f};d.Clipper.prototype.SwapPoints=function(a,b){var c=new d.IntPoint(a.Value);a.Value.X=b.Value.X;
a.Value.Y=b.Value.Y;d.use_xyz&&(a.Value.Z=b.Value.Z);b.Value.X=c.X;b.Value.Y=c.Y;d.use_xyz&&(b.Value.Z=c.Z)};d.Clipper.prototype.HorzSegmentsOverlap=function(a,b,c,d){var e;a>b&&(e=a,a=b,b=e);c>d&&(e=c,c=d,d=e);return a<d&&c<b};d.Clipper.prototype.SetHoleState=function(a,b){for(var c=!1,d=a.PrevInAEL;null!==d;)0<=d.OutIdx&&0!=d.WindDelta&&(c=!c,null===b.FirstLeft&&(b.FirstLeft=this.m_PolyOuts[d.OutIdx])),d=d.PrevInAEL;c&&(b.IsHole=!0)};d.Clipper.prototype.GetDx=function(a,b){return a.Y==b.Y?d.ClipperBase.horizontal:
(b.X-a.X)/(b.Y-a.Y)};d.Clipper.prototype.FirstIsBottomPt=function(a,b){for(var c=a.Prev;d.IntPoint.op_Equality(c.Pt,a.Pt)&&c!=a;)c=c.Prev;for(var e=Math.abs(this.GetDx(a.Pt,c.Pt)),c=a.Next;d.IntPoint.op_Equality(c.Pt,a.Pt)&&c!=a;)c=c.Next;for(var f=Math.abs(this.GetDx(a.Pt,c.Pt)),c=b.Prev;d.IntPoint.op_Equality(c.Pt,b.Pt)&&c!=b;)c=c.Prev;for(var g=Math.abs(this.GetDx(b.Pt,c.Pt)),c=b.Next;d.IntPoint.op_Equality(c.Pt,b.Pt)&&c!=b;)c=c.Next;c=Math.abs(this.GetDx(b.Pt,c.Pt));return e>=g&&e>=c||f>=g&&f>=
c};d.Clipper.prototype.GetBottomPt=function(a){for(var b=null,c=a.Next;c!=a;)c.Pt.Y>a.Pt.Y?(a=c,b=null):c.Pt.Y==a.Pt.Y&&c.Pt.X<=a.Pt.X&&(c.Pt.X<a.Pt.X?(b=null,a=c):c.Next!=a&&c.Prev!=a&&(b=c)),c=c.Next;if(null!==b)for(;b!=c;)for(this.FirstIsBottomPt(c,b)||(a=b),b=b.Next;d.IntPoint.op_Inequality(b.Pt,a.Pt);)b=b.Next;return a};d.Clipper.prototype.GetLowermostRec=function(a,b){null===a.BottomPt&&(a.BottomPt=this.GetBottomPt(a.Pts));null===b.BottomPt&&(b.BottomPt=this.GetBottomPt(b.Pts));var c=a.BottomPt,
d=b.BottomPt;return c.Pt.Y>d.Pt.Y?a:c.Pt.Y<d.Pt.Y?b:c.Pt.X<d.Pt.X?a:c.Pt.X>d.Pt.X?b:c.Next==c?b:d.Next==d?a:this.FirstIsBottomPt(c,d)?a:b};d.Clipper.prototype.Param1RightOfParam2=function(a,b){do if(a=a.FirstLeft,a==b)return!0;while(null!==a);return!1};d.Clipper.prototype.GetOutRec=function(a){for(a=this.m_PolyOuts[a];a!=this.m_PolyOuts[a.Idx];)a=this.m_PolyOuts[a.Idx];return a};d.Clipper.prototype.AppendPolygon=function(a,b){var c=this.m_PolyOuts[a.OutIdx],e=this.m_PolyOuts[b.OutIdx],f;f=this.Param1RightOfParam2(c,
e)?e:this.Param1RightOfParam2(e,c)?c:this.GetLowermostRec(c,e);var g=c.Pts,h=g.Prev,l=e.Pts,k=l.Prev;a.Side==d.EdgeSide.esLeft?(b.Side==d.EdgeSide.esLeft?(this.ReversePolyPtLinks(l),l.Next=g,g.Prev=l,h.Next=k,k.Prev=h,c.Pts=k):(k.Next=g,g.Prev=k,l.Prev=h,h.Next=l,c.Pts=l),g=d.EdgeSide.esLeft):(b.Side==d.EdgeSide.esRight?(this.ReversePolyPtLinks(l),h.Next=k,k.Prev=h,l.Next=g,g.Prev=l):(h.Next=l,l.Prev=h,g.Prev=k,k.Next=g),g=d.EdgeSide.esRight);c.BottomPt=null;f==e&&(e.FirstLeft!=c&&(c.FirstLeft=e.FirstLeft),
c.IsHole=e.IsHole);e.Pts=null;e.BottomPt=null;e.FirstLeft=c;f=a.OutIdx;h=b.OutIdx;a.OutIdx=-1;b.OutIdx=-1;for(l=this.m_ActiveEdges;null!==l;){if(l.OutIdx==h){l.OutIdx=f;l.Side=g;break}l=l.NextInAEL}e.Idx=c.Idx};d.Clipper.prototype.ReversePolyPtLinks=function(a){if(null!==a){var b,c;b=a;do c=b.Next,b.Next=b.Prev,b=b.Prev=c;while(b!=a)}};d.Clipper.SwapSides=function(a,b){var c=a.Side;a.Side=b.Side;b.Side=c};d.Clipper.SwapPolyIndexes=function(a,b){var c=a.OutIdx;a.OutIdx=b.OutIdx;b.OutIdx=c};d.Clipper.prototype.IntersectEdges=
function(a,b,c){var e=0<=a.OutIdx,f=0<=b.OutIdx;d.use_xyz&&this.SetZ(c,a,b);if(!d.use_lines||0!==a.WindDelta&&0!==b.WindDelta){if(a.PolyTyp==b.PolyTyp)if(this.IsEvenOddFillType(a)){var g=a.WindCnt;a.WindCnt=b.WindCnt;b.WindCnt=g}else a.WindCnt=0===a.WindCnt+b.WindDelta?-a.WindCnt:a.WindCnt+b.WindDelta,b.WindCnt=0===b.WindCnt-a.WindDelta?-b.WindCnt:b.WindCnt-a.WindDelta;else this.IsEvenOddFillType(b)?a.WindCnt2=0===a.WindCnt2?1:0:a.WindCnt2+=b.WindDelta,this.IsEvenOddFillType(a)?b.WindCnt2=0===b.WindCnt2?
1:0:b.WindCnt2-=a.WindDelta;var h,l,k;a.PolyTyp==d.PolyType.ptSubject?(h=this.m_SubjFillType,k=this.m_ClipFillType):(h=this.m_ClipFillType,k=this.m_SubjFillType);b.PolyTyp==d.PolyType.ptSubject?(l=this.m_SubjFillType,g=this.m_ClipFillType):(l=this.m_ClipFillType,g=this.m_SubjFillType);switch(h){case d.PolyFillType.pftPositive:h=a.WindCnt;break;case d.PolyFillType.pftNegative:h=-a.WindCnt;break;default:h=Math.abs(a.WindCnt)}switch(l){case d.PolyFillType.pftPositive:l=b.WindCnt;break;case d.PolyFillType.pftNegative:l=
-b.WindCnt;break;default:l=Math.abs(b.WindCnt)}if(e&&f)0!=h&&1!=h||0!=l&&1!=l||a.PolyTyp!=b.PolyTyp&&this.m_ClipType!=d.ClipType.ctXor?this.AddLocalMaxPoly(a,b,c):(this.AddOutPt(a,c),this.AddOutPt(b,c),d.Clipper.SwapSides(a,b),d.Clipper.SwapPolyIndexes(a,b));else if(e){if(0===l||1==l)this.AddOutPt(a,c),d.Clipper.SwapSides(a,b),d.Clipper.SwapPolyIndexes(a,b)}else if(f){if(0===h||1==h)this.AddOutPt(b,c),d.Clipper.SwapSides(a,b),d.Clipper.SwapPolyIndexes(a,b)}else if(!(0!=h&&1!=h||0!=l&&1!=l)){switch(k){case d.PolyFillType.pftPositive:e=
a.WindCnt2;break;case d.PolyFillType.pftNegative:e=-a.WindCnt2;break;default:e=Math.abs(a.WindCnt2)}switch(g){case d.PolyFillType.pftPositive:f=b.WindCnt2;break;case d.PolyFillType.pftNegative:f=-b.WindCnt2;break;default:f=Math.abs(b.WindCnt2)}if(a.PolyTyp!=b.PolyTyp)this.AddLocalMinPoly(a,b,c);else if(1==h&&1==l)switch(this.m_ClipType){case d.ClipType.ctIntersection:0<e&&0<f&&this.AddLocalMinPoly(a,b,c);break;case d.ClipType.ctUnion:0>=e&&0>=f&&this.AddLocalMinPoly(a,b,c);break;case d.ClipType.ctDifference:(a.PolyTyp==
d.PolyType.ptClip&&0<e&&0<f||a.PolyTyp==d.PolyType.ptSubject&&0>=e&&0>=f)&&this.AddLocalMinPoly(a,b,c);break;case d.ClipType.ctXor:this.AddLocalMinPoly(a,b,c)}else d.Clipper.SwapSides(a,b)}}else if(0!=a.WindDelta||0!=b.WindDelta)a.PolyTyp==b.PolyTyp&&a.WindDelta!=b.WindDelta&&this.m_ClipType==d.ClipType.ctUnion?0===a.WindDelta?f&&(this.AddOutPt(a,c),e&&(a.OutIdx=-1)):e&&(this.AddOutPt(b,c),f&&(b.OutIdx=-1)):a.PolyTyp!=b.PolyTyp&&(0!==a.WindDelta||1!=Math.abs(b.WindCnt)||this.m_ClipType==d.ClipType.ctUnion&&
0!==b.WindCnt2?0!==b.WindDelta||1!=Math.abs(a.WindCnt)||this.m_ClipType==d.ClipType.ctUnion&&0!==a.WindCnt2||(this.AddOutPt(b,c),f&&(b.OutIdx=-1)):(this.AddOutPt(a,c),e&&(a.OutIdx=-1)))};d.Clipper.prototype.DeleteFromAEL=function(a){var b=a.PrevInAEL,c=a.NextInAEL;if(null!==b||null!==c||a==this.m_ActiveEdges)null!==b?b.NextInAEL=c:this.m_ActiveEdges=c,null!==c&&(c.PrevInAEL=b),a.NextInAEL=null,a.PrevInAEL=null};d.Clipper.prototype.DeleteFromSEL=function(a){var b=a.PrevInSEL,c=a.NextInSEL;if(null!==
b||null!==c||a==this.m_SortedEdges)null!==b?b.NextInSEL=c:this.m_SortedEdges=c,null!==c&&(c.PrevInSEL=b),a.NextInSEL=null,a.PrevInSEL=null};d.Clipper.prototype.UpdateEdgeIntoAEL=function(a){null===a.NextInLML&&d.Error("UpdateEdgeIntoAEL: invalid call");var b=a.PrevInAEL,c=a.NextInAEL;a.NextInLML.OutIdx=a.OutIdx;null!==b?b.NextInAEL=a.NextInLML:this.m_ActiveEdges=a.NextInLML;null!==c&&(c.PrevInAEL=a.NextInLML);a.NextInLML.Side=a.Side;a.NextInLML.WindDelta=a.WindDelta;a.NextInLML.WindCnt=a.WindCnt;
a.NextInLML.WindCnt2=a.WindCnt2;a=a.NextInLML;a.Curr.X=a.Bot.X;a.Curr.Y=a.Bot.Y;d.use_xyz&&(a.Curr.Z=a.Bot.Z);a.PrevInAEL=b;a.NextInAEL=c;d.ClipperBase.IsHorizontal(a)||this.InsertScanbeam(a.Top.Y);return a};d.Clipper.prototype.ProcessHorizontals=function(a){for(var b=this.m_SortedEdges;null!==b;)this.DeleteFromSEL(b),this.ProcessHorizontal(b,a),b=this.m_SortedEdges};d.Clipper.prototype.GetHorzDirection=function(a,b){a.Bot.X<a.Top.X?(b.Left=a.Bot.X,b.Right=a.Top.X,b.Dir=d.Direction.dLeftToRight):
(b.Left=a.Top.X,b.Right=a.Bot.X,b.Dir=d.Direction.dRightToLeft)};d.Clipper.prototype.ProcessHorizontal=function(a,b){var c={Dir:null,Left:null,Right:null};this.GetHorzDirection(a,c);for(var e=c.Dir,f=c.Left,g=c.Right,h=a,l=null;null!==h.NextInLML&&d.ClipperBase.IsHorizontal(h.NextInLML);)h=h.NextInLML;for(null===h.NextInLML&&(l=this.GetMaximaPair(h));;){for(var k=a==h,n=this.GetNextInAEL(a,e);null!==n&&!(n.Curr.X==a.Top.X&&null!==a.NextInLML&&n.Dx<a.NextInLML.Dx);){c=this.GetNextInAEL(n,e);if(e==
d.Direction.dLeftToRight&&n.Curr.X<=g||e==d.Direction.dRightToLeft&&n.Curr.X>=f){if(n==l&&k){if(0<=a.OutIdx){e=this.AddOutPt(a,a.Top);for(c=this.m_SortedEdges;null!==c;)0<=c.OutIdx&&this.HorzSegmentsOverlap(a.Bot.X,a.Top.X,c.Bot.X,c.Top.X)&&(f=this.AddOutPt(c,c.Bot),this.AddJoin(f,e,c.Top)),c=c.NextInSEL;this.AddGhostJoin(e,a.Bot);this.AddLocalMaxPoly(a,l,a.Top)}this.DeleteFromAEL(a);this.DeleteFromAEL(l);return}if(e==d.Direction.dLeftToRight){var p=new d.IntPoint(n.Curr.X,a.Curr.Y);this.IntersectEdges(a,
n,p)}else p=new d.IntPoint(n.Curr.X,a.Curr.Y),this.IntersectEdges(n,a,p);this.SwapPositionsInAEL(a,n)}else if(e==d.Direction.dLeftToRight&&n.Curr.X>=g||e==d.Direction.dRightToLeft&&n.Curr.X<=f)break;n=c}if(null!==a.NextInLML&&d.ClipperBase.IsHorizontal(a.NextInLML))a=this.UpdateEdgeIntoAEL(a),0<=a.OutIdx&&this.AddOutPt(a,a.Bot),c={Dir:e,Left:f,Right:g},this.GetHorzDirection(a,c),e=c.Dir,f=c.Left,g=c.Right;else break}null!==a.NextInLML?0<=a.OutIdx?(e=this.AddOutPt(a,a.Top),b&&this.AddGhostJoin(e,a.Bot),
a=this.UpdateEdgeIntoAEL(a),0!==a.WindDelta&&(l=a.PrevInAEL,c=a.NextInAEL,null!==l&&l.Curr.X==a.Bot.X&&l.Curr.Y==a.Bot.Y&&0!==l.WindDelta&&0<=l.OutIdx&&l.Curr.Y>l.Top.Y&&d.ClipperBase.SlopesEqual(a,l,this.m_UseFullRange)?(f=this.AddOutPt(l,a.Bot),this.AddJoin(e,f,a.Top)):null!==c&&c.Curr.X==a.Bot.X&&c.Curr.Y==a.Bot.Y&&0!==c.WindDelta&&0<=c.OutIdx&&c.Curr.Y>c.Top.Y&&d.ClipperBase.SlopesEqual(a,c,this.m_UseFullRange)&&(f=this.AddOutPt(c,a.Bot),this.AddJoin(e,f,a.Top)))):this.UpdateEdgeIntoAEL(a):(0<=
a.OutIdx&&this.AddOutPt(a,a.Top),this.DeleteFromAEL(a))};d.Clipper.prototype.GetNextInAEL=function(a,b){return b==d.Direction.dLeftToRight?a.NextInAEL:a.PrevInAEL};d.Clipper.prototype.IsMinima=function(a){return null!==a&&a.Prev.NextInLML!=a&&a.Next.NextInLML!=a};d.Clipper.prototype.IsMaxima=function(a,b){return null!==a&&a.Top.Y==b&&null===a.NextInLML};d.Clipper.prototype.IsIntermediate=function(a,b){return a.Top.Y==b&&null!==a.NextInLML};d.Clipper.prototype.GetMaximaPair=function(a){var b=null;
d.IntPoint.op_Equality(a.Next.Top,a.Top)&&null===a.Next.NextInLML?b=a.Next:d.IntPoint.op_Equality(a.Prev.Top,a.Top)&&null===a.Prev.NextInLML&&(b=a.Prev);return null===b||-2!=b.OutIdx&&(b.NextInAEL!=b.PrevInAEL||d.ClipperBase.IsHorizontal(b))?b:null};d.Clipper.prototype.ProcessIntersections=function(a){if(null==this.m_ActiveEdges)return!0;try{this.BuildIntersectList(a);if(0==this.m_IntersectList.length)return!0;if(1==this.m_IntersectList.length||this.FixupIntersectionOrder())this.ProcessIntersectList();
else return!1}catch(b){this.m_SortedEdges=null,this.m_IntersectList.length=0,d.Error("ProcessIntersections error")}this.m_SortedEdges=null;return!0};d.Clipper.prototype.BuildIntersectList=function(a){if(null!==this.m_ActiveEdges){var b=this.m_ActiveEdges;for(this.m_SortedEdges=b;null!==b;)b.PrevInSEL=b.PrevInAEL,b.NextInSEL=b.NextInAEL,b.Curr.X=d.Clipper.TopX(b,a),b=b.NextInAEL;for(var c=!0;c&&null!==this.m_SortedEdges;){c=!1;for(b=this.m_SortedEdges;null!==b.NextInSEL;){a=b.NextInSEL;var e=new d.IntPoint;
b.Curr.X>a.Curr.X?(this.IntersectPoint(b,a,e),c=new d.IntersectNode,c.Edge1=b,c.Edge2=a,c.Pt.X=e.X,c.Pt.Y=e.Y,d.use_xyz&&(c.Pt.Z=e.Z),this.m_IntersectList.push(c),this.SwapPositionsInSEL(b,a),c=!0):b=a}if(null!==b.PrevInSEL)b.PrevInSEL.NextInSEL=null;else break}this.m_SortedEdges=null}};d.Clipper.prototype.EdgesAdjacent=function(a){return a.Edge1.NextInSEL==a.Edge2||a.Edge1.PrevInSEL==a.Edge2};d.Clipper.IntersectNodeSort=function(a,b){return b.Pt.Y-a.Pt.Y};d.Clipper.prototype.FixupIntersectionOrder=
function(){this.m_IntersectList.sort(this.m_IntersectNodeComparer);this.CopyAELToSEL();for(var a=this.m_IntersectList.length,b=0;b<a;b++){if(!this.EdgesAdjacent(this.m_IntersectList[b])){for(var c=b+1;c<a&&!this.EdgesAdjacent(this.m_IntersectList[c]);)c++;if(c==a)return!1;var d=this.m_IntersectList[b];this.m_IntersectList[b]=this.m_IntersectList[c];this.m_IntersectList[c]=d}this.SwapPositionsInSEL(this.m_IntersectList[b].Edge1,this.m_IntersectList[b].Edge2)}return!0};d.Clipper.prototype.ProcessIntersectList=
function(){for(var a=0,b=this.m_IntersectList.length;a<b;a++){var c=this.m_IntersectList[a];this.IntersectEdges(c.Edge1,c.Edge2,c.Pt);this.SwapPositionsInAEL(c.Edge1,c.Edge2)}this.m_IntersectList.length=0};G=function(a){return 0>a?Math.ceil(a-.5):Math.round(a)};H=function(a){return 0>a?Math.ceil(a-.5):Math.floor(a+.5)};I=function(a){return 0>a?-Math.round(Math.abs(a)):Math.round(a)};J=function(a){if(0>a)return a-=.5,-2147483648>a?Math.ceil(a):a|0;a+=.5;return 2147483647<a?Math.floor(a):a|0};d.Clipper.Round=
r?G:F?I:L?J:H;d.Clipper.TopX=function(a,b){return b==a.Top.Y?a.Top.X:a.Bot.X+d.Clipper.Round(a.Dx*(b-a.Bot.Y))};d.Clipper.prototype.IntersectPoint=function(a,b,c){c.X=0;c.Y=0;var e,f;if(a.Dx==b.Dx)c.Y=a.Curr.Y,c.X=d.Clipper.TopX(a,c.Y);else{if(0===a.Delta.X)c.X=a.Bot.X,d.ClipperBase.IsHorizontal(b)?c.Y=b.Bot.Y:(f=b.Bot.Y-b.Bot.X/b.Dx,c.Y=d.Clipper.Round(c.X/b.Dx+f));else if(0===b.Delta.X)c.X=b.Bot.X,d.ClipperBase.IsHorizontal(a)?c.Y=a.Bot.Y:(e=a.Bot.Y-a.Bot.X/a.Dx,c.Y=d.Clipper.Round(c.X/a.Dx+e));
else{e=a.Bot.X-a.Bot.Y*a.Dx;f=b.Bot.X-b.Bot.Y*b.Dx;var g=(f-e)/(a.Dx-b.Dx);c.Y=d.Clipper.Round(g);c.X=Math.abs(a.Dx)<Math.abs(b.Dx)?d.Clipper.Round(a.Dx*g+e):d.Clipper.Round(b.Dx*g+f)}if(c.Y<a.Top.Y||c.Y<b.Top.Y){if(a.Top.Y>b.Top.Y)return c.Y=a.Top.Y,c.X=d.Clipper.TopX(b,a.Top.Y),c.X<a.Top.X;c.Y=b.Top.Y;c.X=Math.abs(a.Dx)<Math.abs(b.Dx)?d.Clipper.TopX(a,c.Y):d.Clipper.TopX(b,c.Y)}c.Y>a.Curr.Y&&(c.Y=a.Curr.Y,c.X=Math.abs(a.Dx)>Math.abs(b.Dx)?d.Clipper.TopX(b,c.Y):d.Clipper.TopX(a,c.Y))}};d.Clipper.prototype.ProcessEdgesAtTopOfScanbeam=
function(a){for(var b=this.m_ActiveEdges;null!==b;){var c=this.IsMaxima(b,a);c&&(c=this.GetMaximaPair(b),c=null===c||!d.ClipperBase.IsHorizontal(c));if(c){var e=b.PrevInAEL;this.DoMaxima(b);b=null===e?this.m_ActiveEdges:e.NextInAEL}else{this.IsIntermediate(b,a)&&d.ClipperBase.IsHorizontal(b.NextInLML)?(b=this.UpdateEdgeIntoAEL(b),0<=b.OutIdx&&this.AddOutPt(b,b.Bot),this.AddEdgeToSEL(b)):(b.Curr.X=d.Clipper.TopX(b,a),b.Curr.Y=a);if(this.StrictlySimple&&(e=b.PrevInAEL,0<=b.OutIdx&&0!==b.WindDelta&&
null!==e&&0<=e.OutIdx&&e.Curr.X==b.Curr.X&&0!==e.WindDelta)){var f=new d.IntPoint(b.Curr);d.use_xyz&&this.SetZ(f,e,b);c=this.AddOutPt(e,f);e=this.AddOutPt(b,f);this.AddJoin(c,e,f)}b=b.NextInAEL}}this.ProcessHorizontals(!0);for(b=this.m_ActiveEdges;null!==b;)this.IsIntermediate(b,a)&&(c=null,0<=b.OutIdx&&(c=this.AddOutPt(b,b.Top)),b=this.UpdateEdgeIntoAEL(b),e=b.PrevInAEL,f=b.NextInAEL,null!==e&&e.Curr.X==b.Bot.X&&e.Curr.Y==b.Bot.Y&&null!==c&&0<=e.OutIdx&&e.Curr.Y>e.Top.Y&&d.ClipperBase.SlopesEqual(b,
e,this.m_UseFullRange)&&0!==b.WindDelta&&0!==e.WindDelta?(e=this.AddOutPt(e,b.Bot),this.AddJoin(c,e,b.Top)):null!==f&&f.Curr.X==b.Bot.X&&f.Curr.Y==b.Bot.Y&&null!==c&&0<=f.OutIdx&&f.Curr.Y>f.Top.Y&&d.ClipperBase.SlopesEqual(b,f,this.m_UseFullRange)&&0!==b.WindDelta&&0!==f.WindDelta&&(e=this.AddOutPt(f,b.Bot),this.AddJoin(c,e,b.Top))),b=b.NextInAEL};d.Clipper.prototype.DoMaxima=function(a){var b=this.GetMaximaPair(a);if(null===b)0<=a.OutIdx&&this.AddOutPt(a,a.Top),this.DeleteFromAEL(a);else{for(var c=
a.NextInAEL;null!==c&&c!=b;)this.IntersectEdges(a,c,a.Top),this.SwapPositionsInAEL(a,c),c=a.NextInAEL;-1==a.OutIdx&&-1==b.OutIdx?(this.DeleteFromAEL(a),this.DeleteFromAEL(b)):0<=a.OutIdx&&0<=b.OutIdx?(0<=a.OutIdx&&this.AddLocalMaxPoly(a,b,a.Top),this.DeleteFromAEL(a),this.DeleteFromAEL(b)):d.use_lines&&0===a.WindDelta?(0<=a.OutIdx&&(this.AddOutPt(a,a.Top),a.OutIdx=-1),this.DeleteFromAEL(a),0<=b.OutIdx&&(this.AddOutPt(b,a.Top),b.OutIdx=-1),this.DeleteFromAEL(b)):d.Error("DoMaxima error")}};d.Clipper.ReversePaths=
function(a){for(var b=0,c=a.length;b<c;b++)a[b].reverse()};d.Clipper.Orientation=function(a){return 0<=d.Clipper.Area(a)};d.Clipper.prototype.PointCount=function(a){if(null===a)return 0;var b=0,c=a;do b++,c=c.Next;while(c!=a);return b};d.Clipper.prototype.BuildResult=function(a){d.Clear(a);for(var b=0,c=this.m_PolyOuts.length;b<c;b++){var e=this.m_PolyOuts[b];if(null!==e.Pts){var e=e.Pts.Prev,f=this.PointCount(e);if(!(2>f)){for(var g=Array(f),h=0;h<f;h++)g[h]=e.Pt,e=e.Prev;a.push(g)}}}};d.Clipper.prototype.BuildResult2=
function(a){a.Clear();for(var b=0,c=this.m_PolyOuts.length;b<c;b++){var e=this.m_PolyOuts[b],f=this.PointCount(e.Pts);if(!(e.IsOpen&&2>f||!e.IsOpen&&3>f)){this.FixHoleLinkage(e);var g=new d.PolyNode;a.m_AllPolys.push(g);e.PolyNode=g;g.m_polygon.length=f;for(var e=e.Pts.Prev,h=0;h<f;h++)g.m_polygon[h]=e.Pt,e=e.Prev}}b=0;for(c=this.m_PolyOuts.length;b<c;b++)e=this.m_PolyOuts[b],null!==e.PolyNode&&(e.IsOpen?(e.PolyNode.IsOpen=!0,a.AddChild(e.PolyNode)):null!==e.FirstLeft&&null!=e.FirstLeft.PolyNode?
e.FirstLeft.PolyNode.AddChild(e.PolyNode):a.AddChild(e.PolyNode))};d.Clipper.prototype.FixupOutPolygon=function(a){var b=null;a.BottomPt=null;for(var c=a.Pts;;){if(c.Prev==c||c.Prev==c.Next){a.Pts=null;return}if(d.IntPoint.op_Equality(c.Pt,c.Next.Pt)||d.IntPoint.op_Equality(c.Pt,c.Prev.Pt)||d.ClipperBase.SlopesEqual(c.Prev.Pt,c.Pt,c.Next.Pt,this.m_UseFullRange)&&(!this.PreserveCollinear||!this.Pt2IsBetweenPt1AndPt3(c.Prev.Pt,c.Pt,c.Next.Pt)))b=null,c.Prev.Next=c.Next,c=c.Next.Prev=c.Prev;else if(c==
b)break;else null===b&&(b=c),c=c.Next}a.Pts=c};d.Clipper.prototype.DupOutPt=function(a,b){var c=new d.OutPt;c.Pt.X=a.Pt.X;c.Pt.Y=a.Pt.Y;d.use_xyz&&(c.Pt.Z=a.Pt.Z);c.Idx=a.Idx;b?(c.Next=a.Next,c.Prev=a,a.Next.Prev=c,a.Next=c):(c.Prev=a.Prev,c.Next=a,a.Prev.Next=c,a.Prev=c);return c};d.Clipper.prototype.GetOverlap=function(a,b,c,d,f){a<b?c<d?(f.Left=Math.max(a,c),f.Right=Math.min(b,d)):(f.Left=Math.max(a,d),f.Right=Math.min(b,c)):c<d?(f.Left=Math.max(b,c),f.Right=Math.min(a,d)):(f.Left=Math.max(b,d),
f.Right=Math.min(a,c));return f.Left<f.Right};d.Clipper.prototype.JoinHorz=function(a,b,c,e,f,g){var h=a.Pt.X>b.Pt.X?d.Direction.dRightToLeft:d.Direction.dLeftToRight;e=c.Pt.X>e.Pt.X?d.Direction.dRightToLeft:d.Direction.dLeftToRight;if(h==e)return!1;if(h==d.Direction.dLeftToRight){for(;a.Next.Pt.X<=f.X&&a.Next.Pt.X>=a.Pt.X&&a.Next.Pt.Y==f.Y;)a=a.Next;g&&a.Pt.X!=f.X&&(a=a.Next);b=this.DupOutPt(a,!g);d.IntPoint.op_Inequality(b.Pt,f)&&(a=b,a.Pt.X=f.X,a.Pt.Y=f.Y,d.use_xyz&&(a.Pt.Z=f.Z),b=this.DupOutPt(a,
!g))}else{for(;a.Next.Pt.X>=f.X&&a.Next.Pt.X<=a.Pt.X&&a.Next.Pt.Y==f.Y;)a=a.Next;g||a.Pt.X==f.X||(a=a.Next);b=this.DupOutPt(a,g);d.IntPoint.op_Inequality(b.Pt,f)&&(a=b,a.Pt.X=f.X,a.Pt.Y=f.Y,d.use_xyz&&(a.Pt.Z=f.Z),b=this.DupOutPt(a,g))}if(e==d.Direction.dLeftToRight){for(;c.Next.Pt.X<=f.X&&c.Next.Pt.X>=c.Pt.X&&c.Next.Pt.Y==f.Y;)c=c.Next;g&&c.Pt.X!=f.X&&(c=c.Next);e=this.DupOutPt(c,!g);d.IntPoint.op_Inequality(e.Pt,f)&&(c=e,c.Pt.X=f.X,c.Pt.Y=f.Y,d.use_xyz&&(c.Pt.Z=f.Z),e=this.DupOutPt(c,!g))}else{for(;c.Next.Pt.X>=
f.X&&c.Next.Pt.X<=c.Pt.X&&c.Next.Pt.Y==f.Y;)c=c.Next;g||c.Pt.X==f.X||(c=c.Next);e=this.DupOutPt(c,g);d.IntPoint.op_Inequality(e.Pt,f)&&(c=e,c.Pt.X=f.X,c.Pt.Y=f.Y,d.use_xyz&&(c.Pt.Z=f.Z),e=this.DupOutPt(c,g))}h==d.Direction.dLeftToRight==g?(a.Prev=c,c.Next=a,b.Next=e,e.Prev=b):(a.Next=c,c.Prev=a,b.Prev=e,e.Next=b);return!0};d.Clipper.prototype.JoinPoints=function(a,b,c){var e=a.OutPt1,f;new d.OutPt;var g=a.OutPt2,h;new d.OutPt;if((h=a.OutPt1.Pt.Y==a.OffPt.Y)&&d.IntPoint.op_Equality(a.OffPt,a.OutPt1.Pt)&&
d.IntPoint.op_Equality(a.OffPt,a.OutPt2.Pt)){if(b!=c)return!1;for(f=a.OutPt1.Next;f!=e&&d.IntPoint.op_Equality(f.Pt,a.OffPt);)f=f.Next;f=f.Pt.Y>a.OffPt.Y;for(h=a.OutPt2.Next;h!=g&&d.IntPoint.op_Equality(h.Pt,a.OffPt);)h=h.Next;if(f==h.Pt.Y>a.OffPt.Y)return!1;f?(f=this.DupOutPt(e,!1),h=this.DupOutPt(g,!0),e.Prev=g,g.Next=e,f.Next=h,h.Prev=f):(f=this.DupOutPt(e,!0),h=this.DupOutPt(g,!1),e.Next=g,g.Prev=e,f.Prev=h,h.Next=f);a.OutPt1=e;a.OutPt2=f;return!0}if(h){for(f=e;e.Prev.Pt.Y==e.Pt.Y&&e.Prev!=f&&
e.Prev!=g;)e=e.Prev;for(;f.Next.Pt.Y==f.Pt.Y&&f.Next!=e&&f.Next!=g;)f=f.Next;if(f.Next==e||f.Next==g)return!1;for(h=g;g.Prev.Pt.Y==g.Pt.Y&&g.Prev!=h&&g.Prev!=f;)g=g.Prev;for(;h.Next.Pt.Y==h.Pt.Y&&h.Next!=g&&h.Next!=e;)h=h.Next;if(h.Next==g||h.Next==e)return!1;c={Left:null,Right:null};if(!this.GetOverlap(e.Pt.X,f.Pt.X,g.Pt.X,h.Pt.X,c))return!1;b=c.Left;var l=c.Right;c=new d.IntPoint;e.Pt.X>=b&&e.Pt.X<=l?(c.X=e.Pt.X,c.Y=e.Pt.Y,d.use_xyz&&(c.Z=e.Pt.Z),b=e.Pt.X>f.Pt.X):g.Pt.X>=b&&g.Pt.X<=l?(c.X=g.Pt.X,
c.Y=g.Pt.Y,d.use_xyz&&(c.Z=g.Pt.Z),b=g.Pt.X>h.Pt.X):f.Pt.X>=b&&f.Pt.X<=l?(c.X=f.Pt.X,c.Y=f.Pt.Y,d.use_xyz&&(c.Z=f.Pt.Z),b=f.Pt.X>e.Pt.X):(c.X=h.Pt.X,c.Y=h.Pt.Y,d.use_xyz&&(c.Z=h.Pt.Z),b=h.Pt.X>g.Pt.X);a.OutPt1=e;a.OutPt2=g;return this.JoinHorz(e,f,g,h,c,b)}for(f=e.Next;d.IntPoint.op_Equality(f.Pt,e.Pt)&&f!=e;)f=f.Next;if(l=f.Pt.Y>e.Pt.Y||!d.ClipperBase.SlopesEqual(e.Pt,f.Pt,a.OffPt,this.m_UseFullRange)){for(f=e.Prev;d.IntPoint.op_Equality(f.Pt,e.Pt)&&f!=e;)f=f.Prev;if(f.Pt.Y>e.Pt.Y||!d.ClipperBase.SlopesEqual(e.Pt,
f.Pt,a.OffPt,this.m_UseFullRange))return!1}for(h=g.Next;d.IntPoint.op_Equality(h.Pt,g.Pt)&&h!=g;)h=h.Next;var k=h.Pt.Y>g.Pt.Y||!d.ClipperBase.SlopesEqual(g.Pt,h.Pt,a.OffPt,this.m_UseFullRange);if(k){for(h=g.Prev;d.IntPoint.op_Equality(h.Pt,g.Pt)&&h!=g;)h=h.Prev;if(h.Pt.Y>g.Pt.Y||!d.ClipperBase.SlopesEqual(g.Pt,h.Pt,a.OffPt,this.m_UseFullRange))return!1}if(f==e||h==g||f==h||b==c&&l==k)return!1;l?(f=this.DupOutPt(e,!1),h=this.DupOutPt(g,!0),e.Prev=g,g.Next=e,f.Next=h,h.Prev=f):(f=this.DupOutPt(e,!0),
h=this.DupOutPt(g,!1),e.Next=g,g.Prev=e,f.Prev=h,h.Next=f);a.OutPt1=e;a.OutPt2=f;return!0};d.Clipper.GetBounds=function(a){for(var b=0,c=a.length;b<c&&0==a[b].length;)b++;if(b==c)return new d.IntRect(0,0,0,0);var e=new d.IntRect;e.left=a[b][0].X;e.right=e.left;e.top=a[b][0].Y;for(e.bottom=e.top;b<c;b++)for(var f=0,g=a[b].length;f<g;f++)a[b][f].X<e.left?e.left=a[b][f].X:a[b][f].X>e.right&&(e.right=a[b][f].X),a[b][f].Y<e.top?e.top=a[b][f].Y:a[b][f].Y>e.bottom&&(e.bottom=a[b][f].Y);return e};d.Clipper.prototype.GetBounds2=
function(a){var b=a,c=new d.IntRect;c.left=a.Pt.X;c.right=a.Pt.X;c.top=a.Pt.Y;c.bottom=a.Pt.Y;for(a=a.Next;a!=b;)a.Pt.X<c.left&&(c.left=a.Pt.X),a.Pt.X>c.right&&(c.right=a.Pt.X),a.Pt.Y<c.top&&(c.top=a.Pt.Y),a.Pt.Y>c.bottom&&(c.bottom=a.Pt.Y),a=a.Next;return c};d.Clipper.PointInPolygon=function(a,b){var c=0,d=b.length;if(3>d)return 0;for(var f=b[0],g=1;g<=d;++g){var h=g==d?b[0]:b[g];if(h.Y==a.Y&&(h.X==a.X||f.Y==a.Y&&h.X>a.X==f.X<a.X))return-1;if(f.Y<a.Y!=h.Y<a.Y)if(f.X>=a.X)if(h.X>a.X)c=1-c;else{var l=
(f.X-a.X)*(h.Y-a.Y)-(h.X-a.X)*(f.Y-a.Y);if(0==l)return-1;0<l==h.Y>f.Y&&(c=1-c)}else if(h.X>a.X){l=(f.X-a.X)*(h.Y-a.Y)-(h.X-a.X)*(f.Y-a.Y);if(0==l)return-1;0<l==h.Y>f.Y&&(c=1-c)}f=h}return c};d.Clipper.prototype.PointInPolygon=function(a,b){var c=0,d=b,f=a.X,g=a.Y,h=b.Pt.X,l=b.Pt.Y;do{b=b.Next;var k=b.Pt.X,n=b.Pt.Y;if(n==g&&(k==f||l==g&&k>f==h<f))return-1;if(l<g!=n<g)if(h>=f)if(k>f)c=1-c;else{h=(h-f)*(n-g)-(k-f)*(l-g);if(0==h)return-1;0<h==n>l&&(c=1-c)}else if(k>f){h=(h-f)*(n-g)-(k-f)*(l-g);if(0==
h)return-1;0<h==n>l&&(c=1-c)}h=k;l=n}while(d!=b);return c};d.Clipper.prototype.Poly2ContainsPoly1=function(a,b){var c=a;do{var d=this.PointInPolygon(c.Pt,b);if(0<=d)return 0<d;c=c.Next}while(c!=a);return!0};d.Clipper.prototype.FixupFirstLefts1=function(a,b){for(var c=0,d=this.m_PolyOuts.length;c<d;c++){var f=this.m_PolyOuts[c];null!=f.Pts&&null!=f.FirstLeft&&this.ParseFirstLeft(f.FirstLeft)==a&&this.Poly2ContainsPoly1(f.Pts,b.Pts)&&(f.FirstLeft=b)}};d.Clipper.prototype.FixupFirstLefts2=function(a,
b){for(var c=0,d=this.m_PolyOuts,f=d.length,g=d[c];c<f;c++,g=d[c])g.FirstLeft==a&&(g.FirstLeft=b)};d.Clipper.ParseFirstLeft=function(a){for(;null!=a&&null==a.Pts;)a=a.FirstLeft;return a};d.Clipper.prototype.JoinCommonEdges=function(){for(var a=0,b=this.m_Joins.length;a<b;a++){var c=this.m_Joins[a],e=this.GetOutRec(c.OutPt1.Idx),f=this.GetOutRec(c.OutPt2.Idx);if(null!=e.Pts&&null!=f.Pts){var g;g=e==f?e:this.Param1RightOfParam2(e,f)?f:this.Param1RightOfParam2(f,e)?e:this.GetLowermostRec(e,f);if(this.JoinPoints(c,
e,f))if(e==f){e.Pts=c.OutPt1;e.BottomPt=null;f=this.CreateOutRec();f.Pts=c.OutPt2;this.UpdateOutPtIdxs(f);if(this.m_UsingPolyTree){g=0;for(var h=this.m_PolyOuts.length;g<h-1;g++){var l=this.m_PolyOuts[g];null!=l.Pts&&d.Clipper.ParseFirstLeft(l.FirstLeft)==e&&l.IsHole!=e.IsHole&&this.Poly2ContainsPoly1(l.Pts,c.OutPt2)&&(l.FirstLeft=f)}}this.Poly2ContainsPoly1(f.Pts,e.Pts)?(f.IsHole=!e.IsHole,f.FirstLeft=e,this.m_UsingPolyTree&&this.FixupFirstLefts2(f,e),(f.IsHole^this.ReverseSolution)==0<this.Area(f)&&
this.ReversePolyPtLinks(f.Pts)):this.Poly2ContainsPoly1(e.Pts,f.Pts)?(f.IsHole=e.IsHole,e.IsHole=!f.IsHole,f.FirstLeft=e.FirstLeft,e.FirstLeft=f,this.m_UsingPolyTree&&this.FixupFirstLefts2(e,f),(e.IsHole^this.ReverseSolution)==0<this.Area(e)&&this.ReversePolyPtLinks(e.Pts)):(f.IsHole=e.IsHole,f.FirstLeft=e.FirstLeft,this.m_UsingPolyTree&&this.FixupFirstLefts1(e,f))}else f.Pts=null,f.BottomPt=null,f.Idx=e.Idx,e.IsHole=g.IsHole,g==f&&(e.FirstLeft=f.FirstLeft),f.FirstLeft=e,this.m_UsingPolyTree&&this.FixupFirstLefts2(f,
e)}}};d.Clipper.prototype.UpdateOutPtIdxs=function(a){var b=a.Pts;do b.Idx=a.Idx,b=b.Prev;while(b!=a.Pts)};d.Clipper.prototype.DoSimplePolygons=function(){for(var a=0;a<this.m_PolyOuts.length;){var b=this.m_PolyOuts[a++],c=b.Pts;if(null!=c&&!b.IsOpen){do{for(var e=c.Next;e!=b.Pts;){if(d.IntPoint.op_Equality(c.Pt,e.Pt)&&e.Next!=c&&e.Prev!=c){var f=c.Prev,g=e.Prev;c.Prev=g;g.Next=c;e.Prev=f;f.Next=e;b.Pts=c;f=this.CreateOutRec();f.Pts=e;this.UpdateOutPtIdxs(f);this.Poly2ContainsPoly1(f.Pts,b.Pts)?(f.IsHole=
!b.IsHole,f.FirstLeft=b,this.m_UsingPolyTree&&this.FixupFirstLefts2(f,b)):this.Poly2ContainsPoly1(b.Pts,f.Pts)?(f.IsHole=b.IsHole,b.IsHole=!f.IsHole,f.FirstLeft=b.FirstLeft,b.FirstLeft=f,this.m_UsingPolyTree&&this.FixupFirstLefts2(b,f)):(f.IsHole=b.IsHole,f.FirstLeft=b.FirstLeft,this.m_UsingPolyTree&&this.FixupFirstLefts1(b,f));e=c}e=e.Next}c=c.Next}while(c!=b.Pts)}}};d.Clipper.Area=function(a){var b=a.length;if(3>b)return 0;for(var c=0,d=0,f=b-1;d<b;++d)c+=(a[f].X+a[d].X)*(a[f].Y-a[d].Y),f=d;return.5*
-c};d.Clipper.prototype.Area=function(a){var b=a.Pts;if(null==b)return 0;var c=0;do c+=(b.Prev.Pt.X+b.Pt.X)*(b.Prev.Pt.Y-b.Pt.Y),b=b.Next;while(b!=a.Pts);return.5*c};d.Clipper.SimplifyPolygon=function(a,b){var c=[],e=new d.Clipper(0);e.StrictlySimple=!0;e.AddPath(a,d.PolyType.ptSubject,!0);e.Execute(d.ClipType.ctUnion,c,b,b);return c};d.Clipper.SimplifyPolygons=function(a,b){"undefined"==typeof b&&(b=d.PolyFillType.pftEvenOdd);var c=[],e=new d.Clipper(0);e.StrictlySimple=!0;e.AddPaths(a,d.PolyType.ptSubject,
!0);e.Execute(d.ClipType.ctUnion,c,b,b);return c};d.Clipper.DistanceSqrd=function(a,b){var c=a.X-b.X,d=a.Y-b.Y;return c*c+d*d};d.Clipper.DistanceFromLineSqrd=function(a,b,c){var d=b.Y-c.Y;c=c.X-b.X;b=d*b.X+c*b.Y;b=d*a.X+c*a.Y-b;return b*b/(d*d+c*c)};d.Clipper.SlopesNearCollinear=function(a,b,c,e){return Math.abs(a.X-b.X)>Math.abs(a.Y-b.Y)?a.X>b.X==a.X<c.X?d.Clipper.DistanceFromLineSqrd(a,b,c)<e:b.X>a.X==b.X<c.X?d.Clipper.DistanceFromLineSqrd(b,a,c)<e:d.Clipper.DistanceFromLineSqrd(c,a,b)<e:a.Y>b.Y==
a.Y<c.Y?d.Clipper.DistanceFromLineSqrd(a,b,c)<e:b.Y>a.Y==b.Y<c.Y?d.Clipper.DistanceFromLineSqrd(b,a,c)<e:d.Clipper.DistanceFromLineSqrd(c,a,b)<e};d.Clipper.PointsAreClose=function(a,b,c){var d=a.X-b.X;a=a.Y-b.Y;return d*d+a*a<=c};d.Clipper.ExcludeOp=function(a){var b=a.Prev;b.Next=a.Next;a.Next.Prev=b;b.Idx=0;return b};d.Clipper.CleanPolygon=function(a,b){"undefined"==typeof b&&(b=1.415);var c=a.length;if(0==c)return[];for(var e=Array(c),f=0;f<c;++f)e[f]=new d.OutPt;for(f=0;f<c;++f)e[f].Pt=a[f],e[f].Next=
e[(f+1)%c],e[f].Next.Prev=e[f],e[f].Idx=0;f=b*b;for(e=e[0];0==e.Idx&&e.Next!=e.Prev;)d.Clipper.PointsAreClose(e.Pt,e.Prev.Pt,f)?(e=d.Clipper.ExcludeOp(e),c--):d.Clipper.PointsAreClose(e.Prev.Pt,e.Next.Pt,f)?(d.Clipper.ExcludeOp(e.Next),e=d.Clipper.ExcludeOp(e),c-=2):d.Clipper.SlopesNearCollinear(e.Prev.Pt,e.Pt,e.Next.Pt,f)?(e=d.Clipper.ExcludeOp(e),c--):(e.Idx=1,e=e.Next);3>c&&(c=0);for(var g=Array(c),f=0;f<c;++f)g[f]=new d.IntPoint(e.Pt),e=e.Next;return g};d.Clipper.CleanPolygons=function(a,b){for(var c=
Array(a.length),e=0,f=a.length;e<f;e++)c[e]=d.Clipper.CleanPolygon(a[e],b);return c};d.Clipper.Minkowski=function(a,b,c,e){e=e?1:0;var f=a.length,g=b.length,h=[];if(c)for(c=0;c<g;c++){for(var l=Array(f),k=0,n=a.length,p=a[k];k<n;k++,p=a[k])l[k]=new d.IntPoint(b[c].X+p.X,b[c].Y+p.Y);h.push(l)}else for(c=0;c<g;c++){l=Array(f);k=0;n=a.length;for(p=a[k];k<n;k++,p=a[k])l[k]=new d.IntPoint(b[c].X-p.X,b[c].Y-p.Y);h.push(l)}a=[];for(c=0;c<g-1+e;c++)for(k=0;k<f;k++)b=[],b.push(h[c%g][k%f]),b.push(h[(c+1)%
g][k%f]),b.push(h[(c+1)%g][(k+1)%f]),b.push(h[c%g][(k+1)%f]),d.Clipper.Orientation(b)||b.reverse(),a.push(b);return a};d.Clipper.MinkowskiSum=function(a,b,c){if(b[0]instanceof Array){h=b;b=new d.Paths;for(var e=new d.Clipper,f=0;f<h.length;++f){var g=d.Clipper.Minkowski(a,h[f],!0,c);e.AddPaths(g,d.PolyType.ptSubject,!0);c&&(g=d.Clipper.TranslatePath(h[f],a[0]),e.AddPath(g,d.PolyType.ptClip,!0))}e.Execute(d.ClipType.ctUnion,b,d.PolyFillType.pftNonZero,d.PolyFillType.pftNonZero);return b}var h=d.Clipper.Minkowski(a,
b,!0,c),e=new d.Clipper;e.AddPaths(h,d.PolyType.ptSubject,!0);e.Execute(d.ClipType.ctUnion,h,d.PolyFillType.pftNonZero,d.PolyFillType.pftNonZero);return h};d.Clipper.TranslatePath=function(a,b){for(var c=new d.Path,e=0;e<a.length;e++)c.push(new d.IntPoint(a[e].X+b.X,a[e].Y+b.Y));return c};d.Clipper.MinkowskiDiff=function(a,b){var c=d.Clipper.Minkowski(a,b,!1,!0),e=new d.Clipper;e.AddPaths(c,d.PolyType.ptSubject,!0);e.Execute(d.ClipType.ctUnion,c,d.PolyFillType.pftNonZero,d.PolyFillType.pftNonZero);
return c};d.Clipper.PolyTreeToPaths=function(a){var b=[];d.Clipper.AddPolyNodeToPaths(a,d.Clipper.NodeType.ntAny,b);return b};d.Clipper.AddPolyNodeToPaths=function(a,b,c){var e=!0;switch(b){case d.Clipper.NodeType.ntOpen:return;case d.Clipper.NodeType.ntClosed:e=!a.IsOpen}0<a.m_polygon.length&&e&&c.push(a.m_polygon);e=0;a=a.Childs();for(var f=a.length,g=a[e];e<f;e++,g=a[e])d.Clipper.AddPolyNodeToPaths(g,b,c)};d.Clipper.OpenPathsFromPolyTree=function(a){for(var b=new d.Paths,c=0,e=a.ChildCount();c<
e;c++)a.Childs()[c].IsOpen&&b.push(a.Childs()[c].m_polygon);return b};d.Clipper.ClosedPathsFromPolyTree=function(a){var b=new d.Paths;d.Clipper.AddPolyNodeToPaths(a,d.Clipper.NodeType.ntClosed,b);return b};q(d.Clipper,d.ClipperBase);d.Clipper.NodeType={ntAny:0,ntOpen:1,ntClosed:2};d.ClipperOffset=function(a,b){"undefined"==typeof a&&(a=2);"undefined"==typeof b&&(b=d.ClipperOffset.def_arc_tolerance);this.m_destPolys=new d.Paths;this.m_srcPoly=new d.Path;this.m_destPoly=new d.Path;this.m_normals=[];
this.m_StepsPerRad=this.m_miterLim=this.m_cos=this.m_sin=this.m_sinA=this.m_delta=0;this.m_lowest=new d.IntPoint;this.m_polyNodes=new d.PolyNode;this.MiterLimit=a;this.ArcTolerance=b;this.m_lowest.X=-1};d.ClipperOffset.two_pi=6.28318530717959;d.ClipperOffset.def_arc_tolerance=.25;d.ClipperOffset.prototype.Clear=function(){d.Clear(this.m_polyNodes.Childs());this.m_lowest.X=-1};d.ClipperOffset.Round=d.Clipper.Round;d.ClipperOffset.prototype.AddPath=function(a,b,c){var e=a.length-1;if(!(0>e)){var f=
new d.PolyNode;f.m_jointype=b;f.m_endtype=c;if(c==d.EndType.etClosedLine||c==d.EndType.etClosedPolygon)for(;0<e&&d.IntPoint.op_Equality(a[0],a[e]);)e--;f.m_polygon.push(a[0]);var g=0;b=0;for(var h=1;h<=e;h++)d.IntPoint.op_Inequality(f.m_polygon[g],a[h])&&(g++,f.m_polygon.push(a[h]),a[h].Y>f.m_polygon[b].Y||a[h].Y==f.m_polygon[b].Y&&a[h].X<f.m_polygon[b].X)&&(b=g);if(!(c==d.EndType.etClosedPolygon&&2>g)&&(this.m_polyNodes.AddChild(f),c==d.EndType.etClosedPolygon))if(0>this.m_lowest.X)this.m_lowest=
new d.IntPoint(this.m_polyNodes.ChildCount()-1,b);else if(a=this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon[this.m_lowest.Y],f.m_polygon[b].Y>a.Y||f.m_polygon[b].Y==a.Y&&f.m_polygon[b].X<a.X)this.m_lowest=new d.IntPoint(this.m_polyNodes.ChildCount()-1,b)}};d.ClipperOffset.prototype.AddPaths=function(a,b,c){for(var d=0,f=a.length;d<f;d++)this.AddPath(a[d],b,c)};d.ClipperOffset.prototype.FixOrientations=function(){if(0<=this.m_lowest.X&&!d.Clipper.Orientation(this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon))for(var a=
0;a<this.m_polyNodes.ChildCount();a++){var b=this.m_polyNodes.Childs()[a];(b.m_endtype==d.EndType.etClosedPolygon||b.m_endtype==d.EndType.etClosedLine&&d.Clipper.Orientation(b.m_polygon))&&b.m_polygon.reverse()}else for(a=0;a<this.m_polyNodes.ChildCount();a++)b=this.m_polyNodes.Childs()[a],b.m_endtype!=d.EndType.etClosedLine||d.Clipper.Orientation(b.m_polygon)||b.m_polygon.reverse()};d.ClipperOffset.GetUnitNormal=function(a,b){var c=b.X-a.X,e=b.Y-a.Y;if(0==c&&0==e)return new d.DoublePoint(0,0);var f=
1/Math.sqrt(c*c+e*e);return new d.DoublePoint(e*f,-(c*f))};d.ClipperOffset.prototype.DoOffset=function(a){this.m_destPolys=[];this.m_delta=a;if(d.ClipperBase.near_zero(a))for(var b=0;b<this.m_polyNodes.ChildCount();b++){var c=this.m_polyNodes.Childs()[b];c.m_endtype==d.EndType.etClosedPolygon&&this.m_destPolys.push(c.m_polygon)}else{this.m_miterLim=2<this.MiterLimit?2/(this.MiterLimit*this.MiterLimit):.5;var e=3.14159265358979/Math.acos(1-(0>=this.ArcTolerance?d.ClipperOffset.def_arc_tolerance:this.ArcTolerance>
Math.abs(a)*d.ClipperOffset.def_arc_tolerance?Math.abs(a)*d.ClipperOffset.def_arc_tolerance:this.ArcTolerance)/Math.abs(a));this.m_sin=Math.sin(d.ClipperOffset.two_pi/e);this.m_cos=Math.cos(d.ClipperOffset.two_pi/e);this.m_StepsPerRad=e/d.ClipperOffset.two_pi;0>a&&(this.m_sin=-this.m_sin);for(b=0;b<this.m_polyNodes.ChildCount();b++){c=this.m_polyNodes.Childs()[b];this.m_srcPoly=c.m_polygon;var f=this.m_srcPoly.length;if(!(0==f||0>=a&&(3>f||c.m_endtype!=d.EndType.etClosedPolygon))){this.m_destPoly=
[];if(1==f)if(c.m_jointype==d.JoinType.jtRound)for(var c=1,f=0,g=1;g<=e;g++){this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[0].X+c*a),d.ClipperOffset.Round(this.m_srcPoly[0].Y+f*a)));var h=c,c=c*this.m_cos-this.m_sin*f,f=h*this.m_sin+f*this.m_cos}else for(f=c=-1,g=0;4>g;++g)this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[0].X+c*a),d.ClipperOffset.Round(this.m_srcPoly[0].Y+f*a))),0>c?c=1:0>f?f=1:c=-1;else{for(g=this.m_normals.length=0;g<f-1;g++)this.m_normals.push(d.ClipperOffset.GetUnitNormal(this.m_srcPoly[g],
this.m_srcPoly[g+1]));c.m_endtype==d.EndType.etClosedLine||c.m_endtype==d.EndType.etClosedPolygon?this.m_normals.push(d.ClipperOffset.GetUnitNormal(this.m_srcPoly[f-1],this.m_srcPoly[0])):this.m_normals.push(new d.DoublePoint(this.m_normals[f-2]));if(c.m_endtype==d.EndType.etClosedPolygon)for(h=f-1,g=0;g<f;g++)h=this.OffsetPoint(g,h,c.m_jointype);else if(c.m_endtype==d.EndType.etClosedLine){h=f-1;for(g=0;g<f;g++)h=this.OffsetPoint(g,h,c.m_jointype);this.m_destPolys.push(this.m_destPoly);this.m_destPoly=
[];h=this.m_normals[f-1];for(g=f-1;0<g;g--)this.m_normals[g]=new d.DoublePoint(-this.m_normals[g-1].X,-this.m_normals[g-1].Y);this.m_normals[0]=new d.DoublePoint(-h.X,-h.Y);h=0;for(g=f-1;0<=g;g--)h=this.OffsetPoint(g,h,c.m_jointype)}else{h=0;for(g=1;g<f-1;++g)h=this.OffsetPoint(g,h,c.m_jointype);c.m_endtype==d.EndType.etOpenButt?(g=f-1,h=new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[g].X+this.m_normals[g].X*a),d.ClipperOffset.Round(this.m_srcPoly[g].Y+this.m_normals[g].Y*a)),this.m_destPoly.push(h),
h=new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[g].X-this.m_normals[g].X*a),d.ClipperOffset.Round(this.m_srcPoly[g].Y-this.m_normals[g].Y*a)),this.m_destPoly.push(h)):(g=f-1,h=f-2,this.m_sinA=0,this.m_normals[g]=new d.DoublePoint(-this.m_normals[g].X,-this.m_normals[g].Y),c.m_endtype==d.EndType.etOpenSquare?this.DoSquare(g,h):this.DoRound(g,h));for(g=f-1;0<g;g--)this.m_normals[g]=new d.DoublePoint(-this.m_normals[g-1].X,-this.m_normals[g-1].Y);this.m_normals[0]=new d.DoublePoint(-this.m_normals[1].X,
-this.m_normals[1].Y);h=f-1;for(g=h-1;0<g;--g)h=this.OffsetPoint(g,h,c.m_jointype);c.m_endtype==d.EndType.etOpenButt?(h=new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[0].X-this.m_normals[0].X*a),d.ClipperOffset.Round(this.m_srcPoly[0].Y-this.m_normals[0].Y*a)),this.m_destPoly.push(h),h=new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[0].X+this.m_normals[0].X*a),d.ClipperOffset.Round(this.m_srcPoly[0].Y+this.m_normals[0].Y*a)),this.m_destPoly.push(h)):(this.m_sinA=0,c.m_endtype==d.EndType.etOpenSquare?
this.DoSquare(0,1):this.DoRound(0,1))}}this.m_destPolys.push(this.m_destPoly)}}}};d.ClipperOffset.prototype.Execute=function(){var a=arguments;if(a[0]instanceof d.PolyTree)if(b=a[0],c=a[1],b.Clear(),this.FixOrientations(),this.DoOffset(c),a=new d.Clipper(0),a.AddPaths(this.m_destPolys,d.PolyType.ptSubject,!0),0<c)a.Execute(d.ClipType.ctUnion,b,d.PolyFillType.pftPositive,d.PolyFillType.pftPositive);else if(c=d.Clipper.GetBounds(this.m_destPolys),e=new d.Path,e.push(new d.IntPoint(c.left-10,c.bottom+
10)),e.push(new d.IntPoint(c.right+10,c.bottom+10)),e.push(new d.IntPoint(c.right+10,c.top-10)),e.push(new d.IntPoint(c.left-10,c.top-10)),a.AddPath(e,d.PolyType.ptSubject,!0),a.ReverseSolution=!0,a.Execute(d.ClipType.ctUnion,b,d.PolyFillType.pftNegative,d.PolyFillType.pftNegative),1==b.ChildCount()&&0<b.Childs()[0].ChildCount())for(a=b.Childs()[0],b.Childs()[0]=a.Childs()[0],b.Childs()[0].m_Parent=b,c=1;c<a.ChildCount();c++)b.AddChild(a.Childs()[c]);else b.Clear();else{var b=a[0],c=a[1];d.Clear(b);
this.FixOrientations();this.DoOffset(c);a=new d.Clipper(0);a.AddPaths(this.m_destPolys,d.PolyType.ptSubject,!0);if(0<c)a.Execute(d.ClipType.ctUnion,b,d.PolyFillType.pftPositive,d.PolyFillType.pftPositive);else{var c=d.Clipper.GetBounds(this.m_destPolys),e=new d.Path;e.push(new d.IntPoint(c.left-10,c.bottom+10));e.push(new d.IntPoint(c.right+10,c.bottom+10));e.push(new d.IntPoint(c.right+10,c.top-10));e.push(new d.IntPoint(c.left-10,c.top-10));a.AddPath(e,d.PolyType.ptSubject,!0);a.ReverseSolution=
!0;a.Execute(d.ClipType.ctUnion,b,d.PolyFillType.pftNegative,d.PolyFillType.pftNegative);0<b.length&&b.splice(0,1)}}};d.ClipperOffset.prototype.OffsetPoint=function(a,b,c){this.m_sinA=this.m_normals[b].X*this.m_normals[a].Y-this.m_normals[a].X*this.m_normals[b].Y;if(1>Math.abs(this.m_sinA*this.m_delta)){if(0<this.m_normals[b].X*this.m_normals[a].X+this.m_normals[a].Y*this.m_normals[b].Y)return this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+this.m_normals[b].X*this.m_delta),
d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_normals[b].Y*this.m_delta))),b}else 1<this.m_sinA?this.m_sinA=1:-1>this.m_sinA&&(this.m_sinA=-1);if(0>this.m_sinA*this.m_delta)this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+this.m_normals[b].X*this.m_delta),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_normals[b].Y*this.m_delta))),this.m_destPoly.push(new d.IntPoint(this.m_srcPoly[a])),this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+this.m_normals[a].X*
this.m_delta),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_normals[a].Y*this.m_delta)));else switch(c){case d.JoinType.jtMiter:c=1+(this.m_normals[a].X*this.m_normals[b].X+this.m_normals[a].Y*this.m_normals[b].Y);c>=this.m_miterLim?this.DoMiter(a,b,c):this.DoSquare(a,b);break;case d.JoinType.jtSquare:this.DoSquare(a,b);break;case d.JoinType.jtRound:this.DoRound(a,b)}return a};d.ClipperOffset.prototype.DoSquare=function(a,b){var c=Math.tan(Math.atan2(this.m_sinA,this.m_normals[b].X*this.m_normals[a].X+
this.m_normals[b].Y*this.m_normals[a].Y)/4);this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+this.m_delta*(this.m_normals[b].X-this.m_normals[b].Y*c)),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_delta*(this.m_normals[b].Y+this.m_normals[b].X*c))));this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+this.m_delta*(this.m_normals[a].X+this.m_normals[a].Y*c)),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_delta*(this.m_normals[a].Y-this.m_normals[a].X*
c))))};d.ClipperOffset.prototype.DoMiter=function(a,b,c){c=this.m_delta/c;this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+(this.m_normals[b].X+this.m_normals[a].X)*c),d.ClipperOffset.Round(this.m_srcPoly[a].Y+(this.m_normals[b].Y+this.m_normals[a].Y)*c)))};d.ClipperOffset.prototype.DoRound=function(a,b){for(var c=Math.max(d.Cast_Int32(d.ClipperOffset.Round(this.m_StepsPerRad*Math.abs(Math.atan2(this.m_sinA,this.m_normals[b].X*this.m_normals[a].X+this.m_normals[b].Y*this.m_normals[a].Y)))),
1),e=this.m_normals[b].X,f=this.m_normals[b].Y,g,h=0;h<c;++h)this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+e*this.m_delta),d.ClipperOffset.Round(this.m_srcPoly[a].Y+f*this.m_delta))),g=e,e=e*this.m_cos-this.m_sin*f,f=g*this.m_sin+f*this.m_cos;this.m_destPoly.push(new d.IntPoint(d.ClipperOffset.Round(this.m_srcPoly[a].X+this.m_normals[a].X*this.m_delta),d.ClipperOffset.Round(this.m_srcPoly[a].Y+this.m_normals[a].Y*this.m_delta)))};d.Error=function(a){try{throw Error(a);
}catch(b){alert(b.message)}};d.JS={};d.JS.AreaOfPolygon=function(a,b){b||(b=1);return d.Clipper.Area(a)/(b*b)};d.JS.AreaOfPolygons=function(a,b){b||(b=1);for(var c=0,e=0;e<a.length;e++)c+=d.Clipper.Area(a[e]);return c/(b*b)};d.JS.BoundsOfPath=function(a,b){return d.JS.BoundsOfPaths([a],b)};d.JS.BoundsOfPaths=function(a,b){b||(b=1);var c=d.Clipper.GetBounds(a);c.left/=b;c.bottom/=b;c.right/=b;c.top/=b;return c};d.JS.Clean=function(a,b){if(!(a instanceof Array))return[];var c=a[0]instanceof Array;a=
d.JS.Clone(a);if("number"!=typeof b||null===b)return d.Error("Delta is not a number in Clean()."),a;if(0===a.length||1==a.length&&0===a[0].length||0>b)return a;c||(a=[a]);for(var e=a.length,f,g,h,k,v,n,p,m=[],q=0;q<e;q++)if(g=a[q],f=g.length,0!==f)if(3>f)h=g,m.push(h);else{h=g;k=b*b;v=g[0];for(p=n=1;p<f;p++)(g[p].X-v.X)*(g[p].X-v.X)+(g[p].Y-v.Y)*(g[p].Y-v.Y)<=k||(h[n]=g[p],v=g[p],n++);v=g[n-1];(g[0].X-v.X)*(g[0].X-v.X)+(g[0].Y-v.Y)*(g[0].Y-v.Y)<=k&&n--;n<f&&h.splice(n,f-n);h.length&&m.push(h)}!c&&
m.length?m=m[0]:c||0!==m.length?c&&0===m.length&&(m=[[]]):m=[];return m};d.JS.Clone=function(a){if(!(a instanceof Array)||0===a.length)return[];if(1==a.length&&0===a[0].length)return[[]];var b=a[0]instanceof Array;b||(a=[a]);var c=a.length,d,f,g,h,k=Array(c);for(f=0;f<c;f++){d=a[f].length;h=Array(d);for(g=0;g<d;g++)h[g]={X:a[f][g].X,Y:a[f][g].Y};k[f]=h}b||(k=k[0]);return k};d.JS.Lighten=function(a,b){if(!(a instanceof Array))return[];if("number"!=typeof b||null===b)return d.Error("Tolerance is not a number in Lighten()."),
d.JS.Clone(a);if(0===a.length||1==a.length&&0===a[0].length||0>b)return d.JS.Clone(a);a[0]instanceof Array||(a=[a]);var c,e,f,g,h,k,m,n,p,q,r,t,u,w,x,A=a.length,B=b*b,z=[];for(c=0;c<A;c++)if(f=a[c],k=f.length,0!=k){for(g=0;1E6>g;g++){h=[];k=f.length;f[k-1].X!=f[0].X||f[k-1].Y!=f[0].Y?(r=1,f.push({X:f[0].X,Y:f[0].Y}),k=f.length):r=0;q=[];for(e=0;e<k-2;e++){m=f[e];p=f[e+1];n=f[e+2];w=m.X;x=m.Y;m=n.X-w;t=n.Y-x;if(0!==m||0!==t)u=((p.X-w)*m+(p.Y-x)*t)/(m*m+t*t),1<u?(w=n.X,x=n.Y):0<u&&(w+=m*u,x+=t*u);m=
p.X-w;t=p.Y-x;n=m*m+t*t;n<=B&&(q[e+1]=1,e++)}h.push({X:f[0].X,Y:f[0].Y});for(e=1;e<k-1;e++)q[e]||h.push({X:f[e].X,Y:f[e].Y});h.push({X:f[k-1].X,Y:f[k-1].Y});r&&f.pop();if(q.length)f=h;else break}k=h.length;h[k-1].X==h[0].X&&h[k-1].Y==h[0].Y&&h.pop();2<h.length&&z.push(h)}a[0]instanceof Array||(z=z[0]);"undefined"==typeof z&&(z=[[]]);return z};d.JS.PerimeterOfPath=function(a,b,c){if("undefined"==typeof a)return 0;var d=Math.sqrt,f=0,g,h,k,m,n=a.length;if(2>n)return 0;b&&(a[n]=a[0],n++);for(;--n;)g=
a[n],k=g.X,g=g.Y,h=a[n-1],m=h.X,h=h.Y,f+=d((k-m)*(k-m)+(g-h)*(g-h));b&&a.pop();return f/c};d.JS.PerimeterOfPaths=function(a,b,c){c||(c=1);for(var e=0,f=0;f<a.length;f++)e+=d.JS.PerimeterOfPath(a[f],b,c);return e};d.JS.ScaleDownPath=function(a,b){var c,d;b||(b=1);for(c=a.length;c--;)d=a[c],d.X/=b,d.Y/=b};d.JS.ScaleDownPaths=function(a,b){var c,d,f;b||(b=1);for(c=a.length;c--;)for(d=a[c].length;d--;)f=a[c][d],f.X/=b,f.Y/=b};d.JS.ScaleUpPath=function(a,b){var c,d,f=Math.round;b||(b=1);for(c=a.length;c--;)d=
a[c],d.X=f(d.X*b),d.Y=f(d.Y*b)};d.JS.ScaleUpPaths=function(a,b){var c,d,f,g=Math.round;b||(b=1);for(c=a.length;c--;)for(d=a[c].length;d--;)f=a[c][d],f.X=g(f.X*b),f.Y=g(f.Y*b)};d.ExPolygons=function(){return[]};d.ExPolygon=function(){this.holes=this.outer=null};d.JS.AddOuterPolyNodeToExPolygons=function(a,b){var c=new d.ExPolygon;c.outer=a.Contour();var e=a.Childs(),f=e.length;c.holes=Array(f);var g,h,k,m,n;for(h=0;h<f;h++)for(g=e[h],c.holes[h]=g.Contour(),k=0,m=g.Childs(),n=m.length;k<n;k++)g=m[k],
d.JS.AddOuterPolyNodeToExPolygons(g,b);b.push(c)};d.JS.ExPolygonsToPaths=function(a){var b,c,e,f,g=new d.Paths;b=0;for(e=a.length;b<e;b++)for(g.push(a[b].outer),c=0,f=a[b].holes.length;c<f;c++)g.push(a[b].holes[c]);return g};d.JS.PolyTreeToExPolygons=function(a){var b=new d.ExPolygons,c,e,f;c=0;e=a.Childs();for(f=e.length;c<f;c++)a=e[c],d.JS.AddOuterPolyNodeToExPolygons(a,b);return b}})();

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["setMapOpacityFade"] = setMapOpacityFade;
/* harmony export (immutable) */ __webpack_exports__["setMapOpacityStrong"] = setMapOpacityStrong;
/* harmony export (immutable) */ __webpack_exports__["setLegend"] = setLegend;
/* harmony export (immutable) */ __webpack_exports__["resetLegend"] = resetLegend;
/* harmony export (immutable) */ __webpack_exports__["horizontalSliceAlg"] = horizontalSliceAlg;
/**
 * Created by meredith on 4/24/17.
 */

const TextToSVG = __webpack_require__(24);

function setMapOpacityFade() {
    d3.selectAll(".neighborhood").attr("opacity", "0.5");
}

function setMapOpacityStrong() {
    d3.selectAll(".neighborhood").attr("opacity", "1.0");
}

function setLegend(d, i) {

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
}

function resetLegend(d, i) {

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
}

//slice neighborhood horizontally, then vertically
//according to length of phrase to get grid over neighborhood.
//Use inscribed rectangles to fill each grid slot with a letter
function horizontalSliceAlg(svg, pathCoords3d, d, phrase, padding, gridCache,
                            USE_GRID_CACHING, displayRectangles, displayBounds,
                            displayText, TEXT_SIZE_MULTIPLIER, font, HORIZONTAL_SLICE_CAP,
                            CHAR_ASPECT_RATIO, textToSVG, TextToSVG, raphael) {


    //get height and width of polygon
    //don't use padding this time (padding = 0)
    var dimensions = NeighborhoodParser.getNeighborhoodDimensions(pathCoords3d, 0);
    var heightOfPoly = dimensions.max - dimensions.min;
    var widthOfPoly = dimensions.right - dimensions.left;

    var optimalHorizontalSlices;
    if (USE_GRID_CACHING && gridCache[d.properties.name] != null &&
        gridCache[d.properties.name][phrase.length] != null) {
        optimalHorizontalSlices = gridCache[d.properties.name][phrase.length];
    } else { //cache optimal slices..only used to use output and save
        optimalHorizontalSlices = NeighborhoodParser.testGrid(pathCoords3d, dimensions, d, svg,
            phrase, padding, HORIZONTAL_SLICE_CAP, CHAR_ASPECT_RATIO, TEXT_SIZE_MULTIPLIER, font, TextToSVG);
        if (gridCache[d.properties.name] == null) {
            gridCache[d.properties.name] = {};
        }
        gridCache[d.properties.name][phrase.length] = optimalHorizontalSlices;
    }


    var gridUnits = NeighborhoodParser.createGrid(pathCoords3d, dimensions, optimalHorizontalSlices, d, svg,
        phrase, padding, displayRectangles, displayBounds);

    if (displayText) {
        for (var i = 0; i < gridUnits.length; i++) {
            var character = phrase.charAt(i);
            TextUtil.appendCharacterAsSVG(character, gridUnits[i], svg, d, i, padding, displayText, displayBounds,
                TEXT_SIZE_MULTIPLIER, font, textToSVG, raphael);
        }
    }
}

function appendSingleLetter(rectangle, letter, d) {

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


/***/ }),
/* 28 */
/***/ (function(module, exports) {



/**
 * Created by meredith on 6/5/16.
 *
 * Stores geolocation for neighborhoods in seattle, along with radius values
 */

// note I changed this on 4.11.17
    // probably broke something
 var locations = {

    "University District":  [
        {
            "lat": 47.653700,
            "long": -122.302706,
            "radius": 0.5
        }
    ],
"North Beach": [
            {
            "lat": 47.696688,
            "long": -122.390599,
            "radius": 0.5
            }
    ],
    
"Broadview": [{
            "lat": 47.726977,
            "long": -122.364500,
            "radius": 0.5
            },
            {
            "lat": 47.716930,
            "long": -122.366216,
            "radius": 0.5
            }
            ],
    "View Ridge": [{
        "lat": 47.683486,
        "long": -122.273829,
        "radius": 0.6
    }],
"Haller Lake":[{
            "lat": 47.719685,
            "long": -122.333860,
            "radius": 0.5
            }],
"Olympic Hills":[{
            "lat": 47.726800,
            "long": -122.392573,
            "radius": 0.5
            }],
"Cedar Park":[{
            "lat": 47.726926,
            "long": -122.285881,
            "radius": 0.5
            }],
"Northgate":[{
            "lat": 47.721390,
            "long": -122.326826,
            "radius": 0.5
            },
            {
            "lat": 47.701412,
            "long": -122.3232393,
            "radius": 0.5
            }],
"Blue Ridge":[{
            "lat": 47.707145,
            "long": -122.375321,
            "radius": 0.5
            }],
"Maple Leaf":[{
            "lat": 47.694960,
            "long": -122.315871,
            "radius": 0.5
            }],
    "Matthews Beach": [{
        "lat": 47.710099,
        "long": -122.282763,
        "radius": 0.4
    },
        {
            "lat": 47.699991,
            "long": -122.277184,
            "radius": 0.5
        }],
"Sand Point":[{
            "lat": 47.681645,
            "long": -122.253911,
            "radius": 0.5
            }],
"Windermere":[{
            "lat": 47.671325,
            "long": -122.266615,
            "radius": 0.5
            }],
    "Pinehurst":[{
        "lat": 47.728822,
        "long": -122.318290,
        "radius": 0.5
    },
        {
            "lat": 47.717581,
            "long": -122.318092,
            "radius": 0.5
        },
        {   "lat": 47.711459,
            "long": -122.324958,
            "radius": 0.1},
        {
            "lat": 47.710535,
            "long": -122.315173,
            "radius": 0.1
        }],
"Wedgwood":[{
            "lat": 47.690557,
            "long": -122.290732,
            "radius": 0.5
            }],
"Wallingford":[{
            "lat": 47.665157,
            "long": -122.331042,
            "radius": 0.5
            },
            {
            "lat": 47.655098,
            "long": -122.333102,
            "radius": 0.5
            }],
"Fremont":[{
            "lat": 47.656315,
            "long": -122.354226,
            "radius": 0.5
            }],
"Laurelhurst":[{
            "lat": 47.659627,
            "long": -122.277163,
            "radius": 0.5
            }],
"Hawthorne Hills":[{
            "lat": 47.672849,
            "long": -122.272833,
            "radius": 0.3
            },
            {
            "lat": 47.671346,
            "long": -122.280643,
            "radius": 0.3
            }],
"Magnolia":[{
            "lat": 47.651710,
            "long": -122.405040,
            "radius": 1.0
            }],
"Queen Anne":[{
            "lat": 47.637002,
            "long": -122.357374,
            "radius": 0.8
            }],
"Lower Queen Anne":[{
            "lat": 47.624282,
            "long": -122.354136,
            "radius": 0.5
            }],
"Westlake":[{
            "lat": 47.635396,
            "long": -122.341545,
            "radius": 0.1
            },
            {
            "lat": 47.629988,
            "long": -122.341245,
            "radius": 0.5
            }],

"Interbay":[{
            "lat": 47.660135,
            "long": -122.387360,
            "radius": 0.2
            },
            {
            "lat": 47.652735,
            "long": -122.378949,
            "radius": 0.2
            },
            {
            "lat": 47.646086,
            "long": -122.379009,
            "radius": 0.2
            },
            {
            "lat": 47.637730,
            "long": -122.381280,
            "radius": 0.3
            },
            {
            "lat": 47.625489,
            "long": -122.379359,
            "radius": 0.3
            },
            {
            "lat": 47.619603,
            "long": -122.368617,
            "radius": 0.3
            }],
"Eastlake":[{
            "lat": 47.639346,
            "long": -122.326038,
            "radius": 0.3
            },
            {
            "lat": 47.645852,
            "long": -122.325223,
            "radius": 0.1
            }],
"Portage Bay":[{
            "lat": 47.648231,
            "long": -122.319575,
            "radius": 0.3
            }],
"Beacon Hill":[{
            "lat": 47.551326,
            "long": -122.300359,
            "radius": 0.4
            },
            {
            "lat": 47.567486,
            "long": -122.316924,
            "radius": 0.1
            }],
"Georgetown":[{
            "lat": 47.546216,
            "long": -122.324118,
            "radius": 1.0
            },
            {
            "lat": 47.543512,
            "long": -122.307724,
            "radius": 0.7
            }],
"Belltown":[ {
            "lat": 47.615402,
            "long": -122.348058,
            "radius": 0.3
            },
            {
            "lat": 47.616559,
            "long": -122.353355,
            "radius": 0.1
            }],
"West Seattle":[{
            "lat": 47.566075,
            "long": -122.386773,
            "radius": 0.8
            }],
"Seward Park":[{
            "lat": 47.555139,
            "long": -122.251381,
            "radius": 0.5
            }],
"Alki":[{
            "lat": 47.565862,
            "long": -122.403029,
            "radius": 0.3
            },
            {
            "lat": 47.574954,
            "long": -122.410411,
            "radius": 0.5
            },
            {
            "lat": 47.587460,
            "long": -122.405261,
            "radius": 0.5
            },
            {
            "lat": 47.595332,
            "long": -122.386035,
            "radius": 0.3
            }],
"Fauntleroy":[{
            "lat": 47.531315,
            "long": -122.393458,
            "radius": 0.3
            },
            {
            "lat": 47.523201,
            "long": -122.384789,
            "radius": 0.5
            },
            {
            "lat": 47.508303,
            "long": -122.399552,
            "radius": 0.4
            }],
"South Park":[{
            "lat": 47.526792,
            "long": -122.323576,
            "radius": 0.7
            },
            {
            "lat": 47.537049,
            "long": -122.333275,
            "radius": 0.2
            }],
"Arbor Heights":[{
            "lat": 47.509386,
            "long": -122.380079,
            "radius": 0.8
            }],
"Highland Park":[{
            "lat": 47.527356,
            "long": -122.343936,
            "radius": 0.5
            },
            {
            "lat": 47.517792,
            "long": -122.333207,
            "radius": 0.1
            }],
"Columbia City":[{
            "lat": 47.559775,
            "long": -122.282548,
            "radius": 0.3
            },
            {
            "lat": 47.565393,
            "long": -122.294307,
            "radius": 0.2
            },
            {
            "lat": 47.573211,
            "long": -122.296796,
            "radius": 0.1
            }],
"South Delridge":[{
            "lat": 47.530444,
            "long": -122.360405,
            "radius": 0.4
            },
            {
            "lat": 47.521866,
            "long": -122.359805,
            "radius": 0.3
            }],
"High Point": [{
            "lat": 47.548759,
            "long": -122.368853,
            "radius": 0.5
            },
            {
            "lat": 47.539953,
            "long": -122.367308,
            "radius": 0.4
            }],
"Mount Baker": [{
            "lat": 47.584061,
            "long": -122.291033,
            "radius": 0.4
            },
            {
            "lat": 47.576014,
            "long": -122.287600,
            "radius": 0.4
            },
            {
            "lat": 47.567154,
            "long": -122.284167,
            "radius": 0.2
            }],
"Industrial District": [{
            "lat": 47.581134,
            "long": -122.331035,
            "radius": 0.5
            },
            {
            "lat": 47.567352,
            "long": -122.332580,
            "radius": 0.5
            },
            {
            "lat": 47.579976,
            "long": -122.350948,
            "radius": 0.4
            },
            {
            "lat": 47.578702,
            "long": -122.363994,
            "radius": 0.2
            }],
"Madison Valley": [{
            "lat": 47.624619,
            "long": -122.289729,
            "radius": 0.5
            }],
    "Madison Park": [{
        "lat": 47.636966,
        "long": -122.286085,
        "radius": 0.6
    }],
"Denny-Blaine": [{
            "lat": 47.621443,
            "long": -122.289939,
            "radius": 0.2
            },
            {
            "lat": 47.623641,
            "long": -122.276163,
            "radius": 0.5
            }],
"Downtown": [{
            "lat": 47.605824,
            "long": -122.340344,
            "radius": 1.0
            }],
    "Whittier Heights": [{
        "lat": 47.686643,
        "long": -122.370952,
        "radius": 0.3
    },
        {
            "lat": 47.680258,
            "long": -122.371081,
            "radius": 0.3
        }],
"Broadmoor": [{
            "lat": 47.635906,
            "long": -122.289615,
            "radius": 0.5
            }],
    "Brighton": [
        {   "lat": 47.541623,
        "long": -122.276692,
        "radius": 0.4},
        {"lat": 47.535626,
            "long": -122.274332,
            "radius": 0.4}
    ],
    "Sunset Hill": [{
        "lat": 47.671964,
        "long": -122.403107,
        "radius": 0.3
    },
        {
            "lat": 47.683002,
            "long": -122.402850,
            "radius": 0.5
        },
        {
            "lat": 47.693633,
            "long": -122.402421,
            "radius": 0.1
        }],
    "Rainier Beach": [{
        "lat": 47.513373,
        "long": -122.260001,
        "radius": 1
    }],
"South Lake Union": [{
            "lat": 47.623077,
            "long": -122.337105,
            "radius": 0.3
            },
            {
            "lat": 47.632910,
            "long": -122.333758,
            "radius": 0.4
            }],
    "Capitol Hill": [{
        "lat": 47.627731,
        "long": -122.317181,
        "radius": 0.6
    }],
    "First Hill": [{
        "lat": 47.609016,
        "long": -122.325077,
        "radius": 0.4
    }],
    "Meadowbrook": [{
        "lat": 47.702143,
        "long": -122.296535,
        "radius": 0.3
    },
        {
            "lat": 47.711124,
            "long": -122.295763,
            "radius": 0.3
        }],
    "Admiral": [{
        "lat": 47.581198,
        "long": -122.385528,
        "radius": 0.1
    }],
    "North College Park": [{
        "lat": 47.695875,
        "long": -122.336834,
        "radius": 0.5
    },
        {
            "lat": 47.705002,
            "long": -122.336749,
            "radius": 0.4
        }],
    "Atlantic": [{
        "lat": 47.596667,
        "long": -122.305542,
        "radius": 0.4
    },
        {
            "lat": 47.587406,
            "long": -122.301336,
            "radius": 0.2
        },
        {
            "lat": 47.581848,
            "long": -122.299362,
            "radius": 0.1
        },
        {
            "lat": 47.579372,
            "long": -122.297433,
            "radius": 0.2
        }],
    "Loyal Heights": [{
        "lat": 47.683318,
        "long": -122.384374,
        "radius": 0.4
    }],
    "Central District": [{
        "lat": 47.606342,
        "long": -122.282172,
        "radius": 2.2
    }],
    "International District": [{
        "lat": 47.598943,
        "long": -122.324872,
        "radius": 0.2
    },
        {
            "lat": 47.597670,
            "long": -122.317276,
            "radius": 0.2
        }],
    "Roosevelt": [{
        "lat": 47.679659,
        "long": -122.316267,
        "radius": 0.2
    },
        {
            "lat": 47.673244,
            "long": -122.315066,
            "radius": 0.15
        }],
    "Pioneer Square": [
        {
        "lat": 47.600855,
        "long": -122.332273,
        "radius": 0.2
    },
        {
            "lat": 47.603285,
            "long": -122.329054,
            "radius": 0.1
        }],
    "Ballard": [{
        "lat": 47.676345,
        "long": -122.388039,
        "radius": 1.2
    }],
    "Roxhill": [{
        "lat": 47.522857,
        "long": -122.371232,
        "radius": 0.4
    },
        {
            "lat": 47.533115,
            "long": -122.371104,
            "radius": 0.25
        }],
    "North Delridge": [{
        "lat": 47.563064,
        "long": -122.363358,
        "radius": 0.8
    }],
    "Greenwood": [{
        "lat": 47.694669,
        "long": -122.354564,
        "radius": 0.8
    }],
    "Leschi": [{
        "lat": 47.602414,
        "long": -122.290351,
        "radius": 0.35
    },
        {
            "lat": 47.592950,
            "long": -122.291638,
            "radius": 0.2
        }],
    "Riverview": [{
        "lat": 47.550774,
        "long": -122.353223,
        "radius": 0.6
    },
        {
            "lat": 47.536695,
            "long": -122.352193,
            "radius": 0.3
        }],
    "Montlake": [{
        "lat": 47.641211,
        "long": -122.304351,
        "radius": 0.4
    }],
    "Green Lake": [{
        "lat": 47.681777,
        "long": -122.333332,
        "radius": 1.4
    },
        {
            "lat": 47.668138,
            "long": -122.344061,
            "radius": 0.2
        }],
    "Ravenna": [{
        "lat": 47.678981,
        "long": -122.307090,
        "radius": 0.8
    }],
    "Crown Hill": [{
        "lat": 47.700922,
        "long": -122.371123,
        "radius": 0.3
    },
        {
            "lat": 47.694192,
            "long": -122.371252,
            "radius": 0.3
        },
        {
            "lat": 47.692748,
            "long": -122.379878,
            "radius": 0.1
        }],
    "Madrona": [{
        "lat": 47.613357,
        "long": -122.288264,
        "radius": 0.5
    }],
    "Bitter Lake": [{
        "lat": 47.729606,
        "long": -122.350447,
        "radius": 0.3
    },
        {
            "lat": 47.720080,
            "long": -122.349932,
            "radius": 0.3
        },
        {
            "lat": 47.710551,
            "long": -122.394760,
            "radius": 0.3
        }],
    "Olympic Manor": [{ //this place was just one spot...
        "lat": 47.689922,
        "long": -122.385390,
        "radius": 0.3
    }],
    "Victory Heights": [{
        "lat": 47.714114,
        "long": -122.305320,
        "radius": 0.5
    },
        {
            "lat": 47.703805,
            "long": -122.306908,
            "radius": 0.3
        }],
    "Phinney Ridge": [{
        "lat": 47.679529,
        "long": -122.355152,
        "radius": 0.6
    },
        {
            "lat": 47.668491,
            "long": -122.354551,
            "radius": 0.8
        },
        {
            "lat": 47.670514,
            "long": -122.363563,
            "radius": 0.1
        }],
    "Bryant": [{
        "lat": 47.665372,
        "long": -122.286601,
        "radius": 0.25
    },
        {
            "lat": 47.672539,
            "long": -122.284970,
            "radius": 0.3
        },
        {
            "lat": 47.679474,
            "long": -122.287888,
            "radius": 0.25
        }]

};

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return sample_bestplaces; });
/**
 * Created by meredith on 4/24/17.
 */
var sample_bestplaces =
{
    "University District"
:
    {
        "bestmatch"
    :
        "Morsel", "categories"
    :
        [{"alias": "coffee", "title": "Coffee & Tea"}, {
            "alias": "breakfast_brunch",
            "title": "Breakfast & Brunch"
        }, {"alias": "sandwiches", "title": "Sandwiches"}], "review_count"
    :
        639, "rating"
    :
        4.5, "price"
    :
        "$"
    },
    "North Beach"
:
    {
        "bestmatch"
    :
        "Golden Gardens Park", "categories"
    :
        [{"alias": "parks", "title": "Parks"}, {"alias": "beaches", "title": "Beaches"}, {
            "alias": "playgrounds",
            "title": "Playgrounds"
        }], "review_count"
    :
        262, "rating"
    :
        4.5, "price"
    :
        null
    },
    "Broadview"
:
    {
        "bestmatch"
    :
        "Carkeek Park", "categories"
    :
        [{"alias": "parks", "title": "Parks"}, {
            "alias": "recreation",
            "title": "Recreation Centers"
        }, {"alias": "beaches", "title": "Beaches"}], "review_count"
    :
        154, "rating"
    :
        4.5, "price"
    :
        null
    },
    "View Ridge"
:
    {
        "bestmatch"
    :
        "Seattle Select Moving", "categories"
    :
        [{"alias": "movers", "title": "Movers"}], "review_count"
    :
        74, "rating"
    :
        4.5, "price"
    :
        null
    }
,
    "Haller Lake"
:
    {
        "bestmatch"
    :
        "The Bridge Coffee House", "categories"
    :
        [{"alias": "coffee", "title": "Coffee & Tea"}], "review_count"
    :
        34, "rating"
    :
        4.5, "price"
    :
        "$"
    }
,
    "Olympic Hills"
:
    {
        "bestmatch"
    :
        "Man'oushe Express", "categories"
    :
        [{"alias": "mideastern", "title": "Middle Eastern"}], "review_count"
    :
        51, "rating"
    :
        4.5, "price"
    :
        "$"
    }
,
    "Cedar Park"
:
    {
        "bestmatch"
    :
        "Jebena Cafe", "categories"
    :
        [{"alias": "ethiopian", "title": "Ethiopian"}], "review_count"
    :
        256, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "Northgate"
:
    {
        "bestmatch"
    :
        "Gyro Hut", "categories"
    :
        [{"alias": "halal", "title": "Halal"}, {"alias": "greek", "title": "Greek"}, {
            "alias": "mediterranean",
            "title": "Mediterranean"
        }], "review_count"
    :
        230, "rating"
    :
        4, "price"
    :
        "$"
    }
,
    "Blue Ridge"
:
    {
        "bestmatch"
    :
        "Carkeek Park", "categories"
    :
        [{"alias": "parks", "title": "Parks"}, {
            "alias": "recreation",
            "title": "Recreation Centers"
        }, {"alias": "beaches", "title": "Beaches"}], "review_count"
    :
        154, "rating"
    :
        4.5, "price"
    :
        null
    }
,
    "Maple Leaf"
:
    {
        "bestmatch"
    :
        "Cloud City Coffee", "categories"
    :
        [{"alias": "coffee", "title": "Coffee & Tea"}, {"alias": "cafes", "title": "Cafes"}], "review_count"
    :
        216, "rating"
    :
        4, "price"
    :
        "$"
    }
,
    "Matthews Beach"
:
    {
        "bestmatch"
    :
        "Burke-Gilman Trail", "categories"
    :
        [{"alias": "parks", "title": "Parks"}], "review_count"
    :
        75, "rating"
    :
        4.5, "price"
    :
        null
    }
,
    "Sand Point"
:
    {
        "bestmatch"
    :
        "Warren G Magnuson Park - Off Leash Area", "categories"
    :
        [{"alias": "dog_parks", "title": "Dog Parks"}], "review_count"
    :
        203, "rating"
    :
        4.5, "price"
    :
        null
    }
,
    "Windermere"
:
    {
        "bestmatch"
    :
        "Pagliacci Pizza", "categories"
    :
        [{"alias": "pizza", "title": "Pizza"}], "review_count"
    :
        39, "rating"
    :
        4, "price"
    :
        "$$"
    }
,
    "Pinehurst"
:
    {
        "bestmatch"
    :
        "Chaiyo Thai Cuisine", "categories"
    :
        [{"alias": "thai", "title": "Thai"}], "review_count"
    :
        302, "rating"
    :
        4, "price"
    :
        "$$"
    }
,
    "Wedgwood"
:
    {
        "bestmatch"
    :
        "Van Gogh Coffeehouse", "categories"
    :
        [{"alias": "coffee", "title": "Coffee & Tea"}, {"alias": "cafes", "title": "Cafes"}], "review_count"
    :
        113, "rating"
    :
        4.5, "price"
    :
        "$"
    }
,
    "Wallingford"
:
    {
        "bestmatch"
    :
        "Harvest Beat", "categories"
    :
        [{"alias": "vegetarian", "title": "Vegetarian"}, {"alias": "vegan", "title": "Vegan"}], "review_count"
    :
        62, "rating"
    :
        5, "price"
    :
        "$$$"
    }
,
    "Fremont"
:
    {
        "bestmatch"
    :
        "Paseo Caribbean Food - Fremont", "categories"
    :
        [{"alias": "caribbean", "title": "Caribbean"}, {"alias": "cuban", "title": "Cuban"}, {
            "alias": "sandwiches",
            "title": "Sandwiches"
        }], "review_count"
    :
        4367, "rating"
    :
        4.5, "price"
    :
        "$"
    }
,
    "Laurelhurst"
:
    {
        "bestmatch"
    :
        "Jak's Grill", "categories"
    :
        [{"alias": "steak", "title": "Steakhouses"}, {
            "alias": "tradamerican",
            "title": "American (Traditional)"
        }], "review_count"
    :
        335, "rating"
    :
        4, "price"
    :
        "$$$"
    }
,
    "Hawthorne Hills"
:
    {
        "bestmatch"
    :
        "Center For Spiritual Living", "categories"
    :
        [{"alias": "churches", "title": "Churches"}], "review_count"
    :
        20, "rating"
    :
        4, "price"
    :
        null
    }
,
    "Magnolia"
:
    {
        "bestmatch"
    :
        "Discovery Park", "categories"
    :
        [{"alias": "parks", "title": "Parks"}, {"alias": "beaches", "title": "Beaches"}], "review_count"
    :
        311, "rating"
    :
        4.5, "price"
    :
        null
    }
,
    "Queen Anne"
:
    {
        "bestmatch"
    :
        "Storyville Coffee Company", "categories"
    :
        [{"alias": "coffee", "title": "Coffee & Tea"}], "review_count"
    :
        158, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "Lower Queen Anne"
:
    {
        "bestmatch"
    :
        "Kerry Park", "categories"
    :
        [{"alias": "parks", "title": "Parks"}, {"alias": "playgrounds", "title": "Playgrounds"}], "review_count"
    :
        709, "rating"
    :
        4.5, "price"
    :
        null
    }
,
    "Westlake"
:
    {
        "bestmatch"
    :
        "Canlis", "categories"
    :
        [{"alias": "newamerican", "title": "American (New)"}, {"alias": "seafood", "title": "Seafood"}], "review_count"
    :
        1075, "rating"
    :
        4, "price"
    :
        "$$$$"
    }
,
    "Interbay"
:
    {
        "bestmatch"
    :
        "Windy City Pie", "categories"
    :
        [{"alias": "pizza", "title": "Pizza"}, {"alias": "foodstands", "title": "Food Stands"}], "review_count"
    :
        160, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "Eastlake"
:
    {
        "bestmatch"
    :
        "Pomodoro", "categories"
    :
        [{"alias": "italian", "title": "Italian"}, {"alias": "spanish", "title": "Spanish"}, {
            "alias": "basque",
            "title": "Basque"
        }], "review_count"
    :
        241, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "Portage Bay"
:
    {
        "bestmatch"
    :
        "Little Lago", "categories"
    :
        [{"alias": "delis", "title": "Delis"}, {"alias": "italian", "title": "Italian"}, {
            "alias": "grocery",
            "title": "Grocery"
        }], "review_count"
    :
        17, "rating"
    :
        5, "price"
    :
        "$$"
    }
,
    "Beacon Hill"
:
    {
        "bestmatch"
    :
        "Cafetal Quilombo", "categories"
    :
        [{"alias": "cafes", "title": "Cafes"}, {"alias": "coffee", "title": "Coffee & Tea"}, {
            "alias": "mexican",
            "title": "Mexican"
        }], "review_count"
    :
        72, "rating"
    :
        5, "price"
    :
        "$"
    }
,
    "Georgetown"
:
    {
        "bestmatch"
    :
        "Calozzi's Cheesesteaks", "categories"
    :
        [{"alias": "cheesesteaks", "title": "Cheesesteaks"}, {
            "alias": "sandwiches",
            "title": "Sandwiches"
        }], "review_count"
    :
        175, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "Belltown"
:
    {
        "bestmatch"
    :
        "Some Random Bar", "categories"
    :
        [{"alias": "gastropubs", "title": "Gastropubs"}, {
            "alias": "cocktailbars",
            "title": "Cocktail Bars"
        }, {"alias": "breakfast_brunch", "title": "Breakfast & Brunch"}], "review_count"
    :
        555, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "West Seattle"
:
    {
        "bestmatch"
    :
        "The Beer Junction", "categories"
    :
        [{"alias": "beer_and_wine", "title": "Beer, Wine & Spirits"}, {
            "alias": "beerbar",
            "title": "Beer Bar"
        }], "review_count"
    :
        229, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "Seward Park"
:
    {
        "bestmatch"
    :
        "Seward Park Audubon Center", "categories"
    :
        [{"alias": "parks", "title": "Parks"}], "review_count"
    :
        124, "rating"
    :
        4.5, "price"
    :
        null
    }
,
    "Alki"
:
    {
        "bestmatch"
    :
        "Alki Beach Park", "categories"
    :
        [{"alias": "parks", "title": "Parks"}, {"alias": "beaches", "title": "Beaches"}], "review_count"
    :
        269, "rating"
    :
        4.5, "price"
    :
        null
    }
,
    "Fauntleroy"
:
    {
        "bestmatch"
    :
        "Lincoln Park", "categories"
    :
        [{"alias": "parks", "title": "Parks"}, {"alias": "beaches", "title": "Beaches"}, {
            "alias": "playgrounds",
            "title": "Playgrounds"
        }], "review_count"
    :
        103, "rating"
    :
        4.5, "price"
    :
        null
    }
,
    "South Park"
:
    {
        "bestmatch"
    :
        "Phorale", "categories"
    :
        [{"alias": "vietnamese", "title": "Vietnamese"}, {
            "alias": "asianfusion",
            "title": "Asian Fusion"
        }, {"alias": "tex-mex", "title": "Tex-Mex"}], "review_count"
    :
        97, "rating"
    :
        4.5, "price"
    :
        "$"
    }
,
    "Arbor Heights"
:
    {
        "bestmatch"
    :
        "Alki Sewer", "categories"
    :
        [{"alias": "plumbing", "title": "Plumbing"}], "review_count"
    :
        37, "rating"
    :
        5, "price"
    :
        null
    }
,
    "Highland Park"
:
    {
        "bestmatch"
    :
        "Wanna Teriyaki & Burger", "categories"
    :
        [{"alias": "japanese", "title": "Japanese"}, {"alias": "burgers", "title": "Burgers"}], "review_count"
    :
        85, "rating"
    :
        4.5, "price"
    :
        "$"
    }
,
    "Columbia City"
:
    {
        "bestmatch"
    :
        "La Teranga", "categories"
    :
        [{"alias": "senegalese", "title": "Senegalese"}], "review_count"
    :
        135, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "South Delridge"
:
    {
        "bestmatch"
    :
        "Fresh Flours", "categories"
    :
        [{"alias": "coffee", "title": "Coffee & Tea"}, {"alias": "bakeries", "title": "Bakeries"}], "review_count"
    :
        48, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "High Point"
:
    {
        "bestmatch"
    :
        "Tug Inn", "categories"
    :
        [{"alias": "divebars", "title": "Dive Bars"}, {"alias": "karaoke", "title": "Karaoke"}], "review_count"
    :
        40, "rating"
    :
        4, "price"
    :
        "$"
    }
,
    "Mount Baker"
:
    {
        "bestmatch"
    :
        "Tacos El Asadero", "categories"
    :
        [{"alias": "foodtrucks", "title": "Food Trucks"}, {"alias": "tacos", "title": "Tacos"}], "review_count"
    :
        266, "rating"
    :
        4.5, "price"
    :
        "$"
    }
,
    "Industrial District"
:
    {
        "bestmatch"
    :
        "Schooner Exact Brewing Company", "categories"
    :
        [{"alias": "breweries", "title": "Breweries"}, {
            "alias": "newamerican",
            "title": "American (New)"
        }], "review_count"
    :
        192, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "Madison Valley"
:
    {
        "bestmatch"
    :
        "The Harvest Vine", "categories"
    :
        [{"alias": "tapas", "title": "Tapas Bars"}, {"alias": "spanish", "title": "Spanish"}, {
            "alias": "basque",
            "title": "Basque"
        }], "review_count"
    :
        491, "rating"
    :
        4.5, "price"
    :
        "$$$"
    }
,
    "Madison Park"
:
    {
        "bestmatch"
    :
        "Cactus Restaurants", "categories"
    :
        [{"alias": "tex-mex", "title": "Tex-Mex"}, {"alias": "mexican", "title": "Mexican"}, {
            "alias": "newmexican",
            "title": "New Mexican Cuisine"
        }], "review_count"
    :
        415, "rating"
    :
        4, "price"
    :
        "$$"
    }
,
    "Denny-Blaine"
:
    {
        "bestmatch"
    :
        "Viretta Park", "categories"
    :
        [{"alias": "parks", "title": "Parks"}], "review_count"
    :
        25, "rating"
    :
        4.5, "price"
    :
        null
    }
,
    "Downtown"
:
    {
        "bestmatch"
    :
        "Monorail Espresso", "categories"
    :
        [{"alias": "coffee", "title": "Coffee & Tea"}], "review_count"
    :
        427, "rating"
    :
        4.5, "price"
    :
        "$"
    }
,
    "Whittier Heights"
:
    {
        "bestmatch"
    :
        "Un Bien", "categories"
    :
        [{"alias": "cuban", "title": "Cuban"}, {"alias": "caribbean", "title": "Caribbean"}, {
            "alias": "sandwiches",
            "title": "Sandwiches"
        }], "review_count"
    :
        576, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "Broadmoor"
:
    {
        "bestmatch"
    :
        "Washington Park Arboretum", "categories"
    :
        [{"alias": "parks", "title": "Parks"}], "review_count"
    :
        179, "rating"
    :
        4.5, "price"
    :
        null
    }
,
    "Brighton"
:
    {
        "bestmatch"
    :
        "Othello Wok and Teriyaki", "categories"
    :
        [{"alias": "chinese", "title": "Chinese"}, {"alias": "japanese", "title": "Japanese"}], "review_count"
    :
        49, "rating"
    :
        4, "price"
    :
        "$"
    }
,
    "Sunset Hill"
:
    {
        "bestmatch"
    :
        "Geo's Cuban & Creole Cafe", "categories"
    :
        [{"alias": "cajun", "title": "Cajun\/Creole"}, {"alias": "cuban", "title": "Cuban"}], "review_count"
    :
        135, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "Rainier Beach"
:
    {
        "bestmatch"
    :
        "Redwing Cafe", "categories"
    :
        [{"alias": "cafes", "title": "Cafes"}], "review_count"
    :
        73, "rating"
    :
        4.5, "price"
    :
        "$"
    }
,
    "South Lake Union"
:
    {
        "bestmatch"
    :
        "I Love My GFF", "categories"
    :
        [{"alias": "gluten_free", "title": "Gluten-Free"}, {
            "alias": "vegetarian",
            "title": "Vegetarian"
        }, {"alias": "foodstands", "title": "Food Stands"}], "review_count"
    :
        70, "rating"
    :
        4.5, "price"
    :
        "$"
    }
,
    "Capitol Hill"
:
    {
        "bestmatch"
    :
        "Ada's Technical Books and Cafe", "categories"
    :
        [{"alias": "bookstores", "title": "Bookstores"}, {"alias": "cafes", "title": "Cafes"}], "review_count"
    :
        172, "rating"
    :
        4.5, "price"
    :
        "$"
    }
,
    "First Hill"
:
    {
        "bestmatch"
    :
        "George's Sausage & Delicatessen", "categories"
    :
        [{"alias": "delis", "title": "Delis"}, {"alias": "polish", "title": "Polish"}, {
            "alias": "sandwiches",
            "title": "Sandwiches"
        }], "review_count"
    :
        168, "rating"
    :
        4.5, "price"
    :
        "$"
    }
,
    "Meadowbrook"
:
    {
        "bestmatch"
    :
        "Tubs Gourmet Subs", "categories"
    :
        [{"alias": "sandwiches", "title": "Sandwiches"}], "review_count"
    :
        303, "rating"
    :
        4.5, "price"
    :
        "$"
    }
,
    "Admiral"
:
    {
        "bestmatch"
    :
        "Freshy's", "categories"
    :
        [{"alias": "coffee", "title": "Coffee & Tea"}, {
            "alias": "soulfood",
            "title": "Soul Food"
        }, {"alias": "sandwiches", "title": "Sandwiches"}], "review_count"
    :
        114, "rating"
    :
        4.5, "price"
    :
        "$"
    }
,
    "North College Park"
:
    {
        "bestmatch"
    :
        "Tropicos Breeze", "categories"
    :
        [{"alias": "salvadoran", "title": "Salvadoran"}, {"alias": "seafood", "title": "Seafood"}, {
            "alias": "mexican",
            "title": "Mexican"
        }], "review_count"
    :
        232, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "Atlantic"
:
    {
        "bestmatch"
    :
        "Wood Shop BBQ", "categories"
    :
        [{"alias": "foodtrucks", "title": "Food Trucks"}, {"alias": "bbq", "title": "Barbeque"}, {
            "alias": "sandwiches",
            "title": "Sandwiches"
        }], "review_count"
    :
        63, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "Loyal Heights"
:
    {
        "bestmatch"
    :
        "Un Bien", "categories"
    :
        [{"alias": "cuban", "title": "Cuban"}, {"alias": "caribbean", "title": "Caribbean"}, {
            "alias": "sandwiches",
            "title": "Sandwiches"
        }], "review_count"
    :
        576, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "Central District"
:
    {
        "bestmatch"
    :
        "Jackson's Catfish Corner", "categories"
    :
        [{"alias": "southern", "title": "Southern"}, {"alias": "fishnchips", "title": "Fish & Chips"}], "review_count"
    :
        59, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "International District"
:
    {
        "bestmatch"
    :
        "goPok\u00e9", "categories"
    :
        [{"alias": "poke", "title": "Poke"}, {"alias": "hawaiian", "title": "Hawaiian"}, {
            "alias": "desserts",
            "title": "Desserts"
        }], "review_count"
    :
        194, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "Roosevelt"
:
    {
        "bestmatch"
    :
        "Rain City Burgers", "categories"
    :
        [{"alias": "burgers", "title": "Burgers"}, {"alias": "beerbar", "title": "Beer Bar"}], "review_count"
    :
        528, "rating"
    :
        4.5, "price"
    :
        "$"
    }
,
    "Pioneer Square"
:
    {
        "bestmatch"
    :
        "Il Corvo Pasta", "categories"
    :
        [{"alias": "italian", "title": "Italian"}, {"alias": "noodles", "title": "Noodles"}, {
            "alias": "pastashops",
            "title": "Pasta Shops"
        }], "review_count"
    :
        620, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "Ballard"
:
    {
        "bestmatch"
    :
        "Caf\u00e9 Besalu", "categories"
    :
        [{"alias": "bakeries", "title": "Bakeries"}, {"alias": "coffee", "title": "Coffee & Tea"}, {
            "alias": "french",
            "title": "French"
        }], "review_count"
    :
        710, "rating"
    :
        4.5, "price"
    :
        "$"
    }
,
    "Roxhill"
:
    {
        "bestmatch"
    :
        "The Westy", "categories"
    :
        [{"alias": "sportsbars", "title": "Sports Bars"}, {
            "alias": "cocktailbars",
            "title": "Cocktail Bars"
        }, {"alias": "newamerican", "title": "American (New)"}], "review_count"
    :
        124, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "North Delridge"
:
    {
        "bestmatch"
    :
        "Pearls Tea & Cafe", "categories"
    :
        [{"alias": "coffee", "title": "Coffee & Tea"}, {
            "alias": "sandwiches",
            "title": "Sandwiches"
        }, {"alias": "creperies", "title": "Creperies"}], "review_count"
    :
        157, "rating"
    :
        4.5, "price"
    :
        "$"
    }
,
    "Greenwood"
:
    {
        "bestmatch"
    :
        "Valhalla Sandwiches", "categories"
    :
        [{"alias": "sandwiches", "title": "Sandwiches"}], "review_count"
    :
        68, "rating"
    :
        5, "price"
    :
        "$$"
    }
,
    "Leschi"
:
    {
        "bestmatch"
    :
        "Meet the Moon", "categories"
    :
        [{"alias": "desserts", "title": "Desserts"}, {
            "alias": "breakfast_brunch",
            "title": "Breakfast & Brunch"
        }, {"alias": "bars", "title": "Bars"}], "review_count"
    :
        165, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "Riverview"
:
    {
        "bestmatch"
    :
        "Portside Coffee Company", "categories"
    :
        [{"alias": "coffee", "title": "Coffee & Tea"}], "review_count"
    :
        15, "rating"
    :
        4.5, "price"
    :
        "$"
    }
,
    "Montlake"
:
    {
        "bestmatch"
    :
        "Fuel", "categories"
    :
        [{"alias": "coffee", "title": "Coffee & Tea"}], "review_count"
    :
        60, "rating"
    :
        4, "price"
    :
        "$"
    }
,
    "Green Lake"
:
    {
        "bestmatch"
    :
        "Green Lake Park", "categories"
    :
        [{"alias": "parks", "title": "Parks"}, {"alias": "lakes", "title": "Lakes"}], "review_count"
    :
        401, "rating"
    :
        4.5, "price"
    :
        null
    }
,
    "Ravenna"
:
    {
        "bestmatch"
    :
        "Sod House Bakery", "categories"
    :
        [{"alias": "cafes", "title": "Cafes"}, {"alias": "coffee", "title": "Coffee & Tea"}, {
            "alias": "bakeries",
            "title": "Bakeries"
        }], "review_count"
    :
        65, "rating"
    :
        4.5, "price"
    :
        "$"
    }
,
    "Crown Hill"
:
    {
        "bestmatch"
    :
        "Wild Mountain Cafe", "categories"
    :
        [{"alias": "tradamerican", "title": "American (Traditional)"}, {
            "alias": "breakfast_brunch",
            "title": "Breakfast & Brunch"
        }], "review_count"
    :
        363, "rating"
    :
        4, "price"
    :
        "$$"
    }
,
    "Madrona"
:
    {
        "bestmatch"
    :
        "Bottlehouse", "categories"
    :
        [{"alias": "wine_bars", "title": "Wine Bars"}, {
            "alias": "tapasmallplates",
            "title": "Tapas\/Small Plates"
        }], "review_count"
    :
        228, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "Bitter Lake"
:
    {
        "bestmatch"
    :
        "Forno Pizza", "categories"
    :
        [{"alias": "pizza", "title": "Pizza"}, {"alias": "diners", "title": "Diners"}], "review_count"
    :
        127, "rating"
    :
        4, "price"
    :
        "$$"
    }
,
    "Olympic Manor"
:
    {
        "bestmatch"
    :
        "Taki's Mad Greek", "categories"
    :
        [{"alias": "greek", "title": "Greek"}, {"alias": "mediterranean", "title": "Mediterranean"}], "review_count"
    :
        199, "rating"
    :
        4, "price"
    :
        "$$"
    }
,
    "Victory Heights"
:
    {
        "bestmatch"
    :
        "Hydra Clean Northwest", "categories"
    :
        [{"alias": "carpet_cleaning", "title": "Carpet Cleaning"}], "review_count"
    :
        39, "rating"
    :
        5, "price"
    :
        null
    }
,
    "Phinney Ridge"
:
    {
        "bestmatch"
    :
        "The Dray", "categories"
    :
        [{"alias": "beer_and_wine", "title": "Beer, Wine & Spirits"}, {
            "alias": "sandwiches",
            "title": "Sandwiches"
        }], "review_count"
    :
        179, "rating"
    :
        4.5, "price"
    :
        "$$"
    }
,
    "Bryant"
:
    {
        "bestmatch"
    :
        "Seattle Sunshine Coffee", "categories"
    :
        [{"alias": "cafes", "title": "Cafes"}, {"alias": "coffee", "title": "Coffee & Tea"}, {
            "alias": "sandwiches",
            "title": "Sandwiches"
        }], "review_count"
    :
        30, "rating"
    :
        5, "price"
    :
        "$"
    }
}


/***/ }),
/* 30 */
/***/ (function(module, exports) {

/**
 * Created by meredith on 5/25/16.
 */

var TextUtil = {

    calculateNumLevels: function (aspectRatio, phrase, addtlLevel, forcedHorizontal, orientation) {

        var numLevels;

        if (forcedHorizontal && aspectRatio > 1.2) { //flat and wide, but horizontal text orientation (left to right)
            numLevels = 1;
            numLevels += Math.floor(phrase.length / 10);

            if (aspectRatio < 1.5) {
                //square-ish...add more levels
                numLevels += Math.floor(phrase.length / 8);
            }

        } else {
            numLevels = Math.ceil(aspectRatio + addtlLevel);
            numLevels += Math.floor(phrase.length / 12);
        }

        return numLevels;

    },

    insertSpaces: function (phrase) {
        var spaceAgumentedPhrase = "";
        for (var i = 0; i < phrase.length - 1; i++) {
            spaceAgumentedPhrase += phrase.charAt(i) + " ";
        }
        spaceAgumentedPhrase += phrase.charAt(phrase.length - 1);
        return spaceAgumentedPhrase;
    },

    fillNeighborhoodText: function (neighborhoodRectangles, phrase, d, displayBounds, displayText, rectDatabase) {

        if (phrase != null && neighborhoodRectangles != null) {

            phrase = phrase.toUpperCase();
            var viableRectangles;

            viableRectangles = TextUtil.filterViableRectangles(neighborhoodRectangles, d);

            if (viableRectangles != null) {
                if (rectDatabase[d.properties.name] != null &&
                    rectDatabase[d.properties.name].manual != null &&
                    USE_RECTANGLE_DATABASE) {
                    //fill text in rectangles based on
                    //instructions delineated in rectangle database
                    TextUtil.populateTextAlg2(viableRectangles, phrase, displayBounds, displayText, d);
                } else {
                    //populateTextAreaRatio(viableRectangles, phrase, displayBounds, displayText, d);
                    TextUtil.populateTextAlg1(viableRectangles, phrase, displayBounds, displayText, d);
                }
            }
        }
    },

    //filter rectangles that are unsuitable to be filled with text
    //i.e. null, too long and skinny, area too small
    filterViableRectangles: function (neighborhoodRectangles, d) {
        //keep track of how many rectangles are actually viable, i.e. big enough
        var nextIndexInViableRectangles = 0;
        var viableRectangles = [];

        var areaSum = 0;


        //compute total area and find viable rectangles
        for (var i = 0; i < neighborhoodRectangles.length; i++) {
            if (neighborhoodRectangles[i].rect != null) {
                var rectArea = neighborhoodRectangles[i].rect[0].width * neighborhoodRectangles[i].rect[0].height;
                var aspectRatio = neighborhoodRectangles[i].rect[0].width / neighborhoodRectangles[i].rect[0].height;
                if (rectArea > AREA_CUTOFF && aspectRatio < 20) {
                    viableRectangles[nextIndexInViableRectangles] = {
                        rect: neighborhoodRectangles[i].rect,
                        area: rectArea,
                        corners: RectangleGenerator.findRectangleCorners(neighborhoodRectangles[i].rect),
                        aspectRatio: aspectRatio,
                        id: "rect_" + neighborhoodRectangles[i].num + "_" + neighborhoodRectangles[i].location
                    };
                    areaSum += rectArea;
                    nextIndexInViableRectangles++;
                }
            }
        }

        return viableRectangles;
    },


    //pretty broken
    populateTextAreaRatio: function (viableRectangles, phrase, displayBounds, displayText, d) {

        var heightOfEachLevel = 10;

        //keep track of next available portion of phrase
        var currIndexInPhrase = 0;

        for (var i = 0; i < viableRectangles.length; i++) {

            //find area ratio for given rectangle
            //var areaRatio = (viableRectangles[i][0].width * viableRectangles[i][0].height) / areaSum;

            //use area ratio weighting all rectangles the same
            var areaRatio = 1 / viableRectangles.length;

            //use area ratio to partition phrase
            var numChars = Math.floor(areaRatio * phrase.length);
            var myChars = phrase.substring(currIndexInPhrase, currIndexInPhrase + numChars);

            currIndexInPhrase += numChars;

            var numHorizontalLevels = (viableRectangles[i].rect[0].height / heightOfEachLevel);

            //maybe do this somewhere with greater scope?
            var rectCoords = RectangleGenerator.findRectangleCorners(viableRectangles[i].rect);

            if (displayBounds) {
                //for debug: mark corners
                DebugTool.markFourCorners(rectCoords.topY, rectCoords.lowY, rectCoords.leftX, rectCoords.rightX);
            }

            //save place in current set of chars
            var currIndexInMyChars = 0;
            var charsInEachLevel = Math.floor((1 / numHorizontalLevels) * myChars.length);

            //populate each horizontal level with text
            for (var j = 1; j <= numHorizontalLevels; j++) {

                //generate path for given horizontal level
                var startPathX = rectCoords.leftX;
                var startPathY = rectCoords.topY + (j * heightOfEachLevel);

                var endPathX = rectCoords.rightX;
                var endPathY = startPathY;

                var levelString
                if (j == Math.round(numHorizontalLevels)) {
                    levelString = myChars.substring(currIndexInMyChars, myChars.length);
                } else {
                    levelString = myChars.substring(currIndexInMyChars, currIndexInMyChars + charsInEachLevel);
                }
                currIndexInMyChars += charsInEachLevel;

                var pathFill;
                if (displayBounds) {
                    pathFill = "black";
                } else {
                    pathFill = "none";
                }

                var pathString = "M" + startPathX + "," + startPathY + "L" + endPathX + "," + endPathY;
                svg.append("path")
                    .attr("id", "innerPath_" + d.id + "_" + (i + 1) + "_" + j)
                    .attr("d", pathString)
                    .style("fill", "none")
                    .style('stroke', pathFill);

                if (displayText) {
                    svg.append("text")
                        .append("textPath")
                        .attr("xlink:href", "#" + "innerPath_" + d.id + "_" + (i + 1) + "_" + j)
                        .style("text-anchor", "middle")
                        .text(levelString)
                        .attr("font-size", viableRectangles[i].rect[0].width / 5)
                        .attr("startOffset", "50%")
                        .attr("startOffset", "50%");
                }

            }
        }
    },


    //pre: phrase != null && viableRectangles != null
    populateTextAlg1: function (viableRectangles, phrase, displayBounds, displayText, d) {

        //first letter goes in first viable rectangle
        //An angle of zero means that the longer side of the polygon
        // will be aligned with the x axis. An angle of +90 and/or -90 means that the
        // longer side of the polygon (the width) will be aligned with the y axis.
        if (displayText) {

            if (viableRectangles.length > 1) {

                var maxArea = viableRectangles[0].area;
                var indexOfMaxArea = 0;
                var aspectRatioBiggestRect = viableRectangles[0].aspectRatio;

                //find biggest rectangle, use for majority of text
                for (var i = 1; i < viableRectangles.length; i++) {
                    var currArea = viableRectangles[i].area;
                    if (currArea > maxArea) {
                        indexOfMaxArea = i;
                        maxArea = currArea;
                        aspectRatioBiggestRect = viableRectangles[i].aspectRatio;
                    }
                }

                //apply padding to center rectangle
                viableRectangles[indexOfMaxArea] = RectangleGenerator.applyPadding(viableRectangles[indexOfMaxArea]);

                //if there are viable rectangles appearing before biggest (i.e. top and left), fill with one letter each
                var currIndex = 0;
                var currRectIndex = 0;
                while (currRectIndex < indexOfMaxArea) {

                    //get current rectangle
                    var currRect = viableRectangles[currIndex];

                    //if currRect is actually viable
                    if (currRect.aspectRatio < 4) {

                        //append path and letter
                        var currLetter = phrase.substring(currIndex, currIndex + 1);
                        appendSingleLetter(currRect, currLetter, d);
                        currIndex++;
                    }
                    currRectIndex++;
                }

                var currIndexFromEnd = viableRectangles.length - 1;
                var countLettersOffEnd = 0;

                while (currIndexFromEnd > indexOfMaxArea) {

                    var currRect = viableRectangles[currIndexFromEnd];

                    if (currRect.aspectRatio < 4) {
                        //append path and letter
                        var currLetter = phrase.charAt(phrase.length - 1 - countLettersOffEnd);
                        appendSingleLetter(currRect, currLetter, d);
                        countLettersOffEnd++;
                    }
                    currIndexFromEnd--;
                }

                //fill largest rectangle with wrapped text
                //pass phrase with first letters chopped off (depending on how many got their own rectangles) and
                //last letter chopped
                //TextUtil.fillRectWithText(phrase.substring(currIndex, phrase.length - (countLettersOffEnd)), viableRectangles[indexOfMaxArea]);
                TextUtil.fillRectTextManual(phrase.substring(currIndex,
                        phrase.length - (countLettersOffEnd)), viableRectangles[indexOfMaxArea],
                    displayText, displayBounds, d);

            } else if (viableRectangles.length == 1) {
                //use entire phrase to fill only viable rectangle
                //TextUtil.fillRectWithText(phrase, viableRectangles[0]);
                TextUtil.fillRectTextManual(phrase, viableRectangles[0], displayText, displayBounds, d);
            }


        }

        //last letter goes in last viable rectangle


    },


    populateTextAlg2: function (viableRectangles, phrase, displayBounds, displayText, d) {
        //use multiple rectangles to fill text
        if (displayText) {

            var nextAvailableIndex = 0;

            //take them as they come: if rectangle wants one char, give it one char
            for (var i = 0; i < viableRectangles.length; i++) {

                var phraseChunk;

                if (viableRectangles[i].rect[4] === "singleChar") {
                    phraseChunk = phrase.charAt(nextAvailableIndex);
                    nextAvailableIndex++;
                    appendSingleLetter(viableRectangles[i], phraseChunk, d);
                } else {

                    //var indexStart = Math.floor(viableRectangles[i].rect[3][0] * phrase.length);
                    var indexStart = nextAvailableIndex;

                    var indexEnd = Math.floor(viableRectangles[i].rect[3][1] * phrase.length);

                    //special case: last letter as standalone: take from preceding rectangle
                    if (i == viableRectangles.length - 2 &&
                        viableRectangles[i + 1].rect[4] == "singleChar") {
                        indexEnd--;
                    }

                    if (indexStart <= indexEnd) {
                        phraseChunk = phrase.substring(indexStart, indexEnd);
                    } else {
                        phraseChunk = " ";
                    }

                    viableRectangles[i] = RectangleGenerator.applyPadding(viableRectangles[i]);

                    nextAvailableIndex = indexEnd;

                    TextUtil.fillRectTextManual(phraseChunk, viableRectangles[i], displayText,
                        displayBounds, d);
                }

            }
        }
    },


    //fill rectangle using svg wrapping from d3Plus
    fillRectWithText: function (phrase, rectangle) {


        //inserting spaces in between letters so that d3plus will wrap text mid-word
        var spaceAugmentedText = TextUtil.insertSpaces(phrase);

        //middle of phrase goes in big rectangle
        var newText = svg.append("text")
            .text(spaceAugmentedText)
            .attr("font-family", font);
        //.attr("font-size", "15pt");

        //var newText = phrase.substring(1);
        //
        //DebugTool.markFourCorners(
        //    rectangle.corners.topY,
        //    rectangle.corners.lowY,
        //    rectangle.corners.leftX,
        //    rectangle.corners.rightX
        //);

        var height = rectangle.corners.lowY - rectangle.corners.topY;
        var width = rectangle.corners.rightX - rectangle.corners.leftX;

        var text = d3plus.textwrap()
            .height(height)
            .width(width)
            .container(newText)
            .x(rectangle.corners.leftX)
            .y(rectangle.corners.topY)
            //.text(newText)
            .resize(true)
            .align("center")
            .draw();

        //text.attr("letter-spacing", 3);
    },


    fillRectTextManual: function (phrase, rectangle, displayText, displayBounds, d) {

        var verticalDistance = rectangle.corners.lowY - rectangle.corners.topY;
        var horizontalDistance = rectangle.corners.rightX - rectangle.corners.leftX;

        //true if rectangle is tall and skinny
        var horizontalOrientation = verticalDistance > horizontalDistance || rectangle.rect[4] == "horizontalText";

        var orientation = horizontalOrientation ? "horizontal" : "vertical";

        var numLevels;

        if (rectangle.rect[4] === "horizontalText") { //force rectangle to use horizontal slicing
            //find num levels
            numLevels = TextUtil.calculateNumLevels(rectangle.aspectRatio, phrase, 1, true, orientation);
        } else {
            numLevels = TextUtil.calculateNumLevels(rectangle.aspectRatio, phrase, 1, false, orientation); //Math.round(rectangle.aspectRatio) + 1
        }

        var phrasePieces = [];
        var indexInPhrase = 0; //next available letter

        for (var i = 0; i < numLevels; i++) {
            var piece = "";
            var bound = phrase.length / numLevels;

            while ((indexInPhrase < ((i + 1) * bound)) && (indexInPhrase < phrase.length)) {
                piece += phrase.charAt(indexInPhrase);
                indexInPhrase++;
            }

            phrasePieces[i] = piece;
        }
        var rectCoords = RectangleGenerator.findRectangleCorners(rectangle.rect);

        if (orientation == "horizontal") { //taller
            //split rectangle into four portions and find lower edge of each for text path

            //x coords don't change
            var startPathX = rectCoords.leftX;
            var endPathX = rectCoords.rightX;
            var verticalText = false;

            var widthOfSlice = horizontalDistance;
            var heightOfSlice = verticalDistance / numLevels;

            for (var k = 1; k <= numLevels; k++) {

                //current phrase piece
                var currPhrase = phrasePieces[k - 1];

                //find y coords
                var startPathY = rectCoords.topY + (k * (verticalDistance / numLevels));
                var endPathY = startPathY;

                appendPathAndText(startPathX, startPathY, endPathX, endPathY,
                    currPhrase, d, k, displayText, displayBounds, verticalText, widthOfSlice,
                    heightOfSlice, rectangle.id);
            }
        } else { //wider and flatter: make vertical slices

            //y coords don't change
            var startPathY = rectCoords.topY;
            var endPathY = rectCoords.lowY;
            var verticalText = true;

            var widthOfSlice = verticalDistance;
            var heightOfSlice = horizontalDistance / numLevels;

            for (var k = numLevels; k >= 1; k--) {

                //current phrase piece
                var currPhrase = phrasePieces[numLevels - k];

                //find x coords
                var startPathX = rectCoords.leftX + ((k - 1) * (horizontalDistance / numLevels));
                var endPathX = startPathX;

                appendPathAndText(startPathX, startPathY, endPathX, endPathY,
                    currPhrase, d, k, displayText, displayBounds, verticalText, widthOfSlice,
                    heightOfSlice, rectangle.id);
            }
        }


    },

    slicePhrase: function (numPieces, phrase) {
        var newbie = [];
        var pieceLength = phrase.length / numPieces;
        for (var i = 0; i < numPieces; i++) {
            newbie[i] = phrase.substring(i * pieceLength, (i + 1) * pieceLength);
        }

        //pick up extras. put them in last slot.
        if (numPieces * pieceLength < phrase.length) {
            var leftovers = phrase.length - numPieces * pieceLength;
            for (var i = numPieces * pieceLength; i < phrase.length; i++) {
                newbie[numPieces - 1] += phrase.charAt(i);
            }
        }

        return newbie;
    },

    appendCharacterIntoRectangle: function (char, rectangle, svg, d, tag, padding,
                                            displayText, displayBounds, TEXT_SIZE_MULTIPLIER,
                                            font, TextToSVG) {


        var startPathX,
            startPathY,
            endPathX,
            endPathY,
            verticalText,
            widthOfSlice,
            heightOfSlice,
            rectangleId;

        if (rectangle[0].angle == 0 || rectangle[0].angle == 180) {
            startPathX = rectangle[0].cx - (rectangle[0].width / 2);
            startPathY = rectangle[0].cy + (rectangle[0].height / 2);
            endPathX = startPathX + rectangle[0].width;
            widthOfSlice = rectangle[0].width;
            heightOfSlice = rectangle[0].height;
        } else { //rectangle angle == 90 || 270
            startPathX = rectangle[0].cx - (rectangle[0].height / 2);
            startPathY = rectangle[0].cy + (rectangle[0].width / 2);
            endPathX = startPathX + rectangle[0].height;
            widthOfSlice = rectangle[0].height;
            heightOfSlice = rectangle[0].width;
        }

        //apply padding
        var paddingScaledWidth = padding * widthOfSlice;
        var paddingScaledHeight = padding * heightOfSlice;
        startPathX += paddingScaledWidth;
        startPathY -= paddingScaledHeight;
        endPathX -= paddingScaledWidth;
        widthOfSlice -= 2 * paddingScaledWidth;
        heightOfSlice -= paddingScaledHeight;


        endPathY = startPathY;
        verticalText = false;
        rectangleId = d.properties.name + "_inner";

        var pathAndText = TextUtil.appendPathAndText(startPathX, startPathY, endPathX, endPathY, char, d, tag, displayText,
            displayBounds, verticalText, widthOfSlice, heightOfSlice, rectangleId, svg, TEXT_SIZE_MULTIPLIER, font);

        //return character that you just appended
        return pathAndText;
    },

    // like append path and text, but using char converted to svg
    appendChar: function (startPathX, startPathY,
                          phrase, k, displayText, displayBounds,
                          rectangleId, svg, TEXT_SIZE_MULTIPLIER, font,
                          rectangle, textToSVG, raphael) {

        var textSize = 5;

        var defaultOptions = {
            "x": startPathX,
            "y": startPathY,
            "fontSize": textSize
        };

        // just use this one for now
        var bestPath = textToSVG.getD(phrase.toUpperCase(), defaultOptions);
        var charToBig = false;
        var shapeG = svg.append("g");

        // canvas for trying out char sizes - who even knows if these are the right dimensions
        var paper = raphael(-500, -500, 320, 200);
        while (!charToBig) {

            // if char is normal,
            // convert text to svg
            var options = {
                "x": startPathX,
                "y": startPathY,
                "fontSize": textSize
            };

            const charPath = textToSVG.getD(phrase.toUpperCase(), options);
            var countOutOfBounds = 0; // count num points found to be outside of the containing polygon
            var stopIterating = false;
            var charPaperPath = paper.path(charPath);
            var numHitTestPoints = 20;
            var totalLength = charPaperPath.getTotalLength();
            var lengthIncrement = totalLength * 1.0 / numHitTestPoints;

            // check coords of char path, make sure they are inside of polygon
            for (var curr = 0; curr < numHitTestPoints; curr++) {
                var point = charPaperPath.getPointAtLength(lengthIncrement * curr);
                if (!point) {
                    console.log("found undefined point in appendChar");
                }

                // is point inside of polygon?
                if (!point || !PolyK.ContainsPoint(rectangle.polygon, point.x, point.y)) {
                    countOutOfBounds++;
                    if (countOutOfBounds > 2) {
                        stopIterating = true;
                        break;
                    }
                }
            }

            if (!stopIterating) {
                bestPath = charPath;
                textSize += 1;
            } else {
                charToBig = true;
            }

        }

        var path = shapeG.append("path")
            .attr("class", "charSVGThing")
            .attr("d", bestPath)
            .style("fill", "black");
    },

    // only works with single polygons
    pathToArray: function (path) {
        var pathCoords = path.substring(1).split('L');
        var result = [];

        for (var i = 0; i < pathCoords.length; i++) {
            var bothCoords;
            if (pathCoords[i].indexOf(',') != -1) {
                bothCoords = pathCoords[i].split(',');
            } else {
                bothCoords = pathCoords[i].split(' ');
            }
            result[i * 2] = parseFloat(bothCoords[0]);
            result[(i * 2) + 1] = parseFloat(bothCoords[1]);
        }
        return result;
    },


    // used in testGrid
    appendPathAndText: function (startPathX, startPathY, endPathX, endPathY,
                                 phrase, d, k, displayText, displayBounds, verticalText, widthOfSlice,
                                 heightOfSlice, rectangleId, svg, TEXT_SIZE_MULTIPLIER, font) {

        var pathStroke = displayBounds ? "black" : "none";

        var pathString = "M" + startPathX + "," + startPathY + "L" + endPathX + "," + endPathY;
        var path = svg.append("path")
            .attr("id", "innerPath_" + rectangleId + "_" + k)
            .attr("d", pathString)
            .style("fill", "none")
            .style('stroke', pathStroke);

        var textSize = 1;

        var phantomSvg = d3.select("body").append("svg");
        var text = phantomSvg.append("text")
            .text(phrase)
            .attr("font-size", textSize + "pt");
        var bbox = text.node().getBoundingClientRect();

        var widthTransform = bbox.width;
        var heightTransform = bbox.height;

        var eBrake = true;

        while (widthTransform < widthOfSlice && heightTransform < heightOfSlice && eBrake) {

            textSize++;

            text = phantomSvg.append("text")
                .text(phrase)
                .attr("font-size", textSize + "pt");

            //var textNode = document.getElementById("t1");
            bbox = text.node().getBBox();
            widthTransform = bbox.width;
            heightTransform = bbox.height;

            if (textSize > 25) {
                eBrake = false;
            }

        }

        //use length of bbox, amt of characters on line and length of rectangle to
        //determine spacing in between rectangles
        //var extraSpace = widthOfSlice - widthTransform;
        //var spacePerChar = extraSpace / phrase.length;
        //.attr("letter-spacing", spacePerChar + "pt")

        var text = svg.append("text")
            .append("textPath")
            .attr("xlink:href", "#" + "innerPath_" + rectangleId + "_" + k)
            .style("text-anchor", "middle")
            .attr("startOffset", "50%")
            .text(phrase)
            .attr("font-size", (textSize * TEXT_SIZE_MULTIPLIER) + "pt")
            .attr("font-family", font)
            .attr("class", ".remove-me");

        // remove all of the stuff we used for iterating
        phantomSvg.remove();

        //return path and text
        var result = [path, text]; // these get removed by calling function if they want to
        return result;

    },


    appendCharacterAsSVG: function (char, gridUnit, svg, d, tag, padding,
                                    displayText, displayBounds, TEXT_SIZE_MULTIPLIER,
                                    font, textToSVG, raphael) {

        var startPathX,
            startPathY,
            rectangleId,
            widthOfSlice,
            heightOfSlice;

        if (gridUnit[0].angle == 0 || gridUnit[0].angle == 180) {
            startPathX = gridUnit[0].cx - (gridUnit[0].width / 2);
            startPathY = gridUnit[0].cy + (gridUnit[0].height / 2);
            widthOfSlice = gridUnit[0].width;
            heightOfSlice = gridUnit[0].height;
        } else { //rectangle angle == 90 || 270
            startPathX = gridUnit[0].cx - (gridUnit[0].height / 2);
            startPathY = gridUnit[0].cy + (gridUnit[0].width / 2);
            widthOfSlice = gridUnit[0].height;
            heightOfSlice = gridUnit[0].width;
        }

        //apply padding
        var paddingScaledWidth = padding * widthOfSlice;
        var paddingScaledHeight = padding * heightOfSlice;
        startPathX += paddingScaledWidth;
        startPathY -= paddingScaledHeight;
        rectangleId = d.properties.name + "_inner";

        TextUtil.appendChar(startPathX, startPathY, char, tag, displayText,
            displayBounds, rectangleId, svg, TEXT_SIZE_MULTIPLIER, font,
            gridUnit, textToSVG, raphael);

    },

    arrayToPath: function(oneDArray) {
        var result = "M";
        if (oneDArray.length > 0)  {
            result += oneDArray[0] + "," + oneDArray[1];
            for (var i = 2; i < oneDArray.length; i += 2) {
                result += "L" + oneDArray[i] + "," + oneDArray[i+1];
            }
            result += 'Z';
        }
        return result;
    }


};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(31)
var ieee754 = __webpack_require__(33)
var isArray = __webpack_require__(34)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(51)))

/***/ }),
/* 33 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 34 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Drawing utility functions.



// Draw a line on the given context from point `x1,y1` to point `x2,y2`.
function line(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

exports.line = line;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The Font object



var path = __webpack_require__(3);
var sfnt = __webpack_require__(45);
var encoding = __webpack_require__(4);
var glyphset = __webpack_require__(6);
var Substitution = __webpack_require__(39);
var util = __webpack_require__(23);

/**
 * @typedef FontOptions
 * @type Object
 * @property {Boolean} empty - whether to create a new empty font
 * @property {string} familyName
 * @property {string} styleName
 * @property {string=} fullName
 * @property {string=} postScriptName
 * @property {string=} designer
 * @property {string=} designerURL
 * @property {string=} manufacturer
 * @property {string=} manufacturerURL
 * @property {string=} license
 * @property {string=} licenseURL
 * @property {string=} version
 * @property {string=} description
 * @property {string=} copyright
 * @property {string=} trademark
 * @property {Number} unitsPerEm
 * @property {Number} ascender
 * @property {Number} descender
 * @property {Number} createdTimestamp
 * @property {string=} weightClass
 * @property {string=} widthClass
 * @property {string=} fsSelection
 */

/**
 * A Font represents a loaded OpenType font file.
 * It contains a set of glyphs and methods to draw text on a drawing context,
 * or to get a path representing the text.
 * @exports opentype.Font
 * @class
 * @param {FontOptions}
 * @constructor
 */
function Font(options) {
    options = options || {};

    if (!options.empty) {
        // Check that we've provided the minimum set of names.
        util.checkArgument(options.familyName, 'When creating a new Font object, familyName is required.');
        util.checkArgument(options.styleName, 'When creating a new Font object, styleName is required.');
        util.checkArgument(options.unitsPerEm, 'When creating a new Font object, unitsPerEm is required.');
        util.checkArgument(options.ascender, 'When creating a new Font object, ascender is required.');
        util.checkArgument(options.descender, 'When creating a new Font object, descender is required.');
        util.checkArgument(options.descender < 0, 'Descender should be negative (e.g. -512).');

        // OS X will complain if the names are empty, so we put a single space everywhere by default.
        this.names = {
            fontFamily: {en: options.familyName || ' '},
            fontSubfamily: {en: options.styleName || ' '},
            fullName: {en: options.fullName || options.familyName + ' ' + options.styleName},
            postScriptName: {en: options.postScriptName || options.familyName + options.styleName},
            designer: {en: options.designer || ' '},
            designerURL: {en: options.designerURL || ' '},
            manufacturer: {en: options.manufacturer || ' '},
            manufacturerURL: {en: options.manufacturerURL || ' '},
            license: {en: options.license || ' '},
            licenseURL: {en: options.licenseURL || ' '},
            version: {en: options.version || 'Version 0.1'},
            description: {en: options.description || ' '},
            copyright: {en: options.copyright || ' '},
            trademark: {en: options.trademark || ' '}
        };
        this.unitsPerEm = options.unitsPerEm || 1000;
        this.ascender = options.ascender;
        this.descender = options.descender;
        this.createdTimestamp = options.createdTimestamp;
        this.tables = { os2: {
            usWeightClass: options.weightClass || this.usWeightClasses.MEDIUM,
            usWidthClass: options.widthClass || this.usWidthClasses.MEDIUM,
            fsSelection: options.fsSelection || this.fsSelectionValues.REGULAR
        } };
    }

    this.supported = true; // Deprecated: parseBuffer will throw an error if font is not supported.
    this.glyphs = new glyphset.GlyphSet(this, options.glyphs || []);
    this.encoding = new encoding.DefaultEncoding(this);
    this.substitution = new Substitution(this);
    this.tables = this.tables || {};
}

/**
 * Check if the font has a glyph for the given character.
 * @param  {string}
 * @return {Boolean}
 */
Font.prototype.hasChar = function(c) {
    return this.encoding.charToGlyphIndex(c) !== null;
};

/**
 * Convert the given character to a single glyph index.
 * Note that this function assumes that there is a one-to-one mapping between
 * the given character and a glyph; for complex scripts this might not be the case.
 * @param  {string}
 * @return {Number}
 */
Font.prototype.charToGlyphIndex = function(s) {
    return this.encoding.charToGlyphIndex(s);
};

/**
 * Convert the given character to a single Glyph object.
 * Note that this function assumes that there is a one-to-one mapping between
 * the given character and a glyph; for complex scripts this might not be the case.
 * @param  {string}
 * @return {opentype.Glyph}
 */
Font.prototype.charToGlyph = function(c) {
    var glyphIndex = this.charToGlyphIndex(c);
    var glyph = this.glyphs.get(glyphIndex);
    if (!glyph) {
        // .notdef
        glyph = this.glyphs.get(0);
    }

    return glyph;
};

/**
 * Convert the given text to a list of Glyph objects.
 * Note that there is no strict one-to-one mapping between characters and
 * glyphs, so the list of returned glyphs can be larger or smaller than the
 * length of the given string.
 * @param  {string}
 * @param  {GlyphRenderOptions} [options]
 * @return {opentype.Glyph[]}
 */
Font.prototype.stringToGlyphs = function(s, options) {
    options = options || this.defaultRenderOptions;
    var i;
    // Get glyph indexes
    var indexes = [];
    for (i = 0; i < s.length; i += 1) {
        var c = s[i];
        indexes.push(this.charToGlyphIndex(c));
    }
    var length = indexes.length;

    // Apply substitutions on glyph indexes
    if (options.features) {
        var script = options.script || this.substitution.getDefaultScriptName();
        var manyToOne = [];
        if (options.features.liga) manyToOne = manyToOne.concat(this.substitution.getFeature('liga', script, options.language));
        if (options.features.rlig) manyToOne = manyToOne.concat(this.substitution.getFeature('rlig', script, options.language));
        for (i = 0; i < length; i += 1) {
            for (var j = 0; j < manyToOne.length; j++) {
                var ligature = manyToOne[j];
                var components = ligature.sub;
                var compCount = components.length;
                var k = 0;
                while (k < compCount && components[k] === indexes[i + k]) k++;
                if (k === compCount) {
                    indexes.splice(i, compCount, ligature.by);
                    length = length - compCount + 1;
                }
            }
        }
    }

    // convert glyph indexes to glyph objects
    var glyphs = new Array(length);
    var notdef = this.glyphs.get(0);
    for (i = 0; i < length; i += 1) {
        glyphs[i] = this.glyphs.get(indexes[i]) || notdef;
    }
    return glyphs;
};

/**
 * @param  {string}
 * @return {Number}
 */
Font.prototype.nameToGlyphIndex = function(name) {
    return this.glyphNames.nameToGlyphIndex(name);
};

/**
 * @param  {string}
 * @return {opentype.Glyph}
 */
Font.prototype.nameToGlyph = function(name) {
    var glyphIndex = this.nameToGlyphIndex(name);
    var glyph = this.glyphs.get(glyphIndex);
    if (!glyph) {
        // .notdef
        glyph = this.glyphs.get(0);
    }

    return glyph;
};

/**
 * @param  {Number}
 * @return {String}
 */
Font.prototype.glyphIndexToName = function(gid) {
    if (!this.glyphNames.glyphIndexToName) {
        return '';
    }

    return this.glyphNames.glyphIndexToName(gid);
};

/**
 * Retrieve the value of the kerning pair between the left glyph (or its index)
 * and the right glyph (or its index). If no kerning pair is found, return 0.
 * The kerning value gets added to the advance width when calculating the spacing
 * between glyphs.
 * @param  {opentype.Glyph} leftGlyph
 * @param  {opentype.Glyph} rightGlyph
 * @return {Number}
 */
Font.prototype.getKerningValue = function(leftGlyph, rightGlyph) {
    leftGlyph = leftGlyph.index || leftGlyph;
    rightGlyph = rightGlyph.index || rightGlyph;
    var gposKerning = this.getGposKerningValue;
    return gposKerning ? gposKerning(leftGlyph, rightGlyph) :
        (this.kerningPairs[leftGlyph + ',' + rightGlyph] || 0);
};

/**
 * @typedef GlyphRenderOptions
 * @type Object
 * @property {string} [script] - script used to determine which features to apply. By default, 'DFLT' or 'latn' is used.
 *                               See https://www.microsoft.com/typography/otspec/scripttags.htm
 * @property {string} [language='dflt'] - language system used to determine which features to apply.
 *                                        See https://www.microsoft.com/typography/developers/opentype/languagetags.aspx
 * @property {boolean} [kerning=true] - whether to include kerning values
 * @property {object} [features] - OpenType Layout feature tags. Used to enable or disable the features of the given script/language system.
 *                                 See https://www.microsoft.com/typography/otspec/featuretags.htm
 */
Font.prototype.defaultRenderOptions = {
    kerning: true,
    features: {
        liga: true,
        rlig: true
    }
};

/**
 * Helper function that invokes the given callback for each glyph in the given text.
 * The callback gets `(glyph, x, y, fontSize, options)`.* @param  {string} text
 * @param {string} text - The text to apply.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 * @param  {Function} callback
 */
Font.prototype.forEachGlyph = function(text, x, y, fontSize, options, callback) {
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize !== undefined ? fontSize : 72;
    options = options || this.defaultRenderOptions;
    var fontScale = 1 / this.unitsPerEm * fontSize;
    var glyphs = this.stringToGlyphs(text, options);
    for (var i = 0; i < glyphs.length; i += 1) {
        var glyph = glyphs[i];
        callback(glyph, x, y, fontSize, options);
        if (glyph.advanceWidth) {
            x += glyph.advanceWidth * fontScale;
        }

        if (options.kerning && i < glyphs.length - 1) {
            var kerningValue = this.getKerningValue(glyph, glyphs[i + 1]);
            x += kerningValue * fontScale;
        }

        if (options.letterSpacing) {
            x += options.letterSpacing * fontSize;
        } else if (options.tracking) {
            x += (options.tracking / 1000) * fontSize;
        }
    }
};

/**
 * Create a Path object that represents the given text.
 * @param  {string} text - The text to create.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 * @return {opentype.Path}
 */
Font.prototype.getPath = function(text, x, y, fontSize, options) {
    var fullPath = new path.Path();
    this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
        var glyphPath = glyph.getPath(gX, gY, gFontSize);
        fullPath.extend(glyphPath);
    });

    return fullPath;
};

/**
 * Create an array of Path objects that represent the glyps of a given text.
 * @param  {string} text - The text to create.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 * @return {opentype.Path[]}
 */
Font.prototype.getPaths = function(text, x, y, fontSize, options) {
    var glyphPaths = [];
    this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
        var glyphPath = glyph.getPath(gX, gY, gFontSize);
        glyphPaths.push(glyphPath);
    });

    return glyphPaths;
};

/**
 * Draw the text on the given drawing context.
 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param  {string} text - The text to create.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 */
Font.prototype.draw = function(ctx, text, x, y, fontSize, options) {
    this.getPath(text, x, y, fontSize, options).draw(ctx);
};

/**
 * Draw the points of all glyphs in the text.
 * On-curve points will be drawn in blue, off-curve points will be drawn in red.
 * @param {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param {string} text - The text to create.
 * @param {number} [x=0] - Horizontal position of the beginning of the text.
 * @param {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param {GlyphRenderOptions=} options
 */
Font.prototype.drawPoints = function(ctx, text, x, y, fontSize, options) {
    this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
        glyph.drawPoints(ctx, gX, gY, gFontSize);
    });
};

/**
 * Draw lines indicating important font measurements for all glyphs in the text.
 * Black lines indicate the origin of the coordinate system (point 0,0).
 * Blue lines indicate the glyph bounding box.
 * Green line indicates the advance width of the glyph.
 * @param {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param {string} text - The text to create.
 * @param {number} [x=0] - Horizontal position of the beginning of the text.
 * @param {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param {GlyphRenderOptions=} options
 */
Font.prototype.drawMetrics = function(ctx, text, x, y, fontSize, options) {
    this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
        glyph.drawMetrics(ctx, gX, gY, gFontSize);
    });
};

/**
 * @param  {string}
 * @return {string}
 */
Font.prototype.getEnglishName = function(name) {
    var translations = this.names[name];
    if (translations) {
        return translations.en;
    }
};

/**
 * Validate
 */
Font.prototype.validate = function() {
    var warnings = [];
    var _this = this;

    function assert(predicate, message) {
        if (!predicate) {
            warnings.push(message);
        }
    }

    function assertNamePresent(name) {
        var englishName = _this.getEnglishName(name);
        assert(englishName && englishName.trim().length > 0,
               'No English ' + name + ' specified.');
    }

    // Identification information
    assertNamePresent('fontFamily');
    assertNamePresent('weightName');
    assertNamePresent('manufacturer');
    assertNamePresent('copyright');
    assertNamePresent('version');

    // Dimension information
    assert(this.unitsPerEm > 0, 'No unitsPerEm specified.');
};

/**
 * Convert the font object to a SFNT data structure.
 * This structure contains all the necessary tables and metadata to create a binary OTF file.
 * @return {opentype.Table}
 */
Font.prototype.toTables = function() {
    return sfnt.fontToTable(this);
};
/**
 * @deprecated Font.toBuffer is deprecated. Use Font.toArrayBuffer instead.
 */
Font.prototype.toBuffer = function() {
    console.warn('Font.toBuffer is deprecated. Use Font.toArrayBuffer instead.');
    return this.toArrayBuffer();
};
/**
 * Converts a `opentype.Font` into an `ArrayBuffer`
 * @return {ArrayBuffer}
 */
Font.prototype.toArrayBuffer = function() {
    var sfntTable = this.toTables();
    var bytes = sfntTable.encode();
    var buffer = new ArrayBuffer(bytes.length);
    var intArray = new Uint8Array(buffer);
    for (var i = 0; i < bytes.length; i++) {
        intArray[i] = bytes[i];
    }

    return buffer;
};

/**
 * Initiate a download of the OpenType font.
 */
Font.prototype.download = function(fileName) {
    var familyName = this.getEnglishName('fontFamily');
    var styleName = this.getEnglishName('fontSubfamily');
    fileName = fileName || familyName.replace(/\s/g, '') + '-' + styleName + '.otf';
    var arrayBuffer = this.toArrayBuffer();

    if (util.isBrowser()) {
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(window.TEMPORARY, arrayBuffer.byteLength, function(fs) {
            fs.root.getFile(fileName, {create: true}, function(fileEntry) {
                fileEntry.createWriter(function(writer) {
                    var dataView = new DataView(arrayBuffer);
                    var blob = new Blob([dataView], {type: 'font/opentype'});
                    writer.write(blob);

                    writer.addEventListener('writeend', function() {
                        // Navigating to the file will download it.
                        location.href = fileEntry.toURL();
                    }, false);
                });
            });
        },
        function(err) {
            throw new Error(err.name + ': ' + err.message);
        });
    } else {
        var fs = __webpack_require__(7);
        var buffer = util.arrayBufferToNodeBuffer(arrayBuffer);
        fs.writeFileSync(fileName, buffer);
    }
};
/**
 * @private
 */
Font.prototype.fsSelectionValues = {
    ITALIC:              0x001, //1
    UNDERSCORE:          0x002, //2
    NEGATIVE:            0x004, //4
    OUTLINED:            0x008, //8
    STRIKEOUT:           0x010, //16
    BOLD:                0x020, //32
    REGULAR:             0x040, //64
    USER_TYPO_METRICS:   0x080, //128
    WWS:                 0x100, //256
    OBLIQUE:             0x200  //512
};

/**
 * @private
 */
Font.prototype.usWidthClasses = {
    ULTRA_CONDENSED: 1,
    EXTRA_CONDENSED: 2,
    CONDENSED: 3,
    SEMI_CONDENSED: 4,
    MEDIUM: 5,
    SEMI_EXPANDED: 6,
    EXPANDED: 7,
    EXTRA_EXPANDED: 8,
    ULTRA_EXPANDED: 9
};

/**
 * @private
 */
Font.prototype.usWeightClasses = {
    THIN: 100,
    EXTRA_LIGHT: 200,
    LIGHT: 300,
    NORMAL: 400,
    MEDIUM: 500,
    SEMI_BOLD: 600,
    BOLD: 700,
    EXTRA_BOLD: 800,
    BLACK:    900
};

exports.Font = Font;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The Layout object is the prototype of Substition objects, and provides utility methods to manipulate
// common layout tables (GPOS, GSUB, GDEF...)



var check = __webpack_require__(1);

function searchTag(arr, tag) {
    /* jshint bitwise: false */
    var imin = 0;
    var imax = arr.length - 1;
    while (imin <= imax) {
        var imid = (imin + imax) >>> 1;
        var val = arr[imid].tag;
        if (val === tag) {
            return imid;
        } else if (val < tag) {
            imin = imid + 1;
        } else { imax = imid - 1; }
    }
    // Not found: return -1-insertion point
    return -imin - 1;
}

function binSearch(arr, value) {
    /* jshint bitwise: false */
    var imin = 0;
    var imax = arr.length - 1;
    while (imin <= imax) {
        var imid = (imin + imax) >>> 1;
        var val = arr[imid];
        if (val === value) {
            return imid;
        } else if (val < value) {
            imin = imid + 1;
        } else { imax = imid - 1; }
    }
    // Not found: return -1-insertion point
    return -imin - 1;
}

/**
 * @exports opentype.Layout
 * @class
 */
function Layout(font, tableName) {
    this.font = font;
    this.tableName = tableName;
}

Layout.prototype = {

    /**
     * Binary search an object by "tag" property
     * @instance
     * @function searchTag
     * @memberof opentype.Layout
     * @param  {Array} arr
     * @param  {string} tag
     * @return {number}
     */
    searchTag: searchTag,

    /**
     * Binary search in a list of numbers
     * @instance
     * @function binSearch
     * @memberof opentype.Layout
     * @param  {Array} arr
     * @param  {number} value
     * @return {number}
     */
    binSearch: binSearch,

    /**
     * Get or create the Layout table (GSUB, GPOS etc).
     * @param  {boolean} create - Whether to create a new one.
     * @return {Object} The GSUB or GPOS table.
     */
    getTable: function(create) {
        var layout = this.font.tables[this.tableName];
        if (!layout && create) {
            layout = this.font.tables[this.tableName] = this.createDefaultTable();
        }
        return layout;
    },

    /**
     * Returns all scripts in the substitution table.
     * @instance
     * @return {Array}
     */
    getScriptNames: function() {
        var layout = this.getTable();
        if (!layout) { return []; }
        return layout.scripts.map(function(script) {
            return script.tag;
        });
    },

    /**
     * Returns the best bet for a script name.
     * Returns 'DFLT' if it exists.
     * If not, returns 'latn' if it exists.
     * If neither exist, returns undefined.
     */
    getDefaultScriptName: function() {
        var layout = this.getTable();
        if (!layout) { return; }
        var hasLatn = false;
        for (var i = 0; i < layout.scripts.length; i++) {
            var name = layout.scripts[i].tag;
            if (name === 'DFLT') return name;
            if (name === 'latn') hasLatn = true;
        }
        if (hasLatn) return 'latn';
    },

    /**
     * Returns all LangSysRecords in the given script.
     * @instance
     * @param {string} [script='DFLT']
     * @param {boolean} create - forces the creation of this script table if it doesn't exist.
     * @return {Object} An object with tag and script properties.
     */
    getScriptTable: function(script, create) {
        var layout = this.getTable(create);
        if (layout) {
            script = script || 'DFLT';
            var scripts = layout.scripts;
            var pos = searchTag(layout.scripts, script);
            if (pos >= 0) {
                return scripts[pos].script;
            } else if (create) {
                var scr = {
                    tag: script,
                    script: {
                        defaultLangSys: { reserved: 0, reqFeatureIndex: 0xffff, featureIndexes: [] },
                        langSysRecords: []
                    }
                };
                scripts.splice(-1 - pos, 0, scr);
                return scr.script;
            }
        }
    },

    /**
     * Returns a language system table
     * @instance
     * @param {string} [script='DFLT']
     * @param {string} [language='dlft']
     * @param {boolean} create - forces the creation of this langSysTable if it doesn't exist.
     * @return {Object}
     */
    getLangSysTable: function(script, language, create) {
        var scriptTable = this.getScriptTable(script, create);
        if (scriptTable) {
            if (!language || language === 'dflt' || language === 'DFLT') {
                return scriptTable.defaultLangSys;
            }
            var pos = searchTag(scriptTable.langSysRecords, language);
            if (pos >= 0) {
                return scriptTable.langSysRecords[pos].langSys;
            } else if (create) {
                var langSysRecord = {
                    tag: language,
                    langSys: { reserved: 0, reqFeatureIndex: 0xffff, featureIndexes: [] }
                };
                scriptTable.langSysRecords.splice(-1 - pos, 0, langSysRecord);
                return langSysRecord.langSys;
            }
        }
    },

    /**
     * Get a specific feature table.
     * @instance
     * @param {string} [script='DFLT']
     * @param {string} [language='dlft']
     * @param {string} feature - One of the codes listed at https://www.microsoft.com/typography/OTSPEC/featurelist.htm
     * @param {boolean} create - forces the creation of the feature table if it doesn't exist.
     * @return {Object}
     */
    getFeatureTable: function(script, language, feature, create) {
        var langSysTable = this.getLangSysTable(script, language, create);
        if (langSysTable) {
            var featureRecord;
            var featIndexes = langSysTable.featureIndexes;
            var allFeatures = this.font.tables[this.tableName].features;
            // The FeatureIndex array of indices is in arbitrary order,
            // even if allFeatures is sorted alphabetically by feature tag.
            for (var i = 0; i < featIndexes.length; i++) {
                featureRecord = allFeatures[featIndexes[i]];
                if (featureRecord.tag === feature) {
                    return featureRecord.feature;
                }
            }
            if (create) {
                var index = allFeatures.length;
                // Automatic ordering of features would require to shift feature indexes in the script list.
                check.assert(index === 0 || feature >= allFeatures[index - 1].tag, 'Features must be added in alphabetical order.');
                featureRecord = {
                    tag: feature,
                    feature: { params: 0, lookupListIndexes: [] }
                };
                allFeatures.push(featureRecord);
                featIndexes.push(index);
                return featureRecord.feature;
            }
        }
    },

    /**
     * Get the lookup tables of a given type for a script/language/feature.
     * @instance
     * @param {string} [script='DFLT']
     * @param {string} [language='dlft']
     * @param {string} feature - 4-letter feature code
     * @param {number} lookupType - 1 to 8
     * @param {boolean} create - forces the creation of the lookup table if it doesn't exist, with no subtables.
     * @return {Object[]}
     */
    getLookupTables: function(script, language, feature, lookupType, create) {
        var featureTable = this.getFeatureTable(script, language, feature, create);
        var tables = [];
        if (featureTable) {
            var lookupTable;
            var lookupListIndexes = featureTable.lookupListIndexes;
            var allLookups = this.font.tables[this.tableName].lookups;
            // lookupListIndexes are in no particular order, so use naïve search.
            for (var i = 0; i < lookupListIndexes.length; i++) {
                lookupTable = allLookups[lookupListIndexes[i]];
                if (lookupTable.lookupType === lookupType) {
                    tables.push(lookupTable);
                }
            }
            if (tables.length === 0 && create) {
                lookupTable = {
                    lookupType: lookupType,
                    lookupFlag: 0,
                    subtables: [],
                    markFilteringSet: undefined
                };
                var index = allLookups.length;
                allLookups.push(lookupTable);
                lookupListIndexes.push(index);
                return [lookupTable];
            }
        }
        return tables;
    },

    /**
     * Returns the list of glyph indexes of a coverage table.
     * Format 1: the list is stored raw
     * Format 2: compact list as range records.
     * @instance
     * @param  {Object} coverageTable
     * @return {Array}
     */
    expandCoverage: function(coverageTable) {
        if (coverageTable.format === 1) {
            return coverageTable.glyphs;
        } else {
            var glyphs = [];
            var ranges = coverageTable.ranges;
            for (var i = 0; i < ranges; i++) {
                var range = ranges[i];
                var start = range.start;
                var end = range.end;
                for (var j = start; j <= end; j++) {
                    glyphs.push(j);
                }
            }
            return glyphs;
        }
    }

};

module.exports = Layout;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// opentype.js
// https://github.com/nodebox/opentype.js
// (c) 2015 Frederik De Bleser
// opentype.js may be freely distributed under the MIT license.

/* global DataView, Uint8Array, XMLHttpRequest  */



var inflate = __webpack_require__(50);

var encoding = __webpack_require__(4);
var _font = __webpack_require__(36);
var glyph = __webpack_require__(10);
var parse = __webpack_require__(0);
var bbox = __webpack_require__(9);
var path = __webpack_require__(3);
var util = __webpack_require__(23);

var cmap = __webpack_require__(12);
var cff = __webpack_require__(11);
var fvar = __webpack_require__(40);
var glyf = __webpack_require__(41);
var gpos = __webpack_require__(42);
var gsub = __webpack_require__(13);
var head = __webpack_require__(14);
var hhea = __webpack_require__(15);
var hmtx = __webpack_require__(16);
var kern = __webpack_require__(43);
var ltag = __webpack_require__(17);
var loca = __webpack_require__(44);
var maxp = __webpack_require__(18);
var _name = __webpack_require__(20);
var os2 = __webpack_require__(21);
var post = __webpack_require__(22);
var meta = __webpack_require__(19);

/**
 * The opentype library.
 * @namespace opentype
 */

// File loaders /////////////////////////////////////////////////////////
/**
 * Loads a font from a file. The callback throws an error message as the first parameter if it fails
 * and the font as an ArrayBuffer in the second parameter if it succeeds.
 * @param  {string} path - The path of the file
 * @param  {Function} callback - The function to call when the font load completes
 */
function loadFromFile(path, callback) {
    var fs = __webpack_require__(7);
    fs.readFile(path, function(err, buffer) {
        if (err) {
            return callback(err.message);
        }

        callback(null, util.nodeBufferToArrayBuffer(buffer));
    });
}
/**
 * Loads a font from a URL. The callback throws an error message as the first parameter if it fails
 * and the font as an ArrayBuffer in the second parameter if it succeeds.
 * @param  {string} url - The URL of the font file.
 * @param  {Function} callback - The function to call when the font load completes
 */
function loadFromUrl(url, callback) {
    var request = new XMLHttpRequest();
    request.open('get', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        if (request.status !== 200) {
            return callback('Font could not be loaded: ' + request.statusText);
        }

        return callback(null, request.response);
    };

    request.send();
}

// Table Directory Entries //////////////////////////////////////////////
/**
 * Parses OpenType table entries.
 * @param  {DataView}
 * @param  {Number}
 * @return {Object[]}
 */
function parseOpenTypeTableEntries(data, numTables) {
    var tableEntries = [];
    var p = 12;
    for (var i = 0; i < numTables; i += 1) {
        var tag = parse.getTag(data, p);
        var checksum = parse.getULong(data, p + 4);
        var offset = parse.getULong(data, p + 8);
        var length = parse.getULong(data, p + 12);
        tableEntries.push({tag: tag, checksum: checksum, offset: offset, length: length, compression: false});
        p += 16;
    }

    return tableEntries;
}

/**
 * Parses WOFF table entries.
 * @param  {DataView}
 * @param  {Number}
 * @return {Object[]}
 */
function parseWOFFTableEntries(data, numTables) {
    var tableEntries = [];
    var p = 44; // offset to the first table directory entry.
    for (var i = 0; i < numTables; i += 1) {
        var tag = parse.getTag(data, p);
        var offset = parse.getULong(data, p + 4);
        var compLength = parse.getULong(data, p + 8);
        var origLength = parse.getULong(data, p + 12);
        var compression;
        if (compLength < origLength) {
            compression = 'WOFF';
        } else {
            compression = false;
        }

        tableEntries.push({tag: tag, offset: offset, compression: compression,
            compressedLength: compLength, originalLength: origLength});
        p += 20;
    }

    return tableEntries;
}

/**
 * @typedef TableData
 * @type Object
 * @property {DataView} data - The DataView
 * @property {number} offset - The data offset.
 */

/**
 * @param  {DataView}
 * @param  {Object}
 * @return {TableData}
 */
function uncompressTable(data, tableEntry) {
    if (tableEntry.compression === 'WOFF') {
        var inBuffer = new Uint8Array(data.buffer, tableEntry.offset + 2, tableEntry.compressedLength - 2);
        var outBuffer = new Uint8Array(tableEntry.originalLength);
        inflate(inBuffer, outBuffer);
        if (outBuffer.byteLength !== tableEntry.originalLength) {
            throw new Error('Decompression error: ' + tableEntry.tag + ' decompressed length doesn\'t match recorded length');
        }

        var view = new DataView(outBuffer.buffer, 0);
        return {data: view, offset: 0};
    } else {
        return {data: data, offset: tableEntry.offset};
    }
}

// Public API ///////////////////////////////////////////////////////////

/**
 * Parse the OpenType file data (as an ArrayBuffer) and return a Font object.
 * Throws an error if the font could not be parsed.
 * @param  {ArrayBuffer}
 * @return {opentype.Font}
 */
function parseBuffer(buffer) {
    var indexToLocFormat;
    var ltagTable;

    // Since the constructor can also be called to create new fonts from scratch, we indicate this
    // should be an empty font that we'll fill with our own data.
    var font = new _font.Font({empty: true});

    // OpenType fonts use big endian byte ordering.
    // We can't rely on typed array view types, because they operate with the endianness of the host computer.
    // Instead we use DataViews where we can specify endianness.
    var data = new DataView(buffer, 0);
    var numTables;
    var tableEntries = [];
    var signature = parse.getTag(data, 0);
    if (signature === String.fromCharCode(0, 1, 0, 0)) {
        font.outlinesFormat = 'truetype';
        numTables = parse.getUShort(data, 4);
        tableEntries = parseOpenTypeTableEntries(data, numTables);
    } else if (signature === 'OTTO') {
        font.outlinesFormat = 'cff';
        numTables = parse.getUShort(data, 4);
        tableEntries = parseOpenTypeTableEntries(data, numTables);
    } else if (signature === 'wOFF') {
        var flavor = parse.getTag(data, 4);
        if (flavor === String.fromCharCode(0, 1, 0, 0)) {
            font.outlinesFormat = 'truetype';
        } else if (flavor === 'OTTO') {
            font.outlinesFormat = 'cff';
        } else {
            throw new Error('Unsupported OpenType flavor ' + signature);
        }

        numTables = parse.getUShort(data, 12);
        tableEntries = parseWOFFTableEntries(data, numTables);
    } else {
        throw new Error('Unsupported OpenType signature ' + signature);
    }

    var cffTableEntry;
    var fvarTableEntry;
    var glyfTableEntry;
    var gposTableEntry;
    var gsubTableEntry;
    var hmtxTableEntry;
    var kernTableEntry;
    var locaTableEntry;
    var nameTableEntry;
    var metaTableEntry;

    for (var i = 0; i < numTables; i += 1) {
        var tableEntry = tableEntries[i];
        var table;
        switch (tableEntry.tag) {
            case 'cmap':
                table = uncompressTable(data, tableEntry);
                font.tables.cmap = cmap.parse(table.data, table.offset);
                font.encoding = new encoding.CmapEncoding(font.tables.cmap);
                break;
            case 'fvar':
                fvarTableEntry = tableEntry;
                break;
            case 'head':
                table = uncompressTable(data, tableEntry);
                font.tables.head = head.parse(table.data, table.offset);
                font.unitsPerEm = font.tables.head.unitsPerEm;
                indexToLocFormat = font.tables.head.indexToLocFormat;
                break;
            case 'hhea':
                table = uncompressTable(data, tableEntry);
                font.tables.hhea = hhea.parse(table.data, table.offset);
                font.ascender = font.tables.hhea.ascender;
                font.descender = font.tables.hhea.descender;
                font.numberOfHMetrics = font.tables.hhea.numberOfHMetrics;
                break;
            case 'hmtx':
                hmtxTableEntry = tableEntry;
                break;
            case 'ltag':
                table = uncompressTable(data, tableEntry);
                ltagTable = ltag.parse(table.data, table.offset);
                break;
            case 'maxp':
                table = uncompressTable(data, tableEntry);
                font.tables.maxp = maxp.parse(table.data, table.offset);
                font.numGlyphs = font.tables.maxp.numGlyphs;
                break;
            case 'name':
                nameTableEntry = tableEntry;
                break;
            case 'OS/2':
                table = uncompressTable(data, tableEntry);
                font.tables.os2 = os2.parse(table.data, table.offset);
                break;
            case 'post':
                table = uncompressTable(data, tableEntry);
                font.tables.post = post.parse(table.data, table.offset);
                font.glyphNames = new encoding.GlyphNames(font.tables.post);
                break;
            case 'glyf':
                glyfTableEntry = tableEntry;
                break;
            case 'loca':
                locaTableEntry = tableEntry;
                break;
            case 'CFF ':
                cffTableEntry = tableEntry;
                break;
            case 'kern':
                kernTableEntry = tableEntry;
                break;
            case 'GPOS':
                gposTableEntry = tableEntry;
                break;
            case 'GSUB':
                gsubTableEntry = tableEntry;
                break;
            case 'meta':
                metaTableEntry = tableEntry;
                break;
        }
    }

    var nameTable = uncompressTable(data, nameTableEntry);
    font.tables.name = _name.parse(nameTable.data, nameTable.offset, ltagTable);
    font.names = font.tables.name;

    if (glyfTableEntry && locaTableEntry) {
        var shortVersion = indexToLocFormat === 0;
        var locaTable = uncompressTable(data, locaTableEntry);
        var locaOffsets = loca.parse(locaTable.data, locaTable.offset, font.numGlyphs, shortVersion);
        var glyfTable = uncompressTable(data, glyfTableEntry);
        font.glyphs = glyf.parse(glyfTable.data, glyfTable.offset, locaOffsets, font);
    } else if (cffTableEntry) {
        var cffTable = uncompressTable(data, cffTableEntry);
        cff.parse(cffTable.data, cffTable.offset, font);
    } else {
        throw new Error('Font doesn\'t contain TrueType or CFF outlines.');
    }

    var hmtxTable = uncompressTable(data, hmtxTableEntry);
    hmtx.parse(hmtxTable.data, hmtxTable.offset, font.numberOfHMetrics, font.numGlyphs, font.glyphs);
    encoding.addGlyphNames(font);

    if (kernTableEntry) {
        var kernTable = uncompressTable(data, kernTableEntry);
        font.kerningPairs = kern.parse(kernTable.data, kernTable.offset);
    } else {
        font.kerningPairs = {};
    }

    if (gposTableEntry) {
        var gposTable = uncompressTable(data, gposTableEntry);
        gpos.parse(gposTable.data, gposTable.offset, font);
    }

    if (gsubTableEntry) {
        var gsubTable = uncompressTable(data, gsubTableEntry);
        font.tables.gsub = gsub.parse(gsubTable.data, gsubTable.offset);
    }

    if (fvarTableEntry) {
        var fvarTable = uncompressTable(data, fvarTableEntry);
        font.tables.fvar = fvar.parse(fvarTable.data, fvarTable.offset, font.names);
    }

    if (metaTableEntry) {
        var metaTable = uncompressTable(data, metaTableEntry);
        font.tables.meta = meta.parse(metaTable.data, metaTable.offset);
        font.metas = font.tables.meta;
    }

    return font;
}

/**
 * Asynchronously load the font from a URL or a filesystem. When done, call the callback
 * with two arguments `(err, font)`. The `err` will be null on success,
 * the `font` is a Font object.
 * We use the node.js callback convention so that
 * opentype.js can integrate with frameworks like async.js.
 * @alias opentype.load
 * @param  {string} url - The URL of the font to load.
 * @param  {Function} callback - The callback.
 */
function load(url, callback) {
    var isNode = typeof window === 'undefined';
    var loadFn = isNode ? loadFromFile : loadFromUrl;
    loadFn(url, function(err, arrayBuffer) {
        if (err) {
            return callback(err);
        }
        var font;
        try {
            font = parseBuffer(arrayBuffer);
        } catch (e) {
            return callback(e, null);
        }
        return callback(null, font);
    });
}

/**
 * Synchronously load the font from a URL or file.
 * When done, returns the font object or throws an error.
 * @alias opentype.loadSync
 * @param  {string} url - The URL of the font to load.
 * @return {opentype.Font}
 */
function loadSync(url) {
    var fs = __webpack_require__(7);
    var buffer = fs.readFileSync(url);
    return parseBuffer(util.nodeBufferToArrayBuffer(buffer));
}

exports._parse = parse;
exports.Font = _font.Font;
exports.Glyph = glyph.Glyph;
exports.Path = path.Path;
exports.BoundingBox = bbox.BoundingBox;
exports.parse = parseBuffer;
exports.load = load;
exports.loadSync = loadSync;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The Substitution object provides utility methods to manipulate
// the GSUB substitution table.



var check = __webpack_require__(1);
var Layout = __webpack_require__(37);

/**
 * @exports opentype.Substitution
 * @class
 * @extends opentype.Layout
 * @param {opentype.Font}
 * @constructor
 */
var Substitution = function(font) {
    Layout.call(this, font, 'gsub');
};

// Check if 2 arrays of primitives are equal.
function arraysEqual(ar1, ar2) {
    var n = ar1.length;
    if (n !== ar2.length) { return false; }
    for (var i = 0; i < n; i++) {
        if (ar1[i] !== ar2[i]) { return false; }
    }
    return true;
}

// Find the first subtable of a lookup table in a particular format.
function getSubstFormat(lookupTable, format, defaultSubtable) {
    var subtables = lookupTable.subtables;
    for (var i = 0; i < subtables.length; i++) {
        var subtable = subtables[i];
        if (subtable.substFormat === format) {
            return subtable;
        }
    }
    if (defaultSubtable) {
        subtables.push(defaultSubtable);
        return defaultSubtable;
    }
}

Substitution.prototype = Layout.prototype;

/**
 * Create a default GSUB table.
 * @return {Object} gsub - The GSUB table.
 */
Substitution.prototype.createDefaultTable = function() {
    // Generate a default empty GSUB table with just a DFLT script and dflt lang sys.
    return {
        version: 1,
        scripts: [{
            tag: 'DFLT',
            script: {
                defaultLangSys: { reserved: 0, reqFeatureIndex: 0xffff, featureIndexes: [] },
                langSysRecords: []
            }
        }],
        features: [],
        lookups: []
    };
};

/**
 * List all single substitutions (lookup type 1) for a given script, language, and feature.
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @param {string} feature - 4-character feature name ('aalt', 'salt', 'ss01'...)
 * @return {Array} substitutions - The list of substitutions.
 */
Substitution.prototype.getSingle = function(feature, script, language) {
    var substitutions = [];
    var lookupTables = this.getLookupTables(script, language, feature, 1);
    for (var idx = 0; idx < lookupTables.length; idx++) {
        var subtables = lookupTables[idx].subtables;
        for (var i = 0; i < subtables.length; i++) {
            var subtable = subtables[i];
            var glyphs = this.expandCoverage(subtable.coverage);
            var j;
            if (subtable.substFormat === 1) {
                var delta = subtable.deltaGlyphId;
                for (j = 0; j < glyphs.length; j++) {
                    var glyph = glyphs[j];
                    substitutions.push({ sub: glyph, by: glyph + delta });
                }
            } else {
                var substitute = subtable.substitute;
                for (j = 0; j < glyphs.length; j++) {
                    substitutions.push({ sub: glyphs[j], by: substitute[j] });
                }
            }
        }
    }
    return substitutions;
};

/**
 * List all alternates (lookup type 3) for a given script, language, and feature.
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @param {string} feature - 4-character feature name ('aalt', 'salt'...)
 * @return {Array} alternates - The list of alternates
 */
Substitution.prototype.getAlternates = function(feature, script, language) {
    var alternates = [];
    var lookupTables = this.getLookupTables(script, language, feature, 3);
    for (var idx = 0; idx < lookupTables.length; idx++) {
        var subtables = lookupTables[idx].subtables;
        for (var i = 0; i < subtables.length; i++) {
            var subtable = subtables[i];
            var glyphs = this.expandCoverage(subtable.coverage);
            var alternateSets = subtable.alternateSets;
            for (var j = 0; j < glyphs.length; j++) {
                alternates.push({ sub: glyphs[j], by: alternateSets[j] });
            }
        }
    }
    return alternates;
};

/**
 * List all ligatures (lookup type 4) for a given script, language, and feature.
 * The result is an array of ligature objects like { sub: [ids], by: id }
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @return {Array} ligatures - The list of ligatures.
 */
Substitution.prototype.getLigatures = function(feature, script, language) {
    var ligatures = [];
    var lookupTables = this.getLookupTables(script, language, feature, 4);
    for (var idx = 0; idx < lookupTables.length; idx++) {
        var subtables = lookupTables[idx].subtables;
        for (var i = 0; i < subtables.length; i++) {
            var subtable = subtables[i];
            var glyphs = this.expandCoverage(subtable.coverage);
            var ligatureSets = subtable.ligatureSets;
            for (var j = 0; j < glyphs.length; j++) {
                var startGlyph = glyphs[j];
                var ligSet = ligatureSets[j];
                for (var k = 0; k < ligSet.length; k++) {
                    var lig = ligSet[k];
                    ligatures.push({
                        sub: [startGlyph].concat(lig.components),
                        by: lig.ligGlyph
                    });
                }
            }
        }
    }
    return ligatures;
};

/**
 * Add or modify a single substitution (lookup type 1)
 * Format 2, more flexible, is always used.
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {Object} substitution - { sub: id, delta: number } for format 1 or { sub: id, by: id } for format 2.
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */
Substitution.prototype.addSingle = function(feature, substitution, script, language) {
    var lookupTable = this.getLookupTables(script, language, feature, 1, true)[0];
    var subtable = getSubstFormat(lookupTable, 2, {                // lookup type 1 subtable, format 2, coverage format 1
        substFormat: 2,
        coverage: { format: 1, glyphs: [] },
        substitute: []
    });
    check.assert(subtable.coverage.format === 1, 'Ligature: unable to modify coverage table format ' + subtable.coverage.format);
    var coverageGlyph = substitution.sub;
    var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
    if (pos < 0) {
        pos = -1 - pos;
        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
        subtable.substitute.splice(pos, 0, 0);
    }
    subtable.substitute[pos] = substitution.by;
};

/**
 * Add or modify an alternate substitution (lookup type 1)
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {Object} substitution - { sub: id, by: [ids] }
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */
Substitution.prototype.addAlternate = function(feature, substitution, script, language) {
    var lookupTable = this.getLookupTables(script, language, feature, 3, true)[0];
    var subtable = getSubstFormat(lookupTable, 1, {                // lookup type 3 subtable, format 1, coverage format 1
        substFormat: 1,
        coverage: { format: 1, glyphs: [] },
        alternateSets: []
    });
    check.assert(subtable.coverage.format === 1, 'Ligature: unable to modify coverage table format ' + subtable.coverage.format);
    var coverageGlyph = substitution.sub;
    var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
    if (pos < 0) {
        pos = -1 - pos;
        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
        subtable.alternateSets.splice(pos, 0, 0);
    }
    subtable.alternateSets[pos] = substitution.by;
};

/**
 * Add a ligature (lookup type 4)
 * Ligatures with more components must be stored ahead of those with fewer components in order to be found
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {Object} ligature - { sub: [ids], by: id }
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */
Substitution.prototype.addLigature = function(feature, ligature, script, language) {
    var lookupTable = this.getLookupTables(script, language, feature, 4, true)[0];
    var subtable = lookupTable.subtables[0];
    if (!subtable) {
        subtable = {                // lookup type 4 subtable, format 1, coverage format 1
            substFormat: 1,
            coverage: { format: 1, glyphs: [] },
            ligatureSets: []
        };
        lookupTable.subtables[0] = subtable;
    }
    check.assert(subtable.coverage.format === 1, 'Ligature: unable to modify coverage table format ' + subtable.coverage.format);
    var coverageGlyph = ligature.sub[0];
    var ligComponents = ligature.sub.slice(1);
    var ligatureTable = {
        ligGlyph: ligature.by,
        components: ligComponents
    };
    var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
    if (pos >= 0) {
        // ligatureSet already exists
        var ligatureSet = subtable.ligatureSets[pos];
        for (var i = 0; i < ligatureSet.length; i++) {
            // If ligature already exists, return.
            if (arraysEqual(ligatureSet[i].components, ligComponents)) {
                return;
            }
        }
        // ligature does not exist: add it.
        ligatureSet.push(ligatureTable);
    } else {
        // Create a new ligatureSet and add coverage for the first glyph.
        pos = -1 - pos;
        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
        subtable.ligatureSets.splice(pos, 0, [ligatureTable]);
    }
};

/**
 * List all feature data for a given script and language.
 * @param {string} feature - 4-letter feature name
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @return {Array} substitutions - The list of substitutions.
 */
Substitution.prototype.getFeature = function(feature, script, language) {
    if (/ss\d\d/.test(feature)) {               // ss01 - ss20
        return this.getSingle(feature, script, language);
    }
    switch (feature) {
        case 'aalt':
        case 'salt':
            return this.getSingle(feature, script, language)
                    .concat(this.getAlternates(feature, script, language));
        case 'dlig':
        case 'liga':
        case 'rlig': return this.getLigatures(feature, script, language);
    }
};

/**
 * Add a substitution to a feature for a given script and language.
 * @param {string} feature - 4-letter feature name
 * @param {Object} sub - the substitution to add (an object like { sub: id or [ids], by: id or [ids] })
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */
Substitution.prototype.add = function(feature, sub, script, language) {
    if (/ss\d\d/.test(feature)) {               // ss01 - ss20
        return this.addSingle(feature, sub, script, language);
    }
    switch (feature) {
        case 'aalt':
        case 'salt':
            if (typeof sub.by === 'number') {
                return this.addSingle(feature, sub, script, language);
            }
            return this.addAlternate(feature, sub, script, language);
        case 'dlig':
        case 'liga':
        case 'rlig':
            return this.addLigature(feature, sub, script, language);
    }
};

module.exports = Substitution;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The `fvar` table stores font variation axes and instances.
// https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6fvar.html



var check = __webpack_require__(1);
var parse = __webpack_require__(0);
var table = __webpack_require__(2);

function addName(name, names) {
    var nameString = JSON.stringify(name);
    var nameID = 256;
    for (var nameKey in names) {
        var n = parseInt(nameKey);
        if (!n || n < 256) {
            continue;
        }

        if (JSON.stringify(names[nameKey]) === nameString) {
            return n;
        }

        if (nameID <= n) {
            nameID = n + 1;
        }
    }

    names[nameID] = name;
    return nameID;
}

function makeFvarAxis(n, axis, names) {
    var nameID = addName(axis.name, names);
    return [
        {name: 'tag_' + n, type: 'TAG', value: axis.tag},
        {name: 'minValue_' + n, type: 'FIXED', value: axis.minValue << 16},
        {name: 'defaultValue_' + n, type: 'FIXED', value: axis.defaultValue << 16},
        {name: 'maxValue_' + n, type: 'FIXED', value: axis.maxValue << 16},
        {name: 'flags_' + n, type: 'USHORT', value: 0},
        {name: 'nameID_' + n, type: 'USHORT', value: nameID}
    ];
}

function parseFvarAxis(data, start, names) {
    var axis = {};
    var p = new parse.Parser(data, start);
    axis.tag = p.parseTag();
    axis.minValue = p.parseFixed();
    axis.defaultValue = p.parseFixed();
    axis.maxValue = p.parseFixed();
    p.skip('uShort', 1);  // reserved for flags; no values defined
    axis.name = names[p.parseUShort()] || {};
    return axis;
}

function makeFvarInstance(n, inst, axes, names) {
    var nameID = addName(inst.name, names);
    var fields = [
        {name: 'nameID_' + n, type: 'USHORT', value: nameID},
        {name: 'flags_' + n, type: 'USHORT', value: 0}
    ];

    for (var i = 0; i < axes.length; ++i) {
        var axisTag = axes[i].tag;
        fields.push({
            name: 'axis_' + n + ' ' + axisTag,
            type: 'FIXED',
            value: inst.coordinates[axisTag] << 16
        });
    }

    return fields;
}

function parseFvarInstance(data, start, axes, names) {
    var inst = {};
    var p = new parse.Parser(data, start);
    inst.name = names[p.parseUShort()] || {};
    p.skip('uShort', 1);  // reserved for flags; no values defined

    inst.coordinates = {};
    for (var i = 0; i < axes.length; ++i) {
        inst.coordinates[axes[i].tag] = p.parseFixed();
    }

    return inst;
}

function makeFvarTable(fvar, names) {
    var result = new table.Table('fvar', [
        {name: 'version', type: 'ULONG', value: 0x10000},
        {name: 'offsetToData', type: 'USHORT', value: 0},
        {name: 'countSizePairs', type: 'USHORT', value: 2},
        {name: 'axisCount', type: 'USHORT', value: fvar.axes.length},
        {name: 'axisSize', type: 'USHORT', value: 20},
        {name: 'instanceCount', type: 'USHORT', value: fvar.instances.length},
        {name: 'instanceSize', type: 'USHORT', value: 4 + fvar.axes.length * 4}
    ]);
    result.offsetToData = result.sizeOf();

    for (var i = 0; i < fvar.axes.length; i++) {
        result.fields = result.fields.concat(makeFvarAxis(i, fvar.axes[i], names));
    }

    for (var j = 0; j < fvar.instances.length; j++) {
        result.fields = result.fields.concat(makeFvarInstance(j, fvar.instances[j], fvar.axes, names));
    }

    return result;
}

function parseFvarTable(data, start, names) {
    var p = new parse.Parser(data, start);
    var tableVersion = p.parseULong();
    check.argument(tableVersion === 0x00010000, 'Unsupported fvar table version.');
    var offsetToData = p.parseOffset16();
    // Skip countSizePairs.
    p.skip('uShort', 1);
    var axisCount = p.parseUShort();
    var axisSize = p.parseUShort();
    var instanceCount = p.parseUShort();
    var instanceSize = p.parseUShort();

    var axes = [];
    for (var i = 0; i < axisCount; i++) {
        axes.push(parseFvarAxis(data, start + offsetToData + i * axisSize, names));
    }

    var instances = [];
    var instanceStart = start + offsetToData + axisCount * axisSize;
    for (var j = 0; j < instanceCount; j++) {
        instances.push(parseFvarInstance(data, instanceStart + j * instanceSize, axes, names));
    }

    return {axes: axes, instances: instances};
}

exports.make = makeFvarTable;
exports.parse = parseFvarTable;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The `glyf` table describes the glyphs in TrueType outline format.
// http://www.microsoft.com/typography/otspec/glyf.htm



var check = __webpack_require__(1);
var glyphset = __webpack_require__(6);
var parse = __webpack_require__(0);
var path = __webpack_require__(3);

// Parse the coordinate data for a glyph.
function parseGlyphCoordinate(p, flag, previousValue, shortVectorBitMask, sameBitMask) {
    var v;
    if ((flag & shortVectorBitMask) > 0) {
        // The coordinate is 1 byte long.
        v = p.parseByte();
        // The `same` bit is re-used for short values to signify the sign of the value.
        if ((flag & sameBitMask) === 0) {
            v = -v;
        }

        v = previousValue + v;
    } else {
        //  The coordinate is 2 bytes long.
        // If the `same` bit is set, the coordinate is the same as the previous coordinate.
        if ((flag & sameBitMask) > 0) {
            v = previousValue;
        } else {
            // Parse the coordinate as a signed 16-bit delta value.
            v = previousValue + p.parseShort();
        }
    }

    return v;
}

// Parse a TrueType glyph.
function parseGlyph(glyph, data, start) {
    var p = new parse.Parser(data, start);
    glyph.numberOfContours = p.parseShort();
    glyph._xMin = p.parseShort();
    glyph._yMin = p.parseShort();
    glyph._xMax = p.parseShort();
    glyph._yMax = p.parseShort();
    var flags;
    var flag;
    if (glyph.numberOfContours > 0) {
        var i;
        // This glyph is not a composite.
        var endPointIndices = glyph.endPointIndices = [];
        for (i = 0; i < glyph.numberOfContours; i += 1) {
            endPointIndices.push(p.parseUShort());
        }

        glyph.instructionLength = p.parseUShort();
        glyph.instructions = [];
        for (i = 0; i < glyph.instructionLength; i += 1) {
            glyph.instructions.push(p.parseByte());
        }

        var numberOfCoordinates = endPointIndices[endPointIndices.length - 1] + 1;
        flags = [];
        for (i = 0; i < numberOfCoordinates; i += 1) {
            flag = p.parseByte();
            flags.push(flag);
            // If bit 3 is set, we repeat this flag n times, where n is the next byte.
            if ((flag & 8) > 0) {
                var repeatCount = p.parseByte();
                for (var j = 0; j < repeatCount; j += 1) {
                    flags.push(flag);
                    i += 1;
                }
            }
        }

        check.argument(flags.length === numberOfCoordinates, 'Bad flags.');

        if (endPointIndices.length > 0) {
            var points = [];
            var point;
            // X/Y coordinates are relative to the previous point, except for the first point which is relative to 0,0.
            if (numberOfCoordinates > 0) {
                for (i = 0; i < numberOfCoordinates; i += 1) {
                    flag = flags[i];
                    point = {};
                    point.onCurve = !!(flag & 1);
                    point.lastPointOfContour = endPointIndices.indexOf(i) >= 0;
                    points.push(point);
                }

                var px = 0;
                for (i = 0; i < numberOfCoordinates; i += 1) {
                    flag = flags[i];
                    point = points[i];
                    point.x = parseGlyphCoordinate(p, flag, px, 2, 16);
                    px = point.x;
                }

                var py = 0;
                for (i = 0; i < numberOfCoordinates; i += 1) {
                    flag = flags[i];
                    point = points[i];
                    point.y = parseGlyphCoordinate(p, flag, py, 4, 32);
                    py = point.y;
                }
            }

            glyph.points = points;
        } else {
            glyph.points = [];
        }
    } else if (glyph.numberOfContours === 0) {
        glyph.points = [];
    } else {
        glyph.isComposite = true;
        glyph.points = [];
        glyph.components = [];
        var moreComponents = true;
        while (moreComponents) {
            flags = p.parseUShort();
            var component = {
                glyphIndex: p.parseUShort(),
                xScale: 1,
                scale01: 0,
                scale10: 0,
                yScale: 1,
                dx: 0,
                dy: 0
            };
            if ((flags & 1) > 0) {
                // The arguments are words
                if ((flags & 2) > 0) {
                    // values are offset
                    component.dx = p.parseShort();
                    component.dy = p.parseShort();
                } else {
                    // values are matched points
                    component.matchedPoints = [p.parseUShort(), p.parseUShort()];
                }

            } else {
                // The arguments are bytes
                if ((flags & 2) > 0) {
                    // values are offset
                    component.dx = p.parseChar();
                    component.dy = p.parseChar();
                } else {
                    // values are matched points
                    component.matchedPoints = [p.parseByte(), p.parseByte()];
                }
            }

            if ((flags & 8) > 0) {
                // We have a scale
                component.xScale = component.yScale = p.parseF2Dot14();
            } else if ((flags & 64) > 0) {
                // We have an X / Y scale
                component.xScale = p.parseF2Dot14();
                component.yScale = p.parseF2Dot14();
            } else if ((flags & 128) > 0) {
                // We have a 2x2 transformation
                component.xScale = p.parseF2Dot14();
                component.scale01 = p.parseF2Dot14();
                component.scale10 = p.parseF2Dot14();
                component.yScale = p.parseF2Dot14();
            }

            glyph.components.push(component);
            moreComponents = !!(flags & 32);
        }
    }
}

// Transform an array of points and return a new array.
function transformPoints(points, transform) {
    var newPoints = [];
    for (var i = 0; i < points.length; i += 1) {
        var pt = points[i];
        var newPt = {
            x: transform.xScale * pt.x + transform.scale01 * pt.y + transform.dx,
            y: transform.scale10 * pt.x + transform.yScale * pt.y + transform.dy,
            onCurve: pt.onCurve,
            lastPointOfContour: pt.lastPointOfContour
        };
        newPoints.push(newPt);
    }

    return newPoints;
}

function getContours(points) {
    var contours = [];
    var currentContour = [];
    for (var i = 0; i < points.length; i += 1) {
        var pt = points[i];
        currentContour.push(pt);
        if (pt.lastPointOfContour) {
            contours.push(currentContour);
            currentContour = [];
        }
    }

    check.argument(currentContour.length === 0, 'There are still points left in the current contour.');
    return contours;
}

// Convert the TrueType glyph outline to a Path.
function getPath(points) {
    var p = new path.Path();
    if (!points) {
        return p;
    }

    var contours = getContours(points);
    for (var i = 0; i < contours.length; i += 1) {
        var contour = contours[i];
        var firstPt = contour[0];
        var lastPt = contour[contour.length - 1];
        var curvePt;
        var realFirstPoint;
        if (firstPt.onCurve) {
            curvePt = null;
            // The first point will be consumed by the moveTo command,
            // so skip it in the loop.
            realFirstPoint = true;
        } else {
            if (lastPt.onCurve) {
                // If the first point is off-curve and the last point is on-curve,
                // start at the last point.
                firstPt = lastPt;
            } else {
                // If both first and last points are off-curve, start at their middle.
                firstPt = { x: (firstPt.x + lastPt.x) / 2, y: (firstPt.y + lastPt.y) / 2 };
            }

            curvePt = firstPt;
            // The first point is synthesized, so don't skip the real first point.
            realFirstPoint = false;
        }

        p.moveTo(firstPt.x, firstPt.y);

        for (var j = realFirstPoint ? 1 : 0; j < contour.length; j += 1) {
            var pt = contour[j];
            var prevPt = j === 0 ? firstPt : contour[j - 1];
            if (prevPt.onCurve && pt.onCurve) {
                // This is a straight line.
                p.lineTo(pt.x, pt.y);
            } else if (prevPt.onCurve && !pt.onCurve) {
                curvePt = pt;
            } else if (!prevPt.onCurve && !pt.onCurve) {
                var midPt = { x: (prevPt.x + pt.x) / 2, y: (prevPt.y + pt.y) / 2 };
                p.quadraticCurveTo(prevPt.x, prevPt.y, midPt.x, midPt.y);
                curvePt = pt;
            } else if (!prevPt.onCurve && pt.onCurve) {
                // Previous point off-curve, this point on-curve.
                p.quadraticCurveTo(curvePt.x, curvePt.y, pt.x, pt.y);
                curvePt = null;
            } else {
                throw new Error('Invalid state.');
            }
        }

        if (firstPt !== lastPt) {
            // Connect the last and first points
            if (curvePt) {
                p.quadraticCurveTo(curvePt.x, curvePt.y, firstPt.x, firstPt.y);
            } else {
                p.lineTo(firstPt.x, firstPt.y);
            }
        }
    }

    p.closePath();
    return p;
}

function buildPath(glyphs, glyph) {
    if (glyph.isComposite) {
        for (var j = 0; j < glyph.components.length; j += 1) {
            var component = glyph.components[j];
            var componentGlyph = glyphs.get(component.glyphIndex);
            // Force the ttfGlyphLoader to parse the glyph.
            componentGlyph.getPath();
            if (componentGlyph.points) {
                var transformedPoints;
                if (component.matchedPoints === undefined) {
                    // component positioned by offset
                    transformedPoints = transformPoints(componentGlyph.points, component);
                } else {
                    // component positioned by matched points
                    if ((component.matchedPoints[0] > glyph.points.length - 1) ||
                        (component.matchedPoints[1] > componentGlyph.points.length - 1)) {
                        throw Error('Matched points out of range in ' + glyph.name);
                    }
                    var firstPt = glyph.points[component.matchedPoints[0]];
                    var secondPt = componentGlyph.points[component.matchedPoints[1]];
                    var transform = {
                        xScale: component.xScale, scale01: component.scale01,
                        scale10: component.scale10, yScale: component.yScale,
                        dx: 0, dy: 0
                    };
                    secondPt = transformPoints([secondPt], transform)[0];
                    transform.dx = firstPt.x - secondPt.x;
                    transform.dy = firstPt.y - secondPt.y;
                    transformedPoints = transformPoints(componentGlyph.points, transform);
                }
                glyph.points = glyph.points.concat(transformedPoints);
            }
        }
    }

    return getPath(glyph.points);
}

// Parse all the glyphs according to the offsets from the `loca` table.
function parseGlyfTable(data, start, loca, font) {
    var glyphs = new glyphset.GlyphSet(font);
    var i;

    // The last element of the loca table is invalid.
    for (i = 0; i < loca.length - 1; i += 1) {
        var offset = loca[i];
        var nextOffset = loca[i + 1];
        if (offset !== nextOffset) {
            glyphs.push(i, glyphset.ttfGlyphLoader(font, i, parseGlyph, data, start + offset, buildPath));
        } else {
            glyphs.push(i, glyphset.glyphLoader(font, i));
        }
    }

    return glyphs;
}

exports.parse = parseGlyfTable;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The `GPOS` table contains kerning pairs, among other things.
// https://www.microsoft.com/typography/OTSPEC/gpos.htm



var check = __webpack_require__(1);
var parse = __webpack_require__(0);

// Parse ScriptList and FeatureList tables of GPOS, GSUB, GDEF, BASE, JSTF tables.
// These lists are unused by now, this function is just the basis for a real parsing.
function parseTaggedListTable(data, start) {
    var p = new parse.Parser(data, start);
    var n = p.parseUShort();
    var list = [];
    for (var i = 0; i < n; i++) {
        list[p.parseTag()] = { offset: p.parseUShort() };
    }

    return list;
}

// Parse a coverage table in a GSUB, GPOS or GDEF table.
// Format 1 is a simple list of glyph ids,
// Format 2 is a list of ranges. It is expanded in a list of glyphs, maybe not the best idea.
function parseCoverageTable(data, start) {
    var p = new parse.Parser(data, start);
    var format = p.parseUShort();
    var count =  p.parseUShort();
    if (format === 1) {
        return p.parseUShortList(count);
    } else if (format === 2) {
        var coverage = [];
        for (; count--;) {
            var begin = p.parseUShort();
            var end = p.parseUShort();
            var index = p.parseUShort();
            for (var i = begin; i <= end; i++) {
                coverage[index++] = i;
            }
        }

        return coverage;
    }
}

// Parse a Class Definition Table in a GSUB, GPOS or GDEF table.
// Returns a function that gets a class value from a glyph ID.
function parseClassDefTable(data, start) {
    var p = new parse.Parser(data, start);
    var format = p.parseUShort();
    if (format === 1) {
        // Format 1 specifies a range of consecutive glyph indices, one class per glyph ID.
        var startGlyph = p.parseUShort();
        var glyphCount = p.parseUShort();
        var classes = p.parseUShortList(glyphCount);
        return function(glyphID) {
            return classes[glyphID - startGlyph] || 0;
        };
    } else if (format === 2) {
        // Format 2 defines multiple groups of glyph indices that belong to the same class.
        var rangeCount = p.parseUShort();
        var startGlyphs = [];
        var endGlyphs = [];
        var classValues = [];
        for (var i = 0; i < rangeCount; i++) {
            startGlyphs[i] = p.parseUShort();
            endGlyphs[i] = p.parseUShort();
            classValues[i] = p.parseUShort();
        }

        return function(glyphID) {
            var l = 0;
            var r = startGlyphs.length - 1;
            while (l < r) {
                var c = (l + r + 1) >> 1;
                if (glyphID < startGlyphs[c]) {
                    r = c - 1;
                } else {
                    l = c;
                }
            }

            if (startGlyphs[l] <= glyphID && glyphID <= endGlyphs[l]) {
                return classValues[l] || 0;
            }

            return 0;
        };
    }
}

// Parse a pair adjustment positioning subtable, format 1 or format 2
// The subtable is returned in the form of a lookup function.
function parsePairPosSubTable(data, start) {
    var p = new parse.Parser(data, start);
    // This part is common to format 1 and format 2 subtables
    var format = p.parseUShort();
    var coverageOffset = p.parseUShort();
    var coverage = parseCoverageTable(data, start + coverageOffset);
    // valueFormat 4: XAdvance only, 1: XPlacement only, 0: no ValueRecord for second glyph
    // Only valueFormat1=4 and valueFormat2=0 is supported.
    var valueFormat1 = p.parseUShort();
    var valueFormat2 = p.parseUShort();
    var value1;
    var value2;
    if (valueFormat1 !== 4 || valueFormat2 !== 0) return;
    var sharedPairSets = {};
    if (format === 1) {
        // Pair Positioning Adjustment: Format 1
        var pairSetCount = p.parseUShort();
        var pairSet = [];
        // Array of offsets to PairSet tables-from beginning of PairPos subtable-ordered by Coverage Index
        var pairSetOffsets = p.parseOffset16List(pairSetCount);
        for (var firstGlyph = 0; firstGlyph < pairSetCount; firstGlyph++) {
            var pairSetOffset = pairSetOffsets[firstGlyph];
            var sharedPairSet = sharedPairSets[pairSetOffset];
            if (!sharedPairSet) {
                // Parse a pairset table in a pair adjustment subtable format 1
                sharedPairSet = {};
                p.relativeOffset = pairSetOffset;
                var pairValueCount = p.parseUShort();
                for (; pairValueCount--;) {
                    var secondGlyph = p.parseUShort();
                    if (valueFormat1) value1 = p.parseShort();
                    if (valueFormat2) value2 = p.parseShort();
                    // We only support valueFormat1 = 4 and valueFormat2 = 0,
                    // so value1 is the XAdvance and value2 is empty.
                    sharedPairSet[secondGlyph] = value1;
                }
            }

            pairSet[coverage[firstGlyph]] = sharedPairSet;
        }

        return function(leftGlyph, rightGlyph) {
            var pairs = pairSet[leftGlyph];
            if (pairs) return pairs[rightGlyph];
        };
    } else if (format === 2) {
        // Pair Positioning Adjustment: Format 2
        var classDef1Offset = p.parseUShort();
        var classDef2Offset = p.parseUShort();
        var class1Count = p.parseUShort();
        var class2Count = p.parseUShort();
        var getClass1 = parseClassDefTable(data, start + classDef1Offset);
        var getClass2 = parseClassDefTable(data, start + classDef2Offset);

        // Parse kerning values by class pair.
        var kerningMatrix = [];
        for (var i = 0; i < class1Count; i++) {
            var kerningRow = kerningMatrix[i] = [];
            for (var j = 0; j < class2Count; j++) {
                if (valueFormat1) value1 = p.parseShort();
                if (valueFormat2) value2 = p.parseShort();
                // We only support valueFormat1 = 4 and valueFormat2 = 0,
                // so value1 is the XAdvance and value2 is empty.
                kerningRow[j] = value1;
            }
        }

        // Convert coverage list to a hash
        var covered = {};
        for (i = 0; i < coverage.length; i++) covered[coverage[i]] = 1;

        // Get the kerning value for a specific glyph pair.
        return function(leftGlyph, rightGlyph) {
            if (!covered[leftGlyph]) return;
            var class1 = getClass1(leftGlyph);
            var class2 = getClass2(rightGlyph);
            var kerningRow = kerningMatrix[class1];

            if (kerningRow) {
                return kerningRow[class2];
            }
        };
    }
}

// Parse a LookupTable (present in of GPOS, GSUB, GDEF, BASE, JSTF tables).
function parseLookupTable(data, start) {
    var p = new parse.Parser(data, start);
    var lookupType = p.parseUShort();
    var lookupFlag = p.parseUShort();
    var useMarkFilteringSet = lookupFlag & 0x10;
    var subTableCount = p.parseUShort();
    var subTableOffsets = p.parseOffset16List(subTableCount);
    var table = {
        lookupType: lookupType,
        lookupFlag: lookupFlag,
        markFilteringSet: useMarkFilteringSet ? p.parseUShort() : -1
    };
    // LookupType 2, Pair adjustment
    if (lookupType === 2) {
        var subtables = [];
        for (var i = 0; i < subTableCount; i++) {
            var pairPosSubTable = parsePairPosSubTable(data, start + subTableOffsets[i]);
            if (pairPosSubTable) subtables.push(pairPosSubTable);
        }
        // Return a function which finds the kerning values in the subtables.
        table.getKerningValue = function(leftGlyph, rightGlyph) {
            for (var i = subtables.length; i--;) {
                var value = subtables[i](leftGlyph, rightGlyph);
                if (value !== undefined) return value;
            }

            return 0;
        };
    }

    return table;
}

// Parse the `GPOS` table which contains, among other things, kerning pairs.
// https://www.microsoft.com/typography/OTSPEC/gpos.htm
function parseGposTable(data, start, font) {
    var p = new parse.Parser(data, start);
    var tableVersion = p.parseFixed();
    check.argument(tableVersion === 1, 'Unsupported GPOS table version.');

    // ScriptList and FeatureList - ignored for now
    parseTaggedListTable(data, start + p.parseUShort());
    // 'kern' is the feature we are looking for.
    parseTaggedListTable(data, start + p.parseUShort());

    // LookupList
    var lookupListOffset = p.parseUShort();
    p.relativeOffset = lookupListOffset;
    var lookupCount = p.parseUShort();
    var lookupTableOffsets = p.parseOffset16List(lookupCount);
    var lookupListAbsoluteOffset = start + lookupListOffset;
    for (var i = 0; i < lookupCount; i++) {
        var table = parseLookupTable(data, lookupListAbsoluteOffset + lookupTableOffsets[i]);
        if (table.lookupType === 2 && !font.getGposKerningValue) font.getGposKerningValue = table.getKerningValue;
    }
}

exports.parse = parseGposTable;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The `kern` table contains kerning pairs.
// Note that some fonts use the GPOS OpenType layout table to specify kerning.
// https://www.microsoft.com/typography/OTSPEC/kern.htm



var check = __webpack_require__(1);
var parse = __webpack_require__(0);

function parseWindowsKernTable(p) {
    var pairs = {};
    // Skip nTables.
    p.skip('uShort');
    var subtableVersion = p.parseUShort();
    check.argument(subtableVersion === 0, 'Unsupported kern sub-table version.');
    // Skip subtableLength, subtableCoverage
    p.skip('uShort', 2);
    var nPairs = p.parseUShort();
    // Skip searchRange, entrySelector, rangeShift.
    p.skip('uShort', 3);
    for (var i = 0; i < nPairs; i += 1) {
        var leftIndex = p.parseUShort();
        var rightIndex = p.parseUShort();
        var value = p.parseShort();
        pairs[leftIndex + ',' + rightIndex] = value;
    }
    return pairs;
}

function parseMacKernTable(p) {
    var pairs = {};
    // The Mac kern table stores the version as a fixed (32 bits) but we only loaded the first 16 bits.
    // Skip the rest.
    p.skip('uShort');
    var nTables = p.parseULong();
    //check.argument(nTables === 1, 'Only 1 subtable is supported (got ' + nTables + ').');
    if (nTables > 1) {
        console.warn('Only the first kern subtable is supported.');
    }
    p.skip('uLong');
    var coverage = p.parseUShort();
    var subtableVersion = coverage & 0xFF;
    p.skip('uShort');
    if (subtableVersion === 0) {
        var nPairs = p.parseUShort();
        // Skip searchRange, entrySelector, rangeShift.
        p.skip('uShort', 3);
        for (var i = 0; i < nPairs; i += 1) {
            var leftIndex = p.parseUShort();
            var rightIndex = p.parseUShort();
            var value = p.parseShort();
            pairs[leftIndex + ',' + rightIndex] = value;
        }
    }
    return pairs;
}

// Parse the `kern` table which contains kerning pairs.
function parseKernTable(data, start) {
    var p = new parse.Parser(data, start);
    var tableVersion = p.parseUShort();
    if (tableVersion === 0) {
        return parseWindowsKernTable(p);
    } else if (tableVersion === 1) {
        return parseMacKernTable(p);
    } else {
        throw new Error('Unsupported kern table version (' + tableVersion + ').');
    }
}

exports.parse = parseKernTable;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The `loca` table stores the offsets to the locations of the glyphs in the font.
// https://www.microsoft.com/typography/OTSPEC/loca.htm



var parse = __webpack_require__(0);

// Parse the `loca` table. This table stores the offsets to the locations of the glyphs in the font,
// relative to the beginning of the glyphData table.
// The number of glyphs stored in the `loca` table is specified in the `maxp` table (under numGlyphs)
// The loca table has two versions: a short version where offsets are stored as uShorts, and a long
// version where offsets are stored as uLongs. The `head` table specifies which version to use
// (under indexToLocFormat).
function parseLocaTable(data, start, numGlyphs, shortVersion) {
    var p = new parse.Parser(data, start);
    var parseFn = shortVersion ? p.parseUShort : p.parseULong;
    // There is an extra entry after the last index element to compute the length of the last glyph.
    // That's why we use numGlyphs + 1.
    var glyphOffsets = [];
    for (var i = 0; i < numGlyphs + 1; i += 1) {
        var glyphOffset = parseFn.call(p);
        if (shortVersion) {
            // The short table version stores the actual offset divided by 2.
            glyphOffset *= 2;
        }

        glyphOffsets.push(glyphOffset);
    }

    return glyphOffsets;
}

exports.parse = parseLocaTable;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The `sfnt` wrapper provides organization for the tables in the font.
// It is the top-level data structure in a font.
// https://www.microsoft.com/typography/OTSPEC/otff.htm
// Recommendations for creating OpenType Fonts:
// http://www.microsoft.com/typography/otspec140/recom.htm



var check = __webpack_require__(1);
var table = __webpack_require__(2);

var cmap = __webpack_require__(12);
var cff = __webpack_require__(11);
var head = __webpack_require__(14);
var hhea = __webpack_require__(15);
var hmtx = __webpack_require__(16);
var ltag = __webpack_require__(17);
var maxp = __webpack_require__(18);
var _name = __webpack_require__(20);
var os2 = __webpack_require__(21);
var post = __webpack_require__(22);
var gsub = __webpack_require__(13);
var meta = __webpack_require__(19);

function log2(v) {
    return Math.log(v) / Math.log(2) | 0;
}

function computeCheckSum(bytes) {
    while (bytes.length % 4 !== 0) {
        bytes.push(0);
    }

    var sum = 0;
    for (var i = 0; i < bytes.length; i += 4) {
        sum += (bytes[i] << 24) +
            (bytes[i + 1] << 16) +
            (bytes[i + 2] << 8) +
            (bytes[i + 3]);
    }

    sum %= Math.pow(2, 32);
    return sum;
}

function makeTableRecord(tag, checkSum, offset, length) {
    return new table.Record('Table Record', [
        {name: 'tag', type: 'TAG', value: tag !== undefined ? tag : ''},
        {name: 'checkSum', type: 'ULONG', value: checkSum !== undefined ? checkSum : 0},
        {name: 'offset', type: 'ULONG', value: offset !== undefined ? offset : 0},
        {name: 'length', type: 'ULONG', value: length !== undefined ? length : 0}
    ]);
}

function makeSfntTable(tables) {
    var sfnt = new table.Table('sfnt', [
        {name: 'version', type: 'TAG', value: 'OTTO'},
        {name: 'numTables', type: 'USHORT', value: 0},
        {name: 'searchRange', type: 'USHORT', value: 0},
        {name: 'entrySelector', type: 'USHORT', value: 0},
        {name: 'rangeShift', type: 'USHORT', value: 0}
    ]);
    sfnt.tables = tables;
    sfnt.numTables = tables.length;
    var highestPowerOf2 = Math.pow(2, log2(sfnt.numTables));
    sfnt.searchRange = 16 * highestPowerOf2;
    sfnt.entrySelector = log2(highestPowerOf2);
    sfnt.rangeShift = sfnt.numTables * 16 - sfnt.searchRange;

    var recordFields = [];
    var tableFields = [];

    var offset = sfnt.sizeOf() + (makeTableRecord().sizeOf() * sfnt.numTables);
    while (offset % 4 !== 0) {
        offset += 1;
        tableFields.push({name: 'padding', type: 'BYTE', value: 0});
    }

    for (var i = 0; i < tables.length; i += 1) {
        var t = tables[i];
        check.argument(t.tableName.length === 4, 'Table name' + t.tableName + ' is invalid.');
        var tableLength = t.sizeOf();
        var tableRecord = makeTableRecord(t.tableName, computeCheckSum(t.encode()), offset, tableLength);
        recordFields.push({name: tableRecord.tag + ' Table Record', type: 'RECORD', value: tableRecord});
        tableFields.push({name: t.tableName + ' table', type: 'RECORD', value: t});
        offset += tableLength;
        check.argument(!isNaN(offset), 'Something went wrong calculating the offset.');
        while (offset % 4 !== 0) {
            offset += 1;
            tableFields.push({name: 'padding', type: 'BYTE', value: 0});
        }
    }

    // Table records need to be sorted alphabetically.
    recordFields.sort(function(r1, r2) {
        if (r1.value.tag > r2.value.tag) {
            return 1;
        } else {
            return -1;
        }
    });

    sfnt.fields = sfnt.fields.concat(recordFields);
    sfnt.fields = sfnt.fields.concat(tableFields);
    return sfnt;
}

// Get the metrics for a character. If the string has more than one character
// this function returns metrics for the first available character.
// You can provide optional fallback metrics if no characters are available.
function metricsForChar(font, chars, notFoundMetrics) {
    for (var i = 0; i < chars.length; i += 1) {
        var glyphIndex = font.charToGlyphIndex(chars[i]);
        if (glyphIndex > 0) {
            var glyph = font.glyphs.get(glyphIndex);
            return glyph.getMetrics();
        }
    }

    return notFoundMetrics;
}

function average(vs) {
    var sum = 0;
    for (var i = 0; i < vs.length; i += 1) {
        sum += vs[i];
    }

    return sum / vs.length;
}

// Convert the font object to a SFNT data structure.
// This structure contains all the necessary tables and metadata to create a binary OTF file.
function fontToSfntTable(font) {
    var xMins = [];
    var yMins = [];
    var xMaxs = [];
    var yMaxs = [];
    var advanceWidths = [];
    var leftSideBearings = [];
    var rightSideBearings = [];
    var firstCharIndex;
    var lastCharIndex = 0;
    var ulUnicodeRange1 = 0;
    var ulUnicodeRange2 = 0;
    var ulUnicodeRange3 = 0;
    var ulUnicodeRange4 = 0;

    for (var i = 0; i < font.glyphs.length; i += 1) {
        var glyph = font.glyphs.get(i);
        var unicode = glyph.unicode | 0;

        if (isNaN(glyph.advanceWidth)) {
            throw new Error('Glyph ' + glyph.name + ' (' + i + '): advanceWidth is not a number.');
        }

        if (firstCharIndex > unicode || firstCharIndex === undefined) {
            // ignore .notdef char
            if (unicode > 0) {
                firstCharIndex = unicode;
            }
        }

        if (lastCharIndex < unicode) {
            lastCharIndex = unicode;
        }

        var position = os2.getUnicodeRange(unicode);
        if (position < 32) {
            ulUnicodeRange1 |= 1 << position;
        } else if (position < 64) {
            ulUnicodeRange2 |= 1 << position - 32;
        } else if (position < 96) {
            ulUnicodeRange3 |= 1 << position - 64;
        } else if (position < 123) {
            ulUnicodeRange4 |= 1 << position - 96;
        } else {
            throw new Error('Unicode ranges bits > 123 are reserved for internal usage');
        }
        // Skip non-important characters.
        if (glyph.name === '.notdef') continue;
        var metrics = glyph.getMetrics();
        xMins.push(metrics.xMin);
        yMins.push(metrics.yMin);
        xMaxs.push(metrics.xMax);
        yMaxs.push(metrics.yMax);
        leftSideBearings.push(metrics.leftSideBearing);
        rightSideBearings.push(metrics.rightSideBearing);
        advanceWidths.push(glyph.advanceWidth);
    }

    var globals = {
        xMin: Math.min.apply(null, xMins),
        yMin: Math.min.apply(null, yMins),
        xMax: Math.max.apply(null, xMaxs),
        yMax: Math.max.apply(null, yMaxs),
        advanceWidthMax: Math.max.apply(null, advanceWidths),
        advanceWidthAvg: average(advanceWidths),
        minLeftSideBearing: Math.min.apply(null, leftSideBearings),
        maxLeftSideBearing: Math.max.apply(null, leftSideBearings),
        minRightSideBearing: Math.min.apply(null, rightSideBearings)
    };
    globals.ascender = font.ascender;
    globals.descender = font.descender;

    var headTable = head.make({
        flags: 3, // 00000011 (baseline for font at y=0; left sidebearing point at x=0)
        unitsPerEm: font.unitsPerEm,
        xMin: globals.xMin,
        yMin: globals.yMin,
        xMax: globals.xMax,
        yMax: globals.yMax,
        lowestRecPPEM: 3,
        createdTimestamp: font.createdTimestamp
    });

    var hheaTable = hhea.make({
        ascender: globals.ascender,
        descender: globals.descender,
        advanceWidthMax: globals.advanceWidthMax,
        minLeftSideBearing: globals.minLeftSideBearing,
        minRightSideBearing: globals.minRightSideBearing,
        xMaxExtent: globals.maxLeftSideBearing + (globals.xMax - globals.xMin),
        numberOfHMetrics: font.glyphs.length
    });

    var maxpTable = maxp.make(font.glyphs.length);

    var os2Table = os2.make({
        xAvgCharWidth: Math.round(globals.advanceWidthAvg),
        usWeightClass: font.tables.os2.usWeightClass,
        usWidthClass: font.tables.os2.usWidthClass,
        usFirstCharIndex: firstCharIndex,
        usLastCharIndex: lastCharIndex,
        ulUnicodeRange1: ulUnicodeRange1,
        ulUnicodeRange2: ulUnicodeRange2,
        ulUnicodeRange3: ulUnicodeRange3,
        ulUnicodeRange4: ulUnicodeRange4,
        fsSelection: font.tables.os2.fsSelection, // REGULAR
        // See http://typophile.com/node/13081 for more info on vertical metrics.
        // We get metrics for typical characters (such as "x" for xHeight).
        // We provide some fallback characters if characters are unavailable: their
        // ordering was chosen experimentally.
        sTypoAscender: globals.ascender,
        sTypoDescender: globals.descender,
        sTypoLineGap: 0,
        usWinAscent: globals.yMax,
        usWinDescent: Math.abs(globals.yMin),
        ulCodePageRange1: 1, // FIXME: hard-code Latin 1 support for now
        sxHeight: metricsForChar(font, 'xyvw', {yMax: Math.round(globals.ascender / 2)}).yMax,
        sCapHeight: metricsForChar(font, 'HIKLEFJMNTZBDPRAGOQSUVWXY', globals).yMax,
        usDefaultChar: font.hasChar(' ') ? 32 : 0, // Use space as the default character, if available.
        usBreakChar: font.hasChar(' ') ? 32 : 0 // Use space as the break character, if available.
    });

    var hmtxTable = hmtx.make(font.glyphs);
    var cmapTable = cmap.make(font.glyphs);

    var englishFamilyName = font.getEnglishName('fontFamily');
    var englishStyleName = font.getEnglishName('fontSubfamily');
    var englishFullName = englishFamilyName + ' ' + englishStyleName;
    var postScriptName = font.getEnglishName('postScriptName');
    if (!postScriptName) {
        postScriptName = englishFamilyName.replace(/\s/g, '') + '-' + englishStyleName;
    }

    var names = {};
    for (var n in font.names) {
        names[n] = font.names[n];
    }

    if (!names.uniqueID) {
        names.uniqueID = {en: font.getEnglishName('manufacturer') + ':' + englishFullName};
    }

    if (!names.postScriptName) {
        names.postScriptName = {en: postScriptName};
    }

    if (!names.preferredFamily) {
        names.preferredFamily = font.names.fontFamily;
    }

    if (!names.preferredSubfamily) {
        names.preferredSubfamily = font.names.fontSubfamily;
    }

    var languageTags = [];
    var nameTable = _name.make(names, languageTags);
    var ltagTable = (languageTags.length > 0 ? ltag.make(languageTags) : undefined);

    var postTable = post.make();
    var cffTable = cff.make(font.glyphs, {
        version: font.getEnglishName('version'),
        fullName: englishFullName,
        familyName: englishFamilyName,
        weightName: englishStyleName,
        postScriptName: postScriptName,
        unitsPerEm: font.unitsPerEm,
        fontBBox: [0, globals.yMin, globals.ascender, globals.advanceWidthMax]
    });

    var metaTable = (font.metas && Object.keys(font.metas).length > 0) ? meta.make(font.metas) : undefined;

    // The order does not matter because makeSfntTable() will sort them.
    var tables = [headTable, hheaTable, maxpTable, os2Table, nameTable, cmapTable, postTable, cffTable, hmtxTable];
    if (ltagTable) {
        tables.push(ltagTable);
    }
    // Optional tables
    if (font.tables.gsub) {
        tables.push(gsub.make(font.tables.gsub));
    }
    if (metaTable) {
        tables.push(metaTable);
    }

    var sfntTable = makeSfntTable(tables);

    // Compute the font's checkSum and store it in head.checkSumAdjustment.
    var bytes = sfntTable.encode();
    var checkSum = computeCheckSum(bytes);
    var tableFields = sfntTable.fields;
    var checkSumAdjusted = false;
    for (i = 0; i < tableFields.length; i += 1) {
        if (tableFields[i].name === 'head table') {
            tableFields[i].value.checkSumAdjustment = 0xB1B0AFBA - checkSum;
            checkSumAdjusted = true;
            break;
        }
    }

    if (!checkSumAdjusted) {
        throw new Error('Could not find head table with checkSum to adjust.');
    }

    return sfntTable;
}

exports.computeCheckSum = computeCheckSum;
exports.make = makeSfntTable;
exports.fontToTable = fontToSfntTable;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(47)))

/***/ }),
/* 47 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

!function t(e,r){ true?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports.Raphael=r():e.Raphael=r()}(this,function(){return function(t){function e(i){if(r[i])return r[i].exports;var n=r[i]={exports:{},id:i,loaded:!1};return t[i].call(n.exports,n,n.exports,e),n.loaded=!0,n.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}([function(t,e,r){var i,n;i=[r(1),r(3),r(4)],n=function(t){return t}.apply(e,i),!(void 0!==n&&(t.exports=n))},function(t,e,r){var i,n;i=[r(2)],n=function(t){function e(r){if(e.is(r,"function"))return w?r():t.on("raphael.DOMload",r);if(e.is(r,Q))return e._engine.create[z](e,r.splice(0,3+e.is(r[0],$))).add(r);var i=Array.prototype.slice.call(arguments,0);if(e.is(i[i.length-1],"function")){var n=i.pop();return w?n.call(e._engine.create[z](e,i)):t.on("raphael.DOMload",function(){n.call(e._engine.create[z](e,i))})}return e._engine.create[z](e,arguments)}function r(t){if("function"==typeof t||Object(t)!==t)return t;var e=new t.constructor;for(var i in t)t[A](i)&&(e[i]=r(t[i]));return e}function i(t,e){for(var r=0,i=t.length;r<i;r++)if(t[r]===e)return t.push(t.splice(r,1)[0])}function n(t,e,r){function n(){var a=Array.prototype.slice.call(arguments,0),s=a.join("␀"),o=n.cache=n.cache||{},l=n.count=n.count||[];return o[A](s)?(i(l,s),r?r(o[s]):o[s]):(l.length>=1e3&&delete o[l.shift()],l.push(s),o[s]=t[z](e,a),r?r(o[s]):o[s])}return n}function a(){return this.hex}function s(t,e){for(var r=[],i=0,n=t.length;n-2*!e>i;i+=2){var a=[{x:+t[i-2],y:+t[i-1]},{x:+t[i],y:+t[i+1]},{x:+t[i+2],y:+t[i+3]},{x:+t[i+4],y:+t[i+5]}];e?i?n-4==i?a[3]={x:+t[0],y:+t[1]}:n-2==i&&(a[2]={x:+t[0],y:+t[1]},a[3]={x:+t[2],y:+t[3]}):a[0]={x:+t[n-2],y:+t[n-1]}:n-4==i?a[3]=a[2]:i||(a[0]={x:+t[i],y:+t[i+1]}),r.push(["C",(-a[0].x+6*a[1].x+a[2].x)/6,(-a[0].y+6*a[1].y+a[2].y)/6,(a[1].x+6*a[2].x-a[3].x)/6,(a[1].y+6*a[2].y-a[3].y)/6,a[2].x,a[2].y])}return r}function o(t,e,r,i,n){var a=-3*e+9*r-9*i+3*n,s=t*a+6*e-12*r+6*i;return t*s-3*e+3*r}function l(t,e,r,i,n,a,s,l,h){null==h&&(h=1),h=h>1?1:h<0?0:h;for(var u=h/2,c=12,f=[-.1252,.1252,-.3678,.3678,-.5873,.5873,-.7699,.7699,-.9041,.9041,-.9816,.9816],p=[.2491,.2491,.2335,.2335,.2032,.2032,.1601,.1601,.1069,.1069,.0472,.0472],d=0,g=0;g<c;g++){var v=u*f[g]+u,x=o(v,t,r,n,s),y=o(v,e,i,a,l),m=x*x+y*y;d+=p[g]*Y.sqrt(m)}return u*d}function h(t,e,r,i,n,a,s,o,h){if(!(h<0||l(t,e,r,i,n,a,s,o)<h)){var u=1,c=u/2,f=u-c,p,d=.01;for(p=l(t,e,r,i,n,a,s,o,f);H(p-h)>d;)c/=2,f+=(p<h?1:-1)*c,p=l(t,e,r,i,n,a,s,o,f);return f}}function u(t,e,r,i,n,a,s,o){if(!(W(t,r)<G(n,s)||G(t,r)>W(n,s)||W(e,i)<G(a,o)||G(e,i)>W(a,o))){var l=(t*i-e*r)*(n-s)-(t-r)*(n*o-a*s),h=(t*i-e*r)*(a-o)-(e-i)*(n*o-a*s),u=(t-r)*(a-o)-(e-i)*(n-s);if(u){var c=l/u,f=h/u,p=+c.toFixed(2),d=+f.toFixed(2);if(!(p<+G(t,r).toFixed(2)||p>+W(t,r).toFixed(2)||p<+G(n,s).toFixed(2)||p>+W(n,s).toFixed(2)||d<+G(e,i).toFixed(2)||d>+W(e,i).toFixed(2)||d<+G(a,o).toFixed(2)||d>+W(a,o).toFixed(2)))return{x:c,y:f}}}}function c(t,e){return p(t,e)}function f(t,e){return p(t,e,1)}function p(t,r,i){var n=e.bezierBBox(t),a=e.bezierBBox(r);if(!e.isBBoxIntersect(n,a))return i?0:[];for(var s=l.apply(0,t),o=l.apply(0,r),h=W(~~(s/5),1),c=W(~~(o/5),1),f=[],p=[],d={},g=i?0:[],v=0;v<h+1;v++){var x=e.findDotsAtSegment.apply(e,t.concat(v/h));f.push({x:x.x,y:x.y,t:v/h})}for(v=0;v<c+1;v++)x=e.findDotsAtSegment.apply(e,r.concat(v/c)),p.push({x:x.x,y:x.y,t:v/c});for(v=0;v<h;v++)for(var y=0;y<c;y++){var m=f[v],b=f[v+1],_=p[y],w=p[y+1],k=H(b.x-m.x)<.001?"y":"x",B=H(w.x-_.x)<.001?"y":"x",C=u(m.x,m.y,b.x,b.y,_.x,_.y,w.x,w.y);if(C){if(d[C.x.toFixed(4)]==C.y.toFixed(4))continue;d[C.x.toFixed(4)]=C.y.toFixed(4);var S=m.t+H((C[k]-m[k])/(b[k]-m[k]))*(b.t-m.t),A=_.t+H((C[B]-_[B])/(w[B]-_[B]))*(w.t-_.t);S>=0&&S<=1.001&&A>=0&&A<=1.001&&(i?g++:g.push({x:C.x,y:C.y,t1:G(S,1),t2:G(A,1)}))}}return g}function d(t,r,i){t=e._path2curve(t),r=e._path2curve(r);for(var n,a,s,o,l,h,u,c,f,d,g=i?0:[],v=0,x=t.length;v<x;v++){var y=t[v];if("M"==y[0])n=l=y[1],a=h=y[2];else{"C"==y[0]?(f=[n,a].concat(y.slice(1)),n=f[6],a=f[7]):(f=[n,a,n,a,l,h,l,h],n=l,a=h);for(var m=0,b=r.length;m<b;m++){var _=r[m];if("M"==_[0])s=u=_[1],o=c=_[2];else{"C"==_[0]?(d=[s,o].concat(_.slice(1)),s=d[6],o=d[7]):(d=[s,o,s,o,u,c,u,c],s=u,o=c);var w=p(f,d,i);if(i)g+=w;else{for(var k=0,B=w.length;k<B;k++)w[k].segment1=v,w[k].segment2=m,w[k].bez1=f,w[k].bez2=d;g=g.concat(w)}}}}}return g}function g(t,e,r,i,n,a){null!=t?(this.a=+t,this.b=+e,this.c=+r,this.d=+i,this.e=+n,this.f=+a):(this.a=1,this.b=0,this.c=0,this.d=1,this.e=0,this.f=0)}function v(){return this.x+j+this.y}function x(){return this.x+j+this.y+j+this.width+" × "+this.height}function y(t,e,r,i,n,a){function s(t){return((c*t+u)*t+h)*t}function o(t,e){var r=l(t,e);return((d*r+p)*r+f)*r}function l(t,e){var r,i,n,a,o,l;for(n=t,l=0;l<8;l++){if(a=s(n)-t,H(a)<e)return n;if(o=(3*c*n+2*u)*n+h,H(o)<1e-6)break;n-=a/o}if(r=0,i=1,n=t,n<r)return r;if(n>i)return i;for(;r<i;){if(a=s(n),H(a-t)<e)return n;t>a?r=n:i=n,n=(i-r)/2+r}return n}var h=3*e,u=3*(i-e)-h,c=1-h-u,f=3*r,p=3*(n-r)-f,d=1-f-p;return o(t,1/(200*a))}function m(t,e){var r=[],i={};if(this.ms=e,this.times=1,t){for(var n in t)t[A](n)&&(i[ht(n)]=t[n],r.push(ht(n)));r.sort(Bt)}this.anim=i,this.top=r[r.length-1],this.percents=r}function b(r,i,n,a,s,o){n=ht(n);var l,h,u,c=[],f,p,d,v=r.ms,x={},m={},b={};if(a)for(w=0,B=Ee.length;w<B;w++){var _=Ee[w];if(_.el.id==i.id&&_.anim==r){_.percent!=n?(Ee.splice(w,1),u=1):h=_,i.attr(_.totalOrigin);break}}else a=+m;for(var w=0,B=r.percents.length;w<B;w++){if(r.percents[w]==n||r.percents[w]>a*r.top){n=r.percents[w],p=r.percents[w-1]||0,v=v/r.top*(n-p),f=r.percents[w+1],l=r.anim[n];break}a&&i.attr(r.anim[r.percents[w]])}if(l){if(h)h.initstatus=a,h.start=new Date-h.ms*a;else{for(var C in l)if(l[A](C)&&(pt[A](C)||i.paper.customAttributes[A](C)))switch(x[C]=i.attr(C),null==x[C]&&(x[C]=ft[C]),m[C]=l[C],pt[C]){case $:b[C]=(m[C]-x[C])/v;break;case"colour":x[C]=e.getRGB(x[C]);var S=e.getRGB(m[C]);b[C]={r:(S.r-x[C].r)/v,g:(S.g-x[C].g)/v,b:(S.b-x[C].b)/v};break;case"path":var T=Qt(x[C],m[C]),E=T[1];for(x[C]=T[0],b[C]=[],w=0,B=x[C].length;w<B;w++){b[C][w]=[0];for(var M=1,N=x[C][w].length;M<N;M++)b[C][w][M]=(E[w][M]-x[C][w][M])/v}break;case"transform":var L=i._,z=le(L[C],m[C]);if(z)for(x[C]=z.from,m[C]=z.to,b[C]=[],b[C].real=!0,w=0,B=x[C].length;w<B;w++)for(b[C][w]=[x[C][w][0]],M=1,N=x[C][w].length;M<N;M++)b[C][w][M]=(m[C][w][M]-x[C][w][M])/v;else{var F=i.matrix||new g,R={_:{transform:L.transform},getBBox:function(){return i.getBBox(1)}};x[C]=[F.a,F.b,F.c,F.d,F.e,F.f],se(R,m[C]),m[C]=R._.transform,b[C]=[(R.matrix.a-F.a)/v,(R.matrix.b-F.b)/v,(R.matrix.c-F.c)/v,(R.matrix.d-F.d)/v,(R.matrix.e-F.e)/v,(R.matrix.f-F.f)/v]}break;case"csv":var j=I(l[C])[q](k),D=I(x[C])[q](k);if("clip-rect"==C)for(x[C]=D,b[C]=[],w=D.length;w--;)b[C][w]=(j[w]-x[C][w])/v;m[C]=j;break;default:for(j=[][P](l[C]),D=[][P](x[C]),b[C]=[],w=i.paper.customAttributes[C].length;w--;)b[C][w]=((j[w]||0)-(D[w]||0))/v}var V=l.easing,O=e.easing_formulas[V];if(!O)if(O=I(V).match(st),O&&5==O.length){var Y=O;O=function(t){return y(t,+Y[1],+Y[2],+Y[3],+Y[4],v)}}else O=St;if(d=l.start||r.start||+new Date,_={anim:r,percent:n,timestamp:d,start:d+(r.del||0),status:0,initstatus:a||0,stop:!1,ms:v,easing:O,from:x,diff:b,to:m,el:i,callback:l.callback,prev:p,next:f,repeat:o||r.times,origin:i.attr(),totalOrigin:s},Ee.push(_),a&&!h&&!u&&(_.stop=!0,_.start=new Date-v*a,1==Ee.length))return Ne();u&&(_.start=new Date-_.ms*a),1==Ee.length&&Me(Ne)}t("raphael.anim.start."+i.id,i,r)}}function _(t){for(var e=0;e<Ee.length;e++)Ee[e].el.paper==t&&Ee.splice(e--,1)}e.version="2.2.0",e.eve=t;var w,k=/[, ]+/,B={circle:1,rect:1,path:1,ellipse:1,text:1,image:1},C=/\{(\d+)\}/g,S="prototype",A="hasOwnProperty",T={doc:document,win:window},E={was:Object.prototype[A].call(T.win,"Raphael"),is:T.win.Raphael},M=function(){this.ca=this.customAttributes={}},N,L="appendChild",z="apply",P="concat",F="ontouchstart"in T.win||T.win.DocumentTouch&&T.doc instanceof DocumentTouch,R="",j=" ",I=String,q="split",D="click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[q](j),V={mousedown:"touchstart",mousemove:"touchmove",mouseup:"touchend"},O=I.prototype.toLowerCase,Y=Math,W=Y.max,G=Y.min,H=Y.abs,X=Y.pow,U=Y.PI,$="number",Z="string",Q="array",J="toString",K="fill",tt=Object.prototype.toString,et={},rt="push",it=e._ISURL=/^url\(['"]?(.+?)['"]?\)$/i,nt=/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,at={NaN:1,Infinity:1,"-Infinity":1},st=/^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,ot=Y.round,lt="setAttribute",ht=parseFloat,ut=parseInt,ct=I.prototype.toUpperCase,ft=e._availableAttrs={"arrow-end":"none","arrow-start":"none",blur:0,"clip-rect":"0 0 1e9 1e9",cursor:"default",cx:0,cy:0,fill:"#fff","fill-opacity":1,font:'10px "Arial"',"font-family":'"Arial"',"font-size":"10","font-style":"normal","font-weight":400,gradient:0,height:0,href:"http://raphaeljs.com/","letter-spacing":0,opacity:1,path:"M0,0",r:0,rx:0,ry:0,src:"",stroke:"#000","stroke-dasharray":"","stroke-linecap":"butt","stroke-linejoin":"butt","stroke-miterlimit":0,"stroke-opacity":1,"stroke-width":1,target:"_blank","text-anchor":"middle",title:"Raphael",transform:"",width:0,x:0,y:0,"class":""},pt=e._availableAnimAttrs={blur:$,"clip-rect":"csv",cx:$,cy:$,fill:"colour","fill-opacity":$,"font-size":$,height:$,opacity:$,path:"path",r:$,rx:$,ry:$,stroke:"colour","stroke-opacity":$,"stroke-width":$,transform:"transform",width:$,x:$,y:$},dt=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]/g,gt=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/,vt={hs:1,rg:1},xt=/,?([achlmqrstvxz]),?/gi,yt=/([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi,mt=/([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi,bt=/(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/gi,_t=e._radial_gradient=/^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/,wt={},kt=function(t,e){return t.key-e.key},Bt=function(t,e){return ht(t)-ht(e)},Ct=function(){},St=function(t){return t},At=e._rectPath=function(t,e,r,i,n){return n?[["M",t+n,e],["l",r-2*n,0],["a",n,n,0,0,1,n,n],["l",0,i-2*n],["a",n,n,0,0,1,-n,n],["l",2*n-r,0],["a",n,n,0,0,1,-n,-n],["l",0,2*n-i],["a",n,n,0,0,1,n,-n],["z"]]:[["M",t,e],["l",r,0],["l",0,i],["l",-r,0],["z"]]},Tt=function(t,e,r,i){return null==i&&(i=r),[["M",t,e],["m",0,-i],["a",r,i,0,1,1,0,2*i],["a",r,i,0,1,1,0,-2*i],["z"]]},Et=e._getPath={path:function(t){return t.attr("path")},circle:function(t){var e=t.attrs;return Tt(e.cx,e.cy,e.r)},ellipse:function(t){var e=t.attrs;return Tt(e.cx,e.cy,e.rx,e.ry)},rect:function(t){var e=t.attrs;return At(e.x,e.y,e.width,e.height,e.r)},image:function(t){var e=t.attrs;return At(e.x,e.y,e.width,e.height)},text:function(t){var e=t._getBBox();return At(e.x,e.y,e.width,e.height)},set:function(t){var e=t._getBBox();return At(e.x,e.y,e.width,e.height)}},Mt=e.mapPath=function(t,e){if(!e)return t;var r,i,n,a,s,o,l;for(t=Qt(t),n=0,s=t.length;n<s;n++)for(l=t[n],a=1,o=l.length;a<o;a+=2)r=e.x(l[a],l[a+1]),i=e.y(l[a],l[a+1]),l[a]=r,l[a+1]=i;return t};if(e._g=T,e.type=T.win.SVGAngle||T.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")?"SVG":"VML","VML"==e.type){var Nt=T.doc.createElement("div"),Lt;if(Nt.innerHTML='<v:shape adj="1"/>',Lt=Nt.firstChild,Lt.style.behavior="url(#default#VML)",!Lt||"object"!=typeof Lt.adj)return e.type=R;Nt=null}e.svg=!(e.vml="VML"==e.type),e._Paper=M,e.fn=N=M.prototype=e.prototype,e._id=0,e.is=function(t,e){return e=O.call(e),"finite"==e?!at[A](+t):"array"==e?t instanceof Array:"null"==e&&null===t||e==typeof t&&null!==t||"object"==e&&t===Object(t)||"array"==e&&Array.isArray&&Array.isArray(t)||tt.call(t).slice(8,-1).toLowerCase()==e},e.angle=function(t,r,i,n,a,s){if(null==a){var o=t-i,l=r-n;return o||l?(180+180*Y.atan2(-l,-o)/U+360)%360:0}return e.angle(t,r,a,s)-e.angle(i,n,a,s)},e.rad=function(t){return t%360*U/180},e.deg=function(t){return Math.round(180*t/U%360*1e3)/1e3},e.snapTo=function(t,r,i){if(i=e.is(i,"finite")?i:10,e.is(t,Q)){for(var n=t.length;n--;)if(H(t[n]-r)<=i)return t[n]}else{t=+t;var a=r%t;if(a<i)return r-a;if(a>t-i)return r-a+t}return r};var zt=e.createUUID=function(t,e){return function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(t,e).toUpperCase()}}(/[xy]/g,function(t){var e=16*Y.random()|0,r="x"==t?e:3&e|8;return r.toString(16)});e.setWindow=function(r){t("raphael.setWindow",e,T.win,r),T.win=r,T.doc=T.win.document,e._engine.initWin&&e._engine.initWin(T.win)};var Pt=function(t){if(e.vml){var r=/^\s+|\s+$/g,i;try{var a=new ActiveXObject("htmlfile");a.write("<body>"),a.close(),i=a.body}catch(s){i=createPopup().document.body}var o=i.createTextRange();Pt=n(function(t){try{i.style.color=I(t).replace(r,R);var e=o.queryCommandValue("ForeColor");return e=(255&e)<<16|65280&e|(16711680&e)>>>16,"#"+("000000"+e.toString(16)).slice(-6)}catch(n){return"none"}})}else{var l=T.doc.createElement("i");l.title="Raphaël Colour Picker",l.style.display="none",T.doc.body.appendChild(l),Pt=n(function(t){return l.style.color=t,T.doc.defaultView.getComputedStyle(l,R).getPropertyValue("color")})}return Pt(t)},Ft=function(){return"hsb("+[this.h,this.s,this.b]+")"},Rt=function(){return"hsl("+[this.h,this.s,this.l]+")"},jt=function(){return this.hex},It=function(t,r,i){if(null==r&&e.is(t,"object")&&"r"in t&&"g"in t&&"b"in t&&(i=t.b,r=t.g,t=t.r),null==r&&e.is(t,Z)){var n=e.getRGB(t);t=n.r,r=n.g,i=n.b}return(t>1||r>1||i>1)&&(t/=255,r/=255,i/=255),[t,r,i]},qt=function(t,r,i,n){t*=255,r*=255,i*=255;var a={r:t,g:r,b:i,hex:e.rgb(t,r,i),toString:jt};return e.is(n,"finite")&&(a.opacity=n),a};e.color=function(t){var r;return e.is(t,"object")&&"h"in t&&"s"in t&&"b"in t?(r=e.hsb2rgb(t),t.r=r.r,t.g=r.g,t.b=r.b,t.hex=r.hex):e.is(t,"object")&&"h"in t&&"s"in t&&"l"in t?(r=e.hsl2rgb(t),t.r=r.r,t.g=r.g,t.b=r.b,t.hex=r.hex):(e.is(t,"string")&&(t=e.getRGB(t)),e.is(t,"object")&&"r"in t&&"g"in t&&"b"in t?(r=e.rgb2hsl(t),t.h=r.h,t.s=r.s,t.l=r.l,r=e.rgb2hsb(t),t.v=r.b):(t={hex:"none"},t.r=t.g=t.b=t.h=t.s=t.v=t.l=-1)),t.toString=jt,t},e.hsb2rgb=function(t,e,r,i){this.is(t,"object")&&"h"in t&&"s"in t&&"b"in t&&(r=t.b,e=t.s,i=t.o,t=t.h),t*=360;var n,a,s,o,l;return t=t%360/60,l=r*e,o=l*(1-H(t%2-1)),n=a=s=r-l,t=~~t,n+=[l,o,0,0,o,l][t],a+=[o,l,l,o,0,0][t],s+=[0,0,o,l,l,o][t],qt(n,a,s,i)},e.hsl2rgb=function(t,e,r,i){this.is(t,"object")&&"h"in t&&"s"in t&&"l"in t&&(r=t.l,e=t.s,t=t.h),(t>1||e>1||r>1)&&(t/=360,e/=100,r/=100),t*=360;var n,a,s,o,l;return t=t%360/60,l=2*e*(r<.5?r:1-r),o=l*(1-H(t%2-1)),n=a=s=r-l/2,t=~~t,n+=[l,o,0,0,o,l][t],a+=[o,l,l,o,0,0][t],s+=[0,0,o,l,l,o][t],qt(n,a,s,i)},e.rgb2hsb=function(t,e,r){r=It(t,e,r),t=r[0],e=r[1],r=r[2];var i,n,a,s;return a=W(t,e,r),s=a-G(t,e,r),i=0==s?null:a==t?(e-r)/s:a==e?(r-t)/s+2:(t-e)/s+4,i=(i+360)%6*60/360,n=0==s?0:s/a,{h:i,s:n,b:a,toString:Ft}},e.rgb2hsl=function(t,e,r){r=It(t,e,r),t=r[0],e=r[1],r=r[2];var i,n,a,s,o,l;return s=W(t,e,r),o=G(t,e,r),l=s-o,i=0==l?null:s==t?(e-r)/l:s==e?(r-t)/l+2:(t-e)/l+4,i=(i+360)%6*60/360,a=(s+o)/2,n=0==l?0:a<.5?l/(2*a):l/(2-2*a),{h:i,s:n,l:a,toString:Rt}},e._path2string=function(){return this.join(",").replace(xt,"$1")};var Dt=e._preload=function(t,e){var r=T.doc.createElement("img");r.style.cssText="position:absolute;left:-9999em;top:-9999em",r.onload=function(){e.call(this),this.onload=null,T.doc.body.removeChild(this)},r.onerror=function(){T.doc.body.removeChild(this)},T.doc.body.appendChild(r),r.src=t};e.getRGB=n(function(t){if(!t||(t=I(t)).indexOf("-")+1)return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:a};if("none"==t)return{r:-1,g:-1,b:-1,hex:"none",toString:a};!(vt[A](t.toLowerCase().substring(0,2))||"#"==t.charAt())&&(t=Pt(t));var r,i,n,s,o,l,h,u=t.match(nt);return u?(u[2]&&(s=ut(u[2].substring(5),16),n=ut(u[2].substring(3,5),16),i=ut(u[2].substring(1,3),16)),u[3]&&(s=ut((l=u[3].charAt(3))+l,16),n=ut((l=u[3].charAt(2))+l,16),i=ut((l=u[3].charAt(1))+l,16)),u[4]&&(h=u[4][q](gt),i=ht(h[0]),"%"==h[0].slice(-1)&&(i*=2.55),n=ht(h[1]),"%"==h[1].slice(-1)&&(n*=2.55),s=ht(h[2]),"%"==h[2].slice(-1)&&(s*=2.55),"rgba"==u[1].toLowerCase().slice(0,4)&&(o=ht(h[3])),h[3]&&"%"==h[3].slice(-1)&&(o/=100)),u[5]?(h=u[5][q](gt),i=ht(h[0]),"%"==h[0].slice(-1)&&(i*=2.55),n=ht(h[1]),"%"==h[1].slice(-1)&&(n*=2.55),s=ht(h[2]),"%"==h[2].slice(-1)&&(s*=2.55),("deg"==h[0].slice(-3)||"°"==h[0].slice(-1))&&(i/=360),"hsba"==u[1].toLowerCase().slice(0,4)&&(o=ht(h[3])),h[3]&&"%"==h[3].slice(-1)&&(o/=100),e.hsb2rgb(i,n,s,o)):u[6]?(h=u[6][q](gt),i=ht(h[0]),"%"==h[0].slice(-1)&&(i*=2.55),n=ht(h[1]),"%"==h[1].slice(-1)&&(n*=2.55),s=ht(h[2]),"%"==h[2].slice(-1)&&(s*=2.55),("deg"==h[0].slice(-3)||"°"==h[0].slice(-1))&&(i/=360),"hsla"==u[1].toLowerCase().slice(0,4)&&(o=ht(h[3])),h[3]&&"%"==h[3].slice(-1)&&(o/=100),e.hsl2rgb(i,n,s,o)):(u={r:i,g:n,b:s,toString:a},u.hex="#"+(16777216|s|n<<8|i<<16).toString(16).slice(1),e.is(o,"finite")&&(u.opacity=o),u)):{r:-1,g:-1,b:-1,hex:"none",error:1,toString:a}},e),e.hsb=n(function(t,r,i){return e.hsb2rgb(t,r,i).hex}),e.hsl=n(function(t,r,i){return e.hsl2rgb(t,r,i).hex}),e.rgb=n(function(t,e,r){function i(t){return t+.5|0}return"#"+(16777216|i(r)|i(e)<<8|i(t)<<16).toString(16).slice(1)}),e.getColor=function(t){var e=this.getColor.start=this.getColor.start||{h:0,s:1,b:t||.75},r=this.hsb2rgb(e.h,e.s,e.b);return e.h+=.075,e.h>1&&(e.h=0,e.s-=.2,e.s<=0&&(this.getColor.start={h:0,s:1,b:e.b})),r.hex},e.getColor.reset=function(){delete this.start},e.parsePathString=function(t){if(!t)return null;var r=Vt(t);if(r.arr)return Yt(r.arr);var i={a:7,c:6,h:1,l:2,m:2,r:4,q:4,s:4,t:2,v:1,z:0},n=[];return e.is(t,Q)&&e.is(t[0],Q)&&(n=Yt(t)),n.length||I(t).replace(yt,function(t,e,r){var a=[],s=e.toLowerCase();if(r.replace(bt,function(t,e){e&&a.push(+e)}),"m"==s&&a.length>2&&(n.push([e][P](a.splice(0,2))),s="l",e="m"==e?"l":"L"),"r"==s)n.push([e][P](a));else for(;a.length>=i[s]&&(n.push([e][P](a.splice(0,i[s]))),i[s]););}),n.toString=e._path2string,r.arr=Yt(n),n},e.parseTransformString=n(function(t){if(!t)return null;var r={r:3,s:4,t:2,m:6},i=[];return e.is(t,Q)&&e.is(t[0],Q)&&(i=Yt(t)),i.length||I(t).replace(mt,function(t,e,r){var n=[],a=O.call(e);r.replace(bt,function(t,e){e&&n.push(+e)}),i.push([e][P](n))}),i.toString=e._path2string,i});var Vt=function(t){var e=Vt.ps=Vt.ps||{};return e[t]?e[t].sleep=100:e[t]={sleep:100},setTimeout(function(){for(var r in e)e[A](r)&&r!=t&&(e[r].sleep--,!e[r].sleep&&delete e[r])}),e[t]};e.findDotsAtSegment=function(t,e,r,i,n,a,s,o,l){var h=1-l,u=X(h,3),c=X(h,2),f=l*l,p=f*l,d=u*t+3*c*l*r+3*h*l*l*n+p*s,g=u*e+3*c*l*i+3*h*l*l*a+p*o,v=t+2*l*(r-t)+f*(n-2*r+t),x=e+2*l*(i-e)+f*(a-2*i+e),y=r+2*l*(n-r)+f*(s-2*n+r),m=i+2*l*(a-i)+f*(o-2*a+i),b=h*t+l*r,_=h*e+l*i,w=h*n+l*s,k=h*a+l*o,B=90-180*Y.atan2(v-y,x-m)/U;return(v>y||x<m)&&(B+=180),{x:d,y:g,m:{x:v,y:x},n:{x:y,y:m},start:{x:b,y:_},end:{x:w,y:k},alpha:B}},e.bezierBBox=function(t,r,i,n,a,s,o,l){e.is(t,"array")||(t=[t,r,i,n,a,s,o,l]);var h=Zt.apply(null,t);return{x:h.min.x,y:h.min.y,x2:h.max.x,y2:h.max.y,width:h.max.x-h.min.x,height:h.max.y-h.min.y}},e.isPointInsideBBox=function(t,e,r){return e>=t.x&&e<=t.x2&&r>=t.y&&r<=t.y2},e.isBBoxIntersect=function(t,r){var i=e.isPointInsideBBox;return i(r,t.x,t.y)||i(r,t.x2,t.y)||i(r,t.x,t.y2)||i(r,t.x2,t.y2)||i(t,r.x,r.y)||i(t,r.x2,r.y)||i(t,r.x,r.y2)||i(t,r.x2,r.y2)||(t.x<r.x2&&t.x>r.x||r.x<t.x2&&r.x>t.x)&&(t.y<r.y2&&t.y>r.y||r.y<t.y2&&r.y>t.y)},e.pathIntersection=function(t,e){return d(t,e)},e.pathIntersectionNumber=function(t,e){return d(t,e,1)},e.isPointInsidePath=function(t,r,i){var n=e.pathBBox(t);return e.isPointInsideBBox(n,r,i)&&d(t,[["M",r,i],["H",n.x2+10]],1)%2==1},e._removedFactory=function(e){return function(){t("raphael.log",null,"Raphaël: you are calling to method “"+e+"” of removed object",e)}};var Ot=e.pathBBox=function(t){var e=Vt(t);if(e.bbox)return r(e.bbox);if(!t)return{x:0,y:0,width:0,height:0,x2:0,y2:0};t=Qt(t);for(var i=0,n=0,a=[],s=[],o,l=0,h=t.length;l<h;l++)if(o=t[l],"M"==o[0])i=o[1],n=o[2],a.push(i),s.push(n);else{var u=Zt(i,n,o[1],o[2],o[3],o[4],o[5],o[6]);a=a[P](u.min.x,u.max.x),s=s[P](u.min.y,u.max.y),i=o[5],n=o[6]}var c=G[z](0,a),f=G[z](0,s),p=W[z](0,a),d=W[z](0,s),g=p-c,v=d-f,x={x:c,y:f,x2:p,y2:d,width:g,height:v,cx:c+g/2,cy:f+v/2};return e.bbox=r(x),x},Yt=function(t){var i=r(t);return i.toString=e._path2string,i},Wt=e._pathToRelative=function(t){var r=Vt(t);if(r.rel)return Yt(r.rel);e.is(t,Q)&&e.is(t&&t[0],Q)||(t=e.parsePathString(t));var i=[],n=0,a=0,s=0,o=0,l=0;"M"==t[0][0]&&(n=t[0][1],a=t[0][2],s=n,o=a,l++,i.push(["M",n,a]));for(var h=l,u=t.length;h<u;h++){var c=i[h]=[],f=t[h];if(f[0]!=O.call(f[0]))switch(c[0]=O.call(f[0]),c[0]){case"a":c[1]=f[1],c[2]=f[2],c[3]=f[3],c[4]=f[4],c[5]=f[5],c[6]=+(f[6]-n).toFixed(3),c[7]=+(f[7]-a).toFixed(3);break;case"v":c[1]=+(f[1]-a).toFixed(3);break;case"m":s=f[1],o=f[2];default:for(var p=1,d=f.length;p<d;p++)c[p]=+(f[p]-(p%2?n:a)).toFixed(3)}else{c=i[h]=[],"m"==f[0]&&(s=f[1]+n,o=f[2]+a);for(var g=0,v=f.length;g<v;g++)i[h][g]=f[g]}var x=i[h].length;switch(i[h][0]){case"z":n=s,a=o;break;case"h":n+=+i[h][x-1];break;case"v":a+=+i[h][x-1];break;default:n+=+i[h][x-2],a+=+i[h][x-1]}}return i.toString=e._path2string,r.rel=Yt(i),i},Gt=e._pathToAbsolute=function(t){var r=Vt(t);if(r.abs)return Yt(r.abs);if(e.is(t,Q)&&e.is(t&&t[0],Q)||(t=e.parsePathString(t)),!t||!t.length)return[["M",0,0]];var i=[],n=0,a=0,o=0,l=0,h=0;"M"==t[0][0]&&(n=+t[0][1],a=+t[0][2],o=n,l=a,h++,i[0]=["M",n,a]);for(var u=3==t.length&&"M"==t[0][0]&&"R"==t[1][0].toUpperCase()&&"Z"==t[2][0].toUpperCase(),c,f,p=h,d=t.length;p<d;p++){if(i.push(c=[]),f=t[p],f[0]!=ct.call(f[0]))switch(c[0]=ct.call(f[0]),c[0]){case"A":c[1]=f[1],c[2]=f[2],c[3]=f[3],c[4]=f[4],c[5]=f[5],c[6]=+(f[6]+n),c[7]=+(f[7]+a);break;case"V":c[1]=+f[1]+a;break;case"H":c[1]=+f[1]+n;break;case"R":for(var g=[n,a][P](f.slice(1)),v=2,x=g.length;v<x;v++)g[v]=+g[v]+n,g[++v]=+g[v]+a;i.pop(),i=i[P](s(g,u));break;case"M":o=+f[1]+n,l=+f[2]+a;default:for(v=1,x=f.length;v<x;v++)c[v]=+f[v]+(v%2?n:a)}else if("R"==f[0])g=[n,a][P](f.slice(1)),i.pop(),i=i[P](s(g,u)),c=["R"][P](f.slice(-2));else for(var y=0,m=f.length;y<m;y++)c[y]=f[y];switch(c[0]){case"Z":n=o,a=l;break;case"H":n=c[1];break;case"V":a=c[1];break;case"M":o=c[c.length-2],l=c[c.length-1];default:n=c[c.length-2],a=c[c.length-1]}}return i.toString=e._path2string,r.abs=Yt(i),i},Ht=function(t,e,r,i){return[t,e,r,i,r,i]},Xt=function(t,e,r,i,n,a){var s=1/3,o=2/3;return[s*t+o*r,s*e+o*i,s*n+o*r,s*a+o*i,n,a]},Ut=function(t,e,r,i,a,s,o,l,h,u){var c=120*U/180,f=U/180*(+a||0),p=[],d,g=n(function(t,e,r){var i=t*Y.cos(r)-e*Y.sin(r),n=t*Y.sin(r)+e*Y.cos(r);return{x:i,y:n}});if(u)S=u[0],A=u[1],B=u[2],C=u[3];else{d=g(t,e,-f),t=d.x,e=d.y,d=g(l,h,-f),l=d.x,h=d.y;var v=Y.cos(U/180*a),x=Y.sin(U/180*a),y=(t-l)/2,m=(e-h)/2,b=y*y/(r*r)+m*m/(i*i);b>1&&(b=Y.sqrt(b),r=b*r,i=b*i);var _=r*r,w=i*i,k=(s==o?-1:1)*Y.sqrt(H((_*w-_*m*m-w*y*y)/(_*m*m+w*y*y))),B=k*r*m/i+(t+l)/2,C=k*-i*y/r+(e+h)/2,S=Y.asin(((e-C)/i).toFixed(9)),A=Y.asin(((h-C)/i).toFixed(9));S=t<B?U-S:S,A=l<B?U-A:A,S<0&&(S=2*U+S),A<0&&(A=2*U+A),o&&S>A&&(S-=2*U),!o&&A>S&&(A-=2*U)}var T=A-S;if(H(T)>c){var E=A,M=l,N=h;A=S+c*(o&&A>S?1:-1),l=B+r*Y.cos(A),h=C+i*Y.sin(A),p=Ut(l,h,r,i,a,0,o,M,N,[A,E,B,C])}T=A-S;var L=Y.cos(S),z=Y.sin(S),F=Y.cos(A),R=Y.sin(A),j=Y.tan(T/4),I=4/3*r*j,D=4/3*i*j,V=[t,e],O=[t+I*z,e-D*L],W=[l+I*R,h-D*F],G=[l,h];if(O[0]=2*V[0]-O[0],O[1]=2*V[1]-O[1],u)return[O,W,G][P](p);p=[O,W,G][P](p).join()[q](",");for(var X=[],$=0,Z=p.length;$<Z;$++)X[$]=$%2?g(p[$-1],p[$],f).y:g(p[$],p[$+1],f).x;return X},$t=function(t,e,r,i,n,a,s,o,l){var h=1-l;return{x:X(h,3)*t+3*X(h,2)*l*r+3*h*l*l*n+X(l,3)*s,y:X(h,3)*e+3*X(h,2)*l*i+3*h*l*l*a+X(l,3)*o}},Zt=n(function(t,e,r,i,n,a,s,o){var l=n-2*r+t-(s-2*n+r),h=2*(r-t)-2*(n-r),u=t-r,c=(-h+Y.sqrt(h*h-4*l*u))/2/l,f=(-h-Y.sqrt(h*h-4*l*u))/2/l,p=[e,o],d=[t,s],g;return H(c)>"1e12"&&(c=.5),H(f)>"1e12"&&(f=.5),c>0&&c<1&&(g=$t(t,e,r,i,n,a,s,o,c),d.push(g.x),p.push(g.y)),f>0&&f<1&&(g=$t(t,e,r,i,n,a,s,o,f),d.push(g.x),p.push(g.y)),l=a-2*i+e-(o-2*a+i),h=2*(i-e)-2*(a-i),u=e-i,c=(-h+Y.sqrt(h*h-4*l*u))/2/l,f=(-h-Y.sqrt(h*h-4*l*u))/2/l,H(c)>"1e12"&&(c=.5),H(f)>"1e12"&&(f=.5),c>0&&c<1&&(g=$t(t,e,r,i,n,a,s,o,c),d.push(g.x),p.push(g.y)),f>0&&f<1&&(g=$t(t,e,r,i,n,a,s,o,f),d.push(g.x),p.push(g.y)),{min:{x:G[z](0,d),y:G[z](0,p)},max:{x:W[z](0,d),y:W[z](0,p)}}}),Qt=e._path2curve=n(function(t,e){var r=!e&&Vt(t);if(!e&&r.curve)return Yt(r.curve);for(var i=Gt(t),n=e&&Gt(e),a={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},s={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},o=(function(t,e,r){var i,n,a={T:1,Q:1};if(!t)return["C",e.x,e.y,e.x,e.y,e.x,e.y];switch(!(t[0]in a)&&(e.qx=e.qy=null),t[0]){case"M":e.X=t[1],e.Y=t[2];break;case"A":t=["C"][P](Ut[z](0,[e.x,e.y][P](t.slice(1))));break;case"S":"C"==r||"S"==r?(i=2*e.x-e.bx,n=2*e.y-e.by):(i=e.x,n=e.y),t=["C",i,n][P](t.slice(1));break;case"T":"Q"==r||"T"==r?(e.qx=2*e.x-e.qx,e.qy=2*e.y-e.qy):(e.qx=e.x,e.qy=e.y),t=["C"][P](Xt(e.x,e.y,e.qx,e.qy,t[1],t[2]));break;case"Q":e.qx=t[1],e.qy=t[2],t=["C"][P](Xt(e.x,e.y,t[1],t[2],t[3],t[4]));break;case"L":t=["C"][P](Ht(e.x,e.y,t[1],t[2]));break;case"H":t=["C"][P](Ht(e.x,e.y,t[1],e.y));break;case"V":t=["C"][P](Ht(e.x,e.y,e.x,t[1]));break;case"Z":t=["C"][P](Ht(e.x,e.y,e.X,e.Y))}return t}),l=function(t,e){if(t[e].length>7){t[e].shift();for(var r=t[e];r.length;)u[e]="A",n&&(c[e]="A"),t.splice(e++,0,["C"][P](r.splice(0,6)));t.splice(e,1),g=W(i.length,n&&n.length||0)}},h=function(t,e,r,a,s){t&&e&&"M"==t[s][0]&&"M"!=e[s][0]&&(e.splice(s,0,["M",a.x,a.y]),r.bx=0,r.by=0,r.x=t[s][1],r.y=t[s][2],g=W(i.length,n&&n.length||0))},u=[],c=[],f="",p="",d=0,g=W(i.length,n&&n.length||0);d<g;d++){i[d]&&(f=i[d][0]),"C"!=f&&(u[d]=f,d&&(p=u[d-1])),i[d]=o(i[d],a,p),"A"!=u[d]&&"C"==f&&(u[d]="C"),l(i,d),n&&(n[d]&&(f=n[d][0]),"C"!=f&&(c[d]=f,d&&(p=c[d-1])),n[d]=o(n[d],s,p),"A"!=c[d]&&"C"==f&&(c[d]="C"),l(n,d)),h(i,n,a,s,d),h(n,i,s,a,d);var v=i[d],x=n&&n[d],y=v.length,m=n&&x.length;a.x=v[y-2],a.y=v[y-1],a.bx=ht(v[y-4])||a.x,a.by=ht(v[y-3])||a.y,s.bx=n&&(ht(x[m-4])||s.x),s.by=n&&(ht(x[m-3])||s.y),s.x=n&&x[m-2],s.y=n&&x[m-1]}return n||(r.curve=Yt(i)),n?[i,n]:i},null,Yt),Jt=e._parseDots=n(function(t){for(var r=[],i=0,n=t.length;i<n;i++){var a={},s=t[i].match(/^([^:]*):?([\d\.]*)/);if(a.color=e.getRGB(s[1]),a.color.error)return null;a.opacity=a.color.opacity,a.color=a.color.hex,s[2]&&(a.offset=s[2]+"%"),r.push(a)}for(i=1,n=r.length-1;i<n;i++)if(!r[i].offset){for(var o=ht(r[i-1].offset||0),l=0,h=i+1;h<n;h++)if(r[h].offset){l=r[h].offset;break}l||(l=100,h=n),l=ht(l);for(var u=(l-o)/(h-i+1);i<h;i++)o+=u,r[i].offset=o+"%"}return r}),Kt=e._tear=function(t,e){t==e.top&&(e.top=t.prev),t==e.bottom&&(e.bottom=t.next),t.next&&(t.next.prev=t.prev),t.prev&&(t.prev.next=t.next)},te=e._tofront=function(t,e){e.top!==t&&(Kt(t,e),t.next=null,t.prev=e.top,e.top.next=t,e.top=t)},ee=e._toback=function(t,e){e.bottom!==t&&(Kt(t,e),t.next=e.bottom,t.prev=null,e.bottom.prev=t,e.bottom=t)},re=e._insertafter=function(t,e,r){Kt(t,r),e==r.top&&(r.top=t),e.next&&(e.next.prev=t),t.next=e.next,t.prev=e,e.next=t},ie=e._insertbefore=function(t,e,r){Kt(t,r),e==r.bottom&&(r.bottom=t),e.prev&&(e.prev.next=t),t.prev=e.prev,e.prev=t,t.next=e},ne=e.toMatrix=function(t,e){var r=Ot(t),i={_:{transform:R},getBBox:function(){return r}};return se(i,e),i.matrix},ae=e.transformPath=function(t,e){return Mt(t,ne(t,e))},se=e._extractTransform=function(t,r){if(null==r)return t._.transform;r=I(r).replace(/\.{3}|\u2026/g,t._.transform||R);var i=e.parseTransformString(r),n=0,a=0,s=0,o=1,l=1,h=t._,u=new g;if(h.transform=i||[],i)for(var c=0,f=i.length;c<f;c++){var p=i[c],d=p.length,v=I(p[0]).toLowerCase(),x=p[0]!=v,y=x?u.invert():0,m,b,_,w,k;"t"==v&&3==d?x?(m=y.x(0,0),b=y.y(0,0),_=y.x(p[1],p[2]),w=y.y(p[1],p[2]),u.translate(_-m,w-b)):u.translate(p[1],p[2]):"r"==v?2==d?(k=k||t.getBBox(1),u.rotate(p[1],k.x+k.width/2,k.y+k.height/2),n+=p[1]):4==d&&(x?(_=y.x(p[2],p[3]),w=y.y(p[2],p[3]),u.rotate(p[1],_,w)):u.rotate(p[1],p[2],p[3]),n+=p[1]):"s"==v?2==d||3==d?(k=k||t.getBBox(1),u.scale(p[1],p[d-1],k.x+k.width/2,k.y+k.height/2),o*=p[1],l*=p[d-1]):5==d&&(x?(_=y.x(p[3],p[4]),w=y.y(p[3],p[4]),u.scale(p[1],p[2],_,w)):u.scale(p[1],p[2],p[3],p[4]),o*=p[1],l*=p[2]):"m"==v&&7==d&&u.add(p[1],p[2],p[3],p[4],p[5],p[6]),h.dirtyT=1,t.matrix=u}t.matrix=u,h.sx=o,h.sy=l,h.deg=n,h.dx=a=u.e,h.dy=s=u.f,1==o&&1==l&&!n&&h.bbox?(h.bbox.x+=+a,h.bbox.y+=+s):h.dirtyT=1},oe=function(t){var e=t[0];switch(e.toLowerCase()){case"t":return[e,0,0];case"m":return[e,1,0,0,1,0,0];case"r":return 4==t.length?[e,0,t[2],t[3]]:[e,0];case"s":return 5==t.length?[e,1,1,t[3],t[4]]:3==t.length?[e,1,1]:[e,1]}},le=e._equaliseTransform=function(t,r){r=I(r).replace(/\.{3}|\u2026/g,t),t=e.parseTransformString(t)||[],r=e.parseTransformString(r)||[];for(var i=W(t.length,r.length),n=[],a=[],s=0,o,l,h,u;s<i;s++){if(h=t[s]||oe(r[s]),u=r[s]||oe(h),h[0]!=u[0]||"r"==h[0].toLowerCase()&&(h[2]!=u[2]||h[3]!=u[3])||"s"==h[0].toLowerCase()&&(h[3]!=u[3]||h[4]!=u[4]))return;for(n[s]=[],a[s]=[],o=0,l=W(h.length,u.length);o<l;o++)o in h&&(n[s][o]=h[o]),o in u&&(a[s][o]=u[o])}return{from:n,to:a}};e._getContainer=function(t,r,i,n){var a;if(a=null!=n||e.is(t,"object")?t:T.doc.getElementById(t),null!=a)return a.tagName?null==r?{container:a,width:a.style.pixelWidth||a.offsetWidth,height:a.style.pixelHeight||a.offsetHeight}:{container:a,width:r,height:i}:{container:1,x:t,y:r,width:i,height:n}},e.pathToRelative=Wt,e._engine={},e.path2curve=Qt,e.matrix=function(t,e,r,i,n,a){return new g(t,e,r,i,n,a)},function(t){function r(t){return t[0]*t[0]+t[1]*t[1]}function i(t){var e=Y.sqrt(r(t));t[0]&&(t[0]/=e),t[1]&&(t[1]/=e)}t.add=function(t,e,r,i,n,a){var s=[[],[],[]],o=[[this.a,this.c,this.e],[this.b,this.d,this.f],[0,0,1]],l=[[t,r,n],[e,i,a],[0,0,1]],h,u,c,f;for(t&&t instanceof g&&(l=[[t.a,t.c,t.e],[t.b,t.d,t.f],[0,0,1]]),h=0;h<3;h++)for(u=0;u<3;u++){for(f=0,c=0;c<3;c++)f+=o[h][c]*l[c][u];s[h][u]=f}this.a=s[0][0],this.b=s[1][0],this.c=s[0][1],this.d=s[1][1],this.e=s[0][2],this.f=s[1][2]},t.invert=function(){var t=this,e=t.a*t.d-t.b*t.c;return new g(t.d/e,-t.b/e,-t.c/e,t.a/e,(t.c*t.f-t.d*t.e)/e,(t.b*t.e-t.a*t.f)/e)},t.clone=function(){return new g(this.a,this.b,this.c,this.d,this.e,this.f)},t.translate=function(t,e){
this.add(1,0,0,1,t,e)},t.scale=function(t,e,r,i){null==e&&(e=t),(r||i)&&this.add(1,0,0,1,r,i),this.add(t,0,0,e,0,0),(r||i)&&this.add(1,0,0,1,-r,-i)},t.rotate=function(t,r,i){t=e.rad(t),r=r||0,i=i||0;var n=+Y.cos(t).toFixed(9),a=+Y.sin(t).toFixed(9);this.add(n,a,-a,n,r,i),this.add(1,0,0,1,-r,-i)},t.x=function(t,e){return t*this.a+e*this.c+this.e},t.y=function(t,e){return t*this.b+e*this.d+this.f},t.get=function(t){return+this[I.fromCharCode(97+t)].toFixed(4)},t.toString=function(){return e.svg?"matrix("+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)].join()+")":[this.get(0),this.get(2),this.get(1),this.get(3),0,0].join()},t.toFilter=function(){return"progid:DXImageTransform.Microsoft.Matrix(M11="+this.get(0)+", M12="+this.get(2)+", M21="+this.get(1)+", M22="+this.get(3)+", Dx="+this.get(4)+", Dy="+this.get(5)+", sizingmethod='auto expand')"},t.offset=function(){return[this.e.toFixed(4),this.f.toFixed(4)]},t.split=function(){var t={};t.dx=this.e,t.dy=this.f;var n=[[this.a,this.c],[this.b,this.d]];t.scalex=Y.sqrt(r(n[0])),i(n[0]),t.shear=n[0][0]*n[1][0]+n[0][1]*n[1][1],n[1]=[n[1][0]-n[0][0]*t.shear,n[1][1]-n[0][1]*t.shear],t.scaley=Y.sqrt(r(n[1])),i(n[1]),t.shear/=t.scaley;var a=-n[0][1],s=n[1][1];return s<0?(t.rotate=e.deg(Y.acos(s)),a<0&&(t.rotate=360-t.rotate)):t.rotate=e.deg(Y.asin(a)),t.isSimple=!(+t.shear.toFixed(9)||t.scalex.toFixed(9)!=t.scaley.toFixed(9)&&t.rotate),t.isSuperSimple=!+t.shear.toFixed(9)&&t.scalex.toFixed(9)==t.scaley.toFixed(9)&&!t.rotate,t.noRotation=!+t.shear.toFixed(9)&&!t.rotate,t},t.toTransformString=function(t){var e=t||this[q]();return e.isSimple?(e.scalex=+e.scalex.toFixed(4),e.scaley=+e.scaley.toFixed(4),e.rotate=+e.rotate.toFixed(4),(e.dx||e.dy?"t"+[e.dx,e.dy]:R)+(1!=e.scalex||1!=e.scaley?"s"+[e.scalex,e.scaley,0,0]:R)+(e.rotate?"r"+[e.rotate,0,0]:R)):"m"+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)]}}(g.prototype);for(var he=function(){this.returnValue=!1},ue=function(){return this.originalEvent.preventDefault()},ce=function(){this.cancelBubble=!0},fe=function(){return this.originalEvent.stopPropagation()},pe=function(t){var e=T.doc.documentElement.scrollTop||T.doc.body.scrollTop,r=T.doc.documentElement.scrollLeft||T.doc.body.scrollLeft;return{x:t.clientX+r,y:t.clientY+e}},de=function(){return T.doc.addEventListener?function(t,e,r,i){var n=function(t){var e=pe(t);return r.call(i,t,e.x,e.y)};if(t.addEventListener(e,n,!1),F&&V[e]){var a=function(e){for(var n=pe(e),a=e,s=0,o=e.targetTouches&&e.targetTouches.length;s<o;s++)if(e.targetTouches[s].target==t){e=e.targetTouches[s],e.originalEvent=a,e.preventDefault=ue,e.stopPropagation=fe;break}return r.call(i,e,n.x,n.y)};t.addEventListener(V[e],a,!1)}return function(){return t.removeEventListener(e,n,!1),F&&V[e]&&t.removeEventListener(V[e],a,!1),!0}}:T.doc.attachEvent?function(t,e,r,i){var n=function(t){t=t||T.win.event;var e=T.doc.documentElement.scrollTop||T.doc.body.scrollTop,n=T.doc.documentElement.scrollLeft||T.doc.body.scrollLeft,a=t.clientX+n,s=t.clientY+e;return t.preventDefault=t.preventDefault||he,t.stopPropagation=t.stopPropagation||ce,r.call(i,t,a,s)};t.attachEvent("on"+e,n);var a=function(){return t.detachEvent("on"+e,n),!0};return a}:void 0}(),ge=[],ve=function(e){for(var r=e.clientX,i=e.clientY,n=T.doc.documentElement.scrollTop||T.doc.body.scrollTop,a=T.doc.documentElement.scrollLeft||T.doc.body.scrollLeft,s,o=ge.length;o--;){if(s=ge[o],F&&e.touches){for(var l=e.touches.length,h;l--;)if(h=e.touches[l],h.identifier==s.el._drag.id){r=h.clientX,i=h.clientY,(e.originalEvent?e.originalEvent:e).preventDefault();break}}else e.preventDefault();var u=s.el.node,c,f=u.nextSibling,p=u.parentNode,d=u.style.display;T.win.opera&&p.removeChild(u),u.style.display="none",c=s.el.paper.getElementByPoint(r,i),u.style.display=d,T.win.opera&&(f?p.insertBefore(u,f):p.appendChild(u)),c&&t("raphael.drag.over."+s.el.id,s.el,c),r+=a,i+=n,t("raphael.drag.move."+s.el.id,s.move_scope||s.el,r-s.el._drag.x,i-s.el._drag.y,r,i,e)}},xe=function(r){e.unmousemove(ve).unmouseup(xe);for(var i=ge.length,n;i--;)n=ge[i],n.el._drag={},t("raphael.drag.end."+n.el.id,n.end_scope||n.start_scope||n.move_scope||n.el,r);ge=[]},ye=e.el={},me=D.length;me--;)!function(t){e[t]=ye[t]=function(r,i){return e.is(r,"function")&&(this.events=this.events||[],this.events.push({name:t,f:r,unbind:de(this.shape||this.node||T.doc,t,r,i||this)})),this},e["un"+t]=ye["un"+t]=function(r){for(var i=this.events||[],n=i.length;n--;)i[n].name!=t||!e.is(r,"undefined")&&i[n].f!=r||(i[n].unbind(),i.splice(n,1),!i.length&&delete this.events);return this}}(D[me]);ye.data=function(r,i){var n=wt[this.id]=wt[this.id]||{};if(0==arguments.length)return n;if(1==arguments.length){if(e.is(r,"object")){for(var a in r)r[A](a)&&this.data(a,r[a]);return this}return t("raphael.data.get."+this.id,this,n[r],r),n[r]}return n[r]=i,t("raphael.data.set."+this.id,this,i,r),this},ye.removeData=function(t){return null==t?wt[this.id]={}:wt[this.id]&&delete wt[this.id][t],this},ye.getData=function(){return r(wt[this.id]||{})},ye.hover=function(t,e,r,i){return this.mouseover(t,r).mouseout(e,i||r)},ye.unhover=function(t,e){return this.unmouseover(t).unmouseout(e)};var be=[];ye.drag=function(r,i,n,a,s,o){function l(l){(l.originalEvent||l).preventDefault();var h=l.clientX,u=l.clientY,c=T.doc.documentElement.scrollTop||T.doc.body.scrollTop,f=T.doc.documentElement.scrollLeft||T.doc.body.scrollLeft;if(this._drag.id=l.identifier,F&&l.touches)for(var p=l.touches.length,d;p--;)if(d=l.touches[p],this._drag.id=d.identifier,d.identifier==this._drag.id){h=d.clientX,u=d.clientY;break}this._drag.x=h+f,this._drag.y=u+c,!ge.length&&e.mousemove(ve).mouseup(xe),ge.push({el:this,move_scope:a,start_scope:s,end_scope:o}),i&&t.on("raphael.drag.start."+this.id,i),r&&t.on("raphael.drag.move."+this.id,r),n&&t.on("raphael.drag.end."+this.id,n),t("raphael.drag.start."+this.id,s||a||this,l.clientX+f,l.clientY+c,l)}return this._drag={},be.push({el:this,start:l}),this.mousedown(l),this},ye.onDragOver=function(e){e?t.on("raphael.drag.over."+this.id,e):t.unbind("raphael.drag.over."+this.id)},ye.undrag=function(){for(var r=be.length;r--;)be[r].el==this&&(this.unmousedown(be[r].start),be.splice(r,1),t.unbind("raphael.drag.*."+this.id));!be.length&&e.unmousemove(ve).unmouseup(xe),ge=[]},N.circle=function(t,r,i){var n=e._engine.circle(this,t||0,r||0,i||0);return this.__set__&&this.__set__.push(n),n},N.rect=function(t,r,i,n,a){var s=e._engine.rect(this,t||0,r||0,i||0,n||0,a||0);return this.__set__&&this.__set__.push(s),s},N.ellipse=function(t,r,i,n){var a=e._engine.ellipse(this,t||0,r||0,i||0,n||0);return this.__set__&&this.__set__.push(a),a},N.path=function(t){t&&!e.is(t,Z)&&!e.is(t[0],Q)&&(t+=R);var r=e._engine.path(e.format[z](e,arguments),this);return this.__set__&&this.__set__.push(r),r},N.image=function(t,r,i,n,a){var s=e._engine.image(this,t||"about:blank",r||0,i||0,n||0,a||0);return this.__set__&&this.__set__.push(s),s},N.text=function(t,r,i){var n=e._engine.text(this,t||0,r||0,I(i));return this.__set__&&this.__set__.push(n),n},N.set=function(t){!e.is(t,"array")&&(t=Array.prototype.splice.call(arguments,0,arguments.length));var r=new ze(t);return this.__set__&&this.__set__.push(r),r.paper=this,r.type="set",r},N.setStart=function(t){this.__set__=t||this.set()},N.setFinish=function(t){var e=this.__set__;return delete this.__set__,e},N.getSize=function(){var t=this.canvas.parentNode;return{width:t.offsetWidth,height:t.offsetHeight}},N.setSize=function(t,r){return e._engine.setSize.call(this,t,r)},N.setViewBox=function(t,r,i,n,a){return e._engine.setViewBox.call(this,t,r,i,n,a)},N.top=N.bottom=null,N.raphael=e;var _e=function(t){var e=t.getBoundingClientRect(),r=t.ownerDocument,i=r.body,n=r.documentElement,a=n.clientTop||i.clientTop||0,s=n.clientLeft||i.clientLeft||0,o=e.top+(T.win.pageYOffset||n.scrollTop||i.scrollTop)-a,l=e.left+(T.win.pageXOffset||n.scrollLeft||i.scrollLeft)-s;return{y:o,x:l}};N.getElementByPoint=function(t,e){var r=this,i=r.canvas,n=T.doc.elementFromPoint(t,e);if(T.win.opera&&"svg"==n.tagName){var a=_e(i),s=i.createSVGRect();s.x=t-a.x,s.y=e-a.y,s.width=s.height=1;var o=i.getIntersectionList(s,null);o.length&&(n=o[o.length-1])}if(!n)return null;for(;n.parentNode&&n!=i.parentNode&&!n.raphael;)n=n.parentNode;return n==r.canvas.parentNode&&(n=i),n=n&&n.raphael?r.getById(n.raphaelid):null},N.getElementsByBBox=function(t){var r=this.set();return this.forEach(function(i){e.isBBoxIntersect(i.getBBox(),t)&&r.push(i)}),r},N.getById=function(t){for(var e=this.bottom;e;){if(e.id==t)return e;e=e.next}return null},N.forEach=function(t,e){for(var r=this.bottom;r;){if(t.call(e,r)===!1)return this;r=r.next}return this},N.getElementsByPoint=function(t,e){var r=this.set();return this.forEach(function(i){i.isPointInside(t,e)&&r.push(i)}),r},ye.isPointInside=function(t,r){var i=this.realPath=Et[this.type](this);return this.attr("transform")&&this.attr("transform").length&&(i=e.transformPath(i,this.attr("transform"))),e.isPointInsidePath(i,t,r)},ye.getBBox=function(t){if(this.removed)return{};var e=this._;return t?(!e.dirty&&e.bboxwt||(this.realPath=Et[this.type](this),e.bboxwt=Ot(this.realPath),e.bboxwt.toString=x,e.dirty=0),e.bboxwt):((e.dirty||e.dirtyT||!e.bbox)&&(!e.dirty&&this.realPath||(e.bboxwt=0,this.realPath=Et[this.type](this)),e.bbox=Ot(Mt(this.realPath,this.matrix)),e.bbox.toString=x,e.dirty=e.dirtyT=0),e.bbox)},ye.clone=function(){if(this.removed)return null;var t=this.paper[this.type]().attr(this.attr());return this.__set__&&this.__set__.push(t),t},ye.glow=function(t){if("text"==this.type)return null;t=t||{};var e={width:(t.width||10)+(+this.attr("stroke-width")||1),fill:t.fill||!1,opacity:null==t.opacity?.5:t.opacity,offsetx:t.offsetx||0,offsety:t.offsety||0,color:t.color||"#000"},r=e.width/2,i=this.paper,n=i.set(),a=this.realPath||Et[this.type](this);a=this.matrix?Mt(a,this.matrix):a;for(var s=1;s<r+1;s++)n.push(i.path(a).attr({stroke:e.color,fill:e.fill?e.color:"none","stroke-linejoin":"round","stroke-linecap":"round","stroke-width":+(e.width/r*s).toFixed(3),opacity:+(e.opacity/r).toFixed(3)}));return n.insertBefore(this).translate(e.offsetx,e.offsety)};var we={},ke=function(t,r,i,n,a,s,o,u,c){return null==c?l(t,r,i,n,a,s,o,u):e.findDotsAtSegment(t,r,i,n,a,s,o,u,h(t,r,i,n,a,s,o,u,c))},Be=function(t,r){return function(i,n,a){i=Qt(i);for(var s,o,l,h,u="",c={},f,p=0,d=0,g=i.length;d<g;d++){if(l=i[d],"M"==l[0])s=+l[1],o=+l[2];else{if(h=ke(s,o,l[1],l[2],l[3],l[4],l[5],l[6]),p+h>n){if(r&&!c.start){if(f=ke(s,o,l[1],l[2],l[3],l[4],l[5],l[6],n-p),u+=["C"+f.start.x,f.start.y,f.m.x,f.m.y,f.x,f.y],a)return u;c.start=u,u=["M"+f.x,f.y+"C"+f.n.x,f.n.y,f.end.x,f.end.y,l[5],l[6]].join(),p+=h,s=+l[5],o=+l[6];continue}if(!t&&!r)return f=ke(s,o,l[1],l[2],l[3],l[4],l[5],l[6],n-p),{x:f.x,y:f.y,alpha:f.alpha}}p+=h,s=+l[5],o=+l[6]}u+=l.shift()+l}return c.end=u,f=t?p:r?c:e.findDotsAtSegment(s,o,l[0],l[1],l[2],l[3],l[4],l[5],1),f.alpha&&(f={x:f.x,y:f.y,alpha:f.alpha}),f}},Ce=Be(1),Se=Be(),Ae=Be(0,1);e.getTotalLength=Ce,e.getPointAtLength=Se,e.getSubpath=function(t,e,r){if(this.getTotalLength(t)-r<1e-6)return Ae(t,e).end;var i=Ae(t,r,1);return e?Ae(i,e).end:i},ye.getTotalLength=function(){var t=this.getPath();if(t)return this.node.getTotalLength?this.node.getTotalLength():Ce(t)},ye.getPointAtLength=function(t){var e=this.getPath();if(e)return Se(e,t)},ye.getPath=function(){var t,r=e._getPath[this.type];if("text"!=this.type&&"set"!=this.type)return r&&(t=r(this)),t},ye.getSubpath=function(t,r){var i=this.getPath();if(i)return e.getSubpath(i,t,r)};var Te=e.easing_formulas={linear:function(t){return t},"<":function(t){return X(t,1.7)},">":function(t){return X(t,.48)},"<>":function(t){var e=.48-t/1.04,r=Y.sqrt(.1734+e*e),i=r-e,n=X(H(i),1/3)*(i<0?-1:1),a=-r-e,s=X(H(a),1/3)*(a<0?-1:1),o=n+s+.5;return 3*(1-o)*o*o+o*o*o},backIn:function(t){var e=1.70158;return t*t*((e+1)*t-e)},backOut:function(t){t-=1;var e=1.70158;return t*t*((e+1)*t+e)+1},elastic:function(t){return t==!!t?t:X(2,-10*t)*Y.sin((t-.075)*(2*U)/.3)+1},bounce:function(t){var e=7.5625,r=2.75,i;return t<1/r?i=e*t*t:t<2/r?(t-=1.5/r,i=e*t*t+.75):t<2.5/r?(t-=2.25/r,i=e*t*t+.9375):(t-=2.625/r,i=e*t*t+.984375),i}};Te.easeIn=Te["ease-in"]=Te["<"],Te.easeOut=Te["ease-out"]=Te[">"],Te.easeInOut=Te["ease-in-out"]=Te["<>"],Te["back-in"]=Te.backIn,Te["back-out"]=Te.backOut;var Ee=[],Me=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){setTimeout(t,16)},Ne=function(){for(var r=+new Date,i=0;i<Ee.length;i++){var n=Ee[i];if(!n.el.removed&&!n.paused){var a=r-n.start,s=n.ms,o=n.easing,l=n.from,h=n.diff,u=n.to,c=n.t,f=n.el,p={},d,g={},v;if(n.initstatus?(a=(n.initstatus*n.anim.top-n.prev)/(n.percent-n.prev)*s,n.status=n.initstatus,delete n.initstatus,n.stop&&Ee.splice(i--,1)):n.status=(n.prev+(n.percent-n.prev)*(a/s))/n.anim.top,!(a<0))if(a<s){var x=o(a/s);for(var y in l)if(l[A](y)){switch(pt[y]){case $:d=+l[y]+x*s*h[y];break;case"colour":d="rgb("+[Le(ot(l[y].r+x*s*h[y].r)),Le(ot(l[y].g+x*s*h[y].g)),Le(ot(l[y].b+x*s*h[y].b))].join(",")+")";break;case"path":d=[];for(var m=0,_=l[y].length;m<_;m++){d[m]=[l[y][m][0]];for(var w=1,k=l[y][m].length;w<k;w++)d[m][w]=+l[y][m][w]+x*s*h[y][m][w];d[m]=d[m].join(j)}d=d.join(j);break;case"transform":if(h[y].real)for(d=[],m=0,_=l[y].length;m<_;m++)for(d[m]=[l[y][m][0]],w=1,k=l[y][m].length;w<k;w++)d[m][w]=l[y][m][w]+x*s*h[y][m][w];else{var B=function(t){return+l[y][t]+x*s*h[y][t]};d=[["m",B(0),B(1),B(2),B(3),B(4),B(5)]]}break;case"csv":if("clip-rect"==y)for(d=[],m=4;m--;)d[m]=+l[y][m]+x*s*h[y][m];break;default:var C=[][P](l[y]);for(d=[],m=f.paper.customAttributes[y].length;m--;)d[m]=+C[m]+x*s*h[y][m]}p[y]=d}f.attr(p),function(e,r,i){setTimeout(function(){t("raphael.anim.frame."+e,r,i)})}(f.id,f,n.anim)}else{if(function(r,i,n){setTimeout(function(){t("raphael.anim.frame."+i.id,i,n),t("raphael.anim.finish."+i.id,i,n),e.is(r,"function")&&r.call(i)})}(n.callback,f,n.anim),f.attr(u),Ee.splice(i--,1),n.repeat>1&&!n.next){for(v in u)u[A](v)&&(g[v]=n.totalOrigin[v]);n.el.attr(g),b(n.anim,n.el,n.anim.percents[0],null,n.totalOrigin,n.repeat-1)}n.next&&!n.stop&&b(n.anim,n.el,n.next,null,n.totalOrigin,n.repeat)}}}Ee.length&&Me(Ne)},Le=function(t){return t>255?255:t<0?0:t};ye.animateWith=function(t,r,i,n,a,s){var o=this;if(o.removed)return s&&s.call(o),o;var l=i instanceof m?i:e.animation(i,n,a,s),h,u;b(l,o,l.percents[0],null,o.attr());for(var c=0,f=Ee.length;c<f;c++)if(Ee[c].anim==r&&Ee[c].el==t){Ee[f-1].start=Ee[c].start;break}return o},ye.onAnimation=function(e){return e?t.on("raphael.anim.frame."+this.id,e):t.unbind("raphael.anim.frame."+this.id),this},m.prototype.delay=function(t){var e=new m(this.anim,this.ms);return e.times=this.times,e.del=+t||0,e},m.prototype.repeat=function(t){var e=new m(this.anim,this.ms);return e.del=this.del,e.times=Y.floor(W(t,0))||1,e},e.animation=function(t,r,i,n){if(t instanceof m)return t;!e.is(i,"function")&&i||(n=n||i||null,i=null),t=Object(t),r=+r||0;var a={},s,o;for(o in t)t[A](o)&&ht(o)!=o&&ht(o)+"%"!=o&&(s=!0,a[o]=t[o]);if(s)return i&&(a.easing=i),n&&(a.callback=n),new m({100:a},r);if(n){var l=0;for(var h in t){var u=ut(h);t[A](h)&&u>l&&(l=u)}l+="%",!t[l].callback&&(t[l].callback=n)}return new m(t,r)},ye.animate=function(t,r,i,n){var a=this;if(a.removed)return n&&n.call(a),a;var s=t instanceof m?t:e.animation(t,r,i,n);return b(s,a,s.percents[0],null,a.attr()),a},ye.setTime=function(t,e){return t&&null!=e&&this.status(t,G(e,t.ms)/t.ms),this},ye.status=function(t,e){var r=[],i=0,n,a;if(null!=e)return b(t,this,-1,G(e,1)),this;for(n=Ee.length;i<n;i++)if(a=Ee[i],a.el.id==this.id&&(!t||a.anim==t)){if(t)return a.status;r.push({anim:a.anim,status:a.status})}return t?0:r},ye.pause=function(e){for(var r=0;r<Ee.length;r++)Ee[r].el.id!=this.id||e&&Ee[r].anim!=e||t("raphael.anim.pause."+this.id,this,Ee[r].anim)!==!1&&(Ee[r].paused=!0);return this},ye.resume=function(e){for(var r=0;r<Ee.length;r++)if(Ee[r].el.id==this.id&&(!e||Ee[r].anim==e)){var i=Ee[r];t("raphael.anim.resume."+this.id,this,i.anim)!==!1&&(delete i.paused,this.status(i.anim,i.status))}return this},ye.stop=function(e){for(var r=0;r<Ee.length;r++)Ee[r].el.id!=this.id||e&&Ee[r].anim!=e||t("raphael.anim.stop."+this.id,this,Ee[r].anim)!==!1&&Ee.splice(r--,1);return this},t.on("raphael.remove",_),t.on("raphael.clear",_),ye.toString=function(){return"Raphaël’s object"};var ze=function(t){if(this.items=[],this.length=0,this.type="set",t)for(var e=0,r=t.length;e<r;e++)!t[e]||t[e].constructor!=ye.constructor&&t[e].constructor!=ze||(this[this.items.length]=this.items[this.items.length]=t[e],this.length++)},Pe=ze.prototype;Pe.push=function(){for(var t,e,r=0,i=arguments.length;r<i;r++)t=arguments[r],!t||t.constructor!=ye.constructor&&t.constructor!=ze||(e=this.items.length,this[e]=this.items[e]=t,this.length++);return this},Pe.pop=function(){return this.length&&delete this[this.length--],this.items.pop()},Pe.forEach=function(t,e){for(var r=0,i=this.items.length;r<i;r++)if(t.call(e,this.items[r],r)===!1)return this;return this};for(var Fe in ye)ye[A](Fe)&&(Pe[Fe]=function(t){return function(){var e=arguments;return this.forEach(function(r){r[t][z](r,e)})}}(Fe));return Pe.attr=function(t,r){if(t&&e.is(t,Q)&&e.is(t[0],"object"))for(var i=0,n=t.length;i<n;i++)this.items[i].attr(t[i]);else for(var a=0,s=this.items.length;a<s;a++)this.items[a].attr(t,r);return this},Pe.clear=function(){for(;this.length;)this.pop()},Pe.splice=function(t,e,r){t=t<0?W(this.length+t,0):t,e=W(0,G(this.length-t,e));var i=[],n=[],a=[],s;for(s=2;s<arguments.length;s++)a.push(arguments[s]);for(s=0;s<e;s++)n.push(this[t+s]);for(;s<this.length-t;s++)i.push(this[t+s]);var o=a.length;for(s=0;s<o+i.length;s++)this.items[t+s]=this[t+s]=s<o?a[s]:i[s-o];for(s=this.items.length=this.length-=e-o;this[s];)delete this[s++];return new ze(n)},Pe.exclude=function(t){for(var e=0,r=this.length;e<r;e++)if(this[e]==t)return this.splice(e,1),!0},Pe.animate=function(t,r,i,n){(e.is(i,"function")||!i)&&(n=i||null);var a=this.items.length,s=a,o,l=this,h;if(!a)return this;n&&(h=function(){!--a&&n.call(l)}),i=e.is(i,Z)?i:h;var u=e.animation(t,r,i,h);for(o=this.items[--s].animate(u);s--;)this.items[s]&&!this.items[s].removed&&this.items[s].animateWith(o,u,u),this.items[s]&&!this.items[s].removed||a--;return this},Pe.insertAfter=function(t){for(var e=this.items.length;e--;)this.items[e].insertAfter(t);return this},Pe.getBBox=function(){for(var t=[],e=[],r=[],i=[],n=this.items.length;n--;)if(!this.items[n].removed){var a=this.items[n].getBBox();t.push(a.x),e.push(a.y),r.push(a.x+a.width),i.push(a.y+a.height)}return t=G[z](0,t),e=G[z](0,e),r=W[z](0,r),i=W[z](0,i),{x:t,y:e,x2:r,y2:i,width:r-t,height:i-e}},Pe.clone=function(t){t=this.paper.set();for(var e=0,r=this.items.length;e<r;e++)t.push(this.items[e].clone());return t},Pe.toString=function(){return"Raphaël‘s set"},Pe.glow=function(t){var e=this.paper.set();return this.forEach(function(r,i){var n=r.glow(t);null!=n&&n.forEach(function(t,r){e.push(t)})}),e},Pe.isPointInside=function(t,e){var r=!1;return this.forEach(function(i){if(i.isPointInside(t,e))return r=!0,!1}),r},e.registerFont=function(t){if(!t.face)return t;this.fonts=this.fonts||{};var e={w:t.w,face:{},glyphs:{}},r=t.face["font-family"];for(var i in t.face)t.face[A](i)&&(e.face[i]=t.face[i]);if(this.fonts[r]?this.fonts[r].push(e):this.fonts[r]=[e],!t.svg){e.face["units-per-em"]=ut(t.face["units-per-em"],10);for(var n in t.glyphs)if(t.glyphs[A](n)){var a=t.glyphs[n];if(e.glyphs[n]={w:a.w,k:{},d:a.d&&"M"+a.d.replace(/[mlcxtrv]/g,function(t){return{l:"L",c:"C",x:"z",t:"m",r:"l",v:"c"}[t]||"M"})+"z"},a.k)for(var s in a.k)a[A](s)&&(e.glyphs[n].k[s]=a.k[s])}}return t},N.getFont=function(t,r,i,n){if(n=n||"normal",i=i||"normal",r=+r||{normal:400,bold:700,lighter:300,bolder:800}[r]||400,e.fonts){var a=e.fonts[t];if(!a){var s=new RegExp("(^|\\s)"+t.replace(/[^\w\d\s+!~.:_-]/g,R)+"(\\s|$)","i");for(var o in e.fonts)if(e.fonts[A](o)&&s.test(o)){a=e.fonts[o];break}}var l;if(a)for(var h=0,u=a.length;h<u&&(l=a[h],l.face["font-weight"]!=r||l.face["font-style"]!=i&&l.face["font-style"]||l.face["font-stretch"]!=n);h++);return l}},N.print=function(t,r,i,n,a,s,o,l){s=s||"middle",o=W(G(o||0,1),-1),l=W(G(l||1,3),1);var h=I(i)[q](R),u=0,c=0,f=R,p;if(e.is(n,"string")&&(n=this.getFont(n)),n){p=(a||16)/n.face["units-per-em"];for(var d=n.face.bbox[q](k),g=+d[0],v=d[3]-d[1],x=0,y=+d[1]+("baseline"==s?v+ +n.face.descent:v/2),m=0,b=h.length;m<b;m++){if("\n"==h[m])u=0,w=0,c=0,x+=v*l;else{var _=c&&n.glyphs[h[m-1]]||{},w=n.glyphs[h[m]];u+=c?(_.w||n.w)+(_.k&&_.k[h[m]]||0)+n.w*o:0,c=1}w&&w.d&&(f+=e.transformPath(w.d,["t",u*p,x*p,"s",p,p,g,y,"t",(t-g)/p,(r-y)/p]))}}return this.path(f).attr({fill:"#000",stroke:"none"})},N.add=function(t){if(e.is(t,"array"))for(var r=this.set(),i=0,n=t.length,a;i<n;i++)a=t[i]||{},B[A](a.type)&&r.push(this[a.type]().attr(a));return r},e.format=function(t,r){var i=e.is(r,Q)?[0][P](r):arguments;return t&&e.is(t,Z)&&i.length-1&&(t=t.replace(C,function(t,e){return null==i[++e]?R:i[e]})),t||R},e.fullfill=function(){var t=/\{([^\}]+)\}/g,e=/(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,r=function(t,r,i){var n=i;return r.replace(e,function(t,e,r,i,a){e=e||i,n&&(e in n&&(n=n[e]),"function"==typeof n&&a&&(n=n()))}),n=(null==n||n==i?t:n)+""};return function(e,i){return String(e).replace(t,function(t,e){return r(t,e,i)})}}(),e.ninja=function(){if(E.was)T.win.Raphael=E.is;else{window.Raphael=void 0;try{delete window.Raphael}catch(t){}}return e},e.st=Pe,t.on("raphael.DOMload",function(){w=!0}),function(t,r,i){function n(){/in/.test(t.readyState)?setTimeout(n,9):e.eve("raphael.DOMload")}null==t.readyState&&t.addEventListener&&(t.addEventListener(r,i=function(){t.removeEventListener(r,i,!1),t.readyState="complete"},!1),t.readyState="loading"),n()}(document,"DOMContentLoaded"),e}.apply(e,i),!(void 0!==n&&(t.exports=n))},function(t,e,r){var i,n;!function(r){var a="0.5.0",s="hasOwnProperty",o=/[\.\/]/,l=/\s*,\s*/,h="*",u=function(){},c=function(t,e){return t-e},f,p,d={n:{}},g=function(){for(var t=0,e=this.length;t<e;t++)if("undefined"!=typeof this[t])return this[t]},v=function(){for(var t=this.length;--t;)if("undefined"!=typeof this[t])return this[t]},x=Object.prototype.toString,y=String,m=Array.isArray||function(t){return t instanceof Array||"[object Array]"==x.call(t)};eve=function(t,e){var r=d,i=p,n=Array.prototype.slice.call(arguments,2),a=eve.listeners(t),s=0,o=!1,l,h=[],u={},x=[],y=f,m=[];x.firstDefined=g,x.lastDefined=v,f=t,p=0;for(var b=0,_=a.length;b<_;b++)"zIndex"in a[b]&&(h.push(a[b].zIndex),a[b].zIndex<0&&(u[a[b].zIndex]=a[b]));for(h.sort(c);h[s]<0;)if(l=u[h[s++]],x.push(l.apply(e,n)),p)return p=i,x;for(b=0;b<_;b++)if(l=a[b],"zIndex"in l)if(l.zIndex==h[s]){if(x.push(l.apply(e,n)),p)break;do if(s++,l=u[h[s]],l&&x.push(l.apply(e,n)),p)break;while(l)}else u[l.zIndex]=l;else if(x.push(l.apply(e,n)),p)break;return p=i,f=y,x},eve._events=d,eve.listeners=function(t){var e=m(t)?t:t.split(o),r=d,i,n,a,s,l,u,c,f,p=[r],g=[];for(s=0,l=e.length;s<l;s++){for(f=[],u=0,c=p.length;u<c;u++)for(r=p[u].n,n=[r[e[s]],r[h]],a=2;a--;)i=n[a],i&&(f.push(i),g=g.concat(i.f||[]));p=f}return g},eve.separator=function(t){t?(t=y(t).replace(/(?=[\.\^\]\[\-])/g,"\\"),t="["+t+"]",o=new RegExp(t)):o=/[\.\/]/},eve.on=function(t,e){if("function"!=typeof e)return function(){};for(var r=m(t)?m(t[0])?t:[t]:y(t).split(l),i=0,n=r.length;i<n;i++)!function(t){for(var r=m(t)?t:y(t).split(o),i=d,n,a=0,s=r.length;a<s;a++)i=i.n,i=i.hasOwnProperty(r[a])&&i[r[a]]||(i[r[a]]={n:{}});for(i.f=i.f||[],a=0,s=i.f.length;a<s;a++)if(i.f[a]==e){n=!0;break}!n&&i.f.push(e)}(r[i]);return function(t){+t==+t&&(e.zIndex=+t)}},eve.f=function(t){var e=[].slice.call(arguments,1);return function(){eve.apply(null,[t,null].concat(e).concat([].slice.call(arguments,0)))}},eve.stop=function(){p=1},eve.nt=function(t){var e=m(f)?f.join("."):f;return t?new RegExp("(?:\\.|\\/|^)"+t+"(?:\\.|\\/|$)").test(e):e},eve.nts=function(){return m(f)?f:f.split(o)},eve.off=eve.unbind=function(t,e){if(!t)return void(eve._events=d={n:{}});var r=m(t)?m(t[0])?t:[t]:y(t).split(l);if(r.length>1)for(var i=0,n=r.length;i<n;i++)eve.off(r[i],e);else{r=m(t)?t:y(t).split(o);var a,u,c,i,n,f,p,g=[d];for(i=0,n=r.length;i<n;i++)for(f=0;f<g.length;f+=c.length-2){if(c=[f,1],a=g[f].n,r[i]!=h)a[r[i]]&&c.push(a[r[i]]);else for(u in a)a[s](u)&&c.push(a[u]);g.splice.apply(g,c)}for(i=0,n=g.length;i<n;i++)for(a=g[i];a.n;){if(e){if(a.f){for(f=0,p=a.f.length;f<p;f++)if(a.f[f]==e){a.f.splice(f,1);break}!a.f.length&&delete a.f}for(u in a.n)if(a.n[s](u)&&a.n[u].f){var v=a.n[u].f;for(f=0,p=v.length;f<p;f++)if(v[f]==e){v.splice(f,1);break}!v.length&&delete a.n[u].f}}else{delete a.f;for(u in a.n)a.n[s](u)&&a.n[u].f&&delete a.n[u].f}a=a.n}}},eve.once=function(t,e){var r=function(){return eve.off(t,r),e.apply(this,arguments)};return eve.on(t,r)},eve.version=a,eve.toString=function(){return"You are running Eve "+a},"undefined"!=typeof t&&t.exports?t.exports=eve:(i=[],n=function(){return eve}.apply(e,i),!(void 0!==n&&(t.exports=n)))}(this)},function(t,e,r){var i,n;i=[r(1)],n=function(t){if(!t||t.svg){var e="hasOwnProperty",r=String,i=parseFloat,n=parseInt,a=Math,s=a.max,o=a.abs,l=a.pow,h=/[, ]+/,u=t.eve,c="",f=" ",p="http://www.w3.org/1999/xlink",d={block:"M5,0 0,2.5 5,5z",classic:"M5,0 0,2.5 5,5 3.5,3 3.5,2z",diamond:"M2.5,0 5,2.5 2.5,5 0,2.5z",open:"M6,1 1,3.5 6,6",oval:"M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"},g={};t.toString=function(){return"Your browser supports SVG.\nYou are running Raphaël "+this.version};var v=function(i,n){if(n){"string"==typeof i&&(i=v(i));for(var a in n)n[e](a)&&("xlink:"==a.substring(0,6)?i.setAttributeNS(p,a.substring(6),r(n[a])):i.setAttribute(a,r(n[a])))}else i=t._g.doc.createElementNS("http://www.w3.org/2000/svg",i),i.style&&(i.style.webkitTapHighlightColor="rgba(0,0,0,0)");return i},x=function(e,n){var h="linear",u=e.id+n,f=.5,p=.5,d=e.node,g=e.paper,x=d.style,y=t._g.doc.getElementById(u);if(!y){if(n=r(n).replace(t._radial_gradient,function(t,e,r){if(h="radial",e&&r){f=i(e),p=i(r);var n=2*(p>.5)-1;l(f-.5,2)+l(p-.5,2)>.25&&(p=a.sqrt(.25-l(f-.5,2))*n+.5)&&.5!=p&&(p=p.toFixed(5)-1e-5*n)}return c}),n=n.split(/\s*\-\s*/),"linear"==h){var b=n.shift();if(b=-i(b),isNaN(b))return null;var _=[0,0,a.cos(t.rad(b)),a.sin(t.rad(b))],w=1/(s(o(_[2]),o(_[3]))||1);_[2]*=w,_[3]*=w,_[2]<0&&(_[0]=-_[2],_[2]=0),_[3]<0&&(_[1]=-_[3],_[3]=0)}var k=t._parseDots(n);if(!k)return null;if(u=u.replace(/[\(\)\s,\xb0#]/g,"_"),e.gradient&&u!=e.gradient.id&&(g.defs.removeChild(e.gradient),delete e.gradient),!e.gradient){y=v(h+"Gradient",{id:u}),e.gradient=y,v(y,"radial"==h?{fx:f,fy:p}:{x1:_[0],y1:_[1],x2:_[2],y2:_[3],gradientTransform:e.matrix.invert()}),g.defs.appendChild(y);for(var B=0,C=k.length;B<C;B++)y.appendChild(v("stop",{offset:k[B].offset?k[B].offset:B?"100%":"0%","stop-color":k[B].color||"#fff","stop-opacity":isFinite(k[B].opacity)?k[B].opacity:1}))}}return v(d,{fill:m(u),opacity:1,"fill-opacity":1}),x.fill=c,x.opacity=1,x.fillOpacity=1,1},y=function(){var t=document.documentMode;return t&&(9===t||10===t)},m=function(t){if(y())return"url('#"+t+"')";var e=document.location,r=e.protocol+"//"+e.host+e.pathname+e.search;return"url('"+r+"#"+t+"')"},b=function(t){var e=t.getBBox(1);v(t.pattern,{patternTransform:t.matrix.invert()+" translate("+e.x+","+e.y+")"})},_=function(i,n,a){if("path"==i.type){for(var s=r(n).toLowerCase().split("-"),o=i.paper,l=a?"end":"start",h=i.node,u=i.attrs,f=u["stroke-width"],p=s.length,x="classic",y,m,b,_,w,k=3,B=3,C=5;p--;)switch(s[p]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":x=s[p];break;case"wide":B=5;break;case"narrow":B=2;break;case"long":k=5;break;case"short":k=2}if("open"==x?(k+=2,B+=2,C+=2,b=1,_=a?4:1,w={fill:"none",stroke:u.stroke}):(_=b=k/2,w={fill:u.stroke,stroke:"none"}),i._.arrows?a?(i._.arrows.endPath&&g[i._.arrows.endPath]--,i._.arrows.endMarker&&g[i._.arrows.endMarker]--):(i._.arrows.startPath&&g[i._.arrows.startPath]--,i._.arrows.startMarker&&g[i._.arrows.startMarker]--):i._.arrows={},"none"!=x){var S="raphael-marker-"+x,A="raphael-marker-"+l+x+k+B+"-obj"+i.id;t._g.doc.getElementById(S)?g[S]++:(o.defs.appendChild(v(v("path"),{"stroke-linecap":"round",d:d[x],id:S})),g[S]=1);var T=t._g.doc.getElementById(A),E;T?(g[A]++,E=T.getElementsByTagName("use")[0]):(T=v(v("marker"),{id:A,markerHeight:B,markerWidth:k,orient:"auto",refX:_,refY:B/2}),E=v(v("use"),{"xlink:href":"#"+S,transform:(a?"rotate(180 "+k/2+" "+B/2+") ":c)+"scale("+k/C+","+B/C+")","stroke-width":(1/((k/C+B/C)/2)).toFixed(4)}),T.appendChild(E),o.defs.appendChild(T),g[A]=1),v(E,w);var M=b*("diamond"!=x&&"oval"!=x);a?(y=i._.arrows.startdx*f||0,m=t.getTotalLength(u.path)-M*f):(y=M*f,m=t.getTotalLength(u.path)-(i._.arrows.enddx*f||0)),w={},w["marker-"+l]="url(#"+A+")",(m||y)&&(w.d=t.getSubpath(u.path,y,m)),v(h,w),i._.arrows[l+"Path"]=S,i._.arrows[l+"Marker"]=A,i._.arrows[l+"dx"]=M,i._.arrows[l+"Type"]=x,i._.arrows[l+"String"]=n}else a?(y=i._.arrows.startdx*f||0,m=t.getTotalLength(u.path)-y):(y=0,m=t.getTotalLength(u.path)-(i._.arrows.enddx*f||0)),i._.arrows[l+"Path"]&&v(h,{d:t.getSubpath(u.path,y,m)}),delete i._.arrows[l+"Path"],delete i._.arrows[l+"Marker"],delete i._.arrows[l+"dx"],delete i._.arrows[l+"Type"],delete i._.arrows[l+"String"];for(w in g)if(g[e](w)&&!g[w]){var N=t._g.doc.getElementById(w);N&&N.parentNode.removeChild(N)}}},w={"-":[3,1],".":[1,1],"-.":[3,1,1,1],"-..":[3,1,1,1,1,1],". ":[1,3],"- ":[4,3],"--":[8,3],"- .":[4,3,1,3],"--.":[8,3,1,3],"--..":[8,3,1,3,1,3]},k=function(t,e,i){if(e=w[r(e).toLowerCase()]){for(var n=t.attrs["stroke-width"]||"1",a={round:n,square:n,butt:0}[t.attrs["stroke-linecap"]||i["stroke-linecap"]]||0,s=[],o=e.length;o--;)s[o]=e[o]*n+(o%2?1:-1)*a;v(t.node,{"stroke-dasharray":s.join(",")})}else v(t.node,{"stroke-dasharray":"none"})},B=function(i,a){var l=i.node,u=i.attrs,f=l.style.visibility;l.style.visibility="hidden";for(var d in a)if(a[e](d)){if(!t._availableAttrs[e](d))continue;var g=a[d];switch(u[d]=g,d){case"blur":i.blur(g);break;case"title":var y=l.getElementsByTagName("title");if(y.length&&(y=y[0]))y.firstChild.nodeValue=g;else{y=v("title");var m=t._g.doc.createTextNode(g);y.appendChild(m),l.appendChild(y)}break;case"href":case"target":var w=l.parentNode;if("a"!=w.tagName.toLowerCase()){var B=v("a");w.insertBefore(B,l),B.appendChild(l),w=B}"target"==d?w.setAttributeNS(p,"show","blank"==g?"new":g):w.setAttributeNS(p,d,g);break;case"cursor":l.style.cursor=g;break;case"transform":i.transform(g);break;case"arrow-start":_(i,g);break;case"arrow-end":_(i,g,1);break;case"clip-rect":var C=r(g).split(h);if(4==C.length){i.clip&&i.clip.parentNode.parentNode.removeChild(i.clip.parentNode);var A=v("clipPath"),T=v("rect");A.id=t.createUUID(),v(T,{x:C[0],y:C[1],width:C[2],height:C[3]}),A.appendChild(T),i.paper.defs.appendChild(A),v(l,{"clip-path":"url(#"+A.id+")"}),i.clip=T}if(!g){var E=l.getAttribute("clip-path");if(E){var M=t._g.doc.getElementById(E.replace(/(^url\(#|\)$)/g,c));M&&M.parentNode.removeChild(M),v(l,{"clip-path":c}),delete i.clip}}break;case"path":"path"==i.type&&(v(l,{d:g?u.path=t._pathToAbsolute(g):"M0,0"}),i._.dirty=1,i._.arrows&&("startString"in i._.arrows&&_(i,i._.arrows.startString),"endString"in i._.arrows&&_(i,i._.arrows.endString,1)));break;case"width":if(l.setAttribute(d,g),i._.dirty=1,!u.fx)break;d="x",g=u.x;case"x":u.fx&&(g=-u.x-(u.width||0));case"rx":if("rx"==d&&"rect"==i.type)break;case"cx":l.setAttribute(d,g),i.pattern&&b(i),i._.dirty=1;break;case"height":if(l.setAttribute(d,g),i._.dirty=1,!u.fy)break;d="y",g=u.y;case"y":u.fy&&(g=-u.y-(u.height||0));case"ry":if("ry"==d&&"rect"==i.type)break;case"cy":l.setAttribute(d,g),i.pattern&&b(i),i._.dirty=1;break;case"r":"rect"==i.type?v(l,{rx:g,ry:g}):l.setAttribute(d,g),i._.dirty=1;break;case"src":"image"==i.type&&l.setAttributeNS(p,"href",g);break;case"stroke-width":1==i._.sx&&1==i._.sy||(g/=s(o(i._.sx),o(i._.sy))||1),l.setAttribute(d,g),u["stroke-dasharray"]&&k(i,u["stroke-dasharray"],a),
i._.arrows&&("startString"in i._.arrows&&_(i,i._.arrows.startString),"endString"in i._.arrows&&_(i,i._.arrows.endString,1));break;case"stroke-dasharray":k(i,g,a);break;case"fill":var N=r(g).match(t._ISURL);if(N){A=v("pattern");var L=v("image");A.id=t.createUUID(),v(A,{x:0,y:0,patternUnits:"userSpaceOnUse",height:1,width:1}),v(L,{x:0,y:0,"xlink:href":N[1]}),A.appendChild(L),function(e){t._preload(N[1],function(){var t=this.offsetWidth,r=this.offsetHeight;v(e,{width:t,height:r}),v(L,{width:t,height:r})})}(A),i.paper.defs.appendChild(A),v(l,{fill:"url(#"+A.id+")"}),i.pattern=A,i.pattern&&b(i);break}var z=t.getRGB(g);if(z.error){if(("circle"==i.type||"ellipse"==i.type||"r"!=r(g).charAt())&&x(i,g)){if("opacity"in u||"fill-opacity"in u){var P=t._g.doc.getElementById(l.getAttribute("fill").replace(/^url\(#|\)$/g,c));if(P){var F=P.getElementsByTagName("stop");v(F[F.length-1],{"stop-opacity":("opacity"in u?u.opacity:1)*("fill-opacity"in u?u["fill-opacity"]:1)})}}u.gradient=g,u.fill="none";break}}else delete a.gradient,delete u.gradient,!t.is(u.opacity,"undefined")&&t.is(a.opacity,"undefined")&&v(l,{opacity:u.opacity}),!t.is(u["fill-opacity"],"undefined")&&t.is(a["fill-opacity"],"undefined")&&v(l,{"fill-opacity":u["fill-opacity"]});z[e]("opacity")&&v(l,{"fill-opacity":z.opacity>1?z.opacity/100:z.opacity});case"stroke":z=t.getRGB(g),l.setAttribute(d,z.hex),"stroke"==d&&z[e]("opacity")&&v(l,{"stroke-opacity":z.opacity>1?z.opacity/100:z.opacity}),"stroke"==d&&i._.arrows&&("startString"in i._.arrows&&_(i,i._.arrows.startString),"endString"in i._.arrows&&_(i,i._.arrows.endString,1));break;case"gradient":("circle"==i.type||"ellipse"==i.type||"r"!=r(g).charAt())&&x(i,g);break;case"opacity":u.gradient&&!u[e]("stroke-opacity")&&v(l,{"stroke-opacity":g>1?g/100:g});case"fill-opacity":if(u.gradient){P=t._g.doc.getElementById(l.getAttribute("fill").replace(/^url\(#|\)$/g,c)),P&&(F=P.getElementsByTagName("stop"),v(F[F.length-1],{"stop-opacity":g}));break}default:"font-size"==d&&(g=n(g,10)+"px");var R=d.replace(/(\-.)/g,function(t){return t.substring(1).toUpperCase()});l.style[R]=g,i._.dirty=1,l.setAttribute(d,g)}}S(i,a),l.style.visibility=f},C=1.2,S=function(i,a){if("text"==i.type&&(a[e]("text")||a[e]("font")||a[e]("font-size")||a[e]("x")||a[e]("y"))){var s=i.attrs,o=i.node,l=o.firstChild?n(t._g.doc.defaultView.getComputedStyle(o.firstChild,c).getPropertyValue("font-size"),10):10;if(a[e]("text")){for(s.text=a.text;o.firstChild;)o.removeChild(o.firstChild);for(var h=r(a.text).split("\n"),u=[],f,p=0,d=h.length;p<d;p++)f=v("tspan"),p&&v(f,{dy:l*C,x:s.x}),f.appendChild(t._g.doc.createTextNode(h[p])),o.appendChild(f),u[p]=f}else for(u=o.getElementsByTagName("tspan"),p=0,d=u.length;p<d;p++)p?v(u[p],{dy:l*C,x:s.x}):v(u[0],{dy:0});v(o,{x:s.x,y:s.y}),i._.dirty=1;var g=i._getBBox(),x=s.y-(g.y+g.height/2);x&&t.is(x,"finite")&&v(u[0],{dy:x})}},A=function(t){return t.parentNode&&"a"===t.parentNode.tagName.toLowerCase()?t.parentNode:t},T=function(e,r){function i(){return("0000"+(Math.random()*Math.pow(36,5)<<0).toString(36)).slice(-5)}var n=0,a=0;this[0]=this.node=e,e.raphael=!0,this.id=i(),e.raphaelid=this.id,this.matrix=t.matrix(),this.realPath=null,this.paper=r,this.attrs=this.attrs||{},this._={transform:[],sx:1,sy:1,deg:0,dx:0,dy:0,dirty:1},!r.bottom&&(r.bottom=this),this.prev=r.top,r.top&&(r.top.next=this),r.top=this,this.next=null},E=t.el;T.prototype=E,E.constructor=T,t._engine.path=function(t,e){var r=v("path");e.canvas&&e.canvas.appendChild(r);var i=new T(r,e);return i.type="path",B(i,{fill:"none",stroke:"#000",path:t}),i},E.rotate=function(t,e,n){if(this.removed)return this;if(t=r(t).split(h),t.length-1&&(e=i(t[1]),n=i(t[2])),t=i(t[0]),null==n&&(e=n),null==e||null==n){var a=this.getBBox(1);e=a.x+a.width/2,n=a.y+a.height/2}return this.transform(this._.transform.concat([["r",t,e,n]])),this},E.scale=function(t,e,n,a){if(this.removed)return this;if(t=r(t).split(h),t.length-1&&(e=i(t[1]),n=i(t[2]),a=i(t[3])),t=i(t[0]),null==e&&(e=t),null==a&&(n=a),null==n||null==a)var s=this.getBBox(1);return n=null==n?s.x+s.width/2:n,a=null==a?s.y+s.height/2:a,this.transform(this._.transform.concat([["s",t,e,n,a]])),this},E.translate=function(t,e){return this.removed?this:(t=r(t).split(h),t.length-1&&(e=i(t[1])),t=i(t[0])||0,e=+e||0,this.transform(this._.transform.concat([["t",t,e]])),this)},E.transform=function(r){var i=this._;if(null==r)return i.transform;if(t._extractTransform(this,r),this.clip&&v(this.clip,{transform:this.matrix.invert()}),this.pattern&&b(this),this.node&&v(this.node,{transform:this.matrix}),1!=i.sx||1!=i.sy){var n=this.attrs[e]("stroke-width")?this.attrs["stroke-width"]:1;this.attr({"stroke-width":n})}return this},E.hide=function(){return this.removed||(this.node.style.display="none"),this},E.show=function(){return this.removed||(this.node.style.display=""),this},E.remove=function(){var e=A(this.node);if(!this.removed&&e.parentNode){var r=this.paper;r.__set__&&r.__set__.exclude(this),u.unbind("raphael.*.*."+this.id),this.gradient&&r.defs.removeChild(this.gradient),t._tear(this,r),e.parentNode.removeChild(e),this.removeData();for(var i in this)this[i]="function"==typeof this[i]?t._removedFactory(i):null;this.removed=!0}},E._getBBox=function(){if("none"==this.node.style.display){this.show();var t=!0}var e=!1,r;this.paper.canvas.parentElement?r=this.paper.canvas.parentElement.style:this.paper.canvas.parentNode&&(r=this.paper.canvas.parentNode.style),r&&"none"==r.display&&(e=!0,r.display="");var i={};try{i=this.node.getBBox()}catch(n){i={x:this.node.clientLeft,y:this.node.clientTop,width:this.node.clientWidth,height:this.node.clientHeight}}finally{i=i||{},e&&(r.display="none")}return t&&this.hide(),i},E.attr=function(r,i){if(this.removed)return this;if(null==r){var n={};for(var a in this.attrs)this.attrs[e](a)&&(n[a]=this.attrs[a]);return n.gradient&&"none"==n.fill&&(n.fill=n.gradient)&&delete n.gradient,n.transform=this._.transform,n}if(null==i&&t.is(r,"string")){if("fill"==r&&"none"==this.attrs.fill&&this.attrs.gradient)return this.attrs.gradient;if("transform"==r)return this._.transform;for(var s=r.split(h),o={},l=0,c=s.length;l<c;l++)r=s[l],r in this.attrs?o[r]=this.attrs[r]:t.is(this.paper.customAttributes[r],"function")?o[r]=this.paper.customAttributes[r].def:o[r]=t._availableAttrs[r];return c-1?o:o[s[0]]}if(null==i&&t.is(r,"array")){for(o={},l=0,c=r.length;l<c;l++)o[r[l]]=this.attr(r[l]);return o}if(null!=i){var f={};f[r]=i}else null!=r&&t.is(r,"object")&&(f=r);for(var p in f)u("raphael.attr."+p+"."+this.id,this,f[p]);for(p in this.paper.customAttributes)if(this.paper.customAttributes[e](p)&&f[e](p)&&t.is(this.paper.customAttributes[p],"function")){var d=this.paper.customAttributes[p].apply(this,[].concat(f[p]));this.attrs[p]=f[p];for(var g in d)d[e](g)&&(f[g]=d[g])}return B(this,f),this},E.toFront=function(){if(this.removed)return this;var e=A(this.node);e.parentNode.appendChild(e);var r=this.paper;return r.top!=this&&t._tofront(this,r),this},E.toBack=function(){if(this.removed)return this;var e=A(this.node),r=e.parentNode;r.insertBefore(e,r.firstChild),t._toback(this,this.paper);var i=this.paper;return this},E.insertAfter=function(e){if(this.removed||!e)return this;var r=A(this.node),i=A(e.node||e[e.length-1].node);return i.nextSibling?i.parentNode.insertBefore(r,i.nextSibling):i.parentNode.appendChild(r),t._insertafter(this,e,this.paper),this},E.insertBefore=function(e){if(this.removed||!e)return this;var r=A(this.node),i=A(e.node||e[0].node);return i.parentNode.insertBefore(r,i),t._insertbefore(this,e,this.paper),this},E.blur=function(e){var r=this;if(0!==+e){var i=v("filter"),n=v("feGaussianBlur");r.attrs.blur=e,i.id=t.createUUID(),v(n,{stdDeviation:+e||1.5}),i.appendChild(n),r.paper.defs.appendChild(i),r._blur=i,v(r.node,{filter:"url(#"+i.id+")"})}else r._blur&&(r._blur.parentNode.removeChild(r._blur),delete r._blur,delete r.attrs.blur),r.node.removeAttribute("filter");return r},t._engine.circle=function(t,e,r,i){var n=v("circle");t.canvas&&t.canvas.appendChild(n);var a=new T(n,t);return a.attrs={cx:e,cy:r,r:i,fill:"none",stroke:"#000"},a.type="circle",v(n,a.attrs),a},t._engine.rect=function(t,e,r,i,n,a){var s=v("rect");t.canvas&&t.canvas.appendChild(s);var o=new T(s,t);return o.attrs={x:e,y:r,width:i,height:n,rx:a||0,ry:a||0,fill:"none",stroke:"#000"},o.type="rect",v(s,o.attrs),o},t._engine.ellipse=function(t,e,r,i,n){var a=v("ellipse");t.canvas&&t.canvas.appendChild(a);var s=new T(a,t);return s.attrs={cx:e,cy:r,rx:i,ry:n,fill:"none",stroke:"#000"},s.type="ellipse",v(a,s.attrs),s},t._engine.image=function(t,e,r,i,n,a){var s=v("image");v(s,{x:r,y:i,width:n,height:a,preserveAspectRatio:"none"}),s.setAttributeNS(p,"href",e),t.canvas&&t.canvas.appendChild(s);var o=new T(s,t);return o.attrs={x:r,y:i,width:n,height:a,src:e},o.type="image",o},t._engine.text=function(e,r,i,n){var a=v("text");e.canvas&&e.canvas.appendChild(a);var s=new T(a,e);return s.attrs={x:r,y:i,"text-anchor":"middle",text:n,"font-family":t._availableAttrs["font-family"],"font-size":t._availableAttrs["font-size"],stroke:"none",fill:"#000"},s.type="text",B(s,s.attrs),s},t._engine.setSize=function(t,e){return this.width=t||this.width,this.height=e||this.height,this.canvas.setAttribute("width",this.width),this.canvas.setAttribute("height",this.height),this._viewBox&&this.setViewBox.apply(this,this._viewBox),this},t._engine.create=function(){var e=t._getContainer.apply(0,arguments),r=e&&e.container,i=e.x,n=e.y,a=e.width,s=e.height;if(!r)throw new Error("SVG container not found.");var o=v("svg"),l="overflow:hidden;",h;return i=i||0,n=n||0,a=a||512,s=s||342,v(o,{height:s,version:1.1,width:a,xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink"}),1==r?(o.style.cssText=l+"position:absolute;left:"+i+"px;top:"+n+"px",t._g.doc.body.appendChild(o),h=1):(o.style.cssText=l+"position:relative",r.firstChild?r.insertBefore(o,r.firstChild):r.appendChild(o)),r=new t._Paper,r.width=a,r.height=s,r.canvas=o,r.clear(),r._left=r._top=0,h&&(r.renderfix=function(){}),r.renderfix(),r},t._engine.setViewBox=function(t,e,r,i,n){u("raphael.setViewBox",this,this._viewBox,[t,e,r,i,n]);var a=this.getSize(),o=s(r/a.width,i/a.height),l=this.top,h=n?"xMidYMid meet":"xMinYMin",c,p;for(null==t?(this._vbSize&&(o=1),delete this._vbSize,c="0 0 "+this.width+f+this.height):(this._vbSize=o,c=t+f+e+f+r+f+i),v(this.canvas,{viewBox:c,preserveAspectRatio:h});o&&l;)p="stroke-width"in l.attrs?l.attrs["stroke-width"]:1,l.attr({"stroke-width":p}),l._.dirty=1,l._.dirtyT=1,l=l.prev;return this._viewBox=[t,e,r,i,!!n],this},t.prototype.renderfix=function(){var t=this.canvas,e=t.style,r;try{r=t.getScreenCTM()||t.createSVGMatrix()}catch(i){r=t.createSVGMatrix()}var n=-r.e%1,a=-r.f%1;(n||a)&&(n&&(this._left=(this._left+n)%1,e.left=this._left+"px"),a&&(this._top=(this._top+a)%1,e.top=this._top+"px"))},t.prototype.clear=function(){t.eve("raphael.clear",this);for(var e=this.canvas;e.firstChild;)e.removeChild(e.firstChild);this.bottom=this.top=null,(this.desc=v("desc")).appendChild(t._g.doc.createTextNode("Created with Raphaël "+t.version)),e.appendChild(this.desc),e.appendChild(this.defs=v("defs"))},t.prototype.remove=function(){u("raphael.remove",this),this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas);for(var e in this)this[e]="function"==typeof this[e]?t._removedFactory(e):null};var M=t.st;for(var N in E)E[e](N)&&!M[e](N)&&(M[N]=function(t){return function(){var e=arguments;return this.forEach(function(r){r[t].apply(r,e)})}}(N))}}.apply(e,i),!(void 0!==n&&(t.exports=n))},function(t,e,r){var i,n;i=[r(1)],n=function(t){if(!t||t.vml){var e="hasOwnProperty",r=String,i=parseFloat,n=Math,a=n.round,s=n.max,o=n.min,l=n.abs,h="fill",u=/[, ]+/,c=t.eve,f=" progid:DXImageTransform.Microsoft",p=" ",d="",g={M:"m",L:"l",C:"c",Z:"x",m:"t",l:"r",c:"v",z:"x"},v=/([clmz]),?([^clmz]*)/gi,x=/ progid:\S+Blur\([^\)]+\)/g,y=/-?[^,\s-]+/g,m="position:absolute;left:0;top:0;width:1px;height:1px;behavior:url(#default#VML)",b=21600,_={path:1,rect:1,image:1},w={circle:1,ellipse:1},k=function(e){var i=/[ahqstv]/gi,n=t._pathToAbsolute;if(r(e).match(i)&&(n=t._path2curve),i=/[clmz]/g,n==t._pathToAbsolute&&!r(e).match(i)){var s=r(e).replace(v,function(t,e,r){var i=[],n="m"==e.toLowerCase(),s=g[e];return r.replace(y,function(t){n&&2==i.length&&(s+=i+g["m"==e?"l":"L"],i=[]),i.push(a(t*b))}),s+i});return s}var o=n(e),l,h;s=[];for(var u=0,c=o.length;u<c;u++){l=o[u],h=o[u][0].toLowerCase(),"z"==h&&(h="x");for(var f=1,x=l.length;f<x;f++)h+=a(l[f]*b)+(f!=x-1?",":d);s.push(h)}return s.join(p)},B=function(e,r,i){var n=t.matrix();return n.rotate(-e,.5,.5),{dx:n.x(r,i),dy:n.y(r,i)}},C=function(t,e,r,i,n,a){var s=t._,o=t.matrix,u=s.fillpos,c=t.node,f=c.style,d=1,g="",v,x=b/e,y=b/r;if(f.visibility="hidden",e&&r){if(c.coordsize=l(x)+p+l(y),f.rotation=a*(e*r<0?-1:1),a){var m=B(a,i,n);i=m.dx,n=m.dy}if(e<0&&(g+="x"),r<0&&(g+=" y")&&(d=-1),f.flip=g,c.coordorigin=i*-x+p+n*-y,u||s.fillsize){var _=c.getElementsByTagName(h);_=_&&_[0],c.removeChild(_),u&&(m=B(a,o.x(u[0],u[1]),o.y(u[0],u[1])),_.position=m.dx*d+p+m.dy*d),s.fillsize&&(_.size=s.fillsize[0]*l(e)+p+s.fillsize[1]*l(r)),c.appendChild(_)}f.visibility="visible"}};t.toString=function(){return"Your browser doesn’t support SVG. Falling down to VML.\nYou are running Raphaël "+this.version};var S=function(t,e,i){for(var n=r(e).toLowerCase().split("-"),a=i?"end":"start",s=n.length,o="classic",l="medium",h="medium";s--;)switch(n[s]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":o=n[s];break;case"wide":case"narrow":h=n[s];break;case"long":case"short":l=n[s]}var u=t.node.getElementsByTagName("stroke")[0];u[a+"arrow"]=o,u[a+"arrowlength"]=l,u[a+"arrowwidth"]=h},A=function(n,l){n.attrs=n.attrs||{};var c=n.node,f=n.attrs,g=c.style,v,x=_[n.type]&&(l.x!=f.x||l.y!=f.y||l.width!=f.width||l.height!=f.height||l.cx!=f.cx||l.cy!=f.cy||l.rx!=f.rx||l.ry!=f.ry||l.r!=f.r),y=w[n.type]&&(f.cx!=l.cx||f.cy!=l.cy||f.r!=l.r||f.rx!=l.rx||f.ry!=l.ry),m=n;for(var B in l)l[e](B)&&(f[B]=l[B]);if(x&&(f.path=t._getPath[n.type](n),n._.dirty=1),l.href&&(c.href=l.href),l.title&&(c.title=l.title),l.target&&(c.target=l.target),l.cursor&&(g.cursor=l.cursor),"blur"in l&&n.blur(l.blur),(l.path&&"path"==n.type||x)&&(c.path=k(~r(f.path).toLowerCase().indexOf("r")?t._pathToAbsolute(f.path):f.path),n._.dirty=1,"image"==n.type&&(n._.fillpos=[f.x,f.y],n._.fillsize=[f.width,f.height],C(n,1,1,0,0,0))),"transform"in l&&n.transform(l.transform),y){var A=+f.cx,E=+f.cy,M=+f.rx||+f.r||0,L=+f.ry||+f.r||0;c.path=t.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x",a((A-M)*b),a((E-L)*b),a((A+M)*b),a((E+L)*b),a(A*b)),n._.dirty=1}if("clip-rect"in l){var z=r(l["clip-rect"]).split(u);if(4==z.length){z[2]=+z[2]+ +z[0],z[3]=+z[3]+ +z[1];var P=c.clipRect||t._g.doc.createElement("div"),F=P.style;F.clip=t.format("rect({1}px {2}px {3}px {0}px)",z),c.clipRect||(F.position="absolute",F.top=0,F.left=0,F.width=n.paper.width+"px",F.height=n.paper.height+"px",c.parentNode.insertBefore(P,c),P.appendChild(c),c.clipRect=P)}l["clip-rect"]||c.clipRect&&(c.clipRect.style.clip="auto")}if(n.textpath){var R=n.textpath.style;l.font&&(R.font=l.font),l["font-family"]&&(R.fontFamily='"'+l["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g,d)+'"'),l["font-size"]&&(R.fontSize=l["font-size"]),l["font-weight"]&&(R.fontWeight=l["font-weight"]),l["font-style"]&&(R.fontStyle=l["font-style"])}if("arrow-start"in l&&S(m,l["arrow-start"]),"arrow-end"in l&&S(m,l["arrow-end"],1),null!=l.opacity||null!=l.fill||null!=l.src||null!=l.stroke||null!=l["stroke-width"]||null!=l["stroke-opacity"]||null!=l["fill-opacity"]||null!=l["stroke-dasharray"]||null!=l["stroke-miterlimit"]||null!=l["stroke-linejoin"]||null!=l["stroke-linecap"]){var j=c.getElementsByTagName(h),I=!1;if(j=j&&j[0],!j&&(I=j=N(h)),"image"==n.type&&l.src&&(j.src=l.src),l.fill&&(j.on=!0),null!=j.on&&"none"!=l.fill&&null!==l.fill||(j.on=!1),j.on&&l.fill){var q=r(l.fill).match(t._ISURL);if(q){j.parentNode==c&&c.removeChild(j),j.rotate=!0,j.src=q[1],j.type="tile";var D=n.getBBox(1);j.position=D.x+p+D.y,n._.fillpos=[D.x,D.y],t._preload(q[1],function(){n._.fillsize=[this.offsetWidth,this.offsetHeight]})}else j.color=t.getRGB(l.fill).hex,j.src=d,j.type="solid",t.getRGB(l.fill).error&&(m.type in{circle:1,ellipse:1}||"r"!=r(l.fill).charAt())&&T(m,l.fill,j)&&(f.fill="none",f.gradient=l.fill,j.rotate=!1)}if("fill-opacity"in l||"opacity"in l){var V=((+f["fill-opacity"]+1||2)-1)*((+f.opacity+1||2)-1)*((+t.getRGB(l.fill).o+1||2)-1);V=o(s(V,0),1),j.opacity=V,j.src&&(j.color="none")}c.appendChild(j);var O=c.getElementsByTagName("stroke")&&c.getElementsByTagName("stroke")[0],Y=!1;!O&&(Y=O=N("stroke")),(l.stroke&&"none"!=l.stroke||l["stroke-width"]||null!=l["stroke-opacity"]||l["stroke-dasharray"]||l["stroke-miterlimit"]||l["stroke-linejoin"]||l["stroke-linecap"])&&(O.on=!0),("none"==l.stroke||null===l.stroke||null==O.on||0==l.stroke||0==l["stroke-width"])&&(O.on=!1);var W=t.getRGB(l.stroke);O.on&&l.stroke&&(O.color=W.hex),V=((+f["stroke-opacity"]+1||2)-1)*((+f.opacity+1||2)-1)*((+W.o+1||2)-1);var G=.75*(i(l["stroke-width"])||1);if(V=o(s(V,0),1),null==l["stroke-width"]&&(G=f["stroke-width"]),l["stroke-width"]&&(O.weight=G),G&&G<1&&(V*=G)&&(O.weight=1),O.opacity=V,l["stroke-linejoin"]&&(O.joinstyle=l["stroke-linejoin"]||"miter"),O.miterlimit=l["stroke-miterlimit"]||8,l["stroke-linecap"]&&(O.endcap="butt"==l["stroke-linecap"]?"flat":"square"==l["stroke-linecap"]?"square":"round"),"stroke-dasharray"in l){var H={"-":"shortdash",".":"shortdot","-.":"shortdashdot","-..":"shortdashdotdot",". ":"dot","- ":"dash","--":"longdash","- .":"dashdot","--.":"longdashdot","--..":"longdashdotdot"};O.dashstyle=H[e](l["stroke-dasharray"])?H[l["stroke-dasharray"]]:d}Y&&c.appendChild(O)}if("text"==m.type){m.paper.canvas.style.display=d;var X=m.paper.span,U=100,$=f.font&&f.font.match(/\d+(?:\.\d*)?(?=px)/);g=X.style,f.font&&(g.font=f.font),f["font-family"]&&(g.fontFamily=f["font-family"]),f["font-weight"]&&(g.fontWeight=f["font-weight"]),f["font-style"]&&(g.fontStyle=f["font-style"]),$=i(f["font-size"]||$&&$[0])||10,g.fontSize=$*U+"px",m.textpath.string&&(X.innerHTML=r(m.textpath.string).replace(/</g,"&#60;").replace(/&/g,"&#38;").replace(/\n/g,"<br>"));var Z=X.getBoundingClientRect();m.W=f.w=(Z.right-Z.left)/U,m.H=f.h=(Z.bottom-Z.top)/U,m.X=f.x,m.Y=f.y+m.H/2,("x"in l||"y"in l)&&(m.path.v=t.format("m{0},{1}l{2},{1}",a(f.x*b),a(f.y*b),a(f.x*b)+1));for(var Q=["x","y","text","font","font-family","font-weight","font-style","font-size"],J=0,K=Q.length;J<K;J++)if(Q[J]in l){m._.dirty=1;break}switch(f["text-anchor"]){case"start":m.textpath.style["v-text-align"]="left",m.bbx=m.W/2;break;case"end":m.textpath.style["v-text-align"]="right",m.bbx=-m.W/2;break;default:m.textpath.style["v-text-align"]="center",m.bbx=0}m.textpath.style["v-text-kern"]=!0}},T=function(e,a,s){e.attrs=e.attrs||{};var o=e.attrs,l=Math.pow,h,u,c="linear",f=".5 .5";if(e.attrs.gradient=a,a=r(a).replace(t._radial_gradient,function(t,e,r){return c="radial",e&&r&&(e=i(e),r=i(r),l(e-.5,2)+l(r-.5,2)>.25&&(r=n.sqrt(.25-l(e-.5,2))*(2*(r>.5)-1)+.5),f=e+p+r),d}),a=a.split(/\s*\-\s*/),"linear"==c){var g=a.shift();if(g=-i(g),isNaN(g))return null}var v=t._parseDots(a);if(!v)return null;if(e=e.shape||e.node,v.length){e.removeChild(s),s.on=!0,s.method="none",s.color=v[0].color,s.color2=v[v.length-1].color;for(var x=[],y=0,m=v.length;y<m;y++)v[y].offset&&x.push(v[y].offset+p+v[y].color);s.colors=x.length?x.join():"0% "+s.color,"radial"==c?(s.type="gradientTitle",s.focus="100%",s.focussize="0 0",s.focusposition=f,s.angle=0):(s.type="gradient",s.angle=(270-g)%360),e.appendChild(s)}return 1},E=function(e,r){this[0]=this.node=e,e.raphael=!0,this.id=t._oid++,e.raphaelid=this.id,this.X=0,this.Y=0,this.attrs={},this.paper=r,this.matrix=t.matrix(),this._={transform:[],sx:1,sy:1,dx:0,dy:0,deg:0,dirty:1,dirtyT:1},!r.bottom&&(r.bottom=this),this.prev=r.top,r.top&&(r.top.next=this),r.top=this,this.next=null},M=t.el;E.prototype=M,M.constructor=E,M.transform=function(e){if(null==e)return this._.transform;var i=this.paper._viewBoxShift,n=i?"s"+[i.scale,i.scale]+"-1-1t"+[i.dx,i.dy]:d,a;i&&(a=e=r(e).replace(/\.{3}|\u2026/g,this._.transform||d)),t._extractTransform(this,n+e);var s=this.matrix.clone(),o=this.skew,l=this.node,h,u=~r(this.attrs.fill).indexOf("-"),c=!r(this.attrs.fill).indexOf("url(");if(s.translate(1,1),c||u||"image"==this.type)if(o.matrix="1 0 0 1",o.offset="0 0",h=s.split(),u&&h.noRotation||!h.isSimple){l.style.filter=s.toFilter();var f=this.getBBox(),g=this.getBBox(1),v=f.x-g.x,x=f.y-g.y;l.coordorigin=v*-b+p+x*-b,C(this,1,1,v,x,0)}else l.style.filter=d,C(this,h.scalex,h.scaley,h.dx,h.dy,h.rotate);else l.style.filter=d,o.matrix=r(s),o.offset=s.offset();return null!==a&&(this._.transform=a,t._extractTransform(this,a)),this},M.rotate=function(t,e,n){if(this.removed)return this;if(null!=t){if(t=r(t).split(u),t.length-1&&(e=i(t[1]),n=i(t[2])),t=i(t[0]),null==n&&(e=n),null==e||null==n){var a=this.getBBox(1);e=a.x+a.width/2,n=a.y+a.height/2}return this._.dirtyT=1,this.transform(this._.transform.concat([["r",t,e,n]])),this}},M.translate=function(t,e){return this.removed?this:(t=r(t).split(u),t.length-1&&(e=i(t[1])),t=i(t[0])||0,e=+e||0,this._.bbox&&(this._.bbox.x+=t,this._.bbox.y+=e),this.transform(this._.transform.concat([["t",t,e]])),this)},M.scale=function(t,e,n,a){if(this.removed)return this;if(t=r(t).split(u),t.length-1&&(e=i(t[1]),n=i(t[2]),a=i(t[3]),isNaN(n)&&(n=null),isNaN(a)&&(a=null)),t=i(t[0]),null==e&&(e=t),null==a&&(n=a),null==n||null==a)var s=this.getBBox(1);return n=null==n?s.x+s.width/2:n,a=null==a?s.y+s.height/2:a,this.transform(this._.transform.concat([["s",t,e,n,a]])),this._.dirtyT=1,this},M.hide=function(){return!this.removed&&(this.node.style.display="none"),this},M.show=function(){return!this.removed&&(this.node.style.display=d),this},M.auxGetBBox=t.el.getBBox,M.getBBox=function(){var t=this.auxGetBBox();if(this.paper&&this.paper._viewBoxShift){var e={},r=1/this.paper._viewBoxShift.scale;return e.x=t.x-this.paper._viewBoxShift.dx,e.x*=r,e.y=t.y-this.paper._viewBoxShift.dy,e.y*=r,e.width=t.width*r,e.height=t.height*r,e.x2=e.x+e.width,e.y2=e.y+e.height,e}return t},M._getBBox=function(){return this.removed?{}:{x:this.X+(this.bbx||0)-this.W/2,y:this.Y-this.H,width:this.W,height:this.H}},M.remove=function(){if(!this.removed&&this.node.parentNode){this.paper.__set__&&this.paper.__set__.exclude(this),t.eve.unbind("raphael.*.*."+this.id),t._tear(this,this.paper),this.node.parentNode.removeChild(this.node),this.shape&&this.shape.parentNode.removeChild(this.shape);for(var e in this)this[e]="function"==typeof this[e]?t._removedFactory(e):null;this.removed=!0}},M.attr=function(r,i){if(this.removed)return this;if(null==r){var n={};for(var a in this.attrs)this.attrs[e](a)&&(n[a]=this.attrs[a]);return n.gradient&&"none"==n.fill&&(n.fill=n.gradient)&&delete n.gradient,n.transform=this._.transform,n}if(null==i&&t.is(r,"string")){if(r==h&&"none"==this.attrs.fill&&this.attrs.gradient)return this.attrs.gradient;for(var s=r.split(u),o={},l=0,f=s.length;l<f;l++)r=s[l],r in this.attrs?o[r]=this.attrs[r]:t.is(this.paper.customAttributes[r],"function")?o[r]=this.paper.customAttributes[r].def:o[r]=t._availableAttrs[r];return f-1?o:o[s[0]]}if(this.attrs&&null==i&&t.is(r,"array")){for(o={},l=0,f=r.length;l<f;l++)o[r[l]]=this.attr(r[l]);return o}var p;null!=i&&(p={},p[r]=i),null==i&&t.is(r,"object")&&(p=r);for(var d in p)c("raphael.attr."+d+"."+this.id,this,p[d]);if(p){for(d in this.paper.customAttributes)if(this.paper.customAttributes[e](d)&&p[e](d)&&t.is(this.paper.customAttributes[d],"function")){var g=this.paper.customAttributes[d].apply(this,[].concat(p[d]));this.attrs[d]=p[d];for(var v in g)g[e](v)&&(p[v]=g[v])}p.text&&"text"==this.type&&(this.textpath.string=p.text),A(this,p)}return this},M.toFront=function(){return!this.removed&&this.node.parentNode.appendChild(this.node),this.paper&&this.paper.top!=this&&t._tofront(this,this.paper),this},M.toBack=function(){return this.removed?this:(this.node.parentNode.firstChild!=this.node&&(this.node.parentNode.insertBefore(this.node,this.node.parentNode.firstChild),t._toback(this,this.paper)),this)},M.insertAfter=function(e){return this.removed?this:(e.constructor==t.st.constructor&&(e=e[e.length-1]),e.node.nextSibling?e.node.parentNode.insertBefore(this.node,e.node.nextSibling):e.node.parentNode.appendChild(this.node),t._insertafter(this,e,this.paper),this)},M.insertBefore=function(e){return this.removed?this:(e.constructor==t.st.constructor&&(e=e[0]),e.node.parentNode.insertBefore(this.node,e.node),t._insertbefore(this,e,this.paper),this)},M.blur=function(e){var r=this.node.runtimeStyle,i=r.filter;return i=i.replace(x,d),0!==+e?(this.attrs.blur=e,r.filter=i+p+f+".Blur(pixelradius="+(+e||1.5)+")",r.margin=t.format("-{0}px 0 0 -{0}px",a(+e||1.5))):(r.filter=i,r.margin=0,delete this.attrs.blur),this},t._engine.path=function(t,e){var r=N("shape");r.style.cssText=m,r.coordsize=b+p+b,r.coordorigin=e.coordorigin;var i=new E(r,e),n={fill:"none",stroke:"#000"};t&&(n.path=t),i.type="path",i.path=[],i.Path=d,A(i,n),e.canvas&&e.canvas.appendChild(r);var a=N("skew");return a.on=!0,r.appendChild(a),i.skew=a,i.transform(d),i},t._engine.rect=function(e,r,i,n,a,s){var o=t._rectPath(r,i,n,a,s),l=e.path(o),h=l.attrs;return l.X=h.x=r,l.Y=h.y=i,l.W=h.width=n,l.H=h.height=a,h.r=s,h.path=o,l.type="rect",l},t._engine.ellipse=function(t,e,r,i,n){var a=t.path(),s=a.attrs;return a.X=e-i,a.Y=r-n,a.W=2*i,a.H=2*n,a.type="ellipse",A(a,{cx:e,cy:r,rx:i,ry:n}),a},t._engine.circle=function(t,e,r,i){var n=t.path(),a=n.attrs;return n.X=e-i,n.Y=r-i,n.W=n.H=2*i,n.type="circle",A(n,{cx:e,cy:r,r:i}),n},t._engine.image=function(e,r,i,n,a,s){var o=t._rectPath(i,n,a,s),l=e.path(o).attr({stroke:"none"}),u=l.attrs,c=l.node,f=c.getElementsByTagName(h)[0];return u.src=r,l.X=u.x=i,l.Y=u.y=n,l.W=u.width=a,l.H=u.height=s,u.path=o,l.type="image",f.parentNode==c&&c.removeChild(f),f.rotate=!0,f.src=r,f.type="tile",l._.fillpos=[i,n],l._.fillsize=[a,s],c.appendChild(f),C(l,1,1,0,0,0),l},t._engine.text=function(e,i,n,s){var o=N("shape"),l=N("path"),h=N("textpath");i=i||0,n=n||0,s=s||"",l.v=t.format("m{0},{1}l{2},{1}",a(i*b),a(n*b),a(i*b)+1),l.textpathok=!0,h.string=r(s),h.on=!0,o.style.cssText=m,o.coordsize=b+p+b,o.coordorigin="0 0";var u=new E(o,e),c={fill:"#000",stroke:"none",font:t._availableAttrs.font,text:s};u.shape=o,u.path=l,u.textpath=h,u.type="text",u.attrs.text=r(s),u.attrs.x=i,u.attrs.y=n,u.attrs.w=1,u.attrs.h=1,A(u,c),o.appendChild(h),o.appendChild(l),e.canvas.appendChild(o);var f=N("skew");return f.on=!0,o.appendChild(f),u.skew=f,u.transform(d),u},t._engine.setSize=function(e,r){var i=this.canvas.style;return this.width=e,this.height=r,e==+e&&(e+="px"),r==+r&&(r+="px"),i.width=e,i.height=r,i.clip="rect(0 "+e+" "+r+" 0)",this._viewBox&&t._engine.setViewBox.apply(this,this._viewBox),this},t._engine.setViewBox=function(e,r,i,n,a){t.eve("raphael.setViewBox",this,this._viewBox,[e,r,i,n,a]);var s=this.getSize(),o=s.width,l=s.height,h,u;return a&&(h=l/n,u=o/i,i*h<o&&(e-=(o-i*h)/2/h),n*u<l&&(r-=(l-n*u)/2/u)),this._viewBox=[e,r,i,n,!!a],this._viewBoxShift={dx:-e,dy:-r,scale:s},this.forEach(function(t){t.transform("...")}),this};var N;t._engine.initWin=function(t){var e=t.document;e.styleSheets.length<31?e.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)"):e.styleSheets[0].addRule(".rvml","behavior:url(#default#VML)");try{!e.namespaces.rvml&&e.namespaces.add("rvml","urn:schemas-microsoft-com:vml"),N=function(t){return e.createElement("<rvml:"+t+' class="rvml">')}}catch(r){N=function(t){return e.createElement("<"+t+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')}}},t._engine.initWin(t._g.win),t._engine.create=function(){var e=t._getContainer.apply(0,arguments),r=e.container,i=e.height,n,a=e.width,s=e.x,o=e.y;if(!r)throw new Error("VML container not found.");var l=new t._Paper,h=l.canvas=t._g.doc.createElement("div"),u=h.style;return s=s||0,o=o||0,a=a||512,i=i||342,l.width=a,l.height=i,a==+a&&(a+="px"),i==+i&&(i+="px"),l.coordsize=1e3*b+p+1e3*b,l.coordorigin="0 0",l.span=t._g.doc.createElement("span"),l.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;",h.appendChild(l.span),u.cssText=t.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden",a,i),1==r?(t._g.doc.body.appendChild(h),u.left=s+"px",u.top=o+"px",u.position="absolute"):r.firstChild?r.insertBefore(h,r.firstChild):r.appendChild(h),l.renderfix=function(){},l},t.prototype.clear=function(){t.eve("raphael.clear",this),this.canvas.innerHTML=d,this.span=t._g.doc.createElement("span"),this.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;",this.canvas.appendChild(this.span),this.bottom=this.top=null},t.prototype.remove=function(){t.eve("raphael.remove",this),this.canvas.parentNode.removeChild(this.canvas);for(var e in this)this[e]="function"==typeof this[e]?t._removedFactory(e):null;return!0};var L=t.st;for(var z in M)M[e](z)&&!L[e](z)&&(L[z]=function(t){return function(){var e=arguments;return this.forEach(function(r){r[t].apply(r,e)})}}(z))}}.apply(e,i),!(void 0!==n&&(t.exports=n))}])});

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Copyright (c) 2016 Hideki Shiro
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _opentype = __webpack_require__(38);

var _opentype2 = _interopRequireDefault(_opentype);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_FONT = __webpack_require__(46).join(__dirname, '../fonts/ipag.ttf');

// Private method

function parseAnchorOption(anchor) {
  var horizontal = anchor.match(/left|center|right/gi) || [];
  horizontal = horizontal.length === 0 ? 'left' : horizontal[0];

  var vertical = anchor.match(/baseline|top|bottom|middle/gi) || [];
  vertical = vertical.length === 0 ? 'baseline' : vertical[0];

  return { horizontal: horizontal, vertical: vertical };
}

var TextToSVG = function () {
  function TextToSVG(font) {
    _classCallCheck(this, TextToSVG);

    this.font = font;
  }

  _createClass(TextToSVG, [{
    key: 'getWidth',
    value: function getWidth(text, options) {
      var fontSize = options.fontSize || 72;
      var kerning = 'kerning' in options ? options.kerning : true;
      var fontScale = 1 / this.font.unitsPerEm * fontSize;

      var width = 0;
      var glyphs = this.font.stringToGlyphs(text);
      for (var i = 0; i < glyphs.length; i++) {
        var glyph = glyphs[i];

        if (glyph.advanceWidth) {
          width += glyph.advanceWidth * fontScale;
        }

        if (kerning && i < glyphs.length - 1) {
          var kerningValue = this.font.getKerningValue(glyph, glyphs[i + 1]);
          width += kerningValue * fontScale;
        }

        if (options.letterSpacing) {
          width += options.letterSpacing * fontSize;
        } else if (options.tracking) {
          width += options.tracking / 1000 * fontSize;
        }
      }
      return width;
    }
  }, {
    key: 'getHeight',
    value: function getHeight(fontSize) {
      var fontScale = 1 / this.font.unitsPerEm * fontSize;
      return (this.font.ascender - this.font.descender) * fontScale;
    }
  }, {
    key: 'getMetrics',
    value: function getMetrics(text) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var fontSize = options.fontSize || 72;
      var anchor = parseAnchorOption(options.anchor || '');

      var width = this.getWidth(text, options);
      var height = this.getHeight(fontSize);

      var fontScale = 1 / this.font.unitsPerEm * fontSize;
      var ascender = this.font.ascender * fontScale;
      var descender = this.font.descender * fontScale;

      var x = options.x || 0;
      switch (anchor.horizontal) {
        case 'left':
          x -= 0;
          break;
        case 'center':
          x -= width / 2;
          break;
        case 'right':
          x -= width;
          break;
        default:
          throw new Error('Unknown anchor option: ' + anchor.horizontal);
      }

      var y = options.y || 0;
      switch (anchor.vertical) {
        case 'baseline':
          y -= ascender;
          break;
        case 'top':
          y -= 0;
          break;
        case 'middle':
          y -= height / 2;
          break;
        case 'bottom':
          y -= height;
          break;
        default:
          throw new Error('Unknown anchor option: ' + anchor.vertical);
      }

      var baseline = y + ascender;

      return {
        x: x,
        y: y,
        baseline: baseline,
        width: width,
        height: height,
        ascender: ascender,
        descender: descender
      };
    }
  }, {
    key: 'getD',
    value: function getD(text) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var fontSize = options.fontSize || 72;
      var kerning = 'kerning' in options ? options.kerning : true;
      var letterSpacing = 'letterSpacing' in options ? options.letterSpacing : false;
      var tracking = 'tracking' in options ? options.tracking : false;
      var metrics = this.getMetrics(text, options);
      var path = this.font.getPath(text, metrics.x, metrics.baseline, fontSize, { kerning: kerning, letterSpacing: letterSpacing, tracking: tracking });

      return path.toPathData();
    }
  }, {
    key: 'getPath',
    value: function getPath(text) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var attributes = Object.keys(options.attributes || {}).map(function (key) {
        return key + '="' + options.attributes[key] + '"';
      }).join(' ');
      var d = this.getD(text, options);

      if (attributes) {
        return '<path ' + attributes + ' d="' + d + '"/>';
      }

      return '<path d="' + d + '"/>';
    }
  }, {
    key: 'getSVG',
    value: function getSVG(text) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var metrics = this.getMetrics(text, options);
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + metrics.width + '" height="' + metrics.height + '">';
      svg += this.getPath(text, options);
      svg += '</svg>';

      return svg;
    }
  }, {
    key: 'getDebugSVG',
    value: function getDebugSVG(text) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      options = JSON.parse(JSON.stringify(options));

      options.x = options.x || 0;
      options.y = options.y || 0;
      var metrics = this.getMetrics(text, options);
      var box = {
        width: Math.max(metrics.x + metrics.width, 0) - Math.min(metrics.x, 0),
        height: Math.max(metrics.y + metrics.height, 0) - Math.min(metrics.y, 0)
      };
      var origin = {
        x: box.width - Math.max(metrics.x + metrics.width, 0),
        y: box.height - Math.max(metrics.y + metrics.height, 0)
      };

      // Shift text based on origin
      options.x += origin.x;
      options.y += origin.y;

      var svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + box.width + '" height="' + box.height + '">';
      svg += '<path fill="none" stroke="red" stroke-width="1" d="M0,' + origin.y + 'L' + box.width + ',' + origin.y + '"/>'; // X Axis
      svg += '<path fill="none" stroke="red" stroke-width="1" d="M' + origin.x + ',0L' + origin.x + ',' + box.height + '"/>'; // Y Axis
      svg += this.getPath(text, options);
      svg += '</svg>';

      return svg;
    }
  }], [{
    key: 'loadSync',
    value: function loadSync() {
      var file = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_FONT;

      return new TextToSVG(_opentype2.default.loadSync(file));
    }
  }, {
    key: 'load',
    value: function load(url, cb) {
      _opentype2.default.load(url, function (err, font) {
        if (err !== null) {
          return cb(err, null);
        }

        return cb(null, new TextToSVG(font));
      });
    }
  }]);

  return TextToSVG;
}();

exports.default = TextToSVG;


module.exports = exports.default;
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 50 */
/***/ (function(module, exports) {

var TINF_OK = 0;
var TINF_DATA_ERROR = -3;

function Tree() {
  this.table = new Uint16Array(16);   /* table of code length counts */
  this.trans = new Uint16Array(288);  /* code -> symbol translation table */
}

function Data(source, dest) {
  this.source = source;
  this.sourceIndex = 0;
  this.tag = 0;
  this.bitcount = 0;
  
  this.dest = dest;
  this.destLen = 0;
  
  this.ltree = new Tree();  /* dynamic length/symbol tree */
  this.dtree = new Tree();  /* dynamic distance tree */
}

/* --------------------------------------------------- *
 * -- uninitialized global data (static structures) -- *
 * --------------------------------------------------- */

var sltree = new Tree();
var sdtree = new Tree();

/* extra bits and base tables for length codes */
var length_bits = new Uint8Array(30);
var length_base = new Uint16Array(30);

/* extra bits and base tables for distance codes */
var dist_bits = new Uint8Array(30);
var dist_base = new Uint16Array(30);

/* special ordering of code length codes */
var clcidx = new Uint8Array([
  16, 17, 18, 0, 8, 7, 9, 6,
  10, 5, 11, 4, 12, 3, 13, 2,
  14, 1, 15
]);

/* used by tinf_decode_trees, avoids allocations every call */
var code_tree = new Tree();
var lengths = new Uint8Array(288 + 32);

/* ----------------------- *
 * -- utility functions -- *
 * ----------------------- */

/* build extra bits and base tables */
function tinf_build_bits_base(bits, base, delta, first) {
  var i, sum;

  /* build bits table */
  for (i = 0; i < delta; ++i) bits[i] = 0;
  for (i = 0; i < 30 - delta; ++i) bits[i + delta] = i / delta | 0;

  /* build base table */
  for (sum = first, i = 0; i < 30; ++i) {
    base[i] = sum;
    sum += 1 << bits[i];
  }
}

/* build the fixed huffman trees */
function tinf_build_fixed_trees(lt, dt) {
  var i;

  /* build fixed length tree */
  for (i = 0; i < 7; ++i) lt.table[i] = 0;

  lt.table[7] = 24;
  lt.table[8] = 152;
  lt.table[9] = 112;

  for (i = 0; i < 24; ++i) lt.trans[i] = 256 + i;
  for (i = 0; i < 144; ++i) lt.trans[24 + i] = i;
  for (i = 0; i < 8; ++i) lt.trans[24 + 144 + i] = 280 + i;
  for (i = 0; i < 112; ++i) lt.trans[24 + 144 + 8 + i] = 144 + i;

  /* build fixed distance tree */
  for (i = 0; i < 5; ++i) dt.table[i] = 0;

  dt.table[5] = 32;

  for (i = 0; i < 32; ++i) dt.trans[i] = i;
}

/* given an array of code lengths, build a tree */
var offs = new Uint16Array(16);

function tinf_build_tree(t, lengths, off, num) {
  var i, sum;

  /* clear code length count table */
  for (i = 0; i < 16; ++i) t.table[i] = 0;

  /* scan symbol lengths, and sum code length counts */
  for (i = 0; i < num; ++i) t.table[lengths[off + i]]++;

  t.table[0] = 0;

  /* compute offset table for distribution sort */
  for (sum = 0, i = 0; i < 16; ++i) {
    offs[i] = sum;
    sum += t.table[i];
  }

  /* create code->symbol translation table (symbols sorted by code) */
  for (i = 0; i < num; ++i) {
    if (lengths[off + i]) t.trans[offs[lengths[off + i]]++] = i;
  }
}

/* ---------------------- *
 * -- decode functions -- *
 * ---------------------- */

/* get one bit from source stream */
function tinf_getbit(d) {
  /* check if tag is empty */
  if (!d.bitcount--) {
    /* load next tag */
    d.tag = d.source[d.sourceIndex++];
    d.bitcount = 7;
  }

  /* shift bit out of tag */
  var bit = d.tag & 1;
  d.tag >>>= 1;

  return bit;
}

/* read a num bit value from a stream and add base */
function tinf_read_bits(d, num, base) {
  if (!num)
    return base;

  while (d.bitcount < 24) {
    d.tag |= d.source[d.sourceIndex++] << d.bitcount;
    d.bitcount += 8;
  }

  var val = d.tag & (0xffff >>> (16 - num));
  d.tag >>>= num;
  d.bitcount -= num;
  return val + base;
}

/* given a data stream and a tree, decode a symbol */
function tinf_decode_symbol(d, t) {
  while (d.bitcount < 24) {
    d.tag |= d.source[d.sourceIndex++] << d.bitcount;
    d.bitcount += 8;
  }
  
  var sum = 0, cur = 0, len = 0;
  var tag = d.tag;

  /* get more bits while code value is above sum */
  do {
    cur = 2 * cur + (tag & 1);
    tag >>>= 1;
    ++len;

    sum += t.table[len];
    cur -= t.table[len];
  } while (cur >= 0);
  
  d.tag = tag;
  d.bitcount -= len;

  return t.trans[sum + cur];
}

/* given a data stream, decode dynamic trees from it */
function tinf_decode_trees(d, lt, dt) {
  var hlit, hdist, hclen;
  var i, num, length;

  /* get 5 bits HLIT (257-286) */
  hlit = tinf_read_bits(d, 5, 257);

  /* get 5 bits HDIST (1-32) */
  hdist = tinf_read_bits(d, 5, 1);

  /* get 4 bits HCLEN (4-19) */
  hclen = tinf_read_bits(d, 4, 4);

  for (i = 0; i < 19; ++i) lengths[i] = 0;

  /* read code lengths for code length alphabet */
  for (i = 0; i < hclen; ++i) {
    /* get 3 bits code length (0-7) */
    var clen = tinf_read_bits(d, 3, 0);
    lengths[clcidx[i]] = clen;
  }

  /* build code length tree */
  tinf_build_tree(code_tree, lengths, 0, 19);

  /* decode code lengths for the dynamic trees */
  for (num = 0; num < hlit + hdist;) {
    var sym = tinf_decode_symbol(d, code_tree);

    switch (sym) {
      case 16:
        /* copy previous code length 3-6 times (read 2 bits) */
        var prev = lengths[num - 1];
        for (length = tinf_read_bits(d, 2, 3); length; --length) {
          lengths[num++] = prev;
        }
        break;
      case 17:
        /* repeat code length 0 for 3-10 times (read 3 bits) */
        for (length = tinf_read_bits(d, 3, 3); length; --length) {
          lengths[num++] = 0;
        }
        break;
      case 18:
        /* repeat code length 0 for 11-138 times (read 7 bits) */
        for (length = tinf_read_bits(d, 7, 11); length; --length) {
          lengths[num++] = 0;
        }
        break;
      default:
        /* values 0-15 represent the actual code lengths */
        lengths[num++] = sym;
        break;
    }
  }

  /* build dynamic trees */
  tinf_build_tree(lt, lengths, 0, hlit);
  tinf_build_tree(dt, lengths, hlit, hdist);
}

/* ----------------------------- *
 * -- block inflate functions -- *
 * ----------------------------- */

/* given a stream and two trees, inflate a block of data */
function tinf_inflate_block_data(d, lt, dt) {
  while (1) {
    var sym = tinf_decode_symbol(d, lt);

    /* check for end of block */
    if (sym === 256) {
      return TINF_OK;
    }

    if (sym < 256) {
      d.dest[d.destLen++] = sym;
    } else {
      var length, dist, offs;
      var i;

      sym -= 257;

      /* possibly get more bits from length code */
      length = tinf_read_bits(d, length_bits[sym], length_base[sym]);

      dist = tinf_decode_symbol(d, dt);

      /* possibly get more bits from distance code */
      offs = d.destLen - tinf_read_bits(d, dist_bits[dist], dist_base[dist]);

      /* copy match */
      for (i = offs; i < offs + length; ++i) {
        d.dest[d.destLen++] = d.dest[i];
      }
    }
  }
}

/* inflate an uncompressed block of data */
function tinf_inflate_uncompressed_block(d) {
  var length, invlength;
  var i;
  
  /* unread from bitbuffer */
  while (d.bitcount > 8) {
    d.sourceIndex--;
    d.bitcount -= 8;
  }

  /* get length */
  length = d.source[d.sourceIndex + 1];
  length = 256 * length + d.source[d.sourceIndex];

  /* get one's complement of length */
  invlength = d.source[d.sourceIndex + 3];
  invlength = 256 * invlength + d.source[d.sourceIndex + 2];

  /* check length */
  if (length !== (~invlength & 0x0000ffff))
    return TINF_DATA_ERROR;

  d.sourceIndex += 4;

  /* copy block */
  for (i = length; i; --i)
    d.dest[d.destLen++] = d.source[d.sourceIndex++];

  /* make sure we start next block on a byte boundary */
  d.bitcount = 0;

  return TINF_OK;
}

/* inflate stream from source to dest */
function tinf_uncompress(source, dest) {
  var d = new Data(source, dest);
  var bfinal, btype, res;

  do {
    /* read final block flag */
    bfinal = tinf_getbit(d);

    /* read block type (2 bits) */
    btype = tinf_read_bits(d, 2, 0);

    /* decompress block */
    switch (btype) {
      case 0:
        /* decompress uncompressed block */
        res = tinf_inflate_uncompressed_block(d);
        break;
      case 1:
        /* decompress block with fixed huffman trees */
        res = tinf_inflate_block_data(d, sltree, sdtree);
        break;
      case 2:
        /* decompress block with dynamic huffman trees */
        tinf_decode_trees(d, d.ltree, d.dtree);
        res = tinf_inflate_block_data(d, d.ltree, d.dtree);
        break;
      default:
        res = TINF_DATA_ERROR;
    }

    if (res !== TINF_OK)
      throw new Error('Data error');

  } while (!bfinal);

  if (d.destLen < d.dest.length) {
    if (typeof d.dest.slice === 'function')
      return d.dest.slice(0, d.destLen);
    else
      return d.dest.subarray(0, d.destLen);
  }
  
  return d.dest;
}

/* -------------------- *
 * -- initialization -- *
 * -------------------- */

/* build fixed huffman trees */
tinf_build_fixed_trees(sltree, sdtree);

/* build extra bits and base tables */
tinf_build_bits_base(length_bits, length_base, 4, 3);
tinf_build_bits_base(dist_bits, dist_base, 2, 1);

/* fix a special case */
length_bits[28] = 0;
length_base[28] = 258;

module.exports = tinf_uncompress;


/***/ }),
/* 51 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;// http://spin.js.org/#v2.3.2
!function(a,b){"object"==typeof module&&module.exports?module.exports=b(): true?!(__WEBPACK_AMD_DEFINE_FACTORY__ = (b),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):a.Spinner=b()}(this,function(){"use strict";function a(a,b){var c,d=document.createElement(a||"div");for(c in b)d[c]=b[c];return d}function b(a){for(var b=1,c=arguments.length;c>b;b++)a.appendChild(arguments[b]);return a}function c(a,b,c,d){var e=["opacity",b,~~(100*a),c,d].join("-"),f=.01+c/d*100,g=Math.max(1-(1-a)/b*(100-f),a),h=j.substring(0,j.indexOf("Animation")).toLowerCase(),i=h&&"-"+h+"-"||"";return m[e]||(k.insertRule("@"+i+"keyframes "+e+"{0%{opacity:"+g+"}"+f+"%{opacity:"+a+"}"+(f+.01)+"%{opacity:1}"+(f+b)%100+"%{opacity:"+a+"}100%{opacity:"+g+"}}",k.cssRules.length),m[e]=1),e}function d(a,b){var c,d,e=a.style;if(b=b.charAt(0).toUpperCase()+b.slice(1),void 0!==e[b])return b;for(d=0;d<l.length;d++)if(c=l[d]+b,void 0!==e[c])return c}function e(a,b){for(var c in b)a.style[d(a,c)||c]=b[c];return a}function f(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)void 0===a[d]&&(a[d]=c[d])}return a}function g(a,b){return"string"==typeof a?a:a[b%a.length]}function h(a){this.opts=f(a||{},h.defaults,n)}function i(){function c(b,c){return a("<"+b+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',c)}k.addRule(".spin-vml","behavior:url(#default#VML)"),h.prototype.lines=function(a,d){function f(){return e(c("group",{coordsize:k+" "+k,coordorigin:-j+" "+-j}),{width:k,height:k})}function h(a,h,i){b(m,b(e(f(),{rotation:360/d.lines*a+"deg",left:~~h}),b(e(c("roundrect",{arcsize:d.corners}),{width:j,height:d.scale*d.width,left:d.scale*d.radius,top:-d.scale*d.width>>1,filter:i}),c("fill",{color:g(d.color,a),opacity:d.opacity}),c("stroke",{opacity:0}))))}var i,j=d.scale*(d.length+d.width),k=2*d.scale*j,l=-(d.width+d.length)*d.scale*2+"px",m=e(f(),{position:"absolute",top:l,left:l});if(d.shadow)for(i=1;i<=d.lines;i++)h(i,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(i=1;i<=d.lines;i++)h(i);return b(a,m)},h.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}}var j,k,l=["webkit","Moz","ms","O"],m={},n={lines:12,length:7,width:5,radius:10,scale:1,corners:1,color:"#000",opacity:.25,rotate:0,direction:1,speed:1,trail:100,fps:20,zIndex:2e9,className:"spinner",top:"50%",left:"50%",shadow:!1,hwaccel:!1,position:"absolute"};if(h.defaults={},f(h.prototype,{spin:function(b){this.stop();var c=this,d=c.opts,f=c.el=a(null,{className:d.className});if(e(f,{position:d.position,width:0,zIndex:d.zIndex,left:d.left,top:d.top}),b&&b.insertBefore(f,b.firstChild||null),f.setAttribute("role","progressbar"),c.lines(f,c.opts),!j){var g,h=0,i=(d.lines-1)*(1-d.direction)/2,k=d.fps,l=k/d.speed,m=(1-d.opacity)/(l*d.trail/100),n=l/d.lines;!function o(){h++;for(var a=0;a<d.lines;a++)g=Math.max(1-(h+(d.lines-a)*n)%l*m,d.opacity),c.opacity(f,a*d.direction+i,g,d);c.timeout=c.el&&setTimeout(o,~~(1e3/k))}()}return c},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=void 0),this},lines:function(d,f){function h(b,c){return e(a(),{position:"absolute",width:f.scale*(f.length+f.width)+"px",height:f.scale*f.width+"px",background:b,boxShadow:c,transformOrigin:"left",transform:"rotate("+~~(360/f.lines*k+f.rotate)+"deg) translate("+f.scale*f.radius+"px,0)",borderRadius:(f.corners*f.scale*f.width>>1)+"px"})}for(var i,k=0,l=(f.lines-1)*(1-f.direction)/2;k<f.lines;k++)i=e(a(),{position:"absolute",top:1+~(f.scale*f.width/2)+"px",transform:f.hwaccel?"translate3d(0,0,0)":"",opacity:f.opacity,animation:j&&c(f.opacity,f.trail,l+k*f.direction,f.lines)+" "+1/f.speed+"s linear infinite"}),f.shadow&&b(i,e(h("#000","0 0 4px #000"),{top:"2px"})),b(d,b(i,h(g(f.color,k),"0 0 1px rgba(0,0,0,.1)")));return d},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}}),"undefined"!=typeof document){k=function(){var c=a("style",{type:"text/css"});return b(document.getElementsByTagName("head")[0],c),c.sheet||c.styleSheet}();var o=e(a("group"),{behavior:"url(#default#VML)"});!d(o,"transform")&&o.adj?i():j=d(o,"animation")}return h});

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(8);
module.exports = __webpack_require__(25);


/***/ })
/******/ ]);