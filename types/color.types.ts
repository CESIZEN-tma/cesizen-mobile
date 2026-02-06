export type ThemeMode = 'light' | 'dark'
export type ColorKey = string;
export type ColorVar = string;



export type ColorPalette = {
    [key in ThemeMode]: Record<ColorKey, ColorVar>
}


// Exemple of a color palette
// export const themes: ColorPalette = {
//   light: {
//     primary: '#f87171',
//     secondary: '#4ade80',
//     background: '#0f172a',
//     surface: '#1e293b',
//     text: '#f8fafc',
//     border: '#334155',
//   },

//   dark: {
//     primary: '#f87171',
//     secondary: '#4ade80',
//     background: '#0f172a',
//     surface: '#1e293b',
//     text: '#f8fafc',
//     border: '#334155',
//   }
// }
