+++
#  On en réalisera une implémentation en C avant de prouver sa correction.
title = "L'algorithme de Boyer-Moore"
description = "L'algorithme de Boyer-Moore permet de rechercher un motif au sein d'un texte très efficacement, et fait figure de référence parmi des algorithmes de recherche de texte."
date = 2025-06-14
modified = 2025-06-15
categories = ["Algorithmie"]
tags = ["Informatique", "Traitement de texte", "C"]
+++

# Introduction

Cet algorithme a été développé par Robert Boyer et J Moore (oui, J est bien son prénom en entier  :sweat_smile:) en 1977.

Pour chercher un motif (une chaîne de caractères) dans un texte, la solution naïve est de vérifier caractère par caractère si le motif  apparaît dans le texte en commençant au début puis en parcourant le texte en entier, de manière similaire à l'approche suivante.

```c
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

int main()
{
    char* texte = "Bonjour le monde !";
    char* motif = "monde";
    
    int texte_len = strlen(texte);
    int motif_len = strlen(motif);
    
    for (int i = 0; i < texte_len - motif_len + 1; i++) {
        bool trouve = true;
        
        for (int j = 0; j < motif_len; j++) {
            if (texte[i + j] != motif[j]) {
                trouve = false;
                break;
            }
        }
        
        if (trouve) {
            printf("Indice : %d\n", i);
            return 0;
        }
    }

    printf("Aucun résultat.");
    return 0;
}
```

Au contraire, cet algorithme prétraite le motif en créant une table de décalages, afin de parcourir le texte plus rapidement. Sa particularité est que plus le motif est grand, plus l'algorithme est rapide, et il est de manière générale "sous-linéaire", c'est-à-dire qu'il compare moins de caractères qu'il y en a dans le texte.

# Fonctionnement

Cet algorithme fonctionne en deux parties, la construction de la table de décalage dans un premier temps, puis la recherche en elle-même.

On utilisera comme exemple la recherche du mot _abracadabra_ dans le mot _abrabracadabradabra_.

### La table de décalage

La table de décalage consiste à connaître, pour chaque caractère `c` et chaque indice `i` du motif, la position du premier caractère `c` à gauche de la position `i` dans le motif (en partant de la droite, autrement dit du caractère à la position `i`).

Par exemple, en prenant `c = "a"` et `i = 9` (avec les caractères du motif indexés à zéro, le 9-ème caractère correspond au dernier `r`), on remarque que le premier `a` par la droite est deux caractères avant, soit à la position `7`.

De même, pour `i =  10`, le dernier `a` avant est toujours à la 7-ème position, car il doit être **strictement avant**, donc le dernier `a` (le caractère à la position `i`) ne compte pas.

