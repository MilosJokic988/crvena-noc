export const GENRES = {
  nat: 'Natprirodno',
  psi: 'Psihološki',
  cud: 'Čudovišta',
  vam: 'Vampiri',
  zom: 'Zombiji',
  sle: 'Slešer',
  folk: 'Folk horor',
  sf: 'Sci-fi horor',
  kom: 'Horor komedija',
};

// Pretvara niz iz films.js u objekat sa imenovanim poljima.
export const toFilm = ([rank, title, year, critics, audience, director, country, genres, blurb, fact]) => ({
  rank, title, year, critics, audience, director, country, genres, blurb, fact,
  decade: Math.floor(year / 10) * 10,
});
