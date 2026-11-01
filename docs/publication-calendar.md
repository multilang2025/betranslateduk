# Calendrier de publication

## La règle (Mike, 1er nov. 2026)

- **Jamais deux articles le même jour.** Règle valable pour tous les sites de Mike, sauf tant que le site est en preview.
- Cadence régulière pour que le blog reste vivant : par défaut **deux articles par semaine**, par exemple le **mardi et le vendredi à 08:00 heure locale** du site, au moins deux jours d'écart.
- Les heures données à Mike sont en CET (UTC+1 en hiver), jamais en UTC.
- Les dates réelles de publication sont une décision de Mike ; un agent propose, il ne change pas les dates d'articles planifiés.

## Ce dépôt (betranslateduk, betranslated.co.uk)

- **Statut du site :** preview noindex (preview.betranslated.co.uk) jusqu'à la bascule : la règle ne s'applique pas encore, elle vaudra dès la mise en ligne.
- **Comment une date est stockée :** `datePublished` dans le JSON-LD (`schema`) de chaque `scripts/btvibe-uk/output/posts/<slug>.json`, lu par `postDate()` (`lib/content.js`). `data/blog-updated.json` ne porte que les dates de mise à jour (2026-10-29 pour tous), pas la publication.
- **Comment une date se planifie ici :** **Aucun mécanisme de planification.** Le site ne masque pas un article daté du futur (aucun filtre sur la date dans `lib/content.js`) : un article avec une date future s'afficherait tout de suite, avec cette date. Tant qu'il n'existe pas, un article se prépare hors du dépôt ou sur une branche et se fusionne le jour prévu ; l'alternative est un filtre `isPublished` plus un rebuild quotidien, sur le modèle de bt-digital (`lib/blog.ts`, `.github/workflows/blog-scheduled-publish.yml`).

## État au 1er nov. 2026

- Articles datés dans le futur : **aucun**.
- Doublons sur les 60 derniers jours : **aucun**. Dernier article : `expressions-from-the-it-crowd`, 20 avr. 2026 (66 articles).
- Doublons anciens (information) : 24 sept. 2025 (2), 2 sept. 2024 (2), et des paires de 2017 à 2023, dont le 14 févr. 2020 (3).

## Calendrier proposé

Aucun article planifié : rien à recaler. Les nouveaux articles prendront les créneaux ci-dessous (mardi et vendredi, 08:00 heure de Londres, soit 09:00 CET) ; le contenu reste en brouillon tant que Mike n'a pas validé (CLAUDE.md).
## Prochains créneaux libres (mardi et vendredi)

3, 6, 10, 13, 17, 20, 24 et 27 nov. 2026, puis 1er, 4, 8 et 11 déc. (le 25 déc. et le 1er janv. sont fériés : à sauter).


## À décider (Mike)

1. Date de mise en ligne du site (début de la règle) ?
2. Construire un filtre de planification ou fusionner chaque article le jour prévu ?
3. Cadence : deux par semaine (défaut) ou une seule ?
