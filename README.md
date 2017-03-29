#StereoType

Web app designed to take in phrases associated with neighborhoods in Seattle, WA and juxtapose text in each neighborhood. Inspired by [Ork Posters](http://www.orkposters.com/index.html).

![Final map](images/final)

Takes set of coordinates given in TopoJSON delineating map

![Map of Seattle Neighborhoods](images/mapSeattle)

For each neighborhood, generates [largest inscribed rectangle](http://d3plus.org/blog/behind-the-scenes/2014/07/08/largest-rect/)

![Largest Inscribed Rectangle](images/inscribedSingle)

Finds remaining space on all sides, eliminating space that's not useful (space above center rectangle in this example) and again finding largest inscribed in remaining space.

![Side polygons](images/remainingInscribed)

Divides given phrase into appropriate portions for each rectangle and appends text inside rectangles.

![Phrase portion distribution](images/finapPhinney)
