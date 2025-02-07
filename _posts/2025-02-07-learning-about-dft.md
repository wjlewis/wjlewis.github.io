---
layout: post
title: 'Learning about the DFT'
tags: Log Signals
katex: True
---

I've been learning a bit about discrete signals from Brian McFee's
[_Digital Signals Theory_](https://brianmcfee.net/dstbook-site/content/intro.html).
I'm currently trying to understand the
[_Discrete Fourier Transform_](https://en.wikipedia.org/wiki/Discrete_Fourier_transform).
The Fourier Transform is one of those concepts that I _feel_ like I understand
until I probe just slightly past the surface.
For example: why is the result a complex-valued function?
I don't know (yet)!

I'm currently learning about comparing a discrete signal to various
discretizations of sinusoids.
A simple way to compare two discrete signals is to sum the products of their
respective samples.
This is just the familiar dot product, where we treat each signal as a vector in
$$n$$-dimensional space, where $$n$$ is the number of samples.

By sweeping through a range of sinusoids at varying frequencies, we can build up
a representation of our original signal in terms of these sinusoids.
Well, kind of.

We need to compare our original signal to both $$sin$$ and $$cos$$ functions,
because one family of these alone isn't a basis in the space we're interested
in.
Once we have these values we form some kind of spectrum that also incorporates
complex numbers at some point.
I'm not sure yet.

One thing at a time.
In order to get a better intuitive grip on what "similarity" means in this
context, I hacked together a little [Observable](https://observablehq.com)
notebook:

<video src="/assets/videos/learning-about-dft.webm" type="video/webm" controls></video>

The top element is an interactive widget that lets me "paint" a discrete signal
using the cursor.
We can then compare the input signal against a variety of sinusoids whose
frequency and phase are controlled by some sliders.
By aggregating these similarity scores (at a particular phase), we can plot a
kind of "similarity spectrum".
And finally, we can use that spectrum to (kind of) reproduce the original
signal.

Clearly I'm still missing quite a bit: the reconstruction as I'm implementing it
here is inherently incomplete, since it only considers samples at a single
phase.
We need another dimension here (the phase), which I'm assuming is where the
complex numbers come into play.
