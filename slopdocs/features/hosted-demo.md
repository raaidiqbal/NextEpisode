# Hosted NextEpisode

Decision: deploy the repository's Flask application and its original `templates/` and `static/` frontend. The earlier GitHub Pages edition in `docs/` is a separate remake and does not represent the team's actual frontend; do not use it as the primary portfolio demo.

Production URL: `https://next-episode-raaid.iqbalm-963.workers.dev/` (deployed 2026-10-02 with Wrangler; Worker name `next-episode-raaid`).

## Data and deployment

- The original `ProductionCode/datasource.py` connected to local PostgreSQL through `ProductionCode/psqlConfig.py`, which was never committed. A host cannot run that version without an unshared database and configuration.
- `Data/anime.csv` is checked in and has 13 columns with no header. The replacement `DataSource` loads it into memory at startup and returns tuples in the exact positions consumed by the existing Jinja templates (`[3]` MAL ID through `[15]` source). Keep that compatibility when editing the data layer.
- Rankings sort the snapshot's numeric scores. The original ranking tests contain some expectations from a different database snapshot; compare them with the CSV before changing production ordering to satisfy a test.
- `pyproject.toml`, `wrangler.jsonc`, and `worker.py` configure Cloudflare Python Workers with Flask's WSGI adapter. `scripts/build_worker_resources.py` generates ignored `worker_src/` from the original app files, CSV, and Jinja templates. It embeds the non-Python resources as `worker_resources.py` because Wrangler does not bundle them directly. Wrangler's `base_dir` points at `worker_src/` so it does not accidentally upload `node_modules`, virtual environments, or other repo files.
- `static/` remains the original CSS and JavaScript. The Worker forwards Flask's `/static/...` route to Workers Static Assets. Local `pywrangler dev` checks returned HTTP 200 for home, detail, CSS, search, rankings, random, guide, about, and genres on 2026-10-02.
- `requirements-render.txt` and `render.yaml` are an alternate Python server deployment path, retained as a fallback.
- The dataset is a snapshot; scores and ranks do not update live. Detail artwork still comes from a MyAnimeList scrape with a five-second timeout and a fallback image.

## Frontend

- Flask serves the original `homepage.html`, `showlist.html`, `rankings.html`, `showpanel.html`, `about.html`, `guide.html`, and the original CSS/JavaScript. The homepage title list uses Jinja's `tojson` so anime names with quotes do not break autocomplete JavaScript.
- The `docs/` static edition remains in the repo as a historical artifact. Point portfolio links to the Cloudflare URL.
