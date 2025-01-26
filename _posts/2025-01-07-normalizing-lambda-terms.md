---
layout: post
title: 'Normalizing Lambda Terms'
tags: Tutorial Haskell Lambda-Calculus
---

In this post we'll look at how to normalize lambda terms in a purely _syntactic_
way (i.e. without appealing to neat but fancy techniques like normalization by
evaluation).

A lambda term is either:

- A bound variable with an integer index indicating how many intervening binders
  one must hurdle in order to reach its binding abstraction.
- An abstraction, which stores its body.
- An application of one term to another.

```haskell
data Term
  = Var Int
  | Abs Term
  | App Term Term
  deriving (Show)
```

Normalizing a term is then a process of repeatedly applying "reductions"
wherever we can.
A reduction is possible wherever _an abstraction is the operator of an
application_ (a so-called "beta redex").
In particular, when an abstraction is applied to something, we replace the
entire application with the result of substituting the operand into the
abstraction's body wherever the bound variable occurs.
In exceedingly pithy formal terms:

```haskell
(\.b) t ==> b[0->t]
```

That is, the term `(\.b) t` is reducible to `b`, where all occurrences of the
bound variable with index `0` (the one bound by this abstraction) in `b`
are replaced with the operand term `t`.

So _reduction_ is just a process of repeated _substitution_.

## Substitution

Lambda terms are just fancy trees, so replacing occurrences of bound variables
in a "host term" with another term requires recursing through the host term,
doing the appropriate thing with each variant:

- If the host term is a bound variable, check its index: if it's equal to the
  index we're substituting for, return the substitution term; otherwise return
  the host term unchanged.
- If the host term is an abstraction, recur on the body.
  The only catch is that we need to increment the substitution index to account
  for the fact that we've crossed over a binder.
- If the host term is an application, simply recur on the operator and operand.

Here's what that looks like:

```haskell
-- | Replace all bound variables having the provided index with the indicated
-- term inside a host term.
--
-- That is, `subst i sub host` is morally equivalent to `host[i->sub]`.
subst :: Int -> Term -> Term -> Term
subst i sub t@(Var j)
  | i == j = sub
  | otherwise = t
subst i sub (Abs body) = Abs $ subst (i + 1) sub body
subst i sub (App rator rand) =
  let rator' = subst i sub rator
      rand' = subst i sub rand
   in App rator' rand'
```

## Reduction

All of the action in the lambda calculus occurs when abstractions are applied, a
situation referred to as a _beta redex_.
Here's a `reduce` function that recursively scours a lambda term, reducing beta
redexes:

```haskell
-- | Reduce beta redexes in the provided term.
reduce :: Term -> Term
reduce t@(Var _) = t
reduce (Abs body) = Abs (reduce body)
reduce (App rator rand) = case reduce rator of
  (Abs body) -> reduce $ subst 0 rand body
  op -> App op $ reduce rand
```

The only interesting case is the final one, in which we replace a beta redex
with the appropriate substitution.
Note that we call `reduce` on the result of the substitution, since it might
have created new redexes to reduce.

Unfortunately it's incorrect, and for a subtle reason.
The problem is that we're stripping off a binder without adjusting the indices
of bound variables within the `body` of the operator abstraction.
For instance, consider this somewhat contrived term:

```haskell
\a.(\b.(b a) a)
```

The inner abstraction (`\b.(b a)`) can be applied to the variable `a`, resulting
in:

```haskell
\a.(a a)
```

However, `reduce` returns a different (and nonsensical) term:

```haskell
bad = reduce $ Abs (App (Abs (App (Var 0) (Var 1))) (Var 0))
-- Abs (App (Var 0) (Var 1))
--                       ^ Should be 0
```

Luckily the fix is straightforward: after substituting, we need to decrement the
indices of some bound variables within the result.
Which bound variables?
Only those that "point" to binders outside of the current term.

So instead of:

```haskell
(\.b) t ==> b[0->t]
```

we'll do:

```haskell
(\.b) t ==> shift b[0->t]
```

We'll implement a `shift` function in a second that does just this, but before
we do so we need to think a little bit harder about our fix.
Naively shifting the result of the substitution will fix the problem we've
identified above, but it also introduces a new bug: it might _incorrectly_
downshift indices of bound variables in the _operand_ term.

What we need to do instead is _preemptively upshift_ indices in the operand
term, perform the substitution, then downshift the indices in the resulting
term:

```haskell
(\.b) t ==> downshift b[0 -> upshift t]
```

A single `shift` function can do the work of both `downshift` and `upshift` so
long as it's passed an integer argument indicating how much to shift by:

