# IXD-107-sequential-interaction-prototype
Project 2 interaction prototype for IXD 107, built with Claude Code and published with GitHub Pages.

**Live site:** https://klitsner.github.io/IXD-107-sequential-interaction-prototype/

## Sequential interaction prototype
A credit card statement is picked up off the floor, then flipped over to reveal a large overdue balance. You crush the paper, it drops to the ground, and you try to throw it in the trash can.

The sequence is linear: each action unlocks only after the previous one succeeds.

1. **Pick up:** the statement lies face down while a draft curls its edge. Hover to lift the edge, then drag up to peel it off the floor.
2. **Flip:** hover near an edge until a glove grips it, then drag across to turn the sheet over.
3. **Crumple:** hover until two hands appear, then press and hold to crush the sheet into a ball.
4. **Throw:** grab the ball and flick it at the can. Each miss adds 3% interest to the debt. A hit clears it to $0.00, and a ↺ button appears to start over.

Use a mouse or pen on a desktop browser (touch is ignored). The scene fills the window and scales with it. Sound plays through the Web Audio API and starts after your first click.

### Files
| Path | What it is |
| --- | --- |
| `index.html` | The page |
| `css/style.css` | Page layout |
| `js/core.js` | Shared canvas scaling, audio and drawing helpers |
| `js/step1-pickup.js` … `js/step4-throw.js` | One file per step, adapted from the matching study |
| `js/sequence.js` | Runs the steps in order and handles the reset |
| `assets/svg/` | Statement, can, glove and ball artwork extracted from the studies |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

There is no build step: the files above are both the editable source and what GitHub Pages publishes. To run it locally, open `index.html` in a browser, or run `python3 -m http.server` in the repository folder and visit `http://localhost:8000/`.

## Interaction studies
Each study is a self-contained page in its own folder:

| Study | Folder | Live page |
| --- | --- | --- |
| 1 · Pick up · Drafty | [`interaction-study-1-pick-up/`](interaction-study-1-pick-up/) | https://klitsner.github.io/IXD-107-sequential-interaction-prototype/interaction-study-1-pick-up/ |
| 2 · Flip · Curious | [`interaction-study-2-flip/`](interaction-study-2-flip/) | https://klitsner.github.io/IXD-107-sequential-interaction-prototype/interaction-study-2-flip/ |
| 3 · Crumple · Crushing | [`interaction-study-3-crumple/`](interaction-study-3-crumple/) | https://klitsner.github.io/IXD-107-sequential-interaction-prototype/interaction-study-3-crumple/ |
| 4 · Throw · Liberating | [`interaction-study-4-throw/`](interaction-study-4-throw/) | https://klitsner.github.io/IXD-107-sequential-interaction-prototype/interaction-study-4-throw/ |

The studies use a mouse or pen (touch is ignored) and play sound through the Web Audio API.

## Other pages
- [`hello/`](hello/): the original "Hello wordl!" test page — https://klitsner.github.io/IXD-107-sequential-interaction-prototype/hello/
