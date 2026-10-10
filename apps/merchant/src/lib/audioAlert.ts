/**
 * Web Audio API Engine for Instant Audible Order Alerts
 * Generates a clean, pleasant harmonic 2-tone chime without external audio file dependencies.
 */

class OrderAudioAlertEngine {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('merchant_audio_alerts_muted');
      this.isMuted = saved === 'true';
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('merchant_audio_alerts_muted', String(muted));
    }
  }

  public toggleMuted(): boolean {
    const next = !this.isMuted;
    this.setMuted(next);
    return next;
  }

  /**
   * Plays a distinct, melodic 2-tone arrival chime (D5 ➔ A5) with warm harmonic decay.
   * Total duration: ~0.65s.
   */
  public playChime(): void {
    if (this.isMuted) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Note 1: 587.33 Hz (D5) - Bell Fundamental
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);

      // Add soft overtone at 2x frequency
      const overtone1 = ctx.createOscillator();
      const overtoneGain1 = ctx.createGain();
      overtone1.type = 'triangle';
      overtone1.frequency.setValueAtTime(587.33 * 2, now);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.28, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      overtoneGain1.gain.setValueAtTime(0.001, now);
      overtoneGain1.gain.linearRampToValueAtTime(0.08, now + 0.02);
      overtoneGain1.gain.exponentialRampToValueAtTime(0.001, now + 0.30);

      osc1.connect(gain1);
      overtone1.connect(overtoneGain1);
      gain1.connect(ctx.destination);
      overtoneGain1.connect(ctx.destination);

      osc1.start(now);
      overtone1.start(now);
      osc1.stop(now + 0.40);
      overtone1.stop(now + 0.32);

      // Note 2: 880.00 Hz (A5) - Arrives at +0.13s (higher, triumphant pitch)
      const t2 = now + 0.13;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.00, t2);

      const overtone2 = ctx.createOscillator();
      const overtoneGain2 = ctx.createGain();
      overtone2.type = 'triangle';
      overtone2.frequency.setValueAtTime(880.00 * 2, t2);

      gain2.gain.setValueAtTime(0.001, t2);
      gain2.gain.linearRampToValueAtTime(0.32, t2 + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.50);

      overtoneGain2.gain.setValueAtTime(0.001, t2);
      overtoneGain2.gain.linearRampToValueAtTime(0.09, t2 + 0.02);
      overtoneGain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.40);

      osc2.connect(gain2);
      overtone2.connect(overtoneGain2);
      gain2.connect(ctx.destination);
      overtoneGain2.connect(ctx.destination);

      osc2.start(t2);
      overtone2.start(t2);
      osc2.stop(t2 + 0.52);
      overtone2.stop(t2 + 0.42);
    } catch {
      // AudioContext play prevented by browser policy; fail gracefully
    }
  }
}

export const audioAlertEngine = new OrderAudioAlertEngine();

export function playOrderAlertChime(): void {
  audioAlertEngine.playChime();
}

export function isAudioAlertMuted(): boolean {
  return audioAlertEngine.getMuted();
}

export function setAudioAlertMuted(muted: boolean): void {
  audioAlertEngine.setMuted(muted);
}

export function toggleAudioAlertMuted(): boolean {
  return audioAlertEngine.toggleMuted();
}
