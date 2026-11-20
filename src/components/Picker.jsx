import { useEffect, useRef, useState } from 'react';
import Horns from './Horns.jsx';
import Meter from './Meter.jsx';
import { GENRES } from '../data/genres.js';

// „Šta da gledam večeras?“ — vrti naslove pa stane na jedan neodgledani film.
export default function Picker({ open, pool, onClose, onMarkSeen }) {
  const [film, setFilm] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [flash, setFlash] = useState('');
  const timer = useRef(null);

  const spin = () => {
    if (!pool.length) return;
    clearTimeout(timer.current);
    setSpinning(true);
    const final = pool[Math.floor(Math.random() * pool.length)];
    let i = 0;
    const steps = 16;
    const step = () => {
      i++;
      if (i >= steps) {
        setFlash('');
        setFilm(final);
        setSpinning(false);
        return;
      }
      setFlash(pool[Math.floor(Math.random() * pool.length)].title);
      timer.current = setTimeout(step, 40 + i * i * 1.4);
    };
    step();
  };

  useEffect(() => {
    if (open) spin();
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="picker-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="picker" role="dialog" aria-modal="true" aria-label="Predlog filma za večeras">
        <button className="picker-x" onClick={onClose} aria-label="Zatvori">×</button>
        <Horns className="picker-horns" />
        <div className="label">Večeras gledaš</div>

        {!pool.length ? (
          <p className="picker-empty">Odgledao si sve filmove iz ovog izbora. Promeni filtere ili poništi neki „odgledano“.</p>
        ) : spinning || !film ? (
          <div className="picker-spin">{flash || '…'}</div>
        ) : (
          <>
            <h2 className="picker-title">{film.title}</h2>
            <div className="film-meta">
              <span>#{film.rank}</span>
              <span>{film.year}.</span>
              <span>{film.director}</span>
              {film.genres.map((g) => <span key={g} className="chip">{GENRES[g]}</span>)}
            </div>
            <p className="blurb">{film.blurb}</p>
            {film.fact && (
              <p className="fact"><span className="fact-label">Zanimljivost</span>{film.fact}</p>
            )}
            <div className="picker-meters">
              <Meter label="Kritičari" value={film.critics} kind="critics" />
              <Meter label="Publika" value={film.audience} kind="audience" />
            </div>
          </>
        )}

        <div className="picker-actions">
          <button className="btn red" onClick={spin} disabled={spinning || !pool.length}>Drugi film</button>
          {film && !spinning && (
            <button className="btn" onClick={() => { onMarkSeen(film.rank); spin(); }}>Već sam ga gledao</button>
          )}
        </div>
        <p className="picker-note">Biram samo među filmovima koje nisi označio kao odgledane, u okviru trenutnih filtera.</p>
      </div>
    </div>
  );
}
