---
layout: post
title: 'Circle Machines'
tags: Log Signals
katex: True
---

I've been playing around with "circle machines" as part of my attempt to
understand the DFT.
A circle machine is a sequence of arms, each of which rotates at some fixed
frequency; the last one has a pen fixed to its end:

<video src="/assets/videos/circle-machines/swirl3.webm" controls></video>

We can think of these machines as tools for plotting functions in the complex
plane, specifically, functions whose signature is:

$$
\mathbb{R} \to \mathbb{C}
$$

A single arm with a length of $$R$$ making $$\omega$$ revolutions per second
plots the function:

$$
f(t) = Re^{i2\pi \omega t}
$$

as shown here:

<video src="/assets/videos/circle-machines/circle.webm" controls></video>

Connecting two machines corresponds to (pointwise) _addition_ of the functions
they plot.
As a simple example, connecting a single linkage with a length of 1 and an
angular frequency of 1 revolution per second with another having a length of
$$\frac{1}{2}$$ and an angular frequency of 2 revolutions per second produces:

$$
\begin{aligned}
m_1(t) &= e^{i2\pi t} \\
m_2(t) &= \frac{1}{2}e^{i2\pi \frac{1}{2}t} \\
m(t) &= m_1(t) + m_2(t) \\
  &= e^{i2\pi t} + \frac{1}{2}e^{i2\pi \frac{1}{2}t}
\end{aligned}
$$

