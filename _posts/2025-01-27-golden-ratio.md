---
layout: post
title: 'The Golden Ratio'
tags: Math
katex: true
---

The Golden Ratio has something for everyone: children can understand its
definition in terms of similarity, students who've studied a little algebra can
use this definition to find its value in terms of square roots, and those who
know a little calculus can appreciate its (perhaps surprising) relationship to
the Fibonacci numbers.
It's also a nice example of an "infinite" structure which can be defined via
self-reference, continued fractions, nested radicals, and recurrence relations.
This makes it a nice "Grand Slam" topic in popular mathematics.

## Golden Rectangles

Take any (non-square) rectangle.
Draw the largest square that fits inside the rectangle, like so:

![Rectangles with the largest possible square removed](/assets/images/golden-long-short.svg)

Now look at the rectangle that's left over.
If the leftover rectangle has the same _shape_ as the original rectangle, the
original rectangle is called a _golden rectangle_.

![A golden rectangle](/assets/images/golden-rectangle.svg)

Actually, since both the original rectangle and the leftover rectangle are
_similar_, they're _both_ golden rectangles in this case.
As a result, if you now inscribe the largest square within the _leftover_
rectangle, the _leftovers of the leftovers_ are also a golden rectangle, and so
on.
You can do this indefinitely!

![Nested golden rectangles](/assets/images/golden-rectangle-nested.svg)

## Calculating the Golden Ratio

The _golden ratio_ is simply the ratio of the side lengths of a golden
rectangle.
Notice that in both this definition, and the definition of a golden rectangle,
_absolute_ lengths never come into play: all that matters is proportionality.

All you need to calculate the golden ratio is a little experience with quadratic
equations.
To start, lets name some of the lengths in a diagram of a golden rectangle:

![Calculating the golden ratio](/assets/images/golden-rectangle-ratio.svg)

Since absolute size doesn't matter, we've chosen to depict a golden rectangle
whose height is $$1$$; we're calling its length $$A$$.
We've also shaded in the inscribed square.
Because it's a square and its height is $$1$$, its width is also $$1$$.
This makes the width of the unshaded, leftover rectangle $$A - 1$$.

Now the defining property of a golden rectangle is that the unshaded rectangle
is _similar_ to the original rectangle.
If we let $$W$$ and $$H$$ stand for the width and height of the original
rectangle, and $$w$$ and $$h$$ the width and height of the smaller unshaded
rectangle, then this means:

$$
W : H :: w : h
$$

or, equivalently:

$$
\frac{W}{H} = \frac{w}{h}
$$

But we know the width and height of both rectangles, so we can substitute these
values into the equation above and see what happens.
The width and height of the original rectangle are $$A$$ and $$1$$, so:

$$
\begin{aligned}
W &= A \\
H &= 1
\end{aligned}
$$

Turning our heads 90 degrees, it's easy to see that the width of the unshaded
rectangle is $$1$$, and its height is $$A - 1$$:

$$
\begin{aligned}
w &= 1 \\
h &= A - 1
\end{aligned}
$$

Substituting these values into the original equation gives us:

$$
\frac{A}{1} = \frac{1}{A - 1}
$$

Cross-multiplying gives us an equivalent equation, which we can hammer into a
more convenient form:

$$
\begin{aligned}
A(A - 1) &= 1 \\
A^2 - A &= 1 \\
A^2 - A - 1 &= 0
\end{aligned}
$$

Alright, so any golden rectangle with side lengths $$1$$ and $$A$$ has the
property that $$A^2 - A - 1 = 0$$.
This is a quadratic equation, and quadratic equations are readily solvable using
tools like the quadratic formula or completing the square:

$$
\begin{aligned}
A &= \frac{1 \pm \sqrt{1^2 + 4}}{2} \\
A &= \frac{1 \pm \sqrt{5}}{2}
\end{aligned}
$$

There are two solutions, but only one makes sense given our problem (the other
one is negative).
This means:

$$
A = \frac{1 + \sqrt{5}}{2}
$$

We set out to calculate the ratio of the long side of a golden rectangle to its
short side.
And since the long side of our rectangle is $$A$$ and the short side is $$1$$,
$$A$$ is the golden ratio!

It's a special number, so it gets a special name: the Greek letter $$\varphi$$:

