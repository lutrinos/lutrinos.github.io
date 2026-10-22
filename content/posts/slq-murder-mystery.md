+++
title = "The SQL Murder Mystery"
description = "Résolvons le meurtre du petit jeu THE SQL Murder Mystery !"
tags =  ["Informatique", "SQL", "Jeux"]
categories = ["Base de données"]
date = 2025-06-14
+++

[The SQL Murder Mystery](https://mystery.knightlab.com/) est un petit jeu dont on doit trouver la réponse grâce à des requêtes en SQL.

Si vous ne l'avez pas fait, cherchez la solution ! Ce post n'a pour but que d'expliquer les démarches et le raisonnement afin de réaliser le moins de requêtes possibles, et développe les quelques notes que j'ai pris quand je l'ai résolu.

À vrai dire c'est plus pour m'amuser qu'autre chose :wink:

# Repérage des lieux
On peut accéder au schéma avec l'instruction suivante, valide seulement avec SQLite.

```sql
SELECT name, sql FROM sqlite_master WHERE type = 'table'
```

Dans tous les cas, on obtient le schéma suivant également fournit.

![Schéma de la base de données](/images/sql-murder-mystery/schema.png)

On a comme premiers indices
- le crime est un meurtre
- il a eu lieu le 15 janvier 2018
- il a eu lieu dans SQL City

# Premières investigations
De premier abord, je ne vois pas d'autres manières que de chercher le rapport du meurtre, ce que la requête suivante permet d'obtenir.

```sql
SELECT *
FROM crime_scene_report
WHERE date = 20180115 AND type = "murder" AND city = "SQL City"
```

Elle donne comme résultat

|date|type|description|city
|----|----|-----------|----|
|20180115|murder|Security footage shows that there were 2 witnesses. The first witness lives at the last house on "Northwestern Dr". The second witness, named Annabel, lives somewhere on "Franklin Ave".|SQL City|

On a donc deux potentiels témoins. Tâchons donc de récupérer toutes les informations quelles peuvent nous donner.

Pour récupérer la première personne, on peut réaliser la requête
```sql
SELECT *
FROM person
WHERE address_street_name = "Northwestern Dr"
ORDER BY address_number DESC
LIMIT 1
```

Et pour récupérer la deuxième
```sql
SELECT *
FROM person
WHERE address_street_name = "Franklin Ave" AND name LIKE "Annabel%"
```

On peut donc récupérer aisément leurs témoignages de la manière suivante, à la condition de ne pas faire de `ORDER BY` dans l'union (honnêtement je ne le savais pas avant d'essayer :sweat_smile:).

Pour pallier à cet inconvénient, comme `Franklin Ave` est placé avant `Northwestern Dr` dans l'ordre alphabétique, on peut trier l'union selon le nom de la rue ascendant puis le numéro descendant. Il suffira alors de considérer la première personne résidant à `Northwestern Dr` dans la liste, et celles résidant à `Franklin Ave` (placées avant dans le résultat de la requête) s'il y en a plusieurs.

_Heureusement, les deux requêtes précédentes ne renvoient qu'une seule ligne, et on peut en fait limiter à deux le nombre de lignes sélectionnées._

Une projection sur la table `interview` permet en plus d'obtenir leurs interviews.

```sql
SELECT *
FROM (
    SELECT *
    FROM person
    WHERE address_street_name = "Franklin Ave" AND name LIKE "Annabel%"
    UNION
    SELECT *
    FROM person
    WHERE address_street_name = "Northwestern Dr"
)
JOIN interview ON person_id = id
ORDER BY address_street_name ASC, address_number DESC
LIMIT 2
```

On obtient le tableau suivant (j'ai enlevé la ligne `person_id` qui était redondante pour gagner de la place).

|id|name|license_id|address_number|address_street_name|ssn|transcript|
|--|----|----------|--------------|-------------------|---|----------|
|16371|Annabel Miller|490173|103|Franklin Ave|318771143|I saw the murder happen, and I recognized the killer from my gym when I was working out last week on January the 9th.|
|14887|Morty Schapiro|118009|4919|Northwestern Dr|111564949|I heard a gunshot and then saw a man run out. He had a "Get Fit Now Gym" bag. The membership number on the bag started with "48Z". Only gold members have those bags. The man got into a car with a plate that included "H42W".

Si tout ce que le témoins disent en bien vrai, alors on a les indications suivantes.
- le meurtrier est passé au club de gym la semaine précédent le meurtre, le 9 janvier
- la club de gym en question s'appelle "Get Fit Now Gym" (ça tombe bien, c'est le seul dont on a la base de données :eyes:)
- son code de membre commence par "48Z"
- c'est un membre "gold"
- il est entré dans une voiture, a priori la sienne, donc la plaque contient "H42W".

