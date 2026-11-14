/**
 * VRM-NEXUS: MV Switchgear & 18-Pulse VFD Harmonics Telemetry Component
 * Interactive Single Line Diagram (SVG SLD) with IEEE 519 Telemetry
 * 
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي
 * Tareq Abuashi — Lead Electrical & Automation Systems Engineer
 */

import { VfdSldTelemetry } from '../types/scada';

export class VfdSldDiagram {
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
          <span class="badge-tag tag-cyan">ELECTRICAL SLD</span>
          <h4 class="panel-title">6.6 kV Switchgear & 18-Pulse MV-VFD Drive Architecture</h4>
        </div>
        <div class="header-badges">
          <span class="status-pill status-running" id="sld-vcb-status">VCB 52-1: CLOSED</span>
        </div>
      </div>

      <div class="sld-svg-wrapper" style="position: relative; width: 100%; height: 380px; background: #070b14; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-card);">
        <svg viewBox="0 0 900 520" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" id="vfd-sld-svg">
          <defs>
            <linearGradient id="busbarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#38bdf8"/>
              <stop offset="50%" stop-color="#818cf8"/>
              <stop offset="100%" stop-color="#38bdf8"/>
            </linearGradient>

            <linearGradient id="dcBusGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#f59e0b"/>
              <stop offset="50%" stop-color="#d97706"/>
              <stop offset="100%" stop-color="#f59e0b"/>
            </linearGradient>

            <pattern id="sldGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.02)" stroke-width="1"/>
            </pattern>
          </defs>

          <rect width="900" height="520" fill="url(#sldGrid)"/>

          <!-- 6.6 kV Medium Voltage Busbar -->
          <rect x="50" y="30" width="800" height="12" rx="3" fill="url(#busbarGrad)"/>
          <text x="60" y="24" fill="#38bdf8" font-size="12" font-family="var(--font-mono)" font-weight="700">6.6 kV MV SUBSTATION BUSBAR (INCOMING 50 Hz)</text>
          <text x="750" y="24" fill="#94a3b8" font-size="11" font-family="var(--font-mono)" id="sld-bus-v">6,604 V</text>

          <!-- Feeder Incomer to VCB 52-1 -->
          <line x1="160" y1="42" x2="160" y2="90" stroke="#38bdf8" stroke-width="4"/>

          <!-- ANSI 51/50 Relay CT Sensors -->
          <circle cx="160" cy="70" r="10" fill="none" stroke="#f59e0b" stroke-width="2"/>
          <text x="180" y="74" fill="#f59e0b" font-size="9" font-family="var(--font-mono)">CT: 600/5A</text>

          <!-- Vacuum Circuit Breaker (VCB 52-1) -->
          <g id="vcb-breaker-symbol" transform="translate(130, 90)">
            <rect x="0" y="0" width="60" height="50" rx="4" fill="#0f172a" stroke="#64748b" stroke-width="2"/>
            <!-- Breaker contacts line -->
            <line x1="30" y1="5" x2="30" y2="18" stroke="#38bdf8" stroke-width="3"/>
            <line x1="30" y1="32" x2="30" y2="45" stroke="#38bdf8" stroke-width="3"/>
            <!-- Moving contact knife -->
            <line x1="30" y1="18" x2="30" y2="32" stroke="#10b981" stroke-width="3" id="vcb-knife-line"/>
            <text x="30" y="62" fill="#cbd5e1" font-size="10" font-family="var(--font-mono)" font-weight="700" text-anchor="middle">VCB 52-1</text>
          </g>

          <!-- Line from VCB to 18-Pulse Transformer -->
          <line x1="160" y1="155" x2="160" y2="200" stroke="#38bdf8" stroke-width="4"/>

          <!-- 18-Pulse Phase Shifting Isolation Transformer (5000 kVA, 6.6 kV / 3 x 2.2 kV) -->
          <g transform="translate(90, 200)">
            <rect x="0" y="0" width="140" height="110" rx="5" fill="#0f172a" stroke="#818cf8" stroke-width="2"/>
            <text x="70" y="20" fill="#818cf8" font-size="10" font-family="var(--font-mono)" font-weight="700" text-anchor="middle">18-PULSE XFMR</text>
            <text x="70" y="34" fill="#94a3b8" font-size="8" font-family="var(--font-mono)" text-anchor="middle">5000 kVA (Dyn11+)</text>

            <!-- Primary Delta Winding -->
            <polygon points="70,42 55,62 85,62" fill="none" stroke="#38bdf8" stroke-width="2"/>
            <text x="70" y="58" fill="#38bdf8" font-size="8" font-family="var(--font-mono)" text-anchor="middle">6.6kV</text>