$$
\varphi = \frac{1 + \sqrt{5}}{2}
$$

## Continued Fractions and Nested Radicals

The golden ratio $$\varphi$$ involves a square root, which means it's an
_irrational number_.
Irrational numbers are inherently infinite objects.
And it turns out this infinite quality has a couple of very neat, explicit
representations in the case of the golden ratio.
In particular:

$$
\varphi = 1 + \frac{1}{1 + \frac{1}{1 + \frac{1}{1 + \frac{1}{1 + \cdots}}}}
$$

and, in case that isn't spectacular enough:

$$
\varphi = \sqrt{1 + \sqrt{1 + \sqrt{1 + \sqrt{1 + \cdots}}}}
$$

How do we even make sense of a _continued fraction_ or _nested radical_ like the
ones shown above?
This requires a little bit of calculus, which we'll get to below.
But for now let's just ignore any questions about meaningfulness and do some
calculations.

The key observation is that each of these infinite, nested objects contains a
copy of itself within itself.
So let's just pretend that we know that the expression:

$$
1 + \frac{1}{1 + \frac{1}{1 + \frac{1}{1 + \frac{1}{1 + \cdots}}}}
$$

is meaningful, i.e. that it has a well-defined value.
We don't know that value, but we can still give it a name, like $$L$$:

$$
L = 1 + \frac{1}{1 + \frac{1}{1 + \frac{1}{1 + \frac{1}{1 + \cdots}}}}
$$

Again, we don't know what $$L$$ is, but we _do_ know that, whatever it is, the
boxed expression below must have the same value, because it's the same
expression:

$$
L = 1 + \frac{1}{\boxed{1 + \frac{1}{1 + \frac{1}{1 + \frac{1}{1 + \cdots}}}}}
$$

But this means that:

$$
L = 1 + \frac{1}{L}
$$

which is the same as saying:

$$
L^2 - L - 1 = 0
$$

This is the same quadratic equation we solved earlier!
So it has the same solution(s), and thus $$L = \varphi$$.

The same trick is used to find the value of the nested radical.
In this case:

$$
L = \sqrt{1 + \boxed{\sqrt{1 + \sqrt{1 + \sqrt{1 + \cdots}}}}}
$$

so:

$$
L = \sqrt{1 + L}
$$

and again:

$$
L^2 - L - 1 = 0
$$

## A Little Calculus

