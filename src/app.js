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
      filename: '_breve.html',
      properties: [
        {name: 'thumbImage'},
        {name: 'title'},
        {name: 'summary'},
        {name: 'date', process: function(val) {
          // My dates are weird strings that can't be used
          // in the Date constructor.
          if (val !== undefined && val.length > 10) {
            return val.substr(0, 10);
          }
          return '';
        }},
        {name: 'content'},
        {name: 'id'}
      ]
    },
    article: {
      filename: '_article.html',
      properties: [
        {name: 'thumbImage'},
        {name: 'title'},
        {name: 'summary'},
        {
          name: 'tags', 
          template: 'tag', 
          properties: [
            {name: 'id'},
            {name: 'name'}
          ]
        },
        {name: 'date', process: function(val) {
          // I'll have to do something about the date
          // format one day.
          return val;
        }},
        {name: 'author'},
        {name: 'articleUrl'}
      ]
    },
    tag: {
      filename: '_tag.html'
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
  loadedCount: 0,
  tags: [],
  currentTags: [],
  maxArticlesHome: 3,
  maxShortsHome: 10,
  maxArticles: 10,
  maxShorts: 30,
  createElementFromText: function(text) {
    // This weird stuff is required to work with some
    // of the IE versions.
    var div = document.createElement('div');
    div.innerHTML = text;
    if (div.childNodes.length > 1) {
      return div;
    } else {
      return div.firstChild;
    }
  },
  lazyLoadPage: function(fragment, callback) {
    // I use this function to lazy-load JS that
    // also has HTML stringified into it.
    this.showSpinner();
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = '/scripts/' + this.fragments[fragment].script;
    // I could use bind() to keep my 'this' context in this onload
    // but it turns out bind() is not supported by IE 9.
    s.onload = function() {
      app._replaceMainContent(app.fragments[fragment].template);
      // We don't hide the spinner here, it's supposed to be done in
      // the callback (or not if you don't want to).
      if (callback !== undefined) callback();
    };
    document.body.appendChild(s);
  },
  showSpinner: function() {
    this.spinner.style.display = '';
  },
  hideSpinner: function() {
    this.spinner.style.display = 'none';
  },
  showOtherSpinner: function(id) {
    var spin = document.getElementById(id);
    if (spin) {
      spin.style.display = '';
    }
  },
  hideOtherSpinner: function(id) {
    var spin = document.getElementById(id);
    if (spin) {
      spin.style.display = 'none';
    }
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
    // We should ues Modernizr to check if browser is animation capable.
    // Or not I guess it still works if not animation capable.
    var el = this._animateElement(this.createElementFromText(fragmentText), 'trans-left');
    this.contentEl.appendChild(el);
  },
  _fetchArticlesOrShorts(start, count, short, order, callback) {
    // If short is defined we load shorts.
    // I'm using the jQuery AJAX stuff since I have jQuery anyway.
    var url = this.apiUrl + (short ? '/shorts-starting-from/' : '/articles-starting-from/') +
      start + '?max=' + count;
    if (order !== undefined) {
      url += '&order=' + order;
    }
    // Currently tags are disabled for shorts. Although they would work in
    // the backend I think.
    if (!short && this.currentTags.length > 0) {
      // URL encode the tags and add them to the URL using comma as separator.
      url += '&tags=';
      for (var i = 0; i < this.currentTags.length; i++) {
        if (i > 0) {
          url += ',';
        }
        url += encodeURIComponent(this.currentTags[i]);
      }
    }
    $.getJSON(url, function(data) {
      // Set ret with the data.
      if (data) {
        app.loadedCount = data.length;
      }
      callback(data);
    }).fail(function(xhr, errorText) {
      // If we get a 404 it's no use trying to load more articles.
      // or shorts.
      console.log('HTTP error in fetching articles or shorts - ' 
        + xhr.status);
      callback(null);
    });
  },
  _animateElement(element, animation) {
    // This is ugly but IE doesn't support classList.
    // I don't know which IE and I don't care.
    if (element.className.length > 0) {
      element.className += ' ' + animation;
    } else {
      element.className = animation;
    }
    return element;
  },
  loadArticlesOrShorts(start, count, short, order, element, callback) {
    // We use the callback here usually to reset a 
    // specific spinner (usually).
    // Check if not undefined before calling it.
    // The spinner to reset is not the same on the home
    // page as compared to the articles page.
    this._fetchArticlesOrShorts(start, count, short, order, function(data) {
      if (data !== null && data.length) {
        // Let's use a document fragment. We ditch IE 7 but we get
        // only one reflow instead of a lot of them.
        // I think Materialize doesn't support IE 7 anyway.
        var docFrag = document.createDocumentFragment();
        for (var i = 0; i < data.length; i++) {
          var parsedArt = app.parseTemplate(
            short ? 'short': 'article', data[i]
          );
          //var el = document.querySelector('#' + element);
          docFrag.appendChild(
            app._animateElement(app.createElementFromText(parsedArt), 'scale-up')
          );
        }
        var el = document.getElementById(element);
        el.appendChild(docFrag);
      }
      if (callback !== undefined) callback();
    });
  },
  parseTemplate(fragment, data) {
    var mainTpl = this.fragments[fragment].template;
    for (var i = 0; i < this.fragments[fragment].properties.length; i++) {
      var cur = this.fragments[fragment].properties[i];
      var reg = new RegExp('\{\{' + cur.name + '\}\}', 'g');
      // I only allow one level of repeating content in a template.
      // I'd have to get into something recursive otherwise.
      var value;
      if (cur.process !== undefined) {
        value = cur.process(data[cur.name]);
      } else {
        value = data[cur.name];
      }
      if (cur.template !== undefined) {
        // The property is an array.
        var result = '';
        for (var x = 0; x < value.length; x++) {
          var tpl = this.fragments[cur.template].template;
          for (var y = 0; y < cur.properties.length; y++) {
            var regTpl = new RegExp('\{\{' + cur.properties[y].name +
              '\}\}', 'g');
            tpl = tpl.replace(regTpl, value[x][cur.properties[y].name]);
          }
          result += tpl;
        }
        value = result;
      }
      if (value !== undefined) {
        mainTpl = mainTpl.replace(
          reg,
          value
        );
      }
    }
    return mainTpl;
  }
};
window.app = app;

/*
* Including the JS and polyfills
*/
//window.$ = require('jquery');
//$ = window.$;
// The min build seems to include jQuery with a NodeJS require.
// Leaving the jQuery import is not an issue though,
// Webpack won't import it twice.
// ---
// I don't know why I bother with this polyfill:
require('./polyfills/event-listeners.js');
require('materialize-css/dist/js/materialize.min.js');


/*
* Page initialization - listeners
*/
// Add the spinner thingy to indicate loading, and start with it
// shown:
app.spinner = document.getElementById('spinnerCard');
app.showSpinner();  // This line is currently useless.
// Enable the navbar from Materialize (can only be done with jQuery):
$('.button-collapse').sideNav();
app.mainEl = document.getElementById('mainEl');
app.contentEl = document.getElementById('contentEl');
// Load tags only once in here:
// TODO



/*
* Add the HTML fragments of objects on the home page
*/
app.fragments.short.template = require('./fragments/_breve.html');
app.fragments.article.template = require('./fragments/_article.html');
app.fragments.tag.template = require('./fragments/_tag.html');
app.fragments.home.template = require('./fragments/home.html');

/*
* More app functions
*/

/*
* Start routing:
*/
require('./routing.js');

console.log('App started');
