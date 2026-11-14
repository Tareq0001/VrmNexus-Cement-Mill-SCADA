/**
 * VRM-NEXUS: Baghouse Pulse-Jet & ESP Filtration Interlock Graphic Component
 * Industrial Fabric Filter, ID Fan (6.6kV - 1800 kW) & Compressed Air Pulse Sequencer
 * 
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي
 * Tareq Abuashi — Lead Electrical & Automation Systems Engineer
 */

import { BaghouseTelemetry } from '../types/scada';

export class BaghouseGraphic {
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
          <span class="badge-tag tag-cyan">FILTRATION & DRAFT</span>
          <h4 class="panel-title">Pulse-Jet Baghouse & ID Fan (6.6kV - 1800 kW)</h4>
        </div>
        <div class="header-badges">
          <span class="status-pill status-running" id="baghouse-status-pill">PULSE-JET HEALTHY</span>
        </div>
      </div>

      <div class="baghouse-svg-wrapper" style="position: relative; width: 100%; height: 360px; background: #070b14; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-card);">
        <svg viewBox="0 0 900 500" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" id="baghouse-main-svg">
          <defs>
            <linearGradient id="filterHousingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#1e293b"/>
              <stop offset="60%" stop-color="#0f172a"/>
              <stop offset="100%" stop-color="#070b14"/>
            </linearGradient>

            <linearGradient id="hopperGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#1e293b"/>
              <stop offset="50%" stop-color="#334155"/>
              <stop offset="100%" stop-color="#1e293b"/>
            </linearGradient>

            <linearGradient id="airBlastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="rgba(56, 189, 248, 0.9)"/>
              <stop offset="100%" stop-color="rgba(56, 189, 248, 0)"/>
            </linearGradient>

            <linearGradient id="fanCasingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#334155"/>
              <stop offset="50%" stop-color="#1e293b"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>
          </defs>

          <!-- Mill Outlet Gas Duct Entry (Left) -->
          <path d="M 30 200 L 150 200 L 150 240 L 30 240 Z" fill="#334155" stroke="#f97316" stroke-width="2"/>
          <text x="40" y="190" fill="#fdba74" font-size="11" font-family="var(--font-mono)" font-weight="700">GAS FROM MILL (185°C)</text>

          <!-- Fresh Air Tempering Damper (Over-Temp Protection Interlock) -->
          <g id="fresh-air-damper-group" transform="translate(70, 140)">
            <rect x="0" y="0" width="60" height="40" rx="3" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.5"/>
            <text x="30" y="18" fill="#38bdf8" font-size="8" font-family="var(--font-mono)" text-anchor="middle" font-weight="700">TEMPERING</text>
            <text x="30" y="32" fill="#94a3b8" font-size="10" font-family="var(--font-mono)" text-anchor="middle" id="damper-pct-text">DAMPER: 0%</text>
            <!-- Damper blade angle -->
            <line x1="20" y1="20" x2="40" y2="20" stroke="#38bdf8" stroke-width="3" id="damper-blade-line"/>
          </g>

          <!-- Baghouse Main Housing -->
          <rect x="150" y="100" width="360" height="230" rx="4" fill="url(#filterHousingGrad)" stroke="#475569" stroke-width="2.5"/>
          <text x="330" y="125" fill="#f8fafc" font-size="13" font-family="var(--font-mono)" font-weight="700" text-anchor="middle">PULSE-JET FABRIC FILTER (8 COMPARTMENTS)</text>

          <!-- Compressed Air Manifold Pipe (6 Bar) -->
          <rect x="170" y="140" width="320" height="12" rx="3" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="180" y="135" fill="#38bdf8" font-size="9" font-family="var(--font-mono)">COMPRESSED AIR HEADER (6.2 BAR)</text>

