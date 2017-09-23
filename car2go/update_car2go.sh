#!/bin/bash

# update best places by querying car2go
#echo "refreshing car2go results..."
#cd api
#php refreshyelp.php
#cd ..

# build map with new phrases
echo "fitting characters of new phrases into map..."
cd ../map
node build_map.js ../car2go/api/output.json ../car2go/build_map_output/neighborhood_chars.json ../car2go/json/build_map_config.json ../car2go/json/neighborhoods.json
echo "finished"

