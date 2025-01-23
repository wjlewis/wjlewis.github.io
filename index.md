---
layout: default
title: 'Home'
---

# Welcome!

This site contains a collection of blog posts and essays, most of which concern
some topic in math or computing.

<ul class="posts">
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      {% for tag in post.tags %}
        <span class="tag">{{tag}}</span>
      {% endfor %}
    </li>
  {% endfor %}
</ul>

<a href="/quotes">Quotes</a>
