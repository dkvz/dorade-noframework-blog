var page = require('page');

// The app object must have been created before this script runs.
var app = window.app;

// We need to set the acive element in the menus (both mobile and top)
// in here (class = "active").

page('*', function(data, next) {
  // Gets called before any routing happens.
  // Reset anything that would've been loaded before.
  // This is just a design choice but an easy and effective one.
  app.loadedCount = 0;
  app.changeRandomQuote();
  next();
});
page('/', function() {
  document.title = app.titleBase;
  app.setMenuItemActive('homeL');
  // We need to load the articles and shorts in the callback:
  app.setMainContent('home');
  app.hideSpinner();
  app.loadArticles(app.loadedCount, app.maxArticlesHome, function() {
    console.log('Callback');
  });
});
page('/pages/:name', function(data) {
  document.title = data.params.name.charAt(0).toUpperCase() +
    data.params.name.slice(1) + ' | ' + app.titleBase;
  switch(data.params.name) {
    case 'about':
      app.setMenuItemActive('aboutL');
      app.setMainContent('about', function() {
        app.hideSpinner();
      });
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
  //app.refreshArticles();
});
page('/breves', function() {

});
page('/breves/:id', function() {

});
page('/articles', function() {

});
page('/articles/:name/:toBottom?', function(data) {
  if (data.params.toBottom) {
    // Scroll to bottom, might only want to do
    // that when the page has loaded...
    // In the previous blog I used a global flag in
    // app to notify the other page.
    // (app.scrollToBottom = true)
  } else {
    // Don't....
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