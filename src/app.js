/*
* Including the CSS (the non-blocking one)
* Webpack will inline or copy all url() references in there
*/
require('materialize-css/dist/css/materialize.min.css');
require('../styles/base.css');

/*
* Including the JS
*/
//require('jquery');
// The min build seems to include jQuery. Leaving the require
// is not an issue though, Webpack doesn't import it twice.
require('materialize-css/dist/js/materialize.min.js');
// I MIGHT NEED TO SET window.$ AS WHAT THE REQUIRES FOR JQUERY
// RETURNS.

/*
* Add the HTML fragments of objects on the home page
*/


/*
* Page initialization:
*/
$('.button-collapse').sideNav();

console.log('App started');
