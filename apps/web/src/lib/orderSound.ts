/**
 * Web Audio API Engine for Customer Order Sounds & Chimes
 * Zero external audio file dependencies — synthesizes rich harmonic acoustic chimes
 * directly in the browser with 0ms latency and automatic user gesture unlocking.
 */

class OrderSoundEngine {
  private audioCtx: AudioContext | null = null;
  private isUnlocked: boolean = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.audioCtx) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

  public unlock(): void {
    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => {
        this.isUnlocked = true;
      }).catch(() => {});
    } else if (ctx) {
      this.isUnlocked = true;
    }
  }

  /**
   * Warm, subtle tactile chime when the user taps "Place Order"
   * Frequency: 523.25 Hz (C5) soft bell pluck
   */
  public playInitiateChime(): void {
    this.unlock();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Audio playback fails silently if browser blocks
    }
  }

  /**
   * Triumphant, celebratory 4-tone harmonic arrival chime
   * Frequencies: C5 (523.25) -> E5 (659.25) -> G5 (783.99) -> C6 (1046.50)
   * With warm overtone resonance and gentle acoustic bell decay (~1.2s duration)
   */
  public playSuccessChime(): void {
    this.unlock();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      const playTone = (
        freq: number,
        startAt: number,
        duration: number,
        gainPeak: number,
        isPeak: boolean = false
      ) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Fundamental tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startAt);

        // Warm harmonic overtone (adds rich acoustic sparkle)
        const overtone = ctx.createOscillator();
        const overtoneGain = ctx.createGain();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 2, startAt);

        // Amplitude envelope
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.linearRampToValueAtTime(gainPeak, startAt + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

        overtoneGain.gain.setValueAtTime(0.0001, startAt);
        overtoneGain.gain.linearRampToValueAtTime(gainPeak * 0.35, startAt + 0.025);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration * 0.65);

        osc.connect(gain);
        overtone.connect(overtoneGain);
        gain.connect(ctx.destination);
        overtoneGain.connect(ctx.destination);

        osc.start(startAt);
        overtone.start(startAt);
        osc.stop(startAt + duration + 0.05);
        overtone.stop(startAt + duration + 0.05);

        // Extra sparkling chime bell on the peak note
        if (isPeak) {
          const sparkle = ctx.createOscillator();
          const sparkleGain = ctx.createGain();
          sparkle.type = 'sine';
          sparkle.frequency.setValueAtTime(freq * 3, startAt);
          sparkleGain.gain.setValueAtTime(0.0001, startAt);
          sparkleGain.gain.linearRampToValueAtTime(0.08, startAt + 0.02);
          sparkleGain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration * 0.45);
          sparkle.connect(sparkleGain);
          sparkleGain.connect(ctx.destination);
          sparkle.start(startAt);
          sparkle.stop(startAt + duration + 0.05);
        }
      };

      // Note 1: 523.25 Hz (C5) - Clean chime start
      playTone(523.25, now, 0.45, 0.26);

      // Note 2: 659.25 Hz (E5) - Uplifting harmonic progression
      playTone(659.25, now + 0.12, 0.55, 0.30);

      // Note 3: 783.99 Hz (G5) - High energy resonance
      playTone(783.99, now + 0.24, 0.65, 0.34);

      // Note 4: 1046.50 Hz (C6) - Triumphant peak with sustained sparkling decay
      playTone(1046.50, now + 0.38, 0.95, 0.42, true);
    } catch {
      // Audio playback fails silently if browser blocks
    }
  }
}

export const orderSoundEngine = new OrderSoundEngine();

export function playOrderInitiateSound(): void {
  orderSoundEngine.playInitiateChime();
}

export function playOrderSuccessChime(): void {
  orderSoundEngine.playSuccessChime();
}
