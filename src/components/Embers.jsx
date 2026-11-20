import { useEffect, useRef } from 'react';

// Žar koji lebdi preko cele stranice, beži od kursora i rasprsne se na klik.
// Druge komponente mogu da izazovu prasak preko window.dispatchEvent(new CustomEvent('ember-burst', {detail:{x,y,n}})).
export default function Embers() {
  const ref = useRef(null);

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const c = ref.current;
    const x = c.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const small = innerWidth < 760;
    let W, H, raf, t = 0;
    let px = -1e4, py = -1e4;

    const size = () => { W = c.width = innerWidth * DPR; H = c.height = innerHeight * DPR; };
    size();

    const spawn = (sx, sy, burst) => {
      const a = burst ? Math.random() * Math.PI * 2 : -Math.PI / 2 + (Math.random() - 0.5) * 0.8;
      const sp = burst ? 1 + Math.random() * 4.5 : 0.25 + Math.random() * 0.7;
      return {
        x: sx ?? Math.random() * W, y: sy ?? H + Math.random() * H * 0.3,
        vx: Math.cos(a) * sp * DPR, vy: Math.sin(a) * sp * DPR,
        r: (Math.random() * 1.6 + 0.6) * DPR, life: 0,
        max: burst ? 60 + Math.random() * 60 : 400 + Math.random() * 500,
        seed: Math.random() * 1000, hue: 14 + Math.random() * 22, burst: !!burst,
      };
    };
    const P = [];
    for (let i = 0; i < (small ? 45 : 90); i++) { const p = spawn(); p.y = Math.random() * H; P.push(p); }

    const burst = (bx, by, n) => { for (let i = 0; i < n; i++) P.push(spawn(bx * DPR, by * DPR, true)); };
    const onMove = (e) => { px = e.clientX * DPR; py = e.clientY * DPR; };
    const onLeave = () => { px = py = -1e4; };
    const onClick = (e) => { if (!e.target.closest('button,a,summary,input,select,label')) burst(e.clientX, e.clientY, 22); };
    const onBurst = (e) => burst(e.detail.x, e.detail.y, e.detail.n || 24);

    addEventListener('resize', size);
    addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeave);
    addEventListener('click', onClick);
    addEventListener('ember-burst', onBurst);

    const draw = () => {
      t++;
      x.clearRect(0, 0, W, H);
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i];
        p.life++;
        p.vx += Math.sin((t + p.seed) * 0.02) * 0.012 * DPR;
        if (p.burst) { p.vx *= 0.96; p.vy = p.vy * 0.96 - 0.03 * DPR; }
        const dx = p.x - px, dy = p.y - py, d2 = dx * dx + dy * dy, R = 130 * DPR;
        if (d2 < R * R) { const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 1.6; p.vx += (dx / d) * f * 0.4; p.vy += (dy / d) * f * 0.4; }
        if (!p.burst) { p.vx *= 0.985; p.vy = p.vy * 0.985 + (-0.45 * DPR - p.vy) * 0.01; }
        p.x += p.vx; p.y += p.vy;
        const k = p.life / p.max;
        const flick = 0.6 + 0.4 * Math.sin((t + p.seed) * 0.25);
        const alpha = Math.max(0, k < 0.1 ? k * 10 : 1 - Math.max(0, k - 0.6) / 0.4) * flick;
        if (k >= 1 || p.y < -20 || p.x < -40 || p.x > W + 40) { P.splice(i, 1); if (!p.burst) P.push(spawn()); continue; }
        const g = x.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, `hsla(${p.hue + 20},100%,75%,${alpha})`);
        g.addColorStop(0.25, `hsla(${p.hue},100%,55%,${alpha * 0.7})`);
        g.addColorStop(1, `hsla(${p.hue},100%,40%,0)`);
        x.fillStyle = g;
        x.beginPath(); x.arc(p.x, p.y, p.r * 5, 0, 7); x.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', size);
      removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      removeEventListener('click', onClick);
      removeEventListener('ember-burst', onBurst);
    };
  }, []);

  return <canvas ref={ref} className="embers" aria-hidden="true" />;
}

export const emberBurst = (x, y, n) =>
  window.dispatchEvent(new CustomEvent('ember-burst', { detail: { x, y, n } }));
