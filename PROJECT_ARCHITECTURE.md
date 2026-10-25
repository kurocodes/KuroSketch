# KuroSketch Project Architecture

KuroSketch is a React + TypeScript sketching app built around the HTML Canvas API. React manages application state, UI controls, themes, tool selection, and history. The canvas layer renders the drawing model manually, using Rough.js for hand-drawn-looking strokes.

The important mental model is:

```text
Pointer / keyboard input
  -> App state and canvas hooks
  -> active tool handler
  -> drawing elements / history / camera state
  -> CanvasStage redraws every element
```

Unlike SVG-based editors, the canvas does not keep separate DOM nodes for every shape. KuroSketch stores all drawn content as plain `DrawingElement` objects, clears the canvas, applies the camera transform, and redraws the full scene whenever the drawing state changes.

## Folder Structure

```text
KuroSketch/
+-- README.md
+-- Features.md
+-- package.json
+-- package-lock.json
+-- index.html
+-- vite.config.ts
+-- tsconfig.json
+-- tsconfig.app.json
+-- tsconfig.node.json
+-- eslint.config.js
+-- public/
|   +-- vite.svg
+-- src/
    +-- main.tsx
    +-- App.tsx
    +-- App.css
    +-- index.css
    +-- assets/
    |   +-- react.svg
    +-- canvas/
    |   +-- camera.ts
    |   +-- elementUtils.ts
    |   +-- hitTest.ts
    |   +-- renderer.ts
    |   +-- tools.ts
    |   +-- types.ts
    |   +-- tools/
    |       +-- eraser.ts
    |       +-- pan.ts
    |       +-- pencil.ts
    |       +-- selection.ts
    |       +-- shapeTool.ts
    |       +-- text.ts
    +-- components/
    |   +-- canvas/
    |   |   +-- CanvasStage.tsx
    |   +-- controls/
    |   |   +-- ControlButton.tsx
    |   |   +-- HistoryControls.tsx
    |   |   +-- ThemeToggle.tsx
    |   |   +-- ZoomControls.tsx
    |   +-- label/
    |   |   +-- Label.tsx
    |   +-- overlays/
    |   |   +-- HelpButton.tsx
    |   |   +-- InfoModal.tsx
    |   |   +-- TextEditor.tsx
    |   +-- toolbar/
    |       +-- Toolbar.tsx
    |       +-- ToolButton.tsx
    |       +-- tools.config.ts
    +-- hooks/
    |   +-- useCamera.ts
    |   +-- useCanvas.ts
    |   +-- useHistory.ts
    |   +-- useKeyboard.ts
    |   +-- useKeyState.ts
    |   +-- usePointerControls.ts
    |   +-- useTheme.ts
    +-- theme/
        +-- ThemeContext.ts
        +-- ThemeProvider.tsx
        +-- theme.ts
        +-- useThemeContext.ts
```

## Root Files

`README.md` explains the goal of the project: a minimal sketching app built from scratch to understand drawing engines, canvas rendering, element models, history, pan, zoom, and interaction logic.

`package.json` defines the app stack: React, TypeScript, Vite, Tailwind CSS, Motion, React Icons, and Rough.js.

`index.html` is the Vite HTML entry point. It contains the root element that React mounts into.

`vite.config.ts`, `tsconfig*.json`, and `eslint.config.js` are project configuration files for the build tool, TypeScript, and linting.

## Source Entry

### `src/main.tsx`

This is the React entry point. It renders the app into the DOM:

```text
main.tsx
  -> ThemeProvider
  -> App
```

`ThemeProvider` wraps the app so every component can read the active theme colors through context.

### `src/App.tsx`

`App.tsx` is the main composition root. It connects the editor state, canvas engine hooks, and UI controls.

It owns:

- `currentTool`: the active tool, such as `rect`, `selection`, `pencil`, or `pan`.
- `forcePan`: temporary pan mode, mainly enabled by holding Space.
- `textEditor`: screen position for the floating text input.
- `roughGenerator`: Rough.js generator shared from the canvas setup.
- `history`: the committed drawing elements and undo/redo state.
- `camera`: pan and zoom state.
- `theme`: the active theme colors.

