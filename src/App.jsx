import { useCallback, useMemo, useState } from 'react';
import RAW from './data/films.js';
import { GENRES, toFilm } from './data/genres.js';
import useLocalStorage from './hooks/useLocalStorage.js';
import useAmbientSound from './hooks/useAmbientSound.js';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Embers from './components/Embers.jsx';
import FilmRow from './components/FilmRow.jsx';
import DecadeChart from './components/DecadeChart.jsx';
import Picker from './components/Picker.jsx';
import Horns from './components/Horns.jsx';

const FILMS = RAW.map(toFilm);

const SORTS = {
  rank: { label: 'Po rangu', fn: (a, b) => a.rank - b.rank },
  critics: { label: 'Kritičari', fn: (a, b) => b.critics - a.critics || a.rank - b.rank },
  audience: { label: 'Publika', fn: (a, b) => b.audience - a.audience || a.rank - b.rank },
  newest: { label: 'Najnoviji', fn: (a, b) => b.year - a.year || a.rank - b.rank },
  oldest: { label: 'Najstariji', fn: (a, b) => a.year - b.year || a.rank - b.rank },
};

// uklanja kvačice da bi pretraga „noc“ našla i „noć“
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'dj');

export default function App() {
  const [seenList, setSeenList] = useLocalStorage('crvena-noc-seen', []);
  const seen = useMemo(() => new Set(seenList), [seenList]);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState(null);
  const [decade, setDecade] = useState(null);
  const [sort, setSort] = useState('rank');
  const [hideSeen, setHideSeen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [soundOn, toggleSound] = useAmbientSound();

  const toggleSeen = useCallback((rank) => {
    setSeenList((prev) => (prev.includes(rank) ? prev.filter((r) => r !== rank) : [...prev, rank]));
  }, [setSeenList]);
  const markSeen = useCallback((rank) => {
    setSeenList((prev) => (prev.includes(rank) ? prev : [...prev, rank]));
  }, [setSeenList]);

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    return FILMS.filter((f) =>
      (!genre || f.genres.includes(genre)) &&
      (!decade || f.decade === decade) &&
      (!hideSeen || !seen.has(f.rank)) &&
      (!q || norm(`${f.title} ${f.director} ${f.country} ${f.year}`).includes(q))
    ).sort(SORTS[sort].fn);
  }, [query, genre, decade, sort, hideSeen, seen]);

  const pool = useMemo(() => {
    const base = filtered.filter((f) => !seen.has(f.rank));
    return base.length || filtered.length ? base : FILMS.filter((f) => !seen.has(f.rank));
  }, [filtered, seen]);

  const countries = useMemo(() => new Set(FILMS.flatMap((f) => f.country.split(' / '))).size, []);
  const seenCount = seen.size;
  const anyFilter = query || genre || decade || hideSeen;

  const reset = () => { setQuery(''); setGenre(null); setDecade(null); setHideSeen(false); };

  return (
    <>
      <Nav soundOn={soundOn} onSound={toggleSound} />
      <Hero total={FILMS.length} seenCount={seenCount} onPick={() => setPickerOpen(true)} />

      <main>
        <section id="lista" className="list-section">
          <div className="list-head">
            <div>
              <div className="label">Lista</div>
              <h2>Sto filmova koji ne puštaju</h2>
              <p className="lead">
                Rangirano po ocenama kritičara sa sajta Rotten Tomatoes. Označi šta si već gledao,
                a sajt će zapamtiti i ponuditi ti nešto novo.
              </p>
            </div>
            <div className="stats">
              <div><b>{FILMS.length}</b><span>filmova</span></div>
              <div><b>{countries}</b><span>zemalja</span></div>
              <div><b>{seenCount}</b><span>odgledano</span></div>
              <div className="progress" aria-label={`Odgledano ${seenCount} od ${FILMS.length}`}>
                <i style={{ width: `${(seenCount / FILMS.length) * 100}%` }} />
              </div>
            </div>
          </div>

          <DecadeChart films={FILMS} active={decade} onSelect={setDecade} />

          <div className="controls">
            <input
              className="search"
              type="search"
              placeholder="Traži naslov, reditelja, zemlju…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Pretraga filmova"
            />
            <select className="sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sortiranje">
              {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
            </select>
            <label className="toggle">
              <input type="checkbox" checked={hideSeen} onChange={(e) => setHideSeen(e.target.checked)} />
              <span>Sakrij odgledane</span>
            </label>
            <button className="btn red small" onClick={() => setPickerOpen(true)}>Izaberi mi film</button>
          </div>

          <div className="genres" role="group" aria-label="Filtriraj po žanru">
            <button className={!genre ? 'on' : ''} onClick={() => setGenre(null)}>Svi žanrovi</button>
            {Object.entries(GENRES).map(([k, v]) => (
              <button key={k} className={genre === k ? 'on' : ''} onClick={() => setGenre(genre === k ? null : k)}>{v}</button>
            ))}
          </div>

          <div className="result-line">
            Prikazano <b>{filtered.length}</b> od {FILMS.length}
            {anyFilter && <button className="link" onClick={reset}>Poništi filtere</button>}
          </div>

          <ol className="films">
            {filtered.map((f) => (
              <FilmRow key={f.rank} film={f} seen={seen.has(f.rank)} onToggleSeen={toggleSeen} />
            ))}
          </ol>
          {!filtered.length && <p className="empty">Nijedan film ne odgovara ovom izboru. <button className="link" onClick={reset}>Poništi filtere</button></p>}
        </section>

        <section id="izvor" className="source">
          <div className="label">Izvor</div>
          <h2>Odakle su ocene</h2>
          <p className="lead">
            Rang i obe ocene preuzeti su sa liste{' '}
            <a href="https://editorial.rottentomatoes.com/guide/best-horror-movies-of-all-time/" target="_blank" rel="noreferrer">
              „The 200 Best Horror Movies of All Time“
            </a>{' '}
            sajta Rotten Tomatoes, 20. novembra 2026. „Kritičari“ je procenat pozitivnih kritika (Tomatometer),
            a „Publika“ procenat gledalaca kojima se film dopao (Popcornmeter). Ocene se vremenom menjaju.
            Opisi i zanimljivosti su napisani za ovaj sajt.
          </p>
        </section>
      </main>

      <footer>
        <div className="big"><Horns className="foot-horns" />CRVENA NOĆ</div>
        <span>Vodič kroz najbolje horor filmove · ocene: Rotten Tomatoes</span>
        <span>Klikni bilo gde da razbuktaš žar</span>
      </footer>

      <Picker open={pickerOpen} pool={pool} onClose={() => setPickerOpen(false)} onMarkSeen={markSeen} />
      <Embers />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
