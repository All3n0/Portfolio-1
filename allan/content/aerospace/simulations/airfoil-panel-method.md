---
title: Airfoil pressure solver
summary: A vortex panel method that computes the pressure distribution and lift of any NACA 4-digit airfoil, checked against thin airfoil theory.
component: airfoil
discipline: Aerodynamics
method: Hess–Smith source and vortex panel method, 120 panels, cosine spacing
validation: Lift slope and zero-lift angle compared with thin airfoil theory; panel count convergence
thumbnail: airfoil
order: 1
---

## Objective

Predict how pressure is distributed over an airfoil and how much lift it makes, fast enough to explore designs interactively in the browser.

## Model

The airfoil surface is split into straight panels. Each panel carries a constant-strength source, and all panels share one vortex strength. Two conditions close the system:

- **Flow tangency** at the midpoint of every panel, so no air passes through the surface.
- **The Kutta condition** at the trailing edge, so the flow leaves the sharp edge smoothly.

That gives a dense linear system of N + 1 equations. Because the geometry part of the matrix does not depend on angle of attack, it is LU-factorised once and then re-solved for each angle in the lift curve, which is why the whole sweep updates instantly.

## Validation

- **Thin airfoil theory.** Lift slope should be close to 2π per radian and the zero-lift angle should match the camber line integral. The panel method predicts slightly more lift because it includes thickness, which thin airfoil theory ignores.
- **Known results.** A NACA 0012 at 5° gives a lift coefficient of about 0.60, and a NACA 2412 at 0° gives about 0.25, both in line with published inviscid results.
- **Panel convergence.** Lift changes by less than 0.5% going from 60 to 200 panels.

## Limitations

The method is inviscid and incompressible. It cannot predict drag, boundary layer separation or stall, so the lift curve keeps rising past the angle where a real wing would stall (roughly 12–16° for these sections). A natural next step is coupling it to an integral boundary layer model, the approach XFOIL uses.
