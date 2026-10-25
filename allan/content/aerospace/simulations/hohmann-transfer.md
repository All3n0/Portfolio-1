---
title: Orbit transfer planner
summary: Plans a two-burn Hohmann transfer between circular Earth orbits, including plane changes, and shows why launching from near the equator saves fuel.
component: hohmann
discipline: Astrodynamics
method: Two-body orbital mechanics, vis-viva equation, Tsiolkovsky rocket equation
validation: Reproduces the textbook LEO→GEO transfer (Δv ≈ 3.89 km/s, 5.3 h)
thumbnail: orbit
order: 3
---

## Objective

Work out the velocity changes, transfer time and propellant needed to move a spacecraft between two circular orbits, and quantify the cost of changing orbital inclination.

## Model

A Hohmann transfer uses an ellipse that just touches both orbits. The first burn at the lower orbit raises the far side of the orbit; the second burn at the far side circularises it. Speeds at each point come from the vis-viva equation.

Changing inclination is expensive because it rotates the whole velocity vector, so it is cheapest where the spacecraft moves slowest. Here the plane change is combined with the second burn, at the high point of the transfer, using the law of cosines between the arrival and target velocity vectors.

Propellant mass comes from the Tsiolkovsky rocket equation for the chosen specific impulse.

## Validation

For a 300 km orbit to geostationary altitude with no plane change, the planner gives Δv₁ ≈ 2.43 km/s, Δv₂ ≈ 1.47 km/s, a total of 3.89 km/s and a transfer time of 5.28 hours, matching standard textbook results.

## Why the launch site matters

A spacecraft's starting inclination can be no lower than its launch site's latitude. Geostationary orbit is at 0°, so a satellite launched from Cape Canaveral (about 28.5° N) must remove 28.5° of inclination, while one launched from the Luigi Broglio Space Center off Malindi, Kenya (about 2.9° S) needs under 3°. Use the presets to compare the two.

## Limitations

The model assumes impulsive burns, a spherical Earth with no J2 perturbation, and no atmospheric drag, which is fine for planning but not for mission design.
