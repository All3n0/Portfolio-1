---
title: Rocket flight simulator
summary: Simulates a single-stage model rocket from ignition to landing, with variable mass, real atmosphere and recovery, and predicts apogee and ejection delay.
component: rocket
discipline: Flight mechanics
method: 1-DOF equations of motion, 4th-order Runge–Kutta, International Standard Atmosphere
validation: Matches the analytic solution with drag off; time-step convergence below 0.1%
thumbnail: rocket
order: 2
---

## Objective

Estimate apogee, peak speed and loads for a hobby or competition rocket before building it, and choose the motor ejection delay so the parachute deploys near apogee.

## Model

The rocket is treated as a point mass moving vertically. At each instant it feels thrust, gravity and aerodynamic drag:

- **Thrust** follows a typical solid-motor curve (ignition peak, regressive sustain, tail-off) scaled to the chosen total impulse and burn time.
- **Mass** falls as propellant burns, in proportion to the impulse delivered.
- **Drag** uses the local air density from the International Standard Atmosphere, so the default launch altitude of 1,500 m (roughly the Nairobi area) gives about 14% less dense air than sea level and noticeably higher apogees.
- **Recovery** opens a parachute after apogee and the descent is simulated to touchdown.

The equations are integrated with classical 4th-order Runge–Kutta.

## Validation

- **Analytic check.** With drag switched off and negligible propellant mass, burnout velocity should equal I/m − g·t and apogee should follow from energy conservation. The simulator matches both to within 0.01%.
- **Time-step convergence.** Apogee is computed with two step sizes and the difference is shown live, playing the same role as a mesh independence study in CFD.

## Limitations

The model is one-dimensional, so it ignores weathercocking in wind, launch rail effects and pitch dynamics. The drag coefficient is held constant, which is reasonable well below Mach 0.8. The motor presets are representative, not exact data for any commercial motor; for real flights, load the manufacturer's thrust curve and cross-check with OpenRocket.
