+++
date = '2025-06-13T10:23:05+02:00'
draft = true
title = 'Latex'
+++

# KaTex

EasyDocs uses [KaText](https://katex.org/) to render mathematical equations. To integrate KaTeX, wrap your math expression between two dollar signs ($$) for a block-level equation or a single dollar sign ($) for inline math.

!!! warning Warning
Never forget to wrap your math expression between two `$$` or two `$`.
!!!

A list of the supported notations is [here](https://katex.org/docs/support_table.html). You can write your mathematical expressions on the [KaTex demo page](https://katex.org/?data=%7B%22displayMode%22%3Atrue%2C%22leqno%22%3Afalse%2C%22fleqn%22%3Afalse%2C%22throwOnError%22%3Atrue%2C%22errorColor%22%3A%22%23cc0000%22%2C%22strict%22%3A%22warn%22%2C%22output%22%3A%22htmlAndMathml%22%2C%22trust%22%3Afalse%2C%22macros%22%3A%7B%22%5C%5Cf%22%3A%22%231f(%232)%22%7D%2C%22code%22%3A%22E%20%3D%20mc%5E2%22%7D).

# Demo

## Block-level equation
```tex
$$
ax^2 + bx + c = 0
$$
```
$$
ax^2 + bx + c = 0
$$

or

```tex
$$
\begin{equation}
\begin{split}
(a - b)^2 &= (a - b)(a - b) \\
&= a(a - b) - b(a - b)      \\
&= a^2 -ab -ba + b^2        \\
&= a^2 + 2ab + b^2          \nonumber
\end{split}
\end{equation}
$$
```
$$
\begin{equation}
\begin{split}
(a - b)^2 &= (a - b)(a - b) \\
&= a(a - b) - b(a - b)      \\
&= a^2 -ab -ba + b^2        \\
&= a^2 + 2ab + b^2          \nonumber
\end{split}
\end{equation}
$$

## Inline equation
```tex
$E = mc^2$
```
$E = mc^2$