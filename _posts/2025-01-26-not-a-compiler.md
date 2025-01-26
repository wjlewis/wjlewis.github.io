---
layout: post
title: 'This is not a Compiler'
tags: PL
---

What's the difference between a compiler and an interpreter?
An interpreter "runs" a program, whereas a compiler transforms a program in one
language into an equivalent program in another language.

The slogan is: _interpreters **reveal** meaning; compilers **preserve** meaning_.

In other words, it doesn't matter which path you take in the following directed
graph, the meaning is the same:

![A directed graph illustrating the relationship between compilers and interpreters](/assets/images/interpret-compile.png)

(That is, the diagram "commutes".)

That's really all you need to know.
And if you find that definition satisfactory, read no further!

## Fuzzy Boundaries

The potential problem here is that we've just _defined_ something.
We've drawn a boundary around certain things and called them "compilers", and
another boundary around other things and called them "interpreters".

And at some point in history we really started asking too much of our
definitions.
We forgot that&mdash;like clouds and seashores&mdash;they have fuzzy boundaries.
And the definition I've given above is no exception.
In this post we'll look at some of the "fuzz" along its fringes.

## The Big Picture

We'll write a program that "compiles" Scheme to JavaScript by simply embedding a
Scheme interpreter (written in JavaScript) alongside the program we asked it to
compile.
Here's what that looks like:

```javascript
/**
 * Transform a Scheme program into an equivalent JavaScript program by cheating.
 * Specifically, just bundle the source code of a Scheme interpreter along with
 * the provided program.
 */
function compile(program) {
  return `
// What follows is the source code for a Scheme interpreter, written in
// JavaScript:

function interpret(program) {
  // ...
}

// Now just call "interpret" on the program we're supposed to compile:

interpret(\`${program}\`);
`;
}
```

To keep this note short and to the point, I've already prepared a small
("pocket-sized") Scheme interpreter.
The source code is available [here](https://gist.githubusercontent.com/wjlewis/55d5f5b92afbf7f422700ea14d559086/raw/a3ed6f633240244d58dd537d615a9e28bf5ad3f9/pocket-scheme.js).
I saved this to a file named _interpret.js_:

To define `compile`, we're going to need to paste this interpreter source code
inside a template string.
So we need to take care to escape all backticks (`` ` ``), dollar signs (`$`) and
escape characters (`\`).
This is easy enough to do manually, but we can also automate it with a little
script.

I saved the following to a file named _quote.js_:

```javascript
process.stdin
  .setEncoding('utf-8')
  // Replace backticks (`), dollar signs ($), and escape characters (\) with an
  // escaped version, e.g. $ -> \$.
  .map(chunk => chunk.replace(/`|\$|\\/g, c => `\\${c}`))
  .pipe(process.stdout);
```

and then produced an escaped version of _interpret.js_ via:

```shell
$ node quote.js < interpret.js > interpret-escaped.txt
```

## Defining `compile`

The moment has arrived.
I created a new file named _compile.js_, and copied the escaped interpreter
source into the body of a function named `compile`.
I also included the critical invocation of the (quoted) `interpret` function on
the source of the program to be "compiled":

```javascript
function compile(source) {
  const interpreterSource = `
function lex(source) {
  const tokens = [];
  let pos = 0;

  function skipWhile(pred) {
...
...
...
`;

  return `
${interpreterSource}

interpret(\`${source}\`);
`;
}
```

Finally, to make our "compiler" a little more ergonomic, let's read input
programs from `stdin` and write the compiled output to `stdout`:

```javascript
const fs = require('fs');

function compile(source) {
  // ...
}

const source = fs.readFileSync(0, 'utf-8');
fs.writeFileSync(1, compile(source));
```

The full listing is available [here](https://gist.githubusercontent.com/wjlewis/8f8df731152c62dacfaf36bd3693cab1/raw/7606b7801125ea4c7884d9b0cc58028f5d2d8959/compile.js).

We can now compile Scheme files, like _basic.scm_:

```scheme
;; basic.scm

(define +
  (lambda (m n)
    (cond
      ((zero? m) n)
      (else (add1 (+ (sub1 m) n))))))

(define *
  (lambda (m n)
    (cond
      ((zero? m) 0)
      (else (+ n (* (sub1 m) n))))))

(define map
  (lambda (fn l)
    (cond
      ((null? l) (quote ()))
      (else (cons (fn (car l))
                  (map fn (cdr l)))))))

(define ^2 (lambda (n) (* n n)))

(print (map ^2 (quote (1 2 3 4 5))))
```

via:

```shell
$ node compile.js < basic.scm > basic.js
```

This produces a JavaScript file _basic.js_ which, when run, results in:

```shell
$ node basic.js
(1 4 9 16 25)
```

## Is this a Compiler?

Yes!
Well, at least according to the definition above, since:

```shell
# Follow the horizontal arrow in the diagram above, compiling my-prog.scm to
# my-prog.js.
$ node compile.js < my-prog.scm > my-prog.js

# Now follow the right branch, interpreting my-prog.js. In this case, `node` is
# `interpret2`.
$ node my-prog.js
```

and

```shell
# Follow the left branch, interpreting my-prog.scm. In this case, `scheme` is
# `interpret1`.
$ scheme my-prog.scm
```

produce the same result.

But is it _really_ a compiler?
I would have expected a compiler to transform the Scheme program:

```scheme
(print (+ 1 2))
```

into something like:

```javascript
console.log(1 + 2);
```

but instead it produces this monstrosity:

```javascript
function lex(source) {
  const tokens = [];
  let pos = 0;

  function skipWhile(pred) {
// ...

// ...
interpret(`(print (+ 1 2))`);
```

## This is not a Translation

We expect a compiler to _know_ something about both its source and target
languages.
But our compiler doesn't really know anything about Scheme.
It's as if I claimed to know both French and English, but whenever you asked me
to translate a bit of French I simply wrote down:

```
The English translation of "<French-phrase>".
```

For example, I'd translate _apporte-moi un croissant_ as:

```
The English translation of "apporte-moi un croissant".
```

Note that this is:

- A sentence in English.
- Whose meaning&mdash;in English&mdash;is the same as the meaning&mdash;in
  French&mdash;of _apporte-moi un croissant_.

But "executing" it requires having someone who speaks French available "at
runtime".

## Conclusion

So is _compile.js_ a compiler, or not?
It doesn't matter!
It's a happy little clam living somewhere in the intertidal zone, resisting our
futile attempts to put in a box.
