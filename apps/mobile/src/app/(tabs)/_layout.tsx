import Feather from '@expo/vector-icons/Feather';
import { Redirect, Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAccess } from '@/features/access/access-context';
import { Colors, Type } from '@/theme/tokens';

/**
 * The five approved tabs: Home, Method, Track, Dose, Profile.
 *
 * These labels are fixed. Do not rename them and do not add a sixth tab.
 * Welcome, Sign In, Create Account and the purchase flow deliberately live
 * outside this navigator, in the root stack.
 *
 * Access routing (Phase 2A brief §13):
 *   • signed out            -> redirected to the public Welcome screen
 *   • preview               -> browse-only shell
 *   • trialing              -> full shell
 *   • method_digital_active -> full shell
 *   • pyper_member_active   -> full shell
 *   • expired_read_only     -> read-only shell
 *
 * Write gating itself lives in the capability model, not here, so the tab
 * structure stays identical across states.
 */
export default function TabLayout() {
  const { isSignedIn } = useAccess();
  const insets = useSafeAreaInsets();

  if (!isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.espresso,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarShowLabel: true,
        // Web needs this explicitly; the default heuristic can put the label
        // beside the icon and clip it in a compact bar.
        tabBarLabelPosition: 'below-icon',
        // .nav — --card fill, 1px --line top rule, 10pt top / 12pt bottom
        // padding plus the safe-area inset, icons 18pt, labels 11pt uppercase.
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          // Height must be explicit and must comfortably contain
          // padding + 18pt icon + 11pt label, or the navigator clips or drops
          // the label on web.
          height: 68 + insets.bottom,
          paddingTop: 8,
          paddingBottom: 8 + insets.bottom,
        },
        // .nav .lb — 11px / .03em / uppercase / 500 (700 when active).
        // `lineHeight` and an explicit height are deliberately omitted: the tab
        // bar collapses the label element when either is set.
        tabBarLabelStyle: {
          fontFamily: Type.navLabel.fontFamily,
          fontSize: Type.navLabel.fontSize,
          fontWeight: Type.navLabel.fontWeight,
          letterSpacing: Type.navLabel.letterSpacing,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          // The icon font renders as text content, so the accessible name is set
          // explicitly rather than being derived from the label plus glyph.
          tabBarAccessibilityLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={18} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="method"
        options={{
          title: 'Method',
          // The icon font renders as text content, so the accessible name is set
          // explicitly rather than being derived from the label plus glyph.
          tabBarAccessibilityLabel: 'Method',
          tabBarIcon: ({ color }) => (
            <Feather name="book-open" size={18} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: 'Track',
          // The icon font renders as text content, so the accessible name is set
          // explicitly rather than being derived from the label plus glyph.
          tabBarAccessibilityLabel: 'Track',
          tabBarIcon: ({ color }) => (
            <Feather name="activity" size={18} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dose"
        options={{
          title: 'Dose',
          // The icon font renders as text content, so the accessible name is set
          // explicitly rather than being derived from the label plus glyph.
          tabBarAccessibilityLabel: 'Dose',
          tabBarIcon: ({ color }) => (
            <Feather name="calendar" size={18} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          // The icon font renders as text content, so the accessible name is set
          // explicitly rather than being derived from the label plus glyph.
          tabBarAccessibilityLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={18} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
