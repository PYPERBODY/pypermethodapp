import type { ColorValue } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

/**
 * The approved five-tab glyphs, reproduced exactly from the frozen prototype.
 *
 * Source: `.migration-source/ThePyperMethod_v2.jsx`
 *   - `Ic` (line 2046): 17x17, viewBox 0 0 24 24, fill none, stroke
 *     currentColor, strokeWidth 1.8, round caps and joins.
 *   - `ICONS` (lines 2049–2055): the path data below, copied verbatim.
 *
 * These are not substitutes — the path data is the prototype's own. Do not
 * swap them for an icon library.
 */

export type TabIconName = 'home' | 'method' | 'track' | 'dose' | 'profile';

export interface TabIconProps {
  name: TabIconName;
  color: ColorValue;
  /** `.nav .mk` sizes the container to 18; the glyph itself is 17. */
  size?: number;
}

export function TabIcon({ name, color, size = 17 }: TabIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color as string}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {GLYPHS[name]}
    </Svg>
  );
}

const GLYPHS = {
  // home: <path d="M4 11l8-7 8 7" /><path d="M6 10v10h12V10" />
  home: (
    <>
      <Path d="M4 11l8-7 8 7" />
      <Path d="M6 10v10h12V10" />
    </>
  ),
  // method: <circle cx="12" cy="12" r="8.5" /><path d="M12 3.5v17M3.5 12h17" />
  method: (
    <>
      <Circle cx={12} cy={12} r={8.5} />
      <Path d="M12 3.5v17M3.5 12h17" />
    </>
  ),
  // track: <path d="M4 19V9M10 19V5M16 19v-8M22 19H2" />
  track: <Path d="M4 19V9M10 19V5M16 19v-8M22 19H2" />,
  // dose: <rect x="8.5" y="7.5" width="7" height="12.5" rx="2.4" />
  //       <path d="M10 7.5V4.5h4v3M8.5 12h7M8.5 16h7" />
  dose: (
    <>
      <Rect x={8.5} y={7.5} width={7} height={12.5} rx={2.4} />
      <Path d="M10 7.5V4.5h4v3M8.5 12h7M8.5 16h7" />
    </>
  ),
  // profile: <circle cx="12" cy="8.5" r="3.5" />
  //          <path d="M5 20c1.4-3.4 4-5 7-5s5.6 1.6 7 5" />
  profile: (
    <>
      <Circle cx={12} cy={8.5} r={3.5} />
      <Path d="M5 20c1.4-3.4 4-5 7-5s5.6 1.6 7 5" />
    </>
  ),
};