It wires these pieces together like this:

```text
App
  -> useHistory()
  -> useCamera()
  -> useKeyboard()
  -> useCanvas()
  -> CanvasStage
  -> Toolbar / ZoomControls / HistoryControls / ThemeToggle / overlays
```

`App` does not draw directly. It passes drawing state and event callbacks into `CanvasStage`, then renders UI components around the full-screen canvas.

## Canvas Data Model

### `src/canvas/types.ts`

This file defines the core model used by every canvas feature.

`ToolType` describes editor tools:

```ts
"line" | "rect" | "ellipse" | "pencil" | "text" | "selection" | "eraser" | "pan"
```

`ElementType` describes drawable element types:

```ts
"line" | "rect" | "ellipse" | "pencil" | "text"
```

The difference matters: tools are actions, elements are saved drawing objects. For example, `selection`, `eraser`, and `pan` are tools, but they do not create their own drawable element type.

Every drawn object is a `DrawingElement`:

```ts
{
  id: string;
  type: ElementType;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke?: StrokeType;
  points?: Point[];
  text?: string;
  seed: number;
}
```

The `x1`, `y1`, `x2`, and `y2` fields are the shared geometry model. Lines, rectangles, and ellipses use them directly. Pencil elements additionally store a `points` array. Text elements store `text`.

The `seed` is used by Rough.js so an element keeps a stable hand-drawn appearance between redraws.

## Canvas Rendering

### `src/components/canvas/CanvasStage.tsx`

`CanvasStage` owns the actual `<canvas>` element and Rough.js canvas instance.

On mount, it:

1. Reads the canvas DOM node through `canvasRef`.
2. Sets the canvas pixel size to `window.innerWidth` and `window.innerHeight`.
3. Creates `rough.canvas(canvas)` for drawing Rough.js shapes.
4. Creates `rough.generator()` and sends it up to `App`.

On every render-relevant state change, it redraws the scene:

```text
clear canvas
save context
translate by camera.x / camera.y
scale by camera.zoom
draw committed elements
draw current preview element
restore context
```

The key code path is:

```text
CanvasStage useEffect
  -> ctx.clearRect(...)
  -> ctx.translate(camera.x, camera.y)
  -> ctx.scale(camera.zoom, camera.zoom)
  -> elements.forEach(drawElement)
  -> drawElement(currentElement)
```

Because the camera transform is applied before drawing, all element coordinates are treated as world coordinates. The canvas can pan and zoom without changing the stored geometry of each element.

### `src/canvas/renderer.ts`

`drawElement` is the central renderer for all drawable element types.

It resolves stroke color first:

- Theme strokes use the current theme color, currently `defaultStroke`.
- Custom strokes can use a direct color value.

Then it renders by element type:

- `line`: `rc.line(x1, y1, x2, y2)`
- `rect`: `rc.rectangle(minX, minY, width, height)`
- `ellipse`: calculates center, width, and height, then calls `rc.ellipse(...)`
- `pencil`: draws a Rough.js `linearPath` from the stored points
- `text`: uses the native canvas `fillText`, not Rough.js

The renderer is intentionally stateless. It receives an element, Rough.js canvas, 2D context, and theme colors, then draws that element.

## Camera, Coordinates, Pan, and Zoom

### `src/canvas/camera.ts`

The camera is:

```ts
{
  x: number;
  y: number;
  zoom: number;
}
```

`x` and `y` are screen-space pan offsets. `zoom` is the scale where `1` means 100%.

`screenToWorld` converts pointer positions from screen/canvas coordinates into drawing coordinates:

```text
world.x = (screen.x - camera.x) / camera.zoom
world.y = (screen.y - camera.y) / camera.zoom
```

`worldToScreen` does the opposite:

```text
screen.x = world.x * camera.zoom + camera.x
screen.y = world.y * camera.zoom + camera.y
```

This split is important because drawing tools should create elements in world space, while pan gestures should work in screen space.

### `src/hooks/useCamera.ts`

`useCamera` stores camera state and provides `zoomAt(delta, mouseX, mouseY)`.

