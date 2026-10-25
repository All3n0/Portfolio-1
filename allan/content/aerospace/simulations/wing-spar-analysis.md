---
title: Wing spar stress analysis
summary: Sizes the main spar of a small UAV wing under an elliptical lift distribution and reports stress, safety factor, tip deflection and mass.
component: spar
discipline: Structures
method: Euler–Bernoulli cantilever beam, numerical integration of load, shear, moment and deflection
validation: Numerical root bending moment checked against the closed-form result 4Lb/3π
thumbnail: spar
order: 4
---

## Objective

Choose a spar material and cross-section that survives a target manoeuvre load with a sensible safety factor, while keeping mass down.

## Model

Each half-wing is a cantilever beam clamped at the fuselage. Lift is spread along the span in an elliptical distribution, the ideal case from lifting-line theory, with the total set by aircraft weight and load factor.

Working from the tip inward, the load is integrated once for shear force and again for bending moment. Working from the root outward, moment divided by bending stiffness (EI) is integrated twice for slope and deflection. Peak bending stress is σ = M·c / I at the root.

## Validation

For an elliptical distribution, the root bending moment has a closed form, M = 4Lb / 3π. The numerical integration matches it to within about 0.05%, and the difference is shown live as you change inputs.

## Limitations

The spar is assumed to carry all bending load, with no help from skins, and the beam is uniform along the span. Material allowables are typical values, especially for composites, where layup and manufacturing quality change strength significantly. Real design work would add a 1.5 ultimate factor of safety on top of limit loads and check local buckling of thin-walled tubes.
