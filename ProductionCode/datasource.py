"""Read the bundled anime catalog without requiring a local PostgreSQL server."""

import csv
import random
from pathlib import Path


class DataSource:
    def __init__(self):
        catalog = Path(__file__).resolve().parents[1] / "Data" / "anime.csv"
        with catalog.open(encoding="utf-8-sig", newline="") as source:
            self.anime = [self._record(row) for row in csv.reader(source) if len(row) == 13]
        self.by_title = {record[4].casefold(): record for record in self.anime}

    @staticmethod
    def _record(row):
        # Keep the tuple positions used by the original Flask templates.
        mal_id, name, score, genres, kind, episodes, aired, producers, studios, source, duration, rating, popularity = row
        return (None, None, None, int(mal_id), name, score, genres, episodes, aired,
                producers, studios, duration, int(popularity), rating, kind, source)

    def get_all_titles(self):
        return [record[4] for record in self.anime]

    def get_all_anime(self):
        return self.anime

    def get_data_from_title(self, title):
        return self.by_title.get(title.casefold())

    def fuzzy_match_name(self, title, genres, blacklist):
        query = title.strip().casefold()
        included = [genre.casefold() for genre in genres if genre]
        excluded = [genre.casefold() for genre in blacklist if genre]
        if not query and not included:
            return []
        matches = [record for record in self.anime
                   if query in record[4].casefold()
                   and all(genre in record[6].casefold() for genre in included)
                   and not any(genre in record[6].casefold() for genre in excluded)]
        if query:
            matches.sort(key=lambda record: (
                not record[4].casefold().startswith(query),
                abs(len(record[4]) - len(query)),
                record[4].casefold()))
        return matches

    def filter_by_genres(self, genres):
        if not genres or not all(genres):
            return []
        wanted = [genre.casefold() for genre in genres]
        return [record for record in self.anime
                if all(genre in record[6].casefold() for genre in wanted)]

    def get_random_anime(self):
        return [random.choice(self.anime)]

    def get_top_ranked_anime(self, limit):
        ranked = (record for record in self.anime if self._score(record) > 0)
        return sorted(ranked, key=self._score, reverse=True)[:limit]

    @staticmethod
    def _score(record):
        try:
            return float(record[5])
        except ValueError:
            return 0.0