`zoomAt` clamps zoom between `0.2` and `5`, then adjusts `camera.x` and `camera.y` so zooming happens toward the mouse position or viewport center instead of always zooming from the top-left corner.

### `src/hooks/usePointerControls.ts`

`usePointerControls` is the bridge between raw browser pointer events and canvas tool logic.

It handles:

- Left-click drawing.
- Middle-click panning.
- Space/pan-tool panning.
- Wheel panning.
- Ctrl + wheel zooming.
- Shift + wheel horizontal panning.
- Two-finger pinch zoom and pan.
- Blocking right-click context menus.
- Pointer capture during drag gestures.

It decides which coordinate system to pass to the tool:

- Drawing tools receive world coordinates.
- Selection and eraser also receive world coordinates because they inspect stored elements.
- Pan receives screen coordinates because pan changes the camera offset directly.
- Text receives screen coordinates first so the floating textarea appears under the cursor.

## Tool Dispatch and Canvas State

### `src/hooks/useCanvas.ts`

`useCanvas` is the editor interaction hub. It maps `currentTool` to a tool handler:

```text
selection -> selectionTool
pencil    -> pencilTool
line      -> lineTool
rect      -> rectTool
ellipse   -> ellipseTool
text      -> textTool
eraser    -> eraserTool
pan       -> panTool
```

It also owns temporary interaction state:

- `currentElement`: the shape currently being drawn before it is committed.
- `selectedElement`: the element currently targeted by selection.
- `lastMousePos`: last pointer position used for dragging or panning.
- `dragStartSnapshot`: a copy of elements before a move operation, used for undo history.
- `isPanningRef` and `isPanning`: pan gesture state and cursor state.

Every tool receives a shared `ToolContext`, which contains the current elements, state setters, history functions, camera setter, ID generation, theme stroke, and text editing callback.

The event callbacks work like this:

```text
onPointerDown(x, y)
  -> choose active tool
  -> activeTool.onPointerDown(x, y, ctx)

onPointerMove(x, y)
  -> choose active tool
  -> activeTool.onPointerMove(x, y, ctx)

onPointerUp()
  -> choose active tool
  -> activeTool.onPointerUp(ctx)
```

If `forcePan` is active, the pan tool overrides the selected tool. That is how holding Space temporarily pans without switching away from the current drawing tool.

## Drawing Tools

### Shape Tools: `src/canvas/tools/shapeTool.ts`

`createShapeTool(type)` builds the line, rectangle, and ellipse tools.

On pointer down:

- Creates a new `DrawingElement`.
- Sets `x1`, `y1`, `x2`, and `y2` to the start point.
- Adds a theme stroke.
- Generates a Rough.js seed.
- Stores it as `currentElement`.

On pointer move:

- Updates `x2` and `y2` on `currentElement`.
- The committed elements are untouched during the drag.
- `CanvasStage` draws `currentElement` as a live preview.

On pointer up:

- Commits the current element into history.
- Clears `currentElement`.

The exports are:

```ts
export const lineTool = createShapeTool("line");
export const rectTool = createShapeTool("rect");
export const ellipseTool = createShapeTool("ellipse");
```

### Pencil Tool: `src/canvas/tools/pencil.ts`

The pencil tool creates a freehand element.

On pointer down:

- Creates a `pencil` element.
- Initializes `points` with the first point.

On pointer move:

- Appends every new pointer position to `points`.
- Updates `x2` and `y2`.

On pointer up:

- Commits the pencil element into history.
- Clears the preview.

Rendering uses `rc.linearPath(points)` so the full freehand path is redrawn from stored points.

### Text Tool: `src/canvas/tools/text.ts`

The text tool delegates to UI instead of drawing immediately.

On pointer down:

- Calls `startTextEditing(x, y)`.
- `App` stores that screen position in `textEditor`.
- `TextEditor` renders a fixed-position `<textarea>`.

When the user presses Enter:

- `App` converts the textarea screen position to world coordinates with `screenToWorld`.
- A `text` element is committed into history.
- The textarea closes.

When the user presses Escape, editing is cancelled.

### Eraser Tool: `src/canvas/tools/eraser.ts`

