const C = { id: 0, title: 1, score: 2, genres: 3, type: 4, episodes: 5, aired: 6, producers: 7, studios: 8, source: 9, duration: 10, rating: 11, popularity: 12 };
const blockedRandomGenres = new Set(['Hentai', 'Ecchi', 'Harem', 'Yaoi', 'Yuri']);
const catalog = { rows: [], byId: new Map(), ranked: [], ready: false };
const searchState = { ran: false, results: [], visible: 60 };
const $ = (selector) => document.querySelector(selector);
const normalize = (value) => String(value || '').toLocaleLowerCase();
const scoreOf = (row) => Number.parseFloat(row[C.score]) || 0;
const genresOf = (row) => String(row[C.genres] || '').split(',').map((genre) => genre.trim()).filter(Boolean);
const safeRandom = (row) => !genresOf(row).some((genre) => blockedRandomGenres.has(genre));

function make(tag, className, content) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content != null) element.textContent = content;
  return element;
}

function createRow(row, index) {
  const item = make('div', 'result-row');
  const number = make('span', 'result-index', String(index).padStart(2, '0'));
  const title = make('a', 'result-title', row[C.title]);
  title.href = '#anime/' + encodeURIComponent(row[C.id]);
  const meta = make('span', 'result-meta', [row[C.type], row[C.genres]].filter(Boolean).join(' · '));
  const score = make('span', 'result-score', scoreOf(row) ? scoreOf(row).toFixed(2) : '—');
  item.append(number, title, meta, score);
  return item;
}

function showRows(container, rows, start = 0) {
  const fragment = document.createDocumentFragment();
  rows.forEach((row, offset) => fragment.append(createRow(row, start + offset + 1)));
  container.append(fragment);
}

function selectedGenres(containerId) {
  return [...document.querySelectorAll('#' + containerId + ' input:checked')].map((box) => box.value);
}

function updateFilterCounts() {
  $('#include-count').textContent = selectedGenres('include-genres').length + ' selected';
  $('#exclude-count').textContent = selectedGenres('exclude-genres').length + ' selected';
}

function renderGenreOptions() {
  const names = [...new Set(catalog.rows.flatMap(genresOf))].filter((name) => name && !blockedRandomGenres.has(name)).sort((a, b) => a.localeCompare(b));
  for (const [id, other] of [['include-genres', 'exclude-genres'], ['exclude-genres', 'include-genres']]) {
    const container = $('#' + id);
    const fragment = document.createDocumentFragment();
    names.forEach((name) => {
      const label = make('label');
      const box = make('input');
      box.type = 'checkbox';
      box.value = name;
      box.setAttribute('aria-label', (id === 'include-genres' ? 'Include ' : 'Exclude ') + name);
      box.addEventListener('change', () => {
        if (box.checked) {
          const opposite = [...document.querySelectorAll('#' + other + ' input')].find((input) => input.value === name);
          if (opposite) opposite.checked = false;
        }
        updateFilterCounts();
      });
      label.append(box, document.createTextNode(name));
      fragment.append(label);
    });
    container.append(fragment);
  }
}

function runSearch(event) {
  if (event) event.preventDefault();
  if (!catalog.ready) return;
  const query = normalize($('#title-query').value.trim());
  const included = selectedGenres('include-genres');
  const excluded = selectedGenres('exclude-genres');
  const result = catalog.rows.filter((row) => {
    if (query && !normalize(row[C.title]).includes(query)) return false;
    const genres = genresOf(row);
    return included.every((name) => genres.includes(name)) && excluded.every((name) => !genres.includes(name));
  });
  result.sort((a, b) => {
    const aStarts = query && normalize(a[C.title]).startsWith(query) ? 1 : 0;
    const bStarts = query && normalize(b[C.title]).startsWith(query) ? 1 : 0;
    return bStarts - aStarts || scoreOf(b) - scoreOf(a) || a[C.title].localeCompare(b[C.title]);
  });
  searchState.ran = true;
  searchState.results = result;
  searchState.visible = 60;
  location.hash = 'discover';
  renderSearch();
  $('#results').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
}

function renderSearch() {
  if (!searchState.ran) return;
  $('#starter-picks').hidden = true;
  $('#results').hidden = false;
  $('#result-count').textContent = searchState.results.length.toLocaleString() + ' ' + (searchState.results.length === 1 ? 'entry' : 'entries');
  const list = $('#result-list');
  list.replaceChildren();
  showRows(list, searchState.results.slice(0, searchState.visible));
  if (searchState.results.length === 0) list.append(make('p', 'empty-state', 'No matches yet. Try a shorter title or fewer genre filters.'));
  $('#more-results').hidden = searchState.visible >= searchState.results.length;
}

