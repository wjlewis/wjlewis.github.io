---
layout: post
title: 'Normalizing Lambda Terms'
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

So _normalization_ is just repeated _reduction_, which in turns involves
_substitution_.

## Substitution

Let's look at substitution first.
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
reduce (App (Abs body) rand) = subst 0 rand body
reduce t@(Var _) = t
reduce (Abs body) = Abs (reduce body)
reduce (App rator rand) = App (reduce rator) (reduce rand)
```

The only interesting case is the very first one, in which we replace a beta
redex with the appropriate substitution.

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
reduce (App (Abs body) rand) =
  let arg = shift 1 rand
      subbed = subst 0 arg body
   in shift (-1) subbed
-- ...
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
crossed, and shift the substitution expression accordingly:

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

## Normalization

_Normalizing_ a lambda term involves reducing it as much as possible, that is,
until it doesn't contain any beta redexes.
It would seem like the easiest way to do this is to repeatedly call `reduce`,
checking after each iteration if the resulting term is different from the one
provided to it:

```haskell
norm :: Term -> Term
norm t =
  let t' = reduce t
   in if t' == t
        then t
        else norm t'
```

The problem is that some terms reduce to _themselves_, and are still in need of
reduction:

```haskell
(\x.(x x)) \x.(x x)
==> (\x.(x x)) \x.(x x)
==> ...
```

So we need to think a bit harder.
Let's modify `reduce` to return _two_ pieces of information:

- The (possibly) reduced term.
- A boolean flag indicating if no further reductions are possible.

Here's `reduce`, modified in this way:

```haskell
reduce :: Term -> (Term, Bool)
reduce (App (Abs body) rand) =
  let arg = shift 1 rand
      subbed = subst 0 arg body
   in (shift (-1) subbed, False)
reduce t@(Var _) = (t, True)
reduce (Abs body) =
  let (body', done) = reduce body
   in (Abs body', done)
reduce (App rator rand) =
  let (rator', done1) = reduce rator
      (rand', done2) = reduce rand
   in (App rator' rand', done1 && done2)
```

Notice how we flag the result of reducing a beta redex as "not done", since it
may have introduced new redexes that we didn't encounter as we recursed through
the original term.
Additionally, we only flag an application as "done" if we weren't able to make
any progress on either the operator or the operand.

### Decluttering

This works, but there's a lot of annoying "piping" code for managing the flags.
We can clarify `reduce` by making two changes to the return type:

- Swapping the positions of the term and the flag so we can make better use of
  the `Functor` and `Applicative` instances for `(,)`.
- Replacing the `Bool` flag with a `newtype`d `Bool` that has a `Monoid`
  instance.

The second is necessary because `(a,)` only has an `Applicative` instance if `a`
has a `Monoid` instance, and `Bool` doesn't have one.

Here's what the `newtype` looks like:

```haskell
newtype IsDone = IsDone Bool
  deriving (Show)

instance Semigroup IsDone where
  IsDone l <> IsDone r = IsDone (l && r)

instance Monoid IsDone where
  mempty = IsDone True
```

This alone is nothing spectacular, but the upshot is that can now write `reduce`
like so:

```haskell
reduce :: Term -> (IsDone, Term)
reduce (App (Abs body) rand) =
  let arg = shift 1 rand
      subbed = subst 0 arg body
   in keepGoing $ shift (-1) subbed
reduce t@(Var _) = pure t
reduce (Abs body) = Abs <$> reduce body
reduce (App rator rand) = App <$> reduce rator <*> reduce rand

keepGoing :: Term -> (IsDone, Term)
keepGoing t = (IsDone False, t)
```

## Normalization, Finally

With `reduce` fixed, `norm` writes itself:

```haskell
-- | Attempt to normalize a lambda term by repeatedly reducing beta redexes
-- wherever they occur.
norm :: Term -> Term
norm t =
  let (IsDone d, t') = reduce t
   in if d then t' else norm t'
```

## A Few Examples

We end this post with a few classics examples.
First: the successor of the successor of the successor of zero is three:

```haskell
suc = Abs $ Abs $ Abs $ App (Var 1) (App (App (Var 2) (Var 1)) (Var 0))

zero = Abs $ Abs (Var 0)

three = App suc $ App suc $ App suc zero

norm three
-- Abs (Abs (App (Var 1) (App (Var 1) (App (Var 1) (Var 0)))))
```

De Bruijn indices really are a pain to work with by hand...

We can also construct pairs and project their components:

```haskell
cons = Abs $ Abs $ Abs $ App (App (Var 0) (Var 2)) (Var 1)

fst' = Abs $ App (Var 0) (Abs $ Abs (Var 1))

snd' = Abs $ App (Var 0) (Abs $ Abs (Var 0))

pair = App (App cons zero) three

norm $ App fst' pair
-- Abs (Abs (Var 0))

norm $ App snd' pair
-- Abs (Abs (App (Var 1) (App (Var 1) (App (Var 1) (Var 0)))))
```

Well that's enough fun for now.
In future posts we'll see how to extend this system along a number of different
dimensions.