Cherchons les différents suspects !

# La recherche des suspects

Essayons de trouver le meurtrier en une requête avec toutes ces informations.

On va pour cela aggréger les donnéesà partir de la table `person` avec trois projections consécutives :
- sur `get_fit_now_member` dont l'identifiant de la personne correspond
- sur `drivers_license` dont l'identifiant de la licence correspond
- sur `get_git_now_check_in` dont l'identifiant d'inscription correspond, ainsi que la date du passage qui doit être le 9 janvier 2018.

On sélectionne ensuite les colonnes sur trois critères :
- le statut de l'inscription au club de gym (gold)
- le numéro de la plaque d'immatriculation
- l'identifiant d'inscription au club

Pour ne pas avoir à répeter les noms des tables qui sont assez long, le mot clé `AS` nous permet de les renommer localement.

```sql
SELECT *
FROM person as p
JOIN get_fit_now_member as m ON m.person_id = p.id
JOIN drivers_license as l ON p.license_id = l.id
JOIN get_fit_now_check_in as c ON c.membership_id = m.id AND c.check_in_date = 20180109
WHERE m.membership_status = "gold" AND l.plate_number LIKE "%H42W%" AND m.id LIKE "48Z%"
```

On a alors une seule ligne en résultat ! Est-ce le coupable ?

_Encore une fois, les informations redondantes on été supprimées par mes soins pour gagner de la place._

|name|license_id|address_number|address_street_name|ssn|person_id|membership_start_date|membership_status|age|height|eye_color|hair_color|gender|plate_number|car_make|car_model|membership_id|check_in_date|check_in_time|check_out_time
|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|Jeremy Bowers|423327|530|Washington Pl, Apt 3A|871539279|67318|20160101|gold|30|70|brown|brown|male|0H42W2|Chevrolet|Spark LS|48Z55|20180109|1530|1700|

# Rebondissement

Lorsqu'on soumet le nom du vilain, on a une surprise !

> Congrats, you found the murderer! But wait, there's more... If you think you're up for a challenge, try querying the interview transcript of the murderer to find the real villain behind this crime. If you feel especially confident in your SQL skills, try to complete this final step with no more than 2 queries. Use this same INSERT statement with your new suspect to check your answer.

Récupérons donc le  rapport du meurtier... en une requête ! Il ne nous en restera plus qu'une seule.

|person_id|transcript|
|-|-|
|67318|I was hired by a woman with a lot of money. I don't know her name but I know she's around 5'5" (65") or 5'7" (67"). She has red hair and she drives a Tesla Model S. I know that she attended the SQL Symphony Concert 3 times in December 2017.|

On a donc les informations suivantes
- elle a beaucoup d'argent
- elle mesure autour de 5'5" et 5'7" pieds
- ses cheveux sont rouges
- sa voiture est une Tesla Model S
- elle est allé voir le SQL Symphony Concert trois fois en décembre 2017

Cela donne donc la reqête suivante, avec une projection puis un `GROUP BY` sélectionnant les personnes ayant été plus de trois fois au concert.

```sql
SELECT *
FROM person as p
JOIN drivers_license as l ON l.id = p.license_id AND l.height BETWEEN 65 AND 67 AND l.hair_color = "red" AND l.car_make = "Tesla" AND l.car_model  = "Model S"
JOIN facebook_event_checkin as f ON f.person_id = p.id AND f.event_name = "SQL Symphony Concert" AND f.date BETWEEN 20171201 AND 20171231
GROUP BY p.id
HAVING COUNT(*) >= 3
```

C'est fait, on a donc le nom du commanditaire, `[à vous de le chercher]` !

> Congrats, you found the brains behind the murder! Everyone in SQL City hails you as the greatest SQL detective of all time. Time to break out the champagne!

Alors champagne docteur Watson :champagne: