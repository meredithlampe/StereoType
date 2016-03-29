# StereoType

Web app designed to take in phrases associated with neighborhoods in Seattle, WA and juxtapose text in each neighborhood. Inspired by [Ork Posters](http://www.orkposters.com/index.html).

![Final map](http://s30.postimg.org/n1biqzymp/Screen_Shot_2016_03_29_at_2_19_24_PM.png)

Takes set of coordinates given in TopoJSON delineating map

![Map of Seattle Neighborhoods](http://s12.postimg.org/csxsmlizx/Screen_Shot_2016_03_29_at_1_49_23_PM.png)

For each neighborhood, generates [largest inscribed rectangle](http://d3plus.org/blog/behind-the-scenes/2014/07/08/largest-rect/)

![Largest Inscribed Rectangle](http://s12.postimg.org/n0bql9fu5/Screen_Shot_2016_03_29_at_2_03_16_PM.png)

Finds remaining space on all sides, eliminating space that's not useful (space above center rectangle in this example)

![Side polygons](http://s12.postimg.org/avwh4a2y5/Screen_Shot_2016_03_29_at_2_04_23_PM.png)

Divides given phrase into appropriate portions for each rectangle

![Phrase portion distribution](http://s12.postimg.org/fginj7mnh/Screen_Shot_2016_03_29_at_2_08_42_PM.png)

Final product

![Final product](http://s12.postimg.org/j5cxwfm25/Screen_Shot_2016_03_29_at_2_02_10_PM.png)
