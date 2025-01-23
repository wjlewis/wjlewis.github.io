---
layout: post
title: 'Hash Consing'
---

_Hash consing_ is a technique for constructing pairs in which _structural
equality_ and _pointer equality_ coincide.
This saves memory, offers much faster comparisons, and reduces the amount of
work we need to do to "process" a structure with many shared parts.

To illustrate this, consider `cons`, which constructs a pair (a "cons cell")
from two elements by gluing them together in an object:

```javascript
function cons(car, cdr) {
  return { car, cdr };
}
```

Each time we call `cons`, a new object is allocated.
We can verify this by constructing two pairs with identical `car`s and `cdr`s,
and comparing them via `===`:

```javascript
const p1 = cons(2, 1);
const p2 = cons(2, 1);

console.log(p1 === p2);
// => false
```

The pairs `p1` and `p2` look the same, but are backed by two distinct
allocations.
It'd be nice if they used the _same_ allocation instead.

It wasn't immediately clear to me how to do this!
Memoizing `cons` would work, although the only thing I can think to use for a
key is the serialized pair itself, and this is quite wasteful.
It turns out there's a better way.

We'll create a "two layered" cache&mdash;a `Map` whose values are themselves
`Map`s.
The keys of the outer `Map` are the `car`s of pairs; each entry in the `car` map
