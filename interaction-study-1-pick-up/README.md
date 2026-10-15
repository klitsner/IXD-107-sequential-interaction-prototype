# Interaction Study 1 · Pick Up · Drafty

A statement sheet lies face down on a grid. Every 1.5 seconds a draft lifts and curls its bottom edge, showing red lines of text on the other side.

- **Source artifact:** https://claude.ai/artifact/7P97y32gFJouqmhELNNf25
- **Live page:** https://klitsner.github.io/IXD-107-sequential-interaction-prototype/interaction-study-1-pick-up/

## How to interact
- Hover over the sheet: the bottom edge lifts and holds.
- Press and drag up: peel the whole sheet off the floor.
- ↺ (top right) resets the study.

## Files
- `index.html` — the complete artifact, copied unchanged from the published version. All CSS, JavaScript and SVG assets are inline.

## Setup and dependencies
None. There are no external libraries, fonts, images or network requests.

- **Run locally:** open `index.html` in a modern desktop browser (Chrome, Edge, Firefox, Safari). Or serve the folder, for example `python3 -m http.server`, and visit `http://localhost:8000/interaction-study-1-pick-up/`.
- **Input:** mouse or pen only. Touch input is ignored by design.
- **Sound:** uses the Web Audio API. Audio starts after your first click on the page.
