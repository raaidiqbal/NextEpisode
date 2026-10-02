# Hosted NextEpisode demo

Decision: host a static edition of the team project, using the checked-in anime CSV as a snapshot. The Flask app in the original repository opens a local PostgreSQL connection through `ProductionCode/psqlConfig.py`, which is absent from the repository. A static edition keeps the discovery features available without creating or managing a public database or credentials.

## Current architecture

- `dist/index.html`, `dist/styles.css`, and `dist/app.js` implement a single-page UI with hash routes for discover, rankings, detail, guide, and about.
- `dist/assets/anime.json` is generated from `NextEpisode/Data/anime.csv` in source order. Each row is a 13-element array: MAL ID, title, score, genres, format, episodes, aired, producers, studios, source, duration, content rating, popularity.
- Search matches title substrings and supports required and excluded genres. Rankings sort scored entries descending. Random excludes the adult-oriented genres listed in the original `ProductionCode/services.py`.
- Detail pages display the dataset fields and link to MyAnimeList using the MAL ID. The original version scraped images from MyAnimeList at request time; this edition omits images rather than relying on a brittle scrape or implying current data.
- Every page links to the original team repository. The About page names Christian Park, Raaid Iqbal, Omar Sobhy, and Matthew Hall. This is a hosted demo of their work, not a claim that Raaid built it alone.

## Constraints and future edits

- This is a fixed data snapshot. Do not claim the scores or rankings update live.
- Preserve the distinction between this hosted edition and the Flask source. If the Flask app later gets a hosted database, evaluate whether to switch the portfolio link to that deployment.
- The original project uses red and pink. This edition retains that palette but replaces the cramped table and hover-dependent navigation with responsive rows and keyboard-accessible links.
- Regenerate `anime.json` from the public CSV when the upstream dataset changes, then recheck search, ranking, random, and detail behavior before publishing.
