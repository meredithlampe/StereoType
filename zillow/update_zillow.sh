#!/bin/bash
# to be run from zillow directory

# update zindexes by querying zillow
echo "refreshing zillow results..."
# TODO: call out to zillow api here
#cd api
#php refreshyelp.php
#cd ..

# prep zillow api result data to work with map script
node api/prep_zillow_data.js api/zillow_response.xml api/zillow_response_trimmed.json

# build map with new phrases
echo "fitting characters of new phrases into map..."
cd ../map
node build_map_zillow.js ../zillow/api/zillow_response_trimmed.json ../zillow/build_map_output/neighborhood_chars.json ../zillow/json/build_map_config.json ../zillow/json/neighborhoods.json
echo "finished"

