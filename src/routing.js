var page = require('page');

// The app object must have been created before this script runs.
var app = window.app;

// We need to set the acive element in the menus (both mobile and top)
// in here (class = "active").

page('*', function(data, next) {
  // Gets called before any routing happens.
  // Reset anything that would've been loaded before.
  // This is just a design choice but an easy and effective one.
  app.changeRandomQuote();
  next();
});
page('/', function() {
  document.title = app.titleBase;
  app.setMenuItemActive('homeL');
  // We need to load the articles and shorts in the callback:
  app.setMainContent('home');
  //var element = app.contentEl.querySelector('#lastArticles');
  // If mainContent is loaded we can hide the main spinner here:
  app.hideSpinner();
  app.showOtherSpinner('articlesSpinner');
  // We always load frm 0 on the home page.
  app.loadArticlesOrShorts(
    0, 
    app.maxArticlesHome,
    false,
    'desc',
    'lastArticles',
    function() {
      app.hideOtherSpinner('articlesSpinner');
      // app.loadedCount is only used in the articles
      // or shorts list page.
      app.loadedCount = 0;
    }
  );
  app.loadArticlesOrShorts(
    0, 
    app.maxShortsHome,
    true,
    'desc',
    'lastShorts',
    function() {
      app.hideOtherSpinner('shortsSpinner');
      app.loadedCount = 0;
    }
  );

});
page('/pages/:name', function(data) {
  document.title = (data.params.name.charAt(0).toUpperCase() +
    data.params.name.slice(1)).replace('-', ' ') + ' | ' 
    + app.titleBase;
  switch(data.params.name) {
    case 'about':
    case 'contact':
    case 'hireme':
      app.loadStaticPage(data.params.name);
      break;
    default:
      document.title = app.titleBase;
      app.show404();
  }
});
page('/tag/:name', function(data) {
  document.title = app.titleBase;
  app.currentTags = [];
  app.currentTags.push(data.params.name);
  app.setMenuItemActive('articlesL');
  // Set the right links to active in the dropdown menu
  // AND in the mobile menu:

  //app.refreshArticles();
});
page('/breves', function() {
  // Don't forget to change the title

});
page('/breves/:id', function() {
  // Don't forget to change the title

});
page('/articles', function() {
  // Don't forget to change the title
  app.setMenuActive('articlesL');

});
page('/articles/:name/:toBottom?', function(data) {
  if (data.params.toBottom) {
    // Scroll to bottom, might only want to do
    // that when the page has loaded...
    // In the previous blog I used a global flag in
    // app to notify the other page.
    // (app.scrollToBottom = true)
  } else {
    // Don't scroll to bottom.
  }
  app.articleParams = data.params;
});
page('/contact', function() {
  page.redirect('/pages/contact');
});
page('/about', function() {
  page.redirect('pages/about');
});
page('*', function() {
  app.show404();
  page.redirect('/');
});

page();