+++
title = "Développements limités"
description = "Antisèche  des développements limités, avec des éléments de preuve."
slug = "developpements-limites"
categories = ["Antisèche"]
tags = ["Mathématiques"]
date = 2025-06-17
+++

Les formulaire des développements limités usuels, avec des éléments de preuve en annexe.


|Fonction|Développement limité|
|--------|--------------------|
| $$e^{x}$$ | $$ 1 + x + \frac{x^2}{2} + \frac{x^3}{3!} + ... + \frac{x^n}{n!} + o(x^n) $$ |
| $$(1+x)^\alpha$$ | $$1 + ax + \frac{a(a-1)}{2}x^2 + ... + \frac{a(...)(a-n+1)}{n!} x^n + o(x^n)$$ |
| $$\frac{1}{1+x}$$ | $$ 1-x+x^2-x^3+x^4+...+(-1)^n x^n + o(x^n) $$ |
| $$\frac{1}{1-x}$$ | $$ 1+x+x^2+x^3+x^4+...+x^n + o(x^n) $$ |
| $$\cos(x)$$ | $$ 1 - \frac{x^2}{2} + \frac{x^4}{4!} + ... + \frac{(-1)^n}{(2n)!} x^{2n} + o(x^{2n}) $$ |
| $$\sin(x)$$ | $$ x - \frac{x^3}{3!} + \frac{x^5}{5!} + ... + \frac{(-1)^n}{(2n+1)!}x^{2n+1} + o(x^{2n+1}) $$ |
| $$ \cosh(x) $$ | $$ 1 + \frac{x^2}{2} + \frac{x^4}{4!} + ... + \frac{x^{2n}}{(2n)!} + o(x^{2n}) $$ |
| $$\sinh(x)$$ | $$ x + \frac{x^3}{3!} + \frac{x^5}{5!} + ... + \frac{x^{2n+1}}{(2n+1)!} + o(x^{2n+1}) $$ |
| $$ \arctan(x) $$ | $$ x - \frac{x^3}{3} + \frac{x^5}{5} + ... + \frac{(-1)^n x^{2n+1}}{2n+1} + o(x^{2n+1}) $$ |
| $$ \ln(1+x) $$ | $$ x - \frac{x^2}{2} + \frac{x^3}{3} + ... + \frac{(-1)^{n+1}x^n}{n} + o(x^n) $$ |
| $$ \ln(1-x) $$ | $$ - x - \frac{x^2}{2} - \frac{x^3}{3} - .... - \frac{x^n}{n} + o(x^n) $$ |
| $$ \tan(x) $$ | $$ x + \frac{x^3}{3} + \frac{2}{15} x^5 + o(x^5) $$ |

# Annexe

Une bonne partie de ces formules se trouve directement à partir de la formule de Taylor-Young

> [!IMPORTANT] Théorème
> Si $f$ est $n$ fois dérivable sur $]a,b[$, alors $f$ admet un développement limité d'ordre $n$ en $0$ et celui-ci est donné par $$ f(x) = \sum_{k=0}^n \frac{f^{(k)}(0)}{k!}x^k + o_{x \rightarrow 0}(x^n) $$

> [!TASK] À venir...