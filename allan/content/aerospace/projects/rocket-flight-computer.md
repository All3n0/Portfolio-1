---
title: Model rocket with custom flight computer
summary: Fly a mid-power rocket carrying my own ESP32 flight computer, then compare logged altitude and acceleration against my simulator and OpenRocket.
status: planned
disciplines: [Flight mechanics, Avionics, Software]
tools: [OpenRocket, ESP32, C++, Python, Next.js]
skills: [Embedded firmware, Sensor fusion, Data analysis, Simulation validation]
role: Design, electronics, firmware and data analysis
timeframe: 2–3 months
relatedSimulation: rocket-flight
featured: true
order: 2
---

## Objective

Close the loop between simulation and reality: predict a flight, fly it, and explain every difference between the two.

## Approach

1. **Airframe.** Design a 54 mm rocket in OpenRocket for an H-class motor with stability between 1.5 and 2.5 calibres.
2. **Flight computer.** ESP32 with a barometer, a high-g accelerometer and an SD card, logging at 100 Hz. Firmware detects launch, burnout and apogee.
3. **Ground software.** A web dashboard (built with the same stack as my developer projects) that parses logs and overlays them on the predicted trajectory.
4. **Flight.** Launch with a local rocketry group under their safety rules and range procedures.

## Validation plan

- Compare apogee and time-to-apogee from three sources: my simulator, OpenRocket, and the barometer log.
- Fit the drag coefficient that best matches the coast phase and feed it back into the model.

## Results

To be updated after flight. Planned evidence: overlay plot of predicted vs measured altitude, accelerometer trace through burnout, photos of the electronics bay.

## Lessons learned

To be updated.
