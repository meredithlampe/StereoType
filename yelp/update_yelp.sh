#!/bin/bash

# update best places by querying yelp
echo "refreshing yelp results..."
cd api 
#php refreshyelp.php
cd ..

# build map with new phrases
echo "fitting characters of new phrases into map..."
cd ../map
node build_map.js ../yelp/api/output.json ../yelp/build_map_output/neighborhood_chars.json ../yelp/json/build_map_config.json ../yelp/json/neighborhoods.json
echo "finished"

