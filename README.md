# Site personel

Adapté à partir de [Twilight](https://github.com/Spr-Aachen/Twilight), réalisé avec [Astro](https://astro.build).

Dans l'essentiel, les modifications apportées sont les suivantes :
- ajout d'un système multilingue pour les posts (basé sur le préfixe), et adaptation de la gestion des articles et projets à mes besoins.
- les pages dont je n'ai pas trouvé d'utilité ont été déplacées dans le dossier `legacy`. De même un certain nombre de composants ont été supprimés.
- les composants du frontend n'utilisent plus svelte mais preact.
- un certain de librairies lourdes ont été remplacées, et plus de parties sont générées directement lors du build

De manière générale, le site est bien plus léger (le bundle size a été réduit de 3 Mo à 300 Ko) et le javascript est chargé dynamiquement.