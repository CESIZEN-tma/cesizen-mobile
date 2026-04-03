import { useState, useEffect, useRef } from 'react';
import { BreathingPhase, ExerciseState, ExerciseConfig } from '@/types/exercise.types';

export function useBreathingExercise(config: ExerciseConfig) {
  const [state, setState] = useState<ExerciseState>({
    isPlaying: false,
    isPaused: false,
    currentPhase: 'inhale',
    phaseTimeRemaining: config.inhalation,
    totalTimeElapsed: 0,
    cycleCount: 0,
  });

  const startTimeRef = useRef<number | null>(null);
  const phaseStartTimeRef = useRef<number | null>(null);

  const getPhaseDuration = (phase: BreathingPhase): number => {
    switch (phase) {
      case 'inhale':
        return config.inhalation;
      case 'retention1':
        return config.retention1;
      case 'exhale':
        return config.exhalation;
      case 'retention2':
        return config.retention2;
    }
  };

  const getNextPhase = (currentPhase: BreathingPhase): BreathingPhase => {
    const phases: BreathingPhase[] = ['inhale', 'retention1', 'exhale', 'retention2'];
    const currentIndex = phases.indexOf(currentPhase);
    return phases[(currentIndex + 1) % phases.length];
  };

  const getPhaseLabel = (phase: BreathingPhase): string => {
    switch (phase) {
      case 'inhale':
        return 'Inspirez';
      case 'retention1':
        return 'Retenez';
      case 'exhale':
        return 'Expirez';
      case 'retention2':
        return 'Retenez';
    }
  };

  useEffect(() => {
    if (!state.isPlaying || state.isPaused) return;

    const interval = setInterval(() => {
      const now = Date.now();

      if (!phaseStartTimeRef.current) {
        phaseStartTimeRef.current = now;
      }

      const phaseElapsed = (now - phaseStartTimeRef.current) / 1000;
      const phaseDuration = getPhaseDuration(state.currentPhase);
      const timeRemaining = Math.max(0, phaseDuration - phaseElapsed);

      if (timeRemaining <= 0) {
        const nextPhase = getNextPhase(state.currentPhase);
        const isNewCycle = state.currentPhase === 'retention2';

        phaseStartTimeRef.current = now;

        setState((prev) => ({
          ...prev,
          currentPhase: nextPhase,
          phaseTimeRemaining: getPhaseDuration(nextPhase),
          cycleCount: isNewCycle ? prev.cycleCount + 1 : prev.cycleCount,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          phaseTimeRemaining: timeRemaining,
        }));
      }

      if (startTimeRef.current) {
        const totalElapsed = (now - startTimeRef.current) / 1000;
        setState((prev) => ({
          ...prev,
          totalTimeElapsed: totalElapsed,
        }));

        const maxDuration = config.durationMinutes * 60;
        if (totalElapsed >= maxDuration) {
          stop();
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [state.isPlaying, state.isPaused, state.currentPhase, config]);

  const start = () => {
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
      phaseStartTimeRef.current = Date.now();
    }
    setState((prev) => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
    }));
  };

  const pause = () => {
    setState((prev) => ({
      ...prev,
      isPaused: true,
    }));
    phaseStartTimeRef.current = null;
  };

  const resume = () => {
    phaseStartTimeRef.current = Date.now();
    setState((prev) => ({
      ...prev,
      isPaused: false,
    }));
  };

  const stop = () => {
    setState({
      isPlaying: false,
      isPaused: false,
      currentPhase: 'inhale',
      phaseTimeRemaining: config.inhalation,
      totalTimeElapsed: 0,
      cycleCount: 0,
    });
    startTimeRef.current = null;
    phaseStartTimeRef.current = null;
  };

  const togglePlayPause = () => {
    if (!state.isPlaying) {
      start();
    } else if (state.isPaused) {
      resume();
    } else {
      pause();
    }
  };

  const progress = Math.min(
    (state.totalTimeElapsed / (config.durationMinutes * 60)) * 100,
    100
  );

  const isCompleted = progress >= 100;

  return {
    state,
    start,
    pause,
    resume,
    stop,
    togglePlayPause,
    getPhaseLabel,
    progress,
    isCompleted,
  };
}
