/**
 * VRM-NEXUS: Vertical Roller Mill, MV-VFD Drive & ESP Baghouse Filtration SCADA
 * Main Application Orchestrator
 * 
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي
 * Tareq Abuashi — Lead Electrical & Automation Systems Engineer
 */

import { telemetryEngine } from './engine/telemetryEngine';
import { scadaAudio } from './engine/audioAlarm';
import { VrmGraphic } from './components/VrmGraphic';
import { BaghouseGraphic } from './components/BaghouseGraphic';
import { VfdSldDiagram } from './components/VfdSldDiagram';
import { VibrationCanvas } from './components/VibrationCanvas';
import { DossierModal } from './components/DossierModal';
import { ScadaSystemState, SoeEvent } from './types/scada';

class VrmNexusApplication {
  private vrmGraphic!: VrmGraphic;
  private baghouseGraphic!: BaghouseGraphic;
  private vfdSldDiagram!: VfdSldDiagram;
  private vibeCanvas!: VibrationCanvas;
  private dossierModal!: DossierModal;

  constructor() {
    this.initComponents();
    this.bindEvents();
    this.subscribeTelemetry();
  }

  private initComponents() {
    this.vrmGraphic = new VrmGraphic('vrm-graphic-container');
    this.baghouseGraphic = new BaghouseGraphic('baghouse-graphic-container');
    this.vfdSldDiagram = new VfdSldDiagram('vfd-sld-container');
    this.vibeCanvas = new VibrationCanvas('vibe-canvas-container');
    this.dossierModal = new DossierModal();
  }

