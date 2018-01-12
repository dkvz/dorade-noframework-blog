NOTHING HERE YET

## DONT READ THESE

## Supported browsers
We use addEventListener and removeEventListener, I added a polyfill just for kicks.

Materialize is not supposed to be supported below IE 11.

### Previous spinner injection
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
* Does the backend really remove HTML from comments? Got to check that.
* All the direct calls to materialize.toast can be made to app.toast.
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
* There is a serious FOUC going on, I need to inject the materialize CSS in the head using the HTML plugin, not know how yet.
* Due do a bug I had to fix the version of webpack-dev-server to 2.9.7. I might have to change that at some point, when a version superior to 2.10 is out.
* In the fragments array, spinner-card should be called spinnerCard.
* I often use checks to !== undefined, especially for callbacks. I can probably just use if (callback) or event better, something like (callback && callback())  -> To check.
* We could delcare a contructor for the app object and call new somehwere. I think react works like that.
  * Check how cookie clicker does it. I like it because the code of cookie clicker is super dirty.
* Technically if we're already on the articles page, we don't have to reload it entirely if we click a tag, we just need to refresh the loaded articles.
  * We could just cache the generated root elements of pages, since we don't need to re-fetch that stuff. We'd have to be careful of event listeners sticking around with these elements. I have to check the performances on mobile, but it could be a good idea.
    * We would just be keeping the document fragment.
* Theme color in the manifest.json is wrong.
* The styles folder should be inside src.
* Add "exit page" callbacks in routing to unregister event listeners on some pages.
  * Removing nodes also GCs the listeners, but not very effectively on old IE versions (as in IE 8).
  * So this is very low priority.