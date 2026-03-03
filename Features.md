- work on zoom and history buttons, fix the zoom using zoom buttons and display the zoom value in zoom controls
- disable zoom in and zoom out control when reach the zoom in and zoom out limit
- disable the redo or undo button when redo or undo stack is empty

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