# mega-s01e03-what-it-shows

MEGA.dev course, Challenge S01E03 ("what it shows").

The support desk merged 412 date reports into one ticket, #4471, and marked it known.
This repo splits it into the problems it really holds:

- the issues in this repo are the desk's tickets, one per problem, each with its report count;
- `kb/` is the desk's knowledge base export, with a build setup and our signed page added;
- `rendered/` is our page as the desk sees it (the built HTML).

Build the kb yourself: `cd kb && npm install && npm run build` (pages land in `kb/build/`).
