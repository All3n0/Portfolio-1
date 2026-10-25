---
title: CFD validation study of a NACA 0012 airfoil
summary: Run a 2D RANS simulation of the NACA 0012 and validate lift and drag against wind tunnel data, including a full mesh independence study.
status: planned
disciplines: [Aerodynamics, CFD]
tools: [OpenFOAM, Gmsh, ParaView, Python]
skills: [Meshing, Turbulence modelling, Mesh independence, Experimental validation]
role: Individual study
timeframe: 4–6 weeks
relatedSimulation: airfoil-panel-method
featured: true
order: 3
---

## Objective

Show that I can produce CFD results I can trust: set up a case, prove the answer does not depend on the mesh, and compare against experimental data.

## Approach

1. **Geometry and mesh.** C-type structured mesh in Gmsh with the first cell sized for y+ ≈ 1.
2. **Solver.** OpenFOAM simpleFoam with the Spalart–Allmaras turbulence model at Re = 6 million.
3. **Mesh independence.** Three meshes (coarse, medium, fine); report lift and drag on each and estimate discretisation error with Richardson extrapolation.
4. **Validation.** Compare lift curve and drag polar against the NASA Turbulence Modeling Resource data for this case, and against my inviscid panel method.

## Validation plan

Lift within 3% and drag within 10% of reference data in the attached-flow range, with the mesh study showing results converge.

## Results

To be updated. Planned evidence: mesh images, convergence plots of residuals, mesh study table, pressure contour and streamline plots, Cl–α comparison chart.

## Lessons learned

To be updated.
