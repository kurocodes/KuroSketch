# 🎨 KuroSketch

https://github.com/user-attachments/assets/45718c96-6966-4119-adcf-711a997c41ae

A minimal sketching app built from scratch… <br />
not to copy tools like Excalidraw — <br />
but to understand how they actually work.

Lines, shapes, text, undo/redo, pan, zoom… <br />
all handcrafted with Canvas + logic + a lot of learning moments 💭

This project is less about being “feature-heavy” <br />
and more about building a real drawing engine, step by step.

## 🧠 Why KuroSketch?

Most sketch apps hide the hard parts.

KuroSketch does the opposite.

Mouse input → geometry → canvas rendering → state history <br />
no magic… just fundamentals.

If you like learning by building, <br />
this one’s for you.

## 🛠️ Technologies Used

- React
- TypeScript
- Vite
- HTML Canvas API
- Rough.js (for that hand-drawn feel ✍️)
- Tailwind CSS (UI polish & theming)
- Motion (for a little bit UI animations)

Simple stack.
Deep learning.

## ✨ Features

- ✏️ Freehand pencil tool
- 📏 Line tool
- ⬛ Rectangle & ⚪ Circle tools
- 🔤 Text tool
- 🖱️ Select & move elements
- 🧽 Eraser
- ↩️ Undo / Redo system
- 🤏 Pan & Zoom canvas
- 🌗 Light / Dark theme toggle
- 🎨 Theme-aware rendering (existing drawings update on theme change)
- 🧠 Semantic color system (no hardcoded stroke colors)
- 🖐️ Improved pointer system (mouse + touch support)
- ⌨️ Keyboard shortcuts

Everything rendered manually on canvas… <br />
no SVG shortcuts 👀

## 🎨 Theming System (New)

The theme system was redesigned to be fully dynamic and scalable:

- Elements no longer store raw colors
- Instead, they use semantic color roles (e.g. defaultStroke)
- Colors are resolved at render time

This allows:

→ Instant theme switching (even for old drawings) <br />
→ Cleaner architecture (no mutation of stored elements) <br />
→ Easy future support for color customization

Also includes:

- Soft UI palette (no pure black/white)
- Lavender-based accent system
- Theme-based shadows & hover states

## 🧩 Development Process

This project followed a build-and-learn approach:

Setup → Canvas rendering → Element models → Tools → History system → Pan & zoom → UI <br />
Then… polish ✨

Each feature was added only after understanding <br />
why it should exist and how it works internally.

No rushing.
No skipping fundamentals.

## 🧠 What I Learned

- How canvas rendering actually works (and why redraws matter)
- Managing complex mouse interactions without losing sanity
- Geometry basics (hit detection is sneaky…)
- Designing a clean undo/redo history system
- Separating tools, elements, and state
- Building a theme system using semantic roles instead of fixed values
- Debugging weird coordinate bugs caused by pan & zoom 😵‍💫

Most importantly… <br />
Building from scratch teaches you things tutorials never mention.

## 🚀 What’s Next? (Ideas for Improvement)

This is where KuroSketch can grow 👀

Some ideas:

- 🧲 Multi-select & group elements
- 🎯 Better hit detection & resizing handles
- 🖼️ Export as PNG / SVG
- 💾 Save & load sketches
- 🧩 More shapes (arrows, diamonds, etc.)
- 🖌️ Stroke & color customization
- 📱 Advanced mobile gestures

KuroSketch is a solid base. <br />
From here… it can evolve into something really powerful.

## ▶️ Running the Project

```
# clone the repo
git clone https://github.com/your-username/kurosketch.git

# install dependencies
npm install

# start dev server
npm run dev
```

Open `http://localhost:5173`
and start sketching ✨
