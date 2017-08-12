/**
 * Created by meredith on 8/12/17.
 */

const jsonfile = require('jsonfile');

if (!process.argv[2] || !process.argv[3]) {
    console.log("usage: node prep_zillow_data.js <zillow_response_file> <output_file>");
    process.exit(1); // failure
}

const outputfile = process.argv[3];

d3.xml("zillow_api/sample_response", function (error_output, zillow) {

    // get data from cached zillow api stuff
    var neighborhoods = zillow
        .documentElement.getElementsByTagName("response")[0]
        .getElementsByTagName("list")[0]
        .getElementsByTagName("region");

    var zindexes_all = {};

    for(var i = 0; i < neighborhoods.length; i++) {
        var neighborhood = neighborhoods[i];
        var name = neighborhood
            .getElementsByTagName("name")[0]
            .childNodes[0].data;
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
};
