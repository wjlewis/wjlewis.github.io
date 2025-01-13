---
layout: post
title: "LEM Ain't False"
---

Whether or not the _Law of the Excluded Middle_ is true is the subject of much
debate.
But we know for sure that it's not false.
Let's see how to prove this in LEAN.

First, the statement of the result:

```lean
/-- The Law of the Excluded Middle isn't false. -/
theorem em_not_false : ¬¬(p ∨ ¬p) :=
  sorry
```

That is: _it's not the case that the Law of the Excluded Middle is false_.

In Lean (and elsewhere), `¬p` is just an abbreviation for the type `p → False`,
which means that `em_not_false` is a function:

```lean
theorem em_not_false : ¬¬(p ∨ ¬p) :=
  fun (hNotEm : ¬(p ∨ ¬p)) =>
    sorry
```

That is, it's a function that transforms a _hypothesis_ that EM _is_ `False`
into a proof of `False`.
According to the Curry-Howard Isomorphism, `fun (h : p) => ...` can be
interpreted as _Supposing `p` is `True`, `...`_.
So we're supposing that EM isn't `True`, and in this hypothetical context we
need to derive a proof of `False`.

But before we finish the proof of `em_not_false`, we should observe that it's
_obviously_ true.
And by this I mean that if `em` _were_ `False`, our whole theorem-proving
edifice would crumble.
To see why, let's add `em_false` as an axiom:

```lean
axiom em_false (p: Prop) : ¬(p ∨ ¬p)
```

What `em_false` says is:

> For _any_ proposition `p`, given either a proof of `p` or a proof of `¬p`,
> I'll give you a proof of `False`.

Let's try it out with the simplest proposition of all:

```lean
/--  A proof of `False` using `em_false` and a proof of `True`. -/
theorem false_from_true : False :=
  em_false True (Or.inl trivial)
```

And with that the jig is up: if we can prove `False`, we can prove _anything at
all_, a property captured by the elimination principle for `False`:

```lean
#check False.elim
-- {C : Sort u} → False → C
```

Using `false_from_true` and `False.elim` we can prove that 1 is equal to 2:

```lean
theorem one_eq_two : 1 = 2 := False.elim false_from_true
```

That every natural number is equal to 0:

```lean
theorem all_zero : ∀ n : Nat, n = 0 := False.elim false_from_true
```

Along with anything else under the sun.

## Finishing the Proof

So having a proof that `em` is `False` amounts to having a tool of incredible
power.
And that's exactly what `hNotEm` is in our incomplete proof of `em_not_false`.
Unforunately it's not as simple as our proof of `false_from_true`, since we can
only use `hNotEm` with the parameterized `p` proposition.
But it's not too much more work.

The trick is to use `hNotEm` to construct proofs of both `¬p` and `¬¬p`.
Once we have these, we can construct a proof of `False` using `absurd`.
`absurd` implements the _Principle of Explosion_, also known as "ex falso
quodlibet" ("from a contradiction, anything follows"):

```lean
#check absurd
-- {a : Prop} → {b : Sort v} → a → ¬a → b
```

To see if the general arc of the proof works, we can temporarily strong-arm Lean
using `sorry`:

```lean
theorem em_not_false : ¬¬(p ∨ ¬p) :=
  fun (hNotEm : ¬(p ∨ ¬p)) =>
    let hNotP : ¬p := sorry
    let hNotNotP : ¬¬p := sorry
    absurd hNotP hNotNotP
```

And now it's simply a matter of proving `hNotP` and `hNotNotP`.
Writing out the type of `hNotEm` as a function gives a clue to how we might do
this:

```lean
hNotEm : (p ∨ ¬p) → False
```

This says:

> Given either a proof of `p` or a proof of `¬p`, I'll give you a proof of
> `False`.

At this point we seem stuck.
We don't _have_ a proof of `p` or `¬p`.
But the trick is to use `hNotEm` inside another "hypothetical".
Specifically, here's a proof of `¬p` using `hNotEm`:

```lean
hNotP : ¬p := fun (h : p) => hNotEm (Or.inl h)
```

We can prove `hNotNotP` with the same trick:

```lean
hNotNotP : ¬¬p := fun (h : ¬p) => hNotEm (Or.inr h)
```

And that completes the proof:

```lean
theorem em_not_false : ¬¬(p ∨ ¬p) :=
  fun (hNotEm : ¬(p ∨ ¬p)) =>
    let hNotP : ¬p := fun (h : p) => hNotEm (Or.inl h)
    let hNotNotP : ¬¬p := fun (h : ¬p) => hNotEm (Or.inr h)
    absurd hNotP hNotNotP
```

## Notes

In Lean, `em` is actually a _theorem_, not an axiom.
It's proven using the [axiom of choice](https://en.wikipedia.org/wiki/Axiom_of_choice),
a result known as
[Diaconescu's theorem](https://en.wikipedia.org/wiki/Diaconescu%27s_theorem).
The axiom of choice _is_ an axiom in Lean.
