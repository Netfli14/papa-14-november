# Validation

## Continuation, 12 November 2026

- Calendar title now uses explicit word groups with real spaces. Checked in fresh browser-session iframes at widths 320, 375, 768, 1024 and 1440: no horizontal document overflow and no title/calendar intersection. The heading's accessible text is “Есть одна особенная дата.” at every width.
- Calendar day selection retains keyboard focus after rendering; selecting November 14 leaves focus on that day. The wrong-date error and correct-date unlock were exercised. Calendar day targets and the motion toggle now have a 44px minimum height; the toggle accounts for device safe-area insets.
- Pausing immediately resets pointer tilt, removes scroll-linked movement and shows one flat album photograph. Resume restores the original VentorMe Coverflow geometry. Short state transitions also respect the pause. Tested through the real pause control, not an injected state.
- Opened home, wishes, chess and letter at all five iframe widths: zero horizontal document overflow and no broken loaded photographs. These are responsive browser checks, not physical-device testing.
- All ten wishes were reached with the real next control; the last title was “Мы тебя очень любим.” and the next control was disabled.
- Browser chess: illegal e2-e5 rejected; e2-e4 accepted; Stockfish returned a move; undo restored zero moves. The Node integration check also passed with three legal engine replies, promotion, mate, stalemate and PGN restore.
- Letter draft survived route changes and a frame reload. The temporary QA draft was cleared through the editor. No test email was sent in this continuation; the unresolved transport/activation limit below remains.
- Opening the gift now focuses its heading instead of outlining the entire main element. The mobile chess heading retains a space after its comma.
- OS-level reduced motion and a Performance trace remain unverified. No measured frame-rate claim is made.

## Earlier verification

- Real Stockfish 17.1 lite single-thread WASM initialized in Chrome and Node. UCI_Elo min 1320 confirmed from the binary. Three legal engine replies, PGN restore, promotion choices, checkmate and stalemate passed the integration check.
- Browser: wrong date stays locked; November 14 opens the gift after the lock falls. Home, fork, wishes, chess, letter and back navigation were exercised.
- Browser: e2-e5 rejected, e2-e4 accepted, e7-e5 returned by engine; undo removes a full turn; new game resets the count. Same chess interactions checked at phone width.
- Wishes: buttons and direct navigation to the final wish, boundary disabling, actual photo/word pairing and 3D Coverflow inspected.
- Draft persistence across navigation checked. Sender loading/error states checked. Text survives a failed request, email fallback and text download are available.
- Email transport is NOT verified. FormSubmit POST timed out from the browser and the host. Requests were changed to URL-encoded form submission to avoid preflight, but the second browser request also timed out. A standard HTML POST to the service was also tested and timed out; no further retries were attempted. No success screen was falsely displayed. Recipient activation is a further service requirement. Do not claim inbox delivery.
- Layout inspected at iframe widths 375, 768, 1024 and 1440; no horizontal document overflow in home, wishes and chess. One-pixel letter overflow at 375 was fixed and rechecked. These are responsive browser checks, not physical phone testing.
- Key screenshots are internal under /workspace/shared/papa-review, outside the source tree.
- Contrast computed: ink/paper 11.05:1, muted/paper 4.95:1, deep rose/paper 5.73:1, white/deep rose 6.30:1, deep rose/pink 4.92:1.
- Reduced motion has a static particle frame and skips translations. OS-level reduced-motion and a Chrome Performance recording were not run. Do not claim a measured frame rate.
- Impeccable detector ran once on source and returned no findings; it warned that the build-only stylesheet path could not resolve from source. Separate full CSS audit and direct color calculations were used.
- Syntax, built assets, all 12 chess SVGs and all used local font/image references passed scripts/check.mjs.
