/**
 * VRM-NEXUS: Vertical Roller Mill Graphic Component
 * Ultra-detailed animated SVG of VRM (Loesche / Pfeiffer Design)
 * 
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي
 * Tareq Abuashi — Lead Electrical & Automation Systems Engineer
 */

import { VrmTelemetry } from '../types/scada';

export class VrmGraphic {
  private container: HTMLElement;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container #${containerId} not found`);
    this.container = el;
    this.renderInitialStructure();
  }

  private renderInitialStructure() {
    this.container.innerHTML = `
      <div class="panel-header">
        <div class="panel-title-group">
          <span class="badge-tag tag-cyan">PROCESS TWIN</span>
          <h4 class="panel-title">Vertical Roller Mill (VRM 4-Roller & MV-VFD 4200 kW)</h4>
        </div>
        <div class="header-badges">
          <span class="status-pill status-running" id="vrm-status-pill">RUNNING (VFD 46.5 Hz)</span>
        </div>
      </div>

      <div class="vrm-svg-wrapper" style="position: relative; width: 100%; height: 360px; background: #070b14; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-card);">
        <svg viewBox="0 0 900 500" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" id="vrm-main-svg">
          <defs>
            <!-- Gradients -->
            <linearGradient id="millBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#1e293b"/>
              <stop offset="30%" stop-color="#334155"/>
              <stop offset="70%" stop-color="#1e293b"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>

            <linearGradient id="rollerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#94a3b8"/>
              <stop offset="50%" stop-color="#475569"/>
              <stop offset="100%" stop-color="#1e293b"/>
            </linearGradient>

            <linearGradient id="hydCylGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0284c7"/>
              <stop offset="50%" stop-color="#0369a1"/>
              <stop offset="100%" stop-color="#0c4a6e"/>
            </linearGradient>

            <linearGradient id="gasInletGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="rgba(249, 115, 22, 0.8)"/>
              <stop offset="100%" stop-color="rgba(234, 88, 12, 0.2)"/>
            </linearGradient>

            <linearGradient id="bedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#d97706"/>
              <stop offset="50%" stop-color="#b45309"/>
              <stop offset="100%" stop-color="#78350f"/>
            </linearGradient>

            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <!-- Background Grid Lines -->
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
          </pattern>
          <rect width="900" height="500" fill="url(#grid)" />

          <!-- Hot Gas Inlet Duct (Left Side) -->
          <path d="M 50 360 L 260 360 L 260 320 L 50 320 Z" fill="url(#gasInletGrad)" stroke="#f97316" stroke-width="2"/>
          <text x="80" y="345" fill="#fdba74" font-size="12" font-family="var(--font-mono)" font-weight="700">HOT GAS INLET (210°C)</text>
          
          <!-- Hot gas airflow arrows -->
          <g id="gas-flow-particles">
            <circle cx="120" cy="340" r="3" fill="#ffedd5" opacity="0.8">
              <animate attributeName="cx" from="60" to="250" dur="1.8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="180" cy="340" r="4" fill="#fed7aa" opacity="0.8">
              <animate attributeName="cx" from="60" to="250" dur="1.4s" repeatCount="indefinite"/>
            </circle>
          </g>

          <!-- Mill Casing (Conical & Cylindrical Shell) -->
          <path d="M 260 410 L 260 210 L 330 110 L 570 110 L 640 210 L 640 410 Z" fill="url(#millBodyGrad)" stroke="#475569" stroke-width="3" opacity="0.95"/>
          
          <!-- Mill Top Classifier Housing & Outlet -->
          <rect x="370" y="50" width="160" height="60" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <path d="M 420 50 L 420 15 L 480 15 L 480 50 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
          <text x="450" y="35" fill="#38bdf8" font-size="11" font-family="var(--font-mono)" font-weight="700" text-anchor="middle">TO BAGHOUSE</text>

          <!-- Dynamic Cage Classifier (Rotating Cage Vanes) -->
          <g id="dynamic-classifier" transform="translate(450, 80)">
            <rect x="-65" y="-18" width="130" height="36" rx="3" fill="#0b1120" stroke="#0ea5e9" stroke-width="2"/>
            <!-- Rotor blades spinning effect -->
            <g id="classifier-blades">
              <line x1="-55" y1="-15" x2="-55" y2="15" stroke="#38bdf8" stroke-width="2.5"/>
              <line x1="-35" y1="-15" x2="-35" y2="15" stroke="#38bdf8" stroke-width="2.5"/>
              <line x1="-15" y1="-15" x2="-15" y2="15" stroke="#38bdf8" stroke-width="2.5"/>
              <line x1="5" y1="-15" x2="5" y2="15" stroke="#38bdf8" stroke-width="2.5"/>
              <line x1="25" y1="-15" x2="25" y2="15" stroke="#38bdf8" stroke-width="2.5"/>
              <line x1="45" y1="-15" x2="45" y2="15" stroke="#38bdf8" stroke-width="2.5"/>
            </g>
          </g>
          <text x="450" y="105" fill="#94a3b8" font-size="10" font-family="var(--font-mono)" text-anchor="middle" id="classifier-rpm-text">DYNAMIC CLASSIFIER: 115 RPM</text>

          <!-- Raw Material Feed Chute (Right side entry) -->
          <path d="M 720 160 L 590 230 L 580 250 L 610 255 L 720 190 Z" fill="#334155" stroke="#64748b" stroke-width="2"/>
          <text x="730" y="175" fill="#facc15" font-size="11" font-family="var(--font-mono)" font-weight="700">RAW FEED (195 t/h)</text>
          <!-- Falling Feed Particles -->
          <circle cx="600" cy="245" r="3.5" fill="#d97706">
            <animate attributeName="cy" values="235;290;340" dur="0.8s" repeatCount="indefinite"/>
            <animate attributeName="cx" values="600;550;490" dur="0.8s" repeatCount="indefinite"/>
          </circle>

          <!-- Mill Planetary Gearbox & Motor Drive Underneath -->
          <rect x="360" y="415" width="180" height="55" rx="4" fill="#0f172a" stroke="#64748b" stroke-width="2"/>
          <text x="450" y="445" fill="#94a3b8" font-size="11" font-family="var(--font-mono)" font-weight="700" text-anchor="middle">PLANETARY GEARBOX & THRUST PAD</text>
          <text x="450" y="460" fill="#38bdf8" font-size="10" font-family="var(--font-mono)" text-anchor="middle">6.6 kV - 4200 kW MV-VFD</text>

          <!-- Rotating Mill Table -->
          <g id="mill-table-assembly">
            <ellipse cx="450" cy="365" rx="150" ry="22" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
            <!-- Material Bed on Table -->
            <ellipse cx="450" cy="363" rx="140" ry="18" fill="url(#bedGrad)" opacity="0.9" id="mill-bed-graphic"/>
            <!-- Table rotation markers -->
            <g id="table-rotation-markers">
              <line x1="330" y1="363" x2="350" y2="363" stroke="#fef08a" stroke-width="2"/>
              <line x1="550" y1="363" x2="570" y2="363" stroke="#fef08a" stroke-width="2"/>
            </g>
          </g>

          <!-- 4 Grinding Rollers & Hydraulic Suspension Cylinders -->
          <!-- Roller 1 (Left Inner) -->
          <g id="roller-1-group" class="roller-assembly" transform="translate(0, 0)">
            <!-- Hydraulic Rocker Arm -->
            <path d="M 280 250 L 350 330" stroke="#0284c7" stroke-width="12" stroke-linecap="round"/>
            <!-- Hydraulic Cylinder 88.5 Bar -->
            <rect x="250" y="220" width="45" height="24" rx="4" fill="url(#hydCylGrad)" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="272" y="236" fill="#f8fafc" font-size="9" font-family="var(--font-mono)" text-anchor="middle">88 Bar</text>
            <!-- Heavy Grinding Roller Wheel -->
            <ellipse cx="360" cy="335" rx="35" ry="48" fill="url(#rollerGrad)" stroke="#0ea5e9" stroke-width="2.5"/>
            <circle cx="360" cy="335" r="10" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
            <text x="360" y="339" fill="#38bdf8" font-size="10" font-family="var(--font-mono)" font-weight="700" text-anchor="middle">R1</text>
          </g>

          <!-- Roller 2 (Right Inner) -->
          <g id="roller-2-group" class="roller-assembly" transform="translate(0, 0)">
            <!-- Hydraulic Rocker Arm -->
            <path d="M 620 250 L 540 330" stroke="#0284c7" stroke-width="12" stroke-linecap="round"/>
            <!-- Hydraulic Cylinder -->
            <rect x="605" y="220" width="45" height="24" rx="4" fill="url(#hydCylGrad)" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="627" y="236" fill="#f8fafc" font-size="9" font-family="var(--font-mono)" text-anchor="middle">88 Bar</text>
            <!-- Grinding Roller Wheel -->
            <ellipse cx="540" cy="335" rx="35" ry="48" fill="url(#rollerGrad)" stroke="#0ea5e9" stroke-width="2.5"/>
            <circle cx="540" cy="335" r="10" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
            <text x="540" y="339" fill="#38bdf8" font-size="10" font-family="var(--font-mono)" font-weight="700" text-anchor="middle">R2</text>
          </g>

          <!-- Internal Aerodynamic Material Circulation Particles -->
          <g id="circulating-particles">
            <circle cx="380" cy="270" r="2.5" fill="#cbd5e1" opacity="0.6">
              <animate attributeName="cy" values="340;180;100" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="cx" values="360;400;440" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="520" cy="260" r="2.5" fill="#cbd5e1" opacity="0.6">
              <animate attributeName="cy" values="340;190;100" dur="2.3s" repeatCount="indefinite"/>
              <animate attributeName="cx" values="540;500;460" dur="2.3s" repeatCount="indefinite"/>
            </circle>
            <!-- Coarse Rejects falling back from classifier -->
            <circle cx="430" cy="140" r="3" fill="#b45309" opacity="0.8">
              <animate attributeName="cy" values="130;260;350" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="470" cy="140" r="3" fill="#b45309" opacity="0.8">
              <animate attributeName="cy" values="130;260;350" dur="1.7s" repeatCount="indefinite"/>
            </circle>
          </g>

          <!-- Real-Time HUD Floating Callouts -->
          <!-- Bed Depth HUD Callout -->
          <g transform="translate(18, 20)">
            <rect width="180" height="70" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#1e293b" stroke-width="1.5"/>
            <text x="12" y="22" fill="#94a3b8" font-size="10" font-family="var(--font-mono)">MATERIAL BED DEPTH</text>
            <text x="12" y="48" fill="#38bdf8" font-size="20" font-family="var(--font-mono)" font-weight="700" id="vrm-hud-bed">62.0 mm</text>
            <text x="120" y="46" fill="#64748b" font-size="10" font-family="var(--font-mono)">Opt: 55-75</text>
            <line x1="12" y1="56" x2="168" y2="56" stroke="#334155" stroke-width="3" stroke-linecap="round"/>
            <line x1="12" y1="56" x2="120" y2="56" stroke="#0284c7" stroke-width="3" stroke-linecap="round" id="vrm-hud-bed-bar"/>
          </g>

          <!-- Hydraulic Pressure HUD Callout -->
          <g transform="translate(702, 20)">
            <rect width="180" height="70" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#1e293b" stroke-width="1.5"/>
            <text x="12" y="22" fill="#94a3b8" font-size="10" font-family="var(--font-mono)">GRINDING HYD PRESSURE</text>
            <text x="12" y="48" fill="#10b981" font-size="20" font-family="var(--font-mono)" font-weight="700" id="vrm-hud-pressure">88.5 Bar</text>
            <text x="120" y="46" fill="#64748b" font-size="10" font-family="var(--font-mono)">65-110 Bar</text>
            <line x1="12" y1="56" x2="168" y2="56" stroke="#334155" stroke-width="3" stroke-linecap="round"/>
            <line x1="12" y1="56" x2="135" y2="56" stroke="#10b981" stroke-width="3" stroke-linecap="round" id="vrm-hud-press-bar"/>
          </g>

          <!-- Vibration Warning Banner (Hidden unless rumble) -->
          <g id="vrm-rumble-banner" opacity="0" transform="translate(250, 435)">
            <rect width="400" height="32" rx="4" fill="rgba(239, 68, 68, 0.95)" stroke="#fecaca" stroke-width="1.5"/>
            <text x="200" y="21" fill="#ffffff" font-size="12" font-family="var(--font-mono)" font-weight="800" text-anchor="middle">
              ⚠️ SEVERE MILL RUMBLE - BED COLLAPSE DETECTED!
            </text>
          </g>
        </svg>
      </div>

      <!-- Quick Metrics Bar Below SVG -->
      <div class="vrm-footer-metrics" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 10px;">
        <div class="digital-readout-card" style="padding: 8px 12px;">
          <div class="readout-label" style="font-size: 11px;">Motor Frequency</div>
          <div class="font-mono text-cyan" style="font-size: 18px; font-weight: 700;" id="metric-vrm-freq">46.5 Hz</div>
        </div>
        <div class="digital-readout-card" style="padding: 8px 12px;">
          <div class="readout-label" style="font-size: 11px;">Stator Current</div>
          <div class="font-mono text-cyan" style="font-size: 18px; font-weight: 700;" id="metric-vrm-current">385.2 A</div>
        </div>
        <div class="digital-readout-card" style="padding: 8px 12px;">
          <div class="readout-label" style="font-size: 11px;">Active Power</div>
          <div class="font-mono text-cyan" style="font-size: 18px; font-weight: 700;" id="metric-vrm-power">3,350 kW</div>
        </div>
        <div class="digital-readout-card" style="padding: 8px 12px;">
          <div class="readout-label" style="font-size: 11px;">Motor Torque</div>
          <div class="font-mono text-cyan" style="font-size: 18px; font-weight: 700;" id="metric-vrm-torque">82.4 %</div>
        </div>
      </div>
    `;
  }

  public update(telemetry: VrmTelemetry) {
    // 1. Bed depth text & bar
    const bedEl = document.getElementById('vrm-hud-bed');
    if (bedEl) bedEl.textContent = `${telemetry.bedDepth.toFixed(1)} mm`;

    const bedBar = document.getElementById('vrm-hud-bed-bar');
    if (bedBar) {
      const pct = Math.max(0, Math.min(100, (telemetry.bedDepth / 100) * 100));
      bedBar.setAttribute('x2', (12 + (pct * 1.56)).toString());
      if (telemetry.bedDepth < 30) {
        bedBar.setAttribute('stroke', '#ef4444');
      } else {
        bedBar.setAttribute('stroke', '#0284c7');
      }
    }

    // 2. Grinding Pressure
    const pressEl = document.getElementById('vrm-hud-pressure');
    if (pressEl) pressEl.textContent = `${telemetry.grindingPressure.toFixed(1)} Bar`;

    // 3. Classifier RPM
    const rpmText = document.getElementById('classifier-rpm-text');
    if (rpmText) rpmText.textContent = `DYNAMIC CLASSIFIER: ${telemetry.classifierRpm} RPM`;

    // 4. Digital Readouts
    const freqEl = document.getElementById('metric-vrm-freq');
    if (freqEl) freqEl.textContent = `${telemetry.frequency.toFixed(1)} Hz`;

    const currEl = document.getElementById('metric-vrm-current');
    if (currEl) currEl.textContent = `${telemetry.current.toFixed(1)} A`;

    const powEl = document.getElementById('metric-vrm-power');
    if (powEl) powEl.textContent = `${Math.round(telemetry.activePower).toLocaleString()} kW`;

    const torqEl = document.getElementById('metric-vrm-torque');
    if (torqEl) torqEl.textContent = `${telemetry.torque.toFixed(1)} %`;

    // 5. Status Pill & Rumble Animation
    const pill = document.getElementById('vrm-status-pill');
    const rumbleBanner = document.getElementById('vrm-rumble-banner');
    const roller1 = document.getElementById('roller-1-group');
    const roller2 = document.getElementById('roller-2-group');

    if (telemetry.status === 'RUMBLE') {
      if (pill) {
        pill.className = 'status-pill status-tripped';
        pill.textContent = 'RUMBLE ALARM (>12 mm/s)';
      }
      if (rumbleBanner) rumbleBanner.setAttribute('opacity', '1');

      // Bounce rollers aggressively
      const jitter1 = (Math.random() - 0.5) * 8;
      const jitter2 = (Math.random() - 0.5) * 8;
      if (roller1) roller1.setAttribute('transform', `translate(0, ${jitter1})`);
      if (roller2) roller2.setAttribute('transform', `translate(0, ${jitter2})`);
    } else if (telemetry.status === 'TRIPPED') {
      if (pill) {
        pill.className = 'status-pill status-tripped';
        pill.textContent = 'TRIPPED (0.0 Hz)';
      }
      if (rumbleBanner) rumbleBanner.setAttribute('opacity', '0');
      if (roller1) roller1.setAttribute('transform', 'translate(0, 0)');
      if (roller2) roller2.setAttribute('transform', 'translate(0, 0)');
    } else {
      if (pill) {
        pill.className = 'status-pill status-running';
        pill.textContent = `RUNNING (VFD ${telemetry.frequency.toFixed(1)} Hz)`;
      }
      if (rumbleBanner) rumbleBanner.setAttribute('opacity', '0');
      if (roller1) roller1.setAttribute('transform', 'translate(0, 0)');
      if (roller2) roller2.setAttribute('transform', 'translate(0, 0)');
    }
  }
}