function renderRankings() {
  const limit = Number($('#rank-limit').value) || 25;
  const list = $('#rank-list');
  list.replaceChildren();
  showRows(list, catalog.ranked.slice(0, limit));
}

function renderDetail(id) {
  const content = $('#detail-content');
  content.replaceChildren();
  const row = catalog.byId.get(id);
  if (!row) {
    content.append(make('h1', '', 'Anime not found'), make('p', '', 'This entry is not in the project data snapshot.'));
    return;
  }
  document.title = row[C.title] + ' — NextEpisode';
  const head = make('div', 'detail-head');
  head.append(make('p', 'overline', [row[C.type], row[C.source]].filter(Boolean).join(' / ')), make('h1', '', row[C.title]));
  head.append(make('span', 'detail-score', scoreOf(row) ? scoreOf(row).toFixed(2) + ' / 10' : 'Unscored'));
  const list = make('dl', 'detail-grid');
  for (const [label, value] of [
    ['Genres', row[C.genres]], ['Episodes', row[C.episodes]], ['Aired', row[C.aired]],
    ['Studios', row[C.studios]], ['Producers', row[C.producers]], ['Duration', row[C.duration]],
    ['Content rating', row[C.rating]], ['Popularity rank', row[C.popularity]], ['Source', row[C.source]]
  ]) {
    const item = make('div', 'detail-item');
    item.append(make('dt', '', label), make('dd', '', value && value !== 'Unknown' ? value : 'Not listed'));
    list.append(item);
  }
  const source = make('a', 'source-link', 'View on MyAnimeList ↗');
  source.href = 'https://myanimelist.net/anime/' + encodeURIComponent(id);
  source.target = '_blank';
  source.rel = 'noopener noreferrer';
  content.append(head, list, source);
}

function chooseRandom() {
  const eligible = catalog.rows.filter(safeRandom);
  if (!eligible.length) return;
  const row = eligible[Math.floor(Math.random() * eligible.length)];
  location.hash = 'anime/' + encodeURIComponent(row[C.id]);
}

function route() {
  const hash = decodeURIComponent(location.hash.slice(1));
  const detail = hash.startsWith('anime/');
  const view = detail ? 'detail' : ['rankings', 'guide', 'about'].includes(hash) ? hash : 'discover';
  document.querySelectorAll('[data-view]').forEach((section) => { section.hidden = section.dataset.view !== view; });
  document.querySelectorAll('[data-nav]').forEach((link) => {
    const active = link.dataset.nav === view;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  document.title = (view === 'discover' ? 'Find your next anime' : view[0].toUpperCase() + view.slice(1)) + ' — NextEpisode';
  if (catalog.ready) {
    if (view === 'rankings') renderRankings();
    if (view === 'detail') renderDetail(hash.slice(6));
    if (view === 'discover') renderSearch();
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
}

async function initialize() {
  $('#search-form').addEventListener('submit', runSearch);
  $('#random-nav').addEventListener('click', chooseRandom);
  $('#rank-limit').addEventListener('change', renderRankings);
  $('#more-results').addEventListener('click', () => {
    const old = searchState.visible;
    searchState.visible = Math.min(searchState.visible + 60, searchState.results.length);
    showRows($('#result-list'), searchState.results.slice(old, searchState.visible), old);
    $('#more-results').hidden = searchState.visible >= searchState.results.length;
  });
  $('#clear-filters').addEventListener('click', () => {
    document.querySelectorAll('.genre-options input').forEach((box) => { box.checked = false; });
    updateFilterCounts();
  });
  window.addEventListener('hashchange', route);
  route();
  try {
    const response = await fetch('./assets/anime.json');
    if (!response.ok) throw new Error('Catalog unavailable');
    catalog.rows = await response.json();
    catalog.byId = new Map(catalog.rows.map((row) => [row[C.id], row]));
    catalog.ranked = catalog.rows.filter((row) => scoreOf(row) > 0).sort((a, b) => scoreOf(b) - scoreOf(a) || a[C.title].localeCompare(b[C.title]));
    catalog.ready = true;
    renderGenreOptions();
    const starter = catalog.ranked.filter((row) => safeRandom(row) && Number(row[C.popularity]) > 0 && Number(row[C.popularity]) < 500).slice(0, 8);
    showRows($('#starter-list'), starter);
    $('#data-status').textContent = catalog.rows.length.toLocaleString() + ' entries from the team project’s data snapshot';
    document.querySelectorAll('button:disabled').forEach((button) => { button.disabled = false; });
    route();
  } catch (error) {
    $('#data-status').textContent = 'The catalog could not load. Please refresh the page.';
    console.error(error);
  }
}

initialize();
