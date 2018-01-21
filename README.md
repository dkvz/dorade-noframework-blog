# JS Blog Engine
This project is an experiment producing a blog engine similar to one I made using Polymer 1.0 but with no frameworks.

I do use Webpack, the Javascript router Page.js and the MaterializeCSS project. The site could live without Webpack although it would take some work to put everything together manually. One of my requirements was that this had to survive a hypothetical global apocalypse in which someone issues a `rm -rf node_modules` that affects all the computers in the world, until the end of times.

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

To serve the website on Apache, Nginx or others you'll need to use a fallback resource to index.html or a rewrite that has the same effect.

## Supported browsers
The polyfill for addEventListener and removeEventListener is acutally useless since Materialize is not supposed to be supported below IE 11 and I also use classList at some point.

The pinned toolbar on scrolling might also not work on IE 8, same with the infinite scrolling (which might even not work on IE 9).

We're not providing a polyfill for the routing, which uses HTML 5 pushstate API. I think only IE 10 supports it but I might be wrong on that.

I need to write Modernizr code and create a page for non-supported browsers.

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

### Optimize CSS
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

### The FOUC issue
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

### TODO


* In breves and articleCard I had to remove the quotes around "layout" and add them in the JS code because otherwise uglify would remove the quotes from the template. I don't know if that's a bug with Uglify or if I'm missing something.
* When loading article cards the console is saying Roboto from the materialize website has been blocked because it's not using HTTPS. Why is it trying to download Roboto from there? What does this even mean?
* Try to add the thing that compresses images with webpack. Low priority.
* Isn't there something better than using margin-left and margin-right to make my float elements no stick too close to the text?
* To gototop button should be on the main template. Just show it when required.
* Add the unsupported browsers thingy.
* I NEED THE MANIFEST PLUGIN and use that to load my fragments with their right hashes.
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
* We could delcare a contructor for the app object and call new somehwere. I think react works like that.
  * Check how cookie clicker does it. I like it because the code of cookie clicker is super dirty.
* Theme color in the manifest.json is wrong.
* The styles folder should be inside src. I mean that is arguable.
* Add "exit page" callbacks in routing to unregister event listeners on some pages.
  * Removing nodes also GCs the listeners, but not very effectively on old IE versions (as in IE 8).
  * So this is very low priority.
* npm run dev doesn't work on windows. I made another command: npm run dev-win. But that is more like a hack. I'm also not 100% sure it even works. Or if it doesn't set the env to dev forever after it ran once.

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