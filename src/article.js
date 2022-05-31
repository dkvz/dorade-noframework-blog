
app.fragments.article.template = require('./fragments/article.html');
app.fragments.articleContent.template = require('./fragments/_articleContent.html');
app.fragments.comment.template = require('./fragments/_comment.html');
app.fragments.article404.template = require('./fragments/_article404.html');

app.fragments.article.initPage = function() {
  M.Collapsible.init(document.querySelector('.collapsible'));
  document.getElementById('commentFormEl').addEventListener('submit', app.sendComment);
  //$('.collapsible').collapsible();
};

app.htmlEntities = function htmlEntities(str) {
  // Should also .replace(/&/g, '&amp;') to be correct.
  // But I'm going to fix my server to do it at some point.
  return String(str)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

app.loadComments = function(start, count, callback) {
  // Get the articleId from the hidden input:
  var articleId = app.getCurrentArticleId();
  if (articleId !== '') {
    // We don't need to set bottomReached an all that
    // here, it's set in the infiniteScrolling function.
    $.getJSON(
      app.apiUrl + '/comments-starting-from/' + articleId + 
        '?start=' + app.loadedCount + '&max=' + count, 
      function(data) {
      // Set ret with the data.
      if (data && data.length) {
        var docFrag = document.createDocumentFragment();
        for (var i = 0; i < data.length; i++) {
          data[i].number = app.loadedCount + (i + 1);
          // Some escaping that the server should do, this is a 
          // terrible bandaid DONT LOOK!
          // (I'm writing a new backend)
          data[i].comment = app.htmlEntities(data[i].comment);
          data[i].author = app.htmlEntities(data[i].author);
          
          docFrag.appendChild(app.createElementFromText(
            app.parseTemplate('comment', data[i])
          ));
        }
        app.loadedCount += data.length;
        document.getElementById('comments').appendChild(docFrag);
      }
      callback(data);
    }).fail(function(xhr, errorText) {
      // If we get a 404 it's no use trying to load more articles.
      // or shorts.
      console.log('HTTP error in fetching comments - ' 
        + xhr.status);
      callback(null);
    });
  }
};

app.simpleHtmlStrip = function(text) {
  return text.replace(/<(?:.|\n)*?>/gm, '');
};

app.sendComment = function(event) {
  event.preventDefault();
  // Disable the save button:
  var subm = document.getElementById('submitComment');
  subm.disabled = 'disabled';
  // Get the articleId from the hidden input:
  var articleId = app.getCurrentArticleId();
  var numericId = parseInt(articleId, 10);
  var author = document.getElementById('nameInput');
  var comment = document.getElementById('commentInput');
  var quest = document.getElementById('questionInput');
  var trim = new RegExp(/^\s+|\s+$/, 'g');
  if (quest.value == '2') {
    if (author.value.replace(trim, '') !== '') {
      if (comment.value.replace(trim, '') !== '') {
        // We should probably add the new comment to the DOM.
        // In that case, add 1 to loadedCount.
        // My save comment API is a regular url encoded form for
        // some reason.
        // It should work with jQuery as a data object, needs testing.
        var body = {
          author: author.value, 
          comment: comment.value
        };
        if (isNaN(numericId)) {
          body.articleurl = numericId;
        } else {
          body.article_id = articleId;
        }
        app.toast('Envoi en cours...');
        $.post(
          app.apiUrl + '/comments', 
          body
        ).done(function(data) {
          app.toast('Message enregistré. Enfin si tout va bien.');
          // We need to load more comments here:
          app.showSpinner();
          app.bottomReached = true;
          // Collapse the form (has to use jQuery):
          //$('#commentForm').collapsible('close', 0);
          // Updated materialize has another way to do this:
          M.Collapsible
            .getInstance(document.getElementById('commentForm')).close();
          comment.value = '';
          app.loadComments(app.loadedCount, app.maxComments, function() {
            app.hideSpinner();
            app.bottomReached = false;
          });
        }).fail(function(xhr, errorText) {
          app.toast('Votre commentaire n\'a pas pu' +
            ' être enregistré pour une raison obscure.');
        });
        // Reset all the fields that can be marked
        // as invalid:
        // classList doesn't work on IE9 but it doesn't matter
        quest.classList.remove('invalid');
        author.classList.remove('invalid');
        comment.classList.remove('invalid');
      } else {
        app.toast('Votre commentaire est vide.');
        comment.classList.add('invalid');
      }
    } else {
      app.toast('Veuillez renseigner un nom.');
      author.classList.add('invalid');
    }
  } else {
    app.toast(
      'Veuillez revoir les règles de priorité des opérateurs mathématiques.'
    );
    quest.classList.add('invalid');
  }
  subm.disabled = '';
};

app.getCurrentArticleId = function() {
  var el = document.getElementById('articleIdInput');
  if (el) {
    return document.getElementById('articleIdInput').value;
  }
  return '';
};

app.loadArticle = function(articleId, hash, toc) {
  // To call after "setMainContent"
  app.bottomReached = true;
  app.showOtherSpinner('articleSpinner');
  // If setMainContent wasn't erasing everything when we change
  // article, we'd have to clear the content node here.
  // Actually now that I'm caching nodes I have to clear the content node.
  // Problem is, the spinner is a child of it as well.
  // So we could always just leave one child active.
  // Instead I'm going to move the spinner outside...
  var artsEl = document.getElementById('article');
  app.removeContentFromNode(artsEl);
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
      // Need to encode the names of the tags:
      if (data.tags && data.tags.length > 0) {
        for (var t = 0; t < data.tags.length; t++) {
          data.tags[t].nameEncoded = 
            encodeURIComponent(data.tags[t].name);
        }
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
    app.hideOtherSpinner('articleSpinner');
    artsEl.appendChild(docFrag);
    // Scroll to bottom if it was required:s
    if (hash && hash !== '') {
      //location.hash = '';
      //location.hash = hash;
      // My images don't have height, so they cause
      // a big reflow when loading which makes going
      // to a specific anchor too fast unreliable.
      // Hence the 1 second timeout here:
      setTimeout(function() {
        location.href = '#' + hash;
      }, 1000);
    }
    app.fragments.article.initPage();
    app.bottomReached = false;
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
      contentObj.toc += '<li><a href="#' + addLvlStrPartial + '" target="_self">' +
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