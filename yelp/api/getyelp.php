<?php

header("Content-type: application/json");
// get list of name -> business name (1st in list of 'best match')

// get neighborhood names and best match places
$neighborhoods = fopen("output.txt", "r") or die("Unable to open file!");
$locations_file = fread($neighborhoods, filesize("output.txt"));
echo $locations_file;
fclose($neighborhoods);
?>