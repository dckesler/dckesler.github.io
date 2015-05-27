---
layout: post
title: React Key
date:   2015-05-07
categories: posts
---
When I first started using React.js I ran into something probably a lot of you also ran into.
![Warning](/images/reactkey/reactkey_keywarning.png)

At the time I was writing my first React app, the todo list. You can imagine I was mapping over an array and returning jsx.

{% highlight js %}
this.state.list.map(function(item){
  return <li>{item}</li>
})
{% endhighlight %}

Hence the error. True to the warning's advice, I should have had a key. However, it was working and yellow logs in your console can be ignored right?
Later I asked my co-workers, should I care about these "no key" error? The answer was an emphatic 'yes'.
Admittedly, I cared about it too. I wanted it to go away. I like me a clean empty console. So understanding how the map function works
I chucked in my index parameter and made that error go away.

{% highlight js %}
this.state.list.map(function(item, index){
  return <li key={index}>{item}</li>
})
{% endhighlight %}
This became my strategy and really it worked great. Great being that I wanted the yellow warning to disappear. However, I started to see chatter
on twitter and the like about how that was a bad idea. I assumed they were right, but I didn't think about it until I ran into an actual problem with it.
I was working on a personal project. I was mapping over an array and returning a react component that was doing animations for me.


![Seems Fine](/images/reactkey/reactkey_demo_works.jpg)

I don't really feel like I should explain everything going on here. Just know that I'm mapping over a list of objects, and if one of those objects happens to have
the values of `Magic` and `Walrus` I'm also adding in a component that's running some animations.

As you can see [@eanPlatter](https://twitter.com/EanPlatter) is a Magic Walrus, and, as one would expect, a Walrus Wizard has appeared to represent him. Huzzah.
But then Ean's stats suck so I decide to remove him.


![Not Fine](/images/reactkey/reactkey_demo_error.png)

Well what the heck? Famo.us is clearly not a Magic Walrus. Why then has my Wizard Walrus inhabited that cubicle? My first thought was, "My react component isn't removing, because I'm doing the animation through `setTimeout`'s and my web api's are keeping it alive." That leads me on a stupid chase after React's unmounting capabilities. That didn't work. So then I try clearing all `setTimeout`'s before I remove the component wrapping my animation component. Well that stops poor Wizard Walrus from moving, but he's still inhabiting spaces not meant for his kind.

Then comes to my mind echoes from the past. "Don't use index as your key", they say. "Daniel, looking both ways doesn't cause the street to be safe.", say the others. Both of them it turns out are right. Let's look at the React.js docs on dynamic children.

`When React reconciles the keyed children, it will ensure that any child with key will be reordered (instead of clobbered) or destroyed (instead of reused).`

Nevermind that clobbered is the actual word in their docs, the point is that the `key` helps React to know what components can be reused or reordered. So when I delete `@eanplatter` it replaces my list state with another list that has `@befamous` in the `1` indice rather than `@eanplatter`. Interestingly, it still does a re-render for the outer component in that the information displayed is now `@befamous`'s stuff, but the inner animator component is not destroyed like I wanted. React is reusing it.

Luckily twitter provides unique id's for all its users. So when I replace `index` with the twitter id everything is fixed. When React sees a completely different key it wipes the entire `@eanplatter` component including that poor walrus. Rest his soul.

###TL;DR
Whenever possible provide a completely unique key to mapped lists of react elements that will not be reused by another component.