```haskell
-- | Shift the indices of bound variables bound by binders outside of the
-- current term by the provided amount.
shift :: Int -> Term -> Term
shift n = shift' 0
  where
    -- bc = "binder count"
    shift' bc t@(Var i)
      | i >= bc = Var (i + n)
      | otherwise = t
    shift' bc (Abs body) = Abs $ shift' (bc + 1) body
    shift' bc (App rator rand) =
      let rator' = shift' bc rator
          rand' = shift' bc rand
       in App rator' rand'
```

With `shift` in hand, we can correct `reduce`:

```haskell
reduce :: Term -> Term
-- ...
reduce (App rator rand) = case reduce rator of
  (Abs body) ->
    let arg = shift 1 rand
        subbed = subst 0 arg body
     in reduce $ shift (-1) subbed
  op -> App op $ reduce rand
```

And the indexing problem is fixed!

```haskell
bad = reduce $ Abs (App (Abs (App (Var 0) (Var 1))) (Var 0))
-- Abs (App (Var 0) (Var 0))
--                       ^ Looks good!
```

There's actually _another_ lingering bug related to incorrect indices that's not
addressed by our changes.
Specifically, `subst` needs to also keep track of how many binders have been
crossed, and shift the substituted expression accordingly:

```haskell
subst :: Int -> Term -> Term -> Term
subst i sub = subst' 0
  where
    subst' bc t@(Var j)
      | i + bc == j = shift bc sub
      | otherwise = t
    subst' bc (Abs body) = Abs $ subst' (bc + 1) body
    subst' bc (App rator rand) =
      let rator' = subst' bc rator
          rand' = subst' bc rand
       in App rator' rand'
```

## A Stronger Encoding

As it stands, `reduce` makes a fairly weak claim:

```haskell
reduce :: Term -> Term
```

namely, that it transforms a term into another term.
This admits, among other things, the following incorrect definition:

```haskell
reduce = id
```

We can do better.

Specifically, reducing a term produces another term in which _no beta redexes
occur_, and this is the kind of thing we can express in a datatype:

```haskell
data ReducedTerm
  = ReducedAbs ReducedTerm
  | Stuck StuckTerm
  deriving (Show)

data StuckTerm
  = StuckVar Int
  | StuckApp StuckTerm ReducedTerm
  deriving (Show)
```

The key observation is that it's not possible to concoct a `ReducedTerm`
containing a beta redex, since any term in the operator position of an
application is "stuck" (either a variable, or an application that is itself
stuck).
Of course, every `ReducedTerm` is equivalent to some "regular" `Term`:

```haskell
-- | Convert a reduced term to a term (the reduced terms are "embedded" in the
-- set of terms).
toTerm :: ReducedTerm -> Term
toTerm (ReducedAbs body) = Abs $ toTerm body
toTerm (Stuck s) = unStuck s
  where
    unStuck (StuckVar i) = Var i
    unStuck (StuckApp rator rand) =
      let rator' = unStuck rator
          rand' = toTerm rand
       in App rator' rand'
```

With `ReducedTerm` in hand, we can sharpen the type of `reduce`:

```haskell
reduce :: Term -> ReducedTerm
reduce (Var i) = Stuck $ StuckVar i
reduce (Abs body) = ReducedAbs $ reduce body
reduce (App rator rand) = case reduce rator of
  (ReducedAbs body) ->
    let arg = shift 1 rand
        subbed = subst 0 arg (toTerm body)
     in reduce $ shift (-1) subbed
  (Stuck op) -> Stuck $ StuckApp op $ reduce rand
```

## A Few Examples

We end this post with a few classics examples.
First, the successor of the successor of the successor of zero is three:

```haskell
suc = Abs $ Abs $ Abs $ App (Var 1) (App (App (Var 2) (Var 1)) (Var 0))

zero = Abs $ Abs (Var 0)

three = App suc $ App suc $ App suc zero

toTerm $ reduce three
-- Abs (Abs (App (Var 1) (App (Var 1) (App (Var 1) (Var 0)))))
```

_De Bruijn indices are really a pain to work with by hand..._

We can also construct pairs and project their components:

```haskell
cons = Abs $ Abs $ Abs $ App (App (Var 0) (Var 2)) (Var 1)

fst' = Abs $ App (Var 0) (Abs $ Abs (Var 1))

snd' = Abs $ App (Var 0) (Abs $ Abs (Var 0))

pair = App (App cons zero) three

toTerm $ reduce $ App fst' pair
-- Abs (Abs (Var 0))

toTerm $ reduce $ App snd' pair
-- Abs (Abs (App (Var 1) (App (Var 1) (App (Var 1) (Var 0)))))
```

(I've applied `toTerm` to the output of `reduce` to make the results a little
easier to read.)

Finally, we should check that the infamous _Omega combinator_ can't be
normalized:

```haskell
omega = Abs (App (Var 0) (Var 0))
reduce $ App omega omega
-- waiting...
-- ...
-- ...
-- Ctrl^C
```

Well that's enough fun for now.
In future posts we'll see how to extend this system along a number of different
dimensions.
