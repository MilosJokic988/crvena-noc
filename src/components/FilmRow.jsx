import { GENRES } from '../data/genres.js';
import Meter from './Meter.jsx';
import { emberBurst } from './Embers.jsx';

const rtLink = (title) => `https://www.rottentomatoes.com/search?search=${encodeURIComponent(title)}`;

export default function FilmRow({ film, seen, onToggleSeen }) {
  const toggle = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (!seen) emberBurst(r.left + r.width / 2, r.top + r.height / 2, 28);
    onToggleSeen(film.rank);
  };

  return (
    <li className={`film ${seen ? 'is-seen' : ''} ${film.rank <= 10 ? 'top10' : ''}`}>
      <div className="rank" aria-label={`Mesto ${film.rank}`}>{film.rank}</div>

      <div className="film-main">
        <h3>
          {film.title} <span className="year">{film.year}.</span>
        </h3>
        <div className="film-meta">
          <span>{film.director}</span>
          <span>{film.country}</span>
          {film.genres.map((g) => <span key={g} className="chip">{GENRES[g]}</span>)}
        </div>
        <p className="blurb">{film.blurb}</p>
        {film.fact && (
          <p className="fact">
            <span className="fact-label">Zanimljivost</span>
            {film.fact}
          </p>
        )}
      </div>

      <div className="film-side">
        <Meter label="Kritičari" value={film.critics} kind="critics" />
        <Meter label="Publika" value={film.audience} kind="audience" />
        <div className="film-actions">
          <button className="seen-btn" aria-pressed={seen} onClick={toggle}>
            {seen ? '✓ Odgledano' : 'Odgledao sam'}
          </button>
          <a className="rt" href={rtLink(film.title)} target="_blank" rel="noreferrer">RT ↗</a>
        </div>
      </div>
    </li>
  );
}
