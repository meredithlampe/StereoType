#!/bin/bash

# update best places by querying yelp
echo "refreshing yelp results..."
cd yelp_api
php refreshyelp.php
cd ..

# build map with new phrases
echo "fitting characters of new phrases into map..."
cd build_map
node build_map.js # TODO: add output file location param
echo "finished"

