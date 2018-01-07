/*
* Including the CSS (the non-blocking one)
* Webpack will inline or copy all url() references in there
*/
require('materialize-css/dist/css/materialize.min.css');
// I could split my CSS and load it in the page-specific scripts.
require('../styles/base.css');

/*
* Initialize the global app object
* This could be put in a separate file and
* included with the rest of the JS below.
*/
var app = {
  titleBase: 'Blog des gens compliqués',
  apiUrl: 'https://api.dkvz.eu',
  jsDir: 'scripts',
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
    'Qui a commandé un décacapou?',
    'Dkvz.eu recommande officiellement la Bing toolbar'
  ],
  fragments: {
    short: {
      filename: '_breve.html'
    },
    article: {
      filename: '_article.html'
    },
    home: {
      filename: 'home.html'
    },
    about: {
      filename: 'about.html',
      script: 'about.js'
    }
  },
  menuItems: [
    'homeL',
    'articlesL',
    'shortsL',
    'aboutL',
    'contactL',
    'hireMeL'
  ],
  createElementFromText: function(text) {
    // This weird stuff is required to work with some
    // of the IE versions.
    var div = document.createElement('div');
    div.innerHTML = text;
    return div.firstChild;
  },
  lazyLoadPage: function(fragment, callback) {
    // I use this function to lazy-load JS that
    // also has HTML stringified into it.
    this.showSpinner();
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = '/scripts/' + this.fragments[fragment].script;
    s.onload = function() {
      this._replaceMainContent(this.fragments[fragment].template);
      // We don't hide the spinner here, it's supposed to be done in
      // the callback (or not if you don't want to).
      if (callback !== undefined) callback();
    }.bind(this);
    document.body.appendChild(s);
  },
  showSpinner: function() {
    this.spinner.style.display = '';
  },
  hideSpinner: function() {
    this.spinner.style.display = 'none';
  },
  randomQuote: function() {
    return this.quotes[Math.floor(Math.random() * this.quotes.length)];
  },
  setMenuItemActive(menuId) {
    for (var i = 0; i < this.menuItems.length; i++) {
      // If my link li elements had more than one class
      // this would NOT work.
      // The classList thing has a toggle method that only
      // works starting from IE 10. So if I need to use that
      // at some point, might as well use jQuery toggle().
      if (this.menuItems[i] === menuId) {
        document.getElementById(menuId).className = 'active';
        document.getElementById(menuId + 'M').className = 'active';
      } else {
        document.getElementById(this.menuItems[i]).className = '';
        document.getElementById(this.menuItems[i] + 'M').className = '';
      }
    }
  },
  changeRandomQuote: function() {
    document.getElementById('randomQuote').innerText = this.randomQuote();
  },
  show404: function()  {
    Materialize.toast('Page introuvable - ' + 
      '. Vous avez été redirigé vers la page d\'accueil.', 4000);
  },
  setMainContent: function(fragment, callback) {
    if (this.fragments[fragment] !== undefined) {
      // Check if we got the template:
      if (this.fragments[fragment].template !== undefined) {
        this._replaceMainContent(this.fragments[fragment].template);
        // we need to call the provided callback:
        if (callback !== undefined) callback();
      } else {
        // get the template from a lazy loaded script
        // where the template is stringified in.
        this.lazyLoadPage(fragment, callback);
      }
    } else {
      // Use the 404 main content.
      // Which consists in showing the toast.
      this.show404();
    }
  },
  _replaceMainContent: function(fragmentText) {
    // I actually use the id "content" no and not mainEl.
    // Just remove everything from it and add the new content.
    while (this.contentEl.firstChild) {
      this.contentEl.removeChild(this.contentEl.firstChild);
    }
    this.contentEl.appendChild(this.createElementFromText(fragmentText));
  }
};
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

/*
* Page initialization - listeners
*/
// Add the spinner thingy to indicate loading, and start with it
// shown:
app.spinner = document.getElementById('spinnerCard');
app.showSpinner();  // This line is currently useless.
// Enable the navbar from Materialize:
$('.button-collapse').sideNav();
app.mainEl = document.getElementById('mainEl');
app.contentEl = document.getElementById('contentEl');

/*
* Add the HTML fragments of objects on the home page
*/
app.fragments.short.template = require('./fragments/_breve.html');
app.fragments.article.template = require('./fragments/_article.html');
app.fragments.home.template = require('./fragments/home.html');

/*
* More app functions
*/

/*
* Start routing:
*/
require('./routing.js');

console.log('App started');
