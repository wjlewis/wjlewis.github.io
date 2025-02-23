---
layout: post
title: 'Almost a Decent Coordinate Plane'
tags: Log
---

I've spent the last few mornings reverse-engineering the coordinate plane in the
[Desmos Graphing Calculator](https://www.desmos.com/calculator).
I think I'm almost there:

<video src="/assets/videos/coord-plane1.webm" controls width="100%"></video>

All I have left to do is render the labels correctly.
(You can see an example of this _not_ happening towards the end of the video.)

The code that implements this is compact (just a few hundred lines) and, I
believe, fairly efficient (it only allocates memory to create the labels).

I'm planning on using this in a little playground for exploring 2D real linear
transformations.
I'll render two coordinate planes: one for the domain and the other for the
image; you'll be able to draw on the domain and see your drawing transformed on
the image plane; the transformation will be a configurable matrix, possibly with
a few bells and whistles.

Once I figure out the labels I'd also like to write up a tutorial on how this
works, since it might be useful to others.
