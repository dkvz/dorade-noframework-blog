# JS Blog Engine
This project is an experiment producing a blog engine similar to one I made using Polymer 1.0 but with no frameworks.

I do use Webpack, the Javascript router Page.js and the MaterializeCSS project (which uses jQuery, so I sparingly do as well).

The site could live without Webpack although it would take some work to put everything together manually. One of my requirements was that this had to survive a hypothetical global apocalypse in which someone issues a `rm -rf node_modules` that affects all the computers in the world, until the end of times.

I'm a weird person.

The site populates its dynamic content using calls to this other project: [dorade-blog-engine](https://github.com/dkvz/dorade-blog-engine) which was whipped up very quickly so please don't look at the code there.

## Pre-requisites
* NodeJS version 6+

## Install
Clone the repository. Get inside the project directory and run:
```
npm install
```

## Testing the website
To run the test server on Windows and OSX (port 8080):
```
npm run dev
```

For Windows use:
```
npm run dev-win
```
The Windows command probably also works on Linux and OSX. I haven't actually tested.

## Building for prod
To minify (almost) everything for production use:
```
npm run prod
```
Which will remove then create the 'dist' folder.

To use the cache busting capabilities you need to increment the version in package.json. I can't use hashes like everyone else for the JS because of many reasons related to Webpack and my manual lazy-loading antics. I do use hashes for the CSS.

To serve the website on Apache, Nginx or others you'll need to use a fallback resource to index.html or a rewrite that has the same effect.

## Supported browsers
The polyfill for addEventListener and removeEventListener is acutally useless since Materialize is not supposed to be supported below IE 11 and I also use classList at some point.

The pinned toolbar on scrolling might also not work on IE 8, same with the infinite scrolling (which might even not work on IE 9).

We're not providing a polyfill for the routing, which uses HTML 5 pushstate API. I think only IE 10 supports it but I might be wrong on that.

I need to write Modernizr code and create a page for non-supported browsers.

## FAQ nobody asked for

### Why are you not using ES6?
I started doing JS seriously somewhat recently. I thought I might as well get to know the "old ways" before the new.

It's true that things like Promises would look much better in some parts of my code where I have callbacks inside other callbacks but I wanted to limit polyfills (even though I have this useless addEventListener one :D) and avoid using Babel.

But why? Everybody and their mom are using Babel! Well, yes. It's just a feeling I have that not using it gives me more control. I might be wrong as Babel could very well produce code that is more compatible than what I'm doing but a big part of it is that I want to know how "old" JS works.

Also, not using Babel is part of my requirement of the site having to be easy to adapt and still be working in case of a NodeJS apocalype. Which I don't really believe will happen ever but I like trying to work with less requirements and added software if I can and I think we all had the occasional npm package update breaking EVERYTHING. Not a fan of that even if it's easily fixed most of the time.

### Your "app" object is referencing itself expecting to be in the global context
Yeah, in some functions and especially in callbacks. It is ugly, I'm working on ways to make this whole thing more testable.

I'm far from being a Javascript expert.

### Wait you don't even use "bind"?
Nope. I tried to stay away from stuff that doesn't work on browsers < IE 9 even if technically the site doesn't work on IE < 11. This is again an exercise as to feel how to write the most compatible JS with no transpiling or using libraries like jQuery.

I also tried to not use CSS properties like "classList" but I ended up doing it anyway in some parts of the code.

### But you're using jQuery
I had to include it because Materlize requires it to be present. It's true that while I was at it I used it for Ajax and to get properties like scroll positions. But I want to be able to remove it somewhat easily if possible, so I strived to use jQuery sparingly, even though it's got some most of the "compatibility" code I've re-written already. I just want to try doing it myself.

### You're storing your main object in window
Yes this is a possible problem for testing. I also have tons of references to document everywhere.

I have very little experience in testing, expecially testing with Node. This is an exercise I'm going to have to look into at some point.

Due to the way I'm using Webpack, trying to avoid their lazy loading solution (which uses promises), I can't really pass or inject global variables. If you're using their way of lazy loading, you probably can (I don't actually know) require an object at multiple places in your code and it should retain its values.

### Why are you doing lazy loading manually?
The Webpack-way of doing lazy loading uses promises. I don't want to polyfill promises.

Don't take this as a good practice. You should polyfill promises, promises are great. I'm trying to learn how to do most things manually on purpose.

### You're using a Play project as backend, why isn't it serving the files from this project?
I like to completely split my frontend and backend code. Might look like a weird choice, especially since I could do some server side rendering and get more flexibility otherwise, but this exercise also includes learning different backend technologies.

My point is, "normal" people would probably combine this project with the Play framework backend (or any other backend like Flask or Symphony/Laravel, ...) and use some kind of "watch" with Webpack rather than the full dev server, which should be provided by your backend tech.

### Dude where are the tests?
I seem to really not like JS frameworks, and I don't, but they do have the advantage of having testing mostly covered in that everything is supposed to have been thought out for easy testing later on. Depending on who you ask, this is a gigantic advantage to using a framework, and could be the only reason needed do it.

