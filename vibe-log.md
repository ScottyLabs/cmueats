# Vibe Log

## Styling Enhancements
- Eatery cards redesigned with glassy panels, refreshed headers/content, highlight chips, and bottom-aligned actions.
- Card hover/focus feedback tweaked; headers now fit rounded corners.
- List header compacted with full-width greeting and integrated search/filter row.
- Added centered CMUEats icon (`src/assets/cmueats-icon.svg`) above header.
- `More` menu button now swaps icons to indicate pinned (Pin) or hidden (EyeOff) status in card footer.
- Dropdown raises its host card to avoid being obscured by neighboring cards.

## Interaction Updates
- Entire card opens the detail drawer; drawer includes close button and menu of pin/hide actions via new dropdown.
- Pinning floats cards to the top; hiding drops them to the end.
- Drawer context refactored into `src/contexts/DrawerContext.tsx` with memoized provider.

## Infrastructure & Linting
- Added `src/util/logger.ts` and swapped error logging to avoid production consoles.
- Fixed lint issues, removed unused props/imports, stabilized hooks, and ensured `bun lint` passes cleanly.

## Assets
- Introduced custom CMUEats SVG icon.