          <!-- 8 Solenoid Valve Headers & Filter Bag Rows -->
          <!-- We draw 8 vertical bag rows with pulse nozzles -->
          <g id="pulse-rows-group">
            <!-- Row 1 -->
            <g class="pulse-row" id="p-row-1" transform="translate(190, 152)">
              <rect x="-6" y="0" width="12" height="10" fill="#38bdf8" id="sol-valve-1"/>
              <rect x="-8" y="15" width="16" height="145" rx="3" fill="#334155" stroke="#64748b" stroke-width="1"/>
            </g>
            <!-- Row 2 -->
            <g class="pulse-row" id="p-row-2" transform="translate(230, 152)">
              <rect x="-6" y="0" width="12" height="10" fill="#64748b" id="sol-valve-2"/>
              <rect x="-8" y="15" width="16" height="145" rx="3" fill="#334155" stroke="#64748b" stroke-width="1"/>
            </g>
            <!-- Row 3 -->
            <g class="pulse-row" id="p-row-3" transform="translate(270, 152)">
              <rect x="-6" y="0" width="12" height="10" fill="#64748b" id="sol-valve-3"/>
              <rect x="-8" y="15" width="16" height="145" rx="3" fill="#334155" stroke="#64748b" stroke-width="1"/>
            </g>
            <!-- Row 4 -->
            <g class="pulse-row" id="p-row-4" transform="translate(310, 152)">
              <rect x="-6" y="0" width="12" height="10" fill="#64748b" id="sol-valve-4"/>
              <rect x="-8" y="15" width="16" height="145" rx="3" fill="#334155" stroke="#64748b" stroke-width="1"/>
            </g>
            <!-- Row 5 -->
            <g class="pulse-row" id="p-row-5" transform="translate(350, 152)">
              <rect x="-6" y="0" width="12" height="10" fill="#64748b" id="sol-valve-5"/>
              <rect x="-8" y="15" width="16" height="145" rx="3" fill="#334155" stroke="#64748b" stroke-width="1"/>
            </g>
            <!-- Row 6 -->
            <g class="pulse-row" id="p-row-6" transform="translate(390, 152)">
              <rect x="-6" y="0" width="12" height="10" fill="#64748b" id="sol-valve-6"/>
              <rect x="-8" y="15" width="16" height="145" rx="3" fill="#334155" stroke="#64748b" stroke-width="1"/>
            </g>
            <!-- Row 7 -->
            <g class="pulse-row" id="p-row-7" transform="translate(430, 152)">
              <rect x="-6" y="0" width="12" height="10" fill="#64748b" id="sol-valve-7"/>
              <rect x="-8" y="15" width="16" height="145" rx="3" fill="#334155" stroke="#64748b" stroke-width="1"/>
            </g>
            <!-- Row 8 -->
            <g class="pulse-row" id="p-row-8" transform="translate(470, 152)">
              <rect x="-6" y="0" width="12" height="10" fill="#64748b" id="sol-valve-8"/>
              <rect x="-8" y="15" width="16" height="145" rx="3" fill="#334155" stroke="#64748b" stroke-width="1"/>
            </g>
          </g>

          <!-- Active Air Pulse Flash Blast (Animated dynamically over active row) -->
          <path id="pulse-blast-flash" d="M 180 162 L 200 162 L 210 310 L 170 310 Z" fill="url(#airBlastGrad)" opacity="0"/>

          <!-- Dust Hoppers Below Filter (Conical Pyramidal Hoppers) -->
          <polygon points="150,330 240,430 280,430 330,330" fill="url(#hopperGrad)" stroke="#475569" stroke-width="2"/>
          <polygon points="330,330 380,430 420,430 510,330" fill="url(#hopperGrad)" stroke="#475569" stroke-width="2"/>
          <!-- Rotary airlocks -->
          <circle cx="260" cy="445" r="12" fill="#0f172a" stroke="#64748b" stroke-width="1.5"/>
          <circle cx="400" cy="445" r="12" fill="#0f172a" stroke="#64748b" stroke-width="1.5"/>
          <text x="330" y="475" fill="#94a3b8" font-size="10" font-family="var(--font-mono)" text-anchor="middle">DUST RECYCLE AIRLOCKS &rarr; PRODUCT AIR SLIDE</text>

