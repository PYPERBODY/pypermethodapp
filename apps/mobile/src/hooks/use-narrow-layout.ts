import { useWindowDimensions } from 'react-native';

import { Layout } from '@/theme/tokens';

/**
 * Mirrors the prototype's `@media(max-width:349px)` rule, which tightens the
 * Welcome screen's horizontal padding and type sizes on narrow devices.
 *
 * The Phase 2A target viewports are 390 × 844 (all primary decisions visible
 * without scrolling) and 340 × 720 (short scroll permitted).
 */
export function useNarrowLayout(): boolean {
  const { width } = useWindowDimensions();
  return width < Layout.narrowBreakpoint;
}