Many devs including myself do not always realize that some really weird design choices for apps and frameworks were made for the sole reason of testing.

I want to learn testing practices from zero anyway so I'll eventually think about ways to write good tests for my app, which may have huge consequences on how the code is written.

## DONT READ THIS
This readme is currently mostly a todo list an a project notepad. I'll write the sections on how to run the site later.

There is a gigantic TODO section at the bottom that can be seen as some sort of ugly roadmap (to hell).

### The anchor link issue
When I use an anchor link to #something on my article pages it reloads the article.
However, using the anchor link in the browser address bar works.

I have a few leads.

#### Using location.hash in script
It doesn't work for my toBottom code at the moment though.

I'm going to try in dev console => It works but not the first time we do it:
```
window.location.hash = 'toc_1_4'
```

#### Do something at the router level
I think page.js is interfering with the hash link.
What is weird is that clicking a hash link first reload the article, but clicking it a second time after that works.

My other blog also uses page.js, perhaps I can try to check if hash links work there. => They have the same behavior.

The router data passed to the callback has a "hash" property. I think we need to check for that one.

=> Problem solved by preventing the routing callback to do anything in case of hash on the same page.

### Staggering the animations
Mostly things I need to remember:
* When changing page I need to remove any existing scroll listener bound to the staggered animations control.

Let's review the items to animate.

Items are currently receiving the scale-up class in `loadArticlesOrShorts`.

-> Instead of that, we have to add the items in a queue of elements to animate.
Just add it to a new list right before after adding it to the document fragment. This has to be some sort of temp-list or we also have to lock down the animation scroll thingy event if it exists.

Let's go for the temp list.

### Old stuff

#### Previous spinner injection
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

#### Optimize CSS
I think I should use this:
```
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
```
Detecting duplicate CSS seems interesting.

#### The FOUC issue
I think I need the extract text plugin to solve the FOUC issue. HtmlWebpackPlugin is supposed to add the CSS to head automatically if using extract text plugin.

Let's see how I can make this work... I'll test some of this stuff in my test project.

OK so we need to install the plugin:
```
npm install --save-dev extract-text-webpack-plugin
```

Import in the config:
```
var ExtractTextPlugin = require('extract-text-webpack-plugin');
```

The CSS test should look like this:
```
{
  test: /\.css$/,
  use: ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: "css-loader"
  })
},
```

And declare the plugin in your plugins section.

Then that's it, FOUC issue solved.

#### Gradients experiments
I think there may be too many cats going on on my site.

Let's have an alternative gradient background.

I was using this tool: http://www.colorzilla.com/gradient-editor/

Things I tried:
```
/*background: linear-gradient(to bottom, rgba(69,90,100,1) 0%,rgba(0,0,0,0) 100%);*/
/* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#607d8b+20,455a64+50,607d8b+80&0+0,0.8+15,1+19,1+81,0.8+85,0+100 */
background: -moz-linear-gradient(top, rgba(96,125,139,0) 0%, rgba(96,125,139,0.8) 15%, rgba(96,125,139,1) 19%, rgba(96,125,139,1) 20%, rgba(69,90,100,1) 50%, rgba(96,125,139,1) 80%, rgba(96,125,139,1) 81%, rgba(96,125,139,0.8) 85%, rgba(96,125,139,0) 100%); /* FF3.6-15 */
background: -webkit-linear-gradient(top, rgba(96,125,139,0) 0%,rgba(96,125,139,0.8) 15%,rgba(96,125,139,1) 19%,rgba(96,125,139,1) 20%,rgba(69,90,100,1) 50%,rgba(96,125,139,1) 80%,rgba(96,125,139,1) 81%,rgba(96,125,139,0.8) 85%,rgba(96,125,139,0) 100%); /* Chrome10-25,Safari5.1-6 */
background: linear-gradient(to bottom, rgba(96,125,139,0) 0%,rgba(96,125,139,0.8) 15%,rgba(96,125,139,1) 19%,rgba(96,125,139,1) 20%,rgba(69,90,100,1) 50%,rgba(96,125,139,1) 80%,rgba(96,125,139,1) 81%,rgba(96,125,139,0.8) 85%,rgba(96,125,139,0) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00607d8b', endColorstr='#00607d8b',GradientType=0 ); /* IE6-9 */
```

This one is better with a single mid point:
```
/* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#ffffff+0,607d8b+50,ffffff+100&0.75+0,0.75+100 */
background: -moz-linear-gradient(top, rgba(255,255,255,0.75) 0%, rgba(96,125,139,0.75) 50%, rgba(255,255,255,0.75) 100%); /* FF3.6-15 */
background: -webkit-linear-gradient(top, rgba(255,255,255,0.75) 0%,rgba(96,125,139,0.75) 50%,rgba(255,255,255,0.75) 100%); /* Chrome10-25,Safari5.1-6 */
background: linear-gradient(to bottom, rgba(255,255,255,0.75) 0%,rgba(96,125,139,0.75) 50%,rgba(255,255,255,0.75) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#bfffffff', endColorstr='#bfffffff',GradientType=0 ); /* IE6-9 */
```

