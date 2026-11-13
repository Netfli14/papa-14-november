---
name: A birthday album for Dad
description: A Russian birthday gift built from family photographs, a calendar, chess and a future letter.
colors:
  paper: "#f5f1e9"
  white: "#fffcf6"
  grey: "#e5e1dc"
  ink: "#353431"
  muted: "#6d6761"
  rose: "#c6647a"
  deep-rose: "#984258"
  pink: "#f0dce1"
  border: "#c9c1b7"
  ink-hover: "#4c4842"
  deep-rose-hover: "#7e3448"
  board-light: "#ede6da"
  board-dark: "#a99d94"
  board-selected: "#d2a7b2"
  board-check: "#bd7b86"
typography:
  display:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "clamp(68px, 7.3vw, 96px)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "48px"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "32px"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.65
  button:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
  caption:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  square: "0"
  pill: "999px"
  circle: "50%"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
  2xl: "64px"
  section: "96px"
components:
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  button-dark-hover:
    backgroundColor: "{colors.ink-hover}"
  button-rose:
    backgroundColor: "{colors.deep-rose}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  button-rose-hover:
    backgroundColor: "{colors.deep-rose-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  button-outline-hover:
    backgroundColor: "{colors.grey}"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    size: "44px"
  date-input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "4px 2px"
    width: "58px"
  letter-field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "6px 0"
  navigation:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "12px 0"
  letter-paper:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "30px 32px"
  calendar-day:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
  calendar-day-selected:
    backgroundColor: "{colors.deep-rose}"
    textColor: "{colors.white}"
---

# Design System: A birthday album for Dad

## Overview

**Creative North Star: "A birthday album for Dad"**

The implemented direction is warm paper, grey ink, restrained rose and real family photographs. Lora supplies the large headings and italic annotations; Manrope carries controls and supporting text. Generous margins surround tangible photo planes, a stacked calendar and a letter sheet.

This records the code-led build in `src/style.css` and `src/app.js`, with `MASTER.md` as the direction contract. The user-requested depth revision adds the original VentorMe DataRain physics and Coverflow model; provenance is in `docs/ventorme-motion-source.md`. There is no approved raster composition.

**Key Characteristics:**

- Cream, grey and rose with family photographs leading.
- Large serif headings, italic notes and restrained sans-serif controls.
- Physical sheet edges, overlapping photo planes and soft structural shadows.
- Calendar unlock, three available paths and reversible navigation.
- Pausable atmospheric motion and a reduced-motion path.

## Colors

The primary accent is the existing rose family; neutrals form the paper, text and borders. Frontmatter values are normative.

### Primary

- **Deep rose** marks primary letter actions, selected dates, active navigation, emphasis and focus outlines; its hover variant darkens the action.
- **Rose** supplies smaller envelope and atmospheric accents. **Pink** is the pale backing plane, selected hover surface and closing-section fill.

### Neutral

- **Paper** is the page background; **white** is the warmer off-white of photo borders, calendar and letter sheets.
- **Ink** carries text and dark primary actions; **muted** carries supporting copy; **grey** separates quieter surfaces; **border** defines thin dividers and outlined controls.
- The board has its own light/dark neutral squares and rose selection/check states. Preserve those functional distinctions.

## Typography

**Display Font:** Lora, with Georgia and serif fallbacks. **Body Font:** Manrope, with Arial and sans-serif fallbacks. Both families are locally supplied for Cyrillic and Latin; italic Lora is used for captions and emphasis.

The frontmatter hierarchy describes the desktop hero, fork heading, wish title, base body and navigation. Other implemented headings are the gate (`clamp(54px, 5.9vw, 84px)`), wishes (43px), chess (68px) and letter (57px). Supporting copy commonly uses a more open line-height (1.9); wish copy is limited to 40ch. Caption size and heading size reduce with their component at narrower widths. No uppercase label system is present.

## Layout

Content is centered within 1184px. Desktop uses two-column compositions: cover (1.1fr/1fr), wishes (.92fr/1.18fr), chess and letter (.9fr/1.1fr). The three branch links form an open three-column fork, with objects and connecting SVG lines rather than repeated filled cards. The gate has its own 1100px container and seven-column calendar.

The declared spacing scale is in frontmatter; the build also uses local component measurements. At 1280px and below, main gutters become 48px. At 760px and below, gutters become 24px and compositions stack; at 380px and below, main gutters become 20px. Mobile wishes show heading, photos, wish text, then controls. Mobile chess shows heading and introduction, board, then opponent details and actions. Wish dots are hidden at 1000px and below; arrow controls remain. The secondary letter photograph is hidden on mobile. Exact overlapping media rules remain in the source.

## Elevation & Depth

