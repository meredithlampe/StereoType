/**
 * Created by meredith on 8/12/17.
 */

const jsonfile = require('jsonfile');
const fs = require('fs');
const xml2js = require('xml2js');

if (!process.argv[2] || !process.argv[3]) {
    console.log("usage: node prep_zillow_data.js <zillow_response_file> <output_file>");
    process.exit(1); // failure
}

const outputfile = process.argv[3];

//var all_cities_debug = [];

var xml = process.argv[2];
var parser = new xml2js.Parser();
fs.readFile(__dirname + '/zillow_response.xml', function(error_output, data) {
    parser.parseString(data, function (error_parse, zillow) {

    if (error_output) {
        console.log(error_output);
        process.exit(1); //failure
    }

    if (error_parse) {
        console.log(error_parse);
        process.exit(1); //failure
    }


    // get data from cached zillow api stuff
    var neighborhoods = zillow['RegionChildren:regionchildren']
        .response[0].list[0].region;

    //var neighborhoods = zillow
    //    .getElementsByTagName("response")[0]
    //    .getElementsByTagName("list")[0]
    //    .getElementsByTagName("region");

    var zindexes_all = {};
    for (var i = 0; i < neighborhoods.length; i++) {
        var name = neighborhoods[i].name[0];

        //all_cities_debug[all_cities_debug.length] = name;
        if (name == "South Lake Union") {
            debugger;
        }

        if (neighborhoods[i].zindex) {
            var zindex = neighborhoods[i].zindex[0]._;
            zindexes_all[name] = {};
            zindexes_all[name].bestmatch = zindex;
        }
    }

    // write json to file
    jsonfile.writeFileSync(outputfile, zindexes_all);
    //jsonfile.writeFileSync("all_cities_zillow.json", all_cities_debug.sort());

    });
});
