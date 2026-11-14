# VRM-NEXUS: Vertical Roller Mill, MV-VFD Drive & ESP Baghouse Filtration SCADA

> **Industrial Digital Twin & Supervisory Telemetry System (SCADA / HMI / Power Systems)**  
> **Lead Electrical & Automation Systems Engineer:** **أ. طارق ابوعشي | Tareq Abuashi**  
> *Specialist in MV Electrical Drives, Industrial Automation, Protection Relays & DCS Digital Twins*

---

## 🏭 Project Executive Summary

**VRM-NEXUS** is a mission-critical industrial SCADA digital twin developed for modern cement manufacturing plants. It models and supervises the raw material grinding and gas cleaning circuit, featuring:
1. **Vertical Roller Mill (VRM):** Pfeiffer / Loesche 4-roller design powered by a **6.6 kV - 4,200 kW Medium Voltage Variable Frequency Drive (MV-VFD)** with dynamic cage classification (60–180 RPM) and hydraulic roller bed stabilization (65–110 Bar).
2. **Pulse-Jet Baghouse & Induced Draft (ID) Fan:** 8-compartment fabric filter with automated compressed air pulse sequencer (Row 1–8) driven by a **6.6 kV - 1,800 kW ID Fan**, equipped with high-temperature tempering damper interlocks (>210°C) to safeguard synthetic filter bags.
3. **MV Switchgear & 18-Pulse VFD Architecture:** Single Line Diagram (SLD) depicting incoming 6.6 kV Vacuum Circuit Breakers (VCB 52-1), 5,000 kVA phase-shifting isolation transformer (±20°, 0°), 3x diode rectifiers, intermediate DC-Link (8,910 VDC), 3-level NPC IGBT inverter, and **IEEE 519 compliance** (THD-I < 2.5%, THD-V < 1.8%).
4. **AI Predictive Maintenance & FFT Diagnostics:** 60fps HTML5 Canvas telemetry rendering real-time planetary gearbox vibration spectrum, highlighting the **312 Hz gear mesh frequency**, roller tire wear degradation, and automated Remaining Useful Life (RUL) estimation.
5. **Interactive Fault Injection & 1ms SOE Chronology:** Live operational testbed for technical interviews, featuring Mill Rumble / Dry Feed collapse, Baghouse High ΔP Clogging, VFD DC-Bus Overvoltage (ANSI 59 trip), Master E-Stop, and complete System Reset.

---

## ⚡ Technical Architecture & Engineering Modules

### Unit 1: Vertical Roller Mill (VRM) & MV-VFD Drive (6.6 kV - 4,200 kW)
- **Mill Table & Roller Kinematics:** 4 segmented rollers riding on a circular grinding bed. Grinding pressure regulated between 65 and 110 Bar with nitrogen-charged hydraulic accumulators.
- **Material Bed Stability:** Monitored depth (45–85 mm). Automatic feed rate cascade (0–280 t/h) maintains continuous dampening cushion.
- **Dynamic Cage Classifier:** Variable speed rotor (60–180 RPM) dynamically regulates raw meal particle distribution.
- **Bearing RTD Telemetry (PT100):** Real-time monitoring of planetary gearbox sump oil, segmented thrust pads, and journal bearings for Rollers 1 through 4.

### Unit 2: Pulse-Jet Baghouse & ESP Filtration Interlock
- **Induced Draft (ID) Fan:** 6.6 kV, 1,800 kW heavy-duty centrifugal fan maintaining negative system draft.
- **Differential Pressure (ΔP):** Range 8.0–25.0 mbar. Automatic pulse-jet sequence fires high-pressure air bursts across rows 1–8 when ΔP exceeds 16.0 mbar.
- **Thermal Safety Interlock:** When flue gas exceeds 210°C, the automation loop modulates the **Fresh Air Tempering Damper** (0–100%) to inject ambient cooling air, preventing catastrophic thermal bag melting.
- **Emission Compliance:** Real-time stack opacity telemetry (<20 mg/Nm³ emission limit).

### Unit 3: MV Switchgear & 18-Pulse VFD Harmonics (SLD & IEEE 519)
- **18-Pulse Phase Shifting:** 5,000 kVA transformer with three secondary windings displaced at +20°, 0°, and -20°.
- **Harmonic Elimination:** Vector cancellation naturally eliminates the 5th, 7th, 11th, and 13th harmonic currents ($h = 18k \pm 1$).
- **Intermediate DC Link:** Maintained at 8,910 VDC nominal:
  $$V_{DC} = \frac{3\sqrt{6}}{\pi} V_{LL} \cdot \cos(\alpha) \approx 8,910 \text{ VDC}$$
- **ANSI Numerical Protection Relays:**
  - `ANSI 51/50`: AC Inverse Time Overcurrent & Instantaneous Short Circuit.
  - `ANSI 27/59`: DC-Bus Undervoltage / Overvoltage Relay (Trip > 9,450 VDC in <15ms).
  - `ANSI 87T`: High-Speed Transformer Differential Protection ($I_{diff} > 0.2 \cdot I_n$).

### Unit 4: AI Predictive Maintenance & Vibration Canvas
- **Planetary Gearbox FFT Analysis:** 60fps HTML5 Canvas displaying 0–600 Hz vibration spectrum.
- **Dominant Frequency Peaks:** Tracks 1X table rotation (~28 Hz) and planetary gear mesh frequency (312 Hz).
- **ISO 10816-3 Vibration Severity Zones:**
  - Zone A (< 2.8 mm/s): Newly commissioned machine.
  - Zone B (2.8–4.5 mm/s): Unrestricted long-term operation.
  - Zone C (4.5–7.1 mm/s): Warning / corrective maintenance required.
  - Zone D (> 7.1 mm/s): Severe damage risk / automatic trip condition.

### Unit 5: Fault Injection & Sequence of Events (SOE) Engine
- **Mill Rumble / Dry Feed Simulation:** Collapses bed depth to <20 mm, triggers roller bounce (>12 mm/s vibration), and generates an acoustic rumble drone.
- **Baghouse High ΔP Clogging:** Blinds filter bags, increases restriction (>22 mbar), and engages emergency rapid solenoid pulsing.
- **VFD DC-Bus Overvoltage:** Surges DC link to 9,880 VDC, activating ANSI 59 trip and opening VCB 52-1 in <38 ms.
- **1ms SOE Logger:** Timestamped event log tracking protective trips and operator interventions.

---

## 🛠️ Technology Stack
- **Framework & Build:** Vite 6 + TypeScript (Modular vanilla architecture, zero bloated dependencies)
- **Industrial Visuals:** Hand-crafted, responsive SVG mimics with dynamic CSS keyframes and radial gradients
- **High-Performance Canvas:** 60fps HTML5 Canvas for real-time oscilloscope and FFT frequency spectrum
- **Acoustic Synthesis:** Web Audio API sound generator (VCB contact snap, pulse-jet air blast, mill rumble drone, and ISO alarm siren)
- **Engineering Dossier:** Built-in modal containing formulas, electrical schematics, relay curves, and PDF export

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Compile and build production bundle
npm run build
```

---

## 👨‍💼 Lead Systems Engineer & Project Creator

**أ. طارق ابوعشي | Tareq Abuashi**  
*Lead Electrical & Automation Systems Engineer*  
*Specialized in Power Systems, MV Variable Speed Drives, Cement Pyroprocessing & Industrial DCS Telemetry*
