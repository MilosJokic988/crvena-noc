# Crvena noć — 100 najboljih horor filmova

React + Vite sajt sa 100 najbolje ocenjenih horor filmova (ocene: Rotten Tomatoes).

## Pokretanje u VS Code-u

Potreban je [Node.js](https://nodejs.org) 20 ili noviji.

1. Raspakuj folder i otvori ga u VS Code-u (**File → Open Folder…**).
2. Otvori terminal (**Terminal → New Terminal**) i pokreni:

```bash
npm install
npm run dev
```

3. Otvori adresu koju terminal ispiše (obično http://localhost:5173).

Za verziju spremnu za postavljanje na internet: `npm run build` (rezultat je u folderu `dist/`).

## Gde je šta

```
public/                 video u pozadini (hero.mp4, hero.webm, hero-mobile.mp4), poster.jpg i favicon.svg
src/
  App.jsx               glavna stranica: lista, filteri, pretraga, sortiranje
  index.css             svi stilovi (boje su na vrhu, u :root)
  data/films.js         100 filmova: rang, naslov, godina, ocene, reditelj, zemlja, žanr, opis, zanimljivost
  data/genres.js        nazivi žanrova
  components/
    Hero.jsx            naslovna sa videom, sigilom i satom
    Clock.jsx           sat u realnom vremenu + odbrojavanje do ponoći
    Sigil.jsx           mistični sigil (SVG): sam se iscrta, prsten se okreće, tinja
    Embers.jsx          žar koji lebdi i reaguje na miš/klik
    FilmRow.jsx         jedan film u listi
    Meter.jsx           traka sa ocenom
    DecadeChart.jsx     grafikon po decenijama (klik filtrira)
    Picker.jsx          „Šta da gledam večeras?“
    Nav.jsx             gornja navigacija + dugme za zvuk
  hooks/
    useLocalStorage.js  pamti odgledane filmove u pregledaču
    useAmbientSound.js  ambijentalni zvuk generisan u pregledaču (bez audio fajla)
```

## Dodavanje ili izmena filma

U `src/data/films.js` svaki film je jedan red:

```js
[rang, "Naslov", godina, kritičari%, publika%, "Reditelj", "Zemlja", ["žanr"], "Opis.", "Zanimljivost." /* ili null */],
```

Šifre žanrova: `nat` natprirodno, `psi` psihološki, `cud` čudovišta, `vam` vampiri, `zom` zombiji,
`sle` slešer, `folk` folk horor, `sf` sci-fi horor, `kom` horor komedija.

## Napomene

- Ocene su preuzete 20. novembra 2026. sa liste „The 200 Best Horror Movies of All Time“ na Rotten Tomatoes i vremenom se menjaju.
- Pozadinski video je isečen iz snimka ekrana YouTube videa. Pre javnog objavljivanja zameni ga snimkom za koji imaš prava (npr. sa Pexels-a ili Pixabay-a) — samo ubaci nove fajlove u `public/` pod istim imenima.
