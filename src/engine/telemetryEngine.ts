/**
 * VRM-NEXUS: Vertical Roller Mill, MV-VFD Drive & ESP Baghouse Filtration SCADA
 * Real-time Industrial Telemetry & Physics Simulation Engine
 * 
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي
 * Tareq Abuashi — Lead Electrical & Automation Systems Engineer
 */

import { ScadaSystemState, SoeEvent } from '../types/scada';
import { scadaAudio } from './audioAlarm';

export type StateListener = (state: ScadaSystemState) => void;

export class TelemetryEngine {
  private state: ScadaSystemState;
  private listeners: StateListener[] = [];
  private timer: number | null = null;
  private fastTimer: number | null = null;
  private pulseStepTimer: number | null = null;
  private startTime: number = Date.now();

  constructor() {
    this.state = {
      vrm: {
        frequency: 46.5,
        current: 385.2,
        activePower: 3350,
        powerFactor: 0.89,
        torque: 82.4,
        grindingPressure: 88.5,
        bedDepth: 62.0,
        classifierRpm: 115,
        feedRate: 195.0,
        gearboxSumpTemp: 58.4,
        gearboxThrustTemp: 64.2,
        rollerTemps: [68.5, 71.2, 69.8, 70.4],
        vibrationRms: 2.35,
        rollerWear: [14.2, 16.5, 13.8, 15.1],
        status: 'RUNNING'
      },
      baghouse: {
        differentialPressure: 12.4,
        inletGasTemp: 184.5,
        outletGasTemp: 104.2,
        stackDustOpacity: 7.2,
        idFanSpeed: 940,
        idFanCurrent: 162.5,
        idFanPower: 1480,
        activePulseRow: 1,
        pulseJetFiring: false,
        freshAirDamperOpen: 0,
        damperInterlockActive: false,
        status: 'HEALTHY'
      },
      vfd: {
        mvBusVoltage: 6604,
        gridFrequency: 50.01,
        vcbClosed: true,
        dcBusVoltage: 8910,
        igbtTemp: 61.5,
        thdI: 2.38,
        thdV: 1.76,
        h5_amp: 0.42,
        h7_amp: 0.38,
        h11_amp: 0.88,
        h13_amp: 0.74,
        transformerSecondary1V: 2202,
        transformerSecondary2V: 2200,
        transformerSecondary3V: 2204,
        relay51_50_trip: false,
        relay27_59_trip: false,
        relay87T_trip: false,
        status: 'CLOSED'
      },
      ai: {
        fftPeakFreq: 312,
        fftPeakAmp: 1.15,
        healthScore: 98.4,
        rulHours: 1450,
        anomalyDetected: false,
        anomalyMessage: 'AI Diagnostic: Autoencoder healthy - All Harmonics Nominal (ISO 10816 Zone A)'
      },
      faults: {
        millRumble: false,
        baghouseClogging: false,
        vfdOvervoltage: false,
        emergencyTrip: false
      },
      events: [
        {
          id: 'ev-1',
          timestamp: '00:00:01.120',
          source: '6.6kV MV Switchgear',
          type: 'INFO',
          message: 'Incoming MV Bus 6600V energized. Phase balance: 99.8%.'
        },
        {
          id: 'ev-2',
          timestamp: '00:00:02.450',
          source: '18-Pulse VFD Drive',
          type: 'INFO',
          message: 'VCB 52-1 closed. DC Link pre-charged to 8910 VDC. PWM active.'
        },
        {
          id: 'ev-3',
          timestamp: '00:00:03.880',
          source: 'VRM Mill System',
          type: 'INFO',
          message: 'Mill table running at 46.5 Hz. Hyd pressure: 88.5 Bar. Bed depth: 62mm.'
        }
      ],
      audioMuted: false,
      systemClock: '00:00:00'
    };

    this.startClock();
    this.startSimulationLoop();
    this.startPulseJetSequencer();
  }