The eraser checks elements from top to bottom:

```text
for elements from last to first
  if pointer is inside element bounds
    commit(elements without that element)
```

It uses `isPointInsideElement`, which currently performs bounding-box hit testing. This is simple and fast, but it means line, ellipse, and pencil hit testing is approximate.

### Selection Tool: `src/canvas/tools/selection.ts`

The selection tool also checks elements from top to bottom, so the visually topmost element wins.

On pointer down:

- Finds the first element whose bounds contain the pointer.
- Saves it as `selectedElement`.
- Stores `lastMousePos`.
- Stores `dragStartSnapshot`, a copy of the element array before movement.

On pointer move:

- Calculates `dx` and `dy` from the last pointer position.
- Calls `preview(...)` to update the current history `present` state without pushing a new undo entry.
- Moves only the selected element with `moveElement`.

On pointer up:

- Commits the moved state.
- Uses `dragStartSnapshot` as the past history entry, so undo returns to the pre-drag positions.
- Clears selection drag state.

### Pan Tool: `src/canvas/tools/pan.ts`

Pan works in screen coordinates.

On pointer down:

- Marks panning as active.
- Stores the current pointer position.

On pointer move:

- Calculates screen-space `dx` and `dy`.
- Adds that delta to `camera.x` and `camera.y`.

On pointer up:

- Ends the pan gesture.
- Clears the last pointer position.

Pan does not modify elements or history. It only changes the camera.

## Hit Testing and Moving

### `src/canvas/hitTest.ts`

`isPointInsideElement` checks whether a world-space pointer position lies inside an element's bounds.

`getElementBounds` returns bounds differently by type:

- `line`, `rect`, `ellipse`: min/max of `x1`, `y1`, `x2`, `y2`.
- `pencil`: min/max of all stored points.
- `text`: estimated width from text length and a fixed height.

This gives selection and eraser one shared way to find target elements.

### `src/canvas/elementUtils.ts`

`moveElement(el, dx, dy)` returns a moved copy of an element.

It updates:

- `x1`, `y1`
- `x2`, `y2`
- every pencil point, if the element has `points`

Because it returns a copy instead of mutating the original object directly, it fits React state updates and history snapshots.

## History and Undo/Redo

### `src/hooks/useHistory.ts`

History state has three stacks:

```ts
{
  past: DrawingElement[][];
  present: DrawingElement[];
  future: DrawingElement[][];
}
```

`present` is the current canvas content.

`commit(newElements)` pushes the current `present` into `past`, replaces `present`, and clears `future`.

`preview(updater)` changes `present` without pushing to `past`. This is used for live movement during selection drag.

`undo()` moves the latest `past` state into `present` and puts the old `present` into `future`.

`redo()` moves the first `future` state back into `present` and puts the old `present` into `past`.

For selection movement, `commit(ctx.elements, snapshot)` can pass a `pastOverride`. This makes undo restore the exact state from before dragging began, even though `preview` has already updated `present` during the drag.

## Keyboard Shortcuts

### `src/hooks/useKeyboard.ts`

Keyboard shortcuts are global window listeners.

Tool shortcuts:

```text
Space -> temporary pan
1     -> selection
2     -> rectangle
3     -> ellipse
4     -> line
5     -> pencil
6     -> text
E     -> eraser
```

History shortcuts:

```text
Ctrl + Z           -> undo
Ctrl + Y           -> redo
Ctrl + Shift + Z   -> redo
```

When text editing is active, keyboard shortcuts are disabled so typing in the textarea does not accidentally switch tools or undo drawing state.

## UI Components

### `src/components/toolbar`

The toolbar is the top-center tool picker.

`tools.config.ts` is the source of truth for toolbar items. It maps tool IDs to labels, icons, and shortcut labels.

`Toolbar.tsx` renders the list of tools and manages hover tooltip timing.

`ToolButton.tsx` renders one animated tool button, including the active-tool background animation.

### `src/components/controls`

These are bottom-left utility controls.

`ZoomControls.tsx` calls `zoomIn` and `zoomOut` callbacks from `App`. Those callbacks zoom around the viewport center.

