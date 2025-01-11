---
layout: post
title: 'What We Need Out of a Parser'
---

```haskell
parse : Tokens -> AST
```

From simple to more advanced:

I'd like to report errors.
I'd like to continue parsing after the first error, to report _all_ errors.
I'd like to be able to "talk" with my language tools ("what's the type of the
thing on line 5 at column 14?").

I want all of these things _and_ I still want to be able to interact with the
resulting AST in a sensible manner.
For instance, I want to be able to say:

```javascript
// Given a _valid_ expr:
function val(expr) {
  if (expr.type === 'NUM') {
    return Number(expr.value);
  } else {
    const l = val(expr.lhs);
    const r = val(expr.rhs);
    switch (expr.op) {
      case 'ADD':
        return l + r;
      case 'MUL':
        return l * r;
      case 'SUB':
        return l - r;
    }
  }
}
```

```javascript
// VSCode bug?
const lhs = foo;
const rhs = baz;
```

Why doesn't the usual `Tokens -> AST` approach fit here?

In the process we can make parsing _simpler_.

```javascript
const foo = x => x;
```

```
[const [foo] = [[x] => [x]];]
^      ^       ^^      ^
def    ident   |ident   ident
               function
```
