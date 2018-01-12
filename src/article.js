
app.fragments.article.template = require('./fragments/article.html');
app.fragments.articleContent.template = require('./fragments/articleContent.html');
app.fragments.comment.template = require('./fragments/_comment.html');
app.fragments.article404.template = require('./fragments/_article404.html');

app.fragments.article.initPage = function() {
  // If I add event listeners here and keep the nodes intact 
  // in some variable, the listeners should stick around.

};

app.loadComments = function() {

};

app.sendComment = function() {
  // Get the articleId from the hidden input:
  var articleId = app.getCurrentArticleId();

  // We should probably add the new comment to the DOM.
  
};

app.getCurrentArticleId = function() {
  return document.getElementById('articleIdInput').value;
};

app.loadArticle = function(articleId, scrollToBottom, toc) {
  // To call after "setMainContent"
  app.bottomReached = true;
  app.showOtherSpinner('articleSpinner');
  // Let's make the request:
  this.getArticle(articleId, function(data) {
    var docFrag = document.createDocumentFragment();
    if (data) {
      // Don't forget to set the title of the page.
      document.title = data.title + ' | ' + app.titleBase;
      // I could auto-process the content by adding a process 
      // function to the property of the fragment.
      // But I'd like to not create a table of content if
      // displaying a short, so I'll need more than one 
      // function to process the article content.
      if (toc) {
        // My function to add the table of content requires
        // a really weird object to work with:
        var contObj = {
          toc: ''
        };
        contObj.content = data.content;
        app.addTOC(contObj, 1, 4, 0, contObj.content.length, 'toc');
        // Replace the content we got (probably not the most 
        // memory effective thing ever):
        data.content = contObj.toc + contObj.content;
      }
      // Here We could process other things like images.
      docFrag.appendChild(app.createElementFromText(
        app.parseTemplate('articleContent', data)
      ));
      // Enable infinite scrolling:
      app.enableInfiniteScrolling();
    } else {
      // data is set to null in case of any error.
      // We treat anything as a 404 though.      
      docFrag.appendChild(app.createElementFromText(
        app.fragments.article404.template
      ));
      document.title = app.titleBase;
    }
    app.bottomReached = false;
    app.hideOtherSpinner('articleSpinner');
    // If setMainContent wasn't erasing everything when we change
    // article, we'd have to clear the content node here.
    document.getElementById('article').appendChild(docFrag);
  });
};

app.getArticle = function(articleId, callback) {
  // articleId can also the article URL.
  var url = this.apiUrl + '/article/' + articleId;
  $.getJSON(url, function(data) {
    callback(data);
  }).fail(function(xhr, errorText) {
    // Every error will be considered as if it was a 404.
    callback(null);
  });
};

/**
 * I Recycled this hellish function from my previous blog.
 * I have no idea what possessed me when I wrote this thing and
 * I don't want to look at it for too long.
 * @param {*} contentObj An object with two properties: toc and content
 * @param {*} lvl 
 * @param {*} maxLvl 
 * @param {*} start 
 * @param {*} end 
 * @param {*} lvlStr 
 */
app.addTOC = function(contentObj, lvl, maxLvl, start, end, lvlStr) {
  var count = 1;
  var lookingFor = '<h' + lvl + '>';
  var lookingForClose = '</h' + lvl + '>';
  lvlStr = lvlStr + '_' + lvl;
  var stopLooking = false;
  var hasElements = false;
  var addedChars = 0;
  while (!stopLooking) {
    var first = contentObj.content.indexOf(lookingFor, start);
    // Check if we did find an hX element:
    if (first >= 0 && first < end) {
      // Extract the title.
      // We have string.substring(start, end)
      // Find the end tag first:
      var closeTag = contentObj.content.indexOf(lookingForClose, first);
      if (closeTag < 0 || closeTag >= end) {
        closeTag = end;
      }
      // At this point we can add the <ul> to the TOC.
      if (!hasElements) {
        contentObj.toc += '<ul>';
        hasElements = true;
      }
      var title = contentObj.content.substring(first + lookingFor.length, closeTag);
      if (title.length === 0) {
        title = 'Empty Title';
      }
      // Add this title to the TOC:
      // <a onclick="app.scrollToItem('a1_1')">Go to top</a>
      // var anchor = '<a onclick="app.scrollToItem(\'' + lvlStr + '_' + lvl + '\')"></a>';
      // Let's do it generic first:
      var addLvlStrPartial = lvlStr + '_' + count;
      //contentObj.toc += '<li><a onclick="app.scrollToItem(\'' + addLvlStrPartial + '\')">' +
      //  title + '</a></li>\n';
      // With h element we can just use their id as an anchor:
      contentObj.toc += '<li><a href="#' + addLvlStrPartial + '">' +
        title + '</a></li>\n';
      // Add the anchor, will look like this:
      // We need to add an id to the Hx element that we're working with here.
      var addLvlStr = ' id="' + addLvlStrPartial +  '"';
      contentObj.content = contentObj.content.substring(0, first + 3) + addLvlStr +
        contentObj.content.substring(first + 3, contentObj.content.length);
      count++;
      addedChars += addLvlStr.length;
      // Now is time to make the recursion.
      // We need to know if there is a next hx element, or just use the whole content
      // length for this.
      // content has changed: the length is now bigger due to the id="".
      // Look for the next one. If no next one, we use the whole length of the content.
      // The variable end changedd because we modified content.
      end += addLvlStr.length;
      var next = contentObj.content.indexOf(lookingFor, first +
        lookingFor.length + addLvlStr.length);
      if (next < 0 || next >= end) {
        next = end;
      }
      if (lvl < maxLvl) {
        var added = this.addTOC(
          contentObj, lvl + 1, maxLvl, first, next, lvlStr + '_' + count
        );
        // When we get back here content may have changed a lot. The positions start
        // and end need to change.
        end += added;
      }
      // The variable start has to change for the loop to work.
      start = closeTag + lookingForClose.length + addLvlStr.length;
      if (start >= end) {
        start = end;
      }
    } else {
      // No more elements after this, we can stop looking.
      stopLooking = true;
      if (hasElements) {
        // We need to close the <ul> in the TOC.
        contentObj.toc += '</ul>';
      }
    }
  }
  return addedChars;
};