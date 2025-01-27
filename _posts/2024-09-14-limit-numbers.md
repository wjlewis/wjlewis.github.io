---
layout: post
title: 'Limit Numbers'
tags: Sketch Calculus Python
katex: True
---

I feel split in two when doing calculus.
We can readily translate certain operations (like differentiation) into
algorithms.
In other cases&mdash;antidifferentation comes to mind&mdash;the "computational
content" is less clear, as they tend to require hunting for a solution using
ad-hoc and often very clever tricks.

I've always put the evaluation of limits into this second category.
But here we'll see that the situation isn't so simple, as we'll write a function
`limit` capable of _evaluating_ the limit of a certain class of sequences.
For example:

```python
def s1(n):
    return (12 * n**3 - 3) / (8 * n**3 + 16 * n**2)

def s2(n):
    return 1 / (4 * n)

def s3(n):
    return (3 * n**3) / (1 - n)

print(limit(s1))
# => 3 / 2

print(limit(s2))
# => 0

print(limit(s3))
# => -inf
```

## The Basic Idea

Inspired by techniques using [dual numbers](https://en.wikipedia.org/wiki/Dual_number#Differentiation)
to automagically compute derivatives, we'll construct a new number system that
uses pairs of values to track the asymptotic behavior of rational expressions.
The idea is much simpler than it sounds.

We quickly learn to evaluate the limits of sequences like:

$$
n \mapsto \frac{12n^3 - 3}{8n^3 + 16n^2}
$$

by looking at the highest powers of $$n$$ in both the numerator and denominator.
If they're equal (as in this case), the limit is the quotient of the leading
coefficients ($$\frac{12}{8}$$).
If the highest power of $$n$$ in the numerator is greater than in the denominator,
we know the sequence tends towards $$\infty$$ or $$-\infty$$; which one depends on
the signs of the leading coefficients.
Finally, if the highest power in the numerator is less than in the denominator,
the sequences converges to 0.

It's pretty easy to teach a computer to do this kind of thing.
The basic idea is to replace each term with a pair of numbers, the first of
which represents the term's leading coefficient, and the second its power.
Then we just need to make sure that operations on these pairs respect the
intuitive rules described above.

Using the sequence above, the body would be replaced by:

$$
\frac{(12, 3) - (3, 0)}{(8, 3) + (16, 2)}
$$

The $$(12, 3)$$ represents $$12n^3$$, the $$(3, 0)$$ represents $$3$$ (which is
$$3n^0$$), etc.
The rules for arithmetic (which we'll define below) result in the following
evaluation sequence:

$$
\frac{(12, 3) - (3, 0)}{(8, 3) + (16, 2)}
$$

$$
= \frac{(12, 3)}{(8, 3)}
$$

$$
= \left(\frac{12}{8}, 0\right)
$$

Since the final term has a "power" of 0 (it is "asymptotically constant"), the
limit is the value of the coefficient.

## Arithmetic

So what we'll call a _limit number_ is nothing more than a pair whose first
element is a rational number and whose second is an integer, AKA an inhabitant
of the type $$\mathbb{Q}\times\mathbb{Z}$$.
For example, $$(1, 0)$$, $$\left(\frac{3}{4}, 3\right)$$, and
$$\left(-\frac{1}{2}, -1\right)$$ are all limit numbers.

You should picture $$(2, 3)$$ as $$2n^3$$, $$(3, -2)$$ as $$\frac{1}{3n^2}$$,
$$(42, 0)$$ as $$42$$, $$(1, 1)$$ as $$n$$, etc.

Here's how we define arithmetic on limit numbers:

$$
\begin{aligned}
(c_1, p_1) + (c_2, p_2) &= \begin{cases}
(c_1 + c_2, p_1) &\textrm{ if } p_1 = p_2 \\
(c_1, p_1) &\textrm{ if } p_1 \gt p_2 \\
(c_2, p_2) &\textrm{ if } p_1 \lt p_2
\end{cases} \\

(c_1, p_1) \cdot (c_2, p_2) &= (c_1 \cdot c_2, p_1 + p_2) \\

-(c, p) &= (-c, p) \\

\frac{1}{(c, p)} &= \left(\frac{1}{c}, -p\right) \\
\end{aligned}
$$

A sequence whose body is $$2n^2 + 3n^2$$ behaves asymptotically like $$5n^2$$,
which is why $$(2, 2) + (3, 2) = (5, 2)$$.
Likewise, $$2n^3 + 5n^2$$ behaves like $$2n^3$$ (the square term "washes out" in
the limit), so $$(2, 3) + (5, 2) = (2, 3)$$.

Concerning muliplication, $$3n \cdot 4n^2$$ behaves like $$12n^3$$, so
$$(3, 1) \cdot (4, 2) = (12, 3)$$.

Subtraction and division are simply "desugared" using negation and
reciprocation, whose definitions are straightforward.

## Evaluating Limits

How do these limit numbers help us evaluate the limits of (a certain class of)
sequences?
Given a sequence expressed as a function that only involves the operations of
addition, subtraction, multiplication, and division, we evaluate the function at
the limit number $$(1, 1)$$.
As the operations in the body of the sequence are applied to this limit number
(which we should think of as representing some variable $$n$$), information about
its asymptotic behavior is collected.

This is easier to see with an example.
Let's take the same sequence from above:

$$
n \mapsto \frac{12n^3 - 3}{8n^3 + 16n^2}
$$

and apply it to $$(1, 1)$$, working through the evaluation step-by-step:

$$
\left(n \mapsto \frac{12n^3 - 3}{8n^3 + 16n^2}\right)\left((1, 1)\right)
$$

$$
= \frac{12(1, 1)^3 - 3}{8(1, 1)^3 + 16(1, 1)^2}
$$

$$
= \frac{12(1, 3) - 3}{8(1, 3) + 16(1, 2)}
$$

$$
= \frac{(12, 0) \cdot (1, 3) - (3, 0)}{(8, 0) \cdot (1, 3) + (16, 0) \cdot (1, 2)}
$$

(in the previous step, we've used the fact that we can "lift" any rational
number to a limit number by pairing it with a power of 0)

$$
= \frac{(12, 3) - (3, 0)}{(8, 3) + (16, 2)}
$$

$$
= \frac{(12, 3)}{(8, 3)}
$$

$$
= \left(\frac{12}{8}, 0\right)
$$

Finally, we interpret the result as an element of the _extended rational
numbers_, $$\overline{\mathbb{Q}}$$.
These are just the rational numbers, along with special guests $$\infty$$ and
$$-\infty$$.

$$
\begin{aligned}
\mathrm{interpet} &: \mathbb{Q} \times \mathbb{Z} \to \overline{\mathbb{Q}} \\

\mathrm{interpret}\left((c, p)\right) &= \begin{cases}
c &\textrm{ if } p = 0 \\
0 &\textrm{ if } p < 0 \textrm{ or } c = 0 \\
\infty &\textrm{ if } p > 0 \textrm{ and } c > 0 \\
-\infty &\textrm{ if } p > 0 \textrm{ and } c < 0
\end{cases}
\end{aligned}
$$

## Implementing Limit Numbers

This involves little more than transcribing the ideas above into Python.
We'll represent limit numbers as a class `Lim` that stores a rational
coefficient and an integer power.

```python
class Lim:
    def __init__(self, coeff, power):
        self.coeff = coeff
        self.power = power
```

But first, we need a way to represent rational numbers like $$\frac{2}{3}$$ in
Python.

### Quick Detour: Implementing `Q`

We'll do so with a class `Q` whose instances store a numerator and denominator, both integers:

```python
class Q:
    def __init__(self, n, d):
        self.n = n
        self.d = d
```

Actually we'll do something slightly more complicated.
Instead of just storing `n` and `d` as provided, we'll first simplify them by
dividing both by their greatest common divisor.
We'll also ensure that the denominator is positive.

```python
class Q:
    def __init__(self, n, d):
        if d < 0:
            n *= -1
            d *= -1

        g = gcd(n, d)
        self.n = n // g
        self.d = d // g


def gcd(a, b):
    """Compute the greatest common divisor of a and b."""
    while b != 0:
        a, b = b, a % b
    return a
```

We could have instead chosen to only simplify "on-demand" when printing or
accessing the numerator or denominator, or another more complex strategy, like
when the numerator or denominator exceeds some
threshold.
See [this section from SICP](https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.zip/full-text/book/book-Z-H-14.html#%_sec_2.1.1)
for an elaboration of the tradeoffs here.

As a nice quality-of-life improvement, we'll implement `__iter__`, which allows
us to unpack rational numbers just like tuples:

```python
class Q:
    # ...
    def __iter__(self):
        return iter((self.n, self.d))
```

We'll also want to implement `__repr__` and `__str__`:

```python
class Q:
    # ...
    def __repr__(self):
        return f"Q({self.n}, {self.d})"

    def __str__(self):
        n, d = self
        if n == 0:
            return "0"
        elif d == 1:
            return str(n)
        return f"{n} / {d}"
```

At this point we can do things like:

```python
print(Q(6, -8))
# => -3 / 4

print(Q(12, 3))
# => 4
```

It's now time to define arithmetic operations on `Q`.
First, addition.
This involves expressing both terms so that they share the same denominator,
then adding the numerators.
Symbolically:

$$
\begin{aligned}
\frac{a}{b} + \frac{c}{d} &= \frac{ad}{bd} + \frac{cb}{db} \\
  &= \frac{ad + cb}{bd}
\end{aligned}
$$

This is easy to transcribe to Python:

```python
class Q:
    # ...
    def __add__(self, other):
        if isinstance(other, Q):
            a, b = self
            c, d = other
            return Q(a * d + c * b, b * d)
        else:
            return self + Q.lift(other)
```

We handle the case where the righthand side isn't a `Q` by "lifting" it to a
rational number.
This encodes the property that $$2 = \frac{2}{1}$$, for example.

```python
class Q:
    # ...
    def lift(x):
        """Lift an integer to an equivalent rational number."""
        return Q(x, 1)
```

Subtraction is desugared using negation:

```python
class Q:
    # ...
    def __sub__(self, other):
        return self + -other

    def __neg__(self):
        return Q(-self.n, self.d)
```

Multiplication is easy, as every 5th grader knows:

$$
\frac{a}{b} \cdot \frac{c}{d} = \frac{ac}{bd}
$$

or, in Python:

```python
class Q:
    # ...
    def __mul__(self, other):
        if isinstance(other, Q):
            a, b = self
            c, d = other
            return Q(a * c, b * d)
        else:
            return self * Q.lift(other)
```

Division, like subtraction, is desugared using "reciprocation", which just swaps
the numerator and denominator:

```python
class Q:
    # ...
    def __truediv__(self, other):
        if isinstance(other, Q):
            return self * other._recip()
        else:
            return self / Q.lift(other)

    def _recip(self):
        return Q(self.d, self.n)
```

Finally, we can raise rational numbers to an integer power:

```python
class Q:
    # ...
    def __pow__(self, p):
        if not isinstance(p, int):
            return NotImplemented

        if p == 0:
            return Q.lift(1)
        elif p > 0:
            return Q(self.n**p, self.d**p)
        else:
            return self._recip() ** (-p)
```

We'll also want to implement `__radd__`, `__rsub__`, `__rmul__`, and
`__rtruediv__`, but these just do the obvious thing:

```python
class Q:
    # ...
    def __radd__(self, other):
        return Q.lift(other) + self

    # Etc.
```

Finally, we'll need a way to compare rationals, so we need `__eq__` and company.
In standard math notation:

$$
\begin{aligned}
\frac{a}{b} = \frac{c}{d} &\Leftrightarrow ad = bc \\

\frac{a}{b} > \frac{c}{d} &\Leftrightarrow ad > bc
\end{aligned}
$$

which is enough to get us started:

```python
class Q:
    # ...
    def __eq__(self, other):
        if isinstance(other, Q):
            a, b = self
            c, d = other
            return a * d == b * c
        else:
            return self == Q.lift(other)

    def __gt__(self, other):
        if isinstance(other, Q):
            a, b = self
            c, d = other
            return a * d > b * c
        else:
            return self > Q.lift(other)
```

We can implement `__ge__`, `__lt__`, etc. in terms of these:

```python
class Q:
    # ...
    def __ge__(self, other):
        return self == other or self > other

    def __lt__(self, other):
        return not self >= other
```

Whew!
About a hundred lines of code, but the result is pretty fantastic:

```python
def rational_fn(x):
    return (2 * x**2 + 3 * x) / (5 * x - 1)

print(rational_fn(Q(3, 4)))
# => 27 / 22
```

See the [full listing](#) for details.

### Back to Lim

We're now in a position to continue our development of the `Lim` class.
Unsurprisingly, this will mirror our implementation of `Q` in many ways.
We'll first implement some quality-of-life methods:

```python
class Lim:
    # ...
    def __iter__(self):
        return iter((self.coeff, self.power))

    def __repr__(self):
        c, p = self
        return f"Lim({c}, {p})"

    def __str__(self):
        c, p = self
        if p == 0:
            return str(c)
        elif p > 0:
            return f"{c}n^{p}"
        else:
            return f"1 / {c}n^{-p}"
```

And proceed with arithmetic operations.
Remember the rule for addition:

$$
(c_1, p_1) + (c_2, p_2) = \begin{cases}
(c_1 + c_2, p_1) &\textrm{ if } p_1 = p_2 \\
(c_1, p_1) &\textrm{ if } p_1 \gt p_2 \\
(c_2, p_2) &\textrm{ if } p_1 \lt p_2
\end{cases}
$$

This is a cinch to translate to Python:

```python
class Lim:
    # ...
    def __add__(self, other):
        if isinstance(other, Lim):
            c1, p1 = self
            c2, p2 = other

            if p1 == p2:
                return Lim(c1 + c2, p1)
            elif p1 > p2:
                return Lim(c1, p1)
            else:
                return Lim(c2, p2)
        else:
            return self + Lim.lift(other)
```

As in `Q`, we handle the case where the righthand expression isn't a limit
number by "lifting" it to one.
This just involves pairing it with a power of 0:

```python
class Lim:
    # ...
    def lift(x):
        """Lift an integer to a Lim."""
        return Lim(Q.lift(x), 0)
```

As usual, subtraction is desugared using negation:

```python
class Lim:
    # ...
    def __sub__(self, other):
        return self + -other

    def __neg__(self):
        c, p = self
        return Lim(-c, p)
```

Multiplication is straightforward:

```python
class Lim:
    # ...
    def __mul__(self, other):
        if isinstance(other, Lim):
            c1, p1 = self
            c2, p2 = other
            return Lim(c1 * c2, p1 + p2)
        else:
            return self * Lim.lift(other)
```

And division is desugared using "reciprocation":

```python
class Lim:
    # ...
    def __truediv__(self, other):
        if isinstance(other, Lim):
            return self * other._recip()
        else:
            return self / Lim.lift(other)

    def _recip(self):
        c, p = self
        return Lim(1 / c, -p)
```

Finally, raising to an integer power:

```python
class Lim:
    # ...
    def __pow__(self, n):
        if not isinstance(n, int):
            return NotImplemented

        if n == 0:
            return Lim.lift(1)
        elif n > 0:
            return self * self ** (n - 1)
        else:
            return self._recip() ** (-n)
```

As with `Q`, we'll also want to implement `__radd__` and friends in the obvious
fashion:

```python
class Lim:
    # ...
    def __radd__(self, other):
        return Lim.lift(other) + self

    # Etc.
```

Again, see the [full listing](#) for details.

Let's try our example from above:

$$
n \mapsto \frac{12n^3 - 3}{8n^3 + 16n^2}
$$

```python
def seq(n):
    return (12 * n**3 - 3) / (8 * n**3 + 16 * n)

print(seq(Lim(Q.lift(1), 1)))
# => 3 / 2
```

Just like we expected!

## Defining `limit`

At last we arrive at the main event: defining the `limit` function.
As discussed above, the idea is to apply the provided sequence to the limit
number $$(1, 1)$$:

```python
def limit(seq):
    """Compute the limit of the given sequence as a value in the extended
    rational numbers.
    """
    n = Lim(Q.lift(1), 1)
    out = seq(n)
    # ...
```

All that remains is to "interpret" the resulting value (`out`) as an element of
the extended rational numbers ($$\overline{\mathbb{Q}}$$).
For this, we need a new class:

```python
class QBar:
    def fin(value):
        q = QBar()
        q.type = "fin"
        q.value = value
        return q

    def inf(pos):
        q = QBar()
        q.type = "inf"
        q.pos = pos
        return q

    def __repr__(self):
        if self.type == "fin":
            return f"QBar.fin({repr(self.value)})"
        else:
            return f"QBar.inf({self.pos})"

    def __str__(self):
        if self.type == "fin":
            return str(self.value)
        else:
            return f"{'+' if self.pos else '-'}inf"
```

`QBar.fin(...)` constructs finite rational numbers, and `QBar.inf(...)` is used
to create positive or negative infinity.
With `QBar` in hand, we can `interpret` our result:

```python
def interpret(lim):
    """Interpret a limit number as a value in the extended rational numbers."""
    c, p = lim

    if p == 0:
        return QBar.fin(c)
    elif p < 0 or c == 0:
        return QBar.fin(Q.lift(0))
    else:
        return QBar.inf(c > 0)
```

allowing us to complete the definition of `limit`:

```python
def limit(seq):
    n = Lim(Q.lift(1), 1)
    out = seq(n)
    return interpret(out)
```

And that's all there is to it!
This system is now capable of evaluating the limits from the introduction:

```python
def s1(n):
    return (12 * n**3 - 3) / (8 * n**3 + 16 * n**2)

def s2(n):
    return 1 / (4 * n)

def s3(n):
    return (3 * n**3) / (1 - n)

print(limit(s1))
# => 3 / 2

print(limit(s2))
# => 0

print(limit(s3))
# => -inf
```

## What's Next?

One critical shortcoming of `limit` is that it's not able to compute the limit
of any interesting sequences.
For instance, this sequence converges to Euler's number ($$e$$):

$$
n \mapsto \left(1 + \frac{1}{n}\right)^n
$$

Here it is in Python:

```python
def e(n):
    return (1 + 1 / n) ** n
```

And indeed, if we sample its millionth term, it's correct to the first 5 decimal
places:

```python
import math

print(e(1_000_000))
# => 2.7182804690957534

print(math.exp(1))
# => 2.718281828459045
```

However, `limit` can't handle it:

```python
print(limit(e))
# => TypeError: unsupported operand type(s) for ** or pow(): 'Lim' and 'Lim'
```

At the moment, `Lim` only supports raising to integer powers, but here we're
trying to use a _limit number_ as the power.

Could we extend `Lim` to support this?
Probably not, unfortunately.
The most immediate problem raised by allowing this is that sequences no longer
necessarily converge.
For instance:

$$
n \mapsto (-1)^n
$$

just oscillates between -1 and 1.
It has no well-defined asymptotic behavior.

But maybe it's just a matter of extending `limit` to return a special
`"divergent"` value when the sequence diverges.
Perhaps if we know all of the cases in which this causes oscillation (maybe it's
just a matter of checking if the leading coefficient is negative), and then
extend our `Lim` class to include new asymptotic classes (representing $$x^n$$,
$$x^{n^n}$$, $$x^{n^{n^n}}$$, etc.), this would work.

But I doubt it's that simple, because as the Euler sequence shows, this changes
the codomain of `limit` from $$\overline{\mathbb{Q}}$$ to
$$\overline{\mathbb{R}}$$.
Asking for the limit of a sequence that converges to $$e$$ is, in a sense,
begging the question.
That's because we're likely _defining_ $$e$$ as the sequence:

$$
n \mapsto \left(1 + \frac{1}{n}\right)^n
$$

(or rather, the [_equivalence class_](https://en.wikipedia.org/wiki/Construction_of_the_real_numbers#Construction_from_Cauchy_sequences)
that this sequence belongs to).

This, in itself, isn't a problem.
It seems like we need to extend _both_ the power type _and_ the coefficient
type:

- The power type needs to handle $$x^n$$, $$x^{n^n}$$, etc. along with
  polynomials.
- The coefficient type needs to handle _symbolic_ expressions like
  $$\left(1 + \frac{1}{n}\right)$$.
- We probably need a new field that records the actual symbolic expression, so
  that we can "freeze" evaluation under certain circumstances.

The last point is illustrated by the fact that:

$$
n \mapsto \left(1 + \frac{1}{n}\right)^n
$$

would get evaluated to a limit number like $$(1, n)$$, at which point we've lost
information about the sequence, which `interpret` needs to return.
It should probably be evaluated to:

$$
\left(1, 1 + \frac{1}{n}, n\right)
$$

instead.

I can imagine some new rules, like:

$$
x^n = \begin{cases}
(c, n) &\textrm{ if } c \in \mathbb{Q} \\
(x, n) &\textrm{ otherwise}
\end{cases}
$$

Then we need to extend `interpret` to deal with these changes.
Maybe something like this:

```python
def interpret(lim):
    c, p = lim

    if c.type == "sym":
        # The limit is possibly a real number, defined by the sequence itself.
    else:
        if p.type == "int":
            # Current cases.
        else:
            # Powers of "n".
            if c < 0:
                return LimType.divergent()
            elif c < 1:
                return LimType.rational(Q.lift(0))
            else:
                return LimType.inf(True)
```

What about _fractional_ powers of $$n$$, though?
The expression:

$$
n^{\frac{1}{n}}
$$

has no definition in the rational numbers.

Alright, so what if we only allowed _polynomial_ exponents?
A limit number would now look like:

$$
\left(\mathbb{Q}, \mathrm{Expr}, \mathbb{P}[n]\right)
$$

This disallows definitions like:

$$
n \mapsto 2^{n^n}
$$

but perhaps we could handle this as well ("hyperpolynomials"?).

### A Slightly different Tack

What about sequences that compute square roots?
I don't know of any non-recursive sequences that do so, and right now our system
doesn't allow recursion.
This is because there's no way to _compare_ limit numbers, and thus no way to
check for a termination condition.
Comparison would allow us to define Babylonian-style sequences like:

```python
def sqrt2(n):
    guess = Q.lift(1)
    i = 0
    while True:
        if i >= n:
        #    ^^ comparison
            return guess
        guess = Q(1, 2) * (guess + 2 * 1 / guess)
        i += 1
```

(Note that we haven't used `range` here to make the comparison more obvious.)

The sequence `sqrt2` computes the n<sup>th</sup> term in a sequence of rationals
that converges to $$\sqrt{2}$$:

```python
for n in range(5):
    print(f"{n}: {sqrt2(n)}")

# 0: 1
# 1: 3 / 2
# 2: 17 / 12
# 3: 577 / 408
# 4: 665857 / 470832
```

This seems a bit trickier than the problem above.
As in the case with Euler's sequence, we need to "freeze" this sequence and just
return it as the limit.
But I _suspect_ this exposes us to a whole new area of possibly divergent
sequences, since our sequences can now do "real computation".
In order to handle these cases, `limit` would need to effectively know "all of
math".

For instance:

$$
n \mapsto \begin{cases}
1 &\textrm{ if } \mathrm{prime}(n) \textrm{ and } \mathrm{prime}(n + 2) \\
0 &\textrm{ otherwise}
\end{cases}
$$

```python
def twin_primes_seq(n):
    """Returns 1 if n and n+2 are prime, and 0 otherwise."""
    if prime(n) and prime(n + 2):
        return 1
    else:
        return 0

def prime(n):
    # ...
```

This sequence converges to 0 if, at some point, we run out of "twin primes", and
it diverges otherwise.
In order to know the answer, `limit` would need to be able to prove or disprove
the famous twin primes conjecture!

So here's where I'm at with this:

- Can we extend this system to support _some_ real sequences, and _some_ divergence?
- Can we do this in a way that captures a new general class of sequences (i.e.
  doesn't just feel "patchy" because it only handles a few hand-picked special
  cases like Euler's sequence).
- Can we allow computation of roots without allowing general computation?
