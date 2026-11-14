/**
 * VRM-NEXUS: AI Predictive Maintenance & Vibration Canvas Component
 * Real-time 60fps HTML5 Canvas with FFT Spectrum & Planetary Gearbox Diagnostics
 * 
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي
 * Tareq Abuashi — Lead Electrical & Automation Systems Engineer
 */

import { VrmTelemetry, AiPredictiveTelemetry } from '../types/scada';

export class VibrationCanvas {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animFrameId: number | null = null;
  private waveHistory: number[] = [];
  private currentVibration: number = 2.35;
  private isRumble: boolean = false;
  private timeStep: number = 0;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container #${containerId} not found`);
    this.container = el;
    this.renderInitialStructure();
    this.initCanvas();
    this.startAnimation();
  }

  private renderInitialStructure() {
    this.container.innerHTML = `
      <div class="panel-header">
        <div class="panel-title-group">
          <span class="badge-tag tag-purple">AI PREDICTIVE MAINTENANCE</span>
          <h4 class="panel-title">Planetary Gearbox FFT Vibration Spectrum & Roller Tire Wear</h4>
        </div>
        <div class="header-badges">
          <span class="status-pill status-running" id="ai-health-pill">HEALTH: 98.4% (ZONE A)</span>
        </div>
      </div>

      <!-- AI Real-Time Diagnostic Banner -->
      <div class="ai-banner" id="ai-diagnostic-strip" style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 6px; padding: 8px 12px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-brain text-purple"></i>
          <span style="font-size: 11px; font-weight: 700; color: #e9d5ff;" id="ai-status-msg">
            AI Diagnostic: Autoencoder healthy - All Harmonics Nominal (ISO 10816 Zone A)
          </span>
        </div>
        <div class="font-mono text-purple" style="font-size: 11px;" id="ai-rul-text">
          ESTIMATED RUL: >1,450 HOURS
        </div>
      </div>

      <!-- 60fps HTML5 Canvas Viewport -->
      <div style="position: relative; width: 100%; height: 220px; background: #070b14; border-radius: 6px; overflow: hidden; border: 1px solid var(--border-subtle);">
        <canvas id="vibe-realtime-canvas" width="800" height="220" style="width: 100%; height: 100%; display: block;"></canvas>
      </div>

      <!-- Roller Tire Wear Bars -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 10px;">
        ${[1, 2, 3, 4].map(i => `
          <div class="digital-readout-card" style="padding: 6px 10px;">
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--text-muted);">
              <span>Roller #${i} Tire Wear</span>
              <span class="font-mono text-cyan" id="wear-val-${i}">14%</span>
            </div>
            <div class="readout-bar" style="margin-top: 4px;">
              <div class="readout-bar-fill" id="wear-bar-${i}" style="width: 14%; background: #0284c7;"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private initCanvas() {
    this.canvas = document.getElementById('vibe-realtime-canvas') as HTMLCanvasElement;
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      // Set high dpi resolution if needed
      this.canvas.width = this.canvas.parentElement?.clientWidth || 800;
      this.canvas.height = 220;
    }

    // Initialize waveform history
    this.waveHistory = new Array(80).fill(2.35);
  }

  public update(vrm: VrmTelemetry, ai: AiPredictiveTelemetry) {
    this.currentVibration = vrm.vibrationRms;
    this.isRumble = vrm.status === 'RUMBLE';

    // Update AI pill & text
    const pill = document.getElementById('ai-health-pill');
    if (pill) {
      if (ai.anomalyDetected || this.isRumble) {
        pill.className = 'status-pill status-tripped';
        pill.textContent = `CRITICAL: ${ai.healthScore.toFixed(1)}% (ZONE D)`;
      } else {
        pill.className = 'status-pill status-running';
        pill.textContent = `HEALTH: ${ai.healthScore.toFixed(1)}% (ZONE A)`;
      }
    }

    const msg = document.getElementById('ai-status-msg');
    if (msg) {
      msg.textContent = ai.anomalyMessage;
      if (ai.anomalyDetected || this.isRumble) {
        msg.style.color = '#ef4444';
      } else {
        msg.style.color = '#e9d5ff';
      }
    }

    const rulEl = document.getElementById('ai-rul-text');
    if (rulEl) {
      rulEl.textContent = `ESTIMATED RUL: ${Math.round(ai.rulHours)} HOURS`;
    }

    // Update roller wear bars
    vrm.rollerWear.forEach((wear, idx) => {
      const valEl = document.getElementById(`wear-val-${idx + 1}`);
      const barEl = document.getElementById(`wear-bar-${idx + 1}`);
      if (valEl) valEl.textContent = `${wear.toFixed(1)}%`;
      if (barEl) {
        barEl.style.width = `${wear}%`;
        if (wear > 40) barEl.style.background = '#ef4444';
        else if (wear > 25) barEl.style.background = '#f59e0b';
        else barEl.style.background = '#0284c7';
      }
    });
  }

  private startAnimation() {
    const render = () => {
      if (this.ctx && this.canvas) {
        this.renderFrame();
      }
      this.animFrameId = requestAnimationFrame(render);
    };
    this.animFrameId = requestAnimationFrame(render);
  }

  private renderFrame() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    this.timeStep += 0.05;

    // Background clear
    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, w, h);

    // Subtle grid
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 1;
    for (let x = 40; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 30; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Split Canvas into two views:
    // Left side (0 to w * 0.55): FFT Frequency Spectrum (0 to 600 Hz)
    // Right side (w * 0.55 to w): Live Time-Domain Waveform Oscilloscope

    const fftWidth = w * 0.55;
    const waveWidth = w * 0.45;

    // 1. FFT SPECTRUM RENDER
    ctx.font = '10px "JetBrains Mono", Consolas, monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('FFT SPECTRUM (0 - 600 Hz) - GEAR MESH & ROLLER PASS', 15, 18);

    // Draw ISO 10816 Zone Threshold lines
    // Zone A: < 2.8 mm/s, Zone B: 2.8-4.5, Zone C: 4.5-7.1, Zone D: > 7.1 mm/s
    const yBaseline = h - 25;
    const scaleFactor = 9.0; // px per mm/s

    // Alert threshold (4.5 mm/s)
    const yAlert = yBaseline - 4.5 * scaleFactor;
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(15, yAlert);
    ctx.lineTo(fftWidth - 15, yAlert);
    ctx.stroke();
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('ISO ALARM: 4.5 mm/s', fftWidth - 130, yAlert - 3);

    // Trip threshold (7.1 mm/s)
    const yTrip = yBaseline - 7.1 * scaleFactor;
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.beginPath();
    ctx.moveTo(15, yTrip);
    ctx.lineTo(fftWidth - 15, yTrip);
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.fillText('ISO TRIP: 7.1 mm/s', fftWidth - 120, yTrip - 3);
    ctx.setLineDash([]);

    // Draw FFT Bars
    const numBars = 36;
    const barW = (fftWidth - 40) / numBars;

    for (let i = 0; i < numBars; i++) {
      const freq = Math.round((i / numBars) * 600);
      let amp = 0.4 + Math.sin(this.timeStep * 2 + i) * 0.2;

      // Peak 1: Table rotation 1X (~28 Hz)
      if (Math.abs(freq - 28) < 18) {
        amp += 1.2 + Math.sin(this.timeStep) * 0.3;
      }

      // Peak 2: Gear Mesh Frequency (312 Hz)
      if (Math.abs(freq - 312) < 20) {
        if (this.isRumble) {
          amp = this.currentVibration; // Surges to 12-14 mm/s!
        } else {
          amp = 1.1 + Math.sin(this.timeStep * 3) * 0.2;
        }
      }

      const barH = Math.min(yBaseline - 25, amp * scaleFactor);
      const bx = 20 + i * barW;
      const by = yBaseline - barH;

      if (Math.abs(freq - 312) < 20) {
        // Highlight 312 Hz
        ctx.fillStyle = this.isRumble ? '#ef4444' : '#a855f7';
        ctx.fillRect(bx, by, barW - 2, barH);
        ctx.fillStyle = this.isRumble ? '#fecaca' : '#d8b4fe';
        ctx.fillText('312Hz', bx - 6, by - 6);
      } else {
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(bx, by, barW - 2, barH);
      }
    }

    // 2. OSCILLOSCOPE WAVEFORM RENDER (Right Side)
    const waveXStart = fftWidth + 10;
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`GEARBOX RMS: ${this.currentVibration.toFixed(2)} mm/s`, waveXStart + 10, 18);

    // Divider line
    ctx.strokeStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(fftWidth, 10);
    ctx.lineTo(fftWidth, h - 10);
    ctx.stroke();

    // Waveform line
    ctx.strokeStyle = this.isRumble ? '#ef4444' : '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const waveMidY = h / 2 + 10;
    const waveAmpScale = this.isRumble ? 32 : 12;

    for (let i = 0; i < waveWidth - 20; i++) {
      const t = this.timeStep * 4 + i * 0.08;
      // Synthesized vibration waveform: 1X + 312Hz gear mesh + random rumble noise
      let yOffset = Math.sin(t) * 0.4 + Math.sin(t * 4.2) * 0.6;
      if (this.isRumble) {
        yOffset += (Math.random() - 0.5) * 1.8;
      }
      const y = waveMidY + yOffset * waveAmpScale;
      const x = waveXStart + i;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  public destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }
}
