- extract the pointers handle logic from CanvasStage to usePointerControls hook.
- change the zoom on scroll to pan on scroll (for touch pan, scrollX -> panX, scrollY -> panY)

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