On obtient donc à la main la table de décalage suivante (les cases vides correspondent aux cases pour lesquelles le  caractère n'apparaît pas avant).

|Caractère|0|1|2|3|4|5|6|7|8|9|10|
|---------|-|-|-|-|-|-|-|-|-|-|--|
|a||0|0|0|3|3|5|5|7|7|7|
|b|||1|1|1|1|1|1|1|8|8|
|r||||2|2|2|2|2|2|2|9|
|c||||||4|4|4|4|4|4|
|d||||||||6|6|6|6|

Une fois cette table construite, on peut passer à la  recherche, et on comprend alors son intérêt..

### La recherche
Comme dans l'algorithme naïf, on va partir de l'indice `i = 0` dans le texte et superposer les chaînes de caractères. Sauf que l'on va ensuite commencer à comparer les caractères à partir de la fin du motif !

![Première comparaison](/images/boyer-moore/image.png)

Les deux caractères sont identiques, donc on vérifie les deux suivants : ils sont différents.

![Seconde comparaison](/images/boyer-moore/image1.png)

Et c'est à cet instant que l'astuce arrive. En effet, si on décalait le motif d'un caractère, le `b` du motif serait  devant le `d` en rouge, donc le motif n'est pas dans le texte juste après.

Il faut donc que le dernier caractère du texte vérifié, ici le `d`,  ait devant lui un caractère identique. On peut ainsi sauter des étapes pour placer le premier `d` suivant dans le motif devant ce `d` du texte.

![Futur décalage](/images/boyer-moore/image2.png)

- S'il y a un `d` plus tôt dans le motif, on le place  devant le texte pour que les deux mêmes caractères soient confondus. Formellement, on déplace le motif de `j - k` caractères vers la droite, avec `j` la position du dernier caractère comparé dans le motif (ici `j = 9`), et `k` celle du premier `d` (caractère du texte différent) directement à sa gauche (ici `k = 6`). On remarque que `k` est le nombre de la table de décalage correspondant au caractère `d` et à la position `j`.
- S'il n'existe pas, alors on ne peut pas avancer le motif pour que ce caractère du texte soit superposé avec un caractère identique du motif. On doit donc décaler le motif jusqu'à ce que le premier caractère du motif soit après le caractère du texte.

On est alors dans la position suivante.

![Troisième comparaison](/images/boyer-moore/image3.png)

On compare alors le dernier caractère.

![Troisième comparaison bis](/images/boyer-moore/image4.png)

Puis en remontant jusqu'au début du mot, on voit que le mot est présent en entier à cette position.

![Mot trouvé](/images/boyer-moore/image5.png)

On décale ensuite le motif vers la droite d'un caractère pour chercher d'autres occurrences, et on recommence l'algorithme.

![Quatrième comparaison](/images/boyer-moore/image6.png)

Les caractères sont différents, donc on redécale le motif comme avant.

![Cinquième comparaison](/images/boyer-moore/image7.png)

Il y a une différence, on redécale et le motif "sort" du texte, donc l'algorithme est terminé.

# Implémentation

Tout d'abord, nous devons connaître la taille du texte et du motif.

Il est possible d'utiliser la fonction `strlen` en important `string.h`, mais on peut le faire nous-mêmes, car la fin d'une séquence de caractères est marquée par un `0` à la fin.

On a donc la fonction `strlen` suivante prenant en entrée du texte et renvoyant sa longueur, de complexité temporelle $O(n)$ avec $n$ la longueur de la chaîne de caractères.
```c
int length(char* str) {
    int i = 0;
    while (str[i] != 0) i++;
    return i;
}
```

> [!INFO] Complexité temporelle
> Elle permet d'avoir un ordre de grandeur du temps mis par l'algorithme à s'exécuter en fonction de la taille de l'entrée.

En C, chaque caractère est encodé comme un entier sur 8 bits, donc compris entre 0 et 255. On va donc construire la table comme un tableau en deux dimensions de taille 256 fois 256.

On peut donc à présent construire la table de décalage avec la fonction `table` prenant en entrée le tableau à remplir, du texte et la taille de la chaîne de caractères, renvoyant la table sous forme d'un tableau bidimensionnel. Elle est de complexité $O(n)$ avec $n$ la longueur de la chaîne du motif, même si le facteur 256 est grand.

Si jamais le caractère n'apparaît pas encore à gauche de l'indice `i`, alors on met comme valeur $-1$.
```c
void table(int tab[256][256], char* motif, int len) {
    // On parcourt l'ensemble des caractères c possibles
    for (int c = 0; c < 256; c++) {
        int value = -1;

        // On parcourt le motif mettant à jour la position de c
        for (int i = 0; i < len; i++) {
            tab[c][i] = value;

            if (motif[i] == c) {
                value = i;
            } 
        }
    }
}
```

On applique ensuite l'algorithme, dont le fonctionnement a été décrit précédemment.

```c
void print_occurences(char* motif, char* text) {
    // On crée la table de décalage non encore remplie
    static int tab[256][256];

    // On calcule la longueur des chaînes de caractères
    int motif_len = length(motif);
    int text_len = length(text);

    // On remplit la table de décalages
    table(tab, motif, motif_len);

    // On parcourt le texte, i indiquant la position de début du motif
    int i = 0;
    while (i < text_len - motif_len + 1) {
        bool found = true;

        // On parcourt le motif à partir de la fin
        for (int j = motif_len - 1; j >= 0; j--) {

            // Si les caractères sont différents, le motif n'est pas à cette position
            if (text[i + j] != motif[j]) {
                found = false;
                i += j - tab[text[i + j]][j];
                break;
            }
        }

        if (found) {
            printf("Occurence à l'indice %d\n", i);
            i += 1;
        }
    }
}
```

On fait dans la fonction ci-dessus un petit raccourci : si le caractère `c` du texte est différent du caractère du motif en face de lui et qu'il n'y a pas ce caractère `c` plus tôt dans le motif, il faut décaler le motif complètement. Comme la valeur est alors `-1`, on le décale de `j + 1` ce qui est bien ce qui est souhaité (faites un petit schéma pour vous en convaincre !).

En rassemblant les fonctions, on obtient comme implémentation finale le code ci-dessous.

```c
#include <stdio.h>
#include <stdbool.h>

int length(char* str) {
    int i = 0;
    while (str[i] != 0) i++;
    return i;
}

void table(int tab[256][256], char* motif, int len) {
    // On parcourt l'ensemble des caractères c possibles
    for (int c = 0; c < 256; c++) {
        int value = -1;

        // On parcourt le motif mettant à jour la position de c
        for (int i = 0; i < len; i++) {
            tab[c][i] = value;

            if (motif[i] == c) {
                value = i;
            } 
        }
    }
}

void print_occurences(char* motif, char* text) {
    // On crée la table de décalage non encore remplie
    static int tab[256][256];

    // On calcule la longueur des chaînes de caractères
    int motif_len = length(motif);
    int text_len = length(text);

    // On remplit la table de décalages
    table(tab, motif, motif_len);

    // On parcourt le texte, i indiquant la position de début du motif
    int i = 0;
    while (i < text_len - motif_len + 1) {
        bool found = true;

        // On parcourt le motif à partir de la fin
        for (int j = motif_len - 1; j >= 0; j--) {

            // Si les caractères sont différents, le motif n'est pas à cette position
            if (text[i + j] != motif[j]) {
                found = false;
                i += j - tab[text[i + j]][j];
                break;
            }
        }

        if (found) {
            printf("Occurence à l'indice %d\n", i);
            i += 1;
        }
    }
}

int main() {
    char* texte = "abrabracadabradabra";
    char* motif = "abracadabra";
    
    print_occurences(motif, texte);
    return 0;
}
```

L'exécution de ce programme donne comme sortie l'indice 3 avec l'exemple initial. Ouf ! Tout fonctionne comme prévu⁣ :partying_face:

# Sources
- [Page Wikipédia anglophone](https://en.wikipedia.org/wiki/Boyer-Moore_string-search_algorithm)

[^1]: Dans la pratique, une seconde table de décalage est utilisée pour accélérer encore un peu l'algorithme.