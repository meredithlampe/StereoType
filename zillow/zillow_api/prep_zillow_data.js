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

var xml = process.argv[2];
var parser = new xml2js.Parser();
fs.readFile(__dirname + '/sample_response.xml', function(error_output, data) {
    parser.parseString(data, function (error_parse, zillow) {

    if (error_output) {
        console.log(error_output);
        process.exit(1); //failure
    }

    if (error_parse) {
        console.log(error_parse);
        process.exit(1); //failure
    }

    debugger;

    // get data from cached zillow api stuff
    var neighborhoods = zillow['RegionChildren:regionchildren']
        .response[0].list[0].region;

    //var neighborhoods = zillow
    //    .getElementsByTagName("response")[0]
    //    .getElementsByTagName("list")[0]
    //    .getElementsByTagName("region");

    var zindexes_all = {};

    for (var i = 0; i < neighborhoods.length; i++) {
        var neighborhood = neighborhoods[i];

        //var name = neighborhood
        //    .getElementsByTagName("name")[0]
        //    .childNodes[0].data;
        var name = neighborhood;


        var zindex = neighborhood
            .getElementsByTagName("zindex")[0];

        if (!zindex) {
            continue;
        }
        var zindex_value = zindex.childNodes[0].data;
        zindexes_all[name] = zindex_value;
    }

    // write json to file
    jsonfile.writeFileSync(outputfile, zindexes_all);

    });
});