            <!-- 3 Secondary Windings (±20°, 0°) -->
            <circle cx="35" cy="85" r="14" fill="none" stroke="#a855f7" stroke-width="2"/>
            <text x="35" y="88" fill="#a855f7" font-size="8" font-family="var(--font-mono)" text-anchor="middle">+20°</text>

            <circle cx="70" cy="85" r="14" fill="none" stroke="#a855f7" stroke-width="2"/>
            <text x="70" y="88" fill="#a855f7" font-size="8" font-family="var(--font-mono)" text-anchor="middle">0°</text>

            <circle cx="105" cy="85" r="14" fill="none" stroke="#a855f7" stroke-width="2"/>
            <text x="105" y="88" fill="#a855f7" font-size="8" font-family="var(--font-mono)" text-anchor="middle">-20°</text>
          </g>

          <!-- 3 Feeder lines from transformer to Rectifier Bridges -->
          <path d="M 125 310 L 125 350 L 290 350" fill="none" stroke="#a855f7" stroke-width="2.5"/>
          <path d="M 160 310 L 160 380 L 290 380" fill="none" stroke="#a855f7" stroke-width="2.5"/>
          <path d="M 195 310 L 195 410 L 290 410" fill="none" stroke="#a855f7" stroke-width="2.5"/>

          <!-- Three 6-Pulse Diode Bridge Rectifiers -->
          <g transform="translate(290, 335)">
            <rect x="0" y="0" width="80" height="90" rx="4" fill="#0f172a" stroke="#d97706" stroke-width="2"/>
            <text x="40" y="22" fill="#f59e0b" font-size="9" font-family="var(--font-mono)" font-weight="700" text-anchor="middle">3x RECTIFIER</text>
            <text x="40" y="38" fill="#94a3b8" font-size="8" font-family="var(--font-mono)" text-anchor="middle">18-Pulse Diode</text>
            <!-- Diode bridge symbols -->
            <polygon points="25,65 55,65 40,48" fill="#d97706"/>
            <line x1="25" y1="48" x2="55" y2="48" stroke="#f59e0b" stroke-width="2"/>
            <text x="40" y="80" fill="#f8fafc" font-size="8" font-family="var(--font-mono)" text-anchor="middle">Harmonic Cancel</text>
          </g>

          <!-- Intermediate DC Link Bus (8910 VDC) -->
          <line x1="370" y1="360" x2="440" y2="360" stroke="#f59e0b" stroke-width="4"/>
          <line x1="370" y1="400" x2="440" y2="400" stroke="#f59e0b" stroke-width="4"/>

          <!-- DC Link Capacitor Bank & Chopper -->
          <g transform="translate(440, 340)">
            <rect x="0" y="0" width="70" height="80" rx="4" fill="#0b1120" stroke="#f59e0b" stroke-width="2"/>
            <text x="35" y="20" fill="#f59e0b" font-size="9" font-family="var(--font-mono)" font-weight="700" text-anchor="middle">DC LINK</text>
            <!-- Capacitor lines -->
            <line x1="25" y1="40" x2="45" y2="40" stroke="#f59e0b" stroke-width="3"/>
            <line x1="25" y1="46" x2="45" y2="46" stroke="#f59e0b" stroke-width="3"/>
            <text x="35" y="65" fill="#f8fafc" font-size="10" font-family="var(--font-mono)" font-weight="700" text-anchor="middle" id="sld-dclink-v">8,910 V</text>
          </g>

          <line x1="510" y1="380" x2="560" y2="380" stroke="#f59e0b" stroke-width="4"/>

          <!-- 3-Level NPC IGBT Inverter Bridge -->
          <g transform="translate(560, 335)">
            <rect x="0" y="0" width="95" height="90" rx="4" fill="#0f172a" stroke="#0ea5e9" stroke-width="2"/>
            <text x="47" y="22" fill="#38bdf8" font-size="9" font-family="var(--font-mono)" font-weight="700" text-anchor="middle">3-LEVEL NPC</text>
            <text x="47" y="38" fill="#94a3b8" font-size="8" font-family="var(--font-mono)" text-anchor="middle">IGBT INVERTER</text>
            <polygon points="35,50 60,65 35,80" fill="#0284c7"/>
            <text x="47" y="82" fill="#f8fafc" font-size="9" font-family="var(--font-mono)" text-anchor="middle">PWM DRIVE</text>
          </g>

          <!-- Inverter Output Cable to 4200 kW Mill Motor -->
          <line x1="655" y1="380" x2="740" y2="380" stroke="#10b981" stroke-width="4"/>

