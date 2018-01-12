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

* Does the backend really remove HTML from comments? Got to check that.
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
* I often use checks to !== undefined, especially for callbacks. I can probably just use if (callback) or event better, something like (callback && callback())  -> To check.
* Theme color in the manifest.json is wrong.
* The styles folder should be inside src.
* Add "exit page" callbacks in routing to unregister event listeners on some pages.
  * Removing nodes also GCs the listeners, but not very effectively on old IE versions (as in IE 8).
  * So this is very low priority.