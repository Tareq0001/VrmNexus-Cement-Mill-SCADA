/**
 * VRM-NEXUS: Engineering Dossier Modal Component
 * Comprehensive Electrical, Process & Automation Engineering Documentation
 * 
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي
 * Tareq Abuashi — Lead Electrical & Automation Systems Engineer
 */

export class DossierModal {
  private modalEl: HTMLElement | null = null;

  constructor() {
    this.createModal();
    this.bindEvents();
  }

  private createModal() {
    const modalHtml = `
      <div class="modal-backdrop" id="engineering-dossier-modal" style="display: none; position: fixed; inset: 0; background: rgba(3, 7, 18, 0.85); backdrop-filter: blur(8px); z-index: 10000; overflow-y: auto; padding: 20px;">
        <div class="modal-dialog" style="max-width: 1050px; margin: 30px auto; background: #0b1120; border: 1px solid var(--border-card); border-radius: 8px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); overflow: hidden;">
          
          <!-- Modal Header -->
          <div class="modal-header" style="background: #0f172a; padding: 20px 24px; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="background: rgba(14, 165, 233, 0.15); border: 1px solid var(--border-focus); width: 44px; height: 44px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: var(--cyan-primary);">
                <i class="fa-solid fa-file-shield"></i>
              </div>
              <div>
                <h3 style="font-size: 18px; font-weight: 800; color: #f8fafc; letter-spacing: -0.02em;">
                  VRM-NEXUS: ENGINEERING DOSSIER & SYSTEM ARCHITECTURE
                </h3>
                <div style="font-size: 12px; color: #94a3b8; font-family: var(--font-mono); margin-top: 2px;">
                  Specification Document &bull; 6.6 kV MV-VFD Drive &bull; IEEE 519 Harmonics &bull; ANSI Relays &bull; ISO 10816
                </div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 10px;">
              <button class="btn btn-secondary" id="btn-modal-print" style="padding: 6px 12px; font-size: 12px;">
                <i class="fa-solid fa-print"></i> Print / Export PDF
              </button>
              <button class="btn btn-secondary" id="btn-modal-close" style="padding: 6px 12px; font-size: 14px;">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          <!-- Engineer Credentials Badge -->
          <div style="background: #070c17; padding: 12px 24px; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 11px; color: var(--text-muted); font-weight: 700;">LEAD DESIGNER & AUTOMATION SYSTEMS ENGINEER:</span>
              <span class="font-mono text-cyan" style="font-size: 13px; font-weight: 700;">أ. طارق ابوعشي | Tareq Abuashi</span>
            </div>
            <div class="font-mono" style="font-size: 11px; color: #10b981;">
              <i class="fa-solid fa-certificate"></i> AUTHENTICATED INDUSTRIAL DIGITAL TWIN v4.9
            </div>
          </div>

          <!-- Modal Body Content -->
          <div class="modal-body" style="padding: 24px; color: #cbd5e1; font-size: 13px; line-height: 1.7; max-height: calc(85vh - 160px); overflow-y: auto;">
            
            <!-- SECTION 1: Executive Overview -->
            <div class="dossier-section" style="margin-bottom: 24px;">
              <h4 style="color: var(--cyan-primary); font-size: 15px; font-weight: 700; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px; margin-bottom: 12px;">
                1. Executive Overview & System Boundaries
              </h4>
              <p>
                <strong>VRM-NEXUS</strong> is a comprehensive digital twin and supervisory control and data acquisition (SCADA) platform engineered for a <strong>Vertical Roller Mill (VRM)</strong> raw grinding department in a modern cement production facility. The system integrates a high-efficiency 4-roller mill (Pfeiffer / Loesche design), powered by a <strong>6.6 kV - 4,200 kW Medium Voltage Variable Frequency Drive (MV-VFD)</strong>, coupled with a high-capacity <strong>Pulse-Jet Baghouse Filter</strong> and an <strong>1,800 kW Induced Draft (ID) Fan</strong>.
              </p>
            </div>

            <!-- SECTION 2: MV Electrical & 18-Pulse VFD Drive Architecture -->
            <div class="dossier-section" style="margin-bottom: 24px;">
              <h4 style="color: var(--cyan-primary); font-size: 15px; font-weight: 700; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px; margin-bottom: 12px;">
                2. 6.6 kV MV Switchgear, 18-Pulse Drive & IEEE 519 Harmonic Cancellation
              </h4>
              <p>
                To eliminate line-side harmonic pollution and comply strictly with <strong>IEEE 519 (Harmonic Control in Electric Power Systems)</strong>, the 4,200 kW mill motor is driven through an <strong>18-pulse phase-shifting isolation transformer</strong> (5,000 kVA, Dyn11+ topology):
              </p>
              <div style="background: #070c17; border-left: 3px solid var(--cyan-primary); padding: 12px 16px; margin: 12px 0; border-radius: 0 4px 4px 0; font-family: var(--font-mono); font-size: 12px;">
                <div><strong>Phase Shift Relationship:</strong></div>
                <div>&bull; Secondary Winding 1: +20° phase displacement (2.2 kV LL)</div>
                <div>&bull; Secondary Winding 2: 0° phase displacement (2.2 kV LL)</div>
                <div>&bull; Secondary Winding 3: -20° phase displacement (2.2 kV LL)</div>
                <div style="margin-top: 8px;"><strong>Harmonic Cancellation Equation:</strong></div>
                <div>Harmonics of order h = 18k &plusmn; 1 (k = 1, 2, ...). Orders 5th, 7th, 11th, and 13th are naturally cancelled by vector cancellation in the primary delta winding!</div>
                <div style="color: #10b981; margin-top: 4px;">Measured Line THD-I: 2.38% &lt; 5.0% IEEE 519 Limit &bull; Measured THD-V: 1.76% &lt; 3.0%</div>
              </div>
              <p>
                The rectified output supplies a common intermediate <strong>DC-Link capacitor bank</strong> operating at <strong>8,910 VDC nominal</strong>:
              </p>
              <div style="background: #070c17; padding: 8px 12px; border-radius: 4px; font-family: var(--font-mono); font-size: 12px; margin-bottom: 10px;">
                V_DC = (3 &times; &radic;6 / &pi;) &times; V_LL &times; cos(&alpha;) &approx; 1.35 &times; 6,600 V &approx; 8,910 VDC
              </div>
            </div>

            <!-- SECTION 3: VRM Grinding Kinetics & Bed Stability -->
            <div class="dossier-section" style="margin-bottom: 24px;">
              <h4 style="color: var(--cyan-primary); font-size: 15px; font-weight: 700; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px; margin-bottom: 12px;">
                3. Vertical Roller Mill Kinetics & Material Bed Stability
              </h4>
              <p>
                In a VRM, raw materials (limestone, clay, silica, iron ore) are pulverized between a rotating horizontal table and 4 conical grinding rollers suspended on hydraulic rocker arms. The grinding force is pneumatically-hydraulically cushioned:
              </p>
              <ul style="margin-left: 20px; margin-top: 8px; margin-bottom: 8px;">
                <li><strong>Hydraulic Grinding Pressure:</strong> Regulated between <strong>65 and 110 Bar</strong> (nominal 88.5 Bar) using nitrogen bladders in hydraulic accumulators to absorb dynamic shock.</li>
                <li><strong>Material Bed Depth:</strong> Critical parameter maintained between <strong>45 and 85 mm</strong>. If bed depth drops &lt; 30 mm (Dry Feed starvation), the rollers lose their dampening material cushion and directly impact the rotating table liners, causing violent <strong>Mill Rumble</strong> (&gt;12 mm/s RMS).</li>
                <li><strong>Dynamic Cage Classifier:</strong> High-efficiency cage rotor (60–180 RPM) dynamically controls raw meal fineness (target: 12% residue on 90 &mu;m sieve).</li>
              </ul>
            </div>

            <!-- SECTION 4: Pulse-Jet Baghouse & Thermal Interlock -->
            <div class="dossier-section" style="margin-bottom: 24px;">
              <h4 style="color: var(--cyan-primary); font-size: 15px; font-weight: 700; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px; margin-bottom: 12px;">
                4. Pulse-Jet Baghouse Filtration & Safety Interlocks
              </h4>
              <p>
                The dust-laden mill exhaust gas is filtered in an 8-compartment pulse-jet baghouse equipped with PTFE-membrane needle felt bags:
              </p>
              <ul style="margin-left: 20px; margin-top: 8px; margin-bottom: 8px;">
                <li><strong>Air-to-Cloth Ratio:</strong> 1.05 m&sup3;/min per m&sup2; of fabric area.</li>
                <li><strong>Differential Pressure (&Delta;P):</strong> Monitored across tube sheets (Nominal: 12.4 mbar; Warning: &gt;16 mbar; Clogging Trip: &gt;22 mbar).</li>
                <li><strong>Thermal Safety Interlock:</strong> Synthetic filter bags undergo irreversible thermal degradation if exposed to flue gas &gt; 210°C. An automated PID safety loop modulates the <strong>Fresh Air Tempering Damper</strong> to inject ambient cooling air immediately if inlet gas temp rises &gt; 210°C.</li>
              </ul>
            </div>

            <!-- SECTION 5: Numerical Protection Relay Scheme -->
            <div class="dossier-section" style="margin-bottom: 24px;">
              <h4 style="color: var(--cyan-primary); font-size: 15px; font-weight: 700; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px; margin-bottom: 12px;">
                5. Protection Relay Coordination Matrix (ANSI Standards)
              </h4>
              <table style="width: 100%; border-collapse: collapse; font-family: var(--font-mono); font-size: 11px; margin-top: 10px;">
                <thead>
                  <tr style="background: #1e293b; color: var(--cyan-primary); text-align: left;">
                    <th style="padding: 8px; border: 1px solid var(--border-card);">ANSI CODE</th>
                    <th style="padding: 8px; border: 1px solid var(--border-card);">FUNCTION</th>
                    <th style="padding: 8px; border: 1px solid var(--border-card);">PICKUP SETTING</th>
                    <th style="padding: 8px; border: 1px solid var(--border-card);">CLEARING TIME</th>
                    <th style="padding: 8px; border: 1px solid var(--border-card);">PROTECTIVE ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="padding: 6px; border: 1px solid var(--border-card); color: #f59e0b;">ANSI 51</td>
                    <td style="padding: 6px; border: 1px solid var(--border-card);">AC Inverse Time Overcurrent</td>
                    <td style="padding: 6px; border: 1px solid var(--border-card);">I &gt; 520 A (1.15 &times; In)</td>
                    <td style="padding: 6px; border: 1px solid var(--border-card);">IEC Normal Inverse (TMS 0.15)</td>
                    <td style="padding: 6px; border: 1px solid var(--border-card);">Trip VCB 52-1</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px; border: 1px solid var(--border-card); color: #ef4444;">ANSI 50</td>
                    <td style="padding: 6px; border: 1px solid var(--border-card);">Instantaneous Short Circuit</td>
                    <td style="padding: 6px; border: 1px solid var(--border-card);">I &gt; 2,800 A (6.0 &times; In)</td>
                    <td style="padding: 6px; border: 1px solid var(--border-card);">&lt; 35 ms</td>
                    <td style="padding: 6px; border: 1px solid var(--border-card);">Instant Trip VCB 52-1 & Lockout</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px; border: 1px solid var(--border-card); color: #ef4444;">ANSI 59</td>
                    <td style="padding: 6px; border: 1px solid var(--border-card);">DC Bus Overvoltage</td>
                    <td style="padding: 6px; border: 1px solid var(--border-card);">V_DC &gt; 9,450 VDC</td>
                    <td style="padding: 6px; border: 1px solid var(--border-card);">&lt; 15 ms</td>
                    <td style="padding: 6px; border: 1px solid var(--border-card);">Block Inverter PWM + Trip VCB</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px; border: 1px solid var(--border-card); color: #38bdf8;">ANSI 87T</td>
                    <td style="padding: 6px; border: 1px solid var(--border-card);">XFMR Biased Differential</td>
                    <td style="padding: 6px; border: 1px solid var(--border-card);">Idiff &gt; 0.2 &times; In (Slope 30%)</td>
                    <td style="padding: 6px; border: 1px solid var(--border-card);">&lt; 25 ms</td>
                    <td style="padding: 6px; border: 1px solid var(--border-card);">High-Speed Trip MV Breaker</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- SECTION 6: Sequential Interlock Chain -->
            <div class="dossier-section">
              <h4 style="color: var(--cyan-primary); font-size: 15px; font-weight: 700; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px; margin-bottom: 12px;">
                6. Automatic Sequential Startup & Permissive Logic
              </h4>
              <p>
                The supervisory automation controller strictly enforces reverse startup interlocks to prevent material choke and thermal stress:
              </p>
              <div style="background: #070c17; border: 1px solid var(--border-card); padding: 12px; border-radius: 6px; font-family: var(--font-mono); font-size: 11px; margin-top: 8px;">
                1. <strong>ID Fan Start</strong> (Inlet Damper closed &rarr; 6.6 kV VCB closed &rarr; Damper modulates to maintain draft -2.5 mbar) &rarr;<br>
                2. <strong>Baghouse Pulse-Jet Active</strong> (Air header pressure &gt; 5.5 Bar) &rarr;<br>
                3. <strong>Hot Gas Generator / Kiln Exhaust Gas Permissive</strong> (Inlet Temp &gt; 120°C and &lt; 200°C) &rarr;<br>
                4. <strong>Dynamic Classifier Spinning</strong> (115 RPM) &rarr;<br>
                5. <strong>VRM Main Drive VFD Start</strong> (VCB 52-1 closed, DC bus nominal 8910V, acceleration ramp 45s) &rarr;<br>
                6. <strong>Hydraulic Roller Pressure Engaged</strong> (88.5 Bar) &rarr;<br>
                7. <strong>Raw Feeders Online</strong> (Cascaded feed rate 0 &rarr; 195 t/h).
              </div>
            </div>

          </div>

          <!-- Modal Footer -->
          <div class="modal-footer" style="padding: 14px 24px; background: #0f172a; border-top: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
            <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">
              DOCUMENT ID: VRM-NX-ELEC-4200KW-REV4 &bull; TAREQ ABUASHI
            </div>
            <button class="btn btn-primary" id="btn-modal-close-footer" style="padding: 8px 18px;">
              Close Dossier
            </button>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    this.modalEl = document.getElementById('engineering-dossier-modal');
  }

  private bindEvents() {
    const closeBtn = document.getElementById('btn-modal-close');
    const closeFooterBtn = document.getElementById('btn-modal-close-footer');
    const printBtn = document.getElementById('btn-modal-print');

    closeBtn?.addEventListener('click', () => this.hide());
    closeFooterBtn?.addEventListener('click', () => this.hide());
    printBtn?.addEventListener('click', () => {
      window.print();
    });

    // Close on backdrop click
    this.modalEl?.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        this.hide();
      }
    });

    // Close on ESC key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalEl?.style.display !== 'none') {
        this.hide();
      }
    });
  }

  public show() {
    if (this.modalEl) {
      this.modalEl.style.display = 'block';
    }
  }

  public hide() {
    if (this.modalEl) {
      this.modalEl.style.display = 'none';
    }
  }
}
