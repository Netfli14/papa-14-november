# Для папы

Personal birthday gift for November 14, 2026. Static HTML/CSS, GSAP, chess.js and a local Stockfish 17.1 single-thread WASM worker. All family images and fonts are served locally.

## Build and verify

Install dependencies with `npm ci`, run `npm run build`, then `node scripts/check.mjs`. The output is `dist/`. Serve that directory through HTTP. All local URLs work from either a domain root or a GitHub Pages project subdirectory.

The workflow in `.github/workflows/pages.yml` builds and verifies every push. GitHub Pages publication can be started manually after configuring the repository. See [GitHub Pages setup](docs/github-pages.md).

## Experience

Select November 14 to open the birthday puzzle. Home leads to photo wishes, a full chess game with the native 1320 Elo limiter and a letter editor. The calendar is a gift reveal; hosting access controls determine who may view the site. Drafts and game PGN stay on the current browser.

The depth revision ports the actual DataRain renderer and Coverflow geometry from the user's VentorMe source; provenance is in `docs/ventorme-motion-source.md`. Motion can be paused and honors reduced motion.

## Email

The letter form submits now to `yerzhanuly.y@nisa.edu.kz` through FormSubmit. First use requires recipient activation. The birthday date in the letter is a suggested opening date; the site does not schedule email delivery for next year. Actual delivery could not be certified in the development environment: the service timed out. Errors preserve the draft and expose a mailto link and a UTF-8 text download.

FormSubmit documentation: https://formsubmit.co/documentation

## Attribution

Family photographs were supplied by the user. Fonts: Lora and Manrope, SIL OFL. Chess pieces: Cburnett, CC BY-SA 3.0, from Lichess. Stockfish is an unchanged separate GPLv3 worker, with license and corresponding source linked at `/engine-source.html`. Font licenses are included in the public directory. Internal QA captures and the responsive testing harness are not published.
