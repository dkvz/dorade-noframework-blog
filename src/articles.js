
app.fragments.articles.template = require('./fragments/articles.html');

app.fragments.articles.initPage = function() {
  document.getElementById('checkboxSort').checked = app.orderDesc;
  document.getElementById('checkboxSort').addEventListener(
    'change',
    function() {
      app.orderDesc = this.checked;
      // We need to reload all the articles:
      app.showSpinner();
      // Prevent the loading from the scrolling:
      app.bottomReached = true;
      var artEl = document.getElementById('articles');
      while (artEl.firstChild) {
        artEl.removeChild(artEl.firstChild);
      }
      if (app.currentPage === 'articles') {
        app.loadArticlesOrShorts(
          0, 
          app.maxArticles,
          false,
          app.orderDesc ? 'desc' : 'asc',
          'articles',
          'col s12',
          function() {
            app.hideSpinner();
            app.bottomReached = false;
          }
        );
      } else {
        app.loadArticlesOrShorts(
          0, 
          app.maxshorts,
          true,
          app.orderDesc ? 'desc' : 'asc',
          'articles',
          'col l4 m6 s12',
          function() {
            app.hideSpinner();
            app.bottomReached = false;
          }
        );
      }
    }
  );
  // If we're a robot or a super old browser, add some kind of
  // load more button here:
  // TODO

  // Register the infinite scrolling stuff:
  app.enableInfiniteScrolling();
};