I'm going to start with this one:
```
/* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#607d8b+0,ffffff+50,607d8b+100&0.9+0,0.9+100 */
background: -moz-linear-gradient(top, rgba(69,90,100,0.9) 0%, rgba(255,255,255,0.9) 50%, rgba(69,90,100,0.9) 100%); /* FF3.6-15 */
background: -webkit-linear-gradient(top, rgba(69,90,100,0.9) 0%,rgba(255,255,255,0.9) 50%,rgba(69,90,100,0.9) 100%); /* Chrome10-25,Safari5.1-6 */
background: linear-gradient(to bottom, rgba(69,90,100,0.9) 0%,rgba(255,255,255,0.9) 50%,rgba(69,90,100,0.9) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#e6607d8b', endColorstr='#e6607d8b',GradientType=0 ); /* IE6-9 */
```


### TODO

* In reading mode (Firefox feature) the top level anchor links do not seem to work.
  * Actually reading mode doesn't really work either. It works when linked from the homepage, but doesn't work when you refresh the page.
* In breves and articleCard I had to remove the quotes around "layout" and add them in the JS code because otherwise uglify would remove the quotes from the template. I don't know if that's a bug with Uglify or if I'm missing something.
  * This is probably due to minification.
* To make uses of app. or this. in app itself more homogeneous I could use the old trick to assign "this" to a variable (called self, for instance) and that would work for callbacks. It woudn't work if a function from app is given as a parameter for something (like an event listener).
* When loading article cards the console is saying Roboto from the materialize website has been blocked because it's not using HTTPS. Why is it trying to download Roboto from there? What does this even mean?
* Try to add the thing that compresses images with webpack. Low priority.
* Isn't there something better than using margin-left and margin-right to make my float elements no stick too close to the text?
* To gototop button should be on the main template. Just show it when required.
* Add the unsupported browsers thingy.
* I need to test the infinite scrolling on a huge resolution.
* The mobile menu has weird bottom margin issues.
  * Not really on Chrome.
* Pagejs requires html5 history api, I think it doesn't work on IE 8 (to check) - There is a polyfill.
* What is the CSS style text-size-adjust?
* List style is better but maybe could be better in articles.
* Test on mobile and tablets, the infinite scrolling might not work on there.
* Use the SASS CSS from materialize. If I do that, I need to replace mentions to Roboto in my css file and replace that with the SASS variable used for the base font family.
* It looks like on some articles + some computer sometimes, going to the bottom using the comments link doesn't proc the infinite scrolling.
  * I think I may have fixed that through resetting previousDiff while enabling infinite scrolling.
* I need to put my robot / IE loadmore button.
* Due do a bug I had to fix the version of webpack-dev-server to 2.9.7. I might have to change that at some point, when a version superior to 2.10 is out.
* The webpack config could be more homogeneous and cleaned up.
* I think app.previousArticle is now unused. To check.
* I often use checks to !== undefined, especially for callbacks. I can probably just use if (callback) or even better, something like (callback && callback())  -> To check.
* When the backend returns a 404 the jquery AJAX stuff always outputs a parse error as well. I might have to still return content type json on my errors, or add a listener to ajax errors and prevent the output.
* Theme color in the manifest.json is wrong.
* The styles folder should be inside src. I mean that is arguable.
* Add "exit page" callbacks in routing to unregister event listeners on some pages.
  * Removing nodes also GCs the listeners, but not very effectively on old IE versions (as in IE 8).
  * So this is very low priority.
* npm run dev doesn't work on windows. I made another command: npm run dev-win. But that is more like a hack. I'm also not 100% sure it even works. Or if it doesn't set the env to dev forever after it ran once.
* Move to using yarn instead of npm. Why not.

### Historical
* Scrolling to comments doesn't work anymore. It kinda does but then I think the repaint due to some images is causing the scroll position to be wrong.
  * I've put a setTimeout of 1s before scrolling. Won't be enough for slow connections.
* There is no table style or it's wrong in my articles.
  * I have to use thead, and the class responsive-table is nice.
* Technically if we're already on the articles page, we don't have to reload it entirely if we click a tag, we just need to refresh the loaded articles.
  * We could just cache the generated root elements of pages, since we don't need to re-fetch that stuff. We'd have to be careful of event listeners sticking around with these elements. I have to check the performances on mobile, but it could be a good idea.
    * We would just be keeping the document fragment.
     * I'm probably going to have to do this for performances reasons.
* All the initialization stuff might have to be put in a "document ready" bloc. Not sure.
  * I don't need it because my JS is at the end of body. This stackoverflow question has some nice replacements for document ready though: https://stackoverflow.com/questions/799981/document-ready-equivalent-without-jquery