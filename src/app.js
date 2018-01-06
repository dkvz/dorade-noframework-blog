/*
* Including the CSS (the non-blocking one)
* Webpack will inline or copy all url() references in there
*/
require('materialize-css/dist/css/materialize.min.css');
// I could split my CSS and load it in the page-specific scripts.
require('../styles/base.css');

/*
* Initialize the global app object
*/
var app = {
  titleBase: 'Blog des gens compliqués',
  quotes: [
    'Vas-y répète le mot trompette dans ta tête',
    'Les SITES INTERNET doivent avoir un sous-titre',
    'Si Gargamel mange tous les schtroumpfs y a plus d\'histoire',
    'Optimisation de la conversion Kasteel Bier en lignes de code',
    'Le Teflon n\'accroche pas mais il est collé sur la poêle?',
    'Kesse tu fais ici va prendre un bain',
    'La monogamie aurait provoqué la disparition de l\'os pénien',
    'Ces comme meme pas mal qu\'on sois allée sur la lune',
    'Péter un plomb et peindre tout en brun',
    'Nous paissons, vous paissez, ils paissent',
    'Qui a commandé un décacapou?'
  ]
};
app.createElementFromText = function(text) {
  // This weird stuff is required to work with some
  // of the IE versions.
  var div = document.createElement('div');
  div.innerHTML = text;
  return div.firstChild;
}
window.app = app;

/*
* Including the JS
*/
//window.$ = require('jquery');
//$ = window.$;
// The min build seems to include jQuery with a NodeJS require.
// Leaving the jQuery import is not an issue though,
// Webpack won't import it twice.
require('materialize-css/dist/js/materialize.min.js');
require('./routing.js');

/*
* Add the HTML fragments of objects on the home page
*/
// Add the spinner thingy to indicate loading:
app.spinner = app.createElementFromText(
  require('./fragments/_spinner-card.html')
);
document.querySelector('#mainEl').appendChild(app.spinner);
app.showSpinner = function() {

}
app.hideSpinner = function() {
  
}

/*
* Page initialization:
*/
$('.button-collapse').sideNav();

console.log('App started');
