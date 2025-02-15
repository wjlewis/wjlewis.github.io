---
layout: post
title: 'First Success with the DFT'
tags: Log Signals
---

I finally put all of the pieces together this morning:

<video src="/assets/videos/dfts/letter-t-dft.webm" controls width="100%"></video>

I feel like I have a solid grasp of the [Discrete Fourier Transform](https://en.wikipedia.org/wiki/Discrete_Fourier_transform),
and I can now answer questions that stumped me a few days ago, like: _if my
signal has no imaginary component, why are the coefficients of its Fourier
series complex numbers?_

This is kind of like asking: _if my number is an integer, why might half of it
be a (non-integral) rational number?_
While our signal might have no imaginary component, this is kind of a special
case for periodic phenomena, in the same way that even numbers are special
integers.

In order to be able to express both sine and cosine using a "circle machine"
(and _why_ we care about these circle machines will need to wait for another
post) we need to be able to set both the lengths of the machine's arms but also
their _starting angles_.
It's almost impossible to detect in this video, but the "sine machine" starts
with one arm straight up and the other straight down, where the "cosine machine"
begins with them stretched end-to-end horizontally:

<video src="/assets/videos/dfts/sin-cos-dft.webm" controls width="100%"></video>

So each arm needs two parameters (length and initial angle) just to be able to
express real-valued signals.
Bundling up these two parameters into a complex number isn't strictly necessary,
but it's a natural and insightful choice.

Here are a few more.
A square wave:

<video src="/assets/videos/dfts/square-dft.webm" controls width="100%"></video>

And the unit circle:

<video src="/assets/videos/dfts/circle-dft.webm" controls width="100%"></video>

## More Questions

Still, more questions remain.

- It's not obvious to me why the (sampled) basis functions are orthogonal.
  This appears to have something to do with the fact that different frequencies
  result in samples "bouncing around" the roots of unity in different orders.
- Related to this, there appear to be exactly n ways to bounce around the
  n<sup>th</sup> roots of unity.
  I _think_ what I'm observing is that there are n distinct cyclic groups
  (including _subgroups_) that "involve" the n<sup>th</sup> roots of unity.

Clearly I still have more to learn about the unit circle!
