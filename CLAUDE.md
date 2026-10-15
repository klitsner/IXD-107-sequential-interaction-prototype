# Project notes for Claude

- Make all changes on the `main` branch unless told otherwise.
- Live web pages are published with GitHub Pages from the `main` branch, `/ (root)` folder. Put pages (e.g. `index.html`) at the repo root.
- Live site: https://klitsner.github.io/IXD-107-sequential-interaction-prototype/

## How to ask questions
Use the AskUserQuestion tool for every question. Do not write questions as a list in your reply.
- Ask one question at a time and wait for the answer before asking the next.
- For each question, offer 2–4 suggested answers based on what you found in the repository. The user can always pick "Other" to type their own.
- When you're done asking, summarize the answers and your plan in plain language, then wait for an OK before coding.

## Preview before deploying
Every change to the live site goes to a preview artifact first:
- Preview artifact: https://claude.ai/artifact/Mec3JZ84YvRGGX1uETS1fT
- After editing, republish `index.html` to that artifact URL (pass it as `url`), including `css/`, `js/` and `assets/` as supporting files.
- Share the preview link and wait for the user's OK before committing and pushing to `main` (pushing to `main` deploys to GitHub Pages).