          <!-- Clean Gas Duct to ID Fan -->
          <path d="M 510 140 L 590 140 L 590 260 L 630 260" fill="none" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/>

          <!-- ID Fan Casing & Motor (6.6kV - 1800 kW) -->
          <g id="id-fan-assembly" transform="translate(670, 260)">
            <!-- Fan Scroll Casing -->
            <circle cx="0" cy="0" r="55" fill="url(#fanCasingGrad)" stroke="#0284c7" stroke-width="3"/>
            <!-- Rotating Fan Impeller Blades -->
            <g id="fan-impeller-blades">
              <line x1="-42" y1="0" x2="42" y2="0" stroke="#38bdf8" stroke-width="3"/>
              <line x1="0" y1="-42" x2="0" y2="42" stroke="#38bdf8" stroke-width="3"/>
              <line x1="-30" y1="-30" x2="30" y2="30" stroke="#38bdf8" stroke-width="3"/>
              <line x1="-30" y1="30" x2="30" y2="-30" stroke="#38bdf8" stroke-width="3"/>
            </g>
            <circle cx="0" cy="0" r="16" fill="#0b1120" stroke="#38bdf8" stroke-width="2"/>
            <text x="0" y="4" fill="#38bdf8" font-size="9" font-family="var(--font-mono)" font-weight="700" text-anchor="middle">ID FAN</text>
            
            <!-- Fan Motor Block -->
            <rect x="-35" y="65" width="70" height="40" rx="3" fill="#1e293b" stroke="#64748b" stroke-width="1.5"/>
            <text x="0" y="82" fill="#f8fafc" font-size="8" font-family="var(--font-mono)" text-anchor="middle">6.6kV 1800kW</text>
            <text x="0" y="96" fill="#38bdf8" font-size="9" font-family="var(--font-mono)" font-weight="700" text-anchor="middle" id="id-fan-rpm-val">940 RPM</text>
          </g>

          <!-- Stack Duct & Exhaust Chimney -->
          <path d="M 725 240 L 800 240 L 800 70 L 850 70 L 850 420 L 800 420" fill="none" stroke="#334155" stroke-width="5"/>
          <rect x="795" y="60" width="60" height="360" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
          <text x="825" y="85" fill="#cbd5e1" font-size="10" font-family="var(--font-mono)" font-weight="700" text-anchor="middle">EXHAUST STACK</text>
          <!-- Clean gas emission plume -->
          <ellipse cx="825" cy="45" rx="20" ry="12" fill="rgba(255,255,255,0.08)"/>

          <!-- Differential Pressure HUD Gauge (ΔP) -->
          <g transform="translate(160, 20)">
            <rect width="180" height="70" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#1e293b" stroke-width="1.5"/>
            <text x="12" y="20" fill="#94a3b8" font-size="10" font-family="var(--font-mono)">BAGHOUSE ΔP</text>
            <text x="12" y="46" fill="#38bdf8" font-size="20" font-family="var(--font-mono)" font-weight="700" id="baghouse-hud-dp">12.4 mbar</text>
            <text x="110" y="44" fill="#64748b" font-size="9" font-family="var(--font-mono)">Hi: >16 | Trip: >22</text>
            <line x1="12" y1="56" x2="168" y2="56" stroke="#334155" stroke-width="3" stroke-linecap="round"/>
            <line x1="12" y1="56" x2="80" y2="56" stroke="#0284c7" stroke-width="3" stroke-linecap="round" id="baghouse-hud-dp-bar"/>
          </g>

