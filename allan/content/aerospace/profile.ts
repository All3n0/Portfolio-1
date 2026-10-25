/**
 * Copy for the aerospace side. Edit freely; nothing here is hard-coded in components.
 */

export const aeroProfile = {
  name: "Allan Kiprop",
  title: "Aerospace engineer",
  intro:
    "I model how things fly, then write the software to prove it. This side of my portfolio covers aerodynamics, flight mechanics, structures and orbital mechanics, with simulations you can run right here in the browser.",
  // Shown in the hero readout panel
  readouts: [
    { label: "Simulations", value: "4" },
    { label: "Disciplines", value: "5" },
    { label: "Base", value: "Nairobi, KE" },
  ],
};

/** Shown in the "Disciplines" section. Order matters. */
export const focusAreas = [
  {
    name: "Aerodynamics",
    description: "Airfoil and wing analysis, from panel methods to RANS CFD with proper validation.",
    tools: ["XFLR5", "OpenVSP", "OpenFOAM", "ANSYS Fluent"],
  },
  {
    name: "Flight mechanics",
    description: "Trajectory, stability and performance modelling for aircraft and rockets.",
    tools: ["MATLAB / Simulink", "OpenRocket", "Python"],
  },
  {
    name: "Structures",
    description: "Beam theory and finite element analysis for lightweight airframes.",
    tools: ["CalculiX", "ANSYS Mechanical", "FreeCAD"],
  },
  {
    name: "Astrodynamics",
    description: "Orbit transfers, mission Δv budgets and propellant sizing.",
    tools: ["Python", "GMAT"],
  },
  {
    name: "Avionics and software",
    description: "Flight computers, telemetry and the dashboards that make test data readable.",
    tools: ["ESP32 / Arduino", "C++", "TypeScript", "Next.js"],
  },
];

/** Grouped toolchain shown as chips. */
export const toolchain = [
  { group: "Design and CAD", items: ["Fusion 360", "SolidWorks", "OpenVSP", "FreeCAD"] },
  { group: "Analysis", items: ["XFLR5", "OpenFOAM", "ANSYS", "CalculiX", "OpenRocket"] },
  { group: "Computation", items: ["Python", "NumPy / SciPy", "MATLAB", "TypeScript"] },
  { group: "Hardware", items: ["ESP32", "Arduino", "ArduPilot", "3D printing"] },
];

/** Hide projects marked `status: planned` (e.g. before sending the link to recruiters). */
export const SHOW_PLANNED_PROJECTS = true;
