- Change the stroke color of already drawn element on canvas when toggle the theme

### Stale Closure Risk (Important)

usePointerControls hook uses:

- camera
- currentTool
- forcePan
- onPointerDown
- onPointerMove
- onPointerUp
- zoomAt

Because handlers are recreated every render, It's safe.

But if later optimize with useCallback,
MUST include those in dependency arrays.

Right now it’s fine.

Just remember this if optimize later.