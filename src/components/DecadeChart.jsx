// Stubići po decenijama; klik filtrira listu na tu deceniju.
export default function DecadeChart({ films, active, onSelect }) {
  const counts = {};
  films.forEach((f) => { counts[f.decade] = (counts[f.decade] || 0) + 1; });
  const decades = Object.keys(counts).map(Number).sort((a, b) => a - b);
  const max = Math.max(...Object.values(counts));

  return (
    <div className="decades" id="decenije">
      <div className="decades-head">
        <span className="label">Po decenijama</span>
        <span className="hint">{active ? 'Klikni ponovo za sve decenije' : 'Klikni stubić da filtriraš'}</span>
      </div>
      <div className="bars" role="group" aria-label="Filtriraj po deceniji">
        {decades.map((d) => (
          <button
            key={d}
            className={`bar ${active === d ? 'on' : ''} ${active && active !== d ? 'dim' : ''}`}
            onClick={() => onSelect(active === d ? null : d)}
            aria-pressed={active === d}
            aria-label={`${d}-te: ${counts[d]} filmova`}
          >
            <span className="bar-n">{counts[d]}</span>
            <span className="bar-fill" style={{ height: `${(counts[d] / max) * 100}%` }} />
            <span className="bar-l">{String(d).slice(2)}-te</span>
          </button>
        ))}
      </div>
    </div>
  );
}
