# Project notes for Claude

- Make all changes on the `main` branch unless told otherwise.
- Live web pages are published with GitHub Pages from the `main` branch, `/ (root)` folder. Put pages (e.g. `index.html`) at the repo root.
- Live site: https://klitsner.github.io/IXD-107-sequential-interaction-prototype/

## How to ask questions
Use the AskUserQuestion tool for every question. Do not write questions as a list in your reply.
- Ask one question at a time and wait for the answer before asking the next.
- For each question, offer 2–4 suggested answers based on what you found in the repository. The user can always pick "Other" to type their own.
- When you're done asking, summarize the answers and your plan in plain language, then wait for an OK before coding.

## Preview while GitHub Pages deploys
Every change to the live site is published to a preview artifact too, so it can be viewed while GitHub Pages builds and deploys:
- Preview artifact: https://claude.ai/artifact/Mec3JZ84YvRGGX1uETS1fT
- After editing, commit and push to `main` (this deploys to GitHub Pages), and republish `index.html` to that artifact URL (pass it as `url`), including any changed files in `css/`, `js/` and `assets/` as supporting files.
- Share the preview link so the change can be viewed right away; the live site catches up once the GitHub Pages deployment finishes.
