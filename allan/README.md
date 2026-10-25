# Allan Kiprop: Developer + Aerospace Portfolio

Next.js 15 portfolio with two sides:

- **`/`** — the developer portfolio (original content, now with a 3D hero, light/dark mode and scroll animations)
- **`/aerospace`** — aerospace engineering: 3D aircraft hero, interactive simulations and project pages, in a blue theme

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (do this before deploying)
```

> **Windows:** if you see `spawn EPERM`, move the project out of Desktop/Documents (e.g. to `C:\dev\`), delete `node_modules`, and run `npm install` again. Windows Security's Controlled Folder Access blocks build tools in those folders.

---

## Adding content (one file per item)

Everything lives in `content/`. Files starting with `_` are ignored, so each folder has a `_template.md` to copy.

### A developer project
1. Copy `content/dev-projects/_template.md` → `content/dev-projects/my-app.md`
2. Fill in the fields. Put screenshots in `/public`.
3. Set `order` to control position. Add `repo:` to link the Code button (otherwise it links to your GitHub profile).

### An aerospace project
1. Copy `content/aerospace/projects/_template.md` → `content/aerospace/projects/my-project.md`
2. Set `status:` to `planned`, `in-progress` or `complete`. Update it as the project moves along.
3. Write the body under the headings: Objective, Requirements, Approach, Validation, Results, Lessons learned.
4. Optional: `cover:` image, `model:` 3D model (see below), `relatedSimulation:`, `links:` (e.g. a PDF report in `/public/docs`).

Before sending the site to recruiters you can hide unfinished work by setting
`SHOW_PLANNED_PROJECTS = false` in `content/aerospace/profile.ts`.

### A simulation
1. Put the physics in `lib/physics/my-sim.ts` as plain functions (easy to test).
2. Build the interactive UI in `app/components/simulations/MySim.tsx` (copy an existing one; `SimUI.tsx` has sliders, readouts and plots).
3. Register it with one line in `app/components/simulations/registry.tsx`.
4. Copy `content/aerospace/simulations/_template.md`, set `component:` to the registry key, and write the method, validation and limitations.

### Aerospace copy, disciplines and tools
Edit `content/aerospace/profile.ts`. **Remove any tool you haven't actually used.**

---

## 3D models from CAD

1. Export from SolidWorks / Fusion / CATIA as **STEP**.
2. Open in **Blender** (or FreeCAD), simplify if needed (Decimate modifier), and export **glTF Binary (.glb)**.
3. Compress it: `npx @gltf-transform/cli optimize model.glb model-opt.glb --compress draco`
4. Put it in `/public/models/` and add `model: /models/model-opt.glb` to the project file.

Aim for under 5 MB per model.

---

## How it's built

| Area | Where |
| --- | --- |
| Theme tokens (both worlds, light + dark) | `app/globals.css` |
| 3D hero particles (GPU morph, airflow) | `app/components/three/HeroParticles.tsx`, `shapes.ts` |
| 3D orbit view / model viewer | `app/components/three/OrbitScene.tsx`, `ModelViewer.tsx` |
| Simulation physics (pure TS) | `lib/physics/*.ts` |
| Content loader | `lib/content.ts` |
| Developer ↔ Aerospace switch | `app/components/WorldSwitch.tsx` |

**Performance:** all WebGL is lazy-loaded (three.js is not in the first page load); particle morphing runs in a shader; every 3D canvas stops rendering when scrolled off-screen; pixel ratio is capped at 1.5; phones and low-core devices get fewer particles; `prefers-reduced-motion` turns animation off.

**Simulation validation (checked during development):**
- Airfoil: NACA 0012 at 5° → Cl ≈ 0.60; NACA 2412 at 0° → Cl ≈ 0.25; converged with panel count
- Rocket: matches analytic burnout velocity and apogee with drag off; 0.03% change when halving the time step
- Orbit: LEO (300 km) → GEO gives Δv = 2.43 + 1.47 = 3.89 km/s, 5.28 h transfer
- Wing spar: numerical root moment within 0.03% of 4Lb/3π

## Still to do
- Replace the `example.com` links in `blaze.md`, `tikiti.md` and `news-tracker.md` with real URLs.
