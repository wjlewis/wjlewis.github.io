---
layout: post
title: '2D Convolutions with Numpy'
tags: Notes Python
---

![Michelangelo's David, Convolved](/assets/images/david-conv.jpeg)

I've only recently glimpsed the full power of `numpy`, and as an exercise I
decided to play around with image convolution.
This was trickier than I expected, but I learned a lot and ended up being able
to express convolution very naturally.
In particular, instead of a bunch of nested loops, like:

```python
for row in range(height):
    for col in range(width):
        for kx in (-1, 0, 1):
            for ky in (-1, 0, 1):
                # Are all of my indexes even correct?
                # What about the boundary?
```

We end up with something more like:

```python
w = view_windowed(img_data)
result = np.sum(w * kernel, axis=(2, 3))
```

That is, we think of a convolution as a simple process of:

1. Constructing a "windowed" view of our data.
   The window is the shape of our kernel, and slides over our data.
2. _Applying_ the kernel to each window: think of this as laying the kernel on
   top of each window in turn, multiplying all of the elements from the kernel
   and window that are on top of each other, and then adding these values
   together.

In what follows, we'll see how `view_windowed` is defined.

## Strides

Part of what makes `numpy` so interesting (and so performant) is that many
manipulations that we'd like to perform on arrays can be done by simply
"viewing" the underlying data differently.
For example, the following arrays can be constructed as different views of the
_same_ underlying data:

```python
[0 1 2 3 4 5]

[[0 1 2]
 [3 4 5]]

[[0 1]
 [2 3]
 [4 5]]
```

They're just:

```python
a1 = np.arange(6)
a2 = a1.reshape((2, 3))
a3 = a1.reshape((3, 2))
```

"Reshaping" an array constructs a new _view_ of an existing array, but with the
`shape` attribute modified.
What's perhaps more surprising is that the following arrays can _also_ be
construed as simply different views of the same underlying data:

```python
[0 1 2 3]

[[0 0 0]
 [1 1 1]
 [2 2 2]
 [3 3 3]]

[[0 1]
 [1 2]
 [2 3]]
```

Constructing these involves viewing the original array with both a different
_shape_ and different _strides_.

So an array's `shape` attribute tells us how many elements are in each of its
axes.
The `strides` attribute tells us how far we need to travel in memory to get to
the next element in each dimension.

This is easy to see with a few examples:

```python
a = np.ones(4, dtype=np.byte)
print(a)
# => [1 1 1 1]
print(a.strides)
# => (1,)
```

So `a`'s `strides` is `(1,)` because in order to get to the next element in its
zeroth (and only) dimension, we need to move a single byte.
Changing the item type changes the `strides` accordingly:

```python
np.ones(4, dtype=np.uint16).strides
# => (2,)
np.ones(4, dtype=np.int64).strides
# => (8,)
np.ones(4, dtype=np.float32).strides
# => (4,)
# Etc.
```

So our first observation is that, for a 1-dimensional array:

```python
a.strides == (a.itemsize,)
```

What about a 2-dimensional array?

```python
a = np.arange(6, dtype=np.byte).reshape((2, 3))
print(a)
# => [[0 1 2]
#     [3 4 5]]
print(a.strides)
# => (3, 1)
```

`a` is an array containing 2 elements, each of which is itself an array
containing 3 elements; and each of _those_ elements is a single byte.
That `a.strides` is `(3, 1)` tells us:

- To get to the next element in the "outer" array, you need to move 3 bytes
  (since each element is an array containing 3 items, each of which is a byte).
- To get to the next element inside each "inner" array, you need to move a
  single byte.

So an array's `strides` is a tuple with an element for each dimension in the
array.
For any "normal" array `a`, `a.strides[0]` is equal to the size of each element
in `a`:

```python
a.strides[0] = a[0].size
```

And this holds recursively for multidimensional arrays.

But this doesn't _need_ to be the case.
For example, here's a simple 1-dimensional array containing 3 elements:

```python
a = np.array([0, 1, 2], dtype=np.byte)
# => [0 1 2]
```

We can create the following view of this array:

```python
[[0 0]
 [1 1]
 [2 2]]
```

By `reshaping` the array to have the shape `(3, 2)` and _also_ changing its
strides to `(1, 0)`.

Why `(1, 0)`?
The view we're constructing is an array containing 3 elements, each of which is
an array containing 2 elements; and each element in each inner array is a single
byte.
The first element&mdash;`1`&mdash;tells us that to get to the next _inner_
array, we need to advance a byte in memory.
This is correct because the first inner array begins with the `0` from the
original array, the next begins with the `1`, and the last with `2`.
The second element&mdash;`0`&mdash;tells us that to get to the next element in
each inner array, _we shouldn't move at all_.
This has the effect of simply "looping" over that element as many times as the
`shape` dictates, in this case 2.

In order to construct this view in `numpy`, we'll import the `as_strided`
function from `lib.stride_tricks`:

```python
from numpy.lib.stride_tricks import as_strided
```

`as_strided` expects an array, a shape, and some strides, and constructs the
specified view.
For the example above:

```python
as_strided(a, shape=(3, 2), strides=(1, 0))
# => [[0 0]
#     [1 1]
#     [2 2]]
```

One footgun involving strides is that they depend on the size of an array's
elements.
In order to produce the same view of an otherwise equivalent array of `int64`s,
we'd need to update the strides to be `(8, 0)`:

```python
b = np.array([0, 1, 2], dtype=np.int64)

as_strided(b, shape=(3, 2), strides=(1, 0)) # !WRONG!
# => [[0 0]
#     [<garbage> <garbage>]
#     [<garbage> <garbage>]]

as_strided(b, shape=(3, 2), strides=(8, 0))
# => [[0 0]
#     [1 1]
#     [2 2]]
```

A more "portable" invocation could use the array's `itemsize` instead:

```python
as_strided(a, shape=(3, 2), strides=(a.itemsize, 0))
# => [[0 0]
#     [1 1]
#     [2 2]]

as_strided(b, shape=(3, 2), strides=(a.itemsize, 0))
# => [[0 0]
#     [1 1]
#     [2 2]]
```

In general, we should try and use techniques like this to avoid directly
specifying strides other than 0.

## A 1D Window

Now that we now something about how `shape` and `strides` interact, let's
construct a "windowed" view of a 1D array.
For instance, given the array:

```python
a = np.arange(10)
# => [0 1 2 3 4 5 6 7 8 9]
```

we'd like to produce:

```python
[[0 1 2]
 [1 2 3]
 [2 3 4]
 [3 4 5]
 [4 5 6]
 [5 6 7]
 [6 7 8]
 [7 8 9]]
```

We know what the `shape` of the result is: it's just `(a.size - 2, 3)`.
What about the `strides`?
The distance between subsequent subarrays is simply the distance between
elements in the original view: `a.itemsize`.
And the distance between elements _within_ each subarray is _also_ the distance
between elements in the original view.
So `strides` is just `(a.itemsize, a.itemsize)`:

```python
as_strided(a, shape=(a.size - 2, 3), strides=(a.itemsize, a.itemsize))
# => [[0 1 2]
#     [1 2 3]
#     [2 3 4]
#     [3 4 5]
#     [4 5 6]
#     [5 6 7]
#     [6 7 8]
#     [7 8 9]]
```

We can distance ourselves even further from `stride`-related footguns by
realizing that `(a.itemsize, a.itemsize)` is just equal to `a.strides * 2`
(which just concatenates `a.strides` with itself).

## A 2D Window

Let's apply what we just learned to a 2-dimensional array, like:

```python
a = np.arange(20).reshape((5, 4))
# => [[ 0  1  2  3  4]
#     [ 5  6  7  8  9]
#     [10 11 12 13 14]
#     [15 16 17 18 19]]
```

We want to produce a view that scans a 3x3 "window" over this array, analogous
to what we did in a single dimension above.
The view should look like this:

```python
[[[[ 0  1  2]  [[ 1  2  3]  [[ 2  3  4]
   [ 5  6  7]   [ 6  7  8]   [ 7  8  9]
   [10 11 12]]  [11 12 13]]  [12 13 14]]]

 [[[ 5  6  7]  [[ 6  7  8]  [[ 7  8  9]
   [10 11 12]   [11 12 13]   [12 13 14]
   [15 16 17]]  [16 17 18]]  [17 18 19]]]]
```

Just as we did before, let's think about the `shape` and `strides` of the
windowed view.
The desired view has 4 dimensions, so its shape resembles `(?, ?, ?, ?)`.
And we know that the last 2 dimensions are each 3, so the shape is `(?, ?, 3, 3)`.
Finally, if we squint a little and collapse each of the 3x3 sub-subarrays, it's
clear that we're looking at a 2D array whose height is 2 and whose width is 3.
That is, it's height (the first dimension) is 2 less than the height of the
original view, and it's width (the second dimension) is 2 less than the original
width.
So the windowed view's `shape` is `(h - 2, w - 2, 3, 3)`.

Whew!
Thankfully, the `strides` are very easy, as before.
It helps to work a few examples out on paper, but it turns out that the
`strides` of the windowed view are just `a.strides * a.strides`, as in the 1D
case.
One way to convince yourself of this is that each little 3x3 subarray is just a
"chunk" of the original array, so the distances between its elements in the data
buffer ought to be the same as those distances in the original view.

Putting these two pieces together:

```python
a = np.arange(20).reshape((4, 5))
h, w = a.shape
as_strided(a, shape=(h - 2, w - 2, 3, 3), strides=a.strides * 2)

# => [[[[ 0  1  2]
#       [ 5  6  7]
#       [10 11 12]]
#
#      [[ 1  2  3]
#       [ 6  7  8]
#
#      ...
#
#       [12 13 14]
#       [17 18 19]]]]
```

Let's define a function `view_windowed` that does just what we did above:

```python
def view_windowed(x):
    """Construct a 3x3 "windowed" view of x."""
    h, w = x.shape
    return as_strided(x, shape=(h - 2, w - 2, 3, 3), strides=x.strides * 2)
```

## Convolutions, Finally

Let's take a 3x3 "kernel", like:

```python
k = np.array([[0, -1, 0], [-1, 4, -1], [0, -1, 0]])
# => [[ 0 -1  0]
#     [-1  4 -1]
#     [ 0 -1  0]]
```

And multiply it by our windowed view of the example array `a` above.
Since `k.shape` is `(3, 3)` and `view_windowed(a).shape` is `(2, 3, 3, 3)`, the
produce `view_windowed(a) * k` makes sense (they're
["broadcastable"](https://numpy.org/doc/stable/user/basics.broadcasting.html#broadcastable-arrays)):

```python
view_windowed(a) * k

# => [[[[  0  -1   0]  [[  0  -2   0]  [[  0  -3   0]
#       [ -5  24  -7]   [ -6  28  -8]   [ -7  32  -9]
#       [  0 -11   0]]  [  0 -12   0]]  [  0 -13   0]]]
#
#     [[[  0  -6   0]  [[  0  -7   0]  [[  0  -8   0]
#       [-10  44 -12]   [-11  48 -13]   [-12  52 -14]
#       [  0 -16   0]]  [  0 -17   0]]  [  0 -18   0]]]]
```

This is almost there!
We don't want all those little 3x3 subarrays, we want the _sums_ of their
elements.
This is a job for `np.sum`, where the sum occurs over the final two _axes_, that
is, the elements of the 3x3 arrays:

```python
np.sum(view_windowed(a) * k, axis=(2, 3))
# => [[0 0 0]
#     [0 0 0]]
```

Alright, not the most interesting choice of kernel, but that's at least what we
expected.

Finally, let's put it all together to define `conv3x3`:

```python
def conv3x3(x, k):
    """Convolve the 2D array x with the 3x3 kernel k."""
    w = view_windowed(x)
    return np.sum(w * k, axis=(2, 3))
```

## Summary

We arrived at a really straightforward definition of convolution that frees us
from having to juggle indexes.
Did we lose anything in the process?
For example, we might worry that the nested `for` loop approach is more
performant.

I'm not entirely sure, actually.
I _suspect_ we're creating two intermediate arrays: one for the produce `w * k`
and another for the final `sum`.
Instead of doing this in two steps, we could use `np.tensordot` to (possibly) do
it all in one shot:

```python
def conv3x3(x, k):
    w = view_windowed(x)
    return np.tensordot(w, k, axes=2)
```

In theory, this would result in only a single new buffer being allocated, but
that depends on how `tensordot` is implemented.