          <!-- Stack Dust Opacity Meter HUD -->
          <g transform="translate(680, 20)">
            <rect width="190" height="70" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#1e293b" stroke-width="1.5"/>
            <text x="12" y="20" fill="#94a3b8" font-size="10" font-family="var(--font-mono)">STACK OPACITY (EMISSION)</text>
            <text x="12" y="46" fill="#10b981" font-size="20" font-family="var(--font-mono)" font-weight="700" id="baghouse-hud-opacity">7.2 mg/Nm³</text>
            <text x="130" y="44" fill="#64748b" font-size="9" font-family="var(--font-mono)">Limit: 20</text>
            <line x1="12" y1="56" x2="178" y2="56" stroke="#334155" stroke-width="3" stroke-linecap="round"/>
            <line x1="12" y1="56" x2="65" y2="56" stroke="#10b981" stroke-width="3" stroke-linecap="round" id="baghouse-hud-op-bar"/>
          </g>
        </svg>
      </div>

      <!-- Pulse Sequencer & Thermal Interlock Bar -->
      <div class="baghouse-footer-controls" style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 10px; margin-top: 10px;">
        <!-- Solenoid Row Status Matrix -->
        <div class="digital-readout-card" style="padding: 8px 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="readout-label" style="font-size: 11px;">Pulse-Jet Solenoid Sequencer (Row 1 to 8)</span>
            <span class="font-mono text-cyan" style="font-size: 11px;" id="seq-active-label">Active: Row #1</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 6px;" id="solenoid-led-rack">
            ${[1, 2, 3, 4, 5, 6, 7, 8].map(i => `
              <div class="solenoid-tile font-mono" id="sol-tile-${i}" style="background: #0b1120; border: 1px solid #1e293b; border-radius: 4px; padding: 4px; text-align: center; font-size: 10px;">
                R${i}
                <div class="led-dot led-gray" id="sol-led-${i}" style="margin: 2px auto 0 auto; width: 8px; height: 8px; border-radius: 50%;"></div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Gas Inlet Temp PT100 -->
        <div class="digital-readout-card" style="padding: 8px 12px;">
          <div class="readout-label" style="font-size: 11px;">Inlet Flue Gas Temp</div>
          <div class="font-mono text-cyan" style="font-size: 18px; font-weight: 700;" id="metric-inlet-temp">184.5 °C</div>
          <div style="font-size: 10px; color: var(--text-muted);">Trip Limit: 210°C (Auto Tempering)</div>
        </div>

        <!-- ID Fan Motor Current & Power -->
        <div class="digital-readout-card" style="padding: 8px 12px;">
          <div class="readout-label" style="font-size: 11px;">ID Fan Current / Power</div>
          <div class="font-mono text-cyan" style="font-size: 18px; font-weight: 700;" id="metric-idfan-amp">162.5 A</div>
          <div style="font-size: 10px; color: var(--text-muted); font-family: var(--font-mono);" id="metric-idfan-kw">1,480 kW (6.6 kV)</div>
        </div>
      </div>
    `;
  }

  public update(telemetry: BaghouseTelemetry) {
    // 1. ΔP text & bar
    const dpEl = document.getElementById('baghouse-hud-dp');
    if (dpEl) dpEl.textContent = `${telemetry.differentialPressure.toFixed(1)} mbar`;

    const dpBar = document.getElementById('baghouse-hud-dp-bar');
    if (dpBar) {
      const pct = Math.max(0, Math.min(100, (telemetry.differentialPressure / 25) * 100));
      dpBar.setAttribute('x2', (12 + (pct * 1.56)).toString());
      if (telemetry.differentialPressure > 20) {
        dpBar.setAttribute('stroke', '#ef4444');
      } else if (telemetry.differentialPressure > 16) {
        dpBar.setAttribute('stroke', '#f59e0b');
      } else {
        dpBar.setAttribute('stroke', '#0284c7');
      }
    }

    // 2. Opacity
    const opEl = document.getElementById('baghouse-hud-opacity');
    if (opEl) opEl.textContent = `${telemetry.stackDustOpacity.toFixed(1)} mg/Nm³`;

    const opBar = document.getElementById('baghouse-hud-op-bar');
    if (opBar) {
      const pct = Math.max(0, Math.min(100, (telemetry.stackDustOpacity / 35) * 100));
      opBar.setAttribute('x2', (12 + (pct * 1.66)).toString());
      if (telemetry.stackDustOpacity > 20) {
        opBar.setAttribute('stroke', '#ef4444');
      } else {
        opBar.setAttribute('stroke', '#10b981');
      }
    }

    // 3. Tempering Damper
    const damperText = document.getElementById('damper-pct-text');
    if (damperText) damperText.textContent = `DAMPER: ${telemetry.freshAirDamperOpen}%`;

    const damperBlade = document.getElementById('damper-blade-line');
    if (damperBlade) {
      // Rotate blade based on open %
      const angle = (telemetry.freshAirDamperOpen / 100) * 45;
      damperBlade.setAttribute('transform', `rotate(${angle}, 30, 20)`);
    }

    // 4. Solenoid LEDs & Active Row
    const seqLabel = document.getElementById('seq-active-label');
    if (seqLabel) seqLabel.textContent = `Active: Row #${telemetry.activePulseRow}`;

    for (let i = 1; i <= 8; i++) {
      const led = document.getElementById(`sol-led-${i}`);
      const valve = document.getElementById(`sol-valve-${i}`);
      const isThisRow = telemetry.activePulseRow === i;

      if (led) {
        if (isThisRow && telemetry.pulseJetFiring) {
          led.style.background = '#38bdf8';
          led.style.boxShadow = '0 0 8px #38bdf8';
        } else if (isThisRow) {
          led.style.background = '#10b981';
          led.style.boxShadow = 'none';
        } else {
          led.style.background = '#334155';
          led.style.boxShadow = 'none';
        }
      }

      if (valve) {
        valve.setAttribute('fill', isThisRow && telemetry.pulseJetFiring ? '#38bdf8' : '#64748b');
      }
    }

    // 5. Air Blast Flash
    const blastFlash = document.getElementById('pulse-blast-flash');
    if (blastFlash) {
      if (telemetry.pulseJetFiring) {
        const xOffset = 190 + (telemetry.activePulseRow - 1) * 40;
        blastFlash.setAttribute('d', `M ${xOffset - 15} 162 L ${xOffset + 15} 162 L ${xOffset + 25} 310 L ${xOffset - 25} 310 Z`);
        blastFlash.setAttribute('opacity', '0.85');
      } else {
        blastFlash.setAttribute('opacity', '0');
      }
    }

    // 6. Metrics & Status
    const inletTempEl = document.getElementById('metric-inlet-temp');
    if (inletTempEl) {
      inletTempEl.textContent = `${telemetry.inletGasTemp.toFixed(1)} °C`;
      if (telemetry.inletGasTemp > 210) {
        inletTempEl.className = 'font-mono text-red';
      } else {
        inletTempEl.className = 'font-mono text-cyan';
      }
    }

    const idAmpEl = document.getElementById('metric-idfan-amp');
    if (idAmpEl) idAmpEl.textContent = `${telemetry.idFanCurrent.toFixed(1)} A`;

    const idKwEl = document.getElementById('metric-idfan-kw');
    if (idKwEl) idKwEl.textContent = `${Math.round(telemetry.idFanPower).toLocaleString()} kW (6.6 kV)`;

    const pill = document.getElementById('baghouse-status-pill');
    if (pill) {
      if (telemetry.status === 'HIGH_DP') {
        pill.className = 'status-pill status-tripped';
        pill.textContent = 'HIGH ΔP ALARM (>20 mbar)';
      } else if (telemetry.status === 'HIGH_TEMP' || telemetry.damperInterlockActive) {
        pill.className = 'status-pill status-tripped';
        pill.textContent = 'OVER-TEMP INTERLOCK (TEMPERING ON)';
      } else {
        pill.className = 'status-pill status-running';
        pill.textContent = 'PULSE-JET HEALTHY';
      }
    }
  }
}
