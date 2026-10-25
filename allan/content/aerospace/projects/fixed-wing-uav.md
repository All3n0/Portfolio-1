---
title: Fixed-wing survey UAV
summary: Design, build and fly a 1.5 m span electric UAV, taking it from sizing and stability analysis through to autonomous flight with ArduPilot.
status: planned
disciplines: [Aerodynamics, Flight mechanics, Structures]
tools: [XFLR5, OpenVSP, Fusion 360, ArduPilot, MATLAB]
skills: [Conceptual sizing, Static stability analysis, Composite layup, Flight testing]
role: Sole designer and builder
timeframe: 3–4 months
relatedSimulation: wing-spar-analysis
featured: true
order: 1
---

## Objective

Build a small fixed-wing aircraft able to carry a 200 g camera for 25 minutes, with stable hands-off flight and autonomous waypoint missions.

## Requirements

- Wingspan under 1.5 m, all-up mass under 2.5 kg
- Cruise at 14–16 m/s with 25 minutes endurance
- Static margin between 5% and 15% of mean aerodynamic chord
- Spar safety factor of at least 1.5 at a 4 g pull-up

## Approach

1. **Sizing.** Pick wing loading and aspect ratio from endurance and stall speed targets; estimate drag polar and battery size.
2. **Aerodynamics and stability.** Model the wing, tail and fuselage in XFLR5; trim at cruise, check static margin, and run the eigenvalue analysis for phugoid, short-period and Dutch roll modes.
3. **Geometry.** Build the outer mould line in OpenVSP and export to CAD for the fuselage and mounts.
4. **Structure.** Size the carbon spar using the wing spar simulator, then verify with a sandbag wing load test.
5. **Avionics.** Integrate a flight controller running ArduPilot, GPS and telemetry radio; tune in manual, then stabilised, then auto modes.

## Validation plan

Compare predicted cruise speed, stall speed and endurance against logged flight data, and the predicted tip deflection against the wing load test.

## Results

To be updated after build and flight testing. Planned evidence: XFLR5 stability plots, load test photos, flight log graphs, and an annotated 3D model.

## Lessons learned

To be updated.