We rather cavalierly assumed that the continued fraction and nested radical
above are _meaningful_.
But are they?
It's easy to concoct similar infinite objects that don't have any well-defined
value.
A famous example is [_Grandi's Series_](https://en.wikipedia.org/wiki/Grandi%27s_series):

$$
1 - 1 + 1 - 1 + 1 - 1 + 1 - 1 + 1 - 1 + \cdots
$$

You might argue that it's equal to 0, since:

$$
\begin{aligned}
1 - 1 + 1 - 1 + 1 - 1 + \cdots &= (1 - 1) + (1 - 1) + (1 - 1) + \cdots \\
  &= 0 + 0 + 0 + \cdots \\
  &= 0
\end{aligned}
$$

But it also appears to be equal to 1, because:

$$
\begin{aligned}
1 - 1 + 1 - 1 + 1 - 1 + \cdots &= 1 - (1 + 1) - (1 + 1) - (1 + 1) - \cdots \\
  &= 1 - 0 - 0 - 0 - \cdots \\
  &= 1
\end{aligned}
$$

The problem is that Grandi's series doesn't "settle down".

It turns out&mdash;and this is one of the big insights behind
calculus&mdash;that _certain_ infinite objects are well-defined.
This is because that, even though they "go on forever", they change less and
less the "farther out" you go.

This idea is called [_convergence_](https://en.wikipedia.org/wiki/Sequence#Limits_and_convergence).
There's not enough space to discuss it in detail here, but a key result is that
sequences whose terms _increase_ but are _bounded above_ are convergent, a fact
known as the [_monotone convergence theorem_](https://en.wikipedia.org/wiki/Monotone_convergence_theorem).

A little more machinery is required to justify the algebraic operations we
performed, but the gist is that once you know a sequence converges, the tricks
we used above are totally justified.

## The Fibonacci Sequence

Finally, here's a little exercise to try at home.
On a sheet of grid paper, outline two squares next to each other.
Taken together, they form a $$1 \times 2$$ rectangle.
Below them, outline a $$2 \times 2$$ square, like so:

![Approximating the golden ratio with the Fibonacci sequence](/assets/images/golden-ratio-fibonacci.svg)

Taken all together, the 3 squares form a $$3 \times 2$$ rectangle.
Next to them, outline a $$3 \times 3$$ square.
These then admit a $$5 \times 5$$ square below them, then an $$8 \times 8$$
square next to them, then a $$13 \times 13$$ square below them, etc.

As you continue to add squares, the rectangle formed by all of the squares
together looks more and more like a golden rectangle!
We can test this hypothesis with a little program:

```python
import math
from functools import cache

@cache
def fib(n):
    """Compute the nth Fibonacci number."""
    if n == 0 or n == 1:
        return 1
    else:
        return fib(n - 1) + fib(n - 2)

phi = (1 + math.sqrt(5)) / 2
print(f"phi = {phi}")

for n in range(0, 100, 10):
    print(f"fib({n + 1}) / fib({n}) = {fib(n + 1) / fib(n)}")
```

The sequence $$1, 1, 2, 3, 5, 8, 13, \ldots$$ is called the _Fibonacci
Sequence_.
And it's defined exactly like the construction we performed above with the grid
paper.
The first two values are $$1$$ and $$1$$, and every subsequent term is the sum
of the two previous terms.
So the next term is $$2 = 1 + 1$$, then $$3 = 2 + 1$$, then $$5 = 3 + 2$$, then
$$8 = 5 + 3$$, etc.

The grid paper rectangles above each have the property that the ratio of their
side lengths is the ratio of two subsequent Fibonacci numbers: 2 to 1, then 3 to
2, then 5 to 3, 8 to 5, etc.
The program above allows us to see how this ratio changes over the course of
considering the first 100 or so Fibonacci numbers.
And its output confirms our theory:

```
phi = 1.618033988749895

fib(1) / fib(0) = 1.0
fib(11) / fib(10) = 1.6179775280898876
fib(21) / fib(20) = 1.618033985017358
fib(31) / fib(30) = 1.6180339887496482
fib(41) / fib(40) = 1.618033988749895
fib(51) / fib(50) = 1.618033988749895
fib(61) / fib(60) = 1.618033988749895
fib(71) / fib(70) = 1.618033988749895
fib(81) / fib(80) = 1.618033988749895
fib(91) / fib(90) = 1.618033988749895
```

Just as we suspected, this ratio tends towards $$\varphi$$!

Better yet, we can prove it.
We'll first need a proper definition of the n<sup>th</sup> Fibonacci number:

$$
\begin{aligned}
\mathrm{fib}(0) &= 1 \\
\mathrm{fib}(1) &= 1 \\
\mathrm{fib}(n) &= \mathrm{fib}(n - 1) + \mathrm{fib}(n - 2)
\end{aligned}
$$

We're interested in the _limit_ of the sequence:

$$
\rho(n) = \frac{\mathrm{fib}(n + 1)}{\mathrm{fib}(n)}
$$

As we did above, let's just plow ahead and assume $$\rho$$ converges to some
value $$L$$.
(The monotone convergence theorem can once again be used to show that $$\rho$$
does, in fact, converge to _something_.)

But "unfolding" the definition of $$\mathrm{fib}$$ allows us to create another
sequence whose limit must be the same:

$$
\begin{aligned}
\sigma(n) &= \frac{\mathrm{fib}(n) + \mathrm{fib}(n - 1)}{\mathrm{fib}(n)} \\
  &= 1 + \frac{\mathrm{fib}(n - 1)}{\mathrm{fib}(n)} \\
  &= 1 + \frac{1}{\frac{\mathrm{fib}(n)}{\mathrm{fib}(n - 1)}}
\end{aligned}
$$

Finally, the sequence $$\frac{\mathrm{fib}(n)}{\mathrm{fib}(n - 1)}$$ _also_
converges to $$L$$.
This leaves us with the now familiar equation:

$$
L = 1 + \frac{1}{L}
$$

which is equivalent to:

$$
L^2 - L - 1 = 0
$$

So, as anticipated:

$$
\frac{\mathrm{fib}(n + 1)}{\mathrm{fib}(n)} \to \varphi
$$
