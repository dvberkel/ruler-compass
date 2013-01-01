Ruler Compass [![Build Status](https://travis-ci.org/dvberkel/ruler-compass.png?branch=master)](https://travis-ci.org/dvberkel/ruler-compass)
=============

Ruler and Compass is a project to create and visualize formal ruler
and compass constructions.

We try to mimick [Bret Victor][1] [inventing on principle][2] style of
programming.

Construction Language
---------------------

We are inspired by [Geometric Constructions][3] for the construction
language. Unfortunatly the rich symbolism is unavailble on most
keyboards. We will use the following alternatives:

<table>
<thead>
<tr><td>Notation</td><td>Meaning</td></tr>
</thead>
<tbody>
<tr><td>A-B-C</td><td>point B is between points A and C</td></tr>
<tr><td>l(A,B)</td><td>line through points A and B</td></tr>
<tr><td></td><td>ray with vertex A passing through B</td></tr>
<tr><td></td><td>segment with endpoints A and B</td></tr>
<tr><td>AB</td><td>distance from A to B</td></tr>
<tr><td>A_B</td><td>circle through B with center A</td></tr>
<tr><td>A_BC</td><td>circle with center A and radius BC</td></tr>
<tr><td></td><td>degree measure of the angle ABC</td></tr>
<tr><td></td><td>triangle with vertices A,B,C</td></tr>
<tr><td>ABC</td><td>area of triangle ?ABC</td></tr>
<tr><td></td><td>quadrilateral with sides ?AB, ?BC, ?CD, ?DA</td></tr>
<tr><td>ABCD</td><td>the area of ?ABCD</td></tr>
<tr><td>p=q</td><td>"p" and "q" are names for the same object</td></tr>
<tr><td></td><td>p is congruent to q</td></tr>
<tr><td>p~q</td><td>p is similiar to q</td></tr>
</tbody>
</table>

Development
-----------

We use [npm][4] to manage our dependencies and use [grunt][5] to
automate common occuring tasks. Run the following command to install
all the dependencies except [phantomjs][6]

    npm install

[phantomjs][6] is used for headless running the [jasmine][7]
specification and needs to be available on the path. Go to the
[phantomjs download][8] page for intructions to acquire phantomjs.

### Testing

    npm test

executes the `grunt jasmine` task. This generates a `_SpecRunner.html`
from `spec/template/_SpecRunner.tmpl`. When creating new
specifications they should be referenced in the template file.

The generated `_SpecRunner.html` can be viewed in a browser for an
overview of passing/failing tests. Make sure that it is up to date by
running the `npm test` (or equivalently `grunt jasmine`) often.

[1]: http://worrydream.com/ "Bret Victor's homepage"
[2]: http://vimeo.com/36579366 "a Vimeo video showing Bret Victor's talk on 'Inventing on Principle'"
[3]: http://www.springer.com/mathematics/geometry/book/978-0-387-98276-2 "Geometric Constructions on Springer website"
[4]: https://npmjs.org/ "Node Package Manager homepage"
[5]: http://gruntjs.com/ "grunt.js homepage"
[6]: http://phantomjs.org "phantomjs homepage"
[7]: http://pivotal.github.com/jasmine/ "Jasmine homepage"
[8]: http://phantomjs.org/download.html "Download instructions for phantomjs"