---
layout: default
title: 'On Foot'
permalink: /on-foot
---

# On Foot

How many miles have I travelled on foot?

<table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Distance</th>
      <th>Notes</th>
    </tr>
  </thead>

  <tbody>
  {% for row in site.data.onfoot %}
    <tr>
      <td>{{ row.date }}</td>
      <td class="numeric">{{ row.distance }}</td>
      <td>{{ row.notes }}</td>
    </tr>
  {% endfor %}
  </tbody>
</table>