This "composite machine" traces out the familiar [cardioid](https://en.wikipedia.org/wiki/Cardioid):

<video src="/assets/videos/circle-machines/cardiod.webm" controls></video>

Thinking of these machines as complex-function plotters allows us to easily
answer a few nagging questions.
First: does the _order_ of the arms matter?
Not at all, since addition in $$\mathbb{C}$$ is commutative:

<video src="/assets/videos/circle-machines/add-comm.webm" controls></video>

Second: do the angular frequencies of the arms need to be distinct?
What happens if I link together multiple arms having the same angular frequency?
Again, there's no benefit to doing so over just including a single arm at that
frequency, thanks to the commutativity and associativity of addition:

<video src="/assets/videos/circle-machines/add-assoc.webm" controls></video>

These two facts let us simplify our model of circle machines slightly: they're a
sequence of linkages, each of which rotates at a _distinct_ angular frequency.

However, there's another parameter that we haven't yet considered.
Each linkage currently "starts" at an angular offset of 0.
What if we relaxed this, effectively allowing each linkage to specify a _phase_
in addition to its length and frequency?

$$
m_{R,\omega,\phi}(t) = Re^{i\left(2\pi \omega t + \phi\right)}
$$

For simple machines, this simply rotates the function plotted:

<video src="/assets/videos/circle-machines/phase-matters.webm" controls></video>

However, it significantly changes more complex machines.
The following three "swirly machines" share all of their parameters aside from
their linkages' phases.
And yet they produce images with strikingly different symmetries:

<video src="/assets/videos/circle-machines/swirl.webm" controls></video>

<video src="/assets/videos/circle-machines/swirl2.webm" controls></video>

<video src="/assets/videos/circle-machines/swirl3.webm" controls></video>

Does introducing the phase parameter change the answer to the second question
above, which asked whether there's any benefit to including multiple arms with
the same frequency?
Specifically, what if the two arms have different _phases_?
It turns out not to make a difference, and this is another easy consequence of
the way addition works in $$\mathbb{C}$$.
Clearly, the first two linkages with the same angular frequency (but different
phases) could be replaced by a single linkage with a length and phase calculated
using the [law of cosines](https://en.wikipedia.org/wiki/Law_of_cosines), for
instance:

<video src="/assets/videos/circle-machines/phase-added.webm" controls></video>

Alright, so a circle machine plots a function having the form:

$$
t \mapsto \sum_{k \in K} R_k e^{i \left( 2\pi \omega_k t + \phi_k \right)}
$$

Where the $$\omega$$'s are _distinct_.
This is clearer if we parameterize the sum by the angular frequency:

$$
t \mapsto \sum_{\omega \in \Omega} R_\omega e^{i \left( 2\pi \omega t + \phi_\omega \right)}
$$

What can we say about the set $$\Omega$$?
In the examples above, it's always been some finite set of real numbers, like:

$$
\begin{aligned}
\Omega_\mathrm{Circle} &= \{ 1 \} \\
\Omega_\mathrm{Cardioid} &= \{ 1, 2 \}
\end{aligned}
$$

Can we restrict the elements of $$\Omega$$ to _rational numbers_?
_Integers_?
_Positive integers_?

Scaling _all_ of a circle machine's frequencies by the same factor produces a
different machine that nonetheless draws the same picture, only faster:

<video src="/assets/videos/circle-machines/faster.webm" controls></video>

As a result, if all of the frequencies in a machine are
[commensurable](<https://en.wikipedia.org/wiki/Commensurability_(mathematics)>),
we could define a machine that uses only _integer_ frequencies to produce the
same picture.

On the other hand, if two frequencies are _incommensurable_, no such reduction
is possible.
However, in this case the machine never appears to retrace its steps:

<video src="/assets/videos/circle-machines/incommensurable.webm" controls></video>

So if we restrict our attention to _periodic_ functions only, it seems like we
can limit our attention to _integer_ frequencies.

Does it ever make sense to include a frequency of 0?
This just seems to translate the resulting image:

<video src="/assets/videos/circle-machines/zero-freq.webm" controls></video>

Alright, but what about _negative_ frequencies?
These turn out to be important!
There are certain pictures that you just can't draw without including negative
frequencies.
For example, here's a straight line:

<video src="/assets/videos/circle-machines/negative-freqs.webm" controls></video>

And an interesting propeller shape:

<video src="/assets/videos/circle-machines/propeller.webm" controls></video>

Neither of which appear to be possible to draw without including linkages with
negative frequencies.
(I found the concept of a negative frequency a bit strange at first, but it
just indicates a rotation in the opposite direction.)

## Summary

Well that was fun!
Where does it leave us?
We can represent many periodic functions from $$\mathbb{R} \to \mathbb{C}$$ as
an assemblage of "linkages":

$$
t \mapsto \sum_{\omega \in \mathbb{Z}} R_\omega e^{i\left( 2\pi \omega + \phi_\omega \right)}
$$

Such a machine can be represented simply by listing the values of $$R_\omega$$
and $$\phi_\omega$$ for each integer $$\omega \in \mathbb{Z}$$.
For instance, the circle machine from above has the representation:

| $$\omega$$ | $$R_\omega$$ | $$\phi_\omega$$ |
| ---------- | ------------ | --------------- |
| $$0$$      | $$0$$        | $$0$$           |
| $$1$$      | $$1$$        | $$0$$           |
| $$-1$$     | $$0$$        | $$0$$           |
| $$2$$      | $$0$$        | $$0$$           |
| $$-2$$     | $$0$$        | $$0$$           |
| ...        | ...          | ...             |

The cardioid:

| $$\omega$$ | $$R_\omega$$    | $$\phi_\omega$$ |
| ---------- | --------------- | --------------- |
| $$0$$      | $$0$$           | $$0$$           |
| $$1$$      | $$1$$           | $$0$$           |
| $$-1$$     | $$0$$           | $$0$$           |
| $$2$$      | $$\frac{1}{2}$$ | $$0$$           |
| $$-2$$     | $$0$$           | $$0$$           |
| ...        | ...             | ...             |

The propeller:

| $$\omega$$ | $$R_\omega$$ | $$\phi_\omega$$   |
| ---------- | ------------ | ----------------- |
| $$0$$      | $$0$$        | $$0$$             |
| $$1$$      | $$1$$        | $$0$$             |
| $$-1$$     | $$0$$        | $$0$$             |
| $$2$$      | $$0$$        | $$0$$             |
| $$-2$$     | $$1$$        | $$\frac{\pi}{2}$$ |
| ...        | ...          | ...               |

Etc.

These are examples of parameterizations of [_Fourier Series_](https://en.wikipedia.org/wiki/Fourier_series),
which are intimately related to the [_Fourier Transform_](https://en.wikipedia.org/wiki/Fourier_transform)
of periodic functions, including discrete signals.

I believe several punchlines are:

- _Any_ (well-enough behaved) periodic function can be uniquely represented
  using a circle machine with integer frequencies (i.e. its _Fourier Series_).
- The _Fourier Transform_ of such a periodic function looks like a bunch of
  Dirac deltas having the same parameters as the Fourier Series.
