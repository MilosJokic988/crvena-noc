import { useEffect, useRef } from 'react';
import Horns from './Horns.jsx';
import Clock from './Clock.jsx';

export default function Hero({ total, seenCount, onPick }) {
  const videoRef = useRef(null);
  const innerRef = useRef(null);
  const shadeRef = useRef(null);
  const small = typeof window !== 'undefined' && matchMedia('(max-width: 760px)').matches;

  // parallax na pomeranje miša + tamnjenje i zamagljivanje pri skrolovanju
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let mx = 0, my = 0, cx = 0, cy = 0, raf;
    const onMove = (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; };
    addEventListener('pointermove', onMove);
    const frame = () => {
      const y = scrollY, p = Math.min(y / innerHeight, 1);
      if (!reduce && videoRef.current && innerRef.current) {
        cx += (mx - cx) * 0.06; cy += (my - cy) * 0.06;
        videoRef.current.style.transform = `translate3d(${-cx * 28}px, ${-cy * 18 + y * 0.25}px, 0) scale(${1 + p * 0.08})`;
        innerRef.current.style.transform = `translate3d(${cx * 10}px, ${y * -0.15}px, 0)`;
        innerRef.current.style.opacity = String(1 - p * 1.3);
        innerRef.current.style.filter = `blur(${p * 6}px)`;
      }
      if (shadeRef.current) shadeRef.current.style.opacity = String(p * 0.85);
      raf = requestAnimationFrame(frame);
    };
    frame();
    videoRef.current?.play().catch(() => {});
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', onMove); };
  }, []);

  return (
    <header className="hero" id="top">
      <div className="poster" style={{ backgroundImage: "url(poster.jpg)" }} aria-hidden="true" />
      <video ref={videoRef} autoPlay muted loop playsInline preload="auto" poster="poster.jpg" aria-hidden="true">
        {small ? (
          <source src="hero-mobile.mp4" type="video/mp4" />
        ) : (
          <>
            <source src="hero.webm" type="video/webm" />
            <source src="hero.mp4" type="video/mp4" />
          </>
        )}
      </video>
      <div className="shade" ref={shadeRef} />

      <Clock />

      <div className="hero-inner" ref={innerRef}>
        <div className="kicker">{total} najboljih horor filmova svih vremena</div>
        <h1>
          <span className="title-wrap">
            <Horns className="title-horns" />
            <span className="flick">Crvena</span>
          </span>
          <br />
          <span className="flick b">noć</span>
        </h1>
        <p className="sub">
          Najbolje ocenjeni horori, od nemog filma do danas. Uz svaki film: kratak opis,
          ocene kritičara i publike i po jedna zanimljivost.
        </p>
        <div className="meta">
          <span>Filmova <b>{total}</b></span>
          <span>Od <b>1920.</b> do <b>2026.</b></span>
          <span>Odgledao si <b>{seenCount}</b></span>
        </div>
        <div className="cta">
          <button className="btn red" onClick={onPick}>Šta da gledam večeras?</button>
          <a className="btn" href="#lista">Pregledaj listu</a>
        </div>
      </div>
      <div className="scrollhint">Skroluj</div>
    </header>
  );
}
