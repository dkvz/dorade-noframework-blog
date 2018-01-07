NOTHING HERE YET

## DONT READ THESE

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

* The spinner can directly get inserted into the static index.html template, I don't have to do it from the script.
* The fragments object could also contain page titles and paths to use with routing. I'm not putting the paths there ATM so that routing.js is clearer.