Depth is structural: real photographs occupy foreground, middle and background planes, with a pale arched backing sheet. The cover uses perspective (1100px), a main photo at +70px, foreground photo at +120px and background photos at -60px/-30px. A pointer tilt and scroll parallax move these planes. The calendar has perspective (1000px), two rotated backing sheets and a raised lock. The letter is a slightly rotated sheet over a second sheet. The chessboard is tilted (3deg) with a visible lower edge.

Current shadow groups, including the stronger revised photo, sheet and board shadows, are captured exactly in the sidecar. They supersede the softer base photo shadow where the CSS cascade does so. DataRain remains behind the content, with desktop opacity (.48), mobile opacity (.32) and reduced-motion opacity (.22). Its continuous field pauses through the control, page visibility and chess/letter routes. Do not interpret the earlier no-loop direction in `MASTER.md` as describing this later user-requested renderer.

## Shapes

Paper and photo surfaces have square edges. Primary actions are pills; icon controls and calendar selections are circular. Photos have off-white framing on all four sides with a wider caption edge. The arch behind the cover photos and the rounded lock silhouette are specific physical objects, not a general card-radius system. Thin strokes, inline SVG icons and folded-envelope geometry complement the sheets.

## Components

### Buttons

Dark, rose and outlined pills share the documented padding, a 54px minimum height and a 32px content gap. Hover changes background in 150ms; press moves the control down (1px). Contexts reduce size, including the chess action (46px desktop, 44px mobile). Icon controls are 44px circles. Disabled buttons use opacity (.4). Focus-visible uses a deep-rose outline (2px) with a 5px offset; board squares use an inset outline.

### Inputs / Fields

Date inputs are transparent, square-edged serif fields (20px desktop) with a bottom border. The letter textarea is borderless Lora (16px, line-height 2), on the off-white sheet, vertically resizable, with a 260px minimum height; mobile uses 15px and 280px. Preserve the focus outline and visible status/error text.

### Navigation

The header uses small Manrope text, a serif wordmark and a fine bottom divider. Hover and current-page states use deep rose. Mobile navigation wraps into a full-width row. Back links and the three branch links keep all activities available independently of the chess result. Route changes use a 280ms entry and focus the destination heading.

### Calendar gate

The raised calendar shows a circular selected day, previous/next month controls and editable date fields. November 14 unlocks the gift. The shackle opens (250ms), the lock falls (700ms after a 100ms pause), and the gate fades (250ms with overlap). Wrong dates retain the form with an inline error and a short shake. Reduced motion or a user pause opens immediately. Explicit word groups keep the gate heading separate from the calendar at all breakpoints. Date selection restores keyboard focus, and mobile day targets have a 44px minimum height.

### Photo album and Coverflow

Ten real photo/wish pairs use the VentorMe offset model: horizontal spacing (165px, or 142px below 760px), depth `-abs(offset) * 180px`, rotation Y `-offset * 38deg`, scale `max(1 - abs(offset) * .14, .4)`. At most seven cards are visually present; only the active card is exposed to assistive technology. Cards turn in 600ms with `power3.out`; text fades out/in (150ms/300ms). Buttons, horizontal swipe and arrow keys navigate, with disabled boundaries. Paused or reduced-motion positioning uses only the active, flat card. Desktop cards are 310px wide, with 265px/250px/230px responsive sizes.

### Chess

The quiet neutral board uses SVG pieces, distinct selected/check/last-move states, legal-move marks, coordinates and roving keyboard focus. Real local Stockfish 17.1 plays black with `UCI_LimitStrength` and `UCI_Elo=1320`; the nearest setting to 1300 is disclosed. Engine readiness/error states, undo, new game and promotion choices remain visible parts of the interface.

### Letter sheet

The letter preserves its local draft, shows the character count, and disables editing while submitting. Only an accepted service response reveals the envelope and its 600ms entry. A failed request keeps the draft and reveals email/download fallbacks. In-page transport remains unverified after browser and host timeouts, and recipient activation is also required; see `docs/validation.md`. The success state must not imply verified inbox delivery or scheduled sending.

## Do's and Don'ts

### Do:

- **Do** retain the existing cream, grey and rose palette and Lora/Manrope pairing.
- **Do** lead with the supplied family photographs and preserve their caption borders and distinct depth planes.
- **Do** preserve focus outlines, keyboard navigation, motion pause and reduced-motion state changes.
- **Do** keep all three paths available and retain honest engine and letter status text.

### Don't:

- **Don't** replace the open three-way fork with repeated filled feature cards.
- **Don't** add noise textures, decorative gradients or invented biographical claims.
- **Don't** use long dashes in displayed Russian copy.
- **Don't** show an accepted-letter state after a failed request or claim verified delivery.
