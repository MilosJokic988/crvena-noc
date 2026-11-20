import { useEffect, useState } from 'react';
import Sigil from './Sigil.jsx';

export default function Nav({ soundOn, onSound }) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(scrollY > innerHeight * 0.7);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav ${solid ? 'solid' : ''}`}>
      <a className="mark" href="#top">
        <Sigil className="mark-sigil" ring={false} id="nav" />
        CRVENA NOĆ
      </a>
      <ul>
        <li><a href="#lista">Lista</a></li>
        <li><a href="#decenije">Decenije</a></li>
        <li><a href="#izvor">Izvor</a></li>
      </ul>
      <button
        className={`sound ${soundOn ? 'on' : ''}`}
        aria-pressed={soundOn}
        aria-label="Uključi ili isključi ambijentalni zvuk"
        onClick={onSound}
      >
        <i><b /><b /><b /></i>
        <span>Zvuk</span>
      </button>
    </nav>
  );
}