  public getState(): ScadaSystemState {
    return this.state;
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  private startClock() {
    setInterval(() => {
      const now = new Date();
      this.state.systemClock = now.toTimeString().split(' ')[0];
    }, 1000);
  }

  /**
   * Main 1000ms SCADA telemetry polling and dynamic physics engine
   */
  private startSimulationLoop() {
    this.timer = window.setInterval(() => {
      this.tickTelemetry();
      this.notify();
    }, 1000);

    // Fast 100ms sub-loop for smooth jitter
    this.fastTimer = window.setInterval(() => {
      this.fastJitter();
    }, 150);
  }

  /**
   * Automatic Baghouse Pulse-Jet Sequencer
   * Cycles rows 1 through 8 every 3.5 seconds in normal mode, or every 1.2s when ΔP > 16 mbar
   */
  private startPulseJetSequencer() {
    const runPulseCycle = () => {
      if (this.state.vfd.vcbClosed && !this.state.faults.emergencyTrip) {
        // Step row
        this.state.baghouse.activePulseRow = (this.state.baghouse.activePulseRow % 8) + 1;
        this.state.baghouse.pulseJetFiring = true;
        scadaAudio.playPulseJet();

        // Slightly relieve ΔP on firing
        if (!this.state.faults.baghouseClogging) {
          this.state.baghouse.differentialPressure = Math.max(9.0, this.state.baghouse.differentialPressure - 0.4);
        }

        setTimeout(() => {
          this.state.baghouse.pulseJetFiring = false;
          this.notify();
        }, 300);
      }

      const nextDelay = this.state.faults.baghouseClogging ? 1200 : 3500;
      this.pulseStepTimer = window.setTimeout(runPulseCycle, nextDelay);
    };

    this.pulseStepTimer = window.setTimeout(runPulseCycle, 3500);
  }

  /**
   * Trigger Manual Pulse-Jet Blast override
   */
  public triggerManualPulseBurst() {
    this.state.baghouse.pulseJetFiring = true;
    this.state.baghouse.activePulseRow = (this.state.baghouse.activePulseRow % 8) + 1;
    scadaAudio.playPulseJet();
    
    if (this.state.baghouse.differentialPressure > 10) {
      this.state.baghouse.differentialPressure -= 0.8;
    }

    this.logEvent('Baghouse Filter', 'INFO', `Manual pulse burst triggered on Solenoid Row #${this.state.baghouse.activePulseRow}. Air pressure: 6.2 Bar.`);

    setTimeout(() => {
      this.state.baghouse.pulseJetFiring = false;
      this.notify();
    }, 350);
  }

  /**
   * Set Mill Feed Rate (0 - 280 t/h)
   */
  public setFeedRate(rate: number) {
    this.state.vrm.feedRate = Math.max(0, Math.min(280, rate));
    // Bed depth correlates with feed rate
    this.state.vrm.bedDepth = 25 + (this.state.vrm.feedRate / 280) * 55;
    this.state.vrm.current = 150 + (this.state.vrm.feedRate / 280) * 290;
    this.state.vrm.activePower = Math.round(this.state.vrm.current * 6.6 * Math.sqrt(3) * this.state.vrm.powerFactor);
    this.notify();
  }

  /**
   * Set Dynamic Classifier Speed (60 - 180 RPM)
   */
  public setClassifierSpeed(rpm: number) {
    this.state.vrm.classifierRpm = Math.max(60, Math.min(180, rpm));
    this.notify();
  }

  /**
   * Set Fresh Air Damper Position (0 - 100%)
   */
  public setFreshAirDamper(pct: number) {
    this.state.baghouse.freshAirDamperOpen = Math.max(0, Math.min(100, pct));
    this.notify();
  }

  private fastJitter() {
    if (this.state.vfd.vcbClosed && !this.state.faults.emergencyTrip) {
      // Tiny realistic analog signal noise
      const noise = (Math.random() - 0.5) * 0.4;
      this.state.vfd.gridFrequency = Number((50.0 + (Math.random() - 0.5) * 0.04).toFixed(2));
      this.state.vfd.mvBusVoltage = Math.round(6600 + (Math.random() - 0.5) * 12);
    }
  }

  private tickTelemetry() {
    const isRunning = this.state.vfd.vcbClosed && !this.state.faults.emergencyTrip && this.state.vrm.status !== 'TRIPPED';

    // 1. Process Mill Rumble / Dry Feed Fault
    if (this.state.faults.millRumble) {
      this.state.vrm.feedRate = Math.max(12, this.state.vrm.feedRate - 25);
      this.state.vrm.bedDepth = Math.max(16, this.state.vrm.bedDepth - 8);
      this.state.vrm.vibrationRms = Math.min(15.2, this.state.vrm.vibrationRms + 1.8 + Math.random() * 0.8);
      this.state.vrm.torque = 65 + Math.sin(Date.now() / 200) * 45; // violent torque oscillation
      this.state.vrm.status = 'RUMBLE';

      this.state.ai.anomalyDetected = true;
      this.state.ai.fftPeakFreq = 312;
      this.state.ai.fftPeakAmp = this.state.vrm.vibrationRms;
      this.state.ai.healthScore = Math.max(34, this.state.ai.healthScore - 4.2);
      this.state.ai.rulHours = Math.max(12, this.state.ai.rulHours - 120);
      this.state.ai.anomalyMessage = `⚠️ PREDICTIVE ALERT: Mill Rumble & Planetary Gear Mesh Anomaly at 312 Hz - RUL: ${Math.round(this.state.ai.rulHours)}h (ISO 10816 Zone D)`;

      scadaAudio.startRumble();
    } else if (isRunning && !this.state.faults.emergencyTrip) {
      scadaAudio.stopRumble();
      // Recover to healthy parameters
      if (this.state.vrm.bedDepth < 60) this.state.vrm.bedDepth += 2.5;
      if (this.state.vrm.vibrationRms > 2.5) this.state.vrm.vibrationRms = Math.max(2.35, this.state.vrm.vibrationRms - 0.9);
      if (this.state.ai.healthScore < 98) this.state.ai.healthScore = Math.min(98.4, this.state.ai.healthScore + 2.1);
      this.state.vrm.torque = 82.4 + (Math.random() - 0.5) * 2.5;
      this.state.vrm.status = 'RUNNING';
      this.state.ai.anomalyDetected = false;
      this.state.ai.anomalyMessage = 'AI Diagnostic: Autoencoder healthy - All Harmonics Nominal (ISO 10816 Zone A)';
    }

    // 2. Process Baghouse Clogging Fault
    if (this.state.faults.baghouseClogging) {
      this.state.baghouse.differentialPressure = Math.min(24.5, this.state.baghouse.differentialPressure + 1.2);
      this.state.baghouse.idFanCurrent = Math.min(194.0, this.state.baghouse.idFanCurrent + 3.5);
      this.state.baghouse.stackDustOpacity = Math.min(28.5, this.state.baghouse.stackDustOpacity + 1.4);
      this.state.baghouse.status = this.state.baghouse.differentialPressure > 20 ? 'HIGH_DP' : 'PULSING';
      scadaAudio.playWarningChime();
    } else if (isRunning) {
      if (this.state.baghouse.differentialPressure > 13.0) {
        this.state.baghouse.differentialPressure = Math.max(12.4, this.state.baghouse.differentialPressure - 0.7);
      }
      if (this.state.baghouse.idFanCurrent > 165) {
        this.state.baghouse.idFanCurrent = Math.max(162.5, this.state.baghouse.idFanCurrent - 2.5);
      }
      if (this.state.baghouse.stackDustOpacity > 7.5) {
        this.state.baghouse.stackDustOpacity = Math.max(7.2, this.state.baghouse.stackDustOpacity - 0.6);
      }
      this.state.baghouse.status = 'HEALTHY';
    }

    // 3. Thermal Over-temperature Interlock Logic for Baghouse
    if (this.state.baghouse.inletGasTemp > 210.0) {
      // Auto open fresh air tempering damper to protect synthetic bags from melting
      this.state.baghouse.damperInterlockActive = true;
      this.state.baghouse.freshAirDamperOpen = Math.min(100, this.state.baghouse.freshAirDamperOpen + 25);
      this.state.baghouse.inletGasTemp -= 4.5; // Cooling effect
      this.logEvent('Baghouse Interlock', 'WARNING', `Thermal Safety Interlock Active: Flue Gas Temp > 210°C. Modulating Fresh Air Damper to ${this.state.baghouse.freshAirDamperOpen}%.`);
      scadaAudio.playWarningChime();
    } else {
      this.state.baghouse.damperInterlockActive = false;
      if (this.state.baghouse.freshAirDamperOpen > 0 && !this.state.faults.baghouseClogging) {
        this.state.baghouse.freshAirDamperOpen = Math.max(0, this.state.baghouse.freshAirDamperOpen - 10);
      }
    }

    // 4. Process VFD DC Bus Overvoltage Fault
    if (this.state.faults.vfdOvervoltage) {
      this.state.vfd.dcBusVoltage = 9880;
      this.state.vfd.relay27_59_trip = true;
      this.state.vfd.vcbClosed = false;
      this.state.vfd.status = 'TRIPPED';
      this.state.vrm.status = 'TRIPPED';
      this.state.vrm.current = 0;
      this.state.vrm.activePower = 0;
      this.state.vrm.frequency = 0;
      scadaAudio.startTripAlarm();
    }

    // Normal electrical telemetry fluctuations
    if (isRunning) {
      this.state.vfd.thdI = Number((2.35 + (Math.random() - 0.5) * 0.15).toFixed(2));
      this.state.vfd.thdV = Number((1.75 + (Math.random() - 0.5) * 0.12).toFixed(2));
      this.state.vfd.dcBusVoltage = Math.round(8910 + (Math.random() - 0.5) * 25);
      this.state.vfd.igbtTemp = Number((61.5 + (Math.random() - 0.5) * 0.4).toFixed(1));
    }
  }

  /**
   * Fault 1: Simulate Mill Rumble / Dry Feed
   */
  public triggerMillRumble() {
    this.state.faults.millRumble = true;
    this.logEvent('VRM Drive System', 'ALARM', 'Mill Feed Starvation triggered! Bed depth collapsing. Extreme roller bounce & planetary gearbox acoustic rumble!');
    scadaAudio.playWarningChime();
    this.notify();
  }

  /**
   * Fault 2: Simulate Baghouse High ΔP Clogging
   */
  public triggerBaghouseClogging() {
    this.state.faults.baghouseClogging = true;
    this.logEvent('Baghouse Filtration', 'ALARM', 'Filter Bag Blindness / Clogging simulated! ΔP rising rapidly above 20 mbar. Emergency rapid pulsing active.');
    scadaAudio.playWarningChime();
    this.notify();
  }

  /**
   * Fault 3: Simulate VFD DC-Bus Overvoltage
   */
  public triggerVfdOvervoltage() {
    this.state.faults.vfdOvervoltage = true;
    this.state.vfd.relay27_59_trip = true;
    this.state.vfd.vcbClosed = false;
    this.state.vfd.status = 'TRIPPED';
    this.state.vrm.status = 'TRIPPED';
    this.state.vrm.frequency = 0;
    this.state.vrm.current = 0;
    this.state.vrm.activePower = 0;

    scadaAudio.playBreakerOperation(false);
    scadaAudio.startTripAlarm();

    this.logEvent('18-Pulse VFD MV', 'TRIP', 'ANSI 59 Instantaneous DC-Bus Overvoltage Trip (9,880 VDC > 9,450 VDC). VCB 52-1 Tripped. Inverter PWM Inhibited!');
    this.notify();
  }

  /**
   * Fault 4: Emergency Trip (E-Stop)
   */
  public triggerEmergencyTrip() {
    this.state.faults.emergencyTrip = true;
    this.state.vfd.vcbClosed = false;
    this.state.vfd.status = 'TRIPPED';
    this.state.vrm.status = 'TRIPPED';
    this.state.vrm.current = 0;
    this.state.vrm.activePower = 0;
    this.state.vrm.frequency = 0;
    this.state.baghouse.idFanSpeed = 0;
    this.state.baghouse.idFanCurrent = 0;
    this.state.baghouse.idFanPower = 0;

    scadaAudio.playBreakerOperation(false);
    scadaAudio.startTripAlarm();

    this.logEvent('Safety Interlock', 'TRIP', 'MASTER EMERGENCY STOP (E-STOP) ACTIVATED! All MV Breakers Opened. ID Fan & Mill Drives Tripped!');
    this.notify();
  }

  /**
   * System Reset & Re-energization
   */
  public resetSystem() {
    this.state.faults.millRumble = false;
    this.state.faults.baghouseClogging = false;
    this.state.faults.vfdOvervoltage = false;
    this.state.faults.emergencyTrip = false;

    // Reset relays
    this.state.vfd.relay51_50_trip = false;
    this.state.vfd.relay27_59_trip = false;
    this.state.vfd.relay87T_trip = false;

    // Reclose VCB
    this.state.vfd.vcbClosed = true;
    this.state.vfd.status = 'CLOSED';
    this.state.vfd.dcBusVoltage = 8910;
    this.state.vfd.mvBusVoltage = 6604;

    // Restore VRM
    this.state.vrm.status = 'RUNNING';
    this.state.vrm.frequency = 46.5;
    this.state.vrm.current = 385.2;
    this.state.vrm.activePower = 3350;
    this.state.vrm.grindingPressure = 88.5;
    this.state.vrm.bedDepth = 62.0;
    this.state.vrm.feedRate = 195.0;
    this.state.vrm.vibrationRms = 2.35;

    // Restore Baghouse
    this.state.baghouse.status = 'HEALTHY';
    this.state.baghouse.differentialPressure = 12.4;
    this.state.baghouse.idFanSpeed = 940;
    this.state.baghouse.idFanCurrent = 162.5;
    this.state.baghouse.idFanPower = 1480;
    this.state.baghouse.stackDustOpacity = 7.2;
    this.state.baghouse.freshAirDamperOpen = 0;

    // Restore AI
    this.state.ai.healthScore = 98.4;
    this.state.ai.anomalyDetected = false;
    this.state.ai.fftPeakAmp = 1.15;
    this.state.ai.anomalyMessage = 'AI Diagnostic: Autoencoder healthy - All Harmonics Nominal (ISO 10816 Zone A)';

    scadaAudio.stopAlarm();
    scadaAudio.stopRumble();
    scadaAudio.playBreakerOperation(true);

    this.logEvent('DCS Master Controller', 'RESET', 'SYSTEM RESET by Lead Engineer Tareq Abuashi. VCB 52-1 reclosed. All ANSI Relays reset. VRM & ID Fan re-sequenced.');
    this.notify();
  }

  public logEvent(source: string, type: 'INFO' | 'WARNING' | 'ALARM' | 'TRIP' | 'RESET', message: string) {
    const elapsedMs = Date.now() - this.startTime;
    const hrs = Math.floor(elapsedMs / 3600000).toString().padStart(2, '0');
    const mins = Math.floor((elapsedMs % 3600000) / 60000).toString().padStart(2, '0');
    const secs = Math.floor((elapsedMs % 60000) / 1000).toString().padStart(2, '0');
    const ms = (elapsedMs % 1000).toString().padStart(3, '0');
    const timestamp = `${hrs}:${mins}:${secs}.${ms}`;

    const newEvent: SoeEvent = {
      id: 'ev-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp,
      source,
      type,
      message
    };

    this.state.events.unshift(newEvent);
    if (this.state.events.length > 50) {
      this.state.events.pop();
    }
  }
}

export const telemetryEngine = new TelemetryEngine();
