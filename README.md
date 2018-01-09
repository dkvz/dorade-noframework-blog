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

* I need to pick the images for the mobile menu.
* There is a serious FOUC going on, I need to inject the materialize CSS in the head using the HTML plugin, not know how yet.
* I forgot to add the number of comments to articles.
* Due do a bug I had to fix the version of webpack-dev-server to 2.9.7. I might have to change that at some point, when a version superior to 2.10 is out.
* The spinner can directly get inserted into the static index.html template, I don't have to do it from the script.
* The fragments object could also contain page titles and paths to use with routing. I'm not putting the paths there ATM so that routing.js is clearer.
* I often use checks to !== undefined, especially for callbacks. I can probably just use if (callback) or event better, something like (callback && callback())  -> To check.
* Theme color in the manifest.json is wrong.