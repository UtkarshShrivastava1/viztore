/**
 * Web Audio API Engine for Instant Audible Order Alerts
 * Generates a clean, pleasant harmonic 3-tone chime with automatic user-gesture unlocking
 * and zero external audio file dependencies.
 */

class OrderAudioAlertEngine {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isUnlocked: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('merchant_audio_alerts_muted');
      this.isMuted = saved === 'true';
      this.setupGlobalUnlock();
    }
  }

  private setupGlobalUnlock(): void {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      try {
        const ctx = this.getAudioContext();
        if (ctx && ctx.state === 'suspended') {
          ctx.resume().then(() => {
            this.isUnlocked = true;
          }).catch(() => {});
        } else if (ctx && ctx.state === 'running') {
          this.isUnlocked = true;
        }
      } catch {}

      // Remove listeners once initial user interaction has been detected
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('pointerdown', unlock);
    };

    window.addEventListener('click', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('pointerdown', unlock, { passive: true });
  }

  public unlockNow(): void {
    try {
      const ctx = this.getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().then(() => {
          this.isUnlocked = true;
        }).catch(() => {});
      } else if (ctx) {
        this.isUnlocked = true;
      }
    } catch {}
  }

  public isReady(): boolean {
    return this.isUnlocked || (this.audioCtx?.state === 'running');
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
   * Plays a distinct, triumphant 3-tone harmonic arrival chime (D5 ➔ F#5 ➔ A5) with warm acoustic bell decay.
   * Total duration: ~0.8s.
   */
  public playChime(): void {
    if (this.isMuted) return;

    this.unlockNow();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Helper to synthesize a melodic bell note with fundamental + warm overtone
      const playBellNote = (freq: number, startAt: number, duration: number, gainPeak: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startAt);

        const overtone = ctx.createOscillator();
        const overtoneGain = ctx.createGain();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 2, startAt);

        // Envelope
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.linearRampToValueAtTime(gainPeak, startAt + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

        overtoneGain.gain.setValueAtTime(0.0001, startAt);
        overtoneGain.gain.linearRampToValueAtTime(gainPeak * 0.28, startAt + 0.02);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration * 0.7);

        osc.connect(gain);
        overtone.connect(overtoneGain);
        gain.connect(ctx.destination);
        overtoneGain.connect(ctx.destination);

        osc.start(startAt);
        overtone.start(startAt);
        osc.stop(startAt + duration + 0.05);
        overtone.stop(startAt + duration + 0.05);
      };

      // Note 1: 587.33 Hz (D5) - Warm alert intro
      playBellNote(587.33, now, 0.40, 0.28);

      // Note 2: 739.99 Hz (F#5) - Major harmonic step
      playBellNote(739.99, now + 0.12, 0.45, 0.32);

      // Note 3: 880.00 Hz (A5) - Triumphant peak bell
      playBellNote(880.00, now + 0.26, 0.55, 0.38);
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

export function unlockAudioAlert(): void {
  audioAlertEngine.unlockNow();
}

export function isAudioAlertReady(): boolean {
  return audioAlertEngine.isReady();
}
