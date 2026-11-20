import { useRef, useState } from 'react';

// Ambijentalni zvuk (vetar, zujanje, pucketanje) generisan Web Audio API-jem, bez audio fajla.
export default function useAmbientSound() {
  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const [on, setOn] = useState(false);

  function build() {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    const master = ac.createGain();
    master.gain.value = 0;
    master.connect(ac.destination);

    // vetar: braon šum kroz pokretni band-pass filter
    const len = ac.sampleRate * 4;
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.2;
    }
    const noise = ac.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 420;
    bp.Q.value = 0.7;
    const lfo = ac.createOscillator();
    const lfoGain = ac.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain).connect(bp.frequency);
    const windGain = ac.createGain();
    windGain.gain.value = 0.55;
    noise.connect(bp).connect(windGain).connect(master);
    noise.start();
    lfo.start();

    // nisko zujanje
    [55, 82.4].forEach((f, i) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      const lp = ac.createBiquadFilter();
      o.type = 'sawtooth';
      o.frequency.value = f;
      o.detune.value = i ? 7 : -5;
      lp.type = 'lowpass';
      lp.frequency.value = 180;
      g.gain.value = 0.05;
      o.connect(lp).connect(g).connect(master);
      o.start();
    });

    // pucketanje žara
    const cbuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const cd = cbuf.getChannelData(0);
    for (let i = 0; i < cd.length; i++) cd[i] = Math.random() < 0.0009 ? (Math.random() * 2 - 1) * 0.9 : 0;
    const crackle = ac.createBufferSource();
    crackle.buffer = cbuf;
    crackle.loop = true;
    const hp = ac.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1500;
    const cg = ac.createGain();
    cg.gain.value = 0.35;
    crackle.connect(hp).connect(cg).connect(master);
    crackle.start();

    ctxRef.current = ac;
    masterRef.current = master;
  }

  async function toggle() {
    try {
      if (!ctxRef.current) build();
      const ac = ctxRef.current;
      if (ac.state === 'suspended') await ac.resume();
      const next = !on;
      masterRef.current.gain.cancelScheduledValues(ac.currentTime);
      masterRef.current.gain.setTargetAtTime(next ? 0.5 : 0, ac.currentTime, 0.6);
      setOn(next);
    } catch {
      /* zvuk nije dostupan */
    }
  }

  return [on, toggle];
}