`HistoryControls.tsx` calls `undo` and `redo` from `useHistory`.

`ThemeToggle.tsx` toggles between light and dark theme modes.

`ControlButton.tsx` is a reusable icon button with tooltip support.

### `src/components/overlays`

`TextEditor.tsx` is the temporary textarea used by the text tool.

`InfoModal.tsx` and `HelpButton.tsx` provide the help/info overlay.

### `src/components/label`

`Label.tsx` is the shared tooltip/label component used by toolbar and controls.

## Theme System

### `src/theme`

The theme system stores light and dark color tokens.

`theme.ts` defines the color palettes.

`ThemeContext.ts` creates the React context.

`ThemeProvider.tsx` provides the active theme to the app.

`useThemeContext.ts` reads the active theme.

### `src/hooks/useTheme.ts`

`useTheme` stores the current mode and exposes:

- `mode`
- `colors`
- `toggleTheme`

Canvas rendering uses `colors.defaultStroke`, so existing elements with a theme stroke automatically adapt when the theme changes.

## End-to-End Drawing Flow

Here is the normal rectangle drawing flow:

```text
User selects rectangle
  -> currentTool = "rect"

User pointer down on canvas
  -> usePointerControls gets screen position
  -> screenToWorld converts to drawing coordinates
  -> useCanvas dispatches to rectTool.onPointerDown
  -> rectTool creates currentElement

User drags
  -> pointer move is converted to world coordinates
  -> rectTool updates currentElement.x2/y2
  -> CanvasStage redraws elements + currentElement preview

User releases
  -> rectTool commits [...elements, currentElement]
  -> useHistory pushes old present to past
  -> currentElement is cleared
  -> CanvasStage redraws committed elements
```

The same general model applies to line and ellipse.

## End-to-End Selection and Move Flow

```text
User selects selection tool
  -> currentTool = "selection"

Pointer down on an element
  -> pointer position is converted to world coordinates
  -> selectionTool searches elements from top to bottom
  -> selectedElement, lastMousePos, and dragStartSnapshot are stored

Pointer move
  -> dx/dy are calculated in world coordinates
  -> preview updates present state
  -> selected element is moved with moveElement
  -> CanvasStage redraws moved element

Pointer up
  -> commit stores the move as one undoable action
  -> dragStartSnapshot is used as the undo state
```

## End-to-End Pan and Zoom Flow

Panning can happen through:

- Pan tool.
- Holding Space.
- Middle mouse button.
- Mouse wheel without Ctrl.
- Two-finger touch movement.

Drawing state is not changed during panning. Only camera state changes.

Zooming can happen through:

- Ctrl + wheel at the pointer position.
- Zoom buttons at the viewport center.
- Two-finger pinch gesture.

Zoom is also camera-only. Elements keep their original world coordinates.

## Adding a New Tool

To add a new drawing tool, the current structure expects these steps:

1. Add the new tool name to `ToolType` in `src/canvas/types.ts`.
2. If it creates a new drawable kind, add that kind to `ElementType` and update `DrawingElement` fields if needed.
3. Create a tool handler in `src/canvas/tools/`.
4. Register the handler in the `tools` map inside `src/hooks/useCanvas.ts`.
5. Add rendering support in `src/canvas/renderer.ts`.
6. Add hit-testing support in `src/canvas/hitTest.ts` if the element should be selectable or erasable.
7. Add toolbar config in `src/components/toolbar/tools.config.ts`.
8. Add keyboard shortcut support in `src/hooks/useKeyboard.ts` if needed.

## Architecture Summary

KuroSketch is organized around a clean split:

- React components render UI and the canvas element.
- Hooks own stateful editor behavior.
- `canvas/` owns engine-like logic: types, rendering, camera math, hit testing, movement, and tools.
- Tools are small handlers that react to pointer events through a shared context.
- History stores arrays of plain drawing elements.
- Rendering is a full redraw of the current element array, transformed by camera state.

This keeps the app easy to extend because most features have one obvious home: visual UI goes in `components`, reusable editor state goes in `hooks`, and drawing-engine behavior goes in `canvas`.
