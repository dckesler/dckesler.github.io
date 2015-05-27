---
layout: post
title: Angular Directives and Webpack
date:   2015-05-12
categories: posts
comments: true
---
This whole experiment has a working [github version here](https://github.com/dckesler/angular-directives-webpack).

My favorite thing to write in angular is directives.
I think I might be one of the few. Most of my coworkers don't really like to do anything with directives.
I get it. They have a pretty bizarre api.

```javascript
{
  scope: {
    thing: '@',
    thingie: '=',
    uhh: '&'
  },
  transclude: true,
  link: function(scope, elem, attrs){

  },
  bindToController: true,
  controllerAs: "waht"
  controller: function(){

  }
}
```
-

I'm a web development teacher here at [DevMountain](https://devmounta.in/), and whenever we try to teach directives in angular I get a lot of blank stares. The number one question is, "Shouldn't it be $scope in your link function?". Meanwhile they've already given up on what 'transclusion' is supposed to mean.

Regardless I think they're great. I like having modular bits of code only connected to the outside world through the holes you poke using the scope object.
So react comes along and suddenly I have to learn it because I'm on of the mentors for [React Week](https://reactweek.com/).
I like it! Later one of my coworkers is asking me about it. On a whim I tell her it's like angular but everything has to be a directive. While I'm trying to make the comparison work by explaining it to her I suddenly realize that, that's totally what it is.

Ever since then I've thought to myself, "I bet you could make a whole app using directives." Then the other night I thought to myself, "If I did everything with directives. Then I don't need to link everything to the index. I could pack it all through webpack. That also means I can do everything in ES6!"
Before I get started there are some criticisms I must address.

- Am I trying to make angular behave like react?
 - Uhh....
- Angular is not react so won't forcing it to act like react create problems?
 - Ummm.....
- Shouldn't I be learning Angular 2 instead?
 - Hrmm.....

What I can say is this style of angular has a very easy build process. On top of that it creates modules that are easy to reason about, and that can be modified without creating unwanted side-effects.

##Let's do it!

###Step One. Webpack!
If you're already familiar with setting up webpack skip all of step one. Just know we're using babel for ES6, and then css-loader, style-loader, and maybe sass-loader.
Do you have [node](https://nodejs.org/download/)? Great! Now install webpack. Using Node's Package Manager you can just type `npm install -g webpack` in your terminal / command line. This function will erase your hard-drive... I mean... This will install webpack globally and give you access to the `webpack` command in your terminal.

[Webpack](http://webpack.github.io/) uses dependency trees to bundle lots of files into a single one. This is especially nice if you have either a huge `index` file with script tags for days, or maybe a file dedicated to scripts in your build system. That includes your huge Sass file that imports all the other files. Webpack handles it for you. Just imagine your app is like [this ant nest](https://www.youtube.com/watch?v=tyBf3GcGX64). Everything branches off from the little hole at the top.

In order for webpack to do its thing, you also should install it locally. Really at this point if you like a nice `package.json` the next few things I describe should be installed via `npm install --save-dev` since they are developer tools. As such install webpack via npm. Also let's go ahead and install a few more things.

Webpack needs different kinds of 'loaders' to help it pack up all your stuff. I mentioned earlier that we could use ES6. I would like to do that still. So let's install babel. Babel helps compile our ES6 back to ES5 so the browser can still read it. Along with babel let's install `babel-core`, and `babel-loader`.

So our directives are all going to need html templates. Normally this sort of thing takes a pathway from our index to this particular html file that is our template. However, since we're using webpack we can also include html files as part of our dependency tree. So we'll need a loader for html. The node module `html-loader` does the trick.

Now we also wanted to make each directive responsible for it's own personal stylesheet. So let's include another loader, css-loader, and style-loader. Finally, this is for me, but I also like [Sass](http://sass-lang.com/) so if you want you can install the sass-loader.

Before we configure our projects webpack I'm going to list the steps up to here.

- Install webpack globally.
- Install webpack locally.
- Install Loaders
 - babel
 - babel-core
 - babel-loader
 - html-loader
 - css-loader
 - style-loader
 - sass-loader

Now we need to configure webpack. Create a file in the root called `webpack.config.js`.
Open that up and let's build it.

- First thing.
`var webpack = require('webpack')`
We need webpack.

- Second thing.
`module.exports = {}`
Everything for our webpack config goes in this export object.

- Third. We need a property called `entry` that describes where our dependency tree starts. That means we should probably make it too right? I have a directory at my root called `angular` inside of which is a `.js` file called `app.js`. This is where I start. So my `entry` property has a value of `'./angular/app.js'`.

- Fourth. We need to let webpack know where to put our bundle. So let's make that spot too. I have a folder in my root called `public`. Inside there is `index.html` and `bundle.js`. I want my code to end up in `bundle.js` so that my `index` only has one script tag. `<script src="bundle.js"></script>`.
Once you've got a destination you need to tell webpack what it is. Make an `output` property on your webpack config object. Its value is also an object that has two properties, `path` and `filename`. My `path` value is `__dirname + '/public'`. My `filename` value is `'bundle.js'`.

- Fifth. We need to set up our webpack with the right loaders. We really just need two but you might want three if you're using Sass. Make a `module` property on your exports object. Its value is an object with a property of `loaders` who then has a property that is an array of object that represent our loaders.

So far

```javascript
var webpack = require('webpack');

module.exports = {
    entry: [
        './Angular/app.js'
    ],

    output: {
        path: __dirname + '/public',
        filename: 'bundle.js'
    },

    module: {
        loaders: ['OUR LOADERS GO IN HERE']
    }
};
```

So now in the loaders first let's add babel to handle our Javascript/ES6. I'll show the code.

```javascript
{ test: /\.js$/, loader: 'babel', exclude: [/node_modules/] }
```
Here's our first loader. This will basically be the same for each of them. Define what sort of suffixes should be grabbed, who will handle their compiling, and what, if anything, to not grab.

This will be for html.

```javascript
{ test: /\.html$/, loader: "html-loader", exclude, [/node_modules/]}
```
Using `html-loader` for html, that makes sense.

Here's our css loader.

```javascript
{ test: /\.css$/, loader: "style!css", exclude: [/node_modules/] }
```
Using two loaders here for css. Really what `style!css` is saying is `style-loader` and `css-loader`.


```javascript
{ test: /\.scss$/, loader: "style!css!sass", exclude: [/node_modules/] }
```
If you want Sass.


```javascript
var webpack = require('webpack');
module.exports = {
    entry: [
        './Angular/app.js'
    ],

    output: {
        path: __dirname + '/public',
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel', exclude: [/node_modules/] },
            { test: /\.html$/, loader: 'html-loader', exclude: [/node_modules/] },
            { test: /\.css$/, loader: "style!css", exclude: [/node_modules/] },
            { test: /\.scss$/, loader: "style!css!sass", exclude: [/node_modules/] }
        ]
    }
};
```
This is the whole thing.

This wasn't intended to be a webpack tutorial, but I felt like maybe a lot of people coming from angular might be less familiar with webpack. So I just figured I'd go for it.

##Step 2. Angular.
Now for the actual building. I'm going to assume anyone here understands pretty well how angular works. If not then I'm certainly not the person to go to for an introduction.

I might take a few chances to explain some parts of angular's directives. It's a bit of a wonky api, and I know there are some developers who've been using angular for awhile who still haven't gotten around to really wanting to use them. Thing is if you're approaching angular with a desire for modular code directives can be a huge asset. Enough preaching.

I'm going to use the angular [ui-router](http://angular-ui.github.io/ui-router/) rather than the ngRouter. It will work either way.

In the `app.js` file in my `angular` directory I start my angular config for my routes. In this file above where I start my configuration I need to include my angular and angular-ui-router dependencies, both of which can be installed via npm. Since we can use ES6 we might as well use the native importing system.

```javascript
import angular from 'angular';
import uiRouter from 'angular-ui-router';
```

Underneath this code start up your config. To get things going maybe add just a test state/route. Then instead of having a path to some template just add in your template that maybe says something like `<test-route></test-route>`. This is just saying that this whole route will be wrapped in our testRoute directive.

##Step 3. Directives.
Angular's way of calling an instance of your directive is finding it in the html. That's why your router just needs to have `<test-route></test-route>` for its template. This means that the whole route of test will be inside an instance of testRoute. So you're going to need that directive. Inside my `angular` directory I have a `routes` directory. For each wrapper directive I have a new directory named after that route. For example, I have this
 `angular/routes/testRoute/testRoute.js`. Not too important but I like having my directory tree very organized, and I like it to reflect my dependency tree.

So maybe you see where I'm going with this. Each route is going to be completely wrapped in a directive. Where's the html for the view come from? A directive can have its own template html. Well who's going to be the controller for that html? Lucky us, directives can have their own controllers. Check out my `testRoute` directive as an example.

```javascript
return {
    template: "<h1 ng-click='sayHello'>Hello</h1>",
    controller($scope){
      $scope.sayHello = function(){
        alert("Hello!");
      }
    }
}
```



It's got all the things. Later I'll show how to import in html files as your templates rather than writing a html string inline, but this is good for now so we can see just what's going on. Also, if you're not used to seeing ES6, that goofy controller thing is just the fancy ES6 way of writing a method on an object.
Thanks to Babel and Webpack we can write ES6 right now (and according to me we really should be).

So that's cool. My "route" has its html template and its controller just packed nicely into a directive. Except for not yet. Because we're not linking all our `js` files in our `index.html` that means our router config has no idea that `testRoute` even exists. So let's add some things to our directive to make it accessible to `app.js`.

Here's how I like it.

```javascript
export default angular
    .module('dirApp')
    .directive('testRoute', testRoute);

function testRoute(){
    return {
        template: `<h1 ng-click='sayHello()'>Hello</h1>`,
        controller($scope){
            $scope.sayHello = function(){
                alert("Hello");
            }
        }
    }
}
```

This is kind of weird. It all comes from the way angular works with adding things like directives or controllers or services. In reality I don't actually care what gets returned from invoking `angular.module('dirApp').directive('testRoute', testRoute)`. Really I just care that this code is run in the same universe as my original angular module instantiation. Angular will then do the work of adding `testRoute` to the module 'dirApp' as one of its available directives. That `export default` is just saying that if I were to import from this file that's what will automatically be returned. Now that our directive can be exported let's add it into our `app.js` file.

When we add in our directives it's important that it happen beneath all of our config and module instantiation. The module `dirApp` must exist before `testRoute` code is evaluated since its part of that module. You'd get an injection error otherwise. What's nice is that like I said before we really don't care what's being returned from our import, we just care that the `testRoute` code is run. So all you need is this.

```javascript
import './routes/testRoute/testRoute.js';
```
-

Obviously you should have this be whatever your pathway is to testRoute but that's all there is to it. Now the `testRoute` directive exists inside of your module and technically you can use it anywhere. (I do not condone the concept of use it anywhere.)

Most of the time you'll be writing more html for each directive than can reasonable be put into a html string inside the directive file itself. The classic solution is to use `templateUrl` rather than just `template`. The problem with that is trying to determine the pathway from your `index.html` to each html template. Luckily webpack comes to the rescue. With webpack we can import an html file as an html string and put that string in the `template` property of our directive. Check out this example.

Imagine this is an html file.

```html
<div ng-click="sayHello()">Hello</div>
```
-

Here's my directive javascript code.

```javascript
import html from './testRoute.html';

function testRoute(){
    return {
        template: html,
        controller($scope){
            $scope.sayHello = function(){
                alert("Hello");
            }
        }
    }
}
```
-

You can see here that I have in the same folder as `testRoute.js` my html file called `testRoute.html`. This is what I import in with the line `import html from './testRoute.html'`. This gives me the variable html as an html string. That's why I can then take that variable and make it the value of my `template` property. I actually find myself writing this

```javascript
template: require('./testRoute.html')
```
I find this cleaner, but I don't know the equivalent for the import system with ES6.

But what about your css/scss/sass/less? In my `testRoute.js` file there's actually another import at the top: `import './testRoute.scss';`
In the same folder I have my `scss` file where I do all my stylesheet stuff. Here I will do all styling associated with that particular directive's template, and no more. Doing it this way cuts down on side-effects. Specifically, I think doing it with Sass and nesting everything in that stylesheet underneath a single wrapper class is especially effective. Some code like this below is what I mean.

```html
<div class="testRoute">
  <p class="header">Header</p>
  <div class="contentBox">
    <div class="content">Content</div>
  </div>
</div>
```

```scss
.testRoute {
  font-size: 2rem;
  .header {
    color: #AAA;
  }
  .contentBox {
    border: 1px solid #CCC;
    .content {
      color: #33DD66
    }
  }
}
```
-

It limits bleeding out of styles and unwanted changes when you're messing with a single directive's style.

##Step 4. Moar Directives
If you look at just any old page in some app you could say that it's really built of several different parts. I say we divide all those parts into their own directives. These different pieces can stand alone, communicate with the parent directive, or maybe they're template directives that you ng-repeat over. The idea is to break it out into sensical pieces that can easily be reasoned about, and easily modified without side-effects. Sounds almost too good to be true.

I say directives can make this happen in angular. Specifically, directives with isolate scopes make this happen. Isolating the scope of a directive is exactly what it sounds like. The directive no longer has access to outside code and vice-versa. However, we are given an API that allows us to attach a few wires that allow for communication from parent to child. This way we know exactly what's coming into our directive, which in turn makes it easier to reason about what's going out.

So without getting too much into the division of concerns in a page let's just look at how including more directives into our parent directive works. It's actually really simple. In my app I made another directive called `moarContent`. In my `testRoute.js` file beneath the directive function I have this.

```javascript
import './moarContent/moarContent.js';
```
-

It doesn't really matter whether this be above or below the directive call. Before angular really renders any of this it's going to build up a list of all its directives first. That's why when you link all your angular files in the html order doesn't matter after you've got your module code.

So now in the template of `testRoute` I can include `<moar-content></moar-content>`, and that will call my `moarContent` code and create and instance of that new directive wherever I put it in my html.

Naturally this also means you can do the same thing inside of `moarContent` with a new directive and so on. We're building our dependency tree or, if you watched that youtube video in Step One, our ant colony(nest?). Our directives represent our branches and those branches can have branches coming off of them. Along with this can be our little offshoots or leaves that are our css files. I don't know of an equivalent analogy that uses the ant colony as its base metaphor.

##Step 5. Isolate scope

If I had my way in your project every single directive would have an isolate scope. This eliminates side-effects and also gives access points for someone to jump into your codebase and start contributing without having to learn a ton of backstory to understand what's going on. Step five will be brief, but I'll describe how an isolate scope works.

```javascript
scope: {
  one: '@',
  two: '=',
  three: '&'
}
```
-

Here's where I think a lot of people lose interest in a directive. What's with the isolate api? Let's take it piece by piece.

## "@"
This is the easiest part. The `@` just means that whatever you pass into your directive through this attribute will be a string of whatever you pass in. Let's use our `moarContent` directive as an example. If it has this scope object

```javascript
scope: {
  name: '@'
}
```
-

Then inside our `testRoute` html we could have this

```html
<moar-content name="Jeffrey"></moar-content>
```
-

That means that `moarContent`'s `scope` has a property of `name` with the value of `'Jeffrey'`. A good way to test this stuff is using the link function.

```javascript
link(scope){
  console.log(scope)
}
```
-

You should see this somewhere in that print - `name: "Jeffrey"`.

## "="

This means that whatever is passed into the directive through this attribute should be treated as a variable and creates two-way binding. Say your parent directive has `$scope.thing = 6` and so in your html you have `<moar-content bind="thing"></moar-content>`. Then if you logged your scope you would have `bind: 6` on your scope object.

## "&"

This is probaly the trickiest one. The `&` attributes on your directive call are expecting functions. But unlike what you might think seeing the `=` you're not actually passing the function definition into the directive. This is best explained using an example.

Let's say on your parent directive you have this.

```javascript
var tester = "parent";
$scope.test = function(){
  console.log(tester);
}
```
```html
<moar-content func="test()"></moar-content>
```
-

Then in the child directive you run the function.

```javascript
link(scope){
  var tester = "child";
  scope.func();
}
```
-

This would print out `'parent'` not `'child'`. That's because `scope.func` here is not the `$scope.test` function in the parent. It's a completely different function that angular uses to look up the original function and run it in it's original place. So not only would it print `'parent'` but it would say that it ran that print inside of `testRoute` rather than `moarContent`.

This brings up an interesting question though. Say we changed the original parent function to this -

```javascript
$scope.test = function(param){
  console.log(param);
}
```
-

Since it's not actually passing along the original function where do we put in our argument for that `param` parameter? The most acceptable version would look like this -

```html
<moar-content func="test(x)"></moar-content>
```

```javascript
link(scope){
  scope.func({x: "My new parameter."});
}
```

-

I can't really think of an easy way to explain this, but essentially this new function that you run to look up the original function can also accept an object the overwrites the parameters you pass in through the html call of the directive. The property is the original argument, and the value is the new argument. So `x` becomes `"My new parameter."`.

So just think that when you isolate your scope your given three types of holes you can poke to give it access to its call environment. Though it may seem funky at first it's how you insure you know exactly what's coming in and what's going out of your directive.

##Step 6. Loose ends

So if you somehow made it to this point without giving up there are still a few things that I think we should address. One is how to include services.

### Services

Really you can include imports of services anywhere and they'll be accessible by all your directives and other services. That doesn't really make sense to just throw them in anywhere though. So really you have to find something that works for you. At first I'm inclined to just import all my services into my `app.js`, but if you have a lot of services that can become cumbersome.

In a way services are to these angular-directive apps as flux is to react. Not really in philosophy, but they do behave like data stores that also interact with web API's for you. The nice thing is that with webpacks way of bringing in dependency code and angular's way of building lists of available components you can put your service files whereever it makes sense to you as long as somehow they're connected to your dependency tree somewhere.

### Async Routes and Resolve

The resolve block in the angular router really only needs promises to be returned in order for it to work properly. So you can run any function in there as long as you make it promise based. That includes whatever helper libraries you choose to include, for example you could actually use flux instead of services if you choose. The resolve block could be making calls to whatever you want.

The only possible setback is that your directive's controller won't have immediate access to these variables like if you were to include a controller in your route config. You'll need to do async stuff using the resolve block to delay a route being loaded until the data you want is in your store and then you can do a synchronous getter right when the directive loads. I actually prefer this because then any directive that needs that data can get it from the store rather than just the one controller having it.

### controllerAs

In all of my examples I'm not using controllerAs syntax. If you do like controllerAs syntax then inside your directive you'll need to add a few properties to the return object.

```javascript
controllerAs: 'theName',
bindToController: true
```
-

This allows you to use your controllerAs name in your directives template html and context (`this`) rather than `$scope` inside your controller. Just know that inside your `link` function you'll need to go to scope.theName rather than just scope. So in the controller you'll have

```javascript
controllerAs: 'name',
controller(){
  this.bird = "duck";
}
```
-

And in your link you'll have

```javascript
link(scope){
  console.log(scope.name.bird);
}
```
That will print out `"duck"`.

## The End -

Check out a [working version here](https://github.com/dckesler/angular-directives-webpack).

Hit me up on [twitter](https://twitter.com/dckesler) if you like this and have questions. If you think it's stupid and have questions message me on linkedin.
