import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Based on iPhone 8 (375 x 667) as reference device
const REFERENCE_WIDTH = 375;
const REFERENCE_HEIGHT = 667;

/** Scales a horizontal size proportionally to the screen width. */
export const scale = (size: number): number =>
  Math.round((SCREEN_WIDTH / REFERENCE_WIDTH) * size);

/** Scales a vertical size proportionally to the screen height. */
export const verticalScale = (size: number): number =>
  Math.round((SCREEN_HEIGHT / REFERENCE_HEIGHT) * size);

/**
 * Scales a size with a moderation factor to avoid extreme values.
 * Default factor 0.3: 30% of the full scale is applied, keeping sizes
 * readable across small (iPhone SE 320px) and large (iPad 768px) screens.
 */
export const moderateScale = (size: number, factor = 0.3): number =>
  Math.round(size + (scale(size) - size) * factor);
