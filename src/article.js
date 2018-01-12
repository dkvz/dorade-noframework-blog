
app.fragments.article.template = require('./fragments/article.html');
app.fragments.comment.template = require('./fragments/_comment.html');

app.fragments.article.initPage = function() {
  
}

app.processArticleContent = function(content, callback) {
  // Actually articleId can be the articleUrl as well.
  // And will be for articles.
  // The numeric id is used for shorts.
  // We could have a dedicated 404 articles page, but for now
  // I'm using a toast.
  // Or should I handle that in the callback?
  // It would make sense to let the router redirect.
  
}