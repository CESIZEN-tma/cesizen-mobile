export type BreathingPhase = 'inhale' | 'retention1' | 'exhale' | 'retention2';

export interface ExerciseState {
  isPlaying: boolean;
  isPaused: boolean;
  currentPhase: BreathingPhase;
  phaseTimeRemaining: number;
  totalTimeElapsed: number;
  cycleCount: number;
}

export interface ExerciseConfig {
  inhalation: number;
  retention1: number;
  exhalation: number;
  retention2: number;
  durationMinutes: number;
}

export interface ExerciseStats {
  cyclesCompleted: number;
  totalDuration: number;
  completionPercentage: number;
}