  private bindEvents() {
    // 1. Audio Mute Toggle
    const btnAudio = document.getElementById('btn-audio-toggle');
    const audioIcon = document.getElementById('audio-icon');
    const audioText = document.getElementById('audio-text');

    btnAudio?.addEventListener('click', () => {
      scadaAudio.playClick();
      const isMuted = scadaAudio.toggleMute();
      if (audioIcon && audioText) {
        if (isMuted) {
          audioIcon.className = 'fa-solid fa-volume-xmark text-muted';
          audioText.textContent = 'Audio: Muted';
        } else {
          audioIcon.className = 'fa-solid fa-volume-high text-cyan';
          audioText.textContent = 'Audio: Active';
        }
      }
    });

    // 2. Screen Share / Live Cast API
    const btnShare = document.getElementById('btn-screen-share');
    btnShare?.addEventListener('click', async () => {
      scadaAudio.playClick();
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          await navigator.mediaDevices.getDisplayMedia({ video: true });
          telemetryEngine.logEvent('HMI Terminal', 'INFO', 'SCADA Display Broadcast stream initiated by Lead Engineer Tareq Abuashi.');
        } else {
          alert('Screen sharing is active or not supported by this browser sandbox.');
        }
      } catch (err) {
        console.warn('Screen share cancelled or unpermitted:', err);
      }
    });

    // 3. Engineering Dossier Modal
    const btnDossier = document.getElementById('btn-open-dossier');
    btnDossier?.addEventListener('click', () => {
      scadaAudio.playClick();
      this.dossierModal.show();
    });

    // 4. Quick Reset & Fault Reset
    const btnQuickReset = document.getElementById('btn-quick-reset');
    const btnFaultReset = document.getElementById('btn-fault-reset');

    const handleReset = () => {
      scadaAudio.playClick();
      telemetryEngine.resetSystem();
    };

    btnQuickReset?.addEventListener('click', handleReset);
    btnFaultReset?.addEventListener('click', handleReset);

    // 5. Fault Injections
    document.getElementById('btn-fault-rumble')?.addEventListener('click', () => {
      scadaAudio.playClick();
      telemetryEngine.triggerMillRumble();
    });

    document.getElementById('btn-fault-baghouse')?.addEventListener('click', () => {
      scadaAudio.playClick();
      telemetryEngine.triggerBaghouseClogging();
    });

    document.getElementById('btn-fault-vfd')?.addEventListener('click', () => {
      scadaAudio.playClick();
      telemetryEngine.triggerVfdOvervoltage();
    });

    document.getElementById('btn-fault-estop')?.addEventListener('click', () => {
      scadaAudio.playClick();
      telemetryEngine.triggerEmergencyTrip();
    });

    // 6. Manual Solenoid Pulse Burst
    document.getElementById('btn-manual-pulse')?.addEventListener('click', () => {
      telemetryEngine.triggerManualPulseBurst();
    });

    // 7. DCS Sliders: Feed Rate & Classifier RPM
    const sliderFeed = document.getElementById('slider-feed-rate') as HTMLInputElement | null;
    const feedValText = document.getElementById('feed-rate-slider-val');
    sliderFeed?.addEventListener('input', (e) => {
      const val = parseFloat((e.target as HTMLInputElement).value);
      if (feedValText) feedValText.textContent = `${val.toFixed(1)} t/h`;
      telemetryEngine.setFeedRate(val);
    });

    const sliderClassifier = document.getElementById('slider-classifier') as HTMLInputElement | null;
    const classifierValText = document.getElementById('classifier-slider-val');
    sliderClassifier?.addEventListener('input', (e) => {
      const val = parseInt((e.target as HTMLInputElement).value, 10);
      if (classifierValText) classifierValText.textContent = `${val} RPM`;
      telemetryEngine.setClassifierSpeed(val);
    });
  }

  private subscribeTelemetry() {
    telemetryEngine.subscribe((state: ScadaSystemState) => {
      this.updateHeaderAndAnnunciator(state);
      this.vrmGraphic.update(state.vrm);
      this.baghouseGraphic.update(state.baghouse);
      this.vfdSldDiagram.update(state.vfd);
      this.vibeCanvas.update(state.vrm, state.ai);
      this.updateRtdMatrix(state.vrm);
      this.updateSoeLog(state.events);
    });
  }

  private updateHeaderAndAnnunciator(state: ScadaSystemState) {
    // Header Telemetry
    const gridFreqEl = document.getElementById('header-grid-freq');
    if (gridFreqEl) gridFreqEl.textContent = `${state.vfd.gridFrequency.toFixed(2)} Hz`;

    const busVoltsEl = document.getElementById('header-bus-volts');
    if (busVoltsEl) busVoltsEl.textContent = `${state.vfd.mvBusVoltage.toLocaleString()} V`;

    const clockEl = document.getElementById('header-clock');
    if (clockEl) clockEl.textContent = state.systemClock;

    // Master Alarm Banner
    const badge = document.getElementById('alarm-badge-status');
    const msg = document.getElementById('alarm-banner-message');
    const soeTime = document.getElementById('soe-timestamp');

    if (state.events.length > 0 && soeTime) {
      soeTime.textContent = state.events[0].timestamp;
    }

    if (state.faults.emergencyTrip) {
      if (badge) {
        badge.className = 'alarm-badge tripped';
        badge.textContent = 'MASTER TRIP';
      }
      if (msg) msg.textContent = 'EMERGENCY TRIP ACTIVATED - ALL 6.6 kV MV BREAKERS OPENED & DRIVES HALTED!';
    } else if (state.faults.vfdOvervoltage) {
      if (badge) {
        badge.className = 'alarm-badge tripped';
        badge.textContent = 'ANSI 59 TRIP';
      }
      if (msg) msg.textContent = 'TRIP: 18-PULSE VFD DC-BUS OVERVOLTAGE (>9,450 VDC) - VCB 52-1 OPENED!';
    } else if (state.faults.millRumble) {
      if (badge) {
        badge.className = 'alarm-badge warning';
        badge.textContent = 'RUMBLE ALARM';
      }
      if (msg) msg.textContent = 'ALARM: SEVERE MILL RUMBLE & ROLLER BOUNCE DETECTED - BED DEPTH COLLAPSED!';
    } else if (state.faults.baghouseClogging) {
      if (badge) {
        badge.className = 'alarm-badge warning';
        badge.textContent = 'BAG FILTER HIGH ΔP';
      }
      if (msg) msg.textContent = 'ALARM: BAGHOUSE HIGH DIFFERENTIAL PRESSURE (>20 mbar) - RAPID PULSING ACTIVE!';
    } else {
      if (badge) {
        badge.className = 'alarm-badge healthy';
        badge.textContent = 'NORMAL';
      }
      if (msg) msg.textContent = 'SYSTEM HEALTHY - VRM 4-ROLLER MILL & 18-PULSE VFD IN NOMINAL REGULATION';
    }
  }

  private updateRtdMatrix(vrm: ScadaSystemState['vrm']) {
    const sump = document.getElementById('temp-gbx-sump');
    if (sump) sump.textContent = `${vrm.gearboxSumpTemp.toFixed(1)} °C`;

    const thrust = document.getElementById('temp-gbx-thrust');
    if (thrust) thrust.textContent = `${vrm.gearboxThrustTemp.toFixed(1)} °C`;

    vrm.rollerTemps.forEach((temp, idx) => {
      const el = document.getElementById(`temp-roller-${idx + 1}`);
      if (el) el.textContent = `${temp.toFixed(1)} °C`;
    });
  }

  private updateSoeLog(events: SoeEvent[]) {
    const box = document.getElementById('soe-log-box');
    const countEl = document.getElementById('soe-event-count');
    if (countEl) countEl.textContent = `${events.length} EVENTS LOGGED`;

    if (box) {
      box.innerHTML = events.slice(0, 15).map(ev => {
        let colorClass = 'text-muted';
        if (ev.type === 'ALARM' || ev.type === 'TRIP') colorClass = 'text-red';
        else if (ev.type === 'WARNING') colorClass = 'text-amber';
        else if (ev.type === 'RESET') colorClass = 'text-green';
        else if (ev.type === 'INFO') colorClass = 'text-cyan';

        return `
          <div style="line-height: 1.4;">
            <span class="${colorClass}">[${ev.timestamp}]</span>
            <span style="color: #64748b;">[${ev.source}]</span>
            <span style="color: #cbd5e1;">${ev.message}</span>
          </div>
        `;
      }).join('');
    }
  }
}

// Bootstrap once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new VrmNexusApplication();
});
