
app.fragments.article.template = require('./fragments/article.html');
app.fragments.articleContent.template = require('./fragments/articleContent.html');
app.fragments.comment.template = require('./fragments/_comment.html');

app.fragments.article.initPage = function() {
  
}

app.getArticle = function(articleId, callback) {
  // articleId can also the article URL.
  var url = app.apiUrl + '/article/' + articleId;
  $.getJSON(url, function(data) {
    callback(data);
  }).fail(function(xhr, errorText) {
    // Every error will be considered as if it was a 404.
    callback(null);
  });
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