          <!-- 4200 kW VRM Mill Motor Symbol -->
          <g transform="translate(740, 340)">
            <circle cx="40" cy="40" r="38" fill="#0f172a" stroke="#10b981" stroke-width="3"/>
            <text x="40" y="32" fill="#10b981" font-size="14" font-family="var(--font-mono)" font-weight="800" text-anchor="middle">M</text>
            <text x="40" y="48" fill="#f8fafc" font-size="9" font-family="var(--font-mono)" font-weight="700" text-anchor="middle">4,200 kW</text>
            <text x="40" y="60" fill="#94a3b8" font-size="8" font-family="var(--font-mono)" text-anchor="middle">VRM DRIVE</text>
          </g>

          <!-- IEEE 519 Harmonics Telemetry Block (Top Right) -->
          <g transform="translate(480, 70)">
            <rect width="380" height="150" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#1e293b" stroke-width="1.5"/>
            <text x="14" y="24" fill="#38bdf8" font-size="11" font-family="var(--font-mono)" font-weight="700">IEEE 519 HARMONIC SPECTRUM TELEMETRY</text>

            <text x="14" y="52" fill="#94a3b8" font-size="10" font-family="var(--font-mono)">THD-I (Current):</text>
            <text x="130" y="52" fill="#10b981" font-size="13" font-family="var(--font-mono)" font-weight="700" id="sld-thd-i">2.38 %</text>
            <text x="190" y="52" fill="#64748b" font-size="9" font-family="var(--font-mono)">(IEEE Limit: < 5.0%)</text>

            <text x="14" y="74" fill="#94a3b8" font-size="10" font-family="var(--font-mono)">THD-V (Voltage):</text>
            <text x="130" y="74" fill="#10b981" font-size="13" font-family="var(--font-mono)" font-weight="700" id="sld-thd-v">1.76 %</text>
            <text x="190" y="74" fill="#64748b" font-size="9" font-family="var(--font-mono)">(IEEE Limit: < 3.0%)</text>

            <!-- 18-Pulse Phase Cancellation Indicator -->
            <line x1="14" y1="88" x2="366" y2="88" stroke="#1e293b" stroke-width="1"/>
            <text x="14" y="105" fill="#a855f7" font-size="9" font-family="var(--font-mono)" font-weight="700">HARMONIC CANCELLATION (18-PULSE PHASE SHIFT):</text>
            <text x="14" y="122" fill="#cbd5e1" font-size="9" font-family="var(--font-mono)">• 5th & 7th Harmonics: CANCELLED (0.4%)</text>
            <text x="14" y="137" fill="#cbd5e1" font-size="9" font-family="var(--font-mono)">• 11th & 13th Harmonics: CANCELLED (0.8%)</text>
            <text x="260" y="130" fill="#10b981" font-size="11" font-family="var(--font-mono)" font-weight="700">COMPLIANT</text>
          </g>

          <!-- Numerical Protection Relays Rack (Middle) -->
          <g transform="translate(250, 70)">
            <rect width="210" height="150" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#1e293b" stroke-width="1.5"/>
            <text x="12" y="24" fill="#f59e0b" font-size="11" font-family="var(--font-mono)" font-weight="700">NUMERICAL PROTECTION RELAYS</text>

            <!-- ANSI 51/50 -->
            <g transform="translate(12, 38)">
              <rect width="186" height="30" rx="3" fill="#0b1120" stroke="#1e293b" stroke-width="1"/>
              <circle cx="16" cy="15" r="5" fill="#10b981" id="led-relay-51"/>
              <text x="30" y="18" fill="#f8fafc" font-size="10" font-family="var(--font-mono)">ANSI 51/50: Overcurrent / Short</text>
            </g>

            <!-- ANSI 27/59 -->
            <g transform="translate(12, 74)">
              <rect width="186" height="30" rx="3" fill="#0b1120" stroke="#1e293b" stroke-width="1"/>
              <circle cx="16" cy="15" r="5" fill="#10b981" id="led-relay-59"/>
              <text x="30" y="18" fill="#f8fafc" font-size="10" font-family="var(--font-mono)">ANSI 27/59: DC Bus Volt Relay</text>
            </g>

            <!-- ANSI 87T -->
            <g transform="translate(12, 110)">
              <rect width="186" height="30" rx="3" fill="#0b1120" stroke="#1e293b" stroke-width="1"/>
              <circle cx="16" cy="15" r="5" fill="#10b981" id="led-relay-87"/>
              <text x="30" y="18" fill="#f8fafc" font-size="10" font-family="var(--font-mono)">ANSI 87T: XFMR Differential</text>
            </g>
          </g>
        </svg>
      </div>

