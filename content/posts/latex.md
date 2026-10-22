+++
title = "Symboles LaTeX"
description = "Antisèche des symboles à l'usage des mathématiques en LaTeX"
slug = "latex"
categories = ["Antisèche"]
tags = ["Mathématiques", "Informatique"]
date = 2025-08-20
+++

Une bonne partie des éléments de cette antisèche sont tirés de [ce wiki](https://oeis.org/wiki/List_of_LaTeX_mathematical_symbols), dont j'ai tiré les symboles que j'utilise le plus.

Ils sont triés par catégorie, avec à chaque fois un nom précisant le symbole, avec parfois entre parenthèse une explication sur le nom du symbole.

# Logique

**Implication**
$$ A \implies B $$
```latex
A \implies B
```
**Équivalence** (**if** and only i**f**)

$$ A \iff B $$
```latex
A \iff B
```

**Existence**
$$ \exists x $$
```latex
\exists x
```

# Ensembles

**Caligraphie des ensemble particuliers**  (**math** **b**lackboard **b**old)
$$ \mathbb{ABCDEFGHIJKLMNOPQRSTUVWXYZ} $$
```latex
\mathbb{ABCDEFGHIJKLMNOPQRSTUVWXYZ}
```

$$ \mathbb{N} \subset \mathbb{Z} \subset \mathbb{D} \subset \mathbb{Q} \subset \mathbb{R} \subset \mathbb{C} $$
```latex
\mathbb{N} \subset \mathbb{Z} \subset \mathbb{D} \subset \mathbb{Q} \subset \mathbb{R} \subset \mathbb{C}
```

**Appartenance**
$$ x \in A $$
```latex
x \in A
```

**Inclusion** (sous-ensemble (égal) : **subset** (**eq**ual))
$$ A \subset B $$
```latex
A \subset B
```

$$ A \subseteq B $$
```latex
A \subseteq B
```

**Union**
$$ A \cup B $$
```latex
A \cup B
```

$$ \bigcup_{k=1}^{n} U_k $$
```latex
\bigcup_{k=1}^{n} U_k
```

**Intersection**
$$ A \cap B $$
```latex
A \cap B
```

$$ \bigcap_{k=1}^{n} U_k $$
```latex
\bigcap_{k=1}^{n} U_k
```

**Privation**
$$ A \setminus B $$


**Ensemble vide**
$$ \emptyset \varnothing $$
```latex
\emptyset \varnothing
```

**Accolades et barre verticale**
$$ \\{ x \mid x \in A \\} $$
```latex
\{ x \mid x \in A \}
```

# Analyse

**Fonction**
$$ f = x \mapsto x^2 $$
```latex
f = x \mapsto x^2
```

# Géométrie

# Arithmétique

**Congruence**
$$ a \equiv b \pmod{c} $$
```latex
a \equiv b \pmod{c}
```
Ou
$$ a \cong b \pmod{c} $$
```latex
a \cong b \pmod{c}
```

# Probabilité

**Loi de Bernoulli**
$$ X \hookrightarrow \cal{B}(p) $$
```latex
X \hookrightarrow \cal{B}(p)
```

# Divers