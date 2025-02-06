---
layout: post
title: 'Visual Aliasing'
tags: Notes
---

I've been learning a bit about digital signals from Brian McFee's very
approachable (and freely-available)
[_Digital Signals Theory_](https://brianmcfee.net/dstbook-site/content/intro.html).
While studying _aliasing_ I was inspired to throw together a little interactive
visual demo to help illustrate the phenomenon.
I've included a few videos in this post, but you can play along at home
[here](https://wjlewis.github.io/visual-aliasing-demo/).

Discrete signals are often the result of _sampling_ a continuous signal.
Sampling is just a process of taking "snapshots" of the continuous signal at a
regular interval (the _sampling period_).
Taking more frequent snapshots leads to a smoother looking discretization, and
vice-versa.

In the video below, the right wheel's angle is sampled from the left wheel's at
the chosen sampling frequency.
As I reduce the sampling frequency (and thus increase the time between
snapshots), the right wheel's rotation becomes choppy:

<video src="/assets/videos/wheel-sampling.webm" type="video/webm" controls></video>

So we want the sampling frequency to be high enough to avoid the "choppiness"
we're seeing here.
But choppiness isn't the only problem facing us.
Sampling is an inherently _lossy_ process: we've thrown away any information
about what our signal is doing in-between snapshots.

As an extreme example, suppose we sample the left wheel's angle once per second.
Here's what happens as we sweep the left wheel's rotation frequency from a
quarter turn per second to one turn per second:

<video src="/assets/videos/wheel-frozen.webm" type="video/webm" controls></video>

If the left wheel makes one revolution each second, and we sample it once per
second, then its angle is the same each time we sample it: it looks like it
isn't rotating at all!

This is an extreme example of _aliasing_.
There are an infinite number of continuous signals that our discrete signal
_could_ have been sampled from: maybe the wheel was actually spinning twice per
second, or three times per second, etc; or maybe it was actually just rocking
back and forth; or doing something even more complex.

Here's another example.
In this case we're sampling the left wheel's angle twice per second.
If the left wheel makes a single revolution each second, our discretization
makes the wheel look like it's just flipping back and forth.
But we also "capture" the _same exact signal_ if the left wheel makes 3
revolutions per second:

<video src="/assets/videos/wheel-sample3-1.webm" type="video/webm" controls></video>

Of course, things can get even stranger.
Pairing the right sampling frequency with any continuous frequency can create
the illusion that the wheel is spinng _backwards_:

<video src="/assets/videos/wheel-backwards.webm" type="video/webm" controls></video>

## What Can be Done?

Losing information is inherent in the sampling process: there will always be
infinitely many ways to continuously connect two successive samples.
But _aliasing_ doesn't need to be.
It turns out, if your continuous signal is composed only of frequencies limited
to a finite interval (the signal's _band_), then there exists a sampling
frequency above which aliasing doesn't occur.
Basically, any continuous frequencies that could interpolate successive samples
are outside the original signal's band limits.
This is the celebrated [_Nyquist-Shannon Sampling Theorem_](https://en.wikipedia.org/wiki/Nyquist%E2%80%93Shannon_sampling_theorem).
