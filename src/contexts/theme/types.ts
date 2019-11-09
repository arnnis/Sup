import getStaticColors from './static-colors';
import * as themes from './themes';

export type ThemeKey = keyof typeof themes;

export interface ThemePair {
  id: ThemeKey;
  color?: string;
}

export type StaticThemeColors = ReturnType<typeof getStaticColors>;

export interface ThemeColors extends StaticThemeColors {
  primaryBackgroundColor: string;
  primaryForegroundColor: string;

  backgroundColor: string;
  backgroundColorDarker1: string;
  backgroundColorDarker2: string;
  backgroundColorDarker3: string;
  backgroundColorDarker4: string;
  backgroundColorDarker5: string;
  backgroundColorLess1: string;
  backgroundColorLess2: string;
  backgroundColorLess3: string;
  backgroundColorLess4: string;
  backgroundColorLess5: string;
  backgroundColorLighther1: string;
  backgroundColorLighther2: string;
  backgroundColorLighther3: string;
  backgroundColorLighther4: string;
  backgroundColorLighther5: string;
  backgroundColorMore1: string;
  backgroundColorMore2: string;
  backgroundColorMore3: string;
  backgroundColorMore4: string;
  backgroundColorMore5: string;
  backgroundColorTransparent05: string;
  backgroundColorTransparent10: string;

  foregroundColor: string;
  foregroundColorMuted10: string;
  foregroundColorMuted25: string;
  foregroundColorMuted40: string;
  foregroundColorMuted65: string;
  foregroundColorTransparent05: string;
  foregroundColorTransparent10: string;
}

export interface Theme extends ThemeColors {
  id: ThemeKey;
  displayName: string;
  isDark: boolean;
}
