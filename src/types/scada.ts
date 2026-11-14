/**
 * VRM-NEXUS: Vertical Roller Mill, MV-VFD Drive & ESP Baghouse Filtration SCADA
 * System Type Definitions
 * 
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي
 * Tareq Abuashi — Lead Electrical & Automation Systems Engineer
 */

export interface VrmTelemetry {
  frequency: number;          // VFD Output Frequency (0 - 50.0 Hz)
  current: number;            // Stator Current (0 - 480 A)
  activePower: number;        // Active Power (0 - 4200 kW)
  powerFactor: number;        // Power Factor (cos φ: 0.80 - 0.95)
  torque: number;             // Motor Torque (0 - 115%)
  grindingPressure: number;   // Hydraulic Grinding Pressure (65 - 110 Bar)
  bedDepth: number;           // Material Bed Thickness (45 - 85 mm)
  classifierRpm: number;      // Dynamic Cage Classifier (60 - 180 RPM)
  feedRate: number;           // Raw Feed Inflow Rate (0 - 280 t/h)
  gearboxSumpTemp: number;    // Planetary Gearbox Sump Oil Temp (°C)
  gearboxThrustTemp: number;  // Multi-Pad Segmented Thrust Bearing Temp (°C)
  rollerTemps: number[];      // Rollers 1-4 Journal Bearing RTDs (°C)
  vibrationRms: number;       // Gearbox Vibration RMS (mm/s, ISO 10816-3)
  rollerWear: number[];       // Rollers 1-4 Segmented Tire Wear (%)
  status: 'RUNNING' | 'STANDBY' | 'TRIPPED' | 'ALARM' | 'RUMBLE';
}

export interface BaghouseTelemetry {
  differentialPressure: number; // Bag Filter ΔP (8.0 - 25.0 mbar)
  inletGasTemp: number;         // Flue Gas Inlet Temperature (160 - 240 °C)
  outletGasTemp: number;        // Stack Exhaust Temperature (95 - 120 °C)
  stackDustOpacity: number;     // Stack Opacity (mg/Nm³, limit: 20 mg/Nm³)
  idFanSpeed: number;           // ID Fan Speed (0 - 990 RPM)
  idFanCurrent: number;         // ID Fan Motor Current (0 - 195 A)
  idFanPower: number;           // ID Fan Power (0 - 1800 kW)
  activePulseRow: number;       // Pulse-Jet Solenoid Active Manifold (1 - 8)
  pulseJetFiring: boolean;      // Solenoid Air Burst Active
  freshAirDamperOpen: number;   // Tempering Air Damper Position (0 - 100%)
  damperInterlockActive: boolean; // Over-temperature interlock active
  status: 'HEALTHY' | 'PULSING' | 'HIGH_DP' | 'HIGH_TEMP' | 'TRIPPED';
}

export interface VfdSldTelemetry {
  mvBusVoltage: number;         // 6.6 kV Medium Voltage Incomer (V)
  gridFrequency: number;        // Grid Frequency (Hz, 49.8 - 50.2)
  vcbClosed: boolean;           // Vacuum Circuit Breaker Status
  dcBusVoltage: number;         // Intermediate DC Link (0 - 9800 VDC)
  igbtTemp: number;             // Inverter IGBT Junction Temp (°C)
  thdI: number;                 // Total Harmonic Distortion - Current (%)
  thdV: number;                 // Total Harmonic Distortion - Voltage (%)
  h5_amp: number;               // 5th Harmonic Magnitude (%)
  h7_amp: number;               // 7th Harmonic Magnitude (%)
  h11_amp: number;              // 11th Harmonic Magnitude (%)
  h13_amp: number;              // 13th Harmonic Magnitude (%)
  transformerSecondary1V: number; // +20° Secondary Winding (V)
  transformerSecondary2V: number; // 0° Secondary Winding (V)
  transformerSecondary3V: number; // -20° Secondary Winding (V)
  relay51_50_trip: boolean;     // ANSI 51/50 Overcurrent / Short Circuit Trip
  relay27_59_trip: boolean;     // ANSI 27/59 DC Under/Overvoltage Trip
  relay87T_trip: boolean;       // ANSI 87T Transformer Differential Trip
  status: 'CLOSED' | 'TRIPPED' | 'STANDBY';
}

export interface AiPredictiveTelemetry {
  fftPeakFreq: number;          // Dominant Peak Frequency (Hz)
  fftPeakAmp: number;           // Dominant Peak Amplitude (mm/s)
  healthScore: number;          // Machine Health Index (0 - 100%)
  rulHours: number;             // Remaining Useful Life (hours)
  anomalyDetected: boolean;     // Autoencoder Anomaly Flag
  anomalyMessage: string;       // AI Diagnosis String
}

export interface SoeEvent {
  id: string;
  timestamp: string;
  source: string;
  type: 'INFO' | 'WARNING' | 'ALARM' | 'TRIP' | 'RESET';
  message: string;
}

export interface FaultState {
  millRumble: boolean;
  baghouseClogging: boolean;
  vfdOvervoltage: boolean;
  emergencyTrip: boolean;
}

export interface ScadaSystemState {
  vrm: VrmTelemetry;
  baghouse: BaghouseTelemetry;
  vfd: VfdSldTelemetry;
  ai: AiPredictiveTelemetry;
  faults: FaultState;
  events: SoeEvent[];
  audioMuted: boolean;
  systemClock: string;
}
