/**
 * VRM-NEXUS: Industrial SCADA Audio Synthesizer
 * Web Audio API Industrial Sound Generator
 * 
 * Lead Electrical & Automation Systems Engineer: أ. طارق ابوعشي
 * Tareq Abuashi — Lead Electrical & Automation Systems Engineer
 */

export class ScadaAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private alarmTimer: number | null = null;
  private isAlarmRunning: boolean = false;
  private rumbleOsc: OscillatorNode | null = null;
  private rumbleGain: GainNode | null = null;

  constructor() {
    // AudioContext will be lazily initialized on user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAlarm();
      this.stopRumble();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Continuous SCADA Master Trip Alarm Siren
   */
  public startTripAlarm() {
    if (this.isMuted || this.isAlarmRunning) return;
    this.initContext();
    if (!this.ctx) return;

    this.isAlarmRunning = true;
    let step = 0;

    const playPulse = () => {
      if (!this.isAlarmRunning || this.isMuted || !this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      // Dual-tone frequency sweep: 1050Hz -> 700Hz
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(step % 2 === 0 ? 1050 : 850, now);
      osc.frequency.exponentialRampToValueAtTime(step % 2 === 0 ? 700 : 550, now + 0.35);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      // Lowpass filter for industrial acoustic dampening
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);

      step++;
      this.alarmTimer = window.setTimeout(playPulse, 420);
    };

    playPulse();
  }

  public stopAlarm() {
    this.isAlarmRunning = false;
    if (this.alarmTimer !== null) {
      clearTimeout(this.alarmTimer);
      this.alarmTimer = null;
    }
  }

  /**
   * Heavy Vacuum Circuit Breaker (VCB) Mechanical Thump
   */
  public playBreakerOperation(isClose: boolean) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Low frequency mechanical spring impact
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(isClose ? 95 : 120, now);
    subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.15);

    subGain.gain.setValueAtTime(0.35, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.2);

    // Mechanical contact snap (white noise burst)
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1400, now);
    bandpass.Q.setValueAtTime(3, now);

    noise.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now + 0.01);
  }

  /**
   * Baghouse Pulse-Jet Solenoid Compressed Air Blast (Pneumatic Jet)
   */
  public playPulseJet() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 0.22;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // High pressure hiss with rapid decay
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(850, now);
    filter.Q.setValueAtTime(1.8, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  /**
   * Mill Rumble Sound (Low frequency vibration drone)
   */
  public startRumble() {
    if (this.isMuted || this.rumbleOsc) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    this.rumbleOsc = this.ctx.createOscillator();
    this.rumbleGain = this.ctx.createGain();

    this.rumbleOsc.type = 'sawtooth';
    this.rumbleOsc.frequency.setValueAtTime(38, now);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, now);

    this.rumbleGain.gain.setValueAtTime(0.01, now);
    this.rumbleGain.gain.linearRampToValueAtTime(0.2, now + 0.5);

    this.rumbleOsc.connect(filter);
    filter.connect(this.rumbleGain);
    this.rumbleGain.connect(this.ctx.destination);

    this.rumbleOsc.start(now);
  }

  public stopRumble() {
    if (this.rumbleOsc && this.rumbleGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.rumbleGain.gain.linearRampToValueAtTime(0.001, now + 0.3);
      setTimeout(() => {
        if (this.rumbleOsc) {
          try { this.rumbleOsc.stop(); } catch {}
          this.rumbleOsc.disconnect();
          this.rumbleOsc = null;
          this.rumbleGain = null;
        }
      }, 350);
    }
  }

  /**
   * Warning Beep for Sub-critical events (Interlock warning / Sway)
   */
  public playWarningChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1174, now + 0.12);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  /**
   * Tactile Button Click
   */
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }
}

export const scadaAudio = new ScadaAudioEngine();
