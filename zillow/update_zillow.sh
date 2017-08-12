#!/bin/bash
# to be run from zillow directory

# update zindexes by querying zillow
echo "refreshing zillow results..."
# TODO: call out to zillow api here
#cd zillow_api
#php refreshyelp.php
cd ..

# prep zillow api result data to work with map script
node prep_zillow_data.js zillow_api/zillow_response zillow_api/zillow_response_clean.json

# build map with new phrases
echo "fitting characters of new phrases into map..."
cd ../map
node build_map.js ../zillow/zillow_api/zillow_response_clean.json ../zillow/build_map_output/neighborhood_chars.json
echo "finished"

