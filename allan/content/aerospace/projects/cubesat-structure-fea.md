---
title: 1U CubeSat structure analysis
summary: Model a 1U CubeSat frame and check it against launch loads with static and modal finite element analysis.
status: planned
disciplines: [Structures, Space systems]
tools: [FreeCAD, CalculiX, ParaView]
skills: [Finite element analysis, Modal analysis, Mesh convergence, Requirements tracing]
role: Individual study
timeframe: 3–4 weeks
order: 5
---

## Objective

Show that a 1U CubeSat structure meets typical launch vehicle requirements for quasi-static loads and minimum natural frequency.

## Approach

1. **CAD.** Model a 10 × 10 × 11.35 cm frame with rails and a representative payload mass.
2. **Requirements.** Take load factors and minimum frequency from a published launch provider user guide.
3. **Static analysis.** Apply quasi-static acceleration in each axis and check stress against aluminium 7075 allowables.
4. **Modal analysis.** Find the first natural frequencies and mode shapes.
5. **Mesh convergence.** Refine the mesh until peak stress and first frequency change by less than 2%.

## Validation plan

Check a simplified rail as a beam by hand and compare with the FEA result for the same case.

## Results

To be updated. Planned evidence: stress contour plots, first three mode shapes, mesh convergence plot, requirements compliance table.

## Lessons learned

To be updated.
