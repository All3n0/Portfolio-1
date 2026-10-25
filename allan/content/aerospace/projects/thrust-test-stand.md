---
title: Propeller thrust test stand
summary: A load-cell test stand that measures static thrust, current and RPM for drone motors and propellers, with live data streamed to a web dashboard.
status: planned
disciplines: [Propulsion, Instrumentation, Software]
tools: [Arduino, HX711, Fusion 360, React, Python]
skills: [Sensor calibration, Uncertainty analysis, Test design, Data visualisation]
role: Design, build and software
timeframe: 3–4 weeks
order: 4
---

## Objective

Measure real motor and propeller performance instead of relying on manufacturer claims, and use the data to choose the propulsion system for the UAV project.

## Approach

1. **Mechanical.** Lever-arm stand with a 5 kg load cell, designed in Fusion 360 and 3D printed.
2. **Electronics.** HX711 amplifier, current sensor and optical RPM sensor on an Arduino.
3. **Calibration.** Calibrate the load cell with known masses and report measurement uncertainty.
4. **Software.** Stream readings over serial to a browser dashboard that plots thrust, efficiency (g/W) and RPM in real time.

## Validation plan

Compare measured thrust curves with the motor manufacturer's published data and explain differences.

## Results

To be updated. Planned evidence: calibration curve with error bars, thrust vs throttle plots for at least three propellers, photos of the stand.

## Lessons learned

To be updated.
