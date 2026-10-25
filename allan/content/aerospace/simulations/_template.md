---
# To add a simulation:
# 1. Build the interactive component in app/components/simulations/ (copy an existing one).
# 2. Register it with one line in app/components/simulations/registry.ts.
# 3. Copy this file, rename it (e.g. my-sim.md), and set `component` to the registry key.
title: My simulation
summary: One sentence on what it computes and why it is useful.
component: my-sim-key
discipline: Aerodynamics
method: The numerical method in a few words
validation: What you compared it against
thumbnail: airfoil   # airfoil | rocket | orbit | spar
order: 5
---

## Objective

## Model

## Validation

## Limitations
