NOTHING HERE YET

# DONT READ THIS
This readme is currently mostly a todo list an a project notepad. I'll write the sections on how to run the site later.

## Supported browsers
We use addEventListener and removeEventListener, I added a polyfill just for kicks.

Materialize is not supposed to be supported below IE 11.

## The anchor link issue
When I use an anchor link to #something on my article pages it reloads the article.
However, using the anchor link in the browser address bar works.

I have a few leads.

### Using location.hash in script
It doesn't work for my toBottom code at the moment though.

I'm going to try in dev console => It works but not the first time we do it:
```
window.location.hash = 'toc_1_4'
```

### Do something at the router level
I think page.js is interfering with the hash link.
What is weird is that clicking a hash link first reload the article, but clicking it a second time after that works.

My other blog also uses page.js, perhaps I can try to check if hash links work there. => They have the same behavior.

The router data passed to the callback has a "hash" property. I think we need to check for that one.

=> Problem solved by preventing the routing callback to do anything in case of hash on the same page.

### Old stuff

## Previous spinner injection
```
// Add the spinner thingy to indicate loading:
app.spinner = app.createElementFromText(
  require('./fragments/_spinner-card.html')
);
document.getElementById('mainEl').appendChild(app.spinner);
app.showSpinner = function() {
  document.getElementById('spinnerCard').style.display = '';
}
app.hideSpinner = function() {
  document.getElementById('spinnerCard').style.display = 'none';
}
```
I just removed the createElement thingy and replaced it with a getElementById.

## TODO

* The backend has to be able to save comments using the articleId as well as the URL.
* All the direct calls to materialize.toast can be made to app.toast.
* I sometime use the ternary operator to set something as true or false, this is redundant...
* When the backend returns a 404 the jquery AJAX stuff always outputs a parse error as well. I might have to still return content type json on my errors, or add a listener to ajax errors and prevent the output.
* If you're loading something and move to another page it will create an error.
* By clicking a menu multiple time, do we proc the routing function multiple times?
* Disable the source maps in production or check that the -p flag does that.
* I need to put my robot / IE loadmore button.
* Layout info for articles and shorts could be a variable.
* The infinite scrolling pages could use a fab that goes to the top. SHouldn't be too hard to do.
* All the initialization stuff might have to be put in a "document ready" bloc. Not sure.
* I NEED THE MANIFEST PLUGIN and use that to load my fragments with their right hashes.
* The mobile menu has weird bottom margin issues.
* Pagejs requires html5 history api, I think it doesn't work on IE 8 (to check) - There is a polyfill.
* My URL encoded tag links have spaces in them. I don't think they had spaces on the older blog.
* List style is better but maybe could be better in articles.
* I need to pick the images for the mobile menu.
* Disable the save comment button while saving is in progress.
* Routing without hash bangs actually has a hard browser version limit I think.
* There is a serious FOUC going on, I need to inject the materialize CSS in the head using the HTML plugin, not know how yet.
* Due do a bug I had to fix the version of webpack-dev-server to 2.9.7. I might have to change that at some point, when a version superior to 2.10 is out.
* In the fragments array, spinner-card should be called spinnerCard.
* I often use checks to !== undefined, especially for callbacks. I can probably just use if (callback) or event better, something like (callback && callback())  -> To check.
* We could delcare a contructor for the app object and call new somehwere. I think react works like that.
  * Check how cookie clicker does it. I like it because the code of cookie clicker is super dirty.
* Technically if we're already on the articles page, we don't have to reload it entirely if we click a tag, we just need to refresh the loaded articles.
  * We could just cache the generated root elements of pages, since we don't need to re-fetch that stuff. We'd have to be careful of event listeners sticking around with these elements. I have to check the performances on mobile, but it could be a good idea.
    * We would just be keeping the document fragment.
     * I'm probably going to have to do this for performances reasons.
* Theme color in the manifest.json is wrong.
* The styles folder should be inside src.
* Add "exit page" callbacks in routing to unregister event listeners on some pages.
  * Removing nodes also GCs the listeners, but not very effectively on old IE versions (as in IE 8).
  * So this is very low priority.