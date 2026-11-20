import { useEffect, useState } from 'react';

const pad = (n) => String(n).padStart(2, '0');

// Sat u realnom vremenu (vreme uređaja) + koliko je još ostalo do ponoći.
export default function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let id;
    const tick = () => {
      setNow(new Date());
      // poravnaj sa početkom sledeće sekunde da otkucaji budu tačni
      id = setTimeout(tick, 1000 - (Date.now() % 1000));
    };
    id = setTimeout(tick, 1000 - (Date.now() % 1000));
    return () => clearTimeout(id);
  }, []);

  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  let left = Math.floor((midnight - now) / 1000);
  const lh = Math.floor(left / 3600);
  left -= lh * 3600;
  const lm = Math.floor(left / 60);
  const ls = left - lm * 60;

  const date = now.toLocaleDateString('sr-Latn', { weekday: 'long', day: 'numeric', month: 'long' });
  const isWitching = now.getHours() < 4;

  return (
    <div className="clock" aria-label="Trenutno vreme">
      <div className="clock-cap">Sada je · {date}</div>
      <div className="clock-digits">
        <div><span className="n">{pad(now.getHours())}</span><span className="l">sati</span></div>
        <span className="sep">:</span>
        <div><span className="n">{pad(now.getMinutes())}</span><span className="l">min</span></div>
        <span className="sep">:</span>
        <div><span className="n sec">{pad(now.getSeconds())}</span><span className="l">sek</span></div>
      </div>
      <div className="clock-foot">
        {isWitching
          ? 'Vreme veštica. Savršeno za horor.'
          : <>Do ponoći još <b>{pad(lh)}:{pad(lm)}:{pad(ls)}</b></>}
      </div>
    </div>
  );
}
