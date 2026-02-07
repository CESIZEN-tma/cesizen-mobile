import type { ColorPalette } from '../types/color.types';

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};


export const themes: ColorPalette = {
  light: {
    primary: '#58cc02',
    secondary: '#1cb0f6',
    background: '#ffffff',
    surface: '#f7f7f7',
    text: '#3c3c3c',
    border: '#e5e5e5',
    shadowPrimary: '#45a001',
    shadowSecondary: '#1690c7',
  },

  dark: {
    primary: '#58cc02',
    secondary: '#1cb0f6',
    background: '#1c1c1c',
    surface: '#2a2a2a',
    text: '#ffffff',
    border: '#3a3a3a',
    shadowPrimary: '#45a001',
    shadowSecondary: '#1690c7',
  }
}