      <!-- Electrical Telemetry Footer Cards -->
      <div class="sld-footer-cards" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 10px;">
        <div class="digital-readout-card" style="padding: 8px 12px;">
          <div class="readout-label" style="font-size: 11px;">MV Incomer Voltage</div>
          <div class="font-mono text-cyan" style="font-size: 18px; font-weight: 700;" id="metric-mv-volt">6,604 V</div>
        </div>
        <div class="digital-readout-card" style="padding: 8px 12px;">
          <div class="readout-label" style="font-size: 11px;">DC-Link Voltage</div>
          <div class="font-mono text-amber" style="font-size: 18px; font-weight: 700;" id="metric-dc-volt">8,910 VDC</div>
        </div>
        <div class="digital-readout-card" style="padding: 8px 12px;">
          <div class="readout-label" style="font-size: 11px;">Inverter IGBT Temp</div>
          <div class="font-mono text-cyan" style="font-size: 18px; font-weight: 700;" id="metric-igbt-temp">61.5 °C</div>
        </div>
        <div class="digital-readout-card" style="padding: 8px 12px;">
          <div class="readout-label" style="font-size: 11px;">Grid Frequency</div>
          <div class="font-mono text-cyan" style="font-size: 18px; font-weight: 700;" id="metric-grid-hz">50.01 Hz</div>
        </div>
      </div>
    `;
  }

  public update(telemetry: VfdSldTelemetry) {
    // 1. Bus Voltage & DC Voltage
    const busV = document.getElementById('sld-bus-v');
    if (busV) busV.textContent = `${telemetry.mvBusVoltage.toLocaleString()} V`;

    const dcV = document.getElementById('sld-dclink-v');
    if (dcV) dcV.textContent = `${telemetry.dcBusVoltage.toLocaleString()} V`;

    // 2. Metrics footer
    const mvVoltEl = document.getElementById('metric-mv-volt');
    if (mvVoltEl) mvVoltEl.textContent = `${telemetry.mvBusVoltage.toLocaleString()} V`;

    const dcVoltEl = document.getElementById('metric-dc-volt');
    if (dcVoltEl) {
      dcVoltEl.textContent = `${telemetry.dcBusVoltage.toLocaleString()} VDC`;
      if (telemetry.dcBusVoltage > 9450) {
        dcVoltEl.className = 'font-mono text-red';
      } else {
        dcVoltEl.className = 'font-mono text-amber';
      }
    }

    const igbtTempEl = document.getElementById('metric-igbt-temp');
    if (igbtTempEl) igbtTempEl.textContent = `${telemetry.igbtTemp.toFixed(1)} °C`;

    const gridHzEl = document.getElementById('metric-grid-hz');
    if (gridHzEl) gridHzEl.textContent = `${telemetry.gridFrequency.toFixed(2)} Hz`;

    // 3. THD metrics
    const thdIEl = document.getElementById('sld-thd-i');
    if (thdIEl) thdIEl.textContent = `${telemetry.thdI.toFixed(2)} %`;

    const thdVEl = document.getElementById('sld-thd-v');
    if (thdVEl) thdVEl.textContent = `${telemetry.thdV.toFixed(2)} %`;

    // 4. VCB Knife Status & Status Pill
    const knife = document.getElementById('vcb-knife-line');
    const pill = document.getElementById('sld-vcb-status');

    if (telemetry.vcbClosed) {
      if (knife) {
        knife.setAttribute('x1', '30');
        knife.setAttribute('y1', '18');
        knife.setAttribute('x2', '30');
        knife.setAttribute('y2', '32');
        knife.setAttribute('stroke', '#10b981');
      }
      if (pill) {
        pill.className = 'status-pill status-running';
        pill.textContent = 'VCB 52-1: CLOSED';
      }
    } else {
      if (knife) {
        // Open knife at 35 degree angle
        knife.setAttribute('x1', '30');
        knife.setAttribute('y1', '18');
        knife.setAttribute('x2', '45');
        knife.setAttribute('y2', '24');
        knife.setAttribute('stroke', '#ef4444');
      }
      if (pill) {
        pill.className = 'status-pill status-tripped';
        pill.textContent = 'VCB 52-1: TRIPPED (OPEN)';
      }
    }

    // 5. Relays LED
    const led51 = document.getElementById('led-relay-51');
    const led59 = document.getElementById('led-relay-59');
    const led87 = document.getElementById('led-relay-87');

    if (led51) led51.setAttribute('fill', telemetry.relay51_50_trip ? '#ef4444' : '#10b981');
    if (led59) led59.setAttribute('fill', telemetry.relay27_59_trip ? '#ef4444' : '#10b981');
    if (led87) led87.setAttribute('fill', telemetry.relay87T_trip ? '#ef4444' : '#10b981');
  }
}
