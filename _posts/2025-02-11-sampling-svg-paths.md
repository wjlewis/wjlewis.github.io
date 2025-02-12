---
layout: post
title: 'Sampling SVG Paths'
tags: Log Signals Bezier-Curves
---

I'm going to need to sample SVG paths for a little project involving the
Discrete Fourier Transform, so I spent a morning hacking something together in
an Observable notebook.
The result is a couple of functions capable of turning an SVG path, like:

```
m 0.67459296,84.73997 q 0,-4.441731 2.78899444,-7.850486 2.8922979, ...
```

into a sequence of points sampled from that path:

```javascript
[
  [0.67459296, 84.73997],
  [0.8489051125, 82.5836655],
  [1.37184157, 80.556483],
  [2.2434023325, 78.6584225],
  [3.4635874, 76.889484],
  [3.4635874, 76.889484],
  [5.0065759000000005, 75.39814493749999],
  [6.7432435, 74.33290274999999],
  [8.6735902, 73.69375743749998],
  [10.797616, 73.48070899999999],
  // ...
];
```

To help debug the output, these samples can then be rendered as dots on an HTML
`canvas`:

![Samples from an SVG path rendered on a canvas](/assets/images/svg-x-dots.png)

The process is fairly straightforward (and perhaps _too_ straightforward; only
time will tell):

1. The path string is parsed into a sequence of commands.
   A typical command looks like:

   ```javascript
   { type: 'q', ctrl: [10, -20], to: [30, 40] }
   ```

2. Relative commands are then "desugared" into their absolute equivalents.
   That is, `q` commands are transformed into the equivalent `Q` command, `c` to
   `C`, `l` to `L`, etc.
   We also "expand" `H`, `h`, `V`, and `v` with the appropriate `L` command at
   this time.

3. At this point we have a sequence of absolute commands.
   We iterate over these, sampling `n` points from each one in turn (with the
   exception of `M` commands, which move the "pencil" but don't contribute any
   points).
   This is just a matter of implementing explicit formulas for Bézier curves,
   something I'd done a while ago but hadn't looked at since.
   Bézier curves really are beautiful things, both visually and mathematically.

I'm hoping to use this system to compute the DFT of cool-looking paths, and then
implement a "circle machine" that draws them.
One aspect of the way I've implemented things here that might trip me up is that
each _segment_ of the path is sampled independently.
So the path:

```
M 0 0 H 10 H 100
```

looks like a horizontal line from `0` to `100`, but the samples aren't spaced
uniformly:

![Nonuniform samples from a straight line](/assets/images/nonuniform-line-samples.png)

Whether or not this is a problem remains to be seen.
At the moment, I'm not sure _how_ I'd produce uniform samples from this path in
the event that this is an issue.
But that's a problem for another day.
