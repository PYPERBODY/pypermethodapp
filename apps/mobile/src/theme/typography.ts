import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
  HankenGrotesk_800ExtraBold,
  HankenGrotesk_900Black,
} from '@expo-google-fonts/hanken-grotesk';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';

/**
 * Approved brand typography.
 *
 * The frozen prototype (`.migration-source/ThePyperMethod_v2.jsx`, lines 16–19)
 * declares three families:
 *
 *   --font-display  Hanken Grotesk   editorial headings and the wordmark
 *   --font-ui       Hanken Grotesk   body copy, labels, buttons, tab labels
 *   --font-mono     JetBrains Mono   structural micro-labels, eyebrows, tags
 *   --font-accent   Fraunces         italic accents
 *
 * Hanken Grotesk and JetBrains Mono are loaded here because every Phase 2A
 * screen uses them. Fraunces is NOT loaded: it appears only in the greeting,
 * chapter subtitles and legal bullets, none of which are migrated in Phase 2A.
 * It must be added when those screens arrive.
 *
 * React Native does not synthesise weights for custom families — each weight is
 * a separate font file and must be selected by family name. `ui()` and `mono()`
 * do that mapping; `fontWeight` is still set alongside so web renders correctly.
 */
export const FONT_ASSETS = {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
  HankenGrotesk_800ExtraBold,
  HankenGrotesk_900Black,
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} as const;

export type UiWeight = 400 | 500 | 600 | 700 | 800 | 900;
export type MonoWeight = 400 | 500 | 700;

const UI_FAMILIES: Record<UiWeight, string> = {
  400: 'HankenGrotesk_400Regular',
  500: 'HankenGrotesk_500Medium',
  600: 'HankenGrotesk_600SemiBold',
  700: 'HankenGrotesk_700Bold',
  800: 'HankenGrotesk_800ExtraBold',
  900: 'HankenGrotesk_900Black',
};

const MONO_FAMILIES: Record<MonoWeight, string> = {
  400: 'JetBrainsMono_400Regular',
  500: 'JetBrainsMono_500Medium',
  700: 'JetBrainsMono_700Bold',
};

/** Hanken Grotesk at the given weight (`--font-display` / `--font-ui`). */
export function ui(weight: UiWeight): string {
  return UI_FAMILIES[weight];
}

/** JetBrains Mono at the given weight (`--font-mono`). */
export function mono(weight: MonoWeight): string {
  return MONO_FAMILIES[weight];